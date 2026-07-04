import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import YTabs from './YTabs.vue'

describe('YTabs', () => {
  it('renders active panel and emits active tab', async () => {
    const wrapper = mount(YTabs, {
      props: {
        modelValue: 'usage',
        tabs: [
          { label: 'Usage', value: 'usage' },
          { label: 'API', value: 'api' }
        ]
      }
    })

    expect(wrapper.text()).toContain('Usage')
    expect(wrapper.get('[role="tab"][aria-selected="true"]').text()).toBe('Usage')

    await wrapper.get('[data-tab-value="api"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['api'])
  })

  it('links tabs and panel with stable ids and roving tabindex', () => {
    const wrapper = mount(YTabs, {
      props: {
        id: 'docs-tabs',
        modelValue: 'api',
        ariaLabel: 'Documentation sections',
        tabs: [
          { label: 'Usage', value: 'usage' },
          { label: 'API', value: 'api' }
        ]
      },
      slots: {
        default: '<template #default="{ active }">{{ active }}</template>'
      }
    })

    const tablist = wrapper.get('[role="tablist"]')
    const activeTab = wrapper.get('[role="tab"][aria-selected="true"]')
    const inactiveTab = wrapper.get('[data-tab-value="usage"]')
    const panel = wrapper.get('[role="tabpanel"]')

    expect(tablist.attributes('aria-label')).toBe('Documentation sections')
    expect(activeTab.attributes('id')).toBe('docs-tabs-tab-api')
    expect(activeTab.attributes('aria-controls')).toBe('docs-tabs-panel')
    expect(activeTab.attributes('tabindex')).toBe('0')
    expect(inactiveTab.attributes('tabindex')).toBe('-1')
    expect(panel.attributes('id')).toBe('docs-tabs-panel')
    expect(panel.attributes('aria-labelledby')).toBe('docs-tabs-tab-api')
    expect(panel.text()).toContain('api')
  })

  it('moves focus with arrow, home and end keys while skipping disabled tabs', async () => {
    const wrapper = mount(YTabs, {
      attachTo: document.body,
      props: {
        modelValue: 'usage',
        tabs: [
          { label: 'Usage', value: 'usage' },
          { label: 'Disabled', value: 'disabled', disabled: true },
          { label: 'API', value: 'api' },
          { label: 'Theme', value: 'theme' }
        ]
      }
    })

    const usage = wrapper.get('[data-tab-value="usage"]')

    await usage.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('[data-tab-value="api"]').element)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['api'])

    await wrapper.setProps({ modelValue: 'api' })
    await wrapper.get('[data-tab-value="api"]').trigger('keydown', { key: 'End' })
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('[data-tab-value="theme"]').element)
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['theme'])

    await wrapper.setProps({ modelValue: 'theme' })
    await wrapper.get('[data-tab-value="theme"]').trigger('keydown', { key: 'Home' })
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('[data-tab-value="usage"]').element)
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual(['usage'])

    wrapper.unmount()
  })

  it('supports manual activation where arrow keys only move focus', async () => {
    const wrapper = mount(YTabs, {
      attachTo: document.body,
      props: {
        modelValue: 'usage',
        activationMode: 'manual',
        tabs: [
          { label: 'Usage', value: 'usage' },
          { label: 'API', value: 'api' }
        ]
      }
    })

    await wrapper.get('[data-tab-value="usage"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('[data-tab-value="api"]').element)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('[data-tab-value="api"]').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['api'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['api'])

    wrapper.unmount()
  })

  it('emits close requests for closable tabs without activating them', async () => {
    const wrapper = mount(YTabs, {
      props: {
        modelValue: 'usage',
        tabs: [
          { label: 'Usage', value: 'usage' },
          { label: 'Draft', value: 'draft', closable: true }
        ]
      }
    })

    await wrapper.get('[data-tab-close="draft"]').trigger('click')

    expect(wrapper.emitted('close')?.[0]).toEqual(['draft'])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
