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

  // Email lives in auth.users, which is not exposed through the API, so
  // this admin-only function fetches it. See schema-phase3.sql, part 7.
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
          Could not load the user list: {error.message}
          <br />
          <span className="adm-sub">
            If it says the function was not found, schema-phase3.sql has not
            been run yet.
          </span>
        </div>
      )}

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th>
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
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="adm-hint">
        The artisan role is set automatically when an application is approved on
        the Artisans page. Changing it here is only needed to correct something
        by hand.
      </p>
    </>
  )
}
