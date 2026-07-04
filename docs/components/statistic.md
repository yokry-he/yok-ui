<script setup lang="ts">
import { onMounted, ref } from 'vue'

const countdownTarget = ref(0)
const vipCountdownTarget = ref(0)

const conversionFormatter = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) {
    return '-'
  }

  return `${(Number(value) * 100).toFixed(1)}%`
}

onMounted(() => {
  countdownTarget.value = Date.now() + 3_600_000
  vipCountdownTarget.value = Date.now() + 90_061_000
})

const statisticSetup = [
  "import { onMounted, ref } from 'vue'",
  "import { YButton, YCountdown, YStatistic, YTag } from '@yok-ui/core'",
  '',
  'const countdownTarget = ref(0)',
  'const vipCountdownTarget = ref(0)',
  '',
  'const conversionFormatter = (value: string | number | null | undefined) => {',
  '  if (value === null || value === undefined) {',
  "    return '-'",
  '  }',
  '',
  '  return `${(Number(value) * 100).toFixed(1)}%`',
  '}',
  '',
  'onMounted(() => {',
  '  countdownTarget.value = Date.now() + 3_600_000',
  '  vipCountdownTarget.value = Date.now() + 90_061_000',
  '})'
].join('\n')

const basicCode = [
  '<div class="statistic-demo-grid">',
  '  <YStatistic title="Active users" :value="112893" tone="info" />',
  '  <YStatistic title="New orders" :value="1280" prefix="+" suffix="today" tone="success" />',
  '  <YStatistic title="Risk alerts" :value="7" suffix="items" tone="warning" />',
  '</div>'
].join('\n')

const precisionCode = [
  '<div class="statistic-demo-grid">',
  '  <YStatistic',
  '    title="Account balance"',
  '    :value="112893.456"',
  '    :precision="2"',
  '    prefix="¥"',
  '    suffix="CNY"',
  '    tone="success"',
  '  />',
  '  <YStatistic',
  '    title="European format"',
  '    :value="112893.456"',
  '    :precision="2"',
  '    group-separator=" "',
  '    decimal-separator=","',
  '    suffix="EUR"',
  '  />',
  '</div>'
].join('\n')

const formatterCode = [
  '<div class="statistic-demo-grid">',
  '  <YStatistic title="Conversion" :value="0.928" :formatter="conversionFormatter" tone="success">',
  '    <template #suffix>',
  '      <YTag tone="success">healthy</YTag>',
  '    </template>',
  '  </YStatistic>',
  '  <YStatistic title="Revenue" loading suffix="CNY">',
  '    <template #extra>',
  '      <YButton size="sm" variant="ghost">Refresh</YButton>',
  '    </template>',
  '  </YStatistic>',
  '</div>'
].join('\n')

const customValueCode = [
  '<YStatistic title="Design quality" :value="96" suffix="/100" tone="info">',
  '  <template #prefix>',
  '    <span>Score</span>',
  '  </template>',
  '  <template #value="{ formattedValue }">',
  '    <span class="statistic-demo-value">{{ formattedValue }}</span>',
  '  </template>',
  '  <template #extra>',
  '    <YButton size="sm" variant="secondary">Open report</YButton>',
  '  </template>',
  '</YStatistic>'
].join('\n')

const countdownCode = [
  '<div class="statistic-demo-grid">',
  '  <YCountdown',
  '    title="Start to grab"',
  '    :value="countdownTarget"',
  '    prefix="剩余"',
  '    suffix="后开始"',
  '    tone="info"',
  '    aria-label="Campaign countdown"',
  '  />',
  '  <YCountdown',
  '    title="Remaining VIP time"',
  '    :value="vipCountdownTarget"',
  '    format="DD days HH:mm:ss"',
  '    tone="warning"',
  '  >',
  '    <template #extra>',
  '      <YTag tone="warning">VIP</YTag>',
  '    </template>',
  '  </YCountdown>',
  '</div>'
].join('\n')
</script>

# Statistic

Statistic 用于突出展示关键数值，例如活跃用户、转化率、余额、库存、完成度或同比变化。它参考 Ant Design 的 `Statistic` 数据展示模式，保留 `value`、`title`、`prefix`、`suffix`、`precision`、`formatter`、`loading` 等常用能力，同时用 Vue 插槽扩展标题、数值和单位区域。

## Basic

<DocDemo
  title="Basic statistics"
  description="核心指标应把数值、标题和单位一起表达，避免只依赖颜色区分状态。"
  :code="basicCode"
  :setup="statisticSetup"
  :usage="['value', 'prefix', 'suffix', 'tone']"
>
  <div class="statistic-demo-grid">
    <YStatistic title="Active users" :value="112893" tone="info" />
    <YStatistic title="New orders" :value="1280" prefix="+" suffix="today" tone="success" />
    <YStatistic title="Risk alerts" :value="7" suffix="items" tone="warning" />
  </div>
</DocDemo>

## Unit And Precision

<DocDemo
  title="Unit and precision"
  description="金额和国际化数字格式需要明确精度、千分位和小数分隔符。"
  :code="precisionCode"
  :setup="statisticSetup"
  :usage="['precision', 'groupSeparator', 'decimalSeparator']"
>
  <div class="statistic-demo-grid">
    <YStatistic
      title="Account balance"
      :value="112893.456"
      :precision="2"
      prefix="¥"
      suffix="CNY"
      tone="success"
    />
    <YStatistic
      title="European format"
      :value="112893.456"
      :precision="2"
      group-separator=" "
      decimal-separator=","
      suffix="EUR"
    />
  </div>
</DocDemo>

## Live example

<LiveExampleRunner
  preset="statistic"
  title="在线编辑 Statistic 示例"
  description="切换核心指标、单位精度、卡片组合、加载、移动端和读屏场景，验证指标组件在真实页面里的表现。"
/>

## Usage notes

- Statistic 适合突出一个关键数值，例如概览页 KPI、余额、转化率、库存和任务完成度；如果需要比较多行数据，应优先使用 Table、Descriptions 或图表。
- 金额、比例、库存等业务含义应通过 `prefix`、`suffix`、`title` 和可读文本共同表达，不要只依赖颜色区分增长、风险或状态。
- 财务和国际化场景建议明确设置 `precision`、`groupSeparator` 和 `decimalSeparator`，避免小数和千分位被误读。
- 远程刷新指标时使用 `loading`，组件会保留区域结构并通过可访问状态提示正在加载。
- 仪表盘或详情摘要中可以把 Statistic 放入 `YCard`，让指标标题、说明和操作入口形成稳定的信息块。
- 读屏重点指标建议提供 `ariaLabel`；数值区域使用 `aria-live="polite"`，动态更新时不会打断当前朗读。

## Formatter And Loading

<DocDemo
  title="Formatter and loading"
  description="formatter 适合比例和业务格式化；loading 保持指标区域结构并提供状态反馈。"
  :code="formatterCode"
  :setup="statisticSetup"
  :usage="['formatter', 'loading', 'extra']"
>
  <div class="statistic-demo-grid">
    <YStatistic title="Conversion" :value="0.928" :formatter="conversionFormatter" tone="success">
      <template #suffix>
        <YTag tone="success">healthy</YTag>
      </template>
    </YStatistic>
    <YStatistic title="Revenue" loading suffix="CNY">
      <template #extra>
        <YButton size="sm" variant="ghost">Refresh</YButton>
      </template>
    </YStatistic>
  </div>
</DocDemo>

## Custom Value

<DocDemo
  title="Custom value"
  description="自定义 value 插槽时仍应保留可读文本，不要只渲染图形或装饰。"
  :code="customValueCode"
  :setup="statisticSetup"
  :usage="['prefix slot', 'value slot', 'extra']"
>
  <YStatistic title="Design quality" :value="96" suffix="/100" tone="info">
    <template #prefix>
      <span>Score</span>
    </template>
    <template #value="{ formattedValue }">
      <span class="statistic-demo-value">{{ formattedValue }}</span>
    </template>
    <template #extra>
      <YButton size="sm" variant="secondary">Open report</YButton>
    </template>
  </YStatistic>
</DocDemo>

## Countdown

<DocDemo
  title="Countdown"
  description="倒计时用于活动、订单和权益剩余时间，使用 timer 语义并在结束时配合业务提示。"
  :code="countdownCode"
  :setup="statisticSetup"
  :usage="['timer', 'format', 'finish']"
>
  <div class="statistic-demo-grid">
    <YCountdown
      title="Start to grab"
      :value="countdownTarget"
      prefix="剩余"
      suffix="后开始"
      tone="info"
      aria-label="Campaign countdown"
    />
    <YCountdown
      title="Remaining VIP time"
      :value="vipCountdownTarget"
      format="DD days HH:mm:ss"
      tone="warning"
    >
      <template #extra>
        <YTag tone="warning">VIP</YTag>
      </template>
    </YCountdown>
  </div>
</DocDemo>

## API

<ComponentApiSection :names="['YStatistic', 'YCountdown']" />

## Accessibility

- 外层使用具名 `section`，默认可访问名称来自 `ariaLabel` 或 `title`。
- `loading` 时同步 `aria-busy="true"`，并通过 `role="status"` 提供加载状态文本。
- 非加载状态的数值区域使用 `aria-live="polite"`，适合远程指标刷新和仪表盘实时变化。
- prefix、value、suffix 都是文本区域，单位和趋势含义不应只依赖颜色。
- 自定义 `value` 插槽时，建议保留可读文本，避免只渲染图形或图标。
- Countdown 使用 `role="timer"` 和 `aria-live="polite"`；到期事件应配合业务提示，不要只依赖数值变成 0。

<style scoped>
.statistic-demo-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.statistic-demo-value {
  color: var(--yok-color-primary);
}

@media (max-width: 760px) {
  .statistic-demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
