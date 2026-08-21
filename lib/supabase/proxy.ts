import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Har request pe session refresh karta hai aur protected routes
 * ko guard karta hai.
 *
 * Zaroori: getClaims() zaroor call karna hai. Ye expired token
 * refresh karta hai. Ye na ho to user random logout hone lagega.
 *
 * Note: Ye sirf pehli layer hai. Har protected page apne andar
 * bhi getUser() check karta hai — kyunki proxy CDN pe chal sakta
 * hai aur usme bharosa karna akela kaafi nahi hai.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Is line ke aur createServerClient ke beech koi code mat likhna.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims ?? null

  const path = request.nextUrl.pathname

  // Login zaroori hai in routes ke liye
  const protectedRoutes = ['/dashboard', '/join', '/admin']
  const needsAuth = protectedRoutes.some((r) => path.startsWith(r))

  if (needsAuth && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    url.searchParams.set('next', path) // login ke baad wapas yahin bhejenge
    return NextResponse.redirect(url)
  }

  // Already logged in hai to login/signup page mat dikhao
  if (user && (path === '/login' || path === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
