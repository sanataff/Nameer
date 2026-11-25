import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuantitySelector } from './QuantitySelector'
import { formatSAR, type CartProduct } from './cart-data'

type Props = { item: CartProduct; onQuantityChange: (id: string, quantity: number) => void; onRemove: (id: string) => void }

export function CartItem({ item, onQuantityChange, onRemove }: Props) {
  const [imageFailed, setImageFailed] = useState(false)
  return (
    <article className="shopping-cart-item" aria-labelledby={`product-${item.id}`}>
      {imageFailed
        ? <div className="shopping-cart-image shopping-cart-image-fallback" role="img" aria-label={item.name}>{item.name}</div>
        : <img className="shopping-cart-image" src={item.image} alt={item.name} onError={() => setImageFailed(true)} />}
      <div className="shopping-cart-item-controls">
        <h2 id={`product-${item.id}`}>{item.name}</h2>
        <QuantitySelector quantity={item.quantity} productName={item.name}
          onChange={(quantity) => onQuantityChange(item.id, quantity)} />
        <Button variant="destructive" size="sm" aria-label={`حذف المنتج: ${item.name}`} onClick={() => onRemove(item.id)}>
          <Trash2 data-icon="inline-start" />حذف المنتج
        </Button>
      </div>
      <p className="shopping-cart-subtotal">المجموع: {formatSAR(item.unitPrice * item.quantity)}</p>
    </article>
  )
}
