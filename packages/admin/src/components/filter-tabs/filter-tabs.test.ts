import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YFilterTabs from './YFilterTabs.vue'

const items = [
  { label: 'All', value: 'all', count: 32 },
  { label: 'Published', value: 'published', count: 18, tone: 'success' as const },
  { label: 'Draft', value: 'draft', count: 9, tone: 'warning' as const },
  { label: 'Archived', value: 'archived', count: 5, disabled: true }
]

describe('YFilterTabs', () => {
  it('renders tabs, counts and active state', () => {
    const wrapper = mount(YFilterTabs, {
      props: {
        modelValue: 'published',
        items,
        ariaLabel: 'Status filters'
      }
    })

    const tabs = wrapper.findAll('[role="tab"]')

    expect(wrapper.attributes('role')).toBe('tablist')
    expect(wrapper.attributes('aria-label')).toBe('Status filters')
    expect(wrapper.text()).toContain('Published')
    expect(wrapper.text()).toContain('18')
    expect(tabs[1].attributes('aria-selected')).toBe('true')
    expect(tabs[3].attributes('disabled')).toBeDefined()
  })

  it('emits model updates and change payload on click', async () => {
    const wrapper = mount(YFilterTabs, {
      props: {
        modelValue: 'all',
        items
      }
    })

    await wrapper.findAll('[role="tab"]')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['draft'])
    expect(wrapper.emitted('change')?.[0]).toEqual([items[2]])
  })

  it('skips disabled tabs during keyboard navigation', async () => {
    const wrapper = mount(YFilterTabs, {
      props: {
        modelValue: 'draft',
        items
      },
      attachTo: document.body
    })

    await wrapper.findAll('[role="tab"]')[2].trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['all'])
    expect(document.activeElement?.textContent).toContain('All')
    wrapper.unmount()
  })

  it('supports Home and End keys', async () => {
    const wrapper = mount(YFilterTabs, {
      props: {
        modelValue: 'published',
        items
      },
      attachTo: document.body
    })

    await wrapper.findAll('[role="tab"]')[1].trigger('keydown', { key: 'End' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['draft'])
    expect(document.activeElement?.textContent).toContain('Draft')

    await wrapper.setProps({ modelValue: 'draft' })
    await wrapper.findAll('[role="tab"]')[2].trigger('keydown', { key: 'Home' })

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['all'])
    expect(document.activeElement?.textContent).toContain('All')
    wrapper.unmount()
  })
})
