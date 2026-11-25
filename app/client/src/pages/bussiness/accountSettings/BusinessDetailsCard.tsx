import { Mail, MapPin, Pencil, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type BusinessDetailsCardProps = {
  onEdit: () => void
}

export default function BusinessDetailsCard({ onEdit }: BusinessDetailsCardProps) {
  return (
    <Card className="account-settings-card">
      <CardHeader className="account-settings-card-header">
        <CardTitle className="account-settings-card-title">تفاصيل المنشأة</CardTitle>
        <CardAction>
          <Button
            className="account-settings-edit-button"
            type="button"
            variant="ghost"
            size="icon"
            aria-label="تعديل تفاصيل المنشأة"
            onClick={onEdit}
          >
            <Pencil aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="account-settings-card-content">
        <p className="account-settings-business-name">مقهى روزا</p>
        <dl className="account-settings-detail-list">
          <div className="account-settings-detail">
            <MapPin aria-hidden="true" />
            <dt className="sr-only">العنوان</dt>
            <dd>الظهران، الحزام الأكاديمي</dd>
          </div>
          <div className="account-settings-detail">
            <Phone aria-hidden="true" />
            <dt className="sr-only">رقم الهاتف</dt>
            <dd dir="ltr">+966873837423</dd>
          </div>
          <div className="account-settings-detail">
            <Mail aria-hidden="true" />
            <dt className="sr-only">البريد الإلكتروني</dt>
            <dd>
              <a href="mailto:rosacafe@gmail.com">rosacafe@gmail.com</a>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
