import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, MapPin, PackageCheck, Search, ShoppingBag, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  listSupplierOrders,
  updateSupplierOrderStatus,
  type OrderStatus,
  type SupplierOrder,
} from '@/api/orders'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import './orders.css'

type OrderFilter = 'activePending' | 'all' | OrderStatus | 'active'
type Feedback = { message: string; tone: 'success' | 'error' }

const FILTERS: OrderFilter[] = ['activePending', 'all', 'pending', 'active', 'completed', 'rejected']

function statusForFilter(filter: OrderFilter, status: OrderStatus) {
  if (filter === 'activePending') return status === 'pending' || status === 'accepted'
  if (filter === 'all') return true
  if (filter === 'active') return status === 'accepted'
  return filter === status
}

function isOrderFilter(value: string | null): value is OrderFilter {
  return value !== null && FILTERS.some((filter) => filter === value)
}

export function OrdersPage() {
  const { t, i18n } = useTranslation()
  const language: 'ar' | 'en' = i18n.resolvedLanguage?.split('-')[0] === 'en' ? 'en' : 'ar'
  const locale = language === 'ar' ? 'ar-SA' : 'en-SA'
  const [orders, setOrders] = useState<SupplierOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [filter, setFilter] = useState<OrderFilter>('activePending')
  const [query, setQuery] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [declineOrderId, setDeclineOrderId] = useState<string | null>(null)
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null
  const declineOrder = orders.find((order) => order.id === declineOrderId) ?? null

  const numberFormat = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  )
  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
    [locale],
  )

  useEffect(() => {
    let active = true
    listSupplierOrders()
      .then((result) => {
        if (active) setOrders(result)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [reloadKey])

  const counts = {
    total: orders.length,
    pending: orders.filter((order) => order.status === 'pending').length,
    active: orders.filter((order) => order.status === 'accepted').length,
    completed: orders.filter((order) => order.status === 'completed').length,
  }

  const visibleOrders = orders.filter((order) => {
    const matchesFilter = statusForFilter(filter, order.status)
    const searchText = `${order.id} ${order.buyer[language]} ${order.product[language]}`
    return matchesFilter && searchText.toLocaleLowerCase(language).includes(query.trim().toLocaleLowerCase(language))
  })

  async function changeStatus(order: SupplierOrder, status: OrderStatus) {
    setSavingOrderId(order.id)
    setFeedback(null)
    try {
      const updated = await updateSupplierOrderStatus(order.id, status)
      setOrders((current) => current.map((item) => item.id === updated.id ? updated : item))
      setFeedback({
        message: t(status === 'accepted'
          ? 'supplierOrders.acceptSuccess'
          : status === 'rejected'
            ? 'supplierOrders.declineSuccess'
            : 'supplierOrders.completeSuccess'),
        tone: 'success',
      })
      setDeclineOrderId(null)
    } catch {
      setFeedback({ message: t('supplierOrders.updateError'), tone: 'error' })
    } finally {
      setSavingOrderId(null)
    }
  }

  function formattedDate(value: string) {
    return dateFormat.format(new Date(value))
  }

  function formattedTotal(order: SupplierOrder) {
    return `${numberFormat.format(order.quantity * order.unitPrice)} ${t('supplierOrders.currency')}`
  }

  function statusLabel(status: OrderStatus) {
    return t(`supplierOrders.status.${status}`)
  }

  function renderOrderActions(order: SupplierOrder) {
    if (order.status === 'pending') {
      return (
        <>
          <Button type="button" size="sm" onClick={() => void changeStatus(order, 'accepted')} disabled={savingOrderId === order.id}>
            <Check data-icon="inline-start" aria-hidden="true" />
            {t('supplierOrders.accept')}
          </Button>
          <Button type="button" size="sm" variant='destructive' onClick={() => setDeclineOrderId(order.id)} disabled={savingOrderId === order.id}>
            <X data-icon="inline-start" aria-hidden="true" />
            {t('supplierOrders.decline')}
          </Button>
        </>
      )
    }
    if (order.status === 'accepted') {
      return (
        <Button type="button" size="sm" variant="outline" onClick={() => void changeStatus(order, 'completed')} disabled={savingOrderId === order.id}>
          <PackageCheck data-icon="inline-start" aria-hidden="true" />
          {t('supplierOrders.markComplete')}
        </Button>
      )
    }
    return null
  }

  function renderOrderCards(ordersToRender: SupplierOrder[]) {
    return ordersToRender.map((order) => (
      <Card className="order-card" key={order.id}>
        <CardContent>
          <header className="order-card-header">
            <div className="order-buyer">
              <Avatar className="order-avatar">
                <AvatarFallback>{order.buyer[language].slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <h3>{order.buyer[language]}</h3>
                <span>{t('supplierOrders.orderNumber', { id: order.id })}</span>
              </div>
            </div>
            <Badge variant={order.status === 'rejected' ? 'destructive' : 'secondary'} className={`order-status order-status--${order.status}`}>
              {statusLabel(order.status)}
            </Badge>
          </header>
          <p className="order-product">{order.product[language]}</p>
          <div className="order-summary">
            <span>{t('supplierOrders.quantity', { count: numberFormat.format(order.quantity) })}</span>
            <strong>{formattedTotal(order)}</strong>
          </div>
          <div className="order-meta">
            <span><CalendarDays aria-hidden="true" />{t('supplierOrders.placedOn', { date: formattedDate(order.createdAt) })}</span>
            <span><MapPin aria-hidden="true" />{order.location[language]}</span>
          </div>
          <footer className="order-card-actions">
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedOrderId(order.id)}>
              {t('supplierOrders.viewDetails')}
            </Button>
            <div>{renderOrderActions(order)}</div>
          </footer>
        </CardContent>
      </Card>
    ))
  }

  return (
    <div className="orders-page">
      <header className="orders-header">
        <div>
          <p className="orders-eyebrow"><ShoppingBag aria-hidden="true" />{t('supplierOrders.eyebrow')}</p>
          <h1>{t('supplierOrders.title')} <span className="orders-count">{counts.total}</span></h1>
          <p className="orders-subtitle">{t('supplierOrders.subtitle')}</p>
        </div>
        <Badge variant="secondary">{t('supplierOrders.demoData')}</Badge>
      </header>

     

      <section className="orders-list-section" aria-labelledby="orders-list-heading">
        <div className="orders-list-heading">

          <div className="orders-toolbar">
            <label className="orders-search">
              <Search aria-hidden="true" />
              <span className="sr-only">{t('supplierOrders.searchLabel')}</span>
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder={t('supplierOrders.searchPlaceholder')}
              />
            </label>
            <Select
              value={filter}
              onValueChange={(value) => {
                if (isOrderFilter(value)) setFilter(value)
              }}
            >
              <SelectTrigger className="orders-filter" aria-label={t('supplierOrders.filterLabel')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {FILTERS.map((value) => (
                    <SelectItem key={value} value={value}>{t(`supplierOrders.filters.${value}`)}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {feedback && (
          <p className={`orders-feedback orders-feedback--${feedback.tone}`} role={feedback.tone === 'error' ? 'alert' : 'status'}>
            {feedback.message}
          </p>
        )}

        {loading ? (
          <div className="orders-grid" aria-busy="true" aria-label={t('supplierOrders.loading')}>
            {Array.from({ length: 3 }, (_, index) => <Skeleton className="orders-skeleton" key={index} />)}
          </div>
        ) : loadError ? (
          <div className="orders-empty" role="alert">
            <h3>{t('supplierOrders.errorTitle')}</h3>
            <p>{t('supplierOrders.loadError')}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLoading(true)
                setLoadError(false)
                setReloadKey((key) => key + 1)
              }}
            >
              {t('supplierOrders.retry')}
            </Button>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="orders-empty">
            <ShoppingBag aria-hidden="true" />
            <h3>{t('supplierOrders.emptyTitle')}</h3>
            <p>{t(query ? 'supplierOrders.emptySearchDescription' : 'supplierOrders.emptyDescription')}</p>
          </div>
        ) : (
          filter === 'activePending' ? (
            <div className="orders-columns">
              {([
                { status: 'accepted', label: t('supplierOrders.status.accepted') },
                { status: 'pending', label: t('supplierOrders.status.pending') },
              ] as const).map(({ status, label }) => {
                const columnOrders = visibleOrders.filter((order) => order.status === status)
                return (
                  <section className="orders-column" key={status} aria-labelledby={`orders-${status}-heading`}>
                    <header className="orders-column-heading">
                      <h3 id={`orders-${status}-heading`}>{label}</h3>
                      <span>{numberFormat.format(columnOrders.length)}</span>
                    </header>
                    {columnOrders.length > 0 ? (
                      <div className="orders-column-list">{renderOrderCards(columnOrders)}</div>
                    ) : (
                      <p className="orders-column-empty">{t('supplierOrders.columnEmpty')}</p>
                    )}
                  </section>
                )
              })}
            </div>
          ) : (
            <div className="orders-grid">{renderOrderCards(visibleOrders)}</div>
          )
        )}
      </section>

      <Dialog open={selectedOrder !== null} onOpenChange={(open) => { if (!open) setSelectedOrderId(null) }}>
        {selectedOrder && (
          <DialogContent className="order-detail-dialog" closeLabel={t('supplierOrders.close')}>
            <DialogHeader>
              <div className="order-detail-heading">
                <Avatar className="order-avatar">
                  <AvatarFallback>{selectedOrder.buyer[language].slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle>{selectedOrder.buyer[language]}</DialogTitle>
                  <DialogDescription>{t('supplierOrders.orderNumber', { id: selectedOrder.id })}</DialogDescription>
                </div>
                <Badge variant={selectedOrder.status === 'rejected' ? 'destructive' : 'secondary'} className={`order-status order-status--${selectedOrder.status}`}>
                  {statusLabel(selectedOrder.status)}
                </Badge>
              </div>
            </DialogHeader>
            <div className="order-detail-grid">
              <div><span>{t('supplierOrders.product')}</span><strong>{selectedOrder.product[language]}</strong></div>
              <div><span>{t('supplierOrders.quantityLabel')}</span><strong>{t('supplierOrders.quantity', { count: numberFormat.format(selectedOrder.quantity) })}</strong></div>
              <div><span>{t('supplierOrders.unitPrice')}</span><strong>{numberFormat.format(selectedOrder.unitPrice)} {t('supplierOrders.currency')}</strong></div>
              <div><span>{t('supplierOrders.total')}</span><strong>{formattedTotal(selectedOrder)}</strong></div>
              <div><span>{t('supplierOrders.orderDate')}</span><strong>{formattedDate(selectedOrder.createdAt)}</strong></div>
              <div><span>{t('supplierOrders.deliveryDate')}</span><strong>{formattedDate(selectedOrder.deliveryAt)}</strong></div>
              <div><span>{t('supplierOrders.deliveryLocation')}</span><strong>{selectedOrder.location[language]}</strong></div>
              <div className="order-detail-note"><span>{t('supplierOrders.note')}</span><strong>{selectedOrder.note[language]}</strong></div>
            </div>
            {selectedOrder.status === 'pending' && (
              <DialogFooter className="order-detail-actions">
                <Button type="button" onClick={() => void changeStatus(selectedOrder, 'accepted')} disabled={savingOrderId === selectedOrder.id}>
                  <Check data-icon="inline-start" aria-hidden="true" />
                  {t('supplierOrders.accept')}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDeclineOrderId(selectedOrder.id)} disabled={savingOrderId === selectedOrder.id}>
                  <X data-icon="inline-start" aria-hidden="true" />
                  {t('supplierOrders.decline')}
                </Button>
              </DialogFooter>
            )}
            {selectedOrder.status === 'accepted' && (
              <DialogFooter className="order-detail-actions">
                <Button type="button" onClick={() => void changeStatus(selectedOrder, 'completed')} disabled={savingOrderId === selectedOrder.id}>
                  <PackageCheck data-icon="inline-start" aria-hidden="true" />
                  {t('supplierOrders.markComplete')}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        )}
      </Dialog>

      <AlertDialog open={declineOrder !== null} onOpenChange={(open) => { if (!open) setDeclineOrderId(null) }}>
        {declineOrder && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('supplierOrders.declineTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('supplierOrders.declineDescription', { id: declineOrder.id, buyer: declineOrder.buyer[language] })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={savingOrderId === declineOrder.id}>{t('supplierOrders.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => void changeStatus(declineOrder, 'rejected')}
                disabled={savingOrderId === declineOrder.id}
              >
                {t('supplierOrders.confirmDecline')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  )
}
