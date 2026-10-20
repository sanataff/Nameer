import { useState } from 'react'
import { Bell, CalendarDays, CircleDollarSign, ImageIcon, MapPin, Package, PackageCheck, ShoppingBag, Target } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ProductsPage } from '@/pages/supplier/products/ProductsPage'
import { AppShell } from '@/components/AppShell'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { usePageTitle } from '@/hooks/use-page-title'
import { SupplierSidebar } from './SupplierSidebar'

type SupplierWorkspacePageProps = {
  view: 'dashboard' | 'products'
}

type BusinessRequest = {
  id: string
  business: string
  title: string
  description: string
  product: string
  quantity: number
  delivery: string
  location: string
  unitPrice: number
}

function getBusinessName(state: unknown) {
  if (
    typeof state === 'object' &&
    state !== null &&
    'businessName' in state &&
    typeof state.businessName === 'string'
  ) {
    return state.businessName
  }

  return ''
}

export function SupplierWorkspacePage({ view }: SupplierWorkspacePageProps) {
  const { t, i18n: translation } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [selectedRequest, setSelectedRequest] = useState<BusinessRequest | null>(null)
  const [nominatedRequestIds, setNominatedRequestIds] = useState<Set<string>>(() => new Set())
  const language = translation.resolvedLanguage?.split('-')[0] ?? 'ar'
  const businessName = getBusinessName(location.state)
  const monthlyRevenueAmount = 4250
  const monthlyTargetAmount = 6000
  const completedOrders = 26
  const revenue = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(monthlyRevenueAmount)
  const formatMoney = (amount: number) =>
    new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
      maximumFractionDigits: 0,
    }).format(amount)
  const targetProgress = Math.min(
    Math.round((monthlyRevenueAmount / monthlyTargetAmount) * 100),
    100,
  )
  const targetRemaining = Math.max(monthlyTargetAmount - monthlyRevenueAmount, 0)
  const currentMonth = new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())
  const businessRequests: BusinessRequest[] = [
    {
      id: 'rosa-weekly-pastries',
      business: t('supplierDashboard.sampleCafeOne'),
      title: t('supplierDashboard.requestOneTitle'),
      description: t('supplierDashboard.requestOneDescription'),
      product: t('supplierDashboard.requestOneProduct'),
      quantity: 50,
      delivery: t('supplierDashboard.requestOneDelivery'),
      location: t('supplierDashboard.requestOneLocation'),
      unitPrice: 12,
    },
    {
      id: 'dallah-daily-bread',
      business: t('supplierDashboard.sampleCafeTwo'),
      title: t('supplierDashboard.requestTwoTitle'),
      description: t('supplierDashboard.requestTwoDescription'),
      product: t('supplierDashboard.requestTwoProduct'),
      quantity: 35,
      delivery: t('supplierDashboard.requestTwoDelivery'),
      location: t('supplierDashboard.requestTwoLocation'),
      unitPrice: 8,
    },
    {
      id: 'saha-event-date-bites',
      business: t('supplierDashboard.sampleCafeThree'),
      title: t('supplierDashboard.requestThreeTitle'),
      description: t('supplierDashboard.requestThreeDescription'),
      product: t('supplierDashboard.requestThreeProduct'),
      quantity: 120,
      delivery: t('supplierDashboard.requestThreeDelivery'),
      location: t('supplierDashboard.requestThreeLocation'),
      unitPrice: 25,
    },
  ]

  usePageTitle(t(view === 'products' ? 'supplierProducts.title' : 'supplierDashboard.title'))

  const sales = [
    { label: t('supplierDashboard.chartDays.sat'), sales: 48 },
    { label: t('supplierDashboard.chartDays.sun'), sales: 73 },
    { label: t('supplierDashboard.chartDays.mon'), sales: 61 },
    { label: t('supplierDashboard.chartDays.tue'), sales: 34 },
    { label: t('supplierDashboard.chartDays.wed'), sales: 88 },
    { label: t('supplierDashboard.chartDays.thu'), sales: 67 },
    { label: t('supplierDashboard.chartDays.fri'), sales: 79 },
  ]
  const salesChartConfig = {
    sales: {
      label: t('supplierDashboard.salesOverview'),
      color: 'var(--primary)',
    },
  } satisfies ChartConfig
  const performanceMetrics = [
    {
      label: t('supplierDashboard.totalRevenue'),
      value: revenue,
      note: t('supplierDashboard.totalRevenueNote'),
      icon: CircleDollarSign,
    },
    {
      label: t('supplierDashboard.totalOrders'),
      value: formatMoney(completedOrders),
      note: t('supplierDashboard.totalOrdersNote'),
      icon: ShoppingBag,
    },
    {
      label: t('supplierDashboard.monthlyTarget'),
      value: `${formatMoney(monthlyTargetAmount)} ${t('supplierDashboard.currency')}`,
      note: t('supplierDashboard.monthlyTargetNote', {
        percent: targetProgress,
        remaining: `${formatMoney(targetRemaining)} ${t('supplierDashboard.currency')}`,
      }),
      icon: Target,
      progress: targetProgress,
    },
  ]
  const products = [
    { name: t('supplierDashboard.sampleProductOne'), category: t('supplierDashboard.sweets'), price: 20, stock: 18 },
    { name: t('supplierDashboard.sampleProductTwo'), category: t('supplierDashboard.bakedGoods'), price: 30, stock: 9 },
    { name: t('supplierDashboard.sampleProductThree'), category: t('supplierDashboard.sweets'), price: 30, stock: 24 },
  ]

  function navigateTo(nextView: SupplierWorkspacePageProps['view']) {
    navigate(
      nextView === 'products' ? '/supplier/products' : '/supplier/dashboard',
      { state: { businessName } },
    )
  }

  return (
    <AppShell variant="supplier">
      <TooltipProvider>
        <SidebarProvider className="supplier-dashboard-layout" defaultOpen={true}>
         <SupplierSidebar navigateTo={navigateTo}  view={view} />

          <SidebarInset className="supplier-dashboard-content">
            <header className="dashboard-topbar">
              <SidebarTrigger aria-label={t('supplierDashboard.toggleNavigation')} />
              <nav className="dashboard-breadcrumb" aria-label={t('supplierDashboard.navigation')}>
                <span>{businessName || t('supplierDashboard.defaultBusinessName')}</span>
                <span className="dashboard-breadcrumb-separator" aria-hidden="true">/</span>
                <strong>
                  {view === 'products'
                    ? t('supplierProducts.title')
                    : t('supplierDashboard.title')}
                </strong>
              </nav>
              <div className="dashboard-topbar-actions">
                <Button variant="ghost" size="icon" type="button" aria-label={t('supplierDashboard.notifications')}>
                  <Bell aria-hidden="true" />
                </Button>
                <Avatar aria-label={businessName || t('supplierDashboard.profileFallback')}>
                  <AvatarFallback>{businessName.slice(0, 1) || t('supplierDashboard.profileFallback')}</AvatarFallback>
                </Avatar>
              </div>
            </header>

            <div className="dashboard-main">
              {view === 'products' ? <ProductsPage /> : (
                <>
                  <header className="dashboard-welcome">
                    <div>
                      <p className="dashboard-eyebrow">{t('supplierDashboard.welcome')}</p>
                      <h1>{businessName || t('supplierDashboard.defaultBusinessName')}</h1>
                      <p>{t('supplierDashboard.subtitle')}</p>
                    </div>
                    <Badge variant="secondary">{t('supplierDashboard.demoData')}</Badge>
                  </header>

                  <section
                    className={`dashboard-overview dashboard-overview-${language}`}
                    aria-label={t('supplierDashboard.overview')}
                  >
                    <Card className="dashboard-chart-card">
                      <CardHeader>
                        <CardTitle>{t('supplierDashboard.salesOverview')}</CardTitle>
                        <CardDescription>{currentMonth}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="chart-total">
                          <span>{revenue}</span>
                          <Badge variant="secondary">{t('supplierDashboard.revenueChange')}</Badge>
                        </div>
                        <div className={`dashboard-chart-layout dashboard-chart-layout-${language}`}>
                          <ChartContainer
                            className="dashboard-chart"
                            role="img"
                            aria-label={t('supplierDashboard.salesChartLabel')}
                            config={salesChartConfig}
                          >
                            <BarChart accessibilityLayer data={sales}>
                              <CartesianGrid vertical={false} />
                              <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                              />
                              <ChartTooltip
                                cursor={false}
                                content={
                                  <ChartTooltipContent
                                    indicator="dashed"
                                    formatter={(value) =>
                                      `${formatMoney(Number(value))} ${t('supplierDashboard.currency')}`
                                    }
                                  />
                                }
                              />
                              <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                            </BarChart>
                          </ChartContainer>
                          <section
                            className="dashboard-performance-metrics"
                            aria-label={t('supplierDashboard.performanceMetrics')}
                          >
                            {performanceMetrics.map(({ label, value, note, icon: Icon, progress }) => (
                              <div className="dashboard-performance-metric" key={label}>
                                <Icon aria-hidden="true" />
                                <div className="performance-metric-copy">
                                  <span className="performance-metric-label">{label}</span>
                                  <strong className="performance-metric-value">{value}</strong>
                                  <span className="performance-metric-note">{note}</span>
                                  {progress !== undefined && (
                                    <div
                                      className="target-progress"
                                      role="progressbar"
                                      aria-label={label}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                      aria-valuenow={progress}
                                    >
                                      <span style={{ width: `${progress}%` }} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </section>
                        </div>
                      </CardContent>
                    </Card>

                    <section className="dashboard-products-section dashboard-overview-products" aria-labelledby="products-heading">
                      <header className="dashboard-section-heading">
                        <div>
                          <h2 id="products-heading">{t('supplierDashboard.recentProducts')}</h2>
                          <p>{t('supplierDashboard.recentProductsDescription')}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => navigateTo('products')}
                        >
                          <Package aria-hidden="true" />
                          {t('supplierDashboard.manageProducts')}
                        </Button>
                      </header>
                      <div className="dashboard-products">
                        {products.map((product) => (
                          <Card className="dashboard-product-card" key={product.name}>
                            <div className="product-image-placeholder" aria-label={t('supplierDashboard.imagePlaceholder')}>
                              <Skeleton className="product-image-skeleton" />
                              <ImageIcon aria-hidden="true" />
                            </div>
                            <CardContent className="product-card-content">
                              <div className="product-title-row">
                                <h3>{product.name}</h3>
                                <Badge variant="outline">{product.category}</Badge>
                              </div>
                              <p>{t('supplierDashboard.stockAvailable', { count: formatMoney(product.stock) })}</p>
                              <strong>{formatMoney(product.price)} {t('supplierDashboard.currency')} <span>/ {t('supplierDashboard.unit')}</span></strong>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </section>
                  </section>

                  <section className="dashboard-business-requests-section" aria-labelledby="business-requests-heading">
                    <header className="dashboard-section-heading">
                      <div>
                        <h2 id="business-requests-heading">{t('supplierDashboard.businessRequests')}</h2>
                        <p>{t('supplierDashboard.businessRequestsDescription')}</p>
                      </div>
                    </header>
                    <div className="dashboard-business-requests">
                      {businessRequests.map((request) => (
                        <button
                          className="business-request-card"
                          key={request.id}
                          type="button"
                          aria-haspopup="dialog"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <span className="business-request-cover" aria-hidden="true">
                            <PackageCheck />
                            <span>{request.business}</span>
                          </span>
                          <span className="business-request-card-content">
                            <span className="business-request-card-heading">
                              <span className="business-request-title">{request.title}</span>
                              <Badge variant="outline">{request.product}</Badge>
                            </span>
                            <span className="business-request-description">{request.description}</span>
                            <span className="business-request-summary">
                              <span>{t('supplierDashboard.requestQuantity', { count: formatMoney(request.quantity) })}</span>
                              <span aria-hidden="true">·</span>
                              <span>{request.delivery}</span>
                            </span>
                            <span className="business-request-card-footer">
                              <span className="business-request-open">{t('supplierDashboard.viewRequest')}</span>
                              {nominatedRequestIds.has(request.id) && (
                                <Badge className="business-request-nominated" variant="secondary">
                                  {t('supplierDashboard.nominationSent')}
                                </Badge>
                              )}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <Dialog
                    open={selectedRequest !== null}
                    onOpenChange={(open) => {
                      if (!open) setSelectedRequest(null)
                    }}
                  >
                    <DialogContent
                      className="business-request-dialog"
                      closeLabel={t('supplierDashboard.closeDialog')}
                    >
                      {selectedRequest && (
                        <>
                          <DialogHeader className="business-request-dialog-header">
                            <Badge variant="outline">{selectedRequest.business}</Badge>
                            <DialogTitle>{selectedRequest.title}</DialogTitle>
                            <DialogDescription>{selectedRequest.description}</DialogDescription>
                          </DialogHeader>
                          <div className="business-request-details">
                            <div className="business-request-detail">
                              <PackageCheck aria-hidden="true" />
                              <div>
                                <span>{t('supplierDashboard.requestProduct')}</span>
                                <strong>{selectedRequest.product}</strong>
                              </div>
                            </div>
                            <div className="business-request-detail">
                              <ShoppingBag aria-hidden="true" />
                              <div>
                                <span>{t('supplierDashboard.requestQuantityLabel')}</span>
                                <strong>{t('supplierDashboard.requestQuantity', { count: formatMoney(selectedRequest.quantity) })}</strong>
                              </div>
                            </div>
                            <div className="business-request-detail">
                              <CalendarDays aria-hidden="true" />
                              <div>
                                <span>{t('supplierDashboard.deliveryWindow')}</span>
                                <strong>{selectedRequest.delivery}</strong>
                              </div>
                            </div>
                            <div className="business-request-detail">
                              <MapPin aria-hidden="true" />
                              <div>
                                <span>{t('supplierDashboard.deliveryLocation')}</span>
                                <strong>{selectedRequest.location}</strong>
                              </div>
                            </div>
                            <div className="business-request-detail">
                              <CircleDollarSign aria-hidden="true" />
                              <div>
                                <span>{t('supplierDashboard.targetUnitPrice')}</span>
                                <strong>{formatMoney(selectedRequest.unitPrice)} {t('supplierDashboard.currency')}</strong>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              disabled={nominatedRequestIds.has(selectedRequest.id)}
                              onClick={() => {
                                setNominatedRequestIds((current) => new Set(current).add(selectedRequest.id))
                              }}
                            >
                              {nominatedRequestIds.has(selectedRequest.id)
                                ? t('supplierDashboard.nominationSent')
                                : t('supplierDashboard.nominate')}
                            </Button>
                          </DialogFooter>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AppShell>
  )
}
