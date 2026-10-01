import React from 'react'

import { resolveLinkHref } from '@/components/Link'
import { getGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { asMedia, telHref } from '@/utilities/site'
import type { ResolvedTheme } from '@/theme/resolve'

import { HeaderClient, type LogoImage, type NavItem } from './Component.client'

const toLogo = (m: unknown): LogoImage | undefined => {
  const media = asMedia(m)
  return media?.url
    ? {
        src: getMediaUrl(media.url, media.updatedAt),
        width: media.width ?? 468,
        height: media.height ?? 190,
      }
    : undefined
}

export async function Header({ theme }: { theme: ResolvedTheme }) {
  const [header, settings] = await Promise.all([
    getGlobal('header', 1),
    getGlobal('site-settings', 1),
  ])

  const toItem = (
    link: Parameters<typeof resolveLinkHref>[0] & {
      label?: string | null
      newTab?: boolean | null
    },
  ) => {
    const href = resolveLinkHref(link)
    return href && link.label ? { href, label: link.label, newTab: Boolean(link.newTab) } : null
  }

  const nav: NavItem[] = (header.navItems ?? [])
    .map((item) => {
      const top = toItem(item.link)
      if (!top) return null
      const children = (item.children ?? []).map((c) => toItem(c.link)).filter(Boolean) as NavItem[]
      return { ...top, children }
    })
    .filter(Boolean) as NavItem[]

  // A dark page palette or a dark/brand header always needs the light-on-dark logo.
  const alwaysDark = theme.headerStyle !== 'light' || theme.colorScheme === 'dark'

  return (
    <HeaderClient
      alwaysDark={alwaysDark}
      ctaLabel={header.ctaLabel ?? undefined}
      ctaUrl={header.ctaUrl ?? undefined}
      logo={toLogo(settings.logo)}
      logoHeight={settings.logoHeight ?? 44}
      logoOnDark={toLogo(settings.logoOnDark) ?? toLogo(settings.logo)}
      name={settings.companyName}
      nav={nav}
      phone={header.showPhone !== false ? (settings.phone ?? undefined) : undefined}
      phoneHref={telHref(settings.phone)}
      sticky={theme.stickyHeader}
      variant={theme.headerStyle}
    />
  )
}
