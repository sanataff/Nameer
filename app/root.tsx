import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import { DirectionProvider } from './server/src/components/ui/direction'
import './server/src/i18n'
import '../src/index.css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <title>Nameer</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage?.split('-')[0] ?? 'ar'
  const direction = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
  }, [direction, language])

  return (
    <DirectionProvider direction={direction}>
      <Outlet />
    </DirectionProvider>
  )
}

export function HydrateFallback() {
  return <main className="auth-page" aria-busy="true" />
}
