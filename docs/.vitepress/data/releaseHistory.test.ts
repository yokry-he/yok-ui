import { describe, expect, it } from 'vitest'
import { getReleaseWorkflowSummary } from './releaseWorkflow'
import { getReleaseHistorySummary } from './releaseHistory'

describe('releaseHistory', () => {
  it('uses the active release workflow as the latest version-history entry', () => {
    const workflow = getReleaseWorkflowSummary()
    const history = getReleaseHistorySummary()
    const latest = history.entries[0]

    expect(latest.version).toBe(workflow.targetVersion)
    expect(latest.status).toBe('release-candidate')
    expect(latest.packageSections).toHaveLength(workflow.releasePackages.length)
    expect(latest.packageSections.reduce((total, section) => total + section.items.length, 0)).toBe(workflow.candidateCount)
    expect(latest.evidenceLinks.map((link) => link.href)).toEqual(expect.arrayContaining([
      '/resources/release',
      '/resources/maturity'
    ]))
  })

  it('groups changelog items by mainstream release categories and package scope', () => {
    const history = getReleaseHistorySummary()

    expect(history.filters.map((filter) => filter.key)).toEqual([
      'all',
      'stable-promotions',
      'documentation',
      'accessibility',
      'build'
    ])
    expect(history.entries.length).toBeGreaterThanOrEqual(2)
    expect(history.entries[0].items.map((item) => item.type)).toEqual(expect.arrayContaining([
      'stable-promotions',
      'documentation',
      'accessibility',
      'build'
    ]))
    expect(history.entries[0].packageSections.every((section) => section.packageName.startsWith('@yok-ui/'))).toBe(true)
  })
})
