import { Badge } from "@/components/ui/badge";
import { PackageCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
  import { type BusinessRequest,   type BusinessNomination,

} from '@/pages/supplier/orders/NominationSheet'


type BusinessRequesListProps = {
  onSelectRequest: (request: BusinessRequest) => void
  nominations: Map<string, BusinessNomination>;
}
export default function BusinessRequestList({ onSelectRequest, nominations }: BusinessRequesListProps) {
      const { t, i18n } = useTranslation()
      const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'

      
        const formatMoney = useMemo(
          () => new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-SA', {
            maximumFractionDigits: 0,
          }),
          [language],
        )
      const businessRequests: BusinessRequest[] = [
    {
      id: 'rosa-weekly-pastries',
      business: t('supplierDashboard.sampleCafeOne'),
      title: t('supplierDashboard.requestOneTitle'),
      description: t('supplierDashboard.requestOneDescription'),
      product: t('supplierDashboard.requestOneProduct'),
      quantity: 50,
      delivery: t('supplierDashboard.requestOneDelivery'),
      location: t('supplierDashboard.requestOneLocation'),
      unitPrice: 12,
    },
    {
      id: 'dallah-daily-bread',
      business: t('supplierDashboard.sampleCafeTwo'),
      title: t('supplierDashboard.requestTwoTitle'),
      description: t('supplierDashboard.requestTwoDescription'),
      product: t('supplierDashboard.requestTwoProduct'),
      quantity: 35,
      delivery: t('supplierDashboard.requestTwoDelivery'),
      location: t('supplierDashboard.requestTwoLocation'),
      unitPrice: 8,
    },
    {
      id: 'saha-event-date-bites',
      business: t('supplierDashboard.sampleCafeThree'),
      title: t('supplierDashboard.requestThreeTitle'),
      description: t('supplierDashboard.requestThreeDescription'),
      product: t('supplierDashboard.requestThreeProduct'),
      quantity: 120,
      delivery: t('supplierDashboard.requestThreeDelivery'),
      location: t('supplierDashboard.requestThreeLocation'),
      unitPrice: 25,
    },
  ]

    
    return(
        <>
                            <header className="dashboard-section-heading">
                              <div>
                                <h2 id="business-requests-heading">{t('supplierDashboard.businessRequests')}</h2>
                                <p>{t('supplierDashboard.businessRequestsDescription')}</p>
                              </div>
                            </header>
                            <div className="dashboard-business-requests">
                              {businessRequests.map((request) => (
                                <button
                                  className="business-request-card"
                                  key={request.id}
                                  type="button"
                                  aria-haspopup="dialog"
                                  onClick={() => onSelectRequest(request)}
                                >
                                  <span className="business-request-cover" aria-hidden="true">
                                    <PackageCheck />
                                    <span>{request.business}</span>
                                  </span>
                                  <span className="business-request-card-content">
                                    <span className="business-request-card-heading">
                                      <span className="business-request-title">{request.title}</span>
                                      <Badge variant="outline">{request.product}</Badge>
                                    </span>
                                    <span className="business-request-description">{request.description}</span>
                                    <span className="business-request-summary">
                                      <span>{t('supplierDashboard.requestQuantity', { count: formatMoney.format(request.quantity) })}</span>
                                      <span aria-hidden="true">·</span>
                                      <span>{request.delivery}</span>
                                    </span>
                                    <span className="business-request-card-footer">
                                      <span className="business-request-open">{t('supplierDashboard.viewRequest')}</span>
                                      {nominations.has(request.id) && (
                                        <Badge className="business-request-nominated" variant="secondary">
                                          {t('supplierDashboard.nominationSent')}
                                        </Badge>
                                      )}
                                    </span>
                                  </span>
                                </button>
                              ))}
                            </div></>
                           
    )
}