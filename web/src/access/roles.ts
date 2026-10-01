import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

export const isAdminUser = (user: unknown): boolean =>
  Boolean(user && typeof user === 'object' && (user as User).role === 'admin')

/** Only administrators (site owner / agency). Editors manage content but not settings or users. */
export const adminOnly: Access = ({ req: { user } }) => isAdminUser(user)

export const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdminUser(user)

/** Admins can manage every user; editors can only read/update themselves. */
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdminUser(user)) return true
  return { id: { equals: user.id } }
}
