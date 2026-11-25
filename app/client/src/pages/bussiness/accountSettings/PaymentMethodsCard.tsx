import { CreditCard, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type PaymentMethodsCardProps = {
  onEdit: () => void
}

export default function PaymentMethodsCard({ onEdit }: PaymentMethodsCardProps) {
  return (
    <Card className="account-settings-card">
      <CardHeader className="account-settings-card-header">
        <CardTitle className="account-settings-card-title">طرق الدفع</CardTitle>
        <CardAction>
          <Button
            className="account-settings-edit-button"
            type="button"
            variant="ghost"
            size="icon"
            aria-label="تعديل طرق الدفع"
            onClick={onEdit}
          >
            <Pencil aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="account-settings-card-content">
        <div className="account-settings-payment-method">
          <span className="account-settings-payment-icon" aria-hidden="true">
            <CreditCard />
          </span>
          <span className="account-settings-mada-mark" aria-hidden="true">mada</span>
          <span dir="ltr">Mada (s****or@gmail.com)</span>
        </div>
      </CardContent>
    </Card>
  )
}
