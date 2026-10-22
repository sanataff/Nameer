/**
 * Thin product API layer for the supplier catalogue (FR-10, FR-11).
 *
 * The functions below use mock data and a small delay so the UI can show its
 * loading and saving states. Replace each function body with a real `fetch`
 * call when the backend is available — the component only depends on this
 * module's exported types and function signatures.
 *
 * // MOCK DATA: names, prices, and quantities are examples, not real records.
 */

export type ProductCategory = 'sweets' | 'bakery' | 'savory' | 'beverages'

export type ProductAvailability = 'available' | 'unavailable'

/** Products need a label in both UI languages. */
export interface LocalizedText {
  en: string
  ar: string
}

export interface Product {
  id: string
  name: LocalizedText
  description: LocalizedText
  category: ProductCategory
  price: number
  quantity: number
  availability: ProductAvailability
  /** ISO timestamp used for the "Updated" column. */
  updatedAt: string
}

export type ProductInput = Omit<Product, 'id' | 'updatedAt'>

const STORAGE_KEY = 'nameer:supplier-products:v1'

/** Example catalogue shown the first time the page opens. */
const SEED_PRODUCTS: Product[] = [
  {
    id: 'p-1001',
    name: { en: 'Chocolate chunk cookies', ar: 'كوكيز قطع الشوكولاتة' },
    description: {
      en: 'Brown butter dough with Belgian chocolate chunks. Box of 12.',
      ar: 'عجينة بالزبدة البنية وقطع الشوكولاتة البلجيكية. علبة من ١٢ حبة.',
    },
    category: 'sweets',
    price: 20,
    quantity: 48,
    availability: 'available',
    updatedAt: '2026-10-11T09:20:00.000Z',
  },
  {
    id: 'p-1002',
    name: { en: 'Sourdough loaf', ar: 'خبز الساوردو' },
    description: {
      en: 'Slow-fermented sourdough with a dark crust. 800 g loaf.',
      ar: 'خبز ساوردو مخمّر ببطء بقشرة داكنة. وزن الرغيف ٨٠٠ غم.',
    },
    category: 'bakery',
    price: 26,
    quantity: 4,
    availability: 'available',
    updatedAt: '2026-10-19T06:40:00.000Z',
  },
  {
    id: 'p-1003',
    name: { en: 'Date and tahini bites', ar: 'كرات التمر والطحينة' },
    description: {
      en: 'Medjool dates, roasted sesame, and a pinch of sea salt. Box of 16.',
      ar: 'تمر مجدول وسمسم محمّص ورشة ملح بحري. علبة من ١٦ قطعة.',
    },
    category: 'sweets',
    price: 32,
    quantity: 0,
    availability: 'available',
    updatedAt: '2026-10-18T14:05:00.000Z',
  },
  {
    id: 'p-1004',
    name: { en: "Za'atar manakish", ar: 'مناقيش الزعتر' },
    description: {
      en: 'Stone-baked flatbread with wild za’atar and olive oil. Pack of 6.',
      ar: 'مناقيش مخبوزة على الحجر مع زعتر بري وزيت زيتون. عبوة من ٦ قطع.',
    },
    category: 'savory',
    price: 18,
    quantity: 24,
    availability: 'available',
    updatedAt: '2026-10-15T11:10:00.000Z',
  },
  {
    id: 'p-1005',
    name: { en: 'Pistachio and rose cake', ar: 'كيك الفستق والورد' },
    description: {
      en: 'Whole 20 cm cake with pistachio cream and rose petals.',
      ar: 'كيك كامل بقطر ٢٠ سم مع كريمة الفستق وبتلات الورد.',
    },
    category: 'sweets',
    price: 85,
    quantity: 9,
    availability: 'available',
    updatedAt: '2026-10-17T08:30:00.000Z',
  },
  {
    id: 'p-1006',
    name: { en: 'Cardamom cold brew', ar: 'كولد برو بالهيل' },
    description: {
      en: '18-hour cold brew concentrate infused with green cardamom. 1 L.',
      ar: 'مركز كولد برو منقوع ١٨ ساعة مع الهيل الأخضر. ١ لتر.',
    },
    category: 'beverages',
    price: 38,
    quantity: 12,
    availability: 'unavailable',
    updatedAt: '2026-10-09T16:45:00.000Z',
  },
  {
    id: 'p-1007',
    name: { en: 'Kunafa cheesecake', ar: 'تشيز كيك الكنافة' },
    description: {
      en: 'Baked cheesecake with a crisp kunafa base and orange blossom syrup.',
      ar: 'تشيز كيك مخبوز بقاعدة كنافة مقرمشة وشراب ماء الزهر.',
    },
    category: 'sweets',
    price: 95,
    quantity: 3,
    availability: 'available',
    updatedAt: '2026-10-20T07:15:00.000Z',
  },
  {
    id: 'p-1008',
    name: { en: 'Mini croissant box', ar: 'علبة كرواسون صغيرة' },
    description: {
      en: 'Butter croissants laminated over three days. Box of 10.',
      ar: 'كرواسون بالزبدة بعجين مطوي على مدى ثلاثة أيام. علبة من ١٠ قطع.',
    },
    category: 'bakery',
    price: 42,
    quantity: 30,
    availability: 'available',
    updatedAt: '2026-10-14T09:00:00.000Z',
  },
]

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function clone(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    name: { ...product.name },
    description: { ...product.description },
  }))
}

/**
 * Mock storage: the seeded catalogue is kept in localStorage so edits survive a
 * refresh (NFR-04). Corrupt or missing data falls back to the seed.
 */
function readStored(): Product[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return clone(SEED_PRODUCTS)
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as Product[]) : clone(SEED_PRODUCTS)
  } catch {
    return clone(SEED_PRODUCTS)
  }
}

function writeStored(products: Product[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch {
    // Storage can be unavailable (private mode / quota). The in-memory list is
    // still updated by the caller, so the page keeps working for the session.
  }
}

export async function listProducts(): Promise<Product[]> {
  await delay(450)
  return clone(readStored())
}

export async function createProduct(input: ProductInput): Promise<Product> {
  await delay(400)
  const product: Product = {
    ...input,
    id: `p-${Date.now().toString(36)}`,
    updatedAt: new Date().toISOString(),
  }
  const products = [product, ...readStored()]
  writeStored(products)
  return { ...product }
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  await delay(350)
  const products = readStored()
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) throw new Error(`Unknown product: ${id}`)

  const updated: Product = {
    ...products[index],
    ...input,
    updatedAt: new Date().toISOString(),
  }
  products[index] = updated
  writeStored(products)
  return { ...updated }
}

/** Used by the availability switch in the table (FR-11). */
export async function setProductAvailability(
  id: string,
  availability: ProductAvailability,
): Promise<Product> {
  const products = readStored()
  const current = products.find((product) => product.id === id)
  if (!current) throw new Error(`Unknown product: ${id}`)
  return updateProduct(id, {
    name: current.name,
    description: current.description,
    category: current.category,
    price: current.price,
    quantity: current.quantity,
    availability,
  })
}

export async function deleteProduct(id: string): Promise<void> {
  await delay(300)
  const products = readStored().filter((product) => product.id !== id)
  writeStored(products)
}
