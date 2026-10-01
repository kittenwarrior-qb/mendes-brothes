import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Img } from '@/components/site/Img'
import { SocialIcon, socialLabel } from '@/components/site/SocialIcon'
import type { ResolvedTheme } from '@/theme/resolve'
import { getGlobal } from '@/utilities/getGlobals'
import { cn } from '@/utilities/ui'
import { telHref } from '@/utilities/site'

export async function Footer({ theme }: { theme: ResolvedTheme }) {
  const [footer, settings] = await Promise.all([
    getGlobal('footer', 1),
    getGlobal('site-settings', 1),
  ])
  const dark = theme.footerStyle === 'dark' || theme.colorScheme === 'dark'
  const logo = dark ? settings.logoOnDark || settings.logo : settings.logo

  const services = footer.showServices
    ? (
        await (
          await getPayload({ config: configPromise })
        ).find({
          collection: 'services',
          where: { showInFooter: { equals: true } },
          sort: 'order',
          limit: 8,
          depth: 0,
          select: { title: true, slug: true },
        })
      ).docs
    : []

  const columns = footer.columns ?? []
  const colCount = columns.length + (services.length ? 1 : 0) + (footer.showContact ? 1 : 0)
  const a = settings.address

  return (
    <footer className={cn('site-footer', dark && 'ft-dark')}>
      <div className="wrap">
        <div className="fgrid" style={{ ['--fcols' as string]: Math.max(colCount, 1) }}>
          <div>
            <Link aria-label={`${settings.companyName}, home`} className="f-logo" href="/">
              {logo ? <Img media={logo} sizes="200px" /> : <b>{settings.companyName}</b>}
            </Link>
            {settings.description ? <p className="f-about">{settings.description}</p> : null}
            {settings.socials?.length ? (
              <div className="social">
                {settings.socials.map((s) => (
                  <a
                    aria-label={socialLabel[s.platform] ?? s.platform}
                    href={s.url}
                    key={s.id ?? s.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          {columns.map((col) => (
            <div key={col.id ?? col.title}>
              <h2 className="f-title">{col.title}</h2>
              <ul>
                {(col.navItems ?? []).map((item, i) => (
                  <li key={i}>
                    <CMSLink {...item.link} appearance="inline" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {services.length ? (
            <div>
              <h2 className="f-title">{footer.servicesTitle || 'Services'}</h2>
              <ul>
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.slug}`}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {footer.showContact ? (
            <div>
              <h2 className="f-title">Contact</h2>
              <ul>
                {settings.phone ? (
                  <li>
                    <a href={telHref(settings.phone)}>{settings.phone}</a>
                  </li>
                ) : null}
                {settings.email ? (
                  <li>
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </li>
                ) : null}
                {a?.street ? <li>{a.street}</li> : null}
                {a?.city ? (
                  <li>
                    {[a.city, [a.state, a.zip].filter(Boolean).join(' ')]
                      .filter(Boolean)
                      .join(', ')}
                  </li>
                ) : null}
                {settings.hours ? <li>{settings.hours}</li> : null}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="fbottom">
          <span>
            © {new Date().getFullYear()} {settings.companyName}
            {settings.licenseNumber ? ` · ${settings.licenseNumber}` : ''}
          </span>
          {footer.legalLinks?.length ? (
            <nav aria-label="Legal">
              {footer.legalLinks.map((l, i) => (
                <CMSLink key={i} {...l.link} appearance="inline" />
              ))}
            </nav>
          ) : null}
          {footer.bottomText ? <span>{footer.bottomText}</span> : null}
        </div>
      </div>
      {/* oversized wordmark: decorative, clipped by the footer edge */}
      <div aria-hidden="true" className="f-word">
        {settings.shortName || settings.companyName}
      </div>
    </footer>
  )
}
