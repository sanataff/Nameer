import type { DessertVendor } from './vendors'
import VendorCard from './VendorCard'

type VendorGridProps = {
  vendors: DessertVendor[]
  favorites: string[]
  onToggleFavorite: (vendorName: string) => void
  onResetFilters: () => void
}

export default function VendorGrid({
  vendors,
  favorites,
  onToggleFavorite,
  onResetFilters,
}: VendorGridProps) {
  if (vendors.length === 0) {
    return (
      <div className="marketplace-empty-state" role="status">
        <span aria-hidden="true">🍪</span>
        <h3>ما لقينا متجراً بهذا الاسم</h3>
        <p>جرّب البحث بكلمة ثانية أو اختر تصنيفاً مختلفاً.</p>
        <button type="button" onClick={onResetFilters}>
          عرض كل المتاجر
        </button>
      </div>
    )
  }

  return (
    <div className="marketplace-vendor-grid">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.name}
          vendor={vendor}
          isFavorite={favorites.includes(vendor.name)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
