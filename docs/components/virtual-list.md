<script setup lang="ts">

const items = Array.from({ length: 1000 }, (_, index) => ({
  id: `component-${index}`,
  label: `Component ${index + 1}`,
  packageName: index % 3 === 0 ? 'Core' : index % 3 === 1 ? 'Product' : 'Admin',
  status: index % 4 === 0 ? 'Beta' : 'Stable'
}))

const virtualListSetup = [
  "import { YTag, YVirtualList } from '@yok-ui/core'",
  '',
  'const items = Array.from({ length: 1000 }, (_, index) => ({',
  '  id: `component-${index}`,',
  '  label: `Component ${index + 1}`,',
  "  packageName: index % 3 === 0 ? 'Core' : index % 3 === 1 ? 'Product' : 'Admin',",
  "  status: index % 4 === 0 ? 'Beta' : 'Stable'",
  '}))'
].join('\n')

const basicCode = [
  '<YVirtualList',
  '  :items="items"',
  '  :item-height="52"',
  '  :height="260"',
  '  aria-label="Component inventory"',
  '>',
  '  <template #item="{ item, index }">',
  '    <div class="virtual-list-demo-row">',
  '      <strong>{{ item.label }}</strong>',
  '      <span>{{ item.packageName }}</span>',
  '      <YTag :tone="item.status === \'Stable\' ? \'success\' : \'warning\'">{{ item.status }}</YTag>',
  '      <small>#{{ index + 1 }}</small>',
  '    </div>',
  '  </template>',
  '</YVirtualList>'
].join('\n')
</script>

# Virtual List

Virtual List 用于大数据量列表，只渲染当前视口附近的项目。它适合命令面板、选项列表、日志列表、资源选择器和后台数据浏览。

当前版本采用固定行高策略，API 更稳定，也更适合作为后续 Select、Command Palette、DataTable 的底层能力。

## Example

<DocDemo
  title="Large component inventory"
  description="虚拟列表只渲染可视区域附近的项目，适合命令面板、选择器和大规模资源列表。"
  :code="basicCode"
  :setup="virtualListSetup"
  :usage="['large dataset', 'fixed row height', 'range rendering']"
>
  <YVirtualList
    :items="items"
    :item-height="52"
    :height="260"
    aria-label="Component inventory"
  >
    <template #item="{ item, index }">
      <div class="virtual-list-demo-row">
        <strong>{{ item.label }}</strong>
        <span>{{ item.packageName }}</span>
        <YTag :tone="item.status === 'Stable' ? 'success' : 'warning'">{{ item.status }}</YTag>
        <small>#{{ index + 1 }}</small>
      </div>
    </template>
  </YVirtualList>
</DocDemo>

## Live example

<LiveExampleRunner preset="virtualList" />

## API

<ComponentApiSection name="YVirtualList" />

## Accessibility

- 视口使用 `role="list"` 和可配置的 `aria-label`。
- 每个渲染项使用 `role="listitem"`，并通过 `aria-posinset` 暴露它在完整列表中的位置。
- 视口使用 `aria-setsize` 暴露完整数据量，而不是只暴露当前渲染数量。

<style scoped>
.virtual-list-demo-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 88px auto 56px;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: 12px;
}

.virtual-list-demo-row strong,
.virtual-list-demo-row span,
.virtual-list-demo-row small {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.virtual-list-demo-row span,
.virtual-list-demo-row small {
  color: var(--yok-color-textMuted);
  font-size: 13px;
}

@media (max-width: 640px) {
  .virtual-list-demo-row {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .virtual-list-demo-row span,
  .virtual-list-demo-row small {
    display: none;
  }
}
</style>
