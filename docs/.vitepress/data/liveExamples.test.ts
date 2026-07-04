import { describe, expect, it } from 'vitest'
import { components } from './componentRegistry'
import {
  defaultLiveExampleCapabilities,
  getLiveExampleComponentMeta,
  getLiveExampleLabel,
  getLiveExampleMatrixSummary,
  getLiveExampleScenarios,
  getLiveExampleValidationSummary,
  hasScenarioRichPreset,
  hasVisualControlPreset,
  hasWorkflowScenarios,
  liveExampleCoverage,
  liveExampleDocs,
  liveExampleProfileByDocs,
  liveExampleProfileByPreset,
  liveExampleProfiles,
  liveExampleScenarios,
  scenarioRichPresets,
  visualControlPresets
} from './liveExamples'

describe('liveExamples', () => {
  it('keeps every live example profile aligned with coverage routes', () => {
    expect(liveExampleProfiles).toHaveLength(liveExampleCoverage.length)

    liveExampleCoverage.forEach((item) => {
      const profile = liveExampleProfileByDocs.get(item.docs)

      expect(profile?.preset).toBe(item.preset)
      expect(profile?.capabilities).toEqual(
        expect.arrayContaining(defaultLiveExampleCapabilities)
      )
      expect(profile?.capabilities).toContain('repro-bundle')
      expect(liveExampleProfileByPreset.get(item.preset)?.docs).toBe(item.docs)
      expect(profile?.scenarioDepth).toMatch(/props|workflow/)
      expect(liveExampleDocs).toContain(item.docs)
    })
  })

  it('builds a live example matrix summary for resource-level quality review', () => {
    const matrix = getLiveExampleMatrixSummary()
    const buttonRow = matrix.rows.find((row) => row.preset === 'button')

    expect(matrix.total).toBe(liveExampleCoverage.length)
    expect(matrix.guidedCount).toBe(liveExampleCoverage.length)
    expect(matrix.workflowReadyCount).toBeGreaterThan(50)
    expect(matrix.scenarioCount).toBeGreaterThan(400)
    expect(matrix.averageScore).toBeGreaterThanOrEqual(75)
    expect(matrix.packageGroups.map((group) => group.packageName)).toEqual(expect.arrayContaining([
      '@yok-ui/core',
      '@yok-ui/product',
      '@yok-ui/admin',
      '@yok-ui/brand'
    ]))
    expect(buttonRow).toMatchObject({
      preset: 'button',
      title: 'Button',
      componentName: 'YButton',
      docs: '/components/button',
      modeLabel: 'Guided workflow',
      workflowReady: true,
      handoffHref: '/components/button#live-example'
    })
    expect(buttonRow?.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'keyboard', 'responsive']))
    expect(matrix.attentionRows.length).toBeGreaterThan(0)
    expect(matrix.attentionRows[0].score).toBeLessThanOrEqual(matrix.attentionRows.at(-1)?.score ?? 100)
  })

  it('derives live example component metadata from the registry', () => {
    liveExampleProfiles.forEach((profile) => {
      const registryItems = components.filter((component) => component.docs === profile.docs)

      expect(registryItems.length, `${profile.preset} is missing registry entries`).toBeGreaterThan(0)
      expect(profile.component.docs).toBe(profile.docs)
      expect(profile.component.componentNames).toEqual(registryItems.map((component) => component.name))
      expect(profile.component.docsTitle).toBe(registryItems.map((component) => component.title).join(' / '))
      expect(profile.component.packageName).toBe(registryItems[0].packageName)
      expect(profile.component.familyTitle).toBeTruthy()
      expect(getLiveExampleComponentMeta(profile.preset)?.componentName).toBe(profile.component.componentName)
      expect(getLiveExampleLabel(profile.preset)).toBe(profile.component.title)
    })
  })

  it('marks visual-control examples as guided examples', () => {
    visualControlPresets.forEach((preset) => {
      const profile = liveExampleProfiles.find((item) => item.preset === preset)

      expect(profile, `Missing live example coverage for ${preset}`).toBeTruthy()
      expect(profile?.mode).toBe('guided')
      expect(profile?.capabilities).toContain('visual-props')
      expect(hasVisualControlPreset(preset)).toBe(true)
    })
  })

  it('keeps every registered component live example in guided mode', () => {
    expect(liveExampleProfiles.every((profile) => profile.mode === 'guided')).toBe(true)
    expect(liveExampleProfiles.every((profile) => profile.capabilities.includes('visual-props'))).toBe(true)
  })

  it('tracks workflow-level live examples for complex components', () => {
    const expectedWorkflowPresets = [
      'affix',
      'anchor',
      'button',
      'calendar',
      'carousel',
      'cascader',
      'checkbox',
      'codeBlock',
      'configProvider',
      'crudLayout',
      'dataView',
      'dataTable',
      'dateRangePicker',
      'backtop',
      'divider',
      'drawer',
      'fieldArray',
      'floatButton',
      'form',
      'formItem',
      'formSummary',
      'input',
      'image',
      'commandPalette',
      'filterTabs',
      'link',
      'loading',
      'avatar',
      'breadcrumb',
      'brandHero',
      'bulkActionBar',
      'dataToolbar',
      'featureGrid',
      'logoCloud',
      'metricCard',
      'modal',
      'notification',
      'pageHeader',
      'profileCard',
      'popover',
      'progress',
      'radioGroup',
      'approvalCommentBox',
      'reviewWorkflow',
      'resourcePage',
      'savedViews',
      'searchPanel',
      'searchForm',
      'schemaForm',
      'scrollbar',
      'segmented',
      'select',
      'inputTag',
      'space',
      'splitter',
      'steps',
      'statusTimeline',
      'switch',
      'table',
      'tabs',
      'tagBadge',
      'text',
      'textarea',
      'themeProvider',
      'themeSwitcher',
      'tooltip',
      'transfer',
      'tree',
      'treeSelect',
      'upload',
      'virtualList',
      'watermark'
    ]

    expect(scenarioRichPresets).toEqual(expect.arrayContaining(expectedWorkflowPresets))

    scenarioRichPresets.forEach((preset) => {
      const profile = liveExampleProfiles.find((item) => item.preset === preset)

      expect(profile, `Missing scenario rich profile for ${preset}`).toBeTruthy()
      expect(profile?.mode).toBe('guided')
      expect(profile?.scenarioDepth).toBe('workflow')
      expect(profile?.capabilities).toEqual(expect.arrayContaining(['scenario-switching', 'workflow-states']))
      expect(hasScenarioRichPreset(preset)).toBe(true)
      expect(hasWorkflowScenarios(preset)).toBe(true)
      expect(getLiveExampleScenarios(preset).length).toBeGreaterThanOrEqual(3)
      expect(getLiveExampleScenarios(preset).every((scenario) => typeof scenario.controlValue !== 'undefined')).toBe(true)
    })
  })

  it('keeps workflow scenario evidence aligned with scenario rich presets', () => {
    const scenarioPresets = Object.keys(liveExampleScenarios).sort()

    expect(scenarioPresets).toEqual([...scenarioRichPresets].sort())

    Object.entries(liveExampleScenarios).forEach(([preset, scenarios]) => {
      const keys = scenarios.map((scenario) => scenario.key)
      const labels = scenarios.map((scenario) => scenario.label)

      expect(new Set(keys).size, `Duplicate scenario keys for ${preset}`).toBe(keys.length)
      expect(new Set(labels).size, `Duplicate scenario labels for ${preset}`).toBe(labels.length)
      expect(scenarios.every((scenario) => scenario.description.length > 12)).toBe(true)
    })
  })

  it('builds validation summary data for live example acceptance panels', () => {
    const summary = getLiveExampleValidationSummary('dataTable')

    expect(summary.modeLabel).toBe('Guided workflow')
    expect(summary.capabilityCount).toBeGreaterThanOrEqual(9)
    expect(summary.scenarioCount).toBe(12)
    expect(summary.workflowReady).toBe(true)
    expect(summary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'source-copy', passed: true }),
      expect.objectContaining({ key: 'repro-bundle', passed: true }),
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'event-log', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(summary.scenarioKinds).toEqual(expect.arrayContaining(['remote', 'error', 'filter', 'multi', 'controlled', 'virtual', 'responsive', 'keyboard']))

    const tableSummary = getLiveExampleValidationSummary('table')

    expect(tableSummary.modeLabel).toBe('Guided workflow')
    expect(tableSummary.scenarioCount).toBe(10)
    expect(tableSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(tableSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'multi', 'composition', 'virtual', 'layout', 'responsive', 'loading', 'empty', 'remote', 'keyboard']))

    const dataViewSummary = getLiveExampleValidationSummary('dataView')

    expect(dataViewSummary.modeLabel).toBe('Guided workflow')
    expect(dataViewSummary.scenarioCount).toBe(6)
    expect(dataViewSummary.workflowReady).toBe(true)
    expect(dataViewSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'event-log', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(dataViewSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'controlled', 'filter', 'empty', 'responsive', 'keyboard']))

    const resourcePageSummary = getLiveExampleValidationSummary('resourcePage')

    expect(resourcePageSummary.modeLabel).toBe('Guided workflow')
    expect(resourcePageSummary.scenarioCount).toBe(6)
    expect(resourcePageSummary.workflowReady).toBe(true)
    expect(resourcePageSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'event-log', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(resourcePageSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'controlled', 'filter', 'empty', 'responsive', 'keyboard']))

    const remainingWorkflowSummaries = [
      ['approvalCommentBox', ['basic', 'error', 'loading', 'responsive', 'keyboard']],
      ['inputTag', ['basic', 'error', 'controlled', 'responsive', 'keyboard']],
      ['bulkActionBar', ['basic', 'multi', 'composition', 'empty', 'responsive', 'keyboard']],
      ['dataToolbar', ['basic', 'composition', 'empty', 'responsive', 'keyboard']],
      ['savedViews', ['basic', 'controlled', 'empty', 'responsive', 'keyboard']],
      ['searchPanel', ['basic', 'search', 'empty', 'responsive', 'keyboard']],
      ['statusTimeline', ['basic', 'layout', 'empty', 'responsive', 'keyboard']],
      ['reviewWorkflow', ['basic', 'loading', 'error', 'responsive', 'keyboard']],
      ['layout', ['basic', 'layout', 'controlled', 'responsive', 'keyboard']],
      ['menu', ['basic', 'composition', 'controlled', 'responsive', 'keyboard']],
      ['brandHero', ['basic', 'copy', 'error', 'responsive', 'keyboard']],
      ['featureGrid', ['basic', 'layout', 'empty', 'responsive', 'keyboard']],
      ['logoCloud', ['basic', 'copy', 'empty', 'responsive', 'keyboard']],
      ['profileCard', ['basic', 'controlled', 'empty', 'responsive', 'keyboard']],
      ['configProvider', ['basic', 'layout', 'controlled', 'responsive', 'keyboard']],
      ['themeProvider', ['basic', 'controlled', 'error', 'responsive', 'keyboard']]
    ] as const

    remainingWorkflowSummaries.forEach(([preset, expectedKinds]) => {
      const summary = getLiveExampleValidationSummary(preset)

      expect(summary.modeLabel, `${preset} should be workflow guided`).toBe('Guided workflow')
      expect(summary.scenarioCount, `${preset} should expose at least five scenes`).toBeGreaterThanOrEqual(5)
      expect(summary.workflowReady, `${preset} should be workflow ready`).toBe(true)
      expect(summary.checks, `${preset} should cover responsive and keyboard checks`).toEqual(expect.arrayContaining([
        expect.objectContaining({ key: 'responsive', passed: true }),
        expect.objectContaining({ key: 'keyboard-path', passed: true })
      ]))
      expect(summary.scenarioKinds, `${preset} should cover expected scenario kinds`).toEqual(expect.arrayContaining(expectedKinds))
    })

    const schemaFormSummary = getLiveExampleValidationSummary('schemaForm')

    expect(schemaFormSummary.modeLabel).toBe('Guided workflow')
    expect(schemaFormSummary.scenarioCount).toBe(6)
    expect(schemaFormSummary.workflowReady).toBe(true)
    expect(schemaFormSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'event-log', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(schemaFormSummary.scenarioKinds).toEqual(expect.arrayContaining(['composition', 'error', 'controlled', 'responsive', 'keyboard']))

    const fieldArraySummary = getLiveExampleValidationSummary('fieldArray')

    expect(fieldArraySummary.modeLabel).toBe('Guided workflow')
    expect(fieldArraySummary.scenarioCount).toBe(6)
    expect(fieldArraySummary.workflowReady).toBe(true)
    expect(fieldArraySummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'event-log', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(fieldArraySummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'empty', 'disabled', 'responsive', 'keyboard']))
    expect(fieldArraySummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'empty', 'disabled', 'responsive', 'keyboard']))

    const scrollbarSummary = getLiveExampleValidationSummary('scrollbar')

    expect(scrollbarSummary.modeLabel).toBe('Guided workflow')
    expect(scrollbarSummary.scenarioCount).toBe(6)
    expect(scrollbarSummary.workflowReady).toBe(true)
    expect(scrollbarSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(scrollbarSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'layout', 'empty', 'responsive', 'keyboard']))

    const formSummary = getLiveExampleValidationSummary('form')

    expect(formSummary.modeLabel).toBe('Guided workflow')
    expect(formSummary.scenarioCount).toBe(6)
    expect(formSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(formSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'error', 'summary', 'disabled', 'responsive', 'keyboard']))

    const selectSummary = getLiveExampleValidationSummary('select')

    expect(selectSummary.modeLabel).toBe('Guided workflow')
    expect(selectSummary.scenarioCount).toBe(17)
    expect(selectSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(selectSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'empty', 'multi', 'layout', 'search', 'virtual', 'loading', 'error', 'disabled', 'responsive', 'keyboard']))

    const cascaderSummary = getLiveExampleValidationSummary('cascader')

    expect(cascaderSummary.modeLabel).toBe('Guided workflow')
    expect(cascaderSummary.scenarioCount).toBe(6)
    expect(cascaderSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(cascaderSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'multi', 'error', 'remote', 'responsive', 'keyboard']))

    const dateRangeSummary = getLiveExampleValidationSummary('dateRangePicker')

    expect(dateRangeSummary.modeLabel).toBe('Guided workflow')
    expect(dateRangeSummary.scenarioCount).toBe(9)
    expect(dateRangeSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(dateRangeSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'empty',
      'error',
      'composition',
      'disabled',
      'responsive',
      'keyboard'
    ]))

    const drawerSummary = getLiveExampleValidationSummary('drawer')

    expect(drawerSummary.modeLabel).toBe('Guided workflow')
    expect(drawerSummary.scenarioCount).toBe(5)
    expect(drawerSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(drawerSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'composition', 'disabled', 'responsive', 'keyboard']))

    const dropdownSummary = getLiveExampleValidationSummary('dropdown')

    expect(dropdownSummary.modeLabel).toBe('Guided workflow')
    expect(dropdownSummary.scenarioCount).toBe(7)
    expect(dropdownSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(dropdownSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'responsive', 'error', 'layout', 'controlled', 'disabled', 'keyboard']))

    const popconfirmSummary = getLiveExampleValidationSummary('popconfirm')

    expect(popconfirmSummary.modeLabel).toBe('Guided workflow')
    expect(popconfirmSummary.scenarioCount).toBe(5)
    expect(popconfirmSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(popconfirmSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'error',
      'controlled',
      'responsive',
      'keyboard'
    ]))

    const messageSummary = getLiveExampleValidationSummary('message')

    expect(messageSummary.modeLabel).toBe('Guided workflow')
    expect(messageSummary.scenarioCount).toBe(5)
    expect(messageSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(messageSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'error',
      'controlled',
      'responsive',
      'keyboard'
    ]))

    const resultSummary = getLiveExampleValidationSummary('result')

    expect(resultSummary.modeLabel).toBe('Guided workflow')
    expect(resultSummary.scenarioCount).toBe(5)
    expect(resultSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(resultSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'error',
      'controlled',
      'responsive',
      'keyboard'
    ]))

    const emptySummary = getLiveExampleValidationSummary('empty')

    expect(emptySummary.modeLabel).toBe('Guided workflow')
    expect(emptySummary.scenarioCount).toBe(5)
    expect(emptySummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(emptySummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'empty',
      'error',
      'responsive',
      'keyboard'
    ]))

    const skeletonSummary = getLiveExampleValidationSummary('skeleton')

    expect(skeletonSummary.modeLabel).toBe('Guided workflow')
    expect(skeletonSummary.scenarioCount).toBe(5)
    expect(skeletonSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'loading-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(skeletonSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'loading',
      'multi',
      'responsive',
      'keyboard'
    ]))

    const alertSummary = getLiveExampleValidationSummary('alert')

    expect(alertSummary.modeLabel).toBe('Guided workflow')
    expect(alertSummary.scenarioCount).toBe(5)
    expect(alertSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(alertSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'error',
      'controlled',
      'responsive',
      'keyboard'
    ]))

    const cardSummary = getLiveExampleValidationSummary('card')

    expect(cardSummary.modeLabel).toBe('Guided workflow')
    expect(cardSummary.scenarioCount).toBe(6)
    expect(cardSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(cardSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'multi',
      'empty',
      'responsive',
      'keyboard'
    ]))

    const collapseSummary = getLiveExampleValidationSummary('collapse')

    expect(collapseSummary.modeLabel).toBe('Guided workflow')
    expect(collapseSummary.scenarioCount).toBe(5)
    expect(collapseSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(collapseSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'disabled',
      'responsive',
      'keyboard'
    ]))

    const descriptionsSummary = getLiveExampleValidationSummary('descriptions')

    expect(descriptionsSummary.modeLabel).toBe('Guided workflow')
    expect(descriptionsSummary.scenarioCount).toBe(7)
    expect(descriptionsSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(descriptionsSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'composition',
      'empty',
      'multi',
      'responsive',
      'keyboard'
    ]))

    const paginationSummary = getLiveExampleValidationSummary('pagination')

    expect(paginationSummary.modeLabel).toBe('Guided workflow')
    expect(paginationSummary.scenarioCount).toBe(6)
    expect(paginationSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true })
    ]))
    expect(paginationSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'multi',
      'empty',
      'disabled',
      'responsive',
      'keyboard'
    ]))

    const listSummary = getLiveExampleValidationSummary('list')

    expect(listSummary.modeLabel).toBe('Guided workflow')
    expect(listSummary.scenarioCount).toBe(6)
    expect(listSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true }),
      expect.objectContaining({ key: 'loading-state', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true })
    ]))
    expect(listSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'multi',
      'loading',
      'empty',
      'responsive',
      'keyboard'
    ]))

    const timelineSummary = getLiveExampleValidationSummary('timeline')

    expect(timelineSummary.modeLabel).toBe('Guided workflow')
    expect(timelineSummary.scenarioCount).toBe(6)
    expect(timelineSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true }),
      expect.objectContaining({ key: 'loading-state', passed: true })
    ]))
    expect(timelineSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'multi',
      'loading',
      'responsive',
      'keyboard'
    ]))

    const statisticSummary = getLiveExampleValidationSummary('statistic')

    expect(statisticSummary.modeLabel).toBe('Guided workflow')
    expect(statisticSummary.scenarioCount).toBe(7)
    expect(statisticSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true }),
      expect.objectContaining({ key: 'loading-state', passed: true })
    ]))
    expect(statisticSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'multi',
      'composition',
      'controlled',
      'loading',
      'responsive',
      'keyboard'
    ]))

    const datePickerSummary = getLiveExampleValidationSummary('datePicker')

    expect(datePickerSummary.modeLabel).toBe('Guided workflow')
    expect(datePickerSummary.scenarioCount).toBe(7)
    expect(datePickerSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(datePickerSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'disabled',
      'error',
      'composition',
      'responsive',
      'keyboard'
    ]))

    const timePickerSummary = getLiveExampleValidationSummary('timePicker')

    expect(timePickerSummary.modeLabel).toBe('Guided workflow')
    expect(timePickerSummary.scenarioCount).toBe(7)
    expect(timePickerSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(timePickerSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'disabled',
      'error',
      'composition',
      'responsive',
      'keyboard'
    ]))

    const inputNumberSummary = getLiveExampleValidationSummary('inputNumber')

    expect(inputNumberSummary.modeLabel).toBe('Guided workflow')
    expect(inputNumberSummary.scenarioCount).toBe(7)
    expect(inputNumberSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(inputNumberSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'layout',
      'multi',
      'error',
      'responsive',
      'keyboard'
    ]))

    const sliderSummary = getLiveExampleValidationSummary('slider')

    expect(sliderSummary.modeLabel).toBe('Guided workflow')
    expect(sliderSummary.scenarioCount).toBe(7)
    expect(sliderSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(sliderSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'multi',
      'layout',
      'error',
      'responsive',
      'keyboard'
    ]))

    const rateSummary = getLiveExampleValidationSummary('rate')

    expect(rateSummary.modeLabel).toBe('Guided workflow')
    expect(rateSummary.scenarioCount).toBe(7)
    expect(rateSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(rateSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'copy',
      'empty',
      'disabled',
      'responsive',
      'keyboard'
    ]))

    const uploadSummary = getLiveExampleValidationSummary('upload')

    expect(uploadSummary.modeLabel).toBe('Guided workflow')
    expect(uploadSummary.scenarioCount).toBe(11)
    expect(uploadSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(uploadSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'composition',
      'error',
      'multi',
      'remote',
      'disabled',
      'responsive',
      'keyboard'
    ]))

    const colorPickerSummary = getLiveExampleValidationSummary('colorPicker')

    expect(colorPickerSummary.modeLabel).toBe('Guided workflow')
    expect(colorPickerSummary.scenarioCount).toBe(8)
    expect(colorPickerSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(colorPickerSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'copy',
      'multi',
      'empty',
      'error',
      'composition',
      'responsive',
      'keyboard'
    ]))

    const modalSummary = getLiveExampleValidationSummary('modal')

    expect(modalSummary.modeLabel).toBe('Guided workflow')
    expect(modalSummary.scenarioCount).toBe(5)
    expect(modalSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(modalSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'error', 'controlled', 'responsive', 'keyboard']))

    const popoverSummary = getLiveExampleValidationSummary('popover')

    expect(popoverSummary.modeLabel).toBe('Guided workflow')
    expect(popoverSummary.scenarioCount).toBe(7)
    expect(popoverSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(popoverSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'empty',
      'responsive',
      'keyboard',
      'layout',
      'disabled'
    ]))

    const tooltipSummary = getLiveExampleValidationSummary('tooltip')

    expect(tooltipSummary.modeLabel).toBe('Guided workflow')
    expect(tooltipSummary.scenarioCount).toBe(7)
    expect(tooltipSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(tooltipSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'keyboard', 'responsive', 'controlled', 'layout', 'disabled', 'error']))

    const buttonSummary = getLiveExampleValidationSummary('button')

    expect(buttonSummary.modeLabel).toBe('Guided workflow')
    expect(buttonSummary.scenarioCount).toBe(9)
    expect(buttonSummary.workflowReady).toBe(true)
    expect(buttonSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'loading-state', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(buttonSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'multi',
      'copy',
      'loading',
      'disabled',
      'error',
      'responsive',
      'keyboard'
    ]))

    const inputSummary = getLiveExampleValidationSummary('input')

    expect(inputSummary.modeLabel).toBe('Guided workflow')
    expect(inputSummary.scenarioCount).toBe(9)
    expect(inputSummary.workflowReady).toBe(true)
    expect(inputSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(inputSummary.scenarioKinds).toEqual(expect.arrayContaining([
      'basic',
      'controlled',
      'search',
      'copy',
      'layout',
      'error',
      'disabled',
      'responsive',
      'keyboard'
    ]))

    const checkboxSummary = getLiveExampleValidationSummary('checkbox')

    expect(checkboxSummary.modeLabel).toBe('Guided workflow')
    expect(checkboxSummary.scenarioCount).toBe(9)
    expect(checkboxSummary.workflowReady).toBe(true)
    expect(checkboxSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(checkboxSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'multi', 'controlled', 'error', 'disabled', 'responsive', 'keyboard']))

    const radioGroupSummary = getLiveExampleValidationSummary('radioGroup')

    expect(radioGroupSummary.modeLabel).toBe('Guided workflow')
    expect(radioGroupSummary.scenarioCount).toBe(7)
    expect(radioGroupSummary.workflowReady).toBe(true)
    expect(radioGroupSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(radioGroupSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'controlled', 'error', 'disabled', 'responsive', 'keyboard']))

    const switchSummary = getLiveExampleValidationSummary('switch')

    expect(switchSummary.modeLabel).toBe('Guided workflow')
    expect(switchSummary.scenarioCount).toBe(8)
    expect(switchSummary.workflowReady).toBe(true)
    expect(switchSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(switchSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'controlled', 'error', 'loading', 'disabled', 'responsive', 'keyboard']))

    const tabsSummary = getLiveExampleValidationSummary('tabs')

    expect(tabsSummary.modeLabel).toBe('Guided workflow')
    expect(tabsSummary.scenarioCount).toBe(5)
    expect(tabsSummary.workflowReady).toBe(true)
    expect(tabsSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(tabsSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'controlled', 'error', 'responsive', 'keyboard']))

    const stepsSummary = getLiveExampleValidationSummary('steps')

    expect(stepsSummary.modeLabel).toBe('Guided workflow')
    expect(stepsSummary.scenarioCount).toBe(5)
    expect(stepsSummary.workflowReady).toBe(true)
    expect(stepsSummary.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'visual-props', passed: true }),
      expect.objectContaining({ key: 'scenario-switching', passed: true }),
      expect.objectContaining({ key: 'responsive', passed: true }),
      expect.objectContaining({ key: 'error-state', passed: true }),
      expect.objectContaining({ key: 'keyboard-path', passed: true })
    ]))
    expect(stepsSummary.scenarioKinds).toEqual(expect.arrayContaining(['basic', 'error', 'layout', 'responsive', 'keyboard']))

    const workflowSummaries = [
      {
        preset: 'progress',
        kinds: ['basic', 'loading', 'error', 'responsive', 'keyboard']
      },
      {
        preset: 'textarea',
        kinds: ['basic', 'controlled', 'layout', 'error', 'disabled', 'responsive', 'keyboard'],
        scenarioCount: 7
      },
      {
        preset: 'tagBadge',
        kinds: ['basic', 'error', 'multi', 'status', 'responsive', 'keyboard'],
        scenarioCount: 6
      },
      {
        preset: 'avatar',
        kinds: ['basic', 'remote', 'multi', 'error', 'responsive', 'keyboard'],
        scenarioCount: 6
      },
      {
        preset: 'image',
        kinds: ['basic', 'loading', 'error', 'controlled', 'responsive', 'keyboard'],
        scenarioCount: 6
      },
      {
        preset: 'breadcrumb',
        kinds: ['basic', 'controlled', 'error', 'responsive', 'keyboard']
      },
      {
        preset: 'virtualList',
        kinds: ['basic', 'empty', 'virtual', 'responsive', 'keyboard']
      },
      {
        preset: 'watermark',
        kinds: ['basic', 'error', 'copy', 'responsive', 'keyboard']
      },
      {
        preset: 'divider',
        kinds: ['basic', 'layout', 'empty', 'responsive', 'keyboard']
      },
      {
        preset: 'formItem',
        kinds: ['basic', 'composition', 'error', 'controlled', 'responsive', 'keyboard'],
        scenarioCount: 6
      },
      {
        preset: 'formSummary',
        kinds: ['basic', 'composition', 'controlled', 'empty', 'responsive', 'keyboard'],
        scenarioCount: 6
      },
      {
        preset: 'backtop',
        kinds: ['basic', 'controlled', 'empty', 'responsive', 'keyboard']
      },
      {
        preset: 'commandPalette',
        kinds: ['basic', 'search', 'empty', 'responsive', 'keyboard']
      },
      {
        preset: 'codeBlock',
        kinds: ['basic', 'copy', 'empty', 'responsive', 'keyboard']
      },
      {
        preset: 'themeSwitcher',
        kinds: ['basic', 'controlled', 'error', 'responsive', 'keyboard']
      },
      {
        preset: 'pageHeader',
        kinds: ['basic', 'composition', 'empty', 'responsive', 'keyboard']
      },
      {
        preset: 'metricCard',
        kinds: ['basic', 'error', 'controlled', 'responsive', 'keyboard']
      },
      {
        preset: 'filterTabs',
        kinds: ['basic', 'filter', 'empty', 'responsive', 'keyboard']
      }
    ] as const

    workflowSummaries.forEach(({ preset, kinds, scenarioCount = 5 }) => {
      const summary = getLiveExampleValidationSummary(preset)

      expect(summary.modeLabel).toBe('Guided workflow')
      expect(summary.scenarioCount).toBe(scenarioCount)
      expect(summary.workflowReady).toBe(true)
      expect(summary.checks).toEqual(expect.arrayContaining([
        expect.objectContaining({ key: 'visual-props', passed: true }),
        expect.objectContaining({ key: 'scenario-switching', passed: true }),
        expect.objectContaining({ key: 'responsive', passed: true }),
        expect.objectContaining({ key: 'error-state', passed: true }),
        expect.objectContaining({ key: 'keyboard-path', passed: true })
      ]))
      expect(summary.scenarioKinds).toEqual(expect.arrayContaining(kinds))
    })
  })
})
