import type { ReactNode } from 'react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import '../App.css'

type AppShellProps = {
  children: ReactNode
  variant?: 'auth' | 'supplier'
}

export function AppShell({ children, variant = 'auth' }: AppShellProps) {
  return (
    <div className={variant === 'supplier' ? 'supplier-dashboard-page' : 'app-shell'}>
      <LanguageSwitcher />
      {children}
    </div>
  )
}
