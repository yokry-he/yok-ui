/// <reference types="vite/client" />

import type { ComponentFamily, ComponentMeta, ComponentPackage } from './componentRegistry'
import { components } from './componentRegistry'

export type ThemeEvidenceCategory =
  | 'color'
  | 'spacing'
  | 'radius'
  | 'motion'
  | 'shadow'
  | 'z-index'
  | 'component-var'

export interface ComponentThemeEvidence {
  componentName: ComponentMeta['name']
  title: ComponentMeta['title']
  docsRoute: ComponentMeta['docs']
  packageName: ComponentPackage
  family: ComponentFamily
  sourcePath: string
  tokenCount: number
  uniqueTokenCount: number
  categories: ThemeEvidenceCategory[]
  tokens: string[]
  hasSemanticColor: boolean
  hasComponentScopedVars: boolean
}

export interface ComponentThemeEvidenceSummary {
  total: number
  tokenized: number
  semanticColor: number
  spacing: number
  radius: number
  motion: number
  shadow: number
  componentScopedVars: number
  coverageRate: number
  nextQueue: ComponentThemeEvidence[]
}

const componentSourceModules = import.meta.glob('../../../packages/*/src/components/**/*.vue', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

const componentSourceByPath = new Map(
  Object.entries(componentSourceModules).map(([path, source]) => [
    normalizeSourcePath(path),
    source
  ])
)

const sourcePathOverrides: Record<string, string> = {
  YThemeProvider: 'packages/core/src/components/theme-provider/YThemeProvider.vue',
  YConfigProvider: 'packages/core/src/components/config-provider/YConfigProvider.vue',
  YIconButton: 'packages/core/src/components/button/YIconButton.vue',
  YAvatarGroup: 'packages/core/src/components/avatar/YAvatarGroup.vue',
  YDateRangePicker: 'packages/core/src/components/date-picker/YDateRangePicker.vue',
  YDateTimePicker: 'packages/core/src/components/date-time-picker/YDateTimePicker.vue',
  YTimeSelect: 'packages/core/src/components/time-select/YTimeSelect.vue',
  YColorPickerPanel: 'packages/core/src/components/color-picker/YColorPickerPanel.vue',
  YRadioGroup: 'packages/core/src/components/radio/YRadioGroup.vue',
  YCountdown: 'packages/core/src/components/statistic/YCountdown.vue',
  YFloatButtonGroup: 'packages/core/src/components/float-button/YFloatButtonGroup.vue',
  YQRCode: 'packages/core/src/components/qr-code/YQRCode.vue',
  YTag: 'packages/core/src/components/tag/YTag.vue',
  YCheckTag: 'packages/core/src/components/tag/YCheckTag.vue',
  YBadge: 'packages/core/src/components/tag/YBadge.vue',
  YSavedViewManager: 'packages/admin/src/components/saved-views/YSavedViewManager.vue'
}

const tokenMatchers: Array<[ThemeEvidenceCategory, RegExp]> = [
  ['color', /^--yok-color-/],
  ['spacing', /^--yok-space-/],
  ['radius', /^--yok-radius-/],
  ['motion', /^--yok-motion-/],
  ['shadow', /^--yok-shadow-/],
  ['z-index', /^--yok-zIndex-/],
  ['component-var', /^--yok-(?!color-|space-|radius-|motion-|shadow-|zIndex-)/]
]

function normalizeSourcePath(path: string) {
  return path.replace(/^.*?(packages\/)/, '$1')
}

function componentNameToSlug(componentName: string) {
  return componentName
    .replace(/^Y/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

function packageNameToFolder(packageName: ComponentPackage) {
  return packageName.replace('@yok-ui/', '')
}

function getExpectedSourcePath(component: ComponentMeta) {
  if (sourcePathOverrides[component.name]) {
    return sourcePathOverrides[component.name]
  }

  const packageFolder = packageNameToFolder(component.packageName)
  const componentSlug = componentNameToSlug(component.name)

  return `packages/${packageFolder}/src/components/${componentSlug}/${component.name}.vue`
}

function getTokensFromSource(source: string) {
  const matches = source.match(/--yok-[A-Za-z0-9-]+/g) ?? []

  return Array.from(new Set(matches)).sort()
}

function getTokenReferenceCount(source: string) {
  return (source.match(/--yok-[A-Za-z0-9-]+/g) ?? []).length
}

function getCategories(tokens: string[]) {
  const categories = new Set<ThemeEvidenceCategory>()

  for (const token of tokens) {
    for (const [category, matcher] of tokenMatchers) {
      if (matcher.test(token)) {
        categories.add(category)
      }
    }
  }

  return Array.from(categories)
}

function createEvidence(component: ComponentMeta): ComponentThemeEvidence {
  const sourcePath = getExpectedSourcePath(component)
  const source = componentSourceByPath.get(sourcePath) ?? ''
  const tokens = getTokensFromSource(source)
  const categories = getCategories(tokens)

  return {
    componentName: component.name,
    title: component.title,
    docsRoute: component.docs,
    packageName: component.packageName,
    family: component.family,
    sourcePath,
    tokenCount: getTokenReferenceCount(source),
    uniqueTokenCount: tokens.length,
    categories,
    tokens,
    hasSemanticColor: categories.includes('color'),
    hasComponentScopedVars: categories.includes('component-var')
  }
}

export const componentThemeEvidence = components.map(createEvidence)

export const componentThemeEvidenceByName = new Map(
  componentThemeEvidence.map((item) => [item.componentName, item])
)

export function getComponentThemeEvidence(componentName: string) {
  return componentThemeEvidenceByName.get(componentName)
}

export function getComponentThemeEvidenceSummary(): ComponentThemeEvidenceSummary {
  const tokenized = componentThemeEvidence.filter((item) => item.tokenCount > 0)
  const total = componentThemeEvidence.length

  return {
    total,
    tokenized: tokenized.length,
    semanticColor: tokenized.filter((item) => item.categories.includes('color')).length,
    spacing: tokenized.filter((item) => item.categories.includes('spacing')).length,
    radius: tokenized.filter((item) => item.categories.includes('radius')).length,
    motion: tokenized.filter((item) => item.categories.includes('motion')).length,
    shadow: tokenized.filter((item) => item.categories.includes('shadow')).length,
    componentScopedVars: tokenized.filter((item) => item.categories.includes('component-var')).length,
    coverageRate: Math.round((tokenized.length / Math.max(total, 1)) * 100),
    nextQueue: componentThemeEvidence.filter((item) => item.tokenCount === 0)
  }
}
