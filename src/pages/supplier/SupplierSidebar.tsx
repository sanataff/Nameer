import  { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, Package, ShoppingBag, CircleDollarSign, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
type SupplierSidebarProps = {
view: 'dashboard' | 'products' | 'orders' | 'notifications'

  navigateTo: (nextView: 'dashboard' | 'products' | 'orders' | 'notifications') => void
}
export function SupplierSidebar({navigateTo, view}:SupplierSidebarProps ){
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

      const { t, i18n: translation } = useTranslation()
  const location = useLocation()
    const businessName = getBusinessName(location.state)
    
  const language = translation.resolvedLanguage?.split('-')[0] ?? 'ar'
    return(
        <>
 <Sidebar side={language === 'ar' ? 'right' : 'left'} collapsible="icon">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" tooltip="Nameer" aria-label="Nameer">
                    <span className="sidebar-brand" aria-hidden="true">N</span>
                    <span className="group-data-[collapsible=icon]:hidden">Nameer</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>{t('supplierDashboard.navigation')}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={view === 'dashboard'}
                        tooltip={t('supplierDashboard.title')}
                        aria-label={t('supplierDashboard.title')}
                        onClick={() => navigateTo('dashboard')}
                      >
                        <LayoutDashboard aria-hidden="true" />
                        <span>{t('supplierDashboard.title')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={view === 'products'}
                        tooltip={t('supplierProducts.title')}
                        aria-label={t('supplierProducts.title')}
                        onClick={() => navigateTo('products')}
                      >
                        <Package aria-hidden="true" />
                        <span>{t('supplierProducts.title')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={view === 'orders'}
                        tooltip={t('supplierDashboard.orders')}
                        aria-label={t('supplierDashboard.orders')}
                        onClick={() => navigateTo('orders')}
                      >
                        <ShoppingBag aria-hidden="true" />
                        <span>{t('supplierDashboard.orders')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={view === 'notifications'}
                        tooltip={t('supplierNotifications.title')}
                        aria-label={t('supplierNotifications.title')}
                        onClick={() => navigateTo('notifications')}
                      >
                        <Bell aria-hidden="true" />
                        <span>{t('supplierNotifications.title')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        disabled
                        tooltip={t('supplierDashboard.monthlyRevenue')}
                        aria-label={t('supplierDashboard.monthlyRevenue')}
                      >
                        <CircleDollarSign aria-hidden="true" />
                        <span>{t('supplierDashboard.monthlyRevenue')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    tooltip={businessName || t('supplierDashboard.profileFallback')}
                    aria-label={businessName || t('supplierDashboard.profileFallback')}
                  >
                    <Avatar className="sidebar-profile">
                      <AvatarFallback>{businessName.slice(0, 1) || t('supplierDashboard.profileFallback')}</AvatarFallback>
                    </Avatar>
                    <span className="group-data-[collapsible=icon]:hidden">
                      {businessName || t('supplierDashboard.profileFallback')}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar> 
          </> 
            )
}