import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, RefreshCw, Search, Store, X } from 'lucide-react'
import {
  listUsers,
  setUserStatus,
  type ManagedUser,
  type UserRole,
  type UserStatus,
} from '@/api/users'
import { AppShell } from '@/components/AppShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { usePageTitle } from '@/hooks/use-page-title'
import './store-verification.css'

type VerificationFilter = 'all' | UserRole | 'unverified'

interface ToastMessage {
  id: number
  message: string
  tone: 'success' | 'error'
}

export function StoreVerificationPage() {
  const { t, i18n } = useTranslation()
  const language: 'ar' | 'en' =
    i18n.resolvedLanguage?.split('-')[0] === 'en' ? 'en' : 'ar'
  const locale = language === 'ar' ? 'ar-SA' : 'en-SA'
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<VerificationFilter>('all')
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const toastId = useRef(0)

  usePageTitle(t('storeVerification.title'))

  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale])
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
      .then((data) => {
        if (active) setUsers(data)
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
  }, [reloadKey])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  function showToast(message: string, tone: ToastMessage['tone'] = 'success') {
    toastId.current += 1
    setToast({ id: toastId.current, message, tone })
  }

  const verificationUsers = useMemo(
    () => users.filter((user) => user.status !== 'banned'),
    [users],
  )

  const counts = useMemo(
    () => ({
      all: verificationUsers.length,
      supplier: verificationUsers.filter((user) => user.role === 'supplier').length,
      cafe: verificationUsers.filter((user) => user.role === 'cafe').length,
      unverified: verificationUsers.filter((user) => user.status === 'unverified').length,
    }),
    [verificationUsers],
  )

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return verificationUsers.filter((user) => {
      if (filter === 'unverified' && user.status !== 'unverified') return false
      if (filter !== 'all' && filter !== 'unverified' && user.role !== filter) {
        return false
      }
      if (!needle) return true
      return [
        user.name.en,
        user.name.ar,
        user.email,
        user.phone,
        t(`adminUsers.roles.${user.role}`),
      ]
        .join(' ')
        .toLocaleLowerCase()
        .includes(needle)
    })
  }, [filter, query, t, verificationUsers])

  async function reviewUser(user: ManagedUser, status: 'active' | 'rejected') {
    setPendingIds((previous) => new Set(previous).add(user.id))
    try {
      const updated = await setUserStatus(user.id, status)
      setUsers((previous) =>
        previous.map((item) => (item.id === updated.id ? updated : item)),
      )
      showToast(
        t(status === 'active' ? 'storeVerification.approveSuccess' : 'storeVerification.rejectSuccess'),
      )
    } catch {
      showToast(t('storeVerification.updateError'), 'error')
    } finally {
      setPendingIds((previous) => {
        const next = new Set(previous)
        next.delete(user.id)
        return next
      })
    }
  }

  function statusBadge(status: UserStatus) {
    const variant =
      status === 'rejected' || status === 'banned'
        ? 'destructive'
        : status === 'active'
          ? 'secondary'
          : 'outline'
    return <Badge variant={variant}>{t(`adminUsers.status.${status}`)}</Badge>
  }

  return (
    <AppShell>
      <main className="store-verification-page">
        <div className="store-verification-content">
          <header className="store-verification-header">
            <div className="store-verification-heading">
              <p className="store-verification-eyebrow">
                <Store aria-hidden="true" />
                {t('adminUsers.portalLabel')}
              </p>
              <h1>{t('storeVerification.title')}</h1>
              <p className="store-verification-description">
                {t('storeVerification.description')}
              </p>
            </div>
            <Badge variant="outline">{t('adminUsers.demoData')}</Badge>
          </header>

          <section
            className="store-verification-toolbar"
            aria-label={t('storeVerification.filtersLabel')}
          >
            <label className="store-verification-search">
              <Search aria-hidden="true" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('storeVerification.searchPlaceholder')}
                aria-label={t('storeVerification.searchPlaceholder')}
              />
            </label>

            <ToggleGroup
              aria-label={t('storeVerification.filtersLabel')}
              className="store-verification-filters"
              value={[filter]}
              variant="outline"
              size="sm"
              spacing={0}
              onValueChange={(values) => {
                const value = values[0]
                if (
                  value === 'all' ||
                  value === 'supplier' ||
                  value === 'cafe' ||
                  value === 'unverified'
                ) {
                  setFilter(value)
                }
              }}
            >
              {(['all', 'supplier', 'cafe', 'unverified'] as const).map((value) => (
                <ToggleGroupItem key={value} value={value}>
                  {t(`storeVerification.filters.${value}`)}
                  <span className="store-verification-filter-count">
                    {numberFormat.format(counts[value])}
                  </span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>

          <section
            className="store-verification-panel"
            aria-label={t('storeVerification.title')}
          >
            <Table className="store-verification-table">
              <TableHeader>
                <TableRow>
                  <TableHead>{t('storeVerification.columns.name')}</TableHead>
                  <TableHead>{t('storeVerification.columns.type')}</TableHead>
                  <TableHead>{t('storeVerification.columns.registered')}</TableHead>
                  <TableHead>{t('adminUsers.columns.status')}</TableHead>
                  <TableHead className="store-verification-actions-heading">
                    <span className="sr-only">
                      {t('storeVerification.columns.actions')}
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading &&
                  Array.from({ length: 3 }, (_, index) => (
                    <TableRow key={`loading-${index}`}>
                      {Array.from({ length: 5 }, (_, cellIndex) => (
                        <TableCell key={`loading-${index}-${cellIndex}`}>
                          <Skeleton className="h-5 w-20" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {!loading && loadError && (
                  <TableRow>
                    <TableCell className="store-verification-message" colSpan={5}>
                      <p role="alert">{t('adminUsers.loadError')}</p>
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
                    </TableCell>
                  </TableRow>
                )}
                {!loading && !loadError && filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell className="store-verification-message" colSpan={5}>
                      {t('storeVerification.empty')}
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  !loadError &&
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="store-verification-name">
                        {user.name[language] || user.name.en}
                      </TableCell>
                      <TableCell>{t(`adminUsers.roles.${user.role}`)}</TableCell>
                      <TableCell>
                        {dateFormat.format(new Date(user.joinedAt))}
                      </TableCell>
                      <TableCell>{statusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.status === 'unverified' && (
                          <div className="store-verification-actions">
                            <Button
                              type="button"
                              size="sm"
                              disabled={pendingIds.has(user.id)}
                              aria-label={t('storeVerification.approveUser', {
                                name: user.name[language] || user.name.en,
                              })}
                              onClick={() => void reviewUser(user, 'active')}
                            >
                              <Check data-icon="inline-start" />
                              {t('storeVerification.approve')}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={pendingIds.has(user.id)}
                              aria-label={t('storeVerification.rejectUser', {
                                name: user.name[language] || user.name.en,
                              })}
                              onClick={() => void reviewUser(user, 'rejected')}
                            >
                              <X data-icon="inline-start" />
                              {t('storeVerification.reject')}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </section>

          <p className="store-verification-footnote">
            {t('storeVerification.demoNote')}
          </p>
        </div>
        {toast && (
          <div
            key={toast.id}
            className={`store-verification-toast store-verification-toast--${toast.tone}`}
            role={toast.tone === 'error' ? 'alert' : 'status'}
          >
            {toast.message}
          </div>
        )}
      </main>
    </AppShell>
  )
}
