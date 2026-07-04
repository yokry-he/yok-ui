import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { components } from './componentRegistry'
import {
  accessibilityEvidenceByComponent,
  getAccessibilityEvidence,
  getAccessibilityEvidenceSummary,
  highRiskAccessibilityComponentNames
} from './accessibilityEvidence'

const workspaceRoot = resolve(__dirname, '../../..')

describe('accessibilityEvidence', () => {
  it('classifies every registered component with a traceable evidence profile', () => {
    components.forEach((component) => {
      const evidence = getAccessibilityEvidence(component.name)

      expect(evidence, `Missing accessibility evidence for ${component.name}`).toBeTruthy()
      expect(evidence?.componentName).toBe(component.name)
      expect(evidence?.risk).toMatch(/native|standard|complex|critical/)
      expect(evidence?.categories.length).toBeGreaterThan(0)
      expect(evidence?.summary.length).toBeGreaterThan(12)
    })

    expect(accessibilityEvidenceByComponent.size).toBe(components.length)
  })

  it('requires high-risk components to expose keyboard, focus, aria, docs and test evidence', () => {
    const requiredCategories = ['keyboard', 'focus', 'aria', 'docs', 'tests']

    highRiskAccessibilityComponentNames.forEach((componentName) => {
      const evidence = getAccessibilityEvidence(componentName)

      expect(evidence, `Missing high-risk evidence for ${componentName}`).toBeTruthy()
      expect(evidence?.risk, `${componentName} should be treated as a complex or critical accessibility surface`)
        .toMatch(/complex|critical/)

      requiredCategories.forEach((category) => {
        expect(evidence?.categories, `${componentName} missing ${category} evidence`).toContain(category)
      })
    })
  })

  it('keeps evidence paths real so the maturity page links to existing proof', () => {
    components.forEach((component) => {
      const evidence = getAccessibilityEvidence(component.name)

      evidence?.evidence.docs.forEach((path) => {
        expect(existsSync(resolve(workspaceRoot, path)), `${component.name} missing docs evidence ${path}`).toBe(true)
      })

      evidence?.evidence.tests.forEach((path) => {
        expect(existsSync(resolve(workspaceRoot, path)), `${component.name} missing test evidence ${path}`).toBe(true)
      })
    })
  })

  it('summarizes coverage and high-risk gaps for the maturity dashboard', () => {
    const summary = getAccessibilityEvidenceSummary()

    expect(summary.total).toBe(components.length)
    expect(summary.highRiskTotal).toBe(highRiskAccessibilityComponentNames.length)
    expect(summary.highRiskCovered).toBe(highRiskAccessibilityComponentNames.length)
    expect(summary.highRiskGapCount).toBe(0)
    expect(summary.categoryCoverage.keyboard).toBeGreaterThan(0)
    expect(summary.categoryCoverage.focus).toBeGreaterThan(0)
    expect(summary.categoryCoverage.aria).toBeGreaterThan(0)
    expect(summary.evidenceFileCount).toBeGreaterThan(10)
  })
})
