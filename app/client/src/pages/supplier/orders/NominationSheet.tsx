import type { FormEvent } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CalendarDays,
  CircleDollarSign,
  MapPin,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

export type BusinessRequest = {
  id: string
  business: string
  title: string
  description: string
  product: string
  quantity: number
  delivery: string
  location: string
  unitPrice: number
}

export type BusinessNomination = {
  details: string
  unitPrice: number
  deliveryDays: number
  deliveryTime: string
  providesDelivery: boolean
}

type NominationSheetProps = {
  open: boolean
  selectedRequest: BusinessRequest | null
  isSubmitted: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (requestId: string, nomination: BusinessNomination) => void
}

export default function NominationSheet({
  open,
  selectedRequest,
  isSubmitted,
  onOpenChange,
  onSubmit,
}: NominationSheetProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'
  const formatMoney = useMemo(
    () => new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
      maximumFractionDigits: 0,
    }),
    [language],
  )

  function submitNomination(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedRequest) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const details = String(formData.get('offerDetails') ?? '').trim()
    const detailsField = form.elements.namedItem('offerDetails')
    if (!details) {
      if (detailsField instanceof HTMLTextAreaElement) {
        detailsField.setCustomValidity(t('supplierDashboard.offerDetailsRequired'))
        detailsField.reportValidity()
      }
      return
    }

    onSubmit(selectedRequest.id, {
      details,
      unitPrice: Number(formData.get('unitPrice')),
      deliveryDays: Number(formData.get('deliveryDays')),
      deliveryTime: String(formData.get('deliveryTime') ?? ''),
      providesDelivery: formData.get('providesDelivery') === 'on',
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="business-request-dialog">
        {selectedRequest && (
          <>
            <SheetHeader className="business-request-dialog-header">
              <Badge variant="outline">{selectedRequest.business}</Badge>
              <SheetTitle>{selectedRequest.title}</SheetTitle>
              <SheetDescription>{selectedRequest.description}</SheetDescription>
            </SheetHeader>
            <div className="business-request-details">
              <div className="business-request-detail">
                <PackageCheck aria-hidden="true" />
                <div>
                  <span>{t('supplierDashboard.requestProduct')}</span>
                  <strong>{selectedRequest.product}</strong>
                </div>
              </div>
              <div className="business-request-detail">
                <ShoppingBag aria-hidden="true" />
                <div>
                  <span>{t('supplierDashboard.requestQuantityLabel')}</span>
                  <strong>
                    {t('supplierDashboard.requestQuantity', {
                      count: formatMoney.format(selectedRequest.quantity),
                    })}
                  </strong>
                </div>
              </div>
              <div className="business-request-detail">
                <CalendarDays aria-hidden="true" />
                <div>
                  <span>{t('supplierDashboard.deliveryWindow')}</span>
                  <strong>{selectedRequest.delivery}</strong>
                </div>
              </div>
              <div className="business-request-detail">
                <MapPin aria-hidden="true" />
                <div>
                  <span>{t('supplierDashboard.deliveryLocation')}</span>
                  <strong>{selectedRequest.location}</strong>
                </div>
              </div>
              <div className="business-request-detail">
                <CircleDollarSign aria-hidden="true" />
                <div>
                  <span>{t('supplierDashboard.targetUnitPrice')}</span>
                  <strong>
                    {formatMoney.format(selectedRequest.unitPrice)} {t('supplierDashboard.currency')}
                  </strong>
                </div>
              </div>
            </div>
            <form className="business-nomination-form" onSubmit={submitNomination}>
              <FieldGroup className="business-nomination-fields">
                <Field>
                  <FieldLabel htmlFor="offer-details">
                    {t('supplierDashboard.offerDetails')}
                  </FieldLabel>
                  <Textarea
                    id="offer-details"
                    name="offerDetails"
                    placeholder={t('supplierDashboard.offerDetailsPlaceholder')}
                    onChange={(event) => event.currentTarget.setCustomValidity('')}
                    required
                    rows={4}
                    disabled={isSubmitted}
                  />
                </Field>
                <div className="business-nomination-row">
                  <Field>
                    <FieldLabel htmlFor="offer-unit-price">
                      {t('supplierDashboard.offerUnitPrice')}
                    </FieldLabel>
                    <Input
                      id="offer-unit-price"
                      name="unitPrice"
                      type="number"
                      min="0.01"
                      step="0.01"
                      inputMode="decimal"
                      required
                      disabled={isSubmitted}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="offer-delivery-days">
                      {t('supplierDashboard.offerDeliveryDays')}
                    </FieldLabel>
                    <Input
                      id="offer-delivery-days"
                      name="deliveryDays"
                      type="number"
                      min="1"
                      step="1"
                      placeholder={t('supplierDashboard.offerDeliveryDaysPlaceholder')}
                      required
                      disabled={isSubmitted}
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="offer-delivery-time">
                    {t('supplierDashboard.offerDeliveryTime')}
                  </FieldLabel>
                  <Input
                    id="offer-delivery-time"
                    name="deliveryTime"
                    type="time"
                    required
                    disabled={isSubmitted}
                  />
                </Field>
                <label className="business-delivery-option" htmlFor="provides-delivery">
                  <input
                    id="provides-delivery"
                    name="providesDelivery"
                    type="checkbox"
                    disabled={isSubmitted}
                  />
                  <span>
                    <strong>{t('supplierDashboard.providesDelivery')}</strong>
                    <span>{t('supplierDashboard.providesDeliveryDescription')}</span>
                  </span>
                </label>
              </FieldGroup>
              <SheetFooter className="business-nomination-footer">
                <Button type="submit" disabled={isSubmitted}>
                  {isSubmitted
                    ? t('supplierDashboard.nominationSent')
                    : t('supplierDashboard.nominate')}
                </Button>
              </SheetFooter>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
