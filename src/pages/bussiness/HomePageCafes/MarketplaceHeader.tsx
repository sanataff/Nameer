import {
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react'

type MarketplaceHeaderProps = {
  search: string
  onSearchChange: (value: string) => void
  onNotice: (message: string) => void
}

export default function MarketplaceHeader({
  search,
  onSearchChange,
  onNotice,
}: MarketplaceHeaderProps) {
  return (
    <header className="marketplace-header">
      <div className="marketplace-header-inner">
        <button
          className="marketplace-profile"
          type="button"
          aria-label="الملف الشخصي"
          onClick={() => onNotice('أهلاً بك في نمير!')}
        >
          <UserRound aria-hidden="true" />
        </button>
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
          <button
            className="marketplace-icon-button"
            type="button"
            aria-label="سلة التسوق"
            onClick={() => onNotice('سلتك بانتظار ألذ اختياراتك')}
          >
            <ShoppingBag aria-hidden="true" />
            <span className="marketplace-cart-dot" aria-hidden="true" />
          </button>
          <button
            className="marketplace-icon-button"
            type="button"
            aria-label="الرسائل"
            onClick={() => onNotice('ستظهر رسائلك مع المتاجر هنا')}
          >
            <MessageCircle aria-hidden="true" />
          </button>
          <button
            className="marketplace-orders-button"
            type="button"
            onClick={() => onNotice('ستجد طلباتك هنا قريباً')}
          >
            طلباتك
          </button>
        </nav>
      </div>
    </header>
  )
}
