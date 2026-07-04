import type { ComponentApi, ComponentMeta } from './componentRegistry'
import { getApiLiveCoverageItems } from './apiLiveCoverage'
import { getAccessibilityEvidence } from './accessibilityEvidence'
import { getComponentThemeEvidence } from './componentThemeEvidence'
import { getInteractionContract } from './interactionContracts'
import { getLiveExampleSourceQualityItem } from './liveExampleSourceQuality'
import type { LiveExampleProfile } from './liveExamples'

export type ComponentQualityTone = 'success' | 'warning' | 'info'

export interface ComponentQualityItem {
  key: 'api' | 'api-live' | 'live' | 'source' | 'repro' | 'accessibility' | 'theme' | 'keyboard'
  label: string
  value: string
  detail: string
  tone: ComponentQualityTone
}

const apiLiveCoverageByComponentName = new Map(
  getApiLiveCoverageItems().map((item) => [item.component.name, item])
)

function hasApiRows(api: ComponentApi | undefined) {
  if (!api) {
    return false
  }

  return Boolean(
    api.props?.length ||
    api.events?.length ||
    api.slots?.length ||
    api.types?.length
  )
}

function getApiSummary(api: ComponentApi | undefined): ComponentQualityItem {
  if (!hasApiRows(api)) {
    return {
      key: 'api',
      label: 'API',
      value: 'Missing',
      detail: '需要补齐 props、events、slots 或 types 结构化数据。',
      tone: 'warning'
    }
  }

  const sections = [
    api?.props?.length ? 'props' : '',
    api?.events?.length ? 'events' : '',
    api?.slots?.length ? 'slots' : '',
    api?.types?.length ? 'types' : ''
  ].filter(Boolean)

  return {
    key: 'api',
    label: 'API',
    value: 'Structured',
    detail: `已登记 ${sections.join(' / ')}，组件页和 API Reference 共用同一份数据。`,
    tone: 'success'
  }
}

function getApiLiveSummary(component: ComponentMeta, api: ComponentApi | undefined): ComponentQualityItem {
  if (!hasApiRows(api)) {
    return {
      key: 'api-live',
      label: 'API Live',
      value: 'Needed',
      detail: '需要先补齐结构化 API 数据，再把 API 行关联到 Live Example 证据。',
      tone: 'warning'
    }
  }

  const item = apiLiveCoverageByComponentName.get(component.name)

  if (!item || item.total === 0) {
    return {
      key: 'api-live',
      label: 'API Live',
      value: 'Needed',
      detail: '需要把 API 行关联到 Live Example、事件日志、插槽源码、类型映射或方法测试计划。',
      tone: 'warning'
    }
  }

  if (item.missing > 0 || item.partial > 0) {
    return {
      key: 'api-live',
      label: 'API Live',
      value: `${item.rate}%`,
      detail: `${item.covered}/${item.total} API rows 已关联证据，仍有 ${item.partial + item.missing} 行需要补场景或可视化属性。`,
      tone: 'warning'
    }
  }

  return {
    key: 'api-live',
    label: 'API Live',
    value: 'Linked',
    detail: `${item.covered}/${item.total} API rows 全部可反链到 Live evidence，避免 API 表和示例脱节。`,
    tone: 'success'
  }
}

function getLiveSummary(liveProfile?: LiveExampleProfile): ComponentQualityItem {
  if (!liveProfile) {
    return {
      key: 'live',
      label: 'Live',
      value: 'Needed',
      detail: '还需要补充 LiveExampleRunner 示例，避免文档只停留在静态代码。',
      tone: 'warning'
    }
  }

  if (liveProfile.scenarioDepth === 'workflow' && liveProfile.scenarios.length) {
    const scenarioLabels = liveProfile.scenarios.slice(0, 3).map((scenario) => scenario.label).join(' / ')

    return {
      key: 'live',
      label: 'Live',
      value: 'Workflow',
      detail: `拥有 guided 在线示例，并登记 ${liveProfile.scenarios.length} 个 workflow 场景：${scenarioLabels}。`,
      tone: 'success'
    }
  }

  if (liveProfile.mode === 'guided') {
    return {
      key: 'live',
      label: 'Live',
      value: 'Guided',
      detail: '拥有可编辑在线示例、源码复制、响应式预览、事件日志和可视化属性面板。',
      tone: 'success'
    }
  }

  return {
    key: 'live',
    label: 'Live',
    value: 'Source-first',
    detail: '拥有安全源码编辑、预览、复制、事件日志和草稿能力，后续可继续补充可视化属性面板。',
    tone: 'info'
  }
}

function getReproSummary(liveProfile?: LiveExampleProfile): ComponentQualityItem {
  if (!liveProfile) {
    return {
      key: 'repro',
      label: 'Repro',
      value: 'Needed',
      detail: '还需要 Live example 的 Repro bundle，方便维护者复制最小工程复现材料。',
      tone: 'warning'
    }
  }

  if (liveProfile.capabilities.includes('repro-bundle')) {
    return {
      key: 'repro',
      label: 'Repro',
      value: 'Bundle',
      detail: '可复制 package.json、src/main.ts、src/App.vue、主题、场景和属性状态。',
      tone: 'success'
    }
  }

  return {
    key: 'repro',
    label: 'Repro',
    value: 'Missing',
    detail: '已有在线示例，但缺少可复制的最小工程复现包。',
    tone: 'warning'
  }
}

function getSourceSummary(liveProfile?: LiveExampleProfile): ComponentQualityItem {
  if (!liveProfile) {
    return {
      key: 'source',
      label: 'Source',
      value: 'Needed',
      detail: '还需要 Live example source quality 证据，覆盖源码复制、安装命令、API map、场景链接和 Playground handoff。',
      tone: 'warning'
    }
  }

  const quality = getLiveExampleSourceQualityItem(liveProfile)

  if (quality.status === 'complete') {
    return {
      key: 'source',
      label: 'Source',
      value: 'Complete',
      detail: `${quality.checks.length}/${quality.checks.length} source workflow checks passed：API map ${quality.apiCoverageRate}%，Playground ${quality.playgroundComponent}。`,
      tone: 'success'
    }
  }

  return {
    key: 'source',
    label: 'Source',
    value: `${quality.score}%`,
    detail: `${quality.missingChecks.length} source workflow checks need work：${quality.missingChecks.map((check) => check.label).join(' / ')}。`,
    tone: 'warning'
  }
}

function getAccessibilitySummary(component: ComponentMeta): ComponentQualityItem {
  const evidence = getAccessibilityEvidence(component.name)

  if (evidence?.risk === 'critical') {
    return {
      key: 'accessibility',
      label: 'A11y',
      value: 'Critical covered',
      detail: evidence.summary,
      tone: 'success'
    }
  }

  if (evidence?.risk === 'complex') {
    return {
      key: 'accessibility',
      label: 'A11y',
      value: 'Complex covered',
      detail: evidence.summary,
      tone: 'success'
    }
  }

  if (component.accessibility === 'native') {
    return {
      key: 'accessibility',
      label: 'A11y',
      value: 'Native',
      detail: '优先复用原生控件语义，焦点、键盘和表单关系更稳定。',
      tone: 'success'
    }
  }

  if (component.accessibility === 'documented') {
    return {
      key: 'accessibility',
      label: 'A11y',
      value: 'Documented',
      detail: '已在组件页或 API 数据中说明语义、键盘或辅助技术约定。',
      tone: 'success'
    }
  }

  return {
    key: 'accessibility',
    label: 'A11y',
    value: 'Review',
    detail: '需要补充语义、键盘路径和屏幕阅读器行为验证。',
    tone: 'warning'
  }
}

function getKeyboardSummary(component: ComponentMeta): ComponentQualityItem {
  const keyboardHeavyFamilies: ComponentMeta['family'][] = ['form', 'overlay', 'admin', 'productivity']
  const needsExplicitKeyboard = keyboardHeavyFamilies.includes(component.family)
  const contract = getInteractionContract(component.name)

  if (contract) {
    return {
      key: 'keyboard',
      label: 'Keyboard',
      value: contract.maturity === 'verified' ? 'Verified' : 'Documented',
      detail: `${contract.pattern}：${contract.keyboard.slice(0, 2).join('；')}。`,
      tone: contract.maturity === 'verified' ? 'success' : 'info'
    }
  }

  return needsExplicitKeyboard
    ? {
        key: 'keyboard',
        label: 'Keyboard',
        value: 'Needed',
        detail: '该类组件需要登记 Tab、方向键、Escape、Enter 或 Space 等交互契约和测试证据。',
        tone: 'warning'
      }
    : {
        key: 'keyboard',
        label: 'Keyboard',
        value: 'Simple',
        detail: '以链接、按钮、状态或展示语义为主，保持焦点可见和可读即可。',
        tone: 'info'
      }
}

function getThemeSummary(component: ComponentMeta): ComponentQualityItem {
  const evidence = getComponentThemeEvidence(component.name)

  if (!evidence || evidence.tokenCount === 0) {
    return {
      key: 'theme',
      label: 'Theme',
      value: 'Needed',
      detail: '未在组件源码中发现 Yok UI token，需要补充 CSS 变量或主题继承证据。',
      tone: 'warning'
    }
  }

  const categories = evidence.categories.slice(0, 4).join(' / ')

  return {
    key: 'theme',
    label: 'Theme',
    value: component.family === 'theme' ? 'Provider' : 'Token linked',
    detail: `${evidence.sourcePath} 发现 ${evidence.tokenCount} 处 token 引用，覆盖 ${categories || 'component'} 主题类别。`,
    tone: 'success'
  }
}

export function getComponentQualityItems(
  component: ComponentMeta,
  api: ComponentApi | undefined,
  liveProfile?: LiveExampleProfile
): ComponentQualityItem[] {
  return [
    getApiSummary(api),
    getApiLiveSummary(component, api),
    getLiveSummary(liveProfile),
    getSourceSummary(liveProfile),
    getReproSummary(liveProfile),
    getAccessibilitySummary(component),
    getThemeSummary(component),
    getKeyboardSummary(component)
  ]
}

export function getComponentQualityScore(items: ComponentQualityItem[]) {
  const passed = items.filter((item) => item.tone !== 'warning').length

  return Math.round((passed / Math.max(items.length, 1)) * 100)
}
