// Headless browser smoke test for the real (non-demo) captioning flow.
// Usage: node scripts/verify-live.mjs [imagePath]

import { spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const APP_URL = 'http://localhost:5173/'
const IMAGE = process.argv[2] ?? join(process.cwd(), 'backend', 'sample', 'dog-park.jpg')
const PORT = 9222

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const profile = mkdtempSync(join(tmpdir(), 'vc-cdp-'))
const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1440,900',
    'about:blank',
  ],
  { stdio: 'ignore', detached: false },
)

let ws
let nextId = 1
const pending = new Map()
const consoleErrors = []
const failedRequests = []
const apiRequests = []
const apiResponses = []

function send(method, params = {}, sessionId) {
  const id = nextId++
  const message = { id, method, params }
  if (sessionId) message.sessionId = sessionId
  ws.send(JSON.stringify(message))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

async function connect() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      const info = await res.json()
      return info.webSocketDebuggerUrl
    } catch {
      await sleep(500)
    }
  }
  throw new Error('Chrome did not expose a debugging endpoint')
}

async function main() {
  const wsUrl = await connect()
  ws = new WebSocket(wsUrl)
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(new Error(JSON.stringify(msg.error)))
      else resolve(msg.result)
      return
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      consoleErrors.push(msg.params.entry.text)
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      const parts = msg.params.args.map((a) => {
        if ('value' in a) return `${JSON.stringify(a.value)}`
        return a.description ?? a.type
      })
      consoleErrors.push(parts.join(' '))
    }
    if (msg.method === 'Network.loadingFailed' && !msg.params.errorText.includes('ERR_ABORTED')) {
      failedRequests.push(msg.params.errorText)
    }
    if (msg.method === 'Network.requestWillBeSent' && msg.params.request.url.includes('/api/')) {
      apiRequests.push(`${msg.params.request.method} ${msg.params.request.url}`)
    }
    if (msg.method === 'Network.responseReceived' && msg.params.response.url.includes('/api/')) {
      apiResponses.push(`${msg.params.response.status} ${msg.params.response.url}`)
    }
  }

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })

  await send('Page.enable', {}, sessionId)
  await send('Runtime.enable', {}, sessionId)
  await send('Network.enable', {}, sessionId)
  await send('Log.enable', {}, sessionId)

  // Intercept console.error before any app code runs so we can see the real
  // arguments React substitutes into its %s placeholders.
  await send(
    'Page.addScriptToEvaluateOnNewDocument',
    {
      source: `
        window.__consoleErrors = [];
        const orig = console.error;
        console.error = function (...args) {
          try {
            window.__consoleErrors.push(args.map(a => {
              try { return typeof a === 'string' ? a : JSON.stringify(a); }
              catch { return String(a); }
            }).join(' | '));
          } catch {}
          return orig.apply(console, args);
        };
      `,
    },
    sessionId,
  )

  await send('Page.navigate', { url: APP_URL }, sessionId)
  await sleep(4000)

  const evaluate = async (expression) => {
    const res = await send(
      'Runtime.evaluate',
      { expression, awaitPromise: true, returnByValue: true },
      sessionId,
    )
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.text)
    return res.result.value
  }

  console.log('title:', await evaluate('document.title'))
  console.log(
    'demo pill count:',
    await evaluate(
      `[...document.querySelectorAll('span')].filter(n=>/^\\s*demo mode\\s*$/i.test(n.textContent||'')).length`,
    ),
  )
  console.log(
    'demo pill ancestors:',
    await evaluate(
      `[...document.querySelectorAll('span')].filter(n=>/^\\s*demo mode\\s*$/i.test(n.textContent||'')).map(n=>n.parentElement?.className?.toString().slice(0,60))`,
    ),
  )

  // Attach the real image to the file input; selection auto-triggers analysis.
  const b64 = readFileSync(IMAGE).toString('base64')
  const result = await evaluate(`(async () => {
    const input = document.querySelector('input[type=file]')
    if (!input) return { error: 'no file input found' }
    const bytes = Uint8Array.from(atob(${JSON.stringify(b64)}), c => c.charCodeAt(0))
    const file = new File([bytes], ${JSON.stringify(IMAGE.split(/[\\\\/]/).pop())}, { type: 'image/jpeg' })
    const dt = new DataTransfer()
    dt.items.add(file)
    input.files = dt.files
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await new Promise(r => setTimeout(r, 500))
    return { selected: input.files.length }
  })()`)
  console.log('file selected:', result)

  // Wait for the result panel (inference takes a few seconds).
  let body = ''
  for (let i = 0; i < 90; i++) {
    await sleep(1000)
    body = await evaluate('document.body.innerText')
    if (i % 10 === 0) {
      const alert = body.split('\n').find((l) => /error|failed|unsupported|exceed/i.test(l))
      console.log(
        `  t+${i}s | responses: ${apiResponses.length}${alert ? ` | alert: ${alert.slice(0, 80)}` : ''}`,
      )
    }
    if (apiResponses.length > 0) {
      // Wait for React to swap the skeleton for the real result.
      for (let j = 0; j < 30; j++) {
        await sleep(1000)
        body = await evaluate('document.body.innerText')
        if (/tall grass|golden retriever|blip-image-captioning/i.test(body)) break
      }
      break
    }
  }
  const done = apiResponses.length > 0
  console.log('api responded:', done)

  const grab = (label) => {
    const re = new RegExp(`${label}[^\\n]*`, 'i')
    return (body.match(re) || [null])[0]
  }

  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean)
  const idx = lines.findIndex((l) => /tall grass|blip|golden retriever/i.test(l))
  console.log('\n--- real backend output located at line', idx, '---')
  console.log(lines.slice(Math.max(0, idx - 14), idx + 16).join('\n'))

  console.log('\n--- assertions ---')
  const demoNotices = lines.filter((l) => /demo/i.test(l))
  console.log('lines mentioning "demo":', demoNotices)
  console.log('confidence line:', grab('confidence'))
  console.log('objects line:', grab('object'))
  console.log('scene line:', grab('scene'))

  writeFileSync(join(profile, 'page.txt'), body)
  console.log('\napi requests:', apiRequests)
  console.log('api responses:', apiResponses)
  console.log('intercepted console.error:', await evaluate('window.__consoleErrors ?? []'))
  console.log('console errors:', consoleErrors.length ? consoleErrors : 'none')
  console.log('failed requests:', failedRequests.length ? failedRequests : 'none')
}

try {
  await main()
} catch (err) {
  console.error('TEST ERROR:', err.message)
  process.exitCode = 1
} finally {
  try { ws?.close() } catch {}
  chrome.kill()
}
