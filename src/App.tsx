import { useEffect, useState, type FormEvent } from 'react'
import {
  Bell,
  ChefHat,
  CircleDollarSign,
  ImageIcon,
  Languages,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ProductsPage } from '@/pages/supplier/products/ProductsPage'
import { DesignSystemPage } from '@/pages/design-system/DesignSystemPage'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import i18n from '@/i18n'
import './App.css'

type AccountRole = 'supplier' | 'cafe'
type Page = 'role' | 'register' | 'login' | 'supplier-dashboard' | 'supplier-products'
/** Which screen is open inside the supplier workspace. */
type SupplierView = 'dashboard' | 'products'

function App() {
  const { t, i18n: translation } = useTranslation()
  const isDesignSystem = window.location.pathname === '/design-system'
  const [page, setPage] = useState<Page>('role')
  const [role, setRole] = useState<AccountRole | null>(null)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const language = translation.resolvedLanguage?.split('-')[0] ?? 'ar'
  const inSupplierWorkspace =
    page === 'supplier-dashboard' || page === 'supplier-products'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.title = isDesignSystem ? 'Nameer | Design System' : `Nameer | ${t(
      page === 'login'
        ? 'login.title'
        : page === 'register'
          ? 'registration.title'
          : page === 'supplier-products'
            ? 'supplierProducts.title'
            : page === 'supplier-dashboard'
              ? 'supplierDashboard.title'
              : 'roleSelection.title',
    )}`
  }, [isDesignSystem, language, page, t])

  function openRegistration(selectedRole: AccountRole) {
    setRole(selectedRole)
    setMessage('')
    setFormError('')
    setPage('register')
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    const formData = new FormData(event.currentTarget)

    if (role === 'supplier') {
      const today = new Date()
      const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
      ].join('-')
      const authorizationExpiry = String(formData.get('authorizationExpiry') ?? '')
      const healthCertificateExpiry = String(formData.get('healthCertificateExpiry') ?? '')

      if (authorizationExpiry < localToday || healthCertificateExpiry < localToday) {
        setMessage('')
        setFormError(t('registration.expiredDocument'))
        return
      }
    }

    if (formData.get('password') !== formData.get('confirmPassword')) {
      setMessage('')
      setFormError(t('registration.passwordMismatch'))
      return
    }

    setMessage(t('registration.success'))
    if (role === 'supplier') {
      setSupplierName(String(formData.get('businessName') ?? '').trim())
    }
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(t('login.notConnected'))
  }

  if (isDesignSystem) return <DesignSystemPage />

  return (
    <div className={inSupplierWorkspace ? 'supplier-dashboard-page' : 'app-shell'}>
      <Button
        className="language-switch"
        variant="outline"
        size="sm"
        type="button"
        onClick={() => void i18n.changeLanguage(language === 'ar' ? 'en' : 'ar')}
        aria-label={t('language.switchTo')}
      >
        <Languages data-icon="inline-start" aria-hidden="true" />
        {t('language.switchTo')}
      </Button>

      {inSupplierWorkspace && (
        <SupplierDashboard
          businessName={supplierName}
          view={page === 'supplier-products' ? 'products' : 'dashboard'}
          onNavigate={(nextView) =>
            setPage(nextView === 'products' ? 'supplier-products' : 'supplier-dashboard')
          }
        />
      )}

      {!inSupplierWorkspace && <main className="auth-page">
      {page === 'role' && (
        <section className="role-screen" aria-labelledby="role-title">
          <header className="auth-heading">
            <h1 id="role-title">{t('roleSelection.title')}</h1>
            <p>{t('roleSelection.description')}</p>
          </header>

          <div className="role-options">
            <Button
              className="role-option"
              variant="outline"
              type="button"
              onClick={() => openRegistration('supplier')}
            >
              <span className="role-illustration" aria-hidden="true">
                <ChefHat />
              </span>
              <span className="role-option-label">{t('roleSelection.supplier')}</span>
            </Button>

            <Button
              className="role-option"
              variant="outline"
              type="button"
              onClick={() => openRegistration('cafe')}
            >
              <span className="role-illustration" aria-hidden="true">
                <Store />
              </span>
              <span className="role-option-label">{t('roleSelection.cafe')}</span>
            </Button>
          </div>

          <p className="auth-switch">
            {t('common.alreadyHaveAccount')}{' '}
            <button type="button" onClick={() => { setMessage(''); setPage('login') }}>
              {t('common.signIn')}
            </button>
          </p>
        </section>
      )}

      {page === 'register' && role && (
        <section
          className={role === 'cafe' ? 'form-screen business-register' : 'form-screen supplier-register'}
          aria-labelledby="register-title"
        >
          <header className="auth-heading">
            <h1 id="register-title">{t('registration.title')}</h1>
            <p>{t(role === 'supplier' ? 'registration.supplierDescription' : 'registration.cafeDescription')}</p>
          </header>

          <form className="auth-form" onSubmit={handleRegister}>
            <FieldGroup className="auth-fields">
              <Field>
                <FieldLabel htmlFor="business-name">
                  {t(role === 'supplier' ? 'common.businessName' : 'common.cafeName')}
                </FieldLabel>
                <Input id="business-name" name="businessName" autoComplete="organization" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="register-email">{t('common.email')}</FieldLabel>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  dir="ltr"
                  placeholder={t('common.emailPlaceholder')}
                  autoComplete="email"
                  required
                />
              </Field>

              <div className="auth-field-row">
                <Field>
                  <FieldLabel htmlFor="register-phone">{t('common.phone')}</FieldLabel>
                  <Input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    dir="ltr"
                    placeholder="+966"
                    autoComplete="tel"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="city">{t('common.city')}</FieldLabel>
                  <Input id="city" name="city" autoComplete="address-level2" required />
                </Field>
              </div>

              {role === 'cafe' && (
                <FieldSet className="business-details">
                  <FieldLegend>{t('registration.businessDetails')}</FieldLegend>
                  <Field>
                    <FieldLabel htmlFor="registered-business-name">
                      {t('registration.registeredBusinessName')}
                    </FieldLabel>
                    <Input
                      id="registered-business-name"
                      name="registeredBusinessName"
                      autoComplete="organization"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="commercial-registration">
                      {t('registration.commercialRegistration')}
                    </FieldLabel>
                    <Input
                      id="commercial-registration"
                      name="commercialRegistration"
                      inputMode="numeric"
                      autoComplete="off"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="vat-number">
                      {t('registration.vatNumber')} <span className="optional-label">({t('common.optional')})</span>
                    </FieldLabel>
                    <Input
                      id="vat-number"
                      name="vatNumber"
                      inputMode="numeric"
                      autoComplete="off"
                    />
                  </Field>
                  <p className="business-details-note">{t('registration.vatHelp')}</p>
                  <p className="business-details-label">{t('registration.nationalAddress')}</p>
                  <div className="auth-field-row">
                    <Field>
                      <FieldLabel htmlFor="district">{t('registration.district')}</FieldLabel>
                      <Input id="district" name="district" autoComplete="address-level3" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="street">{t('registration.street')}</FieldLabel>
                      <Input id="street" name="street" autoComplete="street-address" required />
                    </Field>
                  </div>
                  <div className="auth-field-row">
                    <Field>
                      <FieldLabel htmlFor="building-number">{t('registration.buildingNumber')}</FieldLabel>
                      <Input id="building-number" name="buildingNumber" inputMode="numeric" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="postal-code">{t('registration.postalCode')}</FieldLabel>
                      <Input
                        id="postal-code"
                        name="postalCode"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        required
                      />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="short-address">
                      {t('registration.shortAddress')} <span className="optional-label">({t('common.optional')})</span>
                    </FieldLabel>
                    <Input id="short-address" name="shortAddress" autoComplete="off" />
                  </Field>
                </FieldSet>
              )}

              {role === 'supplier' && (
                <FieldSet className="supplier-details">
                  <FieldLegend>{t('registration.supplierLegalDetails')}</FieldLegend>
                  <Field>
                    <FieldLabel htmlFor="supplier-authorization-type">
                      {t('registration.authorizationType')}
                    </FieldLabel>
                    <Select name="authorizationType" required>
                      <SelectTrigger id="supplier-authorization-type" className="w-full">
                        <SelectValue placeholder={t('registration.selectAuthorization')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freelance">{t('registration.freelanceDocument')}</SelectItem>
                        <SelectItem value="productive-family">{t('registration.productiveFamilyCertificate')}</SelectItem>
                        <SelectItem value="commercial-registration">{t('registration.commercialRegistration')}</SelectItem>
                        <SelectItem value="other">{t('registration.otherAuthorization')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="authorization-number">
                      {t('registration.authorizationNumber')}
                    </FieldLabel>
                    <Input id="authorization-number" name="authorizationNumber" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="authorization-expiry">
                      {t('registration.authorizationExpiry')}
                    </FieldLabel>
                    <Input id="authorization-expiry" name="authorizationExpiry" type="date" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="authorization-document">
                      {t('registration.authorizationDocument')}
                    </FieldLabel>
                    <Input
                      id="authorization-document"
                      name="authorizationDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                    <FieldDescription>{t('registration.documentUploadHelp')}</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="health-certificate-number">
                      {t('registration.healthCertificateNumber')}
                    </FieldLabel>
                    <Input id="health-certificate-number" name="healthCertificateNumber" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="health-certificate-expiry">
                      {t('registration.healthCertificateExpiry')}
                    </FieldLabel>
                    <Input
                      id="health-certificate-expiry"
                      name="healthCertificateExpiry"
                      type="date"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="health-certificate-document">
                      {t('registration.healthCertificateDocument')}
                    </FieldLabel>
                    <Input
                      id="health-certificate-document"
                      name="healthCertificateDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                    <FieldDescription>{t('registration.documentUploadHelp')}</FieldDescription>
                  </Field>

                  <p className="business-details-label">{t('registration.nationalAddress')}</p>
                  <Field>
                    <FieldLabel htmlFor="supplier-district">{t('registration.district')}</FieldLabel>
                    <Input id="supplier-district" name="district" autoComplete="address-level3" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplier-street">{t('registration.street')}</FieldLabel>
                    <Input id="supplier-street" name="street" autoComplete="street-address" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplier-building-number">{t('registration.buildingNumber')}</FieldLabel>
                    <Input id="supplier-building-number" name="buildingNumber" inputMode="numeric" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplier-postal-code">{t('registration.postalCode')}</FieldLabel>
                    <Input
                      id="supplier-postal-code"
                      name="postalCode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplier-short-address">
                      {t('registration.shortAddress')} <span className="optional-label">({t('common.optional')})</span>
                    </FieldLabel>
                    <Input id="supplier-short-address" name="shortAddress" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="supplier-vat-number">
                      {t('registration.vatNumber')} <span className="optional-label">({t('common.optional')})</span>
                    </FieldLabel>
                    <Input id="supplier-vat-number" name="vatNumber" inputMode="numeric" />
                  </Field>
                  <p className="business-details-note">{t('registration.vatHelp')}</p>
                  <p className="business-details-note">{t('registration.authorizationHelp')}</p>
                </FieldSet>
              )}

              <div className="auth-field-row">
                <Field>
                  <FieldLabel htmlFor="register-password">{t('common.password')}</FieldLabel>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">{t('common.confirmPassword')}</FieldLabel>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </Field>
              </div>
            </FieldGroup>

            {formError && <p className="form-feedback form-error" role="alert">{formError}</p>}
            {message && <p className="form-feedback" role="status">{message}</p>}

            <Button className="auth-submit" type="submit">
              {t('common.createAccount')}
            </Button>
            {role === 'supplier' && message && !formError && (
              <Button
                className="auth-submit"
                type="button"
                variant="outline"
                onClick={() => setPage('supplier-dashboard')}
              >
                {t('supplierDashboard.preview')}
              </Button>
            )}
          </form>

          <div className="auth-footer">
            <button
              className="text-button"
              type="button"
              onClick={() => { setMessage(''); setFormError(''); setPage('role') }}
            >
              {t('common.backToRoleSelection')}
            </button>
            <p className="auth-switch">
              {t('common.alreadyHaveAccount')}{' '}
              <button type="button" onClick={() => { setMessage(''); setPage('login') }}>
                {t('common.signIn')}
              </button>
            </p>
          </div>
        </section>
      )}

      {page === 'login' && (
        <section className="form-screen login-screen" aria-labelledby="login-title">
          <header className="auth-heading">
            <h1 id="login-title">{t('login.title')}</h1>
            <p>{t('login.description')}</p>
          </header>

          <form className="auth-form" onSubmit={handleLogin}>
            <FieldGroup className="auth-fields">
              <Field>
                <FieldLabel htmlFor="login-email">{t('common.email')}</FieldLabel>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  dir="ltr"
                  placeholder={t('common.emailPlaceholder')}
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="login-password">{t('common.password')}</FieldLabel>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
            </FieldGroup>

            {message && <p className="form-feedback" role="status">{message}</p>}
            <Button className="auth-submit" type="submit">{t('login.submit')}</Button>
          </form>

          <p className="auth-switch">
            {t('common.noAccount')}{' '}
            <button type="button" onClick={() => { setMessage(''); setPage('role') }}>
              {t('common.signUp')}
            </button>
          </p>
        </section>
      )}
      </main>}
    </div>
  )
}

function SupplierDashboard({
  businessName,
  view,
  onNavigate,
}: {
  businessName: string
  view: SupplierView
  onNavigate: (view: SupplierView) => void
}) {
  const { t, i18n: translation } = useTranslation()
  const language = translation.resolvedLanguage?.split('-')[0] ?? 'ar'
  const revenue = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(4250)
  const formatMoney = (amount: number) => new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
    maximumFractionDigits: 0,
  }).format(amount)
  const currentMonth = new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const metrics = [
    { label: t('supplierDashboard.newRequests'), value: '05', icon: ShoppingBag, note: t('supplierDashboard.newRequestsNote') },
    { label: t('supplierDashboard.products'), value: '12', icon: Package, note: t('supplierDashboard.productsNote') },
    { label: t('supplierDashboard.monthlyRevenue'), value: revenue, icon: CircleDollarSign, note: t('supplierDashboard.revenueNote') },
  ]

  const sales = [
    { label: t('supplierDashboard.chartDays.sat'), sales: 48 },
    { label: t('supplierDashboard.chartDays.sun'), sales: 73 },
    { label: t('supplierDashboard.chartDays.mon'), sales: 61 },
    { label: t('supplierDashboard.chartDays.tue'), sales: 34 },
    { label: t('supplierDashboard.chartDays.wed'), sales: 88 },
    { label: t('supplierDashboard.chartDays.thu'), sales: 67 },
    { label: t('supplierDashboard.chartDays.fri'), sales: 79 },
  ]
  const salesChartConfig = {
    sales: {
      label: t('supplierDashboard.salesOverview'),
      color: 'var(--primary)',
    },
  } satisfies ChartConfig

  const requests = [
    { cafe: t('supplierDashboard.sampleCafeOne'), product: t('supplierDashboard.sampleProductOne'), quantity: 24, total: 480 },
    { cafe: t('supplierDashboard.sampleCafeTwo'), product: t('supplierDashboard.sampleProductTwo'), quantity: 12, total: 360 },
    { cafe: t('supplierDashboard.sampleCafeThree'), product: t('supplierDashboard.sampleProductThree'), quantity: 18, total: 540 },
  ]

  const products = [
    { name: t('supplierDashboard.sampleProductOne'), category: t('supplierDashboard.sweets'), price: 20, stock: 18 },
    { name: t('supplierDashboard.sampleProductTwo'), category: t('supplierDashboard.bakedGoods'), price: 30, stock: 9 },
    { name: t('supplierDashboard.sampleProductThree'), category: t('supplierDashboard.sweets'), price: 30, stock: 24 },
  ]

  return (
    <TooltipProvider>
      <SidebarProvider className="supplier-dashboard-layout" defaultOpen={false}>
        <Sidebar side={language === 'ar' ? 'right' : 'left'} collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Nameer" aria-label="Nameer">
                  <span className="sidebar-brand" aria-hidden="true">N</span>
                  <span className="group-data-[collapsible=icon]:hidden">Nameer</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t('supplierDashboard.navigation')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={view === 'dashboard'}
                      tooltip={t('supplierDashboard.title')}
                      aria-label={t('supplierDashboard.title')}
                      onClick={() => onNavigate('dashboard')}
                    >
                      <LayoutDashboard aria-hidden="true" />
                      <span>{t('supplierDashboard.title')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={view === 'products'}
                      tooltip={t('supplierProducts.title')}
                      aria-label={t('supplierProducts.title')}
                      onClick={() => onNavigate('products')}
                    >
                      <Package aria-hidden="true" />
                      <span>{t('supplierProducts.title')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      disabled
                      tooltip={t('supplierDashboard.orders')}
                      aria-label={t('supplierDashboard.orders')}
                    >
                      <ShoppingBag aria-hidden="true" />
                      <span>{t('supplierDashboard.orders')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      disabled
                      tooltip={t('supplierDashboard.monthlyRevenue')}
                      aria-label={t('supplierDashboard.monthlyRevenue')}
                    >
                      <CircleDollarSign aria-hidden="true" />
                      <span>{t('supplierDashboard.monthlyRevenue')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  tooltip={businessName || t('supplierDashboard.profileFallback')}
                  aria-label={businessName || t('supplierDashboard.profileFallback')}
                >
                  <Avatar className="sidebar-profile">
                    <AvatarFallback>{businessName.slice(0, 1) || t('supplierDashboard.profileFallback')}</AvatarFallback>
                  </Avatar>
                  <span className="group-data-[collapsible=icon]:hidden">
                    {businessName || t('supplierDashboard.profileFallback')}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="supplier-dashboard-content">
        <header className="dashboard-topbar">
          <SidebarTrigger aria-label={t('supplierDashboard.toggleNavigation')} />
          <nav className="dashboard-breadcrumb" aria-label={t('supplierDashboard.navigation')}>
            <span>{businessName || t('supplierDashboard.defaultBusinessName')}</span>
            <span className="dashboard-breadcrumb-separator" aria-hidden="true">/</span>
            <strong>
              {view === 'products'
                ? t('supplierProducts.title')
                : t('supplierDashboard.title')}
            </strong>
          </nav>
          <div className="dashboard-topbar-actions">
            <Button variant="ghost" size="icon" type="button" aria-label={t('supplierDashboard.notifications')}>
              <Bell aria-hidden="true" />
            </Button>
            <Avatar aria-label={businessName || t('supplierDashboard.profileFallback')}>
              <AvatarFallback>{businessName.slice(0, 1) || t('supplierDashboard.profileFallback')}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="dashboard-main">
          {view === 'products' ? <ProductsPage /> : (
          <>
          <header className="dashboard-welcome">
            <div>
              <p className="dashboard-eyebrow">{t('supplierDashboard.welcome')}</p>
              <h1>{businessName || t('supplierDashboard.defaultBusinessName')}</h1>
              <p>{t('supplierDashboard.subtitle')}</p>
            </div>
            <Badge variant="secondary">{t('supplierDashboard.demoData')}</Badge>
          </header>

          <section className="dashboard-metrics" aria-label={t('supplierDashboard.summary')}>
            {metrics.map(({ label, value, icon: Icon, note }) => (
              <Card className="dashboard-metric" key={label}>
                <CardHeader>
                  <CardDescription>{label}</CardDescription>
                  <span className="metric-icon size-10" aria-hidden="true"><Icon /></span>
                </CardHeader>
                <CardContent>
                  <p className="metric-value">{value}</p>
                  <p className="metric-note">{note}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="dashboard-overview" aria-label={t('supplierDashboard.overview')}>
            <Card className="dashboard-chart-card">
              <CardHeader>
                <CardTitle>{t('supplierDashboard.salesOverview')}</CardTitle>
                <CardDescription>{currentMonth}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="chart-total">
                  <span>{revenue}</span>
                  <Badge variant="secondary">{t('supplierDashboard.revenueChange')}</Badge>
                </div>
                <ChartContainer
                  config={salesChartConfig}
                  className="dashboard-chart"
                  role="img"
                  aria-label={t('supplierDashboard.salesChartLabel')}
                >
                  <BarChart accessibilityLayer data={sales}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="dashboard-request-card">
              <CardHeader>
                <CardTitle>{t('supplierDashboard.latestRequests')}</CardTitle>
                <CardDescription>{t('supplierDashboard.latestRequestsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="request-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col" className="text-start">{t('supplierDashboard.cafeColumn')}</TableHead>
                      <TableHead scope="col" className="text-start">{t('supplierDashboard.itemColumn')}</TableHead>
                      <TableHead scope="col" className="text-start">{t('supplierDashboard.quantityColumn')}</TableHead>
                      <TableHead scope="col" className="text-start">{t('supplierDashboard.totalColumn')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request, index) => (
                      <TableRow key={request.cafe}>
                        <TableCell>
                          <div className="request-cafe-cell">
                            <Avatar className="request-avatar size-8" aria-label={request.cafe}>
                              <AvatarFallback>{request.cafe.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <span>{request.cafe}</span>
                            {index === 0 && <Badge variant="outline">{t('supplierDashboard.pending')}</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>{request.product}</TableCell>
                        <TableCell>{t('supplierDashboard.quantity', { count: request.quantity })}</TableCell>
                        <TableCell>{formatMoney(request.total)} {t('supplierDashboard.currency')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          <section className="dashboard-products-section" aria-labelledby="products-heading">
            <header className="dashboard-section-heading">
              <div>
                <h2 id="products-heading">{t('supplierDashboard.recentProducts')}</h2>
                <p>{t('supplierDashboard.recentProductsDescription')}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => onNavigate('products')}
              >
                <Package aria-hidden="true" />
                {t('supplierDashboard.manageProducts')}
              </Button>
            </header>
            <div className="dashboard-products">
              {products.map((product) => (
                <Card className="dashboard-product-card" key={product.name}>
                  <div className="product-image-placeholder" aria-label={t('supplierDashboard.imagePlaceholder')}>
                    <Skeleton className="product-image-skeleton" />
                    <ImageIcon aria-hidden="true" />
                    <span>{t('supplierDashboard.imagePlaceholder')}</span>
                  </div>
                  <CardContent className="product-card-content">
                    <div className="product-title-row">
                      <h3>{product.name}</h3>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p>{t('supplierDashboard.stockAvailable', { count: formatMoney(product.stock) })}</p>
                    <strong>{formatMoney(product.price)} {t('supplierDashboard.currency')} <span>/ {t('supplierDashboard.unit')}</span></strong>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          </>
          )}
        </div>
          </SidebarInset>
        </SidebarProvider>
        </TooltipProvider>
  )
}

export default App
