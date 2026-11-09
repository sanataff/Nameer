import {
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react'

export default function SuccessNavbar() {
  return (
    <header className="proposal-success-navbar">
      <div className="proposal-success-navbar-inner">
        <button
          className="proposal-success-avatar"
          type="button"
          aria-label="الملف الشخصي"
        >
          <UserRound aria-hidden="true" />
        </button>

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
          <button
            className="proposal-success-icon-button"
            type="button"
            aria-label="الرسائل"
          >
            <MessageCircle aria-hidden="true" />
          </button>
          <button
            className="proposal-success-icon-button"
            type="button"
            aria-label="سلة التسوق"
          >
            <ShoppingBag aria-hidden="true" />
          </button>
          <button className="proposal-success-orders-button" type="button">
            طلباتي
          </button>
        </nav>
      </div>
    </header>
  )
}
