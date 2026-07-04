# Hooks

`@yok-ui/hooks` 收纳组件内部可复用的组合逻辑，目标是让基础控件、场景组件和文档示例共享同一套状态、事件和命名空间约定。

## Install

```bash
pnpm add @yok-ui/hooks
```

## useControlledState

用于实现同时支持受控和非受控模式的组件。

```ts
import { useControlledState } from '@yok-ui/hooks'

const model = useControlledState({
  value: props.modelValue,
  defaultValue: '',
  onChange: (value) => emit('update:modelValue', value)
})

model.setValue('Yok UI')
```

## useEventListener

用于绑定 DOM、window、document 或自定义事件目标，并在当前 effect scope 结束时自动清理。

```ts
import { useEventListener } from '@yok-ui/hooks'

useEventListener(window, 'resize', () => {
  // sync layout state
})
```

## useNamespace

用于生成稳定的 BEM class，避免组件样式依赖内部 DOM 层级。

```ts
import { useNamespace } from '@yok-ui/hooks'

const ns = useNamespace('button')

ns.b() // yok-button
ns.e('icon') // yok-button__icon
ns.m('primary') // yok-button--primary
ns.is('loading', true) // is-loading
```

## Boundary

Hooks 不直接渲染 UI，也不绑定某个具体组件包。它只沉淀可复用逻辑，确保 Core、Product、Admin、Brand 的行为实现保持一致。
