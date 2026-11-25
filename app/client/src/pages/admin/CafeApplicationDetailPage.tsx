import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  CircleCheck,
  CircleX,
  Clock3,
  FileText,
  MapPin,
  RefreshCw,
  Store,
  UsersRound,
  X,
} from 'lucide-react'
import {
  listUsers,
  setUserStatus,
  type CafeApplicationDocument,
  type ManagedUser,
  type UserStatus,
} from '@/api/users'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePageTitle } from '@/hooks/use-page-title'
import { AdminSummaryCards } from './AdminSummaryCards'
import './cafe-application-detail.css'

interface ToastMessage {
  message: string
  tone: 'success' | 'error'
}

function LicenseDocumentCard({
  title,
  document,
}: {
  title: string
  document: CafeApplicationDocument | undefined
}) {
  const { t } = useTranslation()

  return (
    <article className="cafe-application-document">
      <div className="cafe-application-document-heading">
        <FileText aria-hidden="true" />
        <h3>{title}</h3>
      </div>
      {document ? (
        <div className="cafe-application-document-content">
          <div>
            <Badge variant="secondary">{t('cafeApplication.documentSubmitted')}</Badge>
            <p className="cafe-application-file-name">{document.fileName}</p>
          </div>
          <div className="cafe-application-document-actions">
            <a
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
              href={document.dataUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('cafeApplication.viewDocument')}
            </a>
            <a
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
              href={document.dataUrl}
              download={document.fileName}
            >
              {t('cafeApplication.downloadDocument')}
            </a>
          </div>
        </div>
      ) : (
        <div className="cafe-application-document-missing">
          <Badge variant="outline">{t('cafeApplication.notProvided')}</Badge>
          <p>{t('cafeApplication.missingDocument')}</p>
        </div>
      )}
    </article>
  )
}

export function CafeApplicationDetailPage() {
  const { t, i18n } = useTranslation()
  const { userId } = useParams()
  const language: 'ar' | 'en' =
    i18n.resolvedLanguage?.split('-')[0] === 'en' ? 'en' : 'ar'
  const locale = language === 'ar' ? 'ar-SA' : 'en-SA'
  const [user, setUser] = useState<ManagedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [reviewStatus, setReviewStatus] = useState<'active' | 'rejected' | null>(null)
  const [updating, setUpdating] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const displayName = user?.name[language] || user?.name.en || ''
  usePageTitle(
    user
      ? t('cafeApplication.pageTitle', { name: displayName })
      : t('cafeApplication.title'),
  )

  const dateFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    [locale],
  )

  useEffect(() => {
    let active = true
    listUsers()
      .then((users) => {
        if (active) {
          setUser(
            users.find((item) => item.id === userId && item.role === 'cafe') ?? null,
          )
        }
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reloadKey, userId])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const application = user?.cafeApplication
  const documentsReceived = [
    application?.commercialRegistrationDocument,
    application?.operatingLicenseDocument,
  ].filter(Boolean).length
  const summaryMetrics = [
    {
      label: t('cafeApplication.summary.status'),
      value: user ? t(`adminUsers.status.${user.status}`) : '—',
      icon:
        user?.status === 'active'
          ? CircleCheck
          : user?.status === 'rejected' || user?.status === 'banned'
            ? CircleX
            : Clock3,
    },
    {
      label: t('cafeApplication.summary.submitted'),
      value: user ? dateFormat.format(new Date(user.joinedAt)) : '—',
      icon: CalendarDays,
    },
    {
      label: t('cafeApplication.summary.documents'),
      value: t('cafeApplication.summary.documentsValue', {
        received: documentsReceived,
        total: 2,
      }),
      icon: FileText,
    },
  ]

  function statusBadge(status: UserStatus) {
    const variant =
      status === 'rejected' || status === 'banned'
        ? 'destructive'
        : status === 'active'
          ? 'secondary'
          : 'outline'
    return <Badge variant={variant}>{t(`adminUsers.status.${status}`)}</Badge>
  }

  async function confirmReviewAction() {
    if (!user || !reviewStatus) return
    const status = reviewStatus
    setUpdating(true)
    try {
      const updated = await setUserStatus(user.id, status)
      setUser(updated)
      setReviewStatus(null)
      setToast({
        message: t(
          status === 'active'
            ? 'storeVerification.approveSuccess'
            : 'storeVerification.rejectSuccess',
        ),
        tone: 'success',
      })
    } catch {
      setToast({ message: t('storeVerification.updateError'), tone: 'error' })
    } finally {
      setUpdating(false)
    }
  }

  function infoRows(items: [string, string | undefined][]) {
    return (
      <dl className="cafe-application-info-grid">
        {items.map(([label, value]) => (
          <div className="cafe-application-info-item" key={label}>
            <dt>{label}</dt>
            <dd>{value?.trim() || t('cafeApplication.notProvided')}</dd>
          </div>
        ))}
      </dl>
    )
  }

  return (
    <div className="cafe-application-page">
      <div className="cafe-application-content">
        <header className="cafe-application-header">
          <div>
            <p className="cafe-application-eyebrow">
              <Store aria-hidden="true" />
              {t('adminUsers.portalLabel')}
            </p>
            <h1>{displayName || t('cafeApplication.title')}</h1>
            <p className="cafe-application-description">
              {t('cafeApplication.description')}
            </p>
          </div>
          <div className="cafe-application-header-actions">
            <Link
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
              to="/admin/store-verification"
            >
              <ArrowLeft data-icon="inline-start" />
              {t('cafeApplication.backToVerification')}
            </Link>
            <Link
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
              to="/admin/users"
            >
              <UsersRound data-icon="inline-start" />
              {t('adminUsers.title')}
            </Link>
          </div>
        </header>

        <AdminSummaryCards
          ariaLabel={t('cafeApplication.summary.label')}
          loading={loading}
          metrics={summaryMetrics}
        />

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="cafe-application-loading">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ) : loadError ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('cafeApplication.title')}</CardTitle>
              <CardDescription role="alert">
                {t('cafeApplication.loadError')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setLoading(true)
                  setLoadError(false)
                  setReloadKey((key) => key + 1)
                }}
              >
                <RefreshCw data-icon="inline-start" />
                {t('adminUsers.retry')}
              </Button>
            </CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('cafeApplication.title')}</CardTitle>
              <CardDescription>{t('cafeApplication.notFound')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
                to="/admin/store-verification"
              >
                <ArrowLeft data-icon="inline-start" />
                {t('cafeApplication.backToVerification')}
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="cafe-application-review-bar">
              <div>
                <span className="cafe-application-review-label">
                  {t('adminUsers.columns.status')}
                </span>
                {statusBadge(user.status)}
              </div>
              {user.status === 'unverified' && (
                <div className="cafe-application-review-actions">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setReviewStatus('active')}
                  >
                    <Check data-icon="inline-start" />
                    {t('storeVerification.approve')}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setReviewStatus('rejected')}
                  >
                    <X data-icon="inline-start" />
                    {t('storeVerification.reject')}
                  </Button>
                </div>
              )}
            </div>

            <div className="cafe-application-main-grid">
              <div className="cafe-application-primary-column">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Building2 aria-hidden="true" />
                      {t('cafeApplication.businessDetails')}
                    </CardTitle>
                    <CardDescription>
                      {t('cafeApplication.businessDetailsDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {infoRows([
                      [t('common.cafeName'), displayName],
                      [
                        t('registration.registeredBusinessName'),
                        application?.registeredBusinessName,
                      ],
                      [
                        t('registration.commercialRegistration'),
                        application?.commercialRegistration,
                      ],
                      [t('registration.vatNumber'), application?.vatNumber],
                      [t('common.city'), application?.city],
                    ])}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      <MapPin aria-hidden="true" />
                      {t('registration.nationalAddress')}
                    </CardTitle>
                    <CardDescription>
                      {t('cafeApplication.addressDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {infoRows([
                      [t('registration.district'), application?.district],
                      [t('registration.street'), application?.street],
                      [
                        t('registration.buildingNumber'),
                        application?.buildingNumber,
                      ],
                      [t('registration.postalCode'), application?.postalCode],
                      [t('registration.shortAddress'), application?.shortAddress],
                    ])}
                  </CardContent>
                </Card>
              </div>

              <div className="cafe-application-secondary-column">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('cafeApplication.contactDetails')}</CardTitle>
                    <CardDescription>
                      {t('cafeApplication.contactDetailsDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {infoRows([
                      [t('common.email'), user.email],
                      [t('common.phone'), user.phone],
                      [
                        t('cafeApplication.summary.submitted'),
                        dateFormat.format(new Date(user.joinedAt)),
                      ],
                    ])}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('cafeApplication.licenses')}</CardTitle>
                    <CardDescription>
                      {t('cafeApplication.documentsDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="cafe-application-documents">
                    <LicenseDocumentCard
                      title={t('registration.commercialRegistrationDocument')}
                      document={application?.commercialRegistrationDocument}
                    />
                    <LicenseDocumentCard
                      title={t('registration.operatingLicenseDocument')}
                      document={application?.operatingLicenseDocument}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>

      <AlertDialog
        open={reviewStatus !== null}
        onOpenChange={(open) => {
          if (!open && !updating) setReviewStatus(null)
        }}
      >
        {reviewStatus && user && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t(
                  reviewStatus === 'active'
                    ? 'storeVerification.confirm.approveTitle'
                    : 'storeVerification.confirm.rejectTitle',
                )}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t(
                  reviewStatus === 'active'
                    ? 'storeVerification.confirm.approveDescription'
                    : 'storeVerification.confirm.rejectDescription',
                  { name: displayName },
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={updating}>
                {t('adminUsers.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                variant={reviewStatus === 'rejected' ? 'destructive' : 'default'}
                disabled={updating}
                onClick={(event) => {
                  event.preventDefault()
                  void confirmReviewAction()
                }}
              >
                {updating
                  ? t('storeVerification.processing')
                  : reviewStatus === 'active'
                    ? t('storeVerification.approve')
                    : t('storeVerification.reject')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>

      {toast && (
        <div
          className={`cafe-application-toast cafe-application-toast--${toast.tone}`}
          role={toast.tone === 'error' ? 'alert' : 'status'}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
