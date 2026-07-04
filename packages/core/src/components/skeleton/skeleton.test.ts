import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSkeleton from './YSkeleton.vue'

describe('YSkeleton', () => {
  it('renders text skeleton rows with a decorative default', () => {
    const wrapper = mount(YSkeleton, {
      props: {
        rows: 3
      }
    })

    expect(wrapper.classes()).toContain('yok-skeleton--text')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.findAll('.yok-skeleton__line')).toHaveLength(3)
  })

  it('clamps text rows to keep loading states compact', () => {
    const wrapper = mount(YSkeleton, {
      props: {
        rows: 24
      }
    })

    expect(wrapper.findAll('.yok-skeleton__line')).toHaveLength(8)
  })

  it('supports labeled status skeletons', () => {
    const wrapper = mount(YSkeleton, {
      props: {
        label: 'Loading profile',
        variant: 'circle'
      }
    })

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Loading profile')
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
    expect(wrapper.find('.yok-skeleton__block').exists()).toBe(true)
  })

  it('exposes custom dimensions through css variables', () => {
    const wrapper = mount(YSkeleton, {
      props: {
        variant: 'rect',
        width: '280px',
        height: '120px',
        animated: false
      }
    })

    expect(wrapper.attributes('style')).toContain('--yok-skeleton-width: 280px')
    expect(wrapper.attributes('style')).toContain('--yok-skeleton-height: 120px')
    expect(wrapper.classes()).not.toContain('yok-skeleton--animated')
  })
})
