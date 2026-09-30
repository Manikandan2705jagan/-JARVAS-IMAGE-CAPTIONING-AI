// Quick checks: navbar wordmark text, and horizontal overflow at 3 widths.
// Usage: node scripts/check-brand.mjs

import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const APP_URL = 'http://localhost:5173/'
const PORT = 9223
const WIDTHS = [390, 820, 1440]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const profile = mkdtempSync(join(tmpdir(), 'vc-brand-'))

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--headless=new',
    '--no-first-run',
    '--disable-gpu',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

let ws
let nextId = 1
const pending = new Map()

const send = (method, params = {}, sessionId) => {
  const id = nextId++
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

async function main() {
  let wsUrl
  for (let i = 0; i < 60; i++) {
    try {
      wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json())
        .webSocketDebuggerUrl
      break
    } catch {
      await sleep(500)
    }
  }
  ws = new WebSocket(wsUrl)
  await new Promise((res, rej) => {
    ws.onopen = res
    ws.onerror = rej
  })
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id)
      pending.delete(m.id)
      if (m.error) reject(new Error(JSON.stringify(m.error)))
      else resolve(m.result)
    }
  }

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  await send('Page.enable', {}, sessionId)
  await send('Runtime.enable', {}, sessionId)

  const evaluate = async (expression) => {
    const r = await send(
      'Runtime.evaluate',
      { expression, returnByValue: true, awaitPromise: true },
      sessionId,
    )
    return r.result.value
  }

  await send('Page.navigate', { url: APP_URL }, sessionId)
  await sleep(4000)

  console.log('--- wordmark ---')
  console.log(
    'navbar wordmark:',
    JSON.stringify(
      await evaluate(
        `document.querySelector('header a[aria-label*="home"]')?.innerText.replace(/\\n/g,' ')`,
      ),
    ),
  )
  console.log('document title:', JSON.stringify(await evaluate('document.title')))

  console.log('\n--- horizontal overflow ---')
  for (const width of WIDTHS) {
    await send(
      'Emulation.setDeviceMetricsOverride',
      { width, height: 900, deviceScaleFactor: 1, mobile: width < 820 },
      sessionId,
    )
    await sleep(900)
    const m = await evaluate(
      `(() => {
        const de = document.documentElement;
        const widest = [...document.querySelectorAll('body *')]
          .map(el => ({ r: el.getBoundingClientRect(), el }))
          .filter(x => x.r.width > 0)
          .sort((a,b) => b.r.right - a.r.right)[0];
        return {
          scrollW: de.scrollWidth,
          clientW: de.clientWidth,
          overflow: de.scrollWidth - de.clientWidth,
          widestRight: Math.round(widest?.r.right ?? 0),
          widestTag: widest?.el.tagName,
          wordmark: document.querySelector('header a[aria-label*="home"]')?.innerText.replace(/\\n/g,' '),
        };
      })()`,
    )
    console.log(
      `${String(width).padStart(4)}px  overflow=${m.overflow}px  scrollW=${m.scrollW} clientW=${m.clientW}  widest=${m.widestTag}@${m.widestRight}px  wordmark=${JSON.stringify(m.wordmark)}`,
    )
  }
}

try {
  await main()
} catch (err) {
  console.error('ERROR:', err.message)
  process.exitCode = 1
} finally {
  try {
    ws?.close()
  } catch {}
  chrome.kill()
}
