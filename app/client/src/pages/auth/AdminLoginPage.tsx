import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { usePageTitle } from '@/hooks/use-page-title'

export function AdminLoginPage() {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')

  usePageTitle(t('adminLogin.title'))

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(t('adminLogin.notConnected'))
  }

  return (
    <AppShell>
      <main className="admin-login-page">
        <div className="admin-login-layout">
          <section className="admin-login-form-side" aria-labelledby="admin-login-title">
            <Card className="admin-login-card">
              <CardHeader className="admin-login-card-header">
                <p className="admin-login-eyebrow">{t('adminLogin.portalLabel')}</p>
                <CardTitle id="admin-login-title" role="heading" aria-level={1}>
                  {t('adminLogin.title')}
                </CardTitle>
                <CardDescription>{t('adminLogin.description')}</CardDescription>
              </CardHeader>

              <CardContent>
                <form className="admin-login-form" onSubmit={handleLogin}>
                  <FieldGroup className="admin-login-fields">
                    <Field>
                      <FieldLabel htmlFor="admin-login-email">{t('common.email')}</FieldLabel>
                      <Input
                        id="admin-login-email"
                        name="email"
                        type="email"
                        dir="ltr"
                        placeholder={t('common.emailPlaceholder')}
                        autoComplete="username"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="admin-login-password">{t('common.password')}</FieldLabel>
                      <Input
                        id="admin-login-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                      />
                    </Field>
                  </FieldGroup>

                  {message && <p className="form-feedback" role="status">{message}</p>}
                  <Button className="admin-login-submit" type="submit">
                    {t('adminLogin.submit')}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="admin-login-card-footer">
                <p>{t('adminLogin.accessNote')}</p>
              </CardFooter>
            </Card>
          </section>

          <aside className="admin-login-visual" aria-labelledby="admin-login-brand">
            <div className="admin-login-visual-content">
              <p className="admin-login-brand" id="admin-login-brand">Nameer <span>Admin</span></p>
              <div className="admin-login-visual-icon" aria-hidden="true">
                <ShieldCheck />
              </div>
              <h2>{t('adminLogin.visualTitle')}</h2>
              <p className="admin-login-visual-description">{t('adminLogin.visualDescription')}</p>
            </div>
          </aside>
        </div>
      </main>
    </AppShell>
  )
}
