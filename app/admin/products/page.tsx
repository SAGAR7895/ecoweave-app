import Link from 'next/link'

import SafeImg from '@/components/SafeImg'
import { getAllProducts } from '@/lib/queries'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  formatPrice,
  imageUrl,
  primaryImage,
} from '@/lib/products'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>
}) {
  const { deleted } = await searchParams
  const products = await getAllProducts()

  return (
    <>
      <div className="adm-head">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="adm-btn adm-btn-primary">
          + New product
        </Link>
      </div>

      {deleted === '1' && <div className="msg msg-ok">Product deleted.</div>}

      {CATEGORIES.map((cat) => {
        const rows = products.filter((p) => p.category === cat)

        return (
          <div className="adm-card" key={cat}>
            <h2>
              {CATEGORY_LABELS[cat]} <span className="adm-count">{rows.length}</span>
            </h2>

            {rows.length === 0 ? (
              <p className="adm-hint">No products in this category yet.</p>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th style={{ width: 64 }}>Photo</th>
                    <th>Name</th>
                    <th className="adm-num">Price</th>
                    <th className="adm-num">Photos</th>
                    <th>Status</th>
                    <th className="adm-num">Order</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => {
                    const main = primaryImage(p)
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="adm-thumb">
                            {main ? (
                              <SafeImg src={imageUrl(main.path)} alt={main.alt || p.name} />
                            ) : (
                              <span className="adm-thumb-empty">{p.icon || '—'}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <Link href={`/admin/products/${p.id}`} className="adm-strong">
                            {p.name}
                          </Link>
                          <div className="adm-sub">{p.unit}</div>
                        </td>
                        <td className="adm-num">{formatPrice(p.price_in_paise)}</td>
                        <td className="adm-num">{p.images.length}</td>
                        <td>
                          {p.is_published ? (
                            <span className="adm-pill adm-pill-ok">Live</span>
                          ) : (
                            <span className="adm-pill adm-pill-mute">Draft</span>
                          )}
                        </td>
                        <td className="adm-num">{p.sort_order}</td>
                        <td className="adm-num">
                          <Link href={`/admin/products/${p.id}`} className="adm-link">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )
      })}
    </>
  )
}
