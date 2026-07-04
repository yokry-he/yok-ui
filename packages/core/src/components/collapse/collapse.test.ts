import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YCollapse from './YCollapse.vue'

describe('YCollapse', () => {
  it('toggles panels and emits model updates', async () => {
    const wrapper = mount(YCollapse, {
      props: {
        modelValue: [],
        items: [{ label: 'Usage', value: 'usage', content: 'Use it in docs.' }]
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['usage']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['usage']])
  })

  it('replaces open panels in accordion mode', async () => {
    const wrapper = mount(YCollapse, {
      props: {
        accordion: true,
        modelValue: ['usage'],
        items: [
          { label: 'Usage', value: 'usage', content: 'Use it in docs.' },
          { label: 'API', value: 'api', content: 'Control it with v-model.' }
        ]
      }
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['api']])
    expect(wrapper.findAll('button')[0].attributes('aria-expanded')).toBe('true')
  })

  it('does not emit when disabled panels are activated', async () => {
    const wrapper = mount(YCollapse, {
      props: {
        modelValue: [],
        items: [
          { label: 'Locked', value: 'locked', content: 'Unavailable.', disabled: true }
        ]
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
  })
})
