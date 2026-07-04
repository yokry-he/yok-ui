import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleEditorPanel from './LiveExampleEditorPanel.vue'

const validationIssue = {
  kind: 'attribute',
  templateLine: 2,
  sourceLine: 2,
  excerpt: '<YButton @click="save">Save</YButton>',
  suggestion: 'Live examples only allow documented safe attributes.'
} as const

describe('LiveExampleEditorPanel', () => {
  it('renders editable source, line numbers and emits editor actions', async () => {
    const wrapper = mount(LiveExampleEditorPanel, {
      props: {
        modelValue: '<template>\\n  <YButton>Save</YButton>\\n</template>',
        lineNumbers: [1, 2, 3],
        editorScrollTop: 24,
        liveStats: {
          lines: 3,
          status: 'Edited'
        },
        validationIssue,
        copiedDiagnostic: false
      }
    })

    expect(wrapper.get('.live-example-runner__editor').attributes('aria-label')).toBe('Editable SFC source editor')
    expect(wrapper.text()).toContain('Editable SFC')
    expect(wrapper.text()).toContain('3 lines · Edited')
    expect(wrapper.get('.live-example-runner__line-gutter').attributes('style')).toContain('translateY(-24px)')
    expect(wrapper.get('.live-example-runner__line-gutter li[data-active="true"]').text()).toBe('2')
    expect(wrapper.get('textarea').element.value).toContain('<YButton>Save</YButton>')

    await wrapper.get('textarea').setValue('<template>Updated</template>')
    await wrapper.get('textarea').trigger('scroll')
    await wrapper.findAll('.live-example-runner__editor-actions button')[0].trigger('click')
    await wrapper.findAll('.live-example-runner__editor-actions button')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['<template>Updated</template>'])
    expect(wrapper.emitted('editor-scroll')).toHaveLength(1)
    expect(wrapper.emitted('focus-validation-line')).toHaveLength(1)
    expect(wrapper.emitted('copy-diagnostic-snippet')).toHaveLength(1)
  })

  it('disables diagnostic actions when no validation issue exists', () => {
    const wrapper = mount(LiveExampleEditorPanel, {
      props: {
        modelValue: '<template>Clean</template>',
        lineNumbers: [1],
        editorScrollTop: 0,
        liveStats: {
          lines: 1,
          status: 'Stable'
        },
        validationIssue: null,
        copiedDiagnostic: true
      }
    })

    expect(wrapper.findAll('.live-example-runner__editor-actions button').every((button) => button.attributes('disabled') !== undefined)).toBe(true)
    expect(wrapper.find('.live-example-runner__line-gutter li[data-active="true"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('已复制诊断')
  })
})
