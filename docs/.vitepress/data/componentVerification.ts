import runtimeReport from './a11y-runtime-report.generated.json'
import { components, type ComponentMeta } from './componentRegistry'
import {
  getDocDemoSourceQualityItems,
  type DocDemoSourceQualityItem
} from './docDemoSourceQuality'

export type ComponentVerificationStage =
  | 'registered'
  | 'documented'
  | 'example-ready'
  | 'browser-verified'
  | 'release-ready'

export interface ComponentVerificationItem {
  component: ComponentMeta
  stage: ComponentVerificationStage
  documented: boolean
  exampleReady: boolean
  browserVerified: boolean
  releaseReady: boolean
  verifiedViewports: string[]
  docsQuality?: DocDemoSourceQualityItem
}

export interface ComponentVerificationSummary {
  registeredComponents: number
  registeredRoutes: number
  documentedRoutes: number
  exampleReadyRoutes: number
  browserVerifiedRoutes: number
  releaseReadyComponents: number
}

interface RuntimeAuditResult {
  route: string
  viewportId: string
  passed: boolean
}

const requiredBrowserViewports = ['desktop', 'tablet', 'mobile'] as const
const docsQualityByRoute = new Map(
  getDocDemoSourceQualityItems().map((item) => [item.docs, item])
)
const runtimeResults = runtimeReport.results as RuntimeAuditResult[]

function getVerifiedViewports(route: string) {
  const routeResults = runtimeResults.filter((result) => result.route === route)
  const viewports = new Set(routeResults.filter((result) => result.passed).map((result) => result.viewportId))
  const hasFailure = routeResults.some((result) => !result.passed)

  if (hasFailure || !requiredBrowserViewports.every((viewport) => viewports.has(viewport))) {
    return []
  }

  return Array.from(viewports).sort()
}

function getStage(item: Omit<ComponentVerificationItem, 'stage'>): ComponentVerificationStage {
  if (item.releaseReady) {
    return 'release-ready'
  }

  if (item.browserVerified) {
    return 'browser-verified'
  }

  if (item.exampleReady) {
    return 'example-ready'
  }

  if (item.documented) {
    return 'documented'
  }

  return 'registered'
}

function createVerificationItem(component: ComponentMeta): ComponentVerificationItem {
  const docsQuality = docsQualityByRoute.get(component.docs)
  const documented = Boolean(docsQuality?.demoCount)
  const exampleReady = docsQuality?.status === 'complete'
  const verifiedViewports = getVerifiedViewports(component.docs)
  const browserVerified = verifiedViewports.length === requiredBrowserViewports.length
  const releaseReady = component.status === 'Stable' && documented && exampleReady && browserVerified
  const evidence = {
    component,
    documented,
    exampleReady,
    browserVerified,
    releaseReady,
    verifiedViewports,
    docsQuality
  }

  return {
    ...evidence,
    stage: getStage(evidence)
  }
}

export function getComponentVerificationItems(): ComponentVerificationItem[] {
  return components.map(createVerificationItem)
}

export function getComponentVerificationSummary(): ComponentVerificationSummary {
  const items = getComponentVerificationItems()
  const uniqueRouteCount = (predicate: (item: ComponentVerificationItem) => boolean) =>
    new Set(items.filter(predicate).map((item) => item.component.docs)).size

  return {
    registeredComponents: items.length,
    registeredRoutes: uniqueRouteCount(() => true),
    documentedRoutes: uniqueRouteCount((item) => item.documented),
    exampleReadyRoutes: uniqueRouteCount((item) => item.exampleReady),
    browserVerifiedRoutes: uniqueRouteCount((item) => item.browserVerified),
    releaseReadyComponents: items.filter((item) => item.releaseReady).length
  }
}
