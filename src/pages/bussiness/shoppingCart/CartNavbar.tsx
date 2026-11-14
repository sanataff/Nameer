import { MessageCircle, Search, ShoppingBag, ShoppingCart, UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCart } from './cart-context'

type Props = { query: string; onQueryChange: (value: string) => void }

export function CartNavbar({ query, onQueryChange }: Props) {
  const location = useLocation()
  const { items } = useCart()
  const cartCount = items.reduce((total, item) => total + item.quantity, 0)
  return (
    <header className="shopping-cart-header">
      <nav aria-label="التنقل الرئيسي">
        <Button nativeButton={false} variant="ghost" size="icon-lg" aria-label="الملف الشخصي"
          render={<Link to="/business/account-settings" />}>
          <Avatar><AvatarFallback><UserRound /></AvatarFallback></Avatar>
        </Button>
        <label className="shopping-cart-search">
          <Search size={16} aria-hidden="true" />
          <input type="search" placeholder="بحث" aria-label="ابحث في منتجات السلة" value={query}
            onChange={(event) => onQueryChange(event.target.value)} />
        </label>
        <div className="shopping-cart-nav-actions">
          <Button nativeButton={false} variant="ghost" size="icon-lg" render={<Link to="/business/cart" aria-current={location.pathname === '/business/cart' ? 'page' : undefined} aria-label={`سلة التسوق، ${cartCount} قطعة`} />}><ShoppingCart /></Button>
          <Button nativeButton={false} variant="ghost" size="icon-lg" aria-label="الرسائل"
            render={<Link to="/business/chat" />}><MessageCircle /></Button>
          <Button nativeButton={false} size="lg" render={<Link to="/business/orders" />}><ShoppingBag data-icon="inline-start" />طلبــاتك</Button>
        </div>
      </nav>
    </header>
  )
}
