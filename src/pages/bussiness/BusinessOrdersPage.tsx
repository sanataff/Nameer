import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { CupSoda, MessageCircle, Search, ShoppingBag, ShoppingCart, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DirectionProvider } from '@/components/ui/direction'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePageTitle } from '@/hooks/use-page-title'
import { useCart } from './shoppingCart/cart-context'
import { mergeCartItems, sampleCart, type CartProduct } from './shoppingCart/cart-data'
import '@fontsource-variable/noto-sans-arabic'
import './business-orders.css'
import { useTranslation } from 'react-i18next'
type Order = { id: string; date: string; business: string; price: number; active: boolean; items?: CartProduct[] }
type Panel = { title: string; description: string; order?: Order; type?: 'tracking' }

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
    <div className="business-order-top">
      <time dateTime={order.date}>{dateFormat.format(new Date(order.date))}</time>
       <span className={`business-order-status ${order.active ? 'active' : 'completed'}`}>
    {order.active ? 'قيد التنفيذ' : 'مكتمل'}
      </span>
    </div>
      <div className="business-order-body">
        <div className="business-order-logo" role="img" aria-label="شعار مقهى ليلى">
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
  const { items, setItems, submittedOrder } = useCart()
  usePageTitle('طلباتك')
  const [query, setQuery] = useState('')
  const [panel, setPanel] = useState<Panel | null>(null)
  const { t } = useTranslation()
  const sampleOrders: Order[] = [
  { id: '1004', date: '2026-09-17', business: t('orderspage.layla'), price: 400, active: true },
  { id: '1003', date: '2026-09-17', business: t('orderspage.layla'), price: 400, active: false },
  { id: '1002', date: '2026-09-17', business:t('orderspage.layla'), price: 400, active: false },
  { id: '1001', date: '2026-09-17', business: t('orderspage.layla'), price: 400, active: false },
]
  const confirmedOrder: Order | null = submittedOrder ? {
    id: 'latest',
    date: new Date().toISOString().slice(0, 10),
    business: [...new Set(submittedOrder.items.map((item) => item.business))].join('، '),
    price: submittedOrder.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    active: true,
    items: submittedOrder.items,
  } : null
  const orders = confirmedOrder ? [confirmedOrder, ...sampleOrders] : sampleOrders
  const visibleOrders = orders.filter((order) =>
    `${order.business} ${order.id}`.includes(query.trim()),
  )

  function reorder(order: Order) {
    setItems((current) => mergeCartItems(current, order.items ?? sampleCart))
    navigate('/business/cart')
  }

  return (
    <DirectionProvider direction="rtl">
      <div className="business-orders-page" dir="rtl" lang="ar">
        <a className="business-orders-skip" href="#business-orders">انتقل إلى الطلبات</a>
        <header className="business-orders-header">
          <nav className="business-orders-nav" aria-label="التنقل الرئيسي">
            <Button nativeButton={false} variant="ghost" size="icon-lg" aria-label="الملف الشخصي"
              render={<Link to="/business/account-settings" />}>
              <Avatar><AvatarFallback><UserRound aria-hidden="true" /></AvatarFallback></Avatar>
            </Button>
            <label className="business-orders-search">
              <Search size={16} aria-hidden="true" />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                placeholder="بحث" aria-label="ابحث باسم المقهى أو رقم الطلب" />
            </label>
            <div className="business-orders-nav-actions">
              <Button nativeButton={false} variant="ghost" size="icon-lg" aria-label={`السلة، ${items.reduce((count, item) => count + item.quantity, 0)} قطعة`}
                render={<Link to="/business/cart" />}>
                <ShoppingCart />
              </Button>
              <Button nativeButton={false} variant="ghost" size="icon-lg" aria-label="الرسائل"
                render={<Link to="/business/chat" />}>
                <MessageCircle />
              </Button>
              <Button nativeButton={false} size="lg" render={<Link to="/business/orders" aria-current="page" />}>
                <ShoppingBag data-icon="inline-start" />طلبــاتك
              </Button>
            </div>
          </nav>
        </header>

        <main id="business-orders" className="business-orders-main" tabIndex={-1}>
          <h1 className="sr-only">طلباتك</h1>
          {([true, false] as const).map((active) => {
            const sectionOrders = visibleOrders.filter((order) => order.active === active)
            const title = active ? 'طلبات قيد التنفيذ' : 'الطلبات السابقة'
            return (
              <section key={title} className="business-orders-section" aria-labelledby={active ? 'active-orders-title' : 'previous-orders-title'}>
                <h2 id={active ? 'active-orders-title' : 'previous-orders-title'}>{title}</h2>
                <div className="business-orders-list">
                  {sectionOrders.map((order) => (
                    <OrderCard key={order.id} order={order}
                      onDetails={() => setPanel({ title: 'تفاصيل الطلب', description: 'تفاصيل الطلب.', order })}
                      onAction={() => active
                        ? setPanel({  type: 'tracking', title: 'تتبع الطلب', description: 'حالة طلبك الحالية', order })
                        : reorder(order)} />
                  ))}
                  {sectionOrders.length === 0 && <p className="business-orders-empty" role="status">لا توجد طلبات مطابقة لبحثك.</p>}
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
            {panel?.type === 'tracking' && (
  <div className="business-tracking">
    {[
      'تم استلام الطلب',
      'قيد التجهيز',
      'الطلب بالطريق',
      'تم تسليم الطلب'
    ].map((step, index) => (
      <div className="business-tracking-step" key={step}>
        <span
          className={`business-tracking-dot ${index <= 1 ? 'completed' : ''}`}
        >
          {index <= 1 ? '✓' : '○'}
        </span>
        <span>{step}</span>
      </div>
    ))}
  </div>
        )}
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
