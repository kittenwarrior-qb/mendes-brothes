import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(req: Request): Promise<Response> {
  const draft = await draftMode()
  draft.disable()
  // go back to the page being previewed (same-origin only)
  const ref = req.headers.get('referer')
  const target =
    ref && new URL(ref).origin === new URL(req.url).origin ? new URL(ref).pathname : '/'
  redirect(target)
}
