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
    const elementPlusGrid = items.find((item) => item.key === 'element-plus-grid-layout')
    const elementPlusTable = items.find((item) => item.key === 'element-plus-table')
    const elementPlusCascader = items.find((item) => item.key === 'element-plus-cascader')
    const elementPlusCascaderLazy = items.find((item) => item.key === 'element-plus-cascader-lazy-load')
    const elementPlusDatePicker = items.find((item) => item.key === 'element-plus-date-picker')
    const elementPlusDateTimePicker = items.find((item) => item.key === 'element-plus-date-time-picker')
    const elementPlusInputOtp = items.find((item) => item.key === 'element-plus-input-otp')
    const elementPlusInputTag = items.find((item) => item.key === 'element-plus-input-tag')
    const elementPlusCheckTag = items.find((item) => item.key === 'element-plus-check-tag')
    const elementPlusI18n = items.find((item) => item.key === 'element-plus-config-provider-i18n')
    const elementPlusCompatibility = items.find((item) => item.key === 'element-plus-compatibility-support')
    const antDesignFlex = items.find((item) => item.key === 'ant-design-vue-flex-layout')
    const antDesignTheme = items.find((item) => item.key === 'ant-design-vue-theme-token')
    const antDesignCascaderLoad = items.find((item) => item.key === 'ant-design-vue-cascader-load-data')
    const arcoTokenLab = items.find((item) => item.key === 'arco-design-vue-token-lab')
    const naiveTheme = items.find((item) => item.key === 'naive-ui-theme-system')
    const tdesignEnterprise = items.find((item) => item.key === 'tdesign-vue-next-enterprise-shell')

    expect(benchmarkKeys).toEqual(expect.arrayContaining([
      'element-plus-overview',
      'element-plus-grid-layout',
      'element-plus-table',
      'element-plus-cascader',
      'element-plus-cascader-lazy-load',
      'element-plus-date-picker',
      'element-plus-date-time-picker',
      'element-plus-input-otp',
      'element-plus-input-tag',
      'element-plus-check-tag',
      'element-plus-config-provider-i18n',
      'element-plus-compatibility-support',
      'ant-design-vue-flex-layout',
      'ant-design-vue-theme-token',
      'ant-design-vue-cascader-load-data',
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
      'Element Plus Layout',
      'Element Plus Table',
      'Element Plus Cascader',
      'Element Plus Cascader Dynamic Loading',
      'Element Plus DatePicker',
      'Element Plus DateTimePicker',
      'Element Plus InputOtp',
      'Element Plus InputTag',
      'Element Plus CheckTag',
      'Element Plus ConfigProvider i18n',
      'Element Plus Installation Compatibility',
      'Ant Design Vue Flex',
      'Ant Design Vue Customize Theme',
      'Ant Design Cascader Load Options Lazily',
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

    expect(elementPlusGrid).toMatchObject({
      label: '24-column Row and Col layout',
      status: 'covered'
    })
    expect(elementPlusGrid?.matchedComponents.map((component) => component.name)).toEqual(expect.arrayContaining(['YRow', 'YCol']))
    expect(elementPlusGrid?.evidence.liveExamples).toContain('/components/grid#live-example')

    expect(elementPlusCascader).toMatchObject({
      label: 'Cascader and cascader-panel depth',
      status: 'covered'
    })
    expect(elementPlusCascader?.matchedComponents.map((component) => component.name)).toContain('YCascader')
    expect(elementPlusCascader?.evidence.liveExamples).toContain('/components/cascader#live-example')
    expect(elementPlusCascaderLazy).toMatchObject({
      label: 'Cascader dynamic loading and retry state',
      status: 'covered'
    })
    expect(elementPlusCascaderLazy?.evidence.capabilities).toEqual(expect.arrayContaining([
      'lazy-cascader-loading',
      'load-error-retry'
    ]))

    expect(elementPlusDatePicker).toMatchObject({
      label: 'Date picker shortcuts and disabled dates',
      status: 'covered'
    })
    expect(elementPlusDatePicker?.matchedComponents.map((component) => component.name)).toContain('YDatePicker')
    expect(elementPlusDatePicker?.evidence.liveExamples).toContain('/components/date-picker#live-example')

    expect(elementPlusDateTimePicker).toMatchObject({
      label: 'Date time picker form workflows',
      status: 'covered'
    })
    expect(elementPlusDateTimePicker?.matchedComponents.map((component) => component.name)).toContain('YDateTimePicker')
    expect(elementPlusDateTimePicker?.evidence.docs).toContain('/components/date-time-picker')
    expect(elementPlusDateTimePicker?.evidence.liveExamples).toContain('/components/date-time-picker#live-example')

    expect(elementPlusInputOtp).toMatchObject({
      label: 'InputOtp one-time password entry',
      status: 'covered'
    })
    expect(elementPlusInputOtp?.matchedComponents.map((component) => component.name)).toContain('YInputOtp')
    expect(elementPlusInputOtp?.evidence.liveExamples).toContain('/components/input-otp#live-example')

    expect(elementPlusInputTag).toMatchObject({
      label: 'InputTag free-form tag entry',
      status: 'covered'
    })
    expect(elementPlusInputTag?.matchedComponents.map((component) => component.name)).toContain('YInputTag')
    expect(elementPlusInputTag?.evidence.liveExamples).toContain('/components/input-tag#live-example')

    expect(elementPlusCheckTag).toMatchObject({
      label: 'Checkable tag filters',
      status: 'covered'
    })
    expect(elementPlusCheckTag?.matchedComponents.map((component) => component.name)).toContain('YCheckTag')
    expect(elementPlusCheckTag?.evidence.docs).toContain('/components/tag-badge')
    expect(elementPlusCheckTag?.evidence.liveExamples).toContain('/components/tag-badge#live-example')
    expect(elementPlusCheckTag?.evidence.capabilities).toEqual(expect.arrayContaining([
      'checkable-tag',
      'aria-pressed'
    ]))

    expect(elementPlusI18n).toMatchObject({
      label: 'ConfigProvider locale and global settings',
      status: 'covered'
    })
    expect(elementPlusI18n?.matchedComponents.map((component) => component.name)).toContain('YConfigProvider')
    expect(elementPlusI18n?.evidence.docs).toContain('/components/config-provider')

    expect(elementPlusCompatibility).toMatchObject({
      label: 'Compatibility and support matrix',
      status: 'covered'
    })
    expect(elementPlusCompatibility?.evidence.docs).toContain('/resources/support')
    expect(elementPlusCompatibility?.evidence.capabilities).toEqual(expect.arrayContaining([
      'browser-baseline',
      'support-matrix'
    ]))

    expect(antDesignTheme).toMatchObject({
      label: 'Design token customization through ConfigProvider',
      status: 'covered'
    })
    expect(antDesignTheme?.source.library).toBe('Ant Design Vue')
    expect(antDesignTheme?.matchedComponents.map((component) => component.name)).toContain('YThemeProvider')
    expect(antDesignTheme?.evidence.resources).toContain('/resources/theme-lab')

    expect(antDesignFlex).toMatchObject({
      label: 'Flex layout without child wrappers',
      status: 'covered'
    })
    expect(antDesignFlex?.source.library).toBe('Ant Design Vue')
    expect(antDesignFlex?.matchedComponents.map((component) => component.name)).toContain('YFlex')
    expect(antDesignFlex?.evidence.liveExamples).toContain('/components/flex#live-example')

    expect(antDesignCascaderLoad).toMatchObject({
      label: 'Cascader loadData remote expansion',
      status: 'covered'
    })
    expect(antDesignCascaderLoad?.matchedComponents.map((component) => component.name)).toContain('YCascader')

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
