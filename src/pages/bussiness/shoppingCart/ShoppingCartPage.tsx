import { useState } from 'react'
import { useNavigate } from 'react-router'
import { DirectionProvider } from '@/components/ui/direction'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePageTitle } from '@/hooks/use-page-title'
import { CartNavbar } from './CartNavbar'
import { CartItemList } from './CartItemList'
import { OrderSummary } from './OrderSummary'
import { useCart } from './cart-context'
import '@fontsource-variable/noto-sans-arabic'
import './shopping-cart.css'

export default function ShoppingCartPage() {
  usePageTitle('سلة التسوق')
  const { items, setItems } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [panel, setPanel] = useState<{ title: string; description: string } | null>(null)
  const visibleItems = items.filter((item) => item.name.includes(query.trim()))

  function updateQuantity(id: string, quantity: number) {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity } : item))
  }

  return (
    <DirectionProvider direction="rtl">
      <div className="shopping-cart-page" dir="rtl" lang="ar">
        <CartNavbar query={query} onQueryChange={setQuery} onPanel={(title, description) => setPanel({ title, description })} />
        <main className="shopping-cart-main">
          <h1>سلة التسوق</h1>
          <div className="shopping-cart-layout">
            <div>
              {items.length > 0 && visibleItems.length === 0
                ? <p className="shopping-cart-empty" role="status">لا توجد منتجات مطابقة لبحثك.</p>
                : <CartItemList items={visibleItems} onQuantityChange={updateQuantity}
                    onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))} />}
            </div>
            {/* The summary includes the entire cart, even while search filters the list. */}
            <OrderSummary items={items} onCheckout={() => navigate('/business/checkout')} />
          </div>
        </main>
        <Dialog open={panel !== null} onOpenChange={(open) => { if (!open) setPanel(null) }}>
          <DialogContent dir="rtl" lang="ar" closeLabel="إغلاق">
            <DialogHeader><DialogTitle>{panel?.title}</DialogTitle><DialogDescription>{panel?.description}</DialogDescription></DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </DirectionProvider>
  )
}
