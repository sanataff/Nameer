import {
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router'
import { useCart } from '../shoppingCart/cart-context'

type MarketplaceHeaderProps = {
  search: string
  onSearchChange: (value: string) => void
}

export default function MarketplaceHeader({
  search,
  onSearchChange,
}: MarketplaceHeaderProps) {
  const { items } = useCart()
  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="marketplace-header">
      <div className="marketplace-header-inner">
        <Link
          className="marketplace-profile"
          to="/business/account-settings"
          aria-label="الملف الشخصي"
        >
          <UserRound aria-hidden="true" />
        </Link>
        <form
          className="marketplace-search"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor="marketplace-search">
            بحث عن متجر أو حلوى
          </label>
          <Search aria-hidden="true" />
          <input
            id="marketplace-search"
            type="search"
            placeholder="بحث"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </form>
        <nav className="marketplace-actions" aria-label="التنقل السريع">
          <Link
            className="marketplace-icon-button"
            to="/business/cart"
            aria-label={`سلة التسوق، ${cartCount} قطعة`}
          >
            <ShoppingBag aria-hidden="true" />
            {cartCount > 0 && (
              <span className="marketplace-cart-dot" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            className="marketplace-icon-button"
            to="/business/chat"
            aria-label="الرسائل"
          >
            <MessageCircle aria-hidden="true" />
          </Link>
          <Link
            className="marketplace-orders-button"
            to="/business/orders"
          >
            طلباتك
          </Link>
        </nav>
      </div>
    </header>
  )
}
