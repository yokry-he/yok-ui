<script setup lang="ts">

const setup = `import { YAvatar, YAvatarGroup } from '@yok-ui/core'`

const code = `<YAvatar name="Yok UI" />
<YAvatar name="Admin User" tone="success" />
<YAvatar name="Brand Maker" size="lg" shape="square" tone="warning" />
<YAvatar
  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop"
  src-set="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=192&h=192&fit=crop 2x"
  alt="Yok designer"
  fit="cover"
/>
<YAvatar label="Brand symbol" shape="square">
  Y
</YAvatar>

<YAvatarGroup label="Review team" :max="3" :total="6" spacing="tight">
  <YAvatar name="Core Team" />
  <YAvatar name="Product Owner" tone="success" />
  <YAvatar name="Design Review" tone="warning" />
</YAvatarGroup>`
</script>

# Avatar

Avatar 用于展示用户、团队、项目或对象身份。没有图片时会从 `name` 自动生成 initials fallback，保证列表和详情页不出现空洞占位。

## Example

<DocDemo
  title="Fallback initials"
  description="头像固定宽高并禁止压缩，适合工具栏、表格单元格和资料卡。"
  :code="code"
  :setup="setup"
  :usage="['initials fallback', 'stable size', 'tone']"
>
  <div class="demo-row">
    <YAvatar name="Yok UI" />
    <YAvatar name="Admin User" tone="success" />
    <YAvatar name="Brand Maker" size="lg" shape="square" tone="warning" />
    <YAvatar
      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop"
      src-set="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=192&h=192&fit=crop 2x"
      alt="Yok designer"
      fit="cover"
    />
    <YAvatar label="Brand symbol" shape="square">
      Y
    </YAvatar>
  </div>
</DocDemo>

## Avatar Group

<DocDemo
  title="Collapsed team"
  description="头像组用于项目成员、审批人和多人协作场景。超出数量会折叠成 +N，避免工具栏和表格单元格被挤压。"
  :code="code"
  :setup="setup"
  :usage="['overlap', 'max', 'surplus count', 'a11y label']"
>
  <YAvatarGroup label="Review team" :max="3" :total="6" spacing="tight">
    <YAvatar name="Core Team" />
    <YAvatar name="Product Owner" tone="success" />
    <YAvatar name="Design Review" tone="warning" />
  </YAvatarGroup>
</DocDemo>

## Usage notes

- 图片头像支持 `src`、`srcSet`、`alt` 和 `fit`，其中 `fit` 对应原生 `object-fit`，用于处理不同裁切比例的照片。
- 图片加载失败时会触发 `error` 事件，并回退到 initials 或默认插槽内容，避免列表里出现破图。
- 自定义图标或品牌缩写时使用默认插槽，并通过 `label` 提供可访问名称。
- 多人协作场景使用 `YAvatarGroup`，通过 `max` 控制展示数量，通过 `total` 表示已知总人数。

## Live example

<LiveExampleRunner
  preset="avatar"
  title="在线编辑 Avatar 示例"
  description="调整姓名、尺寸、形状和状态色，验证头像在列表、表格和资料卡中的稳定展示。"
/>

## API

<ComponentApiSection name="YAvatar" />

<ComponentApiSection name="YAvatarGroup" />

## Accessibility

- 图片头像使用 `alt` 或 `name` 作为替代文本。
- 非图片头像会在根节点上设置 `role="img"` 和可访问名称，名称优先级为 `label > alt > name`。
- fallback initials 本身设置为 `aria-hidden`，同时保留屏幕阅读器可读文本。
- `YAvatarGroup` 使用 `role="group"` 和 `label` 描述整组身份；剩余计数头像可通过 `surplusLabel` 单独命名。
- 头像设置稳定宽高和 `flex: none`，避免在工具栏或表格里被压缩变形。
