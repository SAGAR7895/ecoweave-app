import { createClient } from '@/lib/supabase/server'
import {
  CATEGORIES,
  type Category,
  type Product,
  type ProductImage,
} from '@/lib/products'

/**
 * Reading products from the database. Server side only.
 *
 * RLS already hides draft products, but that policy also says
 * `or public.is_admin()` — which would show an admin their own drafts
 * on the public shop. So the shop query filters on is_published as
 * well: an admin should see the shop exactly as a customer sees it,
 * otherwise "but it looked fine when I checked" is how a broken page
 * reaches everyone else.
 */

const PRODUCT_COLUMNS =
  'id, slug, category, name, description, price_in_paise, unit, icon, is_published, sort_order, ' +
  'product_images (id, path, alt, sort_order)'

type ProductRow = Omit<Product, 'images'> & {
  product_images: ProductImage[] | null
}

/**
 * supabase-js has not been given this project's generated database
 * types, so it infers a nested select as `GenericStringError[]`. That
 * makes `as ProductRow[]` illegal without going through `unknown`.
 *
 * Which means TypeScript is not checking these rows at all. The shape
 * declared above has to match PRODUCT_COLUMNS by hand — change one and
 * the other has to change with it, or the mistake shows up on a live
 * page rather than in the build.
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

/** For the shop — published only, grouped by category. */
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
    // An empty collection is better than taking the whole page down.
    // This only happens if the database is unreachable, and at that
    // point nothing else is working well enough to show a banner about
    // it either.
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

/** The admin list — drafts included, everything. */
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

/** The admin edit page — one product with all of its photos. */
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
