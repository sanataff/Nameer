import {
  ChartNoAxesColumn,
  Headset,
  Store,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import './control-panel.css'

type Metric = {
  label: string
  value: number
  icon: LucideIcon
}

// MOCK DATA: figures and sample rows match the supplied control panel reference.
const recentStores = [
  {
    id: 'owl',
    name: { en: 'OWL', ar: 'OWL' },
    type: 'cafe',
  },
  {
    id: 'maram',
    name: { en: 'Maram Cafe', ar: 'مرام كافيه' },
    type: 'cafe',
  },
  {
    id: 'mona',
    name: { en: 'Mona', ar: 'منى' },
    type: 'supplier',
  },
] as const

export function AdminControlPanelPage() {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'
  const locale = language === 'ar' ? 'ar-SA' : 'en-SA'

  usePageTitle(t('adminControlPanel.title'))

  const metrics: Metric[] = [
    {
      label: t('adminControlPanel.stats.verifiedStores'),
      value: 6,
      icon: Store,
    },
    {
      label: t('adminControlPanel.stats.currentOrders'),
      value: 7,
      icon: ChartNoAxesColumn,
    },
    {
      label: t('adminControlPanel.stats.pendingVerifications'),
      value: 2,
      icon: TriangleAlert,
    },
    {
      label: t('adminControlPanel.stats.openTickets'),
      value: 4,
      icon: Headset,
    },
  ]

  const registrationDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date('2026-10-10T12:00:00'))

  return (
    <div className="admin-control-panel-page">
      <div className="admin-control-panel-content">
        <header className="admin-control-panel-heading">
          <div>
            <p className="admin-control-panel-eyebrow">
              {t('adminControlPanel.portalLabel')}
            </p>
            <h1>{t('adminControlPanel.title')}</h1>
          </div>
          <Badge variant="outline">{t('adminControlPanel.demoData')}</Badge>
        </header>

        <section
          className="admin-control-panel-overview"
          aria-label={t('adminControlPanel.overview')}
        >
          <div className="admin-control-panel-metrics">
            {metrics.map(({ label, value, icon: Icon }) => (
              <Card className="admin-control-panel-stat" key={label}>
                <CardHeader className="admin-control-panel-stat-header">
                  <Icon className="admin-control-panel-stat-icon" aria-hidden="true" />
                  <CardTitle className="admin-control-panel-stat-value">
                    {value}
                  </CardTitle>
                </CardHeader>
                <CardContent className="admin-control-panel-stat-label">
                  {label}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="admin-recent-stores-heading">
          <Card className="admin-control-panel-stores">
            <CardHeader className="admin-control-panel-stores-header">
              <CardTitle id="admin-recent-stores-heading">
                {t('adminControlPanel.recentStores')}
              </CardTitle>
            </CardHeader>
            <CardContent className="admin-control-panel-stores-content">
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
                  {recentStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="admin-control-panel-store-name">
                        {store.name[language === 'en' ? 'en' : 'ar']}
                      </TableCell>
                      <TableCell>
                        {t(`storeVerification.filters.${store.type}`)}
                      </TableCell>
                      <TableCell>{registrationDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {t('adminControlPanel.verified')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
