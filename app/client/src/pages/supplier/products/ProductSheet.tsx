import { useState, type FormEvent } from 'react'
import { LoaderCircle, Package, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  createProduct,
  updateProduct,
  type Product,
  type ProductCategory,
} from '@/api/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import './products.css'

const CATEGORIES: ProductCategory[] = ['sweets', 'bakery', 'savory', 'beverages']

type Language = 'ar' | 'en'
type FormErrors = Partial<Record<'name' | 'price' | 'quantity', string>>

interface ProductSheetProps {
  open: boolean
  /** `null` opens the "add product" form. */
  product: Product | null
  onOpenChange: (open: boolean) => void
  onSaved: (product: Product) => void
}

/**
 * Side panel (inline-end edge) used for both adding and editing a product.
 * Keeping the form in one panel avoids a full page navigation for a short task.
 */
export function ProductSheet({
  open,
  product,
  onOpenChange,
  onSaved,
}: ProductSheetProps) {
  const { t, i18n } = useTranslation()
  const language: Language =
    i18n.resolvedLanguage?.split('-')[0] === 'en' ? 'en' : 'ar'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        // The navigation sidebar sits on the right in Arabic, so open from the
        // opposite edge to keep the catalogue visible.
        side={language === 'ar' ? 'left' : 'right'}
        showCloseButton={false}
        className="pm-sheet"
        style={{ width: 'min(100vw, 26rem)' }}
      >
        <SheetHeader className="pm-sheet-header">
          <div className="pm-sheet-heading">
            <span className="pm-sheet-icon" aria-hidden="true">
              <Package />
            </span>
            <div className="pm-sheet-heading-text">
              <SheetTitle>
                {product
                  ? t('supplierProducts.editProduct')
                  : t('supplierProducts.newProduct')}
              </SheetTitle>
              <SheetDescription>
                {product
                  ? t('supplierProducts.editProductDescription')
                  : t('supplierProducts.newProductDescription')}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              <X aria-hidden="true" />
              <span className="sr-only">{t('supplierProducts.close')}</span>
            </Button>
          </div>
        </SheetHeader>

        {/*
          The form is keyed by product + open state, so every time the panel is
          opened it starts from the saved values (no effect needed to prefill).
        */}
        <ProductForm
          key={`${open ? 'open' : 'closed'}-${product?.id ?? 'new'}`}
          product={product}
          language={language}
          onSaved={onSaved}
          onCancel={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  )
}

function ProductForm({
  product,
  language,
  onSaved,
  onCancel,
}: {
  product: Product | null
  language: Language
  onSaved: (product: Product) => void
  onCancel: () => void
}) {
  const { t } = useTranslation()
  const [name, setName] = useState(product ? product.name[language] : '')
  const [description, setDescription] = useState(
    product ? product.description[language] : '',
  )
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? 'sweets',
  )
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [quantity, setQuantity] = useState(
    product ? String(product.quantity) : '',
  )
  const [available, setAvailable] = useState(
    product ? product.availability === 'available' : true,
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    const priceValue = Number(price)
    const quantityValue = Number(quantity)
    const nextErrors: FormErrors = {}

    if (!trimmedName) nextErrors.name = t('supplierProducts.fields.required')
    if (!price.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      nextErrors.price = t('supplierProducts.fields.invalidPrice')
    }
    if (
      !quantity.trim() ||
      Number.isNaN(quantityValue) ||
      !Number.isInteger(quantityValue) ||
      quantityValue < 0
    ) {
      nextErrors.quantity = t('supplierProducts.fields.invalidQuantity')
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const trimmedDescription = description.trim()
    // Keep the translation in the other language when an existing product is
    // edited, so switching the UI language never erases the saved label.
    const namePayload = product
      ? { ...product.name, [language]: trimmedName }
      : { en: trimmedName, ar: trimmedName }
    const descriptionPayload = product
      ? {
          ...product.description,
          [language]: trimmedDescription || product.description[language],
        }
      : { en: trimmedDescription, ar: trimmedDescription }

    const input = {
      name: namePayload,
      description: descriptionPayload,
      category,
      price: priceValue,
      quantity: quantityValue,
      availability: available
        ? ('available' as const)
        : ('unavailable' as const),
    }

    setSaving(true)
    try {
      const saved = product
        ? await updateProduct(product.id, input)
        : await createProduct(input)
      onSaved(saved)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="pm-sheet-form" onSubmit={handleSubmit} noValidate>
      <div className="pm-form-body">
        <div className="pm-field">
          <Label htmlFor="product-name">
            {t('supplierProducts.fields.name')}
          </Label>
          <Input
            id="product-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('supplierProducts.fields.namePlaceholder')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'product-name-error' : undefined}
            autoFocus
          />
          {errors.name && (
            <p className="pm-field-error" id="product-name-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="pm-field">
          <Label htmlFor="product-description">
            {t('supplierProducts.fields.description')}{' '}
            <span className="pm-optional">({t('common.optional')})</span>
          </Label>
          <Textarea
            id="product-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t('supplierProducts.fields.descriptionPlaceholder')}
            rows={3}
          />
        </div>

        <div className="pm-field-grid">
          <div className="pm-field">
            <Label htmlFor="product-category">
              {t('supplierProducts.fields.category')}
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ProductCategory)}
            >
              <SelectTrigger id="product-category" className="w-full">
                <SelectValue>
                  {(value: string) =>
                    t(`supplierProducts.categories.${value as ProductCategory}`)
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`supplierProducts.categories.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pm-field">
            <Label htmlFor="product-price">
              {t('supplierProducts.fields.price')}
            </Label>
            <div className="pm-input-suffix" dir="ltr">
              <Input
                id="product-price"
                type="number"
                min="1"
                step="1"
                inputMode="decimal"
                placeholder="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={
                  errors.price ? 'product-price-error' : undefined
                }
              />
              <span aria-hidden="true">
                {t('supplierProducts.currency')}
              </span>
            </div>
            {errors.price && (
              <p
                className="pm-field-error"
                id="product-price-error"
                role="alert"
              >
                {errors.price}
              </p>
            )}
          </div>
        </div>

        <div className="pm-field">
          <Label htmlFor="product-quantity">
            {t('supplierProducts.fields.quantity')}
          </Label>
          <Input
            id="product-quantity"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="0"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={
              errors.quantity ? 'product-quantity-error' : undefined
            }
          />
          {errors.quantity && (
            <p
              className="pm-field-error"
              id="product-quantity-error"
              role="alert"
            >
              {errors.quantity}
            </p>
          )}
        </div>

        <div className="pm-availability-box">
          <div>
            <Label htmlFor="product-availability">
              {t('supplierProducts.fields.availability')}
            </Label>
            <p>{t('supplierProducts.fields.availabilityHelp')}</p>
          </div>
          <Switch
            id="product-availability"
            checked={available}
            onCheckedChange={setAvailable}
          />
        </div>
      </div>

      <SheetFooter className="pm-sheet-footer">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          {t('supplierProducts.cancel')}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <LoaderCircle className="animate-spin" aria-hidden="true" />}
          {saving ? t('supplierProducts.saving') : t('supplierProducts.save')}
        </Button>
      </SheetFooter>
    </form>
  )
}
