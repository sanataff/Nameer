/**
 * Thin mock API for supplier order management (FR-12).
 * Replace these functions with service calls when the backend is available.
 *
 * // MOCK DATA: example orders, not real buyer records.
 */

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'completed'

export interface LocalizedText {
  en: string
  ar: string
}

export interface SupplierOrder {
  id: string
  buyer: LocalizedText
  location: LocalizedText
  product: LocalizedText
  quantity: number
  unitPrice: number
  createdAt: string
  deliveryAt: string
  note: LocalizedText
  status: OrderStatus
}

const STORAGE_KEY = 'nameer:supplier-orders:v1'

const SEED_ORDERS: SupplierOrder[] = [
  {
    id: 'NM-2048',
    buyer: { en: 'Rosa Café', ar: 'مقهى روزا' },
    location: { en: 'Riyadh · Al Olaya', ar: 'الرياض · العليا' },
    product: { en: 'Chocolate chunk cookies', ar: 'كوكيز قطع الشوكولاتة' },
    quantity: 24,
    unitPrice: 20,
    createdAt: '2026-10-20T08:30:00.000Z',
    deliveryAt: '2026-10-22T09:00:00.000Z',
    note: { en: 'Please pack each dozen in a separate box.', ar: 'يرجى تعبئة كل ١٢ قطعة في علبة منفصلة.' },
    status: 'pending',
  },
  {
    id: 'NM-2047',
    buyer: { en: 'Dallah Café', ar: 'مقهى دلة' },
    location: { en: 'Riyadh · Al Malqa', ar: 'الرياض · الملقا' },
    product: { en: 'Sourdough loaf', ar: 'خبز الساوردو' },
    quantity: 12,
    unitPrice: 26,
    createdAt: '2026-10-19T14:15:00.000Z',
    deliveryAt: '2026-10-21T06:30:00.000Z',
    note: { en: 'Deliver before the breakfast service.', ar: 'يرجى التوصيل قبل بدء تقديم الفطور.' },
    status: 'accepted',
  },
  {
    id: 'NM-2046',
    buyer: { en: 'Saha Restaurant', ar: 'مطعم ساحة' },
    location: { en: 'Riyadh · Hittin', ar: 'الرياض · حطين' },
    product: { en: 'Date and tahini bites', ar: 'كرات التمر والطحينة' },
    quantity: 18,
    unitPrice: 32,
    createdAt: '2026-10-19T10:00:00.000Z',
    deliveryAt: '2026-10-23T12:00:00.000Z',
    note: { en: 'Order for a private event.', ar: 'الطلب مخصص لفعالية خاصة.' },
    status: 'pending',
  },
  {
    id: 'NM-2045',
    buyer: { en: 'Rosa Café', ar: 'مقهى روزا' },
    location: { en: 'Riyadh · Al Olaya', ar: 'الرياض · العليا' },
    product: { en: 'Mini croissant box', ar: 'علبة كرواسون صغيرة' },
    quantity: 8,
    unitPrice: 42,
    createdAt: '2026-10-17T09:45:00.000Z',
    deliveryAt: '2026-10-18T06:30:00.000Z',
    note: { en: 'Thank you!', ar: 'شكراً لكم!' },
    status: 'completed',
  },
  {
    id: 'NM-2044',
    buyer: { en: 'Dallah Café', ar: 'مقهى دلة' },
    location: { en: 'Riyadh · Al Malqa', ar: 'الرياض · الملقا' },
    product: { en: 'Pistachio and rose cake', ar: 'كيك الفستق والورد' },
    quantity: 2,
    unitPrice: 85,
    createdAt: '2026-10-16T11:20:00.000Z',
    deliveryAt: '2026-10-17T10:00:00.000Z',
    note: { en: 'We could not meet the requested delivery date.', ar: 'تعذر علينا الالتزام بموعد التوصيل المطلوب.' },
    status: 'rejected',
  },
]

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function isLocalizedText(value: unknown): value is LocalizedText {
  return (
    typeof value === 'object' &&
    value !== null &&
    'en' in value &&
    typeof value.en === 'string' &&
    'ar' in value &&
    typeof value.ar === 'string'
  )
}

function isSupplierOrder(value: unknown): value is SupplierOrder {
  if (typeof value !== 'object' || value === null) return false
  if (!('id' in value) || typeof value.id !== 'string') return false
  if (!('buyer' in value) || !isLocalizedText(value.buyer)) return false
  if (!('location' in value) || !isLocalizedText(value.location)) return false
  if (!('product' in value) || !isLocalizedText(value.product)) return false
  if (!('note' in value) || !isLocalizedText(value.note)) return false
  if (!('quantity' in value) || typeof value.quantity !== 'number') return false
  if (!('unitPrice' in value) || typeof value.unitPrice !== 'number') return false
  if (!('createdAt' in value) || typeof value.createdAt !== 'string') return false
  if (!('deliveryAt' in value) || typeof value.deliveryAt !== 'string') return false
  return (
    'status' in value &&
    (value.status === 'pending' ||
      value.status === 'accepted' ||
      value.status === 'rejected' ||
      value.status === 'completed')
  )
}

function readStored(): SupplierOrder[] {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return SEED_ORDERS.map((order) => ({ ...order }))

  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed) || !parsed.every(isSupplierOrder)) {
    throw new Error('Stored supplier orders are invalid.')
  }
  return parsed.map((order) => ({ ...order }))
}

function writeStored(orders: SupplierOrder[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export async function listSupplierOrders(): Promise<SupplierOrder[]> {
  await delay(300)
  return readStored()
}

export async function updateSupplierOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<SupplierOrder> {
  await delay(250)
  const orders = readStored()
  const index = orders.findIndex((order) => order.id === id)
  if (index === -1) throw new Error(`Unknown order: ${id}`)

  const updated = { ...orders[index], status }
  orders[index] = updated
  writeStored(orders)
  return { ...updated }
}
