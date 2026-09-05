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
      {pending ? 'Save ho raha hai…' : isNew ? 'Banao aur photos lagao' : 'Save karo'}
    </button>
  )
}

export default function ProductForm({ product }: { product?: Product }) {
  const [state, formAction] = useActionState<AdminState, FormData>(saveProduct, null)
  const isNew = !product

  // Pehle form ke bhare hue values, phir DB ke — taaki validation fail
  // hone pe jo aapne type kiya tha wo mite nahi.
  const v = state?.values

  return (
    <form action={formAction} className="adm-form" noValidate>
      {state?.error && <div className="msg msg-error">{state.error}</div>}
      {state?.success && <div className="msg msg-ok">{state.success}</div>}

      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="field">
        <label htmlFor="name">Product ka naam</label>
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
          <span className="field-hint">Sirf number. Paise ke liye 3999.50</span>
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
          Karigar ka naam yahin likhiye — shop ke card pe yahi dikhta hai.
        </span>
      </div>

      <div className="field-row">
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
          <span className="field-hint">Photo load na ho to yahi dikhta hai.</span>
        </div>

        <div className="field">
          <label htmlFor="sort_order">Order</label>
          <input
            id="sort_order"
            name="sort_order"
            inputMode="numeric"
            defaultValue={v?.sort_order ?? String(product?.sort_order ?? 0)}
          />
          <span className="field-hint">Chhota number pehle dikhta hai.</span>
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
            Shop pe dikhao
            <em>
              {isNew
                ? ' — abhi off rakhna theek hai; photos lagane ke baad on kar dena.'
                : ' — off karne pe customer ko dikhna band ho jayega.'}
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
