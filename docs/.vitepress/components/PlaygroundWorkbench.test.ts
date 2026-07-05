import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { playgroundComponents } from '../data/playgroundExamples'
import PlaygroundWorkbench from './PlaygroundWorkbench.vue'

const componentStubs = {
  YButton: { template: '<button><slot /></button>' },
  YIcon: { template: '<span><slot /></span>' },
  YImage: { props: ['src', 'alt'], template: '<img :src="src" :alt="alt" />' },
  YSegmented: { template: '<section />' },
  YCalendar: { template: '<section />' },
  YInput: { props: ['modelValue', 'label', 'disabled'], template: '<input />' },
  YInputOtp: { props: ['modelValue', 'label', 'disabled', 'length'], template: '<div />' },
  YInputTag: { props: ['modelValue', 'label', 'disabled', 'max'], template: '<div />' },
  YAutocomplete: { props: ['modelValue', 'label', 'options', 'disabled'], template: '<input />' },
  YMention: { props: ['modelValue', 'label', 'options', 'disabled', 'prefix', 'clearable'], template: '<textarea />' },
  YSelect: { props: ['modelValue', 'label', 'options', 'disabled'], template: '<div />' },
  YVirtualizedSelect: { props: ['modelValue', 'label', 'options', 'disabled'], template: '<div />' },
  YRow: { template: '<div><slot /></div>' },
  YCol: { template: '<div><slot /></div>' },
  YFlex: { template: '<div><slot /></div>' },
  YInputNumber: { template: '<input />' },
  YSlider: { template: '<input />' },
  YRate: { template: '<div />' },
  YCheckbox: { template: '<input type="checkbox" />' },
  YRadioGroup: { template: '<div />' },
  YSwitch: { template: '<button />' },
  YTabs: { template: '<div />' },
  YSteps: { template: '<div />' },
  YTour: { template: '<section><slot /></section>' },
  YCollapse: { template: '<div />' },
  YTooltip: { template: '<span><slot /></span>' },
  YPopover: { template: '<span><slot /><slot name="content" /></span>' },
  YDropdown: { template: '<span><slot /></span>' },
  YPopconfirm: { template: '<span><slot /></span>' },
  YModal: { template: '<section><slot /></section>' },
  YDrawer: { template: '<aside><slot /></aside>' },
  YPagination: { template: '<nav />' },
  YTimeline: { template: '<ol />' },
  YCard: { template: '<section><slot /><slot name="footer" /></section>' },
  YEmpty: { template: '<section><slot /></section>' },
  YSkeleton: { template: '<section />' },
  YLoading: { template: '<section><slot /></section>' },
  YMessage: { template: '<section><slot /></section>' },
  YMessageBox: { template: '<section><slot /></section>' },
  YQRCode: { template: '<figure><slot /></figure>' },
  YFloatButton: { template: '<button><slot /></button>' },
  YFloatButtonGroup: { template: '<section><slot /></section>' },
  YNotification: { template: '<section><slot /></section>' },
  YResult: { template: '<section><slot /></section>' },
  YTextarea: { template: '<textarea />' },
  YForm: { template: '<form><slot /></form>' },
  YFormItem: { template: '<label><slot :label-for="`stub-field`" :message-id="`stub-message`" /></label>' },
  YFormSummary: { template: '<section />' },
  YDivider: { template: '<hr />' },
  YLink: { template: '<a><slot /></a>' },
  YText: { template: '<span><slot /></span>' },
  YUpload: { template: '<section />' },
  YTransfer: { template: '<section />' },
  YConfigProvider: { template: '<section><slot /></section>' },
  YDatePicker: { template: '<input />' },
  YDatePickerPanel: { template: '<section />' },
  YDateRangePicker: { template: '<input />' },
  YDateTimePicker: { template: '<input />' },
  YTimePicker: { template: '<input />' },
  YTimeSelect: { template: '<input />' },
  YCascader: { template: '<div />' },
  YColorPicker: { template: '<input />' },
  YColorPickerPanel: { template: '<section />' },
  YCarousel: { props: ['items'], template: '<section class="yok-carousel">{{ items?.[0]?.title }}</section>' },
  YTable: { template: '<div role="table" />' },
  YDataTable: { template: '<div role="table" />' },
  YDataView: { template: '<section />' },
  YResourcePage: { template: '<main />' },
  YCrudLayout: { template: '<section><slot name="actions" /><slot name="search" /><slot name="toolbar" /><slot name="table" /><slot name="aside" /></section>' },
  YApprovalCommentBox: { template: '<section />' },
  YBulkActionBar: { template: '<section />' },
  YBulkActionMenu: { template: '<section />' },
  YDataToolbar: { template: '<section><slot /></section>' },
  YSavedViews: { template: '<section />' },
  YSavedViewManager: { template: '<section />' },
  YSearchPanel: { template: '<form />' },
  YFilterTabs: { template: '<section />' },
  YStatusTimeline: { template: '<section />' },
  YReviewWorkflow: { template: '<section />' },
  YFieldArray: { template: '<section />' },
  YSchemaForm: { template: '<form />' },
  YSearchForm: { template: '<form />' },
  YList: { template: '<section />' },
  YLayout: { template: '<section><slot /></section>' },
  YHeader: { template: '<header><slot /></header>' },
  YAside: { template: '<aside><slot /></aside>' },
  YMain: { template: '<main><slot /></main>' },
  YFooter: { template: '<footer><slot /></footer>' },
  YStatistic: { template: '<section />' },
  YDescriptions: { template: '<section />' },
  YVirtualList: { template: '<section><slot name="item" :item="{ label: `Button` }" :index="0" /></section>' },
  YTree: { template: '<section />' },
  YTreeSelect: { template: '<section />' },
  YWatermark: { template: '<section><slot /></section>' },
  YBreadcrumb: { template: '<nav />' },
  YMenu: { template: '<nav />' },
  YBacktop: { template: '<button />' },
  YAffix: { template: '<section><slot /></section>' },
  YAnchor: { template: '<nav />' },
  YScrollbar: { template: '<section><slot /></section>' },
  YSpace: { template: '<span><slot /><slot name="separator" /></span>' },
  YSplitter: { template: '<section><slot name="navigation" /><slot name="preview" /></section>' },
  YCommandPalette: { template: '<section />' },
  YCodeBlock: { template: '<pre />' },
  YThemeSwitcher: { template: '<section />' },
  YPageHeader: { template: '<header><slot name="actions" /></header>' },
  YMetricCard: { template: '<article />' },
  YBrandHero: { template: '<section />' },
  YFeatureGrid: { template: '<section />' },
  YProfileCard: { template: '<article />' },
  YLogoCloud: { template: '<section />' },
  YThemeProvider: { template: '<section><slot /></section>' },
  YAvatar: { template: '<span />' },
  YAvatarGroup: { template: '<span><slot /></span>' },
  YTag: { template: '<span><slot /></span>' },
  YCheckTag: { props: ['checked', 'disabled', 'tone'], template: '<button><slot /></button>' },
  YBadge: { template: '<span><slot /></span>' },
  YAlert: { template: '<section><slot /></section>' },
  YProgress: { template: '<progress />' }
}

describe('PlaygroundWorkbench', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/playground/')
    window.localStorage.clear()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn()
      }
    })
  })

  it('hydrates imported source and component context from the route query', async () => {
    const source = [
      '<script setup lang="ts">',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&theme=yok-candy&source=${encodeURIComponent(source)}`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.attributes('data-theme')).toBe('yok-candy')
    expect(wrapper.get('.playground-workbench__rail button.active').text()).toContain('Select')
    expect(wrapper.get('.playground-workbench__import').text()).toContain('已从组件文档导入')
    expect(wrapper.get('.playground-workbench__import').text()).toContain('Select')
    expect(wrapper.get('.playground-workbench__import').text()).toContain('Form')
    expect(wrapper.get('.playground-workbench__import').text()).toContain('Candy')
    expect(wrapper.get('.playground-workbench__import-summary').attributes('aria-label')).toBe('Imported source summary')
    expect(wrapper.get('.playground-workbench__import-summary').text()).toContain('7 lines')
    expect(wrapper.get('.playground-workbench__import-details').attributes('open')).toBeUndefined()
    expect(wrapper.get('.playground-workbench__import-details summary').text()).toContain('查看导入清单')
    expect(wrapper.get('.playground-workbench__import-details summary').text()).toContain('11 items')
    expect(wrapper.get('.playground-workbench__import-manifest-grid').text()).toContain('7 lines')
    expect(wrapper.get('.playground-workbench__import-doc-link').attributes('href')).toBe('/components/select')
    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain(
      '<YSelect label="Package" />'
    )

    expect(wrapper.get('.playground-workbench__code-mode').text()).toContain('编辑')
    expect(wrapper.get('.playground-workbench__code-mode').text()).toContain('源码')

    await wrapper.get('.playground-workbench__code-mode-source').trigger('click')

    expect(wrapper.find('.playground-workbench__code-editor').exists()).toBe(false)
    expect(wrapper.findAll('.playground-workbench__code-line-number').map((line) => line.text()).slice(0, 3)).toEqual([
      '1',
      '2',
      '3'
    ])
    expect(wrapper.get('.playground-workbench__code-token--component').text()).toContain('YSelect')

    await wrapper.get('.playground-workbench__code-mode-edit').trigger('click')

    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain(
      '<YSelect label="Package" />'
    )

    await wrapper.get('.playground-workbench__import-manifest').trigger('click')

    const copiedManifest = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedManifest).toContain('# Yok UI Playground import manifest')
    expect(copiedManifest).toContain('- Component: Select')
    expect(copiedManifest).toContain('- Docs: /components/select')
    expect(copiedManifest).toContain('- Theme: Candy')
    expect(copiedManifest).toContain('- Source: 7 lines')
    expect(copiedManifest).toContain('## Source')
    expect(copiedManifest).toContain('<YSelect label="Package" />')
    expect(wrapper.get('.playground-workbench__import-manifest').text()).toContain('已复制清单')

    await wrapper.get('.playground-workbench__import-action').trigger('click')

    expect(wrapper.get('.playground-workbench__code code').text()).toContain('packageOptions')
    expect(wrapper.get('.playground-workbench__code code').text()).not.toContain('<YSelect label="Package" />')
    expect(wrapper.findAll('.playground-workbench__code-line-number').map((line) => line.text()).slice(0, 3)).toEqual([
      '1',
      '2',
      '3'
    ])
    expect(wrapper.get('.playground-workbench__code-token--component').text()).toContain('YSelect')
  })

  it('keeps docs demo imports editable and aligned to the requested source language', async () => {
    const source = [
      '<script setup>',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&source=${encodeURIComponent(source)}&from=docs-demo&language=js`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.get('.playground-workbench__import').text()).toContain('Docs demo')
    expect(wrapper.get('.playground-workbench__code').attributes('data-language')).toBe('js')
    expect(wrapper.get('.playground-workbench__code-tabs button.active').text()).toBe('JS')
    expect(wrapper.get('.playground-workbench__code-mode-edit').attributes('aria-pressed')).toBe('true')
    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain(
      '<YSelect label="Package" />'
    )
    expect(wrapper.get('.playground-workbench__import-manifest-grid').text()).toContain('Docs demo')
  })

  it('switches imported editable examples between TS and JS SFC source', async () => {
    const source = [
      '<script setup>',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&source=${encodeURIComponent(source)}&from=docs-demo&language=js`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain(
      '<script setup>'
    )
    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).not.toContain(
      'lang="ts"'
    )

    await wrapper.get('[data-playground-code-action="language-ts"]').trigger('click')

    expect(wrapper.get('.playground-workbench__code').attributes('data-language')).toBe('ts')
    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain(
      '<script setup lang="ts">'
    )

    await wrapper.get('[data-playground-code-action="copy-code"]').trigger('click')

    expect(vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0]).toContain('<script setup lang="ts">')

    await wrapper.get('[data-playground-code-action="language-js"]').trigger('click')

    expect(wrapper.get('.playground-workbench__code').attributes('data-language')).toBe('js')
    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain(
      '<script setup>'
    )
    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).not.toContain(
      'lang="ts"'
    )
  })

  it('keeps docs demo imports linked back to the original example anchor', async () => {
    const source = [
      '<script setup lang="ts">',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&source=${encodeURIComponent(source)}&from=docs-demo&language=ts&docsHash=%23demo-basic-select`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.get('.playground-workbench__import-doc-link').attributes('href')).toBe(
      '/components/select#demo-basic-select'
    )

    await wrapper.get('.playground-workbench__share').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)

    expect(url.searchParams.get('from')).toBe('docs-demo')
    expect(url.searchParams.get('docsHash')).toBe('#demo-basic-select')
  })

  it('renders imported docs examples with Element Plus style playground source actions', async () => {
    const source = [
      '<script setup lang="ts">',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&source=${encodeURIComponent(source)}&from=docs-demo&language=ts`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.get('.playground-workbench__code-actions').attributes('aria-label')).toBe('示例源码操作')
    expect(wrapper.get('.playground-workbench__code-actions').classes()).toContain('example-source-actions')
    expect(wrapper.get('.playground-workbench__code-tabs').attributes('role')).toBe('tablist')
    expect(wrapper.findAll('[data-playground-code-action]').map((item) => item.attributes('data-playground-code-action'))).toEqual([
      'language-ts',
      'language-js',
      'language-install',
      'mode-edit',
      'mode-source',
      'reset-source',
      'source-file',
      'copy-link',
      'copy-code'
    ])
    expect(wrapper.get('[data-playground-code-action="mode-edit"]').attributes('data-tooltip')).toBe(
      '在 Playground 中编辑'
    )
    expect(wrapper.get('[data-playground-code-action="mode-edit"]').attributes('aria-label')).toBe(
      '在 Playground 中编辑'
    )
    expect(wrapper.get('[data-playground-code-action="mode-edit"] .playground-workbench__code-tool-glyph').attributes('data-icon')).toBe('playground')
    expect(wrapper.get('[data-playground-code-action="mode-edit"] .playground-workbench__code-tool-text').text()).toBe('编辑')
    expect(wrapper.get('[data-playground-code-action="mode-source"]').attributes('data-tooltip')).toBe('查看源代码')
    expect(wrapper.get('[data-playground-code-action="mode-source"]').attributes('aria-label')).toBe('查看源代码')
    expect(wrapper.get('[data-playground-code-action="mode-source"] .playground-workbench__code-tool-glyph').attributes('data-icon')).toBe('code')
    expect(wrapper.get('[data-playground-code-action="mode-source"] .playground-workbench__code-tool-text').text()).toBe('源码')
    expect(wrapper.get('[data-playground-code-action="reset-source"]').attributes('data-tooltip')).toBe('源码未修改')
    expect(wrapper.get('[data-playground-code-action="reset-source"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-playground-code-action="reset-source"] .playground-workbench__code-tool-glyph').attributes('data-icon')).toBe('reset')
    expect(wrapper.get('[data-playground-code-action="reset-source"] .playground-workbench__code-tool-text').text()).toBe('Reset source')
    expect(wrapper.get('[data-playground-code-action="source-file"]').attributes('href')).toBe(
      '/source/?file=packages/core/src/components/select/YSelect.vue'
    )
    expect(wrapper.get('[data-playground-code-action="source-file"]').attributes('data-tooltip')).toBe('查看组件源码')
    expect(wrapper.get('[data-playground-code-action="source-file"]').attributes('aria-label')).toBe('查看组件源码')
    expect(wrapper.get('[data-playground-code-action="source-file"] .playground-workbench__code-tool-glyph').attributes('data-icon')).toBe('source')
    expect(wrapper.get('[data-playground-code-action="source-file"] .playground-workbench__code-tool-text').text()).toBe('Vue source')
    expect(wrapper.get('[data-playground-code-action="copy-link"]').attributes('data-tooltip')).toBe('复制 Playground 链接')
    expect(wrapper.get('[data-playground-code-action="copy-link"] .playground-workbench__code-tool-glyph').attributes('data-icon')).toBe('external')
    expect(wrapper.get('[data-playground-code-action="copy-link"] .playground-workbench__code-tool-glyph').text()).toBe('')
    expect(wrapper.get('[data-playground-code-action="copy-link"] .playground-workbench__code-tool-text').text()).toBe('Copy playground link')
    expect(wrapper.get('[data-playground-code-action="copy-code"]').attributes('data-tooltip')).toBe('复制代码')
    expect(wrapper.get('[data-playground-code-action="copy-code"] .playground-workbench__code-tool-glyph').attributes('data-icon')).toBe('copy')
    expect(wrapper.get('[data-playground-code-action="copy-code"] .playground-workbench__code-tool-glyph').text()).toBe('')
    expect(wrapper.get('[data-playground-code-action="copy-code"] .playground-workbench__code-tool-text').text()).toBe('Copy code')

    await wrapper.get('[data-playground-code-action="mode-source"]').trigger('click')

    expect(wrapper.get('[data-playground-code-action="mode-source"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('.playground-workbench__code code').text()).toContain('<YSelect label="Package" />')

    await wrapper.get('[data-playground-code-action="copy-code"]').trigger('click')

    expect(vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0]).toContain('<YSelect label="Package" />')
    expect(wrapper.get('[data-playground-code-action="copy-code"]').attributes('data-tooltip')).toBe('已复制代码')
  })

  it('keeps reset-to-imported-source available beside Element Plus style playground source actions', async () => {
    const source = [
      '<script setup lang="ts">',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&source=${encodeURIComponent(source)}&from=docs-demo&language=ts`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const editor = wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor')

    expect(wrapper.get('[data-playground-code-action="reset-source"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-playground-code-action="reset-source"]').attributes('data-tooltip')).toBe('源码未修改')
    expect(wrapper.get('[data-playground-code-action="reset-source"] .playground-workbench__code-tool-glyph').attributes('data-icon')).toBe('reset')

    await editor.setValue(source.replace('Package', 'Changed package'))
    await nextTick()

    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain('Changed package')
    expect(wrapper.get('[data-playground-code-action="reset-source"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('[data-playground-code-action="reset-source"]').attributes('data-tooltip')).toBe('恢复导入源码')

    await wrapper.get('[data-playground-code-action="reset-source"]').trigger('click')

    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toBe(source)
    expect(wrapper.get('[data-playground-code-action="reset-source"]').attributes('disabled')).toBeDefined()
  })

  it('uses an Element Plus style source panel placement for imported playground source view', async () => {
    const source = [
      '<script setup lang="ts">',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&source=${encodeURIComponent(source)}&from=docs-demo&language=ts`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    await wrapper.get('[data-playground-code-action="mode-source"]').trigger('click')

    expect(wrapper.get('.playground-workbench__code').attributes('data-source-display')).toBe('source')
    expect(wrapper.get('.playground-workbench__code-actions').attributes('data-source-placement')).toBe('code-top-right')
    expect(wrapper.get('.playground-workbench__source-view').attributes('data-source-panel')).toBe('element-plus')
    expect(wrapper.find('.playground-workbench__code-editor').exists()).toBe(false)
    expect(wrapper.get('.playground-workbench__source-view').text()).toContain('<YSelect label="Package" />')

    const footer = wrapper.get('.playground-workbench__source-footer')
    const collapse = wrapper.get('[data-playground-code-action="return-edit"]')

    expect(footer.attributes('data-source-placement')).toBe('bottom-collapse')
    expect(collapse.attributes('aria-label')).toBe('返回编辑')
    expect(collapse.text()).toContain('返回编辑')

    await collapse.trigger('click')

    expect(wrapper.get('.playground-workbench__code').attributes('data-source-display')).toBe('edit')
    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain(
      '<YSelect label="Package" />'
    )
  })

  it('keeps imported source view focusable and connected to its controls', async () => {
    const source = [
      '<script setup lang="ts">',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&source=${encodeURIComponent(source)}&from=docs-demo&language=ts`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      attachTo: document.body,
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const sourceButton = wrapper.get('[data-playground-code-action="mode-source"]')

    expect(sourceButton.attributes('aria-controls')).toBe('playground-workbench-source-panel')

    await sourceButton.trigger('click')
    await nextTick()

    const sourceView = wrapper.get('#playground-workbench-source-panel')

    expect(sourceView.attributes('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(sourceView.element)

    const returnButton = wrapper.get('[data-playground-code-action="return-edit"]')

    expect(returnButton.attributes('aria-controls')).toBe('playground-workbench-source-panel')

    await returnButton.trigger('click')
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('[data-playground-code-action="mode-source"]').element)

    wrapper.unmount()
  })

  it('keeps live example imports connected to their docs example and source language', async () => {
    const source = [
      '<script setup>',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&source=${encodeURIComponent(source)}&from=live-example&language=js&scenario=basic-usage&docsHash=%23live-example%3Fscenario%3Dbasic-usage`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const importPanel = wrapper.get('.playground-workbench__import')

    expect(importPanel.text()).toContain('Live example 已导入')
    expect(importPanel.text()).toContain('JS')
    expect(importPanel.text()).toContain('basic-usage')
    expect(wrapper.get('.playground-workbench__import-doc-link').attributes('href')).toBe(
      '/components/select#live-example?scenario=basic-usage'
    )
    expect(wrapper.get('.playground-workbench__import-doc-link').text()).toContain('返回文档示例')
    expect(wrapper.get('.playground-workbench__import-manifest-grid').text()).toContain('JS')
    expect(wrapper.get('.playground-workbench__code').attributes('data-language')).toBe('js')

    await wrapper.get('.playground-workbench__share').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)

    expect(url.searchParams.get('from')).toBe('live-example')
    expect(url.searchParams.get('language')).toBe('js')
    expect(url.searchParams.get('scenario')).toBe('basic-usage')
    expect(url.searchParams.get('docsHash')).toBe('#live-example?scenario=basic-usage')
  })

  it('hydrates carousel from the component route query with preview and source', async () => {
    window.history.pushState({}, '', '/playground/?component=carousel')

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.get('.playground-workbench__rail button.active').text()).toContain('Carousel')
    expect(wrapper.get('.yok-carousel').text()).toContain('Release radar')
    expect(wrapper.get('.playground-workbench__code code').text()).toContain('<YCarousel')
    expect(wrapper.get('.playground-workbench__code code').text()).toContain('carouselItems')
    expect(wrapper.get('.playground-workbench__code').attributes('data-language')).toBe('ts')
    expect(wrapper.findAll('.playground-workbench__code-line-number').at(0)?.text()).toBe('1')
    expect(wrapper.get('.playground-workbench__code-token--tag').text()).toContain('<script')
    expect(wrapper.get('.playground-workbench__code-token--component').text()).toContain('YCarousel')

    await wrapper.get('.playground-workbench__copy-code').trigger('click')

    const copiedCode = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedCode).toContain('<YCarousel')
    expect(copiedCode).not.toContain('1\n<script')
  })

  it('keeps every playground allowlist component wired to imports, source and preview', async () => {
    const brokenComponents: string[] = []

    for (const component of playgroundComponents) {
      window.history.pushState({}, '', `/playground/?component=${component}`)

      const wrapper = mount(PlaygroundWorkbench, {
        global: {
          stubs: componentStubs
        }
      })
      await nextTick()

      const code = wrapper.get('.playground-workbench__code code').text()
      const preview = wrapper.get('.playground-workbench__preview')
      const usesFallbackProgress = component !== 'progress' && preview.find('progress').exists()
      const sourceFallsBackToProgress = component !== 'progress' && code.includes('<YProgress')

      if (code.includes('undefined') || sourceFallsBackToProgress || usesFallbackProgress) {
        brokenComponents.push(component)
      }

      wrapper.unmount()
    }

    expect(brokenComponents).toEqual([])
  }, 10000)

  it('hydrates live example scenario and controls context from the route query', async () => {
    const source = [
      '<script setup lang="ts">',
      "import { YDataTable } from '@yok-ui/admin'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YDataTable title="Bulk queue" selectable />',
      '</template>'
    ].join('\n')
    const controls = JSON.stringify({
      scenario: 'bulk',
      title: 'Ship to playground',
      density: 'compact'
    })
    const replay = JSON.stringify({
      component: 'YDataTable',
      scenario: {
        key: 'bulk-selection',
        label: '批量选择',
        kind: 'multi'
      },
      changedControls: 3,
      events: [
        {
          component: 'Data Table',
          event: 'bulkAction',
          preview: '{"value":"publish"}'
        }
      ],
      steps: [
        {
          key: 'hydrate',
          label: '1. Restore context',
          detail: 'Open the shared state or scenario link.',
          passed: true
        },
        {
          key: 'event',
          label: '4. Replay event',
          detail: 'Trigger Data Table@bulkAction.',
          passed: true
        }
      ],
      assertions: {
        validation: 'Pass',
        interactionContracts: [
          {
            componentName: 'YDataTable',
            pattern: 'Admin data table',
            maturity: 'verified'
          }
        ]
      }
    })

    window.history.pushState(
      {},
      '',
      `/playground/?component=dataTable&theme=yok-candy&scenario=bulk-selection&viewport=mobile&controls=${encodeURIComponent(controls)}&replay=${encodeURIComponent(replay)}&source=${encodeURIComponent(source)}`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.attributes('data-theme')).toBe('yok-candy')
    expect(wrapper.get('.playground-workbench__rail button.active').text()).toContain('Data Table')
    expect(wrapper.get('.playground-workbench__import').text()).toContain('场景 bulk-selection')
    expect(wrapper.get('.playground-workbench__import').text()).toContain('手机预览')
    expect(wrapper.get('.playground-workbench__import').text()).toContain('scenario: bulk')
    expect(wrapper.get('.playground-workbench__import').text()).toContain('title: Ship to playground')
    expect(wrapper.get('.playground-workbench__import-summary').text()).toContain('Data Table')
    expect(wrapper.get('.playground-workbench__import-summary').text()).toContain('TS')
    expect(wrapper.get('.playground-workbench__import-details summary').text()).toContain('查看导入清单')
    expect(wrapper.get('.playground-workbench__import-manifest-grid').text()).toContain('bulk-selection')
    expect(wrapper.get('.playground-workbench__import-manifest-grid').text()).toContain('手机预览')
    expect(wrapper.get('.playground-workbench__import-manifest-grid').text()).toContain('3')
    expect(wrapper.get('.playground-workbench__import-manifest-grid').text()).toContain('1 events')
    expect(wrapper.get('.playground-workbench__replay').text()).toContain('Replay manifest')
    expect(wrapper.get('.playground-workbench__replay').text()).toContain('1 events · 2 steps')
    expect(wrapper.get('.playground-workbench__replay').text()).toContain('Data Table@bulkAction')
    expect(wrapper.get('.playground-workbench__replay').text()).toContain('4. Replay event')
    expect(wrapper.get('.playground-workbench__import-doc-link').attributes('href')).toBe('/components/data-table')
    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain(
      '<YDataTable title="Bulk queue" selectable />'
    )

    await wrapper.get('.playground-workbench__import-manifest').trigger('click')

    const copiedManifest = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedManifest).toContain('- Component: Data Table')
    expect(copiedManifest).toContain('- Scenario: bulk-selection')
    expect(copiedManifest).toContain('- Viewport: 手机预览')
    expect(copiedManifest).toContain('- Controls: 3')
    expect(copiedManifest).toContain('- Replay events: 1')
    expect(copiedManifest).toContain('- Replay steps: 2')
    expect(copiedManifest).toContain('## Replay manifest')
    expect(copiedManifest).toContain('"event": "bulkAction"')
    expect(copiedManifest).toContain('"density": "compact"')

    await wrapper.get('.playground-workbench__share').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)

    expect(url.searchParams.get('viewport')).toBe('mobile')
    expect(url.searchParams.get('replay')).toContain('"event":"bulkAction"')
  })

  it('hydrates compact handoff payloads from local storage', async () => {
    const source = [
      '<script setup lang="ts">',
      "import { YDataTable } from '@yok-ui/admin'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YDataTable title="Compact handoff" selectable />',
      '</template>'
    ].join('\n')
    const handoffKey = 'dataTable-test-handoff'
    const handoffPayload = {
      version: 1,
      component: 'dataTable',
      theme: 'yok-candy',
      source,
      origin: 'live-example',
      language: 'ts',
      sourcePanel: {
        mode: 'repro',
        label: 'Repro bundle',
        language: 'ts',
        installPackageManager: 'pnpm'
      },
      scenario: 'bulk-selection',
      viewport: 'mobile',
      controls: {
        scenario: 'bulk',
        title: 'Compact handoff',
        density: 'compact'
      },
      replay: {
        component: 'YDataTable',
        scenario: {
          key: 'bulk-selection',
          label: '批量选择',
          kind: 'multi'
        },
        changedControls: 2,
        events: [
          {
            component: 'Data Table',
            event: 'bulkAction',
            preview: '{"value":"publish"}'
          }
        ],
        steps: [
          {
            key: 'event',
            label: '4. Replay event',
            detail: 'Trigger Data Table@bulkAction.',
            passed: true
          }
        ],
        assertions: {
          validation: 'Pass',
          interactionContracts: [
            {
              componentName: 'YDataTable',
              pattern: 'Admin data table',
              maturity: 'verified'
            }
          ]
        }
      }
    }

    window.localStorage.setItem(`yok-ui:playground-handoff:${handoffKey}`, JSON.stringify(handoffPayload))
    window.history.pushState({}, '', `/playground/?component=button&theme=yok-light&handoff=${handoffKey}`)

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.attributes('data-theme')).toBe('yok-candy')
    expect(wrapper.get('.playground-workbench__rail button.active').text()).toContain('Data Table')
    expect(wrapper.get('.playground-workbench__import').text()).toContain(`handoff ${handoffKey}`)
    expect(wrapper.get('.playground-workbench__import').text()).toContain('Compact handoff')
    expect(wrapper.get('.playground-workbench__import').text()).toContain('Data Table@bulkAction')
    expect(wrapper.get('.playground-workbench__import-manifest-grid').text()).toContain('1 events')
    expect(wrapper.get('.playground-workbench__import-manifest-grid').text()).toContain(handoffKey)
    expect(wrapper.get('.playground-workbench__import-manifest-grid').text()).toContain('Repro bundle')

    await wrapper.get('.playground-workbench__share').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)

    expect(url.searchParams.get('component')).toBe('dataTable')
    expect(url.searchParams.get('theme')).toBe('yok-candy')
    expect(url.searchParams.get('handoff')).toBe(handoffKey)
    expect(url.searchParams.has('source')).toBe(false)
    expect(url.searchParams.has('replay')).toBe(false)

    await wrapper.get('.playground-workbench__import-manifest').trigger('click')

    const copiedManifest = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedManifest).toContain('- Source panel: Repro bundle')
  })

  it('surfaces an expired docs demo handoff instead of silently falling back to generated examples', async () => {
    window.history.pushState(
      {},
      '',
      '/playground/?component=select&handoff=missing-doc-demo-handoff&from=docs-demo&language=ts&docsHash=%23demo-basic-select'
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const importPanel = wrapper.get('.playground-workbench__import')

    expect(importPanel.classes()).toContain('playground-workbench__import--missing')
    expect(importPanel.text()).toContain('Playground handoff 已失效')
    expect(importPanel.text()).toContain('missing-doc-demo-handoff')
    expect(importPanel.text()).toContain('Docs demo')
    expect(importPanel.text()).toContain('TS')
    expect(wrapper.get('.playground-workbench__import-doc-link').attributes('href')).toBe(
      '/components/select#demo-basic-select'
    )
    expect(wrapper.find('.playground-workbench__code-editor').exists()).toBe(false)
    expect(wrapper.get('.playground-workbench__code code').text()).toContain('<YSelect')
  })

  it('shares the edited imported source instead of a stale compact handoff', async () => {
    const source = [
      '<script setup lang="ts">',
      "import { YDataTable } from '@yok-ui/admin'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YDataTable title="Compact handoff" selectable />',
      '</template>'
    ].join('\n')
    const handoffKey = 'dataTable-edit-handoff'

    window.localStorage.setItem(`yok-ui:playground-handoff:${handoffKey}`, JSON.stringify({
      version: 1,
      component: 'dataTable',
      theme: 'yok-candy',
      source,
      origin: 'live-example',
      language: 'ts',
      docsHash: '#live-example?scenario=bulk-selection',
      scenario: 'bulk-selection'
    }))
    window.history.pushState({}, '', `/playground/?component=button&theme=yok-light&handoff=${handoffKey}`)

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const editor = wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor')

    await editor.setValue(editor.element.value.replace('Compact handoff', 'Edited handoff'))
    await wrapper.get('.playground-workbench__share').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)

    expect(url.searchParams.has('handoff')).toBe(false)
    expect(url.searchParams.get('component')).toBe('dataTable')
    expect(url.searchParams.get('theme')).toBe('yok-candy')
    expect(url.searchParams.get('from')).toBe('live-example')
    expect(url.searchParams.get('language')).toBe('ts')
    expect(url.searchParams.get('scenario')).toBe('bulk-selection')
    expect(url.searchParams.get('docsHash')).toBe('#live-example?scenario=bulk-selection')
    expect(url.searchParams.get('source')).toContain('Edited handoff')
    expect(url.searchParams.get('source')).not.toContain('Compact handoff')
  })

  it('preserves live example source panel metadata when sharing an edited imported source', async () => {
    const source = [
      '<script setup lang="ts">',
      "import { YDataTable } from '@yok-ui/admin'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YDataTable title="Repro bundle handoff" selectable />',
      '</template>'
    ].join('\n')
    const handoffKey = 'dataTable-repro-panel-handoff'

    window.localStorage.setItem(`yok-ui:playground-handoff:${handoffKey}`, JSON.stringify({
      version: 1,
      component: 'dataTable',
      theme: 'yok-candy',
      source,
      origin: 'live-example',
      language: 'ts',
      sourcePanel: {
        mode: 'repro',
        label: 'Repro bundle',
        language: 'ts',
        installPackageManager: 'pnpm'
      },
      docsHash: '#live-example?scenario=bulk-selection',
      scenario: 'bulk-selection'
    }))
    window.history.pushState({}, '', `/playground/?handoff=${handoffKey}`)

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    await wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').setValue(
      source.replace('Repro bundle handoff', 'Edited repro bundle')
    )
    await wrapper.get('[data-playground-code-action="mode-source"]').trigger('click')
    await wrapper.get('[data-playground-code-action="copy-link"]').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)

    expect(url.searchParams.has('handoff')).toBe(false)
    expect(url.searchParams.get('source')).toContain('Edited repro bundle')
    expect(url.searchParams.get('sourcePanelMode')).toBe('repro')
    expect(url.searchParams.get('sourcePanelLabel')).toBe('Repro bundle')
    expect(url.searchParams.get('sourcePanelLanguage')).toBe('ts')
    expect(url.searchParams.get('sourcePanelInstallPackageManager')).toBe('pnpm')

    wrapper.unmount()
    window.history.pushState({}, '', `${url.pathname}${url.search}`)

    const sharedWrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(sharedWrapper.get('.playground-workbench__import-manifest-grid').text()).toContain('Repro bundle')
    expect(sharedWrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain(
      'Edited repro bundle'
    )
  })

  it('shares the active imported language and theme instead of reusing a stale handoff', async () => {
    const source = [
      '<script setup>',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')
    const handoffKey = 'select-language-handoff'

    window.localStorage.setItem(`yok-ui:playground-handoff:${handoffKey}`, JSON.stringify({
      version: 1,
      component: 'select',
      theme: 'yok-light',
      source,
      origin: 'docs-demo',
      language: 'js',
      docsHash: '#demo-basic-select'
    }))
    window.history.pushState({}, '', `/playground/?handoff=${handoffKey}`)

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    await wrapper.get('[data-playground-code-action="language-ts"]').trigger('click')
    await wrapper.findAll('.playground-workbench__controls select')[0].setValue('yok-candy')
    await wrapper.get('.playground-workbench__share').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)

    expect(url.searchParams.has('handoff')).toBe(false)
    expect(url.searchParams.get('component')).toBe('select')
    expect(url.searchParams.get('theme')).toBe('yok-candy')
    expect(url.searchParams.get('from')).toBe('docs-demo')
    expect(url.searchParams.get('language')).toBe('ts')
    expect(url.searchParams.get('docsHash')).toBe('#demo-basic-select')
    expect(url.searchParams.get('source')).toContain('<script setup lang="ts">')
    expect(url.searchParams.get('source')).toContain('<YSelect label="Package" />')
  })

  it('copies the import manifest with the active normalized imported source', async () => {
    const source = [
      '<script setup>',
      "import { YSelect } from '@yok-ui/core'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&source=${encodeURIComponent(source)}&from=docs-demo&language=js`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    await wrapper.get('[data-playground-code-action="language-ts"]').trigger('click')
    await wrapper.get('.playground-workbench__import-manifest').trigger('click')

    const copiedManifest = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedManifest).toContain('- Language: TS')
    expect(copiedManifest).toContain('## Source')
    expect(copiedManifest).toContain('<script setup lang="ts">')
    expect(copiedManifest).toContain('<YSelect label="Package" />')
  })

  it('copies a shareable route for the current generated playground state', async () => {
    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const selects = wrapper.findAll('.playground-workbench__controls select')
    await selects[0].setValue('yok-candy')
    await selects[1].setValue('ghost')
    await selects[2].setValue('lg')

    const checkboxes = wrapper.findAll('.playground-workbench__check input')
    await checkboxes[0].setValue(true)
    await checkboxes[1].setValue(true)

    await wrapper.get('.playground-workbench__share').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)

    expect(url.pathname).toBe('/playground/')
    expect(url.searchParams.get('component')).toBe('button')
    expect(url.searchParams.get('theme')).toBe('yok-candy')
    expect(url.searchParams.get('variant')).toBe('ghost')
    expect(url.searchParams.get('size')).toBe('lg')
    expect(url.searchParams.get('loading')).toBe('true')
    expect(url.searchParams.get('disabled')).toBe('true')
    expect(url.searchParams.has('source')).toBe(false)
    expect(wrapper.get('.playground-workbench__share').text()).toContain('已复制链接')
  })

  it('keeps copy feedback usable when the Clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined
    })
    window.history.pushState({}, '', '/playground/?component=select')

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    await wrapper.get('.playground-workbench__share').trigger('click')

    expect(wrapper.get('.playground-workbench__share').text()).toContain('已复制链接')
  })

  it('keeps copy feedback usable when clipboard writes are rejected', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('clipboard denied'))
      }
    })
    window.history.pushState({}, '', '/playground/?component=select')

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    await wrapper.get('.playground-workbench__share').trigger('click')

    expect(wrapper.get('.playground-workbench__share').text()).toContain('已复制链接')
  })

  it('falls back and keeps copy feedback usable when clipboard writes stay pending', async () => {
    vi.useFakeTimers()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn(() => new Promise(() => {}))
      }
    })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn(() => true)
    })
    window.history.pushState({}, '', '/playground/?component=select')

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const copyAction = wrapper.get('.playground-workbench__copy-code').trigger('click')

    await vi.advanceTimersByTimeAsync(500)
    await copyAction

    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(wrapper.get('.playground-workbench__copy-code').text()).toContain('已复制')

    vi.useRealTimers()
  })

  it('filters the component picker by family and keeps the active component visible', async () => {
    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    await wrapper
      .findAll('.playground-workbench__family-filter button')
      .find((button) => button.text().includes('Form'))
      ?.trigger('click')

    const railText = wrapper.get('.playground-workbench__rail').text()

    expect(wrapper.get('.playground-workbench__rail button.active').text()).toContain('Input')
    expect(railText).toContain('Input Number')
    expect(railText).toContain('Switch')
    expect(railText).not.toContain('Button')
    expect(railText).not.toContain('Tabs')
  })

  it('offers a compact mobile component picker without duplicating the desktop rail first', async () => {
    window.history.pushState({}, '', '/playground/?component=select')

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const mobilePicker = wrapper.get('.playground-workbench__mobile-picker')

    expect(mobilePicker.attributes('aria-label')).toBe('Mobile component picker')
    expect(mobilePicker.attributes('open')).toBeUndefined()
    expect(mobilePicker.get('.playground-workbench__mobile-summary').attributes('aria-label')).toBe(
      '当前组件：Select'
    )
    expect(mobilePicker.get('.playground-workbench__mobile-summary').text()).toContain('Select')
    expect(mobilePicker.get('.playground-workbench__mobile-summary').text()).toContain('Form')
    expect(mobilePicker.findAll('.playground-workbench__mobile-family-filter button').length).toBeGreaterThan(1)
    expect(mobilePicker.findAll('.playground-workbench__mobile-component-button').length).toBeGreaterThan(1)
    expect(wrapper.get('.playground-workbench__rail').attributes('data-desktop-navigation')).toBe('true')

    const mobileInputFamily = mobilePicker
      .findAll('.playground-workbench__mobile-family-filter button')
      .find((button) => button.text().includes('Form'))

    await mobileInputFamily?.trigger('click')

    expect(mobilePicker.text()).toContain('Input Number')
    expect(mobilePicker.text()).not.toContain('Button')
    expect(mobilePicker.get('.playground-workbench__mobile-component-button.is-active').text()).toContain('Select')

    const inputButton = mobilePicker
      .findAll('.playground-workbench__mobile-component-button')
      .find((button) => button.text().includes('Input Number'))

    await inputButton?.trigger('click')

    expect(wrapper.get('.playground-workbench__controls header strong').text()).toContain('Input Number')
    expect(wrapper.get('.playground-workbench__mobile-summary').attributes('aria-label')).toBe(
      '当前组件：Input Number'
    )
  })

  it('switches generated code between TS, JS and install command copy views', async () => {
    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.get('.playground-workbench__code code').text()).toContain('<script setup lang="ts">')

    await wrapper
      .findAll('.playground-workbench__code-tabs button')
      .find((button) => button.text().includes('JS'))
      ?.trigger('click')

    expect(wrapper.get('.playground-workbench__code code').text()).toContain('<script setup>')
    expect(wrapper.get('.playground-workbench__code code').text()).not.toContain('lang="ts"')

    await wrapper
      .findAll('.playground-workbench__code-tabs button')
      .find((button) => button.text().includes('Install'))
      ?.trigger('click')

    expect(wrapper.get('.playground-workbench__code code').text()).toContain('pnpm add @yok-ui/core @yok-ui/themes')

    await wrapper.get('.playground-workbench__copy-code').trigger('click')

    expect(vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0]).toContain('@yok-ui/core')
    expect(wrapper.get('.playground-workbench__copy-code').text()).toContain('已复制')
  })

  it('preserves imported source when copying a playground share link', async () => {
    const source = [
      '<template>',
      '  <YAlert title="Imported docs example" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=alert&theme=yok-clean&source=${encodeURIComponent(source)}`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    await wrapper.get('.playground-workbench__share').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)

    expect(url.pathname).toBe('/playground/')
    expect(url.searchParams.get('component')).toBe('alert')
    expect(url.searchParams.get('theme')).toBe('yok-clean')
    expect(url.searchParams.get('source')).toContain('<YAlert title="Imported docs example" />')
  })

  it('edits imported source and copies the current playground draft', async () => {
    const source = [
      '<template>',
      '  <YSelect label="Package" />',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=select&theme=yok-light&source=${encodeURIComponent(source)}`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const editor = wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor')

    expect(editor.element.value).toContain('<YSelect label="Package" />')

    await editor.setValue([
      '<template>',
      '  <YSelect label="Edited package" />',
      '</template>'
    ].join('\n'))
    await wrapper.get('.playground-workbench__copy-code').trigger('click')

    expect(vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0]).toContain('Edited package')

    await wrapper.get('.playground-workbench__share').trigger('click')

    const copiedUrl = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''
    const url = new URL(copiedUrl)

    expect(url.searchParams.get('source')).toContain('Edited package')

    await wrapper.get('.playground-workbench__import-restore').trigger('click')

    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).toContain('Package')
    expect(wrapper.get<HTMLTextAreaElement>('.playground-workbench__code-editor').element.value).not.toContain('Edited package')
  })

  it('resets generated props while keeping component and theme context', async () => {
    const source = [
      '<template>',
      '  <YButton size="lg" variant="ghost" loading disabled>Imported</YButton>',
      '</template>'
    ].join('\n')

    window.history.pushState(
      {},
      '',
      `/playground/?component=button&theme=yok-candy&source=${encodeURIComponent(source)}&variant=ghost&size=lg&loading=true&disabled=true`
    )

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.attributes('data-theme')).toBe('yok-candy')
    expect(wrapper.get('.playground-workbench__import').text()).toContain('已从组件文档导入')

    await wrapper.get('.playground-workbench__reset').trigger('click')

    const selects = wrapper.findAll('.playground-workbench__controls select')
    const checkboxes = wrapper.findAll('.playground-workbench__check input')
    const code = wrapper.get('.playground-workbench__code code').text()

    expect(wrapper.attributes('data-theme')).toBe('yok-candy')
    expect(wrapper.get('.playground-workbench__rail button.active').text()).toContain('Button')
    expect(wrapper.find('.playground-workbench__import').exists()).toBe(false)
    expect(selects[0].element.value).toBe('yok-candy')
    expect(selects[1].element.value).toBe('primary')
    expect(selects[2].element.value).toBe('md')
    expect(checkboxes.map((checkbox) => (checkbox.element as HTMLInputElement).checked)).toEqual([false, false])
    expect(code).toContain('variant="primary"')
    expect(code).toContain('size="md"')
    expect(code).not.toContain(' loading')
    expect(code).not.toContain(' disabled')
    expect(code).not.toContain('Imported')
  })

  it('opens complex form components from route query and generates matching SFC code', async () => {
    window.history.pushState({}, '', '/playground/?component=cascader&theme=yok-clean')

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    expect(wrapper.attributes('data-theme')).toBe('yok-clean')
    expect(wrapper.get('.playground-workbench__rail button.active').text()).toContain('Cascader')
    expect(wrapper.get('.playground-workbench__code code').text()).toContain('<YCascader')
    expect(wrapper.get('.playground-workbench__code code').text()).toContain('cascaderOptions')
  })

  it('generates image and slot avatar examples in the playground', async () => {
    window.history.pushState({}, '', '/playground/?component=avatar')

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const code = wrapper.get('.playground-workbench__code code').text()

    expect(wrapper.get('.playground-workbench__rail button.active').text()).toContain('Avatar')
    expect(code).toContain('src-set=')
    expect(code).toContain('fit="cover"')
    expect(code).toContain('label="Brand symbol"')
    expect(code).toContain('tone="primary"')
    expect(code).not.toContain('tone="info"')
  })

  it('generates collapsed avatar group examples in the playground', async () => {
    window.history.pushState({}, '', '/playground/?component=avatarGroup')

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const code = wrapper.get('.playground-workbench__code code').text()

    expect(wrapper.get('.playground-workbench__rail button.active').text()).toContain('Avatar Group')
    expect(code).toContain('import { YAvatar, YAvatarGroup }')
    expect(code).toContain('<YAvatarGroup')
    expect(code).toContain(':max="3"')
    expect(code).toContain(':total="6"')
    expect(code).toContain('spacing="tight"')
  })

  it.each([
    ['autocomplete', 'Autocomplete', '<YAutocomplete', 'autocompleteOptions'],
    ['mention', 'Mention', '<YMention', 'mentionOptions'],
    ['inputOtp', 'Input OTP', '<YInputOtp', 'code'],
    ['inputTag', 'Input Tag', '<YInputTag', 'tags'],
    ['inputNumber', 'Input Number', '<YInputNumber', 'quantity'],
    ['slider', 'Slider', '<YSlider', 'volume'],
    ['rate', 'Rate', '<YRate', 'rating'],
    ['checkbox', 'Checkbox', '<YCheckbox', 'confirmed'],
    ['radioGroup', 'Radio Group', '<YRadioGroup', 'radioOptions'],
    ['switch', 'Switch', '<YSwitch', 'enabled'],
    ['tabs', 'Tabs', '<YTabs', 'tabItems'],
    ['steps', 'Steps', '<YSteps', 'stepItems'],
    ['tour', 'Tour', '<YTour', 'tourSteps'],
    ['collapse', 'Collapse', '<YCollapse', 'collapseItems'],
    ['tooltip', 'Tooltip', '<YTooltip', 'tooltipContent'],
    ['popover', 'Popover', '<YPopover', 'popoverTitle'],
    ['dropdown', 'Dropdown', '<YDropdown', 'dropdownItems'],
    ['popconfirm', 'Popconfirm', '<YPopconfirm', 'popconfirmTitle'],
    ['modal', 'Modal', '<YModal', 'modalOpen'],
    ['drawer', 'Drawer', '<YDrawer', 'drawerOpen'],
    ['pagination', 'Pagination', '<YPagination', 'paginationPage'],
    ['timeline', 'Timeline', '<YTimeline', 'timelineItems'],
    ['card', 'Card', '<YCard', 'cardTitle'],
    ['empty', 'Empty', '<YEmpty', 'emptyTitle'],
    ['skeleton', 'Skeleton', '<YSkeleton', 'skeletonRows'],
    ['loading', 'Loading', '<YLoading', 'loading'],
    ['message', 'Message', '<YMessage', 'messageTitle'],
    ['result', 'Result', '<YResult', 'resultTitle'],
    ['icon', 'Icon', '<YIcon', 'iconLabel'],
    ['configProvider', 'Config Provider', '<YConfigProvider', 'configProviderLocale'],
    ['textarea', 'Textarea', '<YTextarea', 'releaseNote'],
    ['form', 'Form', '<YForm', 'formModel'],
    ['formItem', 'Form Item', '<YFormItem', 'formItemValue'],
    ['formSummary', 'Form Summary', '<YFormSummary', 'formSummaryErrors'],
    ['divider', 'Divider', '<YDivider', 'dividerLabel'],
    ['link', 'Link', '<YLink', 'linkHref'],
    ['text', 'Text', '<YText', 'textContent'],
    ['upload', 'Upload', '<YUpload', 'uploadFiles'],
    ['transfer', 'Transfer', '<YTransfer', 'transferOptions'],
    ['avatarGroup', 'Avatar Group', '<YAvatarGroup', 'Review team'],
    ['badge', 'Badge', '<YBadge', 'badgeValue'],
    ['checkTag', 'Check Tag', '<YCheckTag', 'checked'],
    ['table', 'Table', '<YTable', 'tableRows'],
    ['dataTable', 'Data Table', '<YDataTable', 'adminTableRows'],
    ['dataView', 'Data View', '<YDataView', 'dataViewViews'],
    ['resourcePage', 'Resource Page', '<YResourcePage', 'resourceSearchFields'],
    ['crudLayout', 'CRUD Layout', '<YCrudLayout', 'crudSearchFields'],
    ['approvalCommentBox', 'Approval Comment Box', '<YApprovalCommentBox', 'approvalSuggestions'],
    ['bulkActionBar', 'Bulk Action Bar', '<YBulkActionBar', 'bulkActions'],
    ['bulkActionMenu', 'Bulk Action Menu', '<YBulkActionMenu', 'bulkMenuActions'],
    ['dataToolbar', 'Data Toolbar', '<YDataToolbar', 'dataToolbarCount'],
    ['savedViews', 'Saved Views', '<YSavedViews', 'savedViewItems'],
    ['savedViewManager', 'Saved View Manager', '<YSavedViewManager', 'savedViewManagerItems'],
    ['searchPanel', 'Search Panel', '<YSearchPanel', 'searchPanelFields'],
    ['filterTabs', 'Filter Tabs', '<YFilterTabs', 'filterTabItems'],
    ['statusTimeline', 'Status Timeline', '<YStatusTimeline', 'statusTimelineItems'],
    ['reviewWorkflow', 'Review Workflow', '<YReviewWorkflow', 'reviewWorkflowSteps'],
    ['fieldArray', 'Field Array', '<YFieldArray', 'fieldArrayDefaultItem'],
    ['schemaForm', 'Schema Form', '<YSchemaForm', 'schemaFormSchema'],
    ['searchForm', 'Search Form', '<YSearchForm', 'searchFormFields'],
    ['list', 'List', '<YList', 'releaseTasks'],
    ['statistic', 'Statistic', '<YStatistic', 'releaseScore'],
    ['descriptions', 'Descriptions', '<YDescriptions', 'componentDetails'],
    ['virtualList', 'Virtual List', '<YVirtualList', 'virtualListItems'],
    ['tree', 'Tree', '<YTree', 'treeNodes'],
    ['treeSelect', 'Tree Select', '<YTreeSelect', 'treeSelectValue'],
    ['watermark', 'Watermark', '<YWatermark', 'watermarkContent'],
    ['breadcrumb', 'Breadcrumb', '<YBreadcrumb', 'breadcrumbItems'],
    ['backtop', 'Backtop', '<YBacktop', 'backtopVisibilityHeight'],
    ['menu', 'Menu', '<YMenu', 'menuItems'],
    ['anchor', 'Anchor', '<YAnchor', 'anchorItems'],
    ['scrollbar', 'Scrollbar', '<YScrollbar', 'scrollbarItems'],
    ['space', 'Space', '<YSpace', 'spaceItems'],
    ['splitter', 'Splitter', '<YSplitter', 'splitterPanels'],
    ['commandPalette', 'Command Palette', '<YCommandPalette', 'commandPaletteCommands'],
    ['codeBlock', 'Code Block', '<YCodeBlock', 'codeBlockSnippet'],
    ['themeSwitcher', 'Theme Switcher', '<YThemeSwitcher', 'themeSwitcherValue'],
    ['pageHeader', 'Page Header', '<YPageHeader', 'pageHeaderTitle'],
    ['metricCard', 'Metric Card', '<YMetricCard', 'metricCardValue'],
    ['brandHero', 'Brand Hero', '<YBrandHero', 'brandHeroTitle'],
    ['featureGrid', 'Feature Grid', '<YFeatureGrid', 'featureGridItems'],
    ['profileCard', 'Profile Card', '<YProfileCard', 'profileCardTags'],
    ['logoCloud', 'Logo Cloud', '<YLogoCloud', 'logoCloudItems'],
    ['themeProvider', 'Theme Provider', '<YThemeProvider', 'themeProviderTheme']
  ])('opens %s from route query and generates a focused SFC example', async (component, label, tag, scriptNeedle) => {
    window.history.pushState({}, '', `/playground/?component=${component}&theme=yok-candy`)

    const wrapper = mount(PlaygroundWorkbench, {
      global: {
        stubs: componentStubs
      }
    })
    await nextTick()

    const code = wrapper.get('.playground-workbench__code code').text()

    expect(wrapper.attributes('data-theme')).toBe('yok-candy')
    expect(wrapper.get('.playground-workbench__rail button.active').text()).toContain(label)
    expect(code).toContain(tag)
    expect(code).toContain(scriptNeedle)
  })
})
