import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ChatPanel, type ChatContact } from '@/components/chat/ChatPanel'
import { Button } from '@/components/ui/button'
import { DirectionProvider } from '@/components/ui/direction'
import { usePageTitle } from '@/hooks/use-page-title'
import { vendors } from '../HomePageCafes/vendors'
import { CartNavbar } from '../shoppingCart/CartNavbar'
import { useCart } from '../shoppingCart/cart-context'
import '@/App.css'
import '../shoppingCart/shopping-cart.css'
import './business-chat.css'

export default function BusinessChatPage() {
  usePageTitle('المحادثات')
  const { submittedOrder } = useCart()
  const [query, setQuery] = useState('')
  const [searchParams] = useSearchParams()
  const requestedContact = searchParams.get('contact')?.trim()
  const orderContacts = submittedOrder?.items.map((item) => item.business) ?? []
  const contactNames = [...new Set([
    ...(requestedContact ? [requestedContact] : []),
    ...orderContacts,
    ...(!requestedContact && !submittedOrder ? vendors.map((vendor) => vendor.name) : []),
  ])]
  const contacts: ChatContact[] = contactNames.map((name) => ({
    id: name, name, city: '', initials: name.slice(0, 2),
  }))
  return (
    <DirectionProvider direction="rtl">
      <div className="business-chat-page shopping-cart-page" dir="rtl" lang="ar">
        <CartNavbar query={query} onQueryChange={setQuery} />
        <main className="business-chat-main">
          <Button nativeButton={false} variant="outline" render={<Link to="/business/home-page-cafes" />}>العودة إلى المتاجر</Button>
          <p className="business-chat-note">{submittedOrder ? 'محادثة حول طلبك مع' : 'محادثات المتاجر'} {contacts.map((contact) => contact.name).join('، ')}</p>
          {contacts.length
            ? <ChatPanel contacts={contacts} viewer="customer" contactQuery={query} />
            : <p role="status">لا يوجد طلب مؤكد. أكمل الطلب من <Link to="/business/cart">سلة التسوق</Link> أولاً.</p>}
        </main>
      </div>
    </DirectionProvider>
  )
}
