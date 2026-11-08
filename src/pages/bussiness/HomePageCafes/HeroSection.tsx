import { Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="marketplace-hero" aria-labelledby="marketplace-title">
      <div className="marketplace-hero-copy">
        <span className="marketplace-eyebrow">
          <Sparkles aria-hidden="true" />
          حلويات مختارة بعناية
        </span>
        <h1 id="marketplace-title">يا هلا!</h1>
        <p>تصفح آخر المنشورات والعروض</p>
        <div className="marketplace-hero-promise">
          <span className="marketplace-promise-icon" aria-hidden="true">♡</span>
          <span>لحظات حلوة تبدأ من هنا</span>
        </div>
      </div>
      <div className="marketplace-hero-art" aria-hidden="true">
        <span className="marketplace-hero-sparkle marketplace-hero-sparkle-one">✦</span>
        <span className="marketplace-hero-sparkle marketplace-hero-sparkle-two">✧</span>
        <span className="marketplace-hero-dessert">🧁</span>
        <span className="marketplace-hero-cookie">🍪</span>
      </div>
    </section>
  )
}
