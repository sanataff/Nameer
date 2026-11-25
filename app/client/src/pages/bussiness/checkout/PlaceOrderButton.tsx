import { Button } from '@/components/ui/button'

export function PlaceOrderButton({ disabled, onSubmit, error }: { disabled: boolean; onSubmit: () => void; error: string }) {
  return (
    <div className="checkout-submit">
      {error && <p role="alert" id="checkout-validation">{error}</p>}
      <Button size="lg" disabled={disabled} onClick={onSubmit} aria-describedby={error ? 'checkout-validation' : undefined}>إتمام الطلب</Button>
    </div>
  )
}
