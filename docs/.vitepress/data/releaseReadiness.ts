import {
  componentApis,
  components,
  type ComponentFamily,
  type ComponentMeta,
  type ComponentPackage,
  type ComponentStatus
} from './componentRegistry'
import { getApiLiveCoverageItems } from './apiLiveCoverage'
import { getAccessibilityEvidence } from './accessibilityEvidence'
import { getComponentRouteContext } from './componentRouteContext'
import { getComponentThemeEvidence } from './componentThemeEvidence'
import { hasInteractionContract } from './interactionContracts'
import { getLiveExampleSourceQualityItem } from './liveExampleSourceQuality'
import { liveExampleProfileByDocs } from './liveExamples'

export type ReleaseReadinessGateKey =
  | 'api'
  | 'api-live'
  | 'workflow-live'
  | 'source-quality'
  | 'playground-edit-share'
  | 'theme'
  | 'component-maturity'
  | 'a11y'
  | 'interaction-contract'

export interface ReleaseReadinessGate {
  key: ReleaseReadinessGateKey
  label: string
  passed: boolean
  detail: string
}

export interface ReleaseReadinessItem {
  name: ComponentMeta['name']
  docs: ComponentMeta['docs']
  title: ComponentMeta['title']
  packageName: ComponentPackage
  family: ComponentFamily
  status: ComponentStatus
  score: number
  releaseCandidate: boolean
  gates: ReleaseReadinessGate[]
  missingGates: ReleaseReadinessGate[]
}

export interface ReleaseReadinessSummary {
  total: number
  stable: number
  nonStable: number
  candidateCount: number
  blockedCount: number
  gateLabels: string
  candidates: ReleaseReadinessItem[]
  blocked: ReleaseReadinessItem[]
}

const interactionPriorityFamilies = new Set<ComponentFamily>(['form', 'overlay', 'data', 'admin', 'productivity'])
const apiLiveCoverageByName = new Map(
  getApiLiveCoverageItems().map((item) => [item.component.name, item])
)

function countApiRows(component: ComponentMeta) {
  const api = componentApis[component.name]

  return (api?.props?.length ?? 0) +
    (api?.events?.length ?? 0) +
    (api?.slots?.length ?? 0) +
    (api?.methods?.length ?? 0) +
    (api?.types?.length ?? 0)
}

function createGate(
  key: ReleaseReadinessGateKey,
  label: string,
  passed: boolean,
  detail: string
): ReleaseReadinessGate {
  return {
    key,
    label,
    passed,
    detail
  }
}

function getMaturityScore(component: ComponentMeta) {
  const context = getComponentRouteContext(component.docs)

  if (!context) {
    return 0
  }

  const passed = context.maturityItems.filter((item) => item.tone !== 'warning').length

  return Math.round((passed / Math.max(context.maturityItems.length, 1)) * 100)
}

function createReleaseReadinessItem(component: ComponentMeta): ReleaseReadinessItem {
  const apiRows = countApiRows(component)
  const apiLiveCoverage = apiLiveCoverageByName.get(component.name)
  const liveProfile = liveExampleProfileByDocs.get(component.docs)
  const sourceQuality = liveProfile ? getLiveExampleSourceQualityItem(liveProfile) : undefined
  const hasPlaygroundEditShare = Boolean(
    sourceQuality?.checks.some((check) => check.key === 'playground-edit-share' && check.passed)
  )
  const themeEvidence = getComponentThemeEvidence(component.name)
  const maturityScore = getMaturityScore(component)
  const accessibilityEvidence = getAccessibilityEvidence(component.name)
  const requiresInteractionContract = interactionPriorityFamilies.has(component.family)
  const hasContract = hasInteractionContract(component.name)
  const gates: ReleaseReadinessGate[] = [
    createGate(
      'api',
      'API',
      apiRows > 0,
      apiRows > 0 ? `${apiRows} structured API rows.` : '需要结构化 props、events、slots、methods 或 types。'
    ),
    createGate(
      'api-live',
      'API Live',
      Boolean(apiLiveCoverage && apiLiveCoverage.total > 0 && apiLiveCoverage.partial === 0 && apiLiveCoverage.missing === 0),
      apiLiveCoverage
        ? `${apiLiveCoverage.covered}/${apiLiveCoverage.total} API rows linked to live evidence.`
        : '需要 API row 到 Live Example 的反向证据。'
    ),
    createGate(
      'workflow-live',
      'Workflow Live',
      Boolean(liveProfile && liveProfile.mode === 'guided' && liveProfile.scenarioDepth === 'workflow' && liveProfile.scenarios.length >= 3),
      liveProfile
        ? `${liveProfile.scenarios.length} workflow scenarios.`
        : '需要 guided workflow live example。'
    ),
    createGate(
      'source-quality',
      'Source',
      Boolean(sourceQuality && sourceQuality.status === 'complete'),
      sourceQuality
        ? `${sourceQuality.score}% source, repro, API map and Playground handoff.`
        : '需要源码复制、复现包、API map 和 Playground handoff。'
    ),
    createGate(
      'playground-edit-share',
      'Edited Source Share',
      hasPlaygroundEditShare,
      hasPlaygroundEditShare
        ? 'Playground edited source can be shared without reusing a stale handoff payload.'
        : '需要保证 Playground 编辑后的源码进入分享链接，而不是继续指向旧 handoff。'
    ),
    createGate(
      'theme',
      'Theme',
      Boolean(themeEvidence && themeEvidence.tokenCount > 0),
      themeEvidence && themeEvidence.tokenCount > 0
        ? `${themeEvidence.tokenCount} token references in ${themeEvidence.sourcePath}.`
        : '需要组件源码中的 Yok UI token 证据。'
    ),
    createGate(
      'component-maturity',
      'Maturity',
      maturityScore === 100,
      `${maturityScore}% component page maturity evidence.`
    ),
    createGate(
      'a11y',
      'A11y',
      Boolean(accessibilityEvidence && accessibilityEvidence.categories.includes('semantics') && accessibilityEvidence.categories.includes('docs')),
      accessibilityEvidence
        ? `${accessibilityEvidence.risk} accessibility evidence with ${accessibilityEvidence.categories.join(' / ')}.`
        : '需要可访问性证据档案。'
    ),
    createGate(
      'interaction-contract',
      'Interaction',
      !requiresInteractionContract || hasContract,
      requiresInteractionContract
        ? hasContract
          ? 'High-priority family has keyboard, focus and ARIA interaction contract.'
          : '高优先级组件需要 interaction contract。'
        : '当前组件族不强制要求 interaction contract。'
    )
  ]
  const missingGates = gates.filter((gate) => !gate.passed)
  const score = Math.round(((gates.length - missingGates.length) / Math.max(gates.length, 1)) * 100)

  return {
    name: component.name,
    docs: component.docs,
    title: component.title,
    packageName: component.packageName,
    family: component.family,
    status: component.status,
    score,
    releaseCandidate: component.status !== 'Stable' && missingGates.length === 0,
    gates,
    missingGates
  }
}

export function getReleaseReadinessItems(): ReleaseReadinessItem[] {
  return components.map(createReleaseReadinessItem)
}

export function getReleaseReadinessSummary(): ReleaseReadinessSummary {
  const items = getReleaseReadinessItems()
  const nonStableItems = items.filter((item) => item.status !== 'Stable')
  const candidates = nonStableItems
    .filter((item) => item.releaseCandidate)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
  const blocked = nonStableItems
    .filter((item) => !item.releaseCandidate)
    .sort((a, b) => b.score - a.score || a.missingGates.length - b.missingGates.length || a.title.localeCompare(b.title))

  return {
    total: items.length,
    stable: items.filter((item) => item.status === 'Stable').length,
    nonStable: nonStableItems.length,
    candidateCount: candidates.length,
    blockedCount: blocked.length,
    gateLabels: 'API Live / Workflow Live / Source / Edited Source Share / Theme / A11y',
    candidates,
    blocked
  }
}
