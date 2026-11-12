import { Clock3, Heart, ShoppingBag, Star } from 'lucide-react'
import { Link } from 'react-router'
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
        className="marketplace-vendor-artwork"
        role="group"
        aria-label={`${vendor.name} — ${vendor.specialty}`}
      >
        <img className="marketplace-vendor-image" src={vendor.artwork} alt="" />
        <span className="marketplace-artwork-tag">{vendor.tag}</span>
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
          <span className="marketplace-vendor-avatar">
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
          <Link
            className="marketplace-browse-button"
            to="/business/browse-products"
          >
            تصفح المنتجات
          </Link>
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
