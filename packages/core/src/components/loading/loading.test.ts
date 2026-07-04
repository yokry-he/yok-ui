import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YLoading from './YLoading.vue'

describe('YLoading', () => {
  it('renders an inline status spinner for local loading states', () => {
    const wrapper = mount(YLoading, {
      props: {
        loading: true,
        text: 'Loading orders'
      }
    })

    expect(wrapper.classes()).toContain('yok-loading')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.text()).toContain('Loading orders')
    expect(wrapper.find('.yok-loading__spinner').exists()).toBe(true)
  })

  it('wraps content and exposes busy state without removing the content region', () => {
    const wrapper = mount(YLoading, {
      props: {
        loading: true,
        overlay: true,
        text: 'Refreshing table'
      },
      slots: {
        default: '<section data-test-content>Orders table</section>'
      }
    })

    expect(wrapper.classes()).toContain('yok-loading--overlay')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('[data-test-content]').text()).toBe('Orders table')
    expect(wrapper.find('.yok-loading__mask').text()).toContain('Refreshing table')
  })

  it('hides the mask while preserving wrapped content when loading is false', () => {
    const wrapper = mount(YLoading, {
      props: {
        loading: false,
        overlay: true
      },
      slots: {
        default: 'Loaded content'
      }
    })

    expect(wrapper.attributes('aria-busy')).toBe('false')
    expect(wrapper.text()).toContain('Loaded content')
    expect(wrapper.find('.yok-loading__mask').exists()).toBe(false)
  })

  it('supports fullscreen loading semantics for page-level blocking work', () => {
    const wrapper = mount(YLoading, {
      props: {
        loading: true,
        fullscreen: true,
        text: 'Publishing release',
        label: 'Release publish is running'
      }
    })

    expect(wrapper.classes()).toContain('yok-loading--fullscreen')
    expect(wrapper.attributes('aria-label')).toBe('Release publish is running')
    expect(wrapper.find('.yok-loading__mask').exists()).toBe(true)
  })
})
