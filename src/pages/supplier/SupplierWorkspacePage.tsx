import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { RecentProductsSection } from '@/pages/supplier/dashboard/RecentProductsSection'
import { NotificationsPage } from '@/pages/supplier/notifications/NotificationsPage'
import { ProductsPage } from '@/pages/supplier/products/ProductsPage'
import { OrdersPage } from '@/pages/supplier/orders/OrdersPage'
import BusinessRequestList from './orders/BussinessRequestsList'
import NominationSheet, {
  type BusinessNomination,
  type BusinessRequest,
} from '@/pages/supplier/orders/NominationSheet'
import SupplierHeader from './SuplierHeader'
import { AppShell } from '@/components/AppShell'
import { Badge } from '@/components/ui/badge'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { usePageTitle } from '@/hooks/use-page-title'
import { SupplierSidebar } from './SupplierSidebar'
import ChartDashboard from './dashboard/ChartDashboard'
type SupplierWorkspacePageProps = {
  view: 'dashboard' | 'products' | 'orders' | 'notifications'
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
  const [selectedRequest, setSelectedRequest] = useState<BusinessRequest | null>(null)
  const [nominations, setNominations] = useState<Map<string, BusinessNomination>>(() => new Map())
  const language = translation.resolvedLanguage?.split('-')[0] ?? 'ar'
  const businessName = getBusinessName(location.state)
 
  usePageTitle(t(
    view === 'products'
      ? 'supplierProducts.title'
      : view === 'orders'
        ? 'supplierOrders.title'
        : view === 'notifications'
          ? 'supplierNotifications.title'
        : 'supplierDashboard.title',
  ))


  function navigateTo(nextView: SupplierWorkspacePageProps['view']) {
    navigate(
      nextView === 'products'
        ? '/supplier/products'
        : nextView === 'orders'
          ? '/supplier/orders'
          : nextView === 'notifications'
            ? '/supplier/notifications'
            : '/supplier/dashboard',
      { state: { businessName } },
    )
  }

  return (
    <AppShell variant="supplier">
      <TooltipProvider>
        <SidebarProvider className="supplier-dashboard-layout" defaultOpen={true}>
         <SupplierSidebar navigateTo={navigateTo} view={view} />

          <SidebarInset className="supplier-dashboard-content">
            <SupplierHeader view={view} />

            <div className="dashboard-main">
              {view === 'notifications' ? <NotificationsPage /> : view === 'products' ? <ProductsPage /> : view === 'orders' ? <OrdersPage /> : (
                <>
                  <header className="dashboard-welcome">
                    <div>
                      <p className="dashboard-eyebrow">{t('supplierDashboard.welcome')}</p>
                      <h1>{businessName || t('supplierDashboard.defaultBusinessName')}</h1>
                      <p>{t('supplierDashboard.subtitle')}</p>
                    </div>
                    <Badge variant="secondary">{t('supplierDashboard.demoData')}</Badge>
                  </header>

                  <section
                    className={`dashboard-overview dashboard-overview-${language}`}
                    aria-label={t('supplierDashboard.overview')}
                  >
                   
                    <ChartDashboard view={view}/>
                    <RecentProductsSection onManageProducts={() => navigateTo('products')} />
                  </section>

                  <section className="dashboard-business-requests-section" aria-labelledby="business-requests-heading">
<BusinessRequestList onSelectRequest={setSelectedRequest} nominations={nominations} />
                  </section>
                  <NominationSheet
                    open={selectedRequest !== null}
                    selectedRequest={selectedRequest}
                    isSubmitted={selectedRequest !== null && nominations.has(selectedRequest.id)}
                    onOpenChange={(open) => {
                      if (!open) setSelectedRequest(null)
                    }}
                    onSubmit={(requestId, nomination) => {
                      setNominations((current) => new Map(current).set(requestId, nomination))
                      setSelectedRequest(null)
                    }}
                  />
                </>
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AppShell>
  )
}
