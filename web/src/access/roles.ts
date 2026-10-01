import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

/*
 * Three roles keep the admin simple for each kind of person:
 *  - admin:   the developer/agency — sees everything, including technical screens
 *  - manager: the business owner — content + company info, colours, menu, users, backups
 *  - editor:  staff — content only (pages, projects, news, photos, quote requests)
 */
const roleOf = (user: unknown) =>
  user && typeof user === 'object' ? (user as User).role : undefined

export const isAdminUser = (user: unknown): boolean => roleOf(user) === 'admin'

export const isManagerUser = (user: unknown): boolean =>
  roleOf(user) === 'admin' || roleOf(user) === 'manager'

/** Technical screens: developers only. */
export const adminOnly: Access = ({ req: { user } }) => isAdminUser(user)
export const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdminUser(user)

/** Business settings: owner and developers. */
export const managerOnly: Access = ({ req: { user } }) => isManagerUser(user)
export const managerOnlyField: FieldAccess = ({ req: { user } }) => isManagerUser(user)

/** Managers and admins can manage every user; editors can only read/update themselves. */
export const managerOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isManagerUser(user)) return true
  return { id: { equals: user.id } }
}

/** For `admin.hidden`: hide a screen from everyone except developers. */
export const hiddenUnlessAdmin = ({ user }: { user: unknown }) => !isAdminUser(user)
/** For `admin.hidden`: hide a screen from editors. */
export const hiddenUnlessManager = ({ user }: { user: unknown }) => !isManagerUser(user)
