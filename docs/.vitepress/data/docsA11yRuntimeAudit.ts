import type {
  DocsA11yAuditCheck,
  DocsA11yAuditTarget,
  DocsA11yAuditViewport
} from './docsA11yAuditTargets'

export type DocsA11yRuntimeIssueCode =
  | 'http-error'
  | 'missing-main'
  | 'missing-h1'
  | 'multiple-h1'
  | 'missing-navigation'
  | 'missing-live-example'
  | 'horizontal-overflow'
  | 'console-error'
  | 'client-shell'

export interface DocsA11yOverflowElement {
  className: string
  scrollWidth: number
  clientWidth: number
  text: string
}

export interface DocsA11yRuntimeMetrics {
  bodyOverflow: boolean
  overflowingElements: DocsA11yOverflowElement[]
}

export interface DocsA11yRuntimeConsoleMessage {
  level: 'error' | 'warn' | 'warning'
  message: string
  url?: string
}

export interface DocsA11yRuntimeIssue {
  code: DocsA11yRuntimeIssueCode
  message: string
  severity: 'high' | 'medium' | 'low'
}

export interface DocsA11yRuntimeAuditInput {
  target: DocsA11yAuditTarget
  url: string
  status: number
  html: string
  viewportId: DocsA11yAuditViewport['id']
  metrics?: DocsA11yRuntimeMetrics
  consoleMessages?: DocsA11yRuntimeConsoleMessage[]
}

export interface DocsA11yRuntimeAuditResult {
  targetId: string
  route: string
  title: string
  url: string
  viewportId: DocsA11yAuditViewport['id']
  priority: DocsA11yAuditTarget['priority']
  checked: DocsA11yAuditCheck[]
  passed: boolean
  issues: DocsA11yRuntimeIssue[]
}

export interface DocsA11yRuntimeReport {
  baseUrl: string
  generatedAt: string
  summary: ReturnType<typeof createDocsA11yRuntimeSummary>
  results: DocsA11yRuntimeAuditResult[]
}

export interface DocsA11yRuntimeReportInput {
  baseUrl: string
  generatedAt?: string
  results: DocsA11yRuntimeAuditResult[]
}

export type DocsA11yRuntimeReportViewStatus = 'not-run' | 'passed' | 'failed'

function hasElement(html: string, selectorPattern: RegExp) {
  return selectorPattern.test(html)
}

function countMatches(html: string, pattern: RegExp) {
  return html.match(pattern)?.length ?? 0
}

function hasNavigation(html: string) {
  return /<nav\b/i.test(html) && /href="\/(?:guide|components|resources|playground)\/?"/i.test(html)
}

function hasLiveExampleAnchor(html: string) {
  return /id="live-example"/i.test(html) || /href="#live-example"/i.test(html)
}

function isClientOnlyShell(html: string) {
  return /<div id="app"><\/div>/i.test(html)
}

function createIssue(
  code: DocsA11yRuntimeIssueCode,
  message: string,
  severity: DocsA11yRuntimeIssue['severity'] = 'medium'
): DocsA11yRuntimeIssue {
  return {
    code,
    message,
    severity
  }
}

export function auditDocsA11yRuntimeTarget(input: DocsA11yRuntimeAuditInput): DocsA11yRuntimeAuditResult {
  const issues: DocsA11yRuntimeIssue[] = []
  const checked = new Set<DocsA11yAuditCheck>()
  const html = input.html ?? ''

  if (isClientOnlyShell(html)) {
    issues.push(createIssue(
      'client-shell',
      `${input.target.route} returned a client-only shell. Run against vitepress preview/build output or provide browser metrics.`,
      'high'
    ))
  }

  if (input.status < 200 || input.status >= 400) {
    issues.push(createIssue('http-error', `${input.url} returned HTTP ${input.status}.`, 'high'))
  }

  if (input.target.checks.includes('structure')) {
    checked.add('structure')

    if (!hasElement(html, /<main\b/i)) {
      issues.push(createIssue('missing-main', `${input.target.route} should render a main landmark.`, 'high'))
    }

    const h1Count = countMatches(html, /<h1\b/gi)

    if (h1Count === 0) {
      issues.push(createIssue('missing-h1', `${input.target.route} should render one h1 heading.`, 'high'))
    }

    if (h1Count > 1) {
      issues.push(createIssue('multiple-h1', `${input.target.route} rendered ${h1Count} h1 headings.`, 'medium'))
    }
  }

  if (input.target.checks.includes('routing')) {
    checked.add('routing')

    if (!hasNavigation(html)) {
      issues.push(createIssue('missing-navigation', `${input.target.route} should expose top-level navigation links.`, 'medium'))
    }
  }

  if (input.target.checks.includes('live-example')) {
    checked.add('live-example')

    if (!hasLiveExampleAnchor(html)) {
      issues.push(createIssue('missing-live-example', `${input.target.route} should expose #live-example for runtime audits.`, 'high'))
    }
  }

  if (input.target.checks.includes('responsive')) {
    checked.add('responsive')

    if (input.metrics?.bodyOverflow || input.metrics?.overflowingElements.length) {
      const firstOverflow = input.metrics.overflowingElements[0]
      const detail = firstOverflow
        ? ` First overflowing element: ${firstOverflow.className} (${firstOverflow.clientWidth}/${firstOverflow.scrollWidth}).`
        : ''

      issues.push(createIssue('horizontal-overflow', `${input.target.route} overflows horizontally at ${input.viewportId}.${detail}`, 'high'))
    }
  }

  const consoleErrors = (input.consoleMessages ?? []).filter((message) =>
    message.level === 'error' && !/\/favicon\.(?:ico|svg|png)(?:\?|$)/i.test(message.url ?? message.message)
  )

  if (consoleErrors.length > 0) {
    const firstError = consoleErrors[0]?.message
    const detail = firstError ? ` First error: ${firstError.slice(0, 180)}` : ''

    issues.push(createIssue('console-error', `${input.target.route} emitted ${consoleErrors.length} console error(s).${detail}`, 'high'))
  }

  return {
    targetId: input.target.id,
    route: input.target.route,
    title: input.target.title,
    url: input.url,
    viewportId: input.viewportId,
    priority: input.target.priority,
    checked: Array.from(checked),
    passed: issues.length === 0,
    issues
  }
}

export function createDocsA11yRuntimeSummary(results: DocsA11yRuntimeAuditResult[]) {
  const failedResults = results.filter((result) => !result.passed)

  return {
    total: results.length,
    passed: results.length - failedResults.length,
    failed: failedResults.length,
    issueCount: failedResults.reduce((total, result) => total + result.issues.length, 0),
    failedRoutes: Array.from(new Set(failedResults.map((result) => result.route)))
  }
}

export function createDocsA11yRuntimeReport(input: DocsA11yRuntimeReportInput): DocsA11yRuntimeReport {
  return {
    baseUrl: input.baseUrl,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    summary: createDocsA11yRuntimeSummary(input.results),
    results: input.results
  }
}

export function getDocsA11yRuntimeReportView(report: DocsA11yRuntimeReport) {
  const status: DocsA11yRuntimeReportViewStatus = report.summary.total === 0
    ? 'not-run'
    : report.summary.failed === 0
      ? 'passed'
      : 'failed'

  return {
    status,
    label: status === 'not-run'
      ? 'Runtime audit not run'
      : status === 'passed'
        ? 'Runtime audit passed'
        : 'Runtime audit failed',
    detail: status === 'not-run'
      ? 'Run docs:a11y:runtime after starting the docs preview to publish live URL evidence.'
      : `${report.summary.passed}/${report.summary.total} checks passed against ${report.baseUrl}.`,
    failedRoutes: report.summary.failedRoutes,
    generatedAt: report.generatedAt
  }
}
