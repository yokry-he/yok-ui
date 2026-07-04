import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExamplePreviewPanel from './LiveExamplePreviewPanel.vue'

const validationIssue = {
  kind: 'attribute',
  templateLine: 1,
  sourceLine: 2,
  excerpt: '<YButton @click="save">Save</YButton>',
  suggestion: '删除事件绑定，Live runner 只渲染安全展示模板。'
} as const

describe('LiveExamplePreviewPanel', () => {
  it('renders preview status, image action, stage and slot content', async () => {
    const wrapper = mount(LiveExamplePreviewPanel, {
      props: {
        previewViewport: 'mobile',
        previewViewportLabel: 'Mobile',
        previewNotice: 'Ready',
        showImagePreviewAction: true,
        validationError: '',
        validationIssue: null,
        copiedDiagnostic: false
      },
      slots: {
        default: '<button class="preview-action">Preview action</button>'
      }
    })

    expect(wrapper.get('.live-example-runner__preview').text()).toContain('Preview · Mobile')
    expect(wrapper.get('[role="status"]').text()).toBe('Ready')
    expect(wrapper.get('.live-example-runner__preview-action').text()).toBe('打开预览')
    expect(wrapper.get('.live-example-runner__stage').classes()).toContain('live-example-runner__stage--mobile')
    expect(wrapper.get('.preview-action').text()).toBe('Preview action')

    await wrapper.get('.live-example-runner__preview-action').trigger('click')
    await wrapper.get('.live-example-runner__frame').trigger('click')

    expect(wrapper.emitted('open-image-preview')).toHaveLength(1)
    expect(wrapper.emitted('preview-frame-click')).toHaveLength(1)
  })

  it('renders validation diagnostics and emits diagnostic actions', async () => {
    const wrapper = mount(LiveExamplePreviewPanel, {
      props: {
        previewViewport: 'auto',
        previewViewportLabel: 'Auto',
        previewNotice: '示例无法运行',
        showImagePreviewAction: false,
        validationError: '当前运行器只支持安全的展示模板。',
        validationIssue,
        copiedDiagnostic: true
      }
    })

    expect(wrapper.get('.live-example-runner__error').attributes('role')).toBe('alert')
    expect(wrapper.get('.live-example-runner__error').text()).toContain('示例无法运行')
    expect(wrapper.get('.live-example-runner__error').text()).toContain('template 第 1 行')
    expect(wrapper.get('.live-example-runner__error').text()).toContain('SFC 第 2 行')
    expect(wrapper.get('.live-example-runner__error code').text()).toBe(validationIssue.excerpt)
    expect(wrapper.get('.live-example-runner__stage').classes()).toContain('live-example-runner__stage--stale')
    expect(wrapper.find('.live-example-runner__preview-action').exists()).toBe(false)
    expect(wrapper.findAll('.live-example-runner__diagnostic-actions button')[1].text()).toBe('已复制诊断')

    await wrapper.findAll('.live-example-runner__diagnostic-actions button')[0].trigger('click')
    await wrapper.findAll('.live-example-runner__diagnostic-actions button')[1].trigger('click')

    expect(wrapper.emitted('focus-validation-line')).toHaveLength(1)
    expect(wrapper.emitted('copy-diagnostic-snippet')).toHaveLength(1)
  })
})
