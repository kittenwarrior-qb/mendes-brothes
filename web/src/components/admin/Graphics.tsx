/* eslint-disable @next/next/no-img-element */
import React from 'react'

import { Icon } from './icons'

/** Login screen logo. */
export const AdminLogo: React.FC = () => (
  <img
    src="/brand/logo-word.webp"
    alt="Mendez Brothes — website admin"
    width={234}
    height={95}
    style={{ height: 84, width: 'auto' }}
  />
)

/** "Back to Home" button at the start of the breadcrumb (the logo itself lives in the sidebar). */
export const AdminIcon: React.FC = () => <Icon name="home" size={18} />
