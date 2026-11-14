import { Sparkles } from 'lucide-react'

type NoticeBannerProps = {
  message: string
  onDismiss: () => void
}

export default function NoticeBanner({ message, onDismiss }: NoticeBannerProps) {
  return (
    <div className="marketplace-notice" role="status" aria-live="polite">
      <Sparkles aria-hidden="true" />
      <span>{message}</span>
      <button type="button" aria-label="إخفاء الإشعار" onClick={onDismiss}>
        ×
      </button>
    </div>
  )
}
