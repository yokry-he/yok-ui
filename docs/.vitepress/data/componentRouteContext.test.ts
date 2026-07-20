import { describe, expect, it } from 'vitest'
import {
  getComponentCoverageQueue,
  getComponentCoverageQueueItem,
  getComponentMaturitySummary,
  getComponentRouteContext,
  orderedComponentPages
} from './componentRouteContext'

describe('componentRouteContext', () => {
  it('summarizes component maturity evidence across all component pages', () => {
    const summary = getComponentMaturitySummary()

    expect(summary.total).toBe(orderedComponentPages.length)
    expect(summary.averageScore).toBeGreaterThan(0)
    expect(summary.apiCoverageRate).toBeGreaterThan(0)
    expect(summary.liveCoverageRate).toBeGreaterThan(0)
    expect(summary.a11yContractRate).toBeGreaterThan(0)
    expect(summary.sourceReproRate).toBeGreaterThan(0)
    expect(summary.themeCoverageRate).toBe(100)
    expect(summary.complete + summary.needsAttention).toBe(summary.total)
    expect(summary.needsAttention).toBe(0)
    expect(summary.coverageQueue.map((item) => ({
      component: item.componentName,
      priority: item.priority,
      missing: item.missingLabels
    }))).toEqual([])
    expect(summary.criticalCoverageCount + summary.highCoverageCount).toBe(0)

    for (const item of summary.nextQueue) {
      expect(item.missingItems.length).toBeGreaterThan(0)
      expect(item.score).toBeLessThan(100)
    }
  })

  it('builds an actionable coverage queue from quality and evidence gaps', () => {
    const queue = getComponentCoverageQueue(16)

    expect(queue).toEqual([])
  })

  it('keeps the coverage queue empty once every component has maturity evidence', () => {
    const queue = getComponentCoverageQueue(16)

    expect(queue).toHaveLength(0)
  })

  it('does not return repair items for completed component routes', () => {
    const queueItem = getComponentCoverageQueueItem('/components/bulk-action-bar')
    const completeItem = getComponentCoverageQueueItem('/components/data-table')

    expect(queueItem).toBeUndefined()
    expect(completeItem).toBeUndefined()
  })

  it('builds component page route context from shared registry data', () => {
    const context = getComponentRouteContext('/components/data-table')

    expect(context?.component.name).toBe('YDataTable')
    expect(context?.packageRoute).toBe('/packages/admin')
    expect(context?.qualityScore).toBe(100)
    expect(context?.qualityItems.map((item) => item.key)).toEqual([
      'api',
      'api-live',
      'live',
      'source',
      'repro',
      'accessibility',
      'theme',
      'keyboard'
    ])
    expect(context?.qualityItems.find((item) => item.key === 'api-live')?.value).toBe('Linked')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.qualityItems.find((item) => item.key === 'source')?.value).toBe('Complete')
    expect(context?.qualityItems.find((item) => item.key === 'source')?.detail).toContain('API map 100%')
    expect(context?.qualityItems.find((item) => item.key === 'repro')?.value).toBe('Bundle')
    expect(context?.maturityItems.map((item) => item.key)).toEqual([
      'api',
      'live',
      'a11y',
      'source',
      'theme',
      'route'
    ])
    expect(context?.maturityItems.find((item) => item.key === 'api')?.value).toContain('rows')
    expect(context?.maturityItems.find((item) => item.key === 'live')?.value).toBe('12 scenarios')
    expect(context?.maturityItems.find((item) => item.key === 'a11y')?.value).toBe('verified')
    expect(context?.maturityItems.find((item) => item.key === 'source')?.value).toBe('Ready')
    expect(context?.maturityItems.find((item) => item.key === 'source')?.detail).toContain('复现包')
    expect(context?.maturityItems.find((item) => item.key === 'theme')?.detail).toContain('token refs')
    expect(context?.maturityItems.find((item) => item.key === 'theme')?.detail).toContain('YDataTable.vue')
    expect(context?.maturityItems.find((item) => item.key === 'route')?.detail).toContain('Prev')
    expect(context?.evidenceMatrix.map((item) => item.key)).toEqual([
      'api',
      'live',
      'source',
      'a11y',
      'theme',
      'route'
    ])
    expect(context?.evidenceMatrix.find((item) => item.key === 'api')?.qualityItems.map((item) => item.key)).toEqual([
      'api',
      'api-live'
    ])
    expect(context?.evidenceMatrix.find((item) => item.key === 'source')?.value).toBe('Complete')
    expect(context?.evidenceMatrix.find((item) => item.key === 'source')?.maturityItems.map((item) => item.key)).toEqual([
      'source'
    ])
    expect(context?.evidenceMatrix.find((item) => item.key === 'a11y')?.qualityItems.map((item) => item.key)).toEqual([
      'accessibility',
      'keyboard'
    ])
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '远程加载',
      '错误重试',
      '筛选摘要',
      '列配置重置',
      '列顺序偏好',
      '列宽偏好',
      '视图偏好保存',
      '千行性能',
      '批量选择',
      '发布队列',
      '移动密度',
      '键盘巡航'
    ])
    expect(context?.relatedComponents.length).toBeGreaterThan(0)
  })

  it('exposes button workflow scenarios for route navigation', () => {
    const context = getComponentRouteContext('/components/button')

    expect(context?.component.name).toBe('YButton')
    expect(context?.qualityScore).toBe(100)
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '主操作',
      '表单提交',
      '按钮组',
      '复制命令',
      '加载提交',
      '权限禁用',
      '风险操作',
      '移动宽按钮',
      '键盘触发'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-button')
    const buttonIndex = orderedComponentPages.findIndex((component) => component.docs === '/components/button')

    expect(context?.previousComponent?.docs).toBe(orderedComponentPages[buttonIndex - 1]?.docs)
    expect(context?.nextComponent?.docs).toBe(orderedComponentPages[buttonIndex + 1]?.docs)
  })

  it('exposes config provider workflow scenarios for route navigation', () => {
    const context = getComponentRouteContext('/components/config-provider')

    expect(context?.component.name).toBe('YConfigProvider')
    expect(context?.qualityScore).toBe(100)
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '全局尺寸',
      '紧凑密度',
      '中文区域',
      '锁定配置',
      '移动配置',
      '键盘路径'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-config-provider')
  })

  it('exposes table keyboard workflow scenarios for route navigation', () => {
    const context = getComponentRouteContext('/components/table')

    expect(context?.component.name).toBe('YTable')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '排序筛选',
      '选择摘要',
      '展开详情',
      '虚拟滚动',
      '列宽偏好',
      '固定滚动',
      '加载状态',
      '空筛选结果',
      '远程受控',
      '键盘巡航'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-table')
  })

  it('exposes form responsive and keyboard workflow scenarios for route navigation', () => {
    const context = getComponentRouteContext('/components/form')

    expect(context?.component.name).toBe('YForm')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '基础提交',
      '校验错误',
      '错误摘要',
      '只读审核',
      '移动表单',
      '键盘提交'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-submit')
  })

  it('exposes form item slot, validation and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/form-item')

    expect(context?.component.name).toBe('YFormItem')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '基础字段',
      'Slot 绑定',
      '校验错误',
      '可选字段',
      '移动字段',
      '键盘字段'
    ])
    expect(context?.scenarios.at(1)?.key).toBe('slot-form-item')
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-form-item')
  })

  it('exposes form summary linked field, empty and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/form-summary')

    expect(context?.component.name).toBe('YFormSummary')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '错误汇总',
      '关联字段',
      '复核摘要',
      '空摘要',
      '移动摘要',
      '键盘摘要'
    ])
    expect(context?.scenarios.at(1)?.key).toBe('linked-form-summary')
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-form-summary')
  })

  it('exposes input help, search, density, validation and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/input')

    expect(context?.component.name).toBe('YInput')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '基础输入',
      '帮助说明',
      '搜索输入',
      '可清空计数',
      '尺寸密度',
      '校验错误',
      '禁用复核',
      '移动短标签',
      '键盘录入'
    ])
    expect(context?.scenarios.at(3)?.key).toBe('clearable-count-input')
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-input')
  })

  it('exposes checkbox checklist, group limit, indeterminate, required, disabled and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/checkbox')

    expect(context?.component.name).toBe('YCheckbox')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '基础确认',
      '清单组合',
      '数量限制组',
      '半选状态',
      '表单校验组',
      '必选确认',
      '锁定项',
      '移动确认',
      '键盘切换'
    ])
    expect(context?.scenarios.at(1)?.key).toBe('checklist-checkbox')
    expect(context?.scenarios.at(2)?.key).toBe('limited-checkbox-group')
    expect(context?.scenarios.at(3)?.key).toBe('indeterminate-checkbox')
    expect(context?.scenarios.at(4)?.key).toBe('form-validation-checkbox-group')
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-checkbox')
  })

  it('exposes radio group validation, disabled option, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/radio-group')

    expect(context?.component.name).toBe('YRadioGroup')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '包选择',
      '受控回填',
      '必选单选',
      '表单校验组',
      '禁用选项',
      '移动单选',
      '键盘选择'
    ])
    expect(context?.scenarios.at(3)?.key).toBe('form-validation-radio-group')
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-radio-group')
  })

  it('exposes switch status copy, risk, disabled and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/switch')

    expect(context?.component.name).toBe('YSwitch')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '即时设置',
      '状态文案',
      '表单校验开关',
      '加载开关',
      '风险开关',
      '锁定开关',
      '移动开关',
      '键盘开关'
    ])
    expect(context?.scenarios.at(1)?.key).toBe('status-copy-switch')
    expect(context?.scenarios.at(2)?.key).toBe('form-validation-switch')
    expect(context?.scenarios.at(3)?.key).toBe('loading-switch')
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-switch')
  })

  it('exposes textarea help, density, validation and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/textarea')

    expect(context?.component.name).toBe('YTextarea')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '发布说明',
      '帮助说明',
      '尺寸密度',
      '校验错误',
      '锁定备注',
      '移动长文',
      '键盘长文'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-textarea')
  })

  it('exposes select overlay workflow scenarios for route navigation', () => {
    const context = getComponentRouteContext('/components/select')

    expect(context?.component.name).toBe('YSelect')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '包选择',
      '可清空',
      '多选标签',
      '标签折叠',
      '尺寸密度',
      '可搜索',
      '无匹配结果',
      '分组选项',
      '禁用选项',
      '创建选项',
      '虚拟滚动',
      '远程加载',
      '表单校验选择',
      '必填错误',
      '禁用审核',
      '移动选择',
      '键盘选择'
    ])
    expect(context?.scenarios.at(12)?.key).toBe('form-validation-select')
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-select')
  })

  it('exposes cascader responsive and keyboard workflow scenarios for route navigation', () => {
    const context = getComponentRouteContext('/components/cascader')

    expect(context?.component.name).toBe('YCascader')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '单路径选择',
      '多权限范围',
      '禁用错误回填',
      '异步级联',
      '移动级联',
      '键盘级联'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-cascader')
  })

  it('exposes cascader panel workflow scenarios for embedded route navigation', () => {
    const context = getComponentRouteContext('/components/cascader-panel')

    expect(context?.component.name).toBe('YCascaderPanel')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '常驻分类面板',
      '多选权限面板',
      '远程加载面板',
      '空面板',
      '移动面板',
      '键盘面板'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-panel')
  })

  it('exposes date range shortcut, responsive and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/date-range-picker')

    expect(context?.component.name).toBe('YDateRangePicker')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '常规范围',
      '快捷范围',
      '未完成范围',
      '禁用日期',
      '发布冲突',
      '表单校验',
      '只读归档',
      '移动范围',
      '键盘范围'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-range')
  })

  it('exposes drawer mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/drawer')

    expect(context?.component.name).toBe('YDrawer')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '侧栏配置',
      '详情页',
      '移动导航',
      '键盘关闭',
      '锁定抽屉'
    ])
    expect(context?.scenarios.some((scenario) => scenario.key === 'keyboard-dismiss')).toBe(true)
    expect(context?.scenarios.at(-1)?.key).toBe('locked-drawer')
  })

  it('exposes dropdown trigger, placement, disabled and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/dropdown')

    expect(context?.component.name).toBe('YDropdown')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '动作菜单',
      '右侧对齐',
      '禁用危险项',
      '悬浮触发',
      '不自动关闭',
      '禁用触发',
      '键盘菜单'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-menu')
  })

  it('exposes popconfirm danger, cancel, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/popconfirm')

    expect(context?.component.name).toBe('YPopconfirm')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '归档确认',
      '危险删除',
      '取消回退',
      '移动确认',
      '键盘确认'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-confirm')
  })

  it('exposes message status, danger, persistent, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/message')

    expect(context?.component.name).toBe('YMessage')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '保存成功',
      '错误警报',
      '持续提示',
      '移动提示',
      '键盘关闭'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-close')
  })

  it('exposes result success, not found, server, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/result')

    expect(context?.component.name).toBe('YResult')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '发布成功',
      '页面未找到',
      '服务异常',
      '移动结果页',
      '键盘操作区'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-actions')
  })

  it('exposes empty first run, search, permission, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/empty')

    expect(context?.component.name).toBe('YEmpty')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '首次创建',
      '搜索无结果',
      '权限空态',
      '移动空态',
      '键盘操作'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-empty-action')
  })

  it('exposes skeleton loading, list, responsive and accessibility workflow scenarios', () => {
    const context = getComponentRouteContext('/components/skeleton')

    expect(context?.component.name).toBe('YSkeleton')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '详情卡片加载',
      '列表加载',
      '快速返回',
      '移动骨架',
      '读屏状态'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('screen-reader-status')
  })

  it('exposes alert status, validation, announcement, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/alert')

    expect(context?.component.name).toBe('YAlert')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '保存成功',
      '表单校验',
      '系统公告',
      '移动提示',
      '键盘关闭'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-alert-close')
  })

  it('exposes card content, action, grid, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/card')

    expect(context?.component.name).toBe('YCard')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '信息卡片',
      '操作卡片',
      '网格卡片',
      '移动卡片',
      '键盘操作',
      '空状态卡片'
    ])
    expect(context?.scenarios.some((scenario) => scenario.key === 'keyboard-card-action')).toBe(true)
    expect(context?.scenarios.at(-1)?.key).toBe('empty-card')
  })

  it('exposes collapse faq, accordion, disabled, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/collapse')

    expect(context?.component.name).toBe('YCollapse')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      'FAQ 分组',
      '手风琴设置',
      '禁用面板',
      '移动折叠',
      '键盘展开'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-collapse')
  })

  it('exposes descriptions detail, review, vertical, long field, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/descriptions')

    expect(context?.component.name).toBe('YDescriptions')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '详情信息',
      '审核侧栏',
      '垂直布局',
      '空详情',
      '长字段',
      '移动阅读',
      '键盘阅读'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-descriptions')
  })

  it('exposes pagination list, dense, single page, disabled, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/pagination')

    expect(context?.component.name).toBe('YPagination')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '列表翻页',
      '密集页码',
      '单页隐藏',
      '禁用状态',
      '移动分页',
      '键盘分页'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-pagination')
  })

  it('exposes list basic, grid, loading, empty, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/list')

    expect(context?.component.name).toBe('YList')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '任务列表',
      '资源网格',
      '加载列表',
      '空结果',
      '移动列表',
      '键盘阅读'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-list')
  })

  it('exposes timeline release, reverse, alternate, loading, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/timeline')

    expect(context?.component.name).toBe('YTimeline')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '发布记录',
      '倒序记录',
      '交替布局',
      '加载尾项',
      '移动时间线',
      '键盘阅读'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-timeline')
  })

  it('exposes statistic metric, unit, card, countdown, loading, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/statistic')

    expect(context?.component.name).toBe('YStatistic')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '核心指标',
      '单位精度',
      '卡片指标',
      '倒计时指标',
      '加载指标',
      '移动指标',
      '读屏指标'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-statistic')
  })

  it('exposes date picker basic, shortcut, disabled, error, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/date-picker')

    expect(context?.component.name).toBe('YDatePicker')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '基础日期',
      '快捷日期',
      '禁用日期',
      '校验错误',
      '表单校验',
      '移动日期',
      '键盘日期'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-date-picker')
  })

  it('exposes time picker basic, step, disabled, error, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/time-picker')

    expect(context?.component.name).toBe('YTimePicker')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '基础时间',
      '分钟步长',
      '禁用时间',
      '校验错误',
      '表单校验',
      '移动时间',
      '键盘时间'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-time-picker')
  })

  it('exposes input number quantity, precision, density, controls, error, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/input-number')

    expect(context?.component.name).toBe('YInputNumber')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '数量范围',
      '小数精度',
      '尺寸密度',
      '无步进器',
      '校验错误',
      '移动数值',
      '键盘步进'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-input-number')
  })

  it('exposes slider value, step, range, vertical tooltip, error, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/slider')

    expect(context?.component.name).toBe('YSlider')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '基础滑块',
      '离散步进',
      '范围选择',
      '垂直提示',
      '校验错误',
      '移动滑块',
      '键盘滑块'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-slider')
  })

  it('exposes rate value, half, copy, clear, readonly, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/rate')

    expect(context?.component.name).toBe('YRate')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '基础评分',
      '半星评分',
      '评分文案',
      '可清空',
      '只读展示',
      '移动评分',
      '键盘评分'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-rate')
  })

  it('exposes color picker basic, alpha, presets, clear, error, mobile and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/color-picker')

    expect(context?.component.name).toBe('YColorPicker')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '基础取色',
      '透明度',
      '预设色',
      '可清空',
      '校验错误',
      '表单校验',
      '移动色板',
      '键盘输入'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-color-picker')
  })

  it('exposes modal responsive and keyboard focus workflow scenarios', () => {
    const context = getComponentRouteContext('/components/modal')

    expect(context?.component.name).toBe('YModal')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '确认流程',
      '危险操作',
      '表单复核',
      '移动弹窗',
      '键盘焦点'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-focus')
  })

  it('exposes popover placement, empty, responsive and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/popover')

    expect(context?.component.name).toBe('YPopover')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      '上下文说明',
      '确认提示',
      '空状态引导',
      '移动避让',
      '悬浮方位',
      '禁用触发',
      '键盘触发'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('keyboard-popover')
  })

  it('exposes tooltip placement, error and keyboard workflow scenarios', () => {
    const context = getComponentRouteContext('/components/tooltip')

    expect(context?.component.name).toBe('YTooltip')
    expect(context?.qualityItems.find((item) => item.key === 'live')?.value).toBe('Workflow')
    expect(context?.scenarios.map((scenario) => scenario.label)).toEqual([
      'Hover 与 Focus',
      '键盘提示',
      '方位切换',
      '点击触发',
      '浅色主题',
      '禁用触发',
      '错误说明'
    ])
    expect(context?.scenarios.at(-1)?.key).toBe('validation-tooltip')
  })

  it('returns undefined for non-component routes', () => {
    expect(getComponentRouteContext('/guide/')).toBeUndefined()
  })
})
