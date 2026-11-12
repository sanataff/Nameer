import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import '@fontsource-variable/noto-sans-arabic'
import { Button } from '@/components/ui/button'
import SettingsNavbar from './SettingsNavbar'
import BusinessDetailsCard from './BusinessDetailsCard'
import PaymentMethodsCard from './PaymentMethodsCard'
import InvoicesCard from './InvoicesCard'
import './accountSettings.css'

export default function AccountSettingsPage() {
  const [notice, setNotice] = useState('')

  return (
    <div className="account-settings-page" dir="rtl" lang="ar">
      <SettingsNavbar onAction={setNotice} />
      <main className="account-settings-main">
        <div className="account-settings-column">
          <div className="account-settings-heading">
            <h1>إعدادات الحساب</h1>
            <Link
              className="account-settings-back"
              to="/business/home-page-cafes"
              aria-label="العودة إلى الصفحة الرئيسية"
            >
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          {notice && (
            <div className="account-settings-notice" role="status" aria-live="polite">
              <span>{notice}</span>
              <button
                type="button"
                aria-label="إخفاء الرسالة"
                onClick={() => setNotice('')}
              >
                ×
              </button>
            </div>
          )}

          <div className="account-settings-cards">
            <BusinessDetailsCard onEdit={() => setNotice('تفاصيل المنشأة للعرض فقط.')} />
            <PaymentMethodsCard onEdit={() => setNotice('طرق الدفع للعرض فقط.')} />
            <InvoicesCard
              onDownload={(businessName) =>
                setNotice(`لا يتوفر تنزيل حقيقي لفاتورة ${businessName}.`)
              }
            />
          </div>

          <Button
            className="account-settings-logout"
            type="button"
            variant="outline"
            onClick={() => setNotice('هذا نموذج واجهة فقط؛ لم يتم تسجيل الخروج.')}
          >
            تسجيل الخروج
          </Button>
        </div>
      </main>
    </div>
  )
}
