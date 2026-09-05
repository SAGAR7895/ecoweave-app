'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { attachImages } from '@/app/admin/actions'
import { PRODUCT_BUCKET } from '@/lib/products'

/**
 * Photos browser se SEEDHA Supabase Storage pe jati hain, Next.js ke
 * through nahi.
 *
 * Wajah: server action ki body limit 1MB hai. Files ko action se
 * bhejne ka matlab hota us limit ko badhana, nginx ki limit bhi
 * badhana, aur har photo ko do baar network pe bhejna — pehle
 * Next.js tak, phir Next.js se Supabase tak.
 *
 * Yahan se upload karne ki ijazat DB deta hai, ye component nahi:
 * schema-phase3.sql ki storage policy sirf admin ko is bucket mein
 * likhne deti hai. Ye file sirf UI hai.
 */

// contentType file.type se nahi, is list se liya jata hai. file.type
// browser ka bataya hua hai aur badla ja sakta hai — aur bucket public
// hai, matlab jo content-type yahan likha jayega wahi bahar serve hoga.
// text/html serve hone lagi to ye upload box XSS ka darwaza ban jata.
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

    for (const file of files) {
      if (!ALLOWED[file.type]) {
        setError(
          `"${file.name}" JPG, PNG, WebP ya AVIF nahi hai. Ek bhi photo upload nahi hui.`
        )
        return
      }
      if (file.size > MAX_BYTES) {
        setError(
          `"${file.name}" ${(file.size / 1024 / 1024).toFixed(1)} MB ki hai — limit 8 MB hai. Ek bhi photo upload nahi hui.`
        )
        return
      }
    }

    setBusy(true)
    const supabase = createClient()
    const uploaded: string[] = []

    try {
      for (const [i, file] of files.entries()) {
        setNote(`Upload ho rahi hai ${i + 1}/${files.length} — ${file.name}`)

        const path = `${productId}/${crypto.randomUUID()}.${ALLOWED[file.type]}`

        const { error: upErr } = await supabase.storage
          .from(PRODUCT_BUCKET)
          .upload(path, file, {
            contentType: file.type,
            // Photo ka naam kabhi dobara nahi banega (uuid), isliye ise
            // hamesha ke liye cache karna safe hai.
            cacheControl: '31536000',
            upsert: false,
          })

        if (upErr) throw new Error(upErr.message)
        uploaded.push(path)
      }

      // Sirf paths server ko bhej rahe hain — files nahi.
      const fd = new FormData()
      fd.set('product_id', productId)
      for (const path of uploaded) fd.append('paths', path)
      await attachImages(fd)

      setNote(`${uploaded.length} photo lag gayi.`)
      if (inputRef.current) inputRef.current.value = ''
      router.refresh()
    } catch (e) {
      // Adhoora upload: kuch files bucket mein chali gayin par DB mein
      // row nahi bani. Unhe wapas hata do, warna wo bucket mein padi
      // rahengi jahan koi unhe dekhega bhi nahi.
      if (uploaded.length > 0) {
        await supabase.storage.from(PRODUCT_BUCKET).remove(uploaded)
      }
      setNote(null)
      setError(
        (e instanceof Error ? e.message : 'Upload fail ho gaya.') +
          ' — koi photo save nahi hui. Dobara koshish karo.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="adm-upload">
      <label htmlFor="photos" className="adm-upload-label">
        Photos jodo
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
        Ek saath jitni chahe utni chun sakte ho. JPG, PNG, WebP ya AVIF —
        har ek 8 MB tak. Sabse pehli photo hi shop ke card pe dikhti hai.
      </p>

      {busy && <div className="msg msg-info">{note}</div>}
      {!busy && note && <div className="msg msg-ok">{note}</div>}
      {error && <div className="msg msg-error">{error}</div>}
    </div>
  )
}
