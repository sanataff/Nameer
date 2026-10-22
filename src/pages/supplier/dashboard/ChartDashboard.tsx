import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { CircleDollarSign, ShoppingBag, Target } from "lucide-react"
import { useTranslation } from "react-i18next"
import { BarChart, CartesianGrid, XAxis, Bar } from "recharts"
import { usePageTitle } from '@/hooks/use-page-title'


type ChartDashboard = {
  view: 'dashboard' | 'products' | 'orders'
}
export default function ChartDashboard({view}: ChartDashboard){
  const completedOrders = 26
    const { t, i18n: translation } = useTranslation()
      const language = translation.resolvedLanguage?.split('-')[0] ?? 'ar'

    const monthlyRevenueAmount = 4250
  const monthlyTargetAmount = 6000
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

  usePageTitle(t(
    view === 'products'
      ? 'supplierProducts.title'
      : view === 'orders'
        ? 'supplierOrders.title'
        : 'supplierDashboard.title',
  ))
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
    return(
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
    )
}