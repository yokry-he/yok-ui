import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import YCascaderPanel from './YCascaderPanel.vue'
import type { YCascaderOption } from './types'

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

const options: YCascaderOption[] = [
  {
    value: 'core',
    label: 'Core',
    children: [
      {
        value: 'form',
        label: 'Form',
        children: [
          { value: 'cascader', label: 'Cascader' },
          { value: 'select', label: 'Select', disabled: true }
        ]
      }
    ]
  },
  {
    value: 'admin',
    label: 'Admin',
    children: [
      {
        value: 'data',
        label: 'Data',
        children: [
          { value: 'data-table', label: 'Data Table' }
        ]
      }
    ]
  }
]

function getOptionByText(wrapper: ReturnType<typeof mount>, text: string) {
  const option = wrapper.findAll('[role="option"]').find((item) => item.text().includes(text))

  if (!option) {
    throw new Error(`Missing option: ${text}`)
  }

  return option
}

describe('YCascaderPanel', () => {
  it('renders columns and emits a leaf selection', async () => {
    const wrapper = mount(YCascaderPanel, {
      props: {
        options,
        modelValue: ['core', 'form', 'cascader']
      }
    })

    expect(wrapper.classes()).toContain('yok-cascader-panel')
    expect(wrapper.findAll('[role="listbox"]')).toHaveLength(3)
    expect(wrapper.text()).toContain('Selected: Core / Form / Cascader')

    await getOptionByText(wrapper, 'Admin').trigger('click')
    await nextTick()
    await getOptionByText(wrapper, 'Data').trigger('click')
    await nextTick()
    await getOptionByText(wrapper, 'Data Table').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['admin', 'data', 'data-table']])
    expect(wrapper.emitted('change')?.[0]).toEqual([{
      value: ['admin', 'data', 'data-table'],
      labels: ['Admin', 'Data', 'Data Table'],
      option: options[1].children?.[0].children?.[0]
    }])
  })

  it('supports multiple selection and disabled options', async () => {
    const wrapper = mount(YCascaderPanel, {
      props: {
        options,
        multiple: true,
        modelValue: [['core', 'form', 'cascader']]
      }
    })

    expect(getOptionByText(wrapper, 'Cascader').attributes('aria-selected')).toBe('true')

    await getOptionByText(wrapper, 'Cascader').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])

    await getOptionByText(wrapper, 'Select').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  it('loads remote children and reports load errors', async () => {
    const load = vi.fn(async (option: YCascaderOption) => {
      if (option.value === 'product') {
        return [{ value: 'theme-switcher', label: 'Theme Switcher', isLeaf: true }]
      }

      throw new Error('network')
    })
    const wrapper = mount(YCascaderPanel, {
      props: {
        options: [
          { value: 'product', label: 'Product' },
          { value: 'broken', label: 'Broken' }
        ],
        lazy: true,
        load
      }
    })

    await getOptionByText(wrapper, 'Product').trigger('click')
    await flushPromises()

    expect(load).toHaveBeenCalled()
    expect(wrapper.emitted('load')?.[0]?.[0]).toMatchObject({
      option: { value: 'product', label: 'Product' },
      children: [{ value: 'theme-switcher', label: 'Theme Switcher', isLeaf: true }]
    })
    expect(wrapper.text()).toContain('Theme Switcher')

    await getOptionByText(wrapper, 'Broken').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('loadError')?.[0]?.[0]).toMatchObject({
      option: { value: 'broken', label: 'Broken' }
    })
    expect(wrapper.text()).toContain('Failed to load Broken')
  })

  it('supports keyboard navigation and empty state', async () => {
    const wrapper = mount(YCascaderPanel, {
      props: {
        options,
        modelValue: []
      },
      attachTo: document.body
    })

    await wrapper.get('[data-active-cascader-option="true"]').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await wrapper.get('[data-active-cascader-option="true"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    await wrapper.get('[data-active-cascader-option="true"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    await wrapper.get('[data-active-cascader-option="true"]').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['admin', 'data', 'data-table']])
    wrapper.unmount()

    const empty = mount(YCascaderPanel, {
      props: {
        options: [],
        emptyText: 'No categories'
      }
    })

    expect(empty.get('[role="status"]').text()).toBe('No categories')
  })
})
