import {
  Headset,
  LayoutDashboard,
  Store,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type AdminNavigationItem = {
  href: string
  label: string
  icon: LucideIcon
}

export function AdminSidebar() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'
  const navigationItems: AdminNavigationItem[] = [
    {
      href: '/admin',
      label: t('adminControlPanel.home'),
      icon: LayoutDashboard,
    },
    {
      href: '/admin/users',
      label: t('adminUsers.title'),
      icon: UsersRound,
    },
    {
      href: '/admin/store-verification',
      label: t('storeVerification.title'),
      icon: Store,
    },
    {
      href: '/admin/customer-service',
      label: t('customerService.title'),
      icon: Headset,
    },
  ]

  return (
    <Sidebar
      side={language === 'ar' ? 'right' : 'left'}
      collapsible="icon"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
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
          <SidebarGroupLabel>{t('adminControlPanel.navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === '/admin'
                    ? pathname === '/admin'
                    : pathname === href || pathname.startsWith(`${href}/`)

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link to={href} />}
                      isActive={isActive}
                      tooltip={label}
                      aria-label={label}
                    >
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={t('adminControlPanel.portalLabel')}
              aria-label={t('adminControlPanel.portalLabel')}
            >
              <Avatar>
                <AvatarFallback aria-hidden="true">N</AvatarFallback>
              </Avatar>
              <span className="group-data-[collapsible=icon]:hidden">
                {t('adminControlPanel.portalLabel')}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
