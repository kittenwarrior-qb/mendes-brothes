import type { Payload } from 'payload'

import type { AiStatus, ProviderId } from './providerInfo'

import { type AiConnection, canSee } from './providers'

export type AiConfig = AiConnection & { autoAlt: boolean; keyHint: string }

/** The saved connection with the key decrypted, or null when AI is not set up. */
export const getAiConfig = async (payload: Payload): Promise<AiConfig | null> => {
  const s = await payload.findGlobal({ slug: 'ai-settings' })
  if (!s.provider || !s.apiKey || !s.model) return null
  let apiKey: string
  try {
    apiKey = payload.decrypt(s.apiKey)
  } catch {
    // encrypted with another PAYLOAD_SECRET (e.g. a backup restored on a new server)
    return null
  }
  if (!apiKey) return null
  return {
    provider: s.provider as ProviderId,
    apiKey,
    model: s.model,
    visionModel: s.visionModel,
    autoAlt: s.autoAlt !== false,
    keyHint: s.keyHint ?? '',
  }
}

export const saveAiConnection = (payload: Payload, c: AiConnection) =>
  payload.updateGlobal({
    slug: 'ai-settings',
    data: {
      provider: c.provider,
      apiKey: payload.encrypt(c.apiKey),
      keyHint: `…${c.apiKey.slice(-4)}`,
      model: c.model,
      visionModel: c.visionModel ?? null,
    },
  })

export const removeAiConnection = (payload: Payload) =>
  payload.updateGlobal({
    slug: 'ai-settings',
    data: { provider: null, apiKey: null, keyHint: null, model: null, visionModel: null },
  })

export const setAutoAlt = (payload: Payload, autoAlt: boolean) =>
  payload.updateGlobal({ slug: 'ai-settings', data: { autoAlt } })

export const toStatus = (config: AiConfig | null, canManage: boolean): AiStatus => {
  if (!config) return { enabled: false, vision: false, canManage, autoAlt: true }
  return {
    enabled: true,
    vision: canSee(config),
    canManage,
    autoAlt: config.autoAlt,
    // details of the connection are for the people who manage it
    ...(canManage
      ? { provider: config.provider, model: config.model, keyHint: config.keyHint }
      : {}),
  }
}
