import type { ReactNode } from 'react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import '../App.css'

type AppShellProps = {
  children: ReactNode
  variant?: 'auth' | 'supplier'
}

export function AppShell({ children, variant = 'auth' }: AppShellProps) {
  return (
    <div className={`app-shell app-shell--${variant}`}>
      <LanguageSwitcher />
      {children}
    </div>
  )
}
