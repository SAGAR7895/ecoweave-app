/**
 * Products — abhi ke liye yahin hardcoded hain, bilkul purani site ki tarah.
 *
 * Phase 3 mein ye Supabase `products` table se aayenge aur admin panel se
 * add/edit honge. Isliye abhi se `id` aur `priceInPaise` rakh diye hain:
 *
 *   - `id`   : cart aur orders ko product se jodne ke liye zaroori hai
 *   - paise  : paisa hamesha integer mein store karo. "₹3,999" string se
 *              total jodna, tax lagana, ya refund karna possible nahi hai.
 */
export type Category = 'rugs' | 'shower' | 'table'

export type Product = {
  id: string
  name: string
  desc: string
  priceInPaise: number
  unit: string
  img: string
  icon: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  rugs: 'Handmade Handloom Rugs',
  shower: 'Shower Curtains',
  table: 'Table Linen',
}

/** 399900 -> "₹3,999" */
export function formatPrice(paise: number): string {
  return '₹' + (paise / 100).toLocaleString('en-IN')
}

export const PRODUCTS: Record<Category, Product[]> = {
  rugs: [
    {
      id: 'rug-darri-geometric',
      name: 'Darri Geometric — Handloom',
      desc: 'Hand-woven cotton darri in geometric pattern. Pit-loom woven by Shakil Ahamad, Panipat.',
      priceInPaise: 399900,
      unit: '4×6 ft',
      img: '/images/product-rug-darri-geometric.jpg',
      icon: '🏠',
    },
    {
      id: 'rug-durrie-natural-stripe',
      name: 'Durrie Natural Stripe',
      desc: 'Flat-weave durrie in natural undyed cotton. Woven by Mohammed Iqbal, Panipat cluster.',
      priceInPaise: 279900,
      unit: '3×5 ft',
      img: '/images/product-rug-durrie-natural.jpg',
      icon: '🏠',
    },
    {
      id: 'rug-block-print-indigo',
      name: 'Block Print Handloom — Indigo',
      desc: 'Handloom base with Sanganer indigo block print border. Jahangir Alam & Tauhid Alam collaboration.',
      priceInPaise: 449900,
      unit: '4×6 ft',
      img: '/images/product-rug-indigo.jpg',
      icon: '🏠',
    },
    {
      id: 'rug-carpet-terracotta',
      name: 'Carpet Weave — Terracotta',
      desc: 'Hand-knotted carpet weave in warm terracotta tones. Md Munna Mustak, Panipat — 20 years of craft.',
      priceInPaise: 599900,
      unit: '4×6 ft',
      img: '/images/product-rug-terracotta.jpg',
      icon: '🏠',
    },
    {
      id: 'rug-handloom-sage',
      name: 'Handloom Solid — Sage',
      desc: 'Dense handloom flat-weave in muted sage. Woven by Prem Chand, Rajiv Colony, Panipat.',
      priceInPaise: 329900,
      unit: '3×5 ft',
      img: '/images/product-rug-sage.jpg',
      icon: '🏠',
    },
  ],
  shower: [
    {
      id: 'shower-botanical-block',
      name: 'Botanical Block Print',
      desc: 'Sanganer block-print botanical motifs on CiCLO® base. Tauhid Alam, Sanganer Jaipur.',
      priceInPaise: 229900,
      unit: 'Single',
      img: '/images/product-shower-botanical.jpg',
      icon: '🚿',
    },
    {
      id: 'shower-indigo-stripe',
      name: 'Indigo Stripe — Handloom',
      desc: 'Crisp woven indigo & white stripes. Quick-dry CiCLO® polyester. Panipat woven.',
      priceInPaise: 189900,
      unit: 'Single',
      img: '/images/product-shower-indigo-stripe.jpg',
      icon: '🚿',
    },
    {
      id: 'shower-natural-waffle',
      name: 'Natural Waffle Weave',
      desc: 'Classic waffle texture in natural ivory. Water-resistant CiCLO® polyester weave.',
      priceInPaise: 169900,
      unit: 'Single',
      img: '/images/product-shower-waffle.jpg',
      icon: '🚿',
    },
    {
      id: 'shower-jaipur-floral',
      name: 'Jaipur Floral Print',
      desc: 'Traditional Jaipur floral block-print in fuchsia & sage. Sunita Devi, Sanganer.',
      priceInPaise: 269900,
      unit: 'Single',
      img: '/images/product-shower-jaipur-floral.jpg',
      icon: '🚿',
    },
    {
      id: 'shower-geometric-mosaic',
      name: 'Geometric Mosaic',
      desc: 'Bold geometric tile-print in earthy terracotta tones. CiCLO® certified throughout.',
      priceInPaise: 209900,
      unit: 'Single',
      img: '/images/product-shower-geometric.jpg',
      icon: '🚿',
    },
  ],
  table: [
    {
      id: 'table-ivory-runner',
      name: 'Ivory Table Runner — Handloom',
      desc: 'Clean ivory runner with subtle woven border. 14×72 inches. Prem Chand, Panipat.',
      priceInPaise: 89900,
      unit: 'Single',
      img: '/images/product-table-ivory-runner.jpg',
      icon: '🍽️',
    },
    {
      id: 'table-jaipur-tablecloth',
      name: 'Jaipur Block Print Tablecloth',
      desc: 'Hand block-printed in traditional Jaipur motifs by Jahangir Alam. 60×90 inches.',
      priceInPaise: 219900,
      unit: 'Single',
      img: '/images/product-table-jaipur-print.jpg',
      icon: '🍽️',
    },
    {
      id: 'table-terracotta-placemats',
      name: 'Terracotta Placemats — Set 4',
      desc: 'Warm terracotta with Sanganer block-print border. Tauhid Alam. 13×18 inches each.',
      priceInPaise: 109900,
      unit: 'Set/4',
      img: '/images/product-table-terracotta-mats.jpg',
      icon: '🍽️',
    },
    {
      id: 'table-sage-napkins',
      name: 'Sage Green Napkins — Set 6',
      desc: 'Warm sage dinner napkins with hemstitched edges. Woven by Tufar Ali, Panipat.',
      priceInPaise: 119900,
      unit: 'Set/6',
      img: '/images/product-table-sage-napkins.jpg',
      icon: '🍽️',
    },
    {
      id: 'table-natural-placemats',
      name: 'Natural Woven Placemats — Set 6',
      desc: 'Textured natural weave placemats. 13×18 inches each. CiCLO® certified polyester.',
      priceInPaise: 149900,
      unit: 'Set/6',
      img: '/images/product-table-natural-mats.jpg',
      icon: '🍽️',
    },
  ],
}
