import { ArrowDown } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="marketplace-hero" aria-labelledby="marketplace-title">
      <div className="marketplace-hero-copy">
        <h1 id="marketplace-title">اكتشف متاجر التوريد</h1>
        <p>تعرّف على المخابز ومحلات الحلويات للاسر المنتجة واستكشف تشكيلاتها في مكان واحد.</p>
        <a className="marketplace-hero-cta" href="#vendors-title">
          تصفح المتاجر
          <ArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
