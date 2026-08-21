/**
 * One-off migration helper: index_readable.html ke sections ko JSX
 * components mein convert karta hai.
 *
 * ⚠️  YE APNA KAAM KAR CHUKI HAI — DOBARA MAT CHALANA.
 *
 *     Migration ke baad components/marketing/*.tsx hi asli source hain.
 *     Unme hand-fixes ho chuke hain jo ye script wapas mita degi, jaise:
 *       - Duo.tsx : duo-grid / duo-card classes aur double border ka fix
 *
 *     Ab koi badlav karna ho to seedha .tsx file edit karo.
 *     Ye script sirf reference ke liye rakhi hai — build ka hissa nahi hai.
 *
 * Chalane ka tarika (agar bilkul zaroori ho):  node tools/html-to-jsx.js
 */
const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '..', 'index_readable.html')
const OUT = path.join(__dirname, '..', 'ecoweave-app', 'components', 'marketing')

const lines = fs.readFileSync(SRC, 'utf8').split('\n')

// [component name, start line, end line, dropLines?]  (1-indexed, inclusive)
//
// dropLines: original HTML mein do jagah galtiyan hain jo browser to chup-chaap
// nibha leta hai, par JSX nahi:
//   - line 1252 : ek extra </div> (Sutradhar ka nesting -1 chala jaata hai)
// Aur line 1358 par "</section>NDER -->" hai — "<!-- FOU" kahin gum ho gaya,
// jiski wajah se page par "NDER -->" text dikhta tha. Wo neeche saaf hota hai.
const SECTIONS = [
  ['Hero', 538, 598],
  ['Ticker', 601, 614],
  ['Crisis', 617, 669],
  ['Solution', 672, 807],
  ['CicloPanels', 810, 863],
  ['Jiwarajka', 880, 935],
  ['Platform', 938, 964],
  ['Impact', 967, 976],
  ['Workers', 979, 1083],
  ['Sutradhar', 1086, 1253, [1252]],
  ['Duo', 1256, 1358],
  ['Founder', 1359, 1384],
  ['CallToAction', 1387, 1395],
]

const camel = (p) =>
  p.startsWith('--') ? p : p.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

/** style="a:b;c:d"  ->  style={{ a: 'b', c: 'd' }} */
function styleToObject(css) {
  const props = css
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((decl) => {
      const i = decl.indexOf(':')
      if (i === -1) return null
      const key = camel(decl.slice(0, i).trim())
      const val = decl.slice(i + 1).trim().replace(/'/g, "\\'")
      const k = /^[a-zA-Z][a-zA-Z0-9]*$/.test(key) ? key : `'${key}'`
      return `${k}: '${val}'`
    })
    .filter(Boolean)
  return `{{ ${props.join(', ')} }}`
}

function convert(html) {
  let s = html

  // 0. Literal { } ko pehle escape karo.
  //    Ye SABSE PEHLE hona chahiye. Agar comments convert karne ke BAAD
  //    chalaya, to ye khud hi banaye hue {/* ... */} ko bhi escape kar deta
  //    hai aur comment page par text ban kar dikhne lagta hai.
  s = s.replace(/([>\s])\{([^}]*)\}([<\s])/g, '$1&#123;$2&#125;$3')

  // 1. HTML comments -> JSX comments
  s = s.replace(/<!--([\s\S]*?)-->/g, (_, body) => `{/*${body.replace(/\*\//g, '* /')}*/}`)

  // 2. img tags with onerror -> <SafeImg>  (fallback behaviour preserve karta hai)
  s = s.replace(/<img\b([^>]*?)\bonerror="[^"]*"([^>]*?)>/g, '<SafeImg$1$2>')

  // 3a. Jiwarajka wale button ka hover inline JS se aata tha -> CSS class
  s = s.replace(
    /\s*onmouseover="this\.style\.background='var\(--terra\)'"\s*onmouseout="this\.style\.background='var\(--ink\)'"/g,
    ' className="btn-ink"'
  )

  // 3b. baaki sabhi inline handlers hata do (JSX string handlers support nahi karta)
  s = s.replace(/\s+on[a-z]+="[^"]*"/g, '')

  // 4. attribute renames
  s = s.replace(/\bclass=/g, 'className=')
  s = s.replace(/\bfor=/g, 'htmlFor=')
  s = s.replace(/\bsrcset=/g, 'srcSet=')
  s = s.replace(/\btabindex=/g, 'tabIndex=')

  // 5. style="..." -> style={{...}}
  s = s.replace(/style="([^"]*)"/g, (_, css) => `style=${styleToObject(css)}`)

  // 6. purane page ke dead links -> asli routes
  s = s.replace(/href="connect\.html"/g, 'href="/join"')
  s = s.replace(/href="index\.html"/g, 'href="/"')

  // 7. void elements self-close karo
  s = s.replace(/<(img|br|hr|input|source|meta|link)\b([^>]*?)\/?>/g, '<$1$2 />')
  s = s.replace(/<SafeImg\b([^>]*?)\/?>/g, '<SafeImg$1 />')

  // (literal { } ka escaping upar step 0 mein ho chuka hai)

  return s
}

fs.mkdirSync(OUT, { recursive: true })

for (const [name, start, end, dropLines] of SECTIONS) {
  const drop = new Set(dropLines || [])
  let body = lines
    .slice(start - 1, end)
    .filter((_, idx) => !drop.has(start + idx))
    .join('\n')

  // "</section>NDER -->" -> "</section>"  (toota hua comment)
  body = body.replace(/<\/section>NDER -->/g, '</section>')

  const jsx = convert(body)
  const usesSafeImg = /<SafeImg\b/.test(jsx)

  const file = `${usesSafeImg ? "import SafeImg from '@/components/SafeImg'\n\n" : ''}export default function ${name}() {
  return (
${jsx
  .split('\n')
  .map((l) => (l.trim() ? '    ' + l : ''))
  .join('\n')}
  )
}
`
  fs.writeFileSync(path.join(OUT, `${name}.tsx`), file)
  console.log(`${name}.tsx  (lines ${start}-${end}${usesSafeImg ? ', SafeImg' : ''})`)
}

console.log('\nDone. components/marketing/ mein files ban gayi.')
