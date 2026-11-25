import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { usePageTitle } from '@/hooks/use-page-title'

export function LoginPage() {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')

  usePageTitle(t('login.title'))

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(t('login.notConnected'))
  }

  return (
    <AppShell>
      <main className="auth-page">
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
            <Link to="/">{t('common.signUp')}</Link>
          </p>
        </section>
      </main>
    </AppShell>
  )
}
