<script setup lang="ts">
const profileTags = ['Vue 3', 'Design System', 'Yok UI']

const profileCardSetup = [
  "import { YProfileCard } from '@yok-ui/brand'",
  '',
  "const profileTags = ['Vue 3', 'Design System', 'Yok UI']"
].join('\n')

const basicCode = [
  '<YProfileCard',
  '  name="Yok"',
  '  role="Vue component designer"',
  '  bio="Building a fresh cute component system for personal products and admin tools."',
  '  :tags="profileTags"',
  '/>'
].join('\n')
</script>

# Profile Card

Profile Card 用于个人品牌、团队成员或作者介绍，适合个人主页和作品集页面。

::: tip TIP
`YProfileCard` 文档已按 Select 页面同一套结构组织：每个场景独立成段，示例块保留 TS/JS 切换、复制代码和展开源码，API 与可访问性约定集中在页尾。
:::

## Author profile {#profile-card-author-profile}

<DocDemo
  title="Author profile"
  description="个人资料卡用明确姓名、角色、简介和短标签建立身份，不依赖头像单独传达信息。"
  :code="basicCode"
  :setup="profileCardSetup"
  :usage="['brand package', 'profile', 'tag list']"
>
  <YProfileCard
    name="Yok"
    role="Vue component designer"
    bio="Building a fresh cute component system for personal products and admin tools."
    :tags="profileTags"
  />
</DocDemo>

## Profile Card API {#profile-card-api}

<ComponentApiSection name="YProfileCard" />

## Accessibility {#accessibility}

- `name` 和 `role` 使用文本输出，卡片不依赖头像传达身份。
- `avatarText` 只作为视觉缩写，完整姓名仍应由 `name` 提供。
- 标签列表保持短文本，避免把长描述塞进标签造成阅读负担。
