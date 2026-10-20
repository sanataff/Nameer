import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'
import { DirectionProvider } from "@/components/ui/direction"
import { useTranslation } from 'react-i18next'

//handle english and arabic, make interface language aware 
function AppRoot() {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'
  const direction = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <DirectionProvider direction={direction}>
      <App />
    </DirectionProvider>
  )
}

createRoot(document.getElementById('root')!).render(
        <StrictMode>

    <AppRoot />

    </StrictMode>,


)
