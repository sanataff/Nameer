import { useState } from 'react'
import ProposalForm from './ProposalForm'
import ProposalNavbar from './ProposalNavbar'
import RequestSummaryCard from './RequestSummaryCard'
import './proposeToLocalProvider.css'

export default function ProposeToLocalProviderPage() {
  const [feedback, setFeedback] = useState('')

  return (
    <div className="proposal-page" dir="rtl" lang="ar">
      <ProposalNavbar onAction={setFeedback} />

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
          <ProposalForm onSubmit={() => setFeedback('تم إرسال عرضك بنجاح إلى مقهى روما.')} />
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
