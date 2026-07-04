import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { YConfigProvider } from '../config-provider'
import YTextarea from './YTextarea.vue'

describe('YTextarea', () => {
  it('supports v-model and helper text', async () => {
    const wrapper = mount(YTextarea, {
      props: {
        modelValue: 'hello',
        label: 'Description',
        helper: 'Keep it short'
      }
    })

    await wrapper.get('textarea').setValue('yok ui')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yok ui'])
    expect(wrapper.text()).toContain('Keep it short')
  })

  it('supports external form ids and invalid state', () => {
    const wrapper = mount(YTextarea, {
      props: {
        id: 'field-description',
        invalid: true,
        ariaDescribedby: 'field-description-message'
      }
    })

    const textarea = wrapper.get('textarea')
    expect(textarea.attributes('id')).toBe('field-description')
    expect(textarea.attributes('aria-invalid')).toBe('true')
    expect(textarea.attributes('aria-describedby')).toBe('field-description-message')
    expect(wrapper.find('.yok-textarea__error').exists()).toBe(false)
  })

  it('uses config provider size and density when no local size is provided', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'sm',
        density: 'compact'
      },
      slots: {
        default: () => h(YTextarea, { modelValue: 'Compact note' })
      }
    })

    const textarea = wrapper.getComponent(YTextarea)

    expect(textarea.classes()).toContain('yok-textarea--sm')
    expect(textarea.classes()).toContain('yok-textarea--compact')
  })

  it('lets local size override config provider size', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'sm'
      },
      slots: {
        default: () => h(YTextarea, { modelValue: 'Large note', size: 'lg' })
      }
    })

    expect(wrapper.getComponent(YTextarea).classes()).toContain('yok-textarea--lg')
  })
})
