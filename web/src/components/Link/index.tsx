import React from 'react'

import { SmartLink } from '@/components/site/SmartLink'
import { cn } from '@/utilities/ui'
import { docPath } from '@/utilities/docPath'

type Reference = {
  relationTo: string
  value: { slug?: string | null } | string | number
}

export type CMSLinkType = {
  appearance?: 'inline' | 'default' | 'outline' | 'link' | 'white' | null
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: Reference | null
  size?: unknown
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const resolveLinkHref = ({
  type,
  reference,
  url,
}: Pick<CMSLinkType, 'type' | 'reference' | 'url'>) =>
  type === 'reference' && reference && typeof reference.value === 'object'
    ? docPath(reference.relationTo, reference.value.slug)
    : url || null

const appearanceClass: Record<string, string> = {
  default: 'btn btn-primary',
  outline: 'btn btn-outline',
  white: 'btn btn-white',
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const { appearance = 'inline', children, className, label, newTab } = props
  const href = resolveLinkHref(props)
  if (!href) return null

  return (
    <SmartLink
      className={cn(appearance ? appearanceClass[appearance] : undefined, className)}
      href={href}
      newTab={newTab}
    >
      {label}
      {children}
    </SmartLink>
  )
}
