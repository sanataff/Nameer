import { Star } from 'lucide-react'

const reviews = [
  {
    name: 'نورة العتيبي',
    initials: 'ن',
    color: 'review-avatar-rose',
    rating: '٥.٠',
    text: 'البراوني لذيذ جداً والتغليف مرتب، أكيد راح أطلب مرة ثانية.',
  },
  {
    name: 'سارة الحربي',
    initials: 'س',
    color: 'review-avatar-sage',
    rating: '٥.٠',
    text: 'التيراميسو خفيف وطازج، صار خياري المفضل مع القهوة.',
  },
  {
    name: 'ريم القحطاني',
    initials: 'ر',
    color: 'review-avatar-sand',
    rating: '٤.٨',
    text: 'تشكيلة رائعة وخدمة لطيفة، الميني تشيزكيك جميل للضيافة.',
  },
]

export default function ReviewsSection() {
  return (
    <section className="dessert-reviews" aria-labelledby="dessert-reviews-title">
      <div className="dessert-reviews-heading">
        <div>
          <span className="browse-products-eyebrow">من تجارب عملائنا</span>
          <h2 id="dessert-reviews-title">تقييمات حلويات ليلى</h2>
        </div>
        <span className="dessert-reviews-summary">
          <Star aria-hidden="true" />
          ٤.٩ <small>من ٥</small>
        </span>
      </div>

      <div className="dessert-reviews-grid">
        {reviews.map((review) => (
          <article className="dessert-review-card" key={review.name}>
            <div className="dessert-review-header">
              <span className={`dessert-review-avatar ${review.color}`} aria-hidden="true">
                {review.initials}
              </span>
              <div className="dessert-review-author">
                <h3>{review.name}</h3>
                <span>عميل موثّق</span>
              </div>
              <span className="dessert-review-rating">
                <Star aria-hidden="true" />
                {review.rating}
              </span>
            </div>
            <p>{review.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
