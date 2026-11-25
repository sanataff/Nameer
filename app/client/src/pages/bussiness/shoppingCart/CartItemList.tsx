import { CartItem } from './CartItem'
import type { CartProduct } from './cart-data'

type Props = { items: CartProduct[]; onQuantityChange: (id: string, quantity: number) => void; onRemove: (id: string) => void }

export function CartItemList({ items, onQuantityChange, onRemove }: Props) {
  return (
    <section className="shopping-cart-items" aria-label="منتجات السلة">
      {items.length === 0
        ? <p className="shopping-cart-empty" role="status">سلة التسوق فارغة. أضف منتجات لتظهر هنا.</p>
        : items.map((item) => <CartItem key={item.id} item={item} onQuantityChange={onQuantityChange} onRemove={onRemove} />)}
    </section>
  )
}
