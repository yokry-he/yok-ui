import { describe, expect, it } from 'vitest'
import { components } from './componentRegistry'
import { liveExampleCoverage } from './liveExamples'
import {
  getPlaygroundComponentForDocsRoute,
  liveExamplePlaygroundPresetMap,
  playgroundComponentDocs,
  playgroundComponentOptions,
  playgroundComponents
} from './playgroundExamples'

describe('playgroundExamples', () => {
  function findExpectedRegistryMeta(component: string, docsRoute: string) {
    if (component === 'codeBlock') {
      return components.find((item) => item.name === 'YCodeBlock')
    }

    if (component === 'floatButton') {
      return components.find((item) => item.name === 'YFloatButtonGroup')
    }

    if (component === 'badge') {
      return components.find((item) => item.name === 'YBadge')
    }

    if (component === 'avatarGroup') {
      return components.find((item) => item.name === 'YAvatarGroup')
    }

    if (component === 'tag') {
      return components.find((item) => item.name === 'YTag')
    }

    return components.find((item) => item.docs === docsRoute)
  }

  it('centralizes playground component support and live-example imports', () => {
    expect(playgroundComponents).toEqual(expect.arrayContaining([
      'button',
      'icon',
      'image',
      'segmented',
      'calendar',
      'carousel',
      'notification',
      'autocomplete',
      'mention',
      'select',
      'configProvider',
      'table',
      'dataTable',
      'dataView',
      'resourcePage',
      'crudLayout',
      'bulkActionBar',
      'dataToolbar',
      'savedViews',
      'searchPanel',
      'filterTabs',
      'statusTimeline',
      'reviewWorkflow',
      'fieldArray',
      'schemaForm',
      'searchForm',
      'list',
      'statistic',
      'descriptions',
      'virtualList',
      'tree',
      'treeSelect',
      'watermark',
      'floatButton',
      'layout',
      'loading',
      'menu',
      'tabs',
      'tour',
      'breadcrumb',
      'backtop',
      'affix',
      'anchor',
      'tooltip',
      'popover',
      'dropdown',
      'popconfirm',
      'modal',
      'drawer',
      'pagination',
      'timeline',
      'card',
      'empty',
      'skeleton',
      'message',
      'result',
      'textarea',
      'form',
      'formItem',
      'formSummary',
      'divider',
      'link',
      'text',
      'upload',
      'badge',
      'alert',
      'scrollbar',
      'space',
      'splitter',
      'commandPalette',
      'codeBlock',
      'themeSwitcher',
      'pageHeader',
      'metricCard',
      'brandHero',
      'featureGrid',
      'profileCard',
      'logoCloud',
      'themeProvider'
    ]))
    expect(liveExamplePlaygroundPresetMap).toEqual(expect.objectContaining({
      button: 'button',
      icon: 'icon',
      image: 'image',
      autocomplete: 'autocomplete',
      mention: 'mention',
      configProvider: 'configProvider',
      table: 'table',
      dataTable: 'dataTable',
      dataView: 'dataView',
      resourcePage: 'resourcePage',
      crudLayout: 'crudLayout',
      bulkActionBar: 'bulkActionBar',
      dataToolbar: 'dataToolbar',
      savedViews: 'savedViews',
      searchPanel: 'searchPanel',
      filterTabs: 'filterTabs',
      statusTimeline: 'statusTimeline',
      reviewWorkflow: 'reviewWorkflow',
      fieldArray: 'fieldArray',
      schemaForm: 'schemaForm',
      searchForm: 'searchForm',
      list: 'list',
      statistic: 'statistic',
      descriptions: 'descriptions',
      virtualList: 'virtualList',
      tree: 'tree',
      treeSelect: 'treeSelect',
      watermark: 'watermark',
      floatButton: 'floatButton',
      layout: 'layout',
      loading: 'loading',
      menu: 'menu',
      tour: 'tour',
      affix: 'affix',
      anchor: 'anchor',
      tooltip: 'tooltip',
      popover: 'popover',
      dropdown: 'dropdown',
      popconfirm: 'popconfirm',
      modal: 'modal',
      drawer: 'drawer',
      pagination: 'pagination',
      timeline: 'timeline',
      card: 'card',
      empty: 'empty',
      skeleton: 'skeleton',
      message: 'message',
      notification: 'notification',
      result: 'result',
      textarea: 'textarea',
      form: 'form',
      formItem: 'formItem',
      formSummary: 'formSummary',
      divider: 'divider',
      link: 'link',
      text: 'text',
      upload: 'upload',
      badge: 'badge',
      scrollbar: 'scrollbar',
      segmented: 'segmented',
      calendar: 'calendar',
      carousel: 'carousel',
      space: 'space',
      splitter: 'splitter',
      commandPalette: 'commandPalette',
      codeBlock: 'codeBlock',
      themeSwitcher: 'themeSwitcher',
      pageHeader: 'pageHeader',
      metricCard: 'metricCard',
      brandHero: 'brandHero',
      featureGrid: 'featureGrid',
      profileCard: 'profileCard',
      logoCloud: 'logoCloud',
      themeProvider: 'themeProvider',
      tagBadge: 'tag'
    }))
  })

  it('keeps every live-example playground target inside the playground allowlist', () => {
    const componentSet = new Set(playgroundComponents)

    Object.entries(liveExamplePlaygroundPresetMap).forEach(([preset, component]) => {
      expect(componentSet.has(component), `${preset} maps to unsupported playground component ${component}`).toBe(true)
    })
  })

  it('keeps every playground component tied to a registry route and live example page', () => {
    const registryRoutes = new Set(components.map((component) => component.docs))
    const liveExampleRoutes = new Set(liveExampleCoverage.map((item) => item.docs))

    playgroundComponents.forEach((component) => {
      const docsRoute = playgroundComponentDocs[component]

      expect(docsRoute, `${component} is missing a docs route`).toMatch(/^\/(components|guide)\//)
      expect(registryRoutes.has(docsRoute), `${component} docs route ${docsRoute} is missing from registry`).toBe(true)
      expect(liveExampleRoutes.has(docsRoute), `${component} docs route ${docsRoute} is missing live example coverage`).toBe(true)
    })
  })

  it('derives playground component metadata from the registry', () => {
    expect(playgroundComponentOptions).toHaveLength(playgroundComponents.length)

    playgroundComponentOptions.forEach((option) => {
      const docsRoute = playgroundComponentDocs[option.value]
      const registryMeta = findExpectedRegistryMeta(option.value, docsRoute)

      expect(registryMeta, `${option.value} is missing registry metadata`).toBeTruthy()
      expect(option.label).toBe(registryMeta?.title)
      expect(option.description).toBe(registryMeta?.description)
      expect(option.docs).toBe(docsRoute)
      expect(option.packageName).toBe(registryMeta?.packageName)
      expect(option.family).toBeTruthy()
    })
  })

  it('resolves docs routes back to playground components from the shared registry', () => {
    expect(getPlaygroundComponentForDocsRoute('/components/select')).toBe('select')
    expect(getPlaygroundComponentForDocsRoute('/components/select/')).toBe('select')
    expect(getPlaygroundComponentForDocsRoute('/components/input-number')).toBe('inputNumber')
    expect(getPlaygroundComponentForDocsRoute('/components/tag-badge')).toBe('tag')
    expect(getPlaygroundComponentForDocsRoute('/components/tag-badge/')).toBe('tag')
    expect(getPlaygroundComponentForDocsRoute('/guide/theming')).toBe('themeProvider')
    expect(getPlaygroundComponentForDocsRoute('/components/not-registered')).toBe('')
  })
})
