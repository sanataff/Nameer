import bakery from '../image/bakery.jpeg'
import cake from '../image/cake.jpeg'
import eidSweet from '../image/eid-sweets.jpeg'
import cheesecake from '../image/cheesecake.jpeg'
import sweet from '../image/sweet.jpeg'
import cupcake from '../image/cupcake.jpeg'

export type DessertVendor = {
  name: string
  initials: string
  specialty: string
  category: string
  delivery: string
  minimum: string
  rating: string
  artwork: string
  tag: string
}

export const categories = ['الكل', 'الكعك', 'المعمول', 'المخبوزات', 'التشيزكيك']

export const vendors: DessertVendor[] = [
  {
    name: 'حلويات ليلى',
    initials: 'لي',
    specialty: 'كيك المناسبات والحلويات المنزلية',
    category: 'الكعك',
    delivery: '٢٥–٣٥ دقيقة',
    minimum: '٣٥ ر.س',
    rating: '٤.٩',
    artwork: cake,
    tag: 'الأكثر طلباً',
  },
  {
    name: 'حلويات العيد',
    initials: 'عي',
    specialty: 'معمول طازج بوصفات عائلية',
    category: 'المعمول',
    delivery: '٢٠–٣٠ دقيقة',
    minimum: '٢٥ ر.س',
    rating: '٤.٨',
    artwork: eidSweet,
    tag: 'طازج يومياً',
  },
  {
    name: 'مخبز الخليج',
    initials: 'خ',
    specialty: 'كرواسون ومخبوزات من الفرن',
    category: 'المخبوزات',
    delivery: '١٥–٢٥ دقيقة',
    minimum: '٢٠ ر.س',
    rating: '٤.٧',
    artwork: bakery,
    tag: 'يفتح الآن',
  },
  {
    name: 'سكر وورد',
    initials: 'سو',
    specialty: 'تشيزكيك كريمي بنكهات موسمية',
    category: 'التشيزكيك',
    delivery: '٣٠–٤٠ دقيقة',
    minimum: '٤٠ ر.س',
    rating: '٤.٩',
    artwork: cheesecake,
    tag: 'وصفة مميزة',
  },
  {
    name: 'ركن الكب كيك',
    initials: 'رك',
    specialty: 'كب كيك مزين بحب لكل مناسبة',
    category: 'الكعك',
    delivery: '٢٥–٣٥ دقيقة',
    minimum: '٣٠ ر.س',
    rating: '٤.٨',
    artwork: cupcake,
    tag: 'تزيين حسب الطلب',
  },
  {
    name: 'لُقمة حلوة',
    initials: 'لح',
    specialty: 'بسكويت ومعمول بلمسة عصرية',
    category: 'المعمول',
    delivery: '٢٠–٣٠ دقيقة',
    minimum: '٢٥ ر.س',
    rating: '٤.٦',
    artwork: sweet,
    tag: 'اختيار محلي',
  },
]
