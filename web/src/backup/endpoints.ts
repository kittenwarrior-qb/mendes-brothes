import type { Endpoint, PayloadRequest } from 'payload'

import fs from 'fs'
import { Readable } from 'stream'

import { isManagerUser } from '../access/roles'
import { revalidateEverything } from '../hooks/revalidateSite'
import { migrations } from '../migrations'
import {
  backupBusy,
  backupPath,
  createBackup,
  deleteBackup,
  isValidBackupName,
  listBackups,
  restoreBackup,
  saveUploadedBackup,
} from './index'

const json = (data: unknown, status = 200) => Response.json(data, { status })

/** Every backup route is for managers/admins only: a backup contains the whole site, including user records. */
const guard = (req: PayloadRequest) =>
  isManagerUser(req.user) ? null : json({ error: 'Managers only.' }, req.user ? 403 : 401)

const fail = (req: PayloadRequest, err: unknown, what: string) => {
  const message = err instanceof Error ? err.message : String(err)
  req.payload.logger.error({ err, msg: `Backup: ${what} failed` })
  return json({ error: message }, 500)
}

const nameParam = (req: PayloadRequest) => {
  const name = String(req.routeParams?.name ?? '')
  return isValidBackupName(name) ? name : null
}

export const backupEndpoints: Endpoint[] = [
  {
    path: '/backups',
    method: 'get',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      return json({ backups: await listBackups(), busy: backupBusy() })
    },
  },
  {
    path: '/backups',
    method: 'post',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      try {
        const backup = await createBackup('manual', req.user?.email)
        req.payload.logger.info(`Backup created by ${req.user?.email}: ${backup.name}`)
        return json({ backup }, 201)
      } catch (err) {
        return fail(req, err, 'create')
      }
    },
  },
  {
    // raw request body = the .tar file (streamed straight to disk, any size)
    path: '/backups/upload',
    method: 'post',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      if (!req.body) return json({ error: 'No file received.' }, 400)
      try {
        const backup = await saveUploadedBackup(req.body)
        return json({ backup }, 201)
      } catch (err) {
        return fail(req, err, 'upload')
      }
    },
  },
  {
    path: '/backups/:name/download',
    method: 'get',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      const name = nameParam(req)
      if (!name || !fs.existsSync(backupPath(name))) return json({ error: 'Not found' }, 404)
      const file = backupPath(name)
      const { size } = fs.statSync(file)
      return new Response(Readable.toWeb(fs.createReadStream(file)) as ReadableStream, {
        headers: {
          'Content-Type': 'application/x-tar',
          'Content-Length': String(size),
          'Content-Disposition': `attachment; filename="${name}"`,
          'Cache-Control': 'no-store',
        },
      })
    },
  },
  {
    path: '/backups/:name/restore',
    method: 'post',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      const name = nameParam(req)
      if (!name) return json({ error: 'Not found' }, 404)
      try {
        const result = await restoreBackup(name, req.user?.email)
        if (process.env.NODE_ENV === 'production') {
          // A backup taken from a dev database carries Payload's "dev push" marker, which
          // makes the migrator stop and ask for confirmation. Remove it so this never hangs.
          await req.payload.delete({
            collection: 'payload-migrations',
            where: { batch: { equals: -1 } },
          })
          // an older backup may predate the current schema — bring it up to date
          await req.payload.db.migrate({ migrations: migrations as never })
        }
        revalidateEverything('backup restore', req.payload.logger)
        req.payload.logger.info(`Backup restored by ${req.user?.email}: ${name}`)
        return json(result)
      } catch (err) {
        return fail(req, err, 'restore')
      }
    },
  },
  {
    path: '/backups/:name',
    method: 'delete',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      const name = nameParam(req)
      if (!name) return json({ error: 'Not found' }, 404)
      await deleteBackup(name)
      return json({ deleted: name })
    },
  },
]
