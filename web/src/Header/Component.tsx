import React from 'react'

import { resolveLinkHref } from '@/components/Link'
import { getGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { asMedia, telHref } from '@/utilities/site'
import type { ResolvedTheme } from '@/theme/resolve'

import { HeaderClient, type NavItem } from './Component.client'

export async function Header({ theme }: { theme: ResolvedTheme }) {
  const [header, settings] = await Promise.all([
    getGlobal('header', 1),
    getGlobal('site-settings', 1),
  ])

  const onDark = theme.headerStyle !== 'light' || theme.colorScheme === 'dark'
  const logo = asMedia(onDark ? settings.logoOnDark || settings.logo : settings.logo)

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

  return (
    <HeaderClient
      ctaLabel={header.ctaLabel ?? undefined}
      ctaUrl={header.ctaUrl ?? undefined}
      logo={
        logo?.url
          ? {
              src: getMediaUrl(logo.url, logo.updatedAt),
              width: logo.width ?? 468,
              height: logo.height ?? 190,
            }
          : undefined
      }
      logoHeight={settings.logoHeight ?? 44}
      name={settings.companyName}
      nav={nav}
      phone={header.showPhone !== false ? (settings.phone ?? undefined) : undefined}
      phoneHref={telHref(settings.phone)}
      sticky={theme.stickyHeader}
      variant={theme.headerStyle}
    />
  )
}
