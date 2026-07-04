import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ExampleSourceActions from './ExampleSourceActions.vue'

describe('ExampleSourceActions', () => {
  it('renders Element Plus style source actions with caller-specific data attributes', async () => {
    const wrapper = mount(ExampleSourceActions, {
      props: {
        actionAttribute: 'data-demo-action',
        languageAttribute: 'data-demo-language',
        activeLanguage: 'ts',
        languageOptions: [
          { label: 'TS', value: 'ts' },
          { label: 'JS', value: 'js' }
        ],
        actions: [
          {
            key: 'playground',
            href: '/playground/?component=select&handoff=demo',
            tooltip: '在 Playground 中编辑',
            label: '在 Playground 中编辑',
            glyph: '',
            icon: 'playground',
            text: 'Playground'
          },
          {
            key: 'copy',
            tooltip: '复制代码',
            label: '复制代码',
            glyph: '',
            icon: 'copy',
            text: 'Copy code'
          }
        ]
      }
    })

    expect(wrapper.get('.example-source-actions').attributes('aria-label')).toBe('示例操作')
    expect(wrapper.findAll('[data-demo-language]').map((item) => item.attributes('data-demo-language'))).toEqual([
      'ts',
      'js'
    ])
    expect(wrapper.get('[data-demo-language="ts"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.findAll('[data-demo-action]').map((item) => item.attributes('data-demo-action'))).toEqual([
      'playground',
      'copy'
    ])
    expect(wrapper.get('[data-demo-action="playground"]').attributes('href')).toBe(
      '/playground/?component=select&handoff=demo'
    )
    expect(wrapper.get('[data-demo-action="playground"]').attributes('data-tooltip')).toBe('在 Playground 中编辑')
    expect(wrapper.get('[data-demo-action="playground"] .example-source-actions__glyph').attributes('data-icon')).toBe('playground')
    expect(wrapper.get('[data-demo-action="playground"] .example-source-actions__glyph').text()).toBe('')
    expect(wrapper.get('[data-demo-action="copy"] .example-source-actions__glyph').attributes('data-icon')).toBe('copy')
    expect(wrapper.get('[data-demo-action="copy"] .example-source-actions__text').text()).toBe('Copy code')

    await wrapper.get('[data-demo-language="js"]').trigger('click')
    await wrapper.get('[data-demo-action="playground"]').trigger('click')
    await wrapper.get('[data-demo-action="copy"]').trigger('click')

    expect(wrapper.emitted('update:language')).toEqual([['js']])
    expect(wrapper.emitted('action')?.map((event) => event[0])).toEqual(['playground', 'copy'])
  })

  it('can prefix language action values for live examples', () => {
    const wrapper = mount(ExampleSourceActions, {
      props: {
        actionAttribute: 'data-live-source-action',
        languageAttribute: 'data-live-source-action',
        languageValuePrefix: 'language-',
        activeLanguage: 'ts',
        languageOptions: [
          { label: 'TS', value: 'ts' },
          { label: 'JS', value: 'js' }
        ],
        actions: [
          {
            key: 'hide-source',
            tooltip: '隐藏源码',
            label: '隐藏源码',
            glyph: '',
            icon: 'code',
            text: 'Hide source'
          }
        ]
      }
    })

    expect(wrapper.findAll('[data-live-source-action]').map((item) => item.attributes('data-live-source-action'))).toEqual([
      'language-ts',
      'language-js',
      'hide-source'
    ])
  })

  it('renders pressed state for mode-like source actions', () => {
    const wrapper = mount(ExampleSourceActions, {
      props: {
        actionAttribute: 'data-playground-code-action',
        activeLanguage: 'ts',
        actions: [
          {
            key: 'mode-edit',
            tooltip: '在 Playground 中编辑',
            label: '在 Playground 中编辑',
            glyph: '',
            icon: 'playground',
            text: '编辑',
            pressed: true
          },
          {
            key: 'mode-source',
            tooltip: '查看源代码',
            label: '查看源代码',
            glyph: '',
            icon: 'code',
            text: '源码',
            pressed: false
          }
        ]
      }
    })

    expect(wrapper.get('[data-playground-code-action="mode-edit"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('[data-playground-code-action="mode-source"]').attributes('aria-pressed')).toBe('false')
  })
})
