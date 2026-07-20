import { describe, expect, it } from 'vitest'
import {
  getApiLiveCoverageForRow,
  getApiLiveCoverageItems,
  getApiLiveCoverageSummary
} from './apiLiveCoverage'

describe('apiLiveCoverage', () => {
  it('marks guided visual props as covered by the live example API map', () => {
    const coverage = getApiLiveCoverageForRow('/components/button', 'props', {
      name: 'variant',
      type: "'primary' | 'secondary' | 'ghost'",
      description: '按钮视觉等级。'
    })

    expect(coverage.status).toBe('covered')
    expect(coverage.label).toBe('Example')
    expect(coverage.href).toBe('#button-basic-usage')
  })

  it('marks content, media, layout and typography props as guided live props', () => {
    const profileName = getApiLiveCoverageForRow('/components/profile-card', 'props', {
      name: 'name',
      type: 'string',
      description: '姓名。'
    })
    const avatarAlt = getApiLiveCoverageForRow('/components/avatar', 'props', {
      name: 'alt',
      type: 'string',
      description: '图片替代文本。'
    })
    const avatarSrcSet = getApiLiveCoverageForRow('/components/avatar', 'props', {
      name: 'srcSet',
      type: 'string',
      description: '图片高分屏资源。'
    })
    const avatarGroupSpacing = getApiLiveCoverageForRow('/components/avatar', 'props', {
      name: 'spacing',
      type: 'YAvatarGroupSpacing',
      description: '头像组间距。'
    })
    const backtopOffset = getApiLiveCoverageForRow('/components/backtop', 'props', {
      name: 'bottom',
      type: 'number',
      description: '距离底部的位置。'
    })
    const textStrong = getApiLiveCoverageForRow('/components/text', 'props', {
      name: 'strong',
      type: 'boolean',
      description: '是否加粗。'
    })
    const codeLanguage = getApiLiveCoverageForRow('/components/code-block', 'props', {
      name: 'language',
      type: 'string',
      description: '代码语言。'
    })
    const spaceDirection = getApiLiveCoverageForRow('/components/space', 'props', {
      name: 'direction',
      type: "'horizontal' | 'vertical'",
      description: '排列方向。'
    })
    const featureData = getApiLiveCoverageForRow('/components/feature-grid', 'props', {
      name: 'features',
      type: 'Feature[]',
      description: '特性数据。'
    })
    const paginationTotal = getApiLiveCoverageForRow('/components/pagination', 'props', {
      name: 'total',
      type: 'number',
      description: '总条数。'
    })
    const paginationNextText = getApiLiveCoverageForRow('/components/pagination', 'props', {
      name: 'nextText',
      type: 'string',
      description: '下一页按钮文案。'
    })
    const paginationSiblingCount = getApiLiveCoverageForRow('/components/pagination', 'props', {
      name: 'siblingCount',
      type: 'number',
      description: '当前页两侧显示的页码数量。'
    })
    const statisticPrefix = getApiLiveCoverageForRow('/components/statistic', 'props', {
      name: 'prefix',
      type: 'VNode',
      description: '数值前缀。'
    })
    const popoverTrigger = getApiLiveCoverageForRow('/components/popover', 'props', {
      name: 'trigger',
      type: "'hover' | 'click'",
      description: '触发方式。'
    })

    expect(profileName.label).toBe('Live prop')
    expect(profileName.status).toBe('covered')
    expect(avatarAlt.label).toBe('Scenario')
    expect(avatarAlt.scenario?.key).toBe('image-avatar')
    expect(avatarSrcSet.label).toBe('Scenario')
    expect(avatarSrcSet.scenario?.key).toBe('image-avatar')
    expect(avatarGroupSpacing.label).toBe('Live prop')
    expect(avatarGroupSpacing.status).toBe('covered')
    expect(backtopOffset.label).toBe('Live prop')
    expect(textStrong.label).toBe('Live prop')
    expect(codeLanguage.label).toBe('Live prop')
    expect(spaceDirection.label).toBe('Live prop')
    expect(featureData.label).toBe('Live prop')
    expect(paginationTotal.label).toBe('Live prop')
    expect(paginationNextText.label).toBe('Live prop')
    expect(paginationSiblingCount.label).toBe('Live prop')
    expect(statisticPrefix.label).toBe('Live prop')
    expect(popoverTrigger.label).toBe('Live prop')
  })

  it('links API rows to matching workflow scenarios when scenario evidence exists', () => {
    const coverage = getApiLiveCoverageForRow('/components/data-table', 'props', {
      name: 'filters',
      type: 'Record<string, unknown>',
      description: '受控筛选条件。'
    })

    expect(coverage.status).toBe('covered')
    expect(coverage.label).toBe('Scenario')
    expect(coverage.href).toMatch(/^#live-example\?scenario=.+/)
    expect(coverage.scenario?.key).toBe('active-filters')
    expect(coverage.detail).toContain('筛选摘要')
  })

  it('links API rows to focused DocDemo examples when static source shows the prop', () => {
    const coverage = getApiLiveCoverageForRow('/components/select', 'props', {
      name: 'label',
      type: 'string',
      description: '标签文本。'
    })

    expect(coverage.status).toBe('covered')
    expect(coverage.label).toBe('Example')
    expect(coverage.href).toBe('#select-basic-usage')
    expect(coverage.detail).toContain('基础用法')
    expect(coverage.docDemo).toEqual({
      id: 'select-basic-usage',
      title: '基础用法'
    })
  })

  it('links common primitive API rows to their exact static examples', () => {
    const buttonVariant = getApiLiveCoverageForRow('/components/button', 'props', {
      name: 'variant',
      type: "'primary' | 'secondary' | 'ghost'",
      description: '按钮视觉等级。'
    })
    const buttonSize = getApiLiveCoverageForRow('/components/button', 'props', {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: '按钮尺寸。'
    })
    const inputType = getApiLiveCoverageForRow('/components/input', 'props', {
      name: 'type',
      type: "'text' | 'search' | 'password' | 'email' | 'url' | 'tel'",
      description: '原生 input 类型。'
    })
    const inputShowPassword = getApiLiveCoverageForRow('/components/input', 'props', {
      name: 'showPassword',
      type: 'boolean',
      description: '当 type 为 password 时显示密码可见性切换按钮。'
    })

    expect(buttonVariant.label).toBe('Example')
    expect(buttonVariant.href).toBe('#button-basic-usage')
    expect(buttonVariant.docDemo).toEqual({
      id: 'button-basic-usage',
      title: '基础用法'
    })
    expect(buttonSize.label).toBe('Example')
    expect(buttonSize.href).toBe('#button-sizes')
    expect(inputType.label).toBe('Example')
    expect(inputType.href).toBe('#demo-clearable-search-and-count')
    expect(inputShowPassword.label).toBe('Example')
    expect(inputShowPassword.href).toBe('#demo-password')
  })

  it('links Upload and Table API rows to the closest DocDemo source when no workflow scenario is stronger', () => {
    const uploadDownloadable = getApiLiveCoverageForRow('/components/upload', 'props', {
      name: 'downloadable',
      type: 'boolean',
      description: '是否为带 url 的文件显示下载操作。'
    })
    const uploadSortable = getApiLiveCoverageForRow('/components/upload', 'props', {
      name: 'sortable',
      type: 'boolean',
      description: '是否显示上移、下移按钮调整文件顺序。'
    })
    const tableStriped = getApiLiveCoverageForRow('/components/table', 'props', {
      name: 'striped',
      type: 'boolean',
      description: '是否显示条纹行。'
    })

    expect(uploadDownloadable.label).toBe('Example')
    expect(uploadDownloadable.href).toBe('#demo-picture-list-actions')
    expect(uploadSortable.label).toBe('Example')
    expect(uploadSortable.href).toBe('#demo-picture-list-actions')
    expect(tableStriped.label).toBe('Example')
    expect(tableStriped.href).toBe('#demo-selectable-table')
  })

  it('links tree structure, checked and drag props to workflow scenarios', () => {
    const nodes = getApiLiveCoverageForRow('/components/tree', 'props', {
      name: 'nodes',
      type: 'YTreeNode[]',
      description: '树数据。'
    })
    const expandedKeys = getApiLiveCoverageForRow('/components/tree', 'props', {
      name: 'expandedKeys',
      type: 'string[]',
      description: '受控展开节点。'
    })
    const defaultExpandedKeys = getApiLiveCoverageForRow('/components/tree', 'props', {
      name: 'defaultExpandedKeys',
      type: 'string[]',
      description: '默认展开节点。'
    })
    const checkedKeys = getApiLiveCoverageForRow('/components/tree', 'props', {
      name: 'checkedKeys',
      type: 'string[]',
      description: '受控勾选节点。'
    })
    const defaultCheckedKeys = getApiLiveCoverageForRow('/components/tree', 'props', {
      name: 'defaultCheckedKeys',
      type: 'string[]',
      description: '默认勾选节点。'
    })
    const draggable = getApiLiveCoverageForRow('/components/tree', 'props', {
      name: 'draggable',
      type: 'boolean',
      description: '是否允许拖拽。'
    })
    const allowDrop = getApiLiveCoverageForRow('/components/tree', 'props', {
      name: 'allowDrop',
      type: 'YTreeAllowDrop',
      description: '拖拽放置约束。'
    })

    expect(nodes.label).toBe('Scenario')
    expect(nodes.href).toMatch(/^#live-example\?scenario=.+/)
    expect(expandedKeys.label).toBe('Scenario')
    expect(expandedKeys.href).toMatch(/^#live-example\?scenario=.+/)
    expect(defaultExpandedKeys.label).toBe('Scenario')
    expect(defaultExpandedKeys.href).toMatch(/^#live-example\?scenario=.+/)
    expect(checkedKeys.label).toBe('Scenario')
    expect(checkedKeys.href).toMatch(/^#live-example\?scenario=.+/)
    expect(defaultCheckedKeys.label).toBe('Scenario')
    expect(defaultCheckedKeys.href).toMatch(/^#live-example\?scenario=.+/)
    expect(draggable.label).toBe('Scenario')
    expect(draggable.href).toMatch(/^#live-example\?scenario=.+/)
    expect(allowDrop.label).toBe('Scenario')
    expect(allowDrop.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links date picker field and shortcut props to workflow scenarios', () => {
    const datePlaceholder = getApiLiveCoverageForRow('/components/date-picker', 'props', {
      name: 'placeholder',
      type: 'string',
      description: '占位文本。'
    })
    const dateLocale = getApiLiveCoverageForRow('/components/date-picker', 'props', {
      name: 'locale',
      type: 'string',
      description: '区域设置。'
    })
    const dateShortcuts = getApiLiveCoverageForRow('/components/date-picker', 'props', {
      name: 'shortcuts',
      type: 'YDateShortcut[]',
      description: '快捷日期。'
    })
    const rangeSeparator = getApiLiveCoverageForRow('/components/date-range-picker', 'props', {
      name: 'separator',
      type: 'string',
      description: '范围分隔符。'
    })
    const rangeShortcuts = getApiLiveCoverageForRow('/components/date-range-picker', 'props', {
      name: 'shortcuts',
      type: 'YDateRangeShortcut[]',
      description: '快捷范围。'
    })

    expect(datePlaceholder.label).toBe('Scenario')
    expect(datePlaceholder.href).toMatch(/^#live-example\?scenario=.+/)
    expect(dateLocale.label).toBe('Scenario')
    expect(dateLocale.href).toMatch(/^#live-example\?scenario=.+/)
    expect(dateShortcuts.label).toBe('Scenario')
    expect(dateShortcuts.href).toMatch(/^#live-example\?scenario=.+/)
    expect(rangeSeparator.label).toBe('Scenario')
    expect(rangeSeparator.href).toMatch(/^#live-example\?scenario=.+/)
    expect(rangeShortcuts.label).toBe('Scenario')
    expect(rangeShortcuts.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links form model, rules and layout props to workflow scenarios', () => {
    const model = getApiLiveCoverageForRow('/components/form', 'props', {
      name: 'model',
      type: 'Record<string, unknown>',
      description: '表单数据对象。'
    })
    const rules = getApiLiveCoverageForRow('/components/form', 'props', {
      name: 'rules',
      type: 'YFormRules',
      description: '校验规则。'
    })
    const labelWidth = getApiLiveCoverageForRow('/components/form', 'props', {
      name: 'labelWidth',
      type: 'string',
      description: '标签宽度。'
    })

    expect(model.label).toBe('Scenario')
    expect(model.href).toMatch(/^#live-example\?scenario=.+/)
    expect(rules.label).toBe('Scenario')
    expect(rules.href).toMatch(/^#live-example\?scenario=.+/)
    expect(labelWidth.label).toBe('Scenario')
    expect(labelWidth.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links command palette command data to the open workflow scenario', () => {
    const commands = getApiLiveCoverageForRow('/components/command-palette', 'props', {
      name: 'commands',
      type: 'YokCommand[]',
      description: '命令列表。'
    })

    expect(commands.label).toBe('Scenario')
    expect(commands.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links table selection, filter, virtual and column width props to workflow scenarios', () => {
    const caption = getApiLiveCoverageForRow('/components/table', 'props', {
      name: 'caption',
      type: 'string',
      description: '表格标题说明。'
    })
    const selectable = getApiLiveCoverageForRow('/components/table', 'props', {
      name: 'selectable',
      type: 'boolean',
      description: '是否显示行选择列。'
    })
    const defaultFilters = getApiLiveCoverageForRow('/components/table', 'props', {
      name: 'defaultFilters',
      type: 'YTableFilterState',
      description: '默认筛选。'
    })
    const virtualHeight = getApiLiveCoverageForRow('/components/table', 'props', {
      name: 'virtualHeight',
      type: 'number',
      description: '虚拟滚动高度。'
    })
    const defaultColumnWidths = getApiLiveCoverageForRow('/components/table', 'props', {
      name: 'defaultColumnWidths',
      type: 'Record<string, number>',
      description: '默认列宽。'
    })

    expect(caption.href).toMatch(/^#live-example\?scenario=.+/)
    expect(selectable.href).toMatch(/^#live-example\?scenario=.+/)
    expect(defaultFilters.href).toMatch(/^#live-example\?scenario=.+/)
    expect(virtualHeight.href).toMatch(/^#live-example\?scenario=.+/)
    expect(defaultColumnWidths.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links data view saved views, paging and table preference props to workflow scenarios', () => {
    const views = getApiLiveCoverageForRow('/components/data-view', 'props', {
      name: 'views',
      type: 'YDataViewItem[]',
      description: '保存视图列表。'
    })
    const savedViewsTitle = getApiLiveCoverageForRow('/components/data-view', 'props', {
      name: 'savedViewsTitle',
      type: 'string',
      description: '保存视图区标题。'
    })
    const savedViewsDescription = getApiLiveCoverageForRow('/components/data-view', 'props', {
      name: 'savedViewsDescription',
      type: 'string',
      description: '保存视图区说明。'
    })
    const pageSize = getApiLiveCoverageForRow('/components/data-view', 'props', {
      name: 'pageSize',
      type: 'number',
      description: '分页每页数量。'
    })
    const selectable = getApiLiveCoverageForRow('/components/data-view', 'props', {
      name: 'selectable',
      type: 'boolean',
      description: '是否启用内部数据表行选择。'
    })
    const reorderableColumns = getApiLiveCoverageForRow('/components/data-view', 'props', {
      name: 'reorderableColumns',
      type: 'boolean',
      description: '列设置中是否允许调整列顺序。'
    })

    expect(views.href).toMatch(/^#live-example\?scenario=.+/)
    expect(savedViewsTitle.href).toMatch(/^#live-example\?scenario=.+/)
    expect(savedViewsDescription.href).toMatch(/^#live-example\?scenario=.+/)
    expect(pageSize.href).toMatch(/^#live-example\?scenario=.+/)
    expect(selectable.href).toMatch(/^#live-example\?scenario=.+/)
    expect(reorderableColumns.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links focused primitive and utility props to their workflow scenarios', () => {
    const bulkActions = getApiLiveCoverageForRow('/components/bulk-action-bar', 'props', {
      name: 'actions',
      type: 'YBulkActionItem[]',
      description: '批量动作列表。'
    })
    const bulkClearText = getApiLiveCoverageForRow('/components/bulk-action-bar', 'props', {
      name: 'clearText',
      type: 'string',
      description: '清空选择按钮文案。'
    })
    const scrollbarMinHeight = getApiLiveCoverageForRow('/components/scrollbar', 'props', {
      name: 'minHeight',
      type: 'string | number',
      description: '滚动视口最小高度。'
    })
    const scrollbarNative = getApiLiveCoverageForRow('/components/scrollbar', 'props', {
      name: 'native',
      type: 'boolean',
      description: '是否使用原生滚动条。'
    })
    const textareaPlaceholder = getApiLiveCoverageForRow('/components/textarea', 'props', {
      name: 'placeholder',
      type: 'string',
      description: '占位提示。'
    })
    const textareaHelper = getApiLiveCoverageForRow('/components/textarea', 'props', {
      name: 'helper',
      type: 'string',
      description: '辅助说明。'
    })
    const buttonType = getApiLiveCoverageForRow('/components/button', 'props', {
      name: 'type',
      type: "'button' | 'submit' | 'reset'",
      description: '原生按钮类型。'
    })
    const cardInteractive = getApiLiveCoverageForRow('/components/card', 'props', {
      name: 'interactive',
      type: 'boolean',
      description: '是否展示交互态。'
    })

    expect(bulkActions.href).toMatch(/^#live-example\?scenario=.+/)
    expect(bulkClearText.href).toMatch(/^#live-example\?scenario=.+/)
    expect(scrollbarMinHeight.href).toMatch(/^#live-example\?scenario=.+/)
    expect(scrollbarNative.href).toMatch(/^#live-example\?scenario=.+/)
    expect(textareaPlaceholder.href).toMatch(/^#live-example\?scenario=.+/)
    expect(textareaHelper.href).toMatch(/^#live-example\?scenario=.+/)
    expect(buttonType.href).toMatch(/^#live-example\?scenario=.+/)
    expect(cardInteractive.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links page, radio and theme helper props to workflow scenarios', () => {
    const headingLevel = getApiLiveCoverageForRow('/components/page-header', 'props', {
      name: 'headingLevel',
      type: '1 | 2 | 3',
      description: '标题语义层级。'
    })
    const radioOptions = getApiLiveCoverageForRow('/components/radio-group', 'props', {
      name: 'options',
      type: 'YRadioOption[]',
      description: '单选项列表。'
    })
    const themeTokens = getApiLiveCoverageForRow('/guide/theming', 'props', {
      name: 'tokens',
      type: 'YokThemeTokens',
      description: '局部注入的完整主题 token 对象。'
    })

    expect(headingLevel.href).toMatch(/^#live-example\?scenario=.+/)
    expect(radioOptions.href).toMatch(/^#live-example\?scenario=.+/)
    expect(themeTokens.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links resource page search, saved view and table props to workflow scenarios', () => {
    const searchModel = getApiLiveCoverageForRow('/components/resource-page', 'props', {
      name: 'searchModel',
      type: 'Record<string, string>',
      description: '搜索表单值。'
    })
    const searchFields = getApiLiveCoverageForRow('/components/resource-page', 'props', {
      name: 'searchFields',
      type: 'YSearchFormField[]',
      description: '搜索字段配置。'
    })
    const searchTitle = getApiLiveCoverageForRow('/components/resource-page', 'props', {
      name: 'searchTitle',
      type: 'string',
      description: '搜索表单标题。'
    })
    const views = getApiLiveCoverageForRow('/components/resource-page', 'props', {
      name: 'views',
      type: 'YDataViewItem[]',
      description: '保存视图列表。'
    })
    const viewValue = getApiLiveCoverageForRow('/components/resource-page', 'props', {
      name: 'viewValue',
      type: 'string',
      description: '受控当前保存视图 value。'
    })
    const tableTitle = getApiLiveCoverageForRow('/components/resource-page', 'props', {
      name: 'tableTitle',
      type: 'string',
      description: '数据区标题。'
    })
    const selectable = getApiLiveCoverageForRow('/components/resource-page', 'props', {
      name: 'selectable',
      type: 'boolean',
      description: '是否启用数据区行选择。'
    })

    expect(searchModel.href).toMatch(/^#live-example\?scenario=.+/)
    expect(searchFields.href).toMatch(/^#live-example\?scenario=.+/)
    expect(searchTitle.href).toMatch(/^#live-example\?scenario=.+/)
    expect(views.href).toMatch(/^#live-example\?scenario=.+/)
    expect(viewValue.href).toMatch(/^#live-example\?scenario=.+/)
    expect(tableTitle.href).toMatch(/^#live-example\?scenario=.+/)
    expect(selectable.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links advanced form, picker and data movement props to workflow scenarios', () => {
    const cascaderOptions = getApiLiveCoverageForRow('/components/cascader', 'props', {
      name: 'options',
      type: 'YCascaderOption[]',
      description: '层级选项数据。'
    })
    const cascaderPlaceholder = getApiLiveCoverageForRow('/components/cascader', 'props', {
      name: 'placeholder',
      type: 'string',
      description: '占位文本。'
    })
    const cascaderSeparator = getApiLiveCoverageForRow('/components/cascader', 'props', {
      name: 'separator',
      type: 'string',
      description: '展示路径分隔符。'
    })
    const sliderMin = getApiLiveCoverageForRow('/components/slider', 'props', {
      name: 'min',
      type: 'number',
      description: '最小值。'
    })
    const sliderMax = getApiLiveCoverageForRow('/components/slider', 'props', {
      name: 'max',
      type: 'number',
      description: '最大值。'
    })
    const sliderMarks = getApiLiveCoverageForRow('/components/slider', 'props', {
      name: 'marks',
      type: 'YSliderMark[]',
      description: '轨道标记。'
    })
    const searchCollapsedCount = getApiLiveCoverageForRow('/components/search-form', 'props', {
      name: 'collapsedCount',
      type: 'number',
      description: '折叠时展示的字段数量。'
    })
    const searchCollapsible = getApiLiveCoverageForRow('/components/search-form', 'props', {
      name: 'collapsible',
      type: 'boolean',
      description: '是否允许展开和收起。'
    })
    const searchDefaultCollapsed = getApiLiveCoverageForRow('/components/search-form', 'props', {
      name: 'defaultCollapsed',
      type: 'boolean',
      description: '初始是否折叠。'
    })
    const descriptionsColumn = getApiLiveCoverageForRow('/components/descriptions', 'props', {
      name: 'column',
      type: 'number',
      description: '桌面端列数。'
    })
    const descriptionsLayout = getApiLiveCoverageForRow('/components/descriptions', 'props', {
      name: 'layout',
      type: "'horizontal' | 'vertical'",
      description: '标签和值的展示布局。'
    })
    const transferOptions = getApiLiveCoverageForRow('/components/transfer', 'props', {
      name: 'options',
      type: 'YTransferOption[]',
      description: '全部候选项。'
    })
    const transferTitles = getApiLiveCoverageForRow('/components/transfer', 'props', {
      name: 'titles',
      type: '[string, string]',
      description: '左右两侧面板标题。'
    })

    expect(cascaderOptions.href).toMatch(/^#live-example\?scenario=.+/)
    expect(cascaderPlaceholder.href).toMatch(/^#live-example\?scenario=.+/)
    expect(cascaderSeparator.href).toMatch(/^#live-example\?scenario=.+/)
    expect(sliderMin.href).toMatch(/^#live-example\?scenario=.+/)
    expect(sliderMax.href).toMatch(/^#live-example\?scenario=.+/)
    expect(sliderMarks.href).toMatch(/^#live-example\?scenario=.+/)
    expect(searchCollapsedCount.href).toMatch(/^#live-example\?scenario=.+/)
    expect(searchCollapsible.href).toMatch(/^#live-example\?scenario=.+/)
    expect(searchDefaultCollapsed.href).toMatch(/^#live-example\?scenario=.+/)
    expect(descriptionsColumn.href).toMatch(/^#live-example\?scenario=.+/)
    expect(descriptionsLayout.href).toMatch(/^#live-example\?scenario=.+/)
    expect(transferOptions.href).toMatch(/^#live-example\?scenario=.+/)
    expect(transferTitles.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links polish and overlay workflow props to their focused scenarios', () => {
    const iconSpinning = getApiLiveCoverageForRow('/components/icon', 'props', {
      name: 'spinning',
      type: 'boolean',
      description: '是否展示旋转状态。'
    })
    const savedViewsCreateText = getApiLiveCoverageForRow('/components/saved-views', 'props', {
      name: 'createText',
      type: 'string',
      description: '创建按钮文案。'
    })
    const savedViewsManageText = getApiLiveCoverageForRow('/components/saved-views', 'props', {
      name: 'manageText',
      type: 'string',
      description: '管理按钮文案。'
    })
    const colorPlaceholder = getApiLiveCoverageForRow('/components/color-picker', 'props', {
      name: 'placeholder',
      type: 'string',
      description: '文本输入占位值。'
    })
    const colorShowText = getApiLiveCoverageForRow('/components/color-picker', 'props', {
      name: 'showText',
      type: 'boolean',
      description: '是否在触发器中显示当前颜色文本。'
    })
    const configNamespace = getApiLiveCoverageForRow('/components/config-provider', 'props', {
      name: 'namespace',
      type: 'string',
      description: '组件库命名空间。'
    })
    const modalCloseOnOverlay = getApiLiveCoverageForRow('/components/modal', 'props', {
      name: 'closeOnOverlay',
      type: 'boolean',
      description: '点击遮罩是否请求关闭。'
    })
    const drawerCloseOnOverlay = getApiLiveCoverageForRow('/components/drawer', 'props', {
      name: 'closeOnOverlay',
      type: 'boolean',
      description: '点击遮罩是否请求关闭。'
    })
    const stepsSelectable = getApiLiveCoverageForRow('/components/steps', 'props', {
      name: 'selectable',
      type: 'boolean',
      description: '是否允许点击步骤触发选择。'
    })
    const fieldArrayAddText = getApiLiveCoverageForRow('/components/field-array', 'props', {
      name: 'addText',
      type: 'string',
      description: '添加按钮文案。'
    })
    const fieldArrayRemoveText = getApiLiveCoverageForRow('/components/field-array', 'props', {
      name: 'removeText',
      type: 'string',
      description: '删除按钮文案。'
    })

    expect(iconSpinning.href).toMatch(/^#live-example\?scenario=.+/)
    expect(savedViewsCreateText.href).toMatch(/^#live-example\?scenario=.+/)
    expect(savedViewsManageText.href).toMatch(/^#live-example\?scenario=.+/)
    expect(colorPlaceholder.href).toMatch(/^#live-example\?scenario=.+/)
    expect(colorShowText.href).toMatch(/^#live-example\?scenario=.+/)
    expect(configNamespace.href).toMatch(/^#live-example\?scenario=.+/)
    expect(modalCloseOnOverlay.href).toMatch(/^#live-example\?scenario=.+/)
    expect(drawerCloseOnOverlay.href).toMatch(/^#live-example\?scenario=.+/)
    expect(stepsSelectable.href).toMatch(/^#live-example\?scenario=.+/)
    expect(fieldArrayAddText.href).toMatch(/^#live-example\?scenario=.+/)
    expect(fieldArrayRemoveText.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links modal props, close event and slots to live example evidence', () => {
    const open = getApiLiveCoverageForRow('/components/modal', 'props', {
      name: 'open',
      type: 'boolean',
      description: '是否显示弹窗。'
    })
    const title = getApiLiveCoverageForRow('/components/modal', 'props', {
      name: 'title',
      type: 'string',
      description: '弹窗标题。'
    })
    const closeOnOverlay = getApiLiveCoverageForRow('/components/modal', 'props', {
      name: 'closeOnOverlay',
      type: 'boolean',
      description: '点击遮罩是否请求关闭。'
    })
    const closeOnEscape = getApiLiveCoverageForRow('/components/modal', 'props', {
      name: 'closeOnEscape',
      type: 'boolean',
      description: '按 Escape 是否请求关闭。'
    })
    const close = getApiLiveCoverageForRow('/components/modal', 'events', {
      name: 'close',
      type: 'void',
      description: '请求关闭。'
    })
    const defaultSlot = getApiLiveCoverageForRow('/components/modal', 'slots', {
      name: 'default',
      type: 'VNode',
      description: '弹窗主体内容。'
    })
    const footerSlot = getApiLiveCoverageForRow('/components/modal', 'slots', {
      name: 'footer',
      type: 'VNode',
      description: '底部操作区。'
    })

    expect(open.status).toBe('covered')
    expect(title.status).toBe('covered')
    expect(closeOnOverlay.href).toMatch(/^#live-example\?scenario=.+/)
    expect(closeOnEscape.href).toMatch(/^#live-example\?scenario=.+/)
    expect(close.status).toBe('covered')
    expect(close.label).toBe('Event log')
    expect(defaultSlot.label).toBe('Slot source')
    expect(footerSlot.label).toBe('Slot source')
  })

  it('links workflow content, form and table utility props to concrete scenarios', () => {
    const reviewer = getApiLiveCoverageForRow('/components/review-workflow', 'props', {
      name: 'reviewer',
      type: 'string',
      description: '审核人。'
    })
    const dueText = getApiLiveCoverageForRow('/components/review-workflow', 'props', {
      name: 'dueText',
      type: 'string',
      description: '到期信息。'
    })
    const listSplit = getApiLiveCoverageForRow('/components/list', 'props', {
      name: 'split',
      type: 'boolean',
      description: '是否显示分割线。'
    })
    const listLayout = getApiLiveCoverageForRow('/components/list', 'props', {
      name: 'layout',
      type: "'vertical' | 'grid'",
      description: '列表布局。'
    })
    const schemaSummaryTitle = getApiLiveCoverageForRow('/components/schema-form', 'props', {
      name: 'summaryTitle',
      type: 'string',
      description: '错误摘要标题。'
    })
    const schemaLabelWidth = getApiLiveCoverageForRow('/components/schema-form', 'props', {
      name: 'labelWidth',
      type: 'string',
      description: '标签宽度。'
    })
    const linkTarget = getApiLiveCoverageForRow('/components/link', 'props', {
      name: 'target',
      type: 'string',
      description: '链接打开目标。'
    })
    const virtualItemHeight = getApiLiveCoverageForRow('/components/virtual-list', 'props', {
      name: 'itemHeight',
      type: 'number',
      description: '单项高度。'
    })
    const inputNumberPlaceholder = getApiLiveCoverageForRow('/components/input-number', 'props', {
      name: 'placeholder',
      type: 'string',
      description: '占位文本。'
    })
    const timePickerPlaceholder = getApiLiveCoverageForRow('/components/time-picker', 'props', {
      name: 'placeholder',
      type: 'string',
      description: '占位文本。'
    })
    const tableCaption = getApiLiveCoverageForRow('/components/data-table', 'props', {
      name: 'caption',
      type: 'string',
      description: '表格标题。'
    })
    const tableSummary = getApiLiveCoverageForRow('/components/data-table', 'props', {
      name: 'summary',
      type: 'string',
      description: '摘要文案。'
    })
    const tableSelectable = getApiLiveCoverageForRow('/components/data-table', 'props', {
      name: 'selectable',
      type: 'boolean',
      description: '是否启用选择。'
    })
    const tablePage = getApiLiveCoverageForRow('/components/data-table', 'props', {
      name: 'page',
      type: 'number',
      description: '当前页。'
    })
    const tablePageSize = getApiLiveCoverageForRow('/components/data-table', 'props', {
      name: 'pageSize',
      type: 'number',
      description: '每页数量。'
    })
    const tableRefreshable = getApiLiveCoverageForRow('/components/data-table', 'props', {
      name: 'refreshable',
      type: 'boolean',
      description: '是否显示刷新。'
    })

    expect(reviewer.href).toMatch(/^#live-example\?scenario=.+/)
    expect(dueText.href).toMatch(/^#live-example\?scenario=.+/)
    expect(listSplit.href).toMatch(/^#live-example\?scenario=.+/)
    expect(listLayout.href).toMatch(/^#live-example\?scenario=.+/)
    expect(schemaSummaryTitle.href).toMatch(/^#live-example\?scenario=.+/)
    expect(schemaLabelWidth.href).toMatch(/^#live-example\?scenario=.+/)
    expect(linkTarget.href).toMatch(/^#live-example\?scenario=.+/)
    expect(virtualItemHeight.href).toMatch(/^#live-example\?scenario=.+/)
    expect(inputNumberPlaceholder.href).toMatch(/^#live-example\?scenario=.+/)
    expect(timePickerPlaceholder.href).toMatch(/^#live-example\?scenario=.+/)
    expect(tableCaption.href).toMatch(/^#live-example\?scenario=.+/)
    expect(tableSummary.href).toMatch(/^#live-example\?scenario=.+/)
    expect(tableSelectable.href).toMatch(/^#live-example\?scenario=.+/)
    expect(tablePage.href).toMatch(/^#live-example\?scenario=.+/)
    expect(tablePageSize.href).toMatch(/^#live-example\?scenario=.+/)
    expect(tableRefreshable.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('links the final source-only prop gaps to exact workflow scenarios', () => {
    const tooltipTheme = getApiLiveCoverageForRow('/components/tooltip', 'props', {
      name: 'theme',
      type: "'dark' | 'light'",
      description: '主题。'
    })
    const crudHeadingLevel = getApiLiveCoverageForRow('/components/crud-layout', 'props', {
      name: 'headingLevel',
      type: '1 | 2 | 3',
      description: '标题层级。'
    })
    const dropdownHideOnClick = getApiLiveCoverageForRow('/components/dropdown', 'props', {
      name: 'hideOnClick',
      type: 'boolean',
      description: '选择菜单项后是否自动关闭。'
    })
    const uploadButtonLabel = getApiLiveCoverageForRow('/components/upload', 'props', {
      name: 'buttonLabel',
      type: 'string',
      description: '选择按钮文案。'
    })
    const selectPlaceholder = getApiLiveCoverageForRow('/components/select', 'props', {
      name: 'placeholder',
      type: 'string',
      description: '占位文本。'
    })

    expect(tooltipTheme.href).toMatch(/^#live-example\?scenario=.+/)
    expect(crudHeadingLevel.href).toMatch(/^#live-example\?scenario=.+/)
    expect(dropdownHideOnClick.href).toMatch(/^#live-example\?scenario=.+/)
    expect(uploadButtonLabel.href).toMatch(/^#live-example\?scenario=.+/)
    expect(selectPlaceholder.href).toMatch(/^#live-example\?scenario=.+/)
  })

  it('reports missing coverage when a docs route has no live example profile', () => {
    const coverage = getApiLiveCoverageForRow('/guide/introduction', 'props', {
      name: 'modelValue',
      type: 'string',
      description: '模型值。'
    })

    expect(coverage.status).toBe('missing')
    expect(coverage.label).toBe('Needs live')
    expect(coverage.href).toBe('#live-example')
  })

  it('links events, slots and types to runner evidence sections', () => {
    const eventCoverage = getApiLiveCoverageForRow('/components/link', 'events', {
      name: 'click',
      type: 'MouseEvent',
      description: '非禁用状态下点击链接时触发。'
    })
    const slotCoverage = getApiLiveCoverageForRow('/components/button', 'slots', {
      name: 'default',
      type: 'VNode',
      description: '按钮内容。'
    })
    const typeCoverage = getApiLiveCoverageForRow('/components/link', 'types', {
      name: 'YLinkTone',
      type: "'primary' | 'neutral'",
      description: '链接语义色类型。'
    })
    const methodCoverage = getApiLiveCoverageForRow('/components/table', 'methods', {
      name: 'clearFilter',
      type: '(columnKeys?: string[]) => void',
      description: '清除指定列或全部列筛选状态。'
    })

    expect(eventCoverage.status).toBe('covered')
    expect(eventCoverage.label).toBe('Event log')
    expect(eventCoverage.href).toBe('#live-example-event-log')
    expect(slotCoverage.status).toBe('covered')
    expect(slotCoverage.label).toBe('Slot source')
    expect(typeCoverage.status).toBe('covered')
    expect(typeCoverage.label).toBe('Type map')
    expect(methodCoverage.status).toBe('covered')
    expect(methodCoverage.label).toBe('Method plan')
    expect(methodCoverage.href).toBe('#live-example-test-plan')
  })

  it('improves API live map coverage beyond source-only links', () => {
    const summary = getApiLiveCoverageSummary()

    expect(summary.coverageRate).toBe(100)
    expect(summary.nextQueue.map((item) => ({
      component: item.component.name,
      gaps: item.gapRows.map((gap) => `${gap.kind}:${gap.row.name}:${gap.coverage.label}`)
    }))).toEqual([])
    expect(summary.sourceOnlyRows).toBeLessThan(summary.coveredRows)
  })

  it('summarizes API rows that are connected back to live example evidence', () => {
    const items = getApiLiveCoverageItems()
    const summary = getApiLiveCoverageSummary()
    const button = items.find((item) => item.component.name === 'YButton')

    expect(items.length).toBeGreaterThan(0)
    expect(summary.totalRows).toBeGreaterThan(0)
    expect(summary.coveredRows).toBeGreaterThan(0)
    expect(summary.coverageRate).toBeGreaterThan(0)
    expect(summary.scenarioRows).toBeGreaterThan(0)
    expect(summary.livePropRows).toBeGreaterThan(0)
    expect(summary.eventLogRows).toBeGreaterThan(0)
    expect(summary.methodPlanRows).toBeGreaterThan(0)
    expect(summary.slotSourceRows).toBeGreaterThan(0)
    expect(summary.typeMapRows).toBeGreaterThan(0)
    expect(summary.nextQueue.length).toBeLessThanOrEqual(8)
    expect(button?.rows.some((item) => item.row.name === 'variant' && item.coverage.label === 'Example')).toBe(true)
  })
})
