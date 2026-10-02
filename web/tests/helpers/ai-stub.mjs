/*
 * A stand-in for the AI services, for tests:  node tests/helpers/ai-stub.mjs  (port 8787)
 * Start the website with AI_BASE_URL=http://127.0.0.1:8787 and every provider talks to this.
 * It speaks just enough of the Gemini, OpenAI-compatible and Claude APIs, and answers
 * predictably from the prompt. The only key it accepts is GOOD_KEY.
 */
import http from 'node:http'

export const GOOD_KEY = 'test-key-good-1234'
const PORT = Number(process.env.AI_STUB_PORT || 8787)

/** What a model would say, decided from the prompt. */
const answer = (prompt, hasImage, system = '') => {
  if (/built-in assistant of the website admin panel/.test(system)) {
    if (/logo/i.test(prompt))
      return 'Use a wide logo with a transparent background.\n1. Open the Logos tab.\n2. Upload it and press Save.\n/admin/globals/site-settings\n[image: adm-logos]\n[image: not-a-real-picture]'
    return `Stub answer (${/Colour palette: Studio Paper/.test(system) ? 'knows the current palette' : 'no palette'}): ${prompt}`
  }
  if (hasImage) return 'Excavator loading soil into a dump truck on a cleared lot.'
  if (/single word: OK/.test(prompt)) return 'OK'
  if (/Google search result title/.test(prompt))
    return JSON.stringify({
      title: 'Land Clearing in Lewes, DE',
      description:
        'Wooded lot cleared and mulched in Lewes, Delaware. See how the crew prepared the site, what machines were used and how long it took.',
    })
  if (/Write up a finished job/.test(prompt))
    return (
      'Here is the JSON:\n```json\n' +
      JSON.stringify({
        summary: 'We cleared and mulched a wooded lot so the builder could start on the house pad.',
        paragraphs: [
          'The owner needed the lot opened up before construction could begin.',
          'We mulched the brush, pulled the stumps under the footprint and left a mulch layer to hold the soil.',
        ],
      }) +
      '\n```'
    )
  if (/Proofread/.test(prompt))
    return JSON.stringify({
      summary: 'One spelling mistake found.',
      issues: /recieve/.test(prompt)
        ? [{ where: 'Summary', problem: '“recieve” is misspelled.', fix: 'receive' }]
        : [],
    })
  const text = (prompt.match(/"""\n([\s\S]*)\n"""/) ?? [])[1] ?? ''
  if (/Translate/.test(prompt)) return `We clear land and build driveways.`
  if (/third shorter/.test(prompt)) return text.split(/(?<=\.)\s/)[0]
  if (/clearer/.test(prompt)) return `"${text.replace(/\s+/g, ' ').trim()} (clearer)"`
  return text.replace(/recieve/g, 'receive').replace(/\bteh\b/g, 'the')
}

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = http.createServer((req, res) => {
  let raw = ''
  req.on('data', (c) => (raw += c))
  req.on('end', () => {
    const url = new URL(req.url, 'http://x')
    const body = raw ? JSON.parse(raw) : {}
    const key =
      req.headers['x-goog-api-key'] ||
      req.headers['x-api-key'] ||
      String(req.headers.authorization ?? '').replace(/^Bearer /, '')
    const bad = key !== GOOD_KEY

    // ── Gemini
    if (url.pathname === '/v1beta/models') {
      if (bad)
        return send(res, 400, {
          error: { message: 'API key not valid. Please pass a valid API key.' },
        })
      const m = (name) => ({
        name: `models/${name}`,
        supportedGenerationMethods: ['generateContent'],
      })
      return send(res, 200, {
        models: [
          m('gemini-2.5-flash'),
          m('gemini-3.6-flash'),
          m('gemini-2.5-flash-lite'),
          m('gemini-3.6-pro'),
        ],
      })
    }
    const gem = url.pathname.match(/^\/v1beta\/models\/([^:]+):generateContent$/)
    if (gem) {
      if (bad)
        return send(res, 400, {
          error: { message: 'API key not valid. Please pass a valid API key.' },
        })
      // the newest model has no free quota — the site must fall back to the next one
      if (gem[1] === 'gemini-3.6-flash')
        return send(res, 429, { error: { message: 'Quota exceeded' } })
      const parts = body.contents?.at(-1)?.parts ?? []
      const prompt = parts.map((p) => p.text ?? '').join('')
      if (/FORCE_LIMIT/.test(prompt))
        return send(res, 429, { error: { message: 'Quota exceeded' } })
      const text = answer(
        prompt,
        parts.some((p) => p.inlineData),
        body.systemInstruction?.parts?.[0]?.text,
      )
      return send(res, 200, { candidates: [{ content: { parts: [{ text }] } }] })
    }

    // ── OpenAI-compatible (OpenAI, Groq)
    if (url.pathname === '/openai/v1/models') {
      if (bad) return send(res, 401, { error: { message: 'Invalid API Key' } })
      return send(res, 200, {
        data: ['gpt-4o-mini', 'gpt-5-mini', 'llama-3.3-70b-versatile', 'whisper-large-v3'].map(
          (id) => ({ id }),
        ),
      })
    }
    if (url.pathname === '/openai/v1/chat/completions') {
      if (bad) return send(res, 401, { error: { message: 'Invalid API Key' } })
      const user = body.messages?.findLast((m) => m.role === 'user')?.content
      const prompt = typeof user === 'string' ? user : user.map((p) => p.text ?? '').join('')
      const hasImage = Array.isArray(user) && user.some((p) => p.type === 'image_url')
      return send(res, 200, {
        choices: [{ message: { content: answer(prompt, hasImage, body.messages?.[0]?.content) } }],
        model: body.model,
      })
    }

    // ── Claude
    if (url.pathname === '/v1/messages') {
      if (bad)
        return send(res, 401, {
          type: 'error',
          error: { type: 'authentication_error', message: 'invalid x-api-key' },
        })
      const content = body.messages?.at(-1)?.content
      const prompt =
        typeof content === 'string' ? content : content.map((p) => p.text ?? '').join('')
      const hasImage = Array.isArray(content) && content.some((p) => p.type === 'image')
      return send(res, 200, {
        id: 'msg_stub',
        type: 'message',
        role: 'assistant',
        model: body.model,
        content: [{ type: 'text', text: answer(prompt, hasImage, body.system) }],
        stop_reason: 'end_turn',
        usage: { input_tokens: 1, output_tokens: 1 },
      })
    }
    send(res, 404, { error: { message: `stub: no route ${url.pathname}` } })
  })
})

server.listen(PORT, '127.0.0.1', () => console.log(`AI stub listening on http://127.0.0.1:${PORT}`))
