import { useState } from 'react'
import { Link } from 'react-router'
import { ChatPanel, type ChatContact } from '@/components/chat/ChatPanel'
import { Button } from '@/components/ui/button'
import { DirectionProvider } from '@/components/ui/direction'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePageTitle } from '@/hooks/use-page-title'
import { CartNavbar } from '../shoppingCart/CartNavbar'
import { useCart } from '../shoppingCart/cart-context'
import '@/App.css'
import '../shoppingCart/shopping-cart.css'
import './business-chat.css'

export default function BusinessChatPage() {
  usePageTitle('المحادثات')
  const { submittedOrder } = useCart()
  const [query, setQuery] = useState('')
  const [panel, setPanel] = useState<{ title: string; description: string } | null>(null)
  // Local conversation keys come from actual order business names, not supplier IDs.
  const contacts: ChatContact[] = [...new Set(submittedOrder?.items.map((item) => item.business) ?? [])].map((name) => ({
    id: name, name, city: '', initials: name.slice(0, 2),
  }))
  return (
    <DirectionProvider direction="rtl">
      <div className="business-chat-page shopping-cart-page" dir="rtl" lang="ar">
        <CartNavbar query={query} onQueryChange={setQuery} onPanel={(title, description) => setPanel({ title, description })} />
        <main className="business-chat-main">
          <Button variant="outline" render={<Link to="/business/order-confirmation" />}>العودة إلى تأكيد الطلب</Button>
          <p className="business-chat-note">محادثة حول طلبك من {contacts.map((contact) => contact.name).join('، ')}. الرسائل محفوظة مؤقتاً في هذه الصفحة ولا تُرسل إلى المتجر، وتُمسح عند مغادرتها.</p>
          {contacts.length
            ? <ChatPanel contacts={contacts} viewer="customer" contactQuery={query} />
            : <p role="status">لا يوجد طلب مؤكد. أكمل الطلب من <Link to="/business/cart">سلة التسوق</Link> أولاً.</p>}
        </main>
        <Dialog open={panel !== null} onOpenChange={(open) => { if (!open) setPanel(null) }}>
          <DialogContent dir="rtl" lang="ar" closeLabel="إغلاق"><DialogHeader>
            <DialogTitle>{panel?.title}</DialogTitle><DialogDescription>{panel?.description}</DialogDescription>
          </DialogHeader></DialogContent>
        </Dialog>
      </div>
    </DirectionProvider>
  )
}
