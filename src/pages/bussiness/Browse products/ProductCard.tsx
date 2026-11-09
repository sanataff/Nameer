import { Check, Clock3, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type DessertProduct = {
  id: number
  name: string
  description: string
  price: string
  emoji: string
  style: string
}

// Keep mock data page-local without introducing an extra page file.
// eslint-disable-next-line react-refresh/only-export-components
export const mockProducts: DessertProduct[] = [
  {
    id: 1,
    name: 'براوني الشوكولاتة',
    description: 'براوني غني بالشوكولاتة الداكنة، طري من الداخل.',
    price: '١٥',
    emoji: '🍫',
    style: 'brownie',
  },
  {
    id: 2,
    name: 'تيراميسو',
    description: 'طبقات قهوة ناعمة مع كريمة ماسكاربوني مخفوقة.',
    price: '١٨',
    emoji: '🍰',
    style: 'tiramisu',
  },
  {
    id: 3,
    name: 'تشيزكيك كلاسيك',
    description: 'تشيزكيك مخملي على قاعدة بسكويت هشة.',
    price: '٢٠',
    emoji: '🍰',
    style: 'cheesecake',
  },
  {
    id: 4,
    name: 'كوكيز محشية',
    description: 'كوكيز طازجة بحشوة شوكولاتة ذائبة.',
    price: '١٢',
    emoji: '🍪',
    style: 'cookies',
  },
  {
    id: 5,
    name: 'ميني تشيزكيك',
    description: 'قطع صغيرة لطيفة، مثالية للقهوة والضيافة.',
    price: '١٤',
    emoji: '🧁',
    style: 'mini-cheesecake',
  },
  {
    id: 6,
    name: 'كب كيك فستق',
    description: 'كب كيك هش مع كريمة الفستق الغنية.',
    price: '١٦',
    emoji: '🧁',
    style: 'pistachio',
  },
]

type ProductCardProps = {
  product: DessertProduct
  onAdd: () => void
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="dessert-product-card">
      <div
        className={`dessert-product-artwork artwork-${product.style}`}
        role="img"
        aria-label={`صورة توضيحية لمنتج ${product.name}`}
      >
        <span className="dessert-artwork-ring" aria-hidden="true" />
        <span className="dessert-product-emoji" aria-hidden="true">
          {product.emoji}
        </span>
        <span className="dessert-artwork-caption">تحضير يومي طازج</span>
      </div>

      <div className="dessert-product-content">
        <div className="dessert-product-title-row">
          <h2>{product.name}</h2>
          <span className="dessert-product-price">
            {product.price}
            <small> ر.س</small>
            <small> / للقطعة</small>
          </span>
        </div>
        <p className="dessert-product-description">{product.description}</p>

        <div className="dessert-product-badges">
          <span className="dessert-product-badge badge-expiry">
            <Clock3 aria-hidden="true" />
            مدة الصلاحية: 3 أيام
          </span>
          <span className="dessert-product-badge badge-minimum">
            <ShoppingBag aria-hidden="true" />
            الحد الأدنى للطلب: 15 قطعة
          </span>
        </div>

        <Button
          className="dessert-product-add-button"
          type="button"
          size="lg"
          onClick={onAdd}
          aria-label={`أضف ${product.name} إلى السلة`}
        >
          <Check data-icon="inline-end" />
          أضف إلى السلة
        </Button>
      </div>
    </article>
  )
}
