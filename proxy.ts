import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

/**
 * Next.js 16: ye file pehle `middleware.ts` hoti thi.
 * Ab iska naam `proxy.ts` hai aur function ka naam `proxy`.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Sab routes match karo, in ke alawa:
     * - _next/static, _next/image (build files)
     * - favicon, images, videos
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)',
  ],
}
