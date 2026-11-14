import { Check, Clock3, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import brownies from '../image/brownies.jpeg'
import tiramisu from '../image/tiramisu.jpeg'
import cheesecake from '../image/cheesecake.jpeg'
import cookies from '../image/cookies.jpeg'
import minicheesecake from '../image/minicheesecake.jpeg'
import pistachio from '../image/pistachio-cake.jpeg'

export type DessertProduct = {
  id: number
  name: string
  description: string
  price: number
  image: string
  style: string
}

// Keep mock data page-local without introducing an extra page file.
// eslint-disable-next-line react-refresh/only-export-components
export const mockProducts: DessertProduct[] = [
  {
    id: 1,
    name: 'براوني الشوكولاتة',
    description: 'براوني غني بالشوكولاتة الداكنة، طري من الداخل.',
    price: 15,
    image: brownies,
    style: 'brownie',
  },
  {
    id: 2,
    name: 'تيراميسو',
    description: 'طبقات قهوة ناعمة مع كريمة ماسكاربوني مخفوقة.',
    price: 18,
    image: tiramisu,
    style: 'tiramisu',
  },
  {
    id: 3,
    name: 'تشيزكيك كلاسيك',
    description: 'تشيزكيك مخملي على قاعدة بسكويت هشة.',
    price: 20,
    image: cheesecake,
    style: 'cheesecake',
  },
  {
    id: 4,
    name: 'كوكيز محشية',
    description: 'كوكيز طازجة بحشوة شوكولاتة ذائبة.',
    price: 12,
    image: cookies,
    style: 'cookies',
  },
  {
    id: 5,
    name: 'ميني تشيزكيك',
    description: 'قطع صغيرة لطيفة، مثالية للقهوة والضيافة.',
    price: 14,
    image: minicheesecake,
    style: 'mini-cheesecake',
  },
  {
    id: 6,
    name: 'كب كيك فستق',
    description: 'كب كيك هش مع كريمة الفستق الغنية.',
    price: 16,
    image: pistachio,
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
        <img className="dessert-product-image" src={product.image} alt="" />
        <span className="dessert-artwork-caption">تحضير يومي طازج</span>
      </div>

      <div className="dessert-product-content">
        <div className="dessert-product-title-row">
          <h2>{product.name}</h2>
          <span className="dessert-product-price">
            {product.price.toLocaleString('ar-SA')}
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
          aria-label={`أضف ١٥ قطعة من ${product.name} إلى السلة`}
        >
          <Check data-icon="inline-end" />
          أضف ١٥ قطعة إلى السلة
        </Button>
      </div>
    </article>
  )
}
