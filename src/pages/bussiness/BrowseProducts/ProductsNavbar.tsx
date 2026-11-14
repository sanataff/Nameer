import {
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router'

type ProductsNavbarProps = {
  search: string
  onSearchChange: (value: string) => void
}

export default function ProductsNavbar({
  search,
  onSearchChange,
}: ProductsNavbarProps) {
  return (
    <header className="browse-products-navbar">
      <div className="browse-products-navbar-inner">
        <Link
          className="browse-products-avatar"
          to="/business/account-settings"
          aria-label="الملف الشخصي"
        >
          <UserRound aria-hidden="true" />
        </Link>

        <form
          className="browse-products-search"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor="browse-products-search">
            بحث عن منتج
          </label>
          <Search aria-hidden="true" />
          <input
            id="browse-products-search"
            type="search"
            placeholder="بحث"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </form>

        <nav className="browse-products-nav-actions" aria-label="التنقل السريع">
          <Link
            className="browse-products-icon-button"
            to={`/business/chat?contact=${encodeURIComponent('حلويات ليلى')}`}
            aria-label="الرسائل"
          >
            <MessageCircle aria-hidden="true" />
          </Link>
          <Link
            className="browse-products-icon-button"
            to="/business/cart"
            aria-label="سلة التسوق"
          >
            <ShoppingBag aria-hidden="true" />
          </Link>
          <Link
            className="browse-products-orders-button"
            to="/business/orders"
          >
            طلباتي
          </Link>
        </nav>
      </div>
    </header>
  )
}
