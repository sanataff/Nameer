import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type Invoice = {
  businessName: string
  date: string
}

type InvoicesCardProps = {
  onDownload: (businessName: string) => void
}

const invoices: Invoice[] = [
  { businessName: 'متجر ليلى للحلويات', date: '12/10/2025' },
  { businessName: 'مخبز الخبز الطازج', date: '15/11/2025' },
  { businessName: 'مخبز تشيزكيك', date: '20/12/2025' },
]

export default function InvoicesCard({ onDownload }: InvoicesCardProps) {
  return (
    <Card className="account-settings-card">
      <CardHeader className="account-settings-card-header">
        <CardTitle className="account-settings-card-title">الفواتير</CardTitle>
      </CardHeader>
      <CardContent className="account-settings-invoices">
        {invoices.map((invoice, index) => (
          <div className="account-settings-invoice-wrap" key={invoice.businessName}>
            {index > 0 && <Separator className="account-settings-invoice-separator" />}
            <div className="account-settings-invoice">
              <div className="account-settings-invoice-copy">
                <strong>{invoice.businessName}</strong>
                <time dateTime={invoice.date.split('/').reverse().join('-')}>
                  {invoice.date}
                </time>
              </div>
              <Button
                className="account-settings-download-button"
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`تنزيل فاتورة ${invoice.businessName}`}
                onClick={() => onDownload(invoice.businessName)}
              >
                <Download aria-hidden="true" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
