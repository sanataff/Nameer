import '@fontsource-variable/noto-sans-arabic'
import SuccessMessage from './SuccessMessage'
import SuccessNavbar from './SuccessNavbar'
import './proposeToLocalProviderSuccess.css'

export default function ProposeToLocalProviderSuccessPage() {
  return (
    <div className="proposal-success-page" dir="rtl" lang="ar">
      <SuccessNavbar />
      <main className="proposal-success-main">
        <SuccessMessage />
      </main>
      <footer className="proposal-success-footer">
        <span className="proposal-success-footer-mark" aria-hidden="true">ن</span>
        <span>نمير — لكل لحظة حلوة حكاية</span>
      </footer>
    </div>
  )
}
