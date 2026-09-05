'use client'

import { useFormStatus } from 'react-dom'

/**
 * Submit button jo pehle poochta hai.
 *
 * Delete ke liye. Server action apne aap mein wapas nahi aati, isliye
 * ek galat click ka koi undo nahi hai — poochna hi ekmatra rok hai.
 */
export default function ConfirmButton({
  message,
  className,
  children,
  pendingLabel,
}: {
  message: string
  className?: string
  children: React.ReactNode
  pendingLabel?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      {pending ? (pendingLabel ?? 'Ho raha hai…') : children}
    </button>
  )
}
