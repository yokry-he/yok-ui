import {
  liveExampleProfiles,
  type LiveExampleCapability,
  type LiveExamplePreset,
  type LiveExampleProfile,
  type LiveExampleScenarioKind
} from './liveExamples'

export type LiveExampleReadinessStatus = 'excellent' | 'ready' | 'needs-depth'

export type LiveExampleReadinessCheckKey =
  | LiveExampleCapability
  | 'workflow-scenarios'
  | 'basic-scenario'
  | 'keyboard-scenario'
  | 'responsive-scenario'
  | 'edge-state-scenario'

export interface LiveExampleReadinessCheck {
  key: LiveExampleReadinessCheckKey
  label: string
  passed: boolean
  detail: string
}

export interface LiveExampleReadinessItem {
  docs: string
  preset: LiveExamplePreset
  title: string
  packageName: string
  familyTitle: string
  scenarioDepth: LiveExampleProfile['scenarioDepth']
  status: LiveExampleReadinessStatus
  score: number
  scenarioCount: number
  checks: LiveExampleReadinessCheck[]
  missingChecks: LiveExampleReadinessCheck[]
}

export interface LiveExampleReadinessSummary {
  total: number
  excellent: number
  ready: number
  needsDepth: number
  averageScore: number
  workflowReady: number
  keyboardScenarioCoverage: number
  responsiveScenarioCoverage: number
  edgeStateCoverage: number
  workflowReadyItems: LiveExampleReadinessItem[]
  propsOnlyItems: LiveExampleReadinessItem[]
  nextQueue: LiveExampleReadinessItem[]
}

const capabilityLabels: Record<LiveExampleCapability, string> = {
  'safe-template': '安全模板',
  'editable-source': '源码编辑',
  'responsive-preview': '响应式预览',
  'source-copy': '源码复制',
  'repro-bundle': '复现包',
  'event-log': '事件日志',
  drafts: '本地草稿',
  'visual-props': '可视化属性',
  'scenario-switching': '场景切换',
  'workflow-states': '工作流状态'
}

const requiredCapabilities: LiveExampleCapability[] = [
  'safe-template',
  'editable-source',
  'responsive-preview',
  'source-copy',
  'repro-bundle',
  'event-log',
  'drafts',
  'visual-props',
  'scenario-switching',
  'workflow-states'
]

function hasScenarioKind(profile: LiveExampleProfile, kind: LiveExampleScenarioKind) {
  return profile.scenarios.some((scenario) => scenario.kind === kind)
}

function hasAnyScenarioKind(profile: LiveExampleProfile, kinds: LiveExampleScenarioKind[]) {
  return profile.scenarios.some((scenario) => kinds.includes(scenario.kind))
}

function createReadinessChecks(profile: LiveExampleProfile): LiveExampleReadinessCheck[] {
  const capabilityChecks = requiredCapabilities.map((capability) => ({
    key: capability,
    label: capabilityLabels[capability],
    passed: profile.capabilities.includes(capability),
    detail: profile.capabilities.includes(capability)
      ? '已在 LiveExampleRunner 能力表登记。'
      : '需要补入 runner 能力或示例数据。'
  }))
  const scenarioChecks: LiveExampleReadinessCheck[] = [
    {
      key: 'workflow-scenarios',
      label: '工作流场景',
      passed: profile.scenarioDepth === 'workflow' && profile.scenarios.length >= 3,
      detail: `${profile.scenarios.length} 个场景，目标至少 3 个。`
    },
    {
      key: 'basic-scenario',
      label: '基础场景',
      passed: hasScenarioKind(profile, 'basic'),
      detail: '需要覆盖默认、主要或常规使用路径。'
    },
    {
      key: 'keyboard-scenario',
      label: '键盘场景',
      passed: hasScenarioKind(profile, 'keyboard'),
      detail: '需要覆盖 Tab、Enter、Space、方向键或 Escape 路径。'
    },
    {
      key: 'responsive-scenario',
      label: '响应式场景',
      passed: hasScenarioKind(profile, 'responsive'),
      detail: '需要覆盖移动端、窄屏或滚动容器下的表现。'
    },
    {
      key: 'edge-state-scenario',
      label: '边界状态',
      passed: hasAnyScenarioKind(profile, ['error', 'empty', 'loading', 'disabled']),
      detail: '需要覆盖错误、空态、加载或禁用中的至少一种。'
    }
  ]

  return [...capabilityChecks, ...scenarioChecks]
}

function getReadinessStatus(score: number): LiveExampleReadinessStatus {
  if (score === 100) {
    return 'excellent'
  }

  if (score >= 85) {
    return 'ready'
  }

  return 'needs-depth'
}

export function getLiveExampleReadinessItems(): LiveExampleReadinessItem[] {
  return liveExampleProfiles.map((profile) => {
    const checks = createReadinessChecks(profile)
    const missingChecks = checks.filter((check) => !check.passed)
    const score = Math.round(((checks.length - missingChecks.length) / Math.max(checks.length, 1)) * 100)

    return {
      docs: profile.docs,
      preset: profile.preset,
      title: profile.component.title,
      packageName: profile.component.packageName,
      familyTitle: profile.component.familyTitle,
      scenarioDepth: profile.scenarioDepth,
      status: getReadinessStatus(score),
      score,
      scenarioCount: profile.scenarios.length,
      checks,
      missingChecks
    }
  })
}

export function getLiveExampleReadinessSummary(): LiveExampleReadinessSummary {
  const items = getLiveExampleReadinessItems()
  const countWithPassedCheck = (key: LiveExampleReadinessCheckKey) =>
    items.filter((item) => item.checks.some((check) => check.key === key && check.passed)).length
  const workflowReadyItems = items
    .filter((item) => item.checks.some((check) => check.key === 'workflow-scenarios' && check.passed))
    .sort((a, b) => b.scenarioCount - a.scenarioCount || a.title.localeCompare(b.title))
  const propsOnlyItems = items
    .filter((item) => item.scenarioDepth === 'props')
    .sort((a, b) => a.score - b.score || a.title.localeCompare(b.title))

  return {
    total: items.length,
    excellent: items.filter((item) => item.status === 'excellent').length,
    ready: items.filter((item) => item.status === 'ready').length,
    needsDepth: items.filter((item) => item.status === 'needs-depth').length,
    averageScore: Math.round(items.reduce((total, item) => total + item.score, 0) / Math.max(items.length, 1)),
    workflowReady: countWithPassedCheck('workflow-scenarios'),
    keyboardScenarioCoverage: Math.round((countWithPassedCheck('keyboard-scenario') / Math.max(items.length, 1)) * 100),
    responsiveScenarioCoverage: Math.round((countWithPassedCheck('responsive-scenario') / Math.max(items.length, 1)) * 100),
    edgeStateCoverage: Math.round((countWithPassedCheck('edge-state-scenario') / Math.max(items.length, 1)) * 100),
    workflowReadyItems,
    propsOnlyItems,
    nextQueue: items
      .filter((item) => item.missingChecks.length > 0)
      .sort((a, b) => a.score - b.score || a.scenarioCount - b.scenarioCount || a.title.localeCompare(b.title))
      .slice(0, 8)
  }
}
