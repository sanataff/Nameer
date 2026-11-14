import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatSAR, type CartProduct } from '../shoppingCart/cart-data'

export function OrderSummary({ items, query }: { items: CartProduct[]; query: string }) {
  const [expanded, setExpanded] = useState(false)
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const visible = items.filter((item) => item.name.includes(query.trim()))
  return (
    <section className="checkout-summary" aria-labelledby="checkout-summary-title">
      <div className="checkout-summary-heading">
        <h1 id="checkout-summary-title">ملخص الطلب</h1>
        <strong aria-live="polite">المجموع: {formatSAR(total)}</strong>
      </div>
      <Button className="checkout-details-button" onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded} aria-controls="checkout-details">{expanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</Button>
      {(expanded || query.trim()) && (
        <ul id="checkout-details" className="checkout-details">
          {visible.map((item) => <li key={item.id}><span>{item.name} × {item.quantity}</span><span>{formatSAR(item.quantity * item.unitPrice)}</span></li>)}
          {!visible.length && <li>لا توجد منتجات مطابقة.</li>}
        </ul>
      )}
    </section>
  )
}
