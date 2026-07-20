import { getApiLiveCoverageItems } from './apiLiveCoverage'
import {
  liveExampleProfiles,
  type LiveExampleCapability,
  type LiveExamplePreset,
  type LiveExampleProfile
} from './liveExamples'

export type LiveExampleSourceQualityStatus = 'complete' | 'partial' | 'missing'

export type LiveExampleSourceQualityCheckKey =
  | 'safe-editable-source'
  | 'source-copy-modes'
  | 'install-command'
  | 'repro-bundle'
  | 'api-map'
  | 'source-panel-handoff'
  | 'edited-source-share'
  | 'scenario-share-link'
  | 'state-share-link'
  | 'event-repro'

export interface LiveExampleSourceQualityCheck {
  key: LiveExampleSourceQualityCheckKey
  label: string
  passed: boolean
  detail: string
}

export interface LiveExampleSourceQualityItem {
  docs: string
  preset: LiveExamplePreset
  title: string
  packageName: string
  status: LiveExampleSourceQualityStatus
  score: number
  apiRows: number
  apiCoverageRate: number
  checks: LiveExampleSourceQualityCheck[]
  missingChecks: LiveExampleSourceQualityCheck[]
}

export interface LiveExampleSourceQualitySummary {
  total: number
  complete: number
  partial: number
  missing: number
  averageScore: number
  apiMapped: number
  sourcePanelHandoffReady: number
  editedSourceShareReady: number
  reproReady: number
  sourceCopyReady: number
  nextQueue: LiveExampleSourceQualityItem[]
}

const requiredCapabilities: LiveExampleCapability[] = [
  'safe-template',
  'editable-source',
  'source-copy',
  'repro-bundle',
  'event-log',
  'visual-props'
]

function hasCapabilities(profile: LiveExampleProfile, capabilities: LiveExampleCapability[]) {
  return capabilities.every((capability) => profile.capabilities.includes(capability))
}

function getApiCoverageByDocs() {
  const byDocs = new Map<string, { total: number, covered: number, partial: number, missing: number }>()

  for (const item of getApiLiveCoverageItems()) {
    const current = byDocs.get(item.component.docs) ?? {
      total: 0,
      covered: 0,
      partial: 0,
      missing: 0
    }

    current.total += item.total
    current.covered += item.covered
    current.partial += item.partial
    current.missing += item.missing
    byDocs.set(item.component.docs, current)
  }

  return byDocs
}

const apiCoverageByDocs = getApiCoverageByDocs()

function getApiCoverage(profile: LiveExampleProfile) {
  const coverage = apiCoverageByDocs.get(profile.docs)

  if (!coverage || coverage.total === 0) {
    return {
      total: 0,
      covered: 0,
      rate: 0
    }
  }

  return {
    total: coverage.total,
    covered: coverage.covered,
    rate: Math.round((coverage.covered / Math.max(coverage.total, 1)) * 100)
  }
}

function createCheck(
  key: LiveExampleSourceQualityCheckKey,
  label: string,
  passed: boolean,
  detail: string
): LiveExampleSourceQualityCheck {
  return {
    key,
    label,
    passed,
    detail
  }
}

function getStatus(score: number): LiveExampleSourceQualityStatus {
  if (score === 100) {
    return 'complete'
  }

  if (score > 0) {
    return 'partial'
  }

  return 'missing'
}

export function getLiveExampleSourceQualityItem(profile: LiveExampleProfile): LiveExampleSourceQualityItem {
  const apiCoverage = getApiCoverage(profile)
  const hasWorkflowShare = profile.scenarioDepth === 'workflow' &&
    profile.capabilities.includes('scenario-switching') &&
    profile.scenarios.length > 0
  const hasSourceCopyModes = hasCapabilities(profile, ['editable-source', 'source-copy'])

  const checks = [
    createCheck(
      'safe-editable-source',
      'Safe editable source',
      hasCapabilities(profile, ['safe-template', 'editable-source']),
      '源码编辑由安全模板校验保护，避免示例复制时混入危险属性或未校验模板。'
    ),
    createCheck(
      'source-copy-modes',
      'Source copy modes',
      hasSourceCopyModes,
      '源码面板可导出完整 SFC、template 片段、diff、安装命令和复现材料。'
    ),
    createCheck(
      'install-command',
      'Install command',
      hasSourceCopyModes,
      '源码面板会根据示例 import 自动生成 npm/yarn/pnpm/bun 安装命令。'
    ),
    createCheck(
      'repro-bundle',
      'Repro bundle',
      profile.capabilities.includes('repro-bundle'),
      '复现包包含 package.json、src/main.ts、src/App.vue、主题、场景、控件状态和同步快照。'
    ),
    createCheck(
      'api-map',
      'API map',
      apiCoverage.total > 0 && apiCoverage.rate === 100,
      `${apiCoverage.covered}/${apiCoverage.total} API rows 已反链到 live evidence。`
    ),
    createCheck(
      'source-panel-handoff',
      'Source panel handoff',
      hasSourceCopyModes,
      hasSourceCopyModes
        ? '源码面板会携带 sourcePanel.mode、sourcePanel.label、sourcePanel.language 和安装包管理器，用于追溯 SFC、Install、Diff 或 Repro bundle 来源。'
        : '需要源码面板复制模式支撑 sourcePanel 上下文。'
    ),
    createCheck(
      'edited-source-share',
      'Edited source share',
      hasSourceCopyModes,
      hasSourceCopyModes
        ? '编辑后的源码可复制并进入复现包，避免文档示例和实际复现材料漂移。'
        : '需要源码编辑和源码复制能力共同支撑编辑后分享。'
    ),
    createCheck(
      'scenario-share-link',
      'Scenario share link',
      hasWorkflowShare,
      hasWorkflowShare
        ? `${profile.scenarios.length} 个 workflow 场景支持 hash 深链和验收步骤。`
        : '需要 workflow 场景、scenario-switching 能力和场景链接。'
    ),
    createCheck(
      'state-share-link',
      'State share link',
      profile.capabilities.includes('visual-props'),
      '可视化属性面板状态可序列化到分享链接，并可被 live example 恢复。'
    ),
    createCheck(
      'event-repro',
      'Event repro',
      profile.capabilities.includes('event-log'),
      '事件日志、交互复现、运行报告和场景测试计划可用于复核组件交互。'
    )
  ]
  const missingChecks = checks.filter((check) => !check.passed)
  const score = Math.round(((checks.length - missingChecks.length) / Math.max(checks.length, 1)) * 100)

  return {
    docs: profile.docs,
    preset: profile.preset,
    title: profile.component?.title ?? profile.preset,
    packageName: profile.component?.packageName ?? 'Custom source',
    status: getStatus(score),
    score,
    apiRows: apiCoverage.total,
    apiCoverageRate: apiCoverage.rate,
    checks,
    missingChecks
  }
}

export function getLiveExampleSourceQualityItems() {
  return liveExampleProfiles.map((profile) => getLiveExampleSourceQualityItem(profile))
}

export function getLiveExampleSourceQualitySummary(): LiveExampleSourceQualitySummary {
  const items = getLiveExampleSourceQualityItems()
  const countWithPassedCheck = (key: LiveExampleSourceQualityCheckKey) =>
    items.filter((item) => item.checks.some((check) => check.key === key && check.passed)).length

  return {
    total: items.length,
    complete: items.filter((item) => item.status === 'complete').length,
    partial: items.filter((item) => item.status === 'partial').length,
    missing: items.filter((item) => item.status === 'missing').length,
    averageScore: Math.round(items.reduce((total, item) => total + item.score, 0) / Math.max(items.length, 1)),
    apiMapped: countWithPassedCheck('api-map'),
    sourcePanelHandoffReady: countWithPassedCheck('source-panel-handoff'),
    editedSourceShareReady: countWithPassedCheck('edited-source-share'),
    reproReady: countWithPassedCheck('repro-bundle'),
    sourceCopyReady: countWithPassedCheck('source-copy-modes'),
    nextQueue: items
      .filter((item) => item.missingChecks.length > 0)
      .sort((a, b) => a.score - b.score || a.title.localeCompare(b.title))
      .slice(0, 8)
  }
}
