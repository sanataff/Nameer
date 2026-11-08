export type DessertVendor = {
  name: string
  initials: string
  specialty: string
  category: string
  delivery: string
  minimum: string
  rating: string
  artwork: string
  dessert: string
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
    artwork: 'cake',
    dessert: '🍰',
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
    artwork: 'maamoul',
    dessert: '🥮',
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
    artwork: 'croissant',
    dessert: '🥐',
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
    artwork: 'cheesecake',
    dessert: '🍰',
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
    artwork: 'cupcake',
    dessert: '🧁',
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
    artwork: 'cookies',
    dessert: '🍪',
    tag: 'اختيار محلي',
  },
]
