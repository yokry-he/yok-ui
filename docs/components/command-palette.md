<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const commands = [
  { id: 'copy', label: 'Copy install command' },
  { id: 'core', label: 'Browse core components' },
  { id: 'theme', label: 'Switch theme preview' }
]

const commandPaletteSetup = [
  "import { ref } from 'vue'",
  "import { YButton } from '@yok-ui/core'",
  "import { YCommandPalette } from '@yok-ui/product'",
  '',
  'const open = ref(false)',
  'const commands = [',
  "  { id: 'copy', label: 'Copy install command' },",
  "  { id: 'core', label: 'Browse core components' },",
  "  { id: 'theme', label: 'Switch theme preview' }",
  ']'
].join('\n')

const basicCode = [
  '<YButton variant="primary" @click="open = true">Open command palette</YButton>',
  '<YCommandPalette',
  '  :open="open"',
  '  :commands="commands"',
  '  @close="open = false"',
  '  @select="open = false"',
  '/>'
].join('\n')
</script>

# Command Palette

命令面板是 `@yok-ui/product` 的特色组件，适合个人工具、开发者工具和复杂控制台中的快速操作。

## Example

<DocDemo
  title="Quick command launcher"
  description="命令面板适合把搜索、跳转和复制动作聚合到一个可键盘操作的入口。"
  :code="basicCode"
  :setup="commandPaletteSetup"
  :usage="['dialog', 'keyboard navigation', 'command search']"
>
  <YButton variant="primary" @click="open = true">Open command palette</YButton>
  <YCommandPalette :open="open" :commands="commands" @close="open = false" @select="open = false" />
</DocDemo>

## Live example

<LiveExampleRunner preset="commandPalette" />

## API

<ComponentApiSection name="YCommandPalette" />

## Accessibility

- 外层使用 `role="dialog"` 和 `aria-modal="true"`。
- 搜索输入使用 `role="combobox"`、`aria-controls` 和 `aria-activedescendant` 关联当前命令。
- 打开后自动聚焦搜索输入。
- `ArrowDown` / `ArrowUp` 在结果中循环移动当前命令。
- `Enter` 选择当前命令。
- `Escape` 请求关闭。
- 没有匹配命令时使用 `role="status"` 暴露空状态。

## Roadmap

- 命令分组
- 快捷键提示
- 异步搜索
