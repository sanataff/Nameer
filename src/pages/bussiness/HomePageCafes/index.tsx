import { useState } from 'react'
import '@fontsource-variable/noto-sans-arabic'
import { categories, vendors } from './vendors'
import CategoryTabs from './CategoryTabs'
import HeroSection from './HeroSection'
import MarketplaceFooter from './MarketplaceFooter'
import NoticeBanner from './NoticeBanner'
import VendorGrid from './VendorGrid'
import './HomePage-Cafes.css'
import { Navbar } from '../shoppingCart/Navbar'
import '@/App.css'
import '../shoppingCart/shopping-cart.css'
import '../chat/business-chat.css'

export default function CafesMarketplacePage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('الكل')
  const [notice, setNotice] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const visibleVendors = vendors.filter((vendor) => {
    const matchesSearch = `${vendor.name} ${vendor.specialty}`.includes(search.trim())
    const matchesCategory =
      selectedCategory === 'الكل' || vendor.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (vendorName: string) => {
    const isFavorite = favorites.includes(vendorName)
    setFavorites((current) =>
      isFavorite
        ? current.filter((name) => name !== vendorName)
        : [...current, vendorName],
    )
    setNotice(
      isFavorite
        ? `أزلنا ${vendorName} من مفضلاتك`
        : `أضفنا ${vendorName} إلى مفضلاتك`,
    )
  }

  return (
    <div className="marketplace-page" dir="rtl" lang="ar">
      <Navbar query={search} onQueryChange={setSearch} searchLabel="ابحث عن متجر أو حلوى" />
      <main className="marketplace-main">
        {notice && <NoticeBanner message={notice} onDismiss={() => setNotice('')} />}
        <HeroSection />
        <section className="marketplace-vendors" aria-labelledby="vendors-title">
          <div className="marketplace-section-heading">
            <div>
              <span className="marketplace-section-kicker">نكهات تستحق التجربة</span>
              <h2 id="vendors-title">اكتشف متاجر الحلويات</h2>
              <p>تشكيلة لذيذة من متاجر قريبة منك</p>
            </div>
            <span className="marketplace-vendor-count">
              {visibleVendors.length.toLocaleString('ar-SA')} متاجر
            </span>
          </div>
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <VendorGrid
            vendors={visibleVendors}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onResetFilters={() => {
              setSearch('')
              setSelectedCategory('الكل')
            }}
          />
        </section>
        <MarketplaceFooter />
      </main>
    </div>
  )
}
