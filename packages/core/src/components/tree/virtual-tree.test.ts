import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import YVirtualTree from './YVirtualTree.vue'
import type { YTreeNode } from './types'

const largeNodes: YTreeNode[] = Array.from({ length: 60 }, (_, index) => ({
  key: `node-${index + 1}`,
  label: `Node ${index + 1}`
}))

const nestedNodes: YTreeNode[] = [
  {
    key: 'core',
    label: 'Core',
    children: [
      { key: 'button', label: 'Button' },
      { key: 'tree', label: 'Tree' }
    ]
  },
  {
    key: 'product',
    label: 'Product',
    children: [
      { key: 'command', label: 'Command Palette' }
    ]
  }
]

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe('YVirtualTree', () => {
  it('renders a virtualized tree window with semantic positions', async () => {
    const wrapper = mount(YVirtualTree, {
      props: {
        nodes: largeNodes,
        height: 96,
        itemHeight: 32,
        overscan: 1,
        ariaLabel: 'Large component tree'
      }
    })

    const tree = wrapper.get('[role="tree"]')

    expect(wrapper.classes()).toContain('yok-virtual-tree')
    expect(tree.attributes('data-virtualized')).toBe('true')
    expect(tree.attributes('aria-label')).toBe('Large component tree')
    expect(tree.attributes('aria-setsize')).toBe('60')
    expect(wrapper.findAll('[role="treeitem"]').map((item) => item.text())).toEqual([
      'Node 1',
      'Node 2',
      'Node 3',
      'Node 4'
    ])

    Object.defineProperty(tree.element, 'scrollTop', {
      configurable: true,
      value: 192
    })
    await tree.trigger('scroll')

    expect(wrapper.findAll('[role="treeitem"]').map((item) => item.text())).toEqual([
      'Node 6',
      'Node 7',
      'Node 8',
      'Node 9',
      'Node 10'
    ])
    expect(wrapper.get('[aria-posinset="6"]').text()).toBe('Node 6')
  })

  it('forwards selection, check, toggle and node slots', async () => {
    const wrapper = mount(YVirtualTree, {
      props: {
        nodes: nestedNodes,
        defaultExpandedKeys: ['core'],
        checkable: true,
        selectedKey: 'button'
      },
      slots: {
        node: '<template #node="{ node, flatNode }"><strong>{{ flatNode.level }} · {{ node.label }}</strong></template>'
      }
    })

    expect(wrapper.get('strong').text()).toBe('1 · Core')

    await wrapper.findAll('[role="treeitem"]')[1].trigger('click')

    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['button'])
    expect(wrapper.emitted('select')?.[0]).toEqual([{ node: nestedNodes[0].children?.[0], key: 'button' }])

    await wrapper.get('[aria-label="Check Core"]').trigger('click')

    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['core', 'button', 'tree']])
    expect(wrapper.emitted('check')?.[0][0]).toMatchObject({
      key: 'core',
      checked: true
    })

    await wrapper.get('[aria-label="Expand Product"]').trigger('click')

    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['core', 'product']])
    expect(wrapper.emitted('toggle')?.[0]).toEqual([{ node: nestedNodes[1], key: 'product', expanded: true }])
  })

  it('keeps empty and lazy loading states available through the wrapper', async () => {
    const empty = mount(YVirtualTree, {
      props: {
        nodes: [],
        emptyText: 'No virtual nodes'
      }
    })

    expect(empty.get('[role="status"]').text()).toBe('No virtual nodes')

    const load = vi.fn().mockResolvedValue([{ key: 'remote-child', label: 'Remote child', isLeaf: true }])
    const wrapper = mount(YVirtualTree, {
      props: {
        nodes: [{ key: 'remote', label: 'Remote folder' }],
        lazy: true,
        load
      }
    })

    await wrapper.get('[aria-label="Expand Remote folder"]').trigger('click')

    expect(load).toHaveBeenCalledWith({ key: 'remote', label: 'Remote folder' })

    await flushPromises()
    await nextTick()

    expect(wrapper.findAll('[role="treeitem"]').map((item) => item.text())).toEqual([
      'Remote folder',
      'Remote child'
    ])
    expect(wrapper.get('[aria-label="Collapse Remote folder"]').find('svg').exists()).toBe(true)
    expect(wrapper.emitted('load')?.[0]).toEqual([{
      node: { key: 'remote', label: 'Remote folder' },
      key: 'remote',
      children: [{ key: 'remote-child', label: 'Remote child', isLeaf: true }]
    }])
    await expect(wrapper.vm.reloadNode('remote')).resolves.toBe(true)
    await expect(wrapper.vm.reloadNode('missing')).resolves.toBe(false)
    expect(wrapper.vm.getNodeByKey('remote-child')?.label).toBe('Remote child')
  })
})
