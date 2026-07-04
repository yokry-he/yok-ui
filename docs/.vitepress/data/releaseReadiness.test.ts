import { describe, expect, it } from 'vitest'
import { getReleaseReadinessItems, getReleaseReadinessSummary } from './releaseReadiness'

describe('releaseReadiness', () => {
  it('promotes only non-stable components that pass every release gate', () => {
    const items = getReleaseReadinessItems()
    const candidates = items.filter((item) => item.releaseCandidate)

    expect(candidates.length).toBeGreaterThan(0)
    expect(candidates.every((item) => item.status !== 'Stable')).toBe(true)
    expect(candidates.every((item) => item.missingGates.length === 0)).toBe(true)
    expect(candidates.every((item) => item.score === 100)).toBe(true)
    expect(candidates[0].gates.map((gate) => gate.key)).toEqual([
      'api',
      'api-live',
      'workflow-live',
      'source-quality',
      'playground-edit-share',
      'theme',
      'component-maturity',
      'a11y',
      'interaction-contract'
    ])
    expect(candidates[0].gates.find((gate) => gate.key === 'playground-edit-share')).toMatchObject({
      label: 'Edited Source Share',
      passed: true
    })
  })

  it('summarizes release candidates and blocked non-stable components for the maturity dashboard', () => {
    const summary = getReleaseReadinessSummary()

    expect(summary.total).toBeGreaterThan(0)
    expect(summary.nonStable).toBe(summary.candidateCount + summary.blockedCount)
    expect(summary.candidates).toHaveLength(summary.candidateCount)
    expect(summary.blocked).toHaveLength(summary.blockedCount)
    expect(summary.candidates.every((item) => item.releaseCandidate)).toBe(true)
    expect(summary.blocked.every((item) => !item.releaseCandidate)).toBe(true)
    expect(summary.gateLabels).toEqual('API Live / Workflow Live / Source / Edited Source Share / Theme / A11y')
  })
})
