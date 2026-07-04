import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YLink from './YLink.vue'

describe('YLink', () => {
  it('renders a themed anchor link with default accessible text', () => {
    const wrapper = mount(YLink, {
      props: {
        href: '/guide/introduction'
      },
      slots: {
        default: 'Read guide'
      }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/guide/introduction')
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'yok-link',
      'yok-link--primary',
      'yok-link--md',
      'yok-link--underline-hover'
    ]))
    expect(wrapper.text()).toBe('Read guide')
  })

  it('adds safe rel defaults for external links', () => {
    const wrapper = mount(YLink, {
      props: {
        href: 'https://example.com',
        external: true
      },
      slots: {
        default: 'External'
      }
    })

    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
  })

  it('prevents disabled navigation and click events', async () => {
    const wrapper = mount(YLink, {
      props: {
        href: '/blocked',
        disabled: true
      },
      slots: {
        default: 'Disabled'
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('emits click events for enabled links and supports tone, size and underline variants', async () => {
    const wrapper = mount(YLink, {
      props: {
        href: '/danger',
        tone: 'danger',
        size: 'sm',
        underline: 'always'
      },
      slots: {
        default: 'Remove item'
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'yok-link--danger',
      'yok-link--sm',
      'yok-link--underline-always'
    ]))
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
