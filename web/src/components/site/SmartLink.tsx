import Link from 'next/link'
import React from 'react'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  newTab?: boolean | null
}

/** next/link for internal paths, plain <a> for tel:, mailto:, external and hash links. */
export const SmartLink: React.FC<Props> = ({ href, newTab, children, ...rest }) => {
  const external = /^(https?:)?\/\//.test(href)
  const tabProps = newTab || external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  if (href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link href={href} {...tabProps} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} {...tabProps} {...rest}>
      {children}
    </a>
  )
}
