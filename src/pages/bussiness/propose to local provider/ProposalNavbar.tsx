import {
  Bell,
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react'

type ProposalNavbarProps = {
  onAction: (message: string) => void
}

export default function ProposalNavbar({ onAction }: ProposalNavbarProps) {
  return (
    <header className="proposal-navbar">
      <div className="proposal-navbar-inner">
        <button
          className="proposal-avatar"
          type="button"
          aria-label="الملف الشخصي"
          onClick={() => onAction('الملف الشخصي — أهلاً بك في نمير للأعمال')}
        >
          <UserRound aria-hidden="true" />
          <span className="proposal-avatar-status" aria-hidden="true" />
        </button>

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
          <button
            className="proposal-nav-icon"
            type="button"
            aria-label="الرسائل"
            onClick={() => onAction('ستظهر رسائلك مع العملاء هنا')}
          >
            <MessageCircle aria-hidden="true" />
            <span className="proposal-nav-unread" aria-hidden="true" />
          </button>
          <button
            className="proposal-nav-icon proposal-nav-secondary"
            type="button"
            aria-label="الإشعارات"
            onClick={() => onAction('ليس لديك إشعارات جديدة')}
          >
            <Bell aria-hidden="true" />
          </button>
          <button
            className="proposal-nav-icon proposal-nav-secondary"
            type="button"
            aria-label="السلة"
            onClick={() => onAction('السلة فارغة حالياً')}
          >
            <ShoppingBag aria-hidden="true" />
          </button>
          <button
            className="proposal-orders-button"
            type="button"
            onClick={() => onAction('ستجد طلباتك وعروضك في هذه الصفحة')}
          >
            طلباتي
          </button>
        </nav>
      </div>
    </header>
  )
}
