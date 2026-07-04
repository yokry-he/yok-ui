<script setup lang="ts">
import { ref } from 'vue'

const theme = ref('yok-light')
const enabled = ref(true)

const productSettingsSetup = [
  "import { ref } from 'vue'",
  "import { YBadge, YInput, YSwitch, YTag, YThemeProvider } from '@yok-ui/core'",
  "import { YThemeSwitcher } from '@yok-ui/product'",
  '',
  "const theme = ref('yok-light')",
  'const enabled = ref(true)'
].join('\n')

const productSettingsCode = [
  '<YThemeProvider :theme="theme">',
  '  <div class="docs-demo-grid">',
  '    <YInput label="Workspace name" model-value="Yok Studio" />',
  '    <div class="product-settings-card">',
  '      <h3>Theme</h3>',
  '      <YThemeSwitcher v-model="theme" />',
  '    </div>',
  '    <div class="product-settings-card">',
  '      <h3>Preferences</h3>',
  '      <YSwitch v-model="enabled" label="Enable fresh cute mode" />',
  '    </div>',
  '    <div class="product-settings-card">',
  '      <h3>Status</h3>',
  '      <div class="demo-row">',
  '        <YTag tone="success">Saved</YTag>',
  '        <YBadge value="2" />',
  '      </div>',
  '    </div>',
  '  </div>',
  '</YThemeProvider>'
].join('\n')
</script>

# Product Settings Block

产品设置块用于展示主题、开关、基础配置和保存动作。

## Preview

<DocDemo
  title="Product settings panel"
  description="把主题切换、工作区名称、偏好开关和保存状态组合成轻量产品设置块。"
  :code="productSettingsCode"
  :setup="productSettingsSetup"
  :usage="['local theme', 'settings form', 'status badge']"
>
  <YThemeProvider :theme="theme">
    <div class="docs-demo-grid">
      <YInput label="Workspace name" model-value="Yok Studio" />
      <div class="product-settings-card">
        <h3>Theme</h3>
        <YThemeSwitcher v-model="theme" />
      </div>
      <div class="product-settings-card">
        <h3>Preferences</h3>
        <YSwitch v-model="enabled" label="Enable fresh cute mode" />
      </div>
      <div class="product-settings-card">
        <h3>Status</h3>
        <div class="demo-row">
          <YTag tone="success">Saved</YTag>
          <YBadge value="2" />
        </div>
      </div>
    </div>
  </YThemeProvider>
</DocDemo>

## Composition

| Component | Role |
| --- | --- |
| `YThemeProvider` | 设置局部主题 |
| `YThemeSwitcher` | 切换主题 |
| `YInput` | 设置名称 |
| `YSwitch` | 二元偏好设置 |
| `YTag` / `YBadge` | 保存状态和数量提示 |

<style scoped>
.product-settings-card {
  display: grid;
  gap: 12px;
  min-width: 0;
  border: 1px solid var(--yok-border-color);
  border-radius: 18px;
  background: var(--yok-bg-soft);
  padding: 18px;
}

.product-settings-card h3 {
  margin: 0;
}
</style>
