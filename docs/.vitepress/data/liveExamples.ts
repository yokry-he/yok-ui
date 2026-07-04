import { componentFamilies, components, type ComponentMeta } from './componentRegistry'

export type LiveExamplePreset =
  | 'default'
  | 'button'
  | 'input'
  | 'autocomplete'
  | 'mention'
  | 'select'
  | 'cascader'
  | 'calendar'
  | 'carousel'
  | 'datePicker'
  | 'dateRangePicker'
  | 'dateTimePicker'
  | 'alert'
  | 'loading'
  | 'progress'
  | 'modal'
  | 'drawer'
  | 'tabs'
  | 'tour'
  | 'table'
  | 'timePicker'
  | 'transfer'
  | 'tree'
  | 'treeSelect'
  | 'form'
  | 'inputNumber'
  | 'inputOtp'
  | 'inputTag'
  | 'rate'
  | 'slider'
  | 'colorPicker'
  | 'checkbox'
  | 'switch'
  | 'pagination'
  | 'tooltip'
  | 'icon'
  | 'image'
  | 'qrCode'
  | 'avatar'
  | 'backtop'
  | 'floatButton'
  | 'affix'
  | 'anchor'
  | 'collapse'
  | 'descriptions'
  | 'divider'
  | 'formItem'
  | 'formSummary'
  | 'link'
  | 'list'
  | 'layout'
  | 'menu'
  | 'popconfirm'
  | 'result'
  | 'statistic'
  | 'tagBadge'
  | 'timeline'
  | 'scrollbar'
  | 'segmented'
  | 'text'
  | 'splitter'
  | 'textarea'
  | 'radioGroup'
  | 'dropdown'
  | 'popover'
  | 'card'
  | 'empty'
  | 'skeleton'
  | 'space'
  | 'breadcrumb'
  | 'steps'
  | 'upload'
  | 'message'
  | 'messageBox'
  | 'notification'
  | 'virtualList'
  | 'watermark'
  | 'commandPalette'
  | 'codeBlock'
  | 'themeSwitcher'
  | 'brandHero'
  | 'featureGrid'
  | 'logoCloud'
  | 'profileCard'
  | 'pageHeader'
  | 'metricCard'
  | 'approvalCommentBox'
  | 'fieldArray'
  | 'searchPanel'
  | 'searchForm'
  | 'crudLayout'
  | 'filterTabs'
  | 'dataTable'
  | 'dataView'
  | 'resourcePage'
  | 'schemaForm'
  | 'bulkActionBar'
  | 'statusTimeline'
  | 'reviewWorkflow'
  | 'savedViews'
  | 'dataToolbar'
  | 'configProvider'
  | 'themeProvider'

export interface LiveExampleCoverage {
  docs: string
  preset: LiveExamplePreset
}

export interface LiveExampleComponentMeta {
  title: string
  docsTitle: string
  componentName: string
  componentNames: string[]
  packageName: ComponentMeta['packageName']
  family: ComponentMeta['family']
  familyTitle: string
  status: ComponentMeta['status']
  docs: string
  description: string
  since: string
  accessibility: ComponentMeta['accessibility']
}

export type LiveExampleCapability =
  | 'safe-template'
  | 'editable-source'
  | 'responsive-preview'
  | 'source-copy'
  | 'repro-bundle'
  | 'event-log'
  | 'drafts'
  | 'visual-props'
  | 'scenario-switching'
  | 'workflow-states'

export type LiveExampleScenarioDepth = 'props' | 'workflow'

export type LiveExampleScenarioKind =
  | 'basic'
  | 'controlled'
  | 'copy'
  | 'disabled'
  | 'empty'
  | 'loading'
  | 'error'
  | 'multi'
  | 'keyboard'
  | 'responsive'
  | 'remote'
  | 'filter'
  | 'search'
  | 'status'
  | 'virtual'
  | 'summary'
  | 'layout'
  | 'composition'

export interface LiveExampleScenario {
  key: string
  label: string
  kind: LiveExampleScenarioKind
  description: string
  controlKey?: string
  controlValue?: string | number | boolean
}

export interface LiveExampleProfile extends LiveExampleCoverage {
  mode: 'guided' | 'source-first'
  component: LiveExampleComponentMeta
  capabilities: LiveExampleCapability[]
  scenarioDepth: LiveExampleScenarioDepth
  scenarios: LiveExampleScenario[]
}

export type LiveExampleValidationCheckKey =
  | 'safe-template'
  | 'editable-source'
  | 'responsive-preview'
  | 'source-copy'
  | 'repro-bundle'
  | 'event-log'
  | 'visual-props'
  | 'scenario-switching'
  | 'workflow-states'
  | 'responsive'
  | 'error-state'
  | 'loading-state'
  | 'keyboard-path'

export interface LiveExampleValidationCheck {
  key: LiveExampleValidationCheckKey
  label: string
  passed: boolean
  detail: string
}

export interface LiveExampleValidationSummary {
  preset: LiveExamplePreset
  modeLabel: string
  capabilityCount: number
  scenarioCount: number
  workflowReady: boolean
  scenarioKinds: LiveExampleScenarioKind[]
  checks: LiveExampleValidationCheck[]
}

export interface LiveExampleMatrixRow {
  preset: LiveExamplePreset
  title: string
  docsTitle: string
  componentName: string
  packageName: ComponentMeta['packageName']
  familyTitle: string
  docs: string
  handoffHref: string
  modeLabel: string
  status: ComponentMeta['status']
  capabilityCount: number
  scenarioCount: number
  scenarioKinds: LiveExampleScenarioKind[]
  workflowReady: boolean
  score: number
  passedCheckCount: number
  totalCheckCount: number
  missingChecks: string[]
}

export interface LiveExampleMatrixPackageGroup {
  packageName: ComponentMeta['packageName']
  packageLabel: string
  count: number
  workflowReadyCount: number
  scenarioCount: number
  averageScore: number
}

export interface LiveExampleMatrixSummary {
  total: number
  guidedCount: number
  workflowReadyCount: number
  exportReadyCount: number
  scenarioCount: number
  averageScore: number
  rows: LiveExampleMatrixRow[]
  attentionRows: LiveExampleMatrixRow[]
  packageGroups: LiveExampleMatrixPackageGroup[]
}

export const liveExampleCoverage: LiveExampleCoverage[] = [
  { docs: '/components/affix', preset: 'affix' },
  { docs: '/components/anchor', preset: 'anchor' },
  { docs: '/components/alert', preset: 'alert' },
  { docs: '/components/autocomplete', preset: 'autocomplete' },
  { docs: '/components/avatar', preset: 'avatar' },
  { docs: '/components/backtop', preset: 'backtop' },
  { docs: '/components/float-button', preset: 'floatButton' },
  { docs: '/components/button', preset: 'button' },
  { docs: '/components/breadcrumb', preset: 'breadcrumb' },
  { docs: '/components/approval-comment-box', preset: 'approvalCommentBox' },
  { docs: '/components/bulk-action-bar', preset: 'bulkActionBar' },
  { docs: '/components/calendar', preset: 'calendar' },
  { docs: '/components/carousel', preset: 'carousel' },
  { docs: '/components/cascader', preset: 'cascader' },
  { docs: '/components/card', preset: 'card' },
  { docs: '/components/checkbox', preset: 'checkbox' },
  { docs: '/components/code-block', preset: 'codeBlock' },
  { docs: '/components/color-picker', preset: 'colorPicker' },
  { docs: '/components/command-palette', preset: 'commandPalette' },
  { docs: '/components/config-provider', preset: 'configProvider' },
  { docs: '/components/crud-layout', preset: 'crudLayout' },
  { docs: '/components/data-table', preset: 'dataTable' },
  { docs: '/components/data-view', preset: 'dataView' },
  { docs: '/components/resource-page', preset: 'resourcePage' },
  { docs: '/components/schema-form', preset: 'schemaForm' },
  { docs: '/components/data-toolbar', preset: 'dataToolbar' },
  { docs: '/components/collapse', preset: 'collapse' },
  { docs: '/components/date-picker', preset: 'datePicker' },
  { docs: '/components/date-range-picker', preset: 'dateRangePicker' },
  { docs: '/components/date-time-picker', preset: 'dateTimePicker' },
  { docs: '/components/descriptions', preset: 'descriptions' },
  { docs: '/components/divider', preset: 'divider' },
  { docs: '/components/dropdown', preset: 'dropdown' },
  { docs: '/components/drawer', preset: 'drawer' },
  { docs: '/components/empty', preset: 'empty' },
  { docs: '/components/form', preset: 'form' },
  { docs: '/components/form-item', preset: 'formItem' },
  { docs: '/components/form-summary', preset: 'formSummary' },
  { docs: '/components/brand-hero', preset: 'brandHero' },
  { docs: '/components/feature-grid', preset: 'featureGrid' },
  { docs: '/components/field-array', preset: 'fieldArray' },
  { docs: '/components/filter-tabs', preset: 'filterTabs' },
  { docs: '/components/icon', preset: 'icon' },
  { docs: '/components/image', preset: 'image' },
  { docs: '/components/qr-code', preset: 'qrCode' },
  { docs: '/components/input', preset: 'input' },
  { docs: '/components/input-otp', preset: 'inputOtp' },
  { docs: '/components/input-tag', preset: 'inputTag' },
  { docs: '/components/input-number', preset: 'inputNumber' },
  { docs: '/components/link', preset: 'link' },
  { docs: '/components/loading', preset: 'loading' },
  { docs: '/components/list', preset: 'list' },
  { docs: '/components/layout', preset: 'layout' },
  { docs: '/components/menu', preset: 'menu' },
  { docs: '/components/mention', preset: 'mention' },
  { docs: '/components/logo-cloud', preset: 'logoCloud' },
  { docs: '/components/message', preset: 'message' },
  { docs: '/components/message-box', preset: 'messageBox' },
  { docs: '/components/metric-card', preset: 'metricCard' },
  { docs: '/components/modal', preset: 'modal' },
  { docs: '/components/notification', preset: 'notification' },
  { docs: '/components/page-header', preset: 'pageHeader' },
  { docs: '/components/pagination', preset: 'pagination' },
  { docs: '/components/popconfirm', preset: 'popconfirm' },
  { docs: '/components/popover', preset: 'popover' },
  { docs: '/components/profile-card', preset: 'profileCard' },
  { docs: '/components/progress', preset: 'progress' },
  { docs: '/components/radio-group', preset: 'radioGroup' },
  { docs: '/components/rate', preset: 'rate' },
  { docs: '/components/result', preset: 'result' },
  { docs: '/components/review-workflow', preset: 'reviewWorkflow' },
  { docs: '/components/scrollbar', preset: 'scrollbar' },
  { docs: '/components/segmented', preset: 'segmented' },
  { docs: '/components/saved-views', preset: 'savedViews' },
  { docs: '/components/search-form', preset: 'searchForm' },
  { docs: '/components/search-panel', preset: 'searchPanel' },
  { docs: '/components/select', preset: 'select' },
  { docs: '/components/skeleton', preset: 'skeleton' },
  { docs: '/components/slider', preset: 'slider' },
  { docs: '/components/space', preset: 'space' },
  { docs: '/components/splitter', preset: 'splitter' },
  { docs: '/components/statistic', preset: 'statistic' },
  { docs: '/components/status-timeline', preset: 'statusTimeline' },
  { docs: '/components/steps', preset: 'steps' },
  { docs: '/components/switch', preset: 'switch' },
  { docs: '/components/table', preset: 'table' },
  { docs: '/components/tabs', preset: 'tabs' },
  { docs: '/components/tag-badge', preset: 'tagBadge' },
  { docs: '/components/text', preset: 'text' },
  { docs: '/components/theme-switcher', preset: 'themeSwitcher' },
  { docs: '/components/textarea', preset: 'textarea' },
  { docs: '/components/time-picker', preset: 'timePicker' },
  { docs: '/components/timeline', preset: 'timeline' },
  { docs: '/components/tour', preset: 'tour' },
  { docs: '/components/tooltip', preset: 'tooltip' },
  { docs: '/components/transfer', preset: 'transfer' },
  { docs: '/components/tree', preset: 'tree' },
  { docs: '/components/tree-select', preset: 'treeSelect' },
  { docs: '/components/upload', preset: 'upload' },
  { docs: '/components/virtual-list', preset: 'virtualList' },
  { docs: '/components/watermark', preset: 'watermark' },
  { docs: '/guide/theming', preset: 'themeProvider' }
]

export const visualControlPresets: LiveExamplePreset[] = [
  'button',
  'alert',
  'loading',
  'progress',
  'input',
  'inputOtp',
  'inputTag',
  'autocomplete',
  'mention',
  'select',
  'cascader',
  'calendar',
  'carousel',
  'datePicker',
  'dateRangePicker',
  'dateTimePicker',
  'textarea',
  'timePicker',
  'tooltip',
  'dropdown',
  'popover',
  'modal',
  'drawer',
  'form',
  'table',
  'transfer',
  'tree',
  'treeSelect',
  'card',
  'tagBadge',
  'text',
  'skeleton',
  'scrollbar',
  'segmented',
  'empty',
  'upload',
  'colorPicker',
  'icon',
  'image',
  'qrCode',
  'floatButton',
  'avatar',
  'affix',
  'anchor',
  'breadcrumb',
  'checkbox',
  'rate',
  'slider',
  'space',
  'splitter',
  'link',
  'inputNumber',
  'inputOtp',
  'inputTag',
  'radioGroup',
  'switch',
  'tabs',
  'tour',
  'steps',
  'collapse',
  'popconfirm',
  'result',
  'statistic',
  'timeline',
  'virtualList',
  'watermark',
  'backtop',
  'crudLayout',
  'descriptions',
  'divider',
  'formItem',
  'formSummary',
  'list',
  'layout',
  'menu',
  'message',
  'messageBox',
  'notification',
  'reviewWorkflow',
  'statusTimeline',
  'pagination',
  'commandPalette',
  'codeBlock',
  'configProvider',
  'themeSwitcher',
  'themeProvider',
  'brandHero',
  'featureGrid',
  'logoCloud',
  'profileCard',
  'pageHeader',
  'metricCard',
  'approvalCommentBox',
  'fieldArray',
  'filterTabs',
  'dataTable',
  'dataView',
  'resourcePage',
  'schemaForm',
  'bulkActionBar',
  'dataToolbar',
  'savedViews',
  'searchPanel',
  'searchForm'
]

export const liveExampleDocs = new Set(liveExampleCoverage.map((item) => item.docs))
export const visualControlPresetSet = new Set(visualControlPresets)

export const scenarioRichPresets: LiveExamplePreset[] = [
  'alert',
  'affix',
  'anchor',
  'autocomplete',
  'avatar',
  'backtop',
  'floatButton',
  'breadcrumb',
  'brandHero',
  'approvalCommentBox',
  'bulkActionBar',
  'button',
  'calendar',
  'carousel',
  'cascader',
  'card',
  'checkbox',
  'codeBlock',
  'commandPalette',
  'configProvider',
  'collapse',
  'colorPicker',
  'crudLayout',
  'dataToolbar',
  'dataView',
  'dataTable',
  'datePicker',
  'dateRangePicker',
  'dateTimePicker',
  'descriptions',
  'divider',
  'drawer',
  'dropdown',
  'empty',
  'fieldArray',
  'filterTabs',
  'featureGrid',
  'form',
  'formItem',
  'formSummary',
  'icon',
  'image',
  'qrCode',
  'input',
  'inputOtp',
  'inputTag',
  'inputNumber',
  'mention',
  'link',
  'loading',
  'list',
  'layout',
  'menu',
  'logoCloud',
  'message',
  'messageBox',
  'metricCard',
  'modal',
  'notification',
  'pagination',
  'pageHeader',
  'profileCard',
  'popconfirm',
  'popover',
  'progress',
  'radioGroup',
  'reviewWorkflow',
  'resourcePage',
  'savedViews',
  'schemaForm',
  'rate',
  'result',
  'scrollbar',
  'segmented',
  'searchPanel',
  'searchForm',
  'select',
  'skeleton',
  'slider',
  'space',
  'splitter',
  'statistic',
  'steps',
  'statusTimeline',
  'switch',
  'table',
  'tabs',
  'tagBadge',
  'text',
  'textarea',
  'themeProvider',
  'themeSwitcher',
  'tour',
  'tooltip',
  'timeline',
  'timePicker',
  'transfer',
  'tree',
  'treeSelect',
  'upload',
  'virtualList',
  'watermark'
]

export const scenarioRichPresetSet = new Set(scenarioRichPresets)

export const liveExampleScenarios: Partial<Record<LiveExamplePreset, LiveExampleScenario[]>> = {
  autocomplete: [
    {
      key: 'component-search',
      label: '组件搜索',
      kind: 'basic',
      controlValue: 'component',
      description: '展示自由文本输入和本地建议过滤，适合组件、页面和命令快速补全。'
    },
    {
      key: 'controlled-value',
      label: '受控输入',
      kind: 'controlled',
      controlValue: 'controlled',
      description: '通过 v-model 保持输入值、选中建议和外部状态同步。'
    },
    {
      key: 'remote-loading',
      label: '远程加载',
      kind: 'loading',
      controlValue: 'loading',
      description: '异步搜索过程中显示 loading 状态，避免用户误以为没有建议。'
    },
    {
      key: 'empty-suggestions',
      label: '无匹配建议',
      kind: 'empty',
      controlValue: 'empty',
      description: '没有匹配项时展示稳定空状态，同时保留用户输入的自由文本。'
    },
    {
      key: 'disabled-suggestion',
      label: '禁用建议',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '不可选建议仍可展示说明，但鼠标和键盘都不能确认选择。'
    },
    {
      key: 'responsive-search',
      label: '窄屏搜索',
      kind: 'responsive',
      controlValue: 'responsive',
      description: '验证输入框、清空按钮和建议面板在窄屏宽度下仍然可读可点。'
    },
    {
      key: 'keyboard-search',
      label: '键盘补全',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 ArrowUp / ArrowDown 移动建议、Enter 选择、Escape 关闭弹层。'
    }
  ],
  mention: [
    {
      key: 'team-mention',
      label: '成员提及',
      kind: 'basic',
      controlValue: 'team',
      description: '在协作评论和发布说明中输入 @ 后展示成员建议。'
    },
    {
      key: 'topic-mention',
      label: '主题标签',
      kind: 'search',
      controlValue: 'topic',
      description: '使用 # 前缀提及组件、主题或任务标签，覆盖多前缀输入。'
    },
    {
      key: 'remote-mention',
      label: '远程搜索',
      kind: 'loading',
      controlValue: 'loading',
      description: '异步搜索成员时展示 loading 状态，避免误选旧建议。'
    },
    {
      key: 'empty-mention',
      label: '无匹配成员',
      kind: 'empty',
      controlValue: 'empty',
      description: '没有匹配建议时保留原始文本，并用空状态解释当前结果。'
    },
    {
      key: 'disabled-mention',
      label: '禁用成员',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '离职或无权限成员仍可展示说明，但不能被鼠标或键盘选中。'
    },
    {
      key: 'mobile-mention',
      label: '移动评论',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下 textarea、清空按钮和建议面板保持可读可点。'
    },
    {
      key: 'keyboard-mention',
      label: '键盘提及',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证方向键移动建议、Enter 选择、Escape 关闭和 textarea 输入路径。'
    }
  ],
  anchor: [
    {
      key: 'anchor-basic',
      label: '基础锚点',
      kind: 'basic',
      controlValue: 'basic',
      description: '竖向锚点导航适合组件文档、长表单和设置页。'
    },
    {
      key: 'anchor-horizontal',
      label: '水平模式',
      kind: 'composition',
      controlValue: 'horizontal',
      description: '水平模式适合页头下方的轻量分段导航，不渲染子链接。'
    },
    {
      key: 'anchor-container',
      label: '滚动容器',
      kind: 'controlled',
      controlValue: 'container',
      description: '绑定局部滚动容器并通过 offset 预留固定头部空间。'
    },
    {
      key: 'anchor-disabled',
      label: '禁用链接',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '禁用锚点保留层级说明但不会触发滚动。'
    },
    {
      key: 'anchor-mobile',
      label: '移动端横向',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏使用横向可扫视导航，避免占用首屏高度。'
    },
    {
      key: 'anchor-keyboard',
      label: '键盘顺序',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '链接保持原生 Tab 和 Enter 行为，active 使用 aria-current 标记。'
    }
  ],
  affix: [
    {
      key: 'affix-top',
      label: '顶部固定',
      kind: 'basic',
      controlValue: 'top',
      description: '使用 position top 和 offset 固定工具栏。'
    },
    {
      key: 'affix-bottom',
      label: '底部固定',
      kind: 'controlled',
      controlValue: 'bottom',
      description: '底部固定适合提交栏和批量操作区。'
    },
    {
      key: 'affix-target',
      label: '目标容器',
      kind: 'composition',
      controlValue: 'target',
      description: '监听局部滚动容器，避免全页面滚动耦合。'
    },
    {
      key: 'affix-disabled',
      label: '禁用固定',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '禁用 sticky 时区域按普通内容参与布局。'
    },
    {
      key: 'affix-mobile',
      label: '移动端操作条',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端保持操作条紧凑，不遮挡主要内容。'
    },
    {
      key: 'affix-keyboard',
      label: '键盘顺序',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: 'Affix 不创建额外焦点陷阱，内部按钮保持原生 Tab 顺序。'
    }
  ],
  layout: [
    {
      key: 'layout-basic',
      label: '基础骨架',
      kind: 'basic',
      controlValue: 'basic',
      description: 'Header、Main 和 Footer 组成最小页面骨架。'
    },
    {
      key: 'layout-admin',
      label: '后台壳层',
      kind: 'layout',
      controlValue: 'admin',
      description: 'Aside 与 Main 横向组合，适合管理台主工作区。'
    },
    {
      key: 'layout-sticky',
      label: '吸顶顶栏',
      kind: 'controlled',
      controlValue: 'sticky',
      description: 'Header 开启 sticky 和 bordered，适合长页面工具栏。'
    },
    {
      key: 'layout-collapsed',
      label: '折叠侧栏',
      kind: 'disabled',
      controlValue: 'collapsed',
      description: 'Aside 使用 collapsedWidth 保持紧凑导航宽度。'
    },
    {
      key: 'layout-mobile',
      label: '移动端',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏使用垂直骨架，避免桌面侧栏堆叠到首屏之前。'
    },
    {
      key: 'layout-keyboard',
      label: '语义顺序',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: 'Header、main、aside 和 footer 使用语义标签，Tab 顺序跟 DOM 保持一致。'
    }
  ],
  menu: [
    {
      key: 'menu-vertical',
      label: '侧边导航',
      kind: 'basic',
      controlValue: 'vertical',
      description: '展示垂直侧边栏、默认展开子菜单和当前选中项。'
    },
    {
      key: 'menu-horizontal',
      label: '顶部导航',
      kind: 'composition',
      controlValue: 'horizontal',
      description: '切换到水平模式，适合官网顶部导航和产品工作台。'
    },
    {
      key: 'menu-collapsed',
      label: '折叠菜单',
      kind: 'controlled',
      controlValue: 'collapsed',
      description: '折叠菜单只保留图标和 title，用于后台侧边栏。'
    },
    {
      key: 'menu-accordion',
      label: '手风琴展开',
      kind: 'controlled',
      controlValue: 'accordion',
      description: '同级子菜单只保留一个展开，减少侧边栏高度。'
    },
    {
      key: 'menu-disabled',
      label: '禁用项',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '禁用菜单项保留可见语义但跳过选择和键盘移动路径。'
    },
    {
      key: 'menu-mobile',
      label: '移动导航',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用紧凑垂直导航，避免桌面侧边栏直接堆叠。'
    },
    {
      key: 'menu-keyboard',
      label: '键盘导航',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '方向键移动焦点，Enter 或 Space 选择叶子项或展开子菜单。'
    }
  ],
  carousel: [
    {
      key: 'carousel-basic',
      label: '基础轮播',
      kind: 'basic',
      controlValue: 'basic',
      description: '展示受控索引、箭头切换、内部指示器和基础 slide 内容。'
    },
    {
      key: 'carousel-autoplay',
      label: '自动播放',
      kind: 'loading',
      controlValue: 'autoplay',
      description: '启用 autoplay 和 interval，同时鼠标悬停暂停，避免干扰阅读。'
    },
    {
      key: 'carousel-outside-indicators',
      label: '外置指示器',
      kind: 'composition',
      controlValue: 'outside',
      description: '将指示器放到轮播视口外，适合内容较密的卡片。'
    },
    {
      key: 'carousel-vertical',
      label: '垂直轮播',
      kind: 'controlled',
      controlValue: 'vertical',
      description: '切换到 vertical 方向，同时使用上下方向键导航。'
    },
    {
      key: 'carousel-mobile',
      label: '移动布局',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '压缩高度和文案，验证窄屏下箭头、指示器和内容不溢出。'
    },
    {
      key: 'carousel-keyboard',
      label: '键盘路径',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: 'Tab 聚焦视口后，左右方向键切换 slide，指示器保持可点击。'
    }
  ],
  calendar: [
    {
      key: 'calendar-basic',
      label: '基础月视图',
      kind: 'basic',
      controlValue: 'basic',
      description: '展示受控日期、当前月网格、相邻月份日期和基础选择事件。'
    },
    {
      key: 'calendar-events',
      label: '带日程',
      kind: 'composition',
      controlValue: 'events',
      description: '使用 dateCell 插槽在日期格内组合轻量日程标记，验证自定义单元格能力。'
    },
    {
      key: 'calendar-disabled',
      label: '禁用周末',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '通过 disabled-date 禁止选择周末日期，覆盖只读档期或不可预约日期。'
    },
    {
      key: 'mobile-calendar',
      label: '移动月历',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下控制区换行，日期格压缩高度但仍保留点击目标和可读日期。'
    },
    {
      key: 'keyboard-calendar',
      label: '键盘选择',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '日期格使用原生 button，Tab 可进入可选日期，Enter 或 Space 触发选择。'
    }
  ],
  approvalCommentBox: [
    {
      key: 'approval-comment-default',
      label: '审批评论',
      kind: 'basic',
      controlValue: 'default',
      description: '覆盖审批结论、评论输入、建议标签和附件展示。'
    },
    {
      key: 'approval-comment-required',
      label: '必填校验',
      kind: 'error',
      controlValue: 'required',
      description: '空评论提交时展示错误并触发 invalid 事件。'
    },
    {
      key: 'approval-comment-loading',
      label: '提交中',
      kind: 'loading',
      controlValue: 'loading',
      description: '提交中禁用输入和提交按钮，防止重复发送审批评论。'
    },
    {
      key: 'approval-comment-keyboard',
      label: '键盘评论',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '键盘用户可以访问结论按钮、评论框、建议标签、提交和取消。'
    },
    {
      key: 'mobile-approval-comment',
      label: '移动评论',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下元信息和操作区纵向排列，保持评论输入可读。'
    }
  ],
  bulkActionBar: [
    {
      key: 'bulk-action-selected',
      label: '三项选择',
      kind: 'basic',
      controlValue: 'selected',
      description: '覆盖 actions 批量动作列表，批量操作栏展示当前选择数量，并提供主要批量动作和清空选择。'
    },
    {
      key: 'bulk-action-many',
      label: '多项批量',
      kind: 'multi',
      controlValue: 'many',
      description: '多选列表进入批量处理时，动作数量、摘要和清空入口保持同一区域可见。'
    },
    {
      key: 'bulk-action-menu',
      label: '分组菜单',
      kind: 'composition',
      controlValue: 'menu',
      description: '批量动作较多时收进菜单，按业务域分组，并对危险动作要求二次确认。'
    },
    {
      key: 'bulk-action-empty',
      label: '空选择',
      kind: 'empty',
      controlValue: 'empty',
      description: '没有选择行时展示空状态摘要，避免用户误以为批量工具栏失效。'
    },
    {
      key: 'mobile-bulk-action-bar',
      label: '移动批量',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '覆盖 clear-text 清空文案，窄屏下批量操作应使用短文案，并保持清空选择和主要动作可触达。'
    },
    {
      key: 'keyboard-bulk-action-bar',
      label: '键盘批量',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '键盘用户可以按顺序访问批量动作、危险动作和清空选择。'
    }
  ],
  dataToolbar: [
    {
      key: 'data-toolbar-default',
      label: '数据工具栏',
      kind: 'basic',
      controlValue: 'default',
      description: '数据页工具栏聚合标题、说明、数量和常用操作，是列表页顶部的稳定入口。'
    },
    {
      key: 'data-toolbar-actions',
      label: '带操作',
      kind: 'composition',
      controlValue: 'actions',
      description: '通过插槽组合创建、导出、刷新等动作，避免把工具栏和业务按钮耦死。'
    },
    {
      key: 'data-toolbar-empty',
      label: '无操作',
      kind: 'empty',
      controlValue: 'empty',
      description: '只展示标题和数量的轻量工具栏适合嵌入侧栏或只读数据模块。'
    },
    {
      key: 'mobile-data-toolbar',
      label: '移动工具栏',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端使用短标题和少量动作，减少工具栏挤占首屏内容。'
    },
    {
      key: 'keyboard-data-toolbar',
      label: '键盘工具栏',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '键盘路径从标题区域后进入主要动作，焦点顺序和视觉顺序保持一致。'
    }
  ],
  configProvider: [
    {
      key: 'config-provider-default',
      label: '全局尺寸',
      kind: 'basic',
      controlValue: 'default',
      description: '通过 ConfigProvider 给子组件统一设置默认 size 和 namespace，减少重复 props。'
    },
    {
      key: 'config-provider-density',
      label: '紧凑密度',
      kind: 'layout',
      controlValue: 'density',
      description: '密度配置写入子树属性，方便主题和文档区域做统一布局收缩。'
    },
    {
      key: 'config-provider-locale',
      label: '中文区域',
      kind: 'controlled',
      controlValue: 'locale',
      description: 'locale 会映射到 lang 属性，为未来 i18n 文案和辅助技术读法留出入口。'
    },
    {
      key: 'disabled-config-provider',
      label: '锁定配置',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '发布冻结或只读预览时，Provider 可以把禁用语义传入内部表单控件。'
    },
    {
      key: 'mobile-config-provider',
      label: '移动配置',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端可以用小尺寸默认值压缩控件高度，同时保留按钮可点击面积。'
    },
    {
      key: 'keyboard-config-provider',
      label: '键盘路径',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: 'Provider 不抢焦点，键盘顺序仍由内部按钮和输入控件决定。'
    }
  ],
  floatButton: [
    {
      key: 'quick-create',
      label: '快速创建',
      kind: 'basic',
      controlValue: 'create',
      description: '固定在页面右下角的主要快捷动作，适合创建、反馈或帮助入口。'
    },
    {
      key: 'action-group',
      label: '动作组',
      kind: 'controlled',
      controlValue: 'group',
      description: '多个全局动作使用 FloatButtonGroup 收拢，避免悬浮按钮堆叠。'
    },
    {
      key: 'disabled-action',
      label: '禁用动作',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '受权限或上下文限制的动作保持可见但禁用，避免误触。'
    },
    {
      key: 'mobile-safe-area',
      label: '移动安全区',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下按钮保持固定尺寸，文案截断，不遮挡主内容。'
    },
    {
      key: 'keyboard-actions',
      label: '键盘操作',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '触发器、动作项和返回顶部按钮均可通过 Tab 聚焦并用 Enter 或 Space 触发。'
    }
  ],
  icon: [
    {
      key: 'decorative-icon',
      label: '装饰图标',
      kind: 'basic',
      controlValue: 'decorative',
      description: '装饰图标不进入辅助技术语义树，适合按钮旁或状态文本旁的视觉提示。'
    },
    {
      key: 'labeled-icon',
      label: '命名图标',
      kind: 'controlled',
      controlValue: 'labeled',
      description: '当图标本身承担含义时，通过 label 暴露为具名 img 语义。'
    },
    {
      key: 'loading-icon',
      label: '加载图标',
      kind: 'loading',
      controlValue: 'loading',
      description: 'spinning 旋转图标用于加载状态，并保留 prefers-reduced-motion 下的动效降级。'
    },
    {
      key: 'mobile-icon',
      label: '移动图标',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动工具栏里使用小尺寸图标，同时保持稳定宽高避免被压缩。'
    },
    {
      key: 'keyboard-icon',
      label: '键盘按钮',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '图标可以放入按钮，但键盘焦点仍落在 button 上，图标本身不抢焦点。'
    }
  ],
  savedViews: [
    {
      key: 'saved-views-default',
      label: '保存视图',
      kind: 'basic',
      controlValue: 'default',
      description: '保存视图用于复用筛选、列偏好和审核范围，是后台列表的高频能力。'
    },
    {
      key: 'saved-views-controlled',
      label: '受控视图',
      kind: 'controlled',
      controlValue: 'controlled',
      description: '受控 model-value 让路由、表格偏好和视图按钮保持同步。'
    },
    {
      key: 'saved-views-manager',
      label: '管理视图',
      kind: 'controlled',
      controlValue: 'manager',
      description: '管理器覆盖重命名、复制、删除、固定和默认视图设置。'
    },
    {
      key: 'saved-views-empty',
      label: '空视图',
      kind: 'empty',
      controlValue: 'empty',
      description: '无保存视图时展示明确空态，并保留 createText 创建和 manageText 管理入口。'
    },
    {
      key: 'mobile-saved-views',
      label: '移动视图',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端保留关键视图切换，同时缩短标题和说明。'
    },
    {
      key: 'keyboard-saved-views',
      label: '键盘视图',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '视图按钮、保存、createText 创建和 manageText 管理操作都需要稳定的键盘访问顺序。'
    }
  ],
  searchPanel: [
    {
      key: 'search-panel-default',
      label: '基础筛选',
      kind: 'basic',
      controlValue: 'default',
      description: '搜索面板承载关键词和状态筛选，适合资源页、表格页和审核页。'
    },
    {
      key: 'search-panel-filtered',
      label: '已筛选',
      kind: 'search',
      controlValue: 'filtered',
      description: '带默认筛选值时，用户能看到当前查询范围并继续调整条件。'
    },
    {
      key: 'search-panel-empty',
      label: '空筛选',
      kind: 'empty',
      controlValue: 'empty',
      description: '无筛选值时仍展示字段结构和操作按钮，避免空页面失去方向。'
    },
    {
      key: 'mobile-search-panel',
      label: '移动筛选',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端筛选字段纵向排列，按钮文案保持短小。'
    },
    {
      key: 'keyboard-search-panel',
      label: '键盘筛选',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '字段、提交和重置按钮按表单逻辑进入焦点顺序。'
    }
  ],
  scrollbar: [
    {
      key: 'scrollbar-default',
      label: '基础滚动',
      kind: 'basic',
      controlValue: 'default',
      description: '覆盖 min-height，固定高度内容区域使用统一滚动条，适合文档示例、日志和短列表。'
    },
    {
      key: 'scrollbar-compact',
      label: '紧凑面板',
      kind: 'layout',
      controlValue: 'compact',
      description: '紧凑高度验证内容密度和滚动条可见性，避免面板撑开页面。'
    },
    {
      key: 'scrollbar-horizontal',
      label: '横向滚动',
      kind: 'layout',
      controlValue: 'horizontal',
      description: '横向滚动适合代码、表格片段和不可折行内容。'
    },
    {
      key: 'empty-scrollbar',
      label: '空内容',
      kind: 'empty',
      controlValue: 'empty',
      description: '筛选后没有日志或内容时，滚动容器仍应给出明确的空状态说明。'
    },
    {
      key: 'mobile-scrollbar',
      label: '移动滚动',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏高度下滚动区域保持可读，并避免整页出现多余横向溢出。'
    },
    {
      key: 'keyboard-scrollbar',
      label: '键盘滚动',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '覆盖 native 原生滚动条路径，滚动视口可获得焦点，键盘用户可以直接使用方向键或 PageDown 浏览内容。'
    }
  ],
  statusTimeline: [
    {
      key: 'status-timeline-release',
      label: '发布状态',
      kind: 'basic',
      controlValue: 'release',
      description: '状态时间线展示发布、审核和上线节点，突出当前进行中步骤。'
    },
    {
      key: 'status-timeline-reverse',
      label: '倒序时间线',
      kind: 'layout',
      controlValue: 'reverse',
      description: '倒序展示适合最新进展优先的审计记录和活动流。'
    },
    {
      key: 'status-timeline-empty',
      label: '空时间线',
      kind: 'empty',
      controlValue: 'empty',
      description: '没有状态事件时给出明确说明，避免用户误判数据加载失败。'
    },
    {
      key: 'mobile-status-timeline',
      label: '移动时间线',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '小尺寸时间线在窄屏下减少装饰但保留标题、状态和时间。'
    },
    {
      key: 'keyboard-status-timeline',
      label: '键盘时间线',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '非交互时间线保持语义清晰，旁侧操作接管键盘焦点。'
    }
  ],
  reviewWorkflow: [
    {
      key: 'review-workflow-default',
      label: '审核流程',
      kind: 'basic',
      controlValue: 'default',
      description: '审核工作流组合状态时间线、reviewer 审核人、due-text 到期信息和操作按钮。'
    },
    {
      key: 'review-workflow-loading',
      label: '加载审核',
      kind: 'loading',
      controlValue: 'loading',
      description: '保存审核决定时进入 loading，避免重复提交并保留上下文。'
    },
    {
      key: 'review-workflow-blocked',
      label: '阻断审核',
      kind: 'error',
      controlValue: 'blocked',
      description: '审核被阻断时需要明确风险状态和下一步处理动作。'
    },
    {
      key: 'mobile-review-workflow',
      label: '移动审核',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端审核卡片应保持状态、说明和主要动作可读。'
    },
    {
      key: 'keyboard-review-workflow',
      label: '键盘审核',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '审核按钮按批准、修改、拒绝的业务顺序进入焦点路径。'
    }
  ],
  brandHero: [
    {
      key: 'brand-hero-default',
      label: '品牌首屏',
      kind: 'basic',
      controlValue: 'default',
      description: '品牌首屏展示组件库定位、价值说明和两个清晰 CTA。'
    },
    {
      key: 'brand-hero-copy',
      label: '文案强化',
      kind: 'copy',
      controlValue: 'copy',
      description: '用更明确的价值主张强化个人组件库的差异点。'
    },
    {
      key: 'brand-hero-risk',
      label: '风险主张',
      kind: 'error',
      controlValue: 'risk',
      description: '主张不清晰时展示复核提示，便于文档站检查文案质量。'
    },
    {
      key: 'mobile-brand-hero',
      label: '移动首屏',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端首屏压缩标题和说明，保证 CTA 不被首屏挤出。'
    },
    {
      key: 'keyboard-brand-hero',
      label: '键盘首屏',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '首屏 CTA 可通过键盘按视觉顺序触达，并触发对应事件。'
    }
  ],
  featureGrid: [
    {
      key: 'feature-grid-default',
      label: '三列特性',
      kind: 'basic',
      controlValue: 'default',
      description: '品牌特性栅格用于说明组件库能力、包结构和设计原则。'
    },
    {
      key: 'feature-grid-two',
      label: '双列布局',
      kind: 'layout',
      controlValue: 'two',
      description: '双列布局适合较短内容，减少横向密度并保留扫描效率。'
    },
    {
      key: 'feature-grid-empty',
      label: '空特性',
      kind: 'empty',
      controlValue: 'empty',
      description: '无特性数据时展示空态说明，避免品牌区块只剩空白。'
    },
    {
      key: 'mobile-feature-grid',
      label: '移动特性',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端特性卡片单列展示，避免长标题挤压。'
    },
    {
      key: 'keyboard-feature-grid',
      label: '键盘特性',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '静态特性区域保持阅读语义，后续链接或按钮进入键盘路径。'
    }
  ],
  image: [
    {
      key: 'image-cover-preview',
      label: '封面预览',
      kind: 'basic',
      controlValue: 'cover',
      description: '封面图片使用 cover 裁剪，点击后打开可关闭的预览层。'
    },
    {
      key: 'image-lazy-placeholder',
      label: '懒加载占位',
      kind: 'loading',
      controlValue: 'lazy',
      description: '列表图片使用 lazy loading 和 placeholder，避免首屏加载阻塞。'
    },
    {
      key: 'image-error-slot',
      label: '失败兜底',
      kind: 'error',
      controlValue: 'error',
      description: '图片加载失败时展示可读错误内容，而不是留下破损图片图标。'
    },
    {
      key: 'image-controlled-preview',
      label: '受控预览',
      kind: 'controlled',
      controlValue: 'controlled',
      description: '预览打开状态可以交给外部业务控制，便于相册、审核流或埋点联动。'
    },
    {
      key: 'mobile-image-card',
      label: '移动图片',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端图片卡片缩短说明并固定比例，避免图片挤压内容。'
    },
    {
      key: 'keyboard-image-preview',
      label: '键盘预览',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '可预览图片以按钮语义进入焦点路径，Escape 可以关闭预览层。'
    }
  ],
  logoCloud: [
    {
      key: 'logo-cloud-default',
      label: '客户墙',
      kind: 'basic',
      controlValue: 'default',
      description: 'Logo Cloud 用于展示包、产品线或生态伙伴，提供轻量社会证明。'
    },
    {
      key: 'logo-cloud-proof',
      label: '证明文案',
      kind: 'copy',
      controlValue: 'proof',
      description: '客户墙搭配上下文标签说明这些名称代表包族、产品线或用户群。'
    },
    {
      key: 'logo-cloud-empty',
      label: '空客户墙',
      kind: 'empty',
      controlValue: 'empty',
      description: '没有 logo 数据时展示空态，便于文档和品牌页捕获缺失内容。'
    },
    {
      key: 'mobile-logo-cloud',
      label: '移动客户墙',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端客户墙使用短标题和可换行标签。'
    },
    {
      key: 'keyboard-logo-cloud',
      label: '键盘客户墙',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '静态客户墙不抢焦点，邻近链接或操作才进入键盘路径。'
    }
  ],
  profileCard: [
    {
      key: 'profile-card-default',
      label: '成员卡片',
      kind: 'basic',
      controlValue: 'default',
      description: '成员卡片展示头像、角色、简介和标签，适合团队或贡献者区域。'
    },
    {
      key: 'profile-card-controlled',
      label: '负责人卡片',
      kind: 'controlled',
      controlValue: 'owner',
      description: '通过 props 控制名称、角色和简介，用于负责人、设计师或维护者信息。'
    },
    {
      key: 'profile-card-no-tags',
      label: '无标签',
      kind: 'empty',
      controlValue: 'noTags',
      description: '没有标签时卡片仍保持紧凑布局，并用上下文提示说明状态。'
    },
    {
      key: 'mobile-profile-card',
      label: '移动卡片',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端减少简介长度，避免头像和正文互相挤压。'
    },
    {
      key: 'keyboard-profile-card',
      label: '键盘卡片',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '资料卡片作为静态信息块，附近联系动作进入键盘顺序。'
    }
  ],
  themeProvider: [
    {
      key: 'theme-provider-default',
      label: '局部主题',
      kind: 'basic',
      controlValue: 'default',
      description: '覆盖 tokens、theme 和 density，ThemeProvider 在局部区域注入主题和密度变量，适合文档示例隔离。'
    },
    {
      key: 'theme-provider-clean',
      label: '清爽主题',
      kind: 'controlled',
      controlValue: 'clean',
      description: '受控主题值让文档示例、Playground 和组件预览保持一致。'
    },
    {
      key: 'theme-provider-review',
      label: '复核主题',
      kind: 'error',
      controlValue: 'review',
      description: '对比度或密度需要复核时，用局部主题区域标记风险上下文。'
    },
    {
      key: 'mobile-theme-provider',
      label: '移动主题',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端主题区域应减少卡片内边距和动作数量。'
    },
    {
      key: 'keyboard-theme-provider',
      label: '键盘主题',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '局部主题不影响按钮、链接和表单控件的焦点环可见性。'
    }
  ],
  button: [
    {
      key: 'primary-action-button',
      label: '主操作',
      kind: 'basic',
      controlValue: 'primary',
      description: '覆盖原生 button type，页面主要动作使用明确文案和 primary 层级，避免同一区域出现多个主按钮。'
    },
    {
      key: 'submit-flow-button',
      label: '表单提交',
      kind: 'controlled',
      controlValue: 'submit',
      description: '覆盖原生 submit 类型，表单提交按钮保留浏览器语义和可预测的默认行为。'
    },
    {
      key: 'button-group-actions',
      label: '按钮组',
      kind: 'multi',
      controlValue: 'group',
      description: '主按钮、次按钮和弱按钮组合时保持主次层级清楚，避免多个主要动作互相竞争。'
    },
    {
      key: 'copy-command-button',
      label: '复制命令',
      kind: 'copy',
      controlValue: 'copy',
      description: '复制类动作使用明确文案和可感知反馈，适合安装命令、代码片段和分享链接。'
    },
    {
      key: 'loading-submit-button',
      label: '加载提交',
      kind: 'loading',
      controlValue: 'loading',
      description: '提交中展示 loading 状态，避免重复提交并保留原始按钮宽度。'
    },
    {
      key: 'disabled-permission-button',
      label: '权限禁用',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '权限不足或条件未满足时按钮保持可见但不可触发。'
    },
    {
      key: 'danger-action-button',
      label: '风险操作',
      kind: 'error',
      controlValue: 'danger',
      description: '删除、撤销或危险动作使用明确风险文案和更克制的视觉层级。'
    },
    {
      key: 'mobile-full-button',
      label: '移动宽按钮',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用短文案和更宽触达区域，避免按钮被挤压。'
    },
    {
      key: 'keyboard-button',
      label: '键盘触发',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 可聚焦按钮，Enter 或 Space 可以触发动作。'
    }
  ],
  alert: [
    {
      key: 'save-success-alert',
      label: '保存成功',
      kind: 'basic',
      controlValue: 'success',
      description: '保存或发布完成后用非阻塞 status 语义提示结果。'
    },
    {
      key: 'validation-alert',
      label: '表单校验',
      kind: 'error',
      controlValue: 'validation',
      description: '表单提交失败时使用 assertive alert 语义，并提供可关闭的错误摘要。'
    },
    {
      key: 'system-announcement',
      label: '系统公告',
      kind: 'controlled',
      controlValue: 'announcement',
      description: '展示维护窗口、版本公告或迁移提示这类可暂时关闭的持久信息。'
    },
    {
      key: 'mobile-alert',
      label: '移动提示',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下标题、正文和关闭按钮不挤压，提示文案保持短小。'
    },
    {
      key: 'keyboard-alert-close',
      label: '键盘关闭',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 能到达关闭按钮，Enter 或 Space 可以关闭提示。'
    }
  ],
  progress: [
    {
      key: 'task-progress',
      label: '任务进度',
      kind: 'basic',
      controlValue: 'task',
      description: '展示文档完善或构建任务的当前进度，让用户知道操作仍在推进。'
    },
    {
      key: 'loading-progress',
      label: '加载进度',
      kind: 'loading',
      controlValue: 'loading',
      description: '长任务加载中使用条纹和明确标签，避免只有静态百分比。'
    },
    {
      key: 'failed-progress',
      label: '失败进度',
      kind: 'error',
      controlValue: 'failed',
      description: '失败或阻断状态使用危险语义色，并在旁边解释下一步动作。'
    },
    {
      key: 'mobile-progress',
      label: '移动进度',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用短标签和隐藏数值，避免进度标题挤压。'
    },
    {
      key: 'keyboard-progress',
      label: '键盘进度',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '非交互进度条仍需正确的 progressbar 语义，键盘用户能听到状态变化。'
    }
  ],
  textarea: [
    {
      key: 'release-note-textarea',
      label: '发布说明',
      kind: 'basic',
      controlValue: 'note',
      description: '覆盖 placeholder 与 helper，多行说明用于发布记录、审核备注和组件文档变更。'
    },
    {
      key: 'described-textarea',
      label: '帮助说明',
      kind: 'controlled',
      controlValue: 'help',
      description: '通过 helper 与 aria-describedby 说明长文本写作规则，避免只靠 placeholder 承载说明。'
    },
    {
      key: 'density-textarea',
      label: '尺寸密度',
      kind: 'layout',
      controlValue: 'density',
      description: '展示 sm、md、lg 三种多行输入密度，适配紧凑表单、默认表单和长文编辑。'
    },
    {
      key: 'invalid-textarea',
      label: '校验错误',
      kind: 'error',
      controlValue: 'error',
      description: '必填长文本为空时展示 error 和 aria-invalid，错误文案紧贴输入区。'
    },
    {
      key: 'locked-textarea',
      label: '锁定备注',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '已归档或只读审核备注保留可读内容但禁用编辑。'
    },
    {
      key: 'mobile-textarea',
      label: '移动长文',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端使用更少行数和短辅助说明，避免首屏被输入框吞掉。'
    },
    {
      key: 'keyboard-textarea',
      label: '键盘长文',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 聚焦文本域，多行编辑不会误触发表单提交。'
    }
  ],
  tagBadge: [
    {
      key: 'status-tag-badge',
      label: '状态标签',
      kind: 'basic',
      controlValue: 'stable',
      description: '用标签表达稳定状态，用徽标补充数量而不是代替标签文案。'
    },
    {
      key: 'risk-tag-badge',
      label: '风险标签',
      kind: 'error',
      controlValue: 'risk',
      description: '破坏性变更、失败数量或风险队列使用危险语义色和明确数字。'
    },
    {
      key: 'batch-tag-badge',
      label: '批量状态',
      kind: 'multi',
      controlValue: 'batch',
      description: '多个标签和徽标组合时保持一致密度，用于筛选摘要或批量操作。'
    },
    {
      key: 'status-badge-text',
      label: '独立状态',
      kind: 'status',
      controlValue: 'status',
      description: '独立状态点用 text 补充可见说明，适合图例、在线状态和筛选摘要。'
    },
    {
      key: 'mobile-tag-badge',
      label: '移动标签',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端缩短标签文案，让状态和数字能在工具栏里并排显示。'
    },
    {
      key: 'keyboard-tag-badge',
      label: '键盘旁路',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '标签和徽标本身不抢焦点，键盘焦点应移动到相邻动作。'
    }
  ],
  avatar: [
    {
      key: 'initials-avatar',
      label: '姓名头像',
      kind: 'basic',
      controlValue: 'initials',
      description: '无图片时使用稳定 initials fallback，并保留可访问名称。'
    },
    {
      key: 'image-avatar',
      label: '图片头像',
      kind: 'remote',
      controlValue: 'image',
      description: '图片头像支持 srcset、fit 和 alt，加载失败时回退到 initials。'
    },
    {
      key: 'avatar-group',
      label: '头像组',
      kind: 'multi',
      controlValue: 'group',
      description: '协作场景展示多个负责人头像，避免只显示匿名圆点。'
    },
    {
      key: 'missing-avatar',
      label: '缺失头像',
      kind: 'error',
      controlValue: 'missing',
      description: '缺失图片或危险负责人状态使用 fallback 和清晰状态标签。'
    },
    {
      key: 'mobile-avatar',
      label: '移动头像',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动列表使用小头像和短标签，保证行高稳定。'
    },
    {
      key: 'keyboard-avatar',
      label: '键盘资料',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '头像只提供身份语义，键盘焦点落在相邻个人资料动作上。'
    }
  ],
  breadcrumb: [
    {
      key: 'hierarchy-breadcrumb',
      label: '层级路径',
      kind: 'basic',
      controlValue: 'hierarchy',
      description: '展示当前页面在指南、组件、表单分类中的位置。'
    },
    {
      key: 'custom-separator-breadcrumb',
      label: '自定义分隔',
      kind: 'controlled',
      controlValue: 'separator',
      description: '使用自定义分隔符时仍保持 aria-label 和当前页标记。'
    },
    {
      key: 'disabled-breadcrumb',
      label: '权限断点',
      kind: 'error',
      controlValue: 'disabled',
      description: '权限不足的祖先层级保持可见但禁用，避免产生不可访问链接。'
    },
    {
      key: 'mobile-breadcrumb',
      label: '移动路径',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下短标签和换行路径仍需说明当前位置。'
    },
    {
      key: 'keyboard-breadcrumb',
      label: '键盘返回',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '键盘顺序先到祖先链接，最后读到当前页面标签。'
    }
  ],
  virtualList: [
    {
      key: 'component-row-virtual-list',
      label: '组件行',
      kind: 'basic',
      controlValue: 'rows',
      description: '展示组件检索、命令面板和长列表选择中最常见的 item-height 固定行高虚拟滚动。'
    },
    {
      key: 'empty-virtual-list',
      label: '空列表',
      kind: 'empty',
      controlValue: 'empty',
      description: '筛选后无结果时保留列表区域和短空状态文案，避免区域突然消失。'
    },
    {
      key: 'dense-virtual-list',
      label: '密集长列表',
      kind: 'virtual',
      controlValue: 'dense',
      description: '长列表使用更小行高和更高 overscan，验证大量数据滚动时仍稳定。'
    },
    {
      key: 'mobile-virtual-list',
      label: '移动列表',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下减少高度和行高，让虚拟列表不会吃掉整个首屏。'
    },
    {
      key: 'keyboard-virtual-list',
      label: '键盘列表',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 聚焦虚拟列表视口，方向键和滚动键不会丢失当前语义。'
    }
  ],
  watermark: [
    {
      key: 'draft-watermark',
      label: '草稿水印',
      kind: 'basic',
      controlValue: 'draft',
      description: '草稿、预览和未发布内容使用低透明度水印，不干扰正文阅读。'
    },
    {
      key: 'confidential-watermark',
      label: '机密水印',
      kind: 'error',
      controlValue: 'confidential',
      description: '导出预览、权限受限或敏感资料使用更明确的风险水印内容。'
    },
    {
      key: 'export-watermark',
      label: '导出水印',
      kind: 'copy',
      controlValue: 'export',
      description: '导出或截图场景使用更密集的间距和稍大字号，保证复制后仍可识别。'
    },
    {
      key: 'mobile-watermark',
      label: '移动水印',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动内容卡片使用较小字号和间距，避免水印盖住核心信息。'
    },
    {
      key: 'keyboard-watermark',
      label: '键盘水印',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '水印层必须 aria-hidden 且不拦截指针或键盘焦点。'
    }
  ],
  divider: [
    {
      key: 'section-divider',
      label: '区块分隔',
      kind: 'basic',
      controlValue: 'section',
      description: '文档和表单区块用轻量分割线建立阅读节奏，不额外制造卡片层级。'
    },
    {
      key: 'aligned-divider',
      label: '右侧标签',
      kind: 'layout',
      controlValue: 'aligned',
      description: '右对齐标签适合汇总、末尾说明和密集信息流中的局部分隔。'
    },
    {
      key: 'empty-divider',
      label: '空状态分隔',
      kind: 'empty',
      controlValue: 'empty',
      description: '空结果和下一步操作之间保留低噪音分隔，让页面不会显得断裂。'
    },
    {
      key: 'mobile-divider',
      label: '移动分隔',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端使用短标签和左对齐，避免分隔线文字被挤压。'
    },
    {
      key: 'keyboard-divider',
      label: '键盘分隔',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '分隔线不应抢焦点；键盘路径应自然进入相邻控件。'
    }
  ],
  space: [
    {
      key: 'action-space',
      label: '操作间距',
      kind: 'basic',
      controlValue: 'actions',
      description: '按钮和标签组合使用统一间距，减少工具区里手写 margin 的漂移。'
    },
    {
      key: 'separator-space',
      label: '分隔符',
      kind: 'composition',
      controlValue: 'separator',
      description: '分隔符 slot 适合面包屑式元信息、标签串和轻量状态组。'
    },
    {
      key: 'vertical-space',
      label: '纵向堆叠',
      kind: 'layout',
      controlValue: 'vertical',
      description: '纵向间距用于设置项、空状态行动和局部表单片段。'
    },
    {
      key: 'empty-space',
      label: '空态间距',
      kind: 'empty',
      controlValue: 'empty',
      description: '空状态行动组使用稳定间距，避免空态说明和下一步操作贴得过近。'
    },
    {
      key: 'wrap-space',
      label: '响应式换行',
      kind: 'responsive',
      controlValue: 'wrap',
      description: '换行模式让工具条在窄视口中保持可读，不需要每个子项单独写 margin。'
    },
    {
      key: 'keyboard-space',
      label: '键盘路径',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: 'Space 本身不抢焦点，键盘路径应自然进入内部可交互控件。'
    }
  ],
  link: [
    {
      key: 'guide-link',
      label: '文档链接',
      kind: 'basic',
      controlValue: 'guide',
      description: '文档和设置页中的内链应继承主题色，并保留清晰的 hover 反馈。'
    },
    {
      key: 'external-link',
      label: '安全外链',
      kind: 'controlled',
      controlValue: 'external',
      description: '外链默认使用 target 新窗口和安全 rel，适合资源、仓库和第三方页面入口。'
    },
    {
      key: 'danger-link',
      label: '风险操作',
      kind: 'error',
      controlValue: 'danger',
      description: '危险语义链接只用于低权重风险操作，关键删除仍应使用确认组件。'
    },
    {
      key: 'disabled-link',
      label: '禁用链接',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '禁用态移除 href 并暴露 aria-disabled，避免误触导航。'
    },
    {
      key: 'keyboard-link',
      label: '键盘路径',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '链接应保持原生 Tab 和 Enter 交互，不额外截断键盘路径。'
    },
    {
      key: 'mobile-link',
      label: '移动链接',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端链接使用短文案和可换行容器，避免长 URL 或长标签撑破页面。'
    }
  ],
  loading: [
    {
      key: 'inline-loading',
      label: '内联状态',
      kind: 'basic',
      controlValue: 'inline',
      description: '内联 Loading 用 status 语义表达局部异步任务，不增加额外键盘焦点。'
    },
    {
      key: 'overlay-loading',
      label: '容器遮罩',
      kind: 'loading',
      controlValue: 'overlay',
      description: '覆盖 loading、overlay 和 text，局部刷新时保留内容 DOM 并标记 aria-busy。'
    },
    {
      key: 'fullscreen-loading',
      label: '全屏阻断',
      kind: 'controlled',
      controlValue: 'fullscreen',
      description: '覆盖 fullscreen 和 label，适合初始化、发布和路由切换等阻断式任务。'
    },
    {
      key: 'retry-loading',
      label: '重试状态',
      kind: 'error',
      controlValue: 'retry',
      description: '使用 warning/danger 语义表达重试或失败前状态，避免用户误以为任务已经完成。'
    },
    {
      key: 'mobile-loading',
      label: '移动加载',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下 Loading 文案要更短，遮罩不应挤压或遮挡主要操作说明。'
    },
    {
      key: 'keyboard-loading',
      label: '键盘读屏',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Loading 不抢焦点，读屏用户能通过 status 和 aria-busy 理解当前任务。'
    }
  ],
  text: [
    {
      key: 'body-text',
      label: '正文文本',
      kind: 'basic',
      controlValue: 'body',
      description: '正文文本保持中性、稳定的行高，用于文档段落和表单提示。'
    },
    {
      key: 'status-text',
      label: '状态文本',
      kind: 'controlled',
      controlValue: 'status',
      description: '语义色文本适合轻量状态说明，避免过度使用 Badge 或 Alert。'
    },
    {
      key: 'warning-text',
      label: '风险文本',
      kind: 'error',
      controlValue: 'warning',
      description: '轻量错误或风险提示可以使用文本语义承载，避免小问题被 Alert 放大。'
    },
    {
      key: 'inline-code-text',
      label: '内联代码',
      kind: 'copy',
      controlValue: 'code',
      description: '代码文本用于 token、变量名和配置键，帮助文档保持技术准确性。'
    },
    {
      key: 'clamped-text',
      label: '多行省略',
      kind: 'responsive',
      controlValue: 'clamp',
      description: '列表和卡片摘要可用 line-clamp 保持高度一致。'
    },
    {
      key: 'keyboard-text',
      label: '键盘路径',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: 'Text 是纯展示语义，不应抢占焦点或打断内部链接的键盘路径。'
    }
  ],
  formItem: [
    {
      key: 'basic-form-item',
      label: '基础字段',
      kind: 'basic',
      controlValue: 'basic',
      description: '字段标签、必填标记、提示和输入控件组合成最小可用表单项。'
    },
    {
      key: 'slot-form-item',
      label: 'Slot 绑定',
      kind: 'composition',
      controlValue: 'slot',
      description: '通过 labelFor、messageId 和 invalid slot props 把字段语义传给输入控件。'
    },
    {
      key: 'error-form-item',
      label: '校验错误',
      kind: 'error',
      controlValue: 'error',
      description: '错误文案紧贴字段展示，并通过 aria-describedby 关联输入控件。'
    },
    {
      key: 'optional-form-item',
      label: '可选字段',
      kind: 'controlled',
      controlValue: 'optional',
      description: '可选字段保留提示但去掉必填状态，适合渐进补充信息。'
    },
    {
      key: 'mobile-form-item',
      label: '移动字段',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端标签和帮助文案保持短句，让输入区域优先占据宽度。'
    },
    {
      key: 'keyboard-form-item',
      label: '键盘字段',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证标签、帮助文本和输入控件语义连接，键盘顺序不绕路。'
    }
  ],
  formSummary: [
    {
      key: 'validation-form-summary',
      label: '错误汇总',
      kind: 'basic',
      controlValue: 'errors',
      description: '提交失败时在表单顶部展示可点击的错误汇总，帮助用户快速定位。'
    },
    {
      key: 'linked-form-summary',
      label: '关联字段',
      kind: 'composition',
      controlValue: 'linked',
      description: '把摘要错误项、字段 id、字段错误和输入 aria-describedby 组合成完整校验链路。'
    },
    {
      key: 'review-form-summary',
      label: '复核摘要',
      kind: 'controlled',
      controlValue: 'review',
      description: '复核模式保留错误列表但关闭点击聚焦，适合只读审核面板。'
    },
    {
      key: 'empty-form-summary',
      label: '空摘要',
      kind: 'empty',
      controlValue: 'empty',
      description: '没有错误时组件不渲染，文档需要展示这种静默成功状态。'
    },
    {
      key: 'mobile-form-summary',
      label: '移动摘要',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端错误摘要使用短标题和短字段名，减少首屏滚动成本。'
    },
    {
      key: 'keyboard-form-summary',
      label: '键盘摘要',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证错误按钮可聚焦，Enter 能把焦点移动到对应字段。'
    }
  ],
  backtop: [
    {
      key: 'docs-backtop',
      label: '文档返回',
      kind: 'basic',
      controlValue: 'docs',
      description: '长文档和 API 表格页使用低阈值返回顶部按钮，减少重复滚动。'
    },
    {
      key: 'compact-backtop',
      label: '紧凑位置',
      kind: 'controlled',
      controlValue: 'compact',
      description: '页面存在右侧目录或悬浮工具条时，需要控制按钮与边缘的距离。'
    },
    {
      key: 'hidden-backtop',
      label: '未滚动隐藏',
      kind: 'empty',
      controlValue: 'hidden',
      description: '页面未达到有效滚动深度时保持隐藏，避免无意义悬浮按钮。'
    },
    {
      key: 'mobile-backtop',
      label: '移动返回',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端按钮更靠近拇指区，同时避开底部导航和系统安全区。'
    },
    {
      key: 'keyboard-backtop',
      label: '键盘返回',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '返回顶部按钮需要真实 button 语义，键盘用户能聚焦并触发。'
    }
  ],
  commandPalette: [
    {
      key: 'open-command-palette',
      label: '打开命令',
      kind: 'basic',
      controlValue: 'open',
      description: '覆盖 commands 命令列表，文档、后台和设计工具用命令面板承载高频跳转和全局动作。'
    },
    {
      key: 'search-command-palette',
      label: '搜索命令',
      kind: 'search',
      controlValue: 'search',
      description: '搜索提示说明输入后会过滤命令，帮助用户理解可发现性。'
    },
    {
      key: 'empty-command-palette',
      label: '空命令',
      kind: 'empty',
      controlValue: 'empty',
      description: '没有可用命令时仍展示空状态，避免弹层只剩空白。'
    },
    {
      key: 'mobile-command-palette',
      label: '移动命令',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端使用更短提示，面板宽度由组件保持在视口内。'
    },
    {
      key: 'keyboard-command-palette',
      label: '键盘命令',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证方向键、Enter 和 Escape 的完整键盘路径。'
    }
  ],
  codeBlock: [
    {
      key: 'import-code-block',
      label: '导入代码',
      kind: 'basic',
      controlValue: 'import',
      description: '展示最常见的组件导入代码，方便从文档直接复制。'
    },
    {
      key: 'copy-code-block',
      label: '复制安装',
      kind: 'copy',
      controlValue: 'copy',
      description: '安装命令旁边提供独立复制动作，贴近主流文档站体验。'
    },
    {
      key: 'empty-code-block',
      label: '空代码',
      kind: 'empty',
      controlValue: 'empty',
      description: '没有选择片段时展示空代码区域和说明，避免复制无效内容。'
    },
    {
      key: 'mobile-code-block',
      label: '移动代码',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '长代码在窄屏下保持横向滚动，页面本身不能溢出。'
    },
    {
      key: 'keyboard-code-block',
      label: '键盘复制',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证代码块之后的复制动作可通过 Tab 到达。'
    }
  ],
  themeSwitcher: [
    {
      key: 'light-theme-switcher',
      label: '明亮主题',
      kind: 'basic',
      controlValue: 'light',
      description: '展示文档默认主题选项，作为主题切换的基础状态。'
    },
    {
      key: 'clean-theme-switcher',
      label: '清爽主题',
      kind: 'controlled',
      controlValue: 'clean',
      description: '受控值切换到 clean 主题，验证主题选中状态回显。'
    },
    {
      key: 'review-theme-switcher',
      label: '对比复核',
      kind: 'error',
      controlValue: 'review',
      description: '主题对比接近阈值时用风险提示提醒设计复核。'
    },
    {
      key: 'mobile-theme-switcher',
      label: '移动主题',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏设置页中主题选项需要保持可点击且不换行挤压。'
    },
    {
      key: 'keyboard-theme-switcher',
      label: '键盘主题',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '每个主题选项都应是可聚焦的 pressed button。'
    }
  ],
  pageHeader: [
    {
      key: 'inventory-page-header',
      label: '库存页头',
      kind: 'basic',
      controlValue: 'inventory',
      description: '覆盖 heading-level，后台详情和列表页使用页头表达层级、标题、状态与说明。'
    },
    {
      key: 'action-page-header',
      label: '带操作',
      kind: 'composition',
      controlValue: 'actions',
      description: '页头操作放入 actions 插槽，保证标题区和命令区职责清晰。'
    },
    {
      key: 'empty-status-page-header',
      label: '无状态',
      kind: 'empty',
      controlValue: 'empty',
      description: '状态未知或无需状态时不渲染徽标，减少后台页面噪音。'
    },
    {
      key: 'mobile-page-header',
      label: '移动页头',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下操作区换到标题下方，核心标题仍先出现。'
    },
    {
      key: 'keyboard-page-header',
      label: '键盘页头',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '标题本身不抢焦点，键盘顺序进入页头操作按钮。'
    }
  ],
  metricCard: [
    {
      key: 'coverage-metric-card',
      label: '覆盖指标',
      kind: 'basic',
      controlValue: 'coverage',
      description: '展示文档覆盖、组件成熟度或发布质量这类后台指标。'
    },
    {
      key: 'risk-metric-card',
      label: '风险指标',
      kind: 'error',
      controlValue: 'risk',
      description: '风险、阻塞和失败数量使用 danger 语义，并提供下一步描述。'
    },
    {
      key: 'neutral-metric-card',
      label: '中性指标',
      kind: 'controlled',
      controlValue: 'neutral',
      description: '不表达涨跌的指标使用 neutral，避免误导用户判断趋势。'
    },
    {
      key: 'mobile-metric-card',
      label: '移动指标',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端指标卡片应保持短标签、短数值和稳定行高。'
    },
    {
      key: 'keyboard-metric-card',
      label: '键盘指标',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '指标卡片是静态信息，相邻操作才进入键盘焦点序列。'
    }
  ],
  filterTabs: [
    {
      key: 'status-filter-tabs',
      label: '状态筛选',
      kind: 'basic',
      controlValue: 'stable',
      description: '用 tablist 表达状态筛选，适合表格、看板和组件索引。'
    },
    {
      key: 'review-filter-tabs',
      label: '复核筛选',
      kind: 'filter',
      controlValue: 'review',
      description: '选择复核状态时同步更新 modelValue，展示筛选回填。'
    },
    {
      key: 'empty-filter-tabs',
      label: '空筛选',
      kind: 'empty',
      controlValue: 'empty',
      description: '没有筛选项时保留说明，避免 tablist 变成不可理解的空区域。'
    },
    {
      key: 'mobile-filter-tabs',
      label: '移动筛选',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端使用短可访问名称和折行布局，避免标签撑出页面。'
    },
    {
      key: 'keyboard-filter-tabs',
      label: '键盘筛选',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证方向键切换、Home/End 跳转和禁用项跳过。'
    }
  ],
  card: [
    {
      key: 'info-card',
      label: '信息卡片',
      kind: 'basic',
      controlValue: 'info',
      description: '展示标题、说明、主体内容和状态标签，适合作为概览页信息块。'
    },
    {
      key: 'action-card',
      label: '操作卡片',
      kind: 'controlled',
      controlValue: 'action',
      description: '覆盖 interactive 交互态，使用 extra 和 footer 插槽承载明确操作，不把整张卡片伪装成按钮。'
    },
    {
      key: 'grid-card',
      label: '网格卡片',
      kind: 'multi',
      controlValue: 'grid',
      description: '展示多个重复卡片在列表或仪表盘栅格中的一致间距和信息密度。'
    },
    {
      key: 'mobile-card',
      label: '移动卡片',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下标题、描述、主体和操作区不会互相挤压。'
    },
    {
      key: 'keyboard-card-action',
      label: '键盘操作',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 聚焦卡片内按钮，而不是让整张卡片成为隐式按钮。'
    },
    {
      key: 'empty-card',
      label: '空状态卡片',
      kind: 'empty',
      controlValue: 'empty',
      description: '卡片承载空态时保留标题、说明和下一步操作，避免只剩空白容器。'
    }
  ],
  collapse: [
    {
      key: 'faq-collapse',
      label: 'FAQ 分组',
      kind: 'basic',
      controlValue: 'faq',
      description: '展示文档常见问题、说明文本和多面板同时展开的基础模式。'
    },
    {
      key: 'accordion-settings',
      label: '手风琴设置',
      kind: 'controlled',
      controlValue: 'accordion',
      description: '设置页只允许展开一个分组，避免同时显示过多表单说明。'
    },
    {
      key: 'disabled-panel',
      label: '禁用面板',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '禁用项保持可见但不可展开，用于锁定功能、权限不足或未满足前置条件。'
    },
    {
      key: 'mobile-collapse',
      label: '移动折叠',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下触发器高度、标题和内容说明仍然可读可点。'
    },
    {
      key: 'keyboard-collapse',
      label: '键盘展开',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 到达每个触发器，Enter 或 Space 可以切换当前面板。'
    }
  ],
  descriptions: [
    {
      key: 'detail-metadata',
      label: '详情信息',
      kind: 'basic',
      controlValue: 'detail',
      description: '展示组件、包名、负责人和版本这类 items 详情项，并用 column 建立详情页基础阅读节奏。'
    },
    {
      key: 'review-sidebar',
      label: '审核侧栏',
      kind: 'controlled',
      controlValue: 'review',
      description: '在审核面板中用 extra 和状态插槽暴露审核动作与风险状态。'
    },
    {
      key: 'vertical-profile',
      label: '垂直布局',
      kind: 'composition',
      controlValue: 'vertical',
      description: '字段较长或侧栏宽度有限时使用 layout 垂直标签和值，让扫描顺序更稳定。'
    },
    {
      key: 'empty-descriptions',
      label: '空详情',
      kind: 'empty',
      controlValue: 'empty',
      description: '资料未同步或权限不足时展示空详情说明，避免详情区域只有空白边框。'
    },
    {
      key: 'long-field',
      label: '长字段',
      kind: 'multi',
      controlValue: 'long',
      description: '覆盖说明、备注、变更原因等长字段，避免把多行信息塞进表格单元格。'
    },
    {
      key: 'mobile-descriptions',
      label: '移动阅读',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下改为单列和小尺寸，保证标签和值不会互相挤压。'
    },
    {
      key: 'keyboard-descriptions',
      label: '键盘阅读',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证具名区域、dl、dt 和 dd 语义能帮助键盘与读屏用户理解标签和值。'
    }
  ],
  pagination: [
    {
      key: 'list-pagination',
      label: '列表翻页',
      kind: 'basic',
      controlValue: 'list',
      description: '展示资源列表底部的常规分页，页码由业务层通过 v-model 管理。'
    },
    {
      key: 'dense-pagination',
      label: '密集页码',
      kind: 'multi',
      controlValue: 'dense',
      description: '数据量较大时增加相邻页数量，让用户能在表格结果中更快跳转。'
    },
    {
      key: 'single-page-hidden',
      label: '单页隐藏',
      kind: 'empty',
      controlValue: 'single',
      description: '搜索结果只有一页时隐藏分页器，避免在空或少量结果页制造噪音。'
    },
    {
      key: 'disabled-pagination',
      label: '禁用状态',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '远程列表刷新、权限冻结或审核暂停时禁用分页，避免重复请求。'
    },
    {
      key: 'mobile-pagination',
      label: '移动分页',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下减少相邻页数量和总按钮数量，确保上一页和下一页仍然可点。'
    },
    {
      key: 'keyboard-pagination',
      label: '键盘分页',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 能经过上一页、页码和下一页按钮，当前页用 aria-current 标记。'
    }
  ],
  list: [
    {
      key: 'task-list',
      label: '任务列表',
      kind: 'basic',
      controlValue: 'tasks',
      description: '展示常规任务、消息或资源集合，标题、说明、meta 和 split 分割线保持清晰扫描。'
    },
    {
      key: 'resource-grid',
      label: '资源网格',
      kind: 'multi',
      controlValue: 'grid',
      description: '参考主流 List 的 grid 场景，把轻量资源卡片排成多列。'
    },
    {
      key: 'loading-list',
      label: '加载列表',
      kind: 'loading',
      controlValue: 'loading',
      description: '远程列表刷新时保留列表区域语义并通过 status 告知加载中。'
    },
    {
      key: 'empty-list',
      label: '空结果',
      kind: 'empty',
      controlValue: 'empty',
      description: '搜索、筛选或权限结果为空时展示短文案，不保留无意义的空列表框。'
    },
    {
      key: 'mobile-list',
      label: '移动列表',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下切换为 layout 纵向布局，操作和内容不互相挤压。'
    },
    {
      key: 'keyboard-list',
      label: '键盘阅读',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 ul、li 语义和真实按钮操作能构成稳定的键盘阅读路径。'
    }
  ],
  timeline: [
    {
      key: 'release-timeline',
      label: '发布记录',
      kind: 'basic',
      controlValue: 'release',
      description: '展示按时间顺序组织的发布活动、版本日志或订单轨迹。'
    },
    {
      key: 'reverse-timeline',
      label: '倒序记录',
      kind: 'controlled',
      controlValue: 'reverse',
      description: '最近事件优先展示，适合活动流、系统日志和审核记录。'
    },
    {
      key: 'alternate-timeline',
      label: '交替布局',
      kind: 'multi',
      controlValue: 'alternate',
      description: '参考主流组件库的 alternate 模式，适合版本故事或品牌叙事。'
    },
    {
      key: 'loading-timeline',
      label: '加载尾项',
      kind: 'loading',
      controlValue: 'loading',
      description: '最后一个节点展示 pending/loading 状态，用于发布任务或异步流水线。'
    },
    {
      key: 'mobile-timeline',
      label: '移动时间线',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用紧凑尺寸和单侧布局，保证标题、时间和描述可读。'
    },
    {
      key: 'keyboard-timeline',
      label: '键盘阅读',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 ordered list 语义和节点内操作能形成稳定的键盘阅读路径。'
    }
  ],
  select: [
    {
      key: 'package-select',
      label: '包选择',
      kind: 'basic',
      controlValue: 'package',
      description: '展示常规包类型选择、placeholder 占位文案和选中值回显。'
    },
    {
      key: 'clearable-select',
      label: '可清空',
      kind: 'empty',
      controlValue: 'clearable',
      description: '覆盖可清空选择器，适合筛选恢复和表单重选。'
    },
    {
      key: 'multiple-select',
      label: '多选标签',
      kind: 'multi',
      controlValue: 'multiple',
      description: '多选值以紧凑标签展示，选择后下拉面板保持打开。'
    },
    {
      key: 'collapsed-tags-select',
      label: '标签折叠',
      kind: 'multi',
      controlValue: 'collapsedTags',
      description: '多选值较多时折叠标签，保持表单触发器宽度稳定。'
    },
    {
      key: 'size-select',
      label: '尺寸密度',
      kind: 'layout',
      controlValue: 'size',
      description: '展示 small / medium / large 尺寸在表单密度中的使用。'
    },
    {
      key: 'filterable-select',
      label: '可搜索',
      kind: 'search',
      controlValue: 'filterable',
      description: '覆盖常见可搜索选择器，验证搜索输入、过滤结果和复制源码。'
    },
    {
      key: 'empty-filter-select',
      label: '无匹配结果',
      kind: 'empty',
      controlValue: 'emptyFilter',
      description: '搜索没有匹配项时显示稳定空状态，避免用户误以为弹层失效。'
    },
    {
      key: 'grouped-select',
      label: '分组选项',
      kind: 'layout',
      controlValue: 'grouped',
      description: '按组件家族分组展示选项，提升长列表扫描效率。'
    },
    {
      key: 'disabled-option-select',
      label: '禁用选项',
      kind: 'disabled',
      controlValue: 'disabledOptions',
      description: '列表中保留不可选值的可见性，同时阻止鼠标和键盘误选。'
    },
    {
      key: 'allow-create-select',
      label: '创建选项',
      kind: 'search',
      controlValue: 'allowCreate',
      description: '搜索不存在的值时允许创建并选中新标签，覆盖内容运营和标签录入场景。'
    },
    {
      key: 'virtualized-select',
      label: '虚拟滚动',
      kind: 'virtual',
      controlValue: 'virtualized',
      description: '千级选项只渲染视口附近项目，保持 listbox 语义和滚动性能。'
    },
    {
      key: 'remote-select',
      label: '远程加载',
      kind: 'loading',
      controlValue: 'remote',
      description: '异步刷新选项时显示 loading 状态，避免用户在请求过程中误选旧数据。'
    },
    {
      key: 'form-validation-select',
      label: '表单校验选择',
      kind: 'error',
      controlValue: 'form-validation',
      description: '把 Select 放进 FormItem，展示 combobox 的错误、invalid、aria-describedby 和 change 校验路径。'
    },
    {
      key: 'required-error',
      label: '必填错误',
      kind: 'error',
      controlValue: 'error',
      description: '覆盖未选择时的错误提示、invalid 语义和说明文案。'
    },
    {
      key: 'disabled-review',
      label: '禁用审核',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '展示审核态下选中值可读但不可重新选择。'
    },
    {
      key: 'mobile-select',
      label: '移动选择',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下标签、占位和下拉触发器保持可读可点。'
    },
    {
      key: 'keyboard-select',
      label: '键盘选择',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Enter / Space 打开 listbox，方向键移动选项，Escape 关闭。'
    }
  ],
  cascader: [
    {
      key: 'single-path',
      label: '单路径选择',
      kind: 'basic',
      controlValue: 'component',
      description: '展示 options 从根节点到叶子节点的常规级联选择，并提供 placeholder 占位提示。'
    },
    {
      key: 'multi-scope',
      label: '多权限范围',
      kind: 'multi',
      controlValue: 'access',
      description: '覆盖多选、回显和多个路径并存的访问范围配置。'
    },
    {
      key: 'locked-review',
      label: '禁用错误回填',
      kind: 'error',
      controlValue: 'locked',
      description: '展示禁用值、错误文案和已选路径的审核状态。'
    },
    {
      key: 'async-cascader',
      label: '异步级联',
      kind: 'remote',
      controlValue: 'lazy',
      description: '覆盖 lazy、load、loadError 和 isLeaf 的远程层级加载。'
    },
    {
      key: 'mobile-cascader',
      label: '移动级联',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下 separator 路径分隔符、触发器和已选路径保持可读可点。'
    },
    {
      key: 'keyboard-cascader',
      label: '键盘级联',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Enter / Space 打开级联面板，方向键在层级路径中移动，Escape 关闭。'
    }
  ],
  datePicker: [
    {
      key: 'basic-date-picker',
      label: '基础日期',
      kind: 'basic',
      controlValue: 'basic',
      description: '覆盖 placeholder、locale 与 model-value，展示发布日、预约日或生日这类单个确定日期。'
    },
    {
      key: 'shortcut-date-picker',
      label: '快捷日期',
      kind: 'controlled',
      controlValue: 'shortcut',
      description: '覆盖 shortcuts，把今天、评审日、上线日和带时间说明的发布窗口放入面板快捷项。'
    },
    {
      key: 'disabled-date-picker',
      label: '禁用日期',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '排除周末、维护窗口或业务上不可预约的日期。'
    },
    {
      key: 'error-date-picker',
      label: '校验错误',
      kind: 'error',
      controlValue: 'error',
      description: '表单必填、过期日期或冲突日期需要清晰错误反馈。'
    },
    {
      key: 'form-validation-date-picker',
      label: '表单校验',
      kind: 'composition',
      controlValue: 'validation',
      description: '把 id、aria-describedby、error 和 visibleChange 组合到真实表单校验链路。'
    },
    {
      key: 'mobile-date-picker',
      label: '移动日期',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用短标签和短占位，保证输入框与按钮仍然可点。'
    },
    {
      key: 'keyboard-date-picker',
      label: '键盘日期',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Enter、Space、方向键、PageUp、PageDown 和 Escape 的日历路径。'
    }
  ],
  timePicker: [
    {
      key: 'basic-time-picker',
      label: '基础时间',
      kind: 'basic',
      controlValue: 'basic',
      description: '展示排期、预约或发布设置里的单个 HH:mm 时间，并提供 placeholder 占位提示。'
    },
    {
      key: 'step-time-picker',
      label: '分钟步长',
      kind: 'controlled',
      controlValue: 'step',
      description: '用 15 分钟或 30 分钟粒度约束会议、预约和排班时间。'
    },
    {
      key: 'disabled-time-picker',
      label: '禁用时间',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '禁用下班后、维护窗口或业务上不可选的时间点。'
    },
    {
      key: 'error-time-picker',
      label: '校验错误',
      kind: 'error',
      controlValue: 'error',
      description: '必填、冲突或过期时间需要清晰错误反馈。'
    },
    {
      key: 'form-validation-time-picker',
      label: '表单校验',
      kind: 'composition',
      controlValue: 'validation',
      description: '把 id、aria-describedby、error 和 visibleChange 组合到真实时间字段校验链路。'
    },
    {
      key: 'mobile-time-picker',
      label: '移动时间',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用短标签、短占位和较粗分钟粒度保持可操作。'
    },
    {
      key: 'keyboard-time-picker',
      label: '键盘时间',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证打开面板、切换小时、移动分钟、确认和关闭的键盘路径。'
    }
  ],
  dateTimePicker: [
    {
      key: 'basic-date-time-picker',
      label: '基础日期时间',
      kind: 'basic',
      controlValue: 'basic',
      description: '展示发布、预约和排期场景里单个 YYYY-MM-DD HH:mm 日期时间字段。'
    },
    {
      key: 'shortcut-date-time-picker',
      label: '快捷日期时间',
      kind: 'controlled',
      controlValue: 'shortcut',
      description: '用快捷项填充评审、上线和维护窗口等常用业务时间点。'
    },
    {
      key: 'disabled-date-time-picker',
      label: '禁用规则',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '同时禁用周末日期和下班后时间，覆盖真实排期限制。'
    },
    {
      key: 'error-date-time-picker',
      label: '校验错误',
      kind: 'error',
      controlValue: 'error',
      description: '日期时间必填或与冻结窗口冲突时展示明确错误文案。'
    },
    {
      key: 'form-validation-date-time-picker',
      label: '表单校验',
      kind: 'composition',
      controlValue: 'validation',
      description: '把 id、aria-describedby、error、change 和 visibleChange 接入表单校验链路。'
    },
    {
      key: 'mobile-date-time-picker',
      label: '移动日期时间',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用短标签、短占位和 30 分钟粒度，保证面板仍可操作。'
    },
    {
      key: 'keyboard-date-time-picker',
      label: '键盘日期时间',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '覆盖打开面板、移动日期、选择小时分钟、确认和关闭弹层的键盘路径。'
    }
  ],
  inputNumber: [
    {
      key: 'quantity-input-number',
      label: '数量范围',
      kind: 'basic',
      controlValue: 'quantity',
      description: '用 placeholder、min、max 和 step 限制库存、数量或分页大小。'
    },
    {
      key: 'precision-input-number',
      label: '小数精度',
      kind: 'controlled',
      controlValue: 'precision',
      description: '小数步进和 precision 适合评分、比例、折扣和阈值。'
    },
    {
      key: 'density-input-number',
      label: '尺寸密度',
      kind: 'layout',
      controlValue: 'density',
      description: '展示 sm、md、lg 三种数值输入高度，适合表格筛选、默认表单和设置面板。'
    },
    {
      key: 'controls-input-number',
      label: '无步进器',
      kind: 'multi',
      controlValue: 'controls',
      description: '金额和预算字段可以隐藏步进器，保留直接输入和键盘能力。'
    },
    {
      key: 'error-input-number',
      label: '校验错误',
      kind: 'error',
      controlValue: 'error',
      description: '展示范围冲突、必填或发布门禁中的错误状态。'
    },
    {
      key: 'mobile-input-number',
      label: '移动数值',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用短标签和较少控件，避免步进器挤压输入框。'
    },
    {
      key: 'keyboard-input-number',
      label: '键盘步进',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 ArrowUp、ArrowDown、Tab 和按钮聚焦路径。'
    }
  ],
  rate: [
    {
      key: 'basic-rate',
      label: '基础评分',
      kind: 'basic',
      controlValue: 'basic',
      description: '展示满意度、质量分和偏好反馈的默认评分。'
    },
    {
      key: 'half-rate',
      label: '半星评分',
      kind: 'controlled',
      controlValue: 'half',
      description: '使用 0.5 步进展示更细粒度的评分反馈。'
    },
    {
      key: 'copy-rate',
      label: '评分文案',
      kind: 'copy',
      controlValue: 'copy',
      description: '为每个等级补充文案，让用户知道分数含义。'
    },
    {
      key: 'clear-rate',
      label: '可清空',
      kind: 'empty',
      controlValue: 'clear',
      description: '再次点击当前分数可以回到未评分状态。'
    },
    {
      key: 'readonly-rate',
      label: '只读展示',
      kind: 'disabled',
      controlValue: 'readonly',
      description: '展示聚合评分或历史评价，不允许继续编辑。'
    },
    {
      key: 'mobile-rate',
      label: '移动评分',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用较少评分项和紧凑尺寸保持可点按。'
    },
    {
      key: 'keyboard-rate',
      label: '键盘评分',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证方向键、Home 和 End 的评分路径。'
    }
  ],
  colorPicker: [
    {
      key: 'basic-color-picker',
      label: '基础取色',
      kind: 'basic',
      controlValue: 'basic',
      description: '使用 placeholder、原生色板和 HEX 文本输入选择主题色。'
    },
    {
      key: 'alpha-color-picker',
      label: '透明度',
      kind: 'copy',
      controlValue: 'alpha',
      description: '支持 8 位 HEXA，并在触发器展示当前透明度颜色。'
    },
    {
      key: 'preset-color-picker',
      label: '预设色',
      kind: 'multi',
      controlValue: 'presets',
      description: '用品牌预设色限制主题配置范围。'
    },
    {
      key: 'clear-color-picker',
      label: '可清空',
      kind: 'empty',
      controlValue: 'clear',
      description: '可选颜色允许清空并回到空值。'
    },
    {
      key: 'error-color-picker',
      label: '校验错误',
      kind: 'error',
      controlValue: 'error',
      description: '展示必填、非法 HEX 或品牌规范冲突。'
    },
    {
      key: 'form-validation-color-picker',
      label: '表单校验',
      kind: 'composition',
      controlValue: 'validation',
      description: '把 id、aria-describedby、presets、invalid、error 和事件日志组合到真实品牌色校验链路。'
    },
    {
      key: 'mobile-color-picker',
      label: '移动色板',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '小尺寸触发器和短标签适合窄屏主题配置。'
    },
    {
      key: 'keyboard-color-picker',
      label: '键盘输入',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '优先验证 showText 文本输入、粘贴和 Tab 到达预设色。'
    }
  ],
  slider: [
    {
      key: 'value-slider',
      label: '基础滑块',
      kind: 'basic',
      controlValue: 'value',
      description: '展示透明度、音量、强度这类连续数值选择，并显式设置 min、max 和 marks。'
    },
    {
      key: 'step-slider',
      label: '离散步进',
      kind: 'controlled',
      controlValue: 'step',
      description: '用 step 限制为 5、10 等离散值，结合 marks 标记评分、比例和发布阈值。'
    },
    {
      key: 'range-slider',
      label: '范围选择',
      kind: 'multi',
      controlValue: 'range',
      description: '支持价格、预算、筛选区间这类双端边界选择。'
    },
    {
      key: 'vertical-slider',
      label: '垂直提示',
      kind: 'layout',
      controlValue: 'vertical',
      description: '使用固定高度、垂直方向和右侧 tooltip 展示仪表盘阈值。'
    },
    {
      key: 'error-slider',
      label: '校验错误',
      kind: 'error',
      controlValue: 'error',
      description: '阈值不满足业务规则时展示错误文案和 aria-invalid。'
    },
    {
      key: 'mobile-slider',
      label: '移动滑块',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下用短标签、较大步长和可见数值保持可操作。'
    },
    {
      key: 'keyboard-slider',
      label: '键盘滑块',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 到达滑块后，方向键可以按 step 调整数值。'
    }
  ],
  splitter: [
    {
      key: 'workspace-splitter',
      label: '工作区分栏',
      kind: 'basic',
      controlValue: 'workspace',
      description: '展示文档导航和内容预览的左右分栏，并保留面板 label 与 separator 语义。'
    },
    {
      key: 'vertical-splitter',
      label: '上下分割',
      kind: 'layout',
      controlValue: 'vertical',
      description: '使用 vertical 布局组织预览区和日志区，适合编辑器、调试台和数据详情。'
    },
    {
      key: 'controlled-splitter',
      label: '受控尺寸',
      kind: 'controlled',
      controlValue: 'controlled',
      description: '通过 modelValue 固定面板尺寸，便于从本地偏好、路由状态或工作区配置恢复布局。'
    },
    {
      key: 'collapsed-splitter',
      label: '折叠面板',
      kind: 'empty',
      controlValue: 'collapsed',
      description: '验证可折叠侧栏压缩到 collapsedSize 后，主内容区域仍然获得剩余空间。'
    },
    {
      key: 'mobile-splitter',
      label: '移动分割',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏时改用上下分割和较低高度，避免左右栏挤压正文。'
    },
    {
      key: 'keyboard-splitter',
      label: '键盘调整',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: 'separator 使用 role=separator，方向键、Home 和 End 可调整相邻面板尺寸。'
    }
  ],
  crudLayout: [
    {
      key: 'resource-shell',
      label: '资源页骨架',
      kind: 'basic',
      controlValue: 'inventory',
      description: '组合 heading-level 标题、筛选、表格和侧栏，模拟后台资源管理页。'
    },
    {
      key: 'responsive-sidebar',
      label: '响应式侧栏',
      kind: 'responsive',
      controlValue: 'responsive',
      description: '验证窄屏下侧栏不抢占首屏核心内容。'
    },
    {
      key: 'empty-content',
      label: '空内容区',
      kind: 'empty',
      controlValue: 'empty',
      description: '覆盖暂无资源或筛选无结果时的布局稳定性。'
    },
    {
      key: 'keyboard-crud-layout',
      label: '键盘 CRUD',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证键盘用户能按顺序到达筛选表单、表格设置、行选择和分页动作。'
    }
  ],
  dataView: [
    {
      key: 'default-data-view',
      label: '默认工作台',
      kind: 'basic',
      controlValue: 'beta',
      description: '覆盖 views、saved-views-title、saved-views-description，展示保存视图与数据表格组合后的默认后台列表工作台。'
    },
    {
      key: 'stable-data-view',
      label: '稳定视图',
      kind: 'controlled',
      controlValue: 'stable',
      description: '切换到稳定组件视图，并应用独立的列宽、密度和筛选偏好。'
    },
    {
      key: 'filtered-data-view',
      label: '筛选偏好',
      kind: 'filter',
      controlValue: 'filtered',
      description: '覆盖 page-size 与筛选摘要，保存视图携带筛选偏好，适合复用常见审核或发布列表条件。'
    },
    {
      key: 'mobile-data-view',
      label: '移动视图',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下组合视图变为单列，保存视图和表格主体仍保持可读可操作。'
    },
    {
      key: 'keyboard-data-view',
      label: '键盘巡航',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '覆盖 selectable、reorderable-columns，验证 Tab 可以经过保存视图、表格列设置、密度切换、筛选摘要和分页动作。'
    },
    {
      key: 'empty-data-view',
      label: '空视图',
      kind: 'empty',
      controlValue: 'empty',
      description: '筛选无结果时保留保存视图、表格设置和清空筛选路径。'
    }
  ],
  resourcePage: [
    {
      key: 'default-resource-page',
      label: '资源页骨架',
      kind: 'basic',
      controlValue: 'default',
      description: '覆盖 search-model、search-fields、search-title、views，组合标题、搜索表单、保存视图、数据表和右侧摘要，形成真实资源管理页。'
    },
    {
      key: 'detail-resource-page',
      label: '详情抽屉',
      kind: 'controlled',
      controlValue: 'detail',
      description: '打开资源详情抽屉，验证页面主列表与详情工作流可以并行存在。'
    },
    {
      key: 'filtered-resource-page',
      label: '筛选工作流',
      kind: 'filter',
      controlValue: 'filtered',
      description: '覆盖 view-value，展示搜索表单、保存视图和表格筛选摘要一起表达当前资源范围。'
    },
    {
      key: 'mobile-resource-page',
      label: '移动资源页',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下资源页保持单列主体，搜索和保存视图不抢占首屏核心列表。'
    },
    {
      key: 'keyboard-resource-page',
      label: '键盘巡航',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '覆盖 table-title、selectable，验证 Tab 可以经过标题操作、搜索表单、保存视图、表格设置、分页和详情关闭。'
    },
    {
      key: 'empty-resource-page',
      label: '空资源页',
      kind: 'empty',
      controlValue: 'empty',
      description: '筛选无结果或权限为空时展示明确空状态，并保留返回筛选的路径。'
    }
  ],
  schemaForm: [
    {
      key: 'default-schema-form',
      label: 'Schema 基础表单',
      kind: 'basic',
      controlValue: 'default',
      description: '用字段 schema 一次性声明控件、标签、label-width、选项和提交动作，形成后台资料表单。'
    },
    {
      key: 'validation-schema-form',
      label: '校验摘要',
      kind: 'error',
      controlValue: 'validation',
      description: '提交时展示字段级错误和 summary-title 可点击摘要，帮助用户快速定位需要修正的字段。'
    },
    {
      key: 'conditional-schema-form',
      label: '字段联动',
      kind: 'controlled',
      controlValue: 'conditional',
      description: '根据当前模型显示自定义原因字段，适合配置化表单里的条件显隐。'
    },
    {
      key: 'array-schema-form',
      label: '动态列表',
      kind: 'composition',
      controlValue: 'array',
      description: '通过 array 字段复用 Field Array，声明审批人、联系人和明细行等可增删字段组。'
    },
    {
      key: 'mobile-schema-form',
      label: '移动表单',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下 schema 表单自动切换为单列，错误摘要和操作按钮保持可读。'
    },
    {
      key: 'keyboard-schema-form',
      label: '键盘路径',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证键盘可以经过输入、选择、开关、提交、重置和错误摘要链接。'
    }
  ],
  fieldArray: [
    {
      key: 'default-field-array',
      label: '成员列表',
      kind: 'basic',
      controlValue: 'default',
      description: '渲染可增删的成员字段组，适合审核人、联系人和权限项配置。'
    },
    {
      key: 'empty-field-array',
      label: '空态添加',
      kind: 'empty',
      controlValue: 'empty',
      description: '空数组时展示明确空态、add-text 添加入口，新增项会使用 defaultItem 克隆。'
    },
    {
      key: 'limited-field-array',
      label: '数量限制',
      kind: 'disabled',
      controlValue: 'limited',
      description: '达到 max 后禁用添加，低于 min 时禁用删除，避免破坏业务约束。'
    },
    {
      key: 'readonly-field-array',
      label: '只读维护',
      kind: 'disabled',
      controlValue: 'readonly',
      description: '审核或归档状态下保留动态字段值，但禁用新增和删除操作。'
    },
    {
      key: 'mobile-field-array',
      label: '移动布局',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下每个字段项保持单列，标题和删除按钮不会挤压内容。'
    },
    {
      key: 'keyboard-field-array',
      label: '键盘路径',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证键盘可以经过 add-text 添加按钮、字段输入和 remove-text 删除按钮完成动态项维护。'
    }
  ],
  dataTable: [
    {
      key: 'remote-loading',
      label: '远程加载',
      kind: 'remote',
      controlValue: 'loading',
      description: '覆盖 caption 表格标题、loading、refreshable 请求事件和远程分页的数据流。'
    },
    {
      key: 'error-retry',
      label: '错误重试',
      kind: 'error',
      controlValue: 'error',
      description: '展示错误状态、重试入口和 alert 语义。'
    },
    {
      key: 'active-filters',
      label: '筛选摘要',
      kind: 'filter',
      controlValue: 'filters',
      description: '展示后台列表常见的活跃筛选胶囊、局部清除和 Clear all 入口。'
    },
    {
      key: 'column-reset',
      label: '列配置重置',
      kind: 'controlled',
      controlValue: 'columns',
      description: '覆盖列显示试错后的恢复默认列配置，并同步远程请求载荷。'
    },
    {
      key: 'column-order',
      label: '列顺序偏好',
      kind: 'controlled',
      controlValue: 'columnOrder',
      description: '覆盖后台列表常见的列显示顺序调整、默认顺序回退和远程列偏好保存。'
    },
    {
      key: 'resizable-columns',
      label: '列宽偏好',
      kind: 'controlled',
      controlValue: 'resizable',
      description: '覆盖后台数据表常见的拖拽列宽调整、受控列宽偏好、远程保存载荷和表头交互反馈。'
    },
    {
      key: 'view-preference',
      label: '视图偏好保存',
      kind: 'controlled',
      controlValue: 'viewPreference',
      description: '把列顺序、列宽、密度和筛选合并成可持久化的个人表格视图偏好。'
    },
    {
      key: 'virtualized-rows',
      label: '千行性能',
      kind: 'virtual',
      controlValue: 'virtualized',
      description: '覆盖千行数据、固定高度滚动和视口附近行渲染的性能边界。'
    },
    {
      key: 'bulk-selection',
      label: '批量选择',
      kind: 'multi',
      controlValue: 'bulk',
      description: '验证 selectable 选中摘要、批量操作和清空选择。'
    },
    {
      key: 'release-queue',
      label: '发布队列',
      kind: 'basic',
      controlValue: 'queue',
      description: '覆盖列设置、density、page、page-size 分页、summary 汇总和常规发布队列。'
    },
    {
      key: 'mobile-density',
      label: '移动密度',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏数据页中分页、密度和列设置不会挤压主体内容。'
    },
    {
      key: 'keyboard-review',
      label: '键盘巡航',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '说明 Tab、方向键、Space 和 Enter 在表格控件、选择列和分页中的键盘路径。'
    }
  ],
  dateRangePicker: [
    {
      key: 'sprint-range',
      label: '常规范围',
      kind: 'basic',
      controlValue: 'sprint',
      description: '覆盖 placeholder、locale、separator 与 model-value，展示起止日期选择和输入框回显。'
    },
    {
      key: 'shortcut-range',
      label: '快捷范围',
      kind: 'controlled',
      controlValue: 'shortcut',
      description: '覆盖 shortcuts 预设快捷项、带时间窗口的发布冻结范围和受控范围值。'
    },
    {
      key: 'partial-range',
      label: '未完成范围',
      kind: 'empty',
      controlValue: 'partial',
      description: '展示只选择开始日期时的草稿状态、结束日期提示和未完成范围说明。'
    },
    {
      key: 'disabled-range',
      label: '禁用日期',
      kind: 'disabled',
      controlValue: 'disabledDate',
      description: '展示 disabledDate 纯函数禁用过去日期或不可预约日期的范围选择策略。'
    },
    {
      key: 'release-conflict',
      label: '发布冲突',
      kind: 'error',
      controlValue: 'freeze',
      description: '展示发布冻结窗口与 QA 交接冲突时的错误文案。'
    },
    {
      key: 'form-validation-range',
      label: '表单校验',
      kind: 'composition',
      controlValue: 'validation',
      description: '把完整范围校验、帮助文本、错误文本和 visibleChange 放进可复现的表单链路。'
    },
    {
      key: 'archive-range',
      label: '只读归档',
      kind: 'disabled',
      controlValue: 'archive',
      description: '展示归档范围禁用后仍然可读的回填状态。'
    },
    {
      key: 'mobile-range',
      label: '移动范围',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下范围输入、分隔符和快捷项说明保持可读。'
    },
    {
      key: 'keyboard-range',
      label: '键盘范围',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Enter / Space 打开日历，方向键移动日期，PageUp / PageDown 切换月份。'
    }
  ],
  drawer: [
    {
      key: 'side-settings',
      label: '侧栏配置',
      kind: 'basic',
      controlValue: 'settings',
      description: '展示右侧抽屉承载次级配置。'
    },
    {
      key: 'detail-panel',
      label: '详情页',
      kind: 'composition',
      controlValue: 'detail',
      description: '展示列表旁边的详情抽屉和上下文说明。'
    },
    {
      key: 'mobile-navigation',
      label: '移动导航',
      kind: 'responsive',
      controlValue: 'mobileNav',
      description: '窄屏导航使用左侧抽屉承载，而不堆到首屏内容上方。'
    },
    {
      key: 'keyboard-dismiss',
      label: '键盘关闭',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Escape 关闭抽屉、closeOnOverlay 关闭策略、显式关闭按钮可聚焦，并在关闭后回到触发入口。'
    },
    {
      key: 'locked-drawer',
      label: '锁定抽屉',
      kind: 'disabled',
      controlValue: 'locked',
      description: '危险配置或只读审核时禁用遮罩关闭，并用明确文案说明当前抽屉不可直接提交。'
    }
  ],
  dropdown: [
    {
      key: 'action-menu',
      label: '动作菜单',
      kind: 'basic',
      controlValue: 'actions',
      description: '表格行、工具栏或卡片角落里的常规动作菜单，菜单项由文档运行器注入。'
    },
    {
      key: 'placement-end',
      label: '右侧对齐',
      kind: 'responsive',
      controlValue: 'placement',
      description: '验证右侧对齐菜单在窄表格、卡片右上角和工具栏末端不会溢出。'
    },
    {
      key: 'disabled-danger',
      label: '禁用危险项',
      kind: 'error',
      controlValue: 'danger',
      description: '保留危险操作的可见性，但在前置条件未满足时禁用并说明阻断原因。'
    },
    {
      key: 'hover-menu',
      label: '悬浮触发',
      kind: 'layout',
      controlValue: 'hover',
      description: '用于紧凑工具栏或状态标签旁的轻量菜单，验证 hover 触发与 top-start 定位。'
    },
    {
      key: 'persistent-menu',
      label: '不自动关闭',
      kind: 'controlled',
      controlValue: 'persistent',
      description: '适合多步选择或连续操作，hide-on-click 关闭后选择菜单项仍保持展开以减少重复打开。'
    },
    {
      key: 'disabled-trigger',
      label: '禁用触发',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '整组操作不可用时禁用触发器，并阻止鼠标、键盘和受控外的打开行为。'
    },
    {
      key: 'keyboard-menu',
      label: '键盘菜单',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '覆盖 Enter、Space、ArrowUp、ArrowDown、Home、End 和 Escape 的菜单路径。'
    }
  ],
  popconfirm: [
    {
      key: 'archive-confirm',
      label: '归档确认',
      kind: 'basic',
      controlValue: 'archive',
      description: '低风险操作用轻量确认保留上下文，确认后仍能恢复。'
    },
    {
      key: 'delete-danger',
      label: '危险删除',
      kind: 'error',
      controlValue: 'danger',
      description: '危险操作使用明确标题、不可逆说明和强确认文案，避免误操作。'
    },
    {
      key: 'cancel-review',
      label: '取消回退',
      kind: 'controlled',
      controlValue: 'cancel',
      description: '验证取消路径、关闭状态和回到当前任务流的文案。'
    },
    {
      key: 'mobile-confirm',
      label: '移动确认',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下标题、说明和按钮组仍然短小可读。'
    },
    {
      key: 'keyboard-confirm',
      label: '键盘确认',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 到达取消和确认按钮，Enter 激活当前聚焦动作。'
    }
  ],
  message: [
    {
      key: 'save-success',
      label: '保存成功',
      kind: 'basic',
      controlValue: 'success',
      description: '操作完成后用 status 语义提供短反馈，不打断当前任务。'
    },
    {
      key: 'danger-alert',
      label: '错误警报',
      kind: 'error',
      controlValue: 'danger',
      description: '失败或阻断反馈使用 alert 语义、可关闭按钮和明确错误标题。'
    },
    {
      key: 'persistent-review',
      label: '持续提示',
      kind: 'controlled',
      controlValue: 'persistent',
      description: '需要人工处理的提示保持可见，并提供清晰关闭名称。'
    },
    {
      key: 'mobile-message',
      label: '移动提示',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下标题、正文和关闭按钮不会挤压主要反馈。'
    },
    {
      key: 'keyboard-close',
      label: '键盘关闭',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 能聚焦关闭按钮，Enter 或 Space 可以关闭提示。'
    }
  ],
  messageBox: [
    {
      key: 'confirm-publish',
      label: '发布确认',
      kind: 'basic',
      controlValue: 'confirm',
      description: '用于中风险操作的双按钮确认，Promise resolve 为 confirm。'
    },
    {
      key: 'danger-delete',
      label: '危险删除',
      kind: 'error',
      controlValue: 'danger',
      description: '危险操作使用 alertdialog、危险语义和不可逆说明。'
    },
    {
      key: 'prompt-branch',
      label: '输入确认',
      kind: 'controlled',
      controlValue: 'prompt',
      description: '输入确认支持 promptValue、校验错误和确认后返回 value。'
    },
    {
      key: 'async-confirm',
      label: '异步确认',
      kind: 'loading',
      controlValue: 'async',
      description: 'onConfirm 返回 Promise 时确认按钮进入 loading 并延迟关闭。'
    },
    {
      key: 'mobile-dialog',
      label: '移动弹窗',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下标题、正文、输入框和按钮组保持可读可点。'
    },
    {
      key: 'keyboard-dialog',
      label: '键盘路径',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证打开后焦点进入弹窗、Tab 循环、Escape 关闭和关闭后焦点恢复。'
    }
  ],
  notification: [
    {
      key: 'publish-notification',
      label: '发布通知',
      kind: 'basic',
      controlValue: 'success',
      description: '用于异步任务完成后的长反馈，包含标题、正文和可关闭按钮。'
    },
    {
      key: 'danger-notification',
      label: '失败通知',
      kind: 'error',
      controlValue: 'danger',
      description: '失败通知使用 alert 语义和危险色，正文说明下一步处理动作。'
    },
    {
      key: 'persistent-notification',
      label: '持续通知',
      kind: 'controlled',
      controlValue: 'persistent',
      description: '需要人工处理或记录的通知使用 duration 0，并由用户手动关闭。'
    },
    {
      key: 'placement-notification',
      label: '角落位置',
      kind: 'layout',
      controlValue: 'placement',
      description: '命令式通知支持四角 placement，避免遮挡当前页面关键操作。'
    },
    {
      key: 'mobile-notification',
      label: '移动通知',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下通知宽度受视口限制，关闭按钮保持稳定尺寸。'
    },
    {
      key: 'keyboard-notification',
      label: '键盘关闭',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '关闭按钮是原生 button，Tab 聚焦后 Enter 或 Space 可关闭通知。'
    }
  ],
  qrCode: [
    {
      key: 'docs-link',
      label: '文档链接',
      kind: 'basic',
      controlValue: 'link',
      description: '把组件文档链接转成 SVG 二维码，适合下载、分享和线下物料。'
    },
    {
      key: 'branded-code',
      label: '品牌中心',
      kind: 'composition',
      controlValue: 'brand',
      description: '高纠错等级配合中心 logo 和保护底色，验证品牌二维码仍然可读。'
    },
    {
      key: 'expired-ticket',
      label: '过期票据',
      kind: 'controlled',
      controlValue: 'expired',
      description: '票据、登录和支付二维码过期后展示 alert 语义和刷新入口。'
    },
    {
      key: 'loading-code',
      label: '生成中',
      kind: 'loading',
      controlValue: 'loading',
      description: '远程生成或刷新二维码时保留区域尺寸，并通过 status 语义说明状态。'
    },
    {
      key: 'mobile-code',
      label: '移动展示',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下二维码、说明文本和下载按钮不会横向溢出。'
    },
    {
      key: 'keyboard-actions',
      label: '键盘操作',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证下载按钮和过期刷新按钮可以通过 Tab 聚焦，并用 Enter 或 Space 触发。'
    }
  ],
  result: [
    {
      key: 'publish-success',
      label: '发布成功',
      kind: 'basic',
      controlValue: 'success',
      description: '发布、提交或保存完成后提供清晰下一步操作。'
    },
    {
      key: 'not-found',
      label: '页面未找到',
      kind: 'error',
      controlValue: 'notFound',
      description: '404 状态页说明资源不存在，并提供返回或搜索入口。'
    },
    {
      key: 'server-error',
      label: '服务异常',
      kind: 'controlled',
      controlValue: 'server',
      description: '500 状态页需要重试入口、回退路径和明确可访问名称。'
    },
    {
      key: 'mobile-result',
      label: '移动结果页',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下图标、标题、说明和按钮组仍保持可读。'
    },
    {
      key: 'keyboard-actions',
      label: '键盘操作区',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 能依次进入主要和次要操作，操作文案足够清晰。'
    }
  ],
  statistic: [
    {
      key: 'metric-statistic',
      label: '核心指标',
      kind: 'basic',
      controlValue: 'metric',
      description: '展示概览页主指标，标题、数值和趋势单位共同表达业务含义。'
    },
    {
      key: 'unit-statistic',
      label: '单位精度',
      kind: 'multi',
      controlValue: 'unit',
      description: '覆盖金额、单位、千分位和小数精度，避免业务数值被误读。'
    },
    {
      key: 'card-statistic',
      label: '卡片指标',
      kind: 'composition',
      controlValue: 'card',
      description: '把 Statistic 放入 Card，模拟仪表盘指标组和详情摘要。'
    },
    {
      key: 'countdown-statistic',
      label: '倒计时指标',
      kind: 'controlled',
      controlValue: 'countdown',
      description: '展示活动、订单或任务截止时间，验证 timer 语义、格式和到期路径。'
    },
    {
      key: 'loading-statistic',
      label: '加载指标',
      kind: 'loading',
      controlValue: 'loading',
      description: '远程指标刷新时保留区域尺寸，通过 busy 和 status 语义反馈加载状态。'
    },
    {
      key: 'mobile-statistic',
      label: '移动指标',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下标题、数值和单位仍然短小可读，不挤压卡片布局。'
    },
    {
      key: 'keyboard-statistic',
      label: '读屏指标',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '使用清晰 aria-label 和可读单位，帮助读屏用户理解动态数值。'
    }
  ],
  empty: [
    {
      key: 'first-create',
      label: '首次创建',
      kind: 'basic',
      controlValue: 'create',
      description: '首次进入列表时说明价值，并给出创建入口。'
    },
    {
      key: 'search-empty',
      label: '搜索无结果',
      kind: 'empty',
      controlValue: 'search',
      description: '筛选或搜索无结果时提供清除条件的回退操作。'
    },
    {
      key: 'permission-empty',
      label: '权限空态',
      kind: 'error',
      controlValue: 'permission',
      description: '权限不足时解释原因，并提供申请访问入口。'
    },
    {
      key: 'mobile-empty',
      label: '移动空态',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下图形、说明和操作按钮不会挤压。'
    },
    {
      key: 'keyboard-empty-action',
      label: '键盘操作',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 首先到达空态主操作，动作文案足够明确。'
    }
  ],
  skeleton: [
    {
      key: 'detail-card-loading',
      label: '详情卡片加载',
      kind: 'basic',
      controlValue: 'detail',
      description: '展示头像、标题、段落和预览区共同占位，避免真实内容出现时跳动。'
    },
    {
      key: 'release-list-loading',
      label: '列表加载',
      kind: 'multi',
      controlValue: 'list',
      description: '用多组头像和文本骨架模拟远程列表加载，控制占位数量避免性能浪费。'
    },
    {
      key: 'fast-response-throttle',
      label: '快速返回',
      kind: 'loading',
      controlValue: 'fast',
      description: '说明接口快速返回时要延迟或合并骨架显示，减少一闪而过的视觉抖动。'
    },
    {
      key: 'mobile-skeleton',
      label: '移动骨架',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下卡片、头像和文本占位短小稳定，不占用过多首屏空间。'
    },
    {
      key: 'screen-reader-status',
      label: '读屏状态',
      kind: 'keyboard',
      controlValue: 'screenReader',
      description: '把多个装饰骨架包在单个 status 容器中，避免读屏逐行播报无意义占位。'
    }
  ],
  form: [
    {
      key: 'basic-submit',
      label: '基础提交',
      kind: 'basic',
      controlValue: 'save',
      description: '覆盖 model 数据对象、原生 form submit、字段绑定和成功反馈。'
    },
    {
      key: 'validation-errors',
      label: '校验错误',
      kind: 'error',
      controlValue: 'errors',
      description: '覆盖 rules 校验规则、字段错误、摘要跳转和 assertive alert。'
    },
    {
      key: 'summary-scroll',
      label: '错误摘要',
      kind: 'summary',
      controlValue: 'summary',
      description: '展示错误摘要、字段级错误、aria-describedby 和 scroll-to-error 的长表单验收链路。'
    },
    {
      key: 'readonly-review',
      label: '只读审核',
      kind: 'disabled',
      controlValue: 'review',
      description: '展示审核态下表单值可读但不可编辑的策略。'
    },
    {
      key: 'mobile-form',
      label: '移动表单',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下 label-width 标签宽度、输入控件和提交动作保持可读可操作。'
    },
    {
      key: 'keyboard-submit',
      label: '键盘提交',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 顺序经过字段和错误摘要，Enter 可触发表单提交。'
    }
  ],
  input: [
    {
      key: 'basic-input',
      label: '基础输入',
      kind: 'basic',
      controlValue: 'basic',
      description: '展示常规 label、placeholder 和 modelValue，适合表单里的单行文本输入。'
    },
    {
      key: 'described-input',
      label: '帮助说明',
      kind: 'controlled',
      controlValue: 'help',
      description: '通过 aria-describedby 把输入框和帮助说明关联，适合命名规则、格式提示和辅助说明。'
    },
    {
      key: 'search-input',
      label: '搜索输入',
      kind: 'search',
      controlValue: 'search',
      description: '搜索场景用短标签和明确 placeholder 说明可搜索范围，避免把业务提示藏在外部文案里。'
    },
    {
      key: 'clearable-count-input',
      label: '可清空计数',
      kind: 'copy',
      controlValue: 'clearable',
      description: '覆盖 clearable、字数计数、maxlength 和前缀文本，适合筛选栏和设置页短文本输入。'
    },
    {
      key: 'density-input',
      label: '尺寸密度',
      kind: 'layout',
      controlValue: 'density',
      description: '展示 sm、md、lg 三种输入高度，尺寸应跟随表单密度，而不是依赖局部 CSS 覆盖。'
    },
    {
      key: 'validation-input',
      label: '校验错误',
      kind: 'error',
      controlValue: 'validation',
      description: '覆盖 required 校验、invalid 状态和 aria-describedby 关联。'
    },
    {
      key: 'disabled-input',
      label: '禁用复核',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '审核或只读状态下保留字段值，但禁止用户继续修改。'
    },
    {
      key: 'mobile-input',
      label: '移动短标签',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下短标签、占位和已有值不会挤压输入框。'
    },
    {
      key: 'keyboard-input',
      label: '键盘录入',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 能进入原生 input，键入内容通过 update:modelValue 同步。'
    }
  ],
  inputOtp: [
    {
      key: 'basic-input-otp',
      label: '基础验证码',
      kind: 'basic',
      controlValue: 'basic',
      description: '展示 6 位验证码的分格录入、自动推进和完整值回传。'
    },
    {
      key: 'paste-input-otp',
      label: '粘贴填充',
      kind: 'controlled',
      controlValue: 'paste',
      description: '粘贴短信验证码时过滤空格和分隔符，并一次性填满多个输入格。'
    },
    {
      key: 'password-input-otp',
      label: '隐藏验证码',
      kind: 'copy',
      controlValue: 'password',
      description: '高风险二次验证可以用 password 输入格隐藏验证码字符。'
    },
    {
      key: 'form-input-otp',
      label: '表单错误',
      kind: 'error',
      controlValue: 'form',
      description: '验证码长度不足时与 YFormItem 的 invalid 和 aria-describedby 保持一致。'
    },
    {
      key: 'mobile-input-otp',
      label: '移动验证码',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下输入格会换行，保证 4 位或 6 位验证码仍可点击。'
    },
    {
      key: 'keyboard-input-otp',
      label: '键盘路径',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: 'Tab 进入首格，方向键移动焦点，Backspace 删除并回退。'
    }
  ],
  inputTag: [
    {
      key: 'basic-input-tag',
      label: '基础标签',
      kind: 'basic',
      controlValue: 'basic',
      description: '展示已有标签、输入草稿和 Enter 创建标签，适合技能、关键词和分类输入。'
    },
    {
      key: 'duplicate-input-tag',
      label: '重复校验',
      kind: 'error',
      controlValue: 'duplicate',
      description: '默认禁止重复标签，提交已有值时触发 invalid 并保留输入焦点。'
    },
    {
      key: 'max-input-tag',
      label: '数量上限',
      kind: 'error',
      controlValue: 'max',
      description: '达到 max 后继续提交会返回明确的上限错误，适合筛选标签和发布标签控制。'
    },
    {
      key: 'form-input-tag',
      label: '表单校验',
      kind: 'controlled',
      controlValue: 'form',
      description: '数组字段通过 YFormItem 的 invalid 和 aria-describedby 进入统一表单校验链路。'
    },
    {
      key: 'mobile-input-tag',
      label: '移动换行',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下标签自然换行，输入区域保持可点可读。'
    },
    {
      key: 'keyboard-input-tag',
      label: '键盘标签',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: 'Tab 进入输入框，Enter 创建标签，空输入 Backspace 删除最后一个标签。'
    }
  ],
  checkbox: [
    {
      key: 'basic-checkbox',
      label: '基础确认',
      kind: 'basic',
      controlValue: 'basic',
      description: '展示单个 checkbox 作为提交前的状态标记，适合和表单按钮一起使用。'
    },
    {
      key: 'checklist-checkbox',
      label: '清单组合',
      kind: 'multi',
      controlValue: 'checklist',
      description: '使用 YCheckboxGroup 管理数组 v-model、禁用项和选择数量边界。'
    },
    {
      key: 'limited-checkbox-group',
      label: '数量限制组',
      kind: 'controlled',
      controlValue: 'limited-group',
      description: '覆盖 min / max 限制，避免用户少选或多选关键发布项。'
    },
    {
      key: 'indeterminate-checkbox',
      label: '半选状态',
      kind: 'controlled',
      controlValue: 'indeterminate',
      description: '父级复选框用 mixed 状态表达部分子项已选，常用于全选和树形权限。'
    },
    {
      key: 'form-validation-checkbox-group',
      label: '表单校验组',
      kind: 'error',
      controlValue: 'form-validation',
      description: '把 CheckboxGroup 放进 FormItem，展示 grouped checkbox 的错误、invalid 和 aria-describedby。'
    },
    {
      key: 'required-checkbox',
      label: '必选确认',
      kind: 'error',
      controlValue: 'required',
      description: '覆盖发布前必须勾选的确认项，并用错误提示解释阻断原因。'
    },
    {
      key: 'disabled-checkbox',
      label: '锁定项',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '展示由策略或权限锁定的复选框，不允许用户修改当前值。'
    },
    {
      key: 'mobile-checkbox',
      label: '移动确认',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下 label、description 和触控区域保持可读可点。'
    },
    {
      key: 'keyboard-checkbox',
      label: '键盘切换',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 聚焦原生 checkbox，Space 可以切换状态。'
    }
  ],
  radioGroup: [
    {
      key: 'package-radio-group',
      label: '包选择',
      kind: 'basic',
      controlValue: 'package',
      description: '覆盖 options 单选项列表，展示互斥选项组，用 fieldset 和 legend 维持表单语义。'
    },
    {
      key: 'controlled-radio-group',
      label: '受控回填',
      kind: 'controlled',
      controlValue: 'controlled',
      description: '展示编辑页回填已有单选值，并保留用户可重新选择的路径。'
    },
    {
      key: 'required-radio-group',
      label: '必选单选',
      kind: 'error',
      controlValue: 'required',
      description: '覆盖表单提交前必须选择一个选项的阻断提示。'
    },
    {
      key: 'form-validation-radio-group',
      label: '表单校验组',
      kind: 'error',
      controlValue: 'form-validation',
      description: '把 RadioGroup 放进 FormItem，展示 grouped radio 的错误、invalid 和 aria-describedby。'
    },
    {
      key: 'disabled-radio-option',
      label: '禁用选项',
      kind: 'disabled',
      controlValue: 'disabledOption',
      description: '展示部分不可选项的禁用状态和审核说明。'
    },
    {
      key: 'mobile-radio-group',
      label: '移动单选',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下短标签和换行后的选项仍清晰可点。'
    },
    {
      key: 'keyboard-radio-group',
      label: '键盘选择',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 进入 radio group，方向键可在选项间移动。'
    }
  ],
  segmented: [
    {
      key: 'view-mode-segmented',
      label: '视图模式',
      kind: 'basic',
      controlValue: 'view',
      description: '覆盖 string options、v-model 和 change 事件，适合列表/看板/日历视图切换。'
    },
    {
      key: 'block-period-segmented',
      label: '等宽周期',
      kind: 'controlled',
      controlValue: 'period',
      description: '展示 block 宽度和数值回填，适合报表周期、统计范围和密度切换。'
    },
    {
      key: 'vertical-segmented',
      label: '纵向分段',
      kind: 'responsive',
      controlValue: 'vertical',
      description: '验证 vertical 方向下说明文本、长标签和窄容器展示。'
    },
    {
      key: 'disabled-segmented',
      label: '禁用选项',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '展示单项禁用和整体禁用的状态差异。'
    },
    {
      key: 'keyboard-segmented',
      label: '键盘单选',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '基于原生 radio group，Tab 进入后可用方向键切换同 name 选项。'
    }
  ],
  switch: [
    {
      key: 'instant-switch',
      label: '即时设置',
      kind: 'basic',
      controlValue: 'instant',
      description: '展示开关适合即时生效的二元设置，而不是等待表单提交。'
    },
    {
      key: 'status-copy-switch',
      label: '状态文案',
      kind: 'controlled',
      controlValue: 'status',
      description: '用状态文案解释开关当前值，避免用户只看到 on/off 而不知道影响范围。'
    },
    {
      key: 'form-validation-switch',
      label: '表单校验开关',
      kind: 'error',
      controlValue: 'form-validation',
      description: '把 Switch 放进 FormItem，展示 role switch 的错误、invalid 和 aria-describedby。'
    },
    {
      key: 'loading-switch',
      label: '加载开关',
      kind: 'loading',
      controlValue: 'loading',
      description: '异步保存中展示加载状态，并阻止重复切换。'
    },
    {
      key: 'risk-switch',
      label: '风险开关',
      kind: 'error',
      controlValue: 'risk',
      description: '高风险开关应配合明确说明，避免用户误触造成不可逆影响。'
    },
    {
      key: 'disabled-switch',
      label: '锁定开关',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '展示由组织策略控制的开关，保留状态但禁止本页修改。'
    },
    {
      key: 'mobile-switch',
      label: '移动开关',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下开关、标签和状态说明仍保持紧凑可读。'
    },
    {
      key: 'keyboard-switch',
      label: '键盘开关',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 role switch 的 aria-checked 和 Space/Enter 键盘切换路径。'
    }
  ],
  tabs: [
    {
      key: 'context-tabs',
      label: '上下文切换',
      kind: 'basic',
      controlValue: 'overview',
      description: '同一路由下切换概览、用法和 API，避免用 Tabs 承载跨页面导航。'
    },
    {
      key: 'api-tabs',
      label: 'API 面板',
      kind: 'controlled',
      controlValue: 'api',
      description: '受控值直接定位到 API 面板，适合从右侧目录或外部状态同步。'
    },
    {
      key: 'blocked-tabs',
      label: '阻断说明',
      kind: 'error',
      controlValue: 'error',
      description: '当前标签页展示阻断原因，让审核失败、缺少内容或权限问题保持在原上下文。'
    },
    {
      key: 'mobile-tabs',
      label: '移动标签',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用短标签和可换行 tablist，避免标签挤压正文。'
    },
    {
      key: 'keyboard-tabs',
      label: '键盘切换',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab、方向键和 Enter/Space 的键盘路径文案与当前面板保持一致。'
    }
  ],
  steps: [
    {
      key: 'release-steps',
      label: '发布流程',
      kind: 'basic',
      controlValue: 'release',
      description: '展示安装、引入、验证和发布的 selectable 线性进度，让任务状态一眼可读。'
    },
    {
      key: 'error-steps',
      label: '错误步骤',
      kind: 'error',
      controlValue: 'error',
      description: '把失败状态放进步骤数据，而不是只用外部提示描述错误。'
    },
    {
      key: 'vertical-steps',
      label: '纵向流程',
      kind: 'layout',
      controlValue: 'vertical',
      description: '长文案、多审批人或窄列场景使用纵向布局，避免横向步骤拥挤。'
    },
    {
      key: 'mobile-steps',
      label: '移动流程',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动端强制纵向步骤，让标题、说明和当前状态保持可读。'
    },
    {
      key: 'keyboard-steps',
      label: '键盘步骤',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '可点击步骤需要清晰焦点顺序和 aria-current，键盘也能完成流程定位。'
    }
  ],
  tour: [
    {
      key: 'basic-tour',
      label: '基础引导',
      kind: 'basic',
      controlValue: 'basic',
      description: '用 open、steps 和 current 组成最小产品引导，解释关键入口。'
    },
    {
      key: 'target-tour',
      label: '目标高亮',
      kind: 'composition',
      controlValue: 'target',
      description: 'steps 中的 target 指向页面元素，让功能发现和上下文说明绑定在一起。'
    },
    {
      key: 'controlled-tour',
      label: '受控步骤',
      kind: 'controlled',
      controlValue: 'controlled',
      description: '使用 current 和 update:current 管理进度，适合和埋点、路由状态同步。'
    },
    {
      key: 'finish-tour',
      label: '完成关闭',
      kind: 'copy',
      controlValue: 'finish',
      description: '最后一步触发 finish 并请求关闭，用 finishText 明确完成动作。'
    },
    {
      key: 'empty-tour',
      label: '空步骤',
      kind: 'empty',
      controlValue: 'empty',
      description: '当 steps 为空时展示安全 fallback，不产生无意义高亮。'
    },
    {
      key: 'mobile-tour',
      label: '移动引导',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '移动场景保持步骤文案短、目标区域清晰，避免遮挡主要任务。'
    },
    {
      key: 'keyboard-tour',
      label: '键盘关闭',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '对话框语义、焦点锁定、closeOnEscape 和 skipText 让键盘路径完整。'
    }
  ],
  modal: [
    {
      key: 'confirm-flow',
      label: '确认流程',
      kind: 'basic',
      controlValue: 'publish',
      description: '展示发布、删除或保存前的确认内容。'
    },
    {
      key: 'danger-action',
      label: '危险操作',
      kind: 'error',
      controlValue: 'danger',
      description: '展示高风险操作的 closeOnOverlay 关闭策略和确认文案。'
    },
    {
      key: 'form-review',
      label: '表单复核',
      kind: 'controlled',
      controlValue: 'review',
      description: '展示发布前复核字段和确认内容的弹窗状态。'
    },
    {
      key: 'mobile-modal',
      label: '移动弹窗',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏弹窗标题、正文和按钮区保持可读可操作。'
    },
    {
      key: 'keyboard-focus',
      label: '键盘焦点',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 焦点保持在弹窗内，Escape 关闭，并在关闭后回到触发入口。'
    }
  ],
  popover: [
    {
      key: 'context-note',
      label: '上下文说明',
      kind: 'basic',
      controlValue: 'note',
      description: '展示轻量解释或表格行详情。'
    },
    {
      key: 'confirm-note',
      label: '确认提示',
      kind: 'controlled',
      controlValue: 'confirm',
      description: '覆盖需要二次确认的轻量浮层内容。'
    },
    {
      key: 'empty-guide',
      label: '空状态引导',
      kind: 'empty',
      controlValue: 'empty',
      description: '展示空状态下如何用 popover 引导下一步动作。'
    },
    {
      key: 'mobile-avoidance',
      label: '移动避让',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '验证窄屏下弹层使用底部方向与短文案，避免遮挡触发器和主要内容。'
    },
    {
      key: 'hover-placement',
      label: '悬浮方位',
      kind: 'layout',
      controlValue: 'placement',
      description: '验证 hover/focus 触发、right-start 方位和延迟展示的说明浮层。'
    },
    {
      key: 'disabled-popover',
      label: '禁用触发',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '验证禁用状态不会打开弹层，也不会暴露错误的 aria 控制关系。'
    },
    {
      key: 'keyboard-popover',
      label: '键盘触发',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Enter / Space 打开弹层，Escape 关闭并保持焦点在触发器上。'
    }
  ],
  searchForm: [
    {
      key: 'basic-filter',
      label: '基础筛选',
      kind: 'basic',
      controlValue: 'basic',
      description: '展示 modelValue、fields、关键词、状态、包类型、日期和日期范围筛选。'
    },
    {
      key: 'advanced-fields',
      label: '高级条件',
      kind: 'controlled',
      controlValue: 'advanced',
      description: '覆盖 collapsedCount、collapsible、defaultCollapsed、日期 preset、筛选数量和重置动作。'
    },
    {
      key: 'toolbar-filter',
      label: '紧凑表头',
      kind: 'responsive',
      controlValue: 'toolbar',
      description: '展示数据页头部的紧凑筛选条。'
    },
    {
      key: 'blocked-filter',
      label: '禁用筛选',
      kind: 'disabled',
      controlValue: 'blocked',
      description: '远程数据刷新或权限不足时禁用筛选动作，并保留当前筛选说明。'
    },
    {
      key: 'keyboard-search-form',
      label: '键盘筛选',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '键盘用户按字段、提交、重置的表单顺序完成筛选。'
    }
  ],
  table: [
    {
      key: 'sort-filter',
      label: '排序筛选',
      kind: 'basic',
      controlValue: 'overview',
      description: '覆盖 caption、default-filters、可排序表头、筛选控件和 `aria-sort`。'
    },
    {
      key: 'selection-summary',
      label: '选择摘要',
      kind: 'multi',
      controlValue: 'selection',
      description: '覆盖 selectable、selected-row-keys、default-selected-row-keys，展示行选择、全选和底部摘要。'
    },
    {
      key: 'expandable-rows',
      label: '展开详情',
      kind: 'composition',
      controlValue: 'expand',
      description: '覆盖 expandable、expanded-row-keys、expand slot 和 expandChange 事件。'
    },
    {
      key: 'virtual-table',
      label: '虚拟滚动',
      kind: 'virtual',
      controlValue: 'virtual',
      description: '覆盖 virtualized、virtual-height、virtual-row-height、virtual-overscan 的大数据表格窗口。'
    },
    {
      key: 'column-widths',
      label: '列宽偏好',
      kind: 'layout',
      controlValue: 'columns',
      description: '覆盖 resizable、min-column-width、column-widths、default-column-widths 的列宽偏好恢复。'
    },
    {
      key: 'sticky-scroll',
      label: '固定滚动',
      kind: 'responsive',
      controlValue: 'scroll',
      description: '覆盖固定表头、横向滚动和表格语义稳定性。'
    },
    {
      key: 'empty-loading',
      label: '加载状态',
      kind: 'loading',
      controlValue: 'loading',
      description: '验证 loading、empty 和 summary status。'
    },
    {
      key: 'empty-filter',
      label: '空筛选结果',
      kind: 'empty',
      controlValue: 'empty',
      description: '展示筛选后没有匹配行时的空状态文案和稳定表格外框。'
    },
    {
      key: 'remote-controlled',
      label: '远程受控',
      kind: 'remote',
      controlValue: 'remote',
      description: '展示 manual 筛选模式、默认排序和服务端请求参数流。'
    },
    {
      key: 'keyboard-table',
      label: '键盘巡航',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 进入表格选择控件，Space 切换行选择，Enter 激活排序表头。'
    }
  ],
  tooltip: [
    {
      key: 'hover-focus',
      label: 'Hover 与 Focus',
      kind: 'basic',
      controlValue: 'action',
      description: '触发元素通过 hover 和 focus 都能显示说明。'
    },
    {
      key: 'keyboard-tooltip',
      label: '键盘提示',
      kind: 'keyboard',
      controlValue: 'shortcut',
      description: '键盘用户聚焦触发按钮后可以获得同等提示内容，并保留快捷键说明。'
    },
    {
      key: 'placement',
      label: '方位切换',
      kind: 'responsive',
      controlValue: 'shortcut',
      description: '覆盖 top / bottom / left / right 与边界定位。'
    },
    {
      key: 'click-tooltip',
      label: '点击触发',
      kind: 'controlled',
      controlValue: 'click',
      description: '覆盖点击触发和受控 open，同步验证状态事件。'
    },
    {
      key: 'light-tooltip',
      label: '浅色主题',
      kind: 'layout',
      controlValue: 'light',
      description: '覆盖 theme 浅色主题和右侧定位，适合密集工具栏或设置项说明。'
    },
    {
      key: 'disabled-trigger',
      label: '禁用触发',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '验证禁用或不可聚焦内容的说明策略。'
    },
    {
      key: 'validation-tooltip',
      label: '错误说明',
      kind: 'error',
      controlValue: 'error',
      description: '校验失败或发布阻断时，用短说明补充错误原因，同时保留可聚焦触发器。'
    }
  ],
  transfer: [
    {
      key: 'move-items',
      label: '左右移动',
      kind: 'basic',
      controlValue: 'permissions',
      description: '展示 options 候选项、多选、移动到目标列表和移回源列表。'
    },
    {
      key: 'filter-items',
      label: '列表过滤',
      kind: 'controlled',
      controlValue: 'search',
      description: '覆盖源/目标列表搜索与过滤结果。'
    },
    {
      key: 'empty-target',
      label: '空目标',
      kind: 'empty',
      controlValue: 'empty',
      description: '展示还未分配目标权限时的说明。'
    },
    {
      key: 'readonly-review',
      label: '只读审核',
      kind: 'disabled',
      controlValue: 'review',
      description: '验证审核态下权限分配可读但不可修改。'
    },
    {
      key: 'mobile-transfer',
      label: '移动穿梭',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用 titles 短标题和紧凑说明，保证左右列表与移动按钮仍然可读可操作。'
    },
    {
      key: 'keyboard-transfer',
      label: '键盘穿梭',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Tab 能依次到达源列表复选框、移动按钮、目标列表复选框和反向移动按钮。'
    }
  ],
  tree: [
    {
      key: 'expand-select',
      label: '展开与选中',
      kind: 'basic',
      controlValue: 'navigation',
      description: '展示 nodes 数据注入、expanded-keys、default-expanded-keys、selected-key 展开选中和受控状态。'
    },
    {
      key: 'check-cascade',
      label: '级联勾选',
      kind: 'multi',
      controlValue: 'permissions',
      description: '覆盖 checked-keys、default-checked-keys、checkbox、半选和父子级联权限关系。'
    },
    {
      key: 'taxonomy-drag',
      label: '拖拽分类',
      kind: 'composition',
      controlValue: 'taxonomy',
      description: '覆盖 draggable 与 allow-drop 约束，展示分类编辑中的拖拽 affordance 和展开状态。'
    },
    {
      key: 'virtualized-tree',
      label: '大型虚拟树',
      kind: 'virtual',
      controlValue: 'virtualized',
      description: '覆盖 virtualized、virtual-height、virtual-item-height 和 virtual-overscan 的大量节点滚动场景。'
    },
    {
      key: 'lazy-tree',
      label: '异步加载',
      kind: 'remote',
      controlValue: 'lazy',
      description: '覆盖 lazy、load、reloadNode、loadError 和 isLeaf 的远端节点加载与定向刷新场景。'
    },
    {
      key: 'empty-tree',
      label: '空树',
      kind: 'empty',
      controlValue: 'empty',
      description: '过滤或无权限时展示空树状态，并说明没有可访问的组件节点。'
    },
    {
      key: 'mobile-tree',
      label: '移动树',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下使用短标签和较少展开层级，避免树形缩进挤压节点文本。'
    },
    {
      key: 'keyboard-tree',
      label: '键盘树',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证方向键、Home、End、Enter 和 Space 在可见树节点之间的移动与激活路径。'
    }
  ],
  treeSelect: [
    {
      key: 'leaf-select',
      label: '叶子选择',
      kind: 'basic',
      controlValue: 'leaf',
      description: '展示树形数据在 combobox 弹层中选择叶子节点，适合组件、组织和资源目录。'
    },
    {
      key: 'strict-parent',
      label: '任意层级',
      kind: 'controlled',
      controlValue: 'strict',
      description: '开启 checkStrictly 后父节点也可作为值提交，适合部门、分类和空间选择。'
    },
    {
      key: 'multi-scope',
      label: '多选范围',
      kind: 'multi',
      controlValue: 'multiple',
      description: '多选模式保留弹层并以标签展示选中节点，适合权限范围和资源集合。'
    },
    {
      key: 'filter-tree',
      label: '过滤树',
      kind: 'filter',
      controlValue: 'filter',
      description: '可搜索模式按节点标签过滤，并保留命中子节点的父级路径。'
    },
    {
      key: 'disabled-node',
      label: '禁用节点',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '禁用节点保留上下文但不能通过鼠标或键盘提交。'
    },
    {
      key: 'empty-tree-select',
      label: '空结果',
      kind: 'empty',
      controlValue: 'empty',
      description: '搜索无匹配时展示稳定空状态，并保持触发器和搜索框可继续操作。'
    },
    {
      key: 'mobile-tree-select',
      label: '移动选择',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '窄屏下验证标签、搜索框和弹层宽度不会压缩树节点文本。'
    },
    {
      key: 'keyboard-tree-select',
      label: '键盘选择',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '验证 Enter / Space 打开、方向键移动、Enter 选择和 Escape 返回触发器。'
    }
  ],
  upload: [
    {
      key: 'file-list',
      label: '文件列表',
      kind: 'basic',
      controlValue: 'existing',
      description: '展示成功、上传中和失败文件状态。'
    },
    {
      key: 'drag-drop',
      label: '拖拽上传',
      kind: 'composition',
      controlValue: 'assets',
      description: '覆盖拖拽区域和原生文件 input 的关系。'
    },
    {
      key: 'error-retry',
      label: '严格文件规则',
      kind: 'error',
      controlValue: 'rules',
      description: '展示文件类型、数量限制和规则提示。'
    },
    {
      key: 'exceed-limit',
      label: '数量超出',
      kind: 'multi',
      controlValue: 'exceed',
      description: '展示 max-files 限制命中后的队列保留策略和 exceed 事件说明。'
    },
    {
      key: 'reject-type',
      label: '拒绝类型',
      kind: 'error',
      controlValue: 'reject',
      description: '展示 accept 过滤失败后的错误文件、拒绝原因和业务重试提示。'
    },
    {
      key: 'validation-upload',
      label: '表单校验上传',
      kind: 'error',
      controlValue: 'validation',
      description: '展示上传组件放入表单流程时的 invalid、error、aria-describedby 和受控拒绝队列。'
    },
    {
      key: 'request-lifecycle',
      label: '请求生命周期',
      kind: 'remote',
      controlValue: 'request',
      description: '展示 auto-upload、beforeUpload、customRequest、进度回写、取消和失败重试的上传请求链路。'
    },
    {
      key: 'picture-list-actions',
      label: '图片列表操作',
      kind: 'composition',
      controlValue: 'picture',
      description: '展示缩略图列表、预览、下载、排序和清空队列操作。'
    },
    {
      key: 'disabled-upload',
      label: '禁用态',
      kind: 'disabled',
      controlValue: 'disabled',
      description: '验证审核或发布锁定时上传区、文件移除按钮和拖拽区域都不可操作。'
    },
    {
      key: 'mobile-upload',
      label: '移动上传',
      kind: 'responsive',
      controlValue: 'mobile',
      description: '检查窄屏下标题、计数、文件名截断和操作按钮仍然可读可点。'
    },
    {
      key: 'keyboard-upload',
      label: '键盘路径',
      kind: 'keyboard',
      controlValue: 'keyboard',
      description: '检查键盘用户能聚焦 button-label 选择按钮、理解空状态，并通过原生文件选择器继续操作。'
    }
  ]
}

export const liveExampleScenarioByPreset = new Map(
  Object.entries(liveExampleScenarios).map(([preset, scenarios]) => [
    preset as LiveExamplePreset,
    scenarios ?? []
  ])
)

const componentFamilyTitleById = Object.fromEntries(
  componentFamilies.map((family) => [family.id, family.title])
)

function normalizePresetName(value: string) {
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase()
}

function getPrimaryComponentMeta(item: LiveExampleCoverage) {
  const registryItems = components.filter((component) => component.docs === item.docs)

  if (registryItems.length === 0) {
    throw new Error(`Missing component registry metadata for live example "${item.preset}" at ${item.docs}.`)
  }

  const normalizedPreset = normalizePresetName(item.preset)
  const matchedComponent = registryItems.find((component) => {
    const normalizedName = normalizePresetName(component.name.replace(/^Y/, ''))
    const normalizedTitle = normalizePresetName(component.title)

    return normalizedName === normalizedPreset || normalizedTitle === normalizedPreset
  })

  return {
    primary: matchedComponent ?? registryItems[0],
    registryItems
  }
}

function createLiveExampleComponentMeta(item: LiveExampleCoverage): LiveExampleComponentMeta {
  const { primary, registryItems } = getPrimaryComponentMeta(item)

  return {
    title: primary.title,
    docsTitle: registryItems.map((component) => component.title).join(' / '),
    componentName: primary.name,
    componentNames: registryItems.map((component) => component.name),
    packageName: primary.packageName,
    family: primary.family,
    familyTitle: componentFamilyTitleById[primary.family] ?? primary.family,
    status: primary.status,
    docs: primary.docs,
    description: primary.description,
    since: primary.since,
    accessibility: primary.accessibility
  }
}

export const defaultLiveExampleCapabilities: LiveExampleCapability[] = [
  'safe-template',
  'editable-source',
  'responsive-preview',
  'source-copy',
  'repro-bundle',
  'event-log',
  'drafts'
]

export const liveExampleProfiles: LiveExampleProfile[] = liveExampleCoverage.map((item) => {
  const hasVisualProps = visualControlPresetSet.has(item.preset)
  const hasScenarioDepth = scenarioRichPresetSet.has(item.preset)
  const scenarios = liveExampleScenarioByPreset.get(item.preset) ?? []

  return {
    ...item,
    mode: hasVisualProps ? 'guided' : 'source-first',
    component: createLiveExampleComponentMeta(item),
    capabilities: hasVisualProps
      ? [
        ...defaultLiveExampleCapabilities,
        'visual-props',
        ...(hasScenarioDepth ? ['scenario-switching', 'workflow-states'] as const : [])
      ]
      : defaultLiveExampleCapabilities,
    scenarioDepth: hasScenarioDepth ? 'workflow' : 'props',
    scenarios
  }
})

export const liveExampleProfileByDocs = new Map(liveExampleProfiles.map((item) => [item.docs, item]))
export const liveExampleProfileByPreset = new Map(liveExampleProfiles.map((item) => [item.preset, item]))

export function getLiveExampleComponentMeta(preset: LiveExamplePreset) {
  return liveExampleProfileByPreset.get(preset)?.component
}

export function getLiveExampleLabel(preset: LiveExamplePreset) {
  return getLiveExampleComponentMeta(preset)?.title ?? preset
}

export function hasVisualControlPreset(preset: LiveExamplePreset) {
  return visualControlPresetSet.has(preset)
}

export function hasScenarioRichPreset(preset: LiveExamplePreset) {
  return scenarioRichPresetSet.has(preset)
}

export function getLiveExampleScenarios(preset: LiveExamplePreset) {
  return liveExampleScenarioByPreset.get(preset) ?? []
}

export function hasWorkflowScenarios(preset: LiveExamplePreset) {
  return getLiveExampleScenarios(preset).length > 0
}

export function getLiveExampleValidationSummary(preset: LiveExamplePreset): LiveExampleValidationSummary {
  const profile = liveExampleProfiles.find((item) => item.preset === preset)
  const capabilities = profile?.capabilities ?? defaultLiveExampleCapabilities
  const scenarios = getLiveExampleScenarios(preset)
  const scenarioKinds = Array.from(new Set(scenarios.map((scenario) => scenario.kind)))
  const hasCapability = (capability: LiveExampleCapability) => capabilities.includes(capability)
  const hasScenarioKind = (kind: LiveExampleScenarioKind) => scenarioKinds.includes(kind)
  const workflowReady = Boolean(profile?.scenarioDepth === 'workflow' && scenarios.length >= 3)

  return {
    preset,
    modeLabel: workflowReady
      ? 'Guided workflow'
      : hasCapability('visual-props')
        ? 'Guided props'
        : 'Source first',
    capabilityCount: capabilities.length,
    scenarioCount: scenarios.length,
    workflowReady,
    scenarioKinds,
    checks: [
      {
        key: 'safe-template',
        label: '安全模板',
        passed: hasCapability('safe-template'),
        detail: '白名单模板解析与危险属性拦截'
      },
      {
        key: 'editable-source',
        label: '源码编辑',
        passed: hasCapability('editable-source'),
        detail: '示例可直接编辑并重新渲染'
      },
      {
        key: 'responsive-preview',
        label: '响应式预览',
        passed: hasCapability('responsive-preview'),
        detail: '支持桌面、平板和移动预览尺寸'
      },
      {
        key: 'source-copy',
        label: '复制源码',
        passed: hasCapability('source-copy'),
        detail: '支持复制 SFC 或 template 片段'
      },
      {
        key: 'repro-bundle',
        label: '复现包',
        passed: hasCapability('repro-bundle'),
        detail: '支持复制 package、入口、主题、场景和当前源码'
      },
      {
        key: 'event-log',
        label: '事件日志',
        passed: hasCapability('event-log'),
        detail: '预览区事件会进入可清空日志'
      },
      {
        key: 'visual-props',
        label: '可视化属性',
        passed: hasCapability('visual-props'),
        detail: '常用 props 可通过控件调整'
      },
      {
        key: 'scenario-switching',
        label: '场景切换',
        passed: hasCapability('scenario-switching') && scenarios.length > 0,
        detail: `${scenarios.length} 个文档登记场景`
      },
      {
        key: 'workflow-states',
        label: '工作流状态',
        passed: hasCapability('workflow-states') && workflowReady,
        detail: workflowReady ? '复杂组件具备 workflow 级示例' : '仍停留在 props 级示例'
      },
      {
        key: 'responsive',
        label: '响应式场景',
        passed: hasScenarioKind('responsive'),
        detail: hasScenarioKind('responsive') ? '包含窄屏或滚动场景' : '未登记 responsive 场景'
      },
      {
        key: 'error-state',
        label: '错误/空态',
        passed: hasScenarioKind('error') || hasScenarioKind('empty') || hasScenarioKind('loading'),
        detail: '覆盖 error、empty 或 loading 中至少一种'
      },
      {
        key: 'loading-state',
        label: '加载状态',
        passed: hasScenarioKind('loading'),
        detail: hasScenarioKind('loading') ? '已登记加载与防闪烁场景' : '未登记 loading 场景'
      },
      {
        key: 'keyboard-path',
        label: '键盘路径',
        passed: hasScenarioKind('keyboard'),
        detail: hasScenarioKind('keyboard') ? '已登记键盘操作场景' : '未登记 keyboard 场景'
      }
    ]
  }
}

function createLiveExampleMatrixRow(profile: LiveExampleProfile): LiveExampleMatrixRow {
  const summary = getLiveExampleValidationSummary(profile.preset)
  const passedChecks = summary.checks.filter((check) => check.passed)
  const score = summary.checks.length
    ? Math.round((passedChecks.length / summary.checks.length) * 100)
    : 0

  return {
    preset: profile.preset,
    title: profile.component.title,
    docsTitle: profile.component.docsTitle,
    componentName: profile.component.componentName,
    packageName: profile.component.packageName,
    familyTitle: profile.component.familyTitle,
    docs: profile.docs,
    handoffHref: `${profile.docs}#live-example`,
    modeLabel: summary.modeLabel,
    status: profile.component.status,
    capabilityCount: summary.capabilityCount,
    scenarioCount: summary.scenarioCount,
    scenarioKinds: summary.scenarioKinds,
    workflowReady: summary.workflowReady,
    score,
    passedCheckCount: passedChecks.length,
    totalCheckCount: summary.checks.length,
    missingChecks: summary.checks
      .filter((check) => !check.passed)
      .map((check) => check.label)
  }
}

function getAverageScore(rows: LiveExampleMatrixRow[]) {
  if (!rows.length) {
    return 0
  }

  return Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length)
}

export function getLiveExampleMatrixSummary(): LiveExampleMatrixSummary {
  const rows = liveExampleProfiles.map(createLiveExampleMatrixRow)
  const packageNames = Array.from(new Set(rows.map((row) => row.packageName)))
  const packageGroups = packageNames.map((packageName) => {
    const packageRows = rows.filter((row) => row.packageName === packageName)

    return {
      packageName,
      packageLabel: packageName.replace('@yok-ui/', ''),
      count: packageRows.length,
      workflowReadyCount: packageRows.filter((row) => row.workflowReady).length,
      scenarioCount: packageRows.reduce((sum, row) => sum + row.scenarioCount, 0),
      averageScore: getAverageScore(packageRows)
    }
  })

  return {
    total: rows.length,
    guidedCount: liveExampleProfiles.filter((profile) => profile.mode === 'guided').length,
    workflowReadyCount: rows.filter((row) => row.workflowReady).length,
    exportReadyCount: rows.filter((row) => row.missingChecks.every((check) => check !== '复现包')).length,
    scenarioCount: rows.reduce((sum, row) => sum + row.scenarioCount, 0),
    averageScore: getAverageScore(rows),
    rows,
    attentionRows: [...rows]
      .filter((row) => row.score < 100 || !row.workflowReady)
      .sort((first, second) => first.score - second.score || first.title.localeCompare(second.title)),
    packageGroups
  }
}
