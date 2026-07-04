import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YIcon from './YIcon.vue'

const svgSlot = '<svg viewBox="0 0 16 16"><path d="M8 1 15 15H1z" /></svg>'

describe('YIcon', () => {
  it('renders slotted svg as a decorative icon by default', () => {
    const wrapper = mount(YIcon, {
      slots: {
        default: svgSlot
      }
    })

    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('exposes an accessible image name when label is provided', () => {
    const wrapper = mount(YIcon, {
      props: {
        label: 'Upload status'
      },
      slots: {
        default: svgSlot
      }
    })

    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Upload status')
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
  })

  it('normalizes numeric size and keeps the icon from shrinking', () => {
    const wrapper = mount(YIcon, {
      props: {
        size: 28,
        color: '#0f766e'
      }
    })

    expect(wrapper.attributes('style')).toContain('--yok-icon-size: 28px')
    expect(wrapper.attributes('style')).toContain('color: #0f766e')
  })

  it('marks spinning icons with a stable class', () => {
    const wrapper = mount(YIcon, {
      props: {
        spinning: true
      }
    })

    expect(wrapper.classes()).toContain('yok-icon--spinning')
  })
})
