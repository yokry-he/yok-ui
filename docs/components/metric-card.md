<script setup lang="ts">
const metricCardSetup = [
  "import { YMetricCard } from '@yok-ui/admin'"
].join('\n')

const basicCode = [
  '<div class="docs-demo-grid">',
  '  <YMetricCard label="Components" value="33" trend="+4" description="Admin package started." />',
  '  <YMetricCard label="Core coverage" value="23" trend="stable" tone="success" description="Reusable base components." />',
  '</div>'
].join('\n')
</script>

# Metric Card

Metric Card 用于后台首页、概览页和资源列表顶部的关键指标展示。

## Example

<DocDemo
  title="Overview metrics"
  description="指标卡片需要同时展示指标名、数值、趋势和上下文，不能只给一个大数字。"
  :code="basicCode"
  :setup="metricCardSetup"
  :usage="['admin overview', 'trend text', 'dashboard']"
>
  <div class="docs-demo-grid">
    <YMetricCard label="Components" value="33" trend="+4" description="Admin package started." />
    <YMetricCard label="Core coverage" value="23" trend="stable" tone="success" description="Reusable base components." />
  </div>
</DocDemo>

## Live example

<LiveExampleRunner preset="metricCard" />

## API

<ComponentApiSection name="YMetricCard" />

## Accessibility

- 指标名称和数值保持可读文本，不只依赖颜色表达趋势。
- `trend` 需要使用短文本描述变化，方便屏幕阅读器读出上下文。
- 多个指标卡片并列时，应由页面提供区域标题，帮助用户理解这一组数据的含义。
