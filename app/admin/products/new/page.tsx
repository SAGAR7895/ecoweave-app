import Link from 'next/link'

import ProductForm from '../product-form'

export default function NewProductPage() {
  return (
    <>
      <div className="adm-head">
        <h1>New product</h1>
        <Link href="/admin/products" className="adm-link">
          ← Products
        </Link>
      </div>

      <div className="adm-card">
        <ProductForm />
      </div>

      <p className="adm-hint">
        Photos come next — they need the product&rsquo;s id, which only exists
        once it has been saved.
      </p>
    </>
  )
}
