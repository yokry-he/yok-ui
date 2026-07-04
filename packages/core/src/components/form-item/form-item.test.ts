import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import YFormItem from './YFormItem.vue'

describe('YFormItem', () => {
  it('renders label, hint and slot content', () => {
    const wrapper = mount(YFormItem, {
      props: {
        label: 'Name',
        hint: 'Use a clear component name.',
        required: true
      },
      slots: {
        default: '<input />'
      }
    })

    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('*')
    expect(wrapper.text()).toContain('Use a clear component name.')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders error with alert role', () => {
    const wrapper = mount(YFormItem, {
      props: {
        label: 'Name',
        error: 'Name is required'
      }
    })

    expect(wrapper.get('[role="alert"]').text()).toBe('Name is required')
  })

  it('exposes label and message ids through slot props', () => {
    const wrapper = mount(YFormItem, {
      props: {
        prop: 'component.name',
        label: 'Name',
        error: 'Name is required'
      },
      slots: {
        default: `<template #default="{ labelFor, messageId, invalid }">
          <input :id="labelFor" :aria-describedby="messageId" :aria-invalid="String(invalid)" />
        </template>`
      }
    })

    expect(wrapper.get('input').attributes('id')).toBe('yok-form-field-component-name')
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('yok-form-message-component-name')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('exposes validation helpers through slot props', async () => {
    const validateField = vi.fn(() => Promise.resolve(true))
    const clearValidate = vi.fn()
    const wrapper = mount(YFormItem, {
      props: {
        prop: 'packages',
        label: 'Packages'
      },
      slots: {
        default: `<template #default="{ validate, clearValidate }">
          <button class="validate" type="button" @click="validate('change')">Validate</button>
          <button class="clear" type="button" @click="clearValidate()">Clear</button>
        </template>`
      },
      global: {
        provide: {
          yokForm: {
            labelWidth: '',
            getFieldError: () => '',
            registerField: () => undefined,
            unregisterField: () => undefined,
            validateField,
            clearValidate,
            scrollToField: () => false
          }
        }
      }
    })

    await wrapper.get('.validate').trigger('click')
    await wrapper.get('.clear').trigger('click')

    expect(validateField).toHaveBeenCalledWith('packages', 'change')
    expect(clearValidate).toHaveBeenCalledWith('packages')
  })
})
