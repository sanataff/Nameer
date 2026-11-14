import {
  CalendarDays,
  Clock3,
  PackageCheck,
  Wallet,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const requestDetails = [
  {
    label: 'الميزانية المتوقعة',
    value: 'من ١٬٢٠٠ إلى ١٬٨٠٠ ر.س',
    Icon: Wallet,
  },
  {
    label: 'الكمية المطلوبة',
    value: '١٥٠ قطعة أسبوعياً',
    Icon: PackageCheck,
  },
  {
    label: 'موعد التسليم المتوقع',
    value: 'الأحد، ١٥ يونيو · ٨:٠٠ ص',
    Icon: CalendarDays,
  },
  {
    label: 'مدة التعاون',
    value: 'تجربة أولية لمدة شهر',
    Icon: Clock3,
  },
]

export default function RequestSummaryCard() {
  return (
    <Card className="proposal-card request-summary-card">
      <CardHeader className="proposal-card-header">
        <div className="proposal-card-heading-copy">
          <span className="proposal-section-kicker">تفاصيل العميل</span>
          <CardTitle className="proposal-card-title">ملخص الطلب</CardTitle>
          <CardDescription className="proposal-card-description">
            راجع المعلومات قبل تجهيز عرضك
          </CardDescription>
        </div>
        <span className="proposal-request-status">
          <span aria-hidden="true" />
          يستقبل العروض
        </span>
      </CardHeader>

      <CardContent className="proposal-card-content">
        <div className="proposal-customer">
          <span className="proposal-customer-avatar" aria-hidden="true">ر</span>
          <div>
            <span className="proposal-customer-label">مقدم الطلب</span>
            <strong>مقهى روما</strong>
          </div>
          <span className="proposal-customer-type">مقهى</span>
        </div>

        <div className="proposal-request-intro">
          <h2>حلويات مخصصة لضيافة أسبوعية</h2>
          <p>
            نبحث عن مورد موثوق لتحضير تشكيلة حلويات طازجة ومتنوعة لضيافة زوارنا
            كل أسبوع، مع اهتمام بجودة المكونات وثبات التوريد.
          </p>
        </div>

        <dl className="proposal-request-details">
          {requestDetails.map(({ label, value, Icon }) => (
            <div className="proposal-detail-item" key={label}>
              <span className="proposal-detail-icon">
                <Icon aria-hidden="true" />
              </span>
              <div>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="proposal-request-note">
          <span aria-hidden="true">i</span>
          <p>يمكنك اقتراح تفاصيل مختلفة ضمن ميزانية العميل ومواعيد التسليم المناسبة.</p>
        </div>
      </CardContent>
    </Card>
  )
}
