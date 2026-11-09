import { MessageCircle, Search, ShoppingBag, ShoppingCart, UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type Props = { onPanel: (title: string, description: string) => void; query: string; onQueryChange: (value: string) => void }

export function CartNavbar({ onPanel, query, onQueryChange }: Props) {
  const location = useLocation()
  return (
    <header className="shopping-cart-header">
      <nav aria-label="التنقل الرئيسي">
        <Button variant="ghost" size="icon-lg" aria-label="الملف الشخصي"
          onClick={() => onPanel('الملف الشخصي', 'حساب تجريبي لعرض سلة التسوق.')}>
          <Avatar><AvatarFallback><UserRound /></AvatarFallback></Avatar>
        </Button>
        <label className="shopping-cart-search">
          <Search size={16} aria-hidden="true" />
          <input type="search" placeholder="بحث" aria-label="ابحث في منتجات السلة" value={query}
            onChange={(event) => onQueryChange(event.target.value)} />
        </label>
        <div className="shopping-cart-nav-actions">
          <Button variant="ghost" size="icon-lg" render={<Link to="/business/cart" aria-current={location.pathname === '/business/cart' ? 'page' : undefined} aria-label="سلة التسوق" />}><ShoppingCart /></Button>
          <Button variant="ghost" size="icon-lg" aria-label="الرسائل"
            onClick={() => onPanel('الرسائل', 'لا توجد رسائل في هذا العرض التجريبي.')}><MessageCircle /></Button>
          <Button size="lg" render={<Link to="/business/orders" />}><ShoppingBag data-icon="inline-start" />طلبــاتك</Button>
        </div>
      </nav>
    </header>
  )
}
