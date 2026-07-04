import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import YAffix from './YAffix.vue'

afterEach(() => {
  document.body.innerHTML = ''
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: 0
  })
})

describe('YAffix', () => {
  it('renders sticky top affix with offset and z-index styles', () => {
    const wrapper = mount(YAffix, {
      props: {
        offset: 24,
        zIndex: 120,
        ariaLabel: 'Sticky toolbar'
      },
      slots: {
        default: 'Toolbar'
      }
    })

    expect(wrapper.attributes('role')).toBe('region')
    expect(wrapper.attributes('aria-label')).toBe('Sticky toolbar')
    expect(wrapper.classes()).toContain('yok-affix--top')
    expect(wrapper.attributes('style')).toContain('--yok-affix-offset: 24px')
    expect(wrapper.attributes('style')).toContain('--yok-affix-z-index: 120')
    expect(wrapper.text()).toBe('Toolbar')
  })

  it('supports bottom position and disabled state', () => {
    const wrapper = mount(YAffix, {
      props: {
        position: 'bottom',
        offset: 16,
        disabled: true
      },
      slots: {
        default: 'Footer action'
      }
    })

    expect(wrapper.classes()).toContain('yok-affix--bottom')
    expect(wrapper.classes()).toContain('yok-affix--disabled')
    expect(wrapper.attributes('style')).toContain('--yok-affix-offset: 16px')
  })

  it('emits scroll and change when the page crosses the offset', async () => {
    const wrapper = mount(YAffix, {
      props: {
        offset: 20
      }
    })

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 12
    })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('scroll')?.[0]).toEqual([{ scrollTop: 12, fixed: false }])
    expect(wrapper.emitted('change')).toBeUndefined()

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 30
    })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('scroll')?.at(-1)).toEqual([{ scrollTop: 30, fixed: true }])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
    expect(wrapper.classes()).toContain('yok-affix--fixed')
  })

  it('can observe a target container and exposes update', async () => {
    const target = document.createElement('div')
    target.className = 'target-scroll'
    document.body.append(target)

    const wrapper = mount(YAffix, {
      props: {
        target: '.target-scroll',
        offset: 8
      },
      slots: {
        default: 'Target toolbar'
      },
      attachTo: document.body
    })

    target.scrollTop = 16
    target.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('scroll')?.[0]).toEqual([{ scrollTop: 16, fixed: true }])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])

    target.scrollTop = 0
    wrapper.vm.update()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('change')?.at(-1)).toEqual([false])
  })
})
