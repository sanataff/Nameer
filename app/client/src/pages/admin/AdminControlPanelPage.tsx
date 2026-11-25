import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BadgeDollarSign,
  CircleCheck,
  Headset,
  RefreshCw,
  ShoppingBag,
  Store,
  TriangleAlert,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { listCustomerServiceRequests } from '@/api/customer-service'
import { listSupplierOrders } from '@/api/orders'
import { listUsers, type ManagedUser } from '@/api/users'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePageTitle } from '@/hooks/use-page-title'
import type { CustomerServiceRequest } from '@/api/customer-service'
import type { SupplierOrder } from '@/api/orders'
import './control-panel.css'

type Metric = {
  label: string
  value: string
  icon: LucideIcon
}

type StatusDatum = {
  status: string
  count: number
}

function StatusChart({
  title,
  description,
  data,
  locale,
  language,
  countLabel,
}: {
  title: string
  description: string
  data: StatusDatum[]
  locale: string
  language: 'ar' | 'en'
  countLabel: string
}) {
  const numberFormat = new Intl.NumberFormat(locale)
  const chartConfig = {
    count: {
      label: countLabel,
      color: 'var(--primary)',
    },
  } satisfies ChartConfig

  return (
    <Card className="admin-control-panel-chart-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="admin-control-panel-chart"
          config={chartConfig}
          role="img"
          aria-label={title}
          initialDimension={{ width: 420, height: 230 }}
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: language === 'en' ? 8 : 0,
              right: language === 'ar' ? 8 : 0,
            }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => numberFormat.format(value)}
            />
            <YAxis
              type="category"
              dataKey="status"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={language === 'ar' ? 108 : 100}
              orientation={language === 'ar' ? 'right' : 'left'}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => numberFormat.format(Number(value))}
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={language === 'ar' ? [4, 0, 0, 4] : [0, 4, 4, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function DashboardLoading() {
  return (
    <>
      <div className="admin-control-panel-metrics" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="admin-control-panel-stat-skeleton" key={index} />
        ))}
      </div>
      <div className="admin-control-panel-charts" aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton className="admin-control-panel-chart-skeleton" key={index} />
        ))}
      </div>
      <Skeleton className="admin-control-panel-table-skeleton" aria-hidden="true" />
    </>
  )
}

export function AdminControlPanelPage() {
  const { t, i18n } = useTranslation()
  const language: 'ar' | 'en' =
    i18n.resolvedLanguage?.split('-')[0] === 'en' ? 'en' : 'ar'
  const locale = language === 'ar' ? 'ar-SA' : 'en-SA'
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [orders, setOrders] = useState<SupplierOrder[]>([])
  const [requests, setRequests] = useState<CustomerServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  usePageTitle(t('adminControlPanel.title'))

  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale])
  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
    [locale],
  )
  const currencyFormat = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
      }),
    [locale],
  )

  useEffect(() => {
    let active = true

    Promise.all([listUsers(), listSupplierOrders(), listCustomerServiceRequests()])
      .then(([userData, orderData, requestData]) => {
        if (!active) return
        setUsers(userData)
        setOrders(orderData)
        setRequests(requestData)
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

  const counts = useMemo(
    () => ({
      verifiedStores: users.filter((user) => user.status === 'active').length,
      pendingStores: users.filter((user) => user.status === 'unverified').length,
      openTickets: requests.filter((request) => request.status === 'open').length,
      completedOrderValue: orders
        .filter((order) => order.status === 'completed')
        .reduce((total, order) => total + order.quantity * order.unitPrice, 0),
    }),
    [orders, requests, users],
  )

  const metrics: Metric[] = [
    {
      label: t('adminControlPanel.stats.totalAccounts'),
      value: numberFormat.format(users.length),
      icon: UsersRound,
    },
    {
      label: t('adminControlPanel.stats.verifiedStores'),
      value: numberFormat.format(counts.verifiedStores),
      icon: CircleCheck,
    },
    {
      label: t('adminControlPanel.stats.pendingVerifications'),
      value: numberFormat.format(counts.pendingStores),
      icon: TriangleAlert,
    },
    {
      label: t('adminControlPanel.stats.openTickets'),
      value: numberFormat.format(counts.openTickets),
      icon: Headset,
    },
  ]

  const userStatusData: StatusDatum[] = (
    ['active', 'unverified', 'rejected', 'banned'] as const
  ).map((status) => ({
    status: t(`adminUsers.status.${status}`),
    count: users.filter((user) => user.status === status).length,
  }))

  const orderStatusData: StatusDatum[] = (
    ['pending', 'accepted', 'completed', 'rejected'] as const
  ).map((status) => ({
    status: t(`supplierOrders.status.${status}`),
    count: orders.filter((order) => order.status === status).length,
  }))

  const requestStatusData: StatusDatum[] = (
    ['open', 'reviewing', 'closed'] as const
  ).map((status) => ({
    status: t(`customerService.status.${status}`),
    count: requests.filter((request) => request.status === status).length,
  }))

  const recentUsers = useMemo(
    () =>
      [...users]
        .sort(
          (left, right) =>
            new Date(right.joinedAt).getTime() - new Date(left.joinedAt).getTime(),
        )
        .slice(0, 5),
    [users],
  )

  const renderDashboardContent = (): ReactNode => {
    if (loading) return <DashboardLoading />

    if (loadError) {
      return (
        <Card>
          <CardContent className="admin-control-panel-error">
            <p role="alert">{t('adminControlPanel.loadError')}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLoading(true)
                setLoadError(false)
                setReloadKey((key) => key + 1)
              }}
            >
              <RefreshCw data-icon="inline-start" />
              {t('adminUsers.retry')}
            </Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <>
        <section
          className="admin-control-panel-metrics"
          aria-label={t('adminControlPanel.overview')}
        >
          {metrics.map(({ label, value, icon: Icon }) => (
            <Card className="admin-control-panel-stat" key={label}>
              <CardHeader className="admin-control-panel-stat-header">
                <CardTitle className="admin-control-panel-stat-label">
                  {label}
                </CardTitle>
                <Icon className="admin-control-panel-stat-icon" aria-hidden="true" />
              </CardHeader>
              <CardContent className="admin-control-panel-stat-value">
                {value}
              </CardContent>
            </Card>
          ))}
        </section>

        <section
          className="admin-control-panel-charts"
          aria-label={t('adminControlPanel.analytics')}
        >
          <StatusChart
            title={t('adminControlPanel.userAnalytics')}
            description={t('adminControlPanel.userAnalyticsDescription')}
            data={userStatusData}
            locale={locale}
            language={language}
            countLabel={t('adminControlPanel.chartCount')}
          />
          <StatusChart
            title={t('adminControlPanel.orderAnalytics')}
            description={t('adminControlPanel.orderAnalyticsDescription')}
            data={orderStatusData}
            locale={locale}
            language={language}
            countLabel={t('adminControlPanel.chartCount')}
          />
          <StatusChart
            title={t('adminControlPanel.supportAnalytics')}
            description={t('adminControlPanel.supportAnalyticsDescription')}
            data={requestStatusData}
            locale={locale}
            language={language}
            countLabel={t('adminControlPanel.chartCount')}
          />
        </section>

        <section aria-labelledby="admin-recent-stores-heading">
          <Card className="admin-control-panel-stores">
            <CardHeader className="admin-control-panel-stores-header">
              <div>
                <CardTitle id="admin-recent-stores-heading">
                  {t('adminControlPanel.recentStores')}
                </CardTitle>
                <CardDescription>
                  {t('adminControlPanel.recentStoresDescription')}
                </CardDescription>
              </div>
              <CardAction className="admin-control-panel-completed-value">
                <BadgeDollarSign aria-hidden="true" />
                <span>{currencyFormat.format(counts.completedOrderValue)}</span>
                <small>{t('adminControlPanel.completedOrderValue')}</small>
              </CardAction>
            </CardHeader>
            <CardContent className="admin-control-panel-stores-content">
              {recentUsers.length === 0 ? (
                <p className="admin-control-panel-empty">
                  {t('adminControlPanel.emptyStores')}
                </p>
              ) : (
                <Table className="admin-control-panel-table">
                  <TableCaption className="sr-only">
                    {t('adminControlPanel.recentStores')}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('adminControlPanel.columns.name')}</TableHead>
                      <TableHead>{t('adminControlPanel.columns.type')}</TableHead>
                      <TableHead>{t('adminControlPanel.columns.registered')}</TableHead>
                      <TableHead>{t('adminControlPanel.columns.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="admin-control-panel-store-name">
                          {user.name[language] || user.name.en}
                        </TableCell>
                        <TableCell>{t(`adminUsers.roles.${user.role}`)}</TableCell>
                        <TableCell>
                          {dateFormat.format(new Date(user.joinedAt))}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === 'rejected' || user.status === 'banned'
                                ? 'destructive'
                                : user.status === 'active'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {t(`adminUsers.status.${user.status}`)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="admin-recent-orders-heading">
          <Card className="admin-control-panel-stores">
            <CardHeader className="admin-control-panel-stores-header">
              <div>
                <CardTitle id="admin-recent-orders-heading">
                  {t('adminControlPanel.recentOrders')}
                </CardTitle>
                <CardDescription>
                  {t('adminControlPanel.recentOrdersDescription')}
                </CardDescription>
              </div>
              <CardAction className="admin-control-panel-order-total">
                <ShoppingBag aria-hidden="true" />
                <span>{numberFormat.format(orders.length)}</span>
                <small>{t('adminControlPanel.stats.totalOrders')}</small>
              </CardAction>
            </CardHeader>
            <CardContent className="admin-control-panel-stores-content">
              {orders.length === 0 ? (
                <p className="admin-control-panel-empty">
                  {t('adminControlPanel.emptyOrders')}
                </p>
              ) : (
                <Table className="admin-control-panel-table">
                  <TableCaption className="sr-only">
                    {t('adminControlPanel.recentOrders')}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('adminControlPanel.orderColumns.id')}</TableHead>
                      <TableHead>{t('adminControlPanel.orderColumns.buyer')}</TableHead>
                      <TableHead>{t('adminControlPanel.orderColumns.createdAt')}</TableHead>
                      <TableHead>{t('adminControlPanel.orderColumns.total')}</TableHead>
                      <TableHead>{t('adminControlPanel.orderColumns.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...orders]
                      .sort(
                        (left, right) =>
                          new Date(right.createdAt).getTime() -
                          new Date(left.createdAt).getTime(),
                      )
                      .slice(0, 5)
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="admin-control-panel-store-name">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.buyer[language]}</TableCell>
                          <TableCell>
                            {dateFormat.format(new Date(order.createdAt))}
                          </TableCell>
                          <TableCell>
                            {currencyFormat.format(order.quantity * order.unitPrice)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === 'rejected'
                                  ? 'destructive'
                                  : order.status === 'completed'
                                    ? 'secondary'
                                    : 'outline'
                              }
                            >
                              {t(`supplierOrders.status.${order.status}`)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </>
    )
  }

  return (
    <div className="admin-control-panel-page">
      <div className="admin-control-panel-content">
        <header className="admin-control-panel-heading">
          <div>
            <p className="admin-control-panel-eyebrow">
              <Store aria-hidden="true" />
              {t('adminControlPanel.portalLabel')}
            </p>
            <h1>{t('adminControlPanel.title')}</h1>
            <p className="admin-control-panel-description">
              {t('adminControlPanel.description')}
            </p>
          </div>
          <Badge variant="outline">{t('adminControlPanel.demoData')}</Badge>
        </header>
        {renderDashboardContent()}
      </div>
    </div>
  )
}
