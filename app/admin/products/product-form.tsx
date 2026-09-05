'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'

import { saveProduct, type AdminState } from '@/app/admin/actions'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  paiseToInput,
  type Product,
} from '@/lib/products'

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
      {pending ? 'Saving…' : isNew ? 'Create and add photos' : 'Save changes'}
    </button>
  )
}

export default function ProductForm({ product }: { product?: Product }) {
  const [state, formAction] = useActionState<AdminState, FormData>(saveProduct, null)
  const isNew = !product

  // What was typed comes first, the saved row second, so a failed
  // validation hands the form back as it was rather than wiping it.
  const v = state?.values

  return (
    <form action={formAction} className="adm-form" noValidate>
      {state?.error && <div className="msg msg-error">{state.error}</div>}
      {state?.success && <div className="msg msg-ok">{state.success}</div>}

      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="field">
        <label htmlFor="name">Product name</label>
        <input
          id="name"
          name="name"
          defaultValue={v?.name ?? product?.name ?? ''}
          placeholder="Darri Geometric — Handloom"
          required
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            defaultValue={v?.category ?? product?.category ?? 'rugs'}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="price">Price (₹)</label>
          <input
            id="price"
            name="price"
            inputMode="decimal"
            defaultValue={
              v?.price ?? (product ? paiseToInput(product.price_in_paise) : '')
            }
            placeholder="3999"
            required
          />
          <span className="field-hint">Numbers only. Use 3999.50 for paise.</span>
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={v?.description ?? product?.description ?? ''}
          placeholder="Hand-woven cotton darri… Pit-loom woven by Shakil Ahamad, Panipat."
        />
        <span className="field-hint">
          Name the artisan here — this is the text shown on the shop card.
        </span>
      </div>

      {/* Three across, so this cannot be .field-row, which is a
          two-column grid and would drop Order onto its own line at
          half width. */}
      <div className="adm-row-3">
        <div className="field">
          <label htmlFor="unit">Unit / size</label>
          <input
            id="unit"
            name="unit"
            defaultValue={v?.unit ?? product?.unit ?? ''}
            placeholder="4×6 ft, Single, Set/6"
          />
        </div>

        <div className="field">
          <label htmlFor="icon">Icon</label>
          <input
            id="icon"
            name="icon"
            defaultValue={v?.icon ?? product?.icon ?? ''}
            placeholder="🏠"
            maxLength={4}
          />
          <span className="field-hint">Shown if the photo fails to load.</span>
        </div>

        <div className="field">
          <label htmlFor="sort_order">Order</label>
          <input
            id="sort_order"
            name="sort_order"
            inputMode="numeric"
            defaultValue={v?.sort_order ?? String(product?.sort_order ?? 0)}
          />
          <span className="field-hint">Lower numbers come first.</span>
        </div>
      </div>

      <div className="field">
        <label className="adm-check">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={product ? product.is_published : false}
          />
          <span>
            Show on the shop
            <em>
              {isNew
                ? ' — leave this off for now and turn it on once the photos are up.'
                : ' — turning this off hides the product from customers.'}
            </em>
          </span>
        </label>
      </div>

      <div className="adm-form-actions">
        <SubmitButton isNew={isNew} />
        <Link href="/admin/products" className="adm-btn">
          Cancel
        </Link>
      </div>
    </form>
  )
}
