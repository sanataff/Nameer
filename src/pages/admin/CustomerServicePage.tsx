import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  ArrowRight,
  Headset,
  RefreshCw,
  Search,
  TicketCheck,
} from 'lucide-react'
import { Link, useParams } from 'react-router'
import {
  CUSTOMER_REQUESTS_STORAGE_KEY,
  CUSTOMER_REQUESTS_UPDATED_EVENT,
  listCustomerServiceRequests,
  updateCustomerServiceRequestStatus,
  type CustomerRequestStatus,
  type CustomerServiceRequest,
} from '@/api/customer-service'
import { listUsers, type ManagedUser } from '@/api/users'
import { AppShell } from '@/components/AppShell'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { usePageTitle } from '@/hooks/use-page-title'
import './customer-service.css'

type RequestFilter = 'all' | CustomerRequestStatus

interface ToastMessage {
  message: string
  tone: 'success' | 'error'
}

function isRequestStatus(value: unknown): value is CustomerRequestStatus {
  return value === 'open' || value === 'reviewing' || value === 'closed'
}

export function CustomerServicePage() {
  const { t, i18n } = useTranslation()
  const { requestId } = useParams()
  const language: 'ar' | 'en' =
    i18n.resolvedLanguage?.split('-')[0] === 'en' ? 'en' : 'ar'
  const locale = language === 'ar' ? 'ar-SA' : 'en-SA'
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft
  const [requests, setRequests] = useState<CustomerServiceRequest[]>([])
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<RequestFilter>('all')
  const [savingStatus, setSavingStatus] = useState(false)
  const [feedback, setFeedback] = useState<ToastMessage | null>(null)

  const isDetailPage = requestId !== undefined
  usePageTitle(
    isDetailPage
      ? t('customerService.detailsTitle', { id: requestId })
      : t('customerService.title'),
  )

  const dateFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    [locale],
  )
  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale])

  useEffect(() => {
    let active = true
    Promise.all([listCustomerServiceRequests(), listUsers()])
      .then(([requestData, userData]) => {
        if (!active) return
        setRequests(requestData)
        setUsers(userData)
        setLoadError(false)
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

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (
        event.key !== CUSTOMER_REQUESTS_STORAGE_KEY &&
        event.key !== null
      ) {
        return
      }
      setLoading(true)
      setLoadError(false)
      setReloadKey((key) => key + 1)
    }

    function handleSameTabUpdate() {
      setLoading(true)
      setLoadError(false)
      setReloadKey((key) => key + 1)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(CUSTOMER_REQUESTS_UPDATED_EVENT, handleSameTabUpdate)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(CUSTOMER_REQUESTS_UPDATED_EVENT, handleSameTabUpdate)
    }
  }, [])

  const request = requests.find((item) => item.id === requestId)
  const userById = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  )
  const requester = request ? userById.get(request.userId) : undefined
  const counts = useMemo(
    () => ({
      all: requests.length,
      open: requests.filter((item) => item.status === 'open').length,
      reviewing: requests.filter((item) => item.status === 'reviewing').length,
      closed: requests.filter((item) => item.status === 'closed').length,
    }),
    [requests],
  )
  const filteredRequests = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return requests.filter((item) => {
      if (filter !== 'all' && item.status !== filter) return false
      if (!needle) return true
      const requester = userById.get(item.userId)
      return [
        item.id,
        item.subject.en,
        item.subject.ar,
        requester?.name.en,
        requester?.name.ar,
        requester?.email,
      ]
        .join(' ')
        .toLocaleLowerCase()
        .includes(needle)
    })
  }, [filter, query, requests, userById])

  function statusBadge(status: CustomerRequestStatus) {
    const variant =
      status === 'closed'
        ? 'secondary'
        : status === 'reviewing'
          ? 'outline'
          : 'default'
    return (
      <Badge variant={variant}>
        {t(`customerService.status.${status}`)}
      </Badge>
    )
  }

  function retryLoading() {
    setLoading(true)
    setLoadError(false)
    setReloadKey((key) => key + 1)
  }

  async function changeStatus(status: CustomerRequestStatus) {
    if (!request) return
    setSavingStatus(true)
    setFeedback(null)
    try {
      const updated = await updateCustomerServiceRequestStatus(
        request.id,
        status,
      )
      setRequests((previous) =>
        previous.map((item) => (item.id === updated.id ? updated : item)),
      )
      setFeedback({
        message: t('customerService.statusUpdated'),
        tone: 'success',
      })
    } catch {
      setFeedback({
        message: t('customerService.updateError'),
        tone: 'error',
      })
    } finally {
      setSavingStatus(false)
    }
  }

  const customerServiceHeader = (
    <header className="customer-service-header">
      <div className="customer-service-heading">
        <p className="customer-service-eyebrow">
          <Headset aria-hidden="true" />
          {t('adminUsers.portalLabel')}
        </p>
        <h1>
          {isDetailPage
            ? t('customerService.detailsTitle', { id: requestId })
            : t('customerService.title')}
        </h1>
        {!isDetailPage && (
          <p className="customer-service-description">
            {t('customerService.description')}
          </p>
        )}
      </div>
      <div className="customer-service-header-actions">
        <a
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
          href="/admin/users"
        >
          <TicketCheck data-icon="inline-start" />
          {t('customerService.userManagement')}
        </a>
        <Badge variant="outline">{t('adminUsers.demoData')}</Badge>
      </div>
    </header>
  )

  return (
    <AppShell>
      <main className="customer-service-page">
        <div className="customer-service-content">
          {customerServiceHeader}
          {loading ? (
            <Card>
              <CardContent className="customer-service-loading">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ) : loadError ? (
            <Card>
              <CardContent className="customer-service-message">
                <p role="alert">{t('customerService.loadError')}</p>
                <Button type="button" variant="outline" onClick={retryLoading}>
                  <RefreshCw data-icon="inline-start" />
                  {t('adminUsers.retry')}
                </Button>
              </CardContent>
            </Card>
          ) : isDetailPage ? (
            request ? (
              <section className="customer-service-detail">
                <a
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                  href="/admin/customer-service"
                >
                  <BackIcon data-icon="inline-start" />
                  {t('customerService.backToRequests')}
                </a>

                <div className="customer-service-detail-heading">
                  <div>
                    <p className="customer-service-eyebrow">
                      {t('customerService.ticketNumber', {
                        id: request.id,
                      })}
                    </p>
                    <h2>{request.subject[language]}</h2>
                  </div>
                  {statusBadge(request.status)}
                </div>

                <div className="customer-service-detail-grid">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('customerService.requestDetails')}</CardTitle>
                      <CardDescription>
                        {t('customerService.requestDetailsDescription')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="customer-service-request-content">
                      <dl className="customer-service-metadata">
                        <div>
                          <dt>{t('customerService.category')}</dt>
                          <dd>{request.category[language]}</dd>
                        </div>
                        <div>
                          <dt>{t('customerService.priority')}</dt>
                          <dd>
                            <Badge
                              variant={
                                request.priority === 'high'
                                  ? 'destructive'
                                  : 'outline'
                              }
                            >
                              {t(`customerService.priorities.${request.priority}`)}
                            </Badge>
                          </dd>
                        </div>
                        <div>
                          <dt>{t('customerService.createdAt')}</dt>
                          <dd>{dateFormat.format(new Date(request.createdAt))}</dd>
                        </div>
                      </dl>
                      <Separator />
                      <div className="customer-service-description-block">
                        <h3>{t('customerService.message')}</h3>
                        <p>{request.description[language]}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="customer-service-side-column">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t('customerService.requester')}</CardTitle>
                        <CardDescription>
                          {t('customerService.requesterDescription')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {requester ? (
                          <dl className="customer-service-metadata customer-service-requester">
                            <div>
                              <dt>{t('adminUsers.columns.name')}</dt>
                              <dd>
                                {requester.name[language] || requester.name.en}
                              </dd>
                            </div>
                            <div>
                              <dt>{t('adminUsers.columns.email')}</dt>
                              <dd dir="ltr">{requester.email}</dd>
                            </div>
                            <div>
                              <dt>{t('adminUsers.columns.phone')}</dt>
                              <dd dir="ltr">{requester.phone}</dd>
                            </div>
                          </dl>
                        ) : (
                          <p className="customer-service-muted">
                            {t('customerService.requesterUnavailable')}
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t('customerService.updateStatus')}</CardTitle>
                        <CardDescription>
                          {t('customerService.updateStatusDescription')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="customer-service-status-control">
                        <Select
                          value={request.status}
                          onValueChange={(value) => {
                            if (isRequestStatus(value) && value !== request.status) {
                              void changeStatus(value)
                            }
                          }}
                        >
                          <SelectTrigger
                            aria-label={t('customerService.updateStatus')}
                            className="w-full"
                            disabled={savingStatus}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {(['open', 'reviewing', 'closed'] as const).map(
                                (status) => (
                                  <SelectItem key={status} value={status}>
                                    {t(`customerService.status.${status}`)}
                                  </SelectItem>
                                ),
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {feedback && (
                          <p
                            className={`customer-service-feedback${feedback.tone === 'error' ? ' customer-service-feedback--error' : ''}`}
                            role={feedback.tone === 'error' ? 'alert' : 'status'}
                          >
                            {feedback.message}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>
            ) : (
              <Card>
                <CardContent className="customer-service-message">
                  <p>{t('customerService.notFound')}</p>
                  <a
                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    href="/admin/customer-service"
                  >
                    {t('customerService.backToRequests')}
                  </a>
                </CardContent>
              </Card>
            )
          ) : (
            <>
              <section className="customer-service-stats" aria-label={t('customerService.statusSummary')}>
                {(['all', 'open', 'reviewing', 'closed'] as const).map((status) => (
                  <Card key={status} size="sm">
                    <CardHeader>
                      <CardDescription>
                        {t(`customerService.filters.${status}`)}
                      </CardDescription>
                      <CardTitle>
                        {numberFormat.format(counts[status])}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </section>

              <section className="customer-service-toolbar" aria-label={t('customerService.filtersLabel')}>
                <ToggleGroup
                  aria-label={t('customerService.filtersLabel')}
                  className="customer-service-filters"
                  value={[filter]}
                  variant="outline"
                  size="sm"
                  spacing={0}
                  onValueChange={(values) => {
                    const value = values[0]
                    if (
                      value === 'all' ||
                      value === 'open' ||
                      value === 'reviewing' ||
                      value === 'closed'
                    ) {
                      setFilter(value)
                    }
                  }}
                >
                  {(['all', 'open', 'reviewing', 'closed'] as const).map(
                    (status) => (
                      <ToggleGroupItem key={status} value={status}>
                        {t(`customerService.filters.${status}`)}
                        <span className="customer-service-filter-count">
                          {numberFormat.format(counts[status])}
                        </span>
                      </ToggleGroupItem>
                    ),
                  )}
                </ToggleGroup>

                <label className="customer-service-search">
                  <Search aria-hidden="true" />
                  <Input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('customerService.searchPlaceholder')}
                    aria-label={t('customerService.searchPlaceholder')}
                  />
                </label>
              </section>

              <Card className="customer-service-table-card">
                <CardHeader>
                  <CardTitle>{t('customerService.tableTitle')}</CardTitle>
                  <CardDescription>
                    {t('customerService.tableDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="customer-service-table-content">
                  <Table className="customer-service-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('customerService.columns.ticket')}</TableHead>
                        <TableHead>{t('customerService.columns.requester')}</TableHead>
                        <TableHead>{t('customerService.columns.subject')}</TableHead>
                        <TableHead>{t('customerService.columns.priority')}</TableHead>
                        <TableHead>{t('customerService.columns.createdAt')}</TableHead>
                        <TableHead>{t('customerService.columns.status')}</TableHead>
                        <TableHead>
                          <span className="sr-only">
                            {t('customerService.columns.actions')}
                          </span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length === 0 ? (
                        <TableRow>
                          <TableCell
                            className="customer-service-empty"
                            colSpan={7}
                          >
                            {t('customerService.empty')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRequests.map((item) => {
                          const requester = userById.get(item.userId)
                          return (
                            <TableRow key={item.id}>
                              <TableCell dir="ltr" className="customer-service-ticket-id">
                                #{item.id}
                              </TableCell>
                              <TableCell className="customer-service-requester-name">
                                {requester
                                  ? requester.name[language] || requester.name.en
                                  : t('customerService.requesterUnavailable')}
                              </TableCell>
                              <TableCell>{item.subject[language]}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    item.priority === 'high'
                                      ? 'destructive'
                                      : 'outline'
                                  }
                                >
                                  {t(`customerService.priorities.${item.priority}`)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {dateFormat.format(new Date(item.createdAt))}
                              </TableCell>
                              <TableCell>{statusBadge(item.status)}</TableCell>
                              <TableCell>
                                <Link
                                  className={buttonVariants({
                                    variant: 'outline',
                                    size: 'sm',
                                  })}
                                  to={`/admin/customer-service/${encodeURIComponent(item.id)}`}
                                >
                                  {t('customerService.openRequest')}
                                </Link>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <p className="customer-service-footnote">
                {t('customerService.demoNote')}
              </p>
            </>
          )}
        </div>
      </main>
    </AppShell>
  )
}
