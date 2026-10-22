import { ImageIcon, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type RecentProductsSectionProps = {
  onManageProducts: () => void
}

export function RecentProductsSection({ onManageProducts }: RecentProductsSectionProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'
  const formatMoney = (amount: number) =>
    new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
      maximumFractionDigits: 0,
    }).format(amount)
  const products = [
    {
      name: t('supplierDashboard.sampleProductOne'),
      category: t('supplierDashboard.sweets'),
      price: 20,
      stock: 18,
    },
    {
      name: t('supplierDashboard.sampleProductTwo'),
      category: t('supplierDashboard.bakedGoods'),
      price: 30,
      stock: 9,
    },
    {
      name: t('supplierDashboard.sampleProductThree'),
      category: t('supplierDashboard.sweets'),
      price: 30,
      stock: 24,
    },
  ]

  return (
    <section
      className="dashboard-products-section dashboard-overview-products"
      aria-labelledby="products-heading"
    >
      <header className="dashboard-section-heading">
        <div>
          <h2 id="products-heading">{t('supplierDashboard.recentProducts')}</h2>
          <p>{t('supplierDashboard.recentProductsDescription')}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={onManageProducts}
        >
          <Package aria-hidden="true" />
          {t('supplierDashboard.manageProducts')}
        </Button>
      </header>
      <div className="dashboard-products">
        {products.map((product) => (
          <Card className="dashboard-product-card" key={product.name}>
            <div
              className="product-image-placeholder"
              aria-label={t('supplierDashboard.imagePlaceholder')}
            >
              <Skeleton className="product-image-skeleton" />
              <ImageIcon aria-hidden="true" />
            </div>
            <CardContent className="product-card-content">
              <div className="product-title-row">
                <h3>{product.name}</h3>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <p>
                {t('supplierDashboard.stockAvailable', {
                  count: formatMoney(product.stock),
                })}
              </p>
              <strong>
                {formatMoney(product.price)} {t('supplierDashboard.currency')}{' '}
                <span>/ {t('supplierDashboard.unit')}</span>
              </strong>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
