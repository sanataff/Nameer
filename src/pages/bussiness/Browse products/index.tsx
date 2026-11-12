import { useState } from 'react'
import CustomOrderCTA from './CustomOrderCTA'
import ProductCard, { mockProducts } from './ProductCard'
import ProductsNavbar from './ProductsNavbar'
import ReviewsSection from './ReviewsSection'
import './browseProducts.css'

export default function BrowseProductsPage() {
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const filteredProducts = mockProducts.filter((product) =>
    `${product.name} ${product.description}`.includes(search.trim()),
  )

  return (
    <div className="browse-products-page" dir="rtl" lang="ar">
      <ProductsNavbar
        search={search}
        onSearchChange={setSearch}
        onNotice={setNotice}
      />
      <main className="browse-products-main">
        <header className="browse-products-heading">
          <div>
            <span className="browse-products-eyebrow">صنع بحب، ويُقدّم طازجاً</span>
            <h1>حلويات ليلى</h1>
            <p>تصفح المنتجات والأسعار</p>
          </div>
          <span className="browse-products-count">
            {filteredProducts.length.toLocaleString('ar-SA')} منتجات
          </span>
        </header>

        {notice && (
          <div className="browse-products-toast" role="status" aria-live="polite">
            <span aria-hidden="true">✓</span>
            <span>{notice}</span>
            <button
              type="button"
              aria-label="إخفاء الإشعار"
              onClick={() => setNotice('')}
            >
              ×
            </button>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <section className="browse-products-grid" aria-label="منتجات حلويات ليلى">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={() => setNotice(`أضفنا ${product.name} إلى اختياراتك`)}
              />
            ))}
          </section>
        ) : (
          <div className="browse-products-empty" role="status">
            <span aria-hidden="true">⌕</span>
            <h2>ما لقينا منتجات بهذا الاسم</h2>
            <p>جرّب البحث بكلمة ثانية.</p>
            <button type="button" onClick={() => setSearch('')}>
              عرض كل المنتجات
            </button>
          </div>
        )}

        <CustomOrderCTA />
        <ReviewsSection />
      </main>
      <footer className="browse-products-footer">
        <span className="browse-products-footer-mark" aria-hidden="true">ل</span>
        <span>حلويات ليلى</span>
        <span className="browse-products-footer-divider" aria-hidden="true" />
        <span>حلاوة كل يوم تبدأ من هنا</span>
      </footer>
    </div>
  )
}
