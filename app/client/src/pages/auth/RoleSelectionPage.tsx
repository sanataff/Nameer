import { ChefHat, Store } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/use-page-title'

export function RoleSelectionPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  usePageTitle(t('roleSelection.title'))

  return (
    <AppShell>
      <main className="auth-page">
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
              onClick={() => navigate('/register/supplier')}
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
              onClick={() => navigate('/register/cafe')}
            >
              <span className="role-illustration" aria-hidden="true">
                <Store />
              </span>
              <span className="role-option-label">{t('roleSelection.cafe')}</span>
            </Button>
          </div>

          <p className="auth-switch">
            {t('common.alreadyHaveAccount')}{' '}
            <Link to="/login">{t('common.signIn')}</Link>
          </p>
        </section>
      </main>
    </AppShell>
  )
}
