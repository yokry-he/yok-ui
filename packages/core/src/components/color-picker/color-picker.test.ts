import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { YConfigProvider } from '../config-provider'
import YColorPicker from './YColorPicker.vue'
import { isValidHexColor, normalizeColorPresets, normalizeHexColor } from './color-picker'

describe('color picker helpers', () => {
  it('normalizes hex colors and filters presets', () => {
    expect(normalizeHexColor('#abc')).toBe('#AABBCC')
    expect(normalizeHexColor('14b8a6')).toBe('#14B8A6')
    expect(normalizeHexColor('nope')).toBe('')
    expect(isValidHexColor('#F472B6')).toBe(true)
    expect(isValidHexColor('F47')).toBe(true)
    expect(isValidHexColor('#12')).toBe(false)
    expect(normalizeColorPresets(['#abc', '#AABBCC', 'nope', '#38bdf8'])).toEqual(['#AABBCC', '#38BDF8'])
  })

  it('normalizes alpha hex colors when alpha is enabled', () => {
    expect(normalizeHexColor('#14b8a680', true)).toBe('#14B8A680')
    expect(normalizeHexColor('#abcd', true)).toBe('#AABBCCDD')
    expect(normalizeHexColor('#abcd')).toBe('')
  })
})

describe('YColorPicker', () => {
  it('renders label, value and native color input semantics', () => {
    const wrapper = mount(YColorPicker, {
      props: {
        modelValue: '#14b8a6',
        label: 'Accent color'
      }
    })
    const colorInput = wrapper.get('input[type="color"]')

    expect(wrapper.text()).toContain('Accent color')
    expect(wrapper.text()).toContain('#14B8A6')
    expect(colorInput.attributes('aria-invalid')).toBe('false')
    expect(colorInput.attributes('aria-labelledby')).toBeTruthy()
  })

  it('emits normalized values from the native color input', async () => {
    const wrapper = mount(YColorPicker, {
      props: {
        modelValue: '#14B8A6'
      }
    })

    await wrapper.get('input[type="color"]').setValue('#38bdf8')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#38BDF8'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['#38BDF8'])
  })

  it('emits normalized values from text input and ignores invalid text', async () => {
    const wrapper = mount(YColorPicker, {
      props: {
        modelValue: '#14B8A6'
      }
    })
    const textInput = wrapper.get('input[type="text"]')

    await textInput.setValue('#f47')
    await textInput.setValue('invalid')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#FF4477'])
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.text()).toContain('Use a HEX color')
    expect(textInput.attributes('aria-invalid')).toBe('true')
  })

  it('commits presets and exposes pressed state', async () => {
    const wrapper = mount(YColorPicker, {
      props: {
        modelValue: '#38BDF8',
        presets: ['#14B8A6', '#38BDF8']
      }
    })
    const activePreset = wrapper.get('button[aria-label="Select #38BDF8"]')

    expect(activePreset.attributes('aria-pressed')).toBe('true')

    await wrapper.get('button[aria-label="Select #14B8A6"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#14B8A6'])
  })

  it('supports clear, disabled and error state', async () => {
    const wrapper = mount(YColorPicker, {
      props: {
        modelValue: '#14B8A6',
        error: 'Color is required'
      }
    })

    await wrapper.get('button[aria-label="Clear color"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.get('[role="alert"]').text()).toBe('Color is required')
    expect(wrapper.get('input[type="text"]').attributes('aria-invalid')).toBe('true')

    const disabledWrapper = mount(YColorPicker, {
      props: {
        modelValue: '#14B8A6',
        disabled: true
      }
    })

    await disabledWrapper.get('button[aria-label="Select #38BDF8"]').trigger('click')

    expect(disabledWrapper.emitted('update:modelValue')).toBeUndefined()
    expect(disabledWrapper.get('input[type="color"]').attributes('disabled')).toBeDefined()
  })

  it('wires stable ids, describedby and forced invalid metadata for form validation', () => {
    const wrapper = mount(YColorPicker, {
      props: {
        id: 'brand-color',
        label: 'Brand color',
        ariaDescribedby: 'brand-color-help',
        invalid: true,
        error: 'Choose a brand-approved color.'
      }
    })

    const textInput = wrapper.get('input[type="text"]')
    const nativeInput = wrapper.get('input[type="color"]')

    expect(textInput.attributes('id')).toBe('brand-color')
    expect(nativeInput.attributes('id')).toBe('brand-color-native')
    expect(textInput.attributes('aria-invalid')).toBe('true')
    expect(nativeInput.attributes('aria-invalid')).toBe('true')
    expect(textInput.attributes('aria-describedby')).toBe('brand-color-help brand-color-error')
    expect(nativeInput.attributes('aria-describedby')).toBe('brand-color-help brand-color-error')
    expect(wrapper.get('#brand-color-error').attributes('role')).toBe('alert')
  })

  it('supports alpha values, visible trigger text and size variants', async () => {
    const wrapper = mount(YColorPicker, {
      props: {
        modelValue: '#14b8a680',
        showAlpha: true,
        showText: true,
        size: 'large',
        label: 'Overlay color'
      }
    })

    expect(wrapper.classes()).toContain('yok-color-picker--large')
    expect(wrapper.text()).toContain('#14B8A680')
    expect(wrapper.get('.yok-color-picker__trigger-text').text()).toBe('#14B8A680')

    await wrapper.get('input[type="text"]').setValue('#abcd')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#AABBCCDD'])
  })

  it('inherits size and density from config provider while allowing local size overrides', () => {
    const providerWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm', density: 'compact' }, () => h(YColorPicker))
      }
    })

    expect(providerWrapper.get('.yok-color-picker').classes()).toEqual(expect.arrayContaining([
      'yok-color-picker--small',
      'yok-color-picker--compact'
    ]))

    const overrideWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm' }, () => h(YColorPicker, { size: 'large' }))
      }
    })

    expect(overrideWrapper.get('.yok-color-picker').classes()).toContain('yok-color-picker--large')
  })
})
