import { CreditCard, PackageCheck, ShoppingBag, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'

const notificationItems = [
  { title: 'newOrderTitle', description: 'newOrderDescription', Icon: ShoppingBag },
  { title: 'orderCompletedTitle', description: 'orderCompletedDescription', Icon: PackageCheck },
  { title: 'paymentReminderTitle', description: 'paymentReminderDescription', Icon: CreditCard },
  { title: 'newRatingTitle', description: 'newRatingDescription', Icon: Star },
] as const

export function NotificationsPage() {
  const { t } = useTranslation()

  return (
    <section className="supplier-notifications" aria-labelledby="supplier-notifications-title">
      <h1 id="supplier-notifications-title">{t('supplierNotifications.title')}</h1>
      <div className="supplier-notification-list">
        {notificationItems.map(({ title, description, Icon }) => (
          <Card className="supplier-notification-card" key={title}>
            <CardContent>
              <div className="supplier-notification-heading">
                <h2>{t(`supplierNotifications.${title}`)}</h2>
                <Icon aria-hidden="true" />
              </div>
              <p>{t(`supplierNotifications.${description}`)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
