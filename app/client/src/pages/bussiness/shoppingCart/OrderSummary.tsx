import { Button } from '@/components/ui/button'
import { formatSAR, type CartProduct } from './cart-data'

type Props = { items: CartProduct[]; onCheckout: () => void }

export function OrderSummary({ items, onCheckout }: Props) {
  const businesses = [...new Set(items.map((item) => item.business))]
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  return (
    <aside className="shopping-cart-summary" aria-labelledby="cart-summary-title">
      <h2 id="cart-summary-title">ملخص الطلب</h2>
      <p>{businesses.length ? `طلب من متجر ${businesses.join('، ')}` : 'لا توجد منتجات في السلة'}</p>
      <p aria-live="polite" aria-atomic="true">المجموع: {formatSAR(total)}</p>
      <Button size="lg" disabled={items.length === 0} onClick={onCheckout}>إتمام الطلب</Button>
    </aside>
  )
}
