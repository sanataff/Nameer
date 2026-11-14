import type { LucideIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import './admin-summary-cards.css'

export interface AdminSummaryMetric {
  label: string
  value: string
  icon: LucideIcon
}

export function AdminSummaryCards({
  ariaLabel,
  loading,
  metrics,
}: {
  ariaLabel: string
  loading: boolean
  metrics: AdminSummaryMetric[]
}) {
  return (
    <section className="admin-summary-cards" aria-label={ariaLabel}>
      {metrics.map(({ icon: Icon, label, value }) => (
        <Card className="admin-summary-card" key={label}>
          <CardHeader className="admin-summary-card-header">
            <CardTitle className="admin-summary-card-label">{label}</CardTitle>
            <Icon className="admin-summary-card-icon" aria-hidden="true" />
          </CardHeader>
          <CardContent className="admin-summary-card-value">
            {loading ? <Skeleton className="h-8 w-12" /> : value}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
