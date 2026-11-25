import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  CalendarDays,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Send,
  TicketCheck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  CUSTOMER_REQUESTS_STORAGE_KEY,
  CUSTOMER_REQUESTS_UPDATED_EVENT,
  listCustomerServiceRequests,
  type CustomerRequestStatus,
  type CustomerServiceRequest,
} from '@/api/customer-service'
import {
  listUsers,
  USERS_STORAGE_KEY,
  type ManagedUser,
  type UserRole,
  type UserStatus,
} from '@/api/users'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Bubble,
  BubbleContent,
} from '@/components/ui/bubble'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Marker,
  MarkerContent,
} from '@/components/ui/marker'
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from '@/components/ui/message'
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { usePageTitle } from '@/hooks/use-page-title'
import './admin-chat.css'

type UserFilter = 'all' | UserRole

type AdminChatMessage = {
  id: number
  sender: 'admin' | 'contact'
  text: string
  textKey?: 'sampleSupplierMessage' | 'sampleAdminReply' | 'sampleBusinessMessage'
  timeKey: 'sampleTime' | 'justNow'
  sentAt: number
  unread?: boolean
}

export function AdminChatPage() {
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
  const [filter, setFilter] = useState<UserFilter>('all')
  const [query, setQuery] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>('u-1001')
  const [draft, setDraft] = useState('')
  const [messagesByUser, setMessagesByUser] = useState<
    Record<string, AdminChatMessage[]>
  >(() => ({
    'u-1001': [
      {
        id: 1,
        sender: 'admin',
        text: '',
        textKey: 'sampleAdminReply',
        timeKey: 'sampleTime',
        sentAt: Date.parse('2026-11-10T09:20:00+03:00'),
      },
      {
        id: 2,
        sender: 'contact',
        text: '',
        textKey: 'sampleSupplierMessage',
        timeKey: 'sampleTime',
        sentAt: Date.parse('2026-11-10T09:30:00+03:00'),
        unread: true,
      },
    ],
    'u-1003': [
      {
        id: 3,
        sender: 'contact',
        text: '',
        textKey: 'sampleBusinessMessage',
        timeKey: 'sampleTime',
        sentAt: Date.parse('2026-11-10T10:30:00+03:00'),
        unread: true,
      },
    ],
  }))

  usePageTitle(t('adminChat.title'))

  const dateFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    [locale],
  )
  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale])
  const timeFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }),
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
    ]).finally(() => {
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
      window.removeEventListener(
        CUSTOMER_REQUESTS_UPDATED_EVENT,
        handleRequestUpdate,
      )
    }
  }, [])

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return users.filter((user) => {
      if (filter !== 'all' && user.role !== filter) return false
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

  const sortedUsers = useMemo(
    () =>
      [...filteredUsers].sort((left, right) => {
        const leftMessages = messagesByUser[left.id] ?? []
        const rightMessages = messagesByUser[right.id] ?? []
        const leftUnread = leftMessages.some((message) => message.unread)
        const rightUnread = rightMessages.some((message) => message.unread)
        if (leftUnread !== rightUnread) return Number(rightUnread) - Number(leftUnread)

        const leftRecent =
          leftMessages.at(-1)?.sentAt ?? new Date(left.joinedAt).getTime()
        const rightRecent =
          rightMessages.at(-1)?.sentAt ?? new Date(right.joinedAt).getTime()
        return rightRecent - leftRecent || left.id.localeCompare(right.id)
      }),
    [filteredUsers, messagesByUser],
  )

  const selectedUser =
    sortedUsers.find((user) => user.id === selectedUserId) ??
    sortedUsers[0] ??
    null
  const messages = selectedUser
    ? messagesByUser[selectedUser.id] ?? []
    : []
  const latestRequest = selectedUser
    ? latestRequestForUser(selectedUser.id)
    : undefined
  const messageGroups = messages.reduce<AdminChatMessage[][]>((groups, message) => {
    const currentGroup = groups[groups.length - 1]
    if (currentGroup && currentGroup[0].sender === message.sender) {
      currentGroup.push(message)
    } else {
      groups.push([message])
    }
    return groups
  }, [])

  function userName(user: ManagedUser) {
    return user.name[language] || user.name.en
  }

  function messageText(message: AdminChatMessage) {
    return message.textKey ? t(`adminChat.${message.textKey}`) : message.text
  }

  function latestRequestForUser(userId: string) {
    return requests
      .filter((request) => request.userId === userId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]
  }

  function statusBadge(status: UserStatus) {
    const variant =
      status === 'banned' || status === 'rejected'
        ? 'destructive'
        : status === 'active'
          ? 'secondary'
          : 'outline'
    return <Badge variant={variant}>{t(`adminUsers.status.${status}`)}</Badge>
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

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !selectedUser) return

    setMessagesByUser((current) => ({
      ...current,
      [selectedUser.id]: [
        ...(current[selectedUser.id] ?? []),
        {
          id: Date.now(),
          sender: 'admin',
          text,
          timeKey: 'justNow',
          sentAt: Date.now(),
        },
      ],
    }))
    setDraft('')
  }

  return (
    <div className="admin-chat-page">
      <div className="admin-chat-layout" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Card className="admin-chat-conversations">
          <CardHeader>
            <CardTitle>{t('adminChat.title')}</CardTitle>
            <CardDescription>
              {t('adminChat.conversationCount', { count: numberFormat.format(sortedUsers.length) })}
            </CardDescription>
          </CardHeader>
          <CardContent className="admin-chat-list-content">
            <ToggleGroup
              aria-label={t('adminChat.filterLabel')}
              className="admin-chat-filters"
              value={[filter]}
              variant="outline"
              size="sm"
              spacing={0}
              onValueChange={(values) => {
                const value = values[0]
                if (value === 'all' || value === 'supplier' || value === 'cafe') {
                  setFilter(value)
                }
              }}
            >
              {(['all', 'supplier', 'cafe'] as const).map((role) => (
                <ToggleGroupItem key={role} value={role}>
                  {t(`adminChat.filters.${role}`)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <label className="admin-chat-search">
              <Search aria-hidden="true" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('adminChat.searchPlaceholder')}
                aria-label={t('adminChat.searchPlaceholder')}
              />
            </label>

            <div className="admin-chat-contact-list">
              {loading &&
                Array.from({ length: 4 }, (_, index) => (
                  <div className="admin-chat-contact-skeleton" key={index}>
                    <Avatar aria-hidden="true">
                      <AvatarFallback />
                    </Avatar>
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              {!loading && loadError && (
                <div className="admin-chat-list-message">
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
                    {t('adminUsers.retry')}
                  </Button>
                </div>
              )}
              {!loading && !loadError && sortedUsers.length === 0 && (
                <p className="admin-chat-list-message">{t('adminChat.empty')}</p>
              )}
              {!loading &&
                !loadError &&
                sortedUsers.map((user) => {
                  const name = userName(user)
                  const userMessages = messagesByUser[user.id] ?? []
                  const latestMessage = userMessages.at(-1)
                  const unreadCount = userMessages.filter(
                    (message) => message.unread,
                  ).length
                  return (
                    <Button
                      key={user.id}
                      className="admin-chat-contact"
                      data-unread={unreadCount > 0}
                      variant={selectedUser?.id === user.id ? 'secondary' : 'ghost'}
                      aria-pressed={selectedUser?.id === user.id}
                      aria-label={
                        unreadCount > 0
                          ? `${name}, ${t('adminChat.unreadCount', { count: unreadCount })}`
                          : name
                      }
                      onClick={() => {
                        setSelectedUserId(user.id)
                        setDraft('')
                        setMessagesByUser((current) => {
                          const messages = current[user.id]
                          if (!messages?.some((message) => message.unread)) {
                            return current
                          }
                          return {
                            ...current,
                            [user.id]: messages.map((message) =>
                              message.unread
                                ? { ...message, unread: false }
                                : message,
                            ),
                          }
                        })
                      }}
                    >
                      <Avatar aria-hidden="true">
                        <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="admin-chat-contact-copy">
                        <span className="admin-chat-contact-heading">
                          <span className="admin-chat-contact-name">{name}</span>
                          <span className="admin-chat-contact-time">
                            {latestMessage
                              ? timeFormat.format(new Date(latestMessage.sentAt))
                              : dateFormat.format(new Date(user.joinedAt))}
                          </span>
                          {unreadCount > 0 && (
                            <Badge
                              className="admin-chat-unread-badge"
                              aria-label={t('adminChat.unreadCount', {
                                count: unreadCount,
                              })}
                            >
                              {unreadCount}
                            </Badge>
                          )}
                        </span>
                        <span className="admin-chat-contact-email">
                          {user.email}
                        </span>
                        <span className="admin-chat-contact-preview">
                          {latestMessage
                            ? messageText(latestMessage)
                            : t('adminChat.noMessages')}
                        </span>
                      </span>
                    </Button>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        <Card className="admin-chat-thread">
          {selectedUser ? (
            <>
              <CardHeader className="admin-chat-thread-header">
                <Avatar aria-hidden="true">
                  <AvatarFallback>{userName(selectedUser).slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="admin-chat-thread-identity">
                  <CardTitle>{userName(selectedUser)}</CardTitle>
                  <p>{selectedUser.email}</p>
                </div>
                {statusBadge(selectedUser.status)}
              </CardHeader>

              <MessageScrollerProvider autoScroll key={selectedUser.id}>
                <MessageScroller className="admin-chat-scroller">
                  <MessageScrollerViewport>
                    <MessageScrollerContent className="admin-chat-message-content">
                      <MessageScrollerItem messageId="today">
                        <Marker variant="separator">
                          <MarkerContent>{t('adminChat.today')}</MarkerContent>
                        </Marker>
                      </MessageScrollerItem>
                      {messageGroups.map((group) => {
                        const isAdmin = group[0].sender === 'admin'
                        return (
                          <MessageScrollerItem
                            key={group[0].id}
                            messageId={String(group[0].id)}
                            scrollAnchor={isAdmin}
                          >
                            <MessageGroup>
                              <Message align={isAdmin ? 'start' : 'end'}>
                                <MessageContent>
                                  <MessageHeader>
                                    {isAdmin
                                      ? t('adminChat.you')
                                      : userName(selectedUser)}
                                  </MessageHeader>
                                  {group.map((message) => (
                                    <Bubble
                                      key={message.id}
                                      variant={isAdmin ? 'muted' : 'default'}
                                      align={isAdmin ? 'start' : 'end'}
                                    >
                                      <BubbleContent>
                                        {messageText(message)}
                                      </BubbleContent>
                                    </Bubble>
                                  ))}
                                  <MessageFooter>
                                    {t(
                                      `adminChat.${group[group.length - 1].timeKey}`,
                                    )}
                                  </MessageFooter>
                                </MessageContent>
                              </Message>
                            </MessageGroup>
                          </MessageScrollerItem>
                        )
                      })}
                      {messages.length === 0 && (
                        <MessageScrollerItem messageId="empty">
                          <p className="admin-chat-empty">
                            {t('adminChat.emptyConversation')}
                          </p>
                        </MessageScrollerItem>
                      )}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                </MessageScroller>
              </MessageScrollerProvider>

              <form className="admin-chat-composer" onSubmit={sendMessage}>
                <FieldGroup className="admin-chat-composer-fields">
                  <Field className="admin-chat-composer-field">
                    <FieldLabel className="sr-only" htmlFor="admin-chat-message">
                      {t('adminChat.messageLabel')}
                    </FieldLabel>
                    <Input
                      id="admin-chat-message"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder={t('adminChat.messagePlaceholder')}
                      autoComplete="off"
                    />
                  </Field>
                  <Button
                    type="submit"
                    size="icon"
                    aria-label={t('adminChat.send')}
                    disabled={!draft.trim()}
                  >
                    <Send aria-hidden="true" />
                  </Button>
                </FieldGroup>
              </form>
            </>
          ) : (
            <div className="admin-chat-thread-empty">
              <MessageCircle aria-hidden="true" />
              <p>{t('adminChat.selectConversation')}</p>
            </div>
          )}
        </Card>

        <Card className="admin-chat-details">
          {selectedUser ? (
            <>
              <CardHeader className="admin-chat-details-header">
                <Avatar aria-hidden="true">
                  <AvatarFallback>{userName(selectedUser).slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="admin-chat-details-identity">
                  <CardTitle>{t('adminChat.detailsTitle')}</CardTitle>
                  <CardDescription>{userName(selectedUser)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="admin-chat-details-content">
                <div className="admin-chat-details-badges">
                  <Badge variant="outline">
                    {t(`adminUsers.roles.${selectedUser.role}`)}
                  </Badge>
                  {statusBadge(selectedUser.status)}
                </div>

                <dl className="admin-chat-profile-details">
                  <div>
                    <dt><Mail aria-hidden="true" />{t('adminUsers.columns.email')}</dt>
                    <dd dir="ltr">{selectedUser.email}</dd>
                  </div>
                  <div>
                    <dt><Phone aria-hidden="true" />{t('adminUsers.columns.phone')}</dt>
                    <dd dir="ltr">{selectedUser.phone}</dd>
                  </div>
                  <div>
                    <dt><CalendarDays aria-hidden="true" />{t('adminUsers.columns.joined')}</dt>
                    <dd>{dateFormat.format(new Date(selectedUser.joinedAt))}</dd>
                  </div>
                  <div>
                    <dt><MessageCircle aria-hidden="true" />{t('adminChat.messageCountLabel')}</dt>
                    <dd>{numberFormat.format(messages.length)}</dd>
                  </div>
                </dl>

                <section className="admin-chat-latest-request">
                  <h3>{t('adminChat.latestRequest')}</h3>
                  {requestLoadError ? (
                    <p className="admin-chat-details-error" role="alert">
                      {t('customerService.loadError')}
                    </p>
                  ) : latestRequest ? (
                    <a
                      className="admin-chat-request-status"
                      href={`/admin/customer-service/${encodeURIComponent(latestRequest.id)}`}
                    >
                      <TicketCheck aria-hidden="true" />
                      <span className="admin-chat-request-copy">
                        <strong>{latestRequest.subject[language]}</strong>
                        <span dir="ltr">#{latestRequest.id}</span>
                      </span>
                      {requestStatusBadge(latestRequest.status)}
                    </a>
                  ) : (
                    <p className="admin-chat-details-empty">
                      {t('adminChat.noRecentRequest')}
                    </p>
                  )}
                </section>
              </CardContent>
            </>
          ) : (
            <div className="admin-chat-thread-empty">
              <TicketCheck aria-hidden="true" />
              <p>{t('adminChat.selectConversation')}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
