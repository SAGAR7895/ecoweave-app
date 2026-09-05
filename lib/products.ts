/**
 * Shared product types and helpers.
 *
 * Products now live in Supabase's `products` table and are edited from
 * the admin panel. This file used to be the hardcoded list of fifteen
 * itself; that list is now the seed at the bottom of
 * supabase/schema-phase3.sql.
 *
 * Only what both the client and the server need belongs here, so
 * nothing server-only may be imported into this file — a 'use client'
 * component that reaches it would fail to build.
 * Reading from the database happens in lib/queries.ts.
 */

export type Category = 'rugs' | 'shower' | 'table'

export const CATEGORIES: Category[] = ['rugs', 'shower', 'table']

export const CATEGORY_LABELS: Record<Category, string> = {
  rugs: 'Handmade Handloom Rugs',
  shower: 'Shower Curtains',
  table: 'Table Linen',
}

/** The Supabase Storage bucket that admin uploads go into. */
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
 * The admin form's "3999" or "3,999.50" -> paise.
 *
 * Not Number(x) * 100: in JavaScript 39.99 * 100 is
 * 3998.9999999999995, and even with Math.round on top, that is the
 * kind of error that turns up months later as a one-rupee discrepancy
 * nobody can explain. Adding rupees and paise as separate integers is
 * both simpler and exactly right.
 *
 * null on bad input, so the caller has to decide what to do rather
 * than letting a zero become the price.
 */
export function parsePriceToPaise(input: string): number | null {
  const cleaned = input.replace(/[₹,\s]/g, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null

  const [rupees, paise = ''] = cleaned.split('.')
  return Number(rupees) * 100 + Number(paise.padEnd(2, '0'))
}

/** 399900 -> "3999.00", for filling the admin form's input. */
export function paiseToInput(paise: number): string {
  return (paise / 100).toFixed(2)
}

/**
 * A photo's stored path -> a URL the browser can use.
 *
 * Two kinds of path arrive here, and both have to keep working:
 *
 *   "/images/product-rug-sage.jpg"  the repo's public/ folder — the
 *                                   original fifteen products, kept
 *                                   exactly as they were by the seed so
 *                                   nothing had to be re-uploaded
 *
 *   "a1b2c3/photo.jpg"              the Supabase Storage bucket — every
 *                                   photo added from the admin panel
 */
export function imageUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('/') || path.startsWith('http')) return path

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  return `${base}/storage/v1/object/public/${PRODUCT_BUCKET}/${path}`
}

/** The photo shown on the shop card — the one with the lowest sort_order. */
export function primaryImage(product: Product): ProductImage | null {
  return product.images.length > 0 ? product.images[0] : null
}
