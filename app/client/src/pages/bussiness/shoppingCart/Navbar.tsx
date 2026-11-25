import { useState } from 'react'
import { Bell, MessageCircle, Search, ShoppingBag, ShoppingCart, UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCart } from './cart-context'
import './shopping-cart.css'

type Props = {
  searchLabel?: string
  onNotification?: () => void
} & (
  | { query: string; onQueryChange: (value: string) => void }
  | { query?: never; onQueryChange?: never }
)

export function Navbar({
  query,
  onQueryChange,
  searchLabel = 'ابحث في نمير',
  onNotification,
}: Props) {
  const location = useLocation()
  const { items } = useCart()
  const [localQuery, setLocalQuery] = useState('')
  const cartCount = items.reduce((total, item) => total + item.quantity, 0)
  const searchValue = query ?? localQuery

  function updateQuery(value: string) {
    if (onQueryChange) {
      onQueryChange(value)
    } else {
      setLocalQuery(value)
    }
  }

  return (
    <header className="shopping-cart-header">
      <nav aria-label="التنقل الرئيسي">
        <Button nativeButton={false} variant="ghost" size="icon-lg" aria-label="الملف الشخصي"
          render={<Link to="/business/account-settings" />}>
          <Avatar><AvatarFallback><UserRound /></AvatarFallback></Avatar>
        </Button>
        <form className="shopping-cart-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <Search size={16} aria-hidden="true" />
          <input type="search" placeholder="بحث" aria-label={searchLabel} value={searchValue}
            onChange={(event) => updateQuery(event.target.value)} />
        </form>
        <div className="shopping-cart-nav-actions">
          <Button nativeButton={false} variant="ghost" size="icon-lg" render={<Link to="/business/cart" aria-current={location.pathname === '/business/cart' ? 'page' : undefined} aria-label={`سلة التسوق، ${cartCount} قطعة`} />}><ShoppingCart /></Button>
          <Button nativeButton={false} variant="ghost" size="icon-lg" aria-label="الرسائل"
            render={<Link to="/business/chat" aria-current={location.pathname === '/business/chat' ? 'page' : undefined} />}><MessageCircle /></Button>
          {onNotification && (
            <Button type="button" variant="ghost" size="icon-lg" aria-label="الإشعارات" onClick={onNotification}>
              <Bell />
            </Button>
          )}
          <Button nativeButton={false} size="lg" render={<Link to="/business/orders" aria-current={location.pathname === '/business/orders' ? 'page' : undefined} />}><ShoppingBag data-icon="inline-start" />طلبــاتك</Button>
        </div>
      </nav>
    </header>
  )
}
