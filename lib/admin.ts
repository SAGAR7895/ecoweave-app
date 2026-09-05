import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * The admin check, in one place.
 *
 * This is for the interface only. The real barrier is in the database:
 * without the RLS policies and is_admin(), nothing these pages do would
 * succeed anyway. Having it in both places is not an excuse to be loose
 * in either — it means nobody but an admin is shown the door, and
 * anyone who types the URL directly is stopped by the database.
 */

export type AdminUser = {
  id: string
  email: string
  fullName: string
}

/**
 * Called at the top of every admin page. Anyone who is not an admin
 * leaves here.
 *
 * getUser() rather than getSession(): the session is read from a
 * cookie, the cookie belongs to the client, and so it cannot be
 * trusted. getUser() asks Supabase every time.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/admin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  // Signed in, but not an admin — back to their own dashboard. There is
  // nothing to gain from showing them a 403 page; as far as they are
  // concerned /admin should not exist.
  if (profile?.role !== 'admin') redirect('/dashboard')

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: profile.full_name ?? '',
  }
}

/**
 * Only answers whether to draw the "Admin Portal" button in the nav.
 * Redirects nobody.
 */
export async function getViewer(): Promise<{
  isLoggedIn: boolean
  isAdmin: boolean
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { isLoggedIn: false, isAdmin: false }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  return { isLoggedIn: true, isAdmin: profile?.role === 'admin' }
}
