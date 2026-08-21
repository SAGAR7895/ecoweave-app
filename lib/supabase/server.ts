import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server Component / Server Action / Route Handler ke liye client.
 * Har request pe naya banana hai — global variable mein mat rakhna,
 * warna ek user ka session dusre ko mil sakta hai.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component se cookie set nahi hoti — ye normal hai.
            // middleware session refresh kar deta hai, isliye ignore safe hai.
          }
        },
      },
    }
  )
}
