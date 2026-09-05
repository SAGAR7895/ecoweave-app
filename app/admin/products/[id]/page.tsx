import Link from 'next/link'
import { notFound } from 'next/navigation'

import SafeImg from '@/components/SafeImg'
import { getProduct } from '@/lib/queries'
import { imageUrl } from '@/lib/products'
import { deleteImage, deleteProduct, makePrimaryImage } from '@/app/admin/actions'
import ConfirmButton from '@/app/admin/confirm-button'
import ProductForm from '../product-form'
import PhotoUploader from '../photo-uploader'

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ created?: string }>
}) {
  const { id } = await params
  const { created } = await searchParams

  const product = await getProduct(id)
  if (!product) notFound()

  return (
    <>
      <div className="adm-head">
        <h1>{product.name}</h1>
        <Link href="/admin/products" className="adm-link">
          ← Products
        </Link>
      </div>

      {created === '1' && (
        <div className="msg msg-ok">
          Product created. Add the photos, then tick “Show on the shop” and save.
        </div>
      )}

      <div className="adm-card">
        <h2>Details</h2>
        <ProductForm product={product} />
      </div>

      <div className="adm-card">
        <h2>
          Photos <span className="adm-count">{product.images.length}</span>
        </h2>

        <PhotoUploader productId={product.id} />

        {product.images.length === 0 ? (
          <p className="adm-hint">
            No photos yet. Without one, the shop card shows only the icon.
          </p>
        ) : (
          <div className="adm-photos">
            {product.images.map((img, index) => (
              <figure className="adm-photo" key={img.id}>
                <SafeImg src={imageUrl(img.path)} alt={img.alt || product.name} />

                {index === 0 && <span className="adm-photo-main">On the shop</span>}

                <figcaption>
                  {index !== 0 && (
                    <form action={makePrimaryImage}>
                      <input type="hidden" name="image_id" value={img.id} />
                      <input type="hidden" name="product_id" value={product.id} />
                      <button type="submit" className="adm-link">
                        Make main
                      </button>
                    </form>
                  )}

                  <form action={deleteImage}>
                    <input type="hidden" name="image_id" value={img.id} />
                    <input type="hidden" name="product_id" value={product.id} />
                    <ConfirmButton
                      className="adm-link adm-link-danger"
                      message="Remove this photo? It cannot be brought back."
                      pendingLabel="Removing…"
                    >
                      Remove
                    </ConfirmButton>
                  </form>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      <div className="adm-card adm-card-danger">
        <h2>Delete product</h2>
        <p className="adm-hint">
          The product and all of its photos go for good. To take it off the shop
          without losing it, untick “Show on the shop” above instead.
        </p>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <ConfirmButton
            className="adm-btn adm-btn-danger"
            message={`"${product.name}" and all of its photos will be deleted permanently. Are you sure?`}
            pendingLabel="Deleting…"
          >
            Delete permanently
          </ConfirmButton>
        </form>
      </div>
    </>
  )
}
