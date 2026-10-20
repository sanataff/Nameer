import { Bell, CircleDollarSign, ImageIcon, LayoutDashboard, Package, ShoppingBag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ProductsPage } from '@/pages/supplier/products/ProductsPage'
import { AppShell } from '@/components/AppShell'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TooltipProvider } from '@/components/ui/tooltip'
import { usePageTitle } from '@/hooks/use-page-title'

type SupplierWorkspacePageProps = {
  view: 'dashboard' | 'products'
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
  const language = translation.resolvedLanguage?.split('-')[0] ?? 'ar'
  const businessName = getBusinessName(location.state)
  const revenue = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(4250)
  const formatMoney = (amount: number) =>
    new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
      maximumFractionDigits: 0,
    }).format(amount)
  const currentMonth = new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  usePageTitle(t(view === 'products' ? 'supplierProducts.title' : 'supplierDashboard.title'))

  const metrics = [
    { label: t('supplierDashboard.newRequests'), value: '05', icon: ShoppingBag, note: t('supplierDashboard.newRequestsNote') },
    { label: t('supplierDashboard.products'), value: '12', icon: Package, note: t('supplierDashboard.productsNote') },
    { label: t('supplierDashboard.monthlyRevenue'), value: revenue, icon: CircleDollarSign, note: t('supplierDashboard.revenueNote') },
  ]

  const sales = [
    { label: t('supplierDashboard.chartDays.sat'), sales: 48 },
    { label: t('supplierDashboard.chartDays.sun'), sales: 73 },
    { label: t('supplierDashboard.chartDays.mon'), sales: 61 },
    { label: t('supplierDashboard.chartDays.tue'), sales: 34 },
    { label: t('supplierDashboard.chartDays.wed'), sales: 88 },
    { label: t('supplierDashboard.chartDays.thu'), sales: 67 },
    { label: t('supplierDashboard.chartDays.fri'), sales: 79 },
  ]
  const requests = [
    { cafe: t('supplierDashboard.sampleCafeOne'), product: t('supplierDashboard.sampleProductOne'), quantity: 24, total: 480 },
    { cafe: t('supplierDashboard.sampleCafeTwo'), product: t('supplierDashboard.sampleProductTwo'), quantity: 12, total: 360 },
    { cafe: t('supplierDashboard.sampleCafeThree'), product: t('supplierDashboard.sampleProductThree'), quantity: 18, total: 540 },
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
        <SidebarProvider className="supplier-dashboard-layout" defaultOpen={false}>
          <Sidebar side={language === 'ar' ? 'right' : 'left'} collapsible="icon">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" tooltip="Nameer" aria-label="Nameer">
                    <span className="sidebar-brand" aria-hidden="true">N</span>
                    <span className="group-data-[collapsible=icon]:hidden">Nameer</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>{t('supplierDashboard.navigation')}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={view === 'dashboard'}
                        tooltip={t('supplierDashboard.title')}
                        aria-label={t('supplierDashboard.title')}
                        onClick={() => navigateTo('dashboard')}
                      >
                        <LayoutDashboard aria-hidden="true" />
                        <span>{t('supplierDashboard.title')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={view === 'products'}
                        tooltip={t('supplierProducts.title')}
                        aria-label={t('supplierProducts.title')}
                        onClick={() => navigateTo('products')}
                      >
                        <Package aria-hidden="true" />
                        <span>{t('supplierProducts.title')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        disabled
                        tooltip={t('supplierDashboard.orders')}
                        aria-label={t('supplierDashboard.orders')}
                      >
                        <ShoppingBag aria-hidden="true" />
                        <span>{t('supplierDashboard.orders')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        disabled
                        tooltip={t('supplierDashboard.monthlyRevenue')}
                        aria-label={t('supplierDashboard.monthlyRevenue')}
                      >
                        <CircleDollarSign aria-hidden="true" />
                        <span>{t('supplierDashboard.monthlyRevenue')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    tooltip={businessName || t('supplierDashboard.profileFallback')}
                    aria-label={businessName || t('supplierDashboard.profileFallback')}
                  >
                    <Avatar className="sidebar-profile">
                      <AvatarFallback>{businessName.slice(0, 1) || t('supplierDashboard.profileFallback')}</AvatarFallback>
                    </Avatar>
                    <span className="group-data-[collapsible=icon]:hidden">
                      {businessName || t('supplierDashboard.profileFallback')}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

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

                  <section className="dashboard-metrics" aria-label={t('supplierDashboard.summary')}>
                    {metrics.map(({ label, value, icon: Icon, note }) => (
                      <Card className="dashboard-metric" key={label}>
                        <CardHeader>
                          <CardDescription>{label}</CardDescription>
                          <span className="metric-icon size-10" aria-hidden="true"><Icon /></span>
                        </CardHeader>
                        <CardContent>
                          <p className="metric-value">{value}</p>
                          <p className="metric-note">{note}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </section>

                  <section className="dashboard-overview" aria-label={t('supplierDashboard.overview')}>
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
                        <div
                          className="dashboard-chart"
                          role="img"
                          aria-label={t('supplierDashboard.salesChartLabel')}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8, height: '100%', minHeight: 160 }}>
                            {sales.map(({ label, sales: amount }) => (
                              <div key={label} style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 8, height: '100%' }}>
                                <span aria-hidden="true" style={{ width: '100%', height: `${amount}%`, minHeight: 4, borderRadius: 4, backgroundColor: 'var(--primary)' }} />
                                <span aria-hidden="true">{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="dashboard-request-card">
                      <CardHeader>
                        <CardTitle>{t('supplierDashboard.latestRequests')}</CardTitle>
                        <CardDescription>{t('supplierDashboard.latestRequestsDescription')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table className="request-table">
                          <TableHeader>
                            <TableRow>
                              <TableHead scope="col" className="text-start">{t('supplierDashboard.cafeColumn')}</TableHead>
                              <TableHead scope="col" className="text-start">{t('supplierDashboard.itemColumn')}</TableHead>
                              <TableHead scope="col" className="text-start">{t('supplierDashboard.quantityColumn')}</TableHead>
                              <TableHead scope="col" className="text-start">{t('supplierDashboard.totalColumn')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {requests.map((request, index) => (
                              <TableRow key={request.cafe}>
                                <TableCell>
                                  <div className="request-cafe-cell">
                                    <Avatar className="request-avatar size-8" aria-label={request.cafe}>
                                      <AvatarFallback>{request.cafe.slice(0, 1)}</AvatarFallback>
                                    </Avatar>
                                    <span>{request.cafe}</span>
                                    {index === 0 && <Badge variant="outline">{t('supplierDashboard.pending')}</Badge>}
                                  </div>
                                </TableCell>
                                <TableCell>{request.product}</TableCell>
                                <TableCell>{t('supplierDashboard.quantity', { count: request.quantity })}</TableCell>
                                <TableCell>{formatMoney(request.total)} {t('supplierDashboard.currency')}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </section>

                  <section className="dashboard-products-section" aria-labelledby="products-heading">
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
                            <span>{t('supplierDashboard.imagePlaceholder')}</span>
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
                </>
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AppShell>
  )
}
