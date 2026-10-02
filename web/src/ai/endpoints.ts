import type { Endpoint, PayloadRequest } from 'payload'

import { isManagerUser } from '../access/roles'
import { providerById } from './providerInfo'
import { AiError, connect } from './providers'
import { getAiConfig, removeAiConnection, saveAiConnection, setAutoAlt, toStatus } from './settings'
import { chat, checkDocument, describeMedia, rewriteText, writeProject, writeSeo } from './tasks'

const json = (data: unknown, status = 200) => Response.json(data, { status })

const body = async (req: PayloadRequest): Promise<Record<string, unknown>> => {
  try {
    return ((await req.json?.()) ?? {}) as Record<string, unknown>
  } catch {
    return {}
  }
}

const fail = (req: PayloadRequest, err: unknown) => {
  if (err instanceof AiError) return json({ error: err.message }, err.code === 'limit' ? 429 : 400)
  req.payload.logger.error({ err, msg: 'AI request failed' })
  return json(
    { error: err instanceof Error ? err.message : 'Something went wrong. Try again.' },
    500,
  )
}

// A free key allows a handful of requests per minute; stop a stuck button from burning them.
const recent = new Map<string, number[]>()
const tooMany = (userId: string) => {
  const now = Date.now()
  const times = (recent.get(userId) ?? []).filter((t) => now - t < 60_000)
  times.push(now)
  recent.set(userId, times)
  return times.length > 20
}

export const aiEndpoints: Endpoint[] = [
  {
    path: '/ai/status',
    method: 'get',
    handler: async (req) => {
      if (!req.user) return json({ error: 'Log in first.' }, 401)
      return json(toStatus(await getAiConfig(req.payload), isManagerUser(req.user)))
    },
  },
  {
    // Managers only: connect a key (tested before it is saved), remove it, or change options.
    path: '/ai/settings',
    method: 'post',
    handler: async (req) => {
      if (!isManagerUser(req.user)) return json({ error: 'Managers only.' }, req.user ? 403 : 401)
      const data = await body(req)
      try {
        if (data.remove) await removeAiConnection(req.payload)
        else if (typeof data.autoAlt === 'boolean' && !data.apiKey)
          await setAutoAlt(req.payload, data.autoAlt)
        else {
          const provider = providerById(String(data.provider ?? ''))
          const apiKey = String(data.apiKey ?? '').trim()
          if (!provider) return json({ error: 'Choose an AI service.' }, 400)
          if (apiKey.length < 10) return json({ error: 'Paste the key first.' }, 400)
          await saveAiConnection(req.payload, await connect(provider.id, apiKey))
          req.payload.logger.info(
            `AI assistant connected to ${provider.name} by ${req.user?.email}`,
          )
        }
        return json(toStatus(await getAiConfig(req.payload), true))
      } catch (err) {
        return fail(req, err)
      }
    },
  },
  {
    // Any logged-in person: run one AI task on the text or document they are editing.
    path: '/ai/run',
    method: 'post',
    handler: async (req) => {
      if (!req.user) return json({ error: 'Log in first.' }, 401)
      if (tooMany(String(req.user.id)))
        return json({ error: 'That is a lot of AI requests. Wait a minute and try again.' }, 429)
      const config = await getAiConfig(req.payload)
      if (!config)
        return json({ error: 'The AI assistant is not set up yet (Settings → AI assistant).' }, 400)

      const data = await body(req)
      const doc = (data.data ?? {}) as Record<string, unknown>
      const collection = String(data.collection ?? '')
      try {
        switch (data.task) {
          case 'text': {
            const text = String(data.text ?? '').trim()
            if (text.length < 2) return json({ error: 'There is no text to work on yet.' }, 400)
            if (text.length > 12_000)
              return json({ error: 'That text is too long for one request.' }, 400)
            return json(
              await rewriteText(req.payload, config, {
                action: data.action as never,
                text,
                label: data.label ? String(data.label).slice(0, 80) : undefined,
                multiline: Boolean(data.multiline),
              }),
            )
          }
          case 'seo':
            return json(await writeSeo(req.payload, config, collection, doc))
          case 'project':
            return json(await writeProject(req.payload, config, doc))
          case 'check':
            return json(await checkDocument(req.payload, config, collection, doc))
          case 'chat': {
            const messages = (Array.isArray(data.messages) ? data.messages : [])
              .map((m) => m as { role?: string; text?: unknown })
              .filter(
                (m) => (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string',
              )
              .map((m) => ({ role: m.role as 'user' | 'assistant', text: String(m.text) }))
            return json(
              await chat(req.payload, config, {
                messages,
                manager: isManagerUser(req.user),
                path: typeof data.path === 'string' ? data.path.slice(0, 200) : undefined,
              }),
            )
          }
          case 'alt':
            return json(await describeMedia(req.payload, config, Number(data.mediaId)))
          default:
            return json({ error: 'Unknown task.' }, 400)
        }
      } catch (err) {
        return fail(req, err)
      }
    },
  },
]
