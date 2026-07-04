import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import YTreeSelect from './YTreeSelect.vue'
import type { YTreeSelectNode } from './YTreeSelect.vue'

const nodes: YTreeSelectNode[] = [
  {
    key: 'core',
    label: 'Core',
    children: [
      { key: 'button', label: 'Button' },
      { key: 'select', label: 'Select' }
    ]
  },
  {
    key: 'admin',
    label: 'Admin',
    children: [
      { key: 'users', label: 'Users' },
      { key: 'audit', label: 'Audit log', disabled: true }
    ]
  }
]

describe('YTreeSelect', () => {
  it('selects a leaf node from the floating tree panel', async () => {
    const wrapper = mount(YTreeSelect, {
      props: {
        modelValue: '',
        label: 'Component',
        nodes,
        defaultExpandedKeys: ['core']
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('click')

    expect(wrapper.get('[role="tree"]').attributes('aria-label')).toBe('Component options')
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('true')

    await wrapper.get('[data-tree-select-key="button"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['button'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['button'])
    expect(wrapper.emitted('visibleChange')?.at(0)).toEqual([true])
    expect(wrapper.find('[role="tree"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('can select any level when checkStrictly is enabled', async () => {
    const wrapper = mount(YTreeSelect, {
      props: {
        modelValue: '',
        nodes,
        checkStrictly: true
      }
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[data-tree-select-key="core"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['core'])
  })

  it('keeps parent nodes as expand toggles when checkStrictly is disabled', async () => {
    const wrapper = mount(YTreeSelect, {
      props: {
        modelValue: '',
        nodes,
        defaultExpandedKeys: []
      }
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[data-tree-select-key="core"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('[data-tree-select-key="button"]').exists()).toBe(true)
  })

  it('supports multiple selected tags, remove and clear', async () => {
    const wrapper = mount(YTreeSelect, {
      props: {
        modelValue: ['button'],
        nodes,
        multiple: true,
        clearable: true,
        defaultExpandedKeys: ['core']
      }
    })

    expect(wrapper.findAll('.yok-tree-select__tag-label').map((tag) => tag.text())).toEqual(['Button'])

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[data-tree-select-key="select"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['button', 'select']])
    expect(wrapper.find('[role="tree"]').exists()).toBe(true)

    await wrapper.setProps({ modelValue: ['button', 'select'] })
    await wrapper.get('[aria-label="Remove Button"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['select']])
    expect(wrapper.emitted('remove')?.[0]).toEqual(['button'])

    await wrapper.get('[aria-label="Clear selection"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('filters tree nodes and emits search', async () => {
    const wrapper = mount(YTreeSelect, {
      props: {
        modelValue: '',
        nodes,
        filterable: true
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[role="searchbox"]').setValue('audit')
    await nextTick()

    expect(wrapper.emitted('search')?.at(-1)).toEqual(['audit'])
    expect(wrapper.find('[data-tree-select-key="core"]').exists()).toBe(false)
    expect(wrapper.get('[data-tree-select-key="audit"]').text()).toContain('Audit log')

    await wrapper.get('[data-tree-select-key="audit"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    wrapper.unmount()
  })

  it('opens and chooses an enabled node with keyboard', async () => {
    const wrapper = mount(YTreeSelect, {
      props: {
        modelValue: '',
        nodes,
        defaultExpandedKeys: ['core']
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    const items = wrapper.findAll('[role="treeitem"]')
    expect(document.activeElement).toBe(items[0].element)

    await wrapper.get('[role="tree"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[role="tree"]').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['button'])
    expect(document.activeElement).toBe(wrapper.get('[role="combobox"]').element)

    wrapper.unmount()
  })
})
