import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import YFloatButton from './YFloatButton.vue'
import YFloatButtonGroup from './YFloatButtonGroup.vue'

describe('YFloatButton', () => {
  it('renders a fixed floating action with an accessible label', async () => {
    const wrapper = mount(YFloatButton, {
      props: {
        label: 'Create component',
        tooltip: 'Create component',
        type: 'primary',
        shape: 'square',
        icon: '+',
        right: 32,
        bottom: 40
      }
    })

    const button = wrapper.get('button')

    expect(button.attributes('aria-label')).toBe('Create component')
    expect(button.classes()).toContain('yok-float-button--primary')
    expect(button.classes()).toContain('yok-float-button--square')
    expect(button.attributes('style')).toContain('--yok-float-button-right: 32px')
    expect(button.attributes('style')).toContain('--yok-float-button-bottom: 40px')
    expect(wrapper.text()).toContain('+')
    expect(wrapper.text()).toContain('Create component')

    await button.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('supports backtop behavior with visibility threshold', async () => {
    const scrollTo = vi.fn()

    Object.defineProperty(window, 'scrollY', { value: 260, configurable: true })
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true })

    const wrapper = mount(YFloatButton, {
      props: {
        label: 'Back to top',
        action: 'backtop',
        visibilityHeight: 200
      }
    })

    await wrapper.get('button').trigger('click')

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('hides backtop action before the visibility threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 40, configurable: true })

    const wrapper = mount(YFloatButton, {
      props: {
        label: 'Back to top',
        action: 'backtop',
        visibilityHeight: 200
      }
    })

    expect(wrapper.get('button').attributes('style')).toContain('display: none')
  })
})

describe('YFloatButtonGroup', () => {
  it('toggles non-controlled action groups and exposes expanded state', async () => {
    const wrapper = mount(YFloatButtonGroup, {
      props: {
        label: 'Quick actions',
        trigger: 'click',
        items: [
          { key: 'create', label: 'Create component', icon: '+' },
          { key: 'docs', label: 'Open docs', icon: '?' }
        ]
      }
    })

    const trigger = wrapper.get('[data-yok-float-button-group-trigger]')

    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(wrapper.findAll('[data-yok-float-button-group-item]')).toHaveLength(0)

    await trigger.trigger('click')

    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('[data-yok-float-button-group-item]')).toHaveLength(2)

    await wrapper.findAll('[data-yok-float-button-group-item]')[0].trigger('click')

    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual({ key: 'create', label: 'Create component', icon: '+' })
  })

  it('supports controlled open state and emits update requests', async () => {
    const wrapper = mount(YFloatButtonGroup, {
      props: {
        label: 'Quick actions',
        open: false,
        items: [
          { key: 'help', label: 'Help', icon: '?' }
        ]
      }
    })

    await wrapper.get('[data-yok-float-button-group-trigger]').trigger('click')

    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.findAll('[data-yok-float-button-group-item]')).toHaveLength(0)

    await wrapper.setProps({ open: true })

    expect(wrapper.findAll('[data-yok-float-button-group-item]')).toHaveLength(1)
  })
})
