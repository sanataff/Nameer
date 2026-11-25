import { useState, type FormEvent } from 'react'
import { Plus, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Address } from './checkout-types'

type Props = { addresses: Address[]; selected: string; onSelect: (id: string) => void; onAdd: (label: string) => void }

export function DeliveryAddress({ addresses, selected, onSelect, onAdd }: Props) {
  const [adding, setAdding] = useState(false)
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [street, setStreet] = useState('')
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (![city, district, street].every((value) => value.trim())) return
    onAdd([city, district, street].map((value) => value.trim()).join(' - '))
    setCity(''); setDistrict(''); setStreet(''); setAdding(false)
  }
  return (
    <section className="checkout-address">
      <div className="checkout-section-heading"><Truck aria-hidden="true" /><div><h2>عنوان التوصيل</h2><p>حدد عنوان استلام طلبك</p></div></div>
      <fieldset><legend>العناوين المحفوظة</legend>
        {addresses.map((address) => <label className="checkout-option" key={address.id}>
          <input type="radio" name="delivery-address" value={address.id} checked={selected === address.id} onChange={() => onSelect(address.id)} />
          <span>{address.label}</span>
        </label>)}
      </fieldset>
      <Button variant="ghost" onClick={() => setAdding(!adding)} aria-expanded={adding} aria-controls="checkout-new-address">
        <Plus data-icon="inline-start" />إضافة عنوان جديد
      </Button>
      {adding && <form id="checkout-new-address" className="checkout-address-form" onSubmit={save}>
        <label>المدينة<input required maxLength={80} value={city} onChange={(event) => setCity(event.target.value)} autoComplete="address-level2" /></label>
        <label>الحي<input required maxLength={80} value={district} onChange={(event) => setDistrict(event.target.value)} autoComplete="address-level3" /></label>
        <label>الشارع ورقم المبنى<input required maxLength={160} value={street} onChange={(event) => setStreet(event.target.value)} autoComplete="street-address" /></label>
        <div><Button type="submit">حفظ العنوان</Button><Button type="button" variant="outline" onClick={() => setAdding(false)}>إلغاء</Button></div>
      </form>}
    </section>
  )
}
