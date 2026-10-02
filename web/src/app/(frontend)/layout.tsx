import type { Metadata, Viewport } from 'next'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import Script from 'next/script'
import { getPayload } from 'payload'
import React from 'react'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { BackToTop, RevealOnScroll } from '@/components/site/ClientHelpers'
import { Track } from '@/components/site/Track'
import { businessSchema, JsonLd } from '@/components/site/JsonLd'
import { SmartLink } from '@/components/site/SmartLink'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { preloadFile } from '@/theme/fonts'
import { resolveTheme, themeToCss } from '@/theme/resolve'
import { getGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { asMedia, telHref } from '@/utilities/site'
import { cn } from '@/utilities/ui'

import '@/theme/fonts.css'
import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const [settings, themeGlobal] = await Promise.all([
    getGlobal('site-settings', 1),
    getGlobal('theme', 0),
  ])
  const theme = resolveTheme(themeGlobal)

  const payload = await getPayload({ config: configPromise })
  const areas = await payload.find({
    collection: 'service-areas',
    limit: 50,
    depth: 0,
    select: { name: true },
    pagination: false,
  })

  const ann = settings.announcement
  const callBar = settings.mobileCallBar && settings.phone

  return (
    <html
      className={cn(!theme.stickyHeader && 'no-sticky')}
      data-scheme={theme.colorScheme}
      lang="en"
    >
      <head>
        {[
          ...new Set([preloadFile[theme.fontDisplay].display, preloadFile[theme.fontBody].body]),
        ].map((file) => (
          <link
            as="font"
            crossOrigin="anonymous"
            href={`/fonts/${file}`}
            key={file}
            rel="preload"
            type="font/woff2"
          />
        ))}
        <style dangerouslySetInnerHTML={{ __html: themeToCss(theme) }} id="theme-vars" />
        <JsonLd
          data={businessSchema(
            settings,
            areas.docs.map((a) => a.name),
          )}
        />
      </head>
      <body className={cn('site', callBar && 'has-callbar')}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {isEnabled ? <LivePreviewListener /> : null}
        {isEnabled ? (
          <div className="announce" role="status">
            You are viewing a draft preview.
            {/* route handler, not a page: needs a full request */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/next/exit-preview">Exit preview</a>
          </div>
        ) : null}
        {ann?.enabled && ann.text ? (
          <div className="announce" role="note">
            {ann.text}
            {ann.linkLabel && ann.linkUrl ? (
              <SmartLink href={ann.linkUrl}>{ann.linkLabel} →</SmartLink>
            ) : null}
          </div>
        ) : null}
        <Header theme={theme} />
        <main id="main">{children}</main>
        <Footer theme={theme} />
        {callBar ? (
          <a className="callbar" href={telHref(settings.phone)}>
            <svg
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
            Call now · {settings.phone}
          </a>
        ) : null}
        <Track />
        {settings.backToTop ? <BackToTop /> : null}
        {theme.animations ? <RevealOnScroll /> : null}
        {settings.plausibleDomain ? (
          <Script
            data-domain={settings.plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        {settings.gaId && /^G-[A-Z0-9]+$/i.test(settings.gaId) ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${settings.gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobal('site-settings', 1)
  const favicon = asMedia(settings.favicon) || asMedia(settings.logoMark)
  const og = asMedia(settings.defaultOgImage)
  const title = settings.companyName || 'Website'
  return {
    metadataBase: new URL(getServerSideURL()),
    title: { default: title, template: `%s${settings.titleSuffix ?? ''}` },
    description: settings.description || undefined,
    icons: favicon?.url
      ? {
          icon: getMediaUrl(favicon.url, favicon.updatedAt),
          apple: getMediaUrl(favicon.url, favicon.updatedAt),
        }
      : { icon: '/favicon.ico' },
    openGraph: mergeOpenGraph({
      siteName: title,
      images: og?.url ? [{ url: og.sizes?.og?.url || og.url }] : undefined,
    }),
    twitter: { card: 'summary_large_image' },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}
