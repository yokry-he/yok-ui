import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleToolbar from './LiveExampleToolbar.vue'

const toolbarProps = {
  starterOptions: [
    { label: 'Button', value: 'button' },
    { label: 'Input', value: 'input' }
  ],
  selectedPreset: 'button',
  copyModeOptions: [
    { label: '完整 SFC', value: 'sfc' },
    { label: '仅 template', value: 'template' }
  ],
  copyMode: 'sfc',
  sourceLanguageOptions: [
    { label: 'TS', value: 'ts' },
    { label: 'JS', value: 'js' }
  ],
  sourceLanguageMode: 'ts',
  themeOptions: [
    { label: 'Light', name: 'yok-light' },
    { label: 'Candy', name: 'yok-candy' }
  ],
  selectedTheme: 'yok-light',
  previewViewportOptions: [
    { label: '自适应', value: 'auto' },
    { label: '手机', value: 'mobile' }
  ],
  previewViewport: 'auto',
  autoRun: true,
  hasPendingChanges: false,
  canResetCode: false,
  validationError: '',
  showSourcePanel: false,
  hasStoredDraft: false,
  copied: false,
  copiedLabel: '完整 SFC',
  copiedRunReport: false,
  copiedPlaygroundLink: false,
  playgroundHandoffUrl: '/playground/?component=button',
  sourceFileUrl: '/source/?file=packages/core/src/components/button/YButton.vue'
}

describe('LiveExampleToolbar', () => {
  it('keeps Element Plus style source actions in the primary row and moves example settings into a collapsed panel', () => {
    const wrapper = mount(LiveExampleToolbar, {
      props: toolbarProps
    })

    const toolbar = wrapper.get('.live-example-runner__toolbar')
    const primaryRow = toolbar.get('.live-example-runner__toolbar-primary')
    const settings = toolbar.get('details.live-example-runner__toolbar-settings')
    const mainActions = primaryRow.get('.live-example-runner__toolbar-main-actions')
    const secondaryRow = settings.get('.live-example-runner__toolbar-secondary')

    expect(settings.attributes('open')).toBeUndefined()
    expect(settings.get('summary').text()).toContain('示例设置')
    expect(primaryRow.element.children[0]?.classList.contains('live-example-runner__toolbar-main-actions')).toBe(true)
    expect(primaryRow.element.children[1]?.classList.contains('live-example-runner__toolbar-settings')).toBe(true)
    expect(mainActions.find('.live-example-runner__example-actions').exists()).toBe(true)
    expect(mainActions.find('.live-example-runner__viewport').exists()).toBe(false)
    expect(mainActions.find('.live-example-runner__report-copy').exists()).toBe(false)
    expect(secondaryRow.find('.live-example-runner__viewport').exists()).toBe(true)
    expect(secondaryRow.find('.live-example-runner__report-copy').exists()).toBe(true)
    expect(secondaryRow.findAll('.live-example-runner__starter')).toHaveLength(3)
  })

  it('renders live example controls and emits user actions', async () => {
    const wrapper = mount(LiveExampleToolbar, {
      props: toolbarProps
    })

    expect(wrapper.get('.live-example-runner__toolbar').attributes('aria-label')).toBe('Live example controls')
    expect(wrapper.text()).toContain('示例模板')
    expect(wrapper.text()).toContain('复制范围')
    expect(wrapper.text()).toContain('主题预设')
    expect(wrapper.get('.live-example-runner__playground-link').attributes('href')).toBe('/playground/?component=button')
    expect(wrapper.get('.live-example-runner__example-actions').attributes('aria-label')).toBe('Example source actions')
    expect(wrapper.findAll('.live-example-runner__source-language-action').map((button) => button.text())).toEqual([
      'TS',
      'JS'
    ])
    expect(wrapper.findAll('[data-live-toolbar-action]').map((item) => item.attributes('data-live-toolbar-action'))).toEqual([
      'language-ts',
      'language-js',
      'playground',
      'source-file',
      'copy-code',
      'copy-playground-link',
      'reset-code',
      'toggle-source'
    ])
    expect(wrapper.get('.live-example-runner__source-language-action[aria-pressed="true"]').text()).toBe('TS')
    expect(wrapper.get('.live-example-runner__source-action').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('[data-live-toolbar-action="toggle-source"]').attributes('aria-controls')).toBe('live-example-source-panel')
    expect(wrapper.get('[data-live-toolbar-action="toggle-source"]').attributes('data-tooltip')).toBe('查看源码')
    expect(wrapper.get('[data-live-toolbar-action="toggle-source"] .example-source-actions__glyph').attributes('data-icon')).toBe('code')
    expect(wrapper.get('[data-live-toolbar-action="toggle-source"] .example-source-actions__glyph').text()).toBe('')
    expect(wrapper.get('[data-live-toolbar-action="toggle-source"] .example-source-actions__glyph').classes()).toContain('live-example-runner__example-action-glyph')
    expect(wrapper.get('[data-live-toolbar-action="toggle-source"] .example-source-actions__text').classes()).toContain('live-example-runner__example-action-text')
    expect(wrapper.get('[data-live-toolbar-action="copy-code"]').attributes('data-tooltip')).toBe('复制代码')
    expect(wrapper.get('[data-live-toolbar-action="copy-code"] .example-source-actions__glyph').attributes('data-icon')).toBe('copy')
    expect(wrapper.get('[data-live-toolbar-action="copy-code"] .example-source-actions__glyph').text()).toBe('')
    expect(wrapper.get('[data-live-toolbar-action="playground"]').attributes('data-tooltip')).toBe('打开 Playground')
    expect(wrapper.get('[data-live-toolbar-action="playground"] .example-source-actions__glyph').attributes('data-icon')).toBe('playground')
    expect(wrapper.get('[data-live-toolbar-action="playground"] .example-source-actions__glyph').text()).toBe('')
    expect(wrapper.get('[data-live-toolbar-action="source-file"]').attributes('href')).toBe(
      '/source/?file=packages/core/src/components/button/YButton.vue'
    )
    expect(wrapper.get('[data-live-toolbar-action="source-file"]').attributes('data-tooltip')).toBe('查看组件源码')
    expect(wrapper.get('[data-live-toolbar-action="source-file"] .example-source-actions__glyph').attributes('data-icon')).toBe('source')
    expect(wrapper.get('[data-live-toolbar-action="source-file"] .example-source-actions__glyph').text()).toBe('')
    expect(wrapper.get('[data-live-toolbar-action="copy-playground-link"]').attributes('data-tooltip')).toBe('复制导入链接')
    expect(wrapper.get('[data-live-toolbar-action="copy-playground-link"] .example-source-actions__glyph').attributes('data-icon')).toBe('external')
    expect(wrapper.get('[data-live-toolbar-action="copy-playground-link"] .example-source-actions__glyph').text()).toBe('')
    expect(wrapper.get('[data-live-toolbar-action="reset-code"]').attributes('data-tooltip')).toBe('源码未修改')
    expect(wrapper.get('[data-live-toolbar-action="reset-code"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-live-toolbar-action="reset-code"] .example-source-actions__glyph').attributes('data-icon')).toBe('reset')

    await wrapper.findAll('select')[0].setValue('input')
    await wrapper.findAll('select')[1].setValue('template')
    await wrapper.findAll('select')[2].setValue('yok-candy')
    await wrapper.findAll('.live-example-runner__viewport button')[1].trigger('click')
    await wrapper.findAll('.live-example-runner__source-language-action')[1].trigger('click')
    await wrapper.get('[data-live-toolbar-action="toggle-source"]').trigger('click')
    await wrapper.get('[data-live-toolbar-action="copy-code"]').trigger('click')
    await wrapper.get('[data-live-toolbar-action="reset-code"]').trigger('click')
    await wrapper.get('.live-example-runner__report-copy').trigger('click')
    await wrapper.get('[data-live-toolbar-action="playground"]').trigger('click')
    await wrapper.get('[data-live-toolbar-action="copy-playground-link"]').trigger('click')

    expect(wrapper.emitted('update:selectedPreset')).toEqual([['input']])
    expect(wrapper.emitted('apply-starter')).toHaveLength(1)
    expect(wrapper.emitted('update:copyMode')).toEqual([['template']])
    expect(wrapper.emitted('update:selectedTheme')).toEqual([['yok-candy']])
    expect(wrapper.emitted('apply-preview-theme')).toHaveLength(1)
    expect(wrapper.emitted('update:previewViewport')).toEqual([['mobile']])
    expect(wrapper.emitted('update:sourceLanguageMode')).toEqual([['js']])
    expect(wrapper.emitted('toggle-source-panel')).toHaveLength(1)
    expect(wrapper.emitted('copy-code')).toHaveLength(1)
    expect(wrapper.emitted('reset-code')).toBeUndefined()
    expect(wrapper.emitted('copy-run-report')).toHaveLength(1)
    expect(wrapper.emitted('persist-playground-handoff')).toHaveLength(1)
    expect(wrapper.emitted('copy-playground-link')).toHaveLength(1)
  })

  it('reflects run, source and draft states in button labels and disabled states', () => {
    const wrapper = mount(LiveExampleToolbar, {
      props: {
        ...toolbarProps,
        autoRun: false,
        hasPendingChanges: true,
        canResetCode: true,
        showSourcePanel: true,
        hasStoredDraft: true,
        copied: true,
        copiedRunReport: true,
        copiedPlaygroundLink: true
      }
    })

    expect(wrapper.text()).toContain('手动运行')
    expect(wrapper.get('[data-live-toolbar-action="toggle-source"]').attributes('data-tooltip')).toBe('收起源码')
    expect(wrapper.get('[data-live-toolbar-action="copy-code"]').attributes('data-tooltip')).toBe('已复制 完整 SFC')
    expect(wrapper.get('[data-live-toolbar-action="copy-playground-link"]').attributes('data-tooltip')).toBe('已复制导入链接')
    expect(wrapper.get('[data-live-toolbar-action="reset-code"]').attributes('data-tooltip')).toBe('恢复源码')
    expect(wrapper.get('[data-live-toolbar-action="reset-code"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.text()).toContain('已复制报告')
    expect(wrapper.get('.live-example-runner__source-action[aria-expanded="true"]').exists()).toBe(true)
    expect(wrapper.findAll('button').some((button) => button.text() === '运行' && button.attributes('disabled') === '')).toBe(false)
    expect(wrapper.findAll('button').some((button) => button.text() === '清除草稿' && button.attributes('disabled') === '')).toBe(false)
  })

  it('emits reset from the Element Plus style source toolbar when the live example has changes', async () => {
    const wrapper = mount(LiveExampleToolbar, {
      props: {
        ...toolbarProps,
        hasPendingChanges: true,
        canResetCode: true
      }
    })

    await wrapper.get('[data-live-toolbar-action="reset-code"]').trigger('click')

    expect(wrapper.emitted('reset-code')).toHaveLength(1)
  })

  it('keeps reset available after auto run synchronizes the preview but the source differs from starter code', async () => {
    const wrapper = mount(LiveExampleToolbar, {
      props: {
        ...toolbarProps,
        hasPendingChanges: false,
        canResetCode: true
      }
    })

    expect(wrapper.get('[data-live-toolbar-action="reset-code"]').attributes('data-tooltip')).toBe('恢复源码')
    expect(wrapper.get('[data-live-toolbar-action="reset-code"]').attributes('disabled')).toBeUndefined()

    await wrapper.get('[data-live-toolbar-action="reset-code"]').trigger('click')

    expect(wrapper.emitted('reset-code')).toHaveLength(1)
  })
})
