import {
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react'

type ProductsNavbarProps = {
  search: string
  onSearchChange: (value: string) => void
  onNotice: (message: string) => void
}

export default function ProductsNavbar({
  search,
  onSearchChange,
  onNotice,
}: ProductsNavbarProps) {
  return (
    <header className="browse-products-navbar">
      <div className="browse-products-navbar-inner">
        <button
          className="browse-products-avatar"
          type="button"
          aria-label="الملف الشخصي"
          onClick={() => onNotice('أهلاً بك في حلويات ليلى')}
        >
          <UserRound aria-hidden="true" />
        </button>

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
          <button
            className="browse-products-icon-button"
            type="button"
            aria-label="الرسائل"
            onClick={() => onNotice('ستظهر رسائلك مع المتجر هنا')}
          >
            <MessageCircle aria-hidden="true" />
          </button>
          <button
            className="browse-products-icon-button"
            type="button"
            aria-label="سلة التسوق"
            onClick={() => onNotice('إضافة المنتجات هنا للعرض فقط')}
          >
            <ShoppingBag aria-hidden="true" />
          </button>
          <button
            className="browse-products-orders-button"
            type="button"
            onClick={() => onNotice('ستظهر طلباتك هنا قريباً')}
          >
            طلباتي
          </button>
        </nav>
      </div>
    </header>
  )
}
