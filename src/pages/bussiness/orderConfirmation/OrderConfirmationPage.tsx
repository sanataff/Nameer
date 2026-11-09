import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { DirectionProvider } from '@/components/ui/direction'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePageTitle } from '@/hooks/use-page-title'
import { CartNavbar } from '../shoppingCart/CartNavbar'
import { useCart } from '../shoppingCart/cart-context'
import { OrderTracking } from './OrderTracking'
import { OrderDetails } from './OrderDetails'
import { ContactUs } from './ContactUs'
import '@fontsource-variable/noto-sans-arabic'
import '../shoppingCart/shopping-cart.css'
import './order-confirmation.css'

export default function OrderConfirmationPage() {
  usePageTitle('تأكيد الطلب')
  const { submittedOrder } = useCart()
  const [query, setQuery] = useState('')
  const [panel, setPanel] = useState<{ title: string; description: string } | null>(null)
  return (
    <DirectionProvider direction="rtl">
      <div className="order-confirmation-page shopping-cart-page" dir="rtl" lang="ar">
        <CartNavbar query={query} onQueryChange={setQuery} onPanel={(title, description) => setPanel({ title, description })} />
        <main className="confirmation-main">
          {submittedOrder ? <>
            <h1>تم استلام طلبك بنجاح!</h1>
            <div className="confirmation-panel">
              <OrderTracking />
              <OrderDetails items={submittedOrder.items} query={query} />
              <ContactUs onContact={() => setPanel({ title: 'تواصل معنا', description: 'خدمة التواصل غير متصلة بعد في هذا العرض التجريبي. لم يتم إرسال أي رسالة.' })} />
              <p className="confirmation-demo-note">تأكيد تجريبي فقط؛ لم يتم حفظ طلب حقيقي أو تحصيل مبلغ. مراحل التتبع للعرض فقط.</p>
              <Button className="confirmation-home" size="lg" render={<Link to="/" />}>العودة إلى الصفحة الرئيسية</Button>
            </div>
          </> : <div className="confirmation-panel">
            <h1>لا يوجد طلب مؤكد لعرضه</h1>
            <p>أكمل خطوات الطلب من السلة أولاً. بيانات التأكيد التجريبي لا تبقى بعد تحديث الصفحة.</p>
            <Button render={<Link to="/business/cart" />}>العودة إلى السلة</Button>
          </div>}
        </main>
        <Dialog open={panel !== null} onOpenChange={(open) => { if (!open) setPanel(null) }}>
          <DialogContent dir="rtl" lang="ar" closeLabel="إغلاق">
            <DialogHeader><DialogTitle>{panel?.title}</DialogTitle><DialogDescription>{panel?.description}</DialogDescription></DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </DirectionProvider>
  )
}
