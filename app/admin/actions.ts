'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin'
import {
  CATEGORIES,
  PRODUCT_BUCKET,
  parsePriceToPaise,
  type Category,
} from '@/lib/products'

export type AdminState = {
  error?: string
  success?: string
  values?: Record<string, string>
} | null

const ROLES = ['customer', 'artisan', 'admin'] as const
type Role = (typeof ROLES)[number]

/**
 * Har action apne shuru mein requireAdmin() bulata hai.
 *
 * Page pe guard hona kaafi nahi hai: server action ka apna endpoint
 * hota hai, aur uspe request bina aapka UI khole bhi bheji ja sakti
 * hai. Page ka check ye tay karta hai ki kya dikhega; ye check tay
 * karta hai ki kya ho sakta hai.
 */

/** "Darri Geometric — Handloom" -> "darri-geometric-handloom" */
function slugify(value: string): string {
  return value
    .toLowerCase()
    // ® aur — jaise characters ko todkar unka base letter nikalta hai,
    // taaki wo neeche wale filter mein chup-chaap gayab ho jayein.
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Sirf hamare bucket ke andar ka path — public/ wale seeded paths nahi. */
function isStoragePath(path: string): boolean {
  return Boolean(path) && !path.startsWith('/') && !path.startsWith('http')
}

// ────────────────────────────────────────────────
//  PRODUCT — banana aur badalna
// ────────────────────────────────────────────────
export async function saveProduct(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin()
  const supabase = await createClient()

  const id = String(formData.get('id') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()
  const category = String(formData.get('category') ?? '') as Category
  const description = String(formData.get('description') ?? '').trim()
  const priceRaw = String(formData.get('price') ?? '').trim()
  const unit = String(formData.get('unit') ?? '').trim()
  const icon = String(formData.get('icon') ?? '').trim()
  const sortRaw = String(formData.get('sort_order') ?? '0').trim()
  const isPublished = formData.get('is_published') === 'on'

  const values = {
    name,
    category,
    description,
    price: priceRaw,
    unit,
    icon,
    sort_order: sortRaw,
  }

  if (!name) return { error: 'Product ka naam zaroori hai.', values }
  if (!CATEGORIES.includes(category)) {
    return { error: 'Category chuniye.', values }
  }

  const priceInPaise = parsePriceToPaise(priceRaw)
  if (priceInPaise === null) {
    return {
      error: 'Price sahi nahi hai. Sirf number likhiye, jaise 3999 ya 3999.50',
      values,
    }
  }

  const sortOrder = Number(sortRaw)
  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    return { error: 'Order ek poora number hona chahiye (0 ya usse zyada).', values }
  }

  const row = {
    category,
    name,
    description,
    price_in_paise: priceInPaise,
    unit,
    icon,
    is_published: isPublished,
    sort_order: sortOrder,
  }

  if (id) {
    const { error } = await supabase.from('products').update(row).eq('id', id)
    if (error) return { error: error.message, values }

    revalidatePath('/')
    revalidatePath('/admin/products')
    return { success: 'Save ho gaya.' }
  }

  // Naya product. Slug naam se banta hai; ek hi naam ke do product
  // banane pe pehla try takrayega, isliye dusri baar chhota suffix
  // laga kar dobara.
  let slug = slugify(name) || 'product'
  let created = await supabase
    .from('products')
    .insert({ ...row, slug })
    .select('id')
    .single()

  if (created.error?.code === '23505') {
    slug = `${slug}-${Math.random().toString(36).slice(2, 7)}`
    created = await supabase
      .from('products')
      .insert({ ...row, slug })
      .select('id')
      .single()
  }

  if (created.error) return { error: created.error.message, values }

  revalidatePath('/')
  revalidatePath('/admin/products')

  // Photos product ban jaane ke baad hi lag sakti hain — unhe product
  // ki id chahiye. Isliye seedha edit page pe bhej rahe hain, jahan
  // upload box hai.
  redirect(`/admin/products/${created.data.id}?created=1`)
}

// ────────────────────────────────────────────────
//  PRODUCT — mitana
// ────────────────────────────────────────────────
export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const id = String(formData.get('id') ?? '').trim()
  if (!id) return

  // Rows to cascade se apne aap chali jayengi, par Storage ki files
  // nahi. Unke paths pehle nikal lo, warna delete ke baad pata hi
  // nahi chalega ki kaun si files anaath ho gayin.
  const { data: images } = await supabase
    .from('product_images')
    .select('path')
    .eq('product_id', id)

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)

  const paths = (images ?? []).map((i) => i.path).filter(isStoragePath)
  if (paths.length > 0) {
    await supabase.storage.from(PRODUCT_BUCKET).remove(paths)
  }

  revalidatePath('/')
  revalidatePath('/admin/products')
  redirect('/admin/products?deleted=1')
}

// ────────────────────────────────────────────────
//  PHOTOS
//
//  Files browser se seedha Supabase Storage pe jati hain (dekho
//  app/admin/products/photo-uploader.tsx). Ye action sirf unke paths
//  DB mein likhta hai.
//
//  Aisa isliye: Next.js server action ki body limit 1MB hai, aur
//  photos usse aaram se badi hoti hain. Files ko Next.js ke through
//  bhejne ka matlab hota limit badhana, nginx ki limit bhi badhana,
//  aur har photo ko do baar network pe bhejna.
// ────────────────────────────────────────────────
export async function attachImages(formData: FormData): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const productId = String(formData.get('product_id') ?? '').trim()
  const paths = formData.getAll('paths').map((p) => String(p)).filter(Boolean)
  const alt = String(formData.get('alt') ?? '').trim()

  if (!productId || paths.length === 0) return

  // Naye photos akhir mein lagte hain, taaki jo abhi main photo hai
  // wo main hi rahe. Upload karte hi shop ka card badal jana ek
  // anchaha surprise hota hai.
  const { data: last } = await supabase
    .from('product_images')
    .select('sort_order')
    .eq('product_id', productId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const start = (last?.sort_order ?? -1) + 1

  const { error } = await supabase.from('product_images').insert(
    paths.map((path, i) => ({
      product_id: productId,
      path,
      alt,
      sort_order: start + i,
    }))
  )

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath(`/admin/products/${productId}`)
}

export async function deleteImage(formData: FormData): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const imageId = String(formData.get('image_id') ?? '').trim()
  const productId = String(formData.get('product_id') ?? '').trim()
  if (!imageId) return

  const { data: image } = await supabase
    .from('product_images')
    .select('path')
    .eq('id', imageId)
    .maybeSingle()

  const { error } = await supabase.from('product_images').delete().eq('id', imageId)
  if (error) throw new Error(error.message)

  // Seeded products ki photos repo ki public/ folder mein hain, bucket
  // mein nahi. Unke liye Storage ko chhedna hi nahi hai.
  if (image && isStoragePath(image.path)) {
    await supabase.storage.from(PRODUCT_BUCKET).remove([image.path])
  }

  revalidatePath('/')
  revalidatePath(`/admin/products/${productId}`)
}

/** Chuni hui photo ko sabse aage le aata hai — wahi shop pe dikhegi. */
export async function makePrimaryImage(formData: FormData): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const imageId = String(formData.get('image_id') ?? '').trim()
  const productId = String(formData.get('product_id') ?? '').trim()
  if (!imageId || !productId) return

  const { data: images } = await supabase
    .from('product_images')
    .select('id')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (!images) return

  // Poori list dobara 0..n-1 mein likhi jati hai, sirf chuni hui ko
  // -1 dene ke bajaye. Warna baar-baar "make main" dabane se numbers
  // -1, -2, -3 hote chale jate, aur order ka matlab dhundhla ho jata.
  const ordered = [imageId, ...images.map((i) => i.id).filter((i) => i !== imageId)]

  for (const [index, id] of ordered.entries()) {
    await supabase.from('product_images').update({ sort_order: index }).eq('id', id)
  }

  revalidatePath('/')
  revalidatePath(`/admin/products/${productId}`)
}

// ────────────────────────────────────────────────
//  USERS — role badalna
// ────────────────────────────────────────────────
export async function setUserRole(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin()
  const supabase = await createClient()

  const userId = String(formData.get('user_id') ?? '').trim()
  const role = String(formData.get('role') ?? '') as Role

  if (!userId) return { error: 'User nahi mila.' }
  if (!ROLES.includes(role)) return { error: 'Ye role maujood nahi hai.' }

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    // schema.sql ka prevent_role_escalation() aur schema-phase3.sql ka
    // prevent_last_admin_demotion() dono yahan se aate hain. Unka
    // message pehle se saaf Hinglish mein hai, isliye jaisa hai waisa
    // hi dikhaya ja raha hai.
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: 'Role badal diya.' }
}

// ────────────────────────────────────────────────
//  ARTISAN APPLICATIONS — approve / reject
// ────────────────────────────────────────────────
export async function reviewApplication(formData: FormData): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const applicationId = String(formData.get('application_id') ?? '').trim()
  const status = String(formData.get('status') ?? '')

  if (!applicationId) return
  if (status !== 'approved' && status !== 'rejected') return

  // Approve karne pe user ka role apne aap 'artisan' ho jata hai aur
  // reviewed_at bhar jata hai — wo schema.sql ke sync_artisan_role()
  // trigger ka kaam hai, yahan dobara karne ki zaroorat nahi.
  const { error } = await supabase
    .from('artisan_applications')
    .update({ status })
    .eq('id', applicationId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/artisans')
  revalidatePath('/admin/users')
}
