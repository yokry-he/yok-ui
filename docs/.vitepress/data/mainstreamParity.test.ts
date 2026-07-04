import { describe, expect, it } from 'vitest'
import {
  getMainstreamParityItems,
  getMainstreamParitySummary,
  mainstreamBenchmarks
} from './mainstreamParity'

describe('mainstreamParity', () => {
  it('tracks Yok UI against external mainstream component-library benchmarks', () => {
    const summary = getMainstreamParitySummary()
    const benchmarkKeys = mainstreamBenchmarks.map((benchmark) => benchmark.key)
    const items = getMainstreamParityItems()
    const elementPlusOverview = items.find((item) => item.key === 'element-plus-overview')
    const elementPlusTable = items.find((item) => item.key === 'element-plus-table')
    const elementPlusCascader = items.find((item) => item.key === 'element-plus-cascader')
    const elementPlusDatePicker = items.find((item) => item.key === 'element-plus-date-picker')
    const elementPlusI18n = items.find((item) => item.key === 'element-plus-config-provider-i18n')
    const antDesignTheme = items.find((item) => item.key === 'ant-design-vue-theme-token')
    const arcoTokenLab = items.find((item) => item.key === 'arco-design-vue-token-lab')
    const naiveTheme = items.find((item) => item.key === 'naive-ui-theme-system')
    const tdesignEnterprise = items.find((item) => item.key === 'tdesign-vue-next-enterprise-shell')

    expect(benchmarkKeys).toEqual(expect.arrayContaining([
      'element-plus-overview',
      'element-plus-table',
      'element-plus-cascader',
      'element-plus-date-picker',
      'element-plus-config-provider-i18n',
      'ant-design-vue-theme-token',
      'arco-design-vue-token-lab',
      'naive-ui-theme-system',
      'tdesign-vue-next-enterprise-shell'
    ]))
    expect(summary.total).toBeGreaterThanOrEqual(12)
    expect(summary.libraryCount).toBeGreaterThanOrEqual(5)
    expect(summary.externalSources).toBeGreaterThanOrEqual(9)
    expect(summary.covered).toBeGreaterThan(0)
    expect(summary.coverageRate).toBeGreaterThanOrEqual(80)
    expect(summary.nextQueue.length).toBeLessThanOrEqual(summary.total - summary.covered)
    expect(summary.libraryLabels).toEqual(expect.arrayContaining([
      'Element Plus',
      'Ant Design Vue',
      'Arco Design Vue',
      'Naive UI',
      'TDesign Vue Next'
    ]))
    expect(summary.sourceLabels).toEqual(expect.arrayContaining([
      'Element Plus Overview',
      'Element Plus Table',
      'Element Plus Cascader',
      'Element Plus DatePicker',
      'Element Plus ConfigProvider i18n',
      'Ant Design Vue Customize Theme',
      'Arco Design Vue Design Token',
      'Naive UI Homepage',
      'TDesign Vue Next Overview'
    ]))

    expect(elementPlusOverview).toMatchObject({
      label: 'Component overview and category IA',
      status: 'covered'
    })
    expect(elementPlusOverview?.matchedComponents.length).toBeGreaterThanOrEqual(70)
    expect(elementPlusOverview?.evidence.docs).toContain('/components/')
    expect(elementPlusOverview?.evidence.resources).toContain('/resources/maturity')

    expect(elementPlusTable).toMatchObject({
      label: 'Data table sorting, filtering and comparison',
      status: 'covered'
    })
    expect(elementPlusTable?.matchedComponents.map((component) => component.name)).toContain('YTable')
    expect(elementPlusTable?.evidence.liveExamples).toContain('/components/table#live-example')

    expect(elementPlusCascader).toMatchObject({
      label: 'Cascader and cascader-panel depth',
      status: 'covered'
    })
    expect(elementPlusCascader?.matchedComponents.map((component) => component.name)).toContain('YCascader')
    expect(elementPlusCascader?.evidence.liveExamples).toContain('/components/cascader#live-example')

    expect(elementPlusDatePicker).toMatchObject({
      label: 'Date picker shortcuts and disabled dates',
      status: 'covered'
    })
    expect(elementPlusDatePicker?.matchedComponents.map((component) => component.name)).toContain('YDatePicker')
    expect(elementPlusDatePicker?.evidence.liveExamples).toContain('/components/date-picker#live-example')

    expect(elementPlusI18n).toMatchObject({
      label: 'ConfigProvider locale and global settings',
      status: 'covered'
    })
    expect(elementPlusI18n?.matchedComponents.map((component) => component.name)).toContain('YConfigProvider')
    expect(elementPlusI18n?.evidence.docs).toContain('/components/config-provider')

    expect(antDesignTheme).toMatchObject({
      label: 'Design token customization through ConfigProvider',
      status: 'covered'
    })
    expect(antDesignTheme?.source.library).toBe('Ant Design Vue')
    expect(antDesignTheme?.matchedComponents.map((component) => component.name)).toContain('YThemeProvider')
    expect(antDesignTheme?.evidence.resources).toContain('/resources/theme-lab')

    expect(arcoTokenLab).toMatchObject({
      label: 'Design token inventory and visual theme lab',
      status: 'covered'
    })
    expect(arcoTokenLab?.source.library).toBe('Arco Design Vue')
    expect(arcoTokenLab?.evidence.resources).toContain('/resources/theme-lab')

    expect(naiveTheme).toMatchObject({
      label: 'TypeScript-first theme system and tree-shakable suite',
      status: 'covered'
    })
    expect(naiveTheme?.source.library).toBe('Naive UI')
    expect(naiveTheme?.matchedComponents.map((component) => component.name)).toContain('YConfigProvider')

    expect(tdesignEnterprise).toMatchObject({
      label: 'Enterprise desktop shell and starter workflow',
      status: 'covered'
    })
    expect(tdesignEnterprise?.source.library).toBe('TDesign Vue Next')
    expect(tdesignEnterprise?.matchedComponents.map((component) => component.name)).toContain('YDataTable')
  })
})
