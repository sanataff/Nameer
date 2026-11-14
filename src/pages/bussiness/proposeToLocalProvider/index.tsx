import { useState } from 'react'
import { useNavigate } from 'react-router'
import ProposalForm from './ProposalForm'
import { Navbar } from '../shoppingCart/Navbar'
import RequestSummaryCard from './RequestSummaryCard'
import './proposeToLocalProvider.css'

export default function ProposeToLocalProviderPage() {
  const [feedback, setFeedback] = useState('')
  const navigate = useNavigate()

  return (
    <div className="proposal-page" dir="rtl" lang="ar">
      <Navbar searchLabel="ابحث عن طلب أو متجر" onNotification={() => setFeedback('ليس لديك إشعارات جديدة')} />

      <main className="proposal-main">
        <header className="proposal-page-heading">
          <span className="proposal-eyebrow">مساحة عروض الموردين</span>
          <h1>قدّم عرضك للطلب</h1>
          <p>راجع تفاصيل طلب العميل، ثم أرسل عرضاً يناسب احتياجه وإمكاناتك.</p>
        </header>

        {feedback && (
          <div className="proposal-feedback" role="status" aria-live="polite">
            <span>{feedback}</span>
            <button
              type="button"
              aria-label="إخفاء الرسالة"
              onClick={() => setFeedback('')}
            >
              ×
            </button>
          </div>
        )}

        <div className="proposal-layout">
          <RequestSummaryCard />
          <ProposalForm
            onSubmit={() => navigate('/business/propose-to-local-provider/success')}
          />
        </div>

        <footer className="proposal-footer">
          <span className="proposal-footer-mark" aria-hidden="true">ن</span>
          <span>نمير للأعمال</span>
          <span className="proposal-footer-divider" aria-hidden="true" />
          <span>مساحة موثوقة للتعاون والنمو</span>
        </footer>
      </main>
    </div>
  )
}
