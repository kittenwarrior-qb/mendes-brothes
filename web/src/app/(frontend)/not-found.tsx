import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <section className="sec">
      <div className="wrap nf">
        <div aria-hidden="true" className="big">
          404
        </div>
        <h1>Page not found</h1>
        <p className="lede">The page you&apos;re looking for has moved or doesn&apos;t exist.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/">
            Back to home
          </Link>
          <Link className="btn btn-outline" href="/projects">
            See our projects
          </Link>
        </div>
      </div>
    </section>
  )
}
