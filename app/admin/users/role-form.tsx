'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { setUserRole, type AdminState } from '@/app/admin/actions'

const ROLES = [
  ['customer', 'Customer'],
  ['artisan', 'Artisan'],
  ['admin', 'Admin'],
] as const

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="adm-link" disabled={pending || disabled}>
      {pending ? '…' : 'Badlo'}
    </button>
  )
}

export default function RoleForm({
  userId,
  role,
  isSelf,
}: {
  userId: string
  role: string
  isSelf: boolean
}) {
  const [state, formAction] = useActionState<AdminState, FormData>(setUserRole, null)

  return (
    <form action={formAction} className="adm-role">
      <input type="hidden" name="user_id" value={userId} />

      <select name="role" defaultValue={role} aria-label="Role">
        {ROLES.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <SaveButton disabled={false} />

      {isSelf && <span className="adm-sub">aap</span>}

      {/* Akhri admin ko hatane wali rok DB mein hai
          (prevent_last_admin_demotion), isliye uska message yahan
          seedha dikha dete hain — wahi ek sach hai. */}
      {state?.error && <span className="adm-role-msg adm-err">{state.error}</span>}
      {state?.success && <span className="adm-role-msg adm-ok">{state.success}</span>}
    </form>
  )
}
