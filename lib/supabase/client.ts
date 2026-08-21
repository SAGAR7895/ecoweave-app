import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser (client component) ke liye Supabase client.
 * Sirf "use client" wale components mein use karna.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
