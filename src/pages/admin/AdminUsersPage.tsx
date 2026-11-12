import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Ban, CircleCheck, Eye, Pencil, RefreshCw, Search, Store, UsersRound } from 'lucide-react'
import {
  CUSTOMER_REQUESTS_STORAGE_KEY,
  CUSTOMER_REQUESTS_UPDATED_EVENT,
  listCustomerServiceRequests,
  type CustomerRequestStatus,
  type CustomerServiceRequest,
} from '@/api/customer-service'
import {
  listUsers,
  setUserStatus,
  updateUser,
  USERS_STORAGE_KEY,
  type ManagedUser,
  type UserStatus,
} from '@/api/users'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import './users.css'

type StatusFilter = 'all' | UserStatus

interface ToastMessage {
  id: number
  message: string
  tone: 'success' | 'error'
}

export function AdminUsersPage() {
  const { t, i18n } = useTranslation()
  const language: 'ar' | 'en' =
    i18n.resolvedLanguage?.split('-')[0] === 'en' ? 'en' : 'ar'
  const locale = language === 'ar' ? 'ar-SA' : 'en-SA'

  const [users, setUsers] = useState<ManagedUser[]>([])
  const [requests, setRequests] = useState<CustomerServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [requestLoadError, setRequestLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [viewingUser, setViewingUser] = useState<ManagedUser | null>(null)
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const toastId = useRef(0)

  usePageTitle(t('adminUsers.title'))

  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale])
  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
    [locale],
  )

  useEffect(() => {
    let active = true
    Promise.all([
      listUsers()
        .then((data) => {
          if (active) setUsers(data)
        })
        .catch(() => {
          if (active) setLoadError(true)
        }),
      listCustomerServiceRequests()
        .then((data) => {
          if (active) {
            setRequests(data)
            setRequestLoadError(false)
          }
        })
        .catch(() => {
          if (active) setRequestLoadError(true)
        }),
    ])
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reloadKey])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (
        event.key !== USERS_STORAGE_KEY &&
        event.key !== CUSTOMER_REQUESTS_STORAGE_KEY &&
        event.key !== null
      ) {
        return
      }
      setLoading(true)
      setLoadError(false)
      setRequestLoadError(false)
      setReloadKey((key) => key + 1)
    }

    function handleRequestUpdate() {
      listCustomerServiceRequests()
        .then((data) => {
          setRequests(data)
          setRequestLoadError(false)
        })
        .catch(() => setRequestLoadError(true))
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(CUSTOMER_REQUESTS_UPDATED_EVENT, handleRequestUpdate)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(CUSTOMER_REQUESTS_UPDATED_EVENT, handleRequestUpdate)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  function showToast(message: string, tone: ToastMessage['tone'] = 'success') {
    toastId.current += 1
    const id = toastId.current
    setToast({ id, message, tone })
  }

  const counts = useMemo(
    () => ({
      all: users.length,
      active: users.filter((user) => user.status === 'active').length,
      unverified: users.filter((user) => user.status === 'unverified').length,
      rejected: users.filter((user) => user.status === 'rejected').length,
      banned: users.filter((user) => user.status === 'banned').length,
    }),
    [users],
  )

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return users.filter((user) => {
      if (filter !== 'all' && user.status !== filter) return false
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
  }, [filter, query, t, users])

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingUser) return
    setSaving(true)
    setSaveError('')

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()
    const roleValue = String(formData.get('role') ?? '')
    if (
      !name ||
      !email ||
      !phone ||
      (roleValue !== 'supplier' && roleValue !== 'cafe')
    ) {
      setSaveError(t('adminUsers.saveError'))
      setSaving(false)
      return
    }

    try {
      const updated = await updateUser(editingUser.id, {
        name: { ...editingUser.name, [language]: name },
        email,
        phone,
        role: roleValue,
      })
      setUsers((previous) =>
        previous.map((user) => (user.id === updated.id ? updated : user)),
      )
      setEditingUser(null)
      showToast(t('adminUsers.updateSuccess'))
    } catch (error) {
      setSaveError(
        error instanceof Error &&
          error.message === 'A user with this email address already exists.'
          ? t('adminUsers.emailExists')
          : t('adminUsers.saveError'),
      )
    } finally {
      setSaving(false)
    }
  }

  async function toggleUserStatus(user: ManagedUser) {
    const status = user.status === 'banned' ? 'active' : 'banned'
    try {
      const updated = await setUserStatus(user.id, status)
      setUsers((previous) =>
        previous.map((item) => (item.id === updated.id ? updated : item)),
      )
      showToast(
        t(status === 'banned' ? 'adminUsers.banSuccess' : 'adminUsers.unbanSuccess'),
      )
    } catch {
      showToast(t('adminUsers.saveError'), 'error')
    }
  }

  function statusBadge(status: UserStatus) {
    const variant =
      status === 'banned' || status === 'rejected'
        ? 'destructive'
        : status === 'active'
          ? 'secondary'
          : 'outline'
    return (
      <Badge variant={variant}>
        {t(`adminUsers.status.${status}`)}
      </Badge>
    )
  }

  function latestRequestForUser(userId: string) {
    return requests
      .filter((request) => request.userId === userId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]
  }

  function requestStatusBadge(status: CustomerRequestStatus) {
    const variant =
      status === 'closed'
        ? 'secondary'
        : status === 'reviewing'
          ? 'outline'
          : 'default'
    return (
      <Badge variant={variant}>
        {t(`customerService.status.${status}`)}
      </Badge>
    )
  }

  return (
      <div className="admin-users-page">
      <div className="admin-users-content">
        <header className="admin-users-header">
          <div className="admin-users-heading">
            <p className="admin-users-eyebrow">
              <UsersRound aria-hidden="true" />
              {t('adminUsers.portalLabel')}
            </p>
            <h1>{t('adminUsers.title')}</h1>
          </div>
          <div className="admin-users-header-actions">
            <a
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
              href="/admin/store-verification"
            >
              <Store data-icon="inline-start" />
              {t('storeVerification.openPage')}
            </a>
            <a
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
              href="/admin/customer-service"
            >
              {t('customerService.title')}
            </a>
            <Badge variant="outline">{t('adminUsers.demoData')}</Badge>
          </div>
        </header>

        <section className="admin-users-toolbar" aria-label={t('adminUsers.filtersLabel')}>
          <ToggleGroup
            aria-label={t('adminUsers.filtersLabel')}
            className="admin-users-filters"
            value={[filter]}
            variant="outline"
            size="sm"
            spacing={0}
            onValueChange={(values) => {
              const value = values[0]
              if (
                value === 'all' ||
                value === 'active' ||
                value === 'unverified' ||
                value === 'rejected' ||
                value === 'banned'
              ) {
                setFilter(value)
              }
            }}
          >
            {(['all', 'active', 'unverified', 'rejected', 'banned'] as const).map((status) => (
              <ToggleGroupItem key={status} value={status}>
                {t(`adminUsers.filters.${status}`)}
                <span className="admin-users-filter-count">
                  {numberFormat.format(counts[status])}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <label className="admin-users-search">
            <Search aria-hidden="true" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('adminUsers.searchPlaceholder')}
              aria-label={t('adminUsers.searchPlaceholder')}
            />
          </label>
        </section>

        <section className="admin-users-panel" aria-label={t('adminUsers.title')}>
          <Table className="admin-users-table">
            <TableHeader>
              <TableRow>
                <TableHead className="admin-users-number">#</TableHead>
                <TableHead>{t('adminUsers.columns.name')}</TableHead>
                <TableHead>{t('adminUsers.columns.role')}</TableHead>
                <TableHead>{t('adminUsers.columns.email')}</TableHead>
                <TableHead>{t('adminUsers.columns.phone')}</TableHead>
                <TableHead>{t('adminUsers.columns.joined')}</TableHead>
                <TableHead>{t('adminUsers.columns.status')}</TableHead>
                <TableHead>{t('adminUsers.columns.customerRequest')}</TableHead>
                <TableHead className="admin-users-actions-heading">
                  <span className="sr-only">{t('adminUsers.columns.actions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading &&
                Array.from({ length: 4 }, (_, index) => (
                  <TableRow key={`loading-${index}`}>
                    {Array.from({ length: 9 }, (_, cellIndex) => (
                      <TableCell key={`loading-${index}-${cellIndex}`}>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              {!loading && loadError && (
                <TableRow>
                  <TableCell className="admin-users-message" colSpan={9}>
                    <p role="alert">{t('adminUsers.loadError')}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLoading(true)
                        setLoadError(false)
                        setRequestLoadError(false)
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
                  <TableCell className="admin-users-message" colSpan={9}>
                    {t('adminUsers.empty')}
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                !loadError &&
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="admin-users-number">
                      {numberFormat.format(index + 1)}
                    </TableCell>
                    <TableCell className="admin-users-name">
                      {user.name[language] || user.name.en}
                    </TableCell>
                    <TableCell>{t(`adminUsers.roles.${user.role}`)}</TableCell>
                    <TableCell dir="ltr" className="admin-users-ltr">
                      {user.email}
                    </TableCell>
                    <TableCell dir="ltr" className="admin-users-ltr">
                      {user.phone}
                    </TableCell>
                    <TableCell>
                      {dateFormat.format(new Date(user.joinedAt))}
                    </TableCell>
                    <TableCell>{statusBadge(user.status)}</TableCell>
                    <TableCell>
                      {requestLoadError ? (
                        <span className="admin-users-no-request" role="alert">
                          {t('customerService.loadError')}
                        </span>
                      ) : (
                        (() => {
                          const latestRequest = latestRequestForUser(user.id)
                          return latestRequest ? (
                            <a
                              className="admin-users-request-status"
                              href={`/admin/customer-service/${encodeURIComponent(latestRequest.id)}`}
                            >
                              {requestStatusBadge(latestRequest.status)}
                              <span dir="ltr">#{latestRequest.id}</span>
                            </a>
                          ) : (
                            <span className="admin-users-no-request">
                              {t('adminUsers.noCustomerRequest')}
                            </span>
                          )
                        })()
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="admin-users-row-actions">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t('adminUsers.actions.viewUser', {
                            name: user.name[language] || user.name.en,
                          })}
                          onClick={() => setViewingUser(user)}
                        >
                          <Eye aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t('adminUsers.actions.editUser', {
                            name: user.name[language] || user.name.en,
                          })}
                          onClick={() => {
                            setSaveError('')
                            setEditingUser(user)
                          }}
                        >
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t(
                            user.status === 'banned'
                              ? 'adminUsers.actions.unbanUser'
                              : 'adminUsers.actions.banUser',
                            { name: user.name[language] || user.name.en },
                          )}
                          onClick={() => void toggleUserStatus(user)}
                        >
                          {user.status === 'banned' ? (
                            <CircleCheck aria-hidden="true" />
                          ) : (
                            <Ban aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </section>

        <p className="admin-users-footnote">{t('adminUsers.demoNote')}</p>
      </div>

      <Dialog
        open={viewingUser !== null}
        onOpenChange={(open) => {
          if (!open) setViewingUser(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('adminUsers.detailsTitle')}</DialogTitle>
            <DialogDescription>{t('adminUsers.detailsDescription')}</DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <dl className="admin-users-details">
              <div>
                <dt>{t('adminUsers.columns.name')}</dt>
                <dd>{viewingUser.name[language] || viewingUser.name.en}</dd>
              </div>
              <div>
                <dt>{t('adminUsers.columns.role')}</dt>
                <dd>{t(`adminUsers.roles.${viewingUser.role}`)}</dd>
              </div>
              <div>
                <dt>{t('adminUsers.columns.email')}</dt>
                <dd dir="ltr">{viewingUser.email}</dd>
              </div>
              <div>
                <dt>{t('adminUsers.columns.phone')}</dt>
                <dd dir="ltr">{viewingUser.phone}</dd>
              </div>
              <div>
                <dt>{t('adminUsers.columns.joined')}</dt>
                <dd>{dateFormat.format(new Date(viewingUser.joinedAt))}</dd>
              </div>
              <div>
                <dt>{t('adminUsers.columns.status')}</dt>
                <dd>{statusBadge(viewingUser.status)}</dd>
              </div>
              <div>
                <dt>{t('adminUsers.columns.customerRequest')}</dt>
                <dd>
                  {requestLoadError
                    ? t('customerService.loadError')
                    : (() => {
                        const latestRequest = latestRequestForUser(viewingUser.id)
                        return latestRequest ? (
                          <a
                            className="admin-users-request-status"
                            href={`/admin/customer-service/${encodeURIComponent(latestRequest.id)}`}
                          >
                            {requestStatusBadge(latestRequest.status)}
                            <span dir="ltr">#{latestRequest.id}</span>
                          </a>
                        ) : (
                          t('adminUsers.noCustomerRequest')
                        )
                      })()}
                </dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingUser !== null}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('adminUsers.editTitle')}</DialogTitle>
            <DialogDescription>{t('adminUsers.editDescription')}</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form key={editingUser.id} className="admin-users-edit-form" onSubmit={(event) => void handleSave(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="admin-user-name">{t('adminUsers.columns.name')}</FieldLabel>
                  <Input
                    id="admin-user-name"
                    name="name"
                    defaultValue={editingUser.name[language] || editingUser.name.en}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="admin-user-email">{t('adminUsers.columns.email')}</FieldLabel>
                  <Input
                    id="admin-user-email"
                    name="email"
                    type="email"
                    dir="ltr"
                    defaultValue={editingUser.email}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="admin-user-phone">{t('adminUsers.columns.phone')}</FieldLabel>
                  <Input
                    id="admin-user-phone"
                    name="phone"
                    type="tel"
                    dir="ltr"
                    defaultValue={editingUser.phone}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="admin-user-role">{t('adminUsers.columns.role')}</FieldLabel>
                  <Select name="role" defaultValue={editingUser.role}>
                    <SelectTrigger id="admin-user-role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="supplier">{t('adminUsers.roles.supplier')}</SelectItem>
                        <SelectItem value="cafe">{t('adminUsers.roles.cafe')}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              {saveError && (
                <p className="admin-users-form-error" role="alert">
                  {saveError}
                </p>
              )}
              <div className="admin-users-edit-actions">
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                  {t('adminUsers.cancel')}
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? t('adminUsers.saving') : t('adminUsers.save')}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {toast && (
        <div
          key={toast.id}
          className={`admin-users-toast admin-users-toast--${toast.tone}`}
          role={toast.tone === 'error' ? 'alert' : 'status'}
        >
          {toast.message}
        </div>
      )}
      </div>
  )
}
