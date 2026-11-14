import '@fontsource-variable/noto-sans-arabic'
import SuccessMessage from './SuccessMessage'
import { Navbar } from '../shoppingCart/Navbar'
import './proposeToLocalProviderSuccess.css'

export default function ProposeToLocalProviderSuccessPage() {
  return (
    <div className="proposal-success-page" dir="rtl" lang="ar">
      <Navbar />
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
