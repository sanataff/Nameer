import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = { quantity: number; productName: string; onChange: (quantity: number) => void }

export function QuantitySelector({ quantity, productName, onChange }: Props) {
  return (
    <div className="shopping-cart-quantity" role="group" aria-label={`كمية ${productName}`}>
      <Button variant="ghost" size="icon-sm" aria-label={`زيادة كمية ${productName}`}
        onClick={() => onChange(quantity + 1)}><Plus /></Button>
      <output aria-live="polite" aria-atomic="true">{quantity}</output>
      <Button variant="ghost" size="icon-sm" aria-label={`تقليل كمية ${productName}`}
        disabled={quantity <= 1} onClick={() => onChange(quantity - 1)}><Minus /></Button>
    </div>
  )
}
