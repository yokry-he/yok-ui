import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LiveExampleRunner from './LiveExampleRunner.vue'

enableAutoUnmount(afterEach)

function findControlByLabel(wrapper: ReturnType<typeof mount>, label: string) {
  const control = wrapper
    .findAll('.live-example-runner__control')
    .find((item) => item.text().includes(label))

  expect(control, `Missing control ${label}`).toBeTruthy()

  return control!
}

async function setCheckbox(wrapper: ReturnType<typeof mount>, label: string, checked: boolean) {
  const checkbox = findControlByLabel(wrapper, label).find<HTMLInputElement>('input[type="checkbox"]')

  checkbox.element.checked = checked
  await checkbox.trigger('change')
  await nextTick()
}

function findScenarioButton(wrapper: ReturnType<typeof mount>, label: string) {
  const scenario = wrapper
    .findAll('.live-example-runner__scenario-grid button')
    .find((button) => button.text().includes(label))

  expect(scenario, `Missing scenario ${label}`).toBeTruthy()

  return scenario!
}

async function getPlaygroundHandoff(wrapper: ReturnType<typeof mount>) {
  const playgroundLink = wrapper.get('[data-live-toolbar-action="playground"]')
  const url = new URL(playgroundLink.attributes('href') ?? '', 'https://yok-ui.dev')
  const handoffKey = url.searchParams.get('handoff') ?? ''

  expect(url.pathname).toBe('/playground/')
  expect(handoffKey).toBeTruthy()
  expect(url.searchParams.has('source')).toBe(false)
  expect(url.searchParams.has('controls')).toBe(false)
  expect(url.searchParams.has('scenario')).toBe(false)

  await playgroundLink.trigger('click')
  await nextTick()

  const stored = window.localStorage.getItem(`yok-ui:playground-handoff:${handoffKey}`)

  expect(stored, `Missing stored playground handoff ${handoffKey}`).toBeTruthy()

  const payload = JSON.parse(stored ?? '{}') as {
    component?: string
    theme?: string
    source?: string
    scenario?: string
    viewport?: string
    controls?: Record<string, unknown>
    language?: string
    origin?: string
    sourcePanel?: {
      mode?: string
      label?: string
      language?: string
      installPackageManager?: string
    }
  }

  expect(payload.origin).toBe('live-example')

  return {
    url,
    handoffKey,
    payload,
    source: payload.source ?? '',
    controls: payload.controls ?? {}
  }
}

describe('LiveExampleRunner', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    window.location.hash = ''
    window.localStorage.clear()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn()
      }
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('generates editable SFC code from the visual props panel', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    expect(wrapper.text()).toContain('Button controls')
    expect(wrapper.find('.live-example-runner__prop-panel').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__cockpit').text()).toContain('7 controls')
    expect(wrapper.find('.live-example-runner__cockpit').text()).toContain('core')
    expect(wrapper.find('.live-example-runner__cockpit').text()).toContain('YButton')
    expect(wrapper.find('.live-example-runner__run-evidence').text()).toContain('Run evidence')
    expect(wrapper.find('.live-example-runner__run-evidence').text()).toContain('Preview')
    expect(wrapper.find('.live-example-runner__run-evidence').text()).toContain('Edited')
    expect(wrapper.find('.live-example-runner__run-evidence').text()).toContain('Scenario')
    expect(wrapper.find('.live-example-runner__run-evidence').text()).toContain('Not selected')
    expect(wrapper.find('.live-example-runner__run-evidence').text()).toContain('API map')
    expect(wrapper.find('.live-example-runner__replay').text()).toContain('Interaction replay')
    expect(wrapper.find('.live-example-runner__replay').text()).toContain('Waiting for event')
    expect(wrapper.find('.live-example-runner__replay').text()).toContain('Restore context')

    const labelInput = wrapper.findAll('.live-example-runner__control input[type="text"]')[0]
    await labelInput.setValue('Publish docs')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('Publish docs')
    expect(source).toContain('<YButton')
    expect(source).toContain('type="button"')
    expect(source).toContain('variant="primary"')
    expect(wrapper.text()).toContain('Publish docs')
  })

  it('keeps rendering when playground handoff storage exceeds the browser quota', () => {
    const originalLocalStorage = window.localStorage
    const setItem = vi.fn(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        get length() {
          return 0
        },
        key: vi.fn(),
        getItem: vi.fn(() => null),
        removeItem: vi.fn(),
        setItem
      }
    })

    try {
      const wrapper = mount(LiveExampleRunner, {
        props: {
          preset: 'button'
        }
      })

      expect(wrapper.find('.live-example-runner').exists()).toBe(true)
      expect(wrapper.text()).toContain('Button controls')
      expect(setItem).toHaveBeenCalled()
    } finally {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: originalLocalStorage
      })
    }
  })

  it('maps live example source back to structured API evidence and copies the API manifest', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    const apiMap = wrapper.get('.live-example-runner__api-map')
    const apiItems = wrapper.findAll('.live-example-runner__api-map-item')

    expect(apiMap.text()).toContain('API map')
    expect(apiMap.text()).toContain('API rows referenced')
    expect(wrapper.find('#live-example-acceptance').exists()).toBe(true)
    expect(wrapper.find('#live-example-scenario-coverage').exists()).toBe(true)
    expect(wrapper.find('#live-example-api-map').exists()).toBe(true)
    expect(wrapper.find('#live-example-interaction-contract').exists()).toBe(true)
    expect(apiItems).toHaveLength(5)
    expect(apiItems[0].text()).toContain('Props')
    expect(apiItems[0].text()).toContain('variant')
    expect(apiItems[0].attributes('data-status')).toBe('covered')
    expect(apiItems[0].find('.live-example-runner__api-map-link').attributes('href')).toBe('/components/button#api-props')
    expect(apiItems[0].find('.live-example-runner__api-map-samples a').attributes('href')).toBe('/components/button#api-props-variant')
    expect(apiMap.text()).toContain('Events')
    expect(apiMap.text()).toContain('Slots')

    await wrapper.get('.live-example-runner__api-map-copy').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('# Yok UI live example API map'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('- Components: YButton'))
    expect(wrapper.text()).toContain('已复制 API 清单')
  })

  it('keeps starter labels aligned with registry metadata while preserving the overview fallback', () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })
    const options = wrapper
      .find('.live-example-runner__starter select')
      .findAll('option')
      .map((option) => option.text())

    expect(options).toContain('Overview')
    expect(options).toContain('Button')
    expect(options).toContain('Tag')
    expect(options).not.toContain('default')
  })

  it('captures component events from the rendered preview', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await nextTick()
    await nextTick()

    const previewButton = wrapper
      .findAll('.live-example-runner__stage button')
      .find((button) => button.text().includes('Create component'))

    expect(previewButton).toBeTruthy()

    await previewButton?.trigger('click')

    expect(wrapper.text()).toContain('Event log')
    expect(wrapper.text()).toContain('@click')
    expect(wrapper.text()).toContain('MouseEvent')
    expect(wrapper.find('.live-example-runner__cockpit').text()).toContain('1 captured')
  })

  it('switches the whole live preview between Yok UI theme presets', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    const themeSelect = wrapper.get<HTMLSelectElement>('.live-example-runner__theme-select')

    expect(themeSelect.element.value).toBe('yok-light')
    expect(wrapper.get('.live-example-runner__frame .yok-theme-provider').attributes('data-yok-theme')).toBe('yok-light')

    await themeSelect.setValue('yok-candy')
    await nextTick()

    expect(wrapper.get('.live-example-runner__frame .yok-theme-provider').attributes('data-yok-theme')).toBe('yok-candy')
    expect(wrapper.text()).toContain('主题预设已切换为 Candy。')
  })

  it('copies a live example run report with status, events and source context', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await nextTick()
    await nextTick()
    await wrapper.get<HTMLSelectElement>('.live-example-runner__theme-select').setValue('yok-clean')

    const previewButton = wrapper
      .findAll('.live-example-runner__stage button')
      .find((button) => button.text().includes('Create component'))

    expect(previewButton).toBeTruthy()
    await previewButton?.trigger('click')

    await wrapper.get('.live-example-runner__report-copy').trigger('click')

    const report = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(report).toContain('# Yok UI live example report')
    expect(report).toContain('- Preset: Button')
    expect(report).toContain('- Component: YButton')
    expect(report).toContain('- Package: @yok-ui/core')
    expect(report).toContain('- Docs: /components/button')
    expect(report).toContain('- Status: Runnable')
    expect(report).toContain('- Scenario: 主操作')
    expect(report).toContain('- Theme: Clean')
    expect(report).toContain('- Events captured: 1')
    expect(report).toContain('- Validation: Pass')
    expect(report).toContain('## Run evidence')
    expect(report).toContain('- [x] Preview:')
    expect(report).toContain('- [x] Scenario: 主操作')
    expect(report).toContain('- [x] Export: Repro ready')
    expect(report).toContain('## Recent events')
    expect(report).toContain('- Button @click: MouseEvent')
    expect(report).toContain('## Scenario test plan')
    expect(report).toContain('1. 锁定场景')
    expect(report).toContain('5. 核对交互契约')
    expect(report).toContain('6. 导出复现材料')
    expect(report).toContain('## Interaction contract')
    expect(report).toContain('### YButton')
    expect(report).toContain('- Semantics:')
    expect(report).toContain('```vue')
    expect(report).toContain('<YButton')
    expect(wrapper.get('.live-example-runner__report-copy').text()).toContain('已复制报告')
  })

  it('falls back to legacy selection when copying example source from the toolbar', async () => {
    let copiedLegacyValue = ''
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn()
    })
    const execCommand = vi.spyOn(document, 'execCommand').mockImplementation(() => {
      copiedLegacyValue = (document.activeElement as HTMLTextAreaElement | null)?.value ?? ''
      return true
    })

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('clipboard blocked'))
      }
    })

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await wrapper.findAll('.live-example-runner__control input[type="text"]')[0].setValue('Fallback copy')
    await wrapper.get('.live-example-runner__copy-action').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(copiedLegacyValue).toContain('Fallback copy')
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(wrapper.get('.live-example-runner__copy-action').text()).toContain('已复制')

    execCommand.mockRestore()
  })

  it('renders and copies scenario verification steps for the active live example', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })
    await nextTick()

    const testPlan = wrapper.get('.live-example-runner__test-plan')

    expect(testPlan.text()).toContain('Scenario test plan')
    expect(testPlan.text()).toContain('主操作')
    expect(testPlan.text()).toContain('1. 锁定场景')
    expect(testPlan.text()).toContain('3. 验证交互路径')

    await findScenarioButton(wrapper, '键盘触发').trigger('click')
    await nextTick()

    expect(wrapper.get('.live-example-runner__test-plan').text()).toContain('键盘触发')
    expect(wrapper.get('.live-example-runner__test-plan').text()).toContain('使用 Tab 进入组件')

    await wrapper.get('.live-example-runner__test-plan-copy').trigger('click')

    const checklist = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(checklist).toContain('# Yok UI scenario test plan')
    expect(checklist).toContain('- Component: YButton')
    expect(checklist).toContain('- Scenario: 键盘触发')
    expect(checklist).toContain('- [ ] 1. 锁定场景')
    expect(checklist).toContain('使用 Tab 进入组件')
    expect(wrapper.get('.live-example-runner__test-plan-copy').text()).toContain('已复制步骤')
  })

  it('summarizes scenario coverage and copies a coverage manifest', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })
    await nextTick()

    const coverage = wrapper.get('.live-example-runner__coverage')

    expect(coverage.text()).toContain('Example coverage')
    expect(coverage.text()).toContain('57% scenario kind coverage')
    expect(coverage.text()).toContain('8/14')
    expect(coverage.text()).toContain('基础态')
    expect(coverage.text()).toContain('主操作')
    expect(coverage.text()).toContain('多选/批量')
    expect(coverage.text()).toContain('按钮组')
    expect(coverage.text()).toContain('空态')
    expect(coverage.text()).toContain('Gap')

    await findScenarioButton(wrapper, '键盘触发').trigger('click')
    await coverage.get('.live-example-runner__coverage-copy').trigger('click')

    const manifest = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(manifest).toContain('# Yok UI live example coverage manifest')
    expect(manifest).toContain('- Preset: Button')
    expect(manifest).toContain('- Component: YButton')
    expect(manifest).toContain('- Coverage: 8/14 kinds (57%)')
    expect(manifest).toContain('- [x] 基础态: 1 - 主操作')
    expect(manifest).toContain('- [x] 多选/批量: 1 - 按钮组')
    expect(manifest).toContain('- [ ] 空态: missing')
    expect(manifest).toContain('- Key: keyboard-button')
    expect(manifest).toContain('- Label: 键盘触发')
    expect(manifest).toContain('- /playground/?')
    expect(coverage.get('.live-example-runner__coverage-copy').text()).toContain('已复制清单')
  })

  it('renders and copies a synchronized context snapshot for props, scenario, source and exports', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await findScenarioButton(wrapper, '键盘触发').trigger('click')
    await wrapper.get<HTMLSelectElement>('.live-example-runner__theme-select').setValue('yok-clean')
    await nextTick()

    const snapshot = wrapper.get('.live-example-runner__sync-snapshot')

    expect(snapshot.text()).toContain('Sync snapshot')
    expect(snapshot.text()).toContain('属性、场景、源码和复现包保持同源')
    expect(snapshot.text()).toContain('YButton')
    expect(snapshot.text()).toContain('键盘触发')
    expect(snapshot.text()).toContain('Clean theme')
    expect(snapshot.text()).toContain('1 changed')

    await snapshot.get('.live-example-runner__sync-snapshot-copy').trigger('click')

    const copiedSnapshot = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedSnapshot).toContain('"preset": "button"')
    expect(copiedSnapshot).toContain('"component": "YButton"')
    expect(copiedSnapshot).toContain('"key": "keyboard-button"')
    expect(copiedSnapshot).toContain('"name": "yok-clean"')
    expect(copiedSnapshot).toContain('"changedControls": 1')
    expect(copiedSnapshot).toContain('"interactionContract"')
    expect(copiedSnapshot).toContain('"componentName": "YButton"')
    expect(copiedSnapshot).toContain('"semantics"')
    expect(copiedSnapshot).toContain('Submit with keyboard')
    expect(copiedSnapshot).toContain('"playground": "/playground/?')
    expect(snapshot.text()).toContain('已复制快照')
  })

  it('renders interaction contract evidence beside live examples', () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'popover'
      }
    })
    const contract = wrapper.get('.live-example-runner__contract')

    expect(contract.attributes('data-has-contract')).toBe('true')
    expect(contract.text()).toContain('Interaction contract')
    expect(contract.text()).toContain('Verified contract')
    expect(contract.text()).toContain('Dismissable popover dialog')
    expect(contract.text()).toContain('Keyboard')
    expect(contract.text()).toContain('Enter / Space toggles')
    expect(contract.text()).toContain('Focus')
    expect(contract.text()).toContain('Semantics')
    expect(contract.text()).toContain('role="dialog"')
    expect(contract.text()).toContain('Evidence')
    expect(contract.text()).toContain('packages/core/src/components/popover/popover.test.ts')
  })

  it('links complex live examples to matching Playground component context', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'cascader'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('cascader')
    expect(source).toContain('<YCascader')
  })

  it('carries scenario, viewport and controls context into the Playground link', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await findScenarioButton(wrapper, '键盘触发').trigger('click')
    const mobileViewport = wrapper
      .findAll('.live-example-runner__viewport button')
      .find((button) => button.text().includes('手机'))

    expect(mobileViewport, 'Missing mobile viewport control').toBeTruthy()
    await mobileViewport?.trigger('click')
    await nextTick()

    const { url, payload, source, controls } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('button')
    expect(url.searchParams.get('theme')).toBe('yok-light')
    expect(payload.scenario).toBe('keyboard-button')
    expect(payload.viewport).toBe('mobile')
    expect(source).toContain('Submit with keyboard')
    expect(controls.scenario).toBe('keyboard')
    expect(controls.label).toBe('Create component')
  })

  it('carries the active source panel mode and language into the Playground handoff context', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    const sourceToggle = wrapper.findAll('button').find((button) => button.text().includes('查看源码'))

    expect(sourceToggle, 'Missing source panel toggle').toBeTruthy()
    await sourceToggle?.trigger('click')
    await nextTick()

    const panel = () => wrapper.get('.live-example-runner__source-panel')

    await panel().get('[data-live-source-action="language-js"]').trigger('click')

    const reproTab = panel()
      .findAll('.live-example-runner__source-tab')
      .find((button) => button.text().includes('Repro bundle'))

    expect(reproTab, 'Missing reproduction bundle tab').toBeTruthy()
    await reproTab?.trigger('click')
    await nextTick()

    const { payload } = await getPlaygroundHandoff(wrapper)

    expect(payload.language).toBe('js')
    expect(payload.sourcePanel).toEqual({
      mode: 'repro',
      label: 'Repro bundle',
      language: 'js',
      installPackageManager: 'pnpm'
    })
  })

  it.each([
    ['inputOtp', 'inputOtp', '<YInputOtp'],
    ['inputTag', 'inputTag', '<YInputTag'],
    ['inputNumber', 'inputNumber', '<YInputNumber'],
    ['slider', 'slider', '<YSlider'],
    ['rate', 'rate', '<YRate'],
    ['checkbox', 'checkbox', '<YCheckbox'],
    ['radioGroup', 'radioGroup', '<YRadioGroup'],
    ['segmented', 'segmented', '<YSegmented'],
    ['calendar', 'calendar', '<YCalendar'],
    ['carousel', 'carousel', '<YCarousel'],
    ['notification', 'notification', '<YNotification'],
    ['switch', 'switch', '<YSwitch'],
    ['table', 'table', '<YTable'],
    ['dataView', 'dataView', '<YDataView'],
    ['resourcePage', 'resourcePage', '<YResourcePage'],
    ['crudLayout', 'crudLayout', '<YCrudLayout'],
    ['approvalCommentBox', 'approvalCommentBox', '<YApprovalCommentBox'],
    ['bulkActionBar', 'bulkActionBar', '<YBulkActionBar'],
    ['dataToolbar', 'dataToolbar', '<YDataToolbar'],
    ['savedViews', 'savedViews', '<YSavedViews'],
    ['searchPanel', 'searchPanel', '<YSearchPanel'],
    ['filterTabs', 'filterTabs', '<YFilterTabs'],
    ['statusTimeline', 'statusTimeline', '<YStatusTimeline'],
    ['reviewWorkflow', 'reviewWorkflow', '<YReviewWorkflow'],
    ['fieldArray', 'fieldArray', '<YFieldArray'],
    ['list', 'list', '<YList'],
    ['statistic', 'statistic', '<YStatistic'],
    ['descriptions', 'descriptions', '<YDescriptions'],
    ['layout', 'layout', '<YLayout'],
    ['menu', 'menu', '<YMenu'],
    ['tabs', 'tabs', '<YTabs'],
    ['tour', 'tour', '<YTour'],
    ['steps', 'steps', '<YSteps'],
    ['collapse', 'collapse', '<YCollapse'],
    ['tooltip', 'tooltip', '<YTooltip'],
    ['popover', 'popover', '<YPopover'],
    ['dropdown', 'dropdown', '<YDropdown'],
    ['popconfirm', 'popconfirm', '<YPopconfirm'],
    ['modal', 'modal', '<YModal'],
    ['drawer', 'drawer', '<YDrawer'],
    ['pagination', 'pagination', '<YPagination'],
    ['timeline', 'timeline', '<YTimeline'],
    ['card', 'card', '<YCard'],
    ['empty', 'empty', '<YEmpty'],
    ['skeleton', 'skeleton', '<YSkeleton'],
    ['image', 'image', '<YImage'],
    ['message', 'message', '<YMessage'],
    ['result', 'result', '<YResult'],
    ['icon', 'icon', '<YIcon'],
    ['configProvider', 'configProvider', '<YConfigProvider'],
    ['textarea', 'textarea', '<YTextarea'],
    ['form', 'form', '<YForm'],
    ['formItem', 'formItem', '<YFormItem'],
    ['formSummary', 'formSummary', '<YFormSummary'],
    ['divider', 'divider', '<YDivider'],
    ['link', 'link', '<YLink'],
    ['text', 'text', '<YText'],
    ['upload', 'upload', '<YUpload'],
    ['transfer', 'transfer', '<YTransfer'],
    ['virtualList', 'virtualList', '<YVirtualList'],
    ['tree', 'tree', '<YTree'],
    ['watermark', 'watermark', '<YWatermark'],
    ['breadcrumb', 'breadcrumb', '<YBreadcrumb'],
    ['backtop', 'backtop', '<YBacktop'],
    ['affix', 'affix', '<YAffix'],
    ['anchor', 'anchor', '<YAnchor'],
    ['scrollbar', 'scrollbar', '<YScrollbar'],
    ['space', 'space', '<YSpace'],
    ['commandPalette', 'commandPalette', '<YCommandPalette'],
    ['codeBlock', 'codeBlock', '<YCodeBlock'],
    ['themeSwitcher', 'themeSwitcher', '<YThemeSwitcher'],
    ['pageHeader', 'pageHeader', '<YPageHeader'],
    ['metricCard', 'metricCard', '<YMetricCard'],
    ['brandHero', 'brandHero', '<YBrandHero'],
    ['featureGrid', 'featureGrid', '<YFeatureGrid'],
    ['profileCard', 'profileCard', '<YProfileCard'],
    ['logoCloud', 'logoCloud', '<YLogoCloud'],
    ['themeProvider', 'themeProvider', '<YThemeProvider'],
    ['schemaForm', 'schemaForm', '<YSchemaForm'],
    ['searchForm', 'searchForm', '<YSearchForm']
  ])('links %s live examples to matching Playground component context', async (preset, component, tag) => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe(component)
    expect(source).toContain(tag)
  })

  it('links schema form live examples with runnable model and schema source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'schemaForm'
      }
    })

    const { source } = await getPlaygroundHandoff(wrapper)

    expect(source).toContain('const schemaFormModel = ref')
    expect(source).toContain('const schemaFormSchema =')
    expect(source).toContain(':schema="schemaFormSchema"')
    expect(source).toContain(':model-value="schemaFormModel"')
    expect(source).not.toContain('model-value="ready"')
  })

  it('links search form live examples with runnable model and fields source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'searchForm'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('searchForm')
    expect(source).toContain('const searchFormModel = ref')
    expect(source).toContain('const searchFormFields =')
    expect(source).toContain(':fields="searchFormFields"')
    expect(source).toContain(':model-value="searchFormModel"')
    expect(source).toContain('"type": "date"')
    expect(source).toContain('"type": "dateRange"')
  })

  it('links data view live examples with runnable views, columns and rows source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataView'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('dataView')
    expect(source).toContain('const dataViewViews =')
    expect(source).toContain('const dataViewColumns =')
    expect(source).toContain('const dataViewRows =')
    expect(source).toContain(':views="dataViewViews"')
    expect(source).toContain(':columns="dataViewColumns"')
    expect(source).toContain(':data="dataViewRows"')
  })

  it('links resource page live examples with runnable search, views, table and detail source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'resourcePage'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('resourcePage')
    expect(source).toContain('const resourceSearchModel = ref')
    expect(source).toContain('const resourceSearchFields =')
    expect(source).toContain('const resourceViews =')
    expect(source).toContain('const resourceColumns =')
    expect(source).toContain('const resourceRows =')
    expect(source).toContain(':search-model="resourceSearchModel"')
    expect(source).toContain(':search-fields="resourceSearchFields"')
    expect(source).toContain(':views="resourceViews"')
    expect(source).toContain(':columns="resourceColumns"')
    expect(source).toContain(':data="resourceRows"')
  })

  it('links CRUD layout live examples with runnable search and table source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'crudLayout'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('crudLayout')
    expect(source).toContain('const crudSearchModel = ref')
    expect(source).toContain('const crudSearchFields =')
    expect(source).toContain('const crudTableColumns =')
    expect(source).toContain('const crudTableRows =')
    expect(source).toContain('<template #search>')
    expect(source).toContain(':model-value="crudSearchModel"')
    expect(source).toContain(':fields="crudSearchFields"')
    expect(source).toContain('<template #table>')
    expect(source).toContain(':columns="crudTableColumns"')
    expect(source).toContain(':data="crudTableRows"')
  })

  it('links bulk action bar live examples with runnable selection and actions source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'bulkActionBar'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('bulkActionBar')
    expect(source).toContain('const bulkSelectedRowKeys = ref')
    expect(source).toContain('const bulkActions =')
    expect(source).toContain(':selected-row-keys="bulkSelectedRowKeys"')
    expect(source).toContain(':actions="bulkActions"')
  })

  it('links data toolbar live examples with copyable actions source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataToolbar'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('dataToolbar')
    expect(source).toContain('const dataToolbarCount =')
    expect(source).toContain(':count="dataToolbarCount"')
    expect(source).toContain('<YButton variant="primary">Create component</YButton>')
  })

  it('links saved views live examples with runnable model and items source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'savedViews'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('savedViews')
    expect(source).toContain('const savedViewModel = ref')
    expect(source).toContain('const savedViewItems =')
    expect(source).toContain(':model-value="savedViewModel"')
    expect(source).toContain(':items="savedViewItems"')
  })

  it('links search panel live examples with runnable model and fields source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'searchPanel'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('searchPanel')
    expect(source).toContain('const searchPanelModel = ref')
    expect(source).toContain('const searchPanelFields =')
    expect(source).toContain(':model-value="searchPanelModel"')
    expect(source).toContain(':fields="searchPanelFields"')
  })

  it('links filter tabs live examples with runnable model and item source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'filterTabs'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('filterTabs')
    expect(source).toContain('const filterTabValue = ref')
    expect(source).toContain('const filterTabItems =')
    expect(source).toContain(':model-value="filterTabValue"')
    expect(source).toContain(':items="filterTabItems"')
  })

  it('links status timeline live examples with runnable item source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'statusTimeline'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('statusTimeline')
    expect(source).toContain('const statusTimelineItems =')
    expect(source).toContain(':items="statusTimelineItems"')
  })

  it('links review workflow live examples with runnable step source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'reviewWorkflow'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('reviewWorkflow')
    expect(source).toContain('const reviewWorkflowSteps =')
    expect(source).toContain(':items="reviewWorkflowSteps"')
  })

  it('links field array live examples with runnable items and default item source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'fieldArray'
      }
    })

    const { url, source } = await getPlaygroundHandoff(wrapper)

    expect(url.searchParams.get('component')).toBe('fieldArray')
    expect(source).toContain('const fieldArrayItems = ref')
    expect(source).toContain('const fieldArrayDefaultItem =')
    expect(source).toContain(':model-value="fieldArrayItems"')
    expect(source).toContain(':default-item="fieldArrayDefaultItem"')
  })

  it('keeps report copy feedback responsive when the clipboard API stalls', async () => {
    vi.useFakeTimers()
    vi.mocked(navigator.clipboard.writeText).mockReturnValue(new Promise(() => {}))

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })
    await nextTick()

    await wrapper.get('.live-example-runner__report-copy').trigger('click')
    await vi.advanceTimersByTimeAsync(360)
    await nextTick()

    expect(wrapper.get('.live-example-runner__report-copy').text()).toContain('已复制报告')
    expect(wrapper.find('.live-example-runner__preview small').text()).toContain('已复制当前 live example 运行报告')

    vi.useRealTimers()
  })

  it('offers source panel segments for SFC, template and install command copy', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    const sourceToggle = wrapper.findAll('button').find((button) => button.text().includes('查看源码'))

    expect(sourceToggle, 'Missing source panel toggle').toBeTruthy()
    await sourceToggle?.trigger('click')
    await nextTick()

    const panel = () => wrapper.get('.live-example-runner__source-panel')

    expect(panel().text()).toContain('完整 SFC')
    expect(panel().text()).toContain('Template')
    expect(panel().text()).toContain('Diff')
    expect(panel().text()).toContain('Install')
    expect(panel().text()).toContain('Repro bundle')
    expect(panel().text()).toContain("import { YButton")

    const sourceTabs = () => panel().findAll('.live-example-runner__source-tab')
    const templateTab = sourceTabs().find((button) => button.text().includes('Template'))

    expect(templateTab, 'Missing template source tab').toBeTruthy()
    await templateTab?.trigger('click')
    await nextTick()

    expect(panel().text()).toContain('<template>')
    expect(panel().text()).not.toContain('<script setup')

    const installTab = sourceTabs().find((button) => button.text().includes('Install'))

    expect(installTab, 'Missing install source tab').toBeTruthy()
    await installTab?.trigger('click')
    await nextTick()

    expect(panel().text()).toContain('pnpm add @yok-ui/core @yok-ui/themes')

    await panel().get('.live-example-runner__source-copy').trigger('click')

    expect(vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0]).toContain(
      'pnpm add @yok-ui/core @yok-ui/themes'
    )
    expect(panel().get('[data-live-source-action="copy-source"]').attributes('data-tooltip')).toBe('已复制 Install')

    expect(panel().get('.live-example-runner__source-footer').attributes('data-source-placement')).toBe('bottom-collapse')
    expect(panel().get('.live-example-runner__source-collapse').text()).toContain('隐藏源代码')

    await panel().get('.live-example-runner__source-collapse').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__source-panel').exists()).toBe(false)
    expect(wrapper.get('.live-example-runner__source-action').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('.live-example-runner__source-action').text()).toContain('查看源码')
  })

  it('moves the reader to the Element style source panel after opening source from the top toolbar', async () => {
    const scrollIntoView = vi.fn()
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView
    })

    try {
      const wrapper = mount(LiveExampleRunner, {
        props: {
          preset: 'button'
        },
        attachTo: document.body
      })

      await wrapper.get('[data-live-toolbar-action="toggle-source"]').trigger('click')
      await nextTick()
      await flushPromises()

      const panel = wrapper.get<HTMLElement>('#live-example-source-panel')

      expect(panel.attributes('tabindex')).toBe('-1')
      expect(scrollIntoView).toHaveBeenCalledWith({
        block: 'start',
        behavior: 'smooth'
      })
      expect(document.activeElement).toBe(panel.element)
    } finally {
      if (originalScrollIntoView) {
        Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
          configurable: true,
          value: originalScrollIntoView
        })
      } else {
        delete HTMLElement.prototype.scrollIntoView
      }
    }
  })

  it('returns focus to the top source toggle after hiding the source panel', async () => {
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn()
    })

    try {
      const wrapper = mount(LiveExampleRunner, {
        props: {
          preset: 'button'
        },
        attachTo: document.body
      })

      await wrapper.get('[data-live-toolbar-action="toggle-source"]').trigger('click')
      await nextTick()
      await flushPromises()

      const panel = wrapper.get<HTMLElement>('#live-example-source-panel')

      expect(document.activeElement).toBe(panel.element)

      await wrapper.get('.live-example-runner__source-collapse').trigger('click')
      await nextTick()
      await flushPromises()

      const sourceToggle = wrapper.get<HTMLElement>('[data-live-toolbar-action="toggle-source"]')

      expect(wrapper.find('#live-example-source-panel').exists()).toBe(false)
      expect(sourceToggle.attributes('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(sourceToggle.element)
    } finally {
      if (originalScrollIntoView) {
        Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
          configurable: true,
          value: originalScrollIntoView
        })
      } else {
        delete HTMLElement.prototype.scrollIntoView
      }
    }
  })

  it('shows and copies a source diff from the selected starter', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })
    const labelInput = wrapper.findAll('.live-example-runner__control input[type="text"]')[0]

    await labelInput.setValue('Review source diff')

    const sourceToggle = wrapper.findAll('button').find((button) => button.text().includes('查看源码'))

    expect(sourceToggle, 'Missing source panel toggle').toBeTruthy()
    await sourceToggle?.trigger('click')
    await nextTick()

    const panel = () => wrapper.get('.live-example-runner__source-panel')
    const diffTab = panel()
      .findAll('.live-example-runner__source-tab')
      .find((button) => button.text().includes('Diff'))

    expect(diffTab, 'Missing source diff tab').toBeTruthy()
    await diffTab?.trigger('click')
    await nextTick()

    expect(panel().find('.live-example-runner__source-help').exists()).toBe(false)
    expect(panel().text()).toContain('Added')
    expect(panel().text()).toContain('Removed')
    expect(panel().text()).toContain('+     <YButton')
    expect(panel().text()).toContain('Review source diff')

    await panel().get('.live-example-runner__source-copy').trigger('click')

    const copiedDiff = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedDiff).toContain('# Yok UI source diff')
    expect(copiedDiff).toContain('- Added lines:')
    expect(copiedDiff).toContain('+     <YButton')
    expect(copiedDiff).toContain('Review source diff')
    expect(panel().get('[data-live-source-action="copy-source"]').attributes('data-tooltip')).toBe('已复制 Diff')
  })

  it('copies a reproduction bundle with package, entry, theme, scenario and current source', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await findScenarioButton(wrapper, '键盘触发').trigger('click')
    await wrapper.get<HTMLSelectElement>('.live-example-runner__theme-select').setValue('yok-clean')
    await nextTick()

    const sourceToggle = wrapper.findAll('button').find((button) => button.text().includes('查看源码'))

    expect(sourceToggle, 'Missing source panel toggle').toBeTruthy()
    await sourceToggle?.trigger('click')
    await nextTick()

    const panel = () => wrapper.get('.live-example-runner__source-panel')
    const reproTab = panel()
      .findAll('.live-example-runner__source-tab')
      .find((button) => button.text().includes('Repro bundle'))

    expect(reproTab, 'Missing reproduction bundle tab').toBeTruthy()
    await reproTab?.trigger('click')
    await nextTick()

    expect(panel().text()).toContain('package.json')
    expect(panel().text()).toContain('src/main.ts')
    expect(panel().text()).toContain('src/App.vue')
    expect(panel().text()).toContain('@yok-ui/themes/yok-clean.css')
    expect(panel().text()).toContain('Submit with keyboard')

    await panel().get('.live-example-runner__source-copy').trigger('click')

    const copiedBundle = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedBundle).toContain('# Yok UI live example reproduction bundle')
    expect(copiedBundle).toContain('- Component: YButton')
    expect(copiedBundle).toContain('- Scenario: 键盘触发')
    expect(copiedBundle).toContain('- Theme: Clean')
    expect(copiedBundle).toContain('## Sync snapshot')
    expect(copiedBundle).toContain('"changedControls": 1')
    expect(copiedBundle).toContain('"name": "yok-ui-button-repro"')
    expect(copiedBundle).toContain('"@yok-ui/core": "latest"')
    expect(copiedBundle).toContain("import '@yok-ui/themes/yok-clean.css'")
    expect(copiedBundle).toContain("import '@yok-ui/core/style.css'")
    expect(copiedBundle).toContain('<YButton')
    expect(copiedBundle).toContain('Submit with keyboard')
    expect(panel().get('[data-live-source-action="copy-source"]').attributes('data-tooltip')).toBe('已复制 Repro bundle')
  })

  it('switches install source panel commands across common package managers', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    const sourceToggle = wrapper.findAll('button').find((button) => button.text().includes('查看源码'))

    expect(sourceToggle, 'Missing source panel toggle').toBeTruthy()
    await sourceToggle?.trigger('click')
    await nextTick()

    const panel = () => wrapper.get('.live-example-runner__source-panel')
    const installTab = panel()
      .findAll('.live-example-runner__source-tab')
      .find((button) => button.text().includes('Install'))

    expect(installTab, 'Missing install source tab').toBeTruthy()
    await installTab?.trigger('click')
    await nextTick()

    expect(panel().text()).toContain('npm')
    expect(panel().text()).toContain('yarn')
    expect(panel().text()).toContain('pnpm')
    expect(panel().text()).toContain('bun')
    expect(panel().text()).toContain('pnpm add @yok-ui/core @yok-ui/themes')

    const npmButton = panel()
      .findAll('.live-example-runner__package-manager')
      .find((button) => button.text().includes('npm'))

    expect(npmButton, 'Missing npm package manager option').toBeTruthy()
    await npmButton?.trigger('click')
    await nextTick()

    expect(panel().text()).toContain('npm install @yok-ui/core @yok-ui/themes')

    await panel().get('.live-example-runner__source-copy').trigger('click')

    expect(vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0]).toContain(
      'npm install @yok-ui/core @yok-ui/themes'
    )
  })

  it('switches source panel SFC code between TypeScript and JavaScript copy views', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await wrapper.find('textarea').setValue(`<script setup lang="ts">
import { YButton, type YButtonProps } from '@yok-ui/core'

interface DemoState {
  label: string
}

const demo: DemoState = {
  label: 'Run workflow'
}
</script>

<template>
  <YButton variant="primary">{{ demo.label }}</YButton>
</template>`)

    const sourceToggle = wrapper.findAll('button').find((button) => button.text().includes('查看源码'))

    expect(sourceToggle, 'Missing source panel toggle').toBeTruthy()
    await sourceToggle?.trigger('click')
    await nextTick()

    const panel = () => wrapper.get('.live-example-runner__source-panel')

    expect(panel().text()).toContain('TS')
    expect(panel().text()).toContain('JS')
    expect(panel().text()).toContain('<script setup lang="ts">')
    expect(panel().text()).toContain('type YButtonProps')

    const javascriptButton = panel()
      .findAll('.live-example-runner__source-language')
      .find((button) => button.text().includes('JS'))

    expect(javascriptButton, 'Missing JavaScript source language button').toBeTruthy()
    await javascriptButton?.trigger('click')
    await nextTick()

    expect(panel().text()).toContain('<script setup>')
    expect(panel().text()).not.toContain('lang="ts"')
    expect(panel().text()).not.toContain('type YButtonProps')
    expect(panel().text()).not.toContain('interface DemoState')
    expect(panel().text()).not.toContain(': DemoState')

    await panel().get('.live-example-runner__source-copy').trigger('click')

    const copiedCode = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedCode).toContain('<script setup>')
    expect(copiedCode).not.toContain('lang="ts"')
    expect(copiedCode).not.toContain('type YButtonProps')
  })

  it('shows an active scenario debug summary that follows scenario, source and events', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await nextTick()
    await nextTick()

    const summary = () => wrapper.get('[aria-label="Active scenario debug summary"]')

    expect(summary().text()).toContain('Active scenario')
    expect(summary().text()).toContain('主操作')
    expect(summary().text()).toContain('primary-action-button')
    expect(summary().text()).toContain('Source')
    expect(summary().text()).toContain('Events 0')
    expect(summary().text()).toContain('Preview Runnable')
    expect(summary().text()).toContain('Share ready')

    await findScenarioButton(wrapper, '键盘触发').trigger('click')
    await nextTick()

    expect(summary().text()).toContain('键盘触发')
    expect(summary().text()).toContain('keyboard-button')
    expect(summary().text()).toContain('键盘路径')

    const previewButton = wrapper
      .findAll('.live-example-runner__stage button')
      .find((button) => button.text().includes('Submit with keyboard'))

    expect(previewButton).toBeTruthy()
    await previewButton?.trigger('click')
    await nextTick()

    expect(summary().text()).toContain('Events 1')
  })

  it('promotes button examples to mainstream action, group, copy, loading, disabled, danger, mobile and keyboard scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(acceptancePanel.text()).toContain('9 scenes')
    expect(acceptancePanel.find('[data-check-key="loading-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const scenarioButtons = wrapper.findAll('.live-example-runner__scenario-grid button')
    const submitScenario = scenarioButtons.find((button) => button.text().includes('表单提交'))
    const groupScenario = scenarioButtons.find((button) => button.text().includes('按钮组'))
    const copyScenario = scenarioButtons.find((button) => button.text().includes('复制命令'))
    const loadingScenario = scenarioButtons.find((button) => button.text().includes('加载提交'))
    const dangerScenario = scenarioButtons.find((button) => button.text().includes('风险操作'))
    const keyboardScenario = scenarioButtons.find((button) => button.text().includes('键盘触发'))

    expect(submitScenario).toBeTruthy()
    expect(groupScenario).toBeTruthy()
    expect(copyScenario).toBeTruthy()
    expect(loadingScenario).toBeTruthy()
    expect(dangerScenario).toBeTruthy()
    expect(keyboardScenario).toBeTruthy()

    await submitScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Submit review')
    expect(wrapper.find('textarea').element.value).toContain('type="submit"')
    expect(wrapper.find('textarea').element.value).toContain('native form intent')

    await groupScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Publish</YButton>')
    expect(wrapper.find('textarea').element.value).toContain('Save draft</YButton>')
    expect(wrapper.find('textarea').element.value).toContain('Preview</YButton>')

    await copyScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Copy command')
    expect(wrapper.find('textarea').element.value).toContain('perceptible confirmation')

    await loadingScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('loading')
    expect(wrapper.find('textarea').element.value).toContain('Loading avoids duplicate submits.')

    await dangerScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Delete draft')
    expect(wrapper.find('textarea').element.value).toContain('tone="danger"')

    await keyboardScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Submit with keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Enter or Space triggers click')
  })

  it('hydrates button keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-button'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll<HTMLSelectElement>('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Submit with keyboard')
    expect(wrapper.text()).toContain('已切换到「键盘触发」场景。')

    window.location.hash = ''
  })

  it('copies and hydrates props panel state from shareable live-example hashes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await findControlByLabel(wrapper, '按钮文案').find('input[type="text"]').setValue('Ship Yok UI')
    await setCheckbox(wrapper, '加载中', true)
    await wrapper.get<HTMLSelectElement>('.live-example-runner__theme-select').setValue('yok-candy')
    await wrapper
      .findAll('.live-example-runner__viewport button')
      .find((button) => button.text().includes('手机'))
      ?.trigger('click')

    await wrapper.get('.live-example-runner__state-link-copy').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)
    const [, hashQuery = ''] = url.hash.slice(1).split('?')
    const params = new URLSearchParams(hashQuery)
    const sharedState = JSON.parse(params.get('state') ?? '{}') as Record<string, unknown>

    expect(url.hash).toContain('live-example')
    expect(params.get('theme')).toBe('yok-candy')
    expect(params.get('viewport')).toBe('mobile')
    expect(sharedState.label).toBe('Ship Yok UI')
    expect(sharedState.loading).toBe(true)
    expect(window.location.hash).toBe(url.hash)
    expect(wrapper.get('.live-example-runner__state-link-copy').text()).toContain('已复制状态链接')
    expect(wrapper.find('.live-example-runner__preview small').text()).toContain('同步到当前地址')

    wrapper.unmount()
    window.location.hash = url.hash

    const restored = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })
    await restored.vm.$nextTick()

    expect(findControlByLabel(restored, '按钮文案').find<HTMLInputElement>('input[type="text"]').element.value).toBe(
      'Ship Yok UI'
    )
    expect(findControlByLabel(restored, '加载中').find<HTMLInputElement>('input[type="checkbox"]').element.checked).toBe(
      true
    )
    expect(restored.find('textarea').element.value).toContain('Ship Yok UI')
    expect(restored.find('textarea').element.value).toContain('loading')
    expect(restored.get<HTMLSelectElement>('.live-example-runner__theme-select').element.value).toBe('yok-candy')
    expect(restored.get('.live-example-runner__frame .yok-theme-provider').attributes('data-yok-theme')).toBe('yok-candy')
    expect(restored.get('.live-example-runner__preview').text()).toContain('Preview · 手机')
    expect(restored.text()).toContain('已从分享链接恢复属性面板。')

    window.location.hash = ''
  })

  it('copies workflow scenario links and keeps the browser address shareable', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await findScenarioButton(wrapper, '键盘触发').trigger('click')
    await wrapper.get<HTMLSelectElement>('.live-example-runner__theme-select').setValue('yok-clean')
    await nextTick()

    await wrapper.get('.live-example-runner__scenario-copy').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)
    const [, hashQuery = ''] = url.hash.slice(1).split('?')
    const params = new URLSearchParams(hashQuery)

    expect(url.hash).toContain('live-example')
    expect(params.get('scenario')).toBe('keyboard-button')
    expect(params.get('theme')).toBe('yok-clean')
    expect(window.location.hash).toBe(url.hash)
    expect(wrapper.get('.live-example-runner__scenario-copy').text()).toContain('已复制链接')
    expect(wrapper.find('.live-example-runner__preview small').text()).toContain('同步到当前地址')

    window.location.hash = ''
  })

  it('promotes input examples to help, search, clearable, density, validation, disabled, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'input'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(wrapper.text()).toContain('Input scenario')
    expect(acceptancePanel.text()).toContain('9 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const scenarioButtons = wrapper.findAll('.live-example-runner__scenario-grid button')
    const helpScenario = scenarioButtons.find((button) => button.text().includes('帮助说明'))
    const searchScenario = scenarioButtons.find((button) => button.text().includes('搜索输入'))
    const clearableScenario = scenarioButtons.find((button) => button.text().includes('可清空计数'))
    const densityScenario = scenarioButtons.find((button) => button.text().includes('尺寸密度'))
    const validationScenario = scenarioButtons.find((button) => button.text().includes('校验错误'))
    const disabledScenario = scenarioButtons.find((button) => button.text().includes('禁用复核'))
    const keyboardScenario = scenarioButtons.find((button) => button.text().includes('键盘录入'))

    expect(helpScenario).toBeTruthy()
    expect(searchScenario).toBeTruthy()
    expect(clearableScenario).toBeTruthy()
    expect(densityScenario).toBeTruthy()
    expect(validationScenario).toBeTruthy()
    expect(disabledScenario).toBeTruthy()
    expect(keyboardScenario).toBeTruthy()

    await helpScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Library namespace')
    expect(wrapper.find('textarea').element.value).toContain('aria-describedby="namespace-help"')
    expect(wrapper.find('textarea').element.value).toContain('Use lowercase letters for package namespaces')

    await searchScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Search components')
    expect(wrapper.find('textarea').element.value).toContain('Search by name, owner or package')
    expect(wrapper.find('textarea').element.value).toContain('component-search-help')

    await clearableScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('prefix-text="/"')
    expect(wrapper.find('textarea').element.value).toContain('clearable')
    expect(wrapper.find('textarea').element.value).toContain('show-count')
    expect(wrapper.find('textarea').element.value).toContain(':maxlength="24"')
    expect(wrapper.find('.live-example-runner__stage .yok-input__count').text()).toContain('9/24')
    expect(wrapper.find('.live-example-runner__stage .yok-input__clear').exists()).toBe(true)

    await densityScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('size="sm"')
    expect(wrapper.find('textarea').element.value).toContain('size="md"')
    expect(wrapper.find('textarea').element.value).toContain('size="lg"')

    await validationScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Component name is required before release.')
    expect(wrapper.find('textarea').element.value).toContain('invalid')
    expect(wrapper.find('textarea').element.value).toContain('aria-describedby="component-name-error"')

    await disabledScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Readonly plan')
    expect(wrapper.find('textarea').element.value).toContain('disabled')

    await keyboardScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard field')
    expect(wrapper.find('textarea').element.value).toContain('Tab enters the native input')
  })

  it('hydrates input keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-input'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'input'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll<HTMLSelectElement>('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard field')
    expect(wrapper.text()).toContain('已切换到「键盘录入」场景。')

    window.location.hash = ''
  })

  it('keeps input live previews interactive after typing and clearing text', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'input'
      }
    })

    await flushPromises()
    await nextTick()
    await findScenarioButton(wrapper, '可清空计数').trigger('click')
    await nextTick()

    const input = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-input__control')

    expect(input.element.value).toBe('component')

    await input.setValue('Yok UI Docs')
    await input.trigger('change')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-input__control').element.value).toBe('Yok UI Docs')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"input": "Yok UI Docs"')

    await wrapper.get('.live-example-runner__preview .yok-input__clear').trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-input__control').element.value).toBe('')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"input": ""')
  })

  it('simulates input search and clear workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=clearable-count-input'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'input'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="input-simulate-search"]').trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-input__control').element.value).toBe('button')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"input": "button"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__preview .yok-input__count').text()).toContain('6/24')

    await wrapper.get('[data-testid="input-simulate-clear"]').trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-input__control').element.value).toBe('')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"input": ""')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')
    expect(wrapper.text()).toContain('已模拟 Input 清空搜索词')

    window.location.hash = ''
  })

  it('promotes checkbox examples to group, group limits, indeterminate, required, disabled, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'checkbox'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(wrapper.text()).toContain('Checkbox scenario')
    expect(acceptancePanel.text()).toContain('9 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const scenarioButtons = wrapper.findAll('.live-example-runner__scenario-grid button')
    const checklistScenario = scenarioButtons.find((button) => button.text().includes('清单组合'))
    const limitedGroupScenario = scenarioButtons.find((button) => button.text().includes('数量限制组'))
    const indeterminateScenario = scenarioButtons.find((button) => button.text().includes('半选状态'))
    const formValidationScenario = scenarioButtons.find((button) => button.text().includes('表单校验组'))
    const requiredScenario = scenarioButtons.find((button) => button.text().includes('必选确认'))
    const disabledScenario = scenarioButtons.find((button) => button.text().includes('锁定项'))
    const keyboardScenario = scenarioButtons.find((button) => button.text().includes('键盘切换'))

    expect(checklistScenario).toBeTruthy()
    expect(limitedGroupScenario).toBeTruthy()
    expect(indeterminateScenario).toBeTruthy()
    expect(formValidationScenario).toBeTruthy()
    expect(requiredScenario).toBeTruthy()
    expect(disabledScenario).toBeTruthy()
    expect(keyboardScenario).toBeTruthy()

    await checklistScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('<YCheckboxGroup')
    expect(wrapper.find('textarea').element.value).toContain('Release checklist')
    expect(wrapper.find('textarea').element.value).toContain('Visual regression pending')
    expect(wrapper.find('textarea').element.value).toContain('Group related checkboxes')
    await nextTick()
    expect(wrapper.find('.live-example-runner__stage fieldset').exists()).toBe(true)

    await limitedGroupScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain(':min="1"')
    expect(wrapper.find('textarea').element.value).toContain(':max="2"')
    expect(wrapper.find('textarea').element.value).toContain('Selection boundary')
    expect(wrapper.find('textarea').element.value).toContain('The group disables invalid choices')
    await nextTick()
    let groupInputs = wrapper.findAll<HTMLInputElement>('.live-example-runner__stage input[type="checkbox"]')
    expect(groupInputs[0].element.checked).toBe(true)
    expect(groupInputs[0].element.disabled).toBe(true)

    await groupInputs[1].setValue(true)
    await nextTick()
    groupInputs = wrapper.findAll<HTMLInputElement>('.live-example-runner__stage input[type="checkbox"]')
    expect(groupInputs[1].element.checked).toBe(true)
    expect(groupInputs[2].element.disabled).toBe(true)

    await indeterminateScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Select all packages')
    expect(wrapper.find('textarea').element.value).toContain('indeterminate')
    expect(wrapper.find('textarea').element.value).toContain('Use indeterminate on parent checkboxes')
    await nextTick()
    expect(wrapper.find('.live-example-runner__stage input[aria-checked="mixed"]').exists()).toBe(true)

    await formValidationScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('<YForm')
    expect(wrapper.find('textarea').element.value).toContain('<YCheckboxGroup')
    expect(wrapper.find('textarea').element.value).toContain('aria-describedby="yok-form-message-packages"')
    expect(wrapper.find('.live-example-runner__stage fieldset[aria-invalid="true"]').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__stage [role="alert"]').text()).toContain('Choose at least one package.')

    await requiredScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Please confirm the release checklist before publishing.')
    expect(wrapper.find('textarea').element.value).toContain('tone="danger"')

    await disabledScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Locked by policy')
    expect(wrapper.find('textarea').element.value).toContain('disabled')

    await keyboardScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Space toggles the native checkbox')
    expect(wrapper.find('textarea').element.value).toContain('<YCheckbox')
  })

  it('promotes radio group examples to choice, form validation, disabled option, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'radioGroup'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(wrapper.text()).toContain('Radio Group scenario')
    expect(acceptancePanel.text()).toContain('7 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const scenarioButtons = wrapper.findAll('.live-example-runner__scenario-grid button')
    const requiredScenario = scenarioButtons.find((button) => button.text().includes('必选单选'))
    const formValidationScenario = scenarioButtons.find((button) => button.text().includes('表单校验组'))
    const disabledOptionScenario = scenarioButtons.find((button) => button.text().includes('禁用选项'))
    const mobileScenario = scenarioButtons.find((button) => button.text().includes('移动单选'))
    const keyboardScenario = scenarioButtons.find((button) => button.text().includes('键盘选择'))

    expect(requiredScenario).toBeTruthy()
    expect(formValidationScenario).toBeTruthy()
    expect(disabledOptionScenario).toBeTruthy()
    expect(mobileScenario).toBeTruthy()
    expect(keyboardScenario).toBeTruthy()

    await requiredScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Please choose one package before continuing.')
    expect(wrapper.find('textarea').element.value).toContain('error="Choose a package."')
    await nextTick()
    expect(wrapper.find('.live-example-runner__stage fieldset[aria-invalid="true"]').exists()).toBe(true)
    expect(wrapper.find('textarea').element.value).toContain('tone="danger"')

    await formValidationScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('<YForm')
    expect(wrapper.find('textarea').element.value).toContain('<YRadioGroup')
    expect(wrapper.find('textarea').element.value).toContain('aria-describedby="yok-form-message-packageName"')
    expect(wrapper.find('.live-example-runner__stage fieldset[aria-invalid="true"]').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__stage [role="alert"]').text()).toContain('Choose a package.')

    await disabledOptionScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Product is disabled during review')
    expect(wrapper.find('textarea').element.value).toContain('disabled: true')

    await mobileScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Compact package choice')

    await keyboardScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Arrow keys move between radio options')
  })

  it('promotes switch examples to instant, status copy, form validation, loading, disabled, risk and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'switch'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(wrapper.text()).toContain('Switch scenario')
    expect(acceptancePanel.text()).toContain('8 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const scenarioButtons = wrapper.findAll('.live-example-runner__scenario-grid button')
    const statusScenario = scenarioButtons.find((button) => button.text().includes('状态文案'))
    const formValidationScenario = scenarioButtons.find((button) => button.text().includes('表单校验开关'))
    const loadingScenario = scenarioButtons.find((button) => button.text().includes('加载开关'))
    const riskScenario = scenarioButtons.find((button) => button.text().includes('风险开关'))
    const disabledScenario = scenarioButtons.find((button) => button.text().includes('锁定开关'))
    const keyboardScenario = scenarioButtons.find((button) => button.text().includes('键盘开关'))

    expect(statusScenario).toBeTruthy()
    expect(formValidationScenario).toBeTruthy()
    expect(loadingScenario).toBeTruthy()
    expect(riskScenario).toBeTruthy()
    expect(disabledScenario).toBeTruthy()
    expect(keyboardScenario).toBeTruthy()

    await statusScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Sync documentation')
    expect(wrapper.find('textarea').element.value).toContain('On: documentation changes are synced')
    expect(wrapper.find('textarea').element.value).toContain('active-text="Synced"')
    expect(wrapper.find('textarea').element.value).toContain('tone="info"')

    await formValidationScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('<YForm')
    expect(wrapper.find('textarea').element.value).toContain('<YSwitch')
    expect(wrapper.find('textarea').element.value).toContain('aria-describedby="yok-form-message-confirmed"')
    expect(wrapper.find('.live-example-runner__stage button[aria-invalid="true"]').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__stage [role="alert"]').text()).toContain('Enable release confirmation.')

    await loadingScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('loading')
    expect(wrapper.find('textarea').element.value).toContain('active-text="Saving"')
    expect(wrapper.find('.live-example-runner__stage button[aria-busy="true"]').exists()).toBe(true)

    await riskScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Disable audit trail')
    expect(wrapper.find('textarea').element.value).toContain('Audit trail cannot be disabled')
    expect(wrapper.find('.live-example-runner__stage button[aria-invalid="true"]').exists()).toBe(true)
    expect(wrapper.find('textarea').element.value).toContain('tone="danger"')

    await disabledScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Controlled by workspace policy')
    expect(wrapper.find('textarea').element.value).toContain('disabled')

    await keyboardScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('Space or Enter toggles the switch')
    expect(wrapper.find('textarea').element.value).toContain('<YSwitch')
  })

  it('hydrates checkbox, radio and switch keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-checkbox'
    const checkbox = mount(LiveExampleRunner, {
      props: {
        preset: 'checkbox'
      }
    })
    await checkbox.vm.$nextTick()

    expect(checkbox.findAll<HTMLSelectElement>('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(checkbox.find('textarea').element.value).toContain('Space toggles the native checkbox')

    window.location.hash = '#live-example?scenario=keyboard-radio-group'
    const radioGroup = mount(LiveExampleRunner, {
      props: {
        preset: 'radioGroup'
      }
    })
    await radioGroup.vm.$nextTick()

    expect(radioGroup.findAll<HTMLSelectElement>('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(radioGroup.find('textarea').element.value).toContain('Arrow keys move between radio options')

    window.location.hash = '#live-example?scenario=keyboard-switch'
    const switchRunner = mount(LiveExampleRunner, {
      props: {
        preset: 'switch'
      }
    })
    await switchRunner.vm.$nextTick()

    expect(switchRunner.findAll<HTMLSelectElement>('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(switchRunner.find('textarea').element.value).toContain('Space or Enter toggles the switch')

    window.location.hash = ''
  })

  it('keeps checkbox live previews interactive after toggling the checked state', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'checkbox'
      }
    })

    await flushPromises()
    await nextTick()

    const checkbox = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-checkbox__input')

    expect(checkbox.element.checked).toBe(true)

    checkbox.element.checked = false
    await checkbox.trigger('change')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-checkbox__input').element.checked).toBe(false)
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"checkbox": false')
  })

  it('simulates checkbox checklist bulk and partial selection workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=checklist-checkbox'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'checkbox'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="checkbox-simulate-select-all"]').trigger('click')
    await nextTick()

    let groupInputs = wrapper.findAll<HTMLInputElement>('.live-example-runner__preview input[type="checkbox"]')

    expect(groupInputs.filter((input) => input.element.checked)).toHaveLength(3)
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"visual"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="checkbox-simulate-partial"]').trigger('click')
    await nextTick()

    groupInputs = wrapper.findAll<HTMLInputElement>('.live-example-runner__preview input[type="checkbox"]')

    expect(groupInputs.filter((input) => input.element.checked)).toHaveLength(1)
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"api"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).not.toContain('"a11y"')
    expect(wrapper.text()).toContain('已模拟 Checkbox 回退到部分选中')

    window.location.hash = ''
  })

  it('keeps radio group live previews interactive after choosing another option', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'radioGroup'
      }
    })

    await flushPromises()
    await nextTick()

    const productRadio = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-radio__input[value="product"]')

    expect(productRadio.element.checked).toBe(false)

    productRadio.element.checked = true
    await productRadio.trigger('change')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-radio__input[value="product"]').element.checked).toBe(true)
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"radioGroup": "product"')
  })

  it('simulates radio group package choice and reset workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=package-radio-group'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'radioGroup'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="radio-group-simulate-product"]').trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-radio__input[value="product"]').element.checked).toBe(true)
    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-radio__input[value="core"]').element.checked).toBe(false)
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"radioGroup": "product"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="radio-group-simulate-core"]').trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-radio__input[value="core"]').element.checked).toBe(true)
    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-radio__input[value="product"]').element.checked).toBe(false)
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"radioGroup": "core"')
    expect(wrapper.text()).toContain('已模拟 Radio Group 回退到 Core')

    window.location.hash = ''
  })

  it('keeps switch live previews interactive after toggling the switch', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'switch'
      }
    })

    await flushPromises()
    await nextTick()

    const switchButton = wrapper.get('.live-example-runner__preview [role="switch"]')

    expect(switchButton.attributes('aria-checked')).toBe('true')

    await switchButton.trigger('click')
    await nextTick()

    expect(wrapper.get('.live-example-runner__preview [role="switch"]').attributes('aria-checked')).toBe('false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"switch": false')
  })

  it('simulates switch enable and rollback workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=instant-switch'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'switch'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="switch-simulate-enable"]').trigger('click')
    await nextTick()

    expect(wrapper.get('.live-example-runner__preview [role="switch"]').attributes('aria-checked')).toBe('true')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"switch": true')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="switch-simulate-rollback"]').trigger('click')
    await nextTick()

    expect(wrapper.get('.live-example-runner__preview [role="switch"]').attributes('aria-checked')).toBe('false')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"switch": false')
    expect(wrapper.text()).toContain('已模拟回滚 Switch')

    window.location.hash = ''
  })

  it('keeps source-first fallback available when no visual controls are registered', () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'default'
      }
    })

    expect(wrapper.text()).toContain('Source first')
    expect(wrapper.find('.live-example-runner__cockpit').text()).toContain('Source first')
    expect(wrapper.text()).toContain('当前示例暂未登记可视化属性面板')
    expect(wrapper.find('.live-example-runner__editor textarea').exists()).toBe(true)
  })

  it('adds source line numbers and actionable diagnostics to the live editor', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })
    const invalidSource = [
      '<template>',
      '  <YButton @click="save">Save</YButton>',
      '</template>'
    ].join('\n')

    expect(wrapper.find('.live-example-runner__line-gutter').exists()).toBe(true)

    await wrapper.find('textarea').setValue(invalidSource)
    await nextTick()

    expect(wrapper.find('.live-example-runner__error').text()).toContain('示例无法运行')
    expect(wrapper.find('.live-example-runner__line-gutter li[data-active="true"]').text()).toBe('2')

    await wrapper.get('.live-example-runner__diagnostic-actions button').trigger('click')

    const textarea = wrapper.find('textarea').element

    expect(textarea.selectionStart).toBe(invalidSource.indexOf('  <YButton'))

    await wrapper
      .findAll('.live-example-runner__diagnostic-actions button')[1]
      .trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('# Yok UI live example diagnostic')
    )
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('- SFC line: 2')
    )
  })

  it('generates saved views examples with selected view and action text controls', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'savedViews'
      }
    })

    expect(wrapper.text()).toContain('Saved Views scenario')

    const selectedView = wrapper.findAll('.live-example-runner__control select')[1]
    await selectedView.setValue('review')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YSavedViews')
    expect(source).toContain("const savedViewModel = ref('review')")
    expect(source).toContain(':model-value="savedViewModel"')
    expect(source).toContain('save-text="Save current"')
  })

  it('generates search panel examples with object model values', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'searchPanel'
      }
    })

    expect(wrapper.text()).toContain('Search Panel scenario')

    const keywordInput = wrapper.findAll('.live-example-runner__control input[type="text"]')[2]
    await keywordInput.setValue('tooltip')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YSearchPanel')
    expect(source).toContain('const searchPanelModel = ref({')
    expect(source).toContain('"keyword": "tooltip"')
    expect(source).toContain(':model-value="searchPanelModel"')
    expect(wrapper.text()).toContain('Apply filters')
  })

  it('generates brand examples with visual controls', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'profileCard'
      }
    })

    expect(wrapper.text()).toContain('Profile Card scenario')

    await setCheckbox(wrapper, '显示标签', false)

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YProfileCard')
    expect(source).toContain('avatar-text="Y"')
    expect(source).toContain('tags=""')
  })

  it('upgrades command palette examples into guided examples', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'commandPalette'
      }
    })

    expect(wrapper.text()).toContain('Command Palette scenario')
    expect(wrapper.find('.live-example-runner__cockpit').text()).toContain('4 controls')

    await setCheckbox(wrapper, '默认打开', false)

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YCommandPalette />')
    expect(source).toContain('Try keyboard navigation')
    expect(source).not.toContain('<YCommandPalette open')
  })

  it('generates code block examples with language, snippet and copy controls', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'codeBlock'
      }
    })

    expect(wrapper.text()).toContain('Code Block scenario')

    const languageSelect = wrapper.findAll('.live-example-runner__control select')[1]
    await languageSelect.setValue('sh')

    await setCheckbox(wrapper, '复制按钮', false)

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YCodeBlock')
    expect(source).toContain('language="sh"')
    expect(source).not.toContain('<YCopyButton')
  })

  it('generates admin toolbar examples with count and action controls', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataToolbar'
      }
    })

    expect(wrapper.text()).toContain('Data Toolbar scenario')

    const countSlider = wrapper.find('.live-example-runner__control input[type="range"]')
    await countSlider.setValue(88)

    await setCheckbox(wrapper, '显示操作', false)

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YDataToolbar')
    expect(source).toContain('const dataToolbarCount = 88')
    expect(source).toContain(':count="dataToolbarCount"')
    expect(source).not.toContain('<YButton')
  })

  it('generates editable select examples with injected option hints', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })

    expect(wrapper.text()).toContain('Select scenario')
    expect(wrapper.find('textarea').element.value).toContain('Options are injected by the docs runner')

    const packageSelect = wrapper.findAll('.live-example-runner__control select')[1]
    await packageSelect.setValue('admin')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YSelect')
    expect(source).toContain('model-value="admin"')
    expect(source).toContain('Options are injected by the docs runner')
  })

  it('promotes select examples to overlay keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(acceptancePanel.text()).toContain('17 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘选择'))

    expect(keyboardScenario, 'Missing select keyboard scenario').toBeTruthy()

    await keyboardScenario?.trigger('click')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard package picker')
    expect(wrapper.find('textarea').element.value).toContain('Enter or Space opens the listbox')
    expect(wrapper.find('textarea').element.value).toContain('model-value="product"')
    expect(wrapper.text()).toContain('已切换到「键盘选择」场景。')
  })

  it('documents select clearable, multiple and size workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })

    const scenarioButtons = wrapper.findAll('.live-example-runner__scenario-grid button')
    const clearableScenario = scenarioButtons.find((button) => button.text().includes('可清空'))
    const multipleScenario = scenarioButtons.find((button) => button.text().includes('多选标签'))
    const sizeScenario = scenarioButtons.find((button) => button.text().includes('尺寸密度'))

    expect(clearableScenario).toBeTruthy()
    expect(multipleScenario).toBeTruthy()
    expect(sizeScenario).toBeTruthy()

    await clearableScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('clearable')
    expect(wrapper.find('textarea').element.value).toContain('Clearable select mirrors Element Plus style form recovery.')

    await wrapper.get('.live-example-runner__stage [role="combobox"]').trigger('click')
    await nextTick()
    await wrapper.get('.live-example-runner__stage [role="option"][id$="product"]').trigger('click')
    await nextTick()
    expect(wrapper.find('#live-example-event-log').text()).toContain('@visibleChange')
    expect(wrapper.find('#live-example-event-log').text()).toContain('@change')
    expect(wrapper.find('#live-example-event-log').text()).toContain('@update:modelValue')

    await multipleScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('multiple')
    expect(wrapper.find('textarea').element.value).toContain(`:model-value="['core', 'product']"`)
    expect(wrapper.find('textarea').element.value).toContain('Multiple selection keeps the panel open and displays compact tags.')

    await sizeScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('size="small"')
    expect(wrapper.find('textarea').element.value).toContain('size="large"')
    expect(wrapper.find('textarea').element.value).toContain('Size variants align Select with form density systems.')
  })

  it('keeps select live previews interactive after choosing another option', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })

    await flushPromises()
    await nextTick()

    const combobox = wrapper.get('.live-example-runner__preview [role="combobox"]')

    expect(combobox.text()).toContain('Core primitives')

    await combobox.trigger('click')
    await nextTick()

    const productOption = wrapper
      .findAll('.live-example-runner__preview [role="option"]')
      .find((option) => option.text().includes('Product tools'))

    expect(productOption, 'Missing Product tools option').toBeTruthy()

    await productOption!.trigger('click')
    await nextTick()

    expect(wrapper.get('.live-example-runner__preview [role="combobox"]').text()).toContain('Product tools')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"select": "product"')
  })

  it('documents select collapsed tag workflow scenes', async () => {
    window.location.hash = '#live-example?scenario=collapsed-tags-select'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('collapsedTags')
    expect(wrapper.find('textarea').element.value).toContain('Collapsed tag picker')
    expect(wrapper.find('textarea').element.value).toContain('collapse-tags')
    expect(wrapper.find('textarea').element.value).toContain('max-collapse-tags="2"')
    expect(wrapper.find('textarea').element.value).toContain('Collapsed tags prevent dense multiple selects from stretching forms.')
    expect(wrapper.text()).toContain('已切换到「标签折叠」场景。')
  })

  it('documents select disabled option workflow scenes', async () => {
    window.location.hash = '#live-example?scenario=disabled-option-select'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('disabledOptions')
    expect(wrapper.find('textarea').element.value).toContain('Disabled option picker')
    expect(wrapper.find('textarea').element.value).toContain('const disabledPackageOptions')
    expect(wrapper.find('textarea').element.value).toContain('disabled: true')
    expect(wrapper.find('textarea').element.value).toContain(':options="disabledPackageOptions"')
    expect(wrapper.find('textarea').element.value).toContain('Disabled options stay visible but cannot be selected.')

    await wrapper.get('[role="combobox"]').trigger('click')
    const options = wrapper.findAll('[role="option"]')
    const disabledOption = options.find((option) => option.text().includes('Admin workflow'))
    expect(disabledOption?.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('已切换到「禁用选项」场景。')
  })

  it('documents select allow-create workflow scenes', async () => {
    window.location.hash = '#live-example?scenario=allow-create-select'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('allowCreate')
    expect(wrapper.find('textarea').element.value).toContain('Creatable tag picker')
    expect(wrapper.find('textarea').element.value).toContain('filterable')
    expect(wrapper.find('textarea').element.value).toContain('allow-create')
    expect(wrapper.find('textarea').element.value).toContain('Type a new tag and press Enter to create it.')
    expect(wrapper.text()).toContain('已切换到「创建选项」场景。')
  })

  it('documents select virtualized workflow scenes', async () => {
    window.location.hash = '#live-example?scenario=virtualized-select'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('virtualized')
    expect(wrapper.find('textarea').element.value).toContain('Virtualized package picker')
    expect(wrapper.find('textarea').element.value).toContain('const largePackageOptions')
    expect(wrapper.find('textarea').element.value).toContain('virtualized')
    expect(wrapper.find('textarea').element.value).toContain(':virtual-height="220"')
    expect(wrapper.find('textarea').element.value).toContain(':virtual-item-height="36"')
    expect(wrapper.find('textarea').element.value).toContain('Virtualized options keep large lists light without breaking listbox semantics.')
    expect(wrapper.text()).toContain('已切换到「虚拟滚动」场景。')
  })

  it('documents select searchable and empty-result workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })

    const scenarioButtons = wrapper.findAll('.live-example-runner__scenario-grid button')
    const filterableScenario = scenarioButtons.find((button) => button.text().includes('可搜索'))
    const emptyScenario = scenarioButtons.find((button) => button.text().includes('无匹配结果'))

    expect(filterableScenario).toBeTruthy()
    expect(emptyScenario).toBeTruthy()

    await filterableScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('filterable')
    expect(wrapper.find('textarea').element.value).toContain('search-placeholder="Search packages"')
    expect(wrapper.find('textarea').element.value).toContain('Filterable select mirrors mainstream searchable pickers.')

    await emptyScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('filterable')
    expect(wrapper.find('textarea').element.value).toContain('empty-text="No package matches"')
    expect(wrapper.find('textarea').element.value).toContain('Empty-result copy keeps search failures calm and actionable.')
  })

  it('documents select grouped option workflow scenes', async () => {
    window.location.hash = '#live-example?scenario=grouped-select'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('grouped')
    expect(wrapper.find('textarea').element.value).toContain('Grouped package picker')
    expect(wrapper.find('textarea').element.value).toContain('groupedPackageOptions')
    expect(wrapper.find('textarea').element.value).toContain('Grouped options mirror mainstream Select option-group patterns.')
    expect(wrapper.text()).toContain('已切换到「分组选项」场景。')
  })

  it('documents select remote loading workflow scenes', async () => {
    window.location.hash = '#live-example?scenario=remote-select'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('remote')
    expect(wrapper.find('textarea').element.value).toContain('Remote package picker')
    expect(wrapper.find('textarea').element.value).toContain('loading')
    expect(wrapper.find('textarea').element.value).toContain('loading-text="Loading package options..."')
    expect(wrapper.find('textarea').element.value).toContain('Remote loading keeps the combobox stable while options refresh.')
    expect(wrapper.text()).toContain('已切换到「远程加载」场景。')
  })

  it('simulates select remote search completion through the live example workflow actions', async () => {
    window.location.hash = '#live-example?scenario=remote-select'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })

    await wrapper.vm.$nextTick()

    await wrapper.get('[data-testid="select-simulate-remote-result"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.live-example-runner__preview .yok-select__value').text()).toContain('Product tools')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"select": "product"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('search')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('.live-example-runner__preview .yok-select__control').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.live-example-runner__preview .yok-select__loading').exists()).toBe(false)
    expect(wrapper.get('.live-example-runner__preview .yok-select__panel').text()).toContain('Product tools')

    window.location.hash = ''
  })

  it('documents select form validation workflow scenes', async () => {
    window.location.hash = '#live-example?scenario=form-validation-select'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('form-validation')
    expect(wrapper.find('textarea').element.value).toContain('<YForm')
    expect(wrapper.find('textarea').element.value).toContain('<YFormItem')
    expect(wrapper.find('textarea').element.value).toContain('<YSelect')
    expect(wrapper.find('textarea').element.value).toContain('aria-describedby="yok-form-message-packageName"')
    expect(wrapper.find('.live-example-runner__stage [role="combobox"][aria-invalid="true"]').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__stage [role="alert"]').text()).toContain('Choose a package before publishing.')
    expect(wrapper.text()).toContain('已切换到「表单校验选择」场景。')

    window.location.hash = ''
  })

  it('hydrates select keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-select'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'select'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard package picker')
    expect(wrapper.find('textarea').element.value).toContain('Enter or Space opens the listbox')
    expect(wrapper.text()).toContain('已切换到「键盘选择」场景。')

    window.location.hash = ''
  })

  it('generates data table examples from visual controls', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })

    expect(wrapper.text()).toContain('Data Table scenario')

    const pageSizeSlider = wrapper.find('.live-example-runner__control input[type="range"]')
    await pageSizeSlider.setValue(6)
    await wrapper.findAll('.live-example-runner__control select')[0].setValue('error')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YDataTable')
    expect(source).toContain(':page-size="6"')
    expect(source).toContain('error-text="Network timeout while loading rows."')
    expect(source).toContain('show-density-settings')
  })

  it('switches workflow examples from the scenario matrix buttons', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })

    expect(wrapper.find('.live-example-runner__scenario-strip').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__cockpit').text()).toContain('12 scenes')

    const errorScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('错误重试'))

    expect(errorScenario, 'Missing error retry scenario').toBeTruthy()

    await errorScenario?.trigger('click')

    expect(errorScenario?.attributes('aria-pressed')).toBe('true')
    expect(window.location.hash).toBe('#live-example?scenario=error-retry')
    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('error')
    expect(wrapper.find('textarea').element.value).toContain('error-text="Network timeout while loading rows."')
    expect(wrapper.text()).toContain('已切换到「错误重试」场景。')
  })

  it('renders live example acceptance checks for workflow examples', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(acceptancePanel.exists()).toBe(true)
    expect(acceptancePanel.text()).toContain('Live acceptance')
    expect(acceptancePanel.text()).toContain('Guided workflow')
    expect(acceptancePanel.text()).toContain('12 scenes')
    expect(acceptancePanel.text()).toContain('响应式场景')
    expect(acceptancePanel.text()).toContain('键盘路径')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const mobileScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('移动密度'))

    expect(mobileScenario, 'Missing mobile density scenario').toBeTruthy()

    await mobileScenario?.trigger('click')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('mobile')
    expect(wrapper.find('textarea').element.value).toContain('Mobile release queue')
    expect(wrapper.text()).toContain('已切换到「移动密度」场景。')

    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘巡航'))

    expect(keyboardScenario, 'Missing keyboard navigation scenario').toBeTruthy()

    await keyboardScenario?.trigger('click')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard review queue')
    expect(wrapper.find('textarea').element.value).toContain('Use Tab to reach table controls')
    expect(wrapper.text()).toContain('已切换到「键盘巡航」场景。')
  })

  it('promotes table examples to keyboard-verifiable workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'table'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(acceptancePanel.text()).toContain('10 scenes')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(wrapper.text()).toContain('虚拟滚动')
    expect(wrapper.text()).toContain('列宽偏好')

    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘巡航'))

    expect(keyboardScenario, 'Missing table keyboard scenario').toBeTruthy()

    await keyboardScenario?.trigger('click')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard sortable table')
    expect(wrapper.find('textarea').element.value).toContain('Use Tab to reach selection controls')
    expect(wrapper.find('textarea').element.value).toContain('selected-row-keys="table"')
    expect(wrapper.text()).toContain('已切换到「键盘巡航」场景。')
  })

  it('documents table empty filter and remote controlled workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'table'
      }
    })

    const scenarioButtons = wrapper.findAll('.live-example-runner__scenario-grid button')
    const emptyScenario = scenarioButtons.find((button) => button.text().includes('空筛选结果'))
    const remoteScenario = scenarioButtons.find((button) => button.text().includes('远程受控'))

    expect(emptyScenario).toBeTruthy()
    expect(remoteScenario).toBeTruthy()

    await emptyScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('empty-text="No components matched"')
    expect(wrapper.find('textarea').element.value).toContain(':data="[]"')
    expect(wrapper.find('textarea').element.value).toContain('No rows matched current filters.')

    await remoteScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('filter-mode="manual"')
    expect(wrapper.find('textarea').element.value).toContain('default-sort-key="stars"')
    expect(wrapper.find('textarea').element.value).toContain('Remote mode emits sort and filter state without mutating rows.')
  })

  it('generates a runnable table starter with selection, sorting and filtering data', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'table'
      }
    })

    const source = wrapper.find('textarea').element.value

    expect(source).toContain("import { ref } from 'vue'")
    expect(source).toContain('YTableFilterState')
    expect(source).toContain('YTableSelectionPayload')
    expect(source).toContain('YTableSortPayload')
    expect(source).toContain('YTableFilterPayload')
    expect(source).toContain("const selectedRowKeys = ref(['table'])")
    expect(source).toContain("const filters = ref<YTableFilterState>({ status: ['Stable'] })")
    expect(source).toContain('const columns = [')
    expect(source).toContain("filters: [")
    expect(source).toContain("const rows = [")
    expect(source).toContain('v-model:selected-row-keys="selectedRowKeys"')
    expect(source).toContain('v-model:filters="filters"')
    expect(source).toContain('default-sort-key="stars"')
    expect(source).toContain('default-sort-order="desc"')
    expect(source).toContain('@selection-change="handleSelectionChange"')
    expect(source).toContain('@sort-change="handleSortChange"')
    expect(source).toContain('@filter-change="handleFilterChange"')

    await nextTick()
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview').text()).toContain('YButton')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('YTable')
    expect(wrapper.find('.live-example-runner__preview').text()).not.toContain('YPopover')

    const table = wrapper.get('.yok-table')
    const rowCheckbox = table
      .findAll('input[type="checkbox"]')
      .find((input) => input.attributes('aria-label')?.includes('Select YButton'))

    expect(rowCheckbox, 'Missing YButton row selection checkbox').toBeTruthy()

    await rowCheckbox?.setValue(true)

    expect(wrapper.get('.live-example-runner__event-log').text()).toContain('@selectionChange')
    expect(wrapper.get('.live-example-runner__state-panel').text()).toContain('"selectedRowKeys"')
    expect(wrapper.get('.live-example-runner__state-panel').text()).toContain('"button"')

    const sortButton = wrapper
      .findAll('.yok-table__sort-button')
      .find((button) => button.attributes('aria-label')?.includes('Stars'))

    expect(sortButton, 'Missing Stars sort button').toBeTruthy()

    await sortButton?.trigger('click')

    expect(wrapper.get('.live-example-runner__event-log').text()).toContain('@sortChange')
    expect(wrapper.get('.live-example-runner__state-panel').text()).toContain('"sortKey"')

    const betaFilterOption = wrapper
      .findAll('.yok-table__filter-option')
      .find((option) => option.text().includes('Beta'))
    const betaFilter = betaFilterOption?.find('input')

    expect(betaFilter, 'Missing Beta filter option').toBeTruthy()

    await betaFilter?.setValue(true)

    expect(wrapper.get('.live-example-runner__event-log').text()).toContain('@filterChange')
    expect(wrapper.get('.live-example-runner__state-panel').text()).toContain('"filters"')
  })

  it('simulates table selection, sorting and filtering workflows from the docs runner', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'table'
      }
    })

    expect(wrapper.get('.live-example-runner__table-simulator').text()).toContain('模拟选择、排序与筛选')

    await wrapper.get('[data-testid="table-simulate-select-ybutton"]').trigger('click')
    await nextTick()

    expect(wrapper.get('.live-example-runner__event-log').text()).toContain('@selectionChange')
    expect(wrapper.get('.live-example-runner__state-panel').text()).toContain('"button"')

    await wrapper.get('[data-testid="table-simulate-sort-stars"]').trigger('click')
    await nextTick()

    expect(wrapper.get('.live-example-runner__event-log').text()).toContain('@sortChange')
    expect(wrapper.get('.live-example-runner__state-panel').text()).toContain('"sortKey"')

    await wrapper.get('[data-testid="table-simulate-filter-beta"]').trigger('click')
    await nextTick()

    expect(wrapper.get('.live-example-runner__event-log').text()).toContain('@filterChange')
    expect(wrapper.get('.live-example-runner__state-panel').text()).toContain('Beta')
  })

  it('documents data table active filter summaries as a workflow scene', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })

    const filterScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('筛选摘要'))

    expect(filterScenario, 'Missing data table filter summary scenario').toBeTruthy()

    await filterScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('filters')
    expect(source).toContain(`:default-filters="{ status: ['Stable'] }"`)
    expect(source).toContain('show-filter-summary')
    expect(source).toContain('Filtered release queue')
    expect(wrapper.text()).toContain('Status: Stable')
    expect(wrapper.text()).toContain('Clear all')
    expect(wrapper.text()).toContain('已切换到「筛选摘要」场景。')
  })

  it('documents data table column reset as a workflow scene', async () => {
    window.location.hash = '#live-example?scenario=column-reset'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('columns')
    expect(source).toContain('Column preset review')
    expect(source).toContain('default-column-keys="name,status"')
    expect(source).toContain('column-reset-text="Restore defaults"')
    expect(source).toContain('show-column-settings')
    expect(wrapper.text()).toContain('Restore defaults')
    expect(wrapper.text()).toContain('已切换到「列配置重置」场景。')

    window.location.hash = ''
  })

  it('documents data table resizable columns as a workflow scene', async () => {
    window.location.hash = '#live-example?scenario=resizable-columns'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('resizable')
    expect(source).toContain('Saved column width queue')
    expect(source).toContain('resizable')
    expect(source).toContain(':min-column-width="112"')
    expect(source).toContain(':default-column-widths="{ name: 184, status: 128 }"')
    expect(source).toContain('remote')
    expect(wrapper.findAll('.live-example-runner__preview .yok-table__resize-handle').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.live-example-runner__preview thead th')[1].attributes('style')).toContain('width: 184px')
    expect(wrapper.findAll('.live-example-runner__preview thead th')[2].attributes('style')).toContain('width: 128px')
    expect(wrapper.text()).toContain('已切换到「列宽偏好」场景。')

    window.location.hash = ''
  })

  it('documents data table column order as a workflow scene', async () => {
    window.location.hash = '#live-example?scenario=column-order'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('columnOrder')
    expect(source).toContain('Saved column order queue')
    expect(source).toContain('reorderable-columns')
    expect(source).toContain('column-keys="status,name,owner"')
    expect(source).toContain('default-column-keys="name,status,owner"')
    expect(wrapper.findAll('.live-example-runner__preview thead th').map((heading) => heading.text()).slice(1, 4).map((text) => text.replace(/⌕.*$/, ''))).toEqual(['Status', 'Component↕', 'Owner'])
    expect(wrapper.text()).toContain('Restore saved order')
    expect(wrapper.text()).toContain('已切换到「列顺序偏好」场景。')

    const moveNameLeft = wrapper.get('.live-example-runner__preview button[aria-label="Move Component column left"]')
    await moveNameLeft.trigger('click')
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('.live-example-runner__preview thead th').map((heading) => heading.text()).slice(1, 4).map((text) => text.replace(/⌕.*$/, ''))).toEqual(['Component↕', 'Status', 'Owner'])

    window.location.hash = ''
  })

  it('documents data table saved view preferences as a workflow scene', async () => {
    window.location.hash = '#live-example?scenario=view-preference'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('viewPreference')
    expect(source).toContain('Saved table view queue')
    expect(source).toContain(':default-view-preference')
    expect(source).toContain("columnKeys: ['status', 'name', 'owner']")
    expect(source).toContain('columnWidths: { status: 148, name: 212 }')
    expect(source).toContain("filters: { status: ['Stable'] }")
    expect(source).toContain('reorderable-columns')
    expect(source).toContain('resizable')
    expect(wrapper.findAll('.live-example-runner__preview thead th').map((heading) => heading.text()).slice(1, 4).map((text) => text.replace(/⌕.*$/, ''))).toEqual(['Status', 'Component↕', 'Owner'])
    expect(wrapper.findAll('.live-example-runner__preview thead th')[1].attributes('style')).toContain('width: 148px')
    expect(wrapper.findAll('.live-example-runner__preview thead th')[2].attributes('style')).toContain('width: 212px')
    expect(wrapper.text()).toContain('Status: Stable')
    expect(wrapper.text()).toContain('Restore saved view')
    expect(wrapper.text()).toContain('已切换到「视图偏好保存」场景。')

    const comfortableButton = wrapper.findAll('.live-example-runner__preview .yok-data-table__density-button')[0]
    await comfortableButton.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('viewPreferenceChange')
    expect(wrapper.text()).toContain('update:viewPreference')
    expect(wrapper.text()).toContain('"reason":"density"')

    window.location.hash = ''
  })

  it('renders data view workflow examples with saved view preference events', async () => {
    window.location.hash = '#live-example?scenario=stable-data-view'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataView'
      }
    })
    await wrapper.vm.$nextTick()
    await nextTick()
    await nextTick()

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(wrapper.text()).toContain('Data View scenario')
    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('stable')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YDataView')
    expect(source).toContain('default-view="stable"')
    expect(source).toContain('saved-views-title="Saved table views"')
    expect(source).toContain('table-title="Component queue"')
    expect(wrapper.text()).toContain('Stable core')
    expect(wrapper.text()).toContain('Status: Stable')

    const compactButton = wrapper
      .findAll('.live-example-runner__preview .yok-data-table__density-button')
      .find((button) => button.text().includes('Compact'))

    expect(compactButton, 'Missing compact density button').toBeTruthy()
    await compactButton?.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('viewPreferenceChange')
    expect(wrapper.text()).toContain('update:viewPreference')
    expect(wrapper.text()).toContain('"reason":"density"')

    window.location.hash = ''
  })

  it('renders resource page workflow examples with search and detail events', async () => {
    window.location.hash = '#live-example?scenario=detail-resource-page'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'resourcePage'
      },
      attachTo: document.body
    })
    await wrapper.vm.$nextTick()

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(wrapper.text()).toContain('Resource Page scenario')
    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('detail')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YResourcePage')
    expect(source).toContain('detail-open')
    expect(source).toContain('search-title="Resource filters"')
    expect(wrapper.text()).toContain('Component resources')
    expect(wrapper.text()).toContain('Resource filters')
    expect(wrapper.text()).toContain('Export CSV')
    expect(wrapper.text()).toContain('Release summary')
    expect(document.body.textContent).toContain('Component detail')

    await wrapper.get('.live-example-runner__preview form').trigger('submit')
    await nextTick()

    expect(wrapper.text()).toContain('Event log')
    expect(wrapper.text()).toContain('@search')

    const closeDetailButton = document.body.querySelector<HTMLButtonElement>('[data-drawer-close]')

    expect(closeDetailButton, 'Missing detail drawer close button').toBeTruthy()
    closeDetailButton?.click()
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('@closeDetail')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('empty')

    expect(wrapper.find('textarea').element.value).toContain('Empty component resources')
    expect(wrapper.find('textarea').element.value).toContain('empty-text="No component resources matched"')

    wrapper.unmount()
    window.location.hash = ''
  })

  it('generates search form keyboard and blocked edge-state scenarios', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'searchForm'
      }
    })

    expect(wrapper.text()).toContain('Search Form scenario')

    const scenarioSelect = wrapper.findAll('.live-example-runner__control select')[0]

    await scenarioSelect.setValue('keyboard')

    expect(wrapper.find('textarea').element.value).toContain('Keyboard filters')
    expect(wrapper.find('textarea').element.value).toContain('Tab reaches keyword, status, submit and reset in order')

    await scenarioSelect.setValue('blocked')

    expect(wrapper.find('textarea').element.value).toContain('Blocked filters')
    expect(wrapper.find('textarea').element.value).toContain('reset-text="Clear disabled filters"')
  })

  it('generates the second readiness sweep edge, responsive and basic scenarios', async () => {
    const cases = [
      {
        preset: 'drawer',
        label: '锁定抽屉',
        expected: ['Locked publish settings', 'Locked drawers keep context visible']
      },
      {
        preset: 'card',
        label: '空状态卡片',
        expected: ['No matching components', '<YEmpty title="Nothing matched"']
      },
      {
        preset: 'configProvider',
        label: '锁定配置',
        expected: ['Locked action', 'disabled']
      },
      {
        preset: 'dataView',
        label: '空视图',
        expected: ['Empty review workspace', 'empty-text="No components matched this saved view"']
      },
      {
        preset: 'link',
        label: '移动链接',
        expected: ['Open docs', 'max-width: 280px']
      },
      {
        preset: 'scrollbar',
        label: '空内容',
        expected: ['No changelog entries matched current filters.', 'Empty scrollable changelog']
      },
      {
        preset: 'space',
        label: '空态间距',
        expected: ['Create first component', 'Empty state actions need enough spacing']
      },
      {
        preset: 'text',
        label: '风险文本',
        expected: ['Publishing is blocked until required API rows are documented.', 'tone="danger"']
      },
      {
        preset: 'descriptions',
        label: '空详情',
        expected: ['No metadata yet', 'empty-text="No component metadata available"']
      }
    ] as const

    for (const item of cases) {
      const wrapper = mount(LiveExampleRunner, {
        props: {
          preset: item.preset
        }
      })

      await findScenarioButton(wrapper, item.label).trigger('click')

      const source = wrapper.find('textarea').element.value

      for (const expected of item.expected) {
        expect(source).toContain(expected)
      }

      wrapper.unmount()
      window.location.hash = ''
    }
  })

  it('renders schema form workflow examples with validation summary events', async () => {
    window.location.hash = '#live-example?scenario=validation-schema-form'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'schemaForm'
      },
      attachTo: document.body
    })
    await wrapper.vm.$nextTick()

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(wrapper.text()).toContain('Schema Form scenario')
    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('validation')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YSchemaForm')
    expect(source).toContain(':model-value="schemaFormModel"')
    expect(source).toContain(':schema="schemaFormSchema"')
    expect(source).toContain('"name": ""')
    expect(source).toContain('summary-title="Fix component profile"')
    expect(wrapper.text()).toContain('Component profile')
    expect(wrapper.text()).toContain('Reviewers')
    expect(wrapper.text()).toContain('Reviewer 1')
    expect(wrapper.text()).toContain('Reviewer name')

    await wrapper.findAll('.live-example-runner__preview .yok-schema-form__actions button')[0].trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('Fix component profile')
    expect(wrapper.text()).toContain('Name must be at least 3 characters.')
    expect(wrapper.text()).toContain('Reviewer 1 Reviewer name is required.')
    expect(wrapper.text()).toContain('@finishFailed')

    wrapper.unmount()
    window.location.hash = ''
  })

  it('keeps schema form array examples interactive with stable generated ids', async () => {
    window.location.hash = '#live-example?scenario=array-schema-form'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'schemaForm'
      },
      attachTo: document.body
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('array')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YSchemaForm')
    expect(source).toContain(':model-value="schemaFormModel"')
    expect(source).toContain('type: \'array\'')
    expect(source).toContain('"reviewers"')
    expect(wrapper.findAll('.live-example-runner__preview .yok-field-array__item')).toHaveLength(2)

    await wrapper.get('.live-example-runner__preview .yok-field-array__add').trigger('click')
    await flushPromises()
    await nextTick()

    const rows = wrapper.findAll('.live-example-runner__preview .yok-field-array__item')

    expect(rows).toHaveLength(3)
    expect(rows[2].attributes('data-item-key')).toMatch(/^live-reviewer-/)
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('Preview state')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('reviewers')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('live-reviewer-')

    await wrapper.get('.live-example-runner__state-panel button').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('"reviewers"'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('live-reviewer-'))
    expect(wrapper.find('.live-example-runner__state-panel button').text()).toContain('已复制状态')
    expect(wrapper.text()).toContain('@update:modelValue')

    wrapper.unmount()
    window.location.hash = ''
  })

  it('renders field array workflow examples with add events', async () => {
    window.location.hash = '#live-example?scenario=empty-field-array'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'fieldArray'
      },
      attachTo: document.body
    })
    await wrapper.vm.$nextTick()

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(wrapper.text()).toContain('Field Array scenario')
    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('empty')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YFieldArray')
    expect(source).toContain('const fieldArrayItems = ref([])')
    expect(source).toContain(':model-value="fieldArrayItems"')
    expect(source).toContain('item-key="id"')
    expect(wrapper.text()).toContain('No reviewers yet')

    await wrapper.get('.live-example-runner__preview .yok-field-array__add').trigger('click')
    await flushPromises()
    await nextTick()

    const newPreviewRow = wrapper.get('.live-example-runner__preview .yok-field-array__item')

    expect(newPreviewRow.attributes('data-item-key')).toMatch(/^live-reviewer-/)
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('Preview state')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('live-reviewer-')

    await wrapper.get('.live-example-runner__state-panel button').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('live-reviewer-'))
    expect(wrapper.find('.live-example-runner__state-panel button').text()).toContain('已复制状态')
    expect(wrapper.text()).toContain('@add')
    expect(wrapper.text()).toContain('@update:modelValue')

    wrapper.unmount()
    window.location.hash = ''
  })

  it('keeps data table column reset interactive inside the rendered preview', async () => {
    window.location.hash = '#live-example?scenario=column-reset'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })
    await wrapper.vm.$nextTick()

    const previewTableBefore = wrapper.find('.live-example-runner__preview .yok-data-table table')

    expect(previewTableBefore.text()).toContain('Component')
    expect(previewTableBefore.text()).not.toContain('Status')

    const resetButton = wrapper.find('.live-example-runner__preview .yok-data-table__column-reset')

    expect(resetButton.exists()).toBe(true)
    expect(resetButton.attributes('disabled')).toBeUndefined()

    await resetButton.trigger('click')
    await nextTick()
    await nextTick()

    const previewTableAfter = wrapper.find('.live-example-runner__preview .yok-data-table table')
    const resetButtonAfter = wrapper.find('.live-example-runner__preview .yok-data-table__column-reset')

    expect(previewTableAfter.text()).toContain('Component')
    expect(previewTableAfter.text()).toContain('Status')
    expect(resetButtonAfter.attributes('disabled')).toBeDefined()

    window.location.hash = ''
  })

  it('documents data table virtualized rows as a workflow scene', async () => {
    window.location.hash = '#live-example?scenario=virtualized-rows'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('virtualized')
    expect(source).toContain('Virtualized release queue')
    expect(source).toContain('virtualized')
    expect(source).toContain(':virtual-height="240"')
    expect(source).toContain(':virtual-row-height="44"')
    expect(wrapper.get('.live-example-runner__preview .yok-table').classes()).toContain('yok-table--virtualized')
    expect(wrapper.findAll('.live-example-runner__preview tbody tr[data-row-key]').length).toBeLessThan(16)
    expect(wrapper.text()).toContain('已切换到「千行性能」场景。')

    window.location.hash = ''
  })

  it('copies the active workflow scenario permalink', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })

    const copyButton = wrapper
      .findAll('.live-example-runner__scenario-copy')
      .find((button) => button.text().includes('复制场景链接'))

    expect(copyButton?.attributes('disabled')).toBeDefined()

    const bulkScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('批量选择'))

    await wrapper
      .findAll('.live-example-runner__viewport button')
      .find((button) => button.text().includes('平板'))
      ?.trigger('click')
    await bulkScenario?.trigger('click')
    await copyButton?.trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}${window.location.pathname}${window.location.search}#live-example?scenario=bulk-selection&viewport=tablet`
    )
    expect(window.location.hash).toBe('#live-example?scenario=bulk-selection&viewport=tablet')
    expect(wrapper.text()).toContain('当前：批量选择')
    expect(wrapper.text()).toContain('已复制「批量选择」场景链接，并同步到当前地址。')
  })

  it('links the current editable example to the route-driven playground', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })

    await findScenarioButton(wrapper, '批量选择').trigger('click')
    await wrapper.findAll('.live-example-runner__control input[type="text"]')[0].setValue('Ship to playground')
    await wrapper.get<HTMLSelectElement>('.live-example-runner__theme-select').setValue('yok-candy')

    const playgroundLink = wrapper.get('.live-example-runner__playground-link')
    const url = new URL(playgroundLink.attributes('href')!, window.location.origin)

    expect(url.pathname).toBe('/playground/')
    expect(url.searchParams.get('component')).toBe('dataTable')
    expect(url.searchParams.get('theme')).toBe('yok-candy')
    expect(url.searchParams.get('from')).toBe('live-example')
    expect(url.searchParams.get('language')).toBe('ts')
    expect(url.searchParams.get('handoff')).toContain('dataTable-')
    expect(url.searchParams.get('docsHash')).toBe('#live-example?scenario=bulk-selection')
    expect(url.searchParams.has('source')).toBe(false)
    expect(url.searchParams.has('controls')).toBe(false)
    expect(url.searchParams.has('scenario')).toBe(false)
    expect(playgroundLink.text()).toContain('打开 Playground')

    await playgroundLink.trigger('click')

    const storedHandoff = window.localStorage.getItem(`yok-ui:playground-handoff:${url.searchParams.get('handoff')}`)

    expect(storedHandoff).toContain('"origin":"live-example"')
    expect(storedHandoff).toContain('"scenario":"bulk-selection"')
    expect(storedHandoff).toContain('"docsHash":"#live-example?scenario=bulk-selection"')
    expect(storedHandoff).toContain('"title":"Ship to playground"')
    expect(storedHandoff).toContain('Ship to playground')
    expect(storedHandoff).toContain('<YDataTable')
  })

  it('surfaces the current source handoff inside the source panel', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })

    await findScenarioButton(wrapper, '批量选择').trigger('click')
    await wrapper.findAll('.live-example-runner__control input[type="text"]')[0].setValue('Source panel handoff')
    await wrapper.get<HTMLSelectElement>('.live-example-runner__theme-select').setValue('yok-candy')

    const sourceToggle = wrapper.findAll('button').find((button) => button.text().includes('查看源码'))

    expect(sourceToggle, 'Missing source panel toggle').toBeTruthy()
    await sourceToggle?.trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__playground-handoff').exists()).toBe(false)
    expect(wrapper.get('.live-example-runner__source-modebar').attributes('data-source-placement')).toBe('code-top-left')
    expect(wrapper.findAll('.live-example-runner__source-tab').map((button) => button.text())).toEqual([
      '完整 SFC',
      'Template',
      'Diff',
      'Install',
      'Repro bundle'
    ])
    expect(wrapper.get('.live-example-runner__source-code').text()).toContain('Source panel handoff')

    const handoffLink = new URL(wrapper.get('[data-live-source-action="playground"]').attributes('href')!, window.location.origin)

    expect(handoffLink.pathname).toBe('/playground/')
    expect(handoffLink.searchParams.get('component')).toBe('dataTable')
    expect(handoffLink.searchParams.get('theme')).toBe('yok-candy')
    expect(handoffLink.searchParams.get('handoff')).toContain('dataTable-')
    expect(handoffLink.searchParams.get('from')).toBe('live-example')
    expect(handoffLink.searchParams.get('language')).toBe('ts')
    expect(handoffLink.searchParams.get('docsHash')).toBe('#live-example?scenario=bulk-selection')
    expect(handoffLink.searchParams.has('source')).toBe(false)
    expect(handoffLink.searchParams.has('scenario')).toBe(false)
    expect(wrapper.get('[data-live-source-action="source-file"]').attributes('href')).toBe(
      '/source/?file=packages/admin/src/components/data-table/YDataTable.vue'
    )

    await wrapper.get('[data-live-source-action="playground"]').trigger('click')

    const storedSourcePanelHandoff = window.localStorage.getItem(`yok-ui:playground-handoff:${handoffLink.searchParams.get('handoff')}`)

    expect(storedSourcePanelHandoff).toContain('"origin":"live-example"')
    expect(storedSourcePanelHandoff).toContain('"scenario":"bulk-selection"')
    expect(storedSourcePanelHandoff).toContain('"docsHash":"#live-example?scenario=bulk-selection"')
    expect(storedSourcePanelHandoff).toContain('Source panel handoff')

    const jsLanguage = wrapper
      .findAll('.live-example-runner__source-language')
      .find((button) => button.text() === 'JS')

    expect(jsLanguage, 'Missing JS source language option').toBeTruthy()
    await jsLanguage?.trigger('click')
    await nextTick()

    const javascriptHandoffLink = new URL(wrapper.get('[data-live-source-action="playground"]').attributes('href')!, window.location.origin)

    expect(javascriptHandoffLink.searchParams.get('language')).toBe('js')
    expect(javascriptHandoffLink.searchParams.has('source')).toBe(false)

    await wrapper.get('[data-live-source-action="copy-playground-link"]').trigger('click')

    const copiedLink = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const copiedUrl = new URL(copiedLink)

    expect(copiedUrl.pathname).toBe('/playground/')
    expect(copiedUrl.searchParams.get('component')).toBe('dataTable')
    expect(copiedUrl.searchParams.get('theme')).toBe('yok-candy')
    expect(copiedUrl.searchParams.get('from')).toBe('live-example')
    expect(copiedUrl.searchParams.get('language')).toBe('js')
    expect(copiedUrl.searchParams.get('handoff')).toContain('dataTable-')
    expect(copiedUrl.searchParams.get('docsHash')).toBe('#live-example?scenario=bulk-selection')
    expect(copiedUrl.searchParams.has('source')).toBe(false)

    const copiedStoredHandoff = window.localStorage.getItem(`yok-ui:playground-handoff:${copiedUrl.searchParams.get('handoff')}`)

    expect(copiedStoredHandoff).toContain('"language":"js"')
    expect(copiedStoredHandoff).toContain('Source panel handoff')
    expect(copiedStoredHandoff).not.toContain('lang="ts"')
    expect(wrapper.get('[data-live-source-action="copy-playground-link"]').attributes('data-tooltip')).toBe('已复制导入链接')
  })

  it('keeps playground link copied feedback stable across repeated toolbar clicks', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mount(LiveExampleRunner, {
        props: {
          preset: 'button'
        }
      })

      const sourceToggle = wrapper.findAll('button').find((button) => button.text().includes('查看源码'))

      expect(sourceToggle, 'Missing source panel toggle').toBeTruthy()
      await sourceToggle?.trigger('click')
      await nextTick()

      const copyLinkButton = () => wrapper.get('[data-live-source-action="copy-playground-link"]')

      await copyLinkButton().trigger('click')
      await nextTick()

      expect(copyLinkButton().attributes('data-tooltip')).toBe('已复制导入链接')

      vi.advanceTimersByTime(900)
      await copyLinkButton().trigger('click')
      await nextTick()

      expect(copyLinkButton().attributes('data-tooltip')).toBe('已复制导入链接')

      vi.advanceTimersByTime(400)
      await nextTick()

      expect(copyLinkButton().attributes('data-tooltip')).toBe('已复制导入链接')

      vi.advanceTimersByTime(800)
      await nextTick()

      expect(copyLinkButton().attributes('data-tooltip')).toBe('复制导入链接')
    } finally {
      vi.useRealTimers()
    }
  })

  it('copies the Playground import link directly from the live example toolbar', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    await findScenarioButton(wrapper, '键盘触发').trigger('click')
    await nextTick()

    await wrapper.get('[data-live-toolbar-action="copy-playground-link"]').trigger('click')
    await nextTick()

    const copiedLink = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const copiedUrl = new URL(copiedLink)

    expect(copiedUrl.pathname).toBe('/playground/')
    expect(copiedUrl.searchParams.get('component')).toBe('button')
    expect(copiedUrl.searchParams.get('theme')).toBe('yok-light')
    expect(copiedUrl.searchParams.get('from')).toBe('live-example')
    expect(copiedUrl.searchParams.get('language')).toBe('ts')
    expect(copiedUrl.searchParams.get('docsHash')).toBe('#live-example?scenario=keyboard-button')
    expect(copiedUrl.searchParams.get('handoff')).toContain('button-')
    expect(copiedUrl.searchParams.has('source')).toBe(false)

    const copiedStoredHandoff = window.localStorage.getItem(`yok-ui:playground-handoff:${copiedUrl.searchParams.get('handoff')}`)

    expect(copiedStoredHandoff).toContain('"origin":"live-example"')
    expect(copiedStoredHandoff).toContain('"scenario":"keyboard-button"')
    expect(copiedStoredHandoff).toContain('"docsHash":"#live-example?scenario=keyboard-button"')
    expect(wrapper.get('[data-live-toolbar-action="copy-playground-link"]').attributes('data-tooltip')).toBe('已复制导入链接')
    expect(wrapper.text()).toContain('已复制当前示例的 Playground 导入链接。')
  })

  it('links to the real component source file directly from the live example toolbar', () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'button'
      }
    })

    const sourceFileLink = wrapper.get('[data-live-toolbar-action="source-file"]')

    expect(sourceFileLink.attributes('href')).toBe('/source/?file=packages/core/src/components/button/YButton.vue')
    expect(sourceFileLink.attributes('data-tooltip')).toBe('查看组件源码')
    expect(sourceFileLink.attributes('aria-label')).toBe('查看组件源码')
    expect(sourceFileLink.get('.example-source-actions__glyph').attributes('data-icon')).toBe('source')
  })

  it('keeps source copy feedback stable across repeated source toolbar clicks', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mount(LiveExampleRunner, {
        props: {
          preset: 'button'
        }
      })

      const sourceToggle = wrapper.findAll('button').find((button) => button.text().includes('查看源码'))

      expect(sourceToggle, 'Missing source panel toggle').toBeTruthy()
      await sourceToggle?.trigger('click')
      await nextTick()

      const copySourceButton = () => wrapper.get('[data-live-source-action="copy-source"]')

      await copySourceButton().trigger('click')
      await nextTick()

      expect(copySourceButton().attributes('data-tooltip')).toBe('已复制 完整 SFC')

      vi.advanceTimersByTime(900)
      await copySourceButton().trigger('click')
      await nextTick()

      expect(copySourceButton().attributes('data-tooltip')).toBe('已复制 完整 SFC')

      vi.advanceTimersByTime(400)
      await nextTick()

      expect(copySourceButton().attributes('data-tooltip')).toBe('已复制 完整 SFC')

      vi.advanceTimersByTime(800)
      await nextTick()

      expect(copySourceButton().attributes('data-tooltip')).toBe('复制源码')
    } finally {
      vi.useRealTimers()
    }
  })

  it('accepts workflow scenario changes from component route context links', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })

    window.dispatchEvent(new CustomEvent('yok-ui:live-example-scenario', {
      detail: {
        preset: 'dataTable',
        scenarioKey: 'bulk-selection'
      }
    }))
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('bulk')
    expect(wrapper.find('textarea').element.value).toContain('selected-row-keys="button,data-table,theme"')
    expect(wrapper.text()).toContain('已切换到「批量选择」场景。')
  })

  it('hydrates workflow scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=error-retry'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('error')
    expect(wrapper.find('textarea').element.value).toContain('error-text="Network timeout while loading rows."')
    expect(wrapper.text()).toContain('已切换到「错误重试」场景。')

    window.location.hash = ''
  })

  it('hydrates table keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-table'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'table'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard sortable table')
    expect(wrapper.find('textarea').element.value).toContain('Use Tab to reach selection controls')
    expect(wrapper.find('textarea').element.value).toContain('selected-row-keys="table"')
    expect(wrapper.text()).toContain('已切换到「键盘巡航」场景。')

    window.location.hash = ''
  })

  it('promotes form examples to responsive keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'form'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘提交'))

    expect(keyboardScenario, 'Missing form keyboard scenario').toBeTruthy()

    await keyboardScenario?.trigger('click')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard submit flow')
    expect(wrapper.find('textarea').element.value).toContain('Press Tab through fields and Enter on Submit')
    expect(wrapper.find('textarea').element.value).toContain('type="submit"')
    expect(wrapper.text()).toContain('已切换到「键盘提交」场景。')
  })

  it('documents form summary and scroll-to-error workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'form'
      }
    })

    const summaryScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('错误摘要'))

    expect(summaryScenario, 'Missing form summary scenario').toBeTruthy()

    await summaryScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('summary')
    expect(source).toContain('<YFormSummary')
    expect(source).toContain('scroll-to-error')
    expect(source).toContain('Component name is required.')
    expect(source).toContain('aria-describedby="yok-form-message-name"')
    expect(wrapper.text()).toContain('Review 2 issues before saving.')
    expect(wrapper.text()).toContain('Component name is required.')
    expect(wrapper.text()).toContain('已切换到「错误摘要」场景。')
  })

  it('hydrates form keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-submit'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'form'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard submit flow')
    expect(wrapper.find('textarea').element.value).toContain('Press Tab through fields and Enter on Submit')
    expect(wrapper.text()).toContain('已切换到「键盘提交」场景。')

    window.location.hash = ''
  })

  it('promotes cascader examples to responsive keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'cascader'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘级联'))

    expect(keyboardScenario, 'Missing cascader keyboard scenario').toBeTruthy()

    await keyboardScenario?.trigger('click')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard cascader path')
    expect(wrapper.find('textarea').element.value).toContain('Enter opens the path picker')
    expect(wrapper.find('textarea').element.value).toContain('model-value="core,form,cascader"')
    expect(wrapper.text()).toContain('已切换到「键盘级联」场景。')
  })

  it('renders cascader async loading sources and preview workflow', async () => {
    window.location.hash = '#live-example?scenario=async-cascader'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'cascader'
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('lazy')
    expect(wrapper.find('textarea').element.value).toContain('remoteCascaderOptions')
    expect(wrapper.find('textarea').element.value).toContain(':load="loadRemoteCascaderOptions"')
    expect(wrapper.find('textarea').element.value).toContain('lazy')

    await wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-cascader__input').trigger('click')
    await nextTick()
    await wrapper
      .findAll('.live-example-runner__preview [role="option"]')
      .find((option) => option.text().includes('Core package'))!
      .trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.findAll('.live-example-runner__preview [role="listbox"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Form controls')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('load')

    window.location.hash = ''
  })

  it('keeps cascader live previews interactive after choosing another leaf path', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'cascader'
      }
    })

    await flushPromises()
    await nextTick()

    const input = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-cascader__input')

    expect(input.element.value).toBe('Core / Form / Cascader')

    await input.trigger('click')
    await nextTick()

    const selectOption = wrapper
      .findAll('.live-example-runner__preview [role="option"]')
      .find((option) => option.text().includes('Select'))

    expect(selectOption, 'Missing Select cascader option').toBeTruthy()

    await selectOption!.trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-cascader__input').element.value).toBe('Core / Form / Select')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"cascader"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"select"')
  })

  it('simulates cascader path selection and clearing through live example workflow actions', async () => {
    window.location.hash = '#live-example?scenario=component-cascader'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'cascader'
      }
    })

    await wrapper.vm.$nextTick()

    await wrapper.get('[data-testid="cascader-simulate-tooltip-path"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-cascader__input').element.value).toBe('Core / Feedback / Tooltip')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"cascader"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"tooltip"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('visibleChange')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="cascader-simulate-clear"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-cascader__input').element.value).toBe('')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"cascader": []')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')

    window.location.hash = ''
  })

  it('hydrates cascader keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-cascader'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'cascader'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard cascader path')
    expect(wrapper.find('textarea').element.value).toContain('Enter opens the path picker')
    expect(wrapper.text()).toContain('已切换到「键盘级联」场景。')

    window.location.hash = ''
  })

  it('promotes date picker examples to shortcut, disabled, validation, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'datePicker'
      }
    })

    expect(wrapper.text()).toContain('Date Picker scenario')

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const shortcutScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('快捷日期'))

    expect(acceptancePanel.text()).toContain('7 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(shortcutScenario, 'Missing date picker shortcut scenario').toBeTruthy()

    await shortcutScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('shortcut')
    expect(source).toContain('Release shortcut date')
    expect(source).toContain(':shortcuts="dateShortcuts"')
    expect(source).toContain('Review day')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('disabled')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Weekday review date')
    expect(source).toContain(':disabled-date="disableWeekends"')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('validation')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('id="release-date-field"')
    expect(source).toContain('aria-describedby="release-date-help"')
    expect(source).toContain('@visible-change')
    expect(source).toContain('Release date is required.')
  })

  it('hydrates date picker keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-date-picker'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'datePicker'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard date picker')
    expect(source).toContain('aria-label="Keyboard date picker calendar"')
    expect(source).toContain('Enter or Space opens the calendar')
    expect(wrapper.text()).toContain('已切换到「键盘日期」场景。')

    window.location.hash = ''
  })

  it('hydrates date picker validation scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=form-validation-date-picker'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'datePicker'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('validation')
    expect(source).toContain('id="release-date-field"')
    expect(source).toContain('@change')
    expect(source).toContain('@visible-change')
    expect(wrapper.text()).toContain('已切换到「表单校验」场景。')

    window.location.hash = ''
  })

  it('keeps date picker live previews interactive after clearing the selected date', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'datePicker'
      }
    })

    await flushPromises()
    await nextTick()

    const input = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-date-picker__input')

    expect(input.element.value).toBe('2026-06-13')

    await wrapper.get('.live-example-runner__preview .yok-date-picker__clear').trigger('click')
    await nextTick()

    const updatedInput = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-date-picker__input')

    expect(updatedInput.element.value).toBe('')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"date": ""')
  })

  it('simulates date picker shortcut and clear workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=shortcut-date-picker'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'datePicker'
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('shortcut')

    await wrapper.get('[data-testid="date-picker-simulate-review-day"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-date-picker__input').element.value).toBe('2026-06-15')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"date": "2026-06-15"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('visibleChange')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="date-picker-simulate-clear"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-date-picker__input').element.value).toBe('')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"date": ""')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')

    window.location.hash = ''
  })

  it('promotes time picker examples to step, disabled, validation, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'timePicker'
      }
    })

    expect(wrapper.text()).toContain('Time Picker scenario')

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const stepScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('分钟步长'))

    expect(acceptancePanel.text()).toContain('7 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(stepScenario, 'Missing time picker step scenario').toBeTruthy()

    await stepScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('step')
    expect(source).toContain('Meeting time')
    expect(source).toContain(':minute-step="15"')
    expect(source).toContain('15-minute intervals')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('disabled')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Before 18:00')
    expect(source).toContain(':disabled-time="disableAfterWork"')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('validation')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('id="release-time-field"')
    expect(source).toContain('aria-describedby="release-time-help"')
    expect(source).toContain('Release time is required.')
    expect(source).toContain('@visible-change')
  })

  it('hydrates time picker keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-time-picker'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'timePicker'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard time picker')
    expect(source).toContain('aria-label="Keyboard time picker panel"')
    expect(source).toContain('Enter or Space confirms the active time')
    expect(wrapper.text()).toContain('已切换到「键盘时间」场景。')

    window.location.hash = ''
  })

  it('hydrates time picker validation scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=form-validation-time-picker'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'timePicker'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('validation')
    expect(source).toContain('id="release-time-field"')
    expect(source).toContain('aria-describedby="release-time-help"')
    expect(source).toContain('@change')
    expect(source).toContain('@visible-change')
    expect(wrapper.text()).toContain('已切换到「表单校验」场景。')

    window.location.hash = ''
  })

  it('keeps time picker live previews interactive after clearing the selected time', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'timePicker'
      }
    })

    await flushPromises()
    await nextTick()

    const input = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-time-picker__input')

    expect(input.element.value).toBe('09:30')

    await wrapper.get('.live-example-runner__preview .yok-time-picker__clear').trigger('click')
    await nextTick()

    const updatedInput = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-time-picker__input')

    expect(updatedInput.element.value).toBe('')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"time": ""')
  })

  it('simulates time picker selection and clear workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=step-time-picker'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'timePicker'
      }
    })
    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="time-picker-simulate-standup"]').trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-time-picker__input').element.value)
      .toBe('10:15')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"time": "10:15"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('visibleChange')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="time-picker-simulate-clear"]').trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-time-picker__input').element.value).toBe('')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"time": ""')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')
    expect(wrapper.text()).toContain('已模拟清空 Time Picker')

    window.location.hash = ''
  })

  it('promotes input number examples to quantity, precision, density, controls, error, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'inputNumber'
      }
    })

    expect(wrapper.text()).toContain('Input Number scenario')

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const precisionScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('小数精度'))
    const densityScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('尺寸密度'))

    expect(acceptancePanel.text()).toContain('7 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(precisionScenario, 'Missing input number precision scenario').toBeTruthy()
    expect(densityScenario, 'Missing input number density scenario').toBeTruthy()

    await precisionScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('precision')
    expect(source).toContain('Rating score')
    expect(source).toContain(':step="0.5"')
    expect(source).toContain(':precision="1"')

    await densityScenario?.trigger('click')

    source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('density')
    expect(source).toContain('Compact quantity')
    expect(source).toContain('size="sm"')
    expect(source).toContain('size="md"')
    expect(source).toContain('size="lg"')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('controls')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Budget amount')
    expect(source).toContain(':controls="false"')
  })

  it('hydrates input number keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-input-number'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'inputNumber'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard quantity')
    expect(source).toContain('aria-label="Keyboard quantity stepper"')
    expect(source).toContain('ArrowUp and ArrowDown adjust by one step')
    expect(wrapper.text()).toContain('已切换到「键盘步进」场景。')

    window.location.hash = ''
  })

  it('keeps input number live previews interactive after typing and committing a value', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'inputNumber'
      }
    })

    await flushPromises()
    await nextTick()

    const input = wrapper.get<HTMLInputElement>('.live-example-runner__preview input[type="number"]')

    expect(input.element.value).toBe('4')
    expect(input.attributes('aria-valuenow')).toBe('4')

    await input.setValue('6')
    await input.trigger('blur')
    await nextTick()

    const updatedInput = wrapper.get<HTMLInputElement>('.live-example-runner__preview input[type="number"]')

    expect(updatedInput.element.value).toBe('6')
    expect(updatedInput.attributes('aria-valuenow')).toBe('6')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"number": 6')
  })

  it('simulates input number step and reset workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=quantity-input-number'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'inputNumber'
      }
    })
    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="input-number-simulate-restock"]').trigger('click')
    await nextTick()

    const restockedInput = wrapper.get<HTMLInputElement>('.live-example-runner__preview input[type="number"]')

    expect(restockedInput.element.value).toBe('8')
    expect(restockedInput.attributes('aria-valuenow')).toBe('8')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"number": 8')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="input-number-simulate-reset"]').trigger('click')
    await nextTick()

    const resetInput = wrapper.get<HTMLInputElement>('.live-example-runner__preview input[type="number"]')

    expect(resetInput.element.value).toBe('4')
    expect(resetInput.attributes('aria-valuenow')).toBe('4')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"number": 4')
    expect(wrapper.text()).toContain('已模拟重置 Input Number')

    window.location.hash = ''
  })

  it('keeps rate live previews interactive after choosing a rating', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'rate'
      }
    })

    await flushPromises()
    await nextTick()

    const preview = wrapper.find('.live-example-runner__preview')
    const findRatingButton = (label: string) => preview
      .findAll('button[role="radio"]')
      .find((button) => button.attributes('aria-label') === label)

    const fourStars = findRatingButton('4 of 5')
    const fiveStars = findRatingButton('5 of 5')

    expect(fourStars, 'Missing 4 star button').toBeTruthy()
    expect(fiveStars, 'Missing 5 star button').toBeTruthy()
    expect(fourStars?.attributes('aria-checked')).toBe('true')
    expect(fiveStars?.attributes('aria-checked')).toBe('false')

    await fiveStars!.trigger('click')
    await nextTick()

    expect(findRatingButton('5 of 5')?.attributes('aria-checked')).toBe('true')
    expect(findRatingButton('4 of 5')?.attributes('aria-checked')).toBe('false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"rating": 5')
  })

  it('simulates rate selection and clearing through live example actions', async () => {
    window.location.hash = '#live-example?scenario=clear-rate'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'rate'
      }
    })

    await flushPromises()
    await nextTick()

    const preview = wrapper.find('.live-example-runner__preview')
    const findRatingButton = (label: string) => preview
      .findAll('button[role="radio"]')
      .find((button) => button.attributes('aria-label') === label)

    await wrapper.get('[data-testid="rate-simulate-five-star"]').trigger('click')
    await nextTick()

    expect(findRatingButton('5 of 5')?.attributes('aria-checked')).toBe('true')
    expect(wrapper.find('.live-example-runner__preview .yok-rate__value').text()).toBe('5 of 5')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"rating": 5')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="rate-simulate-clear"]').trigger('click')
    await nextTick()

    expect(findRatingButton('5 of 5')?.attributes('aria-checked')).toBe('false')
    expect(wrapper.find('.live-example-runner__preview .yok-rate__value').text()).toBe('0 of 5')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"rating": 0')
    expect(wrapper.text()).toContain('已模拟清空 Rate')

    window.location.hash = ''
  })

  it('keeps slider live previews interactive after changing the value', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'slider'
      }
    })

    await flushPromises()
    await nextTick()

    const sliderInput = wrapper.get<HTMLInputElement>('.live-example-runner__preview input[type="range"]')

    expect(sliderInput.attributes('aria-valuenow')).toBe('60')
    expect(wrapper.find('.live-example-runner__preview .yok-slider__value').text()).toBe('60')

    await sliderInput.setValue('80')
    await sliderInput.trigger('change')
    await nextTick()

    const updatedSliderInput = wrapper.get<HTMLInputElement>('.live-example-runner__preview input[type="range"]')

    expect(updatedSliderInput.attributes('aria-valuenow')).toBe('80')
    expect(wrapper.find('.live-example-runner__preview .yok-slider__value').text()).toBe('80')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"slider": 80')
  })

  it('simulates slider range and reset workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=range-slider'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'slider'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="slider-simulate-budget-range"]').trigger('click')
    await nextTick()

    const rangeInputs = wrapper.findAll<HTMLInputElement>('.live-example-runner__preview input[type="range"]')

    expect(rangeInputs).toHaveLength(2)
    expect(rangeInputs[0].attributes('aria-valuenow')).toBe('30')
    expect(rangeInputs[1].attributes('aria-valuenow')).toBe('70')
    expect(wrapper.find('.live-example-runner__preview .yok-slider__value').text()).toBe('30 - 70')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"slider": [')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('30')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('70')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="slider-simulate-reset"]').trigger('click')
    await nextTick()

    const resetInputs = wrapper.findAll<HTMLInputElement>('.live-example-runner__preview input[type="range"]')

    expect(resetInputs[0].attributes('aria-valuenow')).toBe('20')
    expect(resetInputs[1].attributes('aria-valuenow')).toBe('80')
    expect(wrapper.find('.live-example-runner__preview .yok-slider__value').text()).toBe('20 - 80')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('20')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('80')
    expect(wrapper.text()).toContain('已模拟重置 Slider')

    window.location.hash = ''
  })

  it('promotes slider examples to value, step, range, vertical tooltip, error, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'slider'
      }
    })

    expect(wrapper.text()).toContain('Slider scenario')

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const stepScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('离散步进'))
    const rangeScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('范围选择'))
    const verticalScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('垂直提示'))

    expect(acceptancePanel.text()).toContain('7 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(stepScenario, 'Missing slider step scenario').toBeTruthy()
    expect(rangeScenario, 'Missing slider range scenario').toBeTruthy()
    expect(verticalScenario, 'Missing slider vertical tooltip scenario').toBeTruthy()

    await stepScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('step')
    expect(source).toContain('Release confidence')
    expect(source).toContain(':step="10"')
    expect(source).toContain('Discrete steps')

    await rangeScenario?.trigger('click')

    source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('range')
    expect(source).toContain('Budget range')
    expect(source).toContain('model-value="20,80"')
    expect(source).toContain('range')
    expect(source).toContain('Range sliders cover price, budget and threshold filters.')
    expect(wrapper.find('.live-example-runner__preview-error').exists()).toBe(false)
    expect(wrapper.findAll('.live-example-runner__stage input[type="range"]')).toHaveLength(2)

    await verticalScenario?.trigger('click')

    source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('vertical')
    expect(source).toContain('Vertical temperature')
    expect(source).toContain('vertical')
    expect(source).toContain('height="180px"')
    expect(source).toContain('show-tooltip')
    expect(source).toContain('tooltip-placement="right"')
    expect(source).toContain('Vertical sliders keep dashboard thresholds compact.')
    expect(wrapper.find('.live-example-runner__preview-error').exists()).toBe(false)
    expect(wrapper.find('.live-example-runner__stage .yok-slider--vertical').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__stage .yok-slider__tooltip').text()).toBe('65')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('error')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Coverage threshold')
    expect(source).toContain('error="Threshold must be at least 80 before release."')
  })

  it('hydrates slider keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-slider'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'slider'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard volume')
    expect(source).toContain('aria-label="Keyboard volume slider"')
    expect(source).toContain('Arrow keys adjust by one step')
    expect(wrapper.text()).toContain('已切换到「键盘滑块」场景。')

    window.location.hash = ''
  })

  it('promotes date range examples to shortcut, validation, responsive and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dateRangePicker'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(acceptancePanel.text()).toContain('9 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘范围'))

    expect(keyboardScenario, 'Missing date range keyboard scenario').toBeTruthy()

    await keyboardScenario?.trigger('click')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard date range')
    expect(wrapper.find('textarea').element.value).toContain('Enter opens the calendar')
    expect(wrapper.find('textarea').element.value).toContain('model-value="2026-06-13,2026-06-20"')
    expect(wrapper.text()).toContain('已切换到「键盘范围」场景。')
  })

  it('hydrates date range validation scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=form-validation-range'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dateRangePicker'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('validation')
    expect(source).toContain('id="release-window-field"')
    expect(source).toContain('aria-describedby="release-window-help"')
    expect(source).toContain('@visible-change')
    expect(source).toContain('Select a complete release window.')
    expect(wrapper.text()).toContain('已切换到「表单校验」场景。')

    window.location.hash = ''
  })

  it('hydrates date range keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-range'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dateRangePicker'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard date range')
    expect(wrapper.find('textarea').element.value).toContain('Enter opens the calendar')
    expect(wrapper.text()).toContain('已切换到「键盘范围」场景。')

    window.location.hash = ''
  })

  it('keeps date range live previews interactive after clearing the selected range', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dateRangePicker'
      }
    })

    await flushPromises()
    await nextTick()

    const input = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-date-range__input')

    expect(input.element.value).toBe('2026-06-13 to 2026-06-20')

    await wrapper.get('.live-example-runner__preview .yok-date-range__clear').trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-date-range__input').element.value).toBe('')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"dateRange": []')
  })

  it('simulates date range shortcut and clear workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=shortcut-range'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dateRangePicker'
      }
    })
    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="date-range-simulate-sprint"]').trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-date-range__input').element.value)
      .toBe('2026-06-13 to 2026-06-20')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"dateRange": [')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"2026-06-13"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"2026-06-20"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('visibleChange')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="date-range-simulate-clear"]').trigger('click')
    await nextTick()

    expect(wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-date-range__input').element.value).toBe('')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"dateRange": []')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')
    expect(wrapper.text()).toContain('已模拟清空 Date Range Picker')

    window.location.hash = ''
  })

  it('hydrates date range partial and disabled-date workflows from shareable hashes', async () => {
    window.location.hash = '#live-example?scenario=partial-range'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dateRangePicker'
      }
    })
    await wrapper.vm.$nextTick()

    let source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('partial')
    expect(wrapper.text()).toContain('未完成范围')
    expect(source).toContain('Draft booking window')
    expect(source).toContain('model-value="2026-06-24"')
    expect(source).toContain('Choose an end date to complete the range.')

    window.location.hash = '#live-example?scenario=disabled-range'
    window.dispatchEvent(new Event('hashchange'))
    await wrapper.vm.$nextTick()

    source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('disabledDate')
    expect(wrapper.text()).toContain('禁用日期')
    expect(source).toContain('Weekday booking range')
    expect(source).toContain(':disabled-date="disablePastDates"')
    expect(source).toContain('Past dates are disabled by a pure disabledDate function.')

    window.location.hash = ''
  })

  it('promotes drawer examples to mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'drawer'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(acceptancePanel.text()).toContain('5 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘关闭'))

    expect(keyboardScenario, 'Missing drawer keyboard scenario').toBeTruthy()

    await keyboardScenario?.trigger('click')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard dismiss drawer')
    expect(wrapper.find('textarea').element.value).toContain(':close-on-overlay="false"')
    expect(wrapper.find('textarea').element.value).toContain('Escape returns focus to the trigger')
    expect(wrapper.text()).toContain('已切换到「键盘关闭」场景。')
  })

  it('hydrates drawer keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-dismiss'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'drawer'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard dismiss drawer')
    expect(wrapper.find('textarea').element.value).toContain('Escape returns focus to the trigger')
    expect(wrapper.text()).toContain('已切换到「键盘关闭」场景。')

    window.location.hash = ''
  })

  it('promotes modal examples to responsive and keyboard focus workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'modal'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(acceptancePanel.text()).toContain('5 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘焦点'))

    expect(keyboardScenario, 'Missing modal keyboard scenario').toBeTruthy()

    await keyboardScenario?.trigger('click')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard focus modal')
    expect(wrapper.find('textarea').element.value).toContain(':close-on-overlay="false"')
    expect(wrapper.find('textarea').element.value).toContain('Tab stays inside the dialog')
    expect(wrapper.text()).toContain('已切换到「键盘焦点」场景。')
  })

  it('hydrates modal keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-focus'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'modal'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard focus modal')
    expect(wrapper.find('textarea').element.value).toContain('Tab stays inside the dialog')
    expect(wrapper.text()).toContain('已切换到「键盘焦点」场景。')

    window.location.hash = ''
  })

  it('promotes popover examples to responsive and keyboard trigger workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'popover'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')

    expect(acceptancePanel.text()).toContain('7 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘触发'))

    expect(keyboardScenario, 'Missing popover keyboard scenario').toBeTruthy()

    await keyboardScenario?.trigger('click')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard popover')
    expect(wrapper.find('textarea').element.value).toContain('Enter and Space open the popover')
    expect(wrapper.find('textarea').element.value).toContain('Escape closes it')
    expect(wrapper.text()).toContain('已切换到「键盘触发」场景。')
  })

  it('documents popover hover placement and disabled workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'popover'
      }
    })

    const scenarioButtons = wrapper.findAll('.live-example-runner__scenario-grid button')
    const placementScenario = scenarioButtons.find((button) => button.text().includes('悬浮方位'))
    const disabledScenario = scenarioButtons.find((button) => button.text().includes('禁用触发'))

    expect(placementScenario, 'Missing hover placement popover scenario').toBeTruthy()
    expect(disabledScenario, 'Missing disabled popover scenario').toBeTruthy()

    await placementScenario?.trigger('click')

    expect(wrapper.find('textarea').element.value).toContain('trigger="hover"')
    expect(wrapper.find('textarea').element.value).toContain('placement="right-start"')
    expect(wrapper.find('textarea').element.value).toContain(':show-delay="120"')

    await disabledScenario?.trigger('click')

    expect(wrapper.find('textarea').element.value).toContain('disabled')
    expect(wrapper.find('textarea').element.value).toContain('Disabled popovers keep the trigger inert')
  })

  it('hydrates popover keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-popover'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'popover'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(wrapper.find('textarea').element.value).toContain('Keyboard popover')
    expect(wrapper.find('textarea').element.value).toContain('Enter and Space open the popover')
    expect(wrapper.text()).toContain('已切换到「键盘触发」场景。')

    window.location.hash = ''
  })

  it('simulates popover controlled open and dismiss workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=confirm-popover'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'popover'
      }
    })

    await nextTick()
    await nextTick()

    await wrapper.get('[data-testid="popover-simulate-open"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__stage .yok-popover__panel').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"popoverOpen": true')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:open')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('visibleChange')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('true')
    expect(wrapper.text()).toContain('已模拟 Popover 受控打开')

    await wrapper.get('[data-testid="popover-simulate-dismiss"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"popoverOpen": false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('false')
    expect(wrapper.text()).toContain('已模拟 Popover 关闭确认卡片')

    window.location.hash = ''
  })

  it('updates workflow scenarios when the live-example hash changes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })

    window.location.hash = '#live-example?scenario=bulk-selection'
    window.dispatchEvent(new Event('hashchange'))
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('bulk')
    expect(wrapper.find('textarea').element.value).toContain('selected-row-keys="button,data-table,theme"')

    window.location.hash = ''
  })

  it('captures data table bulk action events from the rendered preview', async () => {
    window.location.hash = '#live-example?scenario=bulk-selection'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('bulk')
    expect(wrapper.find('.live-example-runner__preview .yok-bulk-action-bar').text()).toContain('3 components selected')

    const publishButton = wrapper
      .findAll('.live-example-runner__preview .yok-bulk-action-bar__action')
      .find((button) => button.text().includes('Publish'))

    expect(publishButton, 'Missing Publish bulk action').toBeTruthy()
    await publishButton?.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('@bulkAction')
    expect(wrapper.text()).toContain('"value":"publish"')
    expect(wrapper.text()).toContain('"selectedRowKeys":["button","data-table","theme"]')

    const clearButton = wrapper.get('.live-example-runner__preview .yok-bulk-action-bar__clear')

    await clearButton.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('@bulkClear')
    expect(wrapper.text()).toContain('"selectedRowKeys":["button","data-table","theme"]')

    window.location.hash = ''
  })

  it('copies an interaction repro report from captured preview events', async () => {
    window.location.hash = '#live-example?scenario=bulk-selection'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dataTable'
      }
    })
    await wrapper.vm.$nextTick()

    const publishButton = wrapper
      .findAll('.live-example-runner__preview .yok-bulk-action-bar__action')
      .find((button) => button.text().includes('Publish'))

    expect(publishButton, 'Missing Publish bulk action').toBeTruthy()
    await publishButton?.trigger('click')
    await nextTick()

    const replay = wrapper.get('.live-example-runner__replay')

    expect(replay.text()).toContain('Interaction replay')
    expect(replay.text()).toContain('2 events ready')
    expect(replay.text()).toContain('Events')
    expect(replay.text()).toContain('Data Table@bulkAction')
    expect(replay.text()).toContain('Replay event')

    const playgroundUrl = new URL(
      wrapper.get('.live-example-runner__playground-link').attributes('href')!,
      window.location.origin
    )
    const handoffKey = playgroundUrl.searchParams.get('handoff') ?? ''
    const storedHandoff = window.localStorage.getItem(`yok-ui:playground-handoff:${handoffKey}`) ?? ''

    expect(playgroundUrl.searchParams.get('handoff')).toContain('dataTable-')
    expect(playgroundUrl.searchParams.get('from')).toBe('live-example')
    expect(playgroundUrl.searchParams.get('language')).toBe('ts')
    expect(playgroundUrl.searchParams.get('docsHash')).toBe('#live-example?scenario=bulk-selection')
    expect(playgroundUrl.searchParams.has('replay')).toBe(false)
    expect(playgroundUrl.searchParams.has('source')).toBe(false)
    expect(storedHandoff).toContain('"event":"bulkAction"')
    expect(storedHandoff).toContain('"label":"4. Replay event"')
    expect(storedHandoff).toContain('"origin":"live-example"')
    expect(storedHandoff).toContain('"language":"ts"')
    expect(storedHandoff).toContain('"docsHash":"#live-example?scenario=bulk-selection"')

    await replay.get('.live-example-runner__replay-copy').trigger('click')

    const repro = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(repro).toContain('# Yok UI interaction repro')
    expect(repro).toContain('- Component: YDataTable')
    expect(repro).toContain('- Scenario: 批量选择')
    expect(repro).toContain('- Docs: /components/data-table')
    expect(repro).toContain('- Playground:')
    expect(repro).toContain('## Replay steps')
    expect(repro).toContain('- [x] 1. Restore context')
    expect(repro).toContain('- [x] 4. Replay event')
    expect(repro).toContain('## Replay manifest')
    expect(repro).toContain('"events"')
    expect(repro).toContain('## Controls')
    expect(repro).toContain('"scenario":"bulk"')
    expect(repro).toContain('## Event replay')
    expect(repro).toContain('"event":"bulkAction"')
    expect(repro).toContain('"selectedRowKeys":["button","data-table","theme"]')
    expect(repro).toContain('## Source')
    expect(repro).toContain('<YDataTable')
    expect(wrapper.get('.live-example-runner__replay-copy').text()).toContain('已复制复现')

    window.location.hash = ''
  })

  it('generates upload examples with optional demo files', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'upload'
      }
    })

    expect(wrapper.text()).toContain('Upload scenario')

    const demoFileCheckbox = wrapper.findAll('.live-example-runner__control input[type="checkbox"]').at(2)
    await demoFileCheckbox?.setValue(true)
    await wrapper.findAll('.live-example-runner__control select')[0].setValue('rules')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YUpload')
    expect(source).toContain('model-value="demo-files"')
    expect(source).toContain('Only one CSV file is allowed')
  })

  it('hydrates upload rejection and keyboard workflows from shareable hashes', async () => {
    window.location.hash = '#live-example?scenario=reject-type'
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'upload'
      }
    })

    await nextTick()
    await nextTick()

    expect(wrapper.text()).toContain('Upload scenario')
    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('reject')
    expect(wrapper.text()).toContain('拒绝类型')
    expect(wrapper.text()).toContain('guide.exe')

    const rejectSource = wrapper.find('textarea').element.value

    expect(rejectSource).toContain('accept=".png,.jpg"')
    expect(rejectSource).toContain('guide.exe')
    expect(rejectSource).toContain('rejected-files="rejected-files"')
    expect(rejectSource).toContain("status: 'error'")
    expect(rejectSource).toContain('Unsupported file type')

    window.location.hash = '#live-example?scenario=validation-upload'
    window.dispatchEvent(new Event('hashchange'))
    await nextTick()

    const validationSource = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('validation')
    expect(validationSource).toContain('id="release-upload-field"')
    expect(validationSource).toContain('aria-describedby="release-upload-help"')
    expect(validationSource).toContain('invalid')
    expect(validationSource).toContain('error="Upload a valid release package before publishing."')
    expect(validationSource).toContain('rejected-files="validation-rejected-files"')
    expect(wrapper.text()).toContain('release-notes.exe')

    window.location.hash = '#live-example?scenario=request-lifecycle'
    window.dispatchEvent(new Event('hashchange'))
    await nextTick()

    const requestSource = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('request')
    expect(requestSource).toContain('auto-upload')
    expect(requestSource).toContain(':max-size="1048576"')
    expect(requestSource).toContain(':before-upload="checkUploadFile"')
    expect(requestSource).toContain(':custom-request="uploadToStorage"')
    expect(requestSource).toContain('onProgress(72)')
    expect(wrapper.text()).toContain('release-package.zip')

    window.location.hash = '#live-example?scenario=picture-list-actions'
    window.dispatchEvent(new Event('hashchange'))
    await nextTick()

    const pictureSource = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('picture')
    expect(pictureSource).toContain('list-type="picture"')
    expect(pictureSource).toContain('previewable')
    expect(pictureSource).toContain('downloadable')
    expect(pictureSource).toContain('sortable')
    expect(pictureSource).toContain('clearable')
    expect(pictureSource).toContain('galleryFiles')
    expect(wrapper.text()).toContain('component-cover.png')

    window.location.hash = '#live-example?scenario=keyboard-upload'
    window.dispatchEvent(new Event('hashchange'))
    await nextTick()

    const keyboardSource = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(keyboardSource).toContain('button-label="Choose with keyboard"')
    expect(keyboardSource).toContain('empty-text="No files selected. Press Enter on the chooser to open the file dialog."')
    expect(wrapper.text()).toContain('键盘路径')

    window.location.hash = ''
  })

  it('keeps upload live previews interactive after selecting and removing files', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'upload'
      }
    })

    await flushPromises()
    await nextTick()

    const uploadInput = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-upload__input')
    const selectedFile = new File(['fake image bytes'], 'component-map.png', {
      type: 'image/png'
    })

    Object.defineProperty(uploadInput.element, 'files', {
      configurable: true,
      value: [selectedFile]
    })

    await uploadInput.trigger('change')
    await flushPromises()
    await nextTick()

    expect(wrapper.get('.live-example-runner__preview .yok-upload__list').text()).toContain('component-map.png')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"name": "component-map.png"')

    await wrapper.get('.live-example-runner__preview .yok-upload__remove').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview .yok-upload__list').exists()).toBe(false)
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"files": []')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('remove')
  })

  it('keeps upload rejected files visible in the live preview state snapshot', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'upload'
      }
    })

    await flushPromises()
    await nextTick()

    const uploadInput = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-upload__input')
    const rejectedFile = new File(['name,kind\nbutton,core\n'], 'component-map.csv', {
      type: 'text/csv'
    })

    Object.defineProperty(uploadInput.element, 'files', {
      configurable: true,
      value: [rejectedFile]
    })

    await uploadInput.trigger('change')
    await flushPromises()
    await nextTick()

    expect(wrapper.get('.live-example-runner__preview .yok-upload__rejected').text()).toContain('component-map.csv')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('reject')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"rejected"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"name": "component-map.csv"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"reason": "accept"')

    await wrapper.get('.live-example-runner__preview .yok-upload__rejected .yok-upload__remove').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview .yok-upload__rejected').exists()).toBe(false)
    expect(wrapper.find('.live-example-runner__state-panel code').text()).not.toContain('"rejected"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('dismissReject')
  })

  it('simulates upload file selection through the live example workflow actions', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'upload'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="upload-simulate-mixed-selection"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.get('.live-example-runner__preview .yok-upload__list').text()).toContain('component-map.png')
    expect(wrapper.get('.live-example-runner__preview .yok-upload__rejected').text()).toContain('component-map.csv')

    const stateText = wrapper.find('.live-example-runner__state-panel code').text()

    expect(stateText).toContain('"name": "component-map.png"')
    expect(stateText).toContain('"name": "component-map.csv"')
    expect(stateText).toContain('"reason": "accept"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('reject')
  })

  it('generates modal examples with a reactive closed preview state', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'modal'
      }
    })

    expect(wrapper.text()).toContain('Modal scenario')
    expect(wrapper.find('textarea').element.value).toContain('<YModal open')

    await setCheckbox(wrapper, '默认打开', false)
    await wrapper.findAll('.live-example-runner__control select')[0].setValue('danger')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YModal title="Delete component draft"')
    expect(source).toContain(':close-on-overlay="false"')
    expect(source).not.toContain('<YModal open')
    expect(wrapper.text()).toContain('Delete component draft is closed')
  })

  it('simulates modal confirm and cancel flows through the live example workflow actions', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'modal'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="modal-simulate-confirm"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('Publish component is closed')

    let stateText = wrapper.find('.live-example-runner__state-panel code').text()

    expect(stateText).toContain('"modalAction": "confirm"')
    expect(stateText).toContain('"modalLabel": "Publish"')
    expect(stateText).toContain('"modalOpen": false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('confirm')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('close')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('danger')
    await wrapper.get('[data-testid="modal-simulate-cancel"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('Delete component draft is closed')

    stateText = wrapper.find('.live-example-runner__state-panel code').text()

    expect(stateText).toContain('"modalAction": "cancel"')
    expect(stateText).toContain('"modalLabel": "Keep draft"')
    expect(stateText).toContain('"modalOpen": false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('cancel')
  })

  it('simulates drawer save and dismiss flows through the live example workflow actions', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'drawer'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="drawer-simulate-save"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('Component settings is closed')

    let stateText = wrapper.find('.live-example-runner__state-panel code').text()

    expect(stateText).toContain('"drawerAction": "save"')
    expect(stateText).toContain('"drawerLabel": "Save settings"')
    expect(stateText).toContain('"drawerOpen": false')
    expect(stateText).toContain('"drawerPlacement": "right"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('save')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('close')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('locked')
    await wrapper.get('[data-testid="drawer-simulate-dismiss"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('Locked publish settings is closed')

    stateText = wrapper.find('.live-example-runner__state-panel code').text()

    expect(stateText).toContain('"drawerAction": "dismiss"')
    expect(stateText).toContain('"drawerLabel": "Close locked notice"')
    expect(stateText).toContain('"drawerOpen": false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('dismiss')
  })

  it('simulates message loading, success and dismiss flows through workflow actions', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'message'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="message-simulate-loading"]').trigger('click')
    await flushPromises()
    await nextTick()

    let stateText = wrapper.find('.live-example-runner__state-panel code').text()

    expect(wrapper.get('.live-example-runner__preview .yok-message').text()).toContain('Saving component')
    expect(stateText).toContain('"messagePhase": "loading"')
    expect(stateText).toContain('"messageTone": "warning"')
    expect(stateText).toContain('"messageVisible": true')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('open')

    await wrapper.get('[data-testid="message-simulate-success"]').trigger('click')
    await flushPromises()
    await nextTick()

    stateText = wrapper.find('.live-example-runner__state-panel code').text()

    expect(wrapper.get('.live-example-runner__preview .yok-message').text()).toContain('Saved')
    expect(stateText).toContain('"messagePhase": "success"')
    expect(stateText).toContain('"messageTone": "success"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update')

    await wrapper.get('[data-testid="message-simulate-dismiss"]').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('Saved is closed')

    stateText = wrapper.find('.live-example-runner__state-panel code').text()

    expect(stateText).toContain('"messagePhase": "dismissed"')
    expect(stateText).toContain('"messageVisible": false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('close')
  })

  it('simulates result primary and retry actions through workflow actions', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'result'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="result-simulate-open"]').trigger('click')
    await flushPromises()
    await nextTick()

    let stateText = wrapper.find('.live-example-runner__state-panel code').text()

    expect(stateText).toContain('"resultAction": "open"')
    expect(stateText).toContain('"resultLabel": "View release"')
    expect(stateText).toContain('"resultStatus": "success"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('open')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('server')
    await wrapper.get('[data-testid="result-simulate-retry"]').trigger('click')
    await flushPromises()
    await nextTick()

    stateText = wrapper.find('.live-example-runner__state-panel code').text()

    expect(wrapper.get('.live-example-runner__preview .yok-result').text()).toContain('Retrying release')
    expect(stateText).toContain('"resultAction": "retry"')
    expect(stateText).toContain('"resultLabel": "Retry"')
    expect(stateText).toContain('"resultStatus": "warning"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('retry')
  })

  it('promotes dropdown examples to trigger, placement, disabled and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dropdown'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const disabledScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('禁用危险项'))
    const hoverScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('悬浮触发'))
    const persistentScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('不自动关闭'))
    const disabledTriggerScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('禁用触发'))

    expect(acceptancePanel.text()).toContain('7 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(disabledScenario).toBeTruthy()
    expect(hoverScenario).toBeTruthy()
    expect(persistentScenario).toBeTruthy()
    expect(disabledTriggerScenario).toBeTruthy()

    await disabledScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('danger')
    expect(source).toContain('Delete draft')
    expect(source).toContain('disabled: true')
    expect(source).toContain('tone="warning"')
    expect(wrapper.text()).toContain('已切换到「禁用危险项」场景。')

    await hoverScenario?.trigger('click')
    source = wrapper.find('textarea').element.value
    expect(source).toContain('trigger="hover"')
    expect(source).toContain('placement="top-start"')

    await persistentScenario?.trigger('click')
    source = wrapper.find('textarea').element.value
    expect(source).toContain(':hide-on-click="false"')
    expect(source).toContain('Sticky menu')

    await disabledTriggerScenario?.trigger('click')
    source = wrapper.find('textarea').element.value
    expect(source).toContain('<YDropdown')
    expect(source).toContain('disabled')
    expect(source).not.toContain(' open')
  })

  it('hydrates dropdown keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-menu'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dropdown'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard actions')
    expect(source).toContain('Enter, Space and Arrow keys operate the menu.')
    expect(source).toContain('<YDropdown')

    window.location.hash = ''
  })

  it('simulates dropdown menu action workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=action-menu'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'dropdown'
      }
    })

    await nextTick()
    await nextTick()

    await wrapper.get('[data-testid="dropdown-simulate-copy-command"]').trigger('click')
    await nextTick()

    expect(wrapper.find('textarea').element.value).toContain('Copy command')
    expect(wrapper.find('.live-example-runner__preview .yok-dropdown__menu').exists()).toBe(false)
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"dropdownAction": "copy"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"dropdownOpen": false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('visibleChange')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('select')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Copy command')
    expect(wrapper.text()).toContain('已模拟 Dropdown 选择 Copy command')

    window.location.hash = ''
  })

  it('promotes popconfirm examples to danger, cancel, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'popconfirm'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const dangerScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('危险删除'))

    expect(acceptancePanel.text()).toContain('5 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(dangerScenario).toBeTruthy()

    await dangerScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('danger')
    expect(source).toContain('Delete draft permanently?')
    expect(source).toContain('confirm-text="Delete"')
    expect(source).toContain('<YButton variant="secondary">Delete draft</YButton>')
    expect(source).toContain('This cannot be undone after publishing.')
    expect(wrapper.text()).toContain('已切换到「危险删除」场景。')
  })

  it('hydrates popconfirm keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-confirm'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'popconfirm'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Confirm with keyboard?')
    expect(source).toContain('Tab reaches Cancel and Confirm; Enter activates the focused action.')
    expect(source).toContain('<YButton variant="secondary">Keyboard confirm</YButton>')

    window.location.hash = ''
  })

  it('simulates popconfirm confirm and cancel workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=archive-confirm'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'popconfirm'
      }
    })

    await nextTick()
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview .live-example-runner__popconfirm-panel').exists()).toBe(true)

    await wrapper.get('[data-testid="popconfirm-simulate-confirm"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview .live-example-runner__popconfirm-panel').exists()).toBe(false)
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"popconfirmAction": "confirm"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"popconfirmOpen": false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('confirm')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:open')
    expect(wrapper.text()).toContain('已模拟 Popconfirm 确认 Archive')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('cancel')
    await nextTick()
    await wrapper.get('[data-testid="popconfirm-simulate-cancel"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"popconfirmAction": "cancel"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('cancel')
    expect(wrapper.text()).toContain('已模拟 Popconfirm 取消 Continue editing')

    window.location.hash = ''
  })

  it('generates workflow scenarios for overlays, transfer, tables and date ranges', async () => {
    const dateRange = mount(LiveExampleRunner, {
      props: {
        preset: 'dateRangePicker'
      }
    })

    expect(dateRange.text()).toContain('Date Range scenario')

    await dateRange.findAll('.live-example-runner__control select')[0].setValue('freeze')

    expect(dateRange.find('textarea').element.value).toContain('Release freeze window')
    expect(dateRange.find('textarea').element.value).toContain('error="Release freeze overlaps with QA handoff."')

    const tooltip = mount(LiveExampleRunner, {
      props: {
        preset: 'tooltip'
      }
    })

    expect(tooltip.text()).toContain('Tooltip scenario')

    await tooltip.findAll('.live-example-runner__control select')[0].setValue('disabled')

    expect(tooltip.find('textarea').element.value).toContain('Resolve validation errors before publishing.')
    expect(tooltip.find('textarea').element.value).toContain('<YButton variant="secondary" disabled>')

    const popover = mount(LiveExampleRunner, {
      props: {
        preset: 'popover'
      }
    })

    expect(popover.text()).toContain('Popover scenario')

    await popover.findAll('.live-example-runner__control select')[0].setValue('empty')

    expect(popover.find('textarea').element.value).toContain('No filters saved')
    expect(popover.find('textarea').element.value).toContain('Popover can guide compact empty states.')

    const drawer = mount(LiveExampleRunner, {
      props: {
        preset: 'drawer'
      }
    })

    expect(drawer.text()).toContain('Drawer scenario')

    await drawer.findAll('.live-example-runner__control select')[0].setValue('mobileNav')

    expect(drawer.find('textarea').element.value).toContain('placement="left"')
    expect(drawer.find('textarea').element.value).toContain('Mobile navigation uses a left drawer')

    const table = mount(LiveExampleRunner, {
      props: {
        preset: 'table'
      }
    })

    expect(table.text()).toContain('Table scenario')

    await table.findAll('.live-example-runner__control select')[0].setValue('selection')

    expect(table.find('textarea').element.value).toContain('selected-row-keys="button,data-table"')
    expect(table.find('textarea').element.value).toContain('Selection state mirrors batch operations.')

    await table.findAll('.live-example-runner__control select')[0].setValue('expand')

    expect(table.find('textarea').element.value).toContain('expandable')
    expect(table.find('textarea').element.value).toContain('expanded-row-keys="1"')
    expect(table.find('textarea').element.value).toContain('#expand')
    expect(table.find('textarea').element.value).toContain('@expand-change="handleExpandChange"')
    expect(table.find('textarea').element.value).toContain('Expandable rows reveal details without leaving table context.')
    await nextTick()
    expect(table.find('.live-example-runner__preview').text()).toContain('1 · Button docs include variants')

    const transfer = mount(LiveExampleRunner, {
      props: {
        preset: 'transfer'
      }
    })

    expect(transfer.text()).toContain('Transfer scenario')

    await transfer.findAll('.live-example-runner__control select')[0].setValue('review')

    expect(transfer.find('textarea').element.value).toContain('disabled')
    expect(transfer.find('textarea').element.value).toContain('Readonly review keeps assigned permissions visible.')
  })

  it('promotes tooltip examples to error and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'tooltip'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const errorScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('错误说明'))

    expect(acceptancePanel.text()).toContain('7 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(errorScenario).toBeTruthy()
    expect(wrapper.find('.live-example-runner__error').exists()).toBe(false)

    await errorScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('error')
    expect(source).toContain('Fix validation errors before publishing.')
    expect(source).toContain('placement="bottom"')
    expect(source).toContain(':show-delay="0"')
    expect(source).toContain('<YButton variant="secondary">Publish blocked</YButton>')
    expect(wrapper.text()).toContain('已切换到「错误说明」场景。')
  })

  it('documents tooltip click control and light placement scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'tooltip'
      }
    })

    const scenarioButtons = wrapper.findAll('.live-example-runner__scenario-grid button')
    const clickScenario = scenarioButtons.find((button) => button.text().includes('点击触发'))
    const lightScenario = scenarioButtons.find((button) => button.text().includes('浅色主题'))

    expect(clickScenario).toBeTruthy()
    expect(lightScenario).toBeTruthy()

    await clickScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('trigger="click"')
    expect(wrapper.find('textarea').element.value).toContain('open')
    expect(wrapper.find('textarea').element.value).toContain('Click trigger mirrors controlled tooltip workflows.')

    await lightScenario?.trigger('click')
    expect(wrapper.find('textarea').element.value).toContain('theme="light"')
    expect(wrapper.find('textarea').element.value).toContain('placement="right"')
    expect(wrapper.find('textarea').element.value).toContain('Light tooltip works for dense toolbars and settings rows.')
  })

  it('hydrates tooltip error scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=validation-tooltip'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'tooltip'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('error')
    expect(source).toContain('Fix validation errors before publishing.')
    expect(source).toContain('<YButton variant="secondary">Publish blocked</YButton>')

    window.location.hash = ''
  })

  it('hydrates tooltip light scenarios into source and preview from shareable hashes', async () => {
    window.location.hash = '#live-example?scenario=light-tooltip'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'tooltip'
      }
    })
    await nextTick()
    await nextTick()

    const source = wrapper.find('textarea').element.value
    const tooltipBubble = wrapper.find('.live-example-runner__stage [role="tooltip"]')

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('light')
    expect(source).toContain('theme="light"')
    expect(source).toContain('placement="right"')
    expect(source).toContain(':hide-delay="80"')
    expect(tooltipBubble.exists()).toBe(true)
    expect(tooltipBubble.classes()).toContain('yok-tooltip__bubble--light')
    expect(tooltipBubble.text()).toContain('Light theme keeps dense settings readable.')

    window.location.hash = ''
  })

  it('simulates tooltip controlled open and close workflow through live example actions', async () => {
    window.location.hash = '#live-example?scenario=click-tooltip'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'tooltip'
      }
    })

    await nextTick()
    await nextTick()

    await wrapper.get('[data-testid="tooltip-simulate-open"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__stage [role="tooltip"]').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"tooltipOpen": true')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('visibleChange')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('true')
    expect(wrapper.text()).toContain('已模拟 Tooltip 受控打开')

    await wrapper.get('[data-testid="tooltip-simulate-close"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"tooltipOpen": false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('false')
    expect(wrapper.text()).toContain('已模拟 Tooltip 受控关闭')

    window.location.hash = ''
  })

  it('generates tree examples with selected, expanded and checked keys', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'tree'
      }
    })

    expect(wrapper.text()).toContain('Tree scenario')

    const selectedNodeSelect = wrapper.findAll('.live-example-runner__control select')[1]
    await selectedNodeSelect.setValue('command-palette')

    const source = wrapper.find('textarea').element.value

    expect(source).toContain('<YTree')
    expect(source).toContain('selected-key="command-palette"')
    expect(source).toContain('expanded-keys="core,product"')
    expect(source).toContain('Tree data is injected by the docs runner')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('permissions')

    expect(wrapper.find('textarea').element.value).toContain('check-strictly')
  })

  it('generates transfer and tree readiness depth scenarios', async () => {
    const transfer = mount(LiveExampleRunner, {
      props: {
        preset: 'transfer'
      }
    })

    const transferScenario = transfer.findAll('.live-example-runner__control select')[0]

    await transferScenario.setValue('keyboard')

    expect(transfer.find('textarea').element.value).toContain('Keyboard transfer')
    expect(transfer.find('textarea').element.value).toContain('Tab reaches source checks, move buttons and target checks')

    await transferScenario.setValue('mobile')

    expect(transfer.find('textarea').element.value).toContain('Mobile permission transfer')
    expect(transfer.find('textarea').element.value).toContain('Compact labels keep dual lists readable on narrow screens')

    const tree = mount(LiveExampleRunner, {
      props: {
        preset: 'tree'
      }
    })
    const treeScenario = tree.findAll('.live-example-runner__control select')[0]

    await treeScenario.setValue('empty')

    expect(tree.find('textarea').element.value).toContain(':nodes="[]"')
    expect(tree.find('textarea').element.value).toContain('No matching components')

    await treeScenario.setValue('keyboard')

    expect(tree.find('textarea').element.value).toContain('Keyboard component tree')
    expect(tree.find('textarea').element.value).toContain('Arrow keys move through visible tree items')

    await treeScenario.setValue('mobile')

    expect(tree.find('textarea').element.value).toContain('Mobile component tree')
    expect(tree.find('textarea').element.value).toContain('Short labels keep the tree scannable')
  })

  it('keeps transfer live previews interactive after moving options', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'transfer'
      }
    })

    await flushPromises()
    await nextTick()

    const adminOption = wrapper
      .findAll('.live-example-runner__preview .yok-transfer__item')
      .find((item) => item.text().includes('Admin'))

    expect(adminOption, 'Missing source Admin option').toBeTruthy()

    const adminCheckbox = adminOption!.find<HTMLInputElement>('input[type="checkbox"]')
    adminCheckbox.element.checked = true
    await adminCheckbox.trigger('change')
    await nextTick()

    const moveRight = wrapper.get('button[aria-label="Move selected to target"]')
    expect(moveRight.attributes('disabled')).toBeUndefined()

    await moveRight.trigger('click')
    await nextTick()

    const targetPanel = wrapper
      .findAll('.live-example-runner__preview .yok-transfer__panel')
      .find((panel) => panel.attributes('aria-label') === 'Selected')

    expect(targetPanel?.text()).toContain('Admin')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
  })

  it('keeps tree live previews interactive after selecting checking and collapsing nodes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'tree'
      }
    })

    await flushPromises()
    await nextTick()

    const findTreeItem = (label: string) => wrapper
      .findAll('.live-example-runner__preview [role="treeitem"]')
      .find((item) => item.text().includes(label))

    const datePickerItem = findTreeItem('Date Picker')

    expect(datePickerItem, 'Missing Date Picker tree item').toBeTruthy()

    await datePickerItem!.trigger('click')
    await nextTick()

    expect(findTreeItem('Date Picker')?.attributes('aria-selected')).toBe('true')

    const treeCheckbox = wrapper.get('button[aria-label="Check Tree"]')

    await treeCheckbox.trigger('click')
    await nextTick()

    expect(wrapper.get('button[aria-label="Uncheck Tree"]').attributes('aria-checked')).toBe('true')

    await wrapper.get('button[aria-label="Collapse Product"]').trigger('click')
    await nextTick()

    expect(findTreeItem('Product')?.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:selectedKey')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:checkedKeys')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:expandedKeys')
  })

  it('promotes pagination examples to list, dense, single page, disabled, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'pagination'
      }
    })

    expect(wrapper.text()).toContain('Pagination scenario')

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const disabledScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('禁用状态'))

    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(disabledScenario).toBeTruthy()

    await disabledScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('disabled')
    expect(source).toContain('Release queue paused')
    expect(source).toContain('disabled')
    expect(source).toContain('aria-label="Disabled release queue pagination"')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('dense')

    const pageSlider = wrapper.findAll('.live-example-runner__control input[type="range"]')[0]
    await pageSlider.setValue(5)

    source = wrapper.find('textarea').element.value

    expect(source).toContain('<YPagination')
    expect(source).toContain(':page="5"')
    expect(source).toContain(':sibling-count="2"')
    expect(source).toContain('Dense table pagination')
  })

  it('keeps pagination live previews interactive after changing pages', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'pagination'
      }
    })

    await flushPromises()
    await nextTick()

    const preview = wrapper.find('.live-example-runner__preview')
    const findPageButton = (label: string) => preview
      .findAll('button.yok-pagination__page')
      .find((button) => button.text() === label)

    const pageTwo = findPageButton('2')
    const pageThree = findPageButton('3')

    expect(pageTwo, 'Missing page 2 button').toBeTruthy()
    expect(pageThree, 'Missing page 3 button').toBeTruthy()
    expect(pageTwo?.attributes('aria-current')).toBe('page')
    expect(pageThree?.attributes('aria-current')).toBeUndefined()

    await pageThree!.trigger('click')
    await nextTick()

    expect(findPageButton('3')?.attributes('aria-current')).toBe('page')
    expect(findPageButton('2')?.attributes('aria-current')).toBeUndefined()
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:page')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"page": 3')
  })

  it('simulates pagination list paging page size and last page workflow paths', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'pagination'
      }
    })

    await flushPromises()
    await nextTick()

    expect(wrapper.find('.live-example-runner__pagination-preview').text()).toContain('Component 11')
    expect(wrapper.find('.live-example-runner__pagination-preview').text()).toContain('Component 20')

    await wrapper.get('[data-testid="pagination-simulate-next-batch"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__pagination-preview').text()).toContain('Component 21')
    expect(wrapper.find('.live-example-runner__pagination-preview').text()).toContain('Component 30')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"page": 3')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Pagination@nextBatch')

    await wrapper.get('[data-testid="pagination-simulate-page-size"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__pagination-preview').text()).toContain('Component 1')
    expect(wrapper.find('.live-example-runner__pagination-preview').text()).toContain('Component 20')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"pageSize": 20')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Pagination@pageSize')

    await wrapper.get('[data-testid="pagination-simulate-last-page"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__pagination-preview').text()).toContain('Component 61')
    expect(wrapper.find('.live-example-runner__pagination-preview').text()).toContain('Component 72')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"visibleRange": "61-72"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Pagination@lastPage')
  })

  it('hydrates pagination keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-pagination'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'pagination'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard pagination path')
    expect(source).toContain('aria-label="Keyboard pagination for result pages"')
    expect(source).toContain('previous-text="Previous page"')
    expect(source).toContain('next-text="Next page"')

    window.location.hash = ''
  })

  it('promotes list examples to task, grid, loading, empty, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'list'
      }
    })

    expect(wrapper.text()).toContain('List scenario')

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const gridScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('资源网格'))

    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="loading-state"]').attributes('data-passed')).toBe('true')
    expect(gridScenario).toBeTruthy()

    await gridScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('grid')
    expect(source).toContain('Component resource grid')
    expect(source).toContain('layout="vertical"')
    expect(source).toContain(':columns="3"')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('loading')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('loading')
    expect(source).toContain('Refreshing review tasks')
  })

  it('hydrates list keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-list'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'list'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard readable task list')
    expect(source).toContain('aria-label="Keyboard readable release tasks"')
    expect(source).toContain('Use ul and li semantics; keep row actions as real buttons.')

    window.location.hash = ''
  })

  it('simulates list loading resolved empty and retry workflow paths', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'list'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="list-simulate-loading"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__list-preview').text()).toContain('Refreshing review tasks')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "loading"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('List@loading')

    await wrapper.get('[data-testid="list-simulate-resolved"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__list-preview').text()).toContain('Release checklist ready')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "resolved"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('List@resolved')

    await wrapper.get('[data-testid="list-simulate-empty"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__list-preview').text()).toContain('No matching tasks')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"itemCount": 0')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('List@empty')

    await wrapper.get('[data-testid="list-simulate-retry"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__list-preview').text()).toContain('Retrying task refresh')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"attempt": 2')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('List@retry')
  })

  it('promotes timeline examples to release, reverse, alternate, loading, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'timeline'
      }
    })

    expect(wrapper.text()).toContain('Timeline scenario')

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const alternateScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('交替布局'))

    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="loading-state"]').attributes('data-passed')).toBe('true')
    expect(alternateScenario).toBeTruthy()

    await alternateScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('alternate')
    expect(source).toContain('Alternating release story')
    expect(source).toContain('placement="alternate"')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('loading')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Publishing job timeline')
    expect(source).toContain("loading: true")
    expect(source).toContain('Recording...')
  })

  it('hydrates timeline keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-timeline'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'timeline'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard readable release timeline')
    expect(source).toContain('aria-label="Keyboard readable release timeline"')
    expect(source).toContain('Use ordered list semantics; keep timeline actions after each event.')

    window.location.hash = ''
  })

  it('simulates timeline running failed rollback and complete release workflow paths', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'timeline'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="timeline-simulate-running"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__timeline-preview').text()).toContain('Publishing package timeline')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "running"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Timeline@running')

    await wrapper.get('[data-testid="timeline-simulate-failed"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__timeline-preview').text()).toContain('Release failed during publish')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"failedStep": "Publish package"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Timeline@failed')

    await wrapper.get('[data-testid="timeline-simulate-rollback"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__timeline-preview').text()).toContain('Rollback release package')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"reverse": true')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Timeline@rollback')

    await wrapper.get('[data-testid="timeline-simulate-complete"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__timeline-preview').text()).toContain('Release workflow complete')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "complete"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Timeline@complete')
  })

  it('promotes statistic examples to metric, unit, card, countdown, loading, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'statistic'
      }
    })

    expect(wrapper.text()).toContain('Statistic scenario')

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const unitScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('单位精度'))

    expect(acceptancePanel.text()).toContain('7 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="loading-state"]').attributes('data-passed')).toBe('true')
    expect(unitScenario).toBeTruthy()

    await unitScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('unit')
    expect(source).toContain('Account balance')
    expect(source).toContain(':precision="2"')
    expect(source).toContain('suffix="CNY"')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('loading')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Revenue loading')
    expect(source).toContain('loading')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('countdown')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('<YCountdown')
    expect(source).toContain('format="DD days HH:mm:ss"')
    expect(source).toContain('Campaign countdown')
  })

  it('simulates statistic loading refresh warning and reset metric workflow paths', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'statistic'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="statistic-simulate-loading"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__statistic-preview').text()).toContain('Refreshing active users')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "loading"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Statistic@loading')

    await wrapper.get('[data-testid="statistic-simulate-refresh"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__statistic-preview').text()).toContain('128,420')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"value": 128420')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Statistic@refresh')

    await wrapper.get('[data-testid="statistic-simulate-warning"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__statistic-preview').text()).toContain('Error budget used')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"tone": "warning"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Statistic@warning')

    await wrapper.get('[data-testid="statistic-simulate-reset"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__statistic-preview').text()).toContain('Active users baseline')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "baseline"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Statistic@reset')
  })

  it('hydrates statistic keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-statistic'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'statistic'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Screen reader metric')
    expect(source).toContain('aria-label="Screen reader active user metric"')
    expect(source).toContain('suffix="users"')

    window.location.hash = ''
  })

  it('promotes color picker examples to alpha, presets, validation, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'colorPicker'
      }
    })

    expect(wrapper.text()).toContain('Color Picker scenario')
    expect(wrapper.find('.live-example-runner__cockpit').text()).toContain('8 scenes')

    const alphaScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('透明度'))
    const presetScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('预设色'))
    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘输入'))
    const validationScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('表单校验'))

    expect(alphaScenario, 'Missing color picker alpha scenario').toBeTruthy()
    expect(presetScenario, 'Missing color picker preset scenario').toBeTruthy()
    expect(keyboardScenario, 'Missing color picker keyboard scenario').toBeTruthy()
    expect(validationScenario, 'Missing color picker validation scenario').toBeTruthy()

    await alphaScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(source).toContain('<YColorPicker')
    expect(source).toContain('show-alpha')
    expect(source).toContain('show-text')
    expect(source).toContain('model-value="#14B8A680"')
    expect(wrapper.find('.live-example-runner__stage').text()).toContain('#14B8A680')

    await presetScenario?.trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain(':presets="brandPresets"')
    expect(source).toContain('Brand presets keep theme choices consistent.')

    await validationScenario?.trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('id="brand-color-field"')
    expect(source).toContain('aria-describedby="brand-color-help"')
    expect(source).toContain(':presets="brandPresets"')
    expect(source).toContain('Pick a brand-approved color before publishing.')
    expect(source).toContain('@change')

    await keyboardScenario?.trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Keyboard color')
    expect(source).toContain('Typing a HEX value keeps keyboard editing first-class.')
  })

  it('hydrates color picker validation scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=form-validation-color-picker'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'colorPicker'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('validation')
    expect(source).toContain('id="brand-color-field"')
    expect(source).toContain('aria-describedby="brand-color-help"')
    expect(source).toContain('invalid')
    expect(source).toContain('@clear')
    expect(wrapper.text()).toContain('已切换到「表单校验」场景。')

    window.location.hash = ''
  })

  it('keeps color picker live previews interactive after editing and clearing a color', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'colorPicker'
      }
    })

    await flushPromises()
    await nextTick()

    const colorInput = wrapper.get<HTMLInputElement>('.live-example-runner__preview .yok-color-picker__text')

    expect(colorInput.element.value).toBe('#14B8A6')
    expect(wrapper.find('.live-example-runner__preview .yok-color-picker__value').text()).toBe('#14B8A6')

    await colorInput.setValue('#38BDF8')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview .yok-color-picker__value').text()).toBe('#38BDF8')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"color": "#38BDF8"')

    await wrapper.get('.live-example-runner__preview .yok-color-picker__clear').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview .yok-color-picker__value').text()).toBe('No color selected')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"color": ""')
  })

  it('simulates color picker preset selection and clearing through live example actions', async () => {
    window.location.hash = '#live-example?scenario=preset-color-picker'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'colorPicker'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="color-picker-simulate-brand-purple"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview .yok-color-picker__text').element.value).toBe('#A78BFA')
    expect(wrapper.find('.live-example-runner__preview .yok-color-picker__value').text()).toBe('#A78BFA')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"color": "#A78BFA"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')

    await wrapper.get('[data-testid="color-picker-simulate-clear"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview .yok-color-picker__value').text()).toBe('No color selected')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"color": ""')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('clear')
    expect(wrapper.text()).toContain('已模拟清空 Color Picker')

    window.location.hash = ''
  })

  it('generates guided form control examples for numeric, choice and switch components', async () => {
    const inputNumber = mount(LiveExampleRunner, {
      props: {
        preset: 'inputNumber'
      }
    })

    expect(inputNumber.text()).toContain('Input Number scenario')
    expect(inputNumber.find('.live-example-runner__cockpit').text()).toContain('7 scenes')

    const scenarioSelect = inputNumber.find('.live-example-runner__control select')
    await scenarioSelect.setValue('error')

    expect(inputNumber.find('textarea').element.value).toContain('Coverage threshold')
    expect(inputNumber.find('textarea').element.value).toContain(':max="100"')
    expect(inputNumber.find('textarea').element.value).toContain('Threshold must be reviewed before release.')

    const radioGroup = mount(LiveExampleRunner, {
      props: {
        preset: 'radioGroup'
      }
    })

    expect(radioGroup.text()).toContain('Radio Group scenario')

    const packageSelect = radioGroup.findAll('.live-example-runner__control select')[1]
    await packageSelect.setValue('product')

    expect(radioGroup.find('textarea').element.value).toContain('<YRadioGroup')
    expect(radioGroup.find('textarea').element.value).toContain('model-value="product"')

    const switchRunner = mount(LiveExampleRunner, {
      props: {
        preset: 'switch'
      }
    })

    expect(switchRunner.text()).toContain('Switch scenario')

    await setCheckbox(switchRunner, '开启', false)

    expect(switchRunner.find('textarea').element.value).toContain('model-value="false"')
  })

  it('generates guided navigation examples for tabs, steps and collapse', async () => {
    const tabs = mount(LiveExampleRunner, {
      props: {
        preset: 'tabs'
      }
    })

    expect(tabs.text()).toContain('Tabs scenario')
    expect(tabs.find('.live-example-runner__cockpit').text()).toContain('5 scenes')

    const activeTabSelect = tabs.findAll('.live-example-runner__control select')[1]
    await activeTabSelect.setValue('api')

    expect(tabs.find('textarea').element.value).toContain('<YTabs')
    expect(tabs.find('textarea').element.value).toContain('model-value="api"')

    const steps = mount(LiveExampleRunner, {
      props: {
        preset: 'steps'
      }
    })

    expect(steps.text()).toContain('Steps scenario')
    expect(steps.find('.live-example-runner__cockpit').text()).toContain('5 scenes')

    const currentStepSlider = steps.find('.live-example-runner__control input[type="range"]')
    await currentStepSlider.setValue(2)

    expect(steps.find('textarea').element.value).toContain('<YSteps')
    expect(steps.find('textarea').element.value).toContain(':current="2"')
    expect(steps.find('textarea').element.value).toContain('selectable')

    const tour = mount(LiveExampleRunner, {
      props: {
        preset: 'tour'
      }
    })

    expect(tour.text()).toContain('Tour scenario')
    expect(tour.find('.live-example-runner__cockpit').text()).toContain('7 scenes')

    const tourScenarioSelect = tour.find('.live-example-runner__control select')
    await tourScenarioSelect.setValue('keyboard')

    expect(tour.find('textarea').element.value).toContain('<YTour')
    expect(tour.find('textarea').element.value).toContain('close-on-escape')
    expect(tour.find('textarea').element.value).toContain('tourSteps')

    const collapse = mount(LiveExampleRunner, {
      props: {
        preset: 'collapse'
      }
    })

    expect(collapse.text()).toContain('Collapse scenario')

    const scenarioSelect = collapse.find('.live-example-runner__control select')
    await scenarioSelect.setValue('accordion')

    expect(collapse.find('textarea').element.value).toContain('<YCollapse')
    expect(collapse.find('textarea').element.value).toContain('model-value="settings"')
    expect(collapse.find('textarea').element.value).toContain('accordion')
  })

  it('promotes tabs examples to error, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'tabs'
      }
    })

    expect(wrapper.text()).toContain('Tabs scenario')
    expect(wrapper.find('.live-example-runner__acceptance').text()).toContain('5 scenes')
    expect(wrapper.find('.live-example-runner__acceptance').text()).toContain('错误/空态')
    expect(wrapper.find('.live-example-runner__acceptance').text()).toContain('键盘路径')

    const errorScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((item) => item.text().includes('阻断说明'))
    const mobileScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((item) => item.text().includes('移动标签'))
    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((item) => item.text().includes('键盘切换'))

    expect(errorScenario, 'Missing tabs error scenario').toBeTruthy()
    expect(mobileScenario, 'Missing tabs mobile scenario').toBeTruthy()
    expect(keyboardScenario, 'Missing tabs keyboard scenario').toBeTruthy()

    await errorScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(source).toContain('model-value="error"')
    expect(source).toContain('Release note is blocked until the API tab is reviewed.')
    expect(source).toContain('tone="danger"')

    await mobileScenario?.trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('model-value="mobile"')
    expect(source).toContain('Short labels keep mobile tab rows readable.')

    await keyboardScenario?.trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('model-value="keyboard"')
    expect(source).toContain('Arrow keys move focus between tabs')
    expect(window.location.hash).toBe('#live-example?scenario=keyboard-tabs')
  })

  it('keeps tabs live previews interactive after changing the active tab', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'tabs'
      }
    })

    await flushPromises()
    await nextTick()

    const preview = wrapper.find('.live-example-runner__preview')
    const apiTab = preview.find('button[data-tab-value="api"]')

    expect(apiTab.exists()).toBe(true)

    await apiTab.trigger('click')
    await nextTick()

    expect(preview.find('button[data-tab-value="api"]').attributes('aria-selected')).toBe('true')
    expect(preview.find('button[data-tab-value="overview"]').attributes('aria-selected')).toBe('false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
  })

  it('promotes steps examples to error, vertical, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'steps'
      }
    })

    expect(wrapper.text()).toContain('Steps scenario')
    expect(wrapper.find('.live-example-runner__acceptance').text()).toContain('5 scenes')
    expect(wrapper.find('.live-example-runner__acceptance').text()).toContain('错误/空态')
    expect(wrapper.find('.live-example-runner__acceptance').text()).toContain('键盘路径')

    const errorScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((item) => item.text().includes('错误步骤'))
    const verticalScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((item) => item.text().includes('纵向流程'))
    const keyboardScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((item) => item.text().includes('键盘步骤'))

    expect(errorScenario, 'Missing steps error scenario').toBeTruthy()
    expect(verticalScenario, 'Missing steps vertical scenario').toBeTruthy()
    expect(keyboardScenario, 'Missing steps keyboard scenario').toBeTruthy()

    await errorScenario?.trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(source).toContain(':current="1"')
    expect(source).toContain("status: 'error'")
    expect(source).toContain('Review failed because required API notes are missing.')

    await verticalScenario?.trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('direction="vertical"')
    expect(source).toContain('Vertical steps keep long release flows readable.')

    await keyboardScenario?.trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('selectable')
    expect(source).toContain('Tab reaches each step button')
    expect(window.location.hash).toBe('#live-example?scenario=keyboard-steps')
  })

  it('keeps steps live previews interactive after selecting a step', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'steps'
      }
    })

    await flushPromises()
    await nextTick()

    const preview = wrapper.find('.live-example-runner__preview')
    const findStepButton = (label: string) => preview
      .findAll('button.yok-steps__content')
      .find((button) => button.text().includes(label))
    const importStep = findStepButton('Import')
    const shipStep = findStepButton('Ship')

    expect(importStep, 'Missing Import step').toBeTruthy()
    expect(shipStep, 'Missing Ship step').toBeTruthy()
    expect(importStep?.attributes('aria-current')).toBe('step')
    expect(shipStep?.attributes('aria-current')).toBeUndefined()

    await shipStep!.trigger('click')
    await nextTick()

    expect(findStepButton('Ship')?.attributes('aria-current')).toBe('step')
    expect(findStepButton('Import')?.attributes('aria-current')).toBeUndefined()
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('select')
  })

  it('simulates steps next back blocked and complete workflow paths', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'steps'
      }
    })

    await flushPromises()
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Import')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"currentStep": 1')

    await wrapper.get('[data-testid="steps-simulate-next"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"currentStep": 2')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"workflow": "next"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Steps@next')

    await wrapper.get('[data-testid="steps-simulate-back"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"currentStep": 1')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Steps@back')

    await wrapper.get('[data-testid="steps-simulate-blocked"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Review blocked')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "blocked"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Steps@blocked')

    await wrapper.get('[data-testid="steps-simulate-complete"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Release workflow complete')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"currentStep": 2')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "complete"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Steps@complete')
  })

  it('hydrates tabs and steps keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-tabs'

    const tabs = mount(LiveExampleRunner, {
      props: {
        preset: 'tabs'
      }
    })

    await nextTick()
    await nextTick()

    expect(tabs.find('textarea').element.value).toContain('Arrow keys move focus between tabs')
    expect(tabs.find('textarea').element.value).toContain('model-value="keyboard"')

    window.location.hash = '#live-example?scenario=keyboard-steps'

    const steps = mount(LiveExampleRunner, {
      props: {
        preset: 'steps'
      }
    })

    await nextTick()
    await nextTick()

    expect(steps.find('textarea').element.value).toContain('Tab reaches each step button')
    expect(steps.find('textarea').element.value).toContain('selectable')

    window.location.hash = ''
  })

  it('hydrates scenarios from real anchor query links used by API coverage badges', async () => {
    window.history.pushState(null, '', '/components/input?live-scenario=keyboard-input#live-example')

    const input = mount(LiveExampleRunner, {
      props: {
        preset: 'input'
      }
    })

    await nextTick()
    await nextTick()

    expect(input.find('textarea').element.value).toContain('Keyboard field')
    expect(input.find('textarea').element.value).toContain('Tab enters the native input')

    window.history.pushState(null, '', '/components/input')
  })

  it('promotes progress and textarea examples to workflow scenes', async () => {
    const progress = mount(LiveExampleRunner, {
      props: {
        preset: 'progress'
      }
    })

    expect(progress.text()).toContain('Progress scenario')
    expect(progress.find('.live-example-runner__acceptance').text()).toContain('5 scenes')
    expect(progress.find('.live-example-runner__acceptance').find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    await findScenarioButton(progress, '失败进度').trigger('click')

    let source = progress.find('textarea').element.value

    expect(source).toContain('tone="danger"')
    expect(source).toContain('Dependency install failed.')

    await findScenarioButton(progress, '键盘进度').trigger('click')

    source = progress.find('textarea').element.value

    expect(source).toContain('Keyboard progress status')
    expect(source).toContain('Screen reader announces progressbar value changes.')
    expect(window.location.hash).toBe('#live-example?scenario=keyboard-progress')

    progress.unmount()

    const textarea = mount(LiveExampleRunner, {
      props: {
        preset: 'textarea'
      }
    })

    expect(textarea.text()).toContain('Textarea scenario')
    expect(textarea.find('.live-example-runner__acceptance').text()).toContain('7 scenes')

    await findScenarioButton(textarea, '帮助说明').trigger('click')

    source = textarea.find('textarea').element.value

    expect(source).toContain('Release summary')
    expect(source).toContain('aria-describedby="release-summary-help"')
    expect(source).toContain('Mention audience impact')

    await findScenarioButton(textarea, '尺寸密度').trigger('click')

    source = textarea.find('textarea').element.value

    expect(source).toContain('Compact note')
    expect(source).toContain('size="sm"')
    expect(source).toContain('size="md"')
    expect(source).toContain('size="lg"')

    await findScenarioButton(textarea, '校验错误').trigger('click')

    source = textarea.find('textarea').element.value

    expect(source).toContain('error="Release note is required before publishing."')
    expect(source).toContain('invalid')

    await findScenarioButton(textarea, '键盘长文').trigger('click')

    source = textarea.find('textarea').element.value

    expect(source).toContain('Keyboard release note')
    expect(source).toContain('Tab focuses the textarea; Shift+Enter keeps editing on multiline content.')
    expect(window.location.hash).toBe('#live-example?scenario=keyboard-textarea')
  })

  it('simulates progress running, failed, retry and complete workflow paths', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'progress'
      }
    })
    await wrapper.vm.$nextTick()

    await wrapper.get('[data-testid="progress-simulate-running"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"progressPhase": "running"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"progressValue": 42')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Progress@running')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Installing package')

    await wrapper.get('[data-testid="progress-simulate-failed"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"progressPhase": "failed"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"progressTone": "danger"')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Dependency install failed')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Progress@failed')

    await wrapper.get('[data-testid="progress-simulate-retry"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"progressPhase": "retrying"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"progressAttempt": 2')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Progress@retry')

    await wrapper.get('[data-testid="progress-simulate-complete"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"progressPhase": "complete"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"progressValue": 100')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Package installed')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Progress@complete')
  })

  it('keeps textarea live previews interactive after editing text', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'textarea'
      }
    })

    await flushPromises()
    await nextTick()

    const textarea = wrapper.get<HTMLTextAreaElement>('.live-example-runner__preview .yok-textarea__control')

    await textarea.setValue('Ship fresh docs with editable examples.')
    await nextTick()

    expect(wrapper.get<HTMLTextAreaElement>('.live-example-runner__preview .yok-textarea__control').element.value).toBe('Ship fresh docs with editable examples.')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"textarea": "Ship fresh docs with editable examples."')
  })

  it('promotes tag badge, avatar and breadcrumb examples to workflow scenes', async () => {
    const tagBadge = mount(LiveExampleRunner, {
      props: {
        preset: 'tagBadge'
      }
    })

    expect(tagBadge.text()).toContain('Tag & Badge scenario')
    expect(tagBadge.find('.live-example-runner__acceptance').text()).toContain('6 scenes')

    await findScenarioButton(tagBadge, '风险标签').trigger('click')

    let source = tagBadge.find('textarea').element.value

    expect(source).toContain('tone="danger"')
    expect(source).toContain('Breaking')

    await findScenarioButton(tagBadge, '独立状态').trigger('click')

    source = tagBadge.find('textarea').element.value

    expect(source).toContain('dot text="Online"')
    expect(source).toContain('Standalone status badges work as compact legends')

    await findScenarioButton(tagBadge, '键盘旁路').trigger('click')

    source = tagBadge.find('textarea').element.value

    expect(source).toContain('Tags and badges stay non-interactive; keyboard focus moves to the adjacent action.')
    expect(window.location.hash).toBe('#live-example?scenario=keyboard-tag-badge')

    const avatar = mount(LiveExampleRunner, {
      props: {
        preset: 'avatar'
      }
    })

    expect(avatar.text()).toContain('Avatar scenario')
    expect(avatar.find('.live-example-runner__acceptance').text()).toContain('6 scenes')

    await findScenarioButton(avatar, '图片头像').trigger('click')

    source = avatar.find('textarea').element.value

    expect(source).toContain('src-set=')
    expect(source).toContain('fit="cover"')
    expect(source).toContain('Image avatars support srcset')
    expect(window.location.hash).toBe('#live-example?scenario=image-avatar')

    await findScenarioButton(avatar, '头像组').trigger('click')

    source = avatar.find('textarea').element.value

    expect(source).toContain('Reviewer group')
    expect(source).toContain('YAvatarGroup')
    expect(source).toContain(':total="6"')
    expect(source).toContain('YAvatar name="Core Team"')

    await findScenarioButton(avatar, '键盘资料').trigger('click')

    source = avatar.find('textarea').element.value

    expect(source).toContain('Avatar remains labelled while the profile action receives keyboard focus.')
    expect(window.location.hash).toBe('#live-example?scenario=keyboard-avatar')

    const breadcrumb = mount(LiveExampleRunner, {
      props: {
        preset: 'breadcrumb'
      }
    })

    expect(breadcrumb.text()).toContain('Breadcrumb scenario')
    expect(breadcrumb.find('.live-example-runner__acceptance').text()).toContain('5 scenes')

    await findScenarioButton(breadcrumb, '权限断点').trigger('click')

    source = breadcrumb.find('textarea').element.value

    expect(source).toContain('disabled: true')
    expect(source).toContain('Admin is hidden for the current role.')

    await findScenarioButton(breadcrumb, '键盘返回').trigger('click')

    source = breadcrumb.find('textarea').element.value

    expect(source).toContain('aria-label="Keyboard breadcrumb"')
    expect(source).toContain('Tab reaches ancestor links before the current page label.')
    expect(window.location.hash).toBe('#live-example?scenario=keyboard-breadcrumb')
  })

  it('hydrates new primitive workflow scenarios from shareable live-example hashes', async () => {
    const cases = [
      {
        preset: 'progress',
        hash: '#live-example?scenario=keyboard-progress',
        expected: 'Screen reader announces progressbar value changes.'
      },
      {
        preset: 'textarea',
        hash: '#live-example?scenario=keyboard-textarea',
        expected: 'Shift+Enter keeps editing on multiline content.'
      },
      {
        preset: 'tagBadge',
        hash: '#live-example?scenario=keyboard-tag-badge',
        expected: 'keyboard focus moves to the adjacent action'
      },
      {
        preset: 'avatar',
        hash: '#live-example?scenario=keyboard-avatar',
        expected: 'profile action receives keyboard focus'
      },
      {
        preset: 'breadcrumb',
        hash: '#live-example?scenario=keyboard-breadcrumb',
        expected: 'Tab reaches ancestor links before the current page label.'
      }
    ] as const

    for (const { preset, hash, expected } of cases) {
      window.location.hash = hash

      const wrapper = mount(LiveExampleRunner, {
        props: {
          preset
        }
      })

      await nextTick()
      await nextTick()

      expect(wrapper.find('textarea').element.value).toContain(expected)
    }

    window.location.hash = ''
  })

  it('promotes virtual list and watermark examples to workflow scenes', async () => {
    const virtualList = mount(LiveExampleRunner, {
      props: {
        preset: 'virtualList'
      }
    })

    expect(virtualList.text()).toContain('Virtual List scenario')
    expect(virtualList.find('.live-example-runner__acceptance').text()).toContain('5 scenes')
    expect(virtualList.find('.live-example-runner__acceptance').find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    await findScenarioButton(virtualList, '空列表').trigger('click')

    let source = virtualList.find('textarea').element.value

    expect(source).toContain(':items="[]"')
    expect(source).toContain('No component rows match filters.')

    await findScenarioButton(virtualList, '键盘列表').trigger('click')

    source = virtualList.find('textarea').element.value

    expect(source).toContain('Keyboard virtual list')
    expect(source).toContain('Tab focuses the virtualized viewport; arrow keys scroll inside the list.')
    expect(window.location.hash).toBe('#live-example?scenario=keyboard-virtual-list')

    const watermark = mount(LiveExampleRunner, {
      props: {
        preset: 'watermark'
      }
    })

    expect(watermark.text()).toContain('Watermark scenario')
    expect(watermark.find('.live-example-runner__acceptance').text()).toContain('5 scenes')

    await findScenarioButton(watermark, '机密水印').trigger('click')

    source = watermark.find('textarea').element.value

    expect(source).toContain('content="CONFIDENTIAL"')
    expect(source).toContain('Protected export review')

    await findScenarioButton(watermark, '键盘水印').trigger('click')

    source = watermark.find('textarea').element.value

    expect(source).toContain('Keyboard watermark preview')
    expect(source).toContain('Watermark overlay is aria-hidden and never blocks keyboard focus.')
    expect(window.location.hash).toBe('#live-example?scenario=keyboard-watermark')
  })

  it('promotes carousel examples to workflow scenes with autoplay pause controls', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'carousel'
      }
    })

    expect(wrapper.text()).toContain('Carousel scenario')
    expect(wrapper.find('.live-example-runner__acceptance').text()).toContain('6 scenes')
    expect(wrapper.find('.live-example-runner__acceptance').find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    await findScenarioButton(wrapper, '自动播放').trigger('click')
    await setCheckbox(wrapper, '悬停暂停', false)

    let source = wrapper.find('textarea').element.value

    expect(source).toContain(':autoplay="true"')
    expect(source).toContain(':interval="1800"')
    expect(source).toContain(':pause-on-hover="false"')

    await findScenarioButton(wrapper, '键盘路径').trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Keyboard carousel')
    expect(source).toContain('Focus the viewport, then use ArrowLeft and ArrowRight to switch slides.')
    expect(window.location.hash).toBe('#live-example?scenario=carousel-keyboard')
  })

  it('promotes divider, form item and form summary examples to workflow scenes', async () => {
    const divider = mount(LiveExampleRunner, {
      props: {
        preset: 'divider'
      }
    })

    expect(divider.text()).toContain('Divider scenario')
    expect(divider.find('.live-example-runner__acceptance').text()).toContain('5 scenes')

    await findScenarioButton(divider, '空状态分隔').trigger('click')

    let source = divider.find('textarea').element.value

    expect(source).toContain('No matching rows')
    expect(source).toContain('Empty sections still need quiet rhythm.')

    await findScenarioButton(divider, '键盘分隔').trigger('click')

    source = divider.find('textarea').element.value

    expect(source).toContain('Keyboard divider region')
    expect(source).toContain('Separators stay non-focusable while surrounding controls remain reachable.')

    const formItem = mount(LiveExampleRunner, {
      props: {
        preset: 'formItem'
      }
    })

    expect(formItem.text()).toContain('Form Item scenario')
    expect(formItem.find('.live-example-runner__acceptance').text()).toContain('6 scenes')

    await findScenarioButton(formItem, 'Slot 绑定').trigger('click')

    source = formItem.find('textarea').element.value

    expect(source).toContain('v-slot="{ labelFor, messageId, invalid }"')
    expect(source).toContain(':id="labelFor"')
    expect(source).toContain(':aria-describedby="messageId"')
    expect(source).toContain('Use FormItem slot props instead of hand-writing disconnected ids.')

    await findScenarioButton(formItem, '校验错误').trigger('click')

    source = formItem.find('textarea').element.value

    expect(source).toContain('error="Component name is required."')
    expect(source).toContain('aria-describedby="component-name-help"')

    await findScenarioButton(formItem, '键盘字段').trigger('click')

    source = formItem.find('textarea').element.value

    expect(source).toContain('Keyboard component name')
    expect(source).toContain('Tab enters the input, then reaches the next form action.')

    const formSummary = mount(LiveExampleRunner, {
      props: {
        preset: 'formSummary'
      }
    })

    expect(formSummary.text()).toContain('Form Summary scenario')
    expect(formSummary.find('.live-example-runner__acceptance').text()).toContain('6 scenes')

    await findScenarioButton(formSummary, '关联字段').trigger('click')

    source = formSummary.find('textarea').element.value

    expect(source).toContain('const summaryErrors = [')
    expect(source).toContain(':errors="summaryErrors"')
    expect(source).toContain('id="component-name"')
    expect(source).toContain('aria-describedby="yok-form-message-component-name"')
    expect(source).toContain('Summary buttons should point to real field ids.')

    await findScenarioButton(formSummary, '空摘要').trigger('click')

    source = formSummary.find('textarea').element.value

    expect(source).toContain(':errors="[]"')
    expect(source).toContain('No validation errors')

    await findScenarioButton(formSummary, '键盘摘要').trigger('click')

    source = formSummary.find('textarea').element.value

    expect(source).toContain('Keyboard validation summary')
    expect(source).toContain('Enter moves focus to the invalid field summary target.')
  })

  it('promotes backtop examples to workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'backtop'
      }
    })

    expect(wrapper.text()).toContain('Backtop scenario')
    expect(wrapper.find('.live-example-runner__acceptance').text()).toContain('5 scenes')
    expect(wrapper.find('.live-example-runner__acceptance').find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    await findScenarioButton(wrapper, '未滚动隐藏').trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(source).toContain(':visibility-height="9999"')
    expect(source).toContain('Backtop stays hidden until the page has meaningful scroll depth.')

    await findScenarioButton(wrapper, '键盘返回').trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Keyboard back to top')
    expect(source).toContain('Enter activates the focused backtop button.')
    expect(window.location.hash).toBe('#live-example?scenario=keyboard-backtop')
  })

  it('promotes affix examples to workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'affix'
      }
    })

    expect(wrapper.text()).toContain('Affix controls')
    expect(wrapper.find('.live-example-runner__acceptance').text()).toContain('6 scenes')
    expect(wrapper.find('.live-example-runner__acceptance').find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    await findScenarioButton(wrapper, '目标容器').trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(source).toContain('target=".affix-target"')
    expect(source).toContain(':offset="24"')
    expect(source).toContain(':z-index="100"')

    await findScenarioButton(wrapper, '键盘顺序').trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Keyboard sticky toolbar')
    expect(source).toContain('Tab order stays native.')
    expect(window.location.hash).toBe('#live-example?scenario=affix-keyboard')
  })

  it('promotes anchor examples to workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'anchor'
      }
    })

    expect(wrapper.text()).toContain('Anchor controls')
    expect(wrapper.find('.live-example-runner__acceptance').text()).toContain('6 scenes')
    expect(wrapper.find('.live-example-runner__acceptance').find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')

    await findScenarioButton(wrapper, '滚动容器').trigger('click')

    let source = wrapper.find('textarea').element.value

    expect(source).toContain('container=".anchor-target"')
    expect(source).toContain(':offset="64"')
    expect(source).toContain(':bound="15"')

    await findScenarioButton(wrapper, '键盘顺序').trigger('click')

    source = wrapper.find('textarea').element.value

    expect(source).toContain('Keyboard component sections')
    expect(source).toContain('Native Tab and Enter behavior.')
    expect(window.location.hash).toBe('#live-example?scenario=anchor-keyboard')
  })

  it('hydrates utility workflow scenarios from shareable live-example hashes', async () => {
    const cases = [
      {
        preset: 'virtualList',
        hash: '#live-example?scenario=keyboard-virtual-list',
        expected: 'arrow keys scroll inside the list'
      },
      {
        preset: 'watermark',
        hash: '#live-example?scenario=keyboard-watermark',
        expected: 'never blocks keyboard focus'
      },
      {
        preset: 'divider',
        hash: '#live-example?scenario=keyboard-divider',
        expected: 'Separators stay non-focusable'
      },
      {
        preset: 'formItem',
        hash: '#live-example?scenario=keyboard-form-item',
        expected: 'Tab enters the input, then reaches the next form action.'
      },
      {
        preset: 'formSummary',
        hash: '#live-example?scenario=keyboard-form-summary',
        expected: 'Enter moves focus to the invalid field summary target.'
      },
      {
        preset: 'backtop',
        hash: '#live-example?scenario=keyboard-backtop',
        expected: 'Enter activates the focused backtop button.'
      }
    ] as const

    for (const { preset, hash, expected } of cases) {
      window.location.hash = hash

      const wrapper = mount(LiveExampleRunner, {
        props: {
          preset
        }
      })

      await nextTick()
      await nextTick()

      expect(wrapper.find('textarea').element.value).toContain(expected)
    }

    window.location.hash = ''
  })

  it('promotes productivity and theme examples to workflow scenes', async () => {
    const commandPalette = mount(LiveExampleRunner, {
      props: {
        preset: 'commandPalette'
      }
    })

    expect(commandPalette.text()).toContain('Command Palette scenario')
    expect(commandPalette.find('.live-example-runner__acceptance').text()).toContain('5 scenes')

    await findScenarioButton(commandPalette, '空命令').trigger('click')

    let source = commandPalette.find('textarea').element.value

    expect(source).toContain(':commands="[]"')
    expect(source).toContain('No commands found')

    await findScenarioButton(commandPalette, '键盘命令').trigger('click')

    source = commandPalette.find('textarea').element.value

    expect(source).toContain('Keyboard command palette')
    expect(source).toContain('Down, Up, Enter and Escape keep the command palette usable without a pointer.')

    const codeBlock = mount(LiveExampleRunner, {
      props: {
        preset: 'codeBlock'
      }
    })

    expect(codeBlock.text()).toContain('Code Block scenario')
    expect(codeBlock.find('.live-example-runner__acceptance').text()).toContain('5 scenes')

    await findScenarioButton(codeBlock, '空代码').trigger('click')

    source = codeBlock.find('textarea').element.value

    expect(source).toContain('code=""')
    expect(source).toContain('No snippet selected')

    await findScenarioButton(codeBlock, '键盘复制').trigger('click')

    source = codeBlock.find('textarea').element.value

    expect(source).toContain('Keyboard copy path')
    expect(source).toContain('Tab reaches the copy action after the scrollable code region.')

    const themeSwitcher = mount(LiveExampleRunner, {
      props: {
        preset: 'themeSwitcher'
      }
    })

    expect(themeSwitcher.text()).toContain('Theme Switcher scenario')
    expect(themeSwitcher.find('.live-example-runner__acceptance').text()).toContain('5 scenes')

    await findScenarioButton(themeSwitcher, '对比复核').trigger('click')

    source = themeSwitcher.find('textarea').element.value

    expect(source).toContain('Theme contrast needs review before publishing.')
    expect(source).toContain('tone="danger"')

    await findScenarioButton(themeSwitcher, '键盘主题').trigger('click')

    source = themeSwitcher.find('textarea').element.value

    expect(source).toContain('Keyboard theme switcher')
    expect(source).toContain('Each theme option is a pressed button in the keyboard path.')
  })

  it('promotes admin summary examples to workflow scenes', async () => {
    const pageHeader = mount(LiveExampleRunner, {
      props: {
        preset: 'pageHeader'
      }
    })

    expect(pageHeader.text()).toContain('Page Header scenario')
    expect(pageHeader.find('.live-example-runner__acceptance').text()).toContain('5 scenes')

    await findScenarioButton(pageHeader, '无状态').trigger('click')

    let source = pageHeader.find('textarea').element.value

    expect(source).toContain('No status badge')
    expect(source).not.toContain('status="Live"')

    await findScenarioButton(pageHeader, '键盘页头').trigger('click')

    source = pageHeader.find('textarea').element.value

    expect(source).toContain('Keyboard page header')
    expect(source).toContain('<template #actions>')

    const metricCard = mount(LiveExampleRunner, {
      props: {
        preset: 'metricCard'
      }
    })

    expect(metricCard.text()).toContain('Metric Card scenario')
    expect(metricCard.find('.live-example-runner__acceptance').text()).toContain('5 scenes')

    await findScenarioButton(metricCard, '风险指标').trigger('click')

    source = metricCard.find('textarea').element.value

    expect(source).toContain('tone="danger"')
    expect(source).toContain('Blocked examples need owner review.')

    await findScenarioButton(metricCard, '键盘指标').trigger('click')

    source = metricCard.find('textarea').element.value

    expect(source).toContain('Keyboard metric card')
    expect(source).toContain('The metric is read as static content; adjacent actions receive focus.')

    const filterTabs = mount(LiveExampleRunner, {
      props: {
        preset: 'filterTabs'
      }
    })

    expect(filterTabs.text()).toContain('Filter Tabs scenario')
    expect(filterTabs.find('.live-example-runner__acceptance').text()).toContain('5 scenes')

    await findScenarioButton(filterTabs, '空筛选').trigger('click')

    source = filterTabs.find('textarea').element.value

    expect(source).toContain(':items="[]"')
    expect(source).toContain('No filters available')

    await findScenarioButton(filterTabs, '键盘筛选').trigger('click')

    source = filterTabs.find('textarea').element.value

    expect(source).toContain('Keyboard status filters')
    expect(source).toContain('Arrow keys move through tabs while Home and End jump to edges.')
  })

  it('hydrates productivity workflow scenarios from shareable live-example hashes', async () => {
    const cases = [
      {
        preset: 'commandPalette',
        hash: '#live-example?scenario=keyboard-command-palette',
        expected: 'Down, Up, Enter and Escape keep the command palette usable'
      },
      {
        preset: 'codeBlock',
        hash: '#live-example?scenario=keyboard-code-block',
        expected: 'Tab reaches the copy action after the scrollable code region.'
      },
      {
        preset: 'themeSwitcher',
        hash: '#live-example?scenario=keyboard-theme-switcher',
        expected: 'Each theme option is a pressed button in the keyboard path.'
      },
      {
        preset: 'pageHeader',
        hash: '#live-example?scenario=keyboard-page-header',
        expected: 'Keyboard page header'
      },
      {
        preset: 'metricCard',
        hash: '#live-example?scenario=keyboard-metric-card',
        expected: 'The metric is read as static content'
      },
      {
        preset: 'filterTabs',
        hash: '#live-example?scenario=keyboard-filter-tabs',
        expected: 'Arrow keys move through tabs while Home and End jump to edges.'
      }
    ] as const

    for (const { preset, hash, expected } of cases) {
      window.location.hash = hash

      const wrapper = mount(LiveExampleRunner, {
        props: {
          preset
        }
      })

      await nextTick()
      await nextTick()

      expect(wrapper.find('textarea').element.value).toContain(expected)
    }

    window.location.hash = ''
  })

  it('generates guided examples for common primitive and form components', async () => {
    const avatar = mount(LiveExampleRunner, {
      props: {
        preset: 'avatar'
      }
    })

    expect(avatar.text()).toContain('Avatar scenario')

    const avatarSizeSelect = avatar.findAll('.live-example-runner__control select')[1]
    await avatarSizeSelect.setValue('lg')

    expect(avatar.find('textarea').element.value).toContain('<YAvatar')
    expect(avatar.find('textarea').element.value).toContain('size="lg"')

    const checkbox = mount(LiveExampleRunner, {
      props: {
        preset: 'checkbox'
      }
    })

    expect(checkbox.text()).toContain('Checkbox scenario')

    await setCheckbox(checkbox, '选中', false)

    expect(checkbox.find('textarea').element.value).toContain('<YCheckbox')
    expect(checkbox.find('textarea').element.value).toContain('model-value="false"')

    const rate = mount(LiveExampleRunner, {
      props: {
        preset: 'rate'
      }
    })

    expect(rate.text()).toContain('Rate scenario')
    expect(rate.find('.live-example-runner__cockpit').text()).toContain('7 scenes')

    const copywritingScenario = rate
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('评分文案'))
    const clearScenario = rate
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('可清空'))
    const keyboardScenario = rate
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('键盘评分'))

    expect(copywritingScenario, 'Missing rate copywriting scenario').toBeTruthy()
    expect(clearScenario, 'Missing rate clear scenario').toBeTruthy()
    expect(keyboardScenario, 'Missing rate keyboard scenario').toBeTruthy()

    await copywritingScenario?.trigger('click')

    expect(rate.find('textarea').element.value).toContain('<YRate')
    expect(rate.find('textarea').element.value).toContain(':texts="rateTexts"')
    expect(rate.find('textarea').element.value).toContain('size="large"')
    expect(rate.find('.live-example-runner__stage').text()).toContain('Great')

    await clearScenario?.trigger('click')

    expect(rate.find('textarea').element.value).toContain('clearable')
    expect(rate.find('textarea').element.value).toContain('Click the same score again')

    await keyboardScenario?.trigger('click')

    expect(rate.find('textarea').element.value).toContain('Keyboard satisfaction')
    expect(rate.find('textarea').element.value).toContain('Arrow keys adjust the rating')
    expect(rate.find('textarea').element.value).toContain('<YRate')

    const slider = mount(LiveExampleRunner, {
      props: {
        preset: 'slider'
      }
    })

    expect(slider.text()).toContain('Slider scenario')
    expect(slider.find('.live-example-runner__cockpit').text()).toContain('7 scenes')

    await slider.find('.live-example-runner__control select').setValue('error')

    expect(slider.find('textarea').element.value).toContain('<YSlider')
    expect(slider.find('textarea').element.value).toContain('Coverage threshold')
    expect(slider.find('textarea').element.value).toContain('error="Threshold must be at least 80 before release."')
  })

  it('generates guided examples for breadcrumb and time picker', async () => {
    const breadcrumb = mount(LiveExampleRunner, {
      props: {
        preset: 'breadcrumb'
      }
    })

    expect(breadcrumb.text()).toContain('Breadcrumb scenario')

    const separatorSelect = breadcrumb.findAll('.live-example-runner__control select')[1]
    await separatorSelect.setValue('>')

    expect(breadcrumb.find('textarea').element.value).toContain('<YBreadcrumb')
    expect(breadcrumb.find('textarea').element.value).toContain('separator="&gt;"')

    const timePicker = mount(LiveExampleRunner, {
      props: {
        preset: 'timePicker'
      }
    })

    expect(timePicker.text()).toContain('Time Picker scenario')

    const timeSelect = timePicker.find('.live-example-runner__control select')
    await timeSelect.setValue('disabled')

    expect(timePicker.find('textarea').element.value).toContain('<YTimePicker')
    expect(timePicker.find('textarea').element.value).toContain('Before 18:00')
    expect(timePicker.find('textarea').element.value).toContain(':minute-step="30"')
    expect(timePicker.find('textarea').element.value).toContain(':disabled-time="disableAfterWork"')
  })

  it('generates guided examples for feedback and result components', async () => {
    const popconfirm = mount(LiveExampleRunner, {
      props: {
        preset: 'popconfirm'
      }
    })

    expect(popconfirm.text()).toContain('Popconfirm scenario')

    await setCheckbox(popconfirm, '默认打开', false)

    expect(popconfirm.find('textarea').element.value).toContain('<YPopconfirm')
    expect(popconfirm.find('textarea').element.value).not.toContain('<YPopconfirm open')
    expect(popconfirm.find('textarea').element.value).toContain('confirm-text="Archive"')

    const result = mount(LiveExampleRunner, {
      props: {
        preset: 'result'
      }
    })

    expect(result.text()).toContain('Result scenario')

    const scenarioSelect = result.find('.live-example-runner__control select')
    await scenarioSelect.setValue('notFound')

    expect(result.find('textarea').element.value).toContain('<YResult')
    expect(result.find('textarea').element.value).toContain('status="404"')
    expect(result.find('textarea').element.value).toContain('<YButton')
  })

  it('promotes result examples to error, server, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'result'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const serverScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('服务异常'))

    expect(acceptancePanel.text()).toContain('5 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(serverScenario).toBeTruthy()

    await serverScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('server')
    expect(source).toContain('status="500"')
    expect(source).toContain('Server unavailable')
    expect(source).toContain('aria-label="Server error result"')
    expect(source).toContain('<YButton variant="primary">Retry</YButton>')
  })

  it('hydrates result keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-actions'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'result'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard complete')
    expect(source).toContain('Tab moves through the primary and secondary result actions.')
    expect(source).toContain('<YButton variant="secondary">Back to queue</YButton>')

    window.location.hash = ''
  })

  it('promotes empty examples to search, permission, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'empty'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const permissionScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('权限空态'))

    expect(acceptancePanel.text()).toContain('5 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(permissionScenario).toBeTruthy()

    await permissionScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('permission')
    expect(source).toContain('No permission')
    expect(source).toContain('Ask an admin to grant access before you can manage this package.')
    expect(source).toContain('<YButton variant="secondary">Request access</YButton>')
  })

  it('simulates empty create, clear filters and request access workflow actions', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'empty'
      }
    })
    await wrapper.vm.$nextTick()

    await wrapper.get('[data-testid="empty-simulate-create"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"emptyAction": "create"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"emptyLabel": "Create component"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Empty@action')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Creation panel opened')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('search')
    await wrapper.get('[data-testid="empty-simulate-clear"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"emptyAction": "clearFilters"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"emptyLabel": "Clear filters"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Empty@clearFilters')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Filters cleared')

    await wrapper.findAll('.live-example-runner__control select')[0].setValue('permission')
    await wrapper.get('[data-testid="empty-simulate-request-access"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"emptyAction": "requestAccess"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"emptyLabel": "Request access"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Empty@requestAccess')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Access request sent')
  })

  it('hydrates empty keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-empty-action'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'empty'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('No saved view selected')
    expect(source).toContain('Tab reaches the primary empty-state action first.')
    expect(source).toContain('<YButton variant="primary">Create saved view</YButton>')

    window.location.hash = ''
  })

  it('promotes skeleton examples to loading, list, responsive and screen-reader workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'skeleton'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const listScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('列表加载'))

    expect(acceptancePanel.text()).toContain('5 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="loading-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(listScenario).toBeTruthy()

    await listScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('list')
    expect(source).toContain('Loading release queue')
    expect(source).toContain('v-for="item in 3"')
    expect(source).toContain('<YSkeleton variant="circle"')
    expect(source).toContain('<YSkeleton :rows="2"')
  })

  it('simulates skeleton loading, resolved, timeout and retry workflow actions', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'skeleton'
      }
    })
    await wrapper.vm.$nextTick()

    await wrapper.get('[data-testid="skeleton-simulate-loading"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"skeletonPhase": "loading"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"skeletonLabel": "Loading component detail"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Skeleton@loading')

    await wrapper.get('[data-testid="skeleton-simulate-resolved"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"skeletonPhase": "resolved"')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Loaded component detail')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Skeleton@resolved')

    await wrapper.get('[data-testid="skeleton-simulate-timeout"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"skeletonPhase": "timeout"')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Loading timed out')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Skeleton@timeout')

    await wrapper.get('[data-testid="skeleton-simulate-retry"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"skeletonPhase": "retrying"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"skeletonAttempt": 2')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Skeleton@retry')
  })

  it('hydrates skeleton screen-reader scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=screen-reader-status'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'skeleton'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('screenReader')
    expect(source).toContain('Loading account summary')
    expect(source).toContain('role="status"')
    expect(source).toContain('Screen readers hear one useful status instead of every decorative line.')

    window.location.hash = ''
  })

  it('promotes image examples to loading, error, controlled, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'image'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const errorScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('失败兜底'))

    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="loading-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(errorScenario).toBeTruthy()

    await errorScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('error')
    expect(source).toContain('<YImage')
    expect(source).toContain('src="/missing-yok-image.png"')
    expect(source).toContain('<template #error>')
    expect(source).toContain('Image unavailable. Replace the asset or show fallback copy.')
  })

  it('opens the rendered image preview from the live example canvas', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'image'
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    const previewButton = wrapper.find('.live-example-runner__preview .yok-image__button')

    expect(previewButton.exists()).toBe(true)

    await previewButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="dialog"][aria-modal="true"]').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('preview-open')

    await wrapper.find('[data-image-preview-close]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="dialog"][aria-modal="true"]').exists()).toBe(false)
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('preview-close')

    await wrapper.find('.live-example-runner__preview-action').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="dialog"][aria-modal="true"]').exists()).toBe(true)
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('preview-open')

    wrapper.unmount()
  })

  it('hydrates image keyboard and controlled preview scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-image-preview'

    const keyboardWrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'image'
      }
    })
    await keyboardWrapper.vm.$nextTick()

    expect(keyboardWrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(keyboardWrapper.find('textarea').element.value).toContain('Escape closes the preview dialog.')
    expect(keyboardWrapper.find('textarea').element.value).toContain('<YButton variant="secondary">Next focus target</YButton>')

    window.location.hash = '#live-example?scenario=image-controlled-preview'

    const controlledWrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'image'
      }
    })
    await controlledWrapper.vm.$nextTick()

    const controlledSource = controlledWrapper.find('textarea').element.value

    expect(controlledWrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('controlled')
    expect(controlledSource).toContain('Open preview from external state')
    expect(controlledSource).toContain('initial-index="0"')
    expect(controlledSource).toContain('previewOpen in application code')
    const controlledError = controlledWrapper.find('.live-example-runner__error')

    expect(controlledError.exists(), controlledError.exists() ? controlledError.text() : '').toBe(false)

    window.location.hash = ''
  })

  it('promotes alert examples to validation, announcement, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'alert'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const validationScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('表单校验'))

    expect(acceptancePanel.text()).toContain('5 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(validationScenario).toBeTruthy()

    await validationScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('validation')
    expect(source).toContain('tone="danger"')
    expect(source).toContain('variant="solid"')
    expect(source).toContain('role="alert"')
    expect(source).toContain('close-label="Dismiss validation summary"')
    expect(source).toContain('<template #action>')
    expect(source).toContain('Review fields')
    expect(source).toContain('Fix 3 fields before publishing.')
  })

  it('simulates alert dismiss, restore, escalate and action workflow paths', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'alert'
      }
    })
    await wrapper.vm.$nextTick()

    await wrapper.get('[data-testid="alert-simulate-dismiss"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"alertVisible": false')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"alertAction": "dismiss"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Alert@close')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Alert dismissed')

    await wrapper.get('[data-testid="alert-simulate-restore"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"alertVisible": true')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"alertAction": "restore"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Alert@restore')

    await wrapper.get('[data-testid="alert-simulate-escalate"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"alertTone": "danger"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"alertRole": "alert"')
    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Release blocked')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Alert@escalate')

    await wrapper.get('[data-testid="alert-simulate-action"]').trigger('click')

    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"alertAction": "openAction"')
    expect(wrapper.find('.live-example-runner__state-panel').text()).toContain('"alertActionLabel": "Review fields"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Alert@action')
  })

  it('hydrates alert keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-alert-close'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'alert'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard reachable alert')
    expect(source).toContain('Tab reaches the close button; Enter or Space dismisses the alert.')
    expect(source).toContain('close-label="Dismiss keyboard alert"')

    window.location.hash = ''
  })

  it('promotes card examples to action, grid, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'card'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const actionScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('操作卡片'))

    expect(acceptancePanel.text()).toContain('6 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(actionScenario).toBeTruthy()

    await actionScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('action')
    expect(source).toContain('Release candidate')
    expect(source).toContain('<template #footer>')
    expect(source).toContain('<YButton variant="primary">Open review</YButton>')
  })

  it('hydrates card keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-card-action'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'card'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard card action')
    expect(source).toContain('Tab reaches the footer actions instead of making the whole card a button.')
    expect(source).toContain('<YButton variant="secondary">Preview docs</YButton>')

    window.location.hash = ''
  })

  it('promotes collapse examples to accordion, disabled, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'collapse'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const disabledScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('禁用面板'))

    expect(acceptancePanel.text()).toContain('5 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(disabledScenario).toBeTruthy()

    await disabledScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('disabled')
    expect(source).toContain('model-value="usage"')
    expect(source).toContain('Locked by release owner')
    expect(source).toContain('Disabled panels stay visible but cannot be opened.')
  })

  it('keeps collapse live previews interactive after toggling panels', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'collapse'
      }
    })

    await flushPromises()
    await nextTick()

    const preview = wrapper.find('.live-example-runner__preview')
    const findTrigger = (label: string) => preview
      .findAll('.yok-collapse__trigger')
      .find((button) => button.text().includes(label))
    const settingsTrigger = findTrigger('Settings')
    const usageTrigger = findTrigger('Usage')

    expect(settingsTrigger, 'Missing Settings collapse trigger').toBeTruthy()
    expect(usageTrigger, 'Missing Usage collapse trigger').toBeTruthy()
    expect(settingsTrigger?.attributes('aria-expanded')).toBe('false')
    expect(usageTrigger?.attributes('aria-expanded')).toBe('true')

    await settingsTrigger!.trigger('click')
    await nextTick()

    expect(findTrigger('Settings')?.attributes('aria-expanded')).toBe('true')

    await findTrigger('Usage')!.trigger('click')
    await nextTick()

    expect(findTrigger('Usage')?.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('update:modelValue')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('change')
  })

  it('simulates collapse open all close all accordion and locked workflow paths', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'collapse'
      }
    })

    await flushPromises()
    await nextTick()

    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"usage"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"api"')

    await wrapper.get('[data-testid="collapse-simulate-open-all"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"openPanels"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"settings"')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"keyboard"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Collapse@openAll')

    await wrapper.get('[data-testid="collapse-simulate-close-all"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview').text()).toContain('All panels closed')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "closed"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Collapse@closeAll')

    await wrapper.get('[data-testid="collapse-simulate-accordion"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Accordion mode active')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"openPanels": [\n    "settings"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Collapse@accordion')

    await wrapper.get('[data-testid="collapse-simulate-locked"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__preview').text()).toContain('Locked panel explained')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "locked"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Collapse@locked')
  })

  it('hydrates collapse keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-collapse'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'collapse'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard disclosure path')
    expect(source).toContain('Tab reaches each trigger; Enter or Space toggles the focused panel.')
    expect(source).toContain('model-value="keyboard"')

    window.location.hash = ''
  })

  it('promotes descriptions examples to review, vertical, long field, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'descriptions'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const reviewScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('审核侧栏'))

    expect(acceptancePanel.text()).toContain('7 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(reviewScenario).toBeTruthy()

    await reviewScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('review')
    expect(source).toContain('Release review profile')
    expect(source).toContain('<template #extra>')
    expect(source).toContain('<YTag tone="warning">Needs review</YTag>')
  })

  it('simulates descriptions detail loaded review empty and long field workflow paths', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'descriptions'
      }
    })

    await flushPromises()
    await nextTick()

    await wrapper.get('[data-testid="descriptions-simulate-loaded"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__descriptions-preview').text()).toContain('Component profile loaded')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "loaded"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Descriptions@loaded')

    await wrapper.get('[data-testid="descriptions-simulate-review"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__descriptions-preview').text()).toContain('Release review profile')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"status": "review"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Descriptions@review')

    await wrapper.get('[data-testid="descriptions-simulate-empty"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__descriptions-preview').text()).toContain('No component metadata available')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"fieldCount": 0')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Descriptions@empty')

    await wrapper.get('[data-testid="descriptions-simulate-long-field"]').trigger('click')
    await nextTick()

    expect(wrapper.find('.live-example-runner__descriptions-preview').text()).toContain('Decision record ready')
    expect(wrapper.find('.live-example-runner__state-panel code').text()).toContain('"layout": "horizontal"')
    expect(wrapper.find('.live-example-runner__event-log').text()).toContain('Descriptions@longField')
  })

  it('hydrates descriptions keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-descriptions'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'descriptions'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard readable metadata')
    expect(source).toContain('aria-label="Keyboard readable component metadata"')
    expect(source).toContain('Use semantic dl, dt and dd so screen readers keep labels and values paired.')

    window.location.hash = ''
  })

  it('promotes message examples to danger, persistent, mobile and keyboard workflow scenes', async () => {
    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'message'
      }
    })

    const acceptancePanel = wrapper.find('.live-example-runner__acceptance')
    const dangerScenario = wrapper
      .findAll('.live-example-runner__scenario-grid button')
      .find((button) => button.text().includes('错误警报'))

    expect(acceptancePanel.text()).toContain('5 scenes')
    expect(acceptancePanel.find('[data-check-key="responsive"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="error-state"]').attributes('data-passed')).toBe('true')
    expect(acceptancePanel.find('[data-check-key="keyboard-path"]').attributes('data-passed')).toBe('true')
    expect(dangerScenario).toBeTruthy()

    await dangerScenario?.trigger('click')

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('danger')
    expect(source).toContain('tone="danger"')
    expect(source).toContain('role="alert"')
    expect(source).toContain('closable')
    expect(source).toContain('Release failed')
    expect(source).toContain('Close failure message')
  })

  it('hydrates message keyboard scenarios from shareable live-example hashes', async () => {
    window.location.hash = '#live-example?scenario=keyboard-close'

    const wrapper = mount(LiveExampleRunner, {
      props: {
        preset: 'message'
      }
    })
    await wrapper.vm.$nextTick()

    const source = wrapper.find('textarea').element.value

    expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
    expect(source).toContain('Keyboard reachable')
    expect(source).toContain('Tab reaches the close button; Enter dismisses the message.')
    expect(source).toContain('close-label="Dismiss keyboard message"')

    window.location.hash = ''
  })

  it('promotes remaining admin workflow helpers to scenario-rich live examples', async () => {
    const approvalCommentBox = mount(LiveExampleRunner, {
      props: {
        preset: 'approvalCommentBox'
      }
    })

    expect(approvalCommentBox.text()).toContain('Approval Comment Box scenario')

    await approvalCommentBox.findAll('.live-example-runner__control select')[0].setValue('required')
    await nextTick()

    expect(approvalCommentBox.find('textarea').element.value).toContain('<YApprovalCommentBox')
    expect(approvalCommentBox.find('textarea').element.value).toContain('const approvalComment = ref')
    expect(approvalCommentBox.find('textarea').element.value).toContain('Submitting an empty required comment emits invalid')

    await approvalCommentBox.findAll('.live-example-runner__control select')[0].setValue('keyboard')
    await nextTick()

    expect(approvalCommentBox.find('textarea').element.value).toContain('Keyboard review comment')
    expect(approvalCommentBox.find('textarea').element.value).toContain('Tab reaches decision buttons, textarea, suggestions, submit and cancel.')

    const bulkActionBar = mount(LiveExampleRunner, {
      props: {
        preset: 'bulkActionBar'
      }
    })

    expect(bulkActionBar.text()).toContain('Bulk Action Bar scenario')

    await bulkActionBar.findAll('.live-example-runner__control select')[0].setValue('empty')
    await nextTick()

    expect(bulkActionBar.find('textarea').element.value).toContain('const bulkSelectedRowKeys = ref([])')
    expect(bulkActionBar.find('textarea').element.value).toContain('No rows selected')

    await bulkActionBar.findAll('.live-example-runner__control select')[0].setValue('keyboard')
    await nextTick()

    expect(bulkActionBar.find('textarea').element.value).toContain('Keyboard bulk action bar')
    expect(bulkActionBar.find('textarea').element.value).toContain('Tab reaches Publish, Assign owner, Archive and Clear selection.')

    await bulkActionBar.findAll('.live-example-runner__control select')[0].setValue('menu')
    await nextTick()

    expect(bulkActionBar.find('textarea').element.value).toContain('<YBulkActionMenu')
    expect(bulkActionBar.find('textarea').element.value).toContain('requiresConfirm')
    expect(bulkActionBar.find('textarea').element.value).toContain('Grouped menu actions include a second click for dangerous operations.')

    const dataToolbar = mount(LiveExampleRunner, {
      props: {
        preset: 'dataToolbar'
      }
    })

    expect(dataToolbar.text()).toContain('Data Toolbar scenario')

    await findScenarioButton(dataToolbar, '无操作').trigger('click')

    expect(dataToolbar.find('textarea').element.value).not.toContain('<YButton')
    expect(dataToolbar.find('textarea').element.value).toContain('No toolbar actions')

    await findScenarioButton(dataToolbar, '键盘工具栏').trigger('click')

    expect(dataToolbar.find('textarea').element.value).toContain('Keyboard data toolbar')
    expect(dataToolbar.find('textarea').element.value).toContain('<YButton variant="primary">Create component</YButton>')

    const savedViews = mount(LiveExampleRunner, {
      props: {
        preset: 'savedViews'
      }
    })

    expect(savedViews.text()).toContain('Saved Views scenario')

    await findScenarioButton(savedViews, '空视图').trigger('click')

    expect(savedViews.find('textarea').element.value).toContain(':items="[]"')
    expect(savedViews.find('textarea').element.value).toContain('const savedViewItems = []')
    expect(savedViews.find('textarea').element.value).toContain('No saved views yet')

    await findScenarioButton(savedViews, '键盘视图').trigger('click')

    expect(savedViews.find('textarea').element.value).toContain('Keyboard saved views')
    expect(savedViews.find('textarea').element.value).toContain('Save, create and manage controls stay reachable after view buttons.')

    await findScenarioButton(savedViews, '管理视图').trigger('click')

    expect(savedViews.find('textarea').element.value).toContain('<YSavedViewManager')
    expect(savedViews.find('textarea').element.value).toContain('v-model:items="savedViewItems"')
    expect(savedViews.find('textarea').element.value).toContain("const defaultSavedView = ref('live')")
    expect(savedViews.find('textarea').element.value).toContain('Rename, pin, duplicate, delete and choose a default table view.')
  })

  it('promotes search, timeline and review helpers to empty, loading and keyboard live examples', async () => {
    const searchPanel = mount(LiveExampleRunner, {
      props: {
        preset: 'searchPanel'
      }
    })

    expect(searchPanel.text()).toContain('Search Panel scenario')

    await findScenarioButton(searchPanel, '空筛选').trigger('click')

    expect(searchPanel.find('textarea').element.value).toContain('const searchPanelModel = ref({})')
    expect(searchPanel.find('textarea').element.value).toContain(':fields="searchPanelFields"')
    expect(searchPanel.find('textarea').element.value).toContain('No filters applied')

    await findScenarioButton(searchPanel, '键盘筛选').trigger('click')

    expect(searchPanel.find('textarea').element.value).toContain('Keyboard search panel')
    expect(searchPanel.find('textarea').element.value).toContain('Apply filters and Clear filters stay after the fields in tab order.')

    const statusTimeline = mount(LiveExampleRunner, {
      props: {
        preset: 'statusTimeline'
      }
    })

    expect(statusTimeline.text()).toContain('Status Timeline scenario')

    await findScenarioButton(statusTimeline, '空时间线').trigger('click')

    expect(statusTimeline.find('textarea').element.value).toContain(':items="[]"')
    expect(statusTimeline.find('textarea').element.value).toContain('No status events yet')

    await findScenarioButton(statusTimeline, '键盘时间线').trigger('click')

    expect(statusTimeline.find('textarea').element.value).toContain('Keyboard status timeline')
    expect(statusTimeline.find('textarea').element.value).toContain('Timeline remains readable while adjacent review actions receive focus.')

    const reviewWorkflow = mount(LiveExampleRunner, {
      props: {
        preset: 'reviewWorkflow'
      }
    })

    expect(reviewWorkflow.text()).toContain('Review Workflow scenario')

    await findScenarioButton(reviewWorkflow, '加载审核').trigger('click')

    expect(reviewWorkflow.find('textarea').element.value).toContain('loading')
    expect(reviewWorkflow.find('textarea').element.value).toContain('Saving review decision')

    await findScenarioButton(reviewWorkflow, '键盘审核').trigger('click')

    expect(reviewWorkflow.find('textarea').element.value).toContain('Keyboard review workflow')
    expect(reviewWorkflow.find('textarea').element.value).toContain('Approve, request changes and reject stay in a predictable focus order.')
  })

  it('promotes brand and theme helpers to scenario-rich live examples', async () => {
    const brandHero = mount(LiveExampleRunner, {
      props: {
        preset: 'brandHero'
      }
    })

    expect(brandHero.text()).toContain('Brand Hero scenario')

    await findScenarioButton(brandHero, '风险主张').trigger('click')

    expect(brandHero.find('textarea').element.value).toContain('Needs clearer value proposition before launch.')
    expect(brandHero.find('textarea').element.value).toContain('primary-text="Review copy"')

    const featureGrid = mount(LiveExampleRunner, {
      props: {
        preset: 'featureGrid'
      }
    })

    expect(featureGrid.text()).toContain('Feature Grid scenario')

    await findScenarioButton(featureGrid, '空特性').trigger('click')

    expect(featureGrid.find('textarea').element.value).toContain(':features="[]"')
    expect(featureGrid.find('textarea').element.value).toContain('No features selected')

    const logoCloud = mount(LiveExampleRunner, {
      props: {
        preset: 'logoCloud'
      }
    })

    expect(logoCloud.text()).toContain('Logo Cloud scenario')

    await findScenarioButton(logoCloud, '空客户墙').trigger('click')

    expect(logoCloud.find('textarea').element.value).toContain(':logos="[]"')
    expect(logoCloud.find('textarea').element.value).toContain('No logos available')

    const profileCard = mount(LiveExampleRunner, {
      props: {
        preset: 'profileCard'
      }
    })

    expect(profileCard.text()).toContain('Profile Card scenario')

    await findScenarioButton(profileCard, '无标签').trigger('click')

    expect(profileCard.find('textarea').element.value).toContain('tags=""')
    expect(profileCard.find('textarea').element.value).toContain('No profile tags')

    const themeProvider = mount(LiveExampleRunner, {
      props: {
        preset: 'themeProvider'
      }
    })

    expect(themeProvider.text()).toContain('Theme Provider scenario')

    await findScenarioButton(themeProvider, '复核主题').trigger('click')

    expect(themeProvider.find('textarea').element.value).toContain('theme="yok-clean"')
    expect(themeProvider.find('textarea').element.value).toContain('Local theme contrast needs review.')

    await findScenarioButton(themeProvider, '键盘主题').trigger('click')

    expect(themeProvider.find('textarea').element.value).toContain('Keyboard themed region')
  })

  it('hydrates remaining keyboard scenarios from shareable live-example hashes', async () => {
    const hashCases = [
      ['bulkActionBar', 'keyboard-bulk-action-bar', 'Keyboard bulk action bar'],
      ['dataToolbar', 'keyboard-data-toolbar', 'Keyboard data toolbar'],
      ['brandHero', 'keyboard-brand-hero', 'Keyboard hero actions'],
      ['featureGrid', 'keyboard-feature-grid', 'Keyboard feature grid'],
      ['logoCloud', 'keyboard-logo-cloud', 'Logo cloud stays static while nearby proof links receive focus.'],
      ['profileCard', 'keyboard-profile-card', 'Keyboard profile card'],
      ['reviewWorkflow', 'keyboard-review-workflow', 'Keyboard review workflow'],
      ['savedViews', 'keyboard-saved-views', 'Keyboard saved views'],
      ['searchPanel', 'keyboard-search-panel', 'Keyboard search panel'],
      ['statusTimeline', 'keyboard-status-timeline', 'Keyboard status timeline'],
      ['themeProvider', 'keyboard-theme-provider', 'Keyboard themed region']
    ] as const

    for (const [preset, scenario, expectedSource] of hashCases) {
      window.location.hash = `#live-example?scenario=${scenario}`

      const wrapper = mount(LiveExampleRunner, {
        props: {
          preset
        }
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.findAll('.live-example-runner__control select')[0].element.value).toBe('keyboard')
      expect(wrapper.find('textarea').element.value).toContain(expectedSource)

      wrapper.unmount()
      window.location.hash = ''
    }
  })

  it('generates guided examples for data display and utility components', async () => {
    const statistic = mount(LiveExampleRunner, {
      props: {
        preset: 'statistic'
      }
    })

    expect(statistic.text()).toContain('Statistic scenario')

    await statistic.findAll('.live-example-runner__control select')[0].setValue('loading')

    expect(statistic.find('textarea').element.value).toContain('<YStatistic')
    expect(statistic.find('textarea').element.value).toContain('loading')

    const timeline = mount(LiveExampleRunner, {
      props: {
        preset: 'timeline'
      }
    })

    expect(timeline.text()).toContain('Timeline scenario')

    await timeline.findAll('.live-example-runner__control select')[0].setValue('reverse')

    expect(timeline.find('textarea').element.value).toContain('<YTimeline')
    expect(timeline.find('textarea').element.value).toContain('reverse')

    const virtualList = mount(LiveExampleRunner, {
      props: {
        preset: 'virtualList'
      }
    })

    expect(virtualList.text()).toContain('Virtual List scenario')

    const heightSlider = virtualList.find('.live-example-runner__control input[type="range"]')
    await heightSlider.setValue(300)

    expect(virtualList.find('textarea').element.value).toContain('<YVirtualList')
    expect(virtualList.find('textarea').element.value).toContain(':height="300"')

    const watermark = mount(LiveExampleRunner, {
      props: {
        preset: 'watermark'
      }
    })

    expect(watermark.text()).toContain('Watermark scenario')

    const contentInput = watermark.find('.live-example-runner__control input[type="text"]')
    await contentInput.setValue('Draft Only')

    expect(watermark.find('textarea').element.value).toContain('<YWatermark')
    expect(watermark.find('textarea').element.value).toContain('content="Draft Only"')
    expect(watermark.find('textarea').element.value).toContain(':font-size="15"')
  })

  it('generates guided examples for remaining core source-first components', async () => {
    const divider = mount(LiveExampleRunner, {
      props: {
        preset: 'divider'
      }
    })

    expect(divider.text()).toContain('Divider scenario')

    const alignSelect = divider.findAll('.live-example-runner__control select')[1]
    await alignSelect.setValue('end')

    expect(divider.find('textarea').element.value).toContain('<YDivider')
    expect(divider.find('textarea').element.value).toContain('align="end"')

    const descriptions = mount(LiveExampleRunner, {
      props: {
        preset: 'descriptions'
      }
    })

    expect(descriptions.text()).toContain('Descriptions scenario')

    const descriptionsScenario = descriptions.find('.live-example-runner__control select')
    await descriptionsScenario.setValue('vertical')

    expect(descriptions.find('textarea').element.value).toContain('<YDescriptions')
    expect(descriptions.find('textarea').element.value).toContain('layout="vertical"')

    const list = mount(LiveExampleRunner, {
      props: {
        preset: 'list'
      }
    })

    expect(list.text()).toContain('List scenario')

    await list.findAll('.live-example-runner__control select')[0].setValue('loading')

    expect(list.find('textarea').element.value).toContain('<YList')
    expect(list.find('textarea').element.value).toContain('loading')

    const message = mount(LiveExampleRunner, {
      props: {
        preset: 'message'
      }
    })

    expect(message.text()).toContain('Message scenario')

    await setCheckbox(message, '可关闭', false)

    expect(message.find('textarea').element.value).toContain('<YMessage')
    expect(message.find('textarea').element.value).not.toContain('closable')
  })

  it('generates guided examples for form helpers and admin workflow components', async () => {
    const formItem = mount(LiveExampleRunner, {
      props: {
        preset: 'formItem'
      }
    })

    expect(formItem.text()).toContain('Form Item scenario')

    const valueInput = formItem.findAll('.live-example-runner__control input[type="text"]')[4]
    await valueInput.setValue('YokInput')

    expect(formItem.find('textarea').element.value).toContain('<YFormItem')
    expect(formItem.find('textarea').element.value).toContain('model-value="YokInput"')

    const formSummary = mount(LiveExampleRunner, {
      props: {
        preset: 'formSummary'
      }
    })

    expect(formSummary.text()).toContain('Form Summary scenario')

    await setCheckbox(formSummary, '点击聚焦字段', false)

    expect(formSummary.find('textarea').element.value).toContain('<YFormSummary')
    expect(formSummary.find('textarea').element.value).toContain(':focus-on-click="false"')

    const statusTimeline = mount(LiveExampleRunner, {
      props: {
        preset: 'statusTimeline'
      }
    })

    expect(statusTimeline.text()).toContain('Status Timeline scenario')

    await statusTimeline.findAll('.live-example-runner__control select')[0].setValue('reverse')

    expect(statusTimeline.find('textarea').element.value).toContain('<YStatusTimeline')
    expect(statusTimeline.find('textarea').element.value).toContain('reverse')

    const reviewWorkflow = mount(LiveExampleRunner, {
      props: {
        preset: 'reviewWorkflow'
      }
    })

    expect(reviewWorkflow.text()).toContain('Review Workflow scenario')

    await setCheckbox(reviewWorkflow, '禁用', true)

    expect(reviewWorkflow.find('textarea').element.value).toContain('<YReviewWorkflow')
    expect(reviewWorkflow.find('textarea').element.value).toContain('disabled')

    const crudLayout = mount(LiveExampleRunner, {
      props: {
        preset: 'crudLayout'
      }
    })

    expect(crudLayout.text()).toContain('CRUD Layout scenario')

    await setCheckbox(crudLayout, '吸顶头部', true)
    await crudLayout.findAll('.live-example-runner__control select')[0].setValue('review')

    expect(crudLayout.find('textarea').element.value).toContain('<YCrudLayout')
    expect(crudLayout.find('textarea').element.value).toContain('sticky-header')
    expect(crudLayout.find('textarea').element.value).toContain('Pending review rows')

    await crudLayout.findAll('.live-example-runner__control select')[0].setValue('keyboard')

    expect(crudLayout.find('textarea').element.value).toContain('Keyboard CRUD layout')
    expect(crudLayout.find('textarea').element.value).toContain('Tab reaches filters, table settings and row actions in order')

    const backtop = mount(LiveExampleRunner, {
      props: {
        preset: 'backtop'
      }
    })

    expect(backtop.text()).toContain('Backtop scenario')

    const rightSlider = backtop.findAll('.live-example-runner__control input[type="range"]')[1]
    await rightSlider.setValue(48)

    expect(backtop.find('textarea').element.value).toContain('<YBacktop')
    expect(backtop.find('textarea').element.value).toContain(':right="48"')
  })
})
