/**
 * Products ke shared types aur helpers.
 *
 * Products ab Supabase ke `products` table mein hain, admin panel se
 * add/edit hote hain. Pehle ye file khud hi 15 products ka hardcoded
 * list thi — wo list ab supabase/schema-phase3.sql ke seed mein hai.
 *
 * Yahan sirf wo cheezein hain jo client aur server dono ko chahiye,
 * isliye is file mein koi server-only import nahi aana chahiye —
 * warna 'use client' components build hote waqt toot jayenge.
 * DB se padhne ka kaam lib/queries.ts mein hai.
 */

export type Category = 'rugs' | 'shower' | 'table'

export const CATEGORIES: Category[] = ['rugs', 'shower', 'table']

export const CATEGORY_LABELS: Record<Category, string> = {
  rugs: 'Handmade Handloom Rugs',
  shower: 'Shower Curtains',
  table: 'Table Linen',
}

/** Admin ke uploads ka Supabase Storage bucket. */
export const PRODUCT_BUCKET = 'product-images'

export type ProductImage = {
  id: string
  path: string
  alt: string
  sort_order: number
}

export type Product = {
  id: string
  slug: string
  category: Category
  name: string
  description: string
  price_in_paise: number
  unit: string
  icon: string
  is_published: boolean
  sort_order: number
  images: ProductImage[]
}

/** 399900 -> "₹3,999" */
export function formatPrice(paise: number): string {
  return '₹' + (paise / 100).toLocaleString('en-IN')
}

/**
 * Admin form ka "3999" ya "3,999.50" -> paise.
 *
 * Number(x) * 100 se nahi kiya: 39.99 * 100 JavaScript mein
 * 3998.9999999999995 deta hai, aur Math.round use karne ke baad bhi
 * ye wo tarah ki galti hai jo mahine baad ek rupaye ke fark mein
 * dikhti hai. Rupaye aur paise alag-alag integer mein jodna seedha
 * aur bilkul theek hai.
 *
 * Galat input pe null — taaki caller ko sochna pade, aur 0 chup-chaap
 * price na ban jaye.
 */
export function parsePriceToPaise(input: string): number | null {
  const cleaned = input.replace(/[₹,\s]/g, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null

  const [rupees, paise = ''] = cleaned.split('.')
  return Number(rupees) * 100 + Number(paise.padEnd(2, '0'))
}

/** 399900 -> "3999.00", admin form ke input mein bharne ke liye. */
export function paiseToInput(paise: number): string {
  return (paise / 100).toFixed(2)
}

/**
 * Photo ka path -> browser ke liye URL.
 *
 * Do tarah ke path aate hain, aur dono chalte rehne chahiye:
 *
 *   "/images/product-rug-sage.jpg"  repo ki public/ folder se — ye
 *                                   purane 15 products hain, jo seed
 *                                   mein waise hi rakhe gaye taaki
 *                                   unhe dobara upload na karna pade
 *
 *   "a1b2c3/photo.jpg"              Supabase Storage bucket se — admin
 *                                   ke naye uploads
 */
export function imageUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('/') || path.startsWith('http')) return path

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  return `${base}/storage/v1/object/public/${PRODUCT_BUCKET}/${path}`
}

/** Shop ke card pe dikhne wali photo — sabse chhote sort_order wali. */
export function primaryImage(product: Product): ProductImage | null {
  return product.images.length > 0 ? product.images[0] : null
}
