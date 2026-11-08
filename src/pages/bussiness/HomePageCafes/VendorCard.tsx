import { Clock3, Heart, ShoppingBag, Star } from 'lucide-react'
import type { DessertVendor } from './vendors'

type VendorCardProps = {
  vendor: DessertVendor
  isFavorite: boolean
  onToggleFavorite: (vendorName: string) => void
  onNotice: (message: string) => void
}

export default function VendorCard({
  vendor,
  isFavorite,
  onToggleFavorite,
  onNotice,
}: VendorCardProps) {
  return (
    <article className="marketplace-vendor-card">
      <div
        className={`marketplace-vendor-artwork artwork-${vendor.artwork}`}
        role="group"
        aria-label={`${vendor.name} — ${vendor.specialty}`}
      >
        <span className="marketplace-artwork-tag">{vendor.tag}</span>
        <span className="marketplace-artwork-sun" aria-hidden="true" />
        <span className="marketplace-dessert-emoji" aria-hidden="true">
          {vendor.dessert}
        </span>
        <button
          className={`marketplace-favorite${isFavorite ? ' is-favorite' : ''}`}
          type="button"
          aria-label={
            isFavorite
              ? `إزالة ${vendor.name} من المفضلة`
              : `إضافة ${vendor.name} إلى المفضلة`
          }
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(vendor.name)}
        >
          <Heart aria-hidden="true" />
        </button>
      </div>
      <div className="marketplace-vendor-body">
        <div className="marketplace-vendor-topline">
          <span className={`marketplace-vendor-avatar avatar-${vendor.artwork}`}>
            {vendor.initials}
          </span>
          <span className="marketplace-rating">
            <Star aria-hidden="true" />
            {vendor.rating}
          </span>
        </div>
        <h3>{vendor.name}</h3>
        <p className="marketplace-vendor-specialty">{vendor.specialty}</p>
        <div className="marketplace-vendor-details">
          <span>
            <Clock3 aria-hidden="true" />
            {vendor.delivery}
          </span>
          <span>
            <ShoppingBag aria-hidden="true" />
            حد أدنى {vendor.minimum}
          </span>
        </div>
        <div className="marketplace-vendor-buttons">
          <button
            className="marketplace-browse-button"
            type="button"
            onClick={() => onNotice(`قريباً: تصفح منتجات ${vendor.name}`)}
          >
            تصفح المنتجات
          </button>
          <button
            className="marketplace-contact-button"
            type="button"
            onClick={() => onNotice(`قريباً: تواصل مع ${vendor.name}`)}
          >
            تواصل معنا
          </button>
        </div>
      </div>
    </article>
  )
}
