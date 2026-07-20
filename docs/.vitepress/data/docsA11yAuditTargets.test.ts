import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { topNavItems } from '../config'
import {
  accessibilityEvidenceProfiles,
  highRiskAccessibilityComponentNames
} from './accessibilityEvidence'
import {
  docsA11yAuditTargets,
  docsA11yAuditViewports,
  getDocsA11yAuditSummary,
  getDocsA11yAuditTarget
} from './docsA11yAuditTargets'

const workspaceRoot = resolve(__dirname, '../../..')

function routeToDocsPath(route: string) {
  const cleanRoute = route.replace(/\/$/, '')

  if (!cleanRoute || cleanRoute === '/guide') {
    return 'docs/guide/index.md'
  }

  if (cleanRoute === '/components') {
    return 'docs/components/index.md'
  }

  if (cleanRoute === '/resources') {
    return 'docs/resources/index.md'
  }

  if (cleanRoute === '/packages') {
    return 'docs/packages/index.md'
  }

  if (cleanRoute === '/source') {
    return 'docs/source/index.md'
  }

  return `docs${cleanRoute}.md`
}

describe('docsA11yAuditTargets', () => {
  it('covers every top-level navigation route and the maturity dashboard', () => {
    const targetedRoutes = new Set(docsA11yAuditTargets.map((target) => target.route.replace(/\/$/, '')))

    topNavItems.forEach((item) => {
      expect(targetedRoutes.has(item.link.replace(/\/$/, '')), `Missing top nav audit target ${item.link}`).toBe(true)
    })

    expect(targetedRoutes.has('/resources/maturity')).toBe(true)
    expect(targetedRoutes.has('/resources/live-examples')).toBe(true)
    expect(targetedRoutes.has('/resources/support')).toBe(true)
    expect(targetedRoutes.has('/guide/installation')).toBe(true)
    expect(targetedRoutes.has('/packages/resolver')).toBe(true)
  })

  it('turns every high-risk accessibility component into a component-page audit target', () => {
    highRiskAccessibilityComponentNames.forEach((componentName) => {
      const profile = accessibilityEvidenceProfiles.find((item) => item.componentName === componentName)

      expect(profile, `Missing evidence profile for ${componentName}`).toBeTruthy()

      const target = getDocsA11yAuditTarget(profile!.docsRoute)

      expect(target, `Missing audit target for ${componentName}`).toBeTruthy()
      expect(target?.priority, `${componentName} should stay high priority`).toMatch(/critical|high/)
      expect(target?.checks).toEqual(expect.arrayContaining(['keyboard', 'focus', 'aria', 'responsive']))
      expect(target?.evidence.data).toContain('docs/.vitepress/data/accessibilityEvidence.ts')
    })
  })

  it('requires critical component demos to stay inside the audit target matrix', () => {
    const criticalProfiles = accessibilityEvidenceProfiles.filter((profile) => profile.risk === 'critical')

    criticalProfiles.forEach((profile) => {
      const target = getDocsA11yAuditTarget(profile.docsRoute)

      expect(target?.checks, `${profile.componentName} should audit demos`).toContain('demo')
      expect(target?.route).toBe(profile.docsRoute)
    })
  })

  it('declares practical desktop and mobile viewport coverage for every target', () => {
    const viewportIds = new Set(docsA11yAuditViewports.map((viewport) => viewport.id))

    expect(docsA11yAuditViewports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'desktop', width: 1280 }),
        expect.objectContaining({ id: 'mobile', width: 390 })
      ])
    )

    docsA11yAuditTargets.forEach((target) => {
      expect(target.viewports.length, `${target.route} should include viewports`).toBeGreaterThanOrEqual(2)

      target.viewports.forEach((viewportId) => {
        expect(viewportIds.has(viewportId), `${target.route} references missing viewport ${viewportId}`).toBe(true)
      })
    })
  })

  it('links every audit target to real docs, data, and test evidence', () => {
    docsA11yAuditTargets.forEach((target) => {
      expect(existsSync(resolve(workspaceRoot, routeToDocsPath(target.route))), `${target.route} docs page is missing`).toBe(true)

      const evidencePaths = [
        ...target.evidence.docs,
        ...target.evidence.data,
        ...target.evidence.tests
      ]

      expect(evidencePaths.length, `${target.route} needs evidence paths`).toBeGreaterThan(0)

      evidencePaths.forEach((path) => {
        expect(existsSync(resolve(workspaceRoot, path)), `${target.route} missing evidence ${path}`).toBe(true)
      })
    })
  })

  it('summarizes the audit matrix for the maturity dashboard', () => {
    const summary = getDocsA11yAuditSummary()

    expect(summary.total).toBe(docsA11yAuditTargets.length)
    expect(summary.critical).toBeGreaterThan(0)
    expect(summary.high).toBeGreaterThan(0)
    expect(summary.mobileCoverageRate).toBe(100)
    expect(summary.demoTargets).toBeGreaterThan(0)
    expect(summary.checkCoverage.keyboard).toBeGreaterThan(0)
    expect(summary.checkCoverage.responsive).toBe(docsA11yAuditTargets.length)
  })
})
