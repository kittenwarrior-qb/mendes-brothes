import { revalidatePath } from 'next/cache'
import { timingSafeEqual } from 'crypto'

/**
 * POST /next/revalidate with header `x-revalidate-secret: $CRON_SECRET`.
 * Marks every cached page stale. Called by the Docker entrypoint on boot
 * (the image contains pages rendered at build time) and after CLI seeding.
 */
export async function POST(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET || ''
  const given = req.headers.get('x-revalidate-secret') || ''
  const ok =
    secret.length >= 16 &&
    given.length === secret.length &&
    timingSafeEqual(Buffer.from(given), Buffer.from(secret))
  if (!ok) return new Response('Forbidden', { status: 403 })

  revalidatePath('/', 'layout')
  return Response.json({ revalidated: true, at: new Date().toISOString() })
}
