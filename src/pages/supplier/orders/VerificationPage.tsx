

import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'
import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/ui/button'

type VerificationPageProps = {
  onReturnHome: () => void
}

export default function VerificationPage({ onReturnHome }: VerificationPageProps) {
  const { t } = useTranslation()

  usePageTitle(t('supplierDashboard.nominationConfirmation.title'))

  return (
    <AppShell>
      <main className="nomination-confirmation-page">
        <div className="nomination-confirmation-content">
          <h1>{t('supplierDashboard.nominationConfirmation.title')}</h1>
          <p>{t('supplierDashboard.nominationConfirmation.description')}</p>
          <Button
            className="nomination-confirmation-button"
            type="button"
            onClick={onReturnHome}
          >
            {t('supplierDashboard.nominationConfirmation.returnHome')}
          </Button>
        </div>
      </main>
    </AppShell>
  )
}
