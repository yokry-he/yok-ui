import {
  componentFamilies,
  components,
  packageLabels,
  type ComponentFamily,
  type ComponentPackage
} from './componentRegistry'

export type DocDemoSourceQualityStatus = 'complete' | 'needs-handoff' | 'needs-doc-demo'
export type DocDemoSourceQualityCheckKey = 'uses-doc-demo' | 'code-bound' | 'setup-handoff'

export interface DocDemoSourceQualityCheck {
  key: DocDemoSourceQualityCheckKey
  label: string
  passed: boolean
  detail: string
}

export interface DocDemoSourceQualityItem {
  docs: string
  title: string
  packageName: ComponentPackage
  packageLabel: string
  family: ComponentFamily
  familyTitle: string
  status: DocDemoSourceQualityStatus
  score: number
  demoCount: number
  rawDemoBoxCount: number
  codeDemoCount: number
  completeHandoffCount: number
  missingHandoffTitles: string[]
  checks: DocDemoSourceQualityCheck[]
}

export interface DocDemoSourceQualitySummary {
  totalDocs: number
  docsWithDocDemo: number
  totalDemos: number
  totalCodeDemos: number
  completeDocs: number
  needsDocDemo: number
  needsHandoff: number
  rawDemoBoxDocs: string[]
  completeRate: number
  nextQueue: DocDemoSourceQualityItem[]
}

const componentDocModules = import.meta.glob('../../components/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

function normalizeDocsRoute(path: string) {
  return path
    .replace(/^.*?\/components\//, '/components/')
    .replace(/\.md$/, '')
}

function getFamilyTitle(family: ComponentFamily) {
  return componentFamilies.find((item) => item.id === family)?.title ?? family
}

function getComponentDocSource(docs: string) {
  return componentDocModules[Object.keys(componentDocModules).find((path) => normalizeDocsRoute(path) === docs) ?? ''] ?? ''
}

function getDocDemoBlocks(source: string) {
  return Array.from(source.matchAll(/<DocDemo[\s\S]*?>/g)).map((match) => match[0])
}

function getRawDemoBoxCount(source: string) {
  return (source.match(/class="demo-box"/g) ?? []).length
}

function getCodeBindingName(block: string) {
  return block.match(/:code="([^"]+)"/)?.[1] ?? ''
}

function getDemoTitle(block: string) {
  return block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'
}

function hasScriptSetupInBinding(source: string, bindingName: string) {
  if (!bindingName) {
    return false
  }

  const bindingStart = source.indexOf(`const ${bindingName} =`)

  if (bindingStart === -1) {
    return false
  }

  const nextBindingStart = source.indexOf('\nconst ', bindingStart + 1)
  const bindingSource = source.slice(bindingStart, nextBindingStart === -1 ? undefined : nextBindingStart)

  return bindingSource.includes('<script setup')
}

function getChecks(demoCount: number, codeDemoCount: number, missingHandoffTitles: string[]): DocDemoSourceQualityCheck[] {
  return [
    {
      key: 'uses-doc-demo',
      label: '统一示例容器',
      passed: demoCount > 0,
      detail: demoCount > 0
        ? `${demoCount} 个 DocDemo 示例。`
        : '需要把静态示例迁移到 DocDemo，统一源码展开和复制。'
    },
    {
      key: 'code-bound',
      label: '源码绑定',
      passed: codeDemoCount > 0,
      detail: codeDemoCount > 0
        ? `${codeDemoCount} 个示例可展开源码。`
        : '需要给 DocDemo 绑定 code。'
    },
    {
      key: 'setup-handoff',
      label: '完整 SFC handoff',
      passed: missingHandoffTitles.length === 0,
      detail: missingHandoffTitles.length === 0
        ? '所有源码示例都能提供 setup 或完整 SFC。'
        : `缺少 setup handoff：${missingHandoffTitles.join(' / ')}。`
    }
  ]
}

function createDocDemoSourceQualityItem(component: (typeof components)[number]): DocDemoSourceQualityItem {
  const source = getComponentDocSource(component.docs)
  const blocks = getDocDemoBlocks(source)
  const rawDemoBoxCount = getRawDemoBoxCount(source)
  const codeBlocks = blocks.filter((block) => block.includes(':code='))
  const missingHandoffTitles = codeBlocks.flatMap((block) => {
    const bindingName = getCodeBindingName(block)
    const hasCompleteHandoff = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

    return hasCompleteHandoff ? [] : [getDemoTitle(block)]
  })
  const checks = getChecks(blocks.length, codeBlocks.length, missingHandoffTitles)
  const passedChecks = checks.filter((check) => check.passed).length
  const score = Math.round((passedChecks / checks.length) * 100)
  const status: DocDemoSourceQualityStatus = blocks.length === 0
    ? 'needs-doc-demo'
    : score === 100
      ? 'complete'
      : 'needs-handoff'

  return {
    docs: component.docs,
    title: component.title,
    packageName: component.packageName,
    packageLabel: packageLabels[component.packageName],
    family: component.family,
    familyTitle: getFamilyTitle(component.family),
    status,
    score,
    demoCount: blocks.length,
    rawDemoBoxCount,
    codeDemoCount: codeBlocks.length,
    completeHandoffCount: codeBlocks.length - missingHandoffTitles.length,
    missingHandoffTitles,
    checks
  }
}

export function getDocDemoSourceQualityItems(): DocDemoSourceQualityItem[] {
  return components
    .filter((component) => component.docs.startsWith('/components/'))
    .map(createDocDemoSourceQualityItem)
}

export function getDocDemoSourceQualitySummary(): DocDemoSourceQualitySummary {
  const items = getDocDemoSourceQualityItems()
  const completeDocs = items.filter((item) => item.status === 'complete').length
  const docsWithDocDemo = items.filter((item) => item.demoCount > 0).length
  const needsDocDemo = items.filter((item) => item.status === 'needs-doc-demo').length
  const needsHandoff = items.filter((item) => item.status === 'needs-handoff').length
  const statusWeight: Record<DocDemoSourceQualityStatus, number> = {
    'needs-doc-demo': 0,
    'needs-handoff': 1,
    complete: 2
  }
  const nextQueue = items
    .filter((item) => item.status !== 'complete')
    .sort((a, b) => statusWeight[a.status] - statusWeight[b.status] || a.score - b.score || a.demoCount - b.demoCount || a.title.localeCompare(b.title))
    .slice(0, 8)

  return {
    totalDocs: items.length,
    docsWithDocDemo,
    totalDemos: items.reduce((total, item) => total + item.demoCount, 0),
    totalCodeDemos: items.reduce((total, item) => total + item.codeDemoCount, 0),
    completeDocs,
    needsDocDemo,
    needsHandoff,
    rawDemoBoxDocs: items.filter((item) => item.rawDemoBoxCount > 0).map((item) => item.docs),
    completeRate: Math.round((completeDocs / Math.max(items.length, 1)) * 100),
    nextQueue
  }
}
