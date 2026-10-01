/** Next.js server start-up hook. */
export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PHASE !== 'phase-production-build'
  ) {
    const { startBackupScheduler } = await import('./backup/scheduler')
    startBackupScheduler()
  }
}
