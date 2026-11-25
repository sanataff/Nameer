import { UserRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function CustomerInfo() {
  // MOCK PROFILE: no real customer information is fetched or stored.
  return (
    <section className="checkout-customer" aria-label="معلومات العميل">
      <Avatar><AvatarFallback><UserRound aria-hidden="true" /></AvatarFallback></Avatar>
      <div><h2>حيّاك، مقهى روزا!</h2><p>رقم الجوال: <bdi>050 000 0000</bdi></p></div>
    </section>
  )
}
