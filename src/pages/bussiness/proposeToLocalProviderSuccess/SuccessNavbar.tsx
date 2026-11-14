import {
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router'

export default function SuccessNavbar() {
  return (
    <header className="proposal-success-navbar">
      <div className="proposal-success-navbar-inner">
        <Link
          className="proposal-success-avatar"
          to="/business/account-settings"
          aria-label="الملف الشخصي"
        >
          <UserRound aria-hidden="true" />
        </Link>

        <form
          className="proposal-success-search"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor="proposal-success-search">
            بحث
          </label>
          <Search aria-hidden="true" />
          <input
            id="proposal-success-search"
            type="search"
            placeholder="بحث"
          />
        </form>

        <nav className="proposal-success-actions" aria-label="التنقل السريع">
          <Link
            className="proposal-success-icon-button"
            to="/business/chat"
            aria-label="الرسائل"
          >
            <MessageCircle aria-hidden="true" />
          </Link>
          <Link
            className="proposal-success-icon-button"
            to="/business/cart"
            aria-label="سلة التسوق"
          >
            <ShoppingBag aria-hidden="true" />
          </Link>
          <Link className="proposal-success-orders-button" to="/business/orders">
            طلباتي
          </Link>
        </nav>
      </div>
    </header>
  )
}
