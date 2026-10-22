import { useState, type FormEvent } from 'react'
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
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller'

type ChatContact = {
  id: string
  nameKey: string
  cityKey: string
  initialsKey: string
}

type ChatMessage = {
  id: number
  sender: 'supplier' | 'customer'
  text: string
  time: string
}

const contacts: ChatContact[] = [
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

export function ChatPage() {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'
  const [selectedContactId, setSelectedContactId] = useState(contacts[0].id)
  const [draft, setDraft] = useState('')
  const [messagesByContact, setMessagesByContact] = useState<Record<string, ChatMessage[]>>({
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
  })
  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) ?? contacts[0]
  const messages = messagesByContact[selectedContact.id] ?? []
  const messageGroups = messages.reduce<ChatMessage[][]>((groups, message) => {
    const currentGroup = groups[groups.length - 1]
    if (currentGroup && currentGroup[0].sender === message.sender) {
      currentGroup.push(message)
    } else {
      groups.push([message])
    }
    return groups
  }, [])

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    setMessagesByContact((current) => ({
      ...current,
      [selectedContact.id]: [
        ...(current[selectedContact.id] ?? []),
        {
          id: Date.now(),
          sender: 'supplier',
          text,
          time: t('supplierChat.justNow'),
        },
      ],
    }))
    setDraft('')
  }

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
          {contacts.map((contact) => {
            const name = t(`supplierChat.contacts.${contact.nameKey}`)
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
                    {t(`supplierChat.contacts.${contact.initialsKey}`)}
                  </AvatarFallback>
                </Avatar>
                <span className="supplier-chat-contact-copy">
                  <span className="supplier-chat-contact-name">{name}</span>
                  <span className="supplier-chat-contact-location">
                    <MapPin aria-hidden="true" />
                    {t(`supplierChat.cities.${contact.cityKey}`)}
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
              {t(`supplierChat.contacts.${selectedContact.initialsKey}`)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{t(`supplierChat.contacts.${selectedContact.nameKey}`)}</CardTitle>
            <p className="supplier-chat-contact-location">
              <MapPin aria-hidden="true" />
              {t(`supplierChat.cities.${selectedContact.cityKey}`)}
            </p>
          </div>
        </CardHeader>

        <MessageScrollerProvider autoScroll key={selectedContact.id}>
          <MessageScroller className="supplier-chat-scroller">
            <MessageScrollerViewport>
              <MessageScrollerContent className="supplier-chat-message-content">
                <MessageScrollerItem messageId="today">
                  <Marker variant="separator">
                    <MarkerContent>{t('supplierChat.today')}</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
                {messageGroups.map((group) => {
                  const sender = group[0].sender
                  const isSupplier = sender === 'supplier'
                  return (
                    <MessageScrollerItem
                      key={group[0].id}
                      messageId={String(group[0].id)}
                      scrollAnchor={isSupplier}
                    >
                      <MessageGroup>
                        <Message align={isSupplier ? 'start' : 'end'}>
                          <MessageContent>
                            <MessageHeader>
                              {t(isSupplier ? 'supplierChat.you' : `supplierChat.contacts.${selectedContact.nameKey}`)}
                            </MessageHeader>
                            {group.map((message) => (
                              <Bubble
                                key={message.id}
                                variant={isSupplier ? 'muted' : 'default'}
                                align={isSupplier ? 'start' : 'end'}
                              >
                                <BubbleContent>{message.text}</BubbleContent>
                              </Bubble>
                            ))}
                            <MessageFooter>{group[group.length - 1].time}</MessageFooter>
                          </MessageContent>
                        </Message>
                      </MessageGroup>
                    </MessageScrollerItem>
                  )
                })}
                {messages.length === 0 && (
                  <MessageScrollerItem messageId="empty">
                    <p className="supplier-chat-empty">{t('supplierChat.emptyConversation')}</p>
                  </MessageScrollerItem>
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>

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
