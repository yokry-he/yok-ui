import { describe, expect, it } from 'vitest'
import {
  getLiveExampleReadinessItems,
  getLiveExampleReadinessSummary
} from './liveExampleReadiness'
import { liveExampleProfiles } from './liveExamples'

describe('liveExampleReadiness', () => {
  it('scores every live example profile with capability and scenario checks', () => {
    const items = getLiveExampleReadinessItems()

    expect(items).toHaveLength(liveExampleProfiles.length)
    expect(items.every((item) => item.checks.length >= 14)).toBe(true)
    expect(items.every((item) => item.checks.some((check) => check.key === 'repro-bundle' && check.passed))).toBe(true)
    expect(items.every((item) => item.score >= 0 && item.score <= 100)).toBe(true)
    expect(items.every((item) => item.title && item.packageName && item.familyTitle)).toBe(true)
  })

  it('marks mature workflow examples as excellent readiness evidence', () => {
    const button = getLiveExampleReadinessItems().find((item) => item.preset === 'button')

    expect(button?.status).toBe('excellent')
    expect(button?.score).toBe(100)
    expect(button?.missingChecks).toEqual([])
  })

  it.each([
    'tree',
    'transfer',
    'crudLayout',
    'searchForm',
    'resourcePage',
    'drawer',
    'card',
    'configProvider',
    'dataView',
    'fieldArray',
    'formSummary',
    'link',
    'scrollbar',
    'space',
    'splitter',
    'text',
    'descriptions',
    'schemaForm',
    'tooltip',
    'table',
    'dataTable',
    'treeSelect'
  ] as const)(
    'keeps %s out of the readiness depth queue',
    (preset) => {
      const item = getLiveExampleReadinessItems().find((entry) => entry.preset === preset)

      expect(item?.status).toBe('excellent')
      expect(item?.score).toBe(100)
      expect(item?.missingChecks).toEqual([])
    }
  )

  it('summarizes readiness and exposes the next depth queue', () => {
    const summary = getLiveExampleReadinessSummary()

    expect(summary.total).toBe(liveExampleProfiles.length)
    expect(summary.averageScore).toBeGreaterThan(70)
    expect(summary.workflowReady).toBeGreaterThan(0)
    expect(summary.keyboardScenarioCoverage).toBeGreaterThan(0)
    expect(summary.responsiveScenarioCoverage).toBeGreaterThan(0)
    expect(summary.edgeStateCoverage).toBeGreaterThan(0)
    expect(summary.excellent).toBe(summary.total)
    expect(summary.nextQueue).toHaveLength(0)
    expect(summary.nextQueue.every((item) => item.missingChecks.length > 0)).toBe(true)
  })

  it('exposes workflow-ready and props-only detail lists for maturity dashboards', () => {
    const summary = getLiveExampleReadinessSummary()

    expect(summary.workflowReadyItems).toHaveLength(summary.workflowReady)
    expect(summary.workflowReadyItems.every((item) => item.scenarioDepth === 'workflow')).toBe(true)
    expect(
      summary.workflowReadyItems.every((item) =>
        item.checks.some((check) => check.key === 'workflow-scenarios' && check.passed)
      )
    ).toBe(true)
    expect(summary.propsOnlyItems.every((item) => item.scenarioDepth === 'props')).toBe(true)
    expect(summary.propsOnlyItems).toHaveLength(0)
  })
})
