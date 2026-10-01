/**
 * Site backups: one `.tar` file holding the database dump and every uploaded
 * file. Created on demand from the admin (Backups screen), on a schedule, and
 * automatically before each restore.
 *
 *   backup-YYYYMMDD-HHMMSS-<type>.tar
 *   ├─ manifest.json
 *   ├─ db.dump            (pg_dump custom format — already compressed)
 *   └─ media/…            (uploads; images are already compressed, so no gzip)
 *
 * pg_dump / pg_restore run as child processes with an argument array (no shell),
 * so the web server stays responsive and nothing is interpolated into a command.
 */
import { spawn } from 'child_process'
import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'
import * as tar from 'tar'

import { MEDIA_DIR } from '../collections/Media'

export const BACKUP_DIR = process.env.BACKUP_DIR || path.resolve(process.cwd(), 'backups')

export type BackupType = 'manual' | 'auto' | 'pre-restore' | 'uploaded'
export type BackupInfo = { name: string; size: number; createdAt: string; type: BackupType }

const NAME_RE = /^backup-\d{8}-\d{6}-(manual|auto|pre-restore|uploaded)\.tar$/

/** Only names we generated are ever turned into paths — no traversal possible. */
export const isValidBackupName = (name: string) => NAME_RE.test(name)

export const backupPath = (name: string) => {
  if (!isValidBackupName(name)) throw new Error('Invalid backup name')
  return path.join(BACKUP_DIR, name)
}

const stamp = (d = new Date()) => {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}-${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`
}

const run = (cmd: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    child.stderr.on('data', (d) => (err = (err + d).slice(-4000)))
    child.on('error', (e) =>
      reject(
        new Error(
          (e as NodeJS.ErrnoException).code === 'ENOENT'
            ? `${cmd} is not installed on the server (PostgreSQL client tools are required)`
            : e.message,
        ),
      ),
    )
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} failed: ${err.trim() || `exit ${code}`}`)),
    )
  })

const databaseUrl = () => {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return url
}

// One backup/restore at a time (they are I/O heavy).
let busy: null | string = null
const exclusive = async <T>(what: string, fn: () => Promise<T>): Promise<T> => {
  if (busy) throw new Error(`Another operation is running (${busy}). Try again in a minute.`)
  busy = what
  try {
    return await fn()
  } finally {
    busy = null
  }
}
export const backupBusy = () => busy

export const listBackups = async (): Promise<BackupInfo[]> => {
  await fsp.mkdir(BACKUP_DIR, { recursive: true })
  const names = (await fsp.readdir(BACKUP_DIR)).filter(isValidBackupName)
  const items = await Promise.all(
    names.map(async (name) => {
      const st = await fsp.stat(path.join(BACKUP_DIR, name))
      return {
        name,
        size: st.size,
        createdAt: st.mtime.toISOString(),
        type: name.match(NAME_RE)![1] as BackupType,
      }
    }),
  )
  return items.sort((a, b) => b.name.localeCompare(a.name))
}

const createUnlocked = async (type: BackupType, createdBy?: string): Promise<BackupInfo> => {
  await fsp.mkdir(BACKUP_DIR, { recursive: true })
  const name = `backup-${stamp()}-${type}.tar`
  const file = path.join(BACKUP_DIR, name)
  const tmp = await fsp.mkdtemp(path.join(BACKUP_DIR, '.tmp-'))
  try {
    await run('pg_dump', [
      '--format=custom',
      '--no-owner',
      '--no-privileges',
      `--file=${path.join(tmp, 'db.dump')}`,
      `--dbname=${databaseUrl()}`,
    ])
    await fsp.mkdir(MEDIA_DIR, { recursive: true })
    const mediaFiles = (await fsp.readdir(MEDIA_DIR)).length
    await fsp.writeFile(
      path.join(tmp, 'manifest.json'),
      JSON.stringify(
        {
          app: 'mendez-web',
          formatVersion: 1,
          createdAt: new Date().toISOString(),
          type,
          createdBy: createdBy ?? null,
          mediaDir: path.basename(MEDIA_DIR),
          mediaFiles,
        },
        null,
        2,
      ),
    )
    // write to a temp name first so a half-written file is never listed
    const partial = `${file}.partial`
    await tar.create({ file: partial, cwd: tmp }, ['manifest.json', 'db.dump'])
    await tar.replace({ file: partial, cwd: path.dirname(MEDIA_DIR) }, [path.basename(MEDIA_DIR)])
    await fsp.rename(partial, file)
    const st = await fsp.stat(file)
    return { name, size: st.size, createdAt: st.mtime.toISOString(), type }
  } finally {
    await fsp.rm(tmp, { recursive: true, force: true })
    await fsp.rm(`${file}.partial`, { force: true })
  }
}

export const createBackup = (type: BackupType = 'manual', createdBy?: string) =>
  exclusive('backup', () => createUnlocked(type, createdBy))

export const deleteBackup = async (name: string) => {
  await fsp.rm(backupPath(name), { force: true })
}

/** Keep the newest `keep` automatic backups; manual ones are never pruned. */
export const pruneAutoBackups = async (keep: number) => {
  const autos = (await listBackups()).filter((b) => b.type === 'auto')
  for (const b of autos.slice(Math.max(keep, 1))) await deleteBackup(b.name)
}

/** Checks an uploaded archive really is one of ours before it can be restored. */
export const inspectBackup = async (file: string) => {
  const entries: string[] = []
  await tar.list({ file, onReadEntry: (e) => void (entries.length < 50 && entries.push(e.path)) })
  return entries.includes('manifest.json') && entries.includes('db.dump')
}

export const saveUploadedBackup = async (body: ReadableStream<Uint8Array>): Promise<BackupInfo> => {
  await fsp.mkdir(BACKUP_DIR, { recursive: true })
  const name = `backup-${stamp()}-uploaded.tar`
  const file = path.join(BACKUP_DIR, name)
  const partial = `${file}.partial`
  try {
    const { Readable } = await import('stream')
    const { pipeline } = await import('stream/promises')
    await pipeline(Readable.fromWeb(body as never), fs.createWriteStream(partial))
    if (!(await inspectBackup(partial).catch(() => false))) {
      throw new Error('This file is not a valid site backup.')
    }
    await fsp.rename(partial, file)
  } finally {
    await fsp.rm(partial, { force: true })
  }
  const st = await fsp.stat(file)
  return { name, size: st.size, createdAt: st.mtime.toISOString(), type: 'uploaded' }
}

/**
 * Replaces the database and all uploads with the contents of a backup.
 * A "pre-restore" backup of the current state is taken first, so a restore can
 * always be undone.
 */
export const restoreBackup = (name: string, by?: string) =>
  exclusive('restore', async () => {
    const file = backupPath(name)
    if (!fs.existsSync(file)) throw new Error('Backup not found')
    const safety = await createUnlocked('pre-restore', by)

    const tmp = await fsp.mkdtemp(path.join(BACKUP_DIR, '.tmp-'))
    try {
      // node-tar refuses absolute paths and ".." entries by default
      await tar.extract({ file, cwd: tmp })
      const manifest = JSON.parse(await fsp.readFile(path.join(tmp, 'manifest.json'), 'utf8'))
      if (manifest.app !== 'mendez-web') throw new Error('This backup belongs to another site.')

      await run('pg_restore', [
        '--clean',
        '--if-exists',
        '--no-owner',
        '--no-privileges',
        '--single-transaction',
        `--dbname=${databaseUrl()}`,
        path.join(tmp, 'db.dump'),
      ])

      const extractedMedia = path.join(tmp, manifest.mediaDir || 'media')
      await fsp.mkdir(MEDIA_DIR, { recursive: true })
      for (const entry of await fsp.readdir(MEDIA_DIR)) {
        await fsp.rm(path.join(MEDIA_DIR, entry), { recursive: true, force: true })
      }
      if (fs.existsSync(extractedMedia)) {
        await fsp.cp(extractedMedia, MEDIA_DIR, { recursive: true })
      }
      return { restored: name, safetyBackup: safety.name }
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true })
    }
  })
