import { Wallet } from 'lucide-react'
import type { Payment } from './checkout-types'

export function PaymentMethod({ selected, onSelect }: { selected: Payment | ''; onSelect: (value: Payment) => void }) {
  return (
    <section className="checkout-payment">
      <div className="checkout-section-heading"><Wallet aria-hidden="true" /><div><h2>طريقة الدفع</h2><p>حدد طريقة الدفع</p></div></div>
      <fieldset><legend className="sr-only">اختر طريقة دفع واحدة</legend>
        <label className="checkout-option"><input type="radio" name="payment" checked={selected === 'mada'} onChange={() => onSelect('mada')} />مدى</label>
        <label className="checkout-option"><input type="radio" name="payment" checked={selected === 'cash'} onChange={() => onSelect('cash')} />الدفع عند الاستلام</label>
      </fieldset>
    </section>
  )
}
