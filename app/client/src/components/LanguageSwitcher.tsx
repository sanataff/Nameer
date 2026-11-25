import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const { t, i18n: translation } = useTranslation()
  const language = translation.resolvedLanguage?.split('-')[0] ?? 'ar'

  return (
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
  )
}
