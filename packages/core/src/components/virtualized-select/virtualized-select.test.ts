import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YVirtualizedSelect from './YVirtualizedSelect.vue'

const largeOptions = Array.from({ length: 1000 }, (_, index) => ({
  label: `Package ${index + 1}`,
  value: `pkg-${index + 1}`
}))

describe('YVirtualizedSelect', () => {
  it('renders a virtualized listbox by default for large option sets', async () => {
    const wrapper = mount(YVirtualizedSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        options: largeOptions,
        height: 120,
        itemHeight: 36,
        overscan: 1
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('click')

    const listbox = wrapper.get('[role="listbox"]')
    const renderedOptions = wrapper.findAll('[role="option"]')

    expect(listbox.attributes('data-virtualized')).toBe('true')
    expect(listbox.attributes('aria-setsize')).toBe('1000')
    expect(renderedOptions).toHaveLength(5)
    expect(renderedOptions[0].text()).toContain('Package 1')
    expect(renderedOptions[0].attributes('aria-setsize')).toBe('1000')
    expect(renderedOptions[0].attributes('aria-posinset')).toBe('1')
    expect(renderedOptions.some((option) => option.text().includes('Package 1000'))).toBe(false)

    wrapper.unmount()
  })

  it('filters, emits search and selects an option with the select combobox contract', async () => {
    const wrapper = mount(YVirtualizedSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        options: largeOptions,
        filterable: true,
        searchPlaceholder: 'Search packages'
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[role="searchbox"]').setValue('Package 42')

    expect(wrapper.emitted('search')?.at(-1)).toEqual(['Package 42'])
    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toContain('Package 42')

    await wrapper.findAll('[role="option"]').find((option) => option.text().includes('Package 42'))?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['pkg-42'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['pkg-42'])

    wrapper.unmount()
  })

  it('supports multiple selection, disabled state and aliases virtual props to the base select', async () => {
    const wrapper = mount(YVirtualizedSelect, {
      props: {
        modelValue: ['pkg-1'],
        label: 'Packages',
        options: largeOptions,
        multiple: true,
        collapseTags: true,
        maxCollapseTags: 1,
        disabled: true,
        height: 96,
        itemHeight: 32,
        overscan: 0
      }
    })

    expect(wrapper.get('[role="combobox"]').attributes('aria-disabled')).toBe('true')
    expect(wrapper.find('.yok-select__tag-summary').exists()).toBe(false)

    await wrapper.get('[role="combobox"]').trigger('click')

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
