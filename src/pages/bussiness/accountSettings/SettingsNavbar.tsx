import {
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type SettingsNavbarProps = {
  onAction: (message: string) => void
}

export default function SettingsNavbar({ onAction }: SettingsNavbarProps) {
  return (
    <header className="account-settings-navbar">
      <div className="account-settings-navbar-inner">
        <button
          className="account-settings-avatar"
          type="button"
          aria-label="الملف الشخصي"
          onClick={() => onAction('مرحباً بك في إعدادات حسابك.')}
        >
          <UserRound aria-hidden="true" />
        </button>

        <form
          className="account-settings-search"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor="account-settings-search">
            بحث
          </label>
          <Search aria-hidden="true" />
          <input id="account-settings-search" type="search" placeholder="بحث" />
        </form>

        <nav className="account-settings-nav-actions" aria-label="التنقل السريع">
          <Button
            className="account-settings-nav-icon"
            type="button"
            variant="ghost"
            size="icon"
            aria-label="الرسائل"
            onClick={() => onAction('لا توجد رسائل جديدة.')}
          >
            <MessageCircle aria-hidden="true" />
          </Button>
          <Button
            className="account-settings-nav-icon"
            type="button"
            variant="ghost"
            size="icon"
            aria-label="سلة التسوق"
            onClick={() => onAction('سلة التسوق فارغة حالياً.')}
          >
            <ShoppingBag aria-hidden="true" />
          </Button>
          <Button
            className="account-settings-orders-button"
            type="button"
            onClick={() => onAction('ستجد طلباتك هنا قريباً.')}
          >
            طلباتي
          </Button>
        </nav>
      </div>
    </header>
  )
}
