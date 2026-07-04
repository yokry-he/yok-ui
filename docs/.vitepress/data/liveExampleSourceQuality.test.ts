import { describe, expect, it } from 'vitest'
import {
  getLiveExampleSourceQualityItem,
  getLiveExampleSourceQualityItems,
  getLiveExampleSourceQualitySummary
} from './liveExampleSourceQuality'
import { liveExampleProfileByPreset, liveExampleProfiles } from './liveExamples'

describe('liveExampleSourceQuality', () => {
  it('scores every live example with source workflow evidence', () => {
    const items = getLiveExampleSourceQualityItems()

    expect(items).toHaveLength(liveExampleProfiles.length)
    expect(items.every((item) => item.checks.length >= 11)).toBe(true)
    expect(items.every((item) => item.status === 'complete')).toBe(true)
    expect(items.every((item) => item.score === 100)).toBe(true)
    expect(items.every((item) => item.missingChecks.length === 0)).toBe(true)
  })

  it('proves DataTable source quality with API map and Playground handoff', () => {
    const dataTable = liveExampleProfileByPreset.get('dataTable')

    expect(dataTable).toBeTruthy()

    const item = getLiveExampleSourceQualityItem(dataTable!)

    expect(item.playgroundComponent).toBe('dataTable')
    expect(item.apiCoverageRate).toBe(100)
    expect(item.apiRows).toBeGreaterThan(0)
    expect(item.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'safe-editable-source', passed: true }),
      expect.objectContaining({ key: 'source-copy-modes', passed: true }),
      expect.objectContaining({ key: 'install-command', passed: true }),
      expect.objectContaining({ key: 'repro-bundle', passed: true }),
      expect.objectContaining({ key: 'api-map', passed: true }),
      expect.objectContaining({ key: 'playground-handoff', passed: true }),
      expect.objectContaining({ key: 'source-panel-handoff', passed: true }),
      expect.objectContaining({ key: 'playground-edit-share', passed: true }),
      expect.objectContaining({ key: 'scenario-share-link', passed: true }),
      expect.objectContaining({ key: 'state-share-link', passed: true }),
      expect.objectContaining({ key: 'event-repro', passed: true })
    ]))
    expect(item.checks.find((check) => check.key === 'api-map')?.detail).toContain('API rows')
    expect(item.checks.find((check) => check.key === 'playground-handoff')?.detail).toContain('/playground/?component=dataTable')
    expect(item.checks.find((check) => check.key === 'source-panel-handoff')?.detail).toContain('sourcePanel')
    expect(item.checks.find((check) => check.key === 'playground-edit-share')?.detail).toContain('编辑后的源码')
  })

  it('summarizes source quality without hiding future gaps', () => {
    const summary = getLiveExampleSourceQualitySummary()

    expect(summary.total).toBe(liveExampleProfiles.length)
    expect(summary.averageScore).toBe(100)
    expect(summary.complete).toBe(summary.total)
    expect(summary.partial).toBe(0)
    expect(summary.missing).toBe(0)
    expect(summary.apiMapped).toBe(summary.total)
    expect(summary.playgroundLinked).toBe(summary.total)
    expect(summary.sourcePanelHandoffReady).toBe(summary.total)
    expect(summary.playgroundEditShareReady).toBe(summary.total)
    expect(summary.reproReady).toBe(summary.total)
    expect(summary.sourceCopyReady).toBe(summary.total)
    expect(summary.nextQueue).toEqual([])
  })
})
