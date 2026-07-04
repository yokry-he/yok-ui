import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { YButton, YIconButton } from './index'
import { YConfigProvider } from '../config-provider'

describe('YButton', () => {
  it('renders variant, size, loading, and slot content', () => {
    const wrapper = mount(YButton, {
      props: {
        variant: 'primary',
        size: 'lg',
        loading: true
      },
      slots: {
        default: 'Create'
      }
    })

    expect(wrapper.classes()).toContain('yok-button--primary')
    expect(wrapper.classes()).toContain('yok-button--lg')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.text()).toContain('Create')
  })

  it('emits click when enabled', async () => {
    const wrapper = mount(YButton, {
      slots: {
        default: 'Save'
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('uses ConfigProvider size when no explicit size is provided', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'lg'
      },
      slots: {
        default: () => h(YButton, null, () => 'Global size')
      }
    })

    expect(wrapper.find('.yok-button').classes()).toContain('yok-button--lg')
  })

  it('keeps explicit size above ConfigProvider defaults', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'lg'
      },
      slots: {
        default: () => h(YButton, { size: 'sm' }, () => 'Explicit size')
      }
    })

    expect(wrapper.find('.yok-button').classes()).toContain('yok-button--sm')
  })

  it('supports block layout for full-width mobile or form actions', () => {
    const wrapper = mount(YButton, {
      props: {
        block: true
      },
      slots: {
        default: 'Continue'
      }
    })

    expect(wrapper.classes()).toContain('yok-button--block')
  })
})

describe('YIconButton', () => {
  it('requires an accessible label', () => {
    const wrapper = mount(YIconButton, {
      props: {
        label: 'Copy'
      },
      slots: {
        default: 'C'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Copy')
  })
})
