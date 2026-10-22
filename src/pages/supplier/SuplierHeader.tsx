import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'

type SupplierHeaderProps = {
  view: 'dashboard' | 'products' | 'orders' | 'notifications'
}

function getBusinessName(state: unknown): string {
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

export default function SupplierHeader({ view }: SupplierHeaderProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const businessName = getBusinessName(location.state)

  return (
    <header className="dashboard-topbar">
      <SidebarTrigger aria-label={t('supplierDashboard.toggleNavigation')} />
      <nav className="dashboard-breadcrumb" aria-label={t('supplierDashboard.navigation')}>
        <span>{businessName || t('supplierDashboard.defaultBusinessName')}</span>
        <span className="dashboard-breadcrumb-separator" aria-hidden="true">/</span>
        <strong>
          {view === 'products'
            ? t('supplierProducts.title')
            : view === 'orders'
              ? t('supplierOrders.title')
              : view === 'notifications'
                ? t('supplierNotifications.title')
                : t('supplierDashboard.title')}
        </strong>
      </nav>
      <div className="dashboard-topbar-actions">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label={t('supplierDashboard.notifications')}
          onClick={() => navigate('/supplier/notifications', { state: location.state })}
        >
          <Bell aria-hidden="true" />
        </Button>
        <Avatar aria-label={businessName || t('supplierDashboard.profileFallback')}>
          <AvatarFallback>
            {businessName.slice(0, 1) || t('supplierDashboard.profileFallback')}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}