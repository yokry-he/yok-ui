import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YResult from './YResult.vue'

describe('YResult', () => {
  it('renders default info result semantics', () => {
    const wrapper = mount(YResult, {
      props: {
        ariaLabel: 'Operation result'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Operation result')
    expect(wrapper.classes()).toContain('yok-result--info')
    expect(wrapper.text()).toContain('Information')
    expect(wrapper.text()).toContain('There is something worth your attention.')
  })

  it('supports success status with custom title and subtitle', () => {
    const wrapper = mount(YResult, {
      props: {
        status: 'success',
        title: 'Published',
        subtitle: 'The component documentation is live.'
      }
    })

    expect(wrapper.classes()).toContain('yok-result--success')
    expect(wrapper.text()).toContain('Published')
    expect(wrapper.text()).toContain('The component documentation is live.')
  })

  it('supports http-like status presets', () => {
    const wrapper = mount(YResult, {
      props: {
        status: '404'
      }
    })

    expect(wrapper.classes()).toContain('yok-result--info')
    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('The page you are looking for does not exist.')
  })

  it('supports icon and extra slots', () => {
    const wrapper = mount(YResult, {
      props: {
        status: 'warning'
      },
      slots: {
        icon: '<span>?</span>',
        extra: '<button type="button">Back home</button>'
      }
    })

    expect(wrapper.classes()).toContain('yok-result--warning')
    expect(wrapper.text()).toContain('?')
    expect(wrapper.text()).toContain('Back home')
  })

  it('uses default slot as extra fallback for copyable live examples', () => {
    const wrapper = mount(YResult, {
      props: {
        status: 'success'
      },
      slots: {
        default: '<button type="button">Open docs</button>'
      }
    })

    expect(wrapper.find('.yok-result__extra').exists()).toBe(true)
    expect(wrapper.text()).toContain('Open docs')
  })
})
