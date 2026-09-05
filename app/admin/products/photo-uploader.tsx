'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { attachImages } from '@/app/admin/actions'
import { PRODUCT_BUCKET } from '@/lib/products'

/**
 * Photos go from the browser STRAIGHT to Supabase Storage, not through
 * Next.js.
 *
 * A server action's request body is capped at 1MB. Sending files
 * through one would have meant raising that cap, raising nginx's to
 * match, and carrying every photo across the network twice — once to
 * Next.js and again from Next.js to Supabase.
 *
 * What makes this safe is not this file. The storage policy in
 * schema-phase3.sql only lets an admin write to this bucket; this is
 * only the interface to it.
 */

// The content type comes from this list, never from file.type. That
// value is supplied by the browser and can be anything, and the bucket
// is public — whatever type is recorded on upload is the type served
// back out. Let text/html through and this box becomes a way to host a
// script on the site's own API domain.
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

const MAX_BYTES = 8 * 1024 * 1024

export default function PhotoUploader({ productId }: { productId: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function upload(files: File[]) {
    setError(null)
    setNote(null)

    // Every file is checked before any of them is sent, so a bad one at
    // the end of the list does not leave the first few half-uploaded.
    for (const file of files) {
      if (!ALLOWED[file.type]) {
        setError(
          `"${file.name}" is not a JPG, PNG, WebP or AVIF. Nothing was uploaded.`
        )
        return
      }
      if (file.size > MAX_BYTES) {
        setError(
          `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 8 MB. Nothing was uploaded.`
        )
        return
      }
    }

    setBusy(true)
    const supabase = createClient()
    const uploaded: string[] = []

    try {
      for (const [i, file] of files.entries()) {
        setNote(`Uploading ${i + 1} of ${files.length} — ${file.name}`)

        const path = `${productId}/${crypto.randomUUID()}.${ALLOWED[file.type]}`

        const { error: upErr } = await supabase.storage
          .from(PRODUCT_BUCKET)
          .upload(path, file, {
            contentType: file.type,
            // The name is a fresh uuid every time and is never reused,
            // so this can be cached indefinitely.
            cacheControl: '31536000',
            upsert: false,
          })

        if (upErr) throw new Error(upErr.message)
        uploaded.push(path)
      }

      // Only the paths go to the server — the files never touch it.
      const fd = new FormData()
      fd.set('product_id', productId)
      for (const path of uploaded) fd.append('paths', path)
      await attachImages(fd)

      setNote(`${uploaded.length} photo${uploaded.length === 1 ? '' : 's'} added.`)
      if (inputRef.current) inputRef.current.value = ''
      router.refresh()
    } catch (e) {
      // Some files reached the bucket but no rows were written for them.
      // Take them back out: left behind, they are invisible to every
      // screen in this panel and nobody will ever find them again.
      if (uploaded.length > 0) {
        await supabase.storage.from(PRODUCT_BUCKET).remove(uploaded)
      }
      setNote(null)
      setError(
        (e instanceof Error ? e.message : 'The upload failed.') +
          ' — no photos were saved. Please try again.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="adm-upload">
      <label htmlFor="photos" className="adm-upload-label">
        Add photos
      </label>

      <input
        id="photos"
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        disabled={busy}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          if (files.length > 0) void upload(files)
        }}
      />

      <p className="adm-hint">
        Select as many as you like. JPG, PNG, WebP or AVIF, up to 8 MB each.
        The first photo is the one shown on the shop card.
      </p>

      {busy && <div className="msg msg-info">{note}</div>}
      {!busy && note && <div className="msg msg-ok">{note}</div>}
      {error && <div className="msg msg-error">{error}</div>}
    </div>
  )
}
