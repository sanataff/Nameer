import { Check, Package } from 'lucide-react'

const stages = ['تمت مراجعة تفاصيل الطلب', 'طلبك قيد التجهيز', 'طلبك بالطريق', 'تم تسليم الطلب']

export function OrderTracking() {
  return (
    <section className="confirmation-tracking" aria-labelledby="tracking-title">
      <h2 id="tracking-title">تتبع طلبك</h2>
      <ol>
        {stages.map((stage, index) => (
          <li key={stage} className={index === 0 ? 'confirmation-stage-complete' : undefined}
            aria-current={index === 0 ? 'step' : undefined}>
            <span className="confirmation-stage-icon" aria-hidden="true">{index === 0 ? <Check /> : <Package />}</span>
            <span>{stage}<span className="sr-only">{index === 0 ? ' — مكتمل' : ' — لم يبدأ بعد'}</span></span>
          </li>
        ))}
      </ol>
    </section>
  )
}
