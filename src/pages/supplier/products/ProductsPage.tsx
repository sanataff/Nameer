import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Boxes,
  CircleCheck,
  Coffee,
  Cookie,
  Croissant,
  Ellipsis,
  LayoutGrid,
  List,
  Package,
  Pencil,
  Plus,
  Search,
  TriangleAlert,
  Trash,
  Wheat,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  createProduct,
  deleteProduct,
  listProducts,
  setProductAvailability,
  type LocalizedText,
  type Product,
  type ProductCategory,
} from '@/api/products'
import { ProductSheet } from './ProductSheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import './products.css'

/** Stock wording derived from availability + quantity (FR-11). */
type StockState = 'available' | 'low' | 'out' | 'paused'

type CategoryFilter = 'all' | ProductCategory
type AvailabilityFilter = 'all' | StockState
type ViewMode = 'table' | 'grid'

interface Toast {
  id: number
  message: string
  tone: 'success' | 'error'
}

const CATEGORIES: ProductCategory[] = ['sweets', 'bakery', 'savory', 'beverages']
const LOW_STOCK_THRESHOLD = 5

const CATEGORY_ICONS: Record<ProductCategory, LucideIcon> = {
  sweets: Cookie,
  bakery: Croissant,
  savory: Wheat,
  beverages: Coffee,
}

function stockState(product: Product): StockState {
  if (product.availability === 'unavailable') return 'paused'
  if (product.quantity === 0) return 'out'
  if (product.quantity <= LOW_STOCK_THRESHOLD) return 'low'
  return 'available'
}

/**
 * Supplier product management page (FR-10 product listing, FR-11 availability).
 * Data comes from the mock API in `@/api/products`.
 */
export function ProductsPage() {
  const { t, i18n } = useTranslation()
  const language: 'ar' | 'en' =
    i18n.resolvedLanguage?.split('-')[0] === 'en' ? 'en' : 'ar'
  const locale = language === 'ar' ? 'ar-SA' : 'en-SA'

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [availability, setAvailability] = useState<AvailabilityFilter>('all')
  const [view, setView] = useState<ViewMode>('table')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const toastId = useRef(0)
  const searchRef = useRef<HTMLDivElement>(null)

  const numberFormat = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  )
  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }),
    [locale],
  )

  // Load the catalogue once; `reloadKey` powers the retry button.
  useEffect(() => {
    let active = true
    listProducts()
      .then((data) => {
        if (!active) return
        setProducts(data)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reloadKey])

  // Auto-dismiss the confirmation toast.
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  // Press "/" anywhere on the page to jump to the search field (Linear-style).
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      if (event.key === '/' && !typing) {
        event.preventDefault()
        searchRef.current?.querySelector('input')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function showToast(message: string, tone: 'success' | 'error' = 'success') {
    toastId.current += 1
    setToast({ id: toastId.current, message, tone })
  }

  function localize(text: LocalizedText) {
    return text[language] || text.en
  }

  function formatMoney(value: number) {
    return `${numberFormat.format(value)} ${t('supplierProducts.currency')}`
  }

  function openCreate() {
    setEditing(null)
    setSheetOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setSheetOpen(true)
  }

  function handleSaved(saved: Product) {
    setProducts((previous) => {
      const exists = previous.some((product) => product.id === saved.id)
      return exists
        ? previous.map((product) => (product.id === saved.id ? saved : product))
        : [saved, ...previous]
    })
    setSheetOpen(false)
    showToast(
      editing
        ? t('supplierProducts.updateSuccess')
        : t('supplierProducts.createSuccess'),
    )
  }

  /** Optimistic availability update so the switch feels instant (FR-11). */
  async function toggleAvailability(product: Product, next: boolean) {
    const availabilityValue = next ? 'available' : 'unavailable'
    const snapshot = products
    setProducts((previous) =>
      previous.map((item) =>
        item.id === product.id
          ? { ...item, availability: availabilityValue }
          : item,
      ),
    )
    try {
      const updated = await setProductAvailability(product.id, availabilityValue)
      setProducts((previous) =>
        previous.map((item) => (item.id === updated.id ? updated : item)),
      )
      showToast(t('supplierProducts.availabilityUpdated'))
    } catch {
      setProducts(snapshot)
      showToast(t('supplierProducts.saveError'), 'error')
    }
  }

  async function duplicateProduct(product: Product) {
    const copySuffix = t('supplierProducts.copySuffix')
    try {
      const copy = await createProduct({
        name: {
          en: `${product.name.en} (${copySuffix})`,
          ar: `${product.name.ar} (${copySuffix})`,
        },
        description: product.description,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        availability: 'unavailable',
      })
      setProducts((previous) => [copy, ...previous])
      showToast(t('supplierProducts.createSuccess'))
    } catch {
      showToast(t('supplierProducts.saveError'), 'error')
    }
  }

  async function confirmDelete() {
    const target = deleteTarget
    if (!target) return
    setDeleteTarget(null)
    try {
      await deleteProduct(target.id)
      setProducts((previous) =>
        previous.filter((product) => product.id !== target.id),
      )
      showToast(t('supplierProducts.deleteSuccess'))
    } catch {
      showToast(t('supplierProducts.saveError'), 'error')
    }
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      if (availability !== 'all' && stockState(product) !== availability) {
        return false
      }
      if (!needle) return true
      return [product.name.en, product.name.ar, product.description.en, product.description.ar]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [products, query, category, availability])

  const stats = useMemo(() => {
    const visible = products.filter(
      (product) => product.availability === 'available',
    )
    return {
      total: products.length,
      visible: visible.length,
      low: visible.filter((product) => stockState(product) === 'low').length,
      out: visible.filter((product) => stockState(product) === 'out').length,
      categories: new Set(products.map((product) => product.category)).size,
      hidden: products.length - visible.length,
    }
  }, [products])

  const filtersActive =
    query.trim() !== '' || category !== 'all' || availability !== 'all'

  function clearFilters() {
    setQuery('')
    setCategory('all')
    setAvailability('all')
  }

  function renderActions(product: Product) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" type="button">
              <Ellipsis aria-hidden="true" />
              <span className="sr-only">{t('supplierProducts.moreActions')}</span>
            </Button>
          }
        />
        <DropdownMenuContent align={language === 'ar' ? 'end' : 'start'}>
          <DropdownMenuItem onClick={() => openEdit(product)}>
            <Pencil aria-hidden="true" />
            {t('supplierProducts.actions.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => void duplicateProduct(product)}
          >
            <Plus aria-hidden="true" />
            {t('supplierProducts.actions.duplicate')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteTarget(product)}
          >
            <Trash aria-hidden="true" />
            {t('supplierProducts.actions.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="pm-page">
      <header className="pm-header">
        <div className="pm-header-text">
          <p className="pm-eyebrow">
            <Package aria-hidden="true" />
            {t('supplierProducts.eyebrow')}
          </p>
          <h1>
            {t('supplierProducts.title')}
            {!loading && (
              <span className="pm-count">{numberFormat.format(stats.total)}</span>
            )}
          </h1>
          <p className="pm-subtitle">{t('supplierProducts.subtitle')}</p>
        </div>
        <div className="pm-header-actions">
          <Badge variant="secondary">{t('supplierDashboard.demoData')}</Badge>
          <Button type="button" size="lg" onClick={openCreate}>
            <Plus aria-hidden="true" />
            {t('supplierProducts.addProduct')}
          </Button>
        </div>
      </header>

      <section className="pm-stats" aria-label={t('supplierProducts.statsLabel')}>
        <article className="pm-stat">
          <span className="pm-stat-icon" aria-hidden="true">
            <Boxes />
          </span>
          <div>
            <p>{t('supplierProducts.stats.total')}</p>
            <strong>{numberFormat.format(stats.total)}</strong>
          </div>
          <span className="pm-stat-note">
            {t('supplierProducts.stats.totalNote', {
              count: numberFormat.format(stats.categories),
            })}
          </span>
        </article>
        <article className="pm-stat">
          <span className="pm-stat-icon pm-stat-icon--success" aria-hidden="true">
            <CircleCheck />
          </span>
          <div>
            <p>{t('supplierProducts.stats.visible')}</p>
            <strong>{numberFormat.format(stats.visible)}</strong>
          </div>
          <span className="pm-stat-note">
            {t('supplierProducts.stats.hiddenNote', {
              count: numberFormat.format(stats.hidden),
            })}
          </span>
        </article>
        <article className="pm-stat">
          <span className="pm-stat-icon pm-stat-icon--warning" aria-hidden="true">
            <TriangleAlert />
          </span>
          <div>
            <p>{t('supplierProducts.stats.low')}</p>
            <strong>{numberFormat.format(stats.low)}</strong>
          </div>
          <span className="pm-stat-note">
            {t('supplierProducts.stats.lowNote', {
              count: numberFormat.format(LOW_STOCK_THRESHOLD),
            })}
          </span>
        </article>
        <article className="pm-stat">
          <span className="pm-stat-icon pm-stat-icon--danger" aria-hidden="true">
            <Package />
          </span>
          <div>
            <p>{t('supplierProducts.stats.out')}</p>
            <strong>{numberFormat.format(stats.out)}</strong>
          </div>
          <span className="pm-stat-note">
            {t('supplierProducts.stats.outNote')}
          </span>
        </article>
      </section>

      <section className="pm-panel" aria-label={t('supplierProducts.title')}>
        <div className="pm-toolbar">
          <div className="pm-search" ref={searchRef}>
            <Search aria-hidden="true" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('supplierProducts.searchPlaceholder')}
              aria-label={t('supplierProducts.searchLabel')}
              aria-keyshortcuts="/"
            />
            <kbd aria-hidden="true">/</kbd>
          </div>

          <div className="pm-filters">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as CategoryFilter)}
            >
              <SelectTrigger
                size="sm"
                className="pm-filter"
                aria-label={t('supplierProducts.categoryFilter')}
              >
                <SelectValue>
                  {(value: string) =>
                    value === 'all'
                      ? t('supplierProducts.allCategories')
                      : t(
                          `supplierProducts.categories.${value as ProductCategory}`,
                        )
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('supplierProducts.allCategories')}
                </SelectItem>
                {CATEGORIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`supplierProducts.categories.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={availability}
              onValueChange={(value) =>
                setAvailability(value as AvailabilityFilter)
              }
            >
              <SelectTrigger
                size="sm"
                className="pm-filter"
                aria-label={t('supplierProducts.availabilityFilter')}
              >
                <SelectValue>
                  {(value: string) =>
                    value === 'all'
                      ? t('supplierProducts.allAvailability')
                      : t(`supplierProducts.status.${value as StockState}`)
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('supplierProducts.allAvailability')}
                </SelectItem>
                <SelectItem value="available">
                  {t('supplierProducts.status.available')}
                </SelectItem>
                <SelectItem value="low">
                  {t('supplierProducts.status.low')}
                </SelectItem>
                <SelectItem value="out">
                  {t('supplierProducts.status.out')}
                </SelectItem>
                <SelectItem value="paused">
                  {t('supplierProducts.status.paused')}
                </SelectItem>
              </SelectContent>
            </Select>

            <div
              className="pm-view-toggle"
              role="group"
              aria-label={t('supplierProducts.viewLabel')}
            >
              <Button
                type="button"
                variant={view === 'table' ? 'secondary' : 'ghost'}
                size="icon-sm"
                aria-pressed={view === 'table'}
                onClick={() => setView('table')}
              >
                <List aria-hidden="true" />
                <span className="sr-only">{t('supplierProducts.viewTable')}</span>
              </Button>
              <Button
                type="button"
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="icon-sm"
                aria-pressed={view === 'grid'}
                onClick={() => setView('grid')}
              >
                <LayoutGrid aria-hidden="true" />
                <span className="sr-only">{t('supplierProducts.viewGrid')}</span>
              </Button>
            </div>
          </div>
        </div>

        {loadError ? (
          <div className="pm-empty">
            <span className="pm-empty-icon" aria-hidden="true">
              <TriangleAlert />
            </span>
            <h2>{t('supplierProducts.errorTitle')}</h2>
            <p>{t('supplierProducts.loadError')}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLoading(true)
                setLoadError(false)
                setReloadKey((key) => key + 1)
              }}
            >
              {t('supplierProducts.retry')}
            </Button>
          </div>
        ) : loading ? (
          <div className="pm-skeletons" aria-busy="true">
            <span className="sr-only">{t('supplierProducts.loading')}</span>
            {[0, 1, 2, 3, 4].map((row) => (
              <div className="pm-skeleton-row" key={row}>
                <Skeleton className="pm-skeleton-thumb" />
                <Skeleton className="pm-skeleton-line" />
                <Skeleton className="pm-skeleton-line pm-skeleton-line--short" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="pm-empty">
            <span className="pm-empty-icon" aria-hidden="true">
              <Package />
            </span>
            <h2>{t('supplierProducts.emptyCatalogueTitle')}</h2>
            <p>{t('supplierProducts.emptyCatalogueDescription')}</p>
            <Button type="button" onClick={openCreate}>
              <Plus aria-hidden="true" />
              {t('supplierProducts.addFirstProduct')}
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pm-empty">
            <span className="pm-empty-icon" aria-hidden="true">
              <Search />
            </span>
            <h2>{t('supplierProducts.emptyTitle')}</h2>
            <p>{t('supplierProducts.emptyDescription')}</p>
            <Button type="button" variant="outline" onClick={clearFilters}>
              {t('supplierProducts.clearFilters')}
            </Button>
          </div>
        ) : (
          <div className="pm-collection" data-view={view}>
            <div className="pm-table-wrap">
              <table className="pm-table">
                <thead>
                  <tr>
                    <th scope="col">{t('supplierProducts.columns.product')}</th>
                    <th scope="col" className="pm-col-category">
                      {t('supplierProducts.columns.category')}
                    </th>
                    <th scope="col" className="pm-col-price">
                      {t('supplierProducts.columns.price')}
                    </th>
                    <th scope="col">{t('supplierProducts.columns.stock')}</th>
                    <th scope="col">{t('supplierProducts.columns.status')}</th>
                    <th scope="col" className="pm-col-updated">
                      {t('supplierProducts.columns.updated')}
                    </th>
                    <th scope="col">
                      <span className="sr-only">
                        {t('supplierProducts.columns.actions')}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const state = stockState(product)
                    const CategoryIcon = CATEGORY_ICONS[product.category]
                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="pm-product-cell">
                            <span
                              className={`pm-thumb pm-thumb--${product.category}`}
                              aria-hidden="true"
                            >
                              <CategoryIcon />
                            </span>
                            <div className="pm-product-text">
                              <p className="pm-product-name">
                                {localize(product.name)}
                              </p>
                              <p className="pm-product-desc">
                                {localize(product.description)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="pm-col-category">
                          <span className="pm-category">
                            <CategoryIcon aria-hidden="true" />
                            {t(`supplierProducts.categories.${product.category}`)}
                          </span>
                        </td>
                        <td className="pm-col-price pm-price">
                          {formatMoney(product.price)}
                        </td>
                        <td className="pm-stock">
                          {numberFormat.format(product.quantity)}
                          <span>{t('supplierProducts.unitShort')}</span>
                        </td>
                        <td>
                          <div className="pm-status-cell">
                            <Switch
                              checked={product.availability === 'available'}
                              onCheckedChange={(checked) =>
                                void toggleAvailability(product, checked)
                              }
                              aria-label={
                                product.availability === 'available'
                                  ? t('supplierProducts.actions.hide')
                                  : t('supplierProducts.actions.show')
                              }
                            />
                            <StatusPill state={state} />
                          </div>
                        </td>
                        <td className="pm-col-updated pm-updated">
                          {dateFormat.format(new Date(product.updatedAt))}
                        </td>
                        <td className="pm-row-actions">{renderActions(product)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="pm-grid">
              {filtered.map((product) => {
                const state = stockState(product)
                const CategoryIcon = CATEGORY_ICONS[product.category]
                return (
                  <article className="pm-card" key={product.id}>
                    <div
                      className={`pm-card-media pm-thumb--${product.category}`}
                    >
                      <CategoryIcon aria-hidden="true" />
                      <div className="pm-card-media-bar">
                        <StatusPill state={state} />
                        {renderActions(product)}
                      </div>
                    </div>
                    <div className="pm-card-body">
                      <h3>{localize(product.name)}</h3>
                      <p>{localize(product.description)}</p>
                      <div className="pm-card-meta">
                        <span className="pm-category">
                          <CategoryIcon aria-hidden="true" />
                          {t(`supplierProducts.categories.${product.category}`)}
                        </span>
                        <strong>{formatMoney(product.price)}</strong>
                      </div>
                    </div>
                    <div className="pm-card-footer">
                      <span>
                        {t('supplierProducts.stockLeft', {
                          count: numberFormat.format(product.quantity),
                        })}
                      </span>
                      <Switch
                        checked={product.availability === 'available'}
                        onCheckedChange={(checked) =>
                          void toggleAvailability(product, checked)
                        }
                        aria-label={
                          product.availability === 'available'
                            ? t('supplierProducts.actions.hide')
                            : t('supplierProducts.actions.show')
                        }
                      />
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {!loading && products.length > 0 && (
          <footer className="pm-panel-footer">
            <p>
              {t('supplierProducts.showing', {
                shown: numberFormat.format(filtered.length),
                total: numberFormat.format(products.length),
              })}
            </p>
            {filtersActive && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <ArrowUpRight aria-hidden="true" />
                {t('supplierProducts.clearFilters')}
              </Button>
            )}
          </footer>
        )}
      </section>

      <ProductSheet
        open={sheetOpen}
        product={editing}
        onOpenChange={setSheetOpen}
        onSaved={handleSaved}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <TriangleAlert aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>
              {t('supplierProducts.deleteTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('supplierProducts.deleteDescription', {
                name: deleteTarget ? localize(deleteTarget.name) : '',
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('supplierProducts.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => void confirmDelete()}
            >
              {t('supplierProducts.deleteConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {toast && (
        <div className="pm-toast" data-tone={toast.tone} role="status" key={toast.id}>
          {toast.tone === 'error' ? (
            <TriangleAlert aria-hidden="true" />
          ) : (
            <CircleCheck aria-hidden="true" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

function StatusPill({ state }: { state: StockState }) {
  const { t } = useTranslation()
  return (
    <span className={`pm-status pm-status--${state}`}>
      <span className="pm-status-dot" aria-hidden="true" />
      {t(`supplierProducts.status.${state}`)}
    </span>
  )
}
