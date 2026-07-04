<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const commands = [
  { id: 'create', label: 'Create new component' },
  { id: 'theme', label: 'Switch theme' },
  { id: 'docs', label: 'Open docs' }
]
const paletteUsage = "<YCommandPalette :open='open' :commands='commands' />"

const commandCenterSetup = [
  "import { ref } from 'vue'",
  "import { YButton } from '@yok-ui/core'",
  "import { YCodeBlock, YCommandPalette } from '@yok-ui/product'",
  '',
  'const open = ref(false)',
  'const commands = [',
  "  { id: 'create', label: 'Create new component' },",
  "  { id: 'theme', label: 'Switch theme' },",
  "  { id: 'docs', label: 'Open docs' }",
  ']',
  'const paletteUsage = "<YCommandPalette :open=\\\'open\\\' :commands=\\\'commands\\\' />"'
].join('\n')

const commandCenterCode = [
  '<div class="docs-split">',
  '  <section class="command-center-preview">',
  '    <h3>Command center</h3>',
  '    <p>用于快速执行创建、搜索、跳转和切换主题等操作。</p>',
  '    <YButton variant="primary" @click="open = true">Open command center</YButton>',
  '    <YCommandPalette :open="open" :commands="commands" @close="open = false" @select="open = false" />',
  '  </section>',
  '  <section class="command-center-source">',
  '    <YCodeBlock language="vue" :code="paletteUsage" />',
  '  </section>',
  '</div>'
].join('\n')
</script>

# Command Center Block

命令中心是个人工具和开发者控制台的核心场景。它组合了 `YButton`、`YCommandPalette`、`YCodeBlock` 和 `YCopyButton`。

## Preview

<DocDemo
  title="Command center composition"
  description="把命令入口、命令面板和可复制源码组合成开发者控制台常用的快捷操作区。"
  :code="commandCenterCode"
  :setup="commandCenterSetup"
  :usage="['command palette', 'copyable source', 'shortcut actions']"
>
  <div class="docs-split">
  <section class="command-center-preview">
    <h3>Command center</h3>
    <p>用于快速执行创建、搜索、跳转和切换主题等操作。</p>
    <YButton variant="primary" @click="open = true">Open command center</YButton>
    <YCommandPalette :open="open" :commands="commands" @close="open = false" @select="open = false" />
  </section>
  <section class="command-center-source">
    <YCodeBlock language="vue" :code="paletteUsage" />
  </section>
  </div>
</DocDemo>

## Composition

| Component | Role |
| --- | --- |
| `YButton` | 打开命令中心 |
| `YCommandPalette` | 搜索并选择命令 |
| `YCodeBlock` | 展示复制用法 |
| `YCopyButton` | 复制安装或命令文本 |

<style scoped>
.command-center-preview,
.command-center-source {
  min-width: 0;
  border: 1px solid var(--yok-border-color);
  border-radius: 18px;
  background: var(--yok-bg-soft);
  padding: 18px;
}

.command-center-preview {
  display: grid;
  align-content: start;
  gap: 12px;
}

.command-center-preview h3 {
  margin: 0;
}

.command-center-preview p {
  margin: 0;
  color: var(--yok-text-muted);
}
</style>
