import { useEffect, useRef, useState, type FormEvent } from 'react'
import { MapPin, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Bubble,
  BubbleContent,
} from '@/components/ui/bubble'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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

export type ChatContact = {
  name?: string
  city?: string
  initials?: string
  id: string
  nameKey?: string
  cityKey?: string
  initialsKey?: string
}

type ChatMessage = {
  id: number
  sender: 'supplier' | 'customer'
  text: string
  time: string
}

const EMPTY_MESSAGES: ChatMessage[] = []

// MOCK CONTACTS: original supplier demo data.
const defaultContacts: ChatContact[] = [
  {
    id: 'layali-sweets',
    nameKey: 'layaliSweets',
    cityKey: 'riyadh',
    initialsKey: 'layaliInitial',
  },
  {
    id: 'rosa-cafe',
    nameKey: 'rosaCafe',
    cityKey: 'riyadh',
    initialsKey: 'rosaInitial',
  },
  {
    id: 'dallah-cafe',
    nameKey: 'dallahCafe',
    cityKey: 'jeddah',
    initialsKey: 'dallahInitial',
  },
  {
    id: 'saha-restaurant',
    nameKey: 'sahaRestaurant',
    cityKey: 'riyadh',
    initialsKey: 'sahaInitial',
  },
]

type ChatPanelProps = {
  contacts?: ChatContact[]
  viewer?: 'supplier' | 'customer'
  contactQuery?: string
}

export function ChatPanel({ contacts = defaultContacts, viewer = 'supplier', contactQuery = '' }: ChatPanelProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id ?? '')
  const [draft, setDraft] = useState('')
  const [messagesByContact, setMessagesByContact] = useState<Record<string, ChatMessage[]>>(viewer === 'supplier' ? {
    'layali-sweets': [
      {
        id: 1,
        sender: 'supplier',
        text: t('supplierChat.sampleGreeting'),
        time: t('supplierChat.sampleTime'),
      },
      {
        id: 2,
        sender: 'customer',
        text: t('supplierChat.sampleRequest'),
        time: t('supplierChat.sampleTime'),
      },
    ],
  } : {})
  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) ?? contacts[0]
  const messages = selectedContact ? messagesByContact[selectedContact.id] ?? EMPTY_MESSAGES : EMPTY_MESSAGES
  const threadRef = useRef<HTMLDivElement>(null)
  const messageGroups = messages.reduce<ChatMessage[][]>((groups, message) => {
    const currentGroup = groups[groups.length - 1]
    if (currentGroup && currentGroup[0].sender === message.sender) {
      currentGroup.push(message)
    } else {
      groups.push([message])
    }
    return groups
  }, [])

  useEffect(() => {
    const thread = threadRef.current
    if (thread) thread.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' })
  }, [messages])

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !selectedContact) return

    setMessagesByContact((current) => ({
      ...current,
      [selectedContact.id]: [
        ...(current[selectedContact.id] ?? []),
        {
          id: Date.now(),
          sender: viewer,
          text,
          time: t('supplierChat.justNow'),
        },
      ],
    }))
    setDraft('')
  }

  if (!selectedContact) return null

  return (
    <section
      className="supplier-chat-layout"
      aria-label={t('supplierChat.title')}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Card className="supplier-chat-conversations">
        <CardHeader>
          <CardTitle>{t('supplierChat.title')}</CardTitle>
        </CardHeader>
        <CardContent className="supplier-chat-contact-list">
          {contacts.filter((contact) => (contact.name ?? t(`supplierChat.contacts.${contact.nameKey}`)).toLocaleLowerCase().includes(contactQuery.trim().toLocaleLowerCase())).map((contact) => {
            const name = contact.name ?? t(`supplierChat.contacts.${contact.nameKey}`)
            const latestMessage = messagesByContact[contact.id]?.at(-1)

            return (
              <Button
                key={contact.id}
                className="supplier-chat-contact"
                variant={selectedContact.id === contact.id ? 'secondary' : 'ghost'}
                aria-pressed={selectedContact.id === contact.id}
                onClick={() => setSelectedContactId(contact.id)}
              >
                <Avatar aria-hidden="true">
                  <AvatarFallback>
                    {contact.initials ?? t(`supplierChat.contacts.${contact.initialsKey}`)}
                  </AvatarFallback>
                </Avatar>
                <span className="supplier-chat-contact-copy">
                  <span className="supplier-chat-contact-name">{name}</span>
                  <span className="supplier-chat-contact-location">
                    <MapPin aria-hidden="true" />
                    {contact.city ?? t(`supplierChat.cities.${contact.cityKey}`)}
                  </span>
                  {latestMessage && (
                    <span className="supplier-chat-contact-preview">{latestMessage.text}</span>
                  )}
                </span>
              </Button>
            )
          })}
        </CardContent>
      </Card>

      <Card className="supplier-chat-thread">
        <CardHeader className="supplier-chat-thread-header">
          <Avatar aria-hidden="true">
            <AvatarFallback>
              {selectedContact.initials ?? t(`supplierChat.contacts.${selectedContact.initialsKey}`)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{selectedContact.name ?? t(`supplierChat.contacts.${selectedContact.nameKey}`)}</CardTitle>
            <p className="supplier-chat-contact-location">
              <MapPin aria-hidden="true" />
              {selectedContact.city ?? t(`supplierChat.cities.${selectedContact.cityKey}`)}
            </p>
          </div>
        </CardHeader>

        <div className="supplier-chat-scroller" ref={threadRef} role="log" aria-live="polite">
          <div className="supplier-chat-message-content">
                <div data-message-id="today">
                  <Marker variant="separator">
                    <MarkerContent>{t('supplierChat.today')}</MarkerContent>
                  </Marker>
                </div>
                {messageGroups.map((group) => {
                  const sender = group[0].sender
                  const isOwnMessage = sender === viewer
                  return (
                    <div
                      key={group[0].id}
                      data-message-id={String(group[0].id)}
                      data-scroll-anchor={isOwnMessage}
                    >
                      <MessageGroup>
                        <Message align={isOwnMessage ? 'start' : 'end'}>
                          <MessageContent>
                            <MessageHeader>
                              {isOwnMessage ? t('supplierChat.you') : selectedContact.name ?? t(`supplierChat.contacts.${selectedContact.nameKey}`)}
                            </MessageHeader>
                            {group.map((message) => (
                              <Bubble
                                key={message.id}
                                variant={isOwnMessage ? 'muted' : 'default'}
                                align={isOwnMessage ? 'start' : 'end'}
                              >
                                <BubbleContent>{message.text}</BubbleContent>
                              </Bubble>
                            ))}
                            <MessageFooter>{group[group.length - 1].time}</MessageFooter>
                          </MessageContent>
                        </Message>
                      </MessageGroup>
                    </div>
                  )
                })}
                {messages.length === 0 && (
                  <div data-message-id="empty">
                    <p className="supplier-chat-empty">{t('supplierChat.emptyConversation')}</p>
                  </div>
                )}
          </div>
        </div>

        <form className="supplier-chat-composer" onSubmit={sendMessage}>
          <FieldGroup className="supplier-chat-composer-fields">
            <Field className="supplier-chat-composer-field">
              <FieldLabel className="sr-only" htmlFor="supplier-chat-message">
                {t('supplierChat.messageLabel')}
              </FieldLabel>
              <Input
                id="supplier-chat-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t('supplierChat.messagePlaceholder')}
                autoComplete="off"
              />
            </Field>
            <Button
              type="submit"
              size="icon"
              aria-label={t('supplierChat.send')}
              disabled={!draft.trim()}
            >
              <Send aria-hidden="true" />
            </Button>
          </FieldGroup>
        </form>
      </Card>

    </section>
  )
}
