import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleSourcePanel from './LiveExampleSourcePanel.vue'

const sourcePanelProps = {
  sourcePanelMode: 'sfc',
  sourcePanelModeLabel: '完整 SFC',
  sourcePanelOptions: [
    { value: 'sfc', label: '完整 SFC' },
    { value: 'template', label: 'Template' },
    { value: 'diff', label: 'Diff' },
    { value: 'install', label: 'Install' },
    { value: 'repro', label: 'Repro bundle' }
  ],
  showSourceLanguageSwitch: true,
  sourceLanguageMode: 'ts',
  sourceLanguageOptions: [
    { value: 'ts', label: 'TS' },
    { value: 'js', label: 'JS' }
  ],
  copiedSourcePanel: false,
  sourceDiffSummary: {
    added: 2,
    removed: 1,
    unchanged: 8
  },
  installPackageManager: 'pnpm',
  installPackageManagerOptions: [
    { value: 'npm', label: 'npm' },
    { value: 'pnpm', label: 'pnpm' }
  ],
  sourcePanelCode: [
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    '</script>',
    '<template>',
    '  <ybutton>Ship</ybutton>',
    '</template>'
  ].join('\n')
} as const

describe('LiveExampleSourcePanel', () => {
  it('renders the source code and emits source view updates', async () => {
    const wrapper = mount(LiveExampleSourcePanel, {
      props: sourcePanelProps
    })

    expect(wrapper.get('#live-example-source-panel').attributes('aria-label')).toBe('Formatted source code')
    expect(wrapper.get('#live-example-source-panel').attributes('tabindex')).toBe('-1')
    expect(wrapper.get('.live-example-runner__source-code').attributes('data-language')).toBe('ts')
    expect(wrapper.get('.live-example-runner__source-code').text()).toContain('<ybutton>Ship</ybutton>')
    expect(wrapper.findAll('.live-example-runner__source-line-number').map((line) => line.text())).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6'
    ])
    expect(wrapper.findAll('.live-example-runner__source-token--tag').some((token) => token.text().includes('script'))).toBe(true)
    expect(wrapper.findAll('.live-example-runner__source-token--keyword').some((token) => token.text() === 'import')).toBe(true)
    expect(wrapper.findAll('.live-example-runner__source-token--component').some((token) => token.text().includes('ybutton'))).toBe(true)

    const templateTab = wrapper
      .findAll('.live-example-runner__source-tab')
      .find((item) => item.text() === 'Template')

    await templateTab?.trigger('click')

    expect(wrapper.emitted('update:sourcePanelMode')).toEqual([['template']])
  })

  it('emits language, package manager and copy actions', async () => {
    const wrapper = mount(LiveExampleSourcePanel, {
      props: {
        ...sourcePanelProps,
        sourcePanelMode: 'install',
        sourcePanelModeLabel: 'Install',
        showSourceLanguageSwitch: true
      }
    })

    const jsButton = wrapper
      .findAll('.live-example-runner__source-language')
      .find((item) => item.text() === 'JS')
    const npmButton = wrapper
      .findAll('.live-example-runner__package-manager')
      .find((item) => item.text() === 'npm')

    await jsButton?.trigger('click')
    await npmButton?.trigger('click')
    await wrapper.get('.live-example-runner__source-copy').trigger('click')

    expect(wrapper.emitted('update:sourceLanguageMode')).toEqual([['js']])
    expect(wrapper.emitted('update:installPackageManager')).toEqual([['npm']])
    expect(wrapper.emitted('copy-source')).toHaveLength(1)
  })

  it('exposes an Element Plus style compact source toolbar in the code panel header', async () => {
    const wrapper = mount(LiveExampleSourcePanel, {
      props: sourcePanelProps
    })

    expect(wrapper.get('#live-example-source-panel').attributes('data-source-panel')).toBe('element-plus')
    expect(wrapper.find('.live-example-runner__source-header').exists()).toBe(false)
    expect(wrapper.find('.live-example-runner__source-handoff').exists()).toBe(false)
    expect(wrapper.find('.live-example-runner__source-help').exists()).toBe(false)
    expect(wrapper.get('.live-example-runner__source-code-shell').attributes('data-source-panel')).toBe('element-plus')
    expect(wrapper.get('.live-example-runner__source-modebar').attributes('data-source-placement')).toBe('code-top-left')
    expect(wrapper.findAll('.live-example-runner__source-tab').map((item) => item.text())).toEqual([
      '完整 SFC',
      'Template',
      'Diff',
      'Install',
      'Repro bundle'
    ])
    expect(wrapper.get('.live-example-runner__source-code-shell > .live-example-runner__source-chrome').attributes('data-source-placement')).toBe('code-top-right')
    expect(wrapper.get('.live-example-runner__source-code-shell > .live-example-runner__source-code').exists()).toBe(true)

    const chrome = wrapper.get('.live-example-runner__source-chrome')
    const tools = wrapper.get('.live-example-runner__source-tools')
    const actions = wrapper
      .findAll('[data-live-source-action]')
      .map((item) => item.attributes('data-live-source-action'))

    expect(chrome.attributes('aria-label')).toBe('Element style source actions')
    expect(chrome.attributes('data-source-placement')).toBe('code-top-right')
    expect(tools.attributes('aria-label')).toBe('Source panel actions')
    expect(actions).toEqual([
      'language-ts',
      'language-js',
      'copy-source',
      'hide-source'
    ])
    expect(wrapper.find('[data-live-source-action="source-file"]').exists()).toBe(false)
    expect(wrapper.get('[data-live-source-action="copy-source"]').attributes('data-tooltip')).toBe('复制源码')
    expect(wrapper.get('[data-live-source-action="copy-source"]').attributes('title')).toBe('复制源码')
    expect(wrapper.get('[data-live-source-action="copy-source"] .live-example-runner__source-tool-glyph').attributes('data-icon')).toBe('copy')
    expect(wrapper.get('[data-live-source-action="copy-source"] .live-example-runner__source-tool-glyph').text()).toBe('')
    expect(wrapper.get('[data-live-source-action="copy-source"] .live-example-runner__source-tool-text').text()).toBe('Copy source')
    expect(wrapper.get('[data-live-source-action="hide-source"]').attributes('data-tooltip')).toBe('隐藏源码')
    expect(wrapper.get('[data-live-source-action="hide-source"]').attributes('title')).toBe('隐藏源码')
    expect(wrapper.get('[data-live-source-action="hide-source"]').attributes('aria-controls')).toBe('live-example-source-panel')
    expect(wrapper.get('[data-live-source-action="hide-source"] .live-example-runner__source-tool-glyph').attributes('data-icon')).toBe('code')
    expect(wrapper.get('[data-live-source-action="hide-source"] .live-example-runner__source-tool-glyph').text()).toBe('')
    expect(wrapper.get('[data-live-source-action="hide-source"] .live-example-runner__source-tool-text').text()).toBe('Hide source')
    await wrapper.get('[data-live-source-action="copy-source"]').trigger('click')
    await wrapper.get('[data-live-source-action="hide-source"]').trigger('click')

    expect(wrapper.emitted('copy-source')).toHaveLength(1)
    expect(wrapper.emitted('hide-source')).toHaveLength(1)
  })

  it('offers an Element Plus style bottom hide-source action', async () => {
    const wrapper = mount(LiveExampleSourcePanel, {
      props: sourcePanelProps
    })

    const footer = wrapper.get('.live-example-runner__source-footer')
    const collapse = wrapper.get('.live-example-runner__source-collapse')

    expect(footer.attributes('aria-label')).toBe('Source panel footer')
    expect(footer.attributes('data-source-placement')).toBe('bottom-collapse')
    expect(collapse.attributes('aria-label')).toBe('隐藏源代码')
    expect(collapse.attributes('aria-controls')).toBe('live-example-source-panel')
    expect(collapse.attributes('aria-expanded')).toBe('false')
    expect(collapse.text()).toContain('隐藏源代码')
    expect(collapse.find('.live-example-runner__source-collapse-icon').exists()).toBe(true)

    await collapse.trigger('click')

    expect(wrapper.emitted('hide-source')).toHaveLength(1)
  })
})
