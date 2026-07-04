import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YTooltip from './YTooltip.vue'

describe('YTooltip', () => {
  it('renders trigger and tooltip content with an accessible description relation', () => {
    const wrapper = mount(YTooltip, {
      props: {
        content: 'Copy command',
        id: 'copy-tooltip'
      },
      slots: {
        default: '<button>Copy</button>'
      }
    })

    expect(wrapper.get('[role="tooltip"]').attributes('id')).toBe('copy-tooltip')
    expect(wrapper.get('button').attributes('aria-describedby')).toBe('copy-tooltip')
    expect(wrapper.get('#copy-tooltip').text()).toBe('Copy command')
    expect(wrapper.text()).toContain('Copy')
  })

  it('merges existing trigger descriptions', () => {
    const wrapper = mount(YTooltip, {
      props: {
        content: 'Copy command',
        id: 'copy-tooltip'
      },
      slots: {
        default: '<button aria-describedby="keyboard-hint">Copy</button>'
      }
    })

    expect(wrapper.get('button').attributes('aria-describedby')).toBe('keyboard-hint copy-tooltip')
  })

  it('exposes the show delay as a css variable', () => {
    const wrapper = mount(YTooltip, {
      props: {
        content: 'Copy command',
        showDelay: 240
      },
      slots: {
        default: '<button>Copy</button>'
      }
    })

    expect(wrapper.attributes('style')).toContain('--yok-tooltip-delay: 240ms')
  })

  it('uses Floating UI styles for the tooltip bubble', async () => {
    const wrapper = mount(YTooltip, {
      props: {
        content: 'Copy command',
        id: 'copy-tooltip'
      },
      slots: {
        default: '<button>Copy</button>'
      },
      attachTo: document.body
    })

    await wrapper.get('.yok-tooltip__trigger').trigger('mouseenter')

    expect(wrapper.get('[role="tooltip"]').attributes('style')).toContain('position:')
  })

  it('supports click trigger and emits controlled open state changes', async () => {
    const wrapper = mount(YTooltip, {
      props: {
        content: 'Open details',
        trigger: 'click'
      },
      slots: {
        default: '<button>Details</button>'
      }
    })

    await wrapper.get('.yok-tooltip__trigger').trigger('click')

    expect(wrapper.get('[role="tooltip"]').classes()).toContain('yok-tooltip__bubble--open')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])

    await wrapper.get('.yok-tooltip__trigger').trigger('click')

    expect(wrapper.emitted('update:open')?.[1]).toEqual([false])
  })

  it('supports manual open control without hover side effects', async () => {
    const wrapper = mount(YTooltip, {
      props: {
        content: 'Manual details',
        trigger: 'manual',
        open: true
      },
      slots: {
        default: '<button>Details</button>'
      }
    })

    expect(wrapper.get('[role="tooltip"]').classes()).toContain('yok-tooltip__bubble--open')

    await wrapper.setProps({ open: false })
    expect(wrapper.get('[role="tooltip"]').classes()).not.toContain('yok-tooltip__bubble--open')

    await wrapper.get('.yok-tooltip__trigger').trigger('mouseenter')
    expect(wrapper.get('[role="tooltip"]').classes()).not.toContain('yok-tooltip__bubble--open')
  })

  it('disables tooltip behavior and description wiring when disabled', async () => {
    const wrapper = mount(YTooltip, {
      props: {
        content: 'Disabled details',
        id: 'disabled-tooltip',
        disabled: true
      },
      slots: {
        default: '<button>Details</button>'
      }
    })

    expect(wrapper.get('button').attributes('aria-describedby')).toBeUndefined()

    await wrapper.get('.yok-tooltip__trigger').trigger('mouseenter')

    expect(wrapper.get('[role="tooltip"]').classes()).not.toContain('yok-tooltip__bubble--open')
  })

  it('supports rich placement and light theme classes', () => {
    const wrapper = mount(YTooltip, {
      props: {
        content: 'Left aligned details',
        placement: 'left-start',
        theme: 'light',
        hideDelay: 80
      },
      slots: {
        default: '<button>Details</button>'
      }
    })

    expect(wrapper.get('[role="tooltip"]').classes()).toContain('yok-tooltip__bubble--light')
    expect(wrapper.attributes('style')).toContain('--yok-tooltip-hide-delay: 80ms')
  })
})
