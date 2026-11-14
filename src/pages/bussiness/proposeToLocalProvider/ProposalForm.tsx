import { Check, ChevronDown, Send, Save } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type ProposalFormProps = {
  onSubmit: () => void
}

export default function ProposalForm({ onSubmit }: ProposalFormProps) {
  const [deliveryService, setDeliveryService] = useState(true)
  const [customPackaging, setCustomPackaging] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
    setDraftSaved(false)
  }

  const handleSaveDraft = () => {
    setDraftSaved(true)
  }

  return (
    <section className="proposal-card proposal-form-card" aria-labelledby="proposal-form-title">
      <div className="proposal-form-header">
        <span className="proposal-form-icon" aria-hidden="true">
          <Send />
        </span>
        <div>
          <span className="proposal-section-kicker">عرضك للعميل</span>
          <h2 className="proposal-card-title" id="proposal-form-title">تفاصيل العرض</h2>
          <p className="proposal-card-description">أكمل البيانات التالية لإرسال عرضك</p>
        </div>
      </div>

      <form className="proposal-form" onSubmit={handleSubmit}>
        <FieldGroup className="proposal-fields">
          <Field className="proposal-field proposal-field-full">
            <FieldLabel htmlFor="proposal-description">
              اكتب تفاصيل عرضك <span aria-hidden="true">*</span>
            </FieldLabel>
            <Textarea
              id="proposal-description"
              name="description"
              placeholder="اشرح تشكيلة الحلويات التي تقترحها، المكونات، وأي تفاصيل تهم العميل..."
              rows={5}
              minLength={20}
              required
            />
            <span className="proposal-field-hint">
              وضّح ما يميز عرضك وكيف يلبي احتياج مقهى روما.
            </span>
          </Field>

          <Field className="proposal-field">
            <FieldLabel htmlFor="proposal-unit-price">
              السعر للقطعة <span aria-hidden="true">*</span>
            </FieldLabel>
            <div className="proposal-input-with-unit">
              <Input
                id="proposal-unit-price"
                name="unitPrice"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="مثال: ١٢"
                required
              />
              <span>ر.س</span>
            </div>
          </Field>

          <Field className="proposal-field">
            <FieldLabel htmlFor="proposal-total">
              التكلفة الإجمالية المتوقعة <span aria-hidden="true">*</span>
            </FieldLabel>
            <div className="proposal-input-with-unit">
              <Input
                id="proposal-total"
                name="total"
                type="number"
                min="1"
                step="1"
                placeholder="مثال: ١٬٨٠٠"
                required
              />
              <span>ر.س</span>
            </div>
          </Field>

          <Field className="proposal-field">
            <FieldLabel htmlFor="proposal-preparation">
              مدة التحضير والتجهيز <span aria-hidden="true">*</span>
            </FieldLabel>
            <div className="proposal-select-wrap">
              <select id="proposal-preparation" name="preparation" required defaultValue="">
                <option value="" disabled>اختر مدة التجهيز</option>
                <option value="1">يوم واحد</option>
                <option value="2">يومان</option>
                <option value="3-5">من ٣ إلى ٥ أيام</option>
                <option value="week">أسبوع</option>
              </select>
              <ChevronDown aria-hidden="true" />
            </div>
          </Field>

          <Field className="proposal-field">
            <FieldLabel htmlFor="proposal-delivery-time">
              وقت التسليم المفضل <span aria-hidden="true">*</span>
            </FieldLabel>
            <div className="proposal-select-wrap">
              <select id="proposal-delivery-time" name="deliveryTime" required defaultValue="">
                <option value="" disabled>اختر وقت التسليم</option>
                <option value="morning">صباحاً · ٧:٠٠ – ١١:٠٠</option>
                <option value="noon">ظهراً · ١١:٠٠ – ٣:٠٠</option>
                <option value="evening">مساءً · ٣:٠٠ – ٧:٠٠</option>
                <option value="flexible">مرن حسب الاتفاق</option>
              </select>
              <ChevronDown aria-hidden="true" />
            </div>
          </Field>
        </FieldGroup>

        <fieldset className="proposal-extras">
          <legend>خيارات إضافية <span>اختياري</span></legend>
          <label className="proposal-check-option">
            <input
              type="checkbox"
              name="deliveryService"
              checked={deliveryService}
              onChange={(event) => setDeliveryService(event.target.checked)}
            />
            <span className="proposal-checkbox-visual" aria-hidden="true">
              <Check />
            </span>
            <span className="proposal-check-copy">
              <strong>توفير خدمة التوصيل</strong>
              <small>أوصل الطلب إلى موقع العميل</small>
            </span>
          </label>
          <label className="proposal-check-option">
            <input
              type="checkbox"
              name="customPackaging"
              checked={customPackaging}
              onChange={(event) => setCustomPackaging(event.target.checked)}
            />
            <span className="proposal-checkbox-visual" aria-hidden="true">
              <Check />
            </span>
            <span className="proposal-check-copy">
              <strong>تغليف مخصص</strong>
              <small>تغليف أنيق يناسب هوية المقهى</small>
            </span>
          </label>
        </fieldset>

        <div className="proposal-form-actions">
          <Button className="proposal-submit-button" type="submit" size="lg">
            <Send data-icon="inline-end" />
            إرسال العرض
          </Button>
          <Button
            className="proposal-draft-button"
            type="button"
            variant="outline"
            size="lg"
            onClick={handleSaveDraft}
          >
            <Save data-icon="inline-end" />
            حفظ كمسودة
          </Button>
        </div>
        <p className="proposal-form-footnote" role="status" aria-live="polite">
          {draftSaved
            ? 'تم حفظ المسودة على هذه الصفحة مؤقتاً.'
            : 'بإرسال العرض، سيصل إشعار إلى مقهى روما لمراجعته.'}
        </p>
      </form>
    </section>
  )
}
