#!/usr/bin/env node
import { createServer } from 'vite'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { createServer as createNetServer } from 'node:net'

const workspaceRoot = new URL('../', import.meta.url)
const defaultLimit = Number.parseInt(process.env.DOCS_A11Y_LIMIT ?? '0', 10)
const baseUrl = process.env.DOCS_A11Y_BASE_URL
const browserAuditEnabled = process.env.DOCS_A11Y_BROWSER !== '0'
const routeFilter = new Set(
  (process.env.DOCS_A11Y_ROUTE ?? '')
    .split(',')
    .map((route) => route.trim())
    .filter(Boolean)
    .map((route) => route.endsWith('/') && route !== '/' ? route.slice(0, -1) : route)
)
const reportPath = resolve(
  workspaceRoot.pathname,
  process.env.DOCS_A11Y_REPORT_PATH ?? 'docs/.vitepress/data/a11y-runtime-report.generated.json'
)

if (!baseUrl) {
  console.error('DOCS_A11Y_BASE_URL is required, for example: DOCS_A11Y_BASE_URL=http://127.0.0.1:5179 pnpm docs:a11y:runtime')
  process.exit(1)
}

function joinUrl(base, route) {
  const trimmedBase = base.replace(/\/$/, '')
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`

  return `${trimmedBase}${normalizedRoute}`
}

function formatIssue(issue) {
  return `${issue.severity.toUpperCase()} ${issue.code}: ${issue.message}`
}

function wait(ms) {
  return new Promise((resolveWait) => {
    setTimeout(resolveWait, ms)
  })
}

async function waitForStableDocsPage(client, timeout = 8000) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeout) {
    const readyResult = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const bodyText = document.body?.innerText ?? '';
        const hasDocShell = Boolean(document.querySelector('.VPDoc, .vp-doc, main'));
        const expectsLiveRunner = bodyText.includes('Live example') || bodyText.includes('Live editable example runner');
        const liveRunnerReady = !expectsLiveRunner || Boolean(document.querySelector('.live-example-runner'));
        const hasViteErrorOverlay = Boolean(document.querySelector('vite-error-overlay'));

        return {
          ready: document.readyState === 'complete' && hasDocShell && liveRunnerReady && !hasViteErrorOverlay
        };
      })()`
    })

    if (readyResult.result?.value?.ready) {
      return
    }

    await wait(120)
  }
}

async function getFreePort() {
  return new Promise((resolvePort, rejectPort) => {
    const server = createNetServer()

    server.once('error', rejectPort)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : 0

      server.close(() => resolvePort(port))
    })
  })
}

async function fileExists(path) {
  if (!path) {
    return false
  }

  try {
    const { access } = await import('node:fs/promises')

    await access(path)
    return true
  } catch {
    return false
  }
}

async function resolveChromePath() {
  const candidates = [
    process.env.DOCS_A11Y_CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate
    }
  }

  return ''
}

async function waitForJson(url, timeout = 8000) {
  const startedAt = Date.now()
  let lastError

  while (Date.now() - startedAt < timeout) {
    try {
      const response = await fetch(url)

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      lastError = error
    }

    await wait(120)
  }

  throw lastError ?? new Error(`Timed out waiting for ${url}`)
}

function createCdpClient(webSocketUrl) {
  let id = 0
  const pending = new Map()
  const listeners = new Map()
  const socket = new WebSocket(webSocketUrl)

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)

    if (message.id && pending.has(message.id)) {
      const { resolveCall, rejectCall } = pending.get(message.id)
      pending.delete(message.id)

      if (message.error) {
        rejectCall(new Error(message.error.message))
      } else {
        resolveCall(message.result)
      }
      return
    }

    if (message.method && listeners.has(message.method)) {
      listeners.get(message.method).forEach((listener) => listener(message.params ?? {}))
    }
  })

  return {
    ready: new Promise((resolveSocket, rejectSocket) => {
      socket.addEventListener('open', resolveSocket, { once: true })
      socket.addEventListener('error', rejectSocket, { once: true })
    }),
    send(method, params = {}) {
      const callId = ++id

      socket.send(JSON.stringify({ id: callId, method, params }))

      return new Promise((resolveCall, rejectCall) => {
        pending.set(callId, { resolveCall, rejectCall })
      })
    },
    on(method, listener) {
      const methodListeners = listeners.get(method) ?? []
      methodListeners.push(listener)
      listeners.set(method, methodListeners)
    },
    close() {
      socket.close()
    }
  }
}

async function createBrowserAuditor(viewports) {
  if (!browserAuditEnabled) {
    return null
  }

  const chromePath = await resolveChromePath()

  if (!chromePath) {
    console.warn('Chrome not found; docs:a11y:runtime will use HTTP-only checks.')
    return null
  }

  const port = await getFreePort()
  const userDataDir = await mkdtemp(resolve(tmpdir(), 'yok-ui-docs-a11y-'))
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ], {
    stdio: ['ignore', 'ignore', 'pipe']
  })

  chrome.stderr.on('data', () => {})
  const chromeExited = new Promise((resolveExit) => {
    chrome.once('exit', resolveExit)
  })

  await waitForJson(`http://127.0.0.1:${port}/json/version`)

  return {
    async audit(url, viewportId) {
      const viewport = viewports.find((item) => item.id === viewportId)

      if (!viewport) {
        throw new Error(`Unknown docs audit viewport: ${viewportId}`)
      }

      const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('about:blank')}`, {
        method: 'PUT'
      })
      const target = await targetResponse.json()
      const client = createCdpClient(target.webSocketDebuggerUrl)
      const consoleMessages = []

      try {
        await client.ready
        client.on('Runtime.consoleAPICalled', (params) => {
          if (['error', 'warning', 'warn'].includes(params.type)) {
            consoleMessages.push({
              level: params.type === 'warning' ? 'warning' : params.type,
              message: params.args?.map((arg) => arg.value ?? arg.description ?? '').join(' ') ?? params.type
            })
          }
        })
        client.on('Runtime.exceptionThrown', (params) => {
          const exception = params.exceptionDetails?.exception
          consoleMessages.push({
            level: 'error',
            message: exception?.description ?? exception?.value ?? params.exceptionDetails?.text ?? 'Runtime exception'
          })
        })
        client.on('Log.entryAdded', (params) => {
          if (['error', 'warning'].includes(params.entry?.level)) {
            consoleMessages.push({
              level: params.entry.level,
              message: params.entry.text ?? params.entry.level,
              url: params.entry.url
            })
          }
        })

        await client.send('Runtime.enable')
        await client.send('Log.enable')
        await client.send('Page.enable')
        await client.send('Emulation.setDeviceMetricsOverride', {
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: viewportId === 'mobile' ? 2 : 1,
          mobile: viewportId === 'mobile'
        })
        await client.send('Page.navigate', { url })
        await new Promise((resolveLoad) => {
          const timeoutId = setTimeout(resolveLoad, 5000)

          client.on('Page.loadEventFired', () => {
            clearTimeout(timeoutId)
            resolveLoad()
          })
        })
        await waitForStableDocsPage(client)

        const htmlResult = await client.send('Runtime.evaluate', {
          expression: 'document.documentElement.outerHTML',
          returnByValue: true
        })
        const metricsResult = await client.send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const root = document.documentElement;
            const body = document.body;
            const viewportWidth = root.clientWidth;
            const bodyOverflow = root.scrollWidth > viewportWidth + 1 || body.scrollWidth > viewportWidth + 1;
            const hasScrollableInlineAncestor = (element) => {
              let current = element.parentElement;

              while (current && current !== body && current !== root) {
                const style = window.getComputedStyle(current);
                const canScrollInline = ['auto', 'scroll'].includes(style.overflowX);

                if (canScrollInline && current.scrollWidth > current.clientWidth + 1) {
                  return true;
                }

                current = current.parentElement;
              }

              return false;
            };
            const overflowingElements = Array.from(document.querySelectorAll('body *'))
              .map((element) => {
                const rect = element.getBoundingClientRect();
                return {
                  ignored: hasScrollableInlineAncestor(element),
                  className: element.className ? String(element.className) : element.tagName.toLowerCase(),
                  scrollWidth: Math.round(element.scrollWidth),
                  clientWidth: Math.round(element.clientWidth),
                  right: Math.round(rect.right),
                  left: Math.round(rect.left),
                  text: (element.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 100)
                };
              })
              .filter((element) => !element.ignored && element.clientWidth > 0 && element.right > viewportWidth + 1 && element.left < viewportWidth)
              .slice(0, 8)
              .map(({ ignored, right, left, ...element }) => element);

            return { bodyOverflow, overflowingElements };
          })()`
        })

        return {
          html: htmlResult.result?.value ?? '',
          metrics: metricsResult.result?.value ?? {
            bodyOverflow: false,
            overflowingElements: []
          },
          consoleMessages
        }
      } finally {
        client.close()
        await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {})
      }
    },
    async close() {
      chrome.kill('SIGTERM')
      await Promise.race([
        chromeExited,
        wait(3000)
      ])
      await rm(userDataDir, { recursive: true, force: true })
    }
  }
}

const viteServer = await createServer({
  configFile: false,
  root: workspaceRoot.pathname,
  logLevel: 'silent',
  server: {
    middlewareMode: true
  }
})

try {
  const targetsModule = await viteServer.ssrLoadModule('/docs/.vitepress/data/docsA11yAuditTargets.ts')
  const runtimeAuditModule = await viteServer.ssrLoadModule('/docs/.vitepress/data/docsA11yRuntimeAudit.ts')
  const allTargets = routeFilter.size > 0
    ? targetsModule.docsA11yAuditTargets.filter((target) => routeFilter.has(target.route.replace(/\/$/, '')))
    : targetsModule.docsA11yAuditTargets
  const targets = defaultLimit > 0
    ? allTargets.slice(0, defaultLimit)
    : allTargets
  const results = []
  const browserAuditor = await createBrowserAuditor(targetsModule.docsA11yAuditViewports)

  try {
    for (const target of targets) {
      const targetUrl = joinUrl(baseUrl, target.route)
      const response = await fetch(targetUrl)
      const httpHtml = await response.text()

      for (const viewportId of target.viewports) {
        const browserResult = browserAuditor
          ? await browserAuditor.audit(targetUrl, viewportId)
          : null

        results.push(runtimeAuditModule.auditDocsA11yRuntimeTarget({
          target,
          url: targetUrl,
          status: response.status,
          html: browserResult?.html ?? httpHtml,
          viewportId,
          metrics: browserResult?.metrics,
          consoleMessages: browserResult?.consoleMessages ?? []
        }))
      }
    }
  } finally {
    await browserAuditor?.close()
  }

  const report = runtimeAuditModule.createDocsA11yRuntimeReport({
    baseUrl,
    results
  })
  const summary = report.summary

  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  console.log(JSON.stringify(summary, null, 2))
  console.log(`Runtime report written to ${reportPath}`)

  const failedResults = results.filter((result) => !result.passed)

  if (failedResults.length > 0) {
    failedResults.slice(0, 10).forEach((result) => {
      console.error(`\n${result.route} @ ${result.viewportId}`)
      result.issues.forEach((issue) => {
        console.error(`- ${formatIssue(issue)}`)
      })
    })
    process.exitCode = 1
  }
} finally {
  await viteServer.close()
}
