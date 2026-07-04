export type SourcePanelExperienceStatus = 'complete' | 'partial' | 'missing'

export type SourcePanelExperienceSurfaceKey = 'doc-demo' | 'live-example' | 'playground'

export type SourcePanelExperienceCheckKey =
  | 'element-plus-panel'
  | 'top-right-toolbar'
  | 'bottom-collapse'
  | 'language-switch'
  | 'shared-action-model'
  | 'playground-edit'
  | 'copy-source'

export interface SourcePanelExperienceCheck {
  key: SourcePanelExperienceCheckKey
  label: string
  passed: boolean
  detail: string
}

export interface SourcePanelExperienceItem {
  key: SourcePanelExperienceSurfaceKey
  label: string
  file: string
  status: SourcePanelExperienceStatus
  score: number
  checks: SourcePanelExperienceCheck[]
  missingChecks: SourcePanelExperienceCheck[]
}

export interface SourcePanelExperienceSummary {
  total: number
  complete: number
  partial: number
  missing: number
  averageScore: number
  elementPlusPanels: number
  topRightToolbars: number
  bottomCollapseBars: number
  languageSwitches: number
  sharedActionModels: number
  playgroundEditActions: number
  copyActions: number
  nextQueue: SourcePanelExperienceItem[]
}

interface SourcePanelExperienceSurface {
  key: SourcePanelExperienceSurfaceKey
  label: string
  file: string
  elementPlusMarkers: string[]
  topRightMarkers: string[]
  bottomCollapseMarkers: string[]
  languageMarkers: string[]
  sharedActionMarkers: string[]
  playgroundMarkers: string[]
  copyMarkers: string[]
}

const sourceModules = import.meta.glob('../components/{DocDemo,LiveExampleSourcePanel,PlaygroundWorkbench}.vue', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

const sourcePanelSurfaces: SourcePanelExperienceSurface[] = [
  {
    key: 'doc-demo',
    label: 'DocDemo static examples',
    file: 'DocDemo.vue',
    elementPlusMarkers: ['data-source-panel="element-plus"'],
    topRightMarkers: ["'code-top-right'", ':data-source-placement="sourceBarPlacement"'],
    bottomCollapseMarkers: ['data-source-placement="bottom-collapse"'],
    languageMarkers: ['data-demo-language', 'sourceLanguageOptions'],
    sharedActionMarkers: ['import ExampleSourceActions', '<ExampleSourceActions'],
    playgroundMarkers: ["key: 'playground'", '在 Playground 中编辑'],
    copyMarkers: ["key: 'copy'", '复制代码']
  },
  {
    key: 'live-example',
    label: 'Live Example source panel',
    file: 'LiveExampleSourcePanel.vue',
    elementPlusMarkers: ['data-source-panel="element-plus"'],
    topRightMarkers: ['data-source-placement="code-top-right"'],
    bottomCollapseMarkers: ['data-source-placement="bottom-collapse"'],
    languageMarkers: ['language-value-prefix="language-"', 'sourceLanguageOptions'],
    sharedActionMarkers: ['import ExampleSourceActions', '<ExampleSourceActions'],
    playgroundMarkers: ["key: 'playground'", '在 Playground 中编辑'],
    copyMarkers: ["key: 'copy-source'", '复制源码']
  },
  {
    key: 'playground',
    label: 'Playground imported source',
    file: 'PlaygroundWorkbench.vue',
    elementPlusMarkers: ['data-source-panel="element-plus"'],
    topRightMarkers: ['data-source-placement="code-top-right"'],
    bottomCollapseMarkers: ['data-source-placement="bottom-collapse"'],
    languageMarkers: ['language-value-prefix="language-"', 'playgroundCodeLanguageOptions'],
    sharedActionMarkers: ['import ExampleSourceActions', '<ExampleSourceActions'],
    playgroundMarkers: ["key: 'mode-edit'", '在 Playground 中编辑'],
    copyMarkers: ["key: 'copy-code'", '复制代码']
  }
]

function getSource(surface: SourcePanelExperienceSurface) {
  return sourceModules[`../components/${surface.file}`] ?? ''
}

function hasAllMarkers(source: string, markers: string[]) {
  return markers.every((marker) => source.includes(marker))
}

function createCheck(
  key: SourcePanelExperienceCheckKey,
  label: string,
  passed: boolean,
  detail: string
): SourcePanelExperienceCheck {
  return {
    key,
    label,
    passed,
    detail
  }
}

function getStatus(score: number): SourcePanelExperienceStatus {
  if (score === 100) {
    return 'complete'
  }

  if (score > 0) {
    return 'partial'
  }

  return 'missing'
}

function createSourcePanelExperienceItem(surface: SourcePanelExperienceSurface): SourcePanelExperienceItem {
  const source = getSource(surface)
  const checks = [
    createCheck(
      'element-plus-panel',
      'Element Plus source panel',
      hasAllMarkers(source, surface.elementPlusMarkers),
      `${surface.label} 必须暴露 data-source-panel="element-plus"，让源码阅读区和 Element Plus 示例块保持同一结构契约。`
    ),
    createCheck(
      'top-right-toolbar',
      'Top-right toolbar',
      hasAllMarkers(source, surface.topRightMarkers),
      `${surface.label} 必须把源码操作工具栏放到 data-source-placement="code-top-right"。`
    ),
    createCheck(
      'bottom-collapse',
      'Bottom collapse',
      hasAllMarkers(source, surface.bottomCollapseMarkers),
      `${surface.label} 必须提供 data-source-placement="bottom-collapse" 的整行收起入口。`
    ),
    createCheck(
      'language-switch',
      'Language switch',
      hasAllMarkers(source, surface.languageMarkers),
      `${surface.label} 必须保留 TS / JS 语言切换契约。`
    ),
    createCheck(
      'shared-action-model',
      'Shared action model',
      hasAllMarkers(source, surface.sharedActionMarkers),
      `${surface.label} 必须复用 ExampleSourceActions，避免 DocDemo、Live Example 和 Playground 的源码工具栏分叉。`
    ),
    createCheck(
      'playground-edit',
      'Playground edit',
      hasAllMarkers(source, surface.playgroundMarkers),
      `${surface.label} 必须提供进入 Playground 编辑当前源码的真实动作。`
    ),
    createCheck(
      'copy-source',
      'Copy source',
      hasAllMarkers(source, surface.copyMarkers),
      `${surface.label} 必须提供复制当前源码的动作，而不是只展示代码。`
    )
  ]
  const missingChecks = checks.filter((check) => !check.passed)
  const score = Math.round(((checks.length - missingChecks.length) / Math.max(checks.length, 1)) * 100)

  return {
    key: surface.key,
    label: surface.label,
    file: surface.file,
    status: getStatus(score),
    score,
    checks,
    missingChecks
  }
}

export function getSourcePanelExperienceItems(): SourcePanelExperienceItem[] {
  return sourcePanelSurfaces.map(createSourcePanelExperienceItem)
}

export function getSourcePanelExperienceSummary(): SourcePanelExperienceSummary {
  const items = getSourcePanelExperienceItems()
  const countWithPassedCheck = (key: SourcePanelExperienceCheckKey) =>
    items.filter((item) => item.checks.some((check) => check.key === key && check.passed)).length

  return {
    total: items.length,
    complete: items.filter((item) => item.status === 'complete').length,
    partial: items.filter((item) => item.status === 'partial').length,
    missing: items.filter((item) => item.status === 'missing').length,
    averageScore: Math.round(items.reduce((total, item) => total + item.score, 0) / Math.max(items.length, 1)),
    elementPlusPanels: countWithPassedCheck('element-plus-panel'),
    topRightToolbars: countWithPassedCheck('top-right-toolbar'),
    bottomCollapseBars: countWithPassedCheck('bottom-collapse'),
    languageSwitches: countWithPassedCheck('language-switch'),
    sharedActionModels: countWithPassedCheck('shared-action-model'),
    playgroundEditActions: countWithPassedCheck('playground-edit'),
    copyActions: countWithPassedCheck('copy-source'),
    nextQueue: items
      .filter((item) => item.missingChecks.length > 0)
      .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label))
  }
}
