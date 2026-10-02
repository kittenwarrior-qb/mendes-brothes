/*
 * One function, four services. `generate` sends a prompt (optionally with a photo) and
 * returns text; `connect` checks a key and picks a model that works with it.
 *
 * Model names change every few months, so nothing is hard-coded for Gemini, Groq or
 * OpenAI: the list of models is read from the service and the best match is tried first.
 */
import Anthropic from '@anthropic-ai/sdk'

import type { ProviderId } from './providerInfo'

export type AiImage = { mimeType: string; data: string }
export type AiRequest = {
  system: string
  prompt: string
  image?: AiImage
  /** the answer must be a JSON object */
  json?: boolean
  /** earlier turns of a conversation, oldest first; `prompt` is the newest user message */
  history?: AiTurn[]
}
export type AiTurn = { role: 'user' | 'assistant'; text: string }
export type AiConnection = {
  provider: ProviderId
  apiKey: string
  model: string
  visionModel?: string | null
}

type ErrorCode = 'key' | 'limit' | 'model' | 'blocked' | 'network' | 'other'

/** An error with a message that is safe and useful to show to the person in the admin. */
export class AiError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
  ) {
    super(message)
  }
}

const friendly: Record<Exclude<ErrorCode, 'other'>, string> = {
  key: 'The AI service did not accept the key. Check it in Settings → AI assistant.',
  limit: 'The AI service is busy or the free limit was reached. Wait a minute and try again.',
  model:
    'The AI model is no longer available. Open Settings → AI assistant and press “Test & save” again.',
  blocked: 'The AI service declined to answer this one.',
  network: 'Could not reach the AI service. Check the connection and try again.',
}

const fromStatus = (status: number, detail: string): AiError => {
  if (
    status === 401 ||
    status === 403 ||
    /api key not valid|invalid api key|api_key_invalid/i.test(detail)
  )
    return new AiError('key', friendly.key)
  if (status === 429) return new AiError('limit', friendly.limit)
  if (status === 404) return new AiError('model', friendly.model)
  if (status >= 500) return new AiError('limit', friendly.limit)
  return new AiError(
    'other',
    `The AI service returned an error (${status}). ${detail.slice(0, 200)}`,
  )
}

// AI_BASE_URL points every service at another host (a proxy, or the stub used in tests).
const override = () => process.env.AI_BASE_URL?.replace(/\/$/, '')
const baseUrl = {
  gemini: () => override() ?? 'https://generativelanguage.googleapis.com',
  groq: () => (override() ? `${override()}/openai/v1` : 'https://api.groq.com/openai/v1'),
  openai: () => (override() ? `${override()}/openai/v1` : 'https://api.openai.com/v1'),
}

const TIMEOUT_MS = 60_000

const call = async (url: string, init: RequestInit): Promise<Record<string, unknown>> => {
  let res: Response
  try {
    res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) })
  } catch {
    throw new AiError('network', friendly.network)
  }
  const text = await res.text()
  if (!res.ok) {
    let detail = text
    try {
      detail = JSON.parse(text)?.error?.message ?? text
    } catch {
      /* not JSON */
    }
    throw fromStatus(res.status, String(detail))
  }
  return JSON.parse(text)
}

/* ───────────────────────── Gemini ───────────────────────── */

const geminiHeaders = (key: string) => ({
  'Content-Type': 'application/json',
  'x-goog-api-key': key,
})

const gemini = async (c: AiConnection, r: AiRequest): Promise<string> => {
  const body = await call(`${baseUrl.gemini()}/v1beta/models/${c.model}:generateContent`, {
    method: 'POST',
    headers: geminiHeaders(c.apiKey),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: r.system }] },
      contents: [
        ...(r.history ?? []).map((t) => ({
          role: t.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: t.text }],
        })),
        {
          role: 'user',
          parts: [...(r.image ? [{ inlineData: r.image }] : []), { text: r.prompt }],
        },
      ],
      generationConfig: {
        // generous: newer models spend part of this on thinking before they answer
        maxOutputTokens: 8192,
        ...(r.json ? { responseMimeType: 'application/json' } : {}),
      },
    }),
  })
  const candidate = (
    body.candidates as { content?: { parts?: { text?: string }[] } }[] | undefined
  )?.[0]
  const text = (candidate?.content?.parts ?? []).map((p) => p.text ?? '').join('')
  if (!text.trim()) throw new AiError('blocked', friendly.blocked)
  return text
}

const geminiModels = async (key: string): Promise<string[]> => {
  const body = await call(`${baseUrl.gemini()}/v1beta/models?pageSize=200`, {
    headers: geminiHeaders(key),
  })
  const names = ((body.models ?? []) as { name: string; supportedGenerationMethods?: string[] }[])
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m) => m.name.replace(/^models\//, ''))
  const newestFirst = (pattern: RegExp) =>
    names
      .filter((n) => pattern.test(n))
      .sort((a, b) => Number(b.match(pattern)![1]) - Number(a.match(pattern)![1]))
  // the standard "flash" model of the newest generation, then lighter and older ones
  return [
    ...newestFirst(/^gemini-(\d+(?:\.\d+)?)-flash$/),
    ...names.filter((n) => n === 'gemini-flash-latest'),
    ...newestFirst(/^gemini-(\d+(?:\.\d+)?)-flash-lite$/),
  ]
}

/* ───────────────────────── OpenAI-compatible (OpenAI, Groq) ───────────────────────── */

const chat = async (base: string, c: AiConnection, r: AiRequest): Promise<string> => {
  const body = await call(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${c.apiKey}` },
    body: JSON.stringify({
      model: r.image ? (c.visionModel ?? c.model) : c.model,
      messages: [
        { role: 'system', content: r.system },
        ...(r.history ?? []).map((t) => ({ role: t.role, content: t.text })),
        {
          role: 'user',
          content: r.image
            ? [
                { type: 'text', text: r.prompt },
                {
                  type: 'image_url',
                  image_url: { url: `data:${r.image.mimeType};base64,${r.image.data}` },
                },
              ]
            : r.prompt,
        },
      ],
      max_completion_tokens: 8192,
      ...(r.json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })
  const text = (body.choices as { message?: { content?: string } }[] | undefined)?.[0]?.message
    ?.content
  if (!text?.trim()) throw new AiError('blocked', friendly.blocked)
  return text
}

const chatModels = async (base: string, key: string): Promise<string[]> => {
  const body = await call(`${base}/models`, { headers: { Authorization: `Bearer ${key}` } })
  return ((body.data ?? []) as { id: string }[]).map((m) => m.id)
}

const openaiCandidates = (ids: string[]) => {
  const pattern = /^gpt-(\d+(?:\.\d+)?)-mini$/
  const minis = ids
    .filter((id) => pattern.test(id))
    .sort((a, b) => Number(b.match(pattern)![1]) - Number(a.match(pattern)![1]))
  return [...minis, ...ids.filter((id) => id === 'gpt-4o-mini')]
}

const groqPreference = [
  /llama-3\.3-70b/,
  /gpt-oss-120b/,
  /maverick/,
  /llama.*70b/,
  /qwen/,
  /gpt-oss-20b/,
]
const groqCandidates = (ids: string[]) =>
  groqPreference
    .flatMap((p) => ids.filter((id) => p.test(id)))
    .filter((id, i, all) => all.indexOf(id) === i)
const groqVision = (ids: string[]) => ids.find((id) => /maverick|scout|vision/.test(id)) ?? null

/* ───────────────────────── Claude ───────────────────────── */

const CLAUDE_MODEL = 'claude-opus-5-5'

const claude = async (c: AiConnection, r: AiRequest): Promise<string> => {
  const client = new Anthropic({
    apiKey: c.apiKey,
    baseURL: override(),
    maxRetries: 1,
    timeout: TIMEOUT_MS,
  })
  try {
    const params = {
      model: c.model,
      max_tokens: 16000,
      // short editing jobs: the lowest effort is quick and plenty
      output_config: { effort: 'low' },
      // if a safety check declines the request, the service retries it on another Claude model
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: r.system,
      messages: [
        ...(r.history ?? []).map((t) => ({ role: t.role, content: t.text })),
        {
          role: 'user',
          content: r.image
            ? [
                {
                  type: 'image',
                  source: { type: 'base64', media_type: r.image.mimeType, data: r.image.data },
                },
                { type: 'text', text: r.prompt },
              ]
            : r.prompt,
        },
      ],
    }
    const res = await client.beta.messages.create(
      params as unknown as Anthropic.Beta.Messages.MessageCreateParamsNonStreaming,
    )
    if (res.stop_reason === 'refusal') throw new AiError('blocked', friendly.blocked)
    const text = res.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
    if (!text.trim()) throw new AiError('blocked', friendly.blocked)
    return text
  } catch (err) {
    if (err instanceof AiError) throw err
    if (
      err instanceof Anthropic.AuthenticationError ||
      err instanceof Anthropic.PermissionDeniedError
    )
      throw new AiError('key', friendly.key)
    if (err instanceof Anthropic.RateLimitError) throw new AiError('limit', friendly.limit)
    if (err instanceof Anthropic.NotFoundError) throw new AiError('model', friendly.model)
    if (err instanceof Anthropic.APIConnectionError) throw new AiError('network', friendly.network)
    if (err instanceof Anthropic.APIError) throw fromStatus(err.status ?? 500, err.message)
    throw err
  }
}

/* ───────────────────────── public API ───────────────────────── */

export const generate = (c: AiConnection, r: AiRequest): Promise<string> => {
  if (r.image && !canSee(c))
    throw new AiError(
      'other',
      'The connected AI service cannot look at photos. Gemini can, for free.',
    )
  switch (c.provider) {
    case 'gemini':
      return gemini(c, r)
    case 'groq':
      return chat(baseUrl.groq(), c, r)
    case 'openai':
      return chat(baseUrl.openai(), c, r)
    case 'anthropic':
      return claude(c, r)
  }
}

export const canSee = (c: Pick<AiConnection, 'provider' | 'visionModel'>) =>
  c.provider !== 'groq' || Boolean(c.visionModel)

const PING: AiRequest = {
  system: 'You are a connection test.',
  prompt: 'Reply with the single word: OK',
}

/**
 * Checks the key and finds a model that answers. Throws an AiError with a readable
 * message when the key is wrong or nothing works.
 */
export const connect = async (provider: ProviderId, apiKey: string): Promise<AiConnection> => {
  let candidates: string[]
  let visionModel: string | null = null
  if (provider === 'gemini') candidates = await geminiModels(apiKey)
  else if (provider === 'groq') {
    const ids = await chatModels(baseUrl.groq(), apiKey)
    candidates = groqCandidates(ids)
    visionModel = groqVision(ids)
  } else if (provider === 'openai')
    candidates = openaiCandidates(await chatModels(baseUrl.openai(), apiKey))
  else candidates = [CLAUDE_MODEL]

  let last: AiError = new AiError('model', 'This key has no model that can be used for writing.')
  // a free key sometimes has no quota for the newest model, so fall through to the next one
  for (const model of candidates.slice(0, 5)) {
    const connection = { provider, apiKey, model, visionModel }
    try {
      await generate(connection, PING)
      return connection
    } catch (err) {
      if (!(err instanceof AiError)) throw err
      if (err.code === 'key' || err.code === 'network') throw err
      last = err
    }
  }
  throw last
}
