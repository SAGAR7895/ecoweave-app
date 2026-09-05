import { requireAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import RoleForm from './role-form'

type UserRow = {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed: boolean
}

function shortDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function AdminUsersPage() {
  const admin = await requireAdmin()
  const supabase = await createClient()

  // Email auth.users mein hai, jo API se bahar hai — isliye ye admin-only
  // function. Dekho schema-phase3.sql section 7.
  const { data, error } = await supabase.rpc('admin_list_users')
  const users = (data ?? []) as UserRow[]

  return (
    <>
      <div className="adm-head">
        <h1>
          Users <span className="adm-count">{users.length}</span>
        </h1>
      </div>

      {error && (
        <div className="msg msg-error">
          User list nahi aayi: {error.message}
          <br />
          <span className="adm-sub">
            Agar likha hai ki function nahi mila, to schema-phase3.sql abhi
            chalaya nahi gaya hai.
          </span>
        </div>
      )}

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Last login</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <span className="adm-strong">{u.full_name || '—'}</span>
                </td>
                <td>
                  {u.email}
                  {!u.email_confirmed && (
                    <span className="adm-pill adm-pill-warn">unconfirmed</span>
                  )}
                </td>
                <td>{u.phone || '—'}</td>
                <td>{shortDate(u.created_at)}</td>
                <td>{shortDate(u.last_sign_in_at)}</td>
                <td>
                  <RoleForm userId={u.id} role={u.role} isSelf={u.id === admin.id} />
                </td>
              </tr>
            ))}

            {users.length === 0 && !error && (
              <tr>
                <td colSpan={6} className="adm-hint">
                  Abhi koi user nahi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="adm-hint">
        Artisan role khud lag jata hai jab aap Artisans page pe koi application
        approve karte ho. Yahan se badalna sirf tab zaroori hai jab kuch haath
        se theek karna ho.
      </p>
    </>
  )
}
