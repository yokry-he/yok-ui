<script setup lang="ts">
import { ref } from 'vue'

const theme = ref('yok-light')

const themeSwitcherSetup = [
  "import { ref } from 'vue'",
  "import { YTag, YThemeProvider } from '@yok-ui/core'",
  "import { YThemeSwitcher } from '@yok-ui/product'",
  '',
  "const theme = ref('yok-light')"
].join('\n')

const basicCode = [
  '<YThemeProvider :theme="theme">',
  '  <div class="demo-row">',
  '    <YThemeSwitcher v-model="theme" />',
  '    <YTag tone="info">{{ theme }}</YTag>',
  '  </div>',
  '</YThemeProvider>'
].join('\n')
</script>

# Theme Switcher

ThemeSwitcher 用于在文档、playground 或产品设置中切换内置主题。

## Example

<DocDemo
  title="Theme preference"
  description="主题切换器适合文档、Playground 和设置页，当前主题需要同时用文本反馈。"
  :code="basicCode"
  :setup="themeSwitcherSetup"
  :usage="['theme token', 'v-model', 'visible state']"
>
  <YThemeProvider :theme="theme">
    <div class="demo-row">
      <YThemeSwitcher v-model="theme" />
      <YTag tone="info">{{ theme }}</YTag>
    </div>
  </YThemeProvider>
</DocDemo>

## Live example

<LiveExampleRunner preset="themeSwitcher" />

## API

<ComponentApiSection name="YThemeSwitcher" />

## Accessibility

- 主题切换使用可聚焦控件，当前主题应通过文本或状态同时表达。
- 不应只依赖颜色变化提示当前主题，旁边可搭配 `YTag` 或设置页说明。
- 主题切换后页面需要保留清晰焦点样式，避免高对比用户丢失当前位置。
