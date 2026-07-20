import { describe, expect, it } from 'vitest'
import {
  getSourcePanelExperienceItems,
  getSourcePanelExperienceSummary
} from './sourcePanelExperienceQuality'

describe('sourcePanelExperienceQuality', () => {
  it('tracks Element Plus style source panels across docs and live examples', () => {
    const items = getSourcePanelExperienceItems()

    expect(items.map((item) => item.key)).toEqual([
      'doc-demo',
      'live-example'
    ])
    expect(items.every((item) => item.status === 'complete')).toBe(true)
    expect(items.every((item) => item.score === 100)).toBe(true)
    expect(items.every((item) => item.missingChecks.length === 0)).toBe(true)
  })

  it('proves the shared code-reading contract is not just visual styling', () => {
    const items = getSourcePanelExperienceItems()

    items.forEach((item) => {
      expect(item.checks).toEqual(expect.arrayContaining([
        expect.objectContaining({ key: 'element-plus-panel', passed: true }),
        expect.objectContaining({ key: 'top-right-toolbar', passed: true }),
        expect.objectContaining({ key: 'bottom-collapse', passed: true }),
        expect.objectContaining({ key: 'language-switch', passed: true }),
        expect.objectContaining({ key: 'shared-action-model', passed: true }),
        expect.objectContaining({ key: 'copy-source', passed: true })
      ]))
      expect(item.checks.find((check) => check.key === 'element-plus-panel')?.detail).toContain('data-source-panel')
      expect(item.checks.find((check) => check.key === 'top-right-toolbar')?.detail).toContain('code-top-right')
      expect(item.checks.find((check) => check.key === 'bottom-collapse')?.detail).toContain('bottom-collapse')
    })
  })

  it('summarizes the source panel experience as a maturity gate', () => {
    const summary = getSourcePanelExperienceSummary()

    expect(summary.total).toBe(2)
    expect(summary.complete).toBe(2)
    expect(summary.averageScore).toBe(100)
    expect(summary.elementPlusPanels).toBe(2)
    expect(summary.topRightToolbars).toBe(2)
    expect(summary.bottomCollapseBars).toBe(2)
    expect(summary.sharedActionModels).toBe(2)
    expect(summary.copyActions).toBe(2)
    expect(summary.nextQueue).toEqual([])
  })
})
