import { useEffect, useState, type FormEvent } from 'react'
import { ChefHat, Languages, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
          className={role === 'cafe' ? 'form-screen business-register' : 'form-screen'}
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
