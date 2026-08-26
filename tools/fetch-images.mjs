/**
 * Marketing images ko Unsplash se download karke public/images/ mein daalta hai.
 *
 * Pehle ye saari images images.unsplash.com se hotlink hoti thi. Do problems:
 *   1. Unsplash kabhi bhi photo hata sakta hai — 3 photo-ids 404 ho chuki thi
 *      aur homepage par SafeImg ka emoji fallback dikh raha tha.
 *   2. Hotlink par hamara koi control nahi. Self-host karne se URL hamesha
 *      chalega aur page apne server se serve hoga.
 *
 * Unsplash License download + commercial use dono allow karta hai
 * (https://unsplash.com/license), isliye self-hosting bilkul theek hai.
 * PAR Unsplash+ (plus.unsplash.com/premium_photo-...) ek paid tier hai jiska
 * license alag hai — wo hum use NAHI kar sakte. Isliye script har photo ka
 * `urls.raw` check karti hai aur premium mile to fail ho jaati hai.
 *
 * Chalane ka tarika (idempotent hai — jo file maujood hai wo skip hoti hai):
 *
 *     node tools/fetch-images.mjs          # sirf missing files
 *     node tools/fetch-images.mjs --force  # sab dobara download
 *
 * Credits IMAGE-CREDITS.md mein likhe jaate hain.
 */
import { writeFile, mkdir, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'images')
const CREDITS = join(ROOT, 'IMAGE-CREDITS.md')

/**
 * [ file, unsplash photo id, width, kahan use hoti hai ]
 *
 * Ek hi photo do jagah use ho to width sabse badi slot ke hisaab se rakhi hai.
 * Hero background alag file hai kyunki wo full-bleed hai — 800px kaafi nahi.
 */
const IMAGES = [
  // ---- Hero -------------------------------------------------------------
  // Hero ka background ab Sagar ki apni photo hai (hero-traditional-weaver.jpg),
  // Unsplash se nahi — isliye wo yahan manage nahi hoti. Apni images ko is list
  // mein mat daalo; ye list sirf Unsplash se aane wali photos ke liye hai.
  ['textile-window-curtain.jpg', 'cTA8m7VwejE', 800, 'Hero — Window Curtains card'],
  ['textile-table-linen.jpg', 'ThxRqog_wU4', 800, 'Hero — Table Linen card'],
  ['textile-shower-curtain.jpg', 'PBfJC5h-G48', 800, 'Hero — Shower Curtains card'],
  ['textile-bed-linen.jpg', '0Ymt53tBapQ', 800, 'Hero — Bed Linen card'],

  // ---- Platform ---------------------------------------------------------
  ['platform-weaver-at-loom.jpg', 'XSs7xXS71pM', 1200, 'Platform — section image'],

  // ---- Artisans (Workers + Sutradhar dono sections) ---------------------
  ['artisan-shakil-ahamad.jpg', 'XCd_6nOdzjo', 800, 'Shakil Ahamad — darri weaving'],
  ['artisan-prem-chand.jpg', 'SzNNXMKQ-4w', 800, 'Prem Chand — handloom weaving'],
  ['artisan-sunita-devi.jpg', '9AK8-BgTu1A', 800, 'Sunita Devi — block printing'],
  ['artisan-jahangir-alam.jpg', 'jZJ8IoqaMFo', 800, 'Jahangir Alam — block printing'],
  ['artisan-shamshad-alam.jpg', 'cnN7eqvmFRk', 800, 'Shamshad Alam — darri weaving'],
  ['artisan-md-munna-mustak.jpg', 'jmdI2eR2Xew', 800, 'Md Munna Mustak — carpet weaving'],
  ['artisan-tauhid-alam.jpg', 'hsA1TzSXUIQ', 800, 'Tauhid Alam — block printing'],
  ['artisan-tufar-ali.jpg', 'CFOEXvIdZZM', 800, 'Tufar Ali — handloom weaving'],

  // ---- Products (lib/products.ts) --------------------------------------
  ['product-rug-darri-geometric.jpg', '23gl1vql2wE', 800, 'Darri Geometric — Handloom'],
  ['product-rug-durrie-natural.jpg', 'inro-BXWEL8', 800, 'Durrie Natural Stripe'],
  ['product-rug-indigo.jpg', 'n_2d0-BtT9U', 800, 'Block Print Handloom — Indigo'],
  ['product-rug-terracotta.jpg', 'TY6axOm5Sdk', 800, 'Carpet Weave — Terracotta'],
  ['product-rug-sage.jpg', '1vE_nDTtExM', 800, 'Handloom Solid — Sage'],
  ['product-shower-botanical.jpg', '0rUc4_00L-A', 800, 'Botanical Block Print'],
  ['product-shower-indigo-stripe.jpg', 't47sZ1h2mCo', 800, 'Indigo Stripe — Handloom'],
  ['product-shower-waffle.jpg', 'ftj5cJbA2UY', 800, 'Natural Waffle Weave'],
  ['product-shower-jaipur-floral.jpg', 'eCq3WTD1f_4', 800, 'Jaipur Floral Print'],
  ['product-shower-geometric.jpg', 'n-1caeAJk9c', 800, 'Geometric Mosaic'],
  ['product-table-ivory-runner.jpg', 'EvF5Mz3eAh0', 800, 'Ivory Table Runner — Handloom'],
  ['product-table-jaipur-print.jpg', 'v08j4p-1ra4', 800, 'Jaipur Block Print Tablecloth'],
  ['product-table-terracotta-mats.jpg', 'q4xXhRosMOY', 800, 'Terracotta Placemats — Set 4'],
  ['product-table-sage-napkins.jpg', 'VwkTqS3RrS4', 800, 'Sage Green Napkins — Set 6'],
  ['product-table-natural-mats.jpg', 'xbvnU5zM_3M', 800, 'Natural Woven Placemats — Set 6'],
]

const force = process.argv.includes('--force')

const exists = (p) => access(p).then(() => true, () => false)

async function meta(id) {
  const res = await fetch(`https://unsplash.com/napi/photos/${id}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`${id}: metadata HTTP ${res.status}`)
  const j = await res.json()

  // Unsplash+ photos ka raw URL plus.unsplash.com/premium_photo-... hota hai.
  // Unka license alag hai (paid subscription) — use nahi kar sakte.
  if (!j.urls.raw.startsWith('https://images.unsplash.com/photo-')) {
    throw new Error(`${id}: Unsplash+ (premium) photo hai — free license nahi. Doosri photo chuno.`)
  }
  return { raw: j.urls.raw, author: j.user.name, page: j.links.html, alt: j.alt_description || '' }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const rows = []

  for (const [file, id, width, usedFor] of IMAGES) {
    const dest = join(OUT, file)
    const m = await meta(id)
    rows.push({ file, id, usedFor, ...m })

    if (!force && (await exists(dest))) {
      console.log(`skip      ${file}`)
      continue
    }
    const res = await fetch(`${m.raw}&w=${width}&q=80&fm=jpg&fit=max`)
    if (!res.ok) throw new Error(`${file}: download HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    await writeFile(dest, buf)
    console.log(`saved     ${file}  ${width}px  ${(buf.length / 1024).toFixed(0)} KB`)
  }

  const md = `# Image credits

Homepage ki saari photos Unsplash se hain aur \`public/images/\` mein self-hosted
hain — hotlink nahi. [Unsplash License](https://unsplash.com/license) free,
commercial use allow karta hai aur attribution zaroori nahi hai; ye list credit
dene ke liye aur source track karne ke liye hai.

Ye file \`node tools/fetch-images.mjs\` se generate hoti hai — haath se mat edit karo.

> **Dhyaan rahe:** Ye stock photos hain, EcoWeave ke asli artisans ki nahi.
> Unsplash License identifiable logon ke personality rights cover nahi karta,
> isliye launch se pehle in sab ki jagah asli artisan photos (unki likhit
> permission ke saath) lagani chahiye.

| File | Photographer | Kahan use hoti hai | Unsplash |
| --- | --- | --- | --- |
${rows
  .map((r) => `| \`${r.file}\` | ${r.author} | ${r.usedFor} | [${r.id}](${r.page}) |`)
  .join('\n')}
`
  await writeFile(CREDITS, md)
  console.log(`\nwrote     IMAGE-CREDITS.md  (${rows.length} images)`)
}

main().catch((err) => {
  console.error(`\n✗ ${err.message}`)
  process.exit(1)
})
