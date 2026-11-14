import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { DirectionProvider } from '@/components/ui/direction'
import { usePageTitle } from '@/hooks/use-page-title'
import { Navbar } from '../shoppingCart/Navbar'
import { useCart } from '../shoppingCart/cart-context'
import { OrderTracking } from './OrderTracking'
import { OrderDetails } from './OrderDetails'
import { ContactUs } from './ContactUs'
import '@fontsource-variable/noto-sans-arabic'
import '../shoppingCart/shopping-cart.css'
import './order-confirmation.css'
import { Check } from 'lucide-react'

export default function OrderConfirmationPage() {
  usePageTitle('تأكيد الطلب')
  const { submittedOrder } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  return (
    <DirectionProvider direction="rtl">
      <div className="order-confirmation-page shopping-cart-page" dir="rtl" lang="ar">
        <Navbar query={query} onQueryChange={setQuery} />
        <main className="confirmation-main">
          {submittedOrder ? <>
          <div className="confirmation-success">
            <div className="confirmation-success-icon">
              <Check size={32} />
            </div>
            <h1>تم تأكيد طلبك بنجاح!</h1>
            <p>شكرًا لطلبك، يمكنك متابعة حالة طلبك أدناه.</p>
          </div>
            <div className="confirmation-panel">
              <OrderTracking />
              <OrderDetails items={submittedOrder.items} query={query} />
              <ContactUs onContact={() => navigate('/business/chat')} />
              <Button nativeButton={false} className="confirmation-home" size="lg" render={<Link to="/business/home-page-cafes" />}>العودة إلى الصفحة الرئيسية</Button>
            </div>
          </> : <div className="confirmation-panel">
            <h1>لا يوجد طلب مؤكد لعرضه</h1>
            <p>أكمل خطوات الطلب من السلة أولاً. تفاصيل التأكيد لا تبقى بعد تحديث الصفحة.</p>
            <Button nativeButton={false} render={<Link to="/business/cart" />}>العودة إلى السلة</Button>
          </div>}
        </main>
      </div>
    </DirectionProvider>
  )
}
