import Link from 'next/link'

import ProductForm from '../product-form'

export default function NewProductPage() {
  return (
    <>
      <div className="adm-head">
        <h1>Naya product</h1>
        <Link href="/admin/products" className="adm-link">
          ← Products
        </Link>
      </div>

      <div className="adm-card">
        <ProductForm />
      </div>

      <p className="adm-hint">
        Photos agle step pe lagengi — unhe product ki id chahiye hoti hai,
        jo save karne pe hi banti hai.
      </p>
    </>
  )
}
