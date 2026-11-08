import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CupSoda, MessageCircle, Search, ShoppingBag, ShoppingCart, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DirectionProvider } from '@/components/ui/direction'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePageTitle } from '@/hooks/use-page-title'
import '@fontsource-variable/noto-sans-arabic'
import './business-orders.css'
import { Translation, useTranslation } from 'react-i18next'
type Order = { id: string; date: string; business: string; price: number; active: boolean }
type Panel = { title: string; description: string; order?: Order }

// MOCK DATA: frontend demonstration only; no orders are submitted or charged.

const dateFormat = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
})
const priceFormat = new Intl.NumberFormat('ar-SA-u-nu-latn')

function OrderCard({ order, onDetails, onAction }: {

  order: Order
  onDetails: () => void
  onAction: () => void
}) 
{ 




  return (
    <article className="business-order-card" aria-label={`طلب رقم ${order.id}`}>
      <time dateTime={order.date}>{dateFormat.format(new Date(order.date))}</time>
      <div className="business-order-body">
        <div className="business-order-logo" role="img" aria-label="شعار تجريبي لمقهى ليلى">
          <span className="business-order-logo-mark"><CupSoda aria-hidden="true" /></span>
          <span lang="en">Creme Cake</span>
        </div>
        <div className="business-order-info">
          <h3>{order.business}</h3>
          <p>{priceFormat.format(order.price)} ريال</p>
          <button type="button" className="business-order-details" onClick={onDetails}>عرض التفاصيل</button>
        </div>
        <Button size="lg" className="business-order-action" onClick={onAction}>
          {order.active ? 'تتبع الطلب' : 'إعادة الطلب'}
        </Button>
      </div>
    </article>
  )
}

export default function BusinessOrdersPage() {
  const navigate = useNavigate()
  usePageTitle('طلباتك')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<Order[]>([])
  const [panel, setPanel] = useState<Panel | null>(null)
   const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'
  const sampleOrders: Order[] = [
  { id: '1004', date: '2026-09-17', business: t('orderspage.layla'), price: 400, active: true },
  { id: '1003', date: '2026-09-17', business: t('orderspage.layla'), price: 400, active: false },
  { id: '1002', date: '2026-09-17', business:t('orderspage.layla'), price: 400, active: false },
  { id: '1001', date: '2026-09-17', business: t('orderspage.layla'), price: 400, active: false },
]
  const filteredOrders = sampleOrders.filter((order) =>
    `${order.business} ${order.id}`.includes(query.trim()),
  )

  function reorder(order: Order) {
    setCart((current) => [...current, order])
    setPanel({
      title: 'إعادة الطلب',
      description: 'تمت إضافة نسخة تجريبية من الطلب إلى السلة. لن يتم إرسال طلب أو تحصيل مبلغ.',
      order,
    })
  }

  return (
    <DirectionProvider direction="rtl">
      <div className="business-orders-page" dir="rtl" lang="ar">
        <a className="business-orders-skip" href="#business-orders">انتقل إلى الطلبات</a>
        <header className="business-orders-header">
          <nav className="business-orders-nav" aria-label="التنقل الرئيسي">
            <Button variant="ghost" size="icon-lg" aria-label="الملف الشخصي"
              onClick={() => setPanel({ title: 'الملف الشخصي', description: 'حساب تجريبي لعرض واجهة طلبات الأعمال.' })}>
              <Avatar><AvatarFallback><UserRound aria-hidden="true" /></AvatarFallback></Avatar>
            </Button>
            <label className="business-orders-search">
              <Search size={16} aria-hidden="true" />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                placeholder="بحث" aria-label="ابحث باسم المقهى أو رقم الطلب" />
            </label>
            <div className="business-orders-nav-actions">
              <Button variant="ghost" size="icon-lg" aria-label={`السلة، ${cart.length} طلب`}
                onClick={() => navigate('/business/cart')}>
                <ShoppingCart />{cart.length > 0 && <span className="business-cart-count">{cart.length}</span>}
              </Button>
              <Button variant="ghost" size="icon-lg" aria-label="الرسائل"
                onClick={() => setPanel({ title: 'الرسائل', description: 'لا توجد رسائل في هذا العرض التجريبي.' })}>
                <MessageCircle />
              </Button>
              <Button size="lg" render={<a href="#business-orders" aria-current="page" />}>
                <ShoppingBag data-icon="inline-start" />طلبــاتك
              </Button>
            </div>
          </nav>
        </header>

        <main id="business-orders" className="business-orders-main" tabIndex={-1}>
          <h1 className="sr-only">طلباتك</h1>
          {([true, false] as const).map((active) => {
            const orders = filteredOrders.filter((order) => order.active === active)
            const title = active ? 'طلبات قيد التنفيذ' : 'الطلبات السابقة'
            return (
              <section key={title} className="business-orders-section" aria-labelledby={active ? 'active-orders-title' : 'previous-orders-title'}>
                <h2 id={active ? 'active-orders-title' : 'previous-orders-title'}>{title}</h2>
                <div className="business-orders-list">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order}
                      onDetails={() => setPanel({ title: 'تفاصيل الطلب', description: 'بيانات طلب تجريبية للعرض فقط.', order })}
                      onAction={() => active
                        ? setPanel({ title: 'تتبع الطلب', description: 'قيد التجهيز — سيتم تحديث الحالة عند تسليم الطلب للمندوب. هذه حالة تجريبية وليست تتبعاً مباشراً.', order })
                        : reorder(order)} />
                  ))}
                  {orders.length === 0 && <p className="business-orders-empty" role="status">لا توجد طلبات مطابقة لبحثك.</p>}
                </div>
              </section>
            )
          })}
        </main>

        <Dialog open={panel !== null} onOpenChange={(open) => { if (!open) setPanel(null) }}>
          <DialogContent dir="rtl" lang="ar" closeLabel="إغلاق">
            <DialogHeader>
              <DialogTitle>{panel?.title}</DialogTitle>
              <DialogDescription>{panel?.description}</DialogDescription>
            </DialogHeader>
            {panel?.order && (
              <dl className="business-order-summary">
                <div><dt>رقم الطلب</dt><dd>{panel.order.id}</dd></div>
                <div><dt>المقهى</dt><dd>{panel.order.business}</dd></div>
                <div><dt>تاريخ الطلب</dt><dd>{dateFormat.format(new Date(panel.order.date))}</dd></div>
                <div><dt>الإجمالي</dt><dd>{priceFormat.format(panel.order.price)} ريال</dd></div>
              </dl>
            )}
          </DialogContent>
        </Dialog>
        
      </div>
    </DirectionProvider>
  )
}
