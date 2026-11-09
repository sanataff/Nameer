import { CircleHelp } from 'lucide-react'

export function ContactUs({ onContact }: { onContact: () => void }) {
  return (
    <section className="confirmation-contact" aria-label="المساعدة">
      <button type="button" onClick={onContact}>
        <CircleHelp aria-hidden="true" />
        <span><small>تحتاج إلى مساعدة؟</small><span>تواصل معنا</span></span>
      </button>
    </section>
  )
}
