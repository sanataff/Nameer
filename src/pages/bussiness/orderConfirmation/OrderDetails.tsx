import { useState } from 'react'
import { formatSAR, type CartProduct } from '../shoppingCart/cart-data'

function PurchasedProduct({ item }: { item: CartProduct }) {
  const [failed, setFailed] = useState(false)
  return (
    <li className="confirmation-product">
      {failed ? <div className="confirmation-product-image" role="img" aria-label={item.name}>{item.name}</div>
        : <img className="confirmation-product-image" src={item.image} alt={item.name} onError={() => setFailed(true)} />}
      <div><h3>{item.name}</h3><p>الكمية: {item.quantity}</p></div>
      <p>المجموع: {formatSAR(item.quantity * item.unitPrice)}</p>
    </li>
  )
}

export function OrderDetails({ items, query }: { items: CartProduct[]; query: string }) {
  const visible = items.filter((item) => item.name.includes(query.trim()))
  return (
    <section className="confirmation-order-details" aria-labelledby="confirmation-details-title">
      <h2 id="confirmation-details-title">تفاصيل الطلب</h2>
      <ul>{visible.map((item) => <PurchasedProduct key={item.id} item={item} />)}</ul>
      {!visible.length && <p role="status">لا توجد منتجات مطابقة لبحثك.</p>}
      <p className="confirmation-total">إجمالي الطلب: {formatSAR(items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0))}</p>
    </section>
  )
}
