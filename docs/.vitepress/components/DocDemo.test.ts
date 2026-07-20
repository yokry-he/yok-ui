import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import DocDemo from './DocDemo.vue'

describe('DocDemo', () => {
  it('keeps the example toolbar aligned with Element Plus style actions', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn()
      }
    })
    window.history.pushState({}, '', '/components/upload')

    const wrapper = mount(DocDemo, {
      props: {
        title: 'Upload queue',
        description: 'Upload files with validation and request handoff.',
        setup: [
          "import { YUpload } from '@yok-ui/core'",
          '',
          'const files = []'
        ].join('\n'),
        code: '<YUpload v-model="files" />',
        jsCode: '<YUpload v-model="files" />',
        source: 'https://github.com/yok-ui/yok-ui/blob/main/packages/core/src/components/upload/YUpload.vue'
      },
      slots: {
        default: '<div>Upload preview</div>'
      }
    })

    expect(wrapper.get('.doc-demo__tools').attributes('aria-label')).toBe('示例操作')
    expect(wrapper.findAll('[data-demo-language]').map((button) => button.text())).toEqual(['TS', 'JS'])
    expect(wrapper.findAll('[data-demo-action]').map((item) => item.attributes('data-demo-action'))).toEqual([
      'copy',
      'toggle-source'
    ])
    expect(wrapper.find('[data-demo-action="source-file"]').exists()).toBe(false)
    expect(wrapper.get('[data-demo-action="copy"] .doc-demo__tool-glyph').attributes('data-icon')).toBe('copy')
    expect(wrapper.get('[data-demo-action="copy"] .doc-demo__tool-glyph').text()).toBe('')
    expect(wrapper.get('[data-demo-action="copy"] .doc-demo__tool-text').text()).toBe('Copy code')
    expect(wrapper.get('[data-demo-action="toggle-source"] .doc-demo__tool-glyph').attributes('data-icon')).toBe('code')
    expect(wrapper.get('[data-demo-action="toggle-source"] .doc-demo__tool-glyph').text()).toBe('')
    expect(wrapper.get('[data-demo-action="toggle-source"]').attributes('aria-label')).toBe('查看源代码')
    expect(wrapper.get('[data-demo-action="toggle-source"]').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('.doc-demo__source-state').text()).toBe('查看源代码')

    await wrapper.get('[data-demo-action="toggle-source"]').trigger('click')

    expect(wrapper.get('[data-demo-action="toggle-source"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-demo-action="toggle-source"]').attributes('aria-label')).toBe('隐藏源代码')
    expect(wrapper.get('.doc-demo__source-state').text()).toBe('隐藏源代码')
    expect(wrapper.get('.doc-demo__code').attributes('data-language')).toBe('TS')
    expect(wrapper.get('.doc-demo__code > .doc-demo__source-bar').attributes('data-source-placement')).toBe('code-top-right')

    await wrapper.get('[data-demo-language="JS"]').trigger('click')

    expect(wrapper.get('.doc-demo__code').attributes('data-language')).toBe('JS')
    expect(wrapper.get('[data-demo-language="JS"]').attributes('aria-selected')).toBe('true')

    await wrapper.get('[data-demo-action="copy"]').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith([
      '<script setup>',
      "import { YUpload } from '@yok-ui/core'",
      '',
      'const files = []',
      '</' + 'script>',
      '',
      '<template>',
      '  <YUpload v-model="files" />',
      '</template>'
    ].join('\n'))
    expect(wrapper.get('[data-demo-action="copy"]').attributes('data-tooltip')).toBe('已复制')
  })

  it('renders an Element Plus style example block with copy and source toggle actions', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn()
      }
    })
    window.history.pushState({}, '', '/components/select')

    const wrapper = mount(DocDemo, {
      props: {
        title: 'Basic usage',
        description: 'Use v-model to bind the selected option.',
        setup: [
          "import { ref } from 'vue'",
          "import { YSelect } from '@yok-ui/core'",
          '',
          "const value = ref('core')"
        ].join('\n'),
        code: '<YSelect v-model="value" />',
        jsCode: '<YSelect v-model="value" />'
      },
      slots: {
        default: '<div class="demo-preview-target">Select preview</div>'
      }
    })

    expect(wrapper.get('.doc-demo').attributes('id')).toBe('demo-basic-usage')
    expect(wrapper.get('.doc-demo').attributes('data-demo-id')).toBe('demo-basic-usage')
    expect(wrapper.get('.doc-demo').attributes('aria-label')).toBe('Basic usage')
    expect(wrapper.find('.doc-demo__intro').exists()).toBe(false)
    expect(wrapper.find('.doc-demo__permalink').exists()).toBe(false)
    expect(wrapper.get('.doc-demo__preview').text()).toContain('Select preview')
    expect(wrapper.find('.doc-demo__code').exists()).toBe(false)
    expect(wrapper.get('.doc-demo__shell > .doc-demo__source-bar').attributes('data-source-placement')).toBe('preview-bottom')
    expect(wrapper.get('.doc-demo__actions').attributes('aria-label')).toBe('示例操作')
    expect(wrapper.findAll('[data-demo-action]').map((item) => item.attributes('data-demo-action'))).toEqual([
      'copy',
      'toggle-source'
    ])
    expect(wrapper.find('[data-demo-action="source-file"]').exists()).toBe(false)
    expect(wrapper.get('.doc-demo__copy').attributes('data-tooltip')).toBe('复制代码')
    expect(wrapper.findAll('.doc-demo__language').map((button) => button.text())).toEqual(['TS', 'JS'])
    expect(wrapper.find('.doc-demo__collapse').exists()).toBe(false)
    expect(wrapper.get('.doc-demo__shell').attributes('data-source-open')).toBe('false')

    await wrapper.get('.doc-demo__toggle').trigger('click')

    expect(wrapper.find('.doc-demo__shell > .doc-demo__source-bar').exists()).toBe(false)
    expect(wrapper.get('.doc-demo__shell').attributes('data-source-open')).toBe('true')
    expect(wrapper.get('.doc-demo__code > .doc-demo__source-bar').attributes('data-source-placement')).toBe('code-top-right')
    expect(wrapper.get('.doc-demo__source-meta').attributes('data-source-language')).toBe('TS')
    expect(wrapper.get('.doc-demo__source-meta').attributes('data-source-lines')).toBe('10')
    expect(wrapper.get('.doc-demo__source-meta').attributes('aria-label')).toBe('Vue SFC source, TS, 10 lines')
    expect(wrapper.get('.doc-demo__source-meta').text()).toContain('SFC')
    expect(wrapper.get('.doc-demo__source-meta').text()).toContain('/')
    expect(wrapper.get('.doc-demo__source-meta').text()).toContain('TS')
    expect(wrapper.get('.doc-demo__source-meta').text()).toContain('10 lines')
    expect(wrapper.get('.doc-demo__code').text()).toContain('<script setup lang="ts">')
    expect(wrapper.get('.doc-demo__code').text()).toContain("import { ref } from 'vue'")
    expect(wrapper.get('.doc-demo__code').text()).toContain('<template>')
    expect(wrapper.get('.doc-demo__code').text()).toContain('<YSelect')
    expect(wrapper.findAll('.doc-demo__line-number').map((line) => line.text())).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10'
    ])
    expect(wrapper.findAll('.doc-demo__token--tag').some((token) => token.text().includes('script'))).toBe(true)
    expect(wrapper.findAll('.doc-demo__token--keyword').some((token) => token.text() === 'import')).toBe(true)
    expect(wrapper.findAll('.doc-demo__token--component').some((token) => token.text().includes('YSelect'))).toBe(true)
    expect(wrapper.get('.doc-demo__toggle').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('.doc-demo__toggle').attributes('data-tooltip')).toBe('隐藏源代码')
    expect(wrapper.get('.doc-demo__collapse').text()).toContain('隐藏源代码')

    await wrapper
      .findAll('.doc-demo__language')
      .find((button) => button.text() === 'JS')
      ?.trigger('click')
    expect(wrapper.get('.doc-demo__source-meta').attributes('data-source-language')).toBe('JS')
    await wrapper.get('.doc-demo__copy').trigger('click')

    expect(wrapper.get('.doc-demo__language[aria-pressed="true"]').text()).toBe('JS')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith([
      '<script setup>',
      "import { ref } from 'vue'",
      "import { YSelect } from '@yok-ui/core'",
      '',
      "const value = ref('core')",
      '</' + 'script>',
      '',
      '<template>',
      '  <YSelect v-model="value" />',
      '</template>'
    ].join('\n'))
    expect(wrapper.get('.doc-demo__copy').text()).toContain('已复制')

    await wrapper.get('.doc-demo__collapse').trigger('click')

    expect(wrapper.find('.doc-demo__code').exists()).toBe(false)
    expect(wrapper.get('.doc-demo__toggle').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('.doc-demo__shell').attributes('data-source-open')).toBe('false')
  })

  it('uses an Element Plus style source panel contract for copy and source inspection', async () => {
    window.history.pushState({}, '', '/components/select')

    const wrapper = mount(DocDemo, {
      props: {
        title: 'Element Plus source panel',
        setup: "import { YSelect } from '@yok-ui/core'",
        code: '<YSelect label="Package" />'
      },
      slots: {
        default: '<div>Select preview</div>'
      }
    })

    expect(wrapper.get('.doc-demo__shell > .doc-demo__source-bar').attributes('data-source-placement')).toBe(
      'preview-bottom'
    )

    await wrapper.get('[data-demo-action="toggle-source"]').trigger('click')

    const sourcePanel = wrapper.get('.doc-demo__code')
    const sourceToolbar = wrapper.get('.doc-demo__code > .doc-demo__source-bar')
    const sourceFooter = wrapper.get('.doc-demo__collapse')

    expect(sourcePanel.attributes('data-source-panel')).toBe('element-plus')
    expect(sourceToolbar.attributes('data-source-placement')).toBe('code-top-right')
    expect(sourceToolbar.attributes('data-source-chrome')).toBe('floating-right')
    expect(sourceToolbar.get('.doc-demo__source-meta').attributes('data-source-kind')).toBe('vue-sfc')
    expect(sourceToolbar.get('.doc-demo__source-meta').text()).toContain('SFC')
    expect(sourceToolbar.findAll('[data-demo-action]').map((item) => item.attributes('data-demo-action'))).toEqual([
      'copy',
      'toggle-source'
    ])
    expect(sourceFooter.attributes('data-source-placement')).toBe('bottom-collapse')
    expect(sourceFooter.text()).toContain('隐藏源代码')
  })

  it('keeps opened example source actions in an Element Plus style floating chrome', async () => {
    window.history.pushState({}, '', '/components/select')

    const wrapper = mount(DocDemo, {
      props: {
        title: 'Floating source chrome',
        setup: "import { YSelect } from '@yok-ui/core'",
        code: '<YSelect />'
      },
      slots: {
        default: '<div>Select preview</div>'
      }
    })

    expect(wrapper.get('.doc-demo__shell > .doc-demo__source-bar').attributes('data-source-chrome')).toBe(
      'inline-bottom'
    )

    await wrapper.get('[data-demo-action="toggle-source"]').trigger('click')

    const sourceToolbar = wrapper.get('.doc-demo__code > .doc-demo__source-bar')

    expect(sourceToolbar.attributes('data-source-placement')).toBe('code-top-right')
    expect(sourceToolbar.attributes('data-source-chrome')).toBe('floating-right')
    expect(sourceToolbar.get('.doc-demo__source-actions').attributes('data-source-action-layout')).toBe(
      'element-plus-compact'
    )
    expect(sourceToolbar.findAll('.doc-demo__tool-text').map((item) => item.text())).toEqual([
      'Copy code',
      'Toggle source'
    ])
    expect(sourceToolbar.findAll('.doc-demo__source-state--inline')).toHaveLength(1)
  })

  it('links static example source controls to the code panel and preserves keyboard focus', async () => {
    const scrollIntoView = vi.fn()
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView
    })

    try {
      window.history.pushState({}, '', '/components/select')

      const wrapper = mount(DocDemo, {
        props: {
          title: 'Keyboard source flow',
          setup: "import { YSelect } from '@yok-ui/core'",
          code: '<YSelect />'
        },
        slots: {
          default: '<div>Select preview</div>'
        },
        attachTo: document.body
      })

      const toggle = wrapper.get<HTMLElement>('[data-demo-action="toggle-source"]')

      expect(toggle.attributes('aria-controls')).toBe('demo-keyboard-source-flow-source-panel')
      expect(toggle.attributes('aria-expanded')).toBe('false')

      await toggle.trigger('click')
      await nextTick()

      const codePanel = wrapper.get<HTMLElement>('#demo-keyboard-source-flow-source-panel')
      const activeToggle = wrapper.get<HTMLElement>('[data-demo-action="toggle-source"]')
      const collapse = wrapper.get<HTMLElement>('.doc-demo__collapse')

      expect(codePanel.attributes('tabindex')).toBe('-1')
      expect(activeToggle.attributes('aria-controls')).toBe('demo-keyboard-source-flow-source-panel')
      expect(activeToggle.attributes('aria-expanded')).toBe('true')
      expect(collapse.attributes('aria-controls')).toBe('demo-keyboard-source-flow-source-panel')
      expect(collapse.attributes('aria-expanded')).toBe('false')
      expect(scrollIntoView).toHaveBeenCalledWith({
        block: 'start',
        behavior: 'smooth'
      })
      expect(document.activeElement).toBe(codePanel.element)

      await collapse.trigger('click')
      await nextTick()

      const restoredToggle = wrapper.get<HTMLElement>('[data-demo-action="toggle-source"]')

      expect(wrapper.find('#demo-keyboard-source-flow-source-panel').exists()).toBe(false)
      expect(restoredToggle.attributes('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(restoredToggle.element)
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

  it('accepts an explicit example id for stable docs and API deep links', () => {
    window.history.pushState({}, '', '/components/select')

    const wrapper = mount(DocDemo, {
      props: {
        title: 'Remote search',
        id: 'remote-search-select',
        description: 'Search options remotely.',
        setup: "import { YSelect } from '@yok-ui/core'",
        code: '<YSelect filterable remote />'
      },
      slots: {
        default: '<div>Remote select preview</div>'
      }
    })

    expect(wrapper.get('.doc-demo').attributes('id')).toBe('remote-search-select')
    expect(wrapper.get('.doc-demo').attributes('data-demo-id')).toBe('remote-search-select')
    expect(wrapper.get('.doc-demo').attributes('aria-label')).toBe('Remote search')
    expect(wrapper.find('.doc-demo__intro').exists()).toBe(false)
    expect(wrapper.find('.doc-demo__permalink').exists()).toBe(false)
  })

  it('falls back to legacy selection when demo code clipboard writes are blocked', async () => {
    let copiedLegacyValue = ''
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('blocked'))
      }
    })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn(() => {
        copiedLegacyValue = (document.activeElement as HTMLTextAreaElement | null)?.value ?? ''
        return true
      })
    })
    window.history.pushState({}, '', '/components/select')

    const wrapper = mount(DocDemo, {
      props: {
        title: 'Copy fallback',
        setup: "import { YSelect } from '@yok-ui/core'",
        code: '<YSelect />'
      },
      slots: {
        default: '<div>Select preview</div>'
      }
    })

    await wrapper.get('.doc-demo__copy').trigger('click')
    await Promise.resolve()
    await nextTick()

    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(copiedLegacyValue).toContain('<script setup lang="ts">')
    expect(copiedLegacyValue).toContain('<YSelect />')
    expect(wrapper.get('.doc-demo__copy').text()).toContain('已复制')
  })

  it('falls back when demo code clipboard writes stay pending', async () => {
    vi.useFakeTimers()
    let copiedLegacyValue = ''
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn(() => new Promise(() => {}))
      }
    })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn(() => {
        copiedLegacyValue = (document.activeElement as HTMLTextAreaElement | null)?.value ?? ''
        return true
      })
    })
    window.history.pushState({}, '', '/components/select')

    const wrapper = mount(DocDemo, {
      props: {
        title: 'Pending clipboard',
        setup: "import { YSelect } from '@yok-ui/core'",
        code: '<YSelect />'
      },
      slots: {
        default: '<div>Select preview</div>'
      }
    })

    const copyAction = wrapper.get('.doc-demo__copy').trigger('click')

    await vi.advanceTimersByTimeAsync(500)
    await copyAction

    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(copiedLegacyValue).toContain('<YSelect />')
    expect(wrapper.get('.doc-demo__copy').text()).toContain('已复制')

    vi.useRealTimers()
  })

  it('keeps setup code when a demo passes a complete template block', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn()
      }
    })
    window.history.pushState({}, '', '/components/button')

    const wrapper = mount(DocDemo, {
      props: {
        title: 'Template block',
        setup: [
          "import { YButton } from '@yok-ui/core'",
          '',
          "const label = 'Publish'"
        ].join('\n'),
        code: [
          '<template>',
          '  <YButton>{{ label }}</YButton>',
          '</template>'
        ].join('\n')
      },
      slots: {
        default: '<button>Publish</button>'
      }
    })

    await wrapper.get('.doc-demo__toggle').trigger('click')

    expect(wrapper.get('.doc-demo__code').text()).toContain('<script setup lang="ts">')
    expect(wrapper.get('.doc-demo__code').text()).toContain("import { YButton } from '@yok-ui/core'")
    expect(wrapper.get('.doc-demo__code').text()).toContain("const label = 'Publish'")
    expect(wrapper.get('.doc-demo__code').text()).toContain('<template>')
    expect(wrapper.find('.doc-demo__source').exists()).toBe(false)

    await wrapper.get('.doc-demo__copy').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith([
      '<script setup lang="ts">',
      "import { YButton } from '@yok-ui/core'",
      '',
      "const label = 'Publish'",
      '</' + 'script>',
      '',
      '<template>',
      '  <YButton>{{ label }}</YButton>',
      '</template>'
    ].join('\n'))
  })

  it('wraps snippets that contain slot templates in a root template block', async () => {
    window.history.pushState({}, '', '/components/table')

    const wrapper = mount(DocDemo, {
      props: {
        title: 'Slot table',
        setup: [
          "import { YTable, YTag } from '@yok-ui/core'",
          '',
          'const columns = [{ key: \'status\', label: \'Status\' }]',
          "const rows = [{ id: 'one', status: 'Stable' }]"
        ].join('\n'),
        code: [
          '<YTable :columns="columns" :data="rows">',
          '  <template #cell-status="{ value }">',
          '    <YTag tone="success">{{ value }}</YTag>',
          '  </template>',
          '</YTable>'
        ].join('\n')
      }
    })

    await wrapper.get('.doc-demo__toggle').trigger('click')

    const code = wrapper.get('.doc-demo__code').text()

    expect(code).toContain('<script setup lang="ts">')
    expect(code).toContain('<template>')
    expect(code).toContain('<YTable')
    expect(code).toContain('<template #cell-status="{ value }">')
    expect(code).toContain('</template>')
  })
})
