import { useEffect, useState, type FormEvent } from 'react'
import { ChefHat, Languages, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
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
import i18n from '@/i18n'
import './App.css'

type AccountRole = 'supplier' | 'cafe'
type Page = 'role' | 'register' | 'login'

function App() {
  const { t, i18n: translation } = useTranslation()
  const [page, setPage] = useState<Page>('role')
  const [role, setRole] = useState<AccountRole | null>(null)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const language = translation.resolvedLanguage?.split('-')[0] ?? 'ar'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.title = `Nameer | ${t(
      page === 'login'
        ? 'login.title'
        : page === 'register'
          ? 'registration.title'
          : 'roleSelection.title',
    )}`
  }, [language, page, t])

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
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(t('login.notConnected'))
  }

  return (
    <main className="auth-page">
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
    </main>
  )
}

export default App
