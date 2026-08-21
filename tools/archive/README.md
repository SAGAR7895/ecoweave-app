# Retired tools

Yahan wo scripts hain jo apna kaam khatam kar chuki hain. **Inhe chalana nahi hai** —
sirf reference ke liye rakhi gayi hain (ki fulaana cheez pehle kaise generate hui thi).

## `html-to-jsx.js`

`index_readable.html` ke sections ko `components/marketing/*.tsx` mein convert karti thi.
Migration ho chuki hai, aur ab **asli source wahi `.tsx` files hain** — unme aise
hand-fixes ja chuke hain jo ye script wapas mita degi:

- `Duo.tsx` — duo-grid / duo-card classes aur double border ka fix
- `Hero` / `Platform` / `Workers` / `Sutradhar` — Unsplash hotlinks ki jagah
  `/images/*` self-hosted paths (dekho `tools/fetch-images.mjs` aur `IMAGE-CREDITS.md`)

Pehle ye repo ke bahar `<repo-parent>/tools/html-to-jsx.js` par thi. Yahan isliye
laayi gayi taaki git mein track ho jaye aur galti se `node tools/html-to-jsx.js`
chal na jaye.

Marketing sections mein koi badlav karna ho to seedha `.tsx` file edit karo.
