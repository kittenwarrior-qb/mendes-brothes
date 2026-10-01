'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

/** Floating "back to top" button, shown after scrolling one screen. */
export const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      aria-label="Back to top"
      className={`to-top${show ? ' show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      tabIndex={show ? 0 : -1}
      type="button"
    >
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
        viewBox="0 0 24 24"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}

/**
 * Adds `.in` to `.reveal` elements as they scroll into view. Re-scans on every
 * client navigation. Content stays visible without JS (the `anim` class that
 * hides it is only added by this component).
 */
export const RevealOnScroll: React.FC = () => {
  const pathname = usePathname()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('anim')
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => {
      // anything already on screen is shown immediately (no flash on load)
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in')
      else io.observe(el)
    })
    return () => io.disconnect()
  }, [pathname])
  return null
}
