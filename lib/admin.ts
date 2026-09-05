import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Admin hone ki jaanch — ek hi jagah.
 *
 * Ye sirf UI ke liye hai. Asli rok DB mein hai: RLS policies aur
 * is_admin() ke bina in pages se kuch bhi karna waise bhi fail hoga.
 * Do jagah check hone ka matlab ye nahi ki ek jagah dhili chhod di
 * jaye — matlab ye hai ki admin ke alawa kisi ko ye page dikhega hi
 * nahi, aur agar koi seedha URL kholega to DB use rokega.
 */

export type AdminUser = {
  id: string
  email: string
  fullName: string
}

/**
 * Har admin page ke shuru mein. Admin nahi ho to yahin se bahar.
 *
 * getUser() hi use kiya hai, getSession() nahi: session cookie se
 * padha jata hai aur cookie client ke paas hai, isliye uspe bharosa
 * nahi kiya ja sakta. getUser() har baar Supabase se poochta hai.
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

  // Login to hai, par admin nahi — apne dashboard pe wapas. Yahan
  // 403 page dikhane ka koi fayda nahi; unke liye /admin ka wajood
  // hi nahi hona chahiye.
  if (profile?.role !== 'admin') redirect('/dashboard')

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: profile.full_name ?? '',
  }
}

/**
 * Sirf ye jaanne ke liye ki nav mein "Admin Portal" ka button
 * dikhana hai ya nahi. Redirect nahi karta.
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
