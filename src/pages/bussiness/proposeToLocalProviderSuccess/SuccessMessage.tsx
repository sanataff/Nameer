import { Check } from 'lucide-react'
import { Link } from 'react-router'

export default function SuccessMessage() {
  return (
    <section className="proposal-success-content" aria-labelledby="success-title">
      <div className="proposal-success-icon" aria-hidden="true">
        <span>
          <Check />
        </span>
      </div>
      <span className="proposal-success-eyebrow">شكراً لثقتك بنا</span>
      <h1 id="success-title">تم استلام طلبك بنجاح!</h1>
      <p>الرجاء الاطلاع على البريد الإلكتروني لمتابعة تحديثات الطلب</p>
      <Link className="proposal-success-home-button" to="/business/home-page-cafes">
        العودة إلى الصفحة الرئيسية
      </Link>
      <span className="proposal-success-reference">
        سنبقيك على اطلاع بكل جديد
      </span>
    </section>
  )
}
