import { describe, expect, it } from 'vitest'
import type { ComponentMeta } from './componentRegistry'
import { componentApis, components } from './componentRegistry'
import { getComponentQualityItems, getComponentQualityScore } from './componentQuality'
import { liveExampleProfileByDocs } from './liveExamples'

function getComponent(name: string): ComponentMeta {
  const component = components.find((item) => item.name === name)

  if (!component) {
    throw new Error(`Missing component ${name}`)
  }

  return component
}

describe('componentQuality', () => {
  it('scores a fully documented component from registry evidence', () => {
    const button = getComponent('YButton')
    const items = getComponentQualityItems(
      button,
      componentApis.YButton,
      liveExampleProfileByDocs.get(button.docs)
    )

    expect(items.map((item) => item.key)).toEqual([
      'api',
      'api-live',
      'live',
      'source',
      'repro',
      'accessibility',
      'theme',
      'keyboard'
    ])
    expect(items.find((item) => item.key === 'api')?.value).toBe('Structured')
    expect(items.find((item) => item.key === 'api-live')?.value).toBe('Linked')
    expect(items.find((item) => item.key === 'api-live')?.detail).toContain('API rows 全部可反链')
    expect(items.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(items.find((item) => item.key === 'source')?.value).toBe('Complete')
    expect(items.find((item) => item.key === 'source')?.detail).toContain('source workflow checks passed')
    expect(items.find((item) => item.key === 'repro')?.value).toBe('Bundle')
    expect(items.find((item) => item.key === 'accessibility')?.value).toBe('Complex covered')
    expect(items.find((item) => item.key === 'theme')?.value).toBe('Token linked')
    expect(items.find((item) => item.key === 'theme')?.detail).toContain('YButton.vue')
    expect(items.find((item) => item.key === 'theme')?.detail).toContain('token 引用')
    expect(items.find((item) => item.key === 'keyboard')?.value).toBe('Verified')
    expect(getComponentQualityScore(items)).toBe(100)
  })

  it('keeps missing API and live examples visible as quality warnings', () => {
    const qualityProbe: ComponentMeta = {
      name: 'YQualityProbe',
      title: 'Quality Probe',
      packageName: '@yok-ui/core',
      family: 'overlay',
      status: 'Beta',
      docs: '/components/quality-probe',
      description: '用于验证质量缺口提示的测试夹具。',
      since: '0.0.0',
      accessibility: 'documented'
    }
    const items = getComponentQualityItems(qualityProbe, undefined)

    expect(items.find((item) => item.key === 'api')?.tone).toBe('warning')
    expect(items.find((item) => item.key === 'api-live')?.tone).toBe('warning')
    expect(items.find((item) => item.key === 'live')?.tone).toBe('warning')
    expect(items.find((item) => item.key === 'source')?.tone).toBe('warning')
    expect(items.find((item) => item.key === 'repro')?.tone).toBe('warning')
    expect(items.find((item) => item.key === 'keyboard')?.value).toBe('Needed')
    expect(getComponentQualityScore(items)).toBe(13)
  })

  it('uses interaction contracts as keyboard quality evidence', () => {
    const select = getComponent('YSelect')
    const items = getComponentQualityItems(
      select,
      componentApis.YSelect,
      liveExampleProfileByDocs.get(select.docs)
    )

    expect(items.find((item) => item.key === 'keyboard')?.value).toBe('Verified')
    expect(items.find((item) => item.key === 'keyboard')?.tone).toBe('success')
    expect(items.find((item) => item.key === 'keyboard')?.detail).toContain('Combobox')
  })

  it('distinguishes source-first live examples from guided examples', () => {
    const message = getComponent('YMessage')
    const items = getComponentQualityItems(
      message,
      componentApis.YMessage,
      {
        docs: message.docs,
        preset: 'message',
        mode: 'source-first',
        capabilities: ['safe-template', 'editable-source', 'responsive-preview', 'source-copy', 'repro-bundle', 'event-log', 'drafts'],
        scenarioDepth: 'props',
        scenarios: []
      }
    )

    expect(items.find((item) => item.key === 'live')?.value).toBe('Source-first')
    expect(items.find((item) => item.key === 'live')?.tone).toBe('info')
    expect(items.find((item) => item.key === 'source')?.tone).toBe('warning')
    expect(items.find((item) => item.key === 'repro')?.value).toBe('Bundle')
    expect(getComponentQualityScore(items)).toBe(88)
  })

  it('marks scenario-rich live examples as workflow quality evidence', () => {
    const modal = getComponent('YModal')
    const items = getComponentQualityItems(
      modal,
      componentApis.YModal,
      liveExampleProfileByDocs.get(modal.docs)
    )

    expect(items.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(items.find((item) => item.key === 'live')?.detail).toContain('workflow 场景')
  })

  it('marks newly guided product examples as workflow quality evidence', () => {
    const commandPalette = getComponent('YCommandPalette')
    const items = getComponentQualityItems(
      commandPalette,
      componentApis.YCommandPalette,
      liveExampleProfileByDocs.get(commandPalette.docs)
    )

    expect(items.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(items.find((item) => item.key === 'live')?.detail).toContain('workflow 场景')
  })

  it('marks message examples as workflow quality evidence after scenario coverage', () => {
    const message = getComponent('YMessage')
    const items = getComponentQualityItems(
      message,
      componentApis.YMessage,
      liveExampleProfileByDocs.get(message.docs)
    )

    expect(items.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(items.find((item) => item.key === 'live')?.detail).toContain('workflow 场景')
  })
})
