import { describe, expect, it } from 'vitest'
import type { DocsA11yAuditTarget } from './docsA11yAuditTargets'
import {
  auditDocsA11yRuntimeTarget,
  createDocsA11yRuntimeReport,
  getDocsA11yRuntimeReportView,
  createDocsA11yRuntimeSummary
} from './docsA11yRuntimeAudit'

const target: DocsA11yAuditTarget = {
  id: 'component-modal',
  title: 'Modal component page',
  route: '/components/modal',
  scenarioRoute: '/components/modal#live-example',
  source: 'component',
  priority: 'critical',
  checks: ['structure', 'routing', 'keyboard', 'focus', 'aria', 'responsive', 'live-example'],
  viewports: ['desktop', 'mobile'],
  evidence: {
    docs: ['docs/components/modal.md'],
    data: ['docs/.vitepress/data/docsA11yAuditTargets.ts'],
    tests: ['docs/.vitepress/data/docsA11yRuntimeAudit.test.ts']
  }
}

const validHtml = `
<!doctype html>
<html lang="zh-CN">
  <body>
    <div id="app">
      <nav aria-label="Main navigation">
        <a href="/guide/">指南</a>
        <a href="/components/">组件</a>
      </nav>
      <main id="VPContent">
        <h1>Modal</h1>
        <section id="live-example"></section>
        <button>Open modal</button>
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <h2 id="modal-title">Dialog title</h2>
        </div>
      </main>
    </div>
  </body>
</html>
`

describe('docsA11yRuntimeAudit', () => {
  it('passes a complete runtime document with matching responsive metrics', () => {
    const result = auditDocsA11yRuntimeTarget({
      target,
      url: 'http://127.0.0.1:5179/components/modal',
      status: 200,
      html: validHtml,
      viewportId: 'desktop',
      metrics: {
        bodyOverflow: false,
        overflowingElements: []
      },
      consoleMessages: []
    })

    expect(result.passed).toBe(true)
    expect(result.issues).toEqual([])
    expect(result.checked).toEqual(expect.arrayContaining(['structure', 'routing', 'responsive', 'live-example']))
  })

  it('reports missing structure and live example anchors', () => {
    const result = auditDocsA11yRuntimeTarget({
      target,
      url: 'http://127.0.0.1:5179/components/modal',
      status: 200,
      html: '<html><body><nav><a href="/guide/">指南</a></nav><section>Missing content</section></body></html>',
      viewportId: 'mobile',
      metrics: {
        bodyOverflow: false,
        overflowingElements: []
      },
      consoleMessages: []
    })

    expect(result.passed).toBe(false)
    expect(result.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'missing-main',
      'missing-h1',
      'missing-live-example'
    ]))
  })

  it('reports routing, responsive and console problems', () => {
    const result = auditDocsA11yRuntimeTarget({
      target,
      url: 'http://127.0.0.1:5179/components/modal',
      status: 200,
      html: '<html><body><main><h1>Modal</h1><section id="live-example"></section></main></body></html>',
      viewportId: 'mobile',
      metrics: {
        bodyOverflow: true,
        overflowingElements: [
          { className: 'demo-panel', scrollWidth: 420, clientWidth: 390, text: 'wide panel' }
        ]
      },
      consoleMessages: [
        { level: 'error', message: 'Hydration failed' }
      ]
    })

    expect(result.passed).toBe(false)
    expect(result.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'missing-navigation',
      'horizontal-overflow',
      'console-error'
    ]))
    expect(result.issues.find((issue) => issue.code === 'console-error')?.message).toContain('Hydration failed')
  })

  it('explains VitePress dev client shells instead of pretending page content was audited', () => {
    const result = auditDocsA11yRuntimeTarget({
      target,
      url: 'http://127.0.0.1:5179/components/modal',
      status: 200,
      html: '<!doctype html><html><body><div id="app"></div><script type="module" src="/@vite/client"></script></body></html>',
      viewportId: 'desktop',
      consoleMessages: []
    })

    expect(result.passed).toBe(false)
    expect(result.issues.map((issue) => issue.code)).toContain('client-shell')
    expect(result.issues.find((issue) => issue.code === 'client-shell')?.message).toContain('vitepress preview')
  })

  it('summarizes runtime audit results for CLI output and maturity reporting', () => {
    const passing = auditDocsA11yRuntimeTarget({
      target,
      url: 'http://127.0.0.1:5179/components/modal',
      status: 200,
      html: validHtml,
      viewportId: 'desktop',
      metrics: {
        bodyOverflow: false,
        overflowingElements: []
      },
      consoleMessages: []
    })
    const failing = auditDocsA11yRuntimeTarget({
      target: { ...target, id: 'component-drawer', route: '/components/drawer', title: 'Drawer component page' },
      url: 'http://127.0.0.1:5179/components/drawer',
      status: 404,
      html: '',
      viewportId: 'mobile',
      metrics: {
        bodyOverflow: true,
        overflowingElements: []
      },
      consoleMessages: []
    })

    expect(createDocsA11yRuntimeSummary([passing, failing])).toEqual({
      total: 2,
      passed: 1,
      failed: 1,
      issueCount: failing.issues.length,
      failedRoutes: ['/components/drawer']
    })
  })

  it('creates a serializable runtime report and view model for the maturity dashboard', () => {
    const passing = auditDocsA11yRuntimeTarget({
      target,
      url: 'http://127.0.0.1:5179/components/modal',
      status: 200,
      html: validHtml,
      viewportId: 'desktop',
      metrics: {
        bodyOverflow: false,
        overflowingElements: []
      },
      consoleMessages: []
    })
    const report = createDocsA11yRuntimeReport({
      baseUrl: 'http://127.0.0.1:5179',
      generatedAt: '2026-06-23T00:00:00.000Z',
      results: [passing]
    })

    expect(JSON.parse(JSON.stringify(report))).toEqual(report)
    expect(report.summary).toEqual({
      total: 1,
      passed: 1,
      failed: 0,
      issueCount: 0,
      failedRoutes: []
    })

    expect(getDocsA11yRuntimeReportView(report)).toEqual({
      status: 'passed',
      label: 'Runtime audit passed',
      detail: '1/1 checks passed against http://127.0.0.1:5179.',
      failedRoutes: [],
      generatedAt: '2026-06-23T00:00:00.000Z'
    })
  })

  it('describes the seeded report as not run until runtime evidence is generated', () => {
    const report = createDocsA11yRuntimeReport({
      baseUrl: 'not-run',
      generatedAt: '1970-01-01T00:00:00.000Z',
      results: []
    })

    expect(getDocsA11yRuntimeReportView(report)).toEqual({
      status: 'not-run',
      label: 'Runtime audit not run',
      detail: 'Run docs:a11y:runtime after starting the docs preview to publish live URL evidence.',
      failedRoutes: [],
      generatedAt: '1970-01-01T00:00:00.000Z'
    })
  })
})
