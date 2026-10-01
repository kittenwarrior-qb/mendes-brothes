'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import { SmartLink } from '@/components/site/SmartLink'
import { cn } from '@/utilities/ui'

export type NavItem = { href: string; label: string; newTab?: boolean; children?: NavItem[] }

type Props = {
  nav: NavItem[]
  name: string
  logo?: { src: string; width: number; height: number }
  logoHeight: number
  phone?: string
  phoneHref?: string
  ctaLabel?: string
  ctaUrl?: string
  sticky: boolean
  variant: 'light' | 'dark' | 'brand'
}

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

export const HeaderClient: React.FC<Props> = ({
  nav,
  name,
  logo,
  logoHeight,
  phone,
  phoneHref,
  ctaLabel,
  ctaUrl,
  sticky,
  variant,
}) => {
  const pathname = usePathname()
  // The menu remembers the path it was opened on, so it closes itself on navigation.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname

  return (
    <header
      className={cn('site-header', sticky && 'is-sticky', variant !== 'light' && `hdr-${variant}`)}
      style={{ ['--logo-h' as string]: `${logoHeight}px` }}
    >
      <nav aria-label="Main" className="wrap nav">
        <Link aria-label={`${name}, home`} className="brand" href="/">
          {logo ? (
            <Image
              alt={name}
              height={logo.height}
              priority
              src={logo.src}
              width={logo.width}
              unoptimized={logo.src.endsWith('.svg')}
            />
          ) : (
            <span>{name}</span>
          )}
        </Link>
        <ul className={cn('nav-links', open && 'open')} id="navLinks">
          {nav.map((item) => (
            <li key={item.href + item.label}>
              <SmartLink
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                href={item.href}
                newTab={item.newTab}
              >
                {item.label}
              </SmartLink>
              {item.children && item.children.length > 0 ? (
                <ul className="nav-sub">
                  {item.children.map((c) => (
                    <li key={c.href + c.label}>
                      <SmartLink
                        aria-current={pathname === c.href ? 'page' : undefined}
                        href={c.href}
                        newTab={c.newTab}
                      >
                        {c.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
          {ctaLabel && ctaUrl ? (
            <li className="hide-desktop">
              <SmartLink href={ctaUrl}>{ctaLabel}</SmartLink>
            </li>
          ) : null}
        </ul>
        <div className="hdr-actions">
          {ctaLabel && ctaUrl ? (
            <SmartLink className="btn btn-outline hdr-cta" href={ctaUrl}>
              {ctaLabel}
            </SmartLink>
          ) : null}
          {phone && phoneHref ? (
            <a aria-label={`Call ${phone}`} className="btn hdr-call" href={phoneHref}>
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
              <span>{phone}</span>
            </a>
          ) : null}
          {nav.length > 0 ? (
            <button
              aria-controls="navLinks"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="menu-btn"
              onClick={() => setOpenOn(open ? null : pathname)}
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  )
}
