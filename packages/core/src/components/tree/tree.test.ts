import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import YTree from './YTree.vue'
import {
  canDropTreeNode,
  findNode,
  flattenTree,
  getCheckableSubtreeKeys,
  getDescendantKeys,
  getHalfCheckedKeys,
  getTreeCheckState,
  getTreeDropPosition,
  toggleTreeCheckedKeys
} from './tree'
import type { YTreeNode } from './types'

const nodes: YTreeNode[] = [
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
      { key: 'command', label: 'Command Palette', disabled: true }
    ]
  }
]

describe('tree helpers', () => {
  it('flattens expanded tree nodes and finds descendants', () => {
    const flatNodes = flattenTree({
      nodes,
      expandedKeys: new Set(['core']),
      selectedKey: 'tree'
    })

    expect(flatNodes.map((node) => node.key)).toEqual(['core', 'button', 'tree', 'product'])
    expect(flatNodes.find((node) => node.key === 'tree')?.selected).toBe(true)
    expect(getDescendantKeys(nodes[0])).toEqual(['button', 'tree'])
    expect(findNode(nodes, 'command')?.label).toBe('Command Palette')
    expect(getTreeDropPosition({ offsetY: 2, height: 30 })).toBe('before')
    expect(getTreeDropPosition({ offsetY: 16, height: 30 })).toBe('inside')
    expect(getTreeDropPosition({ offsetY: 29, height: 30 })).toBe('after')
    expect(canDropTreeNode({ draggingNode: nodes[0], dropNode: nodes[0], type: 'inside' })).toBe(false)
    expect(canDropTreeNode({ draggingNode: nodes[0], dropNode: nodes[0].children?.[0] as YTreeNode, type: 'inside' })).toBe(false)
    expect(canDropTreeNode({ draggingNode: nodes[0].children?.[0] as YTreeNode, dropNode: nodes[1], type: 'after' })).toBe(true)
    expect(getCheckableSubtreeKeys(nodes[1])).toEqual(['product'])
    expect(getTreeCheckState({
      node: nodes[0],
      checkedKeys: new Set(['button'])
    })).toEqual({ checked: false, indeterminate: true })
    expect(getHalfCheckedKeys(nodes, new Set(['button']))).toEqual(['core'])
    expect(toggleTreeCheckedKeys({
      node: nodes[0],
      checkedKeys: [],
      checked: true
    })).toEqual(['core', 'button', 'tree'])
  })
})

describe('YTree', () => {
  it('renders a semantic tree and selected node', () => {
    const wrapper = mount(YTree, {
      props: {
        nodes,
        selectedKey: 'button',
        defaultExpandedKeys: ['core'],
        ariaLabel: 'Component tree'
      }
    })

    const tree = wrapper.get('[role="tree"]')
    const treeItems = wrapper.findAll('[role="treeitem"]')

    expect(tree.attributes('aria-label')).toBe('Component tree')
    expect(treeItems.map((item) => item.text())).toEqual(['−Core', 'Button', 'Tree', '+Product'])
    expect(wrapper.get('[aria-selected="true"]').text()).toContain('Button')
    expect(wrapper.get('[aria-level="2"]').text()).toContain('Button')
  })

  it('toggles expansion and emits payloads', async () => {
    const wrapper = mount(YTree, {
      props: {
        nodes,
        defaultExpandedKeys: ['core']
      }
    })

    await wrapper.get('[aria-label="Expand Product"]').trigger('click')

    expect(wrapper.findAll('[role="treeitem"]').map((item) => item.text())).toContain('Command Palette')
    expect(wrapper.emitted('toggle')?.[0]).toEqual([{ node: nodes[1], key: 'product', expanded: true }])
    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['core', 'product']])
  })

  it('selects enabled nodes but ignores disabled nodes', async () => {
    const wrapper = mount(YTree, {
      props: {
        nodes,
        defaultExpandedKeys: ['product']
      }
    })

    await wrapper.findAll('[role="treeitem"]')[0].trigger('click')

    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['core'])
    expect(wrapper.emitted('select')?.[0]).toEqual([{ node: nodes[0], key: 'core' }])

    await wrapper.get('[aria-disabled="true"]').trigger('click')

    expect(wrapper.emitted('update:selectedKey')).toHaveLength(1)
  })

  it('checks nodes with cascade and reports half checked keys', async () => {
    const wrapper = mount(YTree, {
      props: {
        nodes,
        defaultExpandedKeys: ['core'],
        checkable: true,
        defaultCheckedKeys: ['button']
      }
    })

    expect(wrapper.get('[aria-label="Check Core"]').attributes('aria-checked')).toBe('mixed')

    await wrapper.get('[aria-label="Check Core"]').trigger('click')

    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['button', 'core', 'tree']])
    expect(wrapper.emitted('check')?.[0]).toEqual([{
      node: nodes[0],
      key: 'core',
      checked: true,
      checkedKeys: ['button', 'core', 'tree'],
      halfCheckedKeys: []
    }])
  })

  it('supports strict checkbox mode', async () => {
    const wrapper = mount(YTree, {
      props: {
        nodes,
        defaultExpandedKeys: ['core'],
        checkable: true,
        checkStrictly: true
      }
    })

    await wrapper.get('[aria-label="Check Core"]').trigger('click')

    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['core']])
    expect(wrapper.get('[aria-label="Check Button"]').attributes('aria-checked')).toBe('false')
  })

  it('supports controlled expanded keys', async () => {
    const wrapper = mount(YTree, {
      props: {
        nodes,
        expandedKeys: []
      }
    })

    await wrapper.get('[aria-label="Expand Core"]').trigger('click')

    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['core']])
    expect(wrapper.findAll('[role="treeitem"]').map((item) => item.text())).toEqual(['+Core', '+Product'])
  })

  it('supports keyboard navigation and expand/collapse', async () => {
    const wrapper = mount(YTree, {
      props: {
        nodes,
        defaultExpandedKeys: ['core']
      },
      attachTo: document.body
    })

    const firstItem = wrapper.findAll('[role="treeitem"]')[0]
    firstItem.element.focus()

    await firstItem.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(wrapper.get('[data-active-treeitem="true"]').text()).toContain('Button')

    await wrapper.get('[data-active-treeitem="true"]').trigger('keydown', { key: 'End' })
    await nextTick()

    expect(wrapper.get('[data-active-treeitem="true"]').text()).toContain('Product')

    await wrapper.get('[data-active-treeitem="true"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(wrapper.findAll('[role="treeitem"]').map((item) => item.text())).toContain('Command Palette')

    await wrapper.get('[data-active-treeitem="true"]').trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()

    expect(wrapper.findAll('[role="treeitem"]').map((item) => item.text())).not.toContain('Command Palette')
    wrapper.unmount()
  })

  it('renders custom node and empty slots', () => {
    const wrapper = mount(YTree, {
      props: {
        nodes: [nodes[0]],
        defaultExpandedKeys: ['core']
      },
      slots: {
        node: '<template #node="{ node, flatNode }"><strong>{{ flatNode.level }} - {{ node.label }}</strong></template>'
      }
    })
    const empty = mount(YTree, {
      props: {
        nodes: []
      },
      slots: {
        empty: 'No categories'
      }
    })

    expect(wrapper.find('strong').text()).toBe('1 - Core')
    expect(empty.get('[role="status"]').text()).toBe('No categories')
  })

  it('exposes getNodeByKey', () => {
    const wrapper = mount(YTree, {
      props: {
        nodes
      }
    })

    expect(wrapper.vm.getNodeByKey('tree')?.label).toBe('Tree')
  })

  it('emits drag and drop payloads when draggable', async () => {
    const wrapper = mount(YTree, {
      props: {
        nodes,
        defaultExpandedKeys: ['core'],
        draggable: true
      }
    })
    const buttonItem = wrapper.findAll('[role="treeitem"]').find((item) => item.text().includes('Button'))
    const productItem = wrapper.findAll('[role="treeitem"]').find((item) => item.text().includes('Product'))

    if (!buttonItem || !productItem) {
      throw new Error('Missing drag test nodes')
    }

    Object.defineProperty(productItem.element, 'offsetHeight', {
      configurable: true,
      value: 30
    })
    productItem.element.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 160,
      bottom: 30,
      width: 160,
      height: 30,
      toJSON: () => ({})
    })

    await buttonItem.trigger('dragstart', {
      dataTransfer: {
        setData: () => undefined,
        setDragImage: () => undefined
      }
    })
    await productItem.trigger('dragover', {
      clientY: 15,
      dataTransfer: {
        dropEffect: 'move'
      }
    })
    await productItem.trigger('drop')
    await buttonItem.trigger('dragend')

    expect(wrapper.emitted('dragStart')?.[0]).toEqual([{ node: nodes[0].children?.[0], key: 'button' }])
    expect(wrapper.emitted('drop')?.[0]).toEqual([{
      draggingNode: nodes[0].children?.[0],
      draggingKey: 'button',
      dropNode: nodes[1],
      dropKey: 'product',
      type: 'inside'
    }])
    expect(wrapper.emitted('dragEnd')?.[0]).toEqual([{ node: nodes[0].children?.[0], key: 'button' }])
  })

  it('respects allowDrop when dragging', async () => {
    const wrapper = mount(YTree, {
      props: {
        nodes,
        defaultExpandedKeys: ['core'],
        draggable: true,
        allowDrop: () => false
      }
    })
    const buttonItem = wrapper.findAll('[role="treeitem"]').find((item) => item.text().includes('Button'))
    const productItem = wrapper.findAll('[role="treeitem"]').find((item) => item.text().includes('Product'))

    if (!buttonItem || !productItem) {
      throw new Error('Missing drag test nodes')
    }

    Object.defineProperty(productItem.element, 'offsetHeight', {
      configurable: true,
      value: 30
    })
    productItem.element.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 160,
      bottom: 30,
      width: 160,
      height: 30,
      toJSON: () => ({})
    })

    await buttonItem.trigger('dragstart', {
      dataTransfer: {
        setData: () => undefined,
        setDragImage: () => undefined
      }
    })
    await productItem.trigger('dragover', {
      clientY: 15,
      dataTransfer: {
        dropEffect: 'move'
      }
    })
    await productItem.trigger('drop')

    expect(wrapper.emitted('drop')).toBeUndefined()
  })

  it('virtualizes visible tree items while preserving treeitem semantics', async () => {
    const largeNodes: YTreeNode[] = Array.from({ length: 40 }, (_, index) => ({
      key: `node-${index + 1}`,
      label: `Node ${index + 1}`
    }))
    const wrapper = mount(YTree, {
      props: {
        nodes: largeNodes,
        virtualized: true,
        virtualHeight: 96,
        virtualItemHeight: 32,
        virtualOverscan: 1,
        ariaLabel: 'Virtualized tree'
      }
    })

    const tree = wrapper.get('[role="tree"]')

    expect(tree.classes()).toContain('yok-tree__list--virtualized')
    expect(tree.attributes('data-virtualized')).toBe('true')
    expect(tree.attributes('aria-setsize')).toBe('40')
    expect(wrapper.findAll('[role="treeitem"]').map((item) => item.text())).toEqual([
      'Node 1',
      'Node 2',
      'Node 3',
      'Node 4'
    ])
    expect(wrapper.get('[aria-posinset="4"]').text()).toBe('Node 4')

    const viewport = wrapper.get('[role="tree"]')
    Object.defineProperty(viewport.element, 'scrollTop', {
      configurable: true,
      value: 160
    })
    await viewport.trigger('scroll')

    expect(wrapper.findAll('[role="treeitem"]').map((item) => item.text())).toEqual([
      'Node 5',
      'Node 6',
      'Node 7',
      'Node 8',
      'Node 9'
    ])
    expect(wrapper.get('[aria-posinset="5"]').text()).toBe('Node 5')
  })
})
