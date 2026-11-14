import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { DirectionProvider } from '@/components/ui/direction'
import { usePageTitle } from '@/hooks/use-page-title'
import { useCart } from '../shoppingCart/cart-context'
import { CartNavbar } from '../shoppingCart/CartNavbar'
import { OrderSummary } from './OrderSummary'
import { CustomerInfo } from './CustomerInfo'
import { DeliveryAddress } from './DeliveryAddress'
import { PaymentMethod } from './PaymentMethod'
import { PlaceOrderButton } from './PlaceOrderButton'
import type { Address, Payment } from './checkout-types'
import '@fontsource-variable/noto-sans-arabic'
import '../shoppingCart/shopping-cart.css'
import './checkout.css'

export default function CheckoutPage() {
  usePageTitle('إتمام الطلب')
  const { items, setItems, setSubmittedOrder } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  // MOCK ADDRESS: new addresses exist only for this checkout session.
  const [addresses, setAddresses] = useState<Address[]>([{ id: 'demo-address', label: 'السعودية - الظهران - الحزام الأكاديمي - الشباب' }])
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState<Payment | ''>('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function submit() {
    if (submitted) return
    if (!items.length) { setError('السلة فارغة. أضف منتجات قبل إتمام الطلب.'); return }
    if (!addresses.some((saved) => saved.id === address)) { setError('يرجى اختيار عنوان التوصيل.'); return }
    if (!payment) { setError('يرجى اختيار طريقة الدفع.'); return }
    setError('')
    setSubmitted(true)
    // Snapshot the validated order so later cart edits do not change this receipt.
    setSubmittedOrder({
      items: items.map((item) => ({ ...item })),
      address: addresses.find((saved) => saved.id === address)!.label,
      payment,
    })
    setItems([])
    navigate('/business/order-confirmation', { replace: true })
  }

  return (
    <DirectionProvider direction="rtl">
      <div className="checkout-page shopping-cart-page" dir="rtl" lang="ar">
        <CartNavbar query={query} onQueryChange={setQuery} />
        <main className="checkout-main">
          <OrderSummary items={items} query={query} />
          {!items.length
              ? <section className="checkout-panel"><p>سلة التسوق فارغة.</p><Button nativeButton={false} render={<Link to="/business/cart" />}>العودة إلى السلة</Button></section>
              : <div className="checkout-panel">
                  <CustomerInfo />
                  <DeliveryAddress addresses={addresses} selected={address} onSelect={(value) => { setAddress(value); setError('') }}
                    onAdd={(label) => {
                      const id = crypto.randomUUID()
                      setAddresses((current) => [...current, { id, label }])
                      setAddress(id); setError('')
                    }} />
                  <PaymentMethod selected={payment} onSelect={(value) => { setPayment(value); setError('') }} />
                  <PlaceOrderButton disabled={submitted} onSubmit={submit} error={error} />
                </div>}
        </main>
      </div>
    </DirectionProvider>
  )
}
