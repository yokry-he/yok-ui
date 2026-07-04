import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import YPopover from './YPopover.vue'

describe('YPopover', () => {
  it('emits open updates from trigger', async () => {
    const wrapper = mount(YPopover, {
      props: {
        open: false,
        title: 'Details',
        content: 'More information'
      }
    })

    await wrapper.get('[role="button"]').trigger('click')

    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('renders panel when open', () => {
    const wrapper = mount(YPopover, {
      props: {
        open: true,
        title: 'Details',
        content: 'More information'
      }
    })

    expect(wrapper.get('[role="dialog"]').text()).toContain('Details')
    expect(wrapper.text()).toContain('More information')
  })

  it('links trigger and panel with aria controls', () => {
    const wrapper = mount(YPopover, {
      props: {
        open: true,
        title: 'Release note'
      }
    })

    const trigger = wrapper.get('[role="button"]')
    const panel = wrapper.get('[role="dialog"]')

    expect(trigger.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-label')).toBe('Release note')
  })

  it('closes from escape and restores focus to trigger', async () => {
    const wrapper = mount(YPopover, {
      props: {
        open: true,
        title: 'Details'
      },
      attachTo: document.body
    })

    const trigger = wrapper.get<HTMLElement>('[role="button"]')
    trigger.element.focus()

    await trigger.trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(document.activeElement).toBe(trigger.element)
  })

  it('emits close when pointer starts outside the popover layer', async () => {
    const wrapper = mount(YPopover, {
      props: {
        open: true,
        title: 'Details'
      },
      attachTo: document.body
    })

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('supports hover trigger with uncontrolled open state', async () => {
    const wrapper = mount(YPopover, {
      props: {
        trigger: 'hover',
        title: 'Hover details',
        content: 'Shown on hover or focus.'
      }
    })

    await wrapper.get('.yok-popover__trigger').trigger('mouseenter')

    expect(wrapper.get('[role="dialog"]').text()).toContain('Hover details')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])

    await wrapper.get('.yok-popover__trigger').trigger('mouseleave')

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(wrapper.emitted('update:open')?.[1]).toEqual([false])
  })

  it('supports manual control and rich floating placements', async () => {
    const wrapper = mount(YPopover, {
      props: {
        open: true,
        trigger: 'manual',
        placement: 'right-start',
        title: 'Manual details'
      }
    })

    expect(wrapper.get('.yok-popover').classes()).toContain('yok-popover--right-start')
    expect(wrapper.get('[role="dialog"]').text()).toContain('Manual details')

    await wrapper.get('.yok-popover__trigger').trigger('click')

    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('ignores trigger events when disabled', async () => {
    const wrapper = mount(YPopover, {
      props: {
        disabled: true,
        title: 'Disabled details',
        content: 'Cannot open.'
      }
    })

    await wrapper.get('.yok-popover__trigger').trigger('click')
    await wrapper.get('.yok-popover__trigger').trigger('keydown', { key: 'Enter' })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(wrapper.get('.yok-popover__trigger').attributes('aria-disabled')).toBe('true')
  })
})
