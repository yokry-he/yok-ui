# @yok-ui/hooks

Vue 3 composables shared by Yok UI packages and application code.

## Install

```bash
pnpm add @yok-ui/hooks
```

## Usage

```ts
import { useControlledState, useEventListener, useNamespace } from '@yok-ui/hooks'

const state = useControlledState({
  defaultValue: 'light'
})
const ns = useNamespace('button')

useEventListener(window, 'keydown', (event) => {
  if (event.key === 'Escape') {
    state.setValue('closed')
  }
})

console.log(ns.b(), state.value.value)
```
