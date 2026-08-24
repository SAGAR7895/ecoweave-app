'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export type AuthState = {
  error?: string
  success?: string
  values?: Record<string, string>
} | null

/** Site ka base URL nikalta hai (email confirm link ke liye). */
async function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  const h = await headers()
  const host = h.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') ? 'http' : 'https'
  return `${proto}://${host}`
}

// ────────────────────────────────────────────────
//  SIGN UP
// ────────────────────────────────────────────────
export async function signup(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const fullName = String(formData.get('full_name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const phone = String(formData.get('phone') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm_password') ?? '')

  const values = { full_name: fullName, email, phone }

  // ---- Validation ----
  if (!fullName || !email || !password) {
    return { error: 'Name, email, and password are all required.', values }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.', values }
  }
  if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ''))) {
    return { error: 'Please enter a valid 10-digit phone number.', values }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.', values }
  }
  if (password !== confirm) {
    return { error: 'Passwords do not match.', values }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Ye profiles table ke trigger tak pahunchta hai.
      // Note: role yahan se set NAHI hota (security) — hamesha 'customer'.
      data: { full_name: fullName, phone },
      emailRedirectTo: `${await siteUrl()}/auth/confirm`,
    },
  })

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      return { error: 'This email is already registered. Please log in.', values }
    }
    return { error: error.message, values }
  }

  // Email confirmation ON hai to session nahi milta
  if (data.user && !data.session) {
    return {
      success: `Success! A confirmation link has been sent to ${email}. Please check your inbox and click the link.`,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// ────────────────────────────────────────────────
//  LOG IN
// ────────────────────────────────────────────────
export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '/dashboard')

  if (!email || !password) {
    return { error: 'Both email and password are required.', values: { email } }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const m = error.message.toLowerCase()
    if (m.includes('invalid login credentials')) {
      return { error: 'Invalid email or password.', values: { email } }
    }
    if (m.includes('email not confirmed')) {
      return {
        error: 'Please confirm your email first. A link was sent to your inbox.',
        values: { email },
      }
    }
    return { error: error.message, values: { email } }
  }

  revalidatePath('/', 'layout')
  // Open-redirect se bachne ke liye sirf internal path allow karo
  redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard')
}

// ────────────────────────────────────────────────
//  LOG OUT
// ────────────────────────────────────────────────
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// ────────────────────────────────────────────────
//  ARTISAN APPLICATION (Join Platform form)
// ────────────────────────────────────────────────
export async function submitApplication(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Please log in first.' }

  const fullName = String(formData.get('full_name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const cluster = String(formData.get('cluster') ?? '')
  const craftType = String(formData.get('craft_type') ?? '').trim()
  const loomCount = String(formData.get('loom_count') ?? '')
  const experience = String(formData.get('experience_years') ?? '')
  const message = String(formData.get('message') ?? '').trim()

  const values = {
    full_name: fullName,
    phone,
    cluster,
    craft_type: craftType,
    loom_count: loomCount,
    experience_years: experience,
    message,
  }

  if (!fullName || !phone || !cluster || !craftType) {
    return { error: 'Name, phone, cluster, and craft type are required.', values }
  }
  if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ''))) {
    return { error: 'Please enter a valid 10-digit phone number.', values }
  }

  const { error } = await supabase.from('artisan_applications').insert({
    user_id: user.id,
    full_name: fullName,
    phone: phone.replace(/[\s-]/g, ''),
    cluster,
    craft_type: craftType,
    loom_count: loomCount ? Number(loomCount) : null,
    experience_years: experience ? Number(experience) : null,
    message: message || null,
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Your application has already been submitted.', values }
    }
    return { error: error.message, values }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?applied=1')
}
