export type CartProduct = {
  id: string
  name: string
  business: string
  unitPrice: number
  quantity: number
  image: string
}

export function formatSAR(amount: number) {
  return new Intl.NumberFormat('ar-SA-u-nu-latn', {
    style: 'currency', currency: 'SAR', maximumFractionDigits: 2,
  }).format(amount)
}

// MOCK DATA: two sample products; changes remain in memory only.
export const sampleCart: CartProduct[] = [
  { id: 'brownie-classic', name: 'براوني الشوكولاتة', business: 'حلويات ليلى', unitPrice: 15, quantity: 20,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80' },
  { id: 'brownie-dark', name: 'براوني الشوكولاتة الداكنة', business: 'حلويات ليلى', unitPrice: 15, quantity: 20,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80' },
]
