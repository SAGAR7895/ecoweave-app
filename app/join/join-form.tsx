'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitApplication, type AuthState } from '@/app/auth/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-sage" disabled={pending}>
      {pending ? 'Submitting…' : 'Submit Application'}
    </button>
  )
}

export default function JoinForm({
  defaultName,
  defaultPhone,
}: {
  defaultName: string
  defaultPhone: string
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(
    submitApplication,
    null
  )

  return (
    <form action={formAction} noValidate>
      {state?.error && <div className="msg msg-error">{state.error}</div>}

      <div className="field">
        <label htmlFor="full_name">Full Name</label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={state?.values?.full_name ?? defaultName}
          placeholder="Shakil Ahamad"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          defaultValue={state?.values?.phone ?? defaultPhone}
          placeholder="9876543210"
          required
        />
        <p className="field-hint">We&apos;ll contact you on this number.</p>
      </div>

      <div className="field">
        <label htmlFor="cluster">Where are you based?</label>
        <select
          id="cluster"
          name="cluster"
          defaultValue={state?.values?.cluster ?? ''}
          required
        >
          <option value="" disabled>
            Select your cluster…
          </option>
          <option value="Panipat">Panipat, Haryana</option>
          <option value="Jaipur">Jaipur / Sanganer, Rajasthan</option>
          <option value="Other">Somewhere else</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="craft_type">What kind of work do you do?</label>
        <input
          id="craft_type"
          name="craft_type"
          type="text"
          defaultValue={state?.values?.craft_type ?? ''}
          placeholder="Handloom weaving / Block printing / Pit loom"
          required
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="loom_count">How many looms?</label>
          <input
            id="loom_count"
            name="loom_count"
            type="number"
            min={0}
            defaultValue={state?.values?.loom_count ?? ''}
            placeholder="8"
          />
        </div>
        <div className="field">
          <label htmlFor="experience_years">Years of experience</label>
          <input
            id="experience_years"
            name="experience_years"
            type="number"
            min={0}
            defaultValue={state?.values?.experience_years ?? ''}
            placeholder="20"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">About your work (optional)</label>
        <textarea
          id="message"
          name="message"
          defaultValue={state?.values?.message ?? ''}
          placeholder="What kind of work do you do, what designs do you weave…"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
