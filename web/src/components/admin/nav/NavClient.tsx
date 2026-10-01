'use client'

/* eslint-disable @next/next/no-img-element */
import { Hamburger, Link, useNav, usePreferences } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

import { Icon, type IconName } from '../icons'

export type NavItem = {
  href: string
  icon: IconName
  label: string
  badge?: number
  /** only the exact path counts as "current" (used for Home) */
  exact?: boolean
  /** extra path prefixes that also mark this item as current */
  match?: string[]
  newTab?: boolean
}

type Group = { label?: string; items: NavItem[] }

const isCurrent = (item: NavItem, pathname: string) => {
  if (item.exact) return pathname === item.href
  return [item.href, ...(item.match ?? [])].some((p) => pathname.startsWith(p))
}

const Item: React.FC<{ item: NavItem; pathname: string }> = ({ item, pathname }) => {
  const current = !item.newTab && isCurrent(item, pathname)
  const className = `mb-nav__item${current ? ' mb-nav__item--current' : ''}`
  const body = (
    <>
      <Icon name={item.icon} />
      <span className="mb-nav__text">{item.label}</span>
      {item.badge ? <span className="mb-nav__badge">{item.badge}</span> : null}
    </>
  )
  return item.newTab ? (
    <a className={className} href={item.href} rel="noreferrer" target="_blank">
      {body}
    </a>
  ) : (
    <Link aria-current={current ? 'page' : undefined} className={className} href={item.href}>
      {body}
    </Link>
  )
}

export const NavClient: React.FC<{ groups: Group[]; foot: NavItem[] }> = ({ groups, foot }) => {
  const { hydrated, navOpen, navRef, setNavOpen, shouldAnimate } = useNav()
  const pathname = usePathname()
  const { getPreference } = usePreferences()

  // Payload folds the menu away on screens up to 1440px wide — most laptops. Keep it open on
  // anything bigger than a tablet unless this person closed it themselves.
  useEffect(() => {
    if (!hydrated || window.innerWidth <= 1024) return
    void getPreference<{ open?: boolean }>('nav').then((pref) => {
      if (pref?.open !== false) setNavOpen(true)
    })
  }, [hydrated, getPreference, setNavOpen])

  return (
    <aside
      className={[
        'nav',
        'mb-nav',
        navOpen && 'nav--nav-open',
        shouldAnimate && 'nav--nav-animate',
        hydrated && 'nav--nav-hydrated',
      ]
        .filter(Boolean)
        .join(' ')}
      inert={!navOpen ? true : undefined}
    >
      <div className="nav__scroll" ref={navRef}>
        <nav className="nav__wrap">
          <Link className="mb-nav__brand" href="/admin">
            <img
              alt="Mendez Brothes"
              className="mb-nav__logo mb-only-light"
              src="/brand/logo-word.webp"
            />
            <img
              alt="Mendez Brothes"
              className="mb-nav__logo mb-only-dark"
              src="/brand/logo-wordw.webp"
            />
            <span>Website admin</span>
          </Link>

          {groups.map((group, i) => (
            <div className="mb-nav__group" key={i}>
              {group.label ? <div className="mb-nav__label">{group.label}</div> : null}
              {group.items.map((item) => (
                <Item item={item} key={item.href} pathname={pathname} />
              ))}
            </div>
          ))}

          <div className="mb-nav__group mb-nav__foot">
            {foot.map((item) => (
              <Item item={item} key={item.href} pathname={pathname} />
            ))}
          </div>
        </nav>
        <div className="nav__header">
          <div className="nav__header-content">
            <button
              className="nav__mobile-close"
              onClick={() => setNavOpen(false)}
              tabIndex={!navOpen ? -1 : undefined}
              type="button"
            >
              <Hamburger isActive />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
