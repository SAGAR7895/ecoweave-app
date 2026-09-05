import { createClient } from '@/lib/supabase/server'
import {
  CATEGORIES,
  type Category,
  type Product,
  type ProductImage,
} from '@/lib/products'

/**
 * Products DB se padhne ka kaam. Sirf server pe.
 *
 * RLS pehle se draft products ko chhupa deta hai, lekin us policy mein
 * `or public.is_admin()` bhi hai — matlab admin ko shop pe apne draft
 * bhi dikhte. Isliye shop wali query mein is_published ka filter alag
 * se lagaya gaya hai: admin ko bhi shop wahi dikhni chahiye jo customer
 * ko dikhti hai, warna "maine to dekha tha, chal raha tha" wali galti
 * hoti hai.
 */

const PRODUCT_COLUMNS =
  'id, slug, category, name, description, price_in_paise, unit, icon, is_published, sort_order, ' +
  'product_images (id, path, alt, sort_order)'

type ProductRow = Omit<Product, 'images'> & {
  product_images: ProductImage[] | null
}

/**
 * supabase-js ko is project ke DB ke generated types nahi diye gaye
 * hain, isliye wo nested select ka result `GenericStringError[]` maan
 * leta hai. Isse `as ProductRow[]` seedha nahi chalta — `unknown` se
 * hokar jana padta hai.
 *
 * Matlab TypeScript in rows ki jaanch nahi kar raha. Jo shape yahan
 * likhi hai wo PRODUCT_COLUMNS se milni chahiye — ek badalti hai to
 * doosri bhi badalni hai, warna galti build pe nahi, chalte hue page
 * pe dikhegi.
 */
function rows(data: unknown): ProductRow[] {
  return (data ?? []) as ProductRow[]
}

function toProduct(row: ProductRow): Product {
  const { product_images, ...rest } = row
  return { ...rest, images: product_images ?? [] }
}

function emptyByCategory(): Record<Category, Product[]> {
  return { rugs: [], shower: [], table: [] }
}

/** Shop ke liye — sirf published, category ke hisaab se baante hue. */
export async function getShopProducts(): Promise<Record<Category, Product[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
    .order('sort_order', { ascending: true, referencedTable: 'product_images' })

  const byCategory = emptyByCategory()

  if (error) {
    // Shop ka poora page girane se behtar hai khaali collection
    // dikhana. Ye tabhi hoga jab DB hi na mile, aur us waqt banner
    // dikhane layak koi aur cheez bhi kaam nahi kar rahi hogi.
    console.error('[queries] getShopProducts failed:', error.message)
    return byCategory
  }

  for (const row of rows(data)) {
    const product = toProduct(row)
    if (CATEGORIES.includes(product.category)) {
      byCategory[product.category].push(product)
    }
  }

  return byCategory
}

/** Admin list — draft bhi, sab kuch. */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
    .order('sort_order', { ascending: true, referencedTable: 'product_images' })

  if (error) throw new Error(error.message)

  return rows(data).map(toProduct)
}

/** Admin edit page — ek product, uski saari photos ke saath. */
export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .order('sort_order', { ascending: true, referencedTable: 'product_images' })
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data ? toProduct(rows([data])[0]) : null
}
