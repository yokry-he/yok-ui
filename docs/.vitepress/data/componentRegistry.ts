export type ComponentPackage =
  | '@yok-ui/core'
  | '@yok-ui/product'
  | '@yok-ui/admin'
  | '@yok-ui/brand'

export type ComponentStatus = 'Stable' | 'Beta' | 'Planned'

export type ComponentFamily =
  | 'basic'
  | 'form'
  | 'feedback'
  | 'overlay'
  | 'data'
  | 'productivity'
  | 'admin'
  | 'brand'
  | 'theme'

export interface ComponentMeta {
  name: string
  title: string
  packageName: ComponentPackage
  family: ComponentFamily
  status: ComponentStatus
  docs: string
  description: string
  since: string
  accessibility: 'native' | 'documented' | 'needs-review'
}

export interface ApiRow {
  name: string
  type: string
  defaultValue?: string
  description: string
  required?: boolean
}

export interface ComponentApi {
  props?: ApiRow[]
  slots?: ApiRow[]
  events?: ApiRow[]
  methods?: ApiRow[]
  types?: ApiRow[]
}

export const componentFamilies: Array<{
  id: ComponentFamily
  title: string
  description: string
}> = [
  {
    id: 'basic',
    title: 'Basic',
    description: '基础动作、布局容器和轻量状态展示。'
  },
  {
    id: 'form',
    title: 'Form',
    description: '常见输入控件，覆盖产品和后台表单的基础能力。'
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: '提示、空状态、徽标和轻量反馈。'
  },
  {
    id: 'overlay',
    title: 'Overlay & Navigation',
    description: '弹层、菜单、分页和内容切换。'
  },
  {
    id: 'data',
    title: 'Data Display',
    description: '结构化数据和内容展示。'
  },
  {
    id: 'productivity',
    title: 'Productivity',
    description: '个人产品、效率工具和开发者体验。'
  },
  {
    id: 'admin',
    title: 'Admin',
    description: '后台页面的标题、指标、筛选和工具栏。'
  },
  {
    id: 'brand',
    title: 'Brand',
    description: '个人主页、作品集和产品官网展示。'
  },
  {
    id: 'theme',
    title: 'Theme',
    description: '主题容器、主题切换和 token 工具。'
  }
]

export const components: ComponentMeta[] = [
  {
    name: 'YThemeProvider',
    title: 'Theme Provider',
    packageName: '@yok-ui/core',
    family: 'theme',
    status: 'Stable',
    docs: '/guide/theming',
    description: '为局部区域注入 Yok UI 主题变量。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YConfigProvider',
    title: 'Config Provider',
    packageName: '@yok-ui/core',
    family: 'theme',
    status: 'Stable',
    docs: '/components/config-provider',
    description: '为子组件提供全局 size、density、locale 和 namespace 配置。',
    since: '0.6.0',
    accessibility: 'documented'
  },
  {
    name: 'YButton',
    title: 'Button',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Stable',
    docs: '/components/button',
    description: '触发页面中的主要和次要动作。',
    since: '0.1.0',
    accessibility: 'native'
  },
  {
    name: 'YIconButton',
    title: 'Icon Button',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Stable',
    docs: '/components/button',
    description: '用于工具栏和紧凑操作区的图标按钮。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YIcon',
    title: 'Icon',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Stable',
    docs: '/components/icon',
    description: '统一 SVG 图标尺寸、颜色、旋转和可访问语义。',
    since: '0.6.0',
    accessibility: 'documented'
  },
  {
    name: 'YAvatar',
    title: 'Avatar',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Stable',
    docs: '/components/avatar',
    description: '用户、团队和对象的头像展示，支持图片和 initials fallback。',
    since: '0.4.0',
    accessibility: 'documented'
  },
  {
    name: 'YAvatarGroup',
    title: 'Avatar Group',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Stable',
    docs: '/components/avatar',
    description: '多人、团队和协作对象头像组，支持重叠排列和剩余数量折叠。',
    since: '0.7.0',
    accessibility: 'documented'
  },
  {
    name: 'YCalendar',
    title: 'Calendar',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/calendar',
    description: '月视图日历，支持受控日期、面板切换、禁用日期和日期格自定义。',
    since: '0.6.0',
    accessibility: 'documented'
  },
  {
    name: 'YCarousel',
    title: 'Carousel',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/carousel',
    description: '轮播展示区域，支持受控索引、方向键、自动播放、指示器位置和自定义 slide 内容。',
    since: '0.6.0',
    accessibility: 'documented'
  },
  {
    name: 'YInput',
    title: 'Input',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Stable',
    docs: '/components/input',
    description: '单行文本输入。',
    since: '0.1.0',
    accessibility: 'native'
  },
  {
    name: 'YAutocomplete',
    title: 'Autocomplete',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/autocomplete',
    description: '自由文本输入时展示建议列表，适合搜索、命令和对象快速补全。',
    since: '0.9.0',
    accessibility: 'documented'
  },
  {
    name: 'YMention',
    title: 'Mention',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/mention',
    description: '在多行文本中输入 @ 或 # 时展示提及建议，适合协作、评论和发布说明。',
    since: '0.9.0',
    accessibility: 'documented'
  },
  {
    name: 'YLink',
    title: 'Link',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Stable',
    docs: '/components/link',
    description: '主题化文本链接，支持外链、安全 rel、禁用态和下划线策略。',
    since: '0.5.0',
    accessibility: 'native'
  },
  {
    name: 'YText',
    title: 'Text',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Stable',
    docs: '/components/text',
    description: '基础文本语义、强调、标记、代码和截断展示。',
    since: '0.5.0',
    accessibility: 'native'
  },
  {
    name: 'YInputNumber',
    title: 'Input Number',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/input-number',
    description: '带步进按钮、边界和精度控制的数字输入。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YSlider',
    title: 'Slider',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/slider',
    description: '范围内连续或分步选择数字值。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YRate',
    title: 'Rate',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/rate',
    description: '评分、满意度和偏好选择。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YColorPicker',
    title: 'Color Picker',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/color-picker',
    description: 'HEX 颜色输入、原生色板和预设色选择。',
    since: '0.1.0',
    accessibility: 'native'
  },
  {
    name: 'YDatePicker',
    title: 'Date Picker',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/date-picker',
    description: '单日期选择、月份切换和键盘可访问日历。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YDateRangePicker',
    title: 'Date Range Picker',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/date-range-picker',
    description: '日期范围选择、范围高亮和键盘可访问日历。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YTimePicker',
    title: 'Time Picker',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/time-picker',
    description: '单时间选择、分钟步长和禁用时间。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YCascader',
    title: 'Cascader',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/cascader',
    description: '层级路径选择输入。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YTextarea',
    title: 'Textarea',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Stable',
    docs: '/components/textarea',
    description: '多行文本输入。',
    since: '0.1.0',
    accessibility: 'native'
  },
  {
    name: 'YSelect',
    title: 'Select',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Stable',
    docs: '/components/select',
    description: '基于 Floating UI 的可访问 combobox 选择器，支持单选、多选、清空和尺寸密度。',
    since: '0.1.0',
    accessibility: 'native'
  },
  {
    name: 'YTreeSelect',
    title: 'Tree Select',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/tree-select',
    description: '树形数据选择器，支持单选、多选、过滤、任意层级选择和 Floating UI 弹层。',
    since: '0.10.0',
    accessibility: 'documented'
  },
  {
    name: 'YForm',
    title: 'Form',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/form',
    description: '表单数据、字段规则、校验状态和提交流程容器。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YFormItem',
    title: 'Form Item',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Stable',
    docs: '/components/form-item',
    description: '表单标签、帮助信息和错误状态容器。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YFormSummary',
    title: 'Form Summary',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Stable',
    docs: '/components/form-summary',
    description: '聚合表单错误并帮助用户跳转到对应字段。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YCheckbox',
    title: 'Checkbox',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Stable',
    docs: '/components/checkbox',
    description: '多选和布尔状态输入。',
    since: '0.1.0',
    accessibility: 'native'
  },
  {
    name: 'YRadioGroup',
    title: 'Radio Group',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Stable',
    docs: '/components/radio-group',
    description: '单选组选项。',
    since: '0.1.0',
    accessibility: 'native'
  },
  {
    name: 'YSwitch',
    title: 'Switch',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Stable',
    docs: '/components/switch',
    description: '即时开关型布尔控件。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YUpload',
    title: 'Upload',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/upload',
    description: '文件选择、文件列表和上传状态展示底座。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YTransfer',
    title: 'Transfer',
    packageName: '@yok-ui/core',
    family: 'form',
    status: 'Beta',
    docs: '/components/transfer',
    description: '双栏穿梭选择，适合权限、成员和资源分配。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YTabs',
    title: 'Tabs',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Stable',
    docs: '/components/tabs',
    description: '同级内容切换。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YPagination',
    title: 'Pagination',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Stable',
    docs: '/components/pagination',
    description: '列表和表格分页。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YBreadcrumb',
    title: 'Breadcrumb',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Stable',
    docs: '/components/breadcrumb',
    description: '页面层级路径和返回上级的轻量导航。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YMenu',
    title: 'Menu',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Beta',
    docs: '/components/menu',
    description: '应用主导航、侧边栏和分组菜单，支持水平/垂直、子菜单、折叠和键盘路径。',
    since: '0.6.0',
    accessibility: 'documented'
  },
  {
    name: 'YBacktop',
    title: 'Backtop',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Stable',
    docs: '/components/backtop',
    description: '长页面返回顶部按钮。',
    since: '0.4.0',
    accessibility: 'native'
  },
  {
    name: 'YFloatButton',
    title: 'Float Button',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Beta',
    docs: '/components/float-button',
    description: '固定在页面边缘的全局快捷动作，适合创建、帮助、反馈和返回顶部。',
    since: '0.12.0',
    accessibility: 'documented'
  },
  {
    name: 'YFloatButtonGroup',
    title: 'Float Button Group',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Beta',
    docs: '/components/float-button',
    description: '可展开的浮动快捷动作组，支持 click、hover、受控 open 和 action item。',
    since: '0.12.0',
    accessibility: 'documented'
  },
  {
    name: 'YAffix',
    title: 'Affix',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Beta',
    docs: '/components/affix',
    description: '将工具栏、页内导航或操作区固定在滚动视口边缘，支持 offset、top/bottom 和目标容器。',
    since: '0.7.0',
    accessibility: 'documented'
  },
  {
    name: 'YAnchor',
    title: 'Anchor',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Beta',
    docs: '/components/anchor',
    description: '页内锚点导航，支持竖向/横向、滚动容器、偏移量、active 同步和手动 scrollTo。',
    since: '0.7.0',
    accessibility: 'documented'
  },
  {
    name: 'YSteps',
    title: 'Steps',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Stable',
    docs: '/components/steps',
    description: '流程、发布向导和任务进度的步骤导航。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YTour',
    title: 'Tour',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Beta',
    docs: '/components/tour',
    description: '产品引导、功能发现和逐步新手教程。',
    since: '0.9.0',
    accessibility: 'documented'
  },
  {
    name: 'YModal',
    title: 'Modal',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Beta',
    docs: '/components/modal',
    description: '居中确认和短任务弹窗。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YDrawer',
    title: 'Drawer',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Beta',
    docs: '/components/drawer',
    description: '侧边任务流和详情面板。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YDropdown',
    title: 'Dropdown',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Beta',
    docs: '/components/dropdown',
    description: '按钮菜单和轻量选项列表。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YPopover',
    title: 'Popover',
    packageName: '@yok-ui/core',
    family: 'overlay',
    status: 'Beta',
    docs: '/components/popover',
    description: '短内容浮层和上下文说明。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YPopconfirm',
    title: 'Popconfirm',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Stable',
    docs: '/components/popconfirm',
    description: '轻量确认弹层，用于低风险但需要确认的操作。',
    since: '0.4.0',
    accessibility: 'documented'
  },
  {
    name: 'YMessage',
    title: 'Message',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Stable',
    docs: '/components/message',
    description: '组件式与命令式轻量反馈提示。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YMessageBox',
    title: 'Message Box',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Beta',
    docs: '/components/message-box',
    description: 'Promise 驱动的确认、警告和输入确认弹窗。',
    since: '0.11.0',
    accessibility: 'documented'
  },
  {
    name: 'YNotification',
    title: 'Notification',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Beta',
    docs: '/components/notification',
    description: '组件式与命令式通知，用于展示标题、长内容、位置和手动关闭。',
    since: '0.6.0',
    accessibility: 'documented'
  },
  {
    name: 'YAlert',
    title: 'Alert',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Stable',
    docs: '/components/alert',
    description: '持久化状态提示条。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YTable',
    title: 'Table',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Stable',
    docs: '/components/table',
    description: '结构化数据展示。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YList',
    title: 'List',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/list',
    description: '消息、资源、任务和内容条目的轻量列表。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YDescriptions',
    title: 'Descriptions',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/descriptions',
    description: '详情页、审核信息和配置摘要的只读字段展示。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YImage',
    title: 'Image',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/image',
    description: '图片加载、失败占位和可访问预览。',
    since: '0.5.0',
    accessibility: 'documented'
  },
  {
    name: 'YQRCode',
    title: 'QRCode',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/qr-code',
    description: '把文本、链接、票据和支付标识转换成可访问 SVG 二维码。',
    since: '0.12.0',
    accessibility: 'documented'
  },
  {
    name: 'YSegmented',
    title: 'Segmented',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/segmented',
    description: '紧凑的互斥选项切换，适合视图模式、周期、密度和筛选维度。',
    since: '0.6.0',
    accessibility: 'documented'
  },
  {
    name: 'YStatistic',
    title: 'Statistic',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/statistic',
    description: '统计数值、余额、趋势和简短指标展示。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YCountdown',
    title: 'Countdown',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/statistic',
    description: '目标时间倒计时指标，适合活动、订单、任务和服务时间提醒。',
    since: '0.5.0',
    accessibility: 'documented'
  },
  {
    name: 'YTimeline',
    title: 'Timeline',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/timeline',
    description: '活动、日志、版本记录和事件轨迹展示。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YVirtualList',
    title: 'Virtual List',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/virtual-list',
    description: '大数据量列表的固定行高虚拟滚动容器。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YTree',
    title: 'Tree',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Beta',
    docs: '/components/tree',
    description: '层级数据、权限结构和分类导航。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YCollapse',
    title: 'Collapse',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Stable',
    docs: '/components/collapse',
    description: '折叠内容面板，用于 FAQ、设置组和长内容分段。',
    since: '0.4.0',
    accessibility: 'documented'
  },
  {
    name: 'YCard',
    title: 'Card',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Stable',
    docs: '/components/card',
    description: '重复内容和工具区域容器。',
    since: '0.1.0',
    accessibility: 'native'
  },
  {
    name: 'YWatermark',
    title: 'Watermark',
    packageName: '@yok-ui/core',
    family: 'data',
    status: 'Stable',
    docs: '/components/watermark',
    description: '为内容区域添加不可交互的文字水印。',
    since: '0.4.0',
    accessibility: 'native'
  },
  {
    name: 'YDivider',
    title: 'Divider',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Stable',
    docs: '/components/divider',
    description: '内容分组和分割。',
    since: '0.1.0',
    accessibility: 'native'
  },
  {
    name: 'YLayout',
    title: 'Layout',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Beta',
    docs: '/components/layout',
    description: '页面级 flex 骨架，组织 Header、Aside、Main 和 Footer，适合官网、文档和后台壳层。',
    since: '0.7.0',
    accessibility: 'documented'
  },
  {
    name: 'YSplitter',
    title: 'Splitter',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Beta',
    docs: '/components/splitter',
    description: '可拖拽调整的分割面板，用于文档、后台和编辑器式工作区。',
    since: '0.8.0',
    accessibility: 'verified'
  },
  {
    name: 'YSpace',
    title: 'Space',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Stable',
    docs: '/components/space',
    description: '为按钮、标签、工具项和表单片段提供一致间距。',
    since: '0.5.0',
    accessibility: 'native'
  },
  {
    name: 'YScrollbar',
    title: 'Scrollbar',
    packageName: '@yok-ui/core',
    family: 'basic',
    status: 'Stable',
    docs: '/components/scrollbar',
    description: '替代原生滚动区域，提供统一尺寸、滚动事件和横向滚动支持。',
    since: '0.5.0',
    accessibility: 'documented'
  },
  {
    name: 'YTooltip',
    title: 'Tooltip',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Beta',
    docs: '/components/tooltip',
    description: '悬停或聚焦时显示短说明。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YSkeleton',
    title: 'Skeleton',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Stable',
    docs: '/components/skeleton',
    description: '加载中内容的文本、头像和卡片占位。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YLoading',
    title: 'Loading',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Beta',
    docs: '/components/loading',
    description: '容器、局部区域和全屏任务的加载遮罩与状态提示。',
    since: '0.8.0',
    accessibility: 'documented'
  },
  {
    name: 'YProgress',
    title: 'Progress',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Stable',
    docs: '/components/progress',
    description: '任务、上传、配额和后台流程的线性进度反馈。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YResult',
    title: 'Result',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Beta',
    docs: '/components/result',
    description: '页面级操作结果、异常状态和完成反馈。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YTag',
    title: 'Tag',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Stable',
    docs: '/components/tag-badge',
    description: '短标签、状态和分类。',
    since: '0.1.0',
    accessibility: 'native'
  },
  {
    name: 'YBadge',
    title: 'Badge',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Stable',
    docs: '/components/tag-badge',
    description: '计数、通知和小型状态标识。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YEmpty',
    title: 'Empty',
    packageName: '@yok-ui/core',
    family: 'feedback',
    status: 'Stable',
    docs: '/components/empty',
    description: '空状态展示和下一步操作。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YCommandPalette',
    title: 'Command Palette',
    packageName: '@yok-ui/product',
    family: 'productivity',
    status: 'Beta',
    docs: '/components/command-palette',
    description: '快捷命令搜索和执行入口。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YCopyButton',
    title: 'Copy Button',
    packageName: '@yok-ui/product',
    family: 'productivity',
    status: 'Stable',
    docs: '/components/code-block',
    description: '复制命令、代码和短文本。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YCodeBlock',
    title: 'Code Block',
    packageName: '@yok-ui/product',
    family: 'productivity',
    status: 'Stable',
    docs: '/components/code-block',
    description: '带复制动作的代码块。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YThemeSwitcher',
    title: 'Theme Switcher',
    packageName: '@yok-ui/product',
    family: 'theme',
    status: 'Stable',
    docs: '/components/theme-switcher',
    description: '在 Yok UI 主题之间切换。',
    since: '0.1.0',
    accessibility: 'documented'
  },
  {
    name: 'YPageHeader',
    title: 'Page Header',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Stable',
    docs: '/components/page-header',
    description: '后台页面标题、描述和操作区。',
    since: '0.2.0',
    accessibility: 'native'
  },
  {
    name: 'YMetricCard',
    title: 'Metric Card',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Stable',
    docs: '/components/metric-card',
    description: '指标、趋势和状态摘要。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YSearchPanel',
    title: 'Search Panel',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/search-panel',
    description: '后台筛选和搜索表单容器。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YSearchForm',
    title: 'Search Form',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/search-form',
    description: '后台列表页的高级搜索表单，支持折叠、重置和查询 payload。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YCrudLayout',
    title: 'CRUD Layout',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/crud-layout',
    description: '后台资源管理页的标题、筛选、工具区、列表和侧栏布局。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YFilterTabs',
    title: 'Filter Tabs',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/filter-tabs',
    description: '后台列表页的状态筛选标签组。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YDataTable',
    title: 'Data Table',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/data-table',
    description: '后台列表页的工具栏、表格、批量状态和分页组合。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YDataView',
    title: 'Data View',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/data-view',
    description: '把保存视图、表格偏好、筛选摘要和分页组合成后台列表页视图。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YResourcePage',
    title: 'Resource Page',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/resource-page',
    description: '后台资源管理页模板，组合标题、搜索、保存视图、数据表和详情抽屉。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YSchemaForm',
    title: 'Schema Form',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/schema-form',
    description: '后台配置化表单，支持 schema 字段、规则校验、错误摘要和字段联动。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YFieldArray',
    title: 'Field Array',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/field-array',
    description: '动态字段数组，支持添加、删除、最小/最大数量和 slot 自定义项内容。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YBulkActionBar',
    title: 'Bulk Action Bar',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/bulk-action-bar',
    description: '后台列表页的批量选择状态和操作条。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YStatusTimeline',
    title: 'Status Timeline',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/status-timeline',
    description: '审核、发布和订单处理等状态流转时间线。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YReviewWorkflow',
    title: 'Review Workflow',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/review-workflow',
    description: '审核、发布和回退流程的状态时间线与决策操作组合。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YSavedViews',
    title: 'Saved Views',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Beta',
    docs: '/components/saved-views',
    description: '后台列表页的保存视图、筛选方案和快速切换控件。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YDataToolbar',
    title: 'Data Toolbar',
    packageName: '@yok-ui/admin',
    family: 'admin',
    status: 'Stable',
    docs: '/components/data-toolbar',
    description: '列表页批量操作、搜索和工具按钮。',
    since: '0.2.0',
    accessibility: 'documented'
  },
  {
    name: 'YBrandHero',
    title: 'Brand Hero',
    packageName: '@yok-ui/brand',
    family: 'brand',
    status: 'Stable',
    docs: '/components/brand-hero',
    description: '品牌页首屏与 CTA 区域。',
    since: '0.3.0',
    accessibility: 'documented'
  },
  {
    name: 'YFeatureGrid',
    title: 'Feature Grid',
    packageName: '@yok-ui/brand',
    family: 'brand',
    status: 'Stable',
    docs: '/components/feature-grid',
    description: '特性、服务和卖点网格。',
    since: '0.3.0',
    accessibility: 'native'
  },
  {
    name: 'YProfileCard',
    title: 'Profile Card',
    packageName: '@yok-ui/brand',
    family: 'brand',
    status: 'Stable',
    docs: '/components/profile-card',
    description: '个人介绍、身份和链接展示。',
    since: '0.3.0',
    accessibility: 'documented'
  },
  {
    name: 'YLogoCloud',
    title: 'Logo Cloud',
    packageName: '@yok-ui/brand',
    family: 'brand',
    status: 'Stable',
    docs: '/components/logo-cloud',
    description: '客户、技术栈或合作方标识墙。',
    since: '0.3.0',
    accessibility: 'native'
  }
]

export const componentApis: Record<string, ComponentApi> = {
  YButton: {
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost'",
        defaultValue: "'secondary'",
        description: '按钮视觉等级。'
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '按钮尺寸。'
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: '加载中状态，会禁用点击并暴露 aria-busy。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用状态。'
      },
      {
        name: 'block',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否撑满父容器宽度，适合移动端底部动作和表单主按钮。'
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        defaultValue: "'button'",
        description: '原生 button type。'
      }
    ],
    slots: [
      {
        name: 'default',
        type: 'VNode',
        description: '按钮内容。'
      }
    ]
  },
  YAlert: {
    props: [
      {
        name: 'tone',
        type: "'info' | 'success' | 'warning' | 'danger'",
        defaultValue: "'info'",
        description: '提示语义类型。'
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '提示标题。'
      },
      {
        name: 'closable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否展示关闭按钮。'
      },
      {
        name: 'role',
        type: "'status' | 'alert'",
        defaultValue: "'status'",
        description: '状态播报语义，非阻塞反馈使用 status，错误摘要使用 alert。'
      },
      {
        name: 'closeLabel',
        type: 'string',
        defaultValue: "'Close alert'",
        description: '关闭按钮可访问名称。'
      },
      {
        name: 'closeText',
        type: 'string',
        defaultValue: "''",
        description: '关闭按钮可见文本；为空时显示默认关闭符号。'
      },
      {
        name: 'icon',
        type: 'string',
        defaultValue: "''",
        description: '自定义图标文本；为空时按 tone 使用默认状态图标。'
      },
      {
        name: 'showIcon',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否显示状态图标。'
      },
      {
        name: 'variant',
        type: "'soft' | 'outline' | 'solid'",
        defaultValue: "'soft'",
        description: '视觉变体，覆盖柔和、描边和强调反馈。'
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '尺寸密度。'
      },
      {
        name: 'banner',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否使用无圆角横幅样式。'
      }
    ],
    events: [
      {
        name: 'close',
        type: 'void',
        description: '点击关闭按钮时触发。'
      }
    ],
    slots: [
      {
        name: 'default',
        type: 'VNode',
        description: '提示正文内容。'
      },
      {
        name: 'icon',
        type: 'VNode',
        description: '自定义图标内容。'
      },
      {
        name: 'action',
        type: 'VNode',
        description: '右侧操作区，例如查看详情、撤销或重试按钮。'
      }
    ],
    types: [
      { name: 'YAlertTone', type: "'info' | 'success' | 'warning' | 'danger'", description: '提示语义类型。' },
      { name: 'YAlertRole', type: "'status' | 'alert'", description: '状态播报语义。' },
      { name: 'YAlertVariant', type: "'soft' | 'outline' | 'solid'", description: '视觉变体。' },
      { name: 'YAlertSize', type: "'sm' | 'md' | 'lg'", description: '尺寸密度。' }
    ]
  },
  YInput: {
    props: [
      {
        name: 'id',
        type: 'string',
        defaultValue: "''",
        description: '传给内部 input 的 id，常用于和 FormItem label 关联。'
      },
      {
        name: 'modelValue',
        type: 'string',
        defaultValue: "''",
        description: '输入值，支持 v-model。'
      },
      {
        name: 'type',
        type: "'text' | 'search' | 'password' | 'email' | 'url' | 'tel'",
        defaultValue: "'text'",
        description: '原生 input 类型，覆盖文本、搜索、密码、邮箱、URL 和电话输入。'
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: '输入框上方标签。'
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "''",
        description: '占位文本。'
      },
      {
        name: 'prefixText',
        type: 'string',
        defaultValue: "''",
        description: '输入框前缀文本，适合搜索符号、协议或命名空间提示。'
      },
      {
        name: 'suffixText',
        type: 'string',
        defaultValue: "''",
        description: '输入框后缀文本，适合单位、域名或固定上下文。'
      },
      {
        name: 'showPassword',
        type: 'boolean',
        defaultValue: 'false',
        description: '当 type 为 password 时显示密码可见性切换按钮。'
      },
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'false',
        description: '有值且未禁用时显示清空按钮。'
      },
      {
        name: 'showCount',
        type: 'boolean',
        defaultValue: 'false',
        description: '显示当前字数；配合 maxlength 时显示当前值/最大长度。'
      },
      {
        name: 'maxlength',
        type: 'number',
        defaultValue: 'undefined',
        description: '原生最大输入长度。'
      },
      {
        name: 'autocomplete',
        type: 'string',
        defaultValue: "''",
        description: '原生 autocomplete 属性。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: '无可见 label 或需要覆盖可访问名称时传给内部 input 的 aria-label。'
      },
      {
        name: 'error',
        type: 'string',
        defaultValue: "''",
        description: '错误提示，同时会把输入框标记为 aria-invalid。'
      },
      {
        name: 'invalid',
        type: 'boolean',
        defaultValue: 'false',
        description: '外部表单校验传入的无效状态。'
      },
      {
        name: 'ariaDescribedby',
        type: 'string',
        defaultValue: "''",
        description: '传给内部 input 的 aria-describedby。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用输入框。'
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: 'ConfigProvider size',
        description: '输入框尺寸；未传入时读取 ConfigProvider。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'string',
        description: '输入值变化时触发。'
      },
      {
        name: 'change',
        type: 'string',
        description: '原生 change 触发或点击清空时提交当前值。'
      },
      {
        name: 'clear',
        type: 'void',
        description: '点击清空按钮时触发。'
      },
      {
        name: 'focus',
        type: 'FocusEvent',
        description: '输入框获得焦点时触发。'
      },
      {
        name: 'blur',
        type: 'FocusEvent',
        description: '输入框失去焦点时触发。'
      }
    ]
  },
  YAutocomplete: {
    props: [
      { name: 'id', type: 'string', defaultValue: "''", description: '传给内部 input 的 id，常用于和 FormItem label 关联。' },
      { name: 'modelValue', type: 'string', defaultValue: "''", description: '当前输入文本，支持 v-model；可以是任意自由文本，不要求存在于 options。' },
      { name: 'options', type: 'YAutocompleteOption[]', description: '建议项列表，组件会按 label 和 value 进行本地过滤。', required: true },
      { name: 'label', type: 'string', defaultValue: "''", description: '输入框上方标签，同时作为建议列表的可访问名称来源。' },
      { name: 'placeholder', type: 'string', defaultValue: "'Type to search'", description: '占位文本。' },
      { name: 'error', type: 'string', defaultValue: "''", description: '错误提示，同时会把输入框标记为 aria-invalid。' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false', description: '外部表单校验传入的无效状态。' },
      { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: '传给内部 input 的 aria-describedby，通常来自 YFormItem 的 messageId。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用输入和建议选择。' },
      { name: 'clearable', type: 'boolean', defaultValue: 'false', description: '有值且未禁用时显示清空按钮。' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '展示异步建议加载状态；适合远程搜索场景。' },
      { name: 'loadingText', type: 'string', defaultValue: "'Loading suggestions'", description: '加载状态文案。' },
      { name: 'emptyText', type: 'string', defaultValue: "'No suggestions'", description: '没有匹配建议时的空状态文案。' },
      { name: 'size', type: 'YAutocompleteSize', defaultValue: 'ConfigProvider size', description: '输入框尺寸；未传入时把 ConfigProvider 的 sm/md/lg 映射为 small/medium/large。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'string', description: '输入文本变化或选择建议时触发，支持 v-model。' },
      { name: 'change', type: 'string', description: '输入失焦、选择建议或清空时提交当前文本。' },
      { name: 'search', type: 'string', description: '用户输入时触发，适合远程搜索和日志记录。' },
      { name: 'select', type: 'YAutocompleteOption', description: '点击或键盘确认某个可用建议时触发。' },
      { name: 'clear', type: 'void', description: '点击清空按钮时触发。' },
      { name: 'visibleChange', type: 'boolean', description: '建议面板打开或关闭时触发。' },
      { name: 'focus', type: 'FocusEvent', description: '输入框获得焦点时触发。' },
      { name: 'blur', type: 'FocusEvent', description: '输入框失去焦点时触发。' }
    ],
    types: [
      { name: 'YAutocompleteOption', type: '{ label: string; value: string; description?: string; disabled?: boolean }', description: '建议项配置；disabled 选项可展示但不能选择。' },
      { name: 'YAutocompleteSize', type: "'small' | 'medium' | 'large'", description: 'Autocomplete 尺寸类型。' }
    ]
  },
  YMention: {
    props: [
      { name: 'id', type: 'string', defaultValue: "''", description: '传给内部 textarea 的 id，常用于和 FormItem label 关联。' },
      { name: 'modelValue', type: 'string', defaultValue: "''", description: '当前多行文本，支持 v-model。' },
      { name: 'options', type: 'YMentionOption[]', description: '提及建议列表；组件会按 label 和 value 过滤当前 token。', required: true },
      { name: 'label', type: 'string', defaultValue: "''", description: '输入框上方标签，同时作为建议列表的可访问名称来源。' },
      { name: 'placeholder', type: 'string', defaultValue: "'Type @ to mention'", description: '占位文本。' },
      { name: 'prefix', type: 'string | string[]', defaultValue: "'@'", description: '触发提及建议的前缀，支持 @、# 等多前缀。' },
      { name: 'rows', type: 'number', defaultValue: '3', description: 'textarea 行数。' },
      { name: 'error', type: 'string', defaultValue: "''", description: '错误提示，同时会把 textarea 标记为 aria-invalid。' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false', description: '外部表单校验传入的无效状态。' },
      { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: '传给内部 textarea 的 aria-describedby，通常来自 YFormItem 的 messageId。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用输入和建议选择。' },
      { name: 'clearable', type: 'boolean', defaultValue: 'false', description: '有值且未禁用时显示清空按钮。' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '展示异步建议加载状态；适合远程成员搜索。' },
      { name: 'loadingText', type: 'string', defaultValue: "'Loading mentions'", description: '加载状态文案。' },
      { name: 'emptyText', type: 'string', defaultValue: "'No mentions'", description: '没有匹配建议时的空状态文案。' },
      { name: 'size', type: 'YMentionSize', defaultValue: 'ConfigProvider size', description: '输入框尺寸；未传入时把 ConfigProvider 的 sm/md/lg 映射为 small/medium/large。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'string', description: '文本变化或选择建议时触发，支持 v-model。' },
      { name: 'change', type: 'string', description: '输入失焦、选择建议或清空时提交当前文本。' },
      { name: 'search', type: '(query: string, prefix: string)', description: '用户输入提及 token 时触发，适合远程成员搜索。' },
      { name: 'select', type: '(option: YMentionOption, prefix: string)', description: '点击或键盘确认某个可用建议时触发。' },
      { name: 'clear', type: 'void', description: '点击清空按钮时触发。' },
      { name: 'visibleChange', type: 'boolean', description: '建议面板打开或关闭时触发。' },
      { name: 'focus', type: 'FocusEvent', description: 'textarea 获得焦点时触发。' },
      { name: 'blur', type: 'FocusEvent', description: 'textarea 失去焦点时触发。' }
    ],
    types: [
      { name: 'YMentionOption', type: '{ label: string; value: string; description?: string; disabled?: boolean }', description: '提及建议项配置；disabled 项可展示但不能选择。' },
      { name: 'YMentionSelectPayload', type: '{ option: YMentionOption; prefix: string; value: string }', description: '提及选择结果结构，适合外部记录选中的对象、前缀和最终文本。' },
      { name: 'YMentionSize', type: "'small' | 'medium' | 'large'", description: 'Mention 尺寸类型。' }
    ]
  },
  YLink: {
    props: [
      { name: 'href', type: 'string', defaultValue: "''", description: '链接地址，禁用时不会渲染到 DOM。' },
      { name: 'target', type: 'string', defaultValue: "''", description: '原生链接打开目标。' },
      { name: 'rel', type: 'string', defaultValue: "''", description: '原生 rel 属性；外链或 _blank 未传时默认 noopener noreferrer。' },
      { name: 'tone', type: "'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'", defaultValue: "'primary'", description: '链接语义色。' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: '链接字号尺寸。' },
      { name: 'underline', type: "'always' | 'hover' | 'never'", defaultValue: "'hover'", description: '下划线展示策略。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用链接。' },
      { name: 'external', type: 'boolean', defaultValue: 'false', description: '是否按外链处理，默认打开新窗口并补充安全 rel。' }
    ],
    events: [
      { name: 'click', type: 'MouseEvent', description: '非禁用状态下点击链接时触发。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '链接文本或轻量图标内容。' }
    ],
    types: [
      { name: 'YLinkTone', type: "'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'", description: '链接语义色类型。' },
      { name: 'YLinkUnderline', type: "'always' | 'hover' | 'never'", description: '下划线策略类型。' }
    ]
  },
  YText: {
    props: [
      { name: 'tag', type: 'string', defaultValue: "'span'", description: '渲染的 HTML 标签；code=true 时默认渲染 code。' },
      { name: 'tone', type: "'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'", defaultValue: "'neutral'", description: '文本语义色。' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", defaultValue: "'md'", description: '文本字号尺寸。' },
      { name: 'strong', type: 'boolean', defaultValue: 'false', description: '是否加粗。' },
      { name: 'italic', type: 'boolean', defaultValue: 'false', description: '是否斜体。' },
      { name: 'underline', type: 'boolean', defaultValue: 'false', description: '是否添加下划线。' },
      { name: 'deleted', type: 'boolean', defaultValue: 'false', description: '是否添加删除线。' },
      { name: 'mark', type: 'boolean', defaultValue: 'false', description: '是否使用轻量标记底色。' },
      { name: 'code', type: 'boolean', defaultValue: 'false', description: '是否使用代码文本样式。' },
      { name: 'truncated', type: 'boolean', defaultValue: 'false', description: '是否单行省略。' },
      { name: 'lineClamp', type: 'number | string', defaultValue: 'undefined', description: '多行省略行数。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '文本内容。' }
    ],
    types: [
      { name: 'YTextTone', type: "'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'", description: '文本语义色类型。' },
      { name: 'YTextSize', type: "'xs' | 'sm' | 'md' | 'lg'", description: '文本尺寸类型。' }
    ]
  },
  YProgress: {
    props: [
      {
        name: 'value',
        type: 'number',
        description: '当前进度，组件内部会限制在 0 到 100。',
        required: true
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "'Progress'",
        description: '视觉标题和进度条 aria-label。'
      },
      {
        name: 'tone',
        type: "'primary' | 'success' | 'warning' | 'danger'",
        defaultValue: "'primary'",
        description: '进度条语义色。'
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '进度条高度。'
      },
      {
        name: 'showValue',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否展示百分比文本。'
      },
      {
        name: 'striped',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示条纹强调样式。'
      }
    ]
  },
  YAvatar: {
    props: [
      { name: 'src', type: 'string', defaultValue: "''", description: '头像图片地址。' },
      { name: 'srcSet', type: 'string', defaultValue: "''", description: '图片头像的原生 srcset 属性，适配高分屏资源。' },
      { name: 'alt', type: 'string', defaultValue: "''", description: '图片替代文本。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '非图片头像的可访问名称，优先级高于 alt 和 name。' },
      { name: 'name', type: 'string', defaultValue: "''", description: '用于生成 initials fallback 的名称。' },
      { name: 'fit', type: 'YAvatarFit', defaultValue: "'cover'", description: '图片头像的 object-fit 模式。' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: '头像尺寸。' },
      { name: 'shape', type: "'circle' | 'square'", defaultValue: "'circle'", description: '头像形状。' },
      { name: 'tone', type: "'primary' | 'success' | 'warning' | 'danger'", defaultValue: "'primary'", description: 'fallback 色调。' }
    ],
    events: [
      { name: 'error', type: 'Event', description: '图片加载失败时触发，并切换到 fallback 内容。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '自定义头像内容，例如图标、缩写或品牌标识。' }
    ],
    types: [
      { name: 'YAvatarFit', type: "'fill' | 'contain' | 'cover' | 'none' | 'scale-down'", description: '图片填充方式。' },
      { name: 'YAvatarShape', type: "'circle' | 'square'", description: '头像形状。' },
      { name: 'YAvatarSize', type: "'sm' | 'md' | 'lg'", description: '头像尺寸。' },
      { name: 'YAvatarTone', type: "'primary' | 'success' | 'warning' | 'danger'", description: 'fallback 语义色。' }
    ]
  },
  YAvatarGroup: {
    props: [
      { name: 'max', type: 'number', defaultValue: '0', description: '最多展示的头像数量；为 0 时展示全部。' },
      { name: 'total', type: 'number', defaultValue: '0', description: '已知总人数，可大于实际渲染的头像数量，用于服务端分页场景。' },
      { name: 'spacing', type: 'YAvatarGroupSpacing', defaultValue: "'normal'", description: '头像之间的重叠间距，支持 tight、normal 或数字。' },
      { name: 'label', type: 'string', defaultValue: "'Avatar group'", description: '头像组的可访问名称。' },
      { name: 'surplusLabel', type: 'string', defaultValue: "''", description: '剩余计数头像的可访问名称。' },
      { name: 'size', type: 'YAvatarSize', defaultValue: "'md'", description: '剩余计数头像的尺寸。' },
      { name: 'shape', type: 'YAvatarShape', defaultValue: "'circle'", description: '剩余计数头像的形状。' }
    ],
    slots: [
      { name: 'default', type: 'VNode[]', description: '头像列表，通常放置多个 YAvatar。' }
    ],
    types: [
      { name: 'YAvatarGroupSpacing', type: "'tight' | 'normal' | number", description: '头像组重叠间距类型。' }
    ]
  },
  YIcon: {
    props: [
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | number | string", defaultValue: "'md'", description: '图标尺寸；数字会转换为 px，也可以直接传 CSS 长度。' },
      { name: 'color', type: 'string', defaultValue: "'currentColor'", description: '图标颜色，默认继承当前文本色。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '图标的可访问名称；为空时作为装饰图标隐藏给辅助技术。' },
      { name: 'spinning', type: 'boolean', defaultValue: 'false', description: '是否展示旋转状态，适合 loading 图标。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: 'SVG 图标内容，推荐使用 1em 尺寸的 SVG。' }
    ],
    types: [
      { name: 'YIconSize', type: "'xs' | 'sm' | 'md' | 'lg' | number | string", description: '图标尺寸类型。' },
      { name: 'YIconNamedSize', type: "'xs' | 'sm' | 'md' | 'lg'", description: '内置命名图标尺寸。' }
    ]
  },
  YCollapse: {
    props: [
      { name: 'items', type: 'YCollapseItem[]', description: '折叠面板列表。', required: true },
      { name: 'modelValue', type: 'string[]', defaultValue: '[]', description: '当前展开的面板 value。' },
      { name: 'accordion', type: 'boolean', defaultValue: 'false', description: '是否启用手风琴模式。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'string[]', description: '展开项变化。' },
      { name: 'change', type: 'string[]', description: '展开项变化。' }
    ],
    slots: [
      { name: 'label-{value}', type: '{ item: YCollapseItem }', description: '自定义面板标题。' },
      { name: 'panel-{value}', type: '{ item: YCollapseItem }', description: '自定义面板内容。' }
    ],
    types: [
      { name: 'YCollapseItem', type: '{ label: string; value: string; content?: string; disabled?: boolean }', description: '折叠面板配置。' }
    ]
  },
  YPopconfirm: {
    props: [
      { name: 'open', type: 'boolean', defaultValue: 'undefined', description: '受控打开状态。' },
      { name: 'title', type: 'string', description: '确认标题。', required: true },
      { name: 'description', type: 'string', defaultValue: "''", description: '确认说明。' },
      { name: 'confirmText', type: 'string', defaultValue: "'Confirm'", description: '确认按钮文案。' },
      { name: 'cancelText', type: 'string', defaultValue: "'Cancel'", description: '取消按钮文案。' }
    ],
    events: [
      { name: 'update:open', type: 'boolean', description: '打开状态变化。' },
      { name: 'confirm', type: 'void', description: '点击确认。' },
      { name: 'cancel', type: 'void', description: '点击取消。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '默认触发元素，会作为 trigger 插槽的 fallback。' },
      { name: 'trigger', type: 'VNode', description: '触发元素，优先级高于默认插槽。' }
    ]
  },
  YBacktop: {
    props: [
      { name: 'visibilityHeight', type: 'number', defaultValue: '240', description: '滚动超过该高度后显示。' },
      { name: 'right', type: 'number', defaultValue: '24', description: '距离视口右侧距离。' },
      { name: 'bottom', type: 'number', defaultValue: '24', description: '距离视口底部距离。' }
    ],
    events: [
      { name: 'click', type: 'void', description: '点击返回顶部。' }
    ]
  },
  YAffix: {
    props: [
      { name: 'offset', type: 'number', defaultValue: '0', description: '距离视口或目标容器边缘的偏移量。' },
      { name: 'position', type: 'YAffixPosition', defaultValue: "'top'", description: '固定位置，可选 top 或 bottom。' },
      { name: 'target', type: 'string', defaultValue: "''", description: '滚动容器 CSS 选择器；为空时监听 window。' },
      { name: 'zIndex', type: 'number', defaultValue: '100', description: '固定层级。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用 sticky 固定和 fixed 状态。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Affix'", description: '固定区域可访问名称。' }
    ],
    events: [
      { name: 'change', type: '(fixed: boolean) => void', description: '固定状态变化时触发。' },
      { name: 'scroll', type: '(payload: YAffixScrollPayload) => void', description: '监听目标滚动时触发，包含 scrollTop 和 fixed。' }
    ],
    methods: [
      { name: 'update', type: '() => void', description: '手动重新计算固定状态并触发滚动反馈。' }
    ],
    slots: [
      { name: 'default', type: 'unknown', description: '需要固定的工具栏、页内导航或操作区。' }
    ],
    types: [
      { name: 'YAffixPosition', type: "'top' | 'bottom'", description: '固定边缘。' },
      { name: 'YAffixScrollPayload', type: '{ scrollTop: number; fixed: boolean }', description: '滚动事件载荷。' }
    ]
  },
  YAnchor: {
    props: [
      { name: 'items', type: 'YAnchorItem[]', description: '锚点列表，竖向模式支持 children 子链接。', required: true },
      { name: 'modelValue', type: 'string', defaultValue: 'undefined', description: '当前激活的 href，支持 v-model。' },
      { name: 'container', type: 'YAnchorContainer', defaultValue: 'window', description: '滚动容器，可传 HTMLElement、Window 或 CSS 选择器。' },
      { name: 'offset', type: 'number', defaultValue: '0', description: '滚动到目标位置时预留的顶部偏移。' },
      { name: 'bound', type: 'number', defaultValue: '15', description: '滚动时判定当前锚点的触发边界。' },
      { name: 'duration', type: 'number', defaultValue: '300', description: '滚动动画时长；传 0 使用 auto 行为。' },
      { name: 'marker', type: 'boolean', defaultValue: 'true', description: '竖向模式是否显示左侧激活标记。' },
      { name: 'direction', type: 'YAnchorDirection', defaultValue: "'vertical'", description: '锚点排列方向，horizontal 不渲染子链接。' },
      { name: 'type', type: 'YAnchorType', defaultValue: "'default'", description: '锚点视觉类型，可选 default 或 underline。' },
      { name: 'selectScrollTop', type: 'boolean', defaultValue: 'false', description: '滚动到顶部边界时是否选中第一个锚点。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Anchor'", description: '锚点导航区域的可访问名称。' }
    ],
    events: [
      { name: 'update:modelValue', type: '(href: string) => void', description: '当前激活锚点变化。' },
      { name: 'change', type: '(href: string) => void', description: '锚点激活项变化时触发。' },
      { name: 'click', type: '(payload: YAnchorClickPayload) => void', description: '点击可用锚点时触发，包含 item 和原始 MouseEvent。' }
    ],
    methods: [
      { name: 'scrollTo', type: '(href: string) => void', description: '手动滚动到指定 href。' },
      { name: 'update', type: '() => void', description: '手动根据当前滚动位置重新计算 active。' }
    ],
    types: [
      { name: 'YAnchorItem', type: '{ title: string; href: string; disabled?: boolean; children?: YAnchorItem[] }', description: '锚点配置。' },
      { name: 'YAnchorContainer', type: 'Window | HTMLElement | string', description: '滚动容器类型。' },
      { name: 'YAnchorDirection', type: "'vertical' | 'horizontal'", description: '锚点排列方向。' },
      { name: 'YAnchorType', type: "'default' | 'underline'", description: '锚点视觉类型。' },
      { name: 'YAnchorClickPayload', type: '{ item: YAnchorItem; event: MouseEvent }', description: '点击事件载荷。' }
    ]
  },
  YWatermark: {
    props: [
      { name: 'content', type: 'string', description: '水印文本。', required: true },
      { name: 'opacity', type: 'number', defaultValue: '0.12', description: '水印透明度。' },
      { name: 'gap', type: 'number', defaultValue: '120', description: '水印平铺间距。' },
      { name: 'rotate', type: 'number', defaultValue: '-18', description: '水印旋转角度。' },
      { name: 'fontSize', type: 'number', defaultValue: '15', description: '水印字号。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '需要添加水印的内容。' }
    ]
  },
  YQRCode: {
    props: [
      { name: 'value', type: 'string', description: '需要编码的文本、链接或业务标识。', required: true },
      { name: 'label', type: 'string', defaultValue: "''", description: '二维码的可访问名称；未传入时使用 value 生成默认名称。' },
      { name: 'size', type: 'number | string', defaultValue: '160', description: '二维码视觉尺寸，限制在 72 到 320 像素之间。' },
      { name: 'level', type: 'YQRCodeLevel', defaultValue: "'M'", description: '纠错等级，可选 L、M、Q、H；带 logo 时建议使用 H。' },
      { name: 'foreground', type: 'string', defaultValue: "'#087f6d'", description: '二维码模块颜色。' },
      { name: 'background', type: 'string', defaultValue: "'#ffffff'", description: '二维码背景色。' },
      { name: 'margin', type: 'number | string', defaultValue: '2', description: '二维码 quiet zone 模块数，限制在 0 到 8。' },
      { name: 'status', type: 'YQRCodeStatus', defaultValue: "'active'", description: '二维码状态；loading 展示生成中，expired 展示过期刷新入口。' },
      { name: 'expiredText', type: 'string', defaultValue: "'QR code expired'", description: '过期状态提示文案。' },
      { name: 'loadingText', type: 'string', defaultValue: "'Generating QR code'", description: '加载状态提示文案。' },
      { name: 'refreshText', type: 'string', defaultValue: "'Refresh'", description: '过期状态刷新按钮文案。' },
      { name: 'logoSrc', type: 'string', defaultValue: "''", description: '中心 logo 图片地址，组件会自动添加背景保护区。' },
      { name: 'logoAlt', type: 'string', defaultValue: "''", description: 'logo 图片的可访问名称。' },
      { name: 'logoSize', type: 'number | string', defaultValue: '36', description: 'logo 尺寸，最大不超过二维码尺寸的三分之一。' },
      { name: 'downloadable', type: 'boolean', defaultValue: 'false', description: '是否展示 SVG 下载按钮。' },
      { name: 'downloadText', type: 'string', defaultValue: "'Download SVG'", description: '下载按钮文案。' },
      { name: 'downloadName', type: 'string', defaultValue: "'yok-qr-code.svg'", description: '下载文件名。' }
    ],
    events: [
      { name: 'ready', type: '{ value: string; size: number; level: YQRCodeLevel; moduleCount: number }', description: '二维码矩阵生成完成后触发。' },
      { name: 'refresh', type: 'void', description: '用户点击过期状态刷新按钮时触发。' },
      { name: 'error', type: 'Error', description: '二维码生成失败时触发。' },
      { name: 'download', type: 'string', description: '下载 SVG 后触发，参数为文件名。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '二维码下方说明或业务辅助信息。' }
    ],
    types: [
      { name: 'YQRCodeLevel', type: "'L' | 'M' | 'Q' | 'H'", description: '二维码纠错等级。' },
      { name: 'YQRCodeStatus', type: "'active' | 'loading' | 'expired'", description: '二维码展示状态。' }
    ]
  },
  YFloatButton: {
    props: [
      { name: 'label', type: 'string', description: '按钮的可访问名称。', required: true },
      { name: 'tooltip', type: 'string', defaultValue: "''", description: '按钮 title 和可见短文案来源。' },
      { name: 'icon', type: 'string', defaultValue: "''", description: '默认图标字符；也可使用 icon slot。' },
      { name: 'content', type: 'string', defaultValue: "''", description: '按钮内短文本，适合 square 或扩展 FAB。' },
      { name: 'type', type: 'YFloatButtonType', defaultValue: "'default'", description: '视觉类型，可选 default 或 primary。' },
      { name: 'shape', type: 'YFloatButtonShape', defaultValue: "'circle'", description: '按钮形状，可选 circle 或 square。' },
      { name: 'action', type: 'YFloatButtonAction', defaultValue: "'button'", description: '内置动作；backtop 会在点击时平滑滚动到页面顶部。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用按钮。' },
      { name: 'right', type: 'number', defaultValue: '24', description: '距离视口右侧的像素值。' },
      { name: 'bottom', type: 'number', defaultValue: '24', description: '距离视口底部的像素值。' },
      { name: 'visibilityHeight', type: 'number', defaultValue: '240', description: 'backtop 动作显示前需要达到的滚动高度。' }
    ],
    events: [
      { name: 'click', type: 'MouseEvent', description: '点击按钮或触发 backtop 后触发。' }
    ],
    slots: [
      { name: 'icon', type: 'VNode', description: '自定义按钮图标。' }
    ],
    types: [
      { name: 'YFloatButtonAction', type: "'button' | 'backtop'", description: '浮动按钮动作类型。' },
      { name: 'YFloatButtonShape', type: "'circle' | 'square'", description: '浮动按钮形状。' },
      { name: 'YFloatButtonType', type: "'default' | 'primary'", description: '浮动按钮视觉类型。' }
    ]
  },
  YFloatButtonGroup: {
    props: [
      { name: 'label', type: 'string', description: '按钮组触发器的可访问名称。', required: true },
      { name: 'items', type: 'YFloatButtonItem[]', defaultValue: '[]', description: '展开后的动作项。' },
      { name: 'open', type: 'boolean', description: '受控展开状态。' },
      { name: 'trigger', type: 'YFloatButtonGroupTrigger', defaultValue: "'click'", description: '展开触发方式，可选 click 或 hover。' },
      { name: 'type', type: 'YFloatButtonType', defaultValue: "'default'", description: '触发器和动作项默认视觉类型。' },
      { name: 'shape', type: 'YFloatButtonShape', defaultValue: "'circle'", description: '触发器和动作项形状。' },
      { name: 'icon', type: 'string', defaultValue: "'+'", description: '触发器默认图标。' },
      { name: 'right', type: 'number', defaultValue: '24', description: '距离视口右侧的像素值。' },
      { name: 'bottom', type: 'number', defaultValue: '24', description: '距离视口底部的像素值。' },
      { name: 'gap', type: 'number', defaultValue: '12', description: '触发器和动作项之间的间距。' }
    ],
    events: [
      { name: 'update:open', type: 'boolean', description: '请求更新受控展开状态。' },
      { name: 'openChange', type: 'boolean', description: '展开状态变化时触发。' },
      { name: 'select', type: 'YFloatButtonItem', description: '点击动作项时触发。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '自定义展开内容，通常用于复杂快捷动作。' }
    ],
    types: [
      { name: 'YFloatButtonItem', type: "{ key: string; label: string; icon?: string; type?: YFloatButtonType; disabled?: boolean }", description: '按钮组动作项。' },
      { name: 'YFloatButtonGroupTrigger', type: "'click' | 'hover'", description: '按钮组展开触发方式。' }
    ]
  },
  YSelect: {
    props: [
      { name: 'id', type: 'string', defaultValue: "''", description: '传给 combobox 触发器的 id，常用于和 FormItem label 关联。' },
      { name: 'modelValue', type: 'YSelectValue', defaultValue: "''", description: '当前值，支持 v-model；多选模式下使用 string[]。' },
      { name: 'options', type: 'YSelectOption[]', description: '选项列表。', required: true },
      { name: 'label', type: 'string', defaultValue: "''", description: '标签文本。' },
      { name: 'placeholder', type: 'string', defaultValue: "'Select an option'", description: '占位项文本。' },
      { name: 'error', type: 'string', defaultValue: "''", description: '错误提示。' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false', description: '外部表单校验传入的无效状态，会同步到 aria-invalid。' },
      { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: '传给 combobox 的 aria-describedby，通常来自 YFormItem 的 messageId。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用状态。' },
      { name: 'clearable', type: 'boolean', defaultValue: 'false', description: '是否展示清空按钮。' },
      { name: 'multiple', type: 'boolean', defaultValue: 'false', description: '是否启用多选；选中项以紧凑标签展示。' },
      { name: 'collapseTags', type: 'boolean', defaultValue: 'false', description: '多选时是否折叠超出数量的标签，避免触发器被长列表撑开。' },
      { name: 'maxCollapseTags', type: 'number', defaultValue: '1', description: '开启 collapseTags 后保留展示的标签数量，最小按 1 处理。' },
      { name: 'filterable', type: 'boolean', defaultValue: 'false', description: '是否在下拉面板内展示搜索框并按 label 过滤选项。' },
      { name: 'allowCreate', type: 'boolean', defaultValue: 'false', description: '配合 filterable 使用；当搜索词不匹配现有选项时，允许创建并选中该值。' },
      { name: 'virtualized', type: 'boolean', defaultValue: 'false', description: '是否启用选项虚拟滚动；适合千级以上选项，保持 listbox / option 语义但只渲染视口附近项目。' },
      { name: 'virtualHeight', type: 'number', defaultValue: '220', description: '虚拟滚动 listbox 的可视高度，单位为 px。' },
      { name: 'virtualItemHeight', type: 'number', defaultValue: '36', description: '虚拟滚动计算使用的单个选项高度，需与实际选项高度保持一致。' },
      { name: 'virtualOverscan', type: 'number', defaultValue: '4', description: '虚拟滚动视口外额外渲染的选项数量，用于降低快速滚动时的空白感。' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '是否展示异步加载状态；开启时暂停渲染可选项。' },
      { name: 'loadingText', type: 'string', defaultValue: "'Loading options'", description: '异步加载状态下展示给用户和辅助技术的状态文案。' },
      { name: 'searchPlaceholder', type: 'string', defaultValue: "'Search options'", description: '可搜索模式下搜索框的占位和可访问名称。' },
      { name: 'emptyText', type: 'string', defaultValue: "'No matching options'", description: '过滤后没有匹配项时的空状态文案。' },
      { name: 'size', type: 'YSelectSize', defaultValue: 'ConfigProvider size', description: '选择器尺寸；未传入时把 ConfigProvider 的 sm/md/lg 映射为 small/medium/large。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'YSelectValue', description: '选中值变化，支持 v-model。' },
      { name: 'change', type: 'YSelectValue', description: '选中、移除或清空后提交当前值。' },
      { name: 'clear', type: 'void', description: '点击清空按钮时触发。' },
      { name: 'remove', type: 'string', description: '多选模式移除某个选项时触发，参数为被移除的 value。' },
      { name: 'visibleChange', type: 'boolean', description: '下拉面板打开或关闭时触发。' },
      { name: 'search', type: 'string', description: '可搜索模式下搜索词变化时触发，适合远程搜索和事件复现。' }
    ],
    types: [
      { name: 'YSelectOption', type: '{ label: string; value: string; group?: string; disabled?: boolean }', description: '选择项配置；group 相同的选项会在下拉面板中合并为同一组选项。' },
      { name: 'YSelectSize', type: "'small' | 'medium' | 'large'", description: '选择器尺寸。' },
      { name: 'YSelectValue', type: 'string | string[]', description: '单选或多选 v-model 值。' }
    ]
  },
  YTreeSelect: {
    props: [
      { name: 'id', type: 'string', defaultValue: "''", description: '传给 combobox 触发器的 id，常用于和 FormItem label 关联。' },
      { name: 'modelValue', type: 'YTreeSelectValue', defaultValue: "''", description: '当前值，支持 v-model；多选模式下使用 string[]。' },
      { name: 'nodes', type: 'YTreeSelectNode[]', description: '树节点数据，沿用 key、label、disabled、children 结构。', required: true },
      { name: 'label', type: 'string', defaultValue: "''", description: '标签文本。' },
      { name: 'placeholder', type: 'string', defaultValue: "'Select a node'", description: '无选中值时的占位文本。' },
      { name: 'error', type: 'string', defaultValue: "''", description: '错误提示。' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false', description: '外部表单校验传入的无效状态，会同步到 aria-invalid。' },
      { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: '传给 combobox 的 aria-describedby，通常来自 YFormItem 的 messageId。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用状态。' },
      { name: 'clearable', type: 'boolean', defaultValue: 'false', description: '是否展示清空按钮。' },
      { name: 'multiple', type: 'boolean', defaultValue: 'false', description: '是否启用多选；选中节点以紧凑标签展示。' },
      { name: 'collapseTags', type: 'boolean', defaultValue: 'false', description: '多选时是否折叠超出数量的标签。' },
      { name: 'maxCollapseTags', type: 'number', defaultValue: '1', description: '开启 collapseTags 后保留展示的标签数量。' },
      { name: 'filterable', type: 'boolean', defaultValue: 'false', description: '是否展示搜索框，并按节点 label 过滤树。' },
      { name: 'checkStrictly', type: 'boolean', defaultValue: 'false', description: '是否允许选择任意层级；关闭时非叶子节点仅作为展开折叠入口。' },
      { name: 'expandedKeys', type: 'string[]', description: '受控展开节点 key。' },
      { name: 'defaultExpandedKeys', type: 'string[]', defaultValue: '[]', description: '非受控初始展开节点 key。' },
      { name: 'emptyText', type: 'string', defaultValue: "'No matching nodes'", description: '过滤后没有匹配节点时的空状态文案。' },
      { name: 'searchPlaceholder', type: 'string', defaultValue: "'Search nodes'", description: '可搜索模式下搜索框的占位和可访问名称。' },
      { name: 'treeAriaLabel', type: 'string', defaultValue: "`${label || 'Tree select'} options`", description: '弹层内 tree 区域的可访问名称。' },
      { name: 'size', type: 'YTreeSelectSize', defaultValue: 'ConfigProvider size', description: '选择器尺寸；未传入时把 ConfigProvider 的 sm/md/lg 映射为 small/medium/large。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'YTreeSelectValue', description: '选中值变化，支持 v-model。' },
      { name: 'update:expandedKeys', type: 'string[]', description: '展开节点变化，支持受控展开。' },
      { name: 'change', type: 'YTreeSelectValue', description: '选中、移除或清空后提交当前值。' },
      { name: 'select', type: 'YTreeSelectChangePayload', description: '选择路径明细，包含当前节点和所有选中节点。' },
      { name: 'clear', type: 'void', description: '点击清空按钮时触发。' },
      { name: 'remove', type: 'string', description: '多选模式移除某个节点时触发，参数为被移除的 key。' },
      { name: 'visibleChange', type: 'boolean', description: '弹层打开或关闭时触发。' },
      { name: 'search', type: 'string', description: '可搜索模式下搜索词变化时触发。' }
    ],
    types: [
      { name: 'YTreeSelectNode', type: '{ key: string; label: string; disabled?: boolean; children?: YTreeSelectNode[] }', description: '树选择节点数据，兼容 YTreeNode 结构。' },
      { name: 'YTreeSelectValue', type: 'string | string[]', description: '单选或多选 v-model 值。' },
      { name: 'YTreeSelectSize', type: "'small' | 'medium' | 'large'", description: '选择器尺寸。' },
      { name: 'YTreeSelectChangePayload', type: '{ value: YTreeSelectValue; node: YTreeSelectNode | null; selectedNodes: YTreeSelectNode[] }', description: 'select 事件载荷。' }
    ]
  },
  YCheckbox: {
    props: [
      { name: 'modelValue', type: 'boolean', defaultValue: 'false', description: '当前是否选中，支持 v-model。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '可见标签。' },
      { name: 'description', type: 'string', defaultValue: "''", description: '辅助说明文本。' },
      { name: 'indeterminate', type: 'boolean', defaultValue: 'false', description: '半选状态；适合全选控件表示部分子项已选中，渲染为 aria-checked="mixed"。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'boolean', description: '选中状态变化时触发。' }
    ]
  },
  YCheckboxGroup: {
    props: [
      { name: 'modelValue', type: 'YCheckboxGroupValue[]', defaultValue: '[]', description: '当前已选值数组，支持 v-model。' },
      { name: 'id', type: 'string', defaultValue: "''", description: '传给 fieldset 的 id，适合和错误摘要或表单标签关联。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '组选项的 fieldset legend，也是辅助技术读取的组名。' },
      { name: 'description', type: 'string', defaultValue: "''", description: '组选项说明文本，用于解释选择规则或业务影响。' },
      { name: 'options', type: 'YCheckboxGroupOption[]', defaultValue: '[]', description: '复选项配置数组。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用整个复选组。' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false', description: '外部表单校验传入的无效状态，会同步到 aria-invalid。' },
      { name: 'error', type: 'string', defaultValue: "''", description: '独立使用时展示的错误文本；在 FormItem 内推荐使用 FormItem 的错误提示。' },
      { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: '传给 fieldset 的 aria-describedby，通常来自 YFormItem 的 messageId。' },
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'vertical'", description: '选项排列方向。' },
      { name: 'min', type: 'number', defaultValue: '0', description: '至少保留的选中数量；达到下限时已选项不可取消。' },
      { name: 'max', type: 'number', defaultValue: 'Infinity', description: '最多可选数量；达到上限时未选项不可继续选择。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'YCheckboxGroupValue[]', description: '已选值数组变化时触发。' },
      { name: 'change', type: 'YCheckboxGroupValue[]', description: '用户切换选项后触发，参数为下一组选中值。' }
    ],
    types: [
      { name: 'YCheckboxGroupOption', type: '{ label: string; value: string | number; description?: string; disabled?: boolean }', description: '复选组选项配置。' },
      { name: 'YCheckboxGroupValue', type: 'string | number', description: '复选组可选值类型。' }
    ]
  },
  YSwitch: {
    props: [
      { name: 'modelValue', type: 'boolean', defaultValue: 'false', description: '当前开关状态，支持 v-model。' },
      { name: 'id', type: 'string', defaultValue: "''", description: '传给 button 的 id，适合和错误摘要或表单标签关联。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '开关旁的可见标签。' },
      { name: 'description', type: 'string', defaultValue: "''", description: '开关说明文本，用于解释开启或关闭后的影响。' },
      { name: 'activeText', type: 'string', defaultValue: "''", description: '开启状态文案。' },
      { name: 'inactiveText', type: 'string', defaultValue: "''", description: '关闭状态文案。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用。' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '是否处于加载中；加载中会展示 spinner 并阻止切换。' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false', description: '外部表单校验传入的无效状态，会同步到 aria-invalid。' },
      { name: 'error', type: 'string', defaultValue: "''", description: '独立使用时展示的错误文本；在 FormItem 内推荐使用 FormItem 的错误提示。' },
      { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: '传给 switch button 的 aria-describedby，通常来自 YFormItem 的 messageId。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'boolean', description: '开关状态变化时触发。' },
      { name: 'change', type: 'boolean', description: '用户切换后触发，参数为下一状态。' }
    ]
  },
  YModal: {
    props: [
      { name: 'open', type: 'boolean', description: '是否显示弹窗。', required: true },
      { name: 'title', type: 'string', description: '弹窗标题。', required: true },
      { name: 'description', type: 'string', defaultValue: "''", description: '说明文本。' },
      { name: 'closeOnOverlay', type: 'boolean', defaultValue: 'true', description: '点击遮罩是否请求关闭。' },
      { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: '按 Escape 是否请求关闭。' }
    ],
    events: [
      { name: 'close', type: 'void', description: '请求关闭。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '弹窗主体内容。' },
      { name: 'footer', type: 'VNode', description: '底部操作区。' }
    ]
  },
  YDrawer: {
    props: [
      { name: 'open', type: 'boolean', description: '是否显示抽屉。', required: true },
      { name: 'title', type: 'string', description: '抽屉标题。', required: true },
      { name: 'description', type: 'string', defaultValue: "''", description: '说明文本。' },
      { name: 'placement', type: "'left' | 'right'", defaultValue: "'right'", description: '出现位置。' },
      { name: 'closeOnOverlay', type: 'boolean', defaultValue: 'true', description: '点击遮罩是否请求关闭。' },
      { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: '按 Escape 是否请求关闭。' }
    ],
    events: [
      { name: 'close', type: 'void', description: '请求关闭。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '抽屉主体内容。' },
      { name: 'footer', type: 'VNode', description: '底部操作区。' }
    ]
  },
  YTabs: {
    props: [
      { name: 'modelValue', type: 'string', description: '当前激活 tab。', required: true },
      { name: 'tabs', type: 'YTabItem[]', description: 'tab 列表。', required: true },
      { name: 'id', type: 'string', defaultValue: "''", description: '用于生成 tab 和 panel 关联 id 的稳定前缀。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Tabs'", description: 'tablist 的可访问名称。' },
      { name: 'activationMode', type: 'YTabsActivationMode', defaultValue: "'auto'", description: '键盘聚焦 tab 时是否自动激活；manual 需要 Enter 或 Space 激活。' },
      { name: 'orientation', type: 'YTabsOrientation', defaultValue: "'horizontal'", description: 'tablist 方向，可选 horizontal 或 vertical。' },
      { name: 'size', type: 'YTabsSize', defaultValue: "'md'", description: '标签尺寸，可选 sm、md、lg。' },
      { name: 'variant', type: 'YTabsVariant', defaultValue: "'segment'", description: '视觉变体，可选 line、card、segment。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'string', description: '激活项变化。' },
      { name: 'change', type: 'string', description: '激活项变化后触发。' },
      { name: 'tabClick', type: 'YTabItem', description: '点击可用 tab 时触发。' },
      { name: 'close', type: 'string', description: '点击可关闭 tab 的关闭按钮时触发，参数为 tab value。' }
    ],
    slots: [
      { name: 'default', type: '{ active: string; tab?: YTabItem }', description: '当前激活内容。' }
    ],
    types: [
      { name: 'YTabItem', type: '{ label: string; value: string; disabled?: boolean; closable?: boolean; badge?: string | number; icon?: string }', description: 'Tab 配置。' },
      { name: 'YTabsActivationMode', type: "'auto' | 'manual'", description: '键盘聚焦后的激活模式。' },
      { name: 'YTabsOrientation', type: "'horizontal' | 'vertical'", description: 'Tabs 方向。' },
      { name: 'YTabsSize', type: "'sm' | 'md' | 'lg'", description: 'Tabs 尺寸。' },
      { name: 'YTabsVariant', type: "'line' | 'card' | 'segment'", description: 'Tabs 视觉变体。' }
    ]
  },
  YPagination: {
    props: [
      { name: 'page', type: 'number', description: '当前页。', required: true },
      { name: 'pageSize', type: 'number', description: '每页数量。', required: true },
      { name: 'total', type: 'number', description: '总条数。', required: true },
      { name: 'siblingCount', type: 'number', defaultValue: '1', description: '当前页左右展示数量。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用分页按钮。' },
      { name: 'hideOnSinglePage', type: 'boolean', defaultValue: 'false', description: '只有一页时是否隐藏分页器。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Pagination'", description: '分页导航区域的可访问名称。' },
      { name: 'previousText', type: 'string', defaultValue: "'Previous'", description: '上一页按钮文案。' },
      { name: 'nextText', type: 'string', defaultValue: "'Next'", description: '下一页按钮文案。' }
    ],
    events: [
      { name: 'update:page', type: 'number', description: '页码变化。' },
      { name: 'change', type: 'number', description: '页码变化。' }
    ]
  },
  YTooltip: {
    props: [
      { name: 'content', type: 'string', description: '提示内容。', required: true },
      { name: 'placement', type: 'YTooltipPlacement', defaultValue: "'top'", description: '出现位置，支持四方向及 start/end 对齐。' },
      { name: 'open', type: 'boolean', defaultValue: 'undefined', description: '受控显示状态；未传入时由触发器自动维护。' },
      { name: 'id', type: 'string', defaultValue: 'auto generated', description: '气泡 id。' },
      { name: 'trigger', type: 'YTooltipTrigger', defaultValue: "'hover'", description: '触发方式；hover 模式同时支持键盘 focus。' },
      { name: 'theme', type: 'YTooltipTheme', defaultValue: "'dark'", description: '提示主题。' },
      { name: 'showDelay', type: 'number | string', defaultValue: '120', description: '展示延迟。' },
      { name: 'hideDelay', type: 'number | string', defaultValue: '0', description: '隐藏延迟。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否关闭 tooltip 行为和描述关联。' }
    ],
    events: [
      { name: 'update:open', type: 'boolean', description: '打开状态变化。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '触发元素。' }
    ],
    types: [
      { name: 'YTooltipPlacement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'", description: 'Floating UI 兼容方位。' },
      { name: 'YTooltipTrigger', type: "'hover' | 'focus' | 'click' | 'manual'", description: '触发方式。' },
      { name: 'YTooltipTheme', type: "'dark' | 'light'", description: '提示主题。' }
    ]
  },
  YMessage: {
    props: [
      { name: 'tone', type: "'info' | 'success' | 'warning' | 'danger'", defaultValue: "'info'", description: '语义类型。' },
      { name: 'title', type: 'string', defaultValue: "''", description: '标题。' },
      { name: 'closable', type: 'boolean', defaultValue: 'false', description: '是否显示关闭按钮。' },
      { name: 'role', type: "'status' | 'alert'", defaultValue: "'status'", description: '状态播报语义。' },
      { name: 'closeLabel', type: 'string', defaultValue: "'Close message'", description: '关闭按钮可访问名称。' }
    ],
    events: [
      { name: 'close', type: 'void', description: '点击关闭按钮。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '反馈内容。' }
    ],
    types: [
      { name: 'YMessageOptions', type: '{ content: string; title?: string; tone?: YMessageTone; duration?: number; closable?: boolean; onClose?: () => void }', description: '命令式 message 配置。' },
      { name: 'YMessageHandle', type: '{ id: string; close: () => void; update: (options) => void }', description: '命令式 message 句柄。' }
    ]
  },
  YMessageBox: {
    props: [
      { name: 'open', type: 'boolean', description: '弹窗是否打开。', required: true },
      { name: 'title', type: 'string', description: '弹窗标题。', required: true },
      { name: 'message', type: 'string', defaultValue: "''", description: '正文说明。' },
      { name: 'tone', type: "'info' | 'success' | 'warning' | 'danger'", defaultValue: "'info'", description: '语义类型，影响图标点和默认 alertdialog 策略。' },
      { name: 'variant', type: "'alert' | 'confirm' | 'prompt'", defaultValue: "'alert'", description: '弹窗类型：通知确认、双按钮确认或输入确认。' },
      { name: 'confirmText', type: 'string', defaultValue: "'OK'", description: '确认按钮文案。' },
      { name: 'cancelText', type: 'string', defaultValue: "'Cancel'", description: '取消按钮文案。' },
      { name: 'showCancel', type: 'boolean', defaultValue: 'variant !== alert', description: '是否显示取消按钮。' },
      { name: 'closeOnOverlay', type: 'boolean', defaultValue: 'alert: true, confirm/prompt: false', description: '点击遮罩是否关闭。' },
      { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: '按 Escape 是否关闭。' },
      { name: 'promptValue', type: 'string', defaultValue: "''", description: 'prompt 输入值，支持 update:promptValue。' },
      { name: 'promptLabel', type: 'string', defaultValue: "'Input'", description: 'prompt 输入框标签。' },
      { name: 'promptPlaceholder', type: 'string', defaultValue: "''", description: 'prompt 输入占位。' },
      { name: 'promptError', type: 'string', defaultValue: "''", description: 'prompt 错误信息。' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '确认处理中状态，禁用关闭和按钮操作。' }
    ],
    events: [
      { name: 'confirm', type: 'value?: string', description: '确认按钮点击；prompt 模式会带当前输入值。' },
      { name: 'cancel', type: 'void', description: '取消按钮点击。' },
      { name: 'close', type: 'void', description: '关闭按钮、遮罩或 Escape 触发关闭。' },
      { name: 'update:promptValue', type: 'string', description: 'prompt 输入值变化。' }
    ],
    types: [
      { name: 'YMessageBoxOptions', type: '{ title?: string; message?: string; tone?: YMessageBoxTone; variant?: YMessageBoxVariant; confirmText?: string; cancelText?: string; promptValue?: string; inputPattern?: RegExp; inputValidator?: (value) => boolean | string; onConfirm?: (value) => boolean | void | Promise<boolean | void> }', description: '命令式 messageBox 配置。' },
      { name: 'YMessageBoxResult', type: "{ action: 'confirm' | 'cancel' | 'close'; value?: string }", description: 'Promise 成功或拒绝载荷。' },
      { name: 'YMessageBoxVariant', type: "'alert' | 'confirm' | 'prompt'", description: '弹窗类型。' },
      { name: 'YMessageBoxTone', type: "'info' | 'success' | 'warning' | 'danger'", description: '语义类型。' }
    ]
  },
  YNotification: {
    props: [
      { name: 'tone', type: "'info' | 'success' | 'warning' | 'danger'", defaultValue: "'info'", description: '语义类型。' },
      { name: 'title', type: 'string', defaultValue: "''", description: '通知标题。' },
      { name: 'closable', type: 'boolean', defaultValue: 'true', description: '是否显示关闭按钮。' },
      { name: 'role', type: "'status' | 'alert'", defaultValue: "'status'", description: '状态播报语义；警告和危险通知建议使用 alert。' },
      { name: 'closeLabel', type: 'string', defaultValue: "'Close notification'", description: '关闭按钮可访问名称。' }
    ],
    events: [
      { name: 'close', type: 'void', description: '点击关闭按钮。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '通知正文。' }
    ],
    types: [
      { name: 'YNotificationOptions', type: '{ content: string; title?: string; tone?: YNotificationTone; duration?: number; closable?: boolean; placement?: YNotificationPlacement; offset?: number; onClose?: () => void; onClick?: () => void }', description: '命令式 notification 配置。' },
      { name: 'YNotificationHandle', type: '{ id: string; close: () => void; update: (options) => void }', description: '命令式 notification 句柄。' },
      { name: 'YNotificationPlacement', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", description: '通知栈位置。' }
    ]
  },
  YUpload: {
    props: [
      { name: 'id', type: 'string', defaultValue: "''", description: '上传区域 ID，用于稳定关联 label、description、error 和拒绝列表。' },
      { name: 'modelValue', type: 'YUploadFile[]', defaultValue: '[]', description: '当前文件列表。' },
      { name: 'rejectedFiles', type: 'YUploadRejectedFile[]', defaultValue: '[]', description: '受控拒绝文件列表，用于展示业务校验、服务端拒绝或预填错误。' },
      { name: 'label', type: 'string', defaultValue: "'Upload files'", description: '区域标题。' },
      { name: 'description', type: 'string', defaultValue: "''", description: '辅助说明。' },
      { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: '外部说明元素 ID，会和组件内部说明、错误、拒绝列表一起关联。' },
      { name: 'buttonLabel', type: 'string', defaultValue: "'Choose files'", description: '选择文件按钮文案。' },
      { name: 'accept', type: 'string', defaultValue: "''", description: '原生文件类型限制。' },
      { name: 'multiple', type: 'boolean', defaultValue: 'false', description: '是否支持多选。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用选择、拖拽和移除操作。' },
      { name: 'drag', type: 'boolean', defaultValue: 'false', description: '是否启用拖拽投放区域。' },
      { name: 'maxFiles', type: 'number', defaultValue: '0', description: '最大文件数，0 表示不限制。' },
      { name: 'maxSize', type: 'number', defaultValue: '0', description: '单个文件最大体积，单位为字节，0 表示不限制。' },
      { name: 'emptyText', type: 'string', defaultValue: "'No files selected yet'", description: '空状态提示文案。' },
      { name: 'dropLabel', type: 'string', defaultValue: "'Drop files here or click to choose'", description: '拖拽区域提示文案。' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false', description: '是否进入表单校验错误态。' },
      { name: 'error', type: 'string', defaultValue: "''", description: '错误提示，会以 alert 方式关联到文件选择控件。' },
      { name: 'autoUpload', type: 'boolean', defaultValue: 'false', description: '选择文件后是否自动调用 customRequest。' },
      { name: 'beforeUpload', type: 'YUploadBeforeUpload', defaultValue: 'undefined', description: '上传前校验钩子，返回 false 或字符串时拒绝文件。' },
      { name: 'customRequest', type: 'YUploadRequestHandler', defaultValue: 'undefined', description: '自定义上传请求，用于接入对象存储、签名上传或业务 API。' },
      { name: 'listType', type: "'text' | 'picture'", defaultValue: "'text'", description: '文件列表样式，picture 会显示缩略图。' },
      { name: 'previewable', type: 'boolean', defaultValue: 'false', description: '是否为带 url 或 thumbUrl 的文件显示预览操作。' },
      { name: 'downloadable', type: 'boolean', defaultValue: 'false', description: '是否为带 url 的文件显示下载操作。' },
      { name: 'sortable', type: 'boolean', defaultValue: 'false', description: '是否显示上移、下移按钮调整文件顺序。' },
      { name: 'clearable', type: 'boolean', defaultValue: 'false', description: '是否在文件列表头部显示清空按钮。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'YUploadFile[]', description: '文件列表变化。' },
      { name: 'change', type: 'YUploadFile[]', description: '选择文件后触发。' },
      { name: 'remove', type: '(file: YUploadFile, files: YUploadFile[])', description: '移除文件后触发。' },
      { name: 'drop', type: '(files: YUploadFile[], event: DragEvent)', description: '拖拽投放文件后触发。' },
      { name: 'exceed', type: '(files: YUploadFile[], maxFiles: number)', description: '选择文件超过 maxFiles 时触发。' },
      { name: 'reject', type: '(files: File[], reason: YUploadRejectReason)', description: '文件因 accept、禁用态、数量、大小或上传前校验被拒绝时触发。' },
      { name: 'progress', type: '(file: YUploadFile, files: YUploadFile[])', description: '自定义请求回写上传进度时触发。' },
      { name: 'success', type: '(file: YUploadFile, response: unknown, files: YUploadFile[])', description: '自定义请求成功后触发。' },
      { name: 'error', type: '(file: YUploadFile, error: unknown, files: YUploadFile[])', description: '自定义请求失败后触发。' },
      { name: 'retry', type: '(file: YUploadFile)', description: '点击失败文件重试时触发。' },
      { name: 'abort', type: '(file: YUploadFile, files: YUploadFile[])', description: '取消上传中的文件时触发。' },
      { name: 'preview', type: '(file: YUploadFile)', description: '点击文件预览操作时触发。' },
      { name: 'download', type: '(file: YUploadFile)', description: '点击文件下载操作时触发。' },
      { name: 'reorder', type: 'YUploadFile[]', description: '文件顺序调整后触发。' },
      { name: 'clear', type: 'YUploadFile[]', description: '清空文件列表后触发，参数为清空前的文件列表。' }
    ],
    methods: [
      { name: 'submit', type: '() => Promise<void>', description: '手动提交 ready 或 error 状态且带 raw 的文件，适合关闭 autoUpload 后的表单流程。' },
      { name: 'clearFiles', type: '() => void', description: '清空当前文件列表并触发 update:modelValue、change 和 clear。' }
    ],
    types: [
      { name: 'YUploadFile', type: '{ id: string; name: string; size: number; type?: string; url?: string; thumbUrl?: string; status?: YUploadStatus; progress?: number; message?: string; raw?: File }', description: '文件项。' },
      { name: 'YUploadRejectedFile', type: 'YUploadFile & { reason: YUploadRejectReason }', description: '拒绝文件项，独立于正常 modelValue 队列。' },
      { name: 'YUploadStatus', type: "'ready' | 'uploading' | 'success' | 'error'", description: '上传状态。' },
      { name: 'YUploadRejectReason', type: "'accept' | 'disabled' | 'exceed' | 'size' | 'before-upload'", description: '文件被拒绝的原因。' },
      { name: 'YUploadBeforeUpload', type: '(file: File, files: File[]) => boolean | string | void | Promise<boolean | string | void>', description: '上传前校验钩子。' },
      { name: 'YUploadRequestOptions', type: '{ file: YUploadFile; nativeFile: File; signal: AbortSignal; onProgress: (progress: number) => void; onSuccess: (response?: unknown) => void; onError: (error: unknown) => void }', description: '自定义请求入参。' },
      { name: 'YUploadRequestHandler', type: '(options: YUploadRequestOptions) => void | YUploadAbortHandle | YUploadRequestResult | Promise<void | YUploadAbortHandle | YUploadRequestResult>', description: '自定义请求函数。' },
      { name: 'YUploadAbortHandle', type: '{ abort: () => void }', description: '上传请求取消句柄。' },
      { name: 'YUploadRequestResult', type: '{ message?: string; response?: unknown }', description: '自定义请求返回结果。' }
    ]
  },
  YDataTable: {
    props: [
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '列表标题。'
      },
      {
        name: 'description',
        type: 'string',
        defaultValue: "''",
        description: '列表说明。'
      },
      {
        name: 'columns',
        type: 'YTableColumn[]',
        description: '表格列定义。',
        required: true
      },
      {
        name: 'data',
        type: 'YTableRow[]',
        description: '表格数据。',
        required: true
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: '加载中状态。'
      },
      {
        name: 'loadingText',
        type: 'string',
        defaultValue: "'Loading data...'",
        description: '加载状态提示文案，会传递给内部 YTable。'
      },
      {
        name: 'caption',
        type: 'string',
        defaultValue: "''",
        description: '表格 caption；默认使用 title 作为表格上下文。'
      },
      {
        name: 'summary',
        type: 'string',
        defaultValue: "''",
        description: '表格底部摘要；默认根据分页、可见行和选择状态自动生成。'
      },
      {
        name: 'maxHeight',
        type: 'string | number',
        description: '传给内部 YTable 的滚动容器最大高度；设置后表头在容器内吸顶。'
      },
      {
        name: 'errorText',
        type: 'string',
        defaultValue: "''",
        description: '远程请求或业务加载失败时展示的错误说明。'
      },
      {
        name: 'striped',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否启用条纹行。'
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        description: '兼容快捷方式，开启后等同于 compact 密度。'
      },
      {
        name: 'density',
        type: 'YDataTableDensity',
        description: '受控表格密度。'
      },
      {
        name: 'defaultDensity',
        type: 'YDataTableDensity',
        defaultValue: "'comfortable'",
        description: '非受控初始表格密度。'
      },
      {
        name: 'showDensitySettings',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示内置密度切换器。'
      },
      {
        name: 'viewPreference',
        type: 'Partial<YDataTableViewPreference>',
        description: '受控表格视图偏好，可统一管理列顺序、列宽、密度和筛选。'
      },
      {
        name: 'defaultViewPreference',
        type: 'Partial<YDataTableViewPreference>',
        description: '非受控初始表格视图偏好，适合从本地存储或服务端个人配置恢复。'
      },
      {
        name: 'showFilterSummary',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否在有活跃筛选时显示筛选摘要胶囊和清空入口。'
      },
      {
        name: 'filters',
        type: 'YTableFilterState',
        description: '受控列筛选状态；key 为列 key，value 为选中的筛选值数组。'
      },
      {
        name: 'defaultFilters',
        type: 'YTableFilterState',
        defaultValue: '{}',
        description: '非受控初始列筛选状态。'
      },
      {
        name: 'selectable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示行选择。'
      },
      {
        name: 'selectedRowKeys',
        type: 'string[]',
        description: '受控选中行 key；未传入时组件会自行维护选择状态。'
      },
      {
        name: 'bulkActions',
        type: 'YBulkActionItem[]',
        defaultValue: '[]',
        description: '内置批量操作按钮配置，点击后通过 bulkAction 事件返回 action 和选中行。'
      },
      {
        name: 'bulkActionTitle',
        type: 'string',
        defaultValue: "''",
        description: '批量操作栏摘要文案；未传入时显示选中数量。'
      },
      {
        name: 'bulkActionClearText',
        type: 'string',
        defaultValue: "'Clear'",
        description: '批量操作栏清空选择按钮文案。'
      },
      {
        name: 'stickyBulkActions',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否让批量操作栏在滚动时吸附在当前工作区顶部。'
      },
      {
        name: 'pagination',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否启用内置分页。'
      },
      {
        name: 'page',
        type: 'number',
        defaultValue: '1',
        description: '当前页码。'
      },
      {
        name: 'pageSize',
        type: 'number',
        defaultValue: '10',
        description: '每页数量。'
      },
      {
        name: 'total',
        type: 'number',
        description: '总数量，默认使用 data.length。'
      },
      {
        name: 'columnKeys',
        type: 'string[]',
        description: '受控列偏好；数组顺序决定可见列顺序。'
      },
      {
        name: 'defaultColumnKeys',
        type: 'string[]',
        defaultValue: '[]',
        description: '非受控初始列偏好；数组顺序决定初始列顺序。'
      },
      {
        name: 'showColumnSettings',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示列设置区。'
      },
      {
        name: 'columnResetText',
        type: 'string',
        defaultValue: "'Reset columns'",
        description: '列设置区恢复默认列按钮文案；点击后回到 defaultColumnKeys，未配置时回到全部列。'
      },
      {
        name: 'reorderableColumns',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否在列设置区显示列顺序调整按钮；调整后通过 update:columnKeys 和 columnChange 暴露新顺序。'
      },
      {
        name: 'virtualized',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否启用行虚拟滚动；适合千级以上后台列表，只渲染视口附近行。'
      },
      {
        name: 'virtualHeight',
        type: 'number',
        defaultValue: '320',
        description: '虚拟滚动表格工作区高度，单位为 px；开启 virtualized 后会作为内部滚动容器高度。'
      },
      {
        name: 'virtualRowHeight',
        type: 'number',
        defaultValue: '48',
        description: '虚拟滚动计算使用的单行高度，需与实际行高保持一致。'
      },
      {
        name: 'virtualOverscan',
        type: 'number',
        defaultValue: '4',
        description: '虚拟滚动视口外额外渲染的行数，用于降低快速滚动时的空白感。'
      },
      {
        name: 'resizable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否允许拖拽内部表格表头调整列宽。'
      },
      {
        name: 'minColumnWidth',
        type: 'number',
        defaultValue: '96',
        description: '拖拽列宽时的全局最小列宽，会透传给内部 YTable。'
      },
      {
        name: 'columnWidths',
        type: 'Record<string, number>',
        description: '受控列宽偏好，key 为列 key，value 为 px 宽度。'
      },
      {
        name: 'defaultColumnWidths',
        type: 'Record<string, number>',
        defaultValue: '{}',
        description: '非受控初始列宽偏好，适合从本地或服务端偏好初始化。'
      },
      {
        name: 'refreshable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示刷新按钮。'
      },
      {
        name: 'remote',
        type: 'boolean',
        defaultValue: 'false',
        description: '远程数据模式，启用后不做本地分页切片，并通过 requestChange 汇总请求参数。'
      }
    ],
    events: [
      {
        name: 'update:page',
        type: 'number',
        description: '页码变化。'
      },
      {
        name: 'pageChange',
        type: 'YDataTablePagePayload',
        description: '分页变化完整载荷。'
      },
      {
        name: 'update:columnKeys',
        type: 'string[]',
        description: '可见列变化。'
      },
      {
        name: 'columnChange',
        type: 'YDataTableColumnPayload',
        description: '可见列变化完整载荷。'
      },
      {
        name: 'refresh',
        type: 'void',
        description: '点击刷新按钮。'
      },
      {
        name: 'requestChange',
        type: 'YDataTableRequestPayload',
        description: 'remote 模式下分页、排序、筛选、刷新和列设置变化后的统一请求载荷。'
      },
      {
        name: 'update:selectedRowKeys',
        type: 'string[]',
        description: '行选择变化。'
      },
      {
        name: 'selectionChange',
        type: 'YDataTableSelectionPayload',
        description: '行选择变化完整载荷，包含 selectedRowKeys 与 selectedRows。'
      },
      {
        name: 'bulkAction',
        type: 'YDataTableBulkActionPayload',
        description: '点击内置批量操作按钮时触发，包含 action、selectedRowKeys 与 selectedRows。'
      },
      {
        name: 'bulkClear',
        type: 'YDataTableSelectionPayload',
        description: '点击批量操作栏清空选择时触发，载荷保留清空前的选中行。'
      },
      {
        name: 'update:density',
        type: 'YDataTableDensity',
        description: '表格密度变化。'
      },
      {
        name: 'densityChange',
        type: 'YDataTableDensity',
        description: '表格密度变化后的完整事件。'
      },
      {
        name: 'update:viewPreference',
        type: 'YDataTableViewPreference',
        description: '列设置、列宽、密度或筛选变化后输出完整表格视图偏好。'
      },
      {
        name: 'viewPreferenceChange',
        type: 'YDataTableViewPreferencePayload',
        description: '表格视图偏好变化后的完整载荷，包含 reason 和 preference。'
      },
      {
        name: 'update:filters',
        type: 'YTableFilterState',
        description: '列筛选状态变化。'
      },
      {
        name: 'filterChange',
        type: 'YTableFilterPayload',
        description: '列筛选状态变化后的完整事件。'
      },
      {
        name: 'update:columnWidths',
        type: 'Record<string, number>',
        description: '列宽偏好变化；可与 columnWidths 组合保存用户列宽。'
      },
      {
        name: 'columnResize',
        type: 'YDataTableColumnResizePayload',
        description: '内部表格列宽拖拽结束后触发，可用于保存用户列宽偏好。'
      },
      {
        name: 'sortChange',
        type: 'YTableSortPayload',
        description: '排序变化完整载荷。'
      }
    ],
    slots: [
      {
        name: 'actions',
        type: 'VNode',
        description: '右上角操作区。'
      },
      {
        name: 'bulkSummary',
        type: '{ selectedCount: number; selectedRowKeys: string[]; selectedRows: YTableRow[] }',
        description: '自定义批量操作栏摘要。'
      },
      {
        name: 'bulkActions',
        type: '{ selectedCount: number; selectedRowKeys: string[]; selectedRows: YTableRow[]; clearSelection: () => void }',
        description: '自定义批量操作区。'
      },
      {
        name: 'empty',
        type: '{ loading: boolean; emptyText: string; loadingText: string; columns: YTableColumn[]; errorText: string; refresh: () => void }',
        description: '自定义空状态内容，会透传内部 YTable 状态并额外提供错误文案和刷新动作。'
      },
      {
        name: 'cell-{key}',
        type: '{ row, column, value }',
        description: '透传给内部 YTable 的单元格插槽。'
      }
    ],
    types: [
      {
        name: 'YDataTableSelectionPayload',
        type: '{ selectedRowKeys: string[]; selectedRows: YTableRow[] }',
        description: '列表选择载荷。'
      },
      {
        name: 'YDataTableBulkActionPayload',
        type: '{ action: YBulkActionItem; selectedRowKeys: string[]; selectedRows: YTableRow[] }',
        description: '批量操作事件载荷。'
      },
      {
        name: 'YDataTableDensity',
        type: "'comfortable' | 'compact'",
        description: '表格展示密度。'
      },
      {
        name: 'YDataTableViewPreference',
        type: '{ columnKeys: string[]; columnWidths: Record<string, number>; density: YDataTableDensity; filters: YTableFilterState }',
        description: '可持久化的表格视图偏好，聚合列顺序、列宽、密度和筛选。'
      },
      {
        name: 'YDataTableViewPreferenceReason',
        type: "'columns' | 'columnResize' | 'density' | 'filters'",
        description: '触发表格视图偏好变化的原因。'
      },
      {
        name: 'YDataTableViewPreferencePayload',
        type: '{ reason: YDataTableViewPreferenceReason; preference: YDataTableViewPreference }',
        description: '表格视图偏好变化事件载荷。'
      },
      {
        name: 'YDataTablePagePayload',
        type: '{ page: number; pageSize: number }',
        description: '分页变化载荷。'
      },
      {
        name: 'YDataTableColumnPayload',
        type: '{ columnKeys: string[]; columns: YTableColumn[] }',
        description: '列显示变化载荷。'
      },
      {
        name: 'YDataTableColumnResizePayload',
        type: 'YTableColumnResizePayload',
        description: '列宽调整事件载荷，透传自内部 YTable。'
      },
      {
        name: 'YDataTableRequestReason',
        type: "'page' | 'sort' | 'columns' | 'columnResize' | 'filters' | 'refresh'",
        description: '触发远程请求变化的原因。'
      },
      {
        name: 'YDataTableRequestPayload',
        type: '{ reason: YDataTableRequestReason; page: number; pageSize: number; sortKey: string; sortOrder: YTableSortOrder; columnKeys: string[]; filters: YTableFilterState; columnWidths?: Record<string, number> }',
        description: 'remote 模式统一请求载荷，包含分页、排序、列设置、列宽偏好和筛选状态。'
      }
    ]
  },
  YDataView: {
    props: [
      {
        name: 'views',
        type: 'YDataViewItem[]',
        description: '保存视图列表，每个视图可以携带独立的表格偏好。',
        required: true
      },
      {
        name: 'columns',
        type: 'YTableColumn[]',
        description: '传给内部 YDataTable 的列定义。',
        required: true
      },
      {
        name: 'data',
        type: 'YTableRow[]',
        description: '传给内部 YDataTable 的行数据。',
        required: true
      },
      {
        name: 'modelValue',
        type: 'string',
        description: '受控当前视图 value。'
      },
      {
        name: 'defaultView',
        type: 'string',
        description: '非受控初始视图 value，未设置时使用第一项视图。'
      },
      {
        name: 'viewPreference',
        type: 'Partial<YDataTableViewPreference>',
        description: '受控表格视图偏好，会覆盖当前保存视图的内置偏好。'
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '组合视图标题。'
      },
      {
        name: 'description',
        type: 'string',
        defaultValue: "''",
        description: '组合视图说明。'
      },
      {
        name: 'savedViewsTitle',
        type: 'string',
        defaultValue: "'Saved views'",
        description: '左侧保存视图区域标题。'
      },
      {
        name: 'savedViewsDescription',
        type: 'string',
        defaultValue: "''",
        description: '左侧保存视图区域说明。'
      },
      {
        name: 'tableTitle',
        type: 'string',
        defaultValue: "''",
        description: '右侧数据表标题，未设置时复用组合视图标题。'
      },
      {
        name: 'tableDescription',
        type: 'string',
        defaultValue: "''",
        description: '右侧数据表说明，未设置时复用组合视图说明。'
      },
      {
        name: 'pagination',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否启用内部数据表分页。'
      },
      {
        name: 'pageSize',
        type: 'number',
        defaultValue: '10',
        description: '分页每页数量。'
      },
      {
        name: 'selectable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否启用内部数据表行选择。'
      },
      {
        name: 'showColumnSettings',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否显示内部数据表列设置。'
      },
      {
        name: 'showDensitySettings',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否显示内部数据表密度切换。'
      },
      {
        name: 'showFilterSummary',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否显示当前筛选摘要。'
      },
      {
        name: 'reorderableColumns',
        type: 'boolean',
        defaultValue: 'true',
        description: '列设置中是否允许调整列顺序。'
      },
      {
        name: 'resizable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否允许拖拽调整内部表格列宽。'
      },
      {
        name: 'remote',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否使用远程数据模式并透出 requestChange 事件。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'string',
        description: '当前保存视图变化。'
      },
      {
        name: 'change',
        type: 'YDataViewItem',
        description: '保存视图切换后的完整视图项。'
      },
      {
        name: 'update:viewPreference',
        type: 'YDataTableViewPreference',
        description: '当前视图的表格偏好变化。'
      },
      {
        name: 'viewPreferenceChange',
        type: 'YDataViewPreferencePayload',
        description: '表格偏好变化完整载荷，包含 reason、view 和 preference。'
      },
      {
        name: 'save',
        type: 'YDataViewSavePayload',
        description: '点击保存当前视图时触发，返回当前视图和完整表格偏好。'
      },
      {
        name: 'create',
        type: 'void',
        description: '点击创建视图时触发。'
      },
      {
        name: 'manage',
        type: 'void',
        description: '点击管理视图时触发。'
      },
      {
        name: 'requestChange',
        type: 'YDataTableRequestPayload',
        description: '远程模式下透传内部数据表统一请求载荷。'
      }
    ],
    types: [
      {
        name: 'YDataViewItem',
        type: 'YSavedViewItem & { preference?: Partial<YDataTableViewPreference> }',
        description: '带表格偏好的保存视图项。'
      },
      {
        name: 'YDataViewPreferenceReason',
        type: "YDataTableViewPreferenceReason | 'view'",
        description: '触发表格偏好同步的原因，view 表示切换保存视图。'
      },
      {
        name: 'YDataViewPreferencePayload',
        type: '{ reason: YDataViewPreferenceReason; view?: YDataViewItem; preference: YDataTableViewPreference }',
        description: '保存视图组合偏好变化载荷。'
      },
      {
        name: 'YDataViewSavePayload',
        type: '{ view?: YDataViewItem; preference: YDataTableViewPreference }',
        description: '保存当前视图时的载荷。'
      }
    ]
  },
  YResourcePage: {
    props: [
      { name: 'title', type: 'string', description: '资源页标题。', required: true },
      { name: 'description', type: 'string', defaultValue: "''", description: '资源页说明。' },
      { name: 'eyebrow', type: 'string', defaultValue: "''", description: '标题上方的分组标签。' },
      { name: 'status', type: 'string', defaultValue: "''", description: '标题区状态徽标。' },
      { name: 'density', type: 'YResourcePageDensity', defaultValue: "'comfortable'", description: '页面整体密度，会同步给搜索表单和 CRUD 布局。' },
      { name: 'stickyHeader', type: 'boolean', defaultValue: 'false', description: '是否让标题区在长资源页内吸顶。' },
      { name: 'searchModel', type: 'Record<string, string>', defaultValue: '{}', description: '搜索表单值。' },
      { name: 'searchFields', type: 'YSearchFormField[]', defaultValue: '[]', description: '搜索字段配置；为空时不渲染搜索区。' },
      { name: 'searchTitle', type: 'string', defaultValue: "'Search resources'", description: '搜索表单标题。' },
      { name: 'views', type: 'YDataViewItem[]', description: '保存视图列表。', required: true },
      { name: 'viewValue', type: 'string', description: '受控当前保存视图 value。' },
      { name: 'defaultView', type: 'string', description: '非受控初始保存视图 value。' },
      { name: 'viewPreference', type: 'Partial<YDataTableViewPreference>', description: '受控表格视图偏好。' },
      { name: 'columns', type: 'YTableColumn[]', description: '资源列表列定义。', required: true },
      { name: 'data', type: 'YTableRow[]', description: '资源列表数据。', required: true },
      { name: 'tableTitle', type: 'string', defaultValue: "''", description: '数据区标题。' },
      { name: 'pagination', type: 'boolean', defaultValue: 'false', description: '是否启用数据区分页。' },
      { name: 'selectable', type: 'boolean', defaultValue: 'false', description: '是否启用数据区行选择。' },
      { name: 'detailOpen', type: 'boolean', defaultValue: 'false', description: '是否打开详情抽屉。' },
      { name: 'detailTitle', type: 'string', defaultValue: "'Resource detail'", description: '详情抽屉标题。' },
      { name: 'detailPlacement', type: 'YResourcePageDetailPlacement', defaultValue: "'right'", description: '详情抽屉方向。' }
    ],
    events: [
      { name: 'update:searchModel', type: 'Record<string, string>', description: '搜索表单值变化。' },
      { name: 'search', type: 'YResourcePageSearchPayload', description: '搜索提交。' },
      { name: 'reset', type: 'Record<string, string>', description: '搜索重置。' },
      { name: 'searchCollapseChange', type: 'boolean', description: '高级筛选折叠状态变化。' },
      { name: 'update:viewValue', type: 'string', description: '保存视图值变化。' },
      { name: 'viewChange', type: 'YDataViewItem', description: '保存视图切换。' },
      { name: 'update:viewPreference', type: 'YDataTableViewPreference', description: '当前视图的表格偏好变化。' },
      { name: 'viewPreferenceChange', type: 'YDataViewPreferencePayload', description: '当前视图偏好变化完整载荷。' },
      { name: 'saveView', type: 'YDataViewSavePayload', description: '保存当前视图。' },
      { name: 'createView', type: 'void', description: '创建保存视图。' },
      { name: 'manageViews', type: 'void', description: '管理保存视图。' },
      { name: 'requestChange', type: 'YDataTableRequestPayload', description: '远程资源列表请求状态变化。' },
      { name: 'closeDetail', type: 'void', description: '请求关闭详情抽屉。' }
    ],
    slots: [
      { name: 'actions', type: 'VNode', description: '标题区主操作。' },
      { name: 'searchActions', type: 'VNode', description: '搜索表单右下角附加操作。' },
      { name: 'filters', type: 'VNode', description: '搜索区下方的快速筛选。' },
      { name: 'toolbar', type: 'VNode', description: '资源列表上方工具区。' },
      { name: 'aside', type: 'VNode', description: '资源页右侧辅助信息。' },
      { name: 'detail', type: 'VNode', description: '详情抽屉内容。' },
      { name: 'detailFooter', type: 'VNode', description: '详情抽屉底部操作。' },
      { name: 'footer', type: 'VNode', description: '资源页底部区域。' }
    ],
    types: [
      { name: 'YResourcePageDensity', type: "'comfortable' | 'compact'", description: '资源页密度。' },
      { name: 'YResourcePageDetailPlacement', type: "'left' | 'right'", description: '详情抽屉方向。' },
      { name: 'YResourcePageSearchPayload', type: '{ values: Record<string, string>; activeFieldKeys: string[] }', description: '搜索提交载荷。' }
    ]
  },
  YSchemaForm: {
    props: [
      { name: 'modelValue', type: 'Record<string, unknown>', description: '表单模型值，组件会维护本地草稿并同步 update:modelValue。', required: true },
      { name: 'schema', type: 'YSchemaFormField[]', description: '字段 schema，包含类型、文案、选项、规则和显隐条件。', required: true },
      { name: 'title', type: 'string', defaultValue: "''", description: '表单标题。' },
      { name: 'description', type: 'string', defaultValue: "''", description: '表单说明。' },
      { name: 'submitText', type: 'string', defaultValue: "'Submit'", description: '提交按钮文案。' },
      { name: 'resetText', type: 'string', defaultValue: "'Reset'", description: '重置按钮文案。' },
      { name: 'summaryTitle', type: 'string', defaultValue: "'Please fix the following fields'", description: '错误摘要标题。' },
      { name: 'labelWidth', type: 'string', defaultValue: "''", description: '标签列宽，透传给 YForm。' },
      { name: 'density', type: 'YSchemaFormDensity', defaultValue: "'comfortable'", description: '表单密度。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用整张表单。' },
      { name: 'scrollToError', type: 'boolean', defaultValue: 'false', description: '提交校验失败时是否滚动到第一个错误字段。' },
      { name: 'showSummary', type: 'boolean', defaultValue: 'true', description: '是否显示错误摘要。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'Record<string, unknown>', description: '字段值变化。' },
      { name: 'submit', type: 'YFormValidateResult', description: '提交校验完成，无论成功失败都会触发。' },
      { name: 'finish', type: 'Record<string, unknown>', description: '提交校验通过。' },
      { name: 'finishFailed', type: 'YFormValidateResult', description: '提交校验失败。' },
      { name: 'validate', type: 'YFormValidateResult', description: '任意一次整表校验结果。' },
      { name: 'reset', type: 'Record<string, unknown>', description: '重置为初始值。' }
    ],
    slots: [
      { name: 'header', type: 'VNode', description: '自定义表单标题区。' },
      { name: 'field-{key}', type: '{ field: YSchemaFormField; value: unknown; error: string; invalid: boolean; update: (value: YFormValue) => void }', description: '按字段 key 自定义渲染控件。' },
      { name: 'actions', type: 'VNode', description: '自定义底部操作区。' }
    ],
    types: [
      { name: 'YSchemaFormFieldType', type: "'input' | 'textarea' | 'select' | 'switch' | 'array'", description: '内置字段类型，array 字段会复用 YFieldArray。' },
      { name: 'YSchemaFormDensity', type: "'comfortable' | 'compact'", description: '配置化表单密度。' },
      { name: 'YSchemaFormField', type: '{ key: string; label: string; type?: YSchemaFormFieldType; rules?: YFormRule | YFormRule[]; visibleWhen?: (model: Record<string, unknown>) => boolean; defaultItem?: YFieldArrayItem; itemKey?: YFieldArrayItemKey; itemFields?: YSchemaFormArrayItemField[]; min?: number; max?: number }', description: '字段 schema 配置；array 类型可配置 itemLabel、addText、removeText、emptyText、defaultItem、itemKey、itemFields、min 和 max。' },
      { name: 'YSchemaFormArrayItemField', type: '{ key: string; label: string; type?: YSchemaFormArrayItemFieldType; required?: boolean; rules?: YFormRule | YFormRule[]; options?: YSelectOption[]; placeholder?: string; disabled?: boolean }', description: 'array 行内字段配置，支持 input、textarea、select、switch、required 和 rules。' }
    ]
  },
  YFieldArray: {
    props: [
      { name: 'modelValue', type: 'YFieldArrayValue', description: '字段数组值。', required: true },
      { name: 'title', type: 'string', defaultValue: "''", description: '数组区域标题。' },
      { name: 'description', type: 'string', defaultValue: "''", description: '数组区域说明。' },
      { name: 'addText', type: 'string', defaultValue: "'Add item'", description: '添加按钮文案。' },
      { name: 'removeText', type: 'string', defaultValue: "'Remove item'", description: '删除按钮文案。' },
      { name: 'emptyText', type: 'string', defaultValue: "'No items yet'", description: '空态文案。' },
      { name: 'itemLabel', type: 'string', defaultValue: "'Item'", description: '每一项的默认标题前缀。' },
      { name: 'defaultItem', type: 'YFieldArrayItem', defaultValue: '{}', description: '新增项时克隆的默认对象。' },
      { name: 'itemKey', type: 'YFieldArrayItemKey', defaultValue: "''", description: '每一项的稳定 key 字段名或生成函数；建议使用 id，避免增删行后焦点和内部状态错位。' },
      { name: 'min', type: 'number', defaultValue: '0', description: '最少保留项数。' },
      { name: 'max', type: 'number', defaultValue: 'Infinity', description: '最多允许项数。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用添加、删除和 slot 操作。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'YFieldArrayValue', description: '字段数组变化。' },
      { name: 'add', type: 'YFieldArrayPayload', description: '添加项。' },
      { name: 'remove', type: 'YFieldArrayPayload', description: '删除项。' },
      { name: 'itemChange', type: 'YFieldArrayPayload', description: '单项内容变化。' }
    ],
    slots: [
      { name: 'default', type: '{ item: YFieldArrayItem; itemKey: string; index: number; items: YFieldArrayValue; canAdd: boolean; canRemove: boolean; update: (item: YFieldArrayItem) => void; remove: () => void }', description: '自定义每一项内容。' },
      { name: 'header', type: 'VNode', description: '自定义标题区。' }
    ],
    types: [
      { name: 'YFieldArrayItem', type: 'Record<string, unknown>', description: '单个动态字段项。' },
      { name: 'YFieldArrayItemKey', type: 'string | ((item: YFieldArrayItem, index: number) => string | number)', description: '用于生成每一项稳定渲染 key 的字段名或函数。' },
      { name: 'YFieldArrayValue', type: 'YFieldArrayItem[]', description: '动态字段数组值。' },
      { name: 'YFieldArrayPayload', type: '{ index: number; item: YFieldArrayItem; items: YFieldArrayValue }', description: '增删改事件载荷。' }
    ]
  },
  YBulkActionBar: {
    props: [
      {
        name: 'selectedRowKeys',
        type: 'string[]',
        description: '当前选中行 key 列表。',
        required: true
      },
      {
        name: 'actions',
        type: 'YBulkActionItem[]',
        defaultValue: '[]',
        description: '批量动作列表。'
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '自定义摘要文案，默认显示选中数量。'
      },
      {
        name: 'clearText',
        type: 'string',
        defaultValue: "'Clear'",
        description: '清空选择按钮文案。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Bulk actions'",
        description: '外层 status 区域的可访问名称。'
      }
    ],
    events: [
      {
        name: 'action',
        type: 'YBulkActionPayload',
        description: '点击批量动作，返回动作定义和当前选中 key。'
      },
      {
        name: 'clear',
        type: 'void',
        description: '点击清空选择。'
      }
    ],
    slots: [
      {
        name: 'summary',
        type: '{ selectedCount: number; selectedRowKeys: string[] }',
        description: '自定义左侧选中摘要。'
      },
      {
        name: 'actions',
        type: '{ selectedCount: number; selectedRowKeys: string[] }',
        description: '自定义右侧批量操作区。'
      }
    ],
    types: [
      {
        name: 'YBulkActionTone',
        type: "'neutral' | 'danger' | 'warning' | 'success' | 'info'",
        description: '批量动作按钮的语义色。'
      },
      {
        name: 'YBulkActionItem',
        type: '{ label: string; value: string; tone?: YBulkActionTone; disabled?: boolean }',
        description: '批量动作定义。'
      },
      {
        name: 'YBulkActionPayload',
        type: '{ action: YBulkActionItem; selectedRowKeys: string[] }',
        description: '批量动作事件载荷。'
      }
    ]
  },
  YSearchForm: {
    props: [
      {
        name: 'modelValue',
        type: 'Record<string, string>',
        description: '受控搜索表单值。',
        required: true
      },
      {
        name: 'fields',
        type: 'YSearchFormField[]',
        description: '搜索字段配置。',
        required: true
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '表单标题。'
      },
      {
        name: 'description',
        type: 'string',
        defaultValue: "''",
        description: '表单说明。'
      },
      {
        name: 'collapsedCount',
        type: 'number',
        defaultValue: '3',
        description: '折叠时展示的字段数量。'
      },
      {
        name: 'collapsible',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否允许展开和收起。'
      },
      {
        name: 'defaultCollapsed',
        type: 'boolean',
        defaultValue: 'true',
        description: '初始是否折叠。'
      },
      {
        name: 'density',
        type: "'comfortable' | 'compact'",
        defaultValue: "'comfortable'",
        description: '表单密度。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Search form'",
        description: 'form 的可访问名称。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'Record<string, string>',
        description: '字段值变化。'
      },
      {
        name: 'search',
        type: 'YSearchFormSubmitPayload',
        description: '提交查询，返回当前值和有效字段 key。'
      },
      {
        name: 'reset',
        type: 'Record<string, string>',
        description: '重置表单，返回默认值。'
      },
      {
        name: 'collapseChange',
        type: 'boolean',
        description: '展开或收起状态变化。'
      }
    ],
    slots: [
      {
        name: 'header',
        type: 'VNode',
        description: '自定义标题区域。'
      },
      {
        name: 'field-{key}',
        type: '{ field: YSearchFormField; value: string; update: (value: string) => void }',
        description: '自定义某个字段的渲染。'
      },
      {
        name: 'actions',
        type: 'VNode',
        description: '右侧扩展动作。'
      }
    ],
    types: [
      {
        name: 'YSearchFormFieldType',
        type: "'input' | 'select'",
        description: '内置字段类型。'
      },
      {
        name: 'YSearchFormDensity',
        type: "'comfortable' | 'compact'",
        description: '搜索表单密度。'
      },
      {
        name: 'YSearchFormOption',
        type: '{ label: string; value: string; disabled?: boolean }',
        description: 'select 字段选项。'
      },
      {
        name: 'YSearchFormField',
        type: '{ key: string; label: string; type?: YSearchFormFieldType; placeholder?: string; options?: YSearchFormOption[]; defaultValue?: string; disabled?: boolean; hidden?: boolean }',
        description: '搜索字段定义。'
      },
      {
        name: 'YSearchFormSubmitPayload',
        type: '{ values: Record<string, string>; activeFieldKeys: string[] }',
        description: '查询提交载荷。'
      }
    ]
  },
  YCrudLayout: {
    props: [
      {
        name: 'title',
        type: 'string',
        description: '页面主标题，也作为默认可访问名称。',
        required: true
      },
      {
        name: 'description',
        type: 'string',
        defaultValue: "''",
        description: '页面说明。'
      },
      {
        name: 'eyebrow',
        type: 'string',
        defaultValue: "''",
        description: '标题上方的轻量分组文本。'
      },
      {
        name: 'status',
        type: 'string',
        defaultValue: "''",
        description: '标题旁的状态标签。'
      },
      {
        name: 'density',
        type: "'comfortable' | 'compact'",
        defaultValue: "'comfortable'",
        description: '布局密度。'
      },
      {
        name: 'stickyHeader',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否让标题区在滚动时吸顶。'
      },
      {
        name: 'headingLevel',
        type: '1 | 2 | 3',
        defaultValue: '1',
        description: '内部 PageHeader 的标题层级，嵌入组件文档或局部区域时可降为 2 或 3。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: '外层 section 的可访问名称，默认使用 title。'
      }
    ],
    slots: [
      {
        name: 'actions',
        type: 'VNode',
        description: '页面标题右侧操作区。'
      },
      {
        name: 'search',
        type: 'VNode',
        description: '筛选表单区，通常放 YSearchPanel。'
      },
      {
        name: 'filters',
        type: 'VNode',
        description: '状态筛选区，通常放 YFilterTabs。'
      },
      {
        name: 'toolbar',
        type: 'VNode',
        description: '筛选行右侧工具按钮。'
      },
      {
        name: 'table',
        type: 'VNode',
        description: '主列表区域，通常放 YDataTable。'
      },
      {
        name: 'aside',
        type: 'VNode',
        description: '右侧上下文信息或保存视图区域。'
      },
      {
        name: 'footer',
        type: 'VNode',
        description: '底部批处理、说明或固定动作区。'
      },
      {
        name: 'default',
        type: 'VNode',
        description: '未提供 table slot 时的主内容 fallback。'
      }
    ],
    types: [
      {
        name: 'YCrudLayoutDensity',
        type: "'comfortable' | 'compact'",
        description: 'CRUD 页面布局密度。'
      }
    ]
  },
  YFilterTabs: {
    props: [
      {
        name: 'modelValue',
        type: 'string',
        description: '当前选中的 tab value。',
        required: true
      },
      {
        name: 'items',
        type: 'YFilterTabItem[]',
        description: '筛选项列表。',
        required: true
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Filter tabs'",
        description: 'tablist 的可访问名称。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'string',
        description: '选中项变化。'
      },
      {
        name: 'change',
        type: 'YFilterTabItem',
        description: '选中项变化完整载荷。'
      }
    ],
    types: [
      {
        name: 'YFilterTabTone',
        type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'",
        description: '筛选项数量徽标和高亮色。'
      },
      {
        name: 'YFilterTabItem',
        type: '{ label: string; value: string; count?: number; tone?: YFilterTabTone; disabled?: boolean }',
        description: '筛选项定义。'
      }
    ]
  },
  YStatusTimeline: {
    props: [
      {
        name: 'items',
        type: 'YStatusTimelineItem[]',
        description: '时间线节点列表。',
        required: true
      },
      {
        name: 'activeValue',
        type: 'string',
        defaultValue: "''",
        description: '当前节点 value，会同步 aria-current。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Status timeline'",
        description: '外层 section 的可访问名称。'
      },
      {
        name: 'size',
        type: "'md' | 'sm'",
        defaultValue: "'md'",
        description: '时间线尺寸。'
      },
      {
        name: 'reverse',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否倒序展示节点。'
      }
    ],
    slots: [
      {
        name: 'actions',
        type: '{ item: YStatusTimelineItem; index: number }',
        description: '节点右下角操作区。'
      },
      {
        name: 'item',
        type: '{ item: YStatusTimelineItem; index: number }',
        description: '节点内容扩展区。'
      }
    ],
    types: [
      {
        name: 'YStatusTimelineTone',
        type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'",
        description: '节点强调色。'
      },
      {
        name: 'YStatusTimelineSize',
        type: "'md' | 'sm'",
        description: '时间线尺寸。'
      },
      {
        name: 'YStatusTimelineItem',
        type: '{ title: string; value: string; description?: string; time?: string; actor?: string; tone?: YStatusTimelineTone; status?: string; disabled?: boolean }',
        description: '时间线节点定义。'
      }
    ]
  },
  YReviewWorkflow: {
    props: [
      {
        name: 'items',
        type: 'YReviewWorkflowStep[]',
        description: '审核流程步骤。',
        required: true
      },
      {
        name: 'activeValue',
        type: 'string',
        defaultValue: "''",
        description: '当前步骤 value。'
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "'Review workflow'",
        description: '组件标题。'
      },
      {
        name: 'description',
        type: 'string',
        defaultValue: "''",
        description: '组件说明。'
      },
      {
        name: 'status',
        type: 'string',
        defaultValue: "''",
        description: '顶部状态文案，默认取当前步骤状态。'
      },
      {
        name: 'reviewer',
        type: 'string',
        defaultValue: "''",
        description: '审核人或当前负责人。'
      },
      {
        name: 'dueText',
        type: 'string',
        defaultValue: "''",
        description: '截止时间或时效提示。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否禁用内置决策操作。'
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: '提交中状态。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Review workflow'",
        description: '外层 section 的可访问名称。'
      }
    ],
    events: [
      {
        name: 'approve',
        type: 'YReviewWorkflowPayload',
        description: '点击通过。'
      },
      {
        name: 'requestChanges',
        type: 'YReviewWorkflowPayload',
        description: '点击要求修改。'
      },
      {
        name: 'reject',
        type: 'YReviewWorkflowPayload',
        description: '点击驳回。'
      },
      {
        name: 'action',
        type: 'YReviewWorkflowPayload',
        description: '任意内置决策操作触发时的统一事件。'
      }
    ],
    slots: [
      {
        name: 'meta',
        type: 'VNode',
        description: '自定义右上角负责人、时效等元信息。'
      },
      {
        name: 'stepActions',
        type: '{ item: YReviewWorkflowStep; index: number }',
        description: '每个流程节点的操作区。'
      },
      {
        name: 'step',
        type: '{ item: YReviewWorkflowStep; index: number }',
        description: '每个流程节点的扩展内容。'
      },
      {
        name: 'actions',
        type: '{ activeStep?: YReviewWorkflowStep }',
        description: '自定义底部决策操作区。'
      }
    ],
    types: [
      {
        name: 'YReviewWorkflowTone',
        type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'",
        description: '审核步骤状态色。'
      },
      {
        name: 'YReviewWorkflowAction',
        type: "'approve' | 'reject' | 'requestChanges'",
        description: '内置决策动作。'
      },
      {
        name: 'YReviewWorkflowStep',
        type: '{ title: string; value: string; description?: string; time?: string; actor?: string; tone?: YReviewWorkflowTone; status?: string; disabled?: boolean }',
        description: '审核流程步骤定义。'
      },
      {
        name: 'YReviewWorkflowPayload',
        type: '{ action: YReviewWorkflowAction; activeValue: string; activeStep?: YReviewWorkflowStep }',
        description: '审核决策事件载荷。'
      }
    ]
  },
  YSavedViews: {
    props: [
      {
        name: 'modelValue',
        type: 'string',
        description: '当前选中的视图 value。',
        required: true
      },
      {
        name: 'items',
        type: 'YSavedViewItem[]',
        description: '保存视图列表。',
        required: true
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "'Saved views'",
        description: '组件标题。'
      },
      {
        name: 'description',
        type: 'string',
        defaultValue: "''",
        description: '组件说明。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Saved views'",
        description: '外层 section 的可访问名称。'
      },
      {
        name: 'createText',
        type: 'string',
        defaultValue: "'Create view'",
        description: '创建按钮文案。'
      },
      {
        name: 'saveText',
        type: 'string',
        defaultValue: "'Save current'",
        description: '保存当前视图按钮文案。'
      },
      {
        name: 'manageText',
        type: 'string',
        defaultValue: "'Manage views'",
        description: '管理按钮文案。'
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No saved views yet'",
        description: '空状态文案。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'string',
        description: '选中视图变化。'
      },
      {
        name: 'change',
        type: 'YSavedViewItem',
        description: '选中视图完整载荷。'
      },
      {
        name: 'create',
        type: 'void',
        description: '点击创建视图。'
      },
      {
        name: 'save',
        type: 'void',
        description: '点击保存当前视图。'
      },
      {
        name: 'manage',
        type: 'void',
        description: '点击管理视图。'
      }
    ],
    types: [
      {
        name: 'YSavedViewItem',
        type: '{ label: string; value: string; description?: string; count?: number; pinned?: boolean; disabled?: boolean }',
        description: '保存视图定义。'
      }
    ]
  },
  YForm: {
    props: [
      {
        name: 'model',
        type: 'Record<string, unknown>',
        description: '表单数据对象。',
        required: true
      },
      {
        name: 'rules',
        type: 'YFormRules',
        defaultValue: '{}',
        description: '字段校验规则，key 支持点路径。'
      },
      {
        name: 'labelWidth',
        type: 'string',
        defaultValue: "''",
        description: '统一标签列宽，例如 120px。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用整个表单区域。'
      },
      {
        name: 'scrollToError',
        type: 'boolean',
        defaultValue: 'false',
        description: '校验失败后是否滚动到第一个错误字段。'
      },
      {
        name: 'scrollIntoViewOptions',
        type: 'boolean | ScrollIntoViewOptions',
        defaultValue: "{ block: 'center', behavior: 'smooth' }",
        description: '滚动到字段时传给 scrollIntoView 的选项。'
      }
    ],
    slots: [
      {
        name: 'default',
        type: 'VNode',
        description: '表单字段、按钮和摘要。'
      }
    ],
    events: [
      {
        name: 'validate',
        type: 'YFormValidateResult',
        description: '调用 validate 后触发。'
      },
      {
        name: 'submit',
        type: '(result: YFormValidateResult, event: SubmitEvent)',
        description: '原生提交被拦截并完成 submit 校验后触发。'
      }
    ],
    types: [
      {
        name: 'YFormRule',
        type: '{ required?: boolean; message?: string; min?: number; max?: number; len?: number; pattern?: RegExp; trigger?: YFormValidateTrigger | YFormValidateTrigger[]; validator?: (...) => boolean | string | Promise<boolean | string> }',
        description: '单条字段校验规则。'
      },
      {
        name: 'YFormRules',
        type: 'Record<string, YFormRule | YFormRule[]>',
        description: '表单规则集合。'
      },
      {
        name: 'YFormValidateResult',
        type: '{ valid: boolean; errors: YFormValidateError[] }',
        description: '表单校验结果。'
      },
      {
        name: 'YFormValidateError',
        type: '{ prop: string; messages: string[] }',
        description: '单字段错误。'
      },
      {
        name: 'YFormValidateTrigger',
        type: "'change' | 'blur' | 'submit'",
        description: '规则触发类型。'
      },
      {
        name: 'YFormScrollIntoViewOptions',
        type: 'boolean | ScrollIntoViewOptions',
        description: '字段滚动配置。'
      }
    ]
  },
  YTable: {
    props: [
      {
        name: 'columns',
        type: 'YTableColumn[]',
        description: '列定义。',
        required: true
      },
      {
        name: 'data',
        type: 'YTableRow[]',
        description: '数据源。',
        required: true
      },
      {
        name: 'rowKey',
        type: 'string',
        defaultValue: "'id'",
        description: '行唯一键。'
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No data yet'",
        description: '空状态文案。'
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示加载状态，已有数据会保留表格结构并覆盖加载提示。'
      },
      {
        name: 'loadingText',
        type: 'string',
        defaultValue: "'Loading data...'",
        description: '加载状态提示文案。'
      },
      {
        name: 'caption',
        type: 'string',
        defaultValue: "''",
        description: '表格标题说明，会渲染为原生 caption。'
      },
      {
        name: 'summary',
        type: 'string',
        defaultValue: "''",
        description: '表格底部状态摘要；未传入且启用 selectable 时会自动显示选中统计。'
      },
      {
        name: 'maxHeight',
        type: 'string | number',
        description: '表格滚动容器最大高度；设置后启用纵向滚动并让表头在容器内吸顶。'
      },
      {
        name: 'striped',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示条纹行。'
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否使用紧凑尺寸。'
      },
      {
        name: 'selectable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示行选择列。'
      },
      {
        name: 'selectedRowKeys',
        type: 'string[]',
        description: '受控选中行 key。'
      },
      {
        name: 'defaultSelectedRowKeys',
        type: 'string[]',
        defaultValue: '[]',
        description: '非受控初始选中行 key。'
      },
      {
        name: 'sortKey',
        type: 'string',
        description: '受控排序列 key。'
      },
      {
        name: 'sortOrder',
        type: "YTableSortOrder",
        description: '受控排序方向。'
      },
      {
        name: 'defaultSortKey',
        type: 'string',
        defaultValue: "''",
        description: '非受控初始排序列 key。'
      },
      {
        name: 'defaultSortOrder',
        type: "YTableSortOrder",
        defaultValue: 'null',
        description: '非受控初始排序方向。'
      },
      {
        name: 'filters',
        type: 'YTableFilterState',
        description: '受控列筛选状态；key 为列 key，value 为选中的筛选值数组。'
      },
      {
        name: 'defaultFilters',
        type: 'YTableFilterState',
        defaultValue: '{}',
        description: '非受控初始列筛选状态。'
      },
      {
        name: 'filterMode',
        type: "'local' | 'manual'",
        defaultValue: "'local'",
        description: '筛选模式；manual 只维护筛选状态和事件，不对 data 做本地过滤。'
      },
      {
        name: 'expandable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示展开列，用于展示行详情。'
      },
      {
        name: 'expandedRowKeys',
        type: 'string[]',
        description: '受控展开行 key。'
      },
      {
        name: 'defaultExpandedRowKeys',
        type: 'string[]',
        defaultValue: '[]',
        description: '非受控初始展开行 key。'
      },
      {
        name: 'virtualized',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否启用行虚拟滚动；适合千级以上数据表。'
      },
      {
        name: 'virtualHeight',
        type: 'number',
        defaultValue: '320',
        description: '虚拟滚动表格可视高度，单位为 px。'
      },
      {
        name: 'virtualRowHeight',
        type: 'number',
        defaultValue: '48',
        description: '虚拟滚动计算使用的单行高度。'
      },
      {
        name: 'virtualOverscan',
        type: 'number',
        defaultValue: '4',
        description: '视口外额外渲染的行数，降低快速滚动时的空白感。'
      },
      {
        name: 'resizable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否允许拖拽表头右侧手柄调整列宽；列上可用 resizable: false 禁用单列。'
      },
      {
        name: 'minColumnWidth',
        type: 'number',
        defaultValue: '96',
        description: '拖拽列宽时的全局最小列宽，列定义上的 minWidth 优先级更高。'
      },
      {
        name: 'columnWidths',
        type: 'Record<string, number>',
        description: '受控列宽状态，优先级高于列定义中的 width。'
      },
      {
        name: 'defaultColumnWidths',
        type: 'Record<string, number>',
        defaultValue: '{}',
        description: '非受控初始列宽状态。'
      }
    ],
    slots: [
      {
        name: 'empty',
        type: '{ loading: boolean; emptyText: string; loadingText: string; columns: YTableColumn[] }',
        description: '自定义空状态或加载空状态内容。'
      },
      {
        name: 'cell-{key}',
        type: '{ row, column, value }',
        description: '自定义指定列的单元格内容。'
      },
      {
        name: 'expand',
        type: '{ row, rowKey, rowIndex, expanded }',
        description: '自定义展开行详情内容。'
      }
    ],
    events: [
      {
        name: 'update:selectedRowKeys',
        type: 'string[]',
        description: '行选择变化。'
      },
      {
        name: 'selectionChange',
        type: 'YTableSelectionPayload',
        description: '行选择变化后的完整载荷。'
      },
      {
        name: 'update:expandedRowKeys',
        type: 'string[]',
        description: '展开行变化。'
      },
      {
        name: 'expandChange',
        type: 'YTableExpandPayload',
        description: '展开或收起行后的完整载荷。'
      },
      {
        name: 'update:sortKey',
        type: 'string',
        description: '排序列变化。'
      },
      {
        name: 'update:sortOrder',
        type: 'YTableSortOrder',
        description: '排序方向变化。'
      },
      {
        name: 'sortChange',
        type: 'YTableSortPayload',
        description: '排序变化后的完整载荷。'
      },
      {
        name: 'update:filters',
        type: 'YTableFilterState',
        description: '列筛选状态变化。'
      },
      {
        name: 'filterChange',
        type: 'YTableFilterPayload',
        description: '列筛选状态变化后的完整载荷。'
      },
      {
        name: 'update:columnWidths',
        type: 'Record<string, number>',
        description: '列宽拖拽结束后的受控更新事件。'
      },
      {
        name: 'columnResize',
        type: 'YTableColumnResizePayload',
        description: '列宽拖拽结束后触发，返回当前列宽和所有已调整列宽。'
      }
    ],
    methods: [
      {
        name: 'clearSort',
        type: '() => void',
        description: '清除当前排序状态，并触发 update:sortKey、update:sortOrder 和 sortChange。'
      },
      {
        name: 'clearFilter',
        type: '(columnKeys?: string[]) => void',
        description: '清除指定列或全部列筛选状态，并触发 update:filters 和 filterChange。'
      }
    ],
    types: [
      {
        name: 'YTableColumn',
        type: "{ key: string; label: string; width?: string | number; minWidth?: number; maxWidth?: number; align?: 'left' | 'center' | 'right'; fixed?: 'left' | 'right'; resizable?: boolean; sortable?: boolean | compareFn; filters?: YTableFilterOption[]; filterMethod?: Function }",
        description: '表格列配置。'
      },
      {
        name: 'YTableColumnResizePayload',
        type: '{ columnKey: string; width: number; widths: Record<string, number>; column: YTableColumn }',
        description: '列宽调整事件载荷。'
      },
      {
        name: 'YTableFilterOption',
        type: '{ text: string; value: string | number | boolean }',
        description: '列筛选选项。'
      },
      {
        name: 'YTableFilterState',
        type: 'Record<string, Array<string | number | boolean>>',
        description: '列筛选状态。'
      },
      {
        name: 'YTableFilterPayload',
        type: '{ columnKey: string; values: YTableFilterValue[]; filters: YTableFilterState; column?: YTableColumn }',
        description: '筛选事件载荷。'
      },
      {
        name: 'YTableExpandPayload',
        type: '{ rowKey: string; expanded: boolean; expandedRowKeys: string[]; row: YTableRow }',
        description: '展开行变化事件载荷。'
      },
      {
        name: 'YTableColumnFixed',
        type: "'left' | 'right'",
        description: '固定列方向。'
      },
      {
        name: 'YTableRow',
        type: 'Record<string, unknown>',
        description: '表格行数据。'
      },
      {
        name: 'YTableSortOrder',
        type: "'asc' | 'desc' | null",
        description: '排序方向。'
      },
      {
        name: 'YTableSortPayload',
        type: '{ key: string; order: YTableSortOrder; column?: YTableColumn }',
        description: '排序事件载荷。'
      },
      {
        name: 'YTableSelectionPayload',
        type: '{ selectedRowKeys: string[]; selectedRows: YTableRow[] }',
        description: '选择事件载荷。'
      }
    ]
  },
  YList: {
    props: [
      {
        name: 'items',
        type: 'YListItem[]',
        description: '列表数据项。',
        required: true
      },
      {
        name: 'itemKey',
        type: 'YListItemKey',
        defaultValue: "'key'",
        description: '列表项唯一键字段或生成函数。'
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '列表标题。'
      },
      {
        name: 'description',
        type: 'string',
        defaultValue: "''",
        description: '列表说明。'
      },
      {
        name: 'bordered',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否展示带边框容器。'
      },
      {
        name: 'split',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否展示列表项分割线。'
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否展示加载占位。'
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No items yet'",
        description: '空状态文案。'
      },
      {
        name: 'size',
        type: 'YListSize',
        defaultValue: "'md'",
        description: '列表尺寸。'
      },
      {
        name: 'layout',
        type: 'YListLayout',
        defaultValue: "'horizontal'",
        description: '列表项内容和操作区布局。'
      },
      {
        name: 'columns',
        type: 'number',
        defaultValue: '1',
        description: '栅格列数，限制在 1 到 4。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: '外层 section 的可访问名称，未传时回退到 title。'
      }
    ],
    slots: [
      {
        name: 'header',
        type: 'VNode',
        description: '自定义标题区。'
      },
      {
        name: 'extra',
        type: 'VNode',
        description: '标题右侧扩展操作。'
      },
      {
        name: 'item',
        type: '{ item: YListItem; index: number }',
        description: '自定义整个列表项。'
      },
      {
        name: 'title',
        type: '{ item: YListItem; index: number }',
        description: '自定义列表项标题。'
      },
      {
        name: 'description',
        type: '{ item: YListItem; index: number }',
        description: '自定义列表项描述。'
      },
      {
        name: 'meta',
        type: '{ item: YListItem; index: number }',
        description: '自定义列表项元信息。'
      },
      {
        name: 'actions',
        type: '{ item: YListItem; index: number }',
        description: '列表项操作区。'
      },
      {
        name: 'empty',
        type: 'VNode',
        description: '自定义空状态。'
      },
      {
        name: 'footer',
        type: 'VNode',
        description: '自定义底部内容。'
      }
    ],
    types: [
      {
        name: 'YListSize',
        type: "'sm' | 'md' | 'lg'",
        description: '列表尺寸。'
      },
      {
        name: 'YListLayout',
        type: "'horizontal' | 'vertical'",
        description: '列表项布局。'
      },
      {
        name: 'YListItemKey',
        type: "string | ((item: YListItem, index: number) => string | number)",
        description: '列表项键生成方式。'
      },
      {
        name: 'YListItem',
        type: '{ key?: string | number; title?: string; label?: string; name?: string; description?: string; meta?: string; disabled?: boolean }',
        description: '列表项定义。'
      }
    ]
  },
  YDescriptions: {
    props: [
      {
        name: 'items',
        type: 'YDescriptionItem[]',
        description: '详情项列表。',
        required: true
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '详情标题。'
      },
      {
        name: 'description',
        type: 'string',
        defaultValue: "''",
        description: '详情说明。'
      },
      {
        name: 'column',
        type: 'number',
        defaultValue: '3',
        description: '桌面端列数，限制在 1 到 4。'
      },
      {
        name: 'bordered',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示边框容器。'
      },
      {
        name: 'layout',
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: '标签和值的展示布局。'
      },
      {
        name: 'size',
        type: "'md' | 'sm'",
        defaultValue: "'md'",
        description: '组件尺寸。'
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No details yet'",
        description: '无可见详情项时的文案。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Descriptions'",
        description: '外层 section 的可访问名称。'
      }
    ],
    slots: [
      {
        name: 'extra',
        type: 'VNode',
        description: '标题右侧扩展操作。'
      },
      {
        name: 'item-{key}',
        type: '{ item: YDescriptionItem; index: number }',
        description: '自定义指定详情项内容，优先使用 item.key。'
      }
    ],
    types: [
      {
        name: 'YDescriptionsLayout',
        type: "'horizontal' | 'vertical'",
        description: '标签和值的展示布局。'
      },
      {
        name: 'YDescriptionsSize',
        type: "'md' | 'sm'",
        description: '组件尺寸。'
      },
      {
        name: 'YDescriptionItem',
        type: '{ label: string; value?: string | number; key?: string; span?: number; hidden?: boolean }',
        description: '详情项定义。'
      }
    ]
  },
  YImage: {
    props: [
      {
        name: 'src',
        type: 'YImageValue',
        defaultValue: "''",
        description: '图片地址。'
      },
      {
        name: 'alt',
        type: 'string',
        defaultValue: "''",
        description: '图片替代文本，内容图片必须提供。'
      },
      {
        name: 'fit',
        type: 'YImageFit',
        defaultValue: "'cover'",
        description: '图片 object-fit 展示方式。'
      },
      {
        name: 'width',
        type: 'string',
        defaultValue: "'100%'",
        description: '外层图片容器宽度。'
      },
      {
        name: 'height',
        type: 'string',
        defaultValue: "'auto'",
        description: '外层图片容器高度。'
      },
      {
        name: 'radius',
        type: 'string',
        defaultValue: "'var(--yok-radius-lg)'",
        description: '图片圆角，支持 CSS 长度或 token。'
      },
      {
        name: 'lazy',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否使用原生 lazy loading。'
      },
      {
        name: 'preview',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否允许点击图片打开预览。'
      },
      {
        name: 'previewSrcList',
        type: 'YImageValue[]',
        defaultValue: '[]',
        description: '预览图片列表；为空时使用 src。'
      },
      {
        name: 'previewOpen',
        type: 'boolean | null',
        defaultValue: 'null',
        description: '受控预览开关，配合 update:previewOpen 使用。'
      },
      {
        name: 'initialIndex',
        type: 'number',
        defaultValue: '0',
        description: '打开预览时展示的图片索引。'
      }
    ],
    events: [
      {
        name: 'load',
        type: '(event: Event) => void',
        description: '图片加载成功时触发。'
      },
      {
        name: 'error',
        type: '(event: Event) => void',
        description: '图片加载失败时触发。'
      },
      {
        name: 'preview-open',
        type: '(index: number) => void',
        description: '预览打开时触发。'
      },
      {
        name: 'preview-close',
        type: '() => void',
        description: '预览关闭时触发。'
      },
      {
        name: 'update:previewOpen',
        type: '(open: boolean) => void',
        description: '受控预览状态更新事件。'
      }
    ],
    slots: [
      {
        name: 'placeholder',
        type: 'VNode',
        description: '图片加载中占位内容。'
      },
      {
        name: 'error',
        type: 'VNode',
        description: '图片加载失败内容。'
      },
      {
        name: 'preview-footer',
        type: '{ activeIndex: number; src: string }',
        description: '预览层底部说明内容。'
      }
    ],
    types: [
      {
        name: 'YImageFit',
        type: "'fill' | 'contain' | 'cover' | 'none' | 'scale-down'",
        description: '图片填充方式。'
      },
      {
        name: 'YImageValue',
        type: 'string',
        description: '图片地址类型。'
      }
    ]
  },
  YStatistic: {
    props: [
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '指标标题。'
      },
      {
        name: 'value',
        type: 'YStatisticValue',
        defaultValue: 'undefined',
        description: '要展示的指标值。'
      },
      {
        name: 'prefix',
        type: 'string',
        defaultValue: "''",
        description: '数值前缀文本。'
      },
      {
        name: 'suffix',
        type: 'string',
        defaultValue: "''",
        description: '数值后缀或单位文本。'
      },
      {
        name: 'precision',
        type: 'number',
        defaultValue: 'undefined',
        description: '数字小数位数，传入后使用 toFixed 格式化。'
      },
      {
        name: 'groupSeparator',
        type: 'string',
        defaultValue: "','",
        description: '整数部分的分组分隔符。'
      },
      {
        name: 'decimalSeparator',
        type: 'string',
        defaultValue: "'.'",
        description: '小数分隔符。'
      },
      {
        name: 'formatter',
        type: 'YStatisticFormatter',
        defaultValue: 'undefined',
        description: '自定义值渲染格式化函数。'
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否展示加载占位。'
      },
      {
        name: 'tone',
        type: 'YStatisticTone',
        defaultValue: "'neutral'",
        description: '数值语义色。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: '外层 section 的可访问名称，未传时回退到 title。'
      }
    ],
    slots: [
      {
        name: 'title',
        type: 'VNode',
        description: '自定义标题内容。'
      },
      {
        name: 'extra',
        type: 'VNode',
        description: '标题右侧扩展操作。'
      },
      {
        name: 'prefix',
        type: 'VNode',
        description: '自定义前缀。'
      },
      {
        name: 'value',
        type: '{ value: YStatisticValue; formattedValue: string }',
        description: '自定义数值内容。'
      },
      {
        name: 'suffix',
        type: 'VNode',
        description: '自定义后缀或单位。'
      }
    ],
    types: [
      {
        name: 'YStatisticTone',
        type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'",
        description: '指标语义色。'
      },
      {
        name: 'YStatisticValue',
        type: 'string | number | null | undefined',
        description: '指标值类型。'
      },
      {
        name: 'YStatisticFormatter',
        type: '(value: YStatisticValue) => string | number',
        description: '自定义格式化函数。'
      }
    ]
  },
  YCountdown: {
    props: [
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '倒计时标题。'
      },
      {
        name: 'value',
        type: 'YCountdownValue',
        defaultValue: '-',
        required: true,
        description: '目标时间，支持时间戳、Date 或可被 Date.parse 解析的字符串。'
      },
      {
        name: 'format',
        type: 'string',
        defaultValue: "'HH:mm:ss'",
        description: '展示格式，支持 DD、HH、mm、ss token。'
      },
      {
        name: 'prefix',
        type: 'string',
        defaultValue: "''",
        description: '数值前缀文本。'
      },
      {
        name: 'suffix',
        type: 'string',
        defaultValue: "''",
        description: '数值后缀文本。'
      },
      {
        name: 'running',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否启动内部计时器，设为 false 时可用于外部控制或静态展示。'
      },
      {
        name: 'tone',
        type: 'YCountdownTone',
        defaultValue: "'neutral'",
        description: '倒计时语义色。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: '外层 timer 的可访问名称，未传时回退到 title。'
      }
    ],
    events: [
      {
        name: 'change',
        type: '(remaining: number) => void',
        description: '每次内部计时器刷新时触发，参数为剩余毫秒数。'
      },
      {
        name: 'finish',
        type: '() => void',
        description: '倒计时到 0 时触发一次。'
      }
    ],
    slots: [
      {
        name: 'title',
        type: 'VNode',
        description: '自定义标题内容。'
      },
      {
        name: 'extra',
        type: 'VNode',
        description: '标题右侧扩展操作。'
      },
      {
        name: 'prefix',
        type: 'VNode',
        description: '自定义前缀。'
      },
      {
        name: 'value',
        type: '{ remaining: number; formattedValue: string }',
        description: '自定义倒计时数值。'
      },
      {
        name: 'suffix',
        type: 'VNode',
        description: '自定义后缀。'
      }
    ],
    types: [
      {
        name: 'YCountdownTone',
        type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'",
        description: '倒计时语义色。'
      },
      {
        name: 'YCountdownValue',
        type: 'string | number | Date',
        description: '目标时间值类型。'
      }
    ]
  },
  YResult: {
    props: [
      {
        name: 'status',
        type: 'YResultStatus',
        defaultValue: "'info'",
        description: '结果状态，包含语义状态和 403 / 404 / 500 预设。'
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '结果标题，未传时使用状态默认标题。'
      },
      {
        name: 'subtitle',
        type: 'string',
        defaultValue: "''",
        description: '结果说明，未传时使用状态默认说明。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Result'",
        description: '外层 section 的可访问名称。'
      }
    ],
    slots: [
      {
        name: 'default',
        type: 'VNode',
        description: '默认操作区，会作为 extra 插槽的 fallback，便于复制简洁示例。'
      },
      {
        name: 'icon',
        type: 'VNode',
        description: '自定义状态图标。'
      },
      {
        name: 'extra',
        type: 'VNode',
        description: '结果下方操作区，优先级高于默认插槽。'
      }
    ],
    types: [
      {
        name: 'YResultStatus',
        type: "'success' | 'info' | 'warning' | 'danger' | '403' | '404' | '500'",
        description: '结果状态类型。'
      }
    ]
  },
  YTimeline: {
    props: [
      {
        name: 'items',
        type: 'YTimelineItem[]',
        description: '时间线节点列表。',
        required: true
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "''",
        description: '时间线标题。'
      },
      {
        name: 'description',
        type: 'string',
        defaultValue: "''",
        description: '时间线说明。'
      },
      {
        name: 'placement',
        type: "'left' | 'right' | 'alternate'",
        defaultValue: "'right'",
        description: '内容相对轴线的位置。'
      },
      {
        name: 'size',
        type: "'md' | 'sm'",
        defaultValue: "'md'",
        description: '时间线尺寸。'
      },
      {
        name: 'reverse',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否倒序展示节点。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Timeline'",
        description: '外层 section 的可访问名称。'
      }
    ],
    slots: [
      {
        name: 'header',
        type: 'VNode',
        description: '自定义标题区。'
      },
      {
        name: 'dot',
        type: '{ item: YTimelineItem; index: number }',
        description: '自定义节点圆点。'
      },
      {
        name: 'actions',
        type: '{ item: YTimelineItem; index: number }',
        description: '节点操作区。'
      },
      {
        name: 'item',
        type: '{ item: YTimelineItem; index: number }',
        description: '节点扩展内容。'
      }
    ],
    types: [
      {
        name: 'YTimelineTone',
        type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'",
        description: '节点语义色。'
      },
      {
        name: 'YTimelinePlacement',
        type: "'left' | 'right' | 'alternate'",
        description: '内容相对轴线的位置。'
      },
      {
        name: 'YTimelineSize',
        type: "'md' | 'sm'",
        description: '时间线尺寸。'
      },
      {
        name: 'YTimelineItem',
        type: '{ title: string; value?: string; description?: string; time?: string; tone?: YTimelineTone; disabled?: boolean; loading?: boolean }',
        description: '时间线节点定义。'
      }
    ]
  },
  YInputNumber: {
    props: [
      {
        name: 'modelValue',
        type: 'number | null',
        defaultValue: 'null',
        description: '当前数字值。'
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: '表单标签。'
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "''",
        description: '占位文本。'
      },
      {
        name: 'min',
        type: 'number',
        description: '最小值。'
      },
      {
        name: 'max',
        type: 'number',
        description: '最大值。'
      },
      {
        name: 'step',
        type: 'number',
        defaultValue: '1',
        description: '步进值。'
      },
      {
        name: 'precision',
        type: 'number',
        description: '保留小数位数。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用状态。'
      },
      {
        name: 'controls',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否显示加减按钮。'
      },
      {
        name: 'error',
        type: 'string',
        defaultValue: "''",
        description: '错误信息。'
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: 'ConfigProvider size',
        description: '数字输入尺寸；未传入时读取 ConfigProvider。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'number | null',
        description: '输入值变化。'
      },
      {
        name: 'change',
        type: 'number | null',
        description: '失焦归一化或步进后触发。'
      }
    ],
    types: [
      {
        name: 'YInputNumberValue',
        type: 'number | null',
        description: '数字输入值类型。'
      }
    ]
  },
  YSlider: {
    props: [
      {
        name: 'modelValue',
        type: 'YSliderValue',
        defaultValue: '0',
        description: '当前滑块值；range 模式下为有序双值数组。'
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: '表单标签。'
      },
      {
        name: 'min',
        type: 'number',
        defaultValue: '0',
        description: '最小值。'
      },
      {
        name: 'max',
        type: 'number',
        defaultValue: '100',
        description: '最大值。'
      },
      {
        name: 'step',
        type: 'number',
        defaultValue: '1',
        description: '步进值。'
      },
      {
        name: 'precision',
        type: 'number',
        description: '显示和提交时保留的小数位。'
      },
      {
        name: 'range',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否启用双滑块范围选择。'
      },
      {
        name: 'vertical',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否使用垂直方向展示滑块。'
      },
      {
        name: 'height',
        type: 'string',
        defaultValue: "'160px'",
        description: '垂直滑块的固定高度。'
      },
      {
        name: 'showTooltip',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否在轨道上显示当前值提示。'
      },
      {
        name: 'tooltipPlacement',
        type: 'YSliderTooltipPlacement',
        defaultValue: "'top'",
        description: '当前值提示的出现方向。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用状态。'
      },
      {
        name: 'showValue',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否显示当前值。'
      },
      {
        name: 'marks',
        type: 'YSliderMark[]',
        defaultValue: '[]',
        description: '轨道标记。'
      },
      {
        name: 'error',
        type: 'string',
        defaultValue: "''",
        description: '错误信息。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'YSliderValue',
        description: '拖动或键盘调整时触发。'
      },
      {
        name: 'change',
        type: 'YSliderValue',
        description: '提交滑块值时触发。'
      }
    ],
    types: [
      {
        name: 'YSliderValue',
        type: 'number | [number, number]',
        description: '单值或范围滑块值。'
      },
      {
        name: 'YSliderMark',
        type: '{ value: number; label: string }',
        description: '滑块标记数据。'
      },
      {
        name: 'YSliderTooltipPlacement',
        type: "'top' | 'right' | 'bottom' | 'left'",
        description: '滑块值提示的展示方向。'
      }
    ]
  },
  YRate: {
    props: [
      {
        name: 'modelValue',
        type: 'number',
        defaultValue: '0',
        description: '当前评分值。'
      },
      {
        name: 'count',
        type: 'number',
        defaultValue: '5',
        description: '评分项数量。'
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: '评分组标签。'
      },
      {
        name: 'allowHalf',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否允许半星评分。'
      },
      {
        name: 'texts',
        type: 'string[]',
        defaultValue: '[]',
        description: '每个评分等级对应的展示文案和按钮 title。'
      },
      {
        name: 'size',
        type: 'YRateSize',
        defaultValue: "'medium'",
        description: '评分图标尺寸。'
      },
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'true',
        description: '再次选择当前分数时是否清空。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用状态。'
      },
      {
        name: 'readonly',
        type: 'boolean',
        defaultValue: 'false',
        description: '只读展示状态。'
      },
      {
        name: 'showValue',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否显示当前分值文本。'
      },
      {
        name: 'icon',
        type: 'string',
        defaultValue: "'★'",
        description: '激活图标。'
      },
      {
        name: 'voidIcon',
        type: 'string',
        defaultValue: "'☆'",
        description: '未激活图标。'
      },
      {
        name: 'error',
        type: 'string',
        defaultValue: "''",
        description: '错误信息。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'number',
        description: '选择评分时触发。'
      },
      {
        name: 'change',
        type: 'number',
        description: '提交评分变化时触发。'
      }
    ],
    types: [
      {
        name: 'YRateSize',
        type: "'small' | 'medium' | 'large'",
        description: '评分尺寸。'
      }
    ]
  },
  YColorPicker: {
    props: [
      {
        name: 'id',
        type: 'string',
        defaultValue: "''",
        description: '传给 HEX 文本输入的 id；原生色板输入会使用 `${id}-native`。'
      },
      {
        name: 'modelValue',
        type: 'string',
        defaultValue: "''",
        description: '当前 HEX 颜色值。'
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: '颜色选择器标签。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: '无可见 label 时传给内部输入的可访问名称。'
      },
      {
        name: 'ariaDescribedby',
        type: 'string',
        defaultValue: "''",
        description: '传给内部输入的 aria-describedby，通常来自表单帮助文本或 FormItem messageId。'
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "'#14B8A6'",
        description: '文本输入占位值。'
      },
      {
        name: 'presets',
        type: 'string[]',
        defaultValue: 'defaultColorPresets',
        description: '预设色列表，showAlpha 开启后可支持 4 位或 8 位 HEXA。'
      },
      {
        name: 'showAlpha',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否允许 4 位或 8 位 HEXA 透明度颜色。'
      },
      {
        name: 'showText',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否在触发器中显示当前颜色文本。'
      },
      {
        name: 'size',
        type: 'YColorPickerSize',
        defaultValue: 'YConfigProvider.size',
        description: '颜色触发器与输入区尺寸；未传入时读取 YConfigProvider 的全局 size。'
      },
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否显示清空按钮。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用状态。'
      },
      {
        name: 'showValue',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否显示当前规范化色值。'
      },
      {
        name: 'error',
        type: 'string',
        defaultValue: "''",
        description: '错误信息。'
      },
      {
        name: 'invalid',
        type: 'boolean',
        defaultValue: 'false',
        description: '强制标记原生色板和 HEX 文本输入为无效状态；error 或非法输入存在时会自动标记。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'string',
        description: '选择或输入合法颜色时触发。'
      },
      {
        name: 'change',
        type: 'string',
        description: '提交颜色变化时触发。'
      },
      {
        name: 'clear',
        type: 'void',
        description: '清空颜色时触发。'
      }
    ],
    types: [
      {
        name: 'defaultColorPresets',
        type: 'string[]',
        description: '内置清爽可爱的默认预设色。'
      },
      {
        name: 'YColorPickerSize',
        type: "'small' | 'medium' | 'large'",
        description: '颜色选择器尺寸。'
      }
    ]
  },
  YDatePicker: {
    props: [
      {
        name: 'id',
        type: 'string',
        defaultValue: "''",
        description: '传给内部 input 的 id；未传入时自动生成稳定 id。'
      },
      {
        name: 'modelValue',
        type: 'string',
        defaultValue: "''",
        description: '当前日期值，格式为 YYYY-MM-DD。'
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: '表单标签。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: '无可见 label 时传给内部 input 的可访问名称。'
      },
      {
        name: 'ariaDescribedby',
        type: 'string',
        defaultValue: "''",
        description: '传给内部 input 的 aria-describedby，通常来自表单帮助文本或 FormItem messageId。'
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "'Select date'",
        description: '占位文本。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用状态。'
      },
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否允许清空日期。'
      },
      {
        name: 'locale',
        type: 'string',
        defaultValue: 'YConfigProvider.locale',
        description: '月份和星期显示所用 locale；未传入时读取 YConfigProvider。'
      },
      {
        name: 'size',
        type: 'YokConfigSize',
        defaultValue: 'YConfigProvider.size',
        description: '输入框尺寸；未传入时读取 YConfigProvider 的全局 size。'
      },
      {
        name: 'disabledDate',
        type: '(date: Date) => boolean',
        description: '禁用指定日期。'
      },
      {
        name: 'shortcuts',
        type: 'YDateShortcut[]',
        defaultValue: '[]',
        description: '日期快捷项，例如今天、明天、下周。'
      },
      {
        name: 'error',
        type: 'string',
        defaultValue: "''",
        description: '错误信息。'
      },
      {
        name: 'invalid',
        type: 'boolean',
        defaultValue: 'false',
        description: '强制标记输入框为无效状态；error 存在时会自动标记。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'string',
        description: '日期值变化。'
      },
      {
        name: 'change',
        type: 'string',
        description: '选择或清空日期后触发。'
      },
      {
        name: 'clear',
        type: 'void',
        description: '清空日期后触发。'
      },
      {
        name: 'visibleChange',
        type: 'boolean',
        description: '日期面板打开或关闭时触发。'
      }
    ],
    types: [
      {
        name: 'YDatePickerDisabledDate',
        type: '(date: Date) => boolean',
        description: '禁用日期判断函数。'
      },
      {
        name: 'YDateShortcut',
        type: '{ label: string; value: string | (() => string); disabled?: boolean }',
        description: '单日期快捷项。'
      },
      {
        name: 'YDatePickerCell',
        type: "{ date: Date; value: string; day: number; inCurrentMonth: boolean; selected: boolean; today: boolean; disabled: boolean }",
        description: '日历单元格数据。'
      }
    ]
  },
  YDateRangePicker: {
    props: [
      {
        name: 'id',
        type: 'string',
        defaultValue: "''",
        description: '传给内部 input 的 id；未传入时自动生成稳定 id。'
      },
      {
        name: 'modelValue',
        type: '[string, string] | []',
        defaultValue: '[]',
        description: '当前日期范围值，格式为 YYYY-MM-DD。'
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: '表单标签。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: '无可见 label 时传给内部 input 的可访问名称。'
      },
      {
        name: 'ariaDescribedby',
        type: 'string',
        defaultValue: "''",
        description: '传给内部 input 的 aria-describedby，通常来自表单帮助文本或 FormItem messageId。'
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "'Select date range'",
        description: '占位文本。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用状态。'
      },
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否允许清空日期范围。'
      },
      {
        name: 'locale',
        type: 'string',
        defaultValue: 'YConfigProvider.locale',
        description: '月份和星期显示所用 locale；未传入时读取 YConfigProvider。'
      },
      {
        name: 'size',
        type: 'YokConfigSize',
        defaultValue: 'YConfigProvider.size',
        description: '输入框尺寸；未传入时读取 YConfigProvider 的全局 size。'
      },
      {
        name: 'disabledDate',
        type: '(date: Date) => boolean',
        description: '禁用指定日期。'
      },
      {
        name: 'shortcuts',
        type: 'YDateRangeShortcut[]',
        defaultValue: '[]',
        description: '日期范围快捷项，例如本周、本月、最近 7 天。'
      },
      {
        name: 'separator',
        type: 'string',
        defaultValue: "' to '",
        description: '展示范围时的分隔符。'
      },
      {
        name: 'error',
        type: 'string',
        defaultValue: "''",
        description: '错误信息。'
      },
      {
        name: 'invalid',
        type: 'boolean',
        defaultValue: 'false',
        description: '强制标记输入框为无效状态；error 存在时会自动标记。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: '[string, string] | []',
        description: '日期范围值变化。'
      },
      {
        name: 'change',
        type: '[string, string] | []',
        description: '选择完整范围或清空范围后触发。'
      },
      {
        name: 'clear',
        type: 'void',
        description: '清空日期范围后触发。'
      },
      {
        name: 'visibleChange',
        type: 'boolean',
        description: '日期范围面板打开或关闭时触发。'
      }
    ],
    types: [
      {
        name: 'YDateRangeValue',
        type: '[string, string] | []',
        description: '日期范围值。'
      },
      {
        name: 'YDateRangeShortcut',
        type: '{ label: string; value: [string, string] | [] | (() => [string, string] | []); disabled?: boolean }',
        description: '日期范围快捷项。'
      },
      {
        name: 'YDateRangePickerCell',
        type: 'YDatePickerCell & { rangeStart: boolean; rangeEnd: boolean; inRange: boolean }',
        description: '带范围状态的日历单元格数据。'
      },
      {
        name: 'YDatePickerDisabledDate',
        type: '(date: Date) => boolean',
        description: '禁用日期判断函数。'
      }
    ]
  },
  YTimePicker: {
    props: [
      {
        name: 'id',
        type: 'string',
        defaultValue: "''",
        description: '传给内部 input 的 id；未传入时自动生成稳定 id。'
      },
      {
        name: 'modelValue',
        type: 'string',
        defaultValue: "''",
        description: '当前时间值，格式为 HH:mm。'
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: '表单标签。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "''",
        description: '无可见 label 时传给内部 input 的可访问名称。'
      },
      {
        name: 'ariaDescribedby',
        type: 'string',
        defaultValue: "''",
        description: '传给内部 input 的 aria-describedby，通常来自表单帮助文本或 FormItem messageId。'
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "'Select time'",
        description: '占位文本。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用状态。'
      },
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否允许清空时间。'
      },
      {
        name: 'minuteStep',
        type: 'number',
        defaultValue: '1',
        description: '分钟选项步长。'
      },
      {
        name: 'disabledTime',
        type: '(time: YTimePickerOption) => boolean',
        description: '禁用指定时间。'
      },
      {
        name: 'error',
        type: 'string',
        defaultValue: "''",
        description: '错误信息。'
      },
      {
        name: 'invalid',
        type: 'boolean',
        defaultValue: 'false',
        description: '强制标记输入框为无效状态；error 存在时会自动标记。'
      },
      {
        name: 'size',
        type: 'YokConfigSize',
        defaultValue: 'YConfigProvider.size',
        description: '输入框尺寸；未传入时读取 YConfigProvider 的全局 size。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'string',
        description: '时间值变化。'
      },
      {
        name: 'change',
        type: 'string',
        description: '选择或清空时间后触发。'
      },
      {
        name: 'clear',
        type: 'void',
        description: '清空时间后触发。'
      },
      {
        name: 'visibleChange',
        type: 'boolean',
        description: '时间面板打开或关闭时触发。'
      }
    ],
    types: [
      {
        name: 'YTimePickerOption',
        type: '{ hour: number; minute: number; value: string; label: string; disabled: boolean }',
        description: '时间选项数据。'
      },
      {
        name: 'YTimePickerDisabledTime',
        type: '(time: YTimePickerOption) => boolean',
        description: '禁用时间判断函数。'
      }
    ]
  },
  YCascader: {
    props: [
      {
        name: 'modelValue',
        type: 'string[] | string[][]',
        defaultValue: '[]',
        description: '当前选中路径值；multiple 时为路径数组。'
      },
      {
        name: 'options',
        type: 'YCascaderOption[]',
        description: '层级选项数据。',
        required: true
      },
      {
        name: 'multiple',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否启用多选叶子路径。'
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: '表单标签。'
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "'Select option'",
        description: '占位文本。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用状态。'
      },
      {
        name: 'clearable',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否允许清空选择。'
      },
      {
        name: 'separator',
        type: 'string',
        defaultValue: "' / '",
        description: '展示路径分隔符。'
      },
      {
        name: 'error',
        type: 'string',
        defaultValue: "''",
        description: '错误信息。'
      },
      {
        name: 'size',
        type: 'YokConfigSize',
        defaultValue: 'YConfigProvider.size',
        description: '输入框尺寸；未传入时读取 YConfigProvider 的全局 size。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'string[] | string[][]',
        description: '选中路径值变化，multiple 时返回路径数组。'
      },
      {
        name: 'change',
        type: 'YCascaderSelectPayload | YCascaderMultipleSelectPayload',
        description: '选择叶子节点或切换多选项后触发。'
      },
      {
        name: 'clear',
        type: 'void',
        description: '清空选择后触发。'
      }
    ],
    slots: [
      {
        name: 'option',
        type: '{ option, level }',
        description: '自定义选项内容。'
      }
    ],
    types: [
      {
        name: 'YCascaderOption',
        type: '{ value: string; label: string; disabled?: boolean; children?: YCascaderOption[] }',
        description: '级联选项数据。'
      },
      {
        name: 'YCascaderColumn',
        type: '{ level: number; options: YCascaderOption[] }',
        description: '级联面板列数据。'
      },
      {
        name: 'YCascaderValue',
        type: 'string[]',
        description: '单选路径值。'
      },
      {
        name: 'YCascaderMultipleValue',
        type: 'string[][]',
        description: '多选路径值。'
      },
      {
        name: 'YCascaderSelectPayload',
        type: '{ value: string[]; labels: string[]; option: YCascaderOption }',
        description: '单选选择事件载荷。'
      },
      {
        name: 'YCascaderMultipleSelectPayload',
        type: '{ value: string[][]; labels: string[][]; option: YCascaderOption; checked: boolean; checkedValue: string[] }',
        description: '多选切换事件载荷。'
      }
    ]
  },
  YTransfer: {
    props: [
      {
        name: 'modelValue',
        type: 'string[]',
        defaultValue: '[]',
        description: '右侧目标列表的值。'
      },
      {
        name: 'options',
        type: 'YTransferOption[]',
        description: '全部候选项。',
        required: true
      },
      {
        name: 'titles',
        type: '[string, string]',
        defaultValue: "['Source', 'Target']",
        description: '左右两侧面板标题。'
      },
      {
        name: 'filterable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示搜索框。'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用整体交互。'
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No options'",
        description: '空状态文案。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Transfer options'",
        description: '穿梭框整体区域的可访问名称。'
      }
    ],
    events: [
      {
        name: 'update:modelValue',
        type: 'string[]',
        description: '目标列表值变化。'
      },
      {
        name: 'change',
        type: 'YTransferChangePayload',
        description: '移动选项后触发。'
      },
      {
        name: 'check',
        type: 'YTransferCheckPayload',
        description: '勾选项变化后触发。'
      }
    ],
    types: [
      {
        name: 'YTransferOption',
        type: '{ label: string; value: string; description?: string; disabled?: boolean }',
        description: '穿梭框选项。'
      },
      {
        name: 'YTransferDirection',
        type: "'left' | 'right'",
        description: '移动或勾选发生的面板方向。'
      },
      {
        name: 'YTransferChangePayload',
        type: '{ value: string[]; movedKeys: string[]; direction: YTransferDirection }',
        description: '移动事件载荷。'
      },
      {
        name: 'YTransferCheckPayload',
        type: '{ checkedKeys: string[]; direction: YTransferDirection }',
        description: '勾选事件载荷。'
      }
    ]
  },
  YVirtualList: {
    props: [
      {
        name: 'items',
        type: 'YVirtualListItem[]',
        description: '完整列表数据源。',
        required: true
      },
      {
        name: 'itemHeight',
        type: 'number',
        description: '单个列表项的固定高度，单位 px。',
        required: true
      },
      {
        name: 'height',
        type: 'number',
        description: '可滚动视口高度，单位 px。',
        required: true
      },
      {
        name: 'itemKey',
        type: "keyof item | ((item, index) => string | number)",
        defaultValue: "'id'",
        description: '列表项唯一键。'
      },
      {
        name: 'overscan',
        type: 'number',
        defaultValue: '4',
        description: '视口上下额外渲染的项目数，用于降低滚动白屏风险。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Virtual list'",
        description: '列表区域的可访问名称。'
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No items yet'",
        description: '空状态文案。'
      }
    ],
    events: [
      {
        name: 'scroll',
        type: '{ scrollTop: number; start: number; end: number }',
        description: '滚动时触发，返回当前滚动位置和渲染范围。'
      },
      {
        name: 'rangeChange',
        type: '{ start: number; end: number }',
        description: '渲染范围变化时触发。'
      }
    ],
    slots: [
      {
        name: 'item',
        type: '{ item, index }',
        description: '自定义列表项内容。'
      },
      {
        name: 'empty',
        type: 'VNode',
        description: '自定义空状态。'
      }
    ],
    types: [
      {
        name: 'YVirtualListItem',
        type: "{ id?: string | number; label?: string; [key: string]: unknown }",
        description: '虚拟列表项的基础数据形状。'
      }
    ]
  },
  YTree: {
    props: [
      {
        name: 'nodes',
        type: 'YTreeNode[]',
        description: '树节点数据。',
        required: true
      },
      {
        name: 'selectedKey',
        type: 'string',
        defaultValue: "''",
        description: '当前选中节点 key。'
      },
      {
        name: 'expandedKeys',
        type: 'string[]',
        description: '受控展开节点 key。'
      },
      {
        name: 'defaultExpandedKeys',
        type: 'string[]',
        defaultValue: '[]',
        description: '非受控初始展开节点 key。'
      },
      {
        name: 'checkedKeys',
        type: 'string[]',
        description: '受控勾选节点 key。'
      },
      {
        name: 'defaultCheckedKeys',
        type: 'string[]',
        defaultValue: '[]',
        description: '非受控初始勾选节点 key。'
      },
      {
        name: 'checkable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否显示节点勾选框。'
      },
      {
        name: 'checkStrictly',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否取消父子级联勾选。'
      },
      {
        name: 'draggable',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否允许节点拖拽。'
      },
      {
        name: 'allowDrop',
        type: 'YTreeAllowDrop',
        description: '自定义拖拽放置规则。'
      },
      {
        name: 'lazy',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否启用异步节点加载；无 children 且未标记 isLeaf 的节点会在展开时调用 load。'
      },
      {
        name: 'load',
        type: 'YTreeLoadChildren',
        description: '异步加载节点 children 的函数，返回 YTreeNode[] 或 Promise<YTreeNode[]>。'
      },
      {
        name: 'virtualized',
        type: 'boolean',
        defaultValue: 'false',
        description: '是否启用节点虚拟滚动；适合大量扁平可见节点，只渲染视口附近 treeitem。'
      },
      {
        name: 'virtualHeight',
        type: 'number',
        defaultValue: '280',
        description: '虚拟滚动树的可视高度，单位为 px。'
      },
      {
        name: 'virtualItemHeight',
        type: 'number',
        defaultValue: '36',
        description: '虚拟滚动节点的估算行高，单位为 px；应接近实际节点高度。'
      },
      {
        name: 'virtualOverscan',
        type: 'number',
        defaultValue: '4',
        description: '视口上下额外渲染的节点数量，用于降低快速滚动时的空白感。'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        defaultValue: "'Tree'",
        description: '树区域的可访问名称。'
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: "'No tree data yet'",
        description: '空状态文案。'
      }
    ],
    events: [
      {
        name: 'update:selectedKey',
        type: 'string',
        description: '选中节点变化。'
      },
      {
        name: 'update:expandedKeys',
        type: 'string[]',
        description: '展开节点变化。'
      },
      {
        name: 'update:checkedKeys',
        type: 'string[]',
        description: '勾选节点变化。'
      },
      {
        name: 'select',
        type: 'YTreeSelectPayload',
        description: '点击或键盘选择节点。'
      },
      {
        name: 'toggle',
        type: 'YTreeTogglePayload',
        description: '展开或折叠节点。'
      },
      {
        name: 'check',
        type: 'YTreeCheckPayload',
        description: '勾选或取消勾选节点。'
      },
      {
        name: 'dragStart',
        type: 'YTreeSelectPayload',
        description: '开始拖拽节点时触发。'
      },
      {
        name: 'drop',
        type: 'YTreeDropPayload',
        description: '节点放置到目标节点前、内部或后方时触发。'
      },
      {
        name: 'dragEnd',
        type: 'YTreeSelectPayload',
        description: '拖拽结束时触发。'
      },
      {
        name: 'load',
        type: 'YTreeLoadPayload',
        description: '异步节点加载成功后触发，包含目标节点和返回的 children。'
      },
      {
        name: 'loadError',
        type: 'YTreeLoadErrorPayload',
        description: '异步节点加载失败后触发；节点保持可再次展开以便重试。'
      }
    ],
    slots: [
      {
        name: 'node',
        type: '{ node, flatNode }',
        description: '自定义节点内容。'
      },
      {
        name: 'empty',
        type: 'VNode',
        description: '自定义空状态。'
      }
    ],
    types: [
      {
        name: 'YTreeNode',
        type: '{ key: string; label: string; disabled?: boolean; isLeaf?: boolean; children?: YTreeNode[] }',
        description: '树节点数据；lazy 模式下 isLeaf=true 会关闭未加载节点的展开入口。'
      },
      {
        name: 'YTreeFlatNode',
        type: '{ node: YTreeNode; key: string; label: string; level: number; expanded: boolean; selected: boolean; disabled: boolean; hasChildren: boolean }',
        description: '渲染时的扁平节点。'
      },
      {
        name: 'YTreeCheckState',
        type: '{ checked: boolean; indeterminate: boolean }',
        description: '节点勾选状态。'
      },
      {
        name: 'YTreeSelectPayload',
        type: '{ node: YTreeNode; key: string }',
        description: '选择事件载荷。'
      },
      {
        name: 'YTreeTogglePayload',
        type: '{ node: YTreeNode; key: string; expanded: boolean }',
        description: '展开折叠事件载荷。'
      },
      {
        name: 'YTreeCheckPayload',
        type: '{ node: YTreeNode; key: string; checked: boolean; checkedKeys: string[]; halfCheckedKeys: string[] }',
        description: '勾选事件载荷。'
      },
      {
        name: 'YTreeDropType',
        type: "'before' | 'inside' | 'after'",
        description: '拖拽放置位置。'
      },
      {
        name: 'YTreeAllowDrop',
        type: '(payload: { draggingNode: YTreeNode; dropNode: YTreeNode; type: YTreeDropType }) => boolean',
        description: '拖拽放置规则函数。'
      },
      {
        name: 'YTreeDropPayload',
        type: '{ draggingNode: YTreeNode; draggingKey: string; dropNode: YTreeNode; dropKey: string; type: YTreeDropType }',
        description: '拖拽放置事件载荷。'
      },
      {
        name: 'YTreeLoadChildren',
        type: '(node: YTreeNode) => YTreeNode[] | Promise<YTreeNode[]>',
        description: '异步加载节点 children 的函数。'
      },
      {
        name: 'YTreeLoadPayload',
        type: '{ node: YTreeNode; key: string; children: YTreeNode[] }',
        description: 'load 事件载荷。'
      },
      {
        name: 'YTreeLoadErrorPayload',
        type: '{ node: YTreeNode; key: string; error: unknown }',
        description: 'loadError 事件载荷。'
      }
    ]
  },
  YThemeProvider: {
    props: [
      {
        name: 'theme',
        type: 'YokThemeName',
        defaultValue: "'yok-light'",
        description: '注入到局部区域的 Yok UI 主题名称。'
      },
      {
        name: 'density',
        type: "'comfortable' | 'compact'",
        defaultValue: "'comfortable'",
        description: '局部区域的密度模式。'
      },
      {
        name: 'tokens',
        type: 'YokThemeTokens',
        defaultValue: '-',
        description: '局部注入的完整主题 token 对象，适合承接 Theme Lab 导出的自定义主题配置。'
      }
    ],
    slots: [
      {
        name: 'default',
        type: 'VNode',
        description: '接收主题变量的页面或组件内容。'
      }
    ],
    types: [
      {
        name: 'YokThemeName',
        type: 'string',
        description: '@yok-ui/themes 导出的内置或扩展主题名称。'
      },
      {
        name: 'YokThemeTokens',
        type: '{ color; radius; space; shadow; motion; zIndex }',
        description: '@yok-ui/themes 导出的主题 token 分组结构，可由 Theme Lab 生成。'
      }
    ]
  },
  YConfigProvider: {
    props: [
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '子组件默认尺寸；组件显式传入 size 时优先使用组件自身配置。'
      },
      {
        name: 'density',
        type: "'comfortable' | 'compact'",
        defaultValue: "'comfortable'",
        description: '子树密度配置，会写入 data-yok-density，便于主题和文档统一读取。'
      },
      {
        name: 'locale',
        type: 'string',
        defaultValue: "'en-US'",
        description: '子树 locale 标识，会写入 lang 属性。'
      },
      {
        name: 'namespace',
        type: 'string',
        defaultValue: "'yok'",
        description: '组件库命名空间，供未来 class、变量和多实例隔离扩展使用。'
      }
    ],
    slots: [
      {
        name: 'default',
        type: 'VNode',
        description: '读取全局配置的子组件树。'
      }
    ],
    types: [
      {
        name: 'YokConfigContext',
        type: '{ size: ComputedRef<YokConfigSize>; density: ComputedRef<YokConfigDensity>; locale: ComputedRef<string>; namespace: ComputedRef<string> }',
        description: '通过 useYokConfig 暴露给组件内部消费的响应式配置上下文。'
      },
      {
        name: 'YokConfigSize',
        type: "'sm' | 'md' | 'lg'",
        description: '全局尺寸类型。'
      },
      {
        name: 'YokConfigDensity',
        type: "'comfortable' | 'compact'",
        description: '全局密度类型。'
      }
    ]
  },
  YIconButton: {
    props: [
      { name: 'label', type: 'string', description: '图标按钮的可访问名称，会映射到 aria-label。', required: true },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: '按钮尺寸。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用按钮。' }
    ],
    events: [
      { name: 'click', type: 'MouseEvent', description: '点击按钮时触发。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '图标内容。' }
    ]
  },
  YTextarea: {
    props: [
      { name: 'id', type: 'string', defaultValue: "''", description: '传给内部 textarea 的 id。' },
      { name: 'modelValue', type: 'string', defaultValue: "''", description: '多行输入值，支持 v-model。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '输入框标签。' },
      { name: 'placeholder', type: 'string', defaultValue: "''", description: '占位提示。' },
      { name: 'helper', type: 'string', defaultValue: "''", description: '辅助说明文本。' },
      { name: 'error', type: 'string', defaultValue: "''", description: '错误提示，同时设置 aria-invalid。' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false', description: '外部校验传入的无效状态。' },
      { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: '传给内部 textarea 的 aria-describedby。' },
      { name: 'rows', type: 'number', defaultValue: '4', description: '可见文本行数。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用。' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: 'ConfigProvider size', description: '多行输入尺寸；未传入时读取 ConfigProvider。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'string', description: '输入值变化。' }
    ]
  },
  YFormItem: {
    props: [
      { name: 'prop', type: 'string', defaultValue: "''", description: '表单字段路径，用于注册校验状态。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '字段标签。' },
      { name: 'labelFor', type: 'string', defaultValue: "''", description: '自定义 label for 目标。' },
      { name: 'hint', type: 'string', defaultValue: "''", description: '无错误时展示的提示文本。' },
      { name: 'error', type: 'string', defaultValue: "''", description: '手动传入的错误文本，优先于表单上下文错误。' },
      { name: 'required', type: 'boolean', defaultValue: 'false', description: '是否展示必填标记。' }
    ],
    slots: [
      { name: 'default', type: '{ error: string; invalid: boolean; labelFor: string; messageId?: string; validate: (trigger?: YFormValidateTrigger) => Promise<boolean>; clearValidate: () => void }', description: '字段控件区域，并暴露校验状态、可访问 id 和字段级校验方法。' }
    ],
    types: [
      { name: 'YFormItemExpose', type: '{ clearValidate: () => void; validate: (trigger?: YFormValidateTrigger) => Promise<boolean> }', description: '组件暴露给父级的校验方法。' }
    ]
  },
  YFormSummary: {
    props: [
      { name: 'errors', type: 'YFormSummaryItem[]', description: '需要汇总展示的错误列表。', required: true },
      { name: 'title', type: 'string', defaultValue: "'Please fix the following fields'", description: '错误汇总标题。' },
      { name: 'focusOnClick', type: 'boolean', defaultValue: 'true', description: '点击错误项时是否聚焦并滚动到对应字段。' }
    ],
    types: [
      { name: 'YFormSummaryItem', type: '{ fieldId: string; label: string; message: string }', description: '单个表单错误项。' }
    ]
  },
  YRadioGroup: {
    props: [
      { name: 'modelValue', type: 'YRadioValue', defaultValue: "''", description: '当前选中值，支持 v-model。' },
      { name: 'id', type: 'string', defaultValue: "''", description: '传给 fieldset 的 id，适合和错误摘要或表单标签关联。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '分组 legend 文本。' },
      { name: 'description', type: 'string', defaultValue: "''", description: '单选组说明文本，用于解释选择规则或业务影响。' },
      { name: 'options', type: 'YRadioOption[]', description: '单选项列表。', required: true },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用整个单选组。' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false', description: '外部表单校验传入的无效状态，会同步到 aria-invalid。' },
      { name: 'error', type: 'string', defaultValue: "''", description: '独立使用时展示的错误文本；在 FormItem 内推荐使用 FormItem 的错误提示。' },
      { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: '传给 fieldset 的 aria-describedby，通常来自 YFormItem 的 messageId。' },
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '选项排列方向。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'YRadioValue', description: '选中值变化。' },
      { name: 'change', type: 'YRadioValue', description: '用户切换选项后触发，参数为下一组选中值。' }
    ],
    types: [
      { name: 'YRadioOption', type: '{ label: string; value: string | number; description?: string; disabled?: boolean }', description: '单选项配置。' },
      { name: 'YRadioValue', type: 'string | number', description: '单选组可选值类型。' }
    ]
  },
  YSegmented: {
    props: [
      { name: 'modelValue', type: 'YSegmentedValue', defaultValue: "''", description: '当前选中值，支持 v-model。' },
      { name: 'options', type: 'Array<YSegmentedOption | YSegmentedValue>', description: '分段选项列表，可传字符串、数字或对象配置。', required: true },
      { name: 'name', type: 'string', defaultValue: "''", description: '传给所有原生 radio 的 name，便于浏览器维持同组键盘行为。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '分组 legend 文本；视觉隐藏但会提供语义标签。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "''", description: '无可见标签时传给 radiogroup 的可访问名称。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用整个分段控件。' },
      { name: 'block', type: 'boolean', defaultValue: 'false', description: '是否撑满父容器宽度，每个选项均分空间。' },
      { name: 'orientation', type: 'YSegmentedOrientation', defaultValue: "'horizontal'", description: '排列方向。' },
      { name: 'shape', type: 'YSegmentedShape', defaultValue: "'default'", description: '外观形状，round 适合轻量工具栏。' },
      { name: 'size', type: 'YSegmentedSize', defaultValue: 'ConfigProvider size', description: '尺寸；未设置时跟随 YConfigProvider。' }
    ],
    events: [
      { name: 'update:modelValue', type: '(value: YSegmentedValue) => void', description: '选中值变化。' },
      { name: 'change', type: '(value: YSegmentedValue) => void', description: '用户切换分段选项后触发。' }
    ],
    types: [
      { name: 'YSegmentedOption', type: '{ label: string; value: string | number; description?: string; disabled?: boolean }', description: '分段选项对象配置。' },
      { name: 'YSegmentedValue', type: 'string | number', description: '分段控件可选值类型。' },
      { name: 'YSegmentedOrientation', type: "'horizontal' | 'vertical'", description: '排列方向。' },
      { name: 'YSegmentedShape', type: "'default' | 'round'", description: '形状类型。' },
      { name: 'YSegmentedSize', type: "'sm' | 'md' | 'lg'", description: '尺寸类型。' }
    ]
  },
  YCalendar: {
    props: [
      { name: 'modelValue', type: 'YCalendarValue', defaultValue: "''", description: '当前选中日期，格式为 YYYY-MM-DD，支持 v-model。' },
      { name: 'locale', type: 'string', defaultValue: "'en-US'", description: '月份、星期和可访问日期文案使用的 Intl locale。' },
      { name: 'disabledDate', type: 'YCalendarDisabledDate', description: '禁用日期函数，返回 true 的日期不可点击。' },
      { name: 'showAdjacentMonths', type: 'boolean', defaultValue: 'true', description: '是否展示上月和下月补齐日期。' }
    ],
    events: [
      { name: 'update:modelValue', type: '(value: YCalendarValue) => void', description: '选中日期变化。' },
      { name: 'select', type: '(cell: YCalendarCell) => void', description: '用户选择日期时触发，包含日期格状态。' },
      { name: 'panel-change', type: '(panel: YCalendarPanelChangePayload) => void', description: '日历面板月份变化时触发，格式为 YYYY-MM。' }
    ],
    slots: [
      { name: 'header', type: '{ date: Date; title: string; previousMonth: () => void; nextMonth: () => void; selectToday: () => void }', description: '自定义头部和月份切换控制。' },
      { name: 'dateCell', type: '{ cell: YCalendarCell }', description: '自定义日期格内容。' }
    ],
    types: [
      { name: 'YCalendarCell', type: '{ date: Date; value: string; day: number; inCurrentMonth: boolean; selected: boolean; today: boolean; disabled: boolean }', description: '日历日期格状态。' },
      { name: 'YCalendarValue', type: 'string', description: 'YYYY-MM-DD 日期值。' },
      { name: 'YCalendarDisabledDate', type: '(date: Date) => boolean', description: '禁用日期判断函数。' },
      { name: 'YCalendarPanelChangePayload', type: 'string', description: 'YYYY-MM 面板标识。' }
    ]
  },
  YCarousel: {
    props: [
      { name: 'items', type: 'YCarouselItem[]', description: '轮播项列表，包含标题、描述、媒体、角标和语义色。', required: true },
      { name: 'modelValue', type: 'number', defaultValue: '0', description: '当前激活 slide 索引，支持 v-model。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Carousel'", description: '轮播 region 的可访问名称。' },
      { name: 'autoplay', type: 'boolean', defaultValue: 'false', description: '是否自动切换 slide。' },
      { name: 'interval', type: 'number', defaultValue: '3000', description: '自动播放间隔，最小按 800ms 处理。' },
      { name: 'pauseOnHover', type: 'boolean', defaultValue: 'true', description: '鼠标悬停时是否暂停自动播放。' },
      { name: 'loop', type: 'boolean', defaultValue: 'true', description: '到达边界后是否循环切换。' },
      { name: 'direction', type: 'YCarouselDirection', defaultValue: "'horizontal'", description: '轮播方向，同时决定方向键语义。' },
      { name: 'arrow', type: 'YCarouselArrow', defaultValue: "'always'", description: '箭头展示策略。' },
      { name: 'indicatorPosition', type: 'YCarouselIndicatorPosition', defaultValue: "'inside'", description: '指示器位置，可放在内部、外部或隐藏。' },
      { name: 'height', type: 'string', defaultValue: "'240px'", description: '轮播视口高度，传入 CSS 长度值。' }
    ],
    events: [
      { name: 'update:modelValue', type: '(value: number) => void', description: '激活索引变化。' },
      { name: 'change', type: '(payload: YCarouselChangePayload) => void', description: '用户或自动播放切换 slide 后触发，包含当前项和前一索引。' }
    ],
    slots: [
      { name: 'item', type: '{ item: YCarouselItem; index: number; active: boolean }', description: '自定义 slide 内容。' }
    ],
    methods: [
      { name: 'next', type: '() => void', description: '切换到下一张。' },
      { name: 'previous', type: '() => void', description: '切换到上一张。' },
      { name: 'setActiveItem', type: '(index: number) => void', description: '切换到指定索引。' }
    ],
    types: [
      { name: 'YCarouselItem', type: "{ title: string; description?: string; image?: string; alt?: string; meta?: string; tone?: 'primary' | 'success' | 'warning' | 'danger' }", description: '轮播项数据。' },
      { name: 'YCarouselChangePayload', type: '{ current: number; previous: number; item: YCarouselItem }', description: '切换事件载荷。' },
      { name: 'YCarouselDirection', type: "'horizontal' | 'vertical'", description: '轮播方向。' },
      { name: 'YCarouselArrow', type: "'always' | 'never'", description: '箭头展示策略。' },
      { name: 'YCarouselIndicatorPosition', type: "'inside' | 'outside' | 'none'", description: '指示器位置。' }
    ]
  },
  YBreadcrumb: {
    props: [
      { name: 'items', type: 'YBreadcrumbItem[]', description: '面包屑路径列表。', required: true },
      { name: 'separator', type: 'string', defaultValue: "'/'", description: '路径分隔符。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Breadcrumb'", description: '导航区域可访问名称。' }
    ],
    events: [
      { name: 'select', type: 'YBreadcrumbItem', description: '点击可访问路径项时触发。' }
    ],
    types: [
      { name: 'YBreadcrumbItem', type: '{ label: string; href?: string; current?: boolean; disabled?: boolean }', description: '面包屑项。' }
    ]
  },
  YMenu: {
    props: [
      { name: 'items', type: 'YMenuItem[]', description: '菜单项树，支持叶子项和 children 子菜单。', required: true },
      { name: 'modelValue', type: 'YMenuKey', defaultValue: 'undefined', description: '当前选中菜单项，支持 v-model；未传入时由组件内部维护。' },
      { name: 'defaultOpenKeys', type: 'YMenuKey[]', defaultValue: '[]', description: '默认展开的子菜单 key 列表。' },
      { name: 'mode', type: 'YMenuMode', defaultValue: "'vertical'", description: '菜单方向，vertical 适合侧边栏，horizontal 适合顶部导航。' },
      { name: 'collapsed', type: 'boolean', defaultValue: 'false', description: '是否折叠，仅展示图标并保留 title 提示。' },
      { name: 'accordion', type: 'boolean', defaultValue: 'false', description: '是否只保留一个同级子菜单展开。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Menu'", description: '导航区域可访问名称。' }
    ],
    events: [
      { name: 'update:modelValue', type: '(value: YMenuKey) => void', description: '选中叶子菜单项变化。' },
      { name: 'select', type: '(payload: YMenuSelectPayload) => void', description: '用户选择叶子菜单项时触发，包含 item 和 keyPath。' },
      { name: 'open', type: '(key: YMenuKey, keyPath: YMenuKey[], openKeys: YMenuKey[]) => void', description: '子菜单展开时触发，包含当前 key、路径和展开集合。' },
      { name: 'close', type: '(key: YMenuKey, keyPath: YMenuKey[], openKeys: YMenuKey[]) => void', description: '子菜单收起时触发，包含当前 key、路径和展开集合。' },
      { name: 'open-change', type: '(openKeys: YMenuKey[]) => void', description: '子菜单展开状态变化。' }
    ],
    types: [
      { name: 'YMenuItem', type: '{ label: string; value: string; icon?: string; disabled?: boolean; children?: YMenuItem[] }', description: '菜单项配置。' },
      { name: 'YMenuKey', type: 'string', description: '菜单项唯一 key。' },
      { name: 'YMenuMode', type: "'vertical' | 'horizontal'", description: '菜单方向。' },
      { name: 'YMenuSelectPayload', type: '{ item: YMenuItem; keyPath: YMenuKey[] }', description: '选择事件载荷。' }
    ]
  },
  YLayout: {
    props: [
      { name: 'direction', type: 'YLayoutDirection', defaultValue: "'auto'", description: '布局方向。auto 会在直接子元素包含 Header 或 Footer 时使用 vertical，否则使用 horizontal。' },
      { name: 'fullHeight', type: 'boolean', defaultValue: 'false', description: '是否让外层布局至少占满视口高度。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Layout'", description: '布局区域的可访问名称。' }
    ],
    slots: [
      { name: 'default', type: 'YHeader | YAside | YMain | YFooter | YLayout', description: '布局子区域，可嵌套 YLayout 形成常见后台和官网页面骨架。' }
    ],
    types: [
      { name: 'YLayoutDirection', type: "'auto' | 'horizontal' | 'vertical'", description: '外层 flex 排列方向。' },
      { name: 'YLayoutSize', type: 'string | number', description: 'Header、Aside、Footer 尺寸；数字会转换为 px。' },
      { name: 'YHeader props', type: "{ height?: YLayoutSize; sticky?: boolean; bordered?: boolean }", description: '顶栏尺寸、吸顶和底部分隔线配置。' },
      { name: 'YAside props', type: "{ width?: YLayoutSize; collapsedWidth?: YLayoutSize; collapsed?: boolean; bordered?: boolean; ariaLabel?: string }", description: '侧栏宽度、折叠宽度、边框和导航区域名称。' },
      { name: 'YMain props', type: '{ padded?: boolean; scrollable?: boolean }', description: '主体内容是否保留默认内边距和独立滚动。' },
      { name: 'YFooter props', type: "{ height?: YLayoutSize; bordered?: boolean }", description: '底栏高度和顶部分隔线配置。' }
    ]
  },
  YSplitter: {
    props: [
      { name: 'panels', type: 'YSplitterPanel[]', description: '面板配置，包含 key、label、默认尺寸和约束。', required: true },
      { name: 'modelValue', type: 'YSplitterSizes', description: '受控面板尺寸，key 为 panel key，值为百分比。' },
      { name: 'layout', type: 'YSplitterLayout', defaultValue: "'horizontal'", description: '分割方向，horizontal 为左右分栏，vertical 为上下分栏。' },
      { name: 'height', type: 'string', defaultValue: "'280px'", description: '分割容器高度。' },
      { name: 'handleSize', type: 'number', defaultValue: '8', description: '拖拽手柄尺寸，单位 px。' },
      { name: 'keyboardStep', type: 'number', defaultValue: '2', description: '键盘方向键调整尺寸时的百分比步长。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Resizable panels'", description: '分割区域的可访问名称。' }
    ],
    events: [
      { name: 'update:modelValue', type: '(sizes: YSplitterSizes) => void', description: '拖拽、键盘或折叠后同步所有面板尺寸。' },
      { name: 'resizeStart', type: '(payload: { index: number }) => void', description: '用户开始拖拽某个分隔条。' },
      { name: 'resize', type: '(payload: YSplitterResizePayload) => void', description: '尺寸变化时触发，包含分隔条 index 和最新 sizes。' },
      { name: 'resizeEnd', type: '(payload: YSplitterResizePayload) => void', description: '用户结束拖拽后触发。' },
      { name: 'collapse', type: '(payload: YSplitterCollapsePayload) => void', description: '折叠或展开可折叠面板时触发。' }
    ],
    slots: [
      { name: '[panel.key]', type: '{ panel: YSplitterPanel; size: number }', description: '每个面板通过同名具名 slot 渲染内容。' }
    ],
    types: [
      { name: 'YSplitterLayout', type: "'horizontal' | 'vertical'", description: '左右或上下分割。' },
      { name: 'YSplitterPanel', type: '{ key: string; label?: string; size?: number; min?: number; max?: number; resizable?: boolean; collapsible?: boolean; collapsedSize?: number }', description: '面板尺寸、约束和折叠配置。' },
      { name: 'YSplitterSizes', type: 'Record<string, number>', description: '面板尺寸映射，单位为百分比。' },
      { name: 'YSplitterResizePayload', type: '{ index: number; sizes: YSplitterSizes }', description: '拖拽或键盘调整事件载荷。' },
      { name: 'YSplitterCollapsePayload', type: '{ key: string; collapsed: boolean; sizes: YSplitterSizes }', description: '折叠事件载荷。' }
    ]
  },
  YSteps: {
    props: [
      { name: 'items', type: 'YStepItem[]', description: '步骤列表。', required: true },
      { name: 'current', type: 'number', defaultValue: '0', description: '当前步骤索引。' },
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '步骤排列方向。' },
      { name: 'selectable', type: 'boolean', defaultValue: 'false', description: '是否允许点击步骤触发选择。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Steps'", description: '步骤导航可访问名称。' }
    ],
    events: [
      { name: 'select', type: '(item: YStepItem, index: number)', description: '可选择模式下点击步骤时触发。' }
    ],
    types: [
      { name: 'YStepItem', type: '{ title: string; description?: string; status?: YStepStatus; disabled?: boolean }', description: '步骤项。' },
      { name: 'YStepStatus', type: "'wait' | 'process' | 'finish' | 'error'", description: '步骤状态。' }
    ]
  },
  YTour: {
    props: [
      { name: 'open', type: 'boolean', description: '是否显示引导层。', required: true },
      { name: 'steps', type: 'YTourStep[]', description: '引导步骤列表。', required: true },
      { name: 'current', type: 'number', defaultValue: '0', description: '当前步骤索引。' },
      { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: '按 Escape 是否请求关闭。' },
      { name: 'nextText', type: 'string', defaultValue: "'Next'", description: '下一步按钮文案。' },
      { name: 'prevText', type: 'string', defaultValue: "'Previous'", description: '上一步按钮文案。' },
      { name: 'finishText', type: 'string', defaultValue: "'Finish'", description: '完成按钮文案。' },
      { name: 'skipText', type: 'string', defaultValue: "'Skip'", description: '关闭和跳过引导的可访问文案。' }
    ],
    events: [
      { name: 'update:open', type: 'boolean', description: '打开状态变化。' },
      { name: 'update:current', type: 'number', description: '当前步骤索引变化。' },
      { name: 'change', type: '(index: number, step: YTourStep)', description: '切换到其他步骤时触发。' },
      { name: 'finish', type: 'void', description: '点击最后一步完成按钮时触发。' },
      { name: 'close', type: 'void', description: '请求关闭引导层。' }
    ],
    slots: [
      { name: 'default', type: '{ step: YTourStep; index: number }', description: '当前步骤的补充内容。' }
    ],
    types: [
      { name: 'YTourStep', type: '{ title: string; description?: string; target?: YTourTarget; placement?: YTourPlacement; nextText?: string; prevText?: string }', description: '单个引导步骤配置。' },
      { name: 'YTourPlacement', type: "'top' | 'right' | 'bottom' | 'left' | 'center'", description: '引导面板期望方位。' },
      { name: 'YTourTarget', type: 'string | HTMLElement | null', description: '高亮目标，可传选择器或元素。' }
    ]
  },
  YDropdown: {
    props: [
      { name: 'open', type: 'boolean', defaultValue: 'undefined', description: '下拉菜单打开状态；未传入时由组件内部维护。' },
      { name: 'items', type: 'YDropdownItem[]', description: '菜单项列表。', required: true },
      { name: 'label', type: 'string', defaultValue: "'Open menu'", description: '默认触发按钮文本，并作为触发器可访问名称。' },
      { name: 'align', type: "'start' | 'end'", defaultValue: "'start'", description: '未设置 placement 时的水平对齐方式。' },
      { name: 'placement', type: 'YDropdownPlacement', defaultValue: 'undefined', description: '菜单位置；设置后优先于 align，支持 top/bottom 与 start/end 对齐。' },
      { name: 'trigger', type: 'YDropdownTrigger', defaultValue: "'click'", description: '触发方式：click、hover、contextmenu 或 manual。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用触发器与所有打开行为。' },
      { name: 'hideOnClick', type: 'boolean', defaultValue: 'true', description: '选择菜单项后是否自动关闭。' },
      { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: '按 Escape 时是否关闭菜单。' },
      { name: 'closeOnOutsidePointer', type: 'boolean', defaultValue: 'true', description: '点击外部区域时是否关闭菜单。' }
    ],
    events: [
      { name: 'update:open', type: 'boolean', description: '打开状态变化。' },
      { name: 'select', type: 'YDropdownItem', description: '选择菜单项时触发。' }
    ],
    slots: [
      { name: 'trigger', type: 'VNode', description: '自定义触发按钮内容。' }
    ],
    types: [
      { name: 'YDropdownItem', type: '{ label: string; value: string; disabled?: boolean }', description: '菜单项配置。' },
      { name: 'YDropdownPlacement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'", description: '菜单浮层位置。' },
      { name: 'YDropdownTrigger', type: "'click' | 'hover' | 'contextmenu' | 'manual'", description: '菜单触发方式。' }
    ]
  },
  YPopover: {
    props: [
      { name: 'open', type: 'boolean', defaultValue: 'undefined', description: '弹出层打开状态；未传入时由组件内部维护。' },
      { name: 'title', type: 'string', defaultValue: "''", description: '弹出层标题，也用于可访问名称。' },
      { name: 'content', type: 'string', defaultValue: "''", description: '简短正文内容。' },
      { name: 'placement', type: 'YPopoverPlacement', defaultValue: "'bottom'", description: '弹出层位置，支持四方向及 start/end 对齐。' },
      { name: 'trigger', type: 'YPopoverTrigger', defaultValue: "'click'", description: '触发方式；hover 同时支持键盘 focus。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用触发行为。' },
      { name: 'showDelay', type: 'number | string', defaultValue: '0', description: '展示延迟。' },
      { name: 'hideDelay', type: 'number | string', defaultValue: '0', description: '隐藏延迟。' },
      { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: '按 Escape 是否请求关闭。' },
      { name: 'closeOnOutsidePointer', type: 'boolean', defaultValue: 'true', description: '点击外部区域是否请求关闭。' }
    ],
    events: [
      { name: 'update:open', type: 'boolean', description: '打开状态变化。' }
    ],
    slots: [
      { name: 'trigger', type: 'VNode', description: '触发元素内容。' },
      { name: 'default', type: 'VNode', description: '弹出层自定义内容。' }
    ],
    types: [
      { name: 'YPopoverPlacement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'", description: 'Floating UI 兼容方位。' },
      { name: 'YPopoverTrigger', type: "'click' | 'hover' | 'focus' | 'manual'", description: '触发方式。' }
    ]
  },
  YCard: {
    props: [
      { name: 'title', type: 'string', defaultValue: "''", description: '卡片标题。' },
      { name: 'description', type: 'string', defaultValue: "''", description: '卡片说明。' },
      { name: 'interactive', type: 'boolean', defaultValue: 'false', description: '是否启用 hover 强调样式。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '卡片主体内容。' },
      { name: 'extra', type: 'VNode', description: '标题栏右侧扩展区域。' },
      { name: 'footer', type: 'VNode', description: '底部操作区。' }
    ]
  },
  YDivider: {
    props: [
      { name: 'label', type: 'string', defaultValue: "''", description: '分割线中间的标签文本。' },
      { name: 'align', type: "'start' | 'center' | 'end'", defaultValue: "'center'", description: '标签对齐方式。' }
    ]
  },
  YSpace: {
    props: [
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '间距排列方向。' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | number | [YSpaceSize, YSpaceSize]", defaultValue: "'md'", description: '行列间距，数组形式分别控制 row gap 和 column gap。' },
      { name: 'align', type: "'start' | 'center' | 'end' | 'baseline' | 'stretch'", defaultValue: "'center'", description: '交叉轴对齐方式。' },
      { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", defaultValue: "'start'", description: '主轴分布方式。' },
      { name: 'wrap', type: 'boolean', defaultValue: 'false', description: '横向排列时是否允许换行。' },
      { name: 'fill', type: 'boolean', defaultValue: 'false', description: '是否占满父容器宽度并让子项参与可用空间分配。' },
      { name: 'inline', type: 'boolean', defaultValue: 'false', description: '是否渲染为 inline-flex，适合文本行内操作组。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '需要统一间距排列的子元素。' },
      { name: 'separator', type: 'VNode', description: '插入在相邻子元素之间的分隔符。' }
    ],
    types: [
      { name: 'YSpaceSize', type: "'xs' | 'sm' | 'md' | 'lg' | number", description: '内置间距或像素数值。' },
      { name: 'YSpaceSizePair', type: 'YSpaceSize | [YSpaceSize, YSpaceSize]', description: '单值或 row/column 二元间距。' }
    ]
  },
  YScrollbar: {
    props: [
      { name: 'height', type: 'string | number', defaultValue: "''", description: '滚动视口高度，数字会转换为 px。' },
      { name: 'maxHeight', type: 'string | number', defaultValue: "''", description: '滚动视口最大高度，适合自适应面板。' },
      { name: 'minHeight', type: 'string | number', defaultValue: "''", description: '滚动视口最小高度。' },
      { name: 'horizontal', type: 'boolean', defaultValue: 'false', description: '是否允许横向滚动。' },
      { name: 'native', type: 'boolean', defaultValue: 'false', description: '是否使用浏览器原生滚动条样式。' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Scrollable content'", description: '滚动区域的可访问名称。' }
    ],
    events: [
      { name: 'scroll', type: '(payload: YScrollbarScrollPayload) => void', description: '视口滚动时触发，返回滚动位置和内容尺寸。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '滚动区域内容。' }
    ],
    methods: [
      { name: 'scrollTo', type: '(options: ScrollToOptions) => void', description: '滚动到指定位置。' },
      { name: 'setScrollTop', type: '(value: number) => void', description: '设置纵向滚动距离。' },
      { name: 'setScrollLeft', type: '(value: number) => void', description: '设置横向滚动距离。' }
    ],
    types: [
      { name: 'YScrollbarScrollPayload', type: '{ scrollTop: number; scrollLeft: number; scrollHeight: number; scrollWidth: number; clientHeight: number; clientWidth: number }', description: '滚动事件返回的视口指标。' }
    ]
  },
  YLoading: {
    props: [
      { name: 'loading', type: 'boolean', defaultValue: 'true', description: '是否展示加载指示器或遮罩。' },
      { name: 'overlay', type: 'boolean', defaultValue: 'false', description: '是否作为容器遮罩展示；开启后保留默认插槽内容并标记 aria-busy。' },
      { name: 'fullscreen', type: 'boolean', defaultValue: 'false', description: '是否作为全屏加载层展示，适合发布、初始化和路由级阻断任务。' },
      { name: 'text', type: 'string', defaultValue: "'Loading'", description: '加载提示文本。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '辅助技术使用的可访问名称；未提供时回退到 text。' },
      { name: 'tone', type: "'primary' | 'success' | 'warning' | 'danger'", defaultValue: "'primary'", description: '加载指示器语义色。' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: '加载指示器尺寸。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '被加载遮罩覆盖的内容区域。' },
      { name: 'indicator', type: 'VNode', description: '自定义加载指示器。' }
    ],
    types: [
      { name: 'YLoadingTone', type: "'primary' | 'success' | 'warning' | 'danger'", description: '加载状态语义色。' },
      { name: 'YLoadingSize', type: "'sm' | 'md' | 'lg'", description: '加载指示器尺寸。' }
    ]
  },
  YSkeleton: {
    props: [
      { name: 'variant', type: "'text' | 'circle' | 'rect'", defaultValue: "'text'", description: '骨架形态。' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: '骨架尺寸。' },
      { name: 'rows', type: 'number', defaultValue: '1', description: '文本骨架行数，会限制在 1 到 8。' },
      { name: 'animated', type: 'boolean', defaultValue: 'true', description: '是否启用流光动画。' },
      { name: 'width', type: 'string', defaultValue: "''", description: '自定义宽度 CSS 值。' },
      { name: 'height', type: 'string', defaultValue: "''", description: '自定义高度 CSS 值。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '提供后会以 status 语义暴露给辅助技术。' }
    ]
  },
  YTag: {
    props: [
      { name: 'tone', type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'", defaultValue: "'neutral'", description: '标签语义色。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '标签内容。' }
    ]
  },
  YBadge: {
    props: [
      { name: 'value', type: 'string | number', defaultValue: "''", description: '徽标展示值，支持数字或短文本。' },
      { name: 'max', type: 'number', defaultValue: '99', description: '数字超过该值时显示为 max+。' },
      { name: 'dot', type: 'boolean', defaultValue: 'false', description: '是否展示无文本圆点状态。' },
      { name: 'hidden', type: 'boolean', defaultValue: 'false', description: '是否隐藏徽标内容，同时保留宿主元素。' },
      { name: 'showZero', type: 'boolean', defaultValue: 'false', description: 'value 为 0 时是否仍展示徽标。' },
      { name: 'label', type: 'string', defaultValue: "''", description: '为辅助技术提供徽标含义，例如“收件箱有 12 条未读消息”。' },
      { name: 'tone', type: "'primary' | 'success' | 'warning' | 'danger' | 'info'", defaultValue: "'primary'", description: '徽标语义色。' },
      { name: 'placement', type: "'top-end' | 'top-start' | 'bottom-end' | 'bottom-start'", defaultValue: "'top-end'", description: '有默认插槽时，徽标相对宿主元素的定位。' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: '徽标尺寸。' },
      { name: 'text', type: 'string', defaultValue: "''", description: '独立状态点旁边的说明文本。' },
      { name: 'offset', type: '[number, number]', defaultValue: '[0, 0]', description: '定位偏移，格式为 [x, y]。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '被徽标标注的宿主元素，例如按钮、头像或图标。' }
    ],
    types: [
      { name: 'YBadgeTone', type: "'primary' | 'success' | 'warning' | 'danger' | 'info'", description: '徽标语义色。' },
      { name: 'YBadgePlacement', type: "'top-end' | 'top-start' | 'bottom-end' | 'bottom-start'", description: '徽标定位。' },
      { name: 'YBadgeSize', type: "'sm' | 'md' | 'lg'", description: '徽标尺寸。' },
      { name: 'YBadgeOffset', type: '[number, number]', description: '徽标偏移。' }
    ]
  },
  YEmpty: {
    props: [
      { name: 'title', type: 'string', description: '空状态标题。', required: true },
      { name: 'description', type: 'string', defaultValue: "''", description: '空状态说明。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '默认操作区，会作为 action 插槽的 fallback，便于复制简洁示例。' },
      { name: 'action', type: 'VNode', description: '空状态操作区，优先级高于默认插槽。' }
    ]
  },
  YCommandPalette: {
    props: [
      { name: 'open', type: 'boolean', description: '命令面板打开状态。', required: true },
      { name: 'commands', type: 'YokCommand[]', description: '命令列表。', required: true }
    ],
    events: [
      { name: 'close', type: 'void', description: '按 Escape 请求关闭。' },
      { name: 'select', type: 'YokCommand', description: '选择命令时触发。' }
    ],
    types: [
      { name: 'YokCommand', type: '{ id: string; label: string }', description: '命令项。' }
    ]
  },
  YCopyButton: {
    props: [
      { name: 'text', type: 'string', description: '需要复制到剪贴板的文本。', required: true }
    ],
    events: [
      { name: 'copied', type: 'string', description: '复制成功后触发，返回复制文本。' }
    ]
  },
  YCodeBlock: {
    props: [
      { name: 'code', type: 'string', description: '代码内容。', required: true },
      { name: 'language', type: 'string', defaultValue: "'text'", description: '代码语言标签。' }
    ]
  },
  YThemeSwitcher: {
    props: [
      { name: 'modelValue', type: 'YokThemeName', description: '当前主题名称，支持 v-model。', required: true }
    ],
    events: [
      { name: 'update:modelValue', type: 'YokThemeName', description: '选择主题时触发。' }
    ],
    types: [
      { name: 'YokThemeName', type: 'string', description: '@yok-ui/themes 导出的主题名称。' }
    ]
  },
  YPageHeader: {
    props: [
      { name: 'title', type: 'string', description: '页面标题。', required: true },
      { name: 'description', type: 'string', defaultValue: "''", description: '页面说明。' },
      { name: 'eyebrow', type: 'string', defaultValue: "''", description: '标题上方的小型上下文标签。' },
      { name: 'status', type: 'string', defaultValue: "''", description: '标题旁状态标签文本。' },
      { name: 'headingLevel', type: '1 | 2 | 3', defaultValue: '1', description: '标题语义层级，嵌入已有页面标题下方时可降级。' }
    ],
    slots: [
      { name: 'actions', type: 'VNode', description: '标题区右侧操作按钮。' }
    ]
  },
  YMetricCard: {
    props: [
      { name: 'label', type: 'string', description: '指标标签。', required: true },
      { name: 'value', type: 'string | number', description: '指标值。', required: true },
      { name: 'description', type: 'string', defaultValue: "''", description: '指标说明。' },
      { name: 'trend', type: 'string', defaultValue: "''", description: '趋势标签文本。' },
      { name: 'tone', type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'", defaultValue: "'info'", description: '趋势标签语义色。' }
    ]
  },
  YSearchPanel: {
    props: [
      { name: 'modelValue', type: 'Record<string, string>', description: '筛选字段值，支持 v-model。', required: true },
      { name: 'fields', type: 'YSearchField[]', description: '筛选字段配置。', required: true },
      { name: 'submitText', type: 'string', defaultValue: "'Search'", description: '提交按钮文案。' },
      { name: 'resetText', type: 'string', defaultValue: "'Reset'", description: '重置按钮文案。' }
    ],
    events: [
      { name: 'update:modelValue', type: 'Record<string, string>', description: '字段值变化。' },
      { name: 'search', type: 'Record<string, string>', description: '提交筛选时触发。' },
      { name: 'reset', type: 'void', description: '点击重置按钮时触发。' }
    ],
    slots: [
      { name: 'actions', type: 'VNode', description: '筛选按钮后方扩展操作。' }
    ],
    types: [
      { name: 'YSearchField', type: "{ key: string; label: string; type?: 'input' | 'select'; placeholder?: string; options?: Array<{ label: string; value: string; disabled?: boolean }> }", description: '筛选字段配置。' }
    ]
  },
  YDataToolbar: {
    props: [
      { name: 'title', type: 'string', defaultValue: "''", description: '工具栏标题。' },
      { name: 'description', type: 'string', defaultValue: "''", description: '工具栏说明。' },
      { name: 'count', type: 'number', defaultValue: 'undefined', description: '展示在工具栏中的数量徽标。' }
    ],
    slots: [
      { name: 'default', type: 'VNode', description: '工具栏操作按钮区域。' }
    ]
  },
  YBrandHero: {
    props: [
      { name: 'eyebrow', type: 'string', defaultValue: "''", description: '首屏上方标签。' },
      { name: 'title', type: 'string', description: '首屏主标题。', required: true },
      { name: 'description', type: 'string', defaultValue: "''", description: '首屏说明文案。' },
      { name: 'primaryText', type: 'string', defaultValue: "''", description: '主按钮文案。' },
      { name: 'secondaryText', type: 'string', defaultValue: "''", description: '次按钮文案。' }
    ],
    events: [
      { name: 'primary', type: 'void', description: '点击主按钮时触发。' },
      { name: 'secondary', type: 'void', description: '点击次按钮时触发。' }
    ],
    slots: [
      { name: 'actions', type: 'VNode', description: '首屏按钮区扩展内容。' }
    ]
  },
  YFeatureGrid: {
    props: [
      { name: 'features', type: 'YFeatureItem[]', description: '特性卡片列表。', required: true }
    ],
    types: [
      { name: 'YFeatureItem', type: '{ title: string; description: string; meta?: string }', description: '特性项。' }
    ]
  },
  YProfileCard: {
    props: [
      { name: 'name', type: 'string', description: '展示名称。', required: true },
      { name: 'role', type: 'string', defaultValue: "''", description: '身份或角色。' },
      { name: 'bio', type: 'string', defaultValue: "''", description: '个人简介。' },
      { name: 'avatarText', type: 'string', defaultValue: "''", description: '头像占位文本，默认取 name 首字母。' },
      { name: 'tags', type: 'string[]', defaultValue: '[]', description: '标签列表。' }
    ]
  },
  YLogoCloud: {
    props: [
      { name: 'title', type: 'string', defaultValue: "''", description: 'Logo 墙标题。' },
      { name: 'logos', type: 'string[]', description: 'Logo 文本列表。', required: true }
    ]
  }
}

export const packageLabels: Record<ComponentPackage, string> = {
  '@yok-ui/core': 'Core',
  '@yok-ui/product': 'Product',
  '@yok-ui/admin': 'Admin',
  '@yok-ui/brand': 'Brand'
}

export function getComponentsByPackage(packageName: ComponentPackage) {
  return components.filter((component) => component.packageName === packageName)
}

export function getComponentsByFamily(family: ComponentFamily) {
  return components.filter((component) => component.family === family)
}
