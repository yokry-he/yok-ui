<script setup lang="ts">
const logos = ['Core', 'Product', 'Admin', 'Brand']

const logoCloudSetup = [
  "import { YLogoCloud } from '@yok-ui/brand'",
  '',
  "const logos = ['Core', 'Product', 'Admin', 'Brand']"
].join('\n')

const basicCode = '<YLogoCloud title="Built for every package layer" :logos="logos" />'
</script>

# Logo Cloud

Logo Cloud 用于展示合作方、项目分组、技术栈或包名称，适合品牌页中的信任区。

## Example

<DocDemo
  title="Package layers"
  description="标识云适合展示包分层、技术栈或合作方，每一项都应是可读文本。"
  :code="basicCode"
  :setup="logoCloudSetup"
  :usage="['brand package', 'logo list', 'readable labels']"
>
  <YLogoCloud title="Built for every package layer" :logos="logos" />
</DocDemo>

## Live example

<LiveExampleRunner preset="logoCloud" />

## API

<ComponentApiSection name="YLogoCloud" />

## Accessibility

- `logos` 中的每一项都应是可读品牌、包名或技术名称，不应只传装饰图片。
- `title` 用于说明这一组标识的含义，例如合作方、技术栈或包分层。
- 标识云通常是展示内容，若需要跳转应由外层页面提供清晰链接文本。
