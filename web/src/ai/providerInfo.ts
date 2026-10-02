/*
 * The AI services the admin can connect to. Plain data: imported by the server
 * (which service to call) and by the settings screen (how to get a key).
 */

export type ProviderId = 'gemini' | 'groq' | 'openai' | 'anthropic'

export type ProviderInfo = {
  id: ProviderId
  name: string
  company: string
  free: boolean
  /** shown on the card */
  blurb: string
  /** where a key is created */
  keyUrl: string
  /** what a key looks like, shown as the input placeholder */
  keyExample: string
  steps: string[]
}

export const providers: ProviderInfo[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    company: 'Google',
    free: true,
    blurb: 'Free with a Google account, no card needed. Can also describe photos.',
    keyUrl: 'https://aistudio.google.com/apikey',
    keyExample: 'AIza…',
    steps: [
      'Open Google AI Studio (link below) and sign in with a Google account.',
      'Press “Create API key”.',
      'Copy the key and paste it here.',
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    company: 'Groq',
    free: true,
    blurb: 'Free, very fast, no card needed.',
    keyUrl: 'https://console.groq.com/keys',
    keyExample: 'gsk_…',
    steps: [
      'Open the Groq console (link below) and sign up with an email or Google account.',
      'Press “Create API Key” and give it any name.',
      'Copy the key and paste it here.',
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    company: 'OpenAI',
    free: false,
    blurb: 'Paid. Needs an OpenAI account with billing set up.',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyExample: 'sk-…',
    steps: [
      'Open the OpenAI platform (link below) and sign in.',
      'Add a payment method under Billing.',
      'Press “Create new secret key”, copy it and paste it here.',
    ],
  },
  {
    id: 'anthropic',
    name: 'Claude',
    company: 'Anthropic',
    free: false,
    blurb: 'Paid. The most careful writer of the four.',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyExample: 'sk-ant-…',
    steps: [
      'Open the Claude console (link below) and sign in.',
      'Add credit under Billing.',
      'Press “Create Key”, copy it and paste it here.',
    ],
  },
]

export const providerById = (id?: string | null) => providers.find((p) => p.id === id)

/** What the admin screens need to know. Never contains the key itself. */
export type AiStatus = {
  enabled: boolean
  /** can the connected service look at photos? */
  vision: boolean
  canManage: boolean
  autoAlt: boolean
  /** set by the admin screens when nobody is logged in (login page) */
  anonymous?: boolean
  provider?: ProviderId
  model?: string
  keyHint?: string
}

export type TextAction = 'fix' | 'improve' | 'shorten' | 'translate'

export const textActions: { id: TextAction; label: string }[] = [
  { id: 'fix', label: 'Fix spelling & grammar' },
  { id: 'improve', label: 'Make it clearer' },
  { id: 'shorten', label: 'Make it shorter' },
  { id: 'translate', label: 'Translate to English' },
]

export type CheckIssue = { where: string; problem: string; fix: string }
