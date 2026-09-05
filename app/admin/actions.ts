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
 * Every action calls requireAdmin() first.
 *
 * Guarding the page is not enough: a server action has its own
 * endpoint, and a request can be sent to it without ever loading the
 * interface. The page check decides what is shown; this one decides
 * what can happen.
 */

/** "Darri Geometric — Handloom" -> "darri-geometric-handloom" */
function slugify(value: string): string {
  return value
    .toLowerCase()
    // Decomposes characters like ® and — into a base form, so the
    // filter below drops them instead of leaving something unexpected.
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Inside our bucket only — not the seeded public/ paths. */
function isStoragePath(path: string): boolean {
  return Boolean(path) && !path.startsWith('/') && !path.startsWith('http')
}

// ────────────────────────────────────────────────
//  PRODUCTS — create and update
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

  if (!name) return { error: 'A product name is required.', values }
  if (!CATEGORIES.includes(category)) {
    return { error: 'Please choose a category.', values }
  }

  const priceInPaise = parsePriceToPaise(priceRaw)
  if (priceInPaise === null) {
    return {
      error: 'That price is not valid. Use numbers only, like 3999 or 3999.50',
      values,
    }
  }

  const sortOrder = Number(sortRaw)
  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    return { error: 'Order must be a whole number, 0 or above.', values }
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
    return { success: 'Saved.' }
  }

  // New product. The slug comes from the name, so two products named
  // the same collide on the first attempt — hence the short suffix and
  // one retry.
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

  // Photos need the product's id, which only exists once it has been
  // saved, so this goes straight to the edit page where the upload box
  // is rather than back to the list.
  redirect(`/admin/products/${created.data.id}?created=1`)
}

// ────────────────────────────────────────────────
//  PRODUCTS — delete
// ────────────────────────────────────────────────
export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const id = String(formData.get('id') ?? '').trim()
  if (!id) return

  // The rows go on their own through the cascade, but the files in
  // Storage do not. Collect their paths first — afterwards there is
  // nothing left to say which files were orphaned.
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
//  The files go from the browser straight to Supabase Storage (see
//  app/admin/products/photo-uploader.tsx). This only records their
//  paths.
// ────────────────────────────────────────────────
export async function attachImages(formData: FormData): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const productId = String(formData.get('product_id') ?? '').trim()
  const paths = formData.getAll('paths').map((p) => String(p)).filter(Boolean)
  const alt = String(formData.get('alt') ?? '').trim()

  if (!productId || paths.length === 0) return

  // New photos go on the end, so whichever one is currently the main
  // photo stays the main photo. Having the shop card change the moment
  // something is uploaded is a surprise nobody asked for.
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

  // The seeded products' photos live in the repo's public/ folder, not
  // in the bucket. Storage is left alone for those.
  if (image && isStoragePath(image.path)) {
    await supabase.storage.from(PRODUCT_BUCKET).remove([image.path])
  }

  revalidatePath('/')
  revalidatePath(`/admin/products/${productId}`)
}

/** Moves the chosen photo to the front — that is the one the shop shows. */
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

  // The whole list is rewritten 0..n-1 rather than just giving the
  // chosen one -1. Otherwise pressing this repeatedly walks the numbers
  // down to -1, -2, -3 and the order stops meaning anything.
  const ordered = [imageId, ...images.map((i) => i.id).filter((i) => i !== imageId)]

  for (const [index, id] of ordered.entries()) {
    await supabase.from('product_images').update({ sort_order: index }).eq('id', id)
  }

  revalidatePath('/')
  revalidatePath(`/admin/products/${productId}`)
}

// ────────────────────────────────────────────────
//  USERS — change role
// ────────────────────────────────────────────────
export async function setUserRole(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin()
  const supabase = await createClient()

  const userId = String(formData.get('user_id') ?? '').trim()
  const role = String(formData.get('role') ?? '') as Role

  if (!userId) return { error: 'That user could not be found.' }
  if (!ROLES.includes(role)) return { error: 'That role does not exist.' }

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    // Two database triggers can land here: prevent_role_escalation from
    // schema.sql and prevent_last_admin_demotion from schema-phase3.sql.
    // Both already raise a plain-English message, so it is shown as-is
    // rather than replaced with a vaguer one.
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: 'Role updated.' }
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

  // Approving sets the user's role to 'artisan' and fills reviewed_at.
  // That is sync_artisan_role() in schema.sql doing it, so there is
  // nothing to repeat here.
  const { error } = await supabase
    .from('artisan_applications')
    .update({ status })
    .eq('id', applicationId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/artisans')
  revalidatePath('/admin/users')
}
