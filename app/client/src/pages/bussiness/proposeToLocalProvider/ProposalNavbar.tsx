import {
  Bell,
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router'

type ProposalNavbarProps = {
  onAction: (message: string) => void
}

export default function ProposalNavbar({ onAction }: ProposalNavbarProps) {
  return (
    <header className="proposal-navbar">
      <div className="proposal-navbar-inner">
        <Link
          className="proposal-avatar"
          to="/business/account-settings"
          aria-label="الملف الشخصي"
        >
          <UserRound aria-hidden="true" />
          <span className="proposal-avatar-status" aria-hidden="true" />
        </Link>

        <form
          className="proposal-search"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor="proposal-search">
            البحث في نمير
          </label>
          <Search aria-hidden="true" />
          <input id="proposal-search" type="search" placeholder="ابحث عن طلب أو متجر" />
          <kbd aria-hidden="true">⌘ K</kbd>
        </form>

        <nav className="proposal-nav-actions" aria-label="روابط سريعة">
          <Link
            className="proposal-nav-icon"
            to="/business/chat"
            aria-label="الرسائل"
          >
            <MessageCircle aria-hidden="true" />
            <span className="proposal-nav-unread" aria-hidden="true" />
          </Link>
          <button
            className="proposal-nav-icon proposal-nav-secondary"
            type="button"
            aria-label="الإشعارات"
            onClick={() => onAction('ليس لديك إشعارات جديدة')}
          >
            <Bell aria-hidden="true" />
          </button>
          <Link
            className="proposal-nav-icon proposal-nav-secondary"
            to="/business/cart"
            aria-label="السلة"
          >
            <ShoppingBag aria-hidden="true" />
          </Link>
          <Link
            className="proposal-orders-button"
            to="/business/orders"
          >
            طلباتي
          </Link>
        </nav>
      </div>
    </header>
  )
}
