'use client'

import { useFormStatus } from 'react-dom'

/**
 * A submit button that asks first.
 *
 * For deletes. A server action does not undo itself, so a mistaken
 * click has no way back — asking is the only thing standing in front
 * of it.
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
      {pending ? (pendingLabel ?? 'Working…') : children}
    </button>
  )
}
