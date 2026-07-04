import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YProgress from './YProgress.vue'

describe('YProgress', () => {
  it('renders a labeled progressbar with value text', () => {
    const wrapper = mount(YProgress, {
      props: {
        label: 'Upload',
        value: 64
      }
    })

    const progressbar = wrapper.get('[role="progressbar"]')

    expect(wrapper.text()).toContain('Upload')
    expect(wrapper.text()).toContain('64%')
    expect(progressbar.attributes('aria-label')).toBe('Upload')
    expect(progressbar.attributes('aria-valuenow')).toBe('64')
    expect(progressbar.attributes('aria-valuemin')).toBe('0')
    expect(progressbar.attributes('aria-valuemax')).toBe('100')
  })

  it('clamps values to the 0 to 100 range', () => {
    const high = mount(YProgress, {
      props: {
        value: 148
      }
    })
    const low = mount(YProgress, {
      props: {
        value: -20
      }
    })

    expect(high.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
    expect(high.attributes('style')).toContain('--yok-progress-value: 100%')
    expect(low.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
    expect(low.attributes('style')).toContain('--yok-progress-value: 0%')
  })

  it('supports tones, sizes, and striped state', () => {
    const wrapper = mount(YProgress, {
      props: {
        value: 42,
        tone: 'success',
        size: 'lg',
        striped: true
      }
    })

    expect(wrapper.classes()).toContain('yok-progress--success')
    expect(wrapper.classes()).toContain('yok-progress--lg')
    expect(wrapper.classes()).toContain('yok-progress--striped')
  })

  it('can hide the visible value while keeping progressbar semantics', () => {
    const wrapper = mount(YProgress, {
      props: {
        label: 'Syncing',
        value: 35,
        showValue: false
      }
    })

    expect(wrapper.text()).toContain('Syncing')
    expect(wrapper.text()).not.toContain('35%')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('35')
  })
})
