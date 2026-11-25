import {
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export default function SettingsNavbar() {
  return (
    <header className="account-settings-navbar">
      <div className="account-settings-navbar-inner">
        <Link
          className="account-settings-avatar"
          to="/business/account-settings"
          aria-label="الملف الشخصي"
        >
          <UserRound aria-hidden="true" />
        </Link>

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
            nativeButton={false}
            className="account-settings-nav-icon"
            variant="ghost"
            size="icon"
            aria-label="الرسائل"
            render={<Link to="/business/chat" />}
          >
            <MessageCircle aria-hidden="true" />
          </Button>
          <Button
            nativeButton={false}
            className="account-settings-nav-icon"
            variant="ghost"
            size="icon"
            aria-label="سلة التسوق"
            render={<Link to="/business/cart" />}
          >
            <ShoppingBag aria-hidden="true" />
          </Button>
          <Button
            nativeButton={false}
            className="account-settings-orders-button"
            render={<Link to="/business/orders" />}
          >
            طلباتي
          </Button>
        </nav>
      </div>
    </header>
  )
}
