'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const send = (body: Record<string, unknown>) => {
  try {
    const data = JSON.stringify(body)
    // survives the page being left (a click on a phone number or an outside link)
    if (!navigator.sendBeacon?.('/api/track', data))
      void fetch('/api/track', { method: 'POST', body: data, keepalive: true })
  } catch {
    /* statistics are never worth an error on the page */
  }
}

const clickName = (link: HTMLAnchorElement): string | null => {
  const href = link.getAttribute('href') ?? ''
  if (href.startsWith('tel:')) return 'call'
  if (href.startsWith('mailto:')) return 'email'
  if (/google\.[a-z.]+\/maps|maps\.google\.|goo\.gl\/maps|maps\.app\.goo\.gl/.test(href))
    return 'map'
  if (link.closest('.social')) return 'social'
  if (/^\/contact(\?|#|$)/.test(href) && link.classList.contains('btn')) return 'estimate'
  if (/^https?:\/\//.test(href) && new URL(href).host !== window.location.host) return 'outbound'
  return null
}

/**
 * Feeds the Statistics screen of the admin: one message per page opened and per
 * important click (phone, email, estimate button…). No cookies and no outside service;
 * the server keeps daily totals only. See src/analytics.
 */
export const Track: React.FC = () => {
  const pathname = usePathname()

  useEffect(() => {
    // the preview inside the admin is not a visit
    if (window.self !== window.top) return
    let first = false
    try {
      first = !sessionStorage.getItem('mb-visit')
      sessionStorage.setItem('mb-visit', '1')
    } catch {
      /* storage blocked: the visit is still counted, just without its source */
    }
    send({
      t: document.querySelector('.nf') ? '404' : 'view',
      p: pathname,
      ...(first ? { first: true, r: document.referrer } : {}),
    })
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a')
      const name = link ? clickName(link) : null
      if (name) send({ t: 'click', n: name, p: window.location.pathname })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
