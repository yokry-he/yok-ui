<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  auditThemeLabRelease,
  auditThemeLabContrast,
  createThemeLabCss,
  createThemeLabReleaseChecklist,
  createThemeLabReport,
  createThemeLabTypeScriptConfig,
  createThemeLabTokens,
  defaultThemeLabState,
  themeLabDensityPresets,
  type ThemeLabDensity,
  type ThemeLabPreviewMode
} from '../data/themeLab'

type ThemeTokenGroup = 'color' | 'radius' | 'space' | 'shadow' | 'motion' | 'zIndex'

const primary = ref(defaultThemeLabState.primary)
const surface = ref(defaultThemeLabState.surface)
const text = ref(defaultThemeLabState.text)
const textMuted = ref(defaultThemeLabState.textMuted)
const radius = ref(defaultThemeLabState.radius)
const density = ref<ThemeLabDensity>(defaultThemeLabState.density)
const selector = ref(defaultThemeLabState.selector)
const previewMode = ref<ThemeLabPreviewMode>('product')
const copied = ref(false)
const copiedReport = ref(false)
const copiedConfig = ref(false)
const copiedChecklist = ref(false)
const copiedToken = ref('')
const tokenQuery = ref('')
const selectedTokenGroup = ref<'all' | ThemeTokenGroup>('all')
const previewModes: ThemeLabPreviewMode[] = ['product', 'admin', 'brand']

const themeState = computed(() => ({
  primary: primary.value,
  surface: surface.value,
  text: text.value,
  textMuted: textMuted.value,
  radius: radius.value,
  density: density.value,
  selector: selector.value
}))

const themeTokens = computed(() => createThemeLabTokens(themeState.value))
const themeVars = computed(() => Object.entries(themeTokens.value).reduce<Record<string, string>>((vars, [groupName, groupValue]) => {
  Object.entries(groupValue as Record<string, string>).forEach(([tokenName, tokenValue]) => {
    vars[`--yok-${groupName}-${tokenName}`] = tokenValue
  })

  return vars
}, {}))
const activeDensity = computed(() => themeLabDensityPresets[density.value])
const generatedCss = computed(() => createThemeLabCss(themeState.value))
const generatedReport = computed(() => createThemeLabReport(themeState.value))
const generatedReleaseChecklist = computed(() => createThemeLabReleaseChecklist(themeState.value))
const generatedTypeScriptConfig = computed(() => createThemeLabTypeScriptConfig(themeState.value))
const contrastResults = computed(() => auditThemeLabContrast(themeState.value))
const releaseAudit = computed(() => auditThemeLabRelease(themeState.value))
const contrastPassed = computed(() => contrastResults.value.filter((result) => result.passed).length)
const contrastScore = computed(() => `${contrastPassed.value}/${contrastResults.value.length}`)
const tokenGroups = computed(() => [
  { label: 'Color', count: Object.keys(themeTokens.value.color).length },
  { label: 'Radius', count: Object.keys(themeTokens.value.radius).length },
  { label: 'Space', count: Object.keys(themeTokens.value.space).length },
  { label: 'Shadow', count: Object.keys(themeTokens.value.shadow).length },
  { label: 'Motion', count: Object.keys(themeTokens.value.motion).length },
  { label: 'Z-index', count: Object.keys(themeTokens.value.zIndex).length }
])
const tokenGroupOptions = computed(() => [
  {
    label: 'All',
    value: 'all' as const,
    count: tokenEntries.value.length
  },
  ...Object.entries(themeTokens.value).map(([groupName, groupValue]) => ({
    label: groupName === 'zIndex' ? 'Z-index' : groupName,
    value: groupName as ThemeTokenGroup,
    count: Object.keys(groupValue as Record<string, string>).length
  }))
])
const tokenEntries = computed(() =>
  Object.entries(themeTokens.value).flatMap(([groupName, groupValue]) =>
    Object.entries(groupValue as Record<string, string>).map(([tokenName, tokenValue]) => {
      const cssName = `--yok-${groupName}-${tokenName}`

      return {
        key: `${groupName}.${tokenName}`,
        group: groupName as ThemeTokenGroup,
        groupLabel: groupName === 'zIndex' ? 'Z-index' : groupName,
        name: tokenName,
        cssName,
        value: tokenValue,
        cssDeclaration: `${cssName}: ${tokenValue};`
      }
    })
  )
)
const filteredTokenEntries = computed(() => {
  const normalizedQuery = tokenQuery.value.trim().toLowerCase()

  return tokenEntries.value.filter((entry) => {
    const matchesGroup = selectedTokenGroup.value === 'all' || entry.group === selectedTokenGroup.value
    const matchesQuery = !normalizedQuery || [
      entry.key,
      entry.groupLabel,
      entry.name,
      entry.cssName,
      entry.value
    ].some((value) => value.toLowerCase().includes(normalizedQuery))

    return matchesGroup && matchesQuery
  })
})
const previewTitle = computed(() => ({
  product: 'Personal product surface',
  admin: 'Admin density preview',
  brand: 'Brand landing preview'
})[previewMode.value])

async function copyTheme() {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(generatedCss.value)
  }

  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1200)
}

async function copyThemeReport() {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(generatedReport.value)
  }

  copiedReport.value = true
  window.setTimeout(() => {
    copiedReport.value = false
  }, 1200)
}

async function copyThemeConfig() {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(generatedTypeScriptConfig.value)
  }

  copiedConfig.value = true
  window.setTimeout(() => {
    copiedConfig.value = false
  }, 1200)
}

async function copyReleaseChecklist() {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(generatedReleaseChecklist.value)
  }

  copiedChecklist.value = true
  window.setTimeout(() => {
    copiedChecklist.value = false
  }, 1200)
}

async function copyTokenDeclaration(entry: { key: string; cssDeclaration: string }) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(entry.cssDeclaration)
  }

  copiedToken.value = entry.key
  window.setTimeout(() => {
    if (copiedToken.value === entry.key) {
      copiedToken.value = ''
    }
  }, 1200)
}
</script>

<template>
  <section class="theme-lab" aria-label="Theme lab">
    <div class="theme-lab__intro">
      <p class="docs-eyebrow">theme lab</p>
      <h2>用可视化方式生成 yok-ui 主题变量</h2>
      <p>
        Element Plus 有全局配置与主题变量；Yok UI 的方向是更轻量：
        用少量核心 token 驱动颜色、圆角、密度和组件气质，同时把对比度和 CSS 导出放到同一个流程里。
      </p>
    </div>

    <div class="theme-lab__grid">
      <div class="theme-lab__controls">
        <label>
          <span>Primary</span>
          <input v-model="primary" type="color" />
          <code>{{ primary }}</code>
        </label>
        <label>
          <span>Surface</span>
          <input v-model="surface" type="color" />
          <code>{{ surface }}</code>
        </label>
        <label>
          <span>Text</span>
          <input v-model="text" type="color" />
          <code>{{ text }}</code>
        </label>
        <label>
          <span>Muted text</span>
          <input v-model="textMuted" type="color" />
          <code>{{ textMuted }}</code>
        </label>
        <label>
          <span>Radius</span>
          <input v-model.number="radius" type="range" min="8" max="24" />
          <code>{{ radius }}px</code>
        </label>
        <label>
          <span>Density</span>
          <select v-model="density">
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="roomy">Roomy</option>
          </select>
          <code>{{ activeDensity.label }}</code>
        </label>
        <label>
          <span>CSS selector</span>
          <input v-model="selector" class="theme-lab__text-input" type="text" aria-label="CSS selector" />
          <code>{{ selector || ':root' }}</code>
        </label>
      </div>

      <div class="theme-lab__preview" :style="themeVars">
        <div class="theme-lab__preview-tabs" role="tablist" aria-label="Theme preview mode">
          <button
            v-for="mode in previewModes"
            :key="mode"
            type="button"
            :class="{ active: previewMode === mode }"
            @click="previewMode = mode"
          >
            {{ mode }}
          </button>
        </div>
        <div class="theme-lab__preview-card">
          <YTag tone="info">Theme preview</YTag>
          <h3>{{ previewTitle }}</h3>
          <p>
            主题实验室会保持语义色不乱用，只改变品牌色、表面层级、圆角和密度。
          </p>
          <div class="theme-lab__preview-actions">
            <YButton variant="primary">Primary action</YButton>
            <YButton variant="secondary">Secondary</YButton>
          </div>
          <YProgress :value="72" tone="primary" label="Token coverage" striped />
          <YAlert v-if="previewMode === 'admin'" tone="info" title="Admin note">
            密度和边框 token 会直接影响列表、筛选和工具栏的可扫描性。
          </YAlert>
          <YBrandHero
            v-if="previewMode === 'brand'"
            title="Yok UI theme"
            description="Brand preview keeps the same token contract while allowing stronger first-screen expression."
            primary-text="Preview"
            secondary-text="Tokens"
          />
        </div>
      </div>

      <div class="theme-lab__audit">
        <div class="theme-lab__audit-header">
          <span>Contrast audit</span>
          <strong>{{ contrastScore }} passed</strong>
        </div>
        <ul>
          <li v-for="result in contrastResults" :key="result.name" :data-passed="result.passed">
            <span>{{ result.name }}</span>
            <strong>{{ result.ratio }}:1</strong>
            <em>{{ result.passed ? 'AA' : 'Review' }}</em>
          </li>
        </ul>
      </div>

      <div class="theme-lab__release">
        <div class="theme-lab__release-header">
          <div>
            <span>Release audit</span>
            <strong>{{ releaseAudit.score }} / 100</strong>
          </div>
          <button type="button" class="theme-lab__copy-checklist" @click="copyReleaseChecklist">
            {{ copiedChecklist ? '已复制清单' : '复制发布清单' }}
          </button>
        </div>
        <p>
          {{ releaseAudit.status === 'ready'
            ? '当前主题已经满足发布前 token、对比度、选择器和语义色门禁。'
            : '当前主题仍有发布前需要复核的 token 或对比度门禁。' }}
        </p>
        <ul class="theme-lab__release-list">
          <li
            v-for="check in releaseAudit.checks"
            :key="check.key"
            :data-passed="check.passed"
          >
            <span>{{ check.passed ? 'Pass' : 'Review' }}</span>
            <strong>{{ check.label }}</strong>
            <small>{{ check.detail }}</small>
          </li>
        </ul>
      </div>

      <div class="theme-lab__tokens">
        <div v-for="group in tokenGroups" :key="group.label">
          <strong>{{ group.count }}</strong>
          <span>{{ group.label }} tokens</span>
        </div>
      </div>

      <section class="theme-lab__token-inspector" aria-label="Theme token inspector">
        <header class="theme-lab__token-inspector-header">
          <div>
            <span>Token inspector</span>
            <strong>{{ filteredTokenEntries.length }} / {{ tokenEntries.length }} tokens</strong>
          </div>
          <label class="theme-lab__token-search">
            <span>Search tokens</span>
            <input v-model="tokenQuery" type="search" placeholder="primary, radius, --yok-space..." />
          </label>
        </header>
        <div class="theme-lab__token-groups" aria-label="Token group filter">
          <button
            v-for="group in tokenGroupOptions"
            :key="group.value"
            type="button"
            :class="{ active: selectedTokenGroup === group.value }"
            @click="selectedTokenGroup = group.value"
          >
            <span>{{ group.label }}</span>
            <small>{{ group.count }}</small>
          </button>
        </div>
        <div v-if="filteredTokenEntries.length" class="theme-lab__token-table" aria-label="Generated token variables">
          <button
            v-for="entry in filteredTokenEntries"
            :key="entry.key"
            type="button"
            class="theme-lab__token-row"
            @click="copyTokenDeclaration(entry)"
          >
            <span class="theme-lab__token-group">{{ entry.groupLabel }}</span>
            <code>{{ entry.cssName }}</code>
            <strong>{{ entry.value }}</strong>
            <em>{{ copiedToken === entry.key ? '已复制' : '复制' }}</em>
          </button>
        </div>
        <p v-else class="theme-lab__token-empty" role="status">
          没有匹配的 token。换一个关键词，或切回 All 继续浏览。
        </p>
      </section>

      <div class="theme-lab__code">
        <div>
          <span>Generated CSS variables · {{ selector || ':root' }}</span>
          <nav class="theme-lab__code-actions" aria-label="Theme export actions">
            <button type="button" class="theme-lab__copy-report" @click="copyThemeReport">
              {{ copiedReport ? '已复制报告' : '复制报告' }}
            </button>
            <button type="button" class="theme-lab__copy-checklist" @click="copyReleaseChecklist">
              {{ copiedChecklist ? '已复制清单' : '复制发布清单' }}
            </button>
            <button type="button" class="theme-lab__copy-ts-config" @click="copyThemeConfig">
              {{ copiedConfig ? '已复制配置' : '复制 TS 配置' }}
            </button>
            <button type="button" @click="copyTheme">{{ copied ? '已复制变量' : '复制变量' }}</button>
          </nav>
        </div>
        <pre><code>{{ generatedCss }}</code></pre>
      </div>
    </div>
  </section>
</template>
