import config from '@payload-config'
import { getPayload } from 'payload'

import { createBackup, listBackups, pruneAutoBackups } from './index'

const HOUR = 60 * 60 * 1000
const period = { daily: 24 * HOUR, weekly: 7 * 24 * HOUR }

/**
 * Checks every 30 minutes whether an automatic backup is due (Backup settings
 * in the admin). Runs inside the web server process — no cron or extra
 * container to set up. Timers are unref'd so they never keep the process alive.
 */
export const startBackupScheduler = () => {
  const tick = async () => {
    try {
      const payload = await getPayload({ config })
      const settings = await payload.findGlobal({ slug: 'backup-settings' })
      if (!settings.autoEnabled) return

      const newest = (await listBackups()).find((b) => b.type === 'auto')
      const every = period[settings.frequency === 'weekly' ? 'weekly' : 'daily']
      // small tolerance so a daily backup doesn't drift later each day
      if (newest && Date.now() - new Date(newest.createdAt).getTime() < every - 20 * 60 * 1000)
        return

      const backup = await createBackup('auto')
      await pruneAutoBackups(settings.keep ?? 7)
      payload.logger.info(`Automatic backup created: ${backup.name}`)
    } catch (err) {
      console.error('[backup scheduler]', err instanceof Error ? err.message : err)
    }
  }

  setTimeout(tick, 2 * 60 * 1000).unref()
  setInterval(tick, 30 * 60 * 1000).unref()
}
