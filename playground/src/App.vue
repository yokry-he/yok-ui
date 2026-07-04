<script setup lang="ts">
import { computed, ref } from 'vue'
import { YBrandHero, YFeatureGrid, YLogoCloud, YProfileCard } from '@yok-ui/brand'
import {
  YAlert,
  YBadge,
  YButton,
  YCard,
  YCheckbox,
  YDivider,
  YDrawer,
  YDropdown,
  YEmpty,
  YFormItem,
  YInput,
  YMessage,
  YModal,
  YPagination,
  YPopover,
  YRadioGroup,
  YSelect,
  YSwitch,
  YTabs,
  YTag,
  YTable,
  YTextarea,
  YThemeProvider,
  YTooltip
} from '@yok-ui/core'
import { YDataToolbar, YMetricCard, YPageHeader, YSearchPanel } from '@yok-ui/admin'
import { YCodeBlock, YCommandPalette, YCopyButton, YThemeSwitcher } from '@yok-ui/product'

type ThemeName = 'yok-light' | 'yok-clean'
type PackageKey = 'core' | 'product' | 'admin' | 'brand'

interface PackageTab {
  key: PackageKey
  label: string
  title: string
  description: string
  status: string
  components: string[]
}

const theme = ref<ThemeName>('yok-light')
const selectedPackage = ref<PackageKey>('core')
const commandOpen = ref(false)
const searchQuery = ref('Yok UI')
const description = ref('A fresh cute Vue 3 component system.')
const cuteMode = ref(true)
const modalOpen = ref(false)
const drawerOpen = ref(false)
const dropdownOpen = ref(false)
const popoverOpen = ref(false)
const radioValue = ref('core')
const selectValue = ref('core')
const tabValue = ref('forms')
const actionMessage = ref('Choose an action')
const tablePage = ref(2)
const adminFilters = ref<Record<string, string>>({})

const brandFeatures = [
  { title: 'Fresh by default', description: 'Soft surfaces, readable type and calm interactions.', meta: '01' },
  { title: 'Package aware', description: 'Brand pages can explain Core, Product, Admin and Brand clearly.', meta: '02' },
  { title: 'Personal ready', description: 'Profile and trust sections help build a portfolio quickly.', meta: '03' }
]

const radioOptions = [
  { label: 'Core', value: 'core' },
  { label: 'Product', value: 'product' },
  { label: 'Admin', value: 'admin' }
]

const selectOptions = [
  { label: 'Core package', value: 'core' },
  { label: 'Product package', value: 'product' },
  { label: 'Admin package', value: 'admin' }
]

const coreTabs = [
  { label: 'Forms', value: 'forms' },
  { label: 'Overlay', value: 'overlay' },
  { label: 'Status', value: 'status' }
]

const dropdownItems = [
  { label: 'Edit component', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Archive', value: 'archive' }
]

const tableColumns = [
  { key: 'name', label: 'Component' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status', align: 'center' as const }
]

const tableRows = [
  { id: 1, name: 'YTable', type: 'Data display', status: 'Stable' },
  { id: 2, name: 'YPagination', type: 'Navigation', status: 'Stable' },
  { id: 3, name: 'YPopover', type: 'Overlay', status: 'Beta' }
]

const adminSearchFields = [
  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    placeholder: 'All status',
    options: [
      { label: 'Stable', value: 'stable' },
      { label: 'Beta', value: 'beta' }
    ]
  }
]

const packageTabs: PackageTab[] = [
  {
    key: 'core',
    label: 'Core',
    title: '基础组件底座',
    description: '按钮、输入、标签、反馈和主题容器，所有场景包共享同一套交互语言。',
    status: 'Phase 1 ready',
    components: [
      'YButton',
      'YInput',
      'YTextarea',
      'YSelect',
      'YFormItem',
      'YCheckbox',
      'YRadioGroup',
      'YSwitch',
      'YTabs',
      'YPagination',
      'YModal',
      'YDrawer',
      'YDropdown',
      'YPopover',
      'YMessage',
      'YAlert',
      'YTable',
      'YCard',
      'YDivider',
      'YTooltip',
      'YTag',
      'YBadge',
      'YEmpty'
    ]
  },
  {
    key: 'product',
    label: 'Product',
    title: '个人产品工具',
    description: '命令面板、主题切换、代码块和复制按钮，让个人工具更像成熟产品。',
    status: 'Phase 1 ready',
    components: ['YCommandPalette', 'YCopyButton', 'YCodeBlock', 'YThemeSwitcher']
  },
  {
    key: 'admin',
    label: 'Admin',
    title: '后台管理场景',
    description: '页面标题、指标卡片、筛选面板和数据工具栏，开始覆盖真实后台列表页。',
    status: 'Phase 2 ready',
    components: ['YPageHeader', 'YMetricCard', 'YSearchPanel', 'YDataToolbar']
  },
  {
    key: 'brand',
    label: 'Brand',
    title: '品牌展示页面',
    description: '面向个人主页、作品集和产品官网，把组件库气质延展到展示型页面。',
    status: 'Phase 3 ready',
    components: ['YBrandHero', 'YFeatureGrid', 'YProfileCard', 'YLogoCloud']
  }
]

const commands = [
  { id: 'install', label: 'Copy install command' },
  { id: 'core', label: 'Browse core components' },
  { id: 'product', label: 'Browse product components' },
  { id: 'theme', label: 'Switch theme preview' }
]

const selectedPackageInfo = computed(() => {
  return packageTabs.find((item) => item.key === selectedPackage.value) ?? packageTabs[0]
})

function handleCommand(command: { id: string }) {
  if (command.id === 'core' || command.id === 'product') {
    selectedPackage.value = command.id
  }

  if (command.id === 'theme') {
    theme.value = theme.value === 'yok-light' ? 'yok-clean' : 'yok-light'
  }

  commandOpen.value = false
}
</script>

<template>
  <YThemeProvider :theme="theme" class="site-shell">
    <nav class="site-nav" aria-label="Primary">
      <a class="brand-lockup" href="#top" aria-label="Yok UI home">
        <span class="brand-mark">Y</span>
        <span>
          <strong>Yok UI</strong>
          <small>Vue 3 component system</small>
        </span>
      </a>

      <div class="nav-links" aria-label="Sections">
        <a href="#packages">Packages</a>
        <a href="#components">Components</a>
        <a href="#blocks">Blocks</a>
        <a href="#install">Install</a>
      </div>

      <div class="nav-actions">
        <YThemeSwitcher v-model="theme" />
        <YButton variant="primary" size="sm" @click="commandOpen = true">Command</YButton>
      </div>
    </nav>

    <header id="top" class="hero-section">
      <div class="hero-scene" aria-hidden="true">
        <div class="scene-panel scene-panel-main">
          <div class="scene-toolbar">
            <span />
            <span />
            <span />
          </div>
          <div class="scene-row scene-row-strong" />
          <div class="scene-row" />
          <div class="scene-row scene-row-short" />
          <div class="scene-widget-grid">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div class="scene-chip scene-chip-a">Core</div>
        <div class="scene-chip scene-chip-b">Product</div>
        <div class="scene-mini scene-mini-a" />
        <div class="scene-mini scene-mini-b" />
      </div>

      <div class="hero-content">
        <p class="eyebrow">fresh cute · typed · multi package</p>
        <h1>Yok UI</h1>
        <p class="hero-copy">
          一个面向个人产品、后台管理和品牌展示的 Vue 3 组件系统。参考成熟组件库的信息架构，
          但默认气质更清爽、更轻、更像你自己的产品。
        </p>
        <div class="hero-actions">
          <YButton variant="primary" size="lg" @click="commandOpen = true">Open Command</YButton>
          <a class="text-link" href="#components">Explore components</a>
        </div>
        <div class="hero-stats" aria-label="Yok UI phase one stats">
          <span><strong>4</strong> packages</span>
          <span><strong>37</strong> starter components</span>
          <span><strong>2</strong> themes</span>
        </div>
      </div>
    </header>

    <main>
      <section id="packages" class="section-band package-band">
        <div class="section-heading">
          <p class="eyebrow">package strategy</p>
          <h2>像主流组件库一样清晰分类，但按你的场景拆包</h2>
          <p>官网入口不再只是 demo 堆叠，而是让访问者先理解 Core、Product、Admin、Brand 各自解决什么问题。</p>
        </div>

        <div class="package-grid">
          <button
            v-for="item in packageTabs"
            :key="item.key"
            class="package-card"
            :class="{ 'package-card-active': selectedPackage === item.key }"
            type="button"
            @click="selectedPackage = item.key"
          >
            <span class="package-card-topline">
              <strong>{{ item.label }}</strong>
              <YTag :tone="item.key === 'admin' || item.key === 'brand' ? 'info' : 'success'">
                {{ item.status }}
              </YTag>
            </span>
            <span>{{ item.description }}</span>
          </button>
        </div>
      </section>

      <section id="components" class="section-band component-lab">
        <div class="section-heading">
          <p class="eyebrow">component lab</p>
          <h2>{{ selectedPackageInfo.title }}</h2>
          <p>{{ selectedPackageInfo.description }}</p>
        </div>

        <div class="component-layout">
          <aside class="component-index" aria-label="Component groups">
            <button
              v-for="item in packageTabs"
              :key="item.key"
              class="index-button"
              :class="{ 'index-button-active': selectedPackage === item.key }"
              type="button"
              @click="selectedPackage = item.key"
            >
              <span>{{ item.label }}</span>
              <YBadge :value="item.components.length" />
            </button>
          </aside>

          <div class="component-preview">
            <div class="preview-header">
              <div>
                <YTag tone="success">{{ selectedPackageInfo.status }}</YTag>
                <h3>{{ selectedPackageInfo.label }} preview</h3>
              </div>
              <YCopyButton text="pnpm add @yok-ui/core @yok-ui/product @yok-ui/admin @yok-ui/brand @yok-ui/themes" />
            </div>

            <div v-if="selectedPackage === 'core'" class="preview-demo-grid">
              <YFormItem label="Library name" hint="FormItem keeps label, hint and error spacing consistent." required>
                <YInput v-model="searchQuery" />
              </YFormItem>
              <YTextarea
                v-model="description"
                label="Description"
                helper="Textarea joins the mainstream form baseline."
              />
              <YSelect v-model="selectValue" label="Package" :options="selectOptions" />
              <YRadioGroup v-model="radioValue" label="Package focus" :options="radioOptions" />
              <div class="inline-controls">
                <YButton variant="primary">Create component</YButton>
                <YButton variant="secondary">Secondary</YButton>
                <YTooltip content="Open a focused create dialog">
                  <YButton variant="ghost" @click="modalOpen = true">Open modal</YButton>
                </YTooltip>
                <YButton variant="ghost" @click="drawerOpen = true">Open drawer</YButton>
                <YDropdown
                  v-model:open="dropdownOpen"
                  label="Actions"
                  :items="dropdownItems"
                  @select="actionMessage = `Selected ${$event.label}`"
                />
                <YPopover
                  v-model:open="popoverOpen"
                  title="New in Core"
                  content="Table, Pagination, FormItem and Popover make real product pages easier."
                >
                  <template #trigger>
                    <YButton variant="secondary">What's new</YButton>
                  </template>
                </YPopover>
              </div>
              <div class="inline-controls">
                <YSwitch v-model="cuteMode" label="Fresh cute mode" />
                <YCheckbox v-model="cuteMode" label="Fresh cute mode" />
                <YTag tone="success">Stable</YTag>
                <YTag tone="warning">Beta</YTag>
                <YBadge value="29" />
              </div>
              <YAlert tone="success" title="Core baseline expanded">
                Form, feedback, data display and overlay components now share the same token system.
              </YAlert>
              <YMessage tone="info" title="Action">{{ actionMessage }}</YMessage>
              <YTabs v-model="tabValue" :tabs="coreTabs">
                <template #default="{ active }">
                  <p v-if="active === 'forms'" class="tab-note">
                    Input、Textarea、Select、Checkbox、RadioGroup 形成第一批表单底座。
                  </p>
                  <p v-else-if="active === 'overlay'" class="tab-note">
                    Modal、Drawer 和 Dropdown 覆盖确认、侧边任务流和紧凑菜单。
                  </p>
                  <p v-else class="tab-note">
                    Tag、Badge、Empty 和 Switch 负责轻量反馈与状态表达。
                  </p>
                </template>
              </YTabs>
              <YDivider label="Display" />
              <YTable :columns="tableColumns" :data="tableRows" compact striped>
                <template #cell-status="{ value }">
                  <YTag :tone="value === 'Stable' ? 'success' : 'warning'">{{ value }}</YTag>
                </template>
              </YTable>
              <YPagination v-model:page="tablePage" :page-size="10" :total="72" />
              <YCard title="Documentation card" description="A reusable surface for docs, settings and dashboards." interactive>
                <div class="inline-controls">
                  <YTag tone="info">Card</YTag>
                  <YTag tone="success">Ready</YTag>
                </div>
              </YCard>
            </div>

            <div v-else-if="selectedPackage === 'product'" class="preview-demo-grid">
              <YCodeBlock language="ts" code="import { YCommandPalette, YThemeSwitcher } from '@yok-ui/product'" />
              <div class="inline-controls">
                <YThemeSwitcher v-model="theme" />
                <YButton variant="primary" @click="commandOpen = true">Open command palette</YButton>
              </div>
            </div>

            <div v-else-if="selectedPackage === 'admin'" class="preview-demo-grid">
              <YPageHeader
                title="Component inventory"
                eyebrow="Admin"
                status="Phase 2 ready"
                description="Filter components, review coverage and prepare release work."
              >
                <template #actions>
                  <YButton variant="secondary">Export</YButton>
                  <YButton variant="primary">Create</YButton>
                </template>
              </YPageHeader>
              <div class="admin-metrics">
                <YMetricCard label="Components" value="33" trend="+4" description="Admin package started." />
                <YMetricCard label="Packages" value="4" trend="multi" tone="info" description="Core, Product, Admin, Brand." />
              </div>
              <YSearchPanel v-model="adminFilters" :fields="adminSearchFields" />
              <YDataToolbar title="Component list" description="A reusable toolbar for data-heavy pages." :count="33">
                <YButton variant="secondary">Batch edit</YButton>
                <YButton variant="primary">Publish</YButton>
              </YDataToolbar>
            </div>

            <div v-else-if="selectedPackage === 'brand'" class="preview-demo-grid">
              <YBrandHero
                eyebrow="Yok UI"
                title="Fresh cute Vue components"
                description="A multi-package component system for products, admin screens and brand pages."
                primary-text="Get started"
                secondary-text="Browse docs"
              />
              <YFeatureGrid :features="brandFeatures" />
              <div class="brand-preview-grid">
                <YProfileCard
                  name="Yok"
                  role="Vue component designer"
                  bio="Building a fresh cute design system for personal products."
                  :tags="['Vue 3', 'Design System']"
                />
                <YLogoCloud title="Package layers" :logos="['Core', 'Product', 'Admin', 'Brand']" />
              </div>
            </div>

            <YEmpty
              v-else
              :title="`${selectedPackageInfo.label} package is on the roadmap`"
              :description="selectedPackageInfo.description"
            >
              <template #action>
                <YButton variant="secondary">View roadmap</YButton>
              </template>
            </YEmpty>

            <div class="component-list">
              <span v-for="name in selectedPackageInfo.components" :key="name">{{ name }}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="blocks" class="section-band blocks-band">
        <div class="section-heading">
          <p class="eyebrow">blocks and resources</p>
          <h2>不止有组件，还要有能复制到项目里的场景块</h2>
        </div>

        <div class="resource-grid">
          <article>
            <span class="resource-icon">01</span>
            <h3>Guide</h3>
            <p>设计原则、安装方式、主题 token 和可访问性约定。</p>
          </article>
          <article>
            <span class="resource-icon">02</span>
            <h3>Components</h3>
            <p>按 Core、Product、Admin、Brand 浏览不同类型组件。</p>
          </article>
          <article>
            <span class="resource-icon">03</span>
            <h3>Blocks</h3>
            <p>命令中心、设置页、后台列表和个人主页等可复制场景。</p>
          </article>
        </div>
      </section>

      <section id="install" class="section-band install-band">
        <div class="install-copy">
          <p class="eyebrow">start tiny</p>
          <h2>先装底座，再按场景扩展</h2>
          <p>先把 themes、core、product 做扎实，再用 Admin 和 Brand 承接真实后台与展示页面。</p>
        </div>
        <YCodeBlock
          language="bash"
          code="pnpm add @yok-ui/core @yok-ui/product @yok-ui/admin @yok-ui/brand @yok-ui/themes"
        />
      </section>
    </main>

    <YCommandPalette
      :open="commandOpen"
      :commands="commands"
      @close="commandOpen = false"
      @select="handleCommand"
    />

    <YModal
      :open="modalOpen"
      title="Create component"
      description="A compact modal pattern for focused tasks."
      @close="modalOpen = false"
    >
      <div class="modal-form">
        <YInput v-model="searchQuery" label="Component name" />
        <YTextarea v-model="description" label="Notes" />
      </div>
      <template #footer>
        <YButton variant="ghost" @click="modalOpen = false">Cancel</YButton>
        <YButton variant="primary" @click="modalOpen = false">Create</YButton>
      </template>
    </YModal>

    <YDrawer
      :open="drawerOpen"
      title="Package settings"
      description="A side task flow for editing without leaving the page."
      @close="drawerOpen = false"
    >
      <div class="modal-form">
        <YSelect v-model="selectValue" label="Package" :options="selectOptions" />
        <YRadioGroup v-model="radioValue" label="Focus" :options="radioOptions" />
        <YMessage tone="success" title="Synced">Drawer uses the same fresh-cute token system.</YMessage>
      </div>
      <template #footer>
        <YButton variant="ghost" @click="drawerOpen = false">Cancel</YButton>
        <YButton variant="primary" @click="drawerOpen = false">Save</YButton>
      </template>
    </YDrawer>
  </YThemeProvider>
</template>
