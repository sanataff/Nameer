/**
 * Browser-local mock API for administrator customer-service requests.
 *
 * // MOCK DATA: seeded requests are fictional examples, not real customer reports.
 */

export type CustomerRequestStatus = 'open' | 'reviewing' | 'closed'
export type CustomerRequestPriority = 'high' | 'medium' | 'low'

export interface LocalizedText {
  en: string
  ar: string
}

export interface CustomerServiceRequest {
  id: string
  userId: string
  subject: LocalizedText
  category: LocalizedText
  description: LocalizedText
  priority: CustomerRequestPriority
  createdAt: string
  status: CustomerRequestStatus
}

export const CUSTOMER_REQUESTS_STORAGE_KEY = 'nameer:customer-service:v1'
export const CUSTOMER_REQUESTS_UPDATED_EVENT = 'nameer:customer-service-updated'

const SEED_REQUESTS: CustomerServiceRequest[] = [
  {
    id: '6767',
    userId: 'u-1001',
    subject: { en: 'Delayed supply order', ar: 'تأخر طلب التوريد' },
    category: { en: 'Orders and delivery', ar: 'الطلبات والتوصيل' },
    description: {
      en: 'The delivery date for my latest supply order has passed, but the order has not arrived. Please check the shipment and share an updated delivery estimate.',
      ar: 'تجاوز طلب التوريد الأخير موعد التسليم المحدد ولم يصل حتى الآن. يرجى التحقق من الشحنة ومشاركة موعد التسليم المتوقع.',
    },
    priority: 'high',
    createdAt: '2026-10-24T09:30:00.000Z',
    status: 'open',
  },
  {
    id: '6766',
    userId: 'u-1002',
    subject: { en: 'Delayed supply order', ar: 'تأخر طلب التوريد' },
    category: { en: 'Orders and delivery', ar: 'الطلبات والتوصيل' },
    description: {
      en: 'Part of the order is still missing. I have shared the order details and would like help confirming when the remaining items will be delivered.',
      ar: 'ما زال جزء من الطلب غير مستلم. أرفقت تفاصيل الطلب وأرغب في المساعدة لتأكيد موعد توصيل الأصناف المتبقية.',
    },
    priority: 'medium',
    createdAt: '2026-10-24T08:15:00.000Z',
    status: 'reviewing',
  },
  {
    id: '6768',
    userId: 'u-1003',
    subject: { en: 'Delayed supply order', ar: 'تأخر طلب التوريد' },
    category: { en: 'Orders and delivery', ar: 'الطلبات والتوصيل' },
    description: {
      en: 'My order arrived later than expected. Please review the delivery timeline and advise how to avoid this delay with future orders.',
      ar: 'وصل طلبي متأخراً عن الموعد المتوقع. يرجى مراجعة جدول التوصيل وإفادتي بكيفية تجنب هذا التأخير في الطلبات القادمة.',
    },
    priority: 'high',
    createdAt: '2026-10-24T07:40:00.000Z',
    status: 'closed',
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

function isCustomerServiceRequest(value: unknown): value is CustomerServiceRequest {
  if (typeof value !== 'object' || value === null) return false
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'userId' in value &&
    typeof value.userId === 'string' &&
    'subject' in value &&
    isLocalizedText(value.subject) &&
    'category' in value &&
    isLocalizedText(value.category) &&
    'description' in value &&
    isLocalizedText(value.description) &&
    'priority' in value &&
    (value.priority === 'high' ||
      value.priority === 'medium' ||
      value.priority === 'low') &&
    'createdAt' in value &&
    typeof value.createdAt === 'string' &&
    'status' in value &&
    (value.status === 'open' ||
      value.status === 'reviewing' ||
      value.status === 'closed')
  )
}

function cloneRequests(requests: CustomerServiceRequest[]) {
  return requests.map((request) => ({
    ...request,
    subject: { ...request.subject },
    category: { ...request.category },
    description: { ...request.description },
  }))
}

function readStoredRequests(): CustomerServiceRequest[] {
  const stored = window.localStorage.getItem(CUSTOMER_REQUESTS_STORAGE_KEY)
  if (!stored) return cloneRequests(SEED_REQUESTS)

  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed) || !parsed.every(isCustomerServiceRequest)) {
    throw new Error('Stored customer-service requests are invalid.')
  }
  return cloneRequests(parsed)
}

function writeStoredRequests(requests: CustomerServiceRequest[]) {
  window.localStorage.setItem(
    CUSTOMER_REQUESTS_STORAGE_KEY,
    JSON.stringify(requests),
  )
  window.dispatchEvent(new Event(CUSTOMER_REQUESTS_UPDATED_EVENT))
}

export async function listCustomerServiceRequests(): Promise<
  CustomerServiceRequest[]
> {
  await delay(180)
  return readStoredRequests()
}

export async function updateCustomerServiceRequestStatus(
  id: string,
  status: CustomerRequestStatus,
): Promise<CustomerServiceRequest> {
  await delay(180)
  const requests = readStoredRequests()
  const index = requests.findIndex((request) => request.id === id)
  if (index === -1) throw new Error(`Unknown customer-service request: ${id}`)

  const updated = { ...requests[index], status }
  requests[index] = updated
  writeStoredRequests(requests)
  return cloneRequests([updated])[0]
}
