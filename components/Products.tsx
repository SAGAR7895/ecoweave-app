'use client'

import { useState } from 'react'
import SafeImg from '@/components/SafeImg'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  formatPrice,
  imageUrl,
  primaryImage,
  type Category,
  type Product,
} from '@/lib/products'

/**
 * Products ab DB se aate hain (dekho lib/queries.ts). Ye component
 * client hai — tabs aur wishlist ke liye — isliye data upar se prop
 * mein aata hai, yahan fetch nahi hota.
 */
export default function Products({
  products,
}: {
  products: Record<Category, Product[]>
}) {
  const [active, setActive] = useState<Category>('rugs')
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)

  const toggleWish = (id: string) =>
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const addToCart = (name: string) => {
    setToast(`✓ Added to cart: ${name}`)
    window.setTimeout(() => setToast(null), 2500)
  }

  return (
    <section
      className="prod-sec"
      id="products"
      style={{ paddingTop: '5rem', paddingBottom: '5rem' }}
    >
      <div className="stag green">The EcoWeave® Collection</div>
      <h2 style={{ fontSize: 'clamp(2.4rem,5vw,4.2rem)' }}>
        Every thread,
        <br />
        <em>intentional.</em>
      </h2>
      <p
        style={{
          fontSize: '.92rem',
          color: 'var(--ink-mid)',
          lineHeight: 1.85,
          fontWeight: 300,
          maxWidth: 540,
          margin: '1rem auto 2.5rem',
        }}
      >
        Each product is handwoven or handloomed, made with CiCLO® biodegradable
        polyester, and crafted by artisans in Panipat and Sanganer — where the
        maker is named, the yarn is certified, and the premium you pay reaches
        the person who made it.
      </p>

      <div className="cat-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`ctab${active === cat ? ' active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat} className={`pcat${active === cat ? ' vis' : ''}`}>
          <div className="pgrid pgrid-5">
            {products[cat].map((p) => (
              <div className="pc" key={p.id}>
                <div className="piw">
                  <SafeImg
                    src={imageUrl(primaryImage(p)?.path ?? '')}
                    alt={primaryImage(p)?.alt || p.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      inset: 0,
                    }}
                  />
                  <div className="pph" style={{ display: 'flex' }}>
                    <span className="pph-icon">{p.icon}</span>
                  </div>
                  <span className="eco-badge">CiCLO®</span>
                  <button
                    type="button"
                    className="pwish"
                    aria-label={
                      wishlist.has(p.id)
                        ? `Remove ${p.name} from wishlist`
                        : `Add ${p.name} to wishlist`
                    }
                    aria-pressed={wishlist.has(p.id)}
                    onClick={() => toggleWish(p.id)}
                  >
                    {wishlist.has(p.id) ? '♥' : '♡'}
                  </button>
                </div>
                <div className="pb2">
                  <div className="pn">{p.name}</div>
                  <div className="pd">{p.description}</div>
                  <div className="pf">
                    <span className="pp">{formatPrice(p.price_in_paise)}</span>
                    <span className="ptg">{p.unit}</span>
                    <button
                      type="button"
                      className="padd"
                      onClick={() => addToCart(p.name)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {toast && (
        <div className="cart-toast" role="status">
          {toast}
        </div>
      )}
    </section>
  )
}
