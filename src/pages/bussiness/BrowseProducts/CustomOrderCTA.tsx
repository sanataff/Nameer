import { ArrowLeft, Sparkles } from 'lucide-react'
import { Link } from 'react-router'

export default function CustomOrderCTA() {
  return (
    <section className="custom-order-cta" aria-labelledby="custom-order-title">
      <span className="custom-order-icon" aria-hidden="true">
        <Sparkles />
      </span>
      <div className="custom-order-copy">
        <h2 id="custom-order-title">تحتاج كميات أكبر أو طلب مخصص؟</h2>
        <p>نجهز لك عرضاً يناسب مناسبتك واحتياجك بكل عناية.</p>
      </div>
      <Link className="custom-order-button" to="/business/propose-to-local-provider">
        أطلب طلب مخصص
        <ArrowLeft aria-hidden="true" />
      </Link>
    </section>
  )
}
