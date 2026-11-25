import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AdminSidebar } from '@/pages/admin/AdminSidebar'
import './admin-layout.css'

export function AdminLayout() {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'

  return (
    <div className="admin-dashboard-page">
      <TooltipProvider>
        <SidebarProvider
          className="admin-workspace-layout"
          defaultOpen={false}
        >
          <AdminSidebar />
          <SidebarInset className="admin-workspace-inset">
            <header className="admin-workspace-header">
              <div className="admin-workspace-heading">
                <SidebarTrigger aria-label={t('adminControlPanel.toggleNavigation')} />
                <span>{t('adminControlPanel.portalLabel')}</span>
              </div>
              <LanguageSwitcher />
            </header>
            <div className="admin-workspace-route" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  )
}
