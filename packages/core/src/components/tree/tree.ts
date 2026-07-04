import type { YTreeCheckState, YTreeDropType, YTreeFlatNode, YTreeNode } from './types'

export function getNodeChildren(node: YTreeNode) {
  return node.children ?? []
}

export function getDescendantKeys(node: YTreeNode): string[] {
  return getNodeChildren(node).flatMap((child) => [
    child.key,
    ...getDescendantKeys(child)
  ])
}

export function getCheckableDescendantKeys(node: YTreeNode): string[] {
  return getNodeChildren(node).flatMap((child) => [
    ...(child.disabled ? [] : [child.key]),
    ...getCheckableDescendantKeys(child)
  ])
}

export function getCheckableSubtreeKeys(node: YTreeNode) {
  return [
    ...(node.disabled ? [] : [node.key]),
    ...getCheckableDescendantKeys(node)
  ]
}

export function getTreeCheckState(params: {
  node: YTreeNode
  checkedKeys: Set<string>
  checkStrictly?: boolean
}): YTreeCheckState {
  const selfChecked = params.checkedKeys.has(params.node.key)

  if (params.checkStrictly) {
    return {
      checked: selfChecked,
      indeterminate: false
    }
  }

  const children = getNodeChildren(params.node).filter((child) => !child.disabled)

  if (!children.length) {
    return {
      checked: selfChecked,
      indeterminate: false
    }
  }

  const childStates = children.map((child) => getTreeCheckState({
    node: child,
    checkedKeys: params.checkedKeys,
    checkStrictly: false
  }))
  const allChildrenChecked = childStates.every((state) => state.checked)
  const anyChildActive = childStates.some((state) => state.checked || state.indeterminate)

  return {
    checked: selfChecked || allChildrenChecked,
    indeterminate: !selfChecked && !allChildrenChecked && anyChildActive
  }
}

export function getHalfCheckedKeys(nodes: YTreeNode[], checkedKeys: Set<string>, checkStrictly = false): string[] {
  if (checkStrictly) {
    return []
  }

  const result: string[] = []

  function walk(node: YTreeNode) {
    const state = getTreeCheckState({
      node,
      checkedKeys,
      checkStrictly
    })

    if (state.indeterminate) {
      result.push(node.key)
    }

    getNodeChildren(node).forEach(walk)
  }

  nodes.forEach(walk)

  return result
}

export function toggleTreeCheckedKeys(params: {
  node: YTreeNode
  checkedKeys: string[]
  checked: boolean
  checkStrictly?: boolean
}) {
  const nextKeys = new Set(params.checkedKeys)
  const keys = params.checkStrictly ? [params.node.key] : getCheckableSubtreeKeys(params.node)

  keys.forEach((key) => {
    if (params.checked) {
      nextKeys.add(key)
    } else {
      nextKeys.delete(key)
    }
  })

  return Array.from(nextKeys)
}

export function flattenTree(params: {
  nodes: YTreeNode[]
  expandedKeys: Set<string>
  selectedKey: string
}) {
  const result: YTreeFlatNode[] = []

  function walk(nodes: YTreeNode[], level: number, parentKey?: string) {
    nodes.forEach((node) => {
      const children = getNodeChildren(node)
      const expanded = params.expandedKeys.has(node.key)
      const flatNode: YTreeFlatNode = {
        node,
        key: node.key,
        label: node.label,
        level,
        index: result.length,
        parentKey,
        expanded,
        selected: node.key === params.selectedKey,
        disabled: node.disabled ?? false,
        hasChildren: children.length > 0
      }

      result.push(flatNode)

      if (children.length && expanded) {
        walk(children, level + 1, node.key)
      }
    })
  }

  walk(params.nodes, 1)

  return result
}

export function findNode(nodes: YTreeNode[], key: string): YTreeNode | null {
  for (const node of nodes) {
    if (node.key === key) {
      return node
    }

    const match = findNode(getNodeChildren(node), key)

    if (match) {
      return match
    }
  }

  return null
}

export function getTreeDropPosition(params: {
  offsetY: number
  height: number
}): YTreeDropType {
  const segment = params.height / 3

  if (params.offsetY <= segment) {
    return 'before'
  }

  if (params.offsetY >= segment * 2) {
    return 'after'
  }

  return 'inside'
}

export function canDropTreeNode(params: {
  draggingNode: YTreeNode | null
  dropNode: YTreeNode
  type: YTreeDropType
}) {
  if (!params.draggingNode || params.draggingNode.disabled || params.dropNode.disabled) {
    return false
  }

  if (params.draggingNode.key === params.dropNode.key) {
    return false
  }

  if (params.type === 'inside' && getDescendantKeys(params.draggingNode).includes(params.dropNode.key)) {
    return false
  }

  return true
}
