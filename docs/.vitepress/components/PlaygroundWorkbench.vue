<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import {
  playgroundComponentDocs,
  playgroundComponents,
  playgroundComponentOptions,
  type PlaygroundComponent
} from '../data/playgroundExamples'
import { getComponentThemeEvidence } from '../data/componentThemeEvidence'
import { createCodeHighlightLines } from '../utils/codeHighlight'
import ExampleSourceActions from './ExampleSourceActions.vue'

const playgroundThemes = ['yok-light', 'yok-clean', 'yok-candy'] as const
const playgroundSizes = ['sm', 'md', 'lg'] as const
const playgroundTones = ['info', 'success', 'warning', 'danger'] as const
const playgroundButtonVariants = ['primary', 'secondary', 'ghost'] as const
const playgroundAvatarShapes = ['circle', 'square'] as const
const playgroundCodeViews = ['ts', 'js', 'install'] as const
const playgroundViewports = ['tablet', 'mobile'] as const
const playgroundThemeLabels: Record<PlaygroundTheme, string> = {
  'yok-light': 'Light',
  'yok-clean': 'Clean',
  'yok-candy': 'Candy'
}
const playgroundViewportLabels: Record<PlaygroundViewport, string> = {
  tablet: '平板预览',
  mobile: '手机预览'
}

type PlaygroundTheme = (typeof playgroundThemes)[number]
type PlaygroundSize = (typeof playgroundSizes)[number]
type PlaygroundTone = (typeof playgroundTones)[number]
type PlaygroundButtonVariant = (typeof playgroundButtonVariants)[number]
type PlaygroundAvatarShape = (typeof playgroundAvatarShapes)[number]
type PlaygroundCodeView = (typeof playgroundCodeViews)[number]
type PlaygroundViewport = (typeof playgroundViewports)[number]
type SearchFormModelValue = string | [string, string] | []

interface ImportedReplayStep {
  key?: string
  label: string
  detail: string
  passed?: boolean
}

interface ImportedReplayEvent {
  id?: number
  component: string
  event: string
  preview?: string
  payload?: unknown
}

interface ImportedReplayManifest {
  component?: string
  packageName?: string
  docs?: string | null
  scenario?: {
    key?: string
    label?: string
    kind?: string
    shareUrl?: string
  } | null
  theme?: {
    name?: string
    label?: string
  }
  viewport?: {
    value?: string
    label?: string
  }
  controls?: Record<string, unknown>
  changedControls?: number
  previewState?: unknown
  events?: ImportedReplayEvent[]
  steps?: ImportedReplayStep[]
  assertions?: {
    liveStatus?: string
    validation?: string
    interactionContracts?: Array<{
      componentName?: string
      pattern?: string
      maturity?: string
    }>
  }
  links?: {
    state?: string | null
    scenario?: string | null
    playground?: string | null
  }
}

interface ImportedPlaygroundHandoffPayload {
  version?: number
  component?: string | null
  theme?: string
  source?: string
  origin?: string
  language?: string
  sourcePanel?: {
    mode?: string
    label?: string
    language?: string
    installPackageManager?: string
  }
  docsHash?: string
  scenario?: string
  viewport?: string
  controls?: Record<string, unknown>
  replay?: ImportedReplayManifest | null
  createdAt?: string
}

const playgroundHandoffStoragePrefix = 'yok-ui:playground-handoff'
const clipboardWriteTimeoutMs = 320
const importedSourcePanelId = 'playground-workbench-source-panel'
const activeComponent = ref<PlaygroundComponent>('button')
const activeFamily = ref('all')
const activeCodeView = ref<PlaygroundCodeView>('ts')
const theme = ref<PlaygroundTheme>('yok-light')
const size = ref<PlaygroundSize>('md')
const variant = ref<PlaygroundButtonVariant>('primary')
const disabled = ref(false)
const loading = ref(false)
const tone = ref<PlaygroundTone>('info')
const avatarTone = computed(() => (tone.value === 'info' ? 'primary' : tone.value))
const avatarShape = ref<PlaygroundAvatarShape>('circle')
const inputValue = ref('Yok UI')
const inputOtpValue = ref('123')
const inputTagValue = ref(['Vue', 'TypeScript'])
const autocompleteValue = ref('auto')
const mentionValue = ref('Please review @ad')
const selectValue = ref('core')
const numberValue = ref(6)
const sliderValue = ref(64)
const rateValue = ref(4)
const checkboxValue = ref(true)
const radioValue = ref('core')
const switchValue = ref(true)
const dateValue = ref('2026-06-13')
const dateRangeValue = ref(['2026-06-13', '2026-06-20'])
const dateTimeValue = ref('2026-07-04 20:30')
const timeValue = ref('09:30')
const timeSelectValue = ref('09:00')
const cascaderValue = ref(['core', 'form', 'cascader'])
const colorValue = ref('#14B8A6')
const colorPanelValue = ref('#14B8A6')
const imageSrc = '/logo.svg'
const badgeValue = ref(12)
const checkTagChecked = ref(true)
const segmentedValue = ref('list')
const segmentedOptions = [
  { label: 'List', value: 'list', description: 'Dense review queue' },
  { label: 'Kanban', value: 'kanban', description: 'Workflow columns' },
  { label: 'Calendar', value: 'calendar', description: 'Release schedule' }
]
const calendarValue = ref('2026-06-18')
const carouselItems = [
  {
    title: 'Release radar',
    description: 'Track API, live example and accessibility evidence in one rotating view.',
    meta: 'Docs',
    tone: 'primary'
  },
  {
    title: 'Playground handoff',
    description: 'Send the current component state into a route-driven workbench.',
    meta: 'Workflow',
    tone: 'success'
  },
  {
    title: 'Keyboard path',
    description: 'Arrow keys and indicator buttons keep slide navigation operable.',
    meta: 'A11y',
    tone: 'warning'
  }
]
const activeTab = ref('usage')
const stepCurrent = ref(1)
const tourOpen = ref(true)
const tourCurrent = ref(0)
const collapseValue = ref(['usage'])
const paginationPage = ref(2)
const paginationTotal = 73
const paginationPageSize = 10
const tooltipContent = 'Create a new component file'
const popoverTitle = 'Coverage note'
const popoverContent = 'Add live examples before marking a component documented.'
const dropdownItems = [
  { label: 'View docs', value: 'docs' },
  { label: 'Copy command', value: 'copy' },
  { label: 'Delete draft', value: 'delete', disabled: true }
]
const popconfirmTitle = 'Delete draft?'
const popconfirmDescription = 'This action only affects the current local draft.'
const modalOpen = ref(true)
const drawerOpen = ref(true)
const timelineItems = [
  { title: 'Draft created', value: 'draft', description: 'Component example entered the documentation queue.', time: '09:00', tone: 'info' },
  { title: 'API reviewed', value: 'api', description: 'Props, events and slots were checked against registry metadata.', time: '10:30', tone: 'success' },
  { title: 'Accessibility review', value: 'a11y', description: 'Keyboard and screen reader notes are being verified.', time: 'Now', tone: 'warning', loading: true }
]
const cardTitle = 'Release checklist'
const cardDescription = 'Keep docs, examples and API evidence together.'
const emptyTitle = 'No matching components'
const emptyDescription = 'Adjust filters or create a new component draft.'
const skeletonRows = 3
const messageTitle = 'Docs build complete'
const messageContent = 'Live examples, API tables and a11y notes are ready for review.'
const messageBoxTitle = 'Publish release?'
const messageBoxContent = 'This will make the selected component release visible to users.'
const qrCodeValue = 'https://yok-ui.dev/components/qr-code'
const qrCodeLabel = 'Yok UI QRCode documentation'
const floatButtonActions = [
  { key: 'create', label: 'Create component', icon: '+', type: 'primary' },
  { key: 'docs', label: 'Open docs', icon: '?' },
  { key: 'feedback', label: 'Send feedback', icon: '!' }
]
const resultTitle = 'Component published'
const resultSubtitle = 'The documentation page is ready for design-system consumers.'
const notificationTitle = 'Docs published'
const notificationContent = 'Carousel, live example and Playground routes are ready for review.'
const textareaValue = ref('Yok UI live examples now track coverage.')
const formModel = ref({
  name: 'Yok UI',
  package: 'core'
})
const formRules = {
  name: { required: true, message: 'Component name is required.', trigger: 'submit' },
  package: { required: true, message: 'Package is required.', trigger: 'change' }
}
const formItemValue = ref('YokInput')
const formSummaryErrors = [
  { fieldId: 'component-name', label: 'Component name', message: 'Component name is required.' },
  { fieldId: 'release-note', label: 'Release note', message: 'Add a short release note before publishing.' }
]
const dividerLabel = 'Component metadata'
const linkHref = '/components/'
const textContent = 'Use semantic text instead of one-off CSS.'
const uploadFiles = ref([
  { id: 'one', name: 'component-spec.md', size: 12600, status: 'success', progress: 100 },
  { id: 'two', name: 'docs-preview.png', size: 820000, status: 'uploading', progress: 68 }
])
const iconLabel = 'Documentation status'
const configProviderLocale = 'zh-CN'
const transferValue = ref(['button', 'select'])
const transferOptions = [
  { label: 'Button', value: 'button', description: 'Primary action component.' },
  { label: 'Select', value: 'select', description: 'Floating UI combobox component.' },
  { label: 'Table', value: 'table', description: 'Structured data display.' },
  { label: 'Theme Lab', value: 'theme-lab', description: 'Design token workspace.', disabled: true }
]
const virtualListItems = Array.from({ length: 24 }, (_, index) => ({
  id: `component-${index + 1}`,
  label: `Component ${index + 1}`,
  description: index % 2 === 0 ? 'Stable docs coverage' : 'Needs live example review'
}))
const treeSelectedKey = ref('button')
const treeExpandedKeys = ref(['core', 'form'])
const treeCheckedKeys = ref(['button'])
const treeSelectValue = ref('button')
const treeNodes = [
  {
    key: 'core',
    label: 'Core',
    children: [
      { key: 'button', label: 'Button' },
      {
        key: 'form',
        label: 'Form',
        children: [
          { key: 'input', label: 'Input' },
          { key: 'select', label: 'Select' }
        ]
      }
    ]
  },
  {
    key: 'admin',
    label: 'Admin',
    children: [
      { key: 'data-table', label: 'Data Table' },
      { key: 'resource-page', label: 'Resource Page' }
    ]
  }
]
const watermarkContent = 'Yok UI Draft'
const breadcrumbItems = [
  { label: 'Components', href: '/components/' },
  { label: 'Overlay & Navigation', href: '/components/breadcrumb' },
  { label: 'Breadcrumb', current: true }
]
const menuItems = [
  { label: 'Guide', value: 'guide', icon: 'G' },
  {
    label: 'Components',
    value: 'components',
    icon: 'C',
    children: [
      { label: 'Button', value: 'button' },
      { label: 'Menu', value: 'menu' }
    ]
  },
  { label: 'Resources', value: 'resources', icon: 'R' }
]
const backtopVisibilityHeight = 0
const affixOffset = 16
const anchorItems = [
  { title: 'Usage', href: '#usage' },
  {
    title: 'API',
    href: '#api',
    children: [
      { title: 'Props', href: '#props' },
      { title: 'Events', href: '#events', disabled: true }
    ]
  },
  { title: 'Accessibility', href: '#accessibility' }
]
const scrollbarItems = [
  'Keep examples runnable.',
  'Review props, events and slots.',
  'Verify keyboard path.',
  'Build docs and inspect locally.',
  'Ship with confidence.'
]
const spaceItems = ['Core', 'Product', 'Admin', 'Brand']
const splitterPanels = [
  { key: 'navigation', label: 'Navigation', size: 28, min: 16, max: 48, collapsible: true, collapsedSize: 8 },
  { key: 'preview', label: 'Preview', size: 72, min: 36 }
]
const commandPaletteOpen = ref(true)
const commandPaletteCommands = [
  { id: 'new-component', label: 'Create new component' },
  { id: 'open-docs', label: 'Open current docs page' },
  { id: 'copy-install', label: 'Copy install command' }
]
const codeBlockSnippet = `import { YButton } from '@yok-ui/core'\n\nexport function Demo() {\n  return 'fresh cute docs'\n}`
const themeSwitcherValue = ref<PlaygroundTheme>('yok-light')
const pageHeaderTitle = 'Component operations'
const pageHeaderDescription = 'Search, review and publish component documentation from one admin surface.'
const metricCardValue = 73
const brandHeroTitle = 'Yok UI'
const brandHeroDescription = 'Fresh, cute and practical Vue 3 components for personal products and admin systems.'
const featureGridItems = [
  { title: 'Package aware', description: 'Core, Product, Admin and Brand components share one docs system.', meta: '01' },
  { title: 'Live examples', description: 'Every component page can open a matching Playground route.', meta: '02' },
  { title: 'A11y evidence', description: 'Keyboard and semantic contracts are tracked beside API data.', meta: '03' }
]
const profileCardTags = ['Vue 3', 'Docs', 'A11y']
const logoCloudItems = ['Vue', 'Vite', 'Floating UI', 'Vitest']
const themeProviderTheme = ref<PlaygroundTheme>('yok-candy')
const progressValue = ref(64)
const defaultSchemaFormModel = {
  name: 'Yok Button',
  package: 'core',
  description: 'Reusable component documented with API and examples.',
  stable: true
}
const schemaFormModel = ref<Record<string, unknown>>({ ...defaultSchemaFormModel })
const defaultSearchFormModel = {
  keyword: 'button',
  status: 'stable',
  owner: '',
  releaseDate: '2026-07-01',
  releaseWindow: ['2026-07-01', '2026-07-07'] as [string, string]
}
const searchFormModel = ref<Record<string, SearchFormModelValue>>({ ...defaultSearchFormModel })
const copied = ref(false)
const copiedShare = ref(false)
const copiedImportManifest = ref(false)
const importedSource = ref('')
const importedInitialSource = ref('')
const importedInitialCodeView = ref<PlaygroundCodeView | ''>('')
const importedInitialTheme = ref<PlaygroundTheme | ''>('')
const importedSourceDisplayMode = ref<'edit' | 'source'>('edit')
const importedSourceOrigin = ref('')
const importedSourcePanel = ref<ImportedPlaygroundHandoffPayload['sourcePanel'] | null>(null)
const importedDocsHash = ref('')
const importedScenario = ref('')
const importedViewport = ref<PlaygroundViewport | ''>('')
const importedControls = ref<Record<string, string | number | boolean>>({})
const importedReplay = ref<ImportedReplayManifest | null>(null)
const importedHandoffKey = ref('')
const importedHandoffMissingKey = ref('')

const selectOptions = [
  { label: 'Core primitives', value: 'core' },
  { label: 'Product tools', value: 'product' },
  { label: 'Admin workflow', value: 'admin' }
]

const autocompleteOptions = [
  { label: 'Button', value: 'button', description: 'Basic action component.' },
  { label: 'Autocomplete', value: 'autocomplete', description: 'Free text input with suggestions.' },
  { label: 'Select', value: 'select', description: 'Bounded option picker.' },
  { label: 'Cascader', value: 'cascader', description: 'Hierarchical path picker.' },
  { label: 'Data Table', value: 'data-table', description: 'Admin data workflow component.' }
]

const mentionOptions = [
  { label: 'Ada Lovelace', value: 'ada', description: 'Core maintainer' },
  { label: 'Grace Hopper', value: 'grace', description: 'Compiler team' },
  { label: 'Lin Design', value: 'lin-design', description: 'Design system owner' },
  { label: 'Release Notes', value: 'release-notes', description: 'Documentation topic' }
]

const radioOptions = [
  { label: 'Core', value: 'core' },
  { label: 'Product', value: 'product' },
  { label: 'Admin', value: 'admin' }
]

const rateTexts = ['Need work', 'Okay', 'Good', 'Lovely', 'Excellent']

const tabItems = [
  { label: 'Usage', value: 'usage', icon: '◎' },
  { label: 'API', value: 'api', badge: 6 },
  { label: 'Theme', value: 'theme' },
  { label: 'Draft', value: 'draft', closable: true },
  { label: 'Disabled', value: 'disabled', disabled: true }
]

const stepItems = [
  { title: 'Install', description: 'Add packages' },
  { title: 'Compose', description: 'Build examples' },
  { title: 'Ship', description: 'Publish docs' }
]

const tourSteps = [
  {
    title: 'Search docs',
    description: 'Use search to jump to components, guides and examples.',
    target: '#playground-tour-search'
  },
  {
    title: 'Open Playground',
    description: 'Edit examples and export a reproduction bundle.',
    target: '#playground-tour-edit'
  },
  {
    title: 'Ship evidence',
    description: 'Copy source, verify API coverage and publish docs.',
    target: '#playground-tour-ship'
  }
]

const collapseItems = [
  { label: 'Usage', value: 'usage', content: 'Start with the default component pattern.' },
  { label: 'API', value: 'api', content: 'Review props, events, slots and types.' },
  { label: 'Accessibility', value: 'a11y', content: 'Check keyboard and screen reader behavior.' }
]

const cascaderOptions = [
  {
    value: 'core',
    label: 'Core',
    children: [
      {
        value: 'form',
        label: 'Form',
        children: [
          { value: 'cascader', label: 'Cascader' },
          { value: 'date-picker', label: 'Date Picker' }
        ]
      },
      {
        value: 'feedback',
        label: 'Feedback',
        children: [
          { value: 'tooltip', label: 'Tooltip' },
          { value: 'message', label: 'Message' }
        ]
      }
    ]
  },
  {
    value: 'admin',
    label: 'Admin',
    children: [
      {
        value: 'data',
        label: 'Data',
        children: [
          { value: 'data-table', label: 'Data Table' },
          { value: 'saved-views', label: 'Saved Views' }
        ]
      }
    ]
  }
]

const tableColumns = [
  { key: 'name', label: 'Component', sortable: true },
  { key: 'status', label: 'Status', filters: [{ text: 'Stable', value: 'Stable' }, { text: 'Beta', value: 'Beta' }] },
  { key: 'owner', label: 'Owner' }
]

const tableRows = [
  { id: 'button', name: 'Button', status: 'Stable', owner: 'Core' },
  { id: 'select', name: 'Select', status: 'Stable', owner: 'Form' },
  { id: 'data-table', name: 'Data Table', status: 'Beta', owner: 'Admin' }
]

const releaseTasks = [
  { key: 'api', title: 'API coverage', description: 'Props, events and slots stay generated from structured data.', meta: 'Docs' },
  { key: 'a11y', title: 'Accessibility evidence', description: 'Keyboard and semantic notes are visible on component pages.', meta: 'Quality' },
  { key: 'theme', title: 'Theme review', description: 'Light, Clean and Candy themes keep examples readable.', meta: 'Design' }
]

const componentDetails = [
  { label: 'Package', value: '@yok-ui/core' },
  { label: 'Family', value: 'Data Display' },
  { label: 'Status', value: 'Stable' },
  { label: 'A11y', value: 'documented' }
]
const adminTableColumns = [
  { key: 'name', title: 'Component', sortable: true, filterable: true },
  { key: 'status', title: 'Status', filterable: true },
  { key: 'owner', title: 'Owner' },
  { key: 'updatedAt', title: 'Updated' }
]
const adminTableRows = [
  { id: 'button', name: 'Button', status: 'Stable', owner: 'Core team', updatedAt: '2026-06-13' },
  { id: 'data-table', name: 'Data Table', status: 'Beta', owner: 'Admin team', updatedAt: '2026-06-16' },
  { id: 'theme', name: 'Theme Lab', status: 'Stable', owner: 'Design system', updatedAt: '2026-06-15' },
  { id: 'review', name: 'Review Workflow', status: 'Beta', owner: 'Ops team', updatedAt: '2026-06-14' }
]
const dataViewViews = [
  {
    label: 'Beta review',
    value: 'beta',
    description: 'Components waiting for admin workflow validation.',
    count: 2,
    pinned: true,
    preference: {
      columnKeys: ['name', 'status', 'owner'],
      columnWidths: { name: 188, status: 132 },
      density: 'comfortable',
      filters: { status: ['Beta'] }
    }
  },
  {
    label: 'Stable release',
    value: 'stable',
    description: 'Components ready for package documentation.',
    count: 2,
    pinned: true,
    preference: {
      columnKeys: ['status', 'name', 'owner'],
      columnWidths: { status: 148, name: 212 },
      density: 'compact',
      filters: { status: ['Stable'] }
    }
  },
  {
    label: 'Owner review',
    value: 'owner',
    description: 'Saved filter for admin team follow-up.',
    count: 2,
    preference: {
      columnKeys: ['name', 'owner', 'updatedAt'],
      columnWidths: { owner: 152 },
      density: 'comfortable',
      filters: { owner: ['Admin team'] }
    }
  }
]
const dataViewColumns = [
  { key: 'name', title: 'Component', sortable: true, filterable: true },
  { key: 'status', title: 'Status', filterable: true },
  { key: 'owner', title: 'Owner', filterable: true },
  { key: 'updatedAt', title: 'Updated', sortable: true }
]
const dataViewRows = [
  { id: 'button', name: 'Button', status: 'Stable', owner: 'Core team', updatedAt: '2026-06-13' },
  { id: 'data-table', name: 'Data Table', status: 'Beta', owner: 'Admin team', updatedAt: '2026-06-16' },
  { id: 'theme', name: 'Theme Lab', status: 'Stable', owner: 'Design system', updatedAt: '2026-06-15' },
  { id: 'review', name: 'Review Workflow', status: 'Beta', owner: 'Admin team', updatedAt: '2026-06-14' }
]
const defaultResourceSearchModel = {
  keyword: 'table',
  status: 'beta',
  package: 'admin',
  owner: ''
}
const resourceSearchModel = ref<Record<string, string>>({ ...defaultResourceSearchModel })
const resourceSearchFields = [
  {
    key: 'keyword',
    label: 'Keyword',
    placeholder: 'Search component'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Stable', value: 'stable' },
      { label: 'Beta', value: 'beta' },
      { label: 'Deprecated', value: 'deprecated' }
    ],
    defaultValue: 'beta'
  },
  {
    key: 'package',
    label: 'Package',
    type: 'select',
    options: selectOptions,
    defaultValue: 'admin'
  },
  {
    key: 'owner',
    label: 'Owner',
    type: 'select',
    options: [
      { label: 'Core team', value: 'core' },
      { label: 'Admin team', value: 'admin' },
      { label: 'Design system', value: 'design' }
    ]
  }
]
const resourceViews = dataViewViews
const resourceColumns = dataViewColumns
const resourceRows = dataViewRows
const defaultCrudSearchModel = {
  keyword: 'button',
  status: 'stable',
  package: 'admin',
  owner: ''
}
const crudSearchModel = ref<Record<string, string>>({ ...defaultCrudSearchModel })
const crudSearchFields = resourceSearchFields
const crudTableColumns = dataViewColumns
const crudTableRows = dataViewRows
const defaultBulkSelectedRowKeys = ['button', 'data-table', 'theme']
const bulkSelectedRowKeys = ref<string[]>([...defaultBulkSelectedRowKeys])
const bulkActions = [
  { label: 'Publish', value: 'publish', tone: 'success' },
  { label: 'Assign owner', value: 'assign', tone: 'info' },
  { label: 'Archive', value: 'archive', tone: 'danger' }
]
const bulkMenuActions = [
  { label: 'Publish', value: 'publish', group: 'Workflow', tone: 'success', description: 'Move selected components to stable.' },
  { label: 'Assign owner', value: 'assign', group: 'Workflow', tone: 'info' },
  { label: 'Export CSV', value: 'export', group: 'Export' },
  { label: 'Delete', value: 'delete', group: 'Danger zone', tone: 'danger', requiresConfirm: true, confirmText: 'Confirm delete' }
]
const dataToolbarCount = 73
const defaultSavedViewModel = 'beta'
const defaultSavedViewDefault = 'live'
const savedViewModel = ref(defaultSavedViewModel)
const savedViewItems = dataViewViews
const savedViewDefault = ref(defaultSavedViewDefault)
const savedViewManagerItems = ref(dataViewViews.map((item) => ({ ...item })))
const defaultSearchPanelModel = {
  keyword: 'button',
  status: 'stable',
  package: 'admin'
}
const searchPanelModel = ref<Record<string, string>>({ ...defaultSearchPanelModel })
const searchPanelFields = resourceSearchFields
const defaultFilterTabValue = 'stable'
const filterTabValue = ref(defaultFilterTabValue)
const filterTabItems = [
  { label: 'All', value: 'all', count: 73 },
  { label: 'Stable', value: 'stable', count: 40, tone: 'success' },
  { label: 'Beta', value: 'beta', count: 21, tone: 'warning' },
  { label: 'Needs review', value: 'review', count: 12, tone: 'danger' }
]
const statusTimelineItems = [
  { title: 'Submitted', value: 'submitted', description: 'Example entered the review queue.', time: '09:00', tone: 'success' },
  { title: 'Reviewing', value: 'reviewing', description: 'Maintainer is checking source, keyboard path and a11y notes.', time: '10:30', tone: 'warning', current: true },
  { title: 'Approved', value: 'approved', description: 'Ready to publish after final docs build.', time: 'Next', tone: 'info' }
]
const reviewWorkflowSteps = statusTimelineItems
const defaultApprovalComment = 'Please add keyboard notes before release.'
const approvalComment = ref(defaultApprovalComment)
const defaultApprovalDecision = 'requestChanges'
const approvalDecision = ref(defaultApprovalDecision)
const defaultApprovalSuggestions = ['keyboard']
const selectedApprovalSuggestions = ref([...defaultApprovalSuggestions])
const approvalSuggestions = [
  { label: '补充键盘说明', value: 'keyboard' },
  { label: '补充 API 表', value: 'api' },
  { label: '需要视觉复核', value: 'visual', tone: 'warning' }
]
const approvalAttachments = [
  { name: 'audit-notes.md', url: '/audit-notes.md', size: '12 KB' }
]
const defaultFieldArrayItems = [
  { id: 'ada', name: 'Ada Chen', role: 'Design review' },
  { id: 'lin', name: 'Lin Zhou', role: 'Accessibility' }
]
const fieldArrayItems = ref(defaultFieldArrayItems.map((item) => ({ ...item })))
const fieldArrayDefaultItem = { id: 'new-reviewer', name: '', role: '' }
const schemaFormSchema = [
  {
    key: 'name',
    label: 'Component name',
    placeholder: 'Button',
    required: true,
    helper: 'Name shown in docs navigation and package exports.'
  },
  {
    key: 'package',
    label: 'Package',
    type: 'select',
    options: selectOptions,
    required: true
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 3
  },
  {
    key: 'stable',
    label: 'Stable release',
    type: 'switch',
    helper: 'Mark stable only after examples, API and accessibility notes are complete.'
  }
]
const searchFormStatusOptions = [
  { label: 'Stable', value: 'stable' },
  { label: 'Beta', value: 'beta' },
  { label: 'Deprecated', value: 'deprecated' }
]
const searchFormOwnerOptions = [
  { label: 'Core team', value: 'core' },
  { label: 'Admin team', value: 'admin' },
  { label: 'Design system', value: 'design' }
]
const searchFormFields = [
  {
    key: 'keyword',
    label: 'Keyword',
    placeholder: 'Component name'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: searchFormStatusOptions,
    defaultValue: 'stable'
  },
  {
    key: 'owner',
    label: 'Owner',
    type: 'select',
    options: searchFormOwnerOptions
  },
  {
    key: 'releaseDate',
    label: 'Release date',
    type: 'date',
    shortcuts: [
      { label: 'Today', value: '2026-06-13' },
      { label: 'Launch day', value: '2026-07-01', time: '20:30', description: 'Low traffic release window' }
    ]
  },
  {
    key: 'releaseWindow',
    label: 'Release window',
    type: 'dateRange',
    shortcuts: [
      { label: 'Release week', value: ['2026-07-01', '2026-07-07'], time: '20:30-09:00' }
    ]
  },
  {
    key: 'package',
    label: 'Package',
    type: 'select',
    options: selectOptions,
    hidden: false
  }
]

const componentOptions = playgroundComponentOptions
const adminPlaygroundComponents = new Set<PlaygroundComponent>([
  'dataTable',
  'dataView',
  'resourcePage',
  'crudLayout',
  'approvalCommentBox',
  'bulkActionBar',
  'bulkActionMenu',
  'dataToolbar',
  'savedViews',
  'savedViewManager',
  'searchPanel',
  'filterTabs',
  'statusTimeline',
  'reviewWorkflow',
  'fieldArray',
  'schemaForm',
  'searchForm'
])

const activeMeta = computed(() =>
  componentOptions.find((component) => component.value === activeComponent.value) ?? componentOptions[0]
)
const activeDocsRoute = computed(() => playgroundComponentDocs[activeComponent.value])
const activeSourceFileHref = computed(() => {
  const sourcePath = getComponentThemeEvidence(activeMeta.value.name)?.sourcePath

  return sourcePath ? `/source/?file=${sourcePath}` : ''
})
const activeThemeLabel = computed(() => playgroundThemeLabels[theme.value])
const importedViewportLabel = computed(() =>
  importedViewport.value ? playgroundViewportLabels[importedViewport.value] : 'Auto'
)
const familyFilters = computed(() => {
  const families = componentOptions.reduce<Record<string, number>>((collection, component) => {
    collection[component.family] = (collection[component.family] ?? 0) + 1

    return collection
  }, {})

  return [
    { label: 'All', value: 'all', count: componentOptions.length },
    ...Object.entries(families).map(([family, count]) => ({
      label: family,
      value: family,
      count
    }))
  ]
})
const filteredComponentOptions = computed(() =>
  activeFamily.value === 'all'
    ? componentOptions
    : componentOptions.filter((component) => component.family === activeFamily.value)
)

const componentImports = computed(() => {
  const importMap: Record<PlaygroundComponent, string> = {
    button: 'YButton',
    icon: 'YIcon',
    image: 'YImage',
    segmented: 'YSegmented',
    calendar: 'YCalendar',
    input: 'YInput',
    inputOtp: 'YInputOtp',
    inputTag: 'YInputTag',
    autocomplete: 'YAutocomplete',
    mention: 'YMention',
    select: 'YSelect',
    inputNumber: 'YInputNumber',
    slider: 'YSlider',
    rate: 'YRate',
    checkbox: 'YCheckbox',
    radioGroup: 'YRadioGroup',
    switch: 'YSwitch',
    datePicker: 'YDatePicker',
    dateRangePicker: 'YDateRangePicker',
    dateTimePicker: 'YDateTimePicker',
    timePicker: 'YTimePicker',
    timeSelect: 'YTimeSelect',
    transfer: 'YTransfer',
    cascader: 'YCascader',
    treeSelect: 'YTreeSelect',
    colorPicker: 'YColorPicker',
    colorPickerPanel: 'YColorPickerPanel',
    carousel: 'YCarousel',
    configProvider: 'YConfigProvider',
    table: 'YTable',
    dataTable: 'YDataTable',
    dataView: 'YDataView',
    resourcePage: 'YResourcePage',
    crudLayout: 'YCrudLayout',
    approvalCommentBox: 'YApprovalCommentBox',
    bulkActionBar: 'YBulkActionBar',
    bulkActionMenu: 'YBulkActionMenu',
    dataToolbar: 'YDataToolbar',
    savedViews: 'YSavedViews',
    savedViewManager: 'YSavedViewManager',
    searchPanel: 'YSearchPanel',
    filterTabs: 'YFilterTabs',
    statusTimeline: 'YStatusTimeline',
    reviewWorkflow: 'YReviewWorkflow',
    fieldArray: 'YFieldArray',
    schemaForm: 'YSchemaForm',
    searchForm: 'YSearchForm',
    list: 'YList',
    layout: 'YLayout, YHeader, YAside, YMain, YFooter, YMenu',
    statistic: 'YStatistic',
    descriptions: 'YDescriptions',
    virtualList: 'YVirtualList',
    tree: 'YTree',
    watermark: 'YWatermark',
    qrCode: 'YQRCode',
    floatButton: 'YFloatButtonGroup',
    tabs: 'YTabs',
    steps: 'YSteps',
    tour: 'YTour',
    menu: 'YMenu',
    breadcrumb: 'YBreadcrumb',
    backtop: 'YBacktop',
    affix: 'YAffix',
    anchor: 'YAnchor',
    collapse: 'YCollapse',
    tooltip: 'YTooltip',
    popover: 'YPopover',
    dropdown: 'YDropdown',
    popconfirm: 'YPopconfirm',
    modal: 'YModal',
    drawer: 'YDrawer',
    pagination: 'YPagination',
    timeline: 'YTimeline',
    card: 'YCard',
    empty: 'YEmpty',
    skeleton: 'YSkeleton',
    loading: 'YLoading',
    message: 'YMessage',
    messageBox: 'YMessageBox',
    notification: 'YNotification',
    result: 'YResult',
    textarea: 'YTextarea',
    form: 'YForm',
    formItem: 'YFormItem',
    formSummary: 'YFormSummary',
    divider: 'YDivider',
    link: 'YLink',
    text: 'YText',
    upload: 'YUpload',
    scrollbar: 'YScrollbar',
    space: 'YSpace',
    splitter: 'YSplitter',
    commandPalette: 'YCommandPalette',
    codeBlock: 'YCodeBlock',
    themeSwitcher: 'YThemeSwitcher',
    pageHeader: 'YPageHeader',
    metricCard: 'YMetricCard',
    brandHero: 'YBrandHero',
    featureGrid: 'YFeatureGrid',
    profileCard: 'YProfileCard',
    logoCloud: 'YLogoCloud',
    themeProvider: 'YThemeProvider',
    avatar: 'YAvatar',
    avatarGroup: 'YAvatar, YAvatarGroup',
    tag: 'YTag',
    checkTag: 'YCheckTag',
    badge: 'YBadge',
    progress: 'YProgress',
    alert: 'YAlert'
  }

  return importMap[activeComponent.value]
})
const componentPackageName = computed(() =>
  activeMeta.value.packageName
)
const importedControlSummary = computed(() =>
  Object.entries(importedControls.value)
    .filter(([, value]) => value !== '' && value !== null && typeof value !== 'undefined')
    .slice(0, 5)
    .map(([key, value]) => `${key}: ${String(value)}`)
)
const importedControlCount = computed(() => Object.keys(importedControls.value).length)
const importedSourceOriginLabel = computed(() => {
  if (importedSourceOrigin.value === 'docs-demo') {
    return 'Docs demo'
  }

  if (importedSourceOrigin.value === 'live-example') {
    return 'Live example'
  }

  return importedSourceOrigin.value || 'Direct import'
})
const importedSourceKicker = computed(() =>
  importedHandoffMissingKey.value
    ? 'Playground handoff 已失效'
    : importedSourceOrigin.value === 'live-example'
    ? 'Live example 已导入'
    : '已从组件文档导入'
)
const importedPanelTitle = computed(() =>
  importedHandoffMissingKey.value
    ? `${activeMeta.value.label} 导入源码暂不可用`
    : `${activeMeta.value.label} 可编辑示例源码`
)
const importedSourceLanguageLabel = computed(() =>
  activeCodeView.value === 'install' ? 'Install' : activeCodeView.value.toUpperCase()
)
const importedDocsRoute = computed(() =>
  importedSourceOrigin.value === 'live-example'
    ? `${activeDocsRoute.value}${importedDocsHash.value || '#live-example'}`
    : `${activeDocsRoute.value}${importedDocsHash.value}`
)
const importedDocsLinkLabel = computed(() =>
  importedSourceOrigin.value === 'live-example'
    ? '返回文档示例'
    : '查看组件文档'
)
const importedReplayEvents = computed(() =>
  (importedReplay.value?.events ?? []).filter((event) =>
    typeof event.component === 'string' && typeof event.event === 'string'
  )
)
const importedReplaySteps = computed(() =>
  (importedReplay.value?.steps ?? []).filter((step) =>
    typeof step.label === 'string' && typeof step.detail === 'string'
  )
)
const importedReplayContractCount = computed(() =>
  importedReplay.value?.assertions?.interactionContracts?.length ?? 0
)
const importedReplayItems = computed(() => [
  {
    label: 'Events',
    value: `${importedReplayEvents.value.length}`,
    detail: importedReplayEvents.value.length
      ? importedReplayEvents.value.slice(0, 2).map((event) => `${event.component}@${event.event}`).join(' / ')
      : 'No replay events yet.'
  },
  {
    label: 'Steps',
    value: `${importedReplaySteps.value.length}`,
    detail: importedReplaySteps.value.find((step) => step.passed === false)?.label ?? 'Replay checklist imported.'
  },
  {
    label: 'Contracts',
    value: `${importedReplayContractCount.value}`,
    detail: importedReplay.value?.assertions?.validation ?? 'Pass'
  },
  {
    label: 'State',
    value: importedReplay.value?.changedControls ? `${importedReplay.value.changedControls} changed` : 'Synced',
    detail: importedReplay.value?.scenario?.label ?? (importedScenario.value || 'Playground state')
  }
])
const importedManifestItems = computed(() => [
  { label: 'Component', value: activeMeta.value.label },
  { label: 'Origin', value: importedSourceOriginLabel.value },
  { label: 'Language', value: importedSourceLanguageLabel.value },
  { label: 'Source panel', value: importedSourcePanel.value?.label ?? 'Code' },
  { label: 'Theme', value: activeThemeLabel.value },
  { label: 'Scenario', value: importedScenario.value || 'None' },
  { label: 'Viewport', value: importedViewportLabel.value },
  { label: 'Controls', value: String(importedControlCount.value) },
  { label: 'Source', value: `${importedSourceStats.value.lines} lines` },
  { label: 'Replay', value: importedReplay.value ? `${importedReplayEvents.value.length} events` : 'None' },
  { label: 'Handoff', value: importedHandoffKey.value || importedHandoffMissingKey.value || 'Direct' }
])
const importedSummaryItems = computed(() => [
  { label: 'Component', value: activeMeta.value.label },
  { label: 'Language', value: importedSourceLanguageLabel.value },
  { label: 'Source', value: `${importedSourceStats.value.lines} lines` },
  { label: 'Theme', value: activeThemeLabel.value }
])

const generatedMarkup = computed(() => {
  if (activeComponent.value === 'button') {
    return `<YButton size="${size.value}" variant="${variant.value}"${disabled.value ? ' disabled' : ''}${loading.value ? ' loading' : ''}>Generate</YButton>`
  }

  if (activeComponent.value === 'image') {
    return '<YImage :src="imageSrc" alt="Yok UI logo" fit="contain" width="220px" height="140px" preview />'
  }

  if (activeComponent.value === 'segmented') {
    return '<YSegmented v-model="viewMode" :options="segmentedOptions" aria-label="View mode" name="playground-view-mode" block />'
  }

  if (activeComponent.value === 'calendar') {
    return '<YCalendar v-model="selectedDate" />'
  }

  if (activeComponent.value === 'input') {
    return `<YInput v-model="value" label="Library name"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'inputOtp') {
    return `<YInputOtp v-model="code" label="Verification code" :length="6"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'inputTag') {
    return `<YInputTag v-model="tags" label="Tech stack" placeholder="Press Enter to add" :max="5"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'autocomplete') {
    return `<YAutocomplete v-model="componentName" label="Component" placeholder="Search components" clearable :options="autocompleteOptions"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'mention') {
    return `<YMention v-model="releaseNote" label="Release note" placeholder="Mention reviewers with @" clearable prefix="@,#" :options="mentionOptions"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'select') {
    return `<YSelect v-model="packageName" label="Package" :options="packageOptions"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'treeSelect') {
    return `<YTreeSelect v-model="treeSelectValue" label="Component" :nodes="treeNodes" :default-expanded-keys="['core', 'form']" filterable clearable${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'inputNumber') {
    return `<YInputNumber v-model="quantity" label="Quantity" :min="0" :max="20" :step="1"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'slider') {
    return `<YSlider v-model="volume" label="Volume" :step="5" show-tooltip${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'rate') {
    return `<YRate v-model="rating" label="Satisfaction" allow-half :texts="rateTexts"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'checkbox') {
    return `<YCheckbox v-model="confirmed" label="Enable docs checks" description="Keep examples, API and a11y evidence aligned."${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'radioGroup') {
    return `<YRadioGroup v-model="packageType" label="Package type" :options="radioOptions"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'switch') {
    return `<YSwitch v-model="enabled" label="Enable fresh cute mode"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'checkTag') {
    return `<YCheckTag v-model:checked="checked" tone="${tone.value}"${disabled.value ? ' disabled' : ''}>Selectable</YCheckTag>`
  }

  if (activeComponent.value === 'datePicker') {
    return `<YDatePicker v-model="releaseDate" label="Release date"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'dateRangePicker') {
    return `<YDateRangePicker v-model="sprintRange" label="Sprint range"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'dateTimePicker') {
    return `<YDateTimePicker v-model="releaseAt" label="Release at" :minute-step="15"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'timePicker') {
    return `<YTimePicker v-model="reviewTime" label="Review time" :minute-step="15"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'timeSelect') {
    return `<YTimeSelect v-model="startTime" label="Start time" start="08:30" end="18:30" step="00:15"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'cascader') {
    return `<YCascader v-model="componentPath" label="Component path" :options="cascaderOptions"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'colorPicker') {
    return `<YColorPicker v-model="accentColor" label="Accent color"${disabled.value ? ' disabled' : ''} show-text />`
  }

  if (activeComponent.value === 'colorPickerPanel') {
    return `<YColorPickerPanel v-model="themeColor" label="Theme color"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'carousel') {
    return '<YCarousel :items="carouselItems" autoplay :interval="2400" indicator-position="outside" aria-label="Yok UI maturity carousel" />'
  }

  if (activeComponent.value === 'table') {
    return '<YTable caption="Component release queue" summary="3 rows · sortable status review" :columns="tableColumns" :data="tableRows" striped selectable />'
  }

  if (activeComponent.value === 'dataTable') {
    return '<YDataTable title="Component release queue" description="Admin table with selection, density and pagination." :columns="adminTableColumns" :data="adminTableRows" selectable pagination sticky-bulk-actions show-density-settings show-column-settings />'
  }

  if (activeComponent.value === 'dataView') {
    return '<YDataView title="Component review workspace" description="Saved views and table preferences stay together." saved-views-title="Saved table views" table-title="Component queue" :views="dataViewViews" :columns="dataViewColumns" :data="dataViewRows" default-view="beta" pagination :page-size="3" selectable show-filter-summary show-density-settings show-column-settings reorderable-columns resizable />'
  }

  if (activeComponent.value === 'resourcePage') {
    return [
      '<YResourcePage',
      '  title="Component resources"',
      '  description="Search, review and maintain component records."',
      '  eyebrow="Admin"',
      '  status="Live"',
      '  search-title="Resource filters"',
      '  search-description="Search model, saved views and table preferences stay aligned."',
      '  :search-model="resourceSearchModel"',
      '  :search-fields="resourceSearchFields"',
      '  saved-views-title="Saved table views"',
      '  table-title="Component queue"',
      '  :views="resourceViews"',
      '  :columns="resourceColumns"',
      '  :data="resourceRows"',
      '  default-view="beta"',
      '  pagination',
      '  :page-size="3"',
      '  selectable',
      '  show-filter-summary',
      '  show-density-settings',
      '  show-column-settings',
      '  reorderable-columns',
      '>',
      '  <template #actions>',
      '    <YButton variant="primary">Create component</YButton>',
      '  </template>',
      '  <template #toolbar>',
      '    <YButton variant="secondary">Export CSV</YButton>',
      '  </template>',
      '</YResourcePage>'
    ].join('\n')
  }

  if (activeComponent.value === 'crudLayout') {
    return [
      '<YCrudLayout',
      '  title="Component operations"',
      '  eyebrow="Admin"',
      '  status="Live"',
      '  description="Search, review and maintain component records in one stable CRUD shell."',
      '  density="compact"',
      '>',
      '  <template #actions>',
      '    <YButton variant="primary">Create component</YButton>',
      '  </template>',
      '  <template #search>',
      '    <YSearchForm',
      '      title="Quick filters"',
      '      description="Filter records before reviewing the table."',
      '      :model-value="crudSearchModel"',
      '      :fields="crudSearchFields"',
      '      submit-text="Apply filters"',
      '      reset-text="Reset filters"',
      '      :collapsed-count="3"',
      '    />',
      '  </template>',
      '  <template #toolbar>',
      '    <YButton variant="secondary">Export CSV</YButton>',
      '    <YButton variant="ghost">Save view</YButton>',
      '  </template>',
      '  <template #table>',
      '    <YDataTable',
      '      title="Component queue"',
      '      description="Rows, density and column preferences stay inside the CRUD layout."',
      '      :columns="crudTableColumns"',
      '      :data="crudTableRows"',
      '      selectable',
      '      pagination',
      '      :page-size="3"',
      '      show-density-settings',
      '      show-column-settings',
      '    />',
      '  </template>',
      '  <template #aside>',
      '    <section aria-label="Release summary">Release summary: 4 components tracked.</section>',
      '  </template>',
      '</YCrudLayout>'
    ].join('\n')
  }

  if (activeComponent.value === 'approvalCommentBox') {
    return '<YApprovalCommentBox v-model="approvalComment" v-model:decision="approvalDecision" v-model:selected-suggestions="selectedApprovalSuggestions" title="Release review" reviewer="Yok" target="YDataTable" :suggestions="approvalSuggestions" :attachments="approvalAttachments" :max-length="160" />'
  }

  if (activeComponent.value === 'bulkActionBar') {
    return '<YBulkActionBar title="3 components selected" clear-text="Clear selection" :selected-row-keys="bulkSelectedRowKeys" :actions="bulkActions" />'
  }

  if (activeComponent.value === 'bulkActionMenu') {
    return '<YBulkActionMenu label="More batch actions" clear-text="Clear selection" :selected-row-keys="bulkSelectedRowKeys" :actions="bulkMenuActions" />'
  }

  if (activeComponent.value === 'dataToolbar') {
    return [
      '<YDataToolbar',
      '  title="Component queue"',
      '  description="Shared toolbar for data-heavy admin surfaces."',
      '  :count="dataToolbarCount"',
      '>',
      '  <YButton variant="primary">Create component</YButton>',
      '  <YButton variant="secondary">Export CSV</YButton>',
      '</YDataToolbar>'
    ].join('\n')
  }

  if (activeComponent.value === 'savedViews') {
    return '<YSavedViews title="Component views" description="Pinned filters for repeated documentation work." :model-value="savedViewModel" :items="savedViewItems" save-text="Save current" manage-text="Manage views" />'
  }

  if (activeComponent.value === 'savedViewManager') {
    return '<YSavedViewManager v-model="savedViewModel" v-model:default-value="savedViewDefault" v-model:items="savedViewManagerItems" title="Manage component views" description="Rename, pin, duplicate, delete and choose the default table view." />'
  }

  if (activeComponent.value === 'searchPanel') {
    return '<YSearchPanel :model-value="searchPanelModel" :fields="searchPanelFields" submit-text="Apply filters" reset-text="Clear filters" />'
  }

  if (activeComponent.value === 'filterTabs') {
    return '<YFilterTabs :model-value="filterTabValue" :items="filterTabItems" aria-label="Component status filters" />'
  }

  if (activeComponent.value === 'statusTimeline') {
    return '<YStatusTimeline :items="statusTimelineItems" active-value="reviewing" aria-label="Release status timeline" />'
  }

  if (activeComponent.value === 'reviewWorkflow') {
    return '<YReviewWorkflow :items="reviewWorkflowSteps" active-value="reviewing" title="Live example review" description="Approve or request changes before marking a component documented." reviewer="Maintainer" due-text="Due today" />'
  }

  if (activeComponent.value === 'fieldArray') {
    return '<YFieldArray :model-value="fieldArrayItems" :default-item="fieldArrayDefaultItem" title="Reviewers" description="People who need to approve this component." item-key="id" add-text="Add reviewer" remove-text="Remove reviewer" item-label="Reviewer" :max="4" />'
  }

  if (activeComponent.value === 'schemaForm') {
    return '<YSchemaForm v-model="schemaFormModel" title="Component profile" description="Configure component metadata from a schema." :schema="schemaFormSchema" submit-text="Save profile" reset-text="Reset profile" />'
  }

  if (activeComponent.value === 'searchForm') {
    return '<YSearchForm v-model="searchFormModel" title="Component search" description="Collapse long filter groups while keeping active filters visible." :fields="searchFormFields" submit-text="Apply filters" reset-text="Reset filters" :collapsed-count="3" />'
  }

  if (activeComponent.value === 'list') {
    return '<YList title="Release checklist" description="Track the work needed before publishing." :items="releaseTasks" bordered />'
  }

  if (activeComponent.value === 'layout') {
    return [
      '<YLayout full-height aria-label="Playground page shell">',
      '  <YHeader height="56px" bordered>Yok UI Workspace</YHeader>',
      '  <YLayout direction="horizontal">',
      '    <YAside width="188px" bordered aria-label="Primary navigation">',
      '      <YMenu :items="menuItems" model-value="components" />',
      '    </YAside>',
      '    <YMain>Component workspace</YMain>',
      '  </YLayout>',
      '  <YFooter bordered>Docs and Playground stay linked.</YFooter>',
      '</YLayout>'
    ].join('\n')
  }

  if (activeComponent.value === 'statistic') {
    return `<YStatistic title="Stable components" :value="releaseScore" suffix="%" tone="${tone.value}" />`
  }

  if (activeComponent.value === 'descriptions') {
    return '<YDescriptions title="Component profile" description="Structured details for docs and package review." :items="componentDetails" bordered :column="2" />'
  }

  if (activeComponent.value === 'tabs') {
    return `<YTabs v-model="activeTab" :tabs="tabItems" variant="card" activation-mode="manual" aria-label="Documentation sections"><template #default="{ active }">{{ active }}</template></YTabs>`
  }

  if (activeComponent.value === 'steps') {
    return `<YSteps :items="stepItems" :current="stepCurrent" selectable />`
  }

  if (activeComponent.value === 'tour') {
    return [
      '<div class="playground-workbench__tour-targets">',
      '  <YButton id="playground-tour-search" variant="secondary">Search docs</YButton>',
      '  <YButton id="playground-tour-edit" variant="primary">Open Playground</YButton>',
      '  <YButton id="playground-tour-ship" variant="secondary">Ship evidence</YButton>',
      '</div>',
      '<YTour v-model:open="tourOpen" :steps="tourSteps" :current="tourCurrent" skip-text="Skip guide" />'
    ].join('\n')
  }

  if (activeComponent.value === 'collapse') {
    return `<YCollapse v-model="openPanels" :items="collapseItems" accordion />`
  }

  if (activeComponent.value === 'tooltip') {
    return '<YTooltip :content="tooltipContent" placement="top" open><YButton variant="secondary">Hover for guidance</YButton></YTooltip>'
  }

  if (activeComponent.value === 'popover') {
    return '<YPopover :title="popoverTitle" :content="popoverContent" placement="bottom" open><YButton variant="secondary">Open guidance</YButton></YPopover>'
  }

  if (activeComponent.value === 'dropdown') {
    return '<YDropdown label="Actions" :items="dropdownItems" align="end" open />'
  }

  if (activeComponent.value === 'popconfirm') {
    return '<YPopconfirm open :title="popconfirmTitle" :description="popconfirmDescription" confirm-text="Delete" cancel-text="Keep"><YButton variant="secondary">Delete draft</YButton></YPopconfirm>'
  }

  if (activeComponent.value === 'modal') {
    return '<YModal :open="modalOpen" title="Publish component" description="Review the release note before publishing."><p>Modal content should stay focused and easy to dismiss.</p></YModal>'
  }

  if (activeComponent.value === 'drawer') {
    return '<YDrawer :open="drawerOpen" title="Component settings" description="Use drawers for secondary configuration." placement="right"><p>Drawer content can hold forms, filters, or contextual details.</p></YDrawer>'
  }

  if (activeComponent.value === 'pagination') {
    return '<YPagination v-model:page="paginationPage" :page-size="paginationPageSize" :total="paginationTotal" aria-label="Component release pages" />'
  }

  if (activeComponent.value === 'timeline') {
    return '<YTimeline title="Release timeline" description="Track documentation readiness before publishing." :items="timelineItems" placement="right" />'
  }

  if (activeComponent.value === 'card') {
    return [
      '<YCard :title="cardTitle" :description="cardDescription" interactive>',
      '  <p>Use cards for compact summaries with a clear next action.</p>',
      '  <template #footer>',
      '    <YButton variant="secondary">Review docs</YButton>',
      '  </template>',
      '</YCard>'
    ].join('\n')
  }

  if (activeComponent.value === 'empty') {
    return '<YEmpty :title="emptyTitle" :description="emptyDescription"><YButton variant="primary">Create component</YButton></YEmpty>'
  }

  if (activeComponent.value === 'skeleton') {
    return '<YSkeleton :rows="skeletonRows" label="Loading component details" />'
  }

  if (activeComponent.value === 'loading') {
    return [
      '<YLoading :loading="loading" overlay text="Refreshing component list">',
      '  <div class="demo-panel">',
      '    <strong>Component release queue</strong>',
      '    <span>Rows stay mounted while the request runs.</span>',
      '  </div>',
      '</YLoading>'
    ].join('\n')
  }

  if (activeComponent.value === 'message') {
    return '<YMessage tone="success" :title="messageTitle" closable>{{ messageContent }}</YMessage>'
  }

  if (activeComponent.value === 'messageBox') {
    return '<YMessageBox open variant="confirm" tone="warning" :title="messageBoxTitle" :message="messageBoxContent" confirm-text="Publish" cancel-text="Review" />'
  }

  if (activeComponent.value === 'qrCode') {
    return '<YQRCode :value="qrCodeValue" :label="qrCodeLabel" level="H" :size="168" foreground="#087f6d" downloadable download-name="yok-ui-qr-code.svg">Yok UI QRCode</YQRCode>'
  }

  if (activeComponent.value === 'floatButton') {
    return '<YFloatButtonGroup label="Quick actions" :items="floatButtonActions" :open="true" shape="square" icon="⋯" />'
  }

  if (activeComponent.value === 'notification') {
    return '<YNotification tone="success" :title="notificationTitle" closable>{{ notificationContent }}</YNotification>'
  }

  if (activeComponent.value === 'result') {
    return '<YResult status="success" :title="resultTitle" :subtitle="resultSubtitle"><YButton variant="primary">View docs</YButton></YResult>'
  }

  if (activeComponent.value === 'textarea') {
    return `<YTextarea v-model="releaseNote" label="Release note" helper="Use textarea for notes and long-form input." :rows="4"${disabled.value ? ' disabled' : ''} />`
  }

  if (activeComponent.value === 'form') {
    return [
      '<YForm :model="formModel" :rules="formRules" label-width="120px" scroll-to-error>',
      '  <YFormItem prop="name" label="Component name" required>',
      '    <YInput v-model="formModel.name" placeholder="Button" />',
      '  </YFormItem>',
      '  <YFormItem prop="package" label="Package" required>',
      '    <YSelect v-model="formModel.package" :options="selectOptions" />',
      '  </YFormItem>',
      '  <YButton variant="primary" type="submit">Save profile</YButton>',
      '</YForm>'
    ].join('\n')
  }

  if (activeComponent.value === 'formItem') {
    return [
      '<YFormItem prop="name" label="Component name" hint="Use PascalCase for component exports." required>',
      '  <template #default="{ labelFor, messageId, invalid }">',
      '    <YInput',
      '      :id="labelFor"',
      '      v-model="formItemValue"',
      '      placeholder="YokInput"',
      '      :invalid="invalid"',
      '      :aria-describedby="messageId"',
      '    />',
      '  </template>',
      '</YFormItem>'
    ].join('\n')
  }

  if (activeComponent.value === 'formSummary') {
    return '<YFormSummary title="Review before publishing" :errors="formSummaryErrors" />'
  }

  if (activeComponent.value === 'divider') {
    return '<YDivider :label="dividerLabel" align="start" />'
  }

  if (activeComponent.value === 'link') {
    return '<YLink :href="linkHref" tone="primary">Browse component overview</YLink>'
  }

  if (activeComponent.value === 'text') {
    return '<YText tag="p" tone="secondary" :line-clamp="2">{{ textContent }}</YText>'
  }

  if (activeComponent.value === 'upload') {
    return '<YUpload v-model="uploadFiles" label="Upload evidence" description="Attach screenshots or audit notes before release." drag multiple />'
  }

  if (activeComponent.value === 'icon') {
    return [
      '<YIcon :label="iconLabel" color="#0f8a72" size="lg">',
      '  <svg viewBox="0 0 24 24" aria-hidden="true">',
      '    <path d="M12 3l7 4v5c0 4.2-2.8 7.9-7 9-4.2-1.1-7-4.8-7-9V7l7-4z" fill="currentColor" />',
      '  </svg>',
      '</YIcon>'
    ].join('\n')
  }

  if (activeComponent.value === 'configProvider') {
    return [
      '<YConfigProvider size="lg" density="compact" :locale="configProviderLocale">',
      '  <YInput label="Library name" model-value="Yok UI" />',
      '  <YButton variant="primary">Create component</YButton>',
      '</YConfigProvider>'
    ].join('\n')
  }

  if (activeComponent.value === 'transfer') {
    return '<YTransfer v-model="transferValue" :options="transferOptions" :titles="[\'Available\', \'Selected\']" filterable />'
  }

  if (activeComponent.value === 'virtualList') {
    return [
      '<YVirtualList :items="virtualListItems" :height="260" :item-height="56" aria-label="Component review queue">',
      '  <template #item="{ item, index }">',
      '    <span>{{ index + 1 }}. {{ item.label }} · {{ item.description }}</span>',
      '  </template>',
      '</YVirtualList>'
    ].join('\n')
  }

  if (activeComponent.value === 'tree') {
    return '<YTree v-model:selected-key="treeSelectedKey" v-model:expanded-keys="treeExpandedKeys" v-model:checked-keys="treeCheckedKeys" :nodes="treeNodes" checkable aria-label="Component taxonomy" />'
  }

  if (activeComponent.value === 'watermark') {
    return [
      '<YWatermark :content="watermarkContent" :gap="132" :font-size="16">',
      '  <YCard title="Private preview" description="Watermark protects draft documentation screenshots." />',
      '</YWatermark>'
    ].join('\n')
  }

  if (activeComponent.value === 'breadcrumb') {
    return '<YBreadcrumb :items="breadcrumbItems" separator="/" aria-label="Component route breadcrumb" />'
  }

  if (activeComponent.value === 'menu') {
    return '<YMenu :items="menuItems" model-value="menu" :default-open-keys="[\'components\']" aria-label="Playground navigation" />'
  }

  if (activeComponent.value === 'backtop') {
    return '<YBacktop :visibility-height="backtopVisibilityHeight" :right="32" :bottom="32" />'
  }

  if (activeComponent.value === 'affix') {
    return [
      '<YAffix :offset="affixOffset" aria-label="Playground sticky toolbar">',
      '  <div class="playground-workbench__inline-actions">',
      '    <YButton variant="primary" size="sm">Publish docs</YButton>',
      '    <YTag tone="info">Sticky toolbar</YTag>',
      '  </div>',
      '</YAffix>'
    ].join('\n')
  }

  if (activeComponent.value === 'anchor') {
    return '<YAnchor :items="anchorItems" model-value="#api" :offset="64" aria-label="Playground sections" />'
  }

  if (activeComponent.value === 'scrollbar') {
    return [
      '<YScrollbar height="180px" aria-label="Documentation checklist">',
      '  <ul>',
      '    <li v-for="item in scrollbarItems" :key="item">{{ item }}</li>',
      '  </ul>',
      '</YScrollbar>'
    ].join('\n')
  }

  if (activeComponent.value === 'space') {
    return [
      '<YSpace wrap size="sm">',
      '  <YTag v-for="item in spaceItems" :key="item" tone="info">{{ item }}</YTag>',
      '</YSpace>'
    ].join('\n')
  }

  if (activeComponent.value === 'splitter') {
    return [
      '<YSplitter :panels="splitterPanels" height="240px" aria-label="Playground splitter">',
      '  <template #navigation>',
      '    <YTag tone="info">Navigation</YTag>',
      '  </template>',
      '  <template #preview>',
      '    <YTag tone="success">Resizable preview</YTag>',
      '  </template>',
      '</YSplitter>'
    ].join('\n')
  }

  if (activeComponent.value === 'commandPalette') {
    return '<YCommandPalette :open="commandPaletteOpen" :commands="commandPaletteCommands" />'
  }

  if (activeComponent.value === 'codeBlock') {
    return '<YCodeBlock :code="codeBlockSnippet" language="ts" />'
  }

  if (activeComponent.value === 'themeSwitcher') {
    return '<YThemeSwitcher v-model="themeSwitcherValue" />'
  }

  if (activeComponent.value === 'pageHeader') {
    return [
      '<YPageHeader :title="pageHeaderTitle" :description="pageHeaderDescription" eyebrow="Admin" status="Live">',
      '  <template #actions>',
      '    <YButton variant="primary">Create component</YButton>',
      '  </template>',
      '</YPageHeader>'
    ].join('\n')
  }

  if (activeComponent.value === 'metricCard') {
    return '<YMetricCard label="Components" :value="metricCardValue" trend="+8" tone="success" description="Mapped to live examples and Playground routes." />'
  }

  if (activeComponent.value === 'brandHero') {
    return '<YBrandHero eyebrow="Fresh cute" :title="brandHeroTitle" :description="brandHeroDescription" primary-text="Get started" secondary-text="Browse components" />'
  }

  if (activeComponent.value === 'featureGrid') {
    return '<YFeatureGrid :features="featureGridItems" />'
  }

  if (activeComponent.value === 'profileCard') {
    return '<YProfileCard name="Yok Designer" role="Component librarian" bio="Builds polished docs, examples and accessible component stories." avatar-text="Y" :tags="profileCardTags" />'
  }

  if (activeComponent.value === 'logoCloud') {
    return '<YLogoCloud title="Built with a practical Vue toolchain" :logos="logoCloudItems" />'
  }

  if (activeComponent.value === 'themeProvider') {
    return [
      '<YThemeProvider :theme="themeProviderTheme" density="comfortable">',
      '  <YCard title="Candy themed area" description="Theme tokens apply locally without changing the whole page." />',
      '</YThemeProvider>'
    ].join('\n')
  }

  if (activeComponent.value === 'avatar') {
    return [
      `<YAvatar name="Yok UI" size="${size.value}" shape="${avatarShape.value}" tone="${avatarTone.value}" />`,
      `<YAvatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop" src-set="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=192&h=192&fit=crop 2x" alt="Yok designer" fit="cover" size="${size.value}" shape="${avatarShape.value}" />`,
      `<YAvatar label="Brand symbol" shape="${avatarShape.value}" tone="${avatarTone.value}">Y</YAvatar>`
    ].join('\n')
  }

  if (activeComponent.value === 'avatarGroup') {
    return [
      `<YAvatarGroup label="Review team" :max="3" :total="6" spacing="tight" size="${size.value}" shape="${avatarShape.value}">`,
      '  <YAvatar name="Core Team" tone="success" />',
      '  <YAvatar name="Product Owner" tone="primary" />',
      '  <YAvatar name="Design Review" tone="warning" />',
      '</YAvatarGroup>'
    ].join('\n')
  }

  if (activeComponent.value === 'tag') {
    return `<YTag tone="${tone.value}">Fresh cute</YTag>`
  }

  if (activeComponent.value === 'badge') {
    return [
      '<YBadge :value="badgeValue" :max="99" tone="primary" size="lg" :offset="[8, -4]" label="Inbox unread messages">',
      '  <YButton variant="secondary">Inbox</YButton>',
      '</YBadge>',
      '<YBadge dot text="Online" tone="success" size="lg" label="Online status" />'
    ].join('\n')
  }

  if (activeComponent.value === 'alert') {
    return [
      `<YAlert tone="${tone.value}" variant="outline" size="md" title="Playground ready"${disabled.value ? '' : ' closable close-text="Got it"'} close-label="Dismiss playground alert">`,
      '  Use this pattern as a docs demo seed.',
      '  <template #action>',
      '    <YButton size="sm" variant="ghost">Open docs</YButton>',
      '  </template>',
      '</YAlert>'
    ].join('\n')
  }

  return `<YProgress :value="${progressValue.value}" tone="${tone.value === 'info' ? 'primary' : tone.value}" label="Build progress" striped />`
})

const generatedScript = computed(() => {
  if (activeComponent.value === 'image') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst imageSrc = '${imageSrc}'`
  }

  if (activeComponent.value === 'segmented') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst viewMode = ref('${segmentedValue.value}')\nconst segmentedOptions = ${JSON.stringify(segmentedOptions, null, 2)}`
  }

  if (activeComponent.value === 'calendar') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst selectedDate = ref('${calendarValue.value}')`
  }

  if (activeComponent.value === 'input') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst value = ref('Yok UI')`
  }

  if (activeComponent.value === 'inputOtp') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst code = ref('${inputOtpValue.value}')`
  }

  if (activeComponent.value === 'inputTag') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst tags = ref(${JSON.stringify(inputTagValue.value, null, 2)})`
  }

  if (activeComponent.value === 'autocomplete') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst componentName = ref('auto')\nconst autocompleteOptions = ${JSON.stringify(autocompleteOptions, null, 2)}`
  }

  if (activeComponent.value === 'mention') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst releaseNote = ref('Please review @ad')\nconst mentionOptions = ${JSON.stringify(mentionOptions, null, 2)}`
  }

  if (activeComponent.value === 'select') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst packageName = ref('core')\nconst packageOptions = ${JSON.stringify(selectOptions, null, 2)}`
  }

  if (activeComponent.value === 'inputNumber') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst quantity = ref(6)`
  }

  if (activeComponent.value === 'slider') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst volume = ref(64)`
  }

  if (activeComponent.value === 'rate') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst rating = ref(4)\nconst rateTexts = ${JSON.stringify(rateTexts, null, 2)}`
  }

  if (activeComponent.value === 'checkbox') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst confirmed = ref(true)`
  }

  if (activeComponent.value === 'radioGroup') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst packageType = ref('core')\nconst radioOptions = ${JSON.stringify(radioOptions, null, 2)}`
  }

  if (activeComponent.value === 'switch') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst enabled = ref(true)`
  }

  if (activeComponent.value === 'checkTag') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst checked = ref(${checkTagChecked.value})`
  }

  if (activeComponent.value === 'datePicker') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst releaseDate = ref('2026-06-13')`
  }

  if (activeComponent.value === 'dateRangePicker') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst sprintRange = ref(['2026-06-13', '2026-06-20'])`
  }

  if (activeComponent.value === 'dateTimePicker') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst releaseAt = ref('2026-07-04 20:30')`
  }

  if (activeComponent.value === 'timePicker') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst reviewTime = ref('09:30')`
  }

  if (activeComponent.value === 'timeSelect') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst startTime = ref('09:00')`
  }

  if (activeComponent.value === 'cascader') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst componentPath = ref(['core', 'form', 'cascader'])\nconst cascaderOptions = ${JSON.stringify(cascaderOptions, null, 2)}`
  }

  if (activeComponent.value === 'colorPicker') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst accentColor = ref('#14B8A6')`
  }

  if (activeComponent.value === 'colorPickerPanel') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst themeColor = ref('#14B8A6')`
  }

  if (activeComponent.value === 'carousel') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst carouselItems = ${JSON.stringify(carouselItems, null, 2)}`
  }

  if (activeComponent.value === 'table') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst tableColumns = ${JSON.stringify(tableColumns, null, 2)}\nconst tableRows = ${JSON.stringify(tableRows, null, 2)}`
  }

  if (activeComponent.value === 'dataTable') {
    return `import { ${componentImports.value} } from '@yok-ui/admin'\n\nconst adminTableColumns = ${JSON.stringify(adminTableColumns, null, 2)}\nconst adminTableRows = ${JSON.stringify(adminTableRows, null, 2)}`
  }

  if (activeComponent.value === 'dataView') {
    return `import { ${componentImports.value} } from '@yok-ui/admin'\n\nconst dataViewViews = ${JSON.stringify(dataViewViews, null, 2)}\nconst dataViewColumns = ${JSON.stringify(dataViewColumns, null, 2)}\nconst dataViewRows = ${JSON.stringify(dataViewRows, null, 2)}`
  }

  if (activeComponent.value === 'resourcePage') {
    return `import { ref } from 'vue'\nimport { YButton } from '@yok-ui/core'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst resourceSearchModel = ref(${JSON.stringify(defaultResourceSearchModel, null, 2)})\nconst resourceSearchFields = ${JSON.stringify(resourceSearchFields, null, 2)}\nconst resourceViews = ${JSON.stringify(resourceViews, null, 2)}\nconst resourceColumns = ${JSON.stringify(resourceColumns, null, 2)}\nconst resourceRows = ${JSON.stringify(resourceRows, null, 2)}`
  }

  if (activeComponent.value === 'crudLayout') {
    return `import { ref } from 'vue'\nimport { YButton } from '@yok-ui/core'\nimport { YCrudLayout, YDataTable, YSearchForm } from '@yok-ui/admin'\n\nconst crudSearchModel = ref(${JSON.stringify(defaultCrudSearchModel, null, 2)})\nconst crudSearchFields = ${JSON.stringify(crudSearchFields, null, 2)}\nconst crudTableColumns = ${JSON.stringify(crudTableColumns, null, 2)}\nconst crudTableRows = ${JSON.stringify(crudTableRows, null, 2)}`
  }

  if (activeComponent.value === 'approvalCommentBox') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst approvalComment = ref('${defaultApprovalComment}')\nconst approvalDecision = ref('${defaultApprovalDecision}')\nconst selectedApprovalSuggestions = ref(${JSON.stringify(defaultApprovalSuggestions, null, 2)})\nconst approvalSuggestions = ${JSON.stringify(approvalSuggestions, null, 2)}\nconst approvalAttachments = ${JSON.stringify(approvalAttachments, null, 2)}`
  }

  if (activeComponent.value === 'bulkActionBar') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst bulkSelectedRowKeys = ref(${JSON.stringify(defaultBulkSelectedRowKeys, null, 2)})\nconst bulkActions = ${JSON.stringify(bulkActions, null, 2)}`
  }

  if (activeComponent.value === 'bulkActionMenu') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst bulkSelectedRowKeys = ref(${JSON.stringify(defaultBulkSelectedRowKeys, null, 2)})\nconst bulkMenuActions = ${JSON.stringify(bulkMenuActions, null, 2)}`
  }

  if (activeComponent.value === 'dataToolbar') {
    return `import { YButton } from '@yok-ui/core'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst dataToolbarCount = ${dataToolbarCount}`
  }

  if (activeComponent.value === 'savedViews') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst savedViewModel = ref('${defaultSavedViewModel}')\nconst savedViewItems = ${JSON.stringify(savedViewItems, null, 2)}`
  }

  if (activeComponent.value === 'savedViewManager') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst savedViewModel = ref('${defaultSavedViewModel}')\nconst savedViewDefault = ref('${defaultSavedViewDefault}')\nconst savedViewManagerItems = ref(${JSON.stringify(savedViewItems, null, 2)})`
  }

  if (activeComponent.value === 'searchPanel') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst searchPanelModel = ref(${JSON.stringify(defaultSearchPanelModel, null, 2)})\nconst searchPanelFields = ${JSON.stringify(searchPanelFields, null, 2)}`
  }

  if (activeComponent.value === 'filterTabs') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst filterTabValue = ref('${defaultFilterTabValue}')\nconst filterTabItems = ${JSON.stringify(filterTabItems, null, 2)}`
  }

  if (activeComponent.value === 'statusTimeline') {
    return `import { ${componentImports.value} } from '@yok-ui/admin'\n\nconst statusTimelineItems = ${JSON.stringify(statusTimelineItems, null, 2)}`
  }

  if (activeComponent.value === 'reviewWorkflow') {
    return `import { ${componentImports.value} } from '@yok-ui/admin'\n\nconst reviewWorkflowSteps = ${JSON.stringify(reviewWorkflowSteps, null, 2)}`
  }

  if (activeComponent.value === 'fieldArray') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst fieldArrayItems = ref(${JSON.stringify(defaultFieldArrayItems, null, 2)})\nconst fieldArrayDefaultItem = ${JSON.stringify(fieldArrayDefaultItem, null, 2)}`
  }

  if (activeComponent.value === 'schemaForm') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst schemaFormModel = ref(${JSON.stringify(defaultSchemaFormModel, null, 2)})\nconst schemaFormSchema = ${JSON.stringify(schemaFormSchema, null, 2)}`
  }

  if (activeComponent.value === 'searchForm') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst searchFormModel = ref(${JSON.stringify(defaultSearchFormModel, null, 2)})\nconst searchFormFields = ${JSON.stringify(searchFormFields, null, 2)}`
  }

  if (activeComponent.value === 'list') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst releaseTasks = ${JSON.stringify(releaseTasks, null, 2)}`
  }

  if (activeComponent.value === 'layout') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst menuItems = ${JSON.stringify(menuItems, null, 2)}`
  }

  if (activeComponent.value === 'statistic') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst releaseScore = 73`
  }

  if (activeComponent.value === 'descriptions') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst componentDetails = ${JSON.stringify(componentDetails, null, 2)}`
  }

  if (activeComponent.value === 'tabs') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst activeTab = ref('usage')\nconst tabItems = ${JSON.stringify(tabItems, null, 2)}`
  }

  if (activeComponent.value === 'steps') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst stepCurrent = ref(1)\nconst stepItems = ${JSON.stringify(stepItems, null, 2)}`
  }

  if (activeComponent.value === 'tour') {
    return `import { ref } from 'vue'\nimport { YButton, ${componentImports.value} } from '@yok-ui/core'\n\nconst tourOpen = ref(${tourOpen.value})\nconst tourCurrent = ref(${tourCurrent.value})\nconst tourSteps = ${JSON.stringify(tourSteps, null, 2)}`
  }

  if (activeComponent.value === 'collapse') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst openPanels = ref(['usage'])\nconst collapseItems = ${JSON.stringify(collapseItems, null, 2)}`
  }

  if (activeComponent.value === 'tooltip') {
    return `import { YButton, ${componentImports.value} } from '@yok-ui/core'\n\nconst tooltipContent = '${tooltipContent}'`
  }

  if (activeComponent.value === 'popover') {
    return `import { YButton, ${componentImports.value} } from '@yok-ui/core'\n\nconst popoverTitle = '${popoverTitle}'\nconst popoverContent = '${popoverContent}'`
  }

  if (activeComponent.value === 'dropdown') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst dropdownItems = ${JSON.stringify(dropdownItems, null, 2)}`
  }

  if (activeComponent.value === 'popconfirm') {
    return `import { YButton, ${componentImports.value} } from '@yok-ui/core'\n\nconst popconfirmTitle = '${popconfirmTitle}'\nconst popconfirmDescription = '${popconfirmDescription}'`
  }

  if (activeComponent.value === 'modal') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst modalOpen = ref(true)`
  }

  if (activeComponent.value === 'drawer') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst drawerOpen = ref(true)`
  }

  if (activeComponent.value === 'pagination') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst paginationPage = ref(${paginationPage.value})\nconst paginationPageSize = ${paginationPageSize}\nconst paginationTotal = ${paginationTotal}`
  }

  if (activeComponent.value === 'timeline') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst timelineItems = ${JSON.stringify(timelineItems, null, 2)}`
  }

  if (activeComponent.value === 'card') {
    return `import { YButton, ${componentImports.value} } from '@yok-ui/core'\n\nconst cardTitle = '${cardTitle}'\nconst cardDescription = '${cardDescription}'`
  }

  if (activeComponent.value === 'empty') {
    return `import { YButton, ${componentImports.value} } from '@yok-ui/core'\n\nconst emptyTitle = '${emptyTitle}'\nconst emptyDescription = '${emptyDescription}'`
  }

  if (activeComponent.value === 'skeleton') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst skeletonRows = ${skeletonRows}`
  }

  if (activeComponent.value === 'loading') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst loading = ref(${loading.value})`
  }

  if (activeComponent.value === 'message') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst messageTitle = '${messageTitle}'\nconst messageContent = '${messageContent}'`
  }

  if (activeComponent.value === 'messageBox') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst messageBoxTitle = '${messageBoxTitle}'\nconst messageBoxContent = '${messageBoxContent}'`
  }

  if (activeComponent.value === 'qrCode') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst qrCodeValue = '${qrCodeValue}'\nconst qrCodeLabel = '${qrCodeLabel}'`
  }

  if (activeComponent.value === 'floatButton') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst floatButtonActions = ${JSON.stringify(floatButtonActions, null, 2)}`
  }

  if (activeComponent.value === 'notification') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst notificationTitle = '${notificationTitle}'\nconst notificationContent = '${notificationContent}'`
  }

  if (activeComponent.value === 'result') {
    return `import { YButton, ${componentImports.value} } from '@yok-ui/core'\n\nconst resultTitle = '${resultTitle}'\nconst resultSubtitle = '${resultSubtitle}'`
  }

  if (activeComponent.value === 'textarea') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst releaseNote = ref('${textareaValue.value}')`
  }

  if (activeComponent.value === 'form') {
    return `import { ref } from 'vue'\nimport { YButton, YForm, YFormItem, YInput, YSelect } from '@yok-ui/core'\n\nconst formModel = ref(${JSON.stringify(formModel.value, null, 2)})\nconst formRules = ${JSON.stringify(formRules, null, 2)}\nconst selectOptions = ${JSON.stringify(selectOptions, null, 2)}`
  }

  if (activeComponent.value === 'formItem') {
    return `import { ref } from 'vue'\nimport { YFormItem, YInput } from '@yok-ui/core'\n\nconst formItemValue = ref('${formItemValue.value}')`
  }

  if (activeComponent.value === 'formSummary') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst formSummaryErrors = ${JSON.stringify(formSummaryErrors, null, 2)}`
  }

  if (activeComponent.value === 'divider') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst dividerLabel = '${dividerLabel}'`
  }

  if (activeComponent.value === 'link') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst linkHref = '${linkHref}'`
  }

  if (activeComponent.value === 'text') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst textContent = '${textContent}'`
  }

  if (activeComponent.value === 'upload') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst uploadFiles = ref(${JSON.stringify(uploadFiles.value, null, 2)})`
  }

  if (activeComponent.value === 'icon') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst iconLabel = '${iconLabel}'`
  }

  if (activeComponent.value === 'configProvider') {
    return `import { YButton, YConfigProvider, YInput } from '@yok-ui/core'\n\nconst configProviderLocale = '${configProviderLocale}'`
  }

  if (activeComponent.value === 'transfer') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst transferValue = ref(${JSON.stringify(transferValue.value, null, 2)})\nconst transferOptions = ${JSON.stringify(transferOptions, null, 2)}`
  }

  if (activeComponent.value === 'virtualList') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst virtualListItems = ${JSON.stringify(virtualListItems, null, 2)}`
  }

  if (activeComponent.value === 'tree') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst treeSelectedKey = ref('${treeSelectedKey.value}')\nconst treeExpandedKeys = ref(${JSON.stringify(treeExpandedKeys.value, null, 2)})\nconst treeCheckedKeys = ref(${JSON.stringify(treeCheckedKeys.value, null, 2)})\nconst treeNodes = ${JSON.stringify(treeNodes, null, 2)}`
  }

  if (activeComponent.value === 'treeSelect') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/core'\n\nconst treeSelectValue = ref('${treeSelectValue.value}')\nconst treeNodes = ${JSON.stringify(treeNodes, null, 2)}`
  }

  if (activeComponent.value === 'watermark') {
    return `import { YCard, ${componentImports.value} } from '@yok-ui/core'\n\nconst watermarkContent = '${watermarkContent}'`
  }

  if (activeComponent.value === 'breadcrumb') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst breadcrumbItems = ${JSON.stringify(breadcrumbItems, null, 2)}`
  }

  if (activeComponent.value === 'menu') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst menuItems = ${JSON.stringify(menuItems, null, 2)}`
  }

  if (activeComponent.value === 'backtop') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst backtopVisibilityHeight = ${backtopVisibilityHeight}`
  }

  if (activeComponent.value === 'affix') {
    return `import { YButton, YTag, ${componentImports.value} } from '@yok-ui/core'\n\nconst affixOffset = ${affixOffset}`
  }

  if (activeComponent.value === 'anchor') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst anchorItems = ${JSON.stringify(anchorItems, null, 2)}`
  }

  if (activeComponent.value === 'scrollbar') {
    return `import { ${componentImports.value} } from '@yok-ui/core'\n\nconst scrollbarItems = ${JSON.stringify(scrollbarItems, null, 2)}`
  }

  if (activeComponent.value === 'space') {
    return `import { YTag, ${componentImports.value} } from '@yok-ui/core'\n\nconst spaceItems = ${JSON.stringify(spaceItems, null, 2)}`
  }

  if (activeComponent.value === 'splitter') {
    return `import { YTag, ${componentImports.value} } from '@yok-ui/core'\n\nconst splitterPanels = ${JSON.stringify(splitterPanels, null, 2)}`
  }

  if (activeComponent.value === 'commandPalette') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/product'\n\nconst commandPaletteOpen = ref(${commandPaletteOpen.value})\nconst commandPaletteCommands = ${JSON.stringify(commandPaletteCommands, null, 2)}`
  }

  if (activeComponent.value === 'codeBlock') {
    return `import { ${componentImports.value} } from '@yok-ui/product'\n\nconst codeBlockSnippet = ${JSON.stringify(codeBlockSnippet)}`
  }

  if (activeComponent.value === 'themeSwitcher') {
    return `import { ref } from 'vue'\nimport { ${componentImports.value} } from '@yok-ui/product'\n\nconst themeSwitcherValue = ref('yok-light')`
  }

  if (activeComponent.value === 'pageHeader') {
    return `import { YButton } from '@yok-ui/core'\nimport { ${componentImports.value} } from '@yok-ui/admin'\n\nconst pageHeaderTitle = '${pageHeaderTitle}'\nconst pageHeaderDescription = '${pageHeaderDescription}'`
  }

  if (activeComponent.value === 'metricCard') {
    return `import { ${componentImports.value} } from '@yok-ui/admin'\n\nconst metricCardValue = ${metricCardValue}`
  }

  if (activeComponent.value === 'brandHero') {
    return `import { ${componentImports.value} } from '@yok-ui/brand'\n\nconst brandHeroTitle = '${brandHeroTitle}'\nconst brandHeroDescription = '${brandHeroDescription}'`
  }

  if (activeComponent.value === 'featureGrid') {
    return `import { ${componentImports.value} } from '@yok-ui/brand'\n\nconst featureGridItems = ${JSON.stringify(featureGridItems, null, 2)}`
  }

  if (activeComponent.value === 'profileCard') {
    return `import { ${componentImports.value} } from '@yok-ui/brand'\n\nconst profileCardTags = ${JSON.stringify(profileCardTags, null, 2)}`
  }

  if (activeComponent.value === 'logoCloud') {
    return `import { ${componentImports.value} } from '@yok-ui/brand'\n\nconst logoCloudItems = ${JSON.stringify(logoCloudItems, null, 2)}`
  }

  if (activeComponent.value === 'themeProvider') {
    return `import { ref } from 'vue'\nimport { YCard, ${componentImports.value} } from '@yok-ui/core'\n\nconst themeProviderTheme = ref('yok-candy')`
  }

  if (activeComponent.value === 'badge') {
    return `import { ref } from 'vue'\nimport { YButton, ${componentImports.value} } from '@yok-ui/core'\n\nconst badgeValue = ref(${badgeValue.value})`
  }

  return `import { ${componentImports.value} } from '${componentPackageName.value}'`
})

const generatedCode = computed(() => [
  '<script setup lang="ts">',
  generatedScript.value,
  '</' + 'script>',
  '',
  '<template>',
  `  ${generatedMarkup.value}`,
  '</template>'
].join('\n'))

function normalizeScriptSetupLanguage(source: string, useTypeScript: boolean) {
  return source.replace(/<script\s+setup([^>]*)>/i, (_, rawAttributes: string) => {
    const attributes = rawAttributes
      .replace(/\s+lang=(["'])(?:ts|js)\1/i, '')
      .trim()
    const remainingAttributes = attributes ? ` ${attributes}` : ''

    return useTypeScript
      ? `<script setup lang="ts"${remainingAttributes}>`
      : `<script setup${remainingAttributes}>`
  })
}

const sourceCode = computed(() =>
  importedSource.value
    ? normalizeScriptSetupLanguage(importedSource.value, true)
    : generatedCode.value
)
const generatedJavascriptCode = computed(() =>
  normalizeScriptSetupLanguage(sourceCode.value, false)
)
const isImportedSourceEditable = computed(() => Boolean(importedSource.value) && activeCodeView.value !== 'install')
const showImportedSourceEditor = computed(() => isImportedSourceEditable.value && importedSourceDisplayMode.value === 'edit')
const installCommand = computed(() => [
  `pnpm add ${componentPackageName.value} @yok-ui/themes`,
  '',
  "import '@yok-ui/themes/yok-light.css'",
  `import '${componentPackageName.value}/style.css'`,
  `import { ${componentImports.value} } from '${componentPackageName.value}'`
].join('\n'))
const displayedCode = computed(() => {
  if (activeCodeView.value === 'install') {
    return installCommand.value
  }

  if (activeCodeView.value === 'js') {
    return generatedJavascriptCode.value
  }

  return sourceCode.value
})
const currentImportedExportSource = computed(() => importedSource.value ? displayedCode.value : '')
const importedSourceStats = computed(() => ({
  characters: currentImportedExportSource.value.length,
  lines: currentImportedExportSource.value ? currentImportedExportSource.value.split('\n').length : 0
}))
const displayedCodeLanguage = computed(() => (activeCodeView.value === 'install' ? 'install' : activeCodeView.value))
const displayedCodeLines = computed(() => createCodeHighlightLines(displayedCode.value, activeCodeView.value))
const playgroundCodeLanguageOptions = computed(() =>
  playgroundCodeViews.map((view) => ({
    value: view,
    label: view === 'install' ? 'Install' : view.toUpperCase()
  }))
)
const playgroundCodeActions = computed(() => {
  const actions = []

  if (isImportedSourceEditable.value) {
    actions.push(
      {
        key: 'mode-edit',
        tooltip: '在 Playground 中编辑',
        label: '在 Playground 中编辑',
        glyph: '',
        icon: 'playground' as const,
        text: '编辑',
        pressed: importedSourceDisplayMode.value === 'edit',
        className: 'playground-workbench__code-mode-edit playground-workbench__code-mode-button',
        controls: importedSourcePanelId
      },
      {
        key: 'mode-source',
        tooltip: '查看源代码',
        label: '查看源代码',
        glyph: '',
        icon: 'code' as const,
        text: '源码',
        pressed: importedSourceDisplayMode.value === 'source',
        className: 'playground-workbench__code-mode-source playground-workbench__code-mode-button',
        controls: importedSourcePanelId
      }
    )

    actions.push({
      key: 'reset-source',
      tooltip: importedSourceChanged.value ? '恢复导入源码' : '源码未修改',
      label: importedSourceChanged.value ? '恢复导入源码' : '源码未修改',
      glyph: '',
      icon: 'reset' as const,
      text: 'Reset source',
      disabled: !importedSourceChanged.value,
      className: 'playground-workbench__reset-source'
    })
  }

  if (activeSourceFileHref.value) {
    actions.push({
      key: 'source-file',
      href: activeSourceFileHref.value,
      tooltip: '查看组件源码',
      label: '查看组件源码',
      glyph: '',
      icon: 'source' as const,
      text: 'Vue source',
      className: 'playground-workbench__source-file'
    })
  }

  actions.push(
    {
      key: 'copy-link',
      tooltip: copiedShare.value ? '已复制链接' : '复制 Playground 链接',
      label: copiedShare.value ? '已复制链接' : '复制 Playground 链接',
      glyph: '',
      icon: 'external' as const,
      text: 'Copy playground link',
      feedback: copiedShare.value,
      feedbackText: '已复制链接',
      feedbackClassName: 'playground-workbench__code-tool-feedback',
      className: 'playground-workbench__share'
    },
    {
      key: 'copy-code',
      tooltip: copied.value ? '已复制代码' : '复制代码',
      label: copied.value ? '已复制代码' : '复制代码',
      glyph: '',
      icon: 'copy' as const,
      text: 'Copy code',
      feedback: copied.value,
      feedbackText: '已复制',
      feedbackClassName: 'playground-workbench__code-tool-feedback',
      className: 'playground-workbench__copy-code'
    }
  )

  return actions
})
const importedSourceChanged = computed(() =>
  Boolean(importedSource.value && importedInitialSource.value && importedSource.value !== importedInitialSource.value)
)
const canReuseImportedHandoff = computed(() =>
  Boolean(
    importedHandoffKey.value &&
    !importedSourceChanged.value &&
    importedInitialCodeView.value === activeCodeView.value &&
    importedInitialTheme.value === theme.value
  )
)
const playgroundShareUrl = computed(() => {
  const params = new URLSearchParams()

  params.set('component', activeComponent.value)
  params.set('theme', theme.value)

  if (canReuseImportedHandoff.value) {
    params.set('handoff', importedHandoffKey.value)
  } else if (importedSource.value) {
    params.set('source', activeCodeView.value === 'install' ? importedSource.value : displayedCode.value)

    if (importedSourceOrigin.value) {
      params.set('from', importedSourceOrigin.value)
    }

    if (importedDocsHash.value) {
      params.set('docsHash', importedDocsHash.value)
    }

    if (activeCodeView.value !== 'install') {
      params.set('language', activeCodeView.value)
    }

    if (importedScenario.value) {
      params.set('scenario', importedScenario.value)
    }

    if (importedViewport.value) {
      params.set('viewport', importedViewport.value)
    }

    if (Object.keys(importedControls.value).length) {
      params.set('controls', JSON.stringify(importedControls.value))
    }

    if (importedReplay.value) {
      params.set('replay', JSON.stringify(importedReplay.value))
    }

    if (importedSourcePanel.value?.mode) {
      params.set('sourcePanelMode', importedSourcePanel.value.mode)
    }

    if (importedSourcePanel.value?.label) {
      params.set('sourcePanelLabel', importedSourcePanel.value.label)
    }

    if (importedSourcePanel.value?.language) {
      params.set('sourcePanelLanguage', importedSourcePanel.value.language)
    }

    if (importedSourcePanel.value?.installPackageManager) {
      params.set('sourcePanelInstallPackageManager', importedSourcePanel.value.installPackageManager)
    }
  } else {
    if (activeComponent.value === 'button') {
      params.set('variant', variant.value)
      params.set('size', size.value)
      params.set('loading', String(loading.value))
      params.set('disabled', String(disabled.value))
    }

    if (
      activeComponent.value === 'input' ||
      activeComponent.value === 'autocomplete' ||
      activeComponent.value === 'mention' ||
      activeComponent.value === 'select' ||
      activeComponent.value === 'inputNumber' ||
      activeComponent.value === 'slider' ||
      activeComponent.value === 'rate' ||
      activeComponent.value === 'checkbox' ||
      activeComponent.value === 'radioGroup' ||
      activeComponent.value === 'switch' ||
      activeComponent.value === 'datePicker' ||
      activeComponent.value === 'dateRangePicker' ||
      activeComponent.value === 'dateTimePicker' ||
      activeComponent.value === 'timePicker' ||
      activeComponent.value === 'timeSelect' ||
      activeComponent.value === 'cascader' ||
      activeComponent.value === 'colorPicker' ||
      activeComponent.value === 'colorPickerPanel' ||
      activeComponent.value === 'textarea'
    ) {
      params.set('disabled', String(disabled.value))
    }

    if (activeComponent.value === 'avatar' || activeComponent.value === 'avatarGroup') {
      params.set('size', size.value)
      params.set('shape', avatarShape.value)
      if (activeComponent.value === 'avatar') {
        params.set('tone', tone.value)
      }
    }

    if (activeComponent.value === 'tag' || activeComponent.value === 'alert' || activeComponent.value === 'statistic') {
      params.set('tone', tone.value)
    }

    if (activeComponent.value === 'progress') {
      params.set('tone', tone.value)
      params.set('value', String(progressValue.value))
    }
  }

  if (typeof window === 'undefined') {
    return `/playground/?${params.toString()}`
  }

  return `${window.location.origin}/playground/?${params.toString()}`
})
const importedManifest = computed(() => {
  const lines = [
    '# Yok UI Playground import manifest',
    '',
    `- Component: ${activeMeta.value.label}`,
    `- Origin: ${importedSourceOriginLabel.value}`,
    `- Docs: ${importedDocsRoute.value}`,
    `- Language: ${importedSourceLanguageLabel.value}`,
    `- Source panel: ${importedSourcePanel.value?.label ?? 'Code'}`,
    `- Theme: ${activeThemeLabel.value}`,
    `- Scenario: ${importedScenario.value || 'None'}`,
    `- Viewport: ${importedViewportLabel.value}`,
    `- Controls: ${importedControlCount.value}`,
    `- Replay events: ${importedReplayEvents.value.length}`,
    `- Replay steps: ${importedReplaySteps.value.length}`,
    `- Handoff: ${importedHandoffKey.value || 'Direct query'}`,
    `- Source: ${importedSourceStats.value.lines} lines, ${importedSourceStats.value.characters} chars`,
    `- Share: ${playgroundShareUrl.value}`,
    '',
    '## Controls',
    '```json',
    JSON.stringify(importedControls.value, null, 2),
    '```'
  ]

  if (importedReplay.value) {
    lines.push(
      '',
      '## Replay manifest',
      '```json',
      JSON.stringify(importedReplay.value, null, 2),
      '```'
    )
  }

  lines.push(
    '',
    '## Source',
    '```vue',
    currentImportedExportSource.value,
    '```'
  )

  return lines.join('\n')
})

function isPlaygroundComponent(value: string | null): value is PlaygroundComponent {
  return Boolean(value && playgroundComponents.includes(value as PlaygroundComponent))
}

function isPlaygroundTheme(value: string | null): value is PlaygroundTheme {
  return Boolean(value && playgroundThemes.includes(value as PlaygroundTheme))
}

function isPlaygroundSize(value: string | null): value is PlaygroundSize {
  return Boolean(value && playgroundSizes.includes(value as PlaygroundSize))
}

function isPlaygroundTone(value: string | null): value is PlaygroundTone {
  return Boolean(value && playgroundTones.includes(value as PlaygroundTone))
}

function isPlaygroundButtonVariant(value: string | null): value is PlaygroundButtonVariant {
  return Boolean(value && playgroundButtonVariants.includes(value as PlaygroundButtonVariant))
}

function isPlaygroundAvatarShape(value: string | null): value is PlaygroundAvatarShape {
  return Boolean(value && playgroundAvatarShapes.includes(value as PlaygroundAvatarShape))
}

function isPlaygroundViewport(value: string | null): value is PlaygroundViewport {
  return Boolean(value && playgroundViewports.includes(value as PlaygroundViewport))
}

function isPlaygroundCodeView(value: string | null): value is PlaygroundCodeView {
  return Boolean(value && playgroundCodeViews.includes(value as PlaygroundCodeView))
}

function getBooleanQueryValue(value: string | null) {
  return value === 'true'
}

function normalizeDocsHash(value: string | null | undefined) {
  if (!value) {
    return ''
  }

  const trimmedValue = value.trim()
  const withHash = trimmedValue.startsWith('#') ? trimmedValue : `#${trimmedValue}`

  return /^#[A-Za-z0-9][A-Za-z0-9_-]*(?:\?[A-Za-z0-9%=&_.~+-]*)?$/.test(withHash) ? withHash : ''
}

function parseImportedSourcePanel(params: URLSearchParams): ImportedPlaygroundHandoffPayload['sourcePanel'] | null {
  const mode = params.get('sourcePanelMode')?.trim()
  const label = params.get('sourcePanelLabel')?.trim()
  const language = params.get('sourcePanelLanguage')?.trim()
  const installPackageManager = params.get('sourcePanelInstallPackageManager')?.trim()

  if (!mode && !label && !language && !installPackageManager) {
    return null
  }

  return {
    ...(mode ? { mode } : {}),
    ...(label ? { label } : {}),
    ...(language ? { language } : {}),
    ...(installPackageManager ? { installPackageManager } : {})
  }
}

function parseImportedControls(value: string | null) {
  if (!value) {
    return {}
  }

  try {
    const parsed = JSON.parse(value)

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(([, entry]) =>
        typeof entry === 'string' ||
        typeof entry === 'number' ||
        typeof entry === 'boolean'
      )
    ) as Record<string, string | number | boolean>
  } catch {
    return {}
  }
}

function parseImportedReplay(value: string | null): ImportedReplayManifest | null {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as unknown

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null
    }

    return parsed as ImportedReplayManifest
  } catch {
    return null
  }
}

function getPlaygroundHandoffStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readPlaygroundHandoff(key: string | null): ImportedPlaygroundHandoffPayload | null {
  if (!key) {
    return null
  }

  const stored = getPlaygroundHandoffStorage()?.getItem(`${playgroundHandoffStoragePrefix}:${key}`)

  if (!stored) {
    return null
  }

  try {
    const parsed = JSON.parse(stored) as unknown

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null
    }

    return parsed as ImportedPlaygroundHandoffPayload
  } catch {
    return null
  }
}

function coerceImportedControls(value: Record<string, unknown> | undefined) {
  if (!value) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) =>
      typeof entry === 'string' ||
      typeof entry === 'number' ||
      typeof entry === 'boolean'
    )
  ) as Record<string, string | number | boolean>
}

function hydrateRouteQuery() {
  if (typeof window === 'undefined') {
    return
  }

  const params = new URLSearchParams(window.location.search)
  const routeComponent = params.get('component')
  const routeTheme = params.get('theme')
  const routeSource = params.get('source')
  const routeScenario = params.get('scenario')
  const routeViewport = params.get('viewport')
  const routeControls = params.get('controls')
  const routeReplay = params.get('replay')
  const routeHandoff = params.get('handoff')
  const routeOrigin = params.get('from')
  const routeLanguage = params.get('language')
  const routeDocsHash = params.get('docsHash')
  const routeSize = params.get('size')
  const routeVariant = params.get('variant')
  const routeTone = params.get('tone')
  const routeShape = params.get('shape')
  const routeValue = Number(params.get('value'))

  const handoffPayload = readPlaygroundHandoff(routeHandoff)
  const handoffComponent = handoffPayload?.component ?? null
  const handoffTheme = handoffPayload?.theme ?? null
  const handoffViewport = handoffPayload?.viewport ?? null

  if (isPlaygroundComponent(handoffComponent)) {
    activeComponent.value = handoffComponent
  } else if (isPlaygroundComponent(routeComponent)) {
    activeComponent.value = routeComponent
  }

  if (isPlaygroundTheme(handoffTheme)) {
    theme.value = handoffTheme
  } else if (isPlaygroundTheme(routeTheme)) {
    theme.value = routeTheme
  }

  if (handoffPayload?.source) {
    importedSource.value = handoffPayload.source
    importedInitialSource.value = handoffPayload.source
  } else if (routeSource) {
    importedSource.value = routeSource
    importedInitialSource.value = routeSource
  }

  const importedLanguage = handoffPayload?.language ?? routeLanguage

  if (isPlaygroundCodeView(importedLanguage) && importedLanguage !== 'install') {
    activeCodeView.value = importedLanguage
  }

  importedSourceOrigin.value = handoffPayload?.origin ?? routeOrigin ?? ''
  importedSourcePanel.value = handoffPayload?.sourcePanel ?? parseImportedSourcePanel(params)
  importedDocsHash.value = normalizeDocsHash(handoffPayload?.docsHash ?? routeDocsHash)
  importedScenario.value = handoffPayload?.scenario ?? routeScenario ?? ''
  importedViewport.value = isPlaygroundViewport(handoffViewport)
    ? handoffViewport
    : isPlaygroundViewport(routeViewport)
      ? routeViewport
      : ''
  importedControls.value = handoffPayload?.controls
    ? coerceImportedControls(handoffPayload.controls)
    : parseImportedControls(routeControls)
  importedReplay.value = handoffPayload?.replay ?? parseImportedReplay(routeReplay)
  importedHandoffKey.value = handoffPayload ? routeHandoff ?? '' : ''
  importedHandoffMissingKey.value = routeHandoff && !handoffPayload && !routeSource ? routeHandoff : ''
  importedInitialCodeView.value = importedSource.value ? activeCodeView.value : ''
  importedInitialTheme.value = importedSource.value ? theme.value : ''

  if (isPlaygroundSize(routeSize)) {
    size.value = routeSize
  }

  if (isPlaygroundButtonVariant(routeVariant)) {
    variant.value = routeVariant
  }

  if (isPlaygroundTone(routeTone)) {
    tone.value = routeTone
  }

  if (isPlaygroundAvatarShape(routeShape)) {
    avatarShape.value = routeShape
  }

  if (Number.isFinite(routeValue)) {
    progressValue.value = Math.min(100, Math.max(0, routeValue))
  }

  loading.value =
    params.has('loading')
      ? getBooleanQueryValue(params.get('loading'))
      : activeComponent.value === 'loading'
  disabled.value = getBooleanQueryValue(params.get('disabled'))
}

function clearImportedSource() {
  importedSource.value = ''
  importedInitialSource.value = ''
  importedInitialCodeView.value = ''
  importedInitialTheme.value = ''
  importedSourceDisplayMode.value = 'edit'
  importedSourceOrigin.value = ''
  importedSourcePanel.value = null
  importedDocsHash.value = ''
  importedScenario.value = ''
  importedViewport.value = ''
  importedControls.value = {}
  importedReplay.value = null
  importedHandoffKey.value = ''
  importedHandoffMissingKey.value = ''
  copiedShare.value = false
  copiedImportManifest.value = false
}

function restoreImportedSource() {
  if (!importedInitialSource.value) {
    return
  }

  importedSource.value = importedInitialSource.value
  importedSourceDisplayMode.value = 'edit'
  copied.value = false
  copiedShare.value = false
  copiedImportManifest.value = false
}

function updateImportedSource(event: Event) {
  const target = event.target

  if (!(target instanceof HTMLTextAreaElement)) {
    return
  }

  importedSource.value = target.value
  copied.value = false
  copiedShare.value = false
  copiedImportManifest.value = false
}

function setImportedSourceDisplayMode(
  mode: 'edit' | 'source',
  focusTarget: 'none' | 'source-panel' | 'source-toggle' = mode === 'source' ? 'source-panel' : 'none'
) {
  importedSourceDisplayMode.value = mode

  void nextTick(() => {
    if (focusTarget === 'source-panel') {
      document.getElementById(importedSourcePanelId)?.focus({ preventScroll: true })
      return
    }

    if (focusTarget === 'source-toggle') {
      document
        .querySelector<HTMLElement>('[data-playground-code-action="mode-source"]')
        ?.focus({ preventScroll: true })
    }
  })
}

async function writeClipboardText(text: string) {
  const clipboard = globalThis.navigator?.clipboard

  if (clipboard?.writeText) {
    let clipboardWrite: Promise<void> | void

    try {
      clipboardWrite = clipboard.writeText(text)
    } catch {
      clipboardWrite = undefined
    }

    const wroteWithClipboard = await Promise.race([
      Promise.resolve(clipboardWrite).then(() => true).catch(() => false),
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(false), clipboardWriteTimeoutMs)
      })
    ])

    if (wroteWithClipboard) {
      return
    }
  }

  if (typeof document === 'undefined' || !document.body) {
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.inset = '0 auto auto 0'
  textarea.style.opacity = '0'

  document.body.appendChild(textarea)
  textarea.select()

  try {
    document.execCommand?.('copy')
  } catch {
    // Keep UI feedback available even when the legacy fallback is blocked.
  } finally {
    textarea.remove()
  }
}

function setActiveFamily(family: string) {
  activeFamily.value = family

  if (!filteredComponentOptions.value.some((component) => component.value === activeComponent.value)) {
    activeComponent.value = filteredComponentOptions.value[0]?.value ?? 'button'
  }
}

function setActiveCodeView(view: PlaygroundCodeView) {
  activeCodeView.value = view
  copied.value = false
}

function resetGeneratedProps() {
  size.value = 'md'
  variant.value = 'primary'
  disabled.value = false
  loading.value = activeComponent.value === 'loading'
  tone.value = 'info'
  avatarShape.value = 'circle'
  progressValue.value = 64
  badgeValue.value = 12
  autocompleteValue.value = 'auto'
  mentionValue.value = 'Please review @ad'
  numberValue.value = 6
  sliderValue.value = 64
  rateValue.value = 4
  checkboxValue.value = true
  radioValue.value = 'core'
  switchValue.value = true
  dateValue.value = '2026-06-13'
  dateRangeValue.value = ['2026-06-13', '2026-06-20']
  dateTimeValue.value = '2026-07-04 20:30'
  timeValue.value = '09:30'
  cascaderValue.value = ['core', 'form', 'cascader']
  colorValue.value = '#14B8A6'
  schemaFormModel.value = { ...defaultSchemaFormModel }
  searchFormModel.value = { ...defaultSearchFormModel }
  resourceSearchModel.value = { ...defaultResourceSearchModel }
  crudSearchModel.value = { ...defaultCrudSearchModel }
  approvalComment.value = defaultApprovalComment
  approvalDecision.value = defaultApprovalDecision
  selectedApprovalSuggestions.value = [...defaultApprovalSuggestions]
  bulkSelectedRowKeys.value = [...defaultBulkSelectedRowKeys]
  savedViewModel.value = defaultSavedViewModel
  savedViewDefault.value = defaultSavedViewDefault
  savedViewManagerItems.value = dataViewViews.map((item) => ({ ...item }))
  searchPanelModel.value = { ...defaultSearchPanelModel }
  filterTabValue.value = defaultFilterTabValue
  fieldArrayItems.value = defaultFieldArrayItems.map((item) => ({ ...item }))
  activeTab.value = 'usage'
  stepCurrent.value = 1
  tourOpen.value = true
  tourCurrent.value = 0
  collapseValue.value = ['usage']
  paginationPage.value = 2
  modalOpen.value = true
  drawerOpen.value = true
  copied.value = false
  copiedShare.value = false
  copiedImportManifest.value = false
  importedSource.value = ''
  importedInitialSource.value = ''
  importedInitialCodeView.value = ''
  importedInitialTheme.value = ''
  importedSourceOrigin.value = ''
  importedSourcePanel.value = null
  importedScenario.value = ''
  importedViewport.value = ''
  importedControls.value = {}
  importedReplay.value = null
  importedHandoffKey.value = ''
  importedHandoffMissingKey.value = ''
  activeCodeView.value = 'ts'
}

async function copyCode() {
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1200)

  await writeClipboardText(displayedCode.value)
}

async function copyPlaygroundLink() {
  copiedShare.value = true
  window.setTimeout(() => {
    copiedShare.value = false
  }, 1200)

  await writeClipboardText(playgroundShareUrl.value)
}

async function copyImportedManifest() {
  copiedImportManifest.value = true
  window.setTimeout(() => {
    copiedImportManifest.value = false
  }, 1200)

  await writeClipboardText(importedManifest.value)
}

function handlePlaygroundCodeAction(key: string) {
  if (key === 'mode-edit') {
    setImportedSourceDisplayMode('edit')
    return
  }

  if (key === 'mode-source') {
    setImportedSourceDisplayMode('source')
    return
  }

  if (key === 'reset-source') {
    restoreImportedSource()
    return
  }

  if (key === 'copy-link') {
    void copyPlaygroundLink()
    return
  }

  if (key === 'copy-code') {
    void copyCode()
  }
}

onMounted(() => {
  hydrateRouteQuery()
})
</script>

<template>
  <section class="playground-workbench" :data-theme="theme" aria-label="Yok UI interactive playground">
    <div class="playground-workbench__intro">
      <p class="docs-eyebrow">interactive playground</p>
      <h2>像主流组件库一样调组件，但保持 yok-ui 的轻快感</h2>
      <p>
        选择组件、切主题、调 props、看预览、复制完整 SFC。这里更像组件库官网的工作台，
        而不是单个静态示例。
      </p>
    </div>

    <details class="playground-workbench__mobile-picker" aria-label="Mobile component picker">
      <summary class="playground-workbench__mobile-summary" :aria-label="`当前组件：${activeMeta.label}`">
        <span>
          <strong>{{ activeMeta.label }}</strong>
          <small>{{ activeMeta.family }}</small>
        </span>
        <span class="playground-workbench__mobile-summary-action">切换组件</span>
      </summary>

      <div class="playground-workbench__mobile-picker-body">
        <div class="playground-workbench__mobile-family-filter" aria-label="Mobile component family filter">
          <button
            v-for="family in familyFilters"
            :key="family.value"
            :class="{ 'is-active': activeFamily === family.value }"
            type="button"
            @click="setActiveFamily(family.value)"
          >
            <span>{{ family.label }}</span>
            <small>{{ family.count }}</small>
          </button>
        </div>

        <div class="playground-workbench__mobile-component-list" aria-label="Mobile component list">
          <button
            v-for="item in filteredComponentOptions"
            :key="item.value"
            class="playground-workbench__mobile-component-button"
            :class="{ 'is-active': activeComponent === item.value }"
            type="button"
            @click="activeComponent = item.value"
          >
            <span>{{ item.label }}</span>
            <small>{{ item.family }}</small>
          </button>
        </div>
      </div>
    </details>

    <div class="playground-workbench__layout">
      <aside class="playground-workbench__rail" aria-label="Component picker" data-desktop-navigation="true">
        <div class="playground-workbench__family-filter" aria-label="Component family filter">
          <button
            v-for="family in familyFilters"
            :key="family.value"
            :class="{ 'is-active': activeFamily === family.value }"
            type="button"
            @click="setActiveFamily(family.value)"
          >
            <span>{{ family.label }}</span>
            <small>{{ family.count }}</small>
          </button>
        </div>

        <button
          v-for="item in filteredComponentOptions"
          :key="item.value"
          class="playground-workbench__component-button"
          :class="{ active: activeComponent === item.value }"
          type="button"
          @click="activeComponent = item.value"
        >
          <span>{{ item.label }}</span>
          <small>{{ item.family }}</small>
        </button>
      </aside>

      <div class="playground-workbench__controls">
        <header>
          <div>
            <strong>{{ activeMeta.label }}</strong>
            <p>{{ activeMeta.description }}</p>
          </div>
          <div class="playground-workbench__control-meta">
            <span>{{ activeMeta.family }}</span>
            <button class="playground-workbench__reset" type="button" @click="resetGeneratedProps">重置参数</button>
          </div>
        </header>

        <label>
          <span>Theme</span>
          <select v-model="theme">
            <option value="yok-light">Light</option>
            <option value="yok-clean">Clean</option>
            <option value="yok-candy">Candy</option>
          </select>
        </label>

        <label v-if="activeComponent === 'button'">
          <span>Variant</span>
          <select v-model="variant">
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="ghost">Ghost</option>
          </select>
        </label>

        <label v-if="activeComponent === 'button' || activeComponent === 'avatar' || activeComponent === 'avatarGroup'">
          <span>Size</span>
          <select v-model="size">
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>

        <label v-if="activeComponent === 'avatar' || activeComponent === 'avatarGroup'">
          <span>Shape</span>
          <select v-model="avatarShape">
            <option value="circle">Circle</option>
            <option value="square">Square</option>
          </select>
        </label>

        <label v-if="activeComponent === 'tag' || activeComponent === 'checkTag' || activeComponent === 'badge' || activeComponent === 'progress' || activeComponent === 'alert' || activeComponent === 'avatar' || activeComponent === 'statistic' || activeComponent === 'loading'">
          <span>Tone</span>
          <select v-model="tone">
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
          </select>
        </label>

        <label v-if="activeComponent === 'progress'">
          <span>Value</span>
          <input v-model.number="progressValue" type="range" min="0" max="100" />
        </label>

        <label v-if="activeComponent === 'badge'">
          <span>Badge value</span>
          <input v-model.number="badgeValue" type="range" min="0" max="140" />
        </label>

        <label v-if="activeComponent === 'button' || activeComponent === 'loading'" class="playground-workbench__check">
          <input v-model="loading" type="checkbox" />
          <span>Loading</span>
        </label>

        <label
          v-if="
            activeComponent === 'button' ||
            activeComponent === 'input' ||
            activeComponent === 'autocomplete' ||
            activeComponent === 'mention' ||
            activeComponent === 'select' ||
            activeComponent === 'inputNumber' ||
            activeComponent === 'slider' ||
            activeComponent === 'rate' ||
            activeComponent === 'checkbox' ||
            activeComponent === 'radioGroup' ||
            activeComponent === 'switch' ||
            activeComponent === 'datePicker' ||
            activeComponent === 'dateRangePicker' ||
            activeComponent === 'dateTimePicker' ||
            activeComponent === 'timePicker' ||
            activeComponent === 'timeSelect' ||
            activeComponent === 'cascader' ||
            activeComponent === 'colorPicker' ||
            activeComponent === 'colorPickerPanel' ||
            activeComponent === 'textarea'
          "
          class="playground-workbench__check"
        >
          <input v-model="disabled" type="checkbox" />
          <span>Disabled</span>
        </label>
      </div>

      <section
        v-if="importedSource || importedHandoffMissingKey"
        class="playground-workbench__import"
        :class="{ 'playground-workbench__import--missing': importedHandoffMissingKey }"
        aria-live="polite"
      >
        <div class="playground-workbench__import-main">
          <div class="playground-workbench__import-body">
            <span class="playground-workbench__import-kicker">{{ importedSourceKicker }}</span>
            <strong class="playground-workbench__import-title">{{ importedPanelTitle }}</strong>
            <span class="playground-workbench__import-meta">
              <span class="playground-workbench__import-chip">{{ importedSourceOriginLabel }}</span>
              <span class="playground-workbench__import-chip">{{ activeMeta.family }}</span>
              <span v-if="importedScenario" class="playground-workbench__import-chip">
                场景 {{ importedScenario }}
              </span>
              <span v-if="importedViewport" class="playground-workbench__import-chip">
                {{ playgroundViewportLabels[importedViewport] }}
              </span>
              <span v-if="importedHandoffKey || importedHandoffMissingKey" class="playground-workbench__import-chip">
                handoff {{ importedHandoffKey || importedHandoffMissingKey }}
              </span>
              <span
                v-for="entry in importedControlSummary"
                :key="entry"
                class="playground-workbench__import-chip"
              >
                {{ entry }}
              </span>
            </span>
          </div>
          <dl class="playground-workbench__import-summary" aria-label="Imported source summary">
            <div
              v-for="item in importedSummaryItems"
              :key="item.label"
              class="playground-workbench__import-summary-item"
            >
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
          <div class="playground-workbench__import-actions">
            <a class="playground-workbench__import-doc-link" :href="importedDocsRoute">{{ importedDocsLinkLabel }}</a>
            <button
              v-if="importedSource"
              class="playground-workbench__import-restore"
              type="button"
              @click="restoreImportedSource"
            >
              恢复导入源码
            </button>
            <button
              v-if="importedSource"
              class="playground-workbench__import-action"
              type="button"
              @click="clearImportedSource"
            >
              恢复工作台生成
            </button>
          </div>
        </div>
        <p v-if="importedHandoffMissingKey" class="playground-workbench__import-missing-note">
          本地 handoff payload 不存在，通常是跨浏览器打开、存储被清理或链接已过期。请从原组件示例重新点击 Playground。
        </p>
        <details class="playground-workbench__import-details">
          <summary>
            <span>查看导入清单</span>
            <small>{{ importedManifestItems.length }} items</small>
          </summary>
          <ul class="playground-workbench__import-manifest-grid" aria-label="Imported source manifest">
            <li
              v-for="item in importedManifestItems"
              :key="item.label"
              class="playground-workbench__import-manifest-item"
            >
              <span class="playground-workbench__import-manifest-label">{{ item.label }}</span>
              <strong class="playground-workbench__import-manifest-value">{{ item.value }}</strong>
            </li>
          </ul>
          <section
            v-if="importedReplay"
            class="playground-workbench__replay"
            aria-label="Imported replay evidence"
          >
            <header class="playground-workbench__replay-header">
              <div>
                <span class="playground-workbench__replay-kicker">Replay manifest</span>
                <strong class="playground-workbench__replay-title">
                  {{ importedReplayEvents.length }} events · {{ importedReplaySteps.length }} steps
                </strong>
              </div>
              <span class="playground-workbench__replay-status">
                {{ importedReplay.assertions?.validation ?? 'Pass' }}
              </span>
            </header>
            <ul class="playground-workbench__replay-grid">
              <li
                v-for="item in importedReplayItems"
                :key="item.label"
                class="playground-workbench__replay-item"
              >
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <small>{{ item.detail }}</small>
              </li>
            </ul>
            <ol class="playground-workbench__replay-steps">
              <li
                v-for="step in importedReplaySteps"
                :key="step.key || step.label"
                :data-passed="step.passed === false ? 'false' : 'true'"
              >
                <strong>{{ step.label }}</strong>
                <span>{{ step.detail }}</span>
              </li>
            </ol>
          </section>
          <button
            v-if="importedSource"
            class="playground-workbench__import-manifest"
            type="button"
            @click="copyImportedManifest"
          >
            {{ copiedImportManifest ? '已复制清单' : '复制导入清单' }}
          </button>
        </details>
      </section>

      <div class="playground-workbench__stage">
        <div class="playground-workbench__preview">
          <YButton
            v-if="activeComponent === 'button'"
            :size="size"
            :variant="variant"
            :disabled="disabled"
            :loading="loading"
          >
            Generate
          </YButton>
          <YImage
            v-else-if="activeComponent === 'image'"
            :src="imageSrc"
            alt="Yok UI logo"
            fit="contain"
            width="220px"
            height="140px"
            preview
          />
          <YSegmented
            v-else-if="activeComponent === 'segmented'"
            v-model="segmentedValue"
            :options="segmentedOptions"
            aria-label="View mode"
            name="playground-view-mode"
            block
          />
          <YCalendar
            v-else-if="activeComponent === 'calendar'"
            v-model="calendarValue"
          />
          <YInput
            v-else-if="activeComponent === 'input'"
            v-model="inputValue"
            label="Library name"
            :disabled="disabled"
          />
          <YInputOtp
            v-else-if="activeComponent === 'inputOtp'"
            v-model="inputOtpValue"
            label="Verification code"
            :length="6"
            :disabled="disabled"
          />
          <YInputTag
            v-else-if="activeComponent === 'inputTag'"
            v-model="inputTagValue"
            label="Tech stack"
            placeholder="Press Enter to add"
            :max="5"
            :disabled="disabled"
          />
          <YAutocomplete
            v-else-if="activeComponent === 'autocomplete'"
            v-model="autocompleteValue"
            label="Component"
            placeholder="Search components"
            clearable
            :options="autocompleteOptions"
            :disabled="disabled"
          />
          <YMention
            v-else-if="activeComponent === 'mention'"
            v-model="mentionValue"
            label="Release note"
            placeholder="Mention reviewers with @"
            clearable
            prefix="@,#"
            :options="mentionOptions"
            :disabled="disabled"
          />
          <YSelect
            v-else-if="activeComponent === 'select'"
            v-model="selectValue"
            label="Package"
            :options="selectOptions"
            :disabled="disabled"
          />
          <YInputNumber
            v-else-if="activeComponent === 'inputNumber'"
            v-model="numberValue"
            label="Quantity"
            :min="0"
            :max="20"
            :step="1"
            :disabled="disabled"
          />
          <YSlider
            v-else-if="activeComponent === 'slider'"
            v-model="sliderValue"
            label="Volume"
            :step="5"
            show-tooltip
            :disabled="disabled"
          />
          <YRate
            v-else-if="activeComponent === 'rate'"
            v-model="rateValue"
            label="Satisfaction"
            allow-half
            :texts="rateTexts"
            :disabled="disabled"
          />
          <YCheckbox
            v-else-if="activeComponent === 'checkbox'"
            v-model="checkboxValue"
            label="Enable docs checks"
            description="Keep examples, API and a11y evidence aligned."
            :disabled="disabled"
          />
          <YRadioGroup
            v-else-if="activeComponent === 'radioGroup'"
            v-model="radioValue"
            label="Package type"
            :options="radioOptions"
            :disabled="disabled"
          />
          <YSwitch
            v-else-if="activeComponent === 'switch'"
            v-model="switchValue"
            label="Enable fresh cute mode"
            :disabled="disabled"
          />
          <YDatePicker
            v-else-if="activeComponent === 'datePicker'"
            v-model="dateValue"
            label="Release date"
            :disabled="disabled"
          />
          <YDateRangePicker
            v-else-if="activeComponent === 'dateRangePicker'"
            v-model="dateRangeValue"
            label="Sprint range"
            :disabled="disabled"
          />
          <YDateTimePicker
            v-else-if="activeComponent === 'dateTimePicker'"
            v-model="dateTimeValue"
            label="Release at"
            :minute-step="15"
            :disabled="disabled"
          />
          <YTimePicker
            v-else-if="activeComponent === 'timePicker'"
            v-model="timeValue"
            label="Review time"
            :minute-step="15"
            :disabled="disabled"
          />
          <YTimeSelect
            v-else-if="activeComponent === 'timeSelect'"
            v-model="timeSelectValue"
            label="Start time"
            start="08:30"
            end="18:30"
            step="00:15"
            :disabled="disabled"
          />
          <YCascader
            v-else-if="activeComponent === 'cascader'"
            v-model="cascaderValue"
            label="Component path"
            :options="cascaderOptions"
            :disabled="disabled"
          />
          <YColorPicker
            v-else-if="activeComponent === 'colorPicker'"
            v-model="colorValue"
            label="Accent color"
            :disabled="disabled"
            show-text
          />
          <YColorPickerPanel
            v-else-if="activeComponent === 'colorPickerPanel'"
            v-model="colorPanelValue"
            label="Theme color"
            :disabled="disabled"
          />
          <YCarousel
            v-else-if="activeComponent === 'carousel'"
            :items="carouselItems"
            autoplay
            :interval="2400"
            indicator-position="outside"
            aria-label="Yok UI maturity carousel"
          />
          <YTable
            v-else-if="activeComponent === 'table'"
            caption="Component release queue"
            summary="3 rows · sortable status review"
            :columns="tableColumns"
            :data="tableRows"
            striped
            selectable
          />
          <YDataTable
            v-else-if="activeComponent === 'dataTable'"
            title="Component release queue"
            description="Admin table with selection, density and pagination."
            :columns="adminTableColumns"
            :data="adminTableRows"
            selectable
            pagination
            sticky-bulk-actions
            show-density-settings
            show-column-settings
          />
          <YDataView
            v-else-if="activeComponent === 'dataView'"
            title="Component review workspace"
            description="Saved views and table preferences stay together."
            saved-views-title="Saved table views"
            table-title="Component queue"
            :views="dataViewViews"
            :columns="dataViewColumns"
            :data="dataViewRows"
            default-view="beta"
            pagination
            :page-size="3"
            selectable
            show-filter-summary
            show-density-settings
            show-column-settings
            reorderable-columns
            resizable
          />
          <YResourcePage
            v-else-if="activeComponent === 'resourcePage'"
            title="Component resources"
            description="Search, review and maintain component records."
            eyebrow="Admin"
            status="Live"
            search-title="Resource filters"
            search-description="Search model, saved views and table preferences stay aligned."
            :search-model="resourceSearchModel"
            :search-fields="resourceSearchFields"
            saved-views-title="Saved table views"
            table-title="Component queue"
            :views="resourceViews"
            :columns="resourceColumns"
            :data="resourceRows"
            default-view="beta"
            pagination
            :page-size="3"
            selectable
            show-filter-summary
            show-density-settings
            show-column-settings
            reorderable-columns
          >
            <template #actions>
              <YButton variant="primary">Create component</YButton>
            </template>
            <template #toolbar>
              <YButton variant="secondary">Export CSV</YButton>
            </template>
          </YResourcePage>
          <YCrudLayout
            v-else-if="activeComponent === 'crudLayout'"
            title="Component operations"
            eyebrow="Admin"
            status="Live"
            description="Search, review and maintain component records in one stable CRUD shell."
            density="compact"
          >
            <template #actions>
              <YButton variant="primary">Create component</YButton>
            </template>
            <template #search>
              <YSearchForm
                title="Quick filters"
                description="Filter records before reviewing the table."
                :model-value="crudSearchModel"
                :fields="crudSearchFields"
                submit-text="Apply filters"
                reset-text="Reset filters"
                :collapsed-count="3"
              />
            </template>
            <template #toolbar>
              <YButton variant="secondary">Export CSV</YButton>
              <YButton variant="ghost">Save view</YButton>
            </template>
            <template #table>
              <YDataTable
                title="Component queue"
                description="Rows, density and column preferences stay inside the CRUD layout."
                :columns="crudTableColumns"
                :data="crudTableRows"
                selectable
                pagination
                :page-size="3"
                show-density-settings
                show-column-settings
              />
            </template>
            <template #aside>
              <section aria-label="Release summary">Release summary: 4 components tracked.</section>
            </template>
          </YCrudLayout>
          <YApprovalCommentBox
            v-else-if="activeComponent === 'approvalCommentBox'"
            v-model="approvalComment"
            v-model:decision="approvalDecision"
            v-model:selected-suggestions="selectedApprovalSuggestions"
            title="Release review"
            reviewer="Yok"
            target="YDataTable"
            :suggestions="approvalSuggestions"
            :attachments="approvalAttachments"
            :max-length="160"
          />
          <YBulkActionBar
            v-else-if="activeComponent === 'bulkActionBar'"
            title="3 components selected"
            clear-text="Clear selection"
            :selected-row-keys="bulkSelectedRowKeys"
            :actions="bulkActions"
          />
          <YBulkActionMenu
            v-else-if="activeComponent === 'bulkActionMenu'"
            label="More batch actions"
            clear-text="Clear selection"
            :selected-row-keys="bulkSelectedRowKeys"
            :actions="bulkMenuActions"
          />
          <YDataToolbar
            v-else-if="activeComponent === 'dataToolbar'"
            title="Component queue"
            description="Shared toolbar for data-heavy admin surfaces."
            :count="dataToolbarCount"
          >
            <YButton variant="primary">Create component</YButton>
            <YButton variant="secondary">Export CSV</YButton>
          </YDataToolbar>
          <YSavedViews
            v-else-if="activeComponent === 'savedViews'"
            title="Component views"
            description="Pinned filters for repeated documentation work."
            :model-value="savedViewModel"
            :items="savedViewItems"
            save-text="Save current"
            manage-text="Manage views"
          />
          <YSavedViewManager
            v-else-if="activeComponent === 'savedViewManager'"
            v-model="savedViewModel"
            v-model:default-value="savedViewDefault"
            v-model:items="savedViewManagerItems"
            title="Manage component views"
            description="Rename, pin, duplicate, delete and choose the default table view."
          />
          <YSearchPanel
            v-else-if="activeComponent === 'searchPanel'"
            :model-value="searchPanelModel"
            :fields="searchPanelFields"
            submit-text="Apply filters"
            reset-text="Clear filters"
          />
          <YFilterTabs
            v-else-if="activeComponent === 'filterTabs'"
            :model-value="filterTabValue"
            :items="filterTabItems"
            aria-label="Component status filters"
          />
          <YStatusTimeline
            v-else-if="activeComponent === 'statusTimeline'"
            :items="statusTimelineItems"
            active-value="reviewing"
            aria-label="Release status timeline"
          />
          <YReviewWorkflow
            v-else-if="activeComponent === 'reviewWorkflow'"
            :items="reviewWorkflowSteps"
            active-value="reviewing"
            title="Live example review"
            description="Approve or request changes before marking a component documented."
            reviewer="Maintainer"
            due-text="Due today"
          />
          <YFieldArray
            v-else-if="activeComponent === 'fieldArray'"
            :model-value="fieldArrayItems"
            :default-item="fieldArrayDefaultItem"
            title="Reviewers"
            description="People who need to approve this component."
            item-key="id"
            add-text="Add reviewer"
            remove-text="Remove reviewer"
            item-label="Reviewer"
            :max="4"
          />
          <YSchemaForm
            v-else-if="activeComponent === 'schemaForm'"
            v-model="schemaFormModel"
            title="Component profile"
            description="Configure component metadata from a schema."
            :schema="schemaFormSchema"
            submit-text="Save profile"
            reset-text="Reset profile"
          />
          <YSearchForm
            v-else-if="activeComponent === 'searchForm'"
            v-model="searchFormModel"
            title="Component search"
            description="Collapse long filter groups while keeping active filters visible."
            :fields="searchFormFields"
            submit-text="Apply filters"
            reset-text="Reset filters"
            :collapsed-count="3"
          />
          <YList
            v-else-if="activeComponent === 'list'"
            title="Release checklist"
            description="Track the work needed before publishing."
            :items="releaseTasks"
            bordered
          />
          <YLayout
            v-else-if="activeComponent === 'layout'"
            full-height
            aria-label="Playground page shell"
          >
            <YHeader height="56px" bordered>Yok UI Workspace</YHeader>
            <YLayout direction="horizontal">
              <YAside width="188px" bordered aria-label="Primary navigation">
                <YMenu :items="menuItems" model-value="components" />
              </YAside>
              <YMain>Component workspace</YMain>
            </YLayout>
            <YFooter bordered>Docs and Playground stay linked.</YFooter>
          </YLayout>
          <YStatistic
            v-else-if="activeComponent === 'statistic'"
            title="Stable components"
            :value="73"
            suffix="%"
            :tone="tone"
          />
          <YDescriptions
            v-else-if="activeComponent === 'descriptions'"
            title="Component profile"
            description="Structured details for docs and package review."
            :items="componentDetails"
            bordered
            :column="2"
          />
          <YTabs
            v-else-if="activeComponent === 'tabs'"
            v-model="activeTab"
            :tabs="tabItems"
            variant="card"
            activation-mode="manual"
            aria-label="Documentation sections"
          >
            <template #default="{ active }">
              <YTag tone="info">{{ active }}</YTag>
            </template>
          </YTabs>
          <YSteps
            v-else-if="activeComponent === 'steps'"
            :items="stepItems"
            :current="stepCurrent"
            selectable
            @select="(_, index) => stepCurrent = index"
          />
          <div
            v-else-if="activeComponent === 'tour'"
            class="playground-workbench__tour-preview"
          >
            <div class="playground-workbench__tour-targets">
              <YButton id="playground-tour-search" variant="secondary">Search docs</YButton>
              <YButton id="playground-tour-edit" variant="primary">Open Playground</YButton>
              <YButton id="playground-tour-ship" variant="secondary">Ship evidence</YButton>
            </div>
            <YTour
              v-model:open="tourOpen"
              :steps="tourSteps"
              :current="tourCurrent"
              skip-text="Skip guide"
              @update:current="(index) => tourCurrent = index"
            />
          </div>
          <YCollapse
            v-else-if="activeComponent === 'collapse'"
            v-model="collapseValue"
            :items="collapseItems"
            accordion
          />
          <YTooltip
            v-else-if="activeComponent === 'tooltip'"
            :content="tooltipContent"
            placement="top"
            open
          >
            <YButton variant="secondary">Hover for guidance</YButton>
          </YTooltip>
          <YPopover
            v-else-if="activeComponent === 'popover'"
            :title="popoverTitle"
            :content="popoverContent"
            placement="bottom"
            open
          >
            <YButton variant="secondary">Open guidance</YButton>
          </YPopover>
          <YDropdown
            v-else-if="activeComponent === 'dropdown'"
            label="Actions"
            :items="dropdownItems"
            align="end"
            open
          />
          <YPopconfirm
            v-else-if="activeComponent === 'popconfirm'"
            open
            :title="popconfirmTitle"
            :description="popconfirmDescription"
            confirm-text="Delete"
            cancel-text="Keep"
          >
            <YButton variant="secondary">Delete draft</YButton>
          </YPopconfirm>
          <YModal
            v-else-if="activeComponent === 'modal'"
            :open="modalOpen"
            title="Publish component"
            description="Review the release note before publishing."
          >
            <p>Modal content should stay focused and easy to dismiss.</p>
          </YModal>
          <YDrawer
            v-else-if="activeComponent === 'drawer'"
            :open="drawerOpen"
            title="Component settings"
            description="Use drawers for secondary configuration."
            placement="right"
          >
            <p>Drawer content can hold forms, filters, or contextual details.</p>
          </YDrawer>
          <YPagination
            v-else-if="activeComponent === 'pagination'"
            v-model:page="paginationPage"
            :page-size="paginationPageSize"
            :total="paginationTotal"
            aria-label="Component release pages"
          />
          <YTimeline
            v-else-if="activeComponent === 'timeline'"
            title="Release timeline"
            description="Track documentation readiness before publishing."
            :items="timelineItems"
            placement="right"
          />
          <YCard
            v-else-if="activeComponent === 'card'"
            :title="cardTitle"
            :description="cardDescription"
            interactive
          >
            <p>Use cards for compact summaries with a clear next action.</p>
            <template #footer>
              <YButton variant="secondary">Review docs</YButton>
            </template>
          </YCard>
          <YEmpty
            v-else-if="activeComponent === 'empty'"
            :title="emptyTitle"
            :description="emptyDescription"
          >
            <YButton variant="primary">Create component</YButton>
          </YEmpty>
          <YSkeleton
            v-else-if="activeComponent === 'skeleton'"
            :rows="skeletonRows"
            label="Loading component details"
          />
          <YLoading
            v-else-if="activeComponent === 'loading'"
            :loading="loading"
            overlay
            text="Refreshing component list"
            :tone="tone === 'info' ? 'primary' : tone"
          >
            <div class="playground-workbench__loading-panel">
              <strong>Component release queue</strong>
              <span>Rows stay mounted while the request runs.</span>
            </div>
          </YLoading>
          <YMessage
            v-else-if="activeComponent === 'message'"
            tone="success"
            :title="messageTitle"
            closable
          >
            {{ messageContent }}
          </YMessage>
          <YMessageBox
            v-else-if="activeComponent === 'messageBox'"
            open
            variant="confirm"
            tone="warning"
            :title="messageBoxTitle"
            :message="messageBoxContent"
            confirm-text="Publish"
            cancel-text="Review"
          />
          <YQRCode
            v-else-if="activeComponent === 'qrCode'"
            :value="qrCodeValue"
            :label="qrCodeLabel"
            level="H"
            :size="168"
            foreground="#087f6d"
            downloadable
            download-name="yok-ui-qr-code.svg"
          >
            Yok UI QRCode
          </YQRCode>
          <YFloatButtonGroup
            v-else-if="activeComponent === 'floatButton'"
            label="Quick actions"
            :items="floatButtonActions"
            :open="true"
            shape="square"
            icon="⋯"
          />
          <YNotification
            v-else-if="activeComponent === 'notification'"
            tone="success"
            :title="notificationTitle"
            closable
          >
            {{ notificationContent }}
          </YNotification>
          <YResult
            v-else-if="activeComponent === 'result'"
            status="success"
            :title="resultTitle"
            :subtitle="resultSubtitle"
          >
            <YButton variant="primary">View docs</YButton>
          </YResult>
          <YTextarea
            v-else-if="activeComponent === 'textarea'"
            v-model="textareaValue"
            label="Release note"
            helper="Use textarea for notes and long-form input."
            :rows="4"
            :disabled="disabled"
          />
          <YForm
            v-else-if="activeComponent === 'form'"
            :model="formModel"
            :rules="formRules"
            label-width="120px"
            scroll-to-error
          >
            <YFormItem prop="name" label="Component name" required>
              <YInput v-model="formModel.name" placeholder="Button" />
            </YFormItem>
            <YFormItem prop="package" label="Package" required>
              <YSelect v-model="formModel.package" :options="selectOptions" />
            </YFormItem>
            <YButton variant="primary" type="submit">Save profile</YButton>
          </YForm>
          <YFormItem
            v-else-if="activeComponent === 'formItem'"
            prop="name"
            label="Component name"
            hint="Use PascalCase for component exports."
            required
          >
            <template #default="{ labelFor, messageId, invalid }">
              <YInput
                :id="labelFor"
                v-model="formItemValue"
                placeholder="YokInput"
                :invalid="invalid"
                :aria-describedby="messageId"
              />
            </template>
          </YFormItem>
          <YFormSummary
            v-else-if="activeComponent === 'formSummary'"
            title="Review before publishing"
            :errors="formSummaryErrors"
          />
          <YDivider
            v-else-if="activeComponent === 'divider'"
            :label="dividerLabel"
            align="start"
          />
          <YLink
            v-else-if="activeComponent === 'link'"
            :href="linkHref"
            tone="primary"
          >
            Browse component overview
          </YLink>
          <YText
            v-else-if="activeComponent === 'text'"
            tag="p"
            tone="secondary"
            :line-clamp="2"
          >
            {{ textContent }}
          </YText>
          <YUpload
            v-else-if="activeComponent === 'upload'"
            v-model="uploadFiles"
            label="Upload evidence"
            description="Attach screenshots or audit notes before release."
            drag
            multiple
          />
          <YIcon
            v-else-if="activeComponent === 'icon'"
            :label="iconLabel"
            color="#0f8a72"
            size="lg"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l7 4v5c0 4.2-2.8 7.9-7 9-4.2-1.1-7-4.8-7-9V7l7-4z" fill="currentColor" />
            </svg>
          </YIcon>
          <YConfigProvider
            v-else-if="activeComponent === 'configProvider'"
            size="lg"
            density="compact"
            :locale="configProviderLocale"
          >
            <YInput label="Library name" model-value="Yok UI" />
            <YButton variant="primary">Create component</YButton>
          </YConfigProvider>
          <YTransfer
            v-else-if="activeComponent === 'transfer'"
            v-model="transferValue"
            :options="transferOptions"
            :titles="['Available', 'Selected']"
            filterable
          />
          <YVirtualList
            v-else-if="activeComponent === 'virtualList'"
            :items="virtualListItems"
            :height="260"
            :item-height="56"
            aria-label="Component review queue"
          >
            <template #item="{ item, index }">
              <span>{{ index + 1 }}. {{ item.label }} · {{ item.description }}</span>
            </template>
          </YVirtualList>
          <YTree
            v-else-if="activeComponent === 'tree'"
            v-model:selected-key="treeSelectedKey"
            v-model:expanded-keys="treeExpandedKeys"
            v-model:checked-keys="treeCheckedKeys"
            :nodes="treeNodes"
            checkable
            aria-label="Component taxonomy"
          />
          <YTreeSelect
            v-else-if="activeComponent === 'treeSelect'"
            v-model="treeSelectValue"
            label="Component"
            :nodes="treeNodes"
            :default-expanded-keys="['core', 'form']"
            filterable
            clearable
            :disabled="disabled"
          />
          <YWatermark
            v-else-if="activeComponent === 'watermark'"
            :content="watermarkContent"
            :gap="132"
            :font-size="16"
          >
            <YCard title="Private preview" description="Watermark protects draft documentation screenshots." />
          </YWatermark>
          <YBreadcrumb
            v-else-if="activeComponent === 'breadcrumb'"
            :items="breadcrumbItems"
            separator="/"
            aria-label="Component route breadcrumb"
          />
          <YMenu
            v-else-if="activeComponent === 'menu'"
            :items="menuItems"
            model-value="menu"
            :default-open-keys="['components']"
            aria-label="Playground navigation"
          />
          <YBacktop
            v-else-if="activeComponent === 'backtop'"
            :visibility-height="backtopVisibilityHeight"
            :right="32"
            :bottom="32"
          />
          <YAffix
            v-else-if="activeComponent === 'affix'"
            :offset="affixOffset"
            aria-label="Playground sticky toolbar"
          >
            <div class="playground-workbench__inline-actions">
              <YButton variant="primary" size="sm">Publish docs</YButton>
              <YTag tone="info">Sticky toolbar</YTag>
            </div>
          </YAffix>
          <YAnchor
            v-else-if="activeComponent === 'anchor'"
            :items="anchorItems"
            model-value="#api"
            :offset="64"
            aria-label="Playground sections"
          />
          <YScrollbar
            v-else-if="activeComponent === 'scrollbar'"
            height="180px"
            aria-label="Documentation checklist"
          >
            <ul>
              <li v-for="item in scrollbarItems" :key="item">{{ item }}</li>
            </ul>
          </YScrollbar>
          <YSpace
            v-else-if="activeComponent === 'space'"
            wrap
            size="sm"
          >
            <YTag v-for="item in spaceItems" :key="item" tone="info">{{ item }}</YTag>
          </YSpace>
          <YSplitter
            v-else-if="activeComponent === 'splitter'"
            :panels="splitterPanels"
            height="240px"
            aria-label="Playground splitter"
          >
            <template #navigation>
              <YTag tone="info">Navigation</YTag>
            </template>
            <template #preview>
              <YTag tone="success">Resizable preview</YTag>
            </template>
          </YSplitter>
          <YCommandPalette
            v-else-if="activeComponent === 'commandPalette'"
            :open="commandPaletteOpen"
            :commands="commandPaletteCommands"
          />
          <YCodeBlock
            v-else-if="activeComponent === 'codeBlock'"
            :code="codeBlockSnippet"
            language="ts"
          />
          <YThemeSwitcher
            v-else-if="activeComponent === 'themeSwitcher'"
            v-model="themeSwitcherValue"
          />
          <YPageHeader
            v-else-if="activeComponent === 'pageHeader'"
            :title="pageHeaderTitle"
            :description="pageHeaderDescription"
            eyebrow="Admin"
            status="Live"
          >
            <template #actions>
              <YButton variant="primary">Create component</YButton>
            </template>
          </YPageHeader>
          <YMetricCard
            v-else-if="activeComponent === 'metricCard'"
            label="Components"
            :value="metricCardValue"
            trend="+8"
            tone="success"
            description="Mapped to live examples and Playground routes."
          />
          <YBrandHero
            v-else-if="activeComponent === 'brandHero'"
            eyebrow="Fresh cute"
            :title="brandHeroTitle"
            :description="brandHeroDescription"
            primary-text="Get started"
            secondary-text="Browse components"
          />
          <YFeatureGrid
            v-else-if="activeComponent === 'featureGrid'"
            :features="featureGridItems"
          />
          <YProfileCard
            v-else-if="activeComponent === 'profileCard'"
            name="Yok Designer"
            role="Component librarian"
            bio="Builds polished docs, examples and accessible component stories."
            avatar-text="Y"
            :tags="profileCardTags"
          />
          <YLogoCloud
            v-else-if="activeComponent === 'logoCloud'"
            title="Built with a practical Vue toolchain"
            :logos="logoCloudItems"
          />
          <YThemeProvider
            v-else-if="activeComponent === 'themeProvider'"
            :theme="themeProviderTheme"
            density="comfortable"
          >
            <YCard title="Candy themed area" description="Theme tokens apply locally without changing the whole page." />
          </YThemeProvider>
          <div v-else-if="activeComponent === 'avatar'" class="playground-workbench__inline-stack">
            <YAvatar
              name="Yok UI"
              :size="size"
              :shape="avatarShape"
              :tone="avatarTone"
            />
            <YAvatar
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop"
              src-set="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=192&h=192&fit=crop 2x"
              alt="Yok designer"
              fit="cover"
              :size="size"
              :shape="avatarShape"
            />
            <YAvatar label="Brand symbol" :shape="avatarShape" :tone="avatarTone">Y</YAvatar>
          </div>
          <YAvatarGroup
            v-else-if="activeComponent === 'avatarGroup'"
            label="Review team"
            :max="3"
            :total="6"
            spacing="tight"
            :size="size"
            :shape="avatarShape"
          >
            <YAvatar name="Core Team" tone="success" />
            <YAvatar name="Product Owner" tone="primary" />
            <YAvatar name="Design Review" tone="warning" />
          </YAvatarGroup>
          <YTag v-else-if="activeComponent === 'tag'" :tone="tone">Fresh cute</YTag>
          <YCheckTag
            v-else-if="activeComponent === 'checkTag'"
            v-model:checked="checkTagChecked"
            :tone="tone"
            :disabled="disabled"
          >
            Selectable
          </YCheckTag>
          <div v-else-if="activeComponent === 'badge'" class="playground-workbench__inline-stack">
            <YBadge
              :value="badgeValue"
              :max="99"
              :tone="tone === 'info' ? 'info' : tone"
              size="lg"
              :offset="[8, -4]"
              label="Inbox unread messages"
            >
              <YButton variant="secondary">Inbox</YButton>
            </YBadge>
            <YBadge dot text="Online" tone="success" size="lg" label="Online status" />
          </div>
          <YAlert
            v-else-if="activeComponent === 'alert'"
            :tone="tone"
            variant="outline"
            size="md"
            title="Playground ready"
            closable
            close-text="Got it"
            close-label="Dismiss playground alert"
          >
            Use this pattern as a docs demo seed.
            <template #action>
              <YButton size="sm" variant="ghost">Open docs</YButton>
            </template>
          </YAlert>
          <YProgress
            v-else
            :value="progressValue"
            :tone="tone === 'info' ? 'primary' : tone"
            label="Build progress"
            striped
          />
        </div>

        <div
          class="playground-workbench__code"
          :data-language="displayedCodeLanguage"
          :data-source-display="showImportedSourceEditor ? 'edit' : 'source'"
        >
          <ExampleSourceActions
            data-source-placement="code-top-right"
            action-attribute="data-playground-code-action"
            language-attribute="data-playground-code-action"
            language-value-prefix="language-"
            aria-label="示例源码操作"
            language-aria-label="Generated source view"
            tools-aria-label="Imported source display mode"
            root-class="playground-workbench__code-actions"
            languages-class="playground-workbench__code-tabs"
            language-class="playground-workbench__code-tab"
            tools-class="playground-workbench__code-buttons playground-workbench__code-mode"
            tool-class="playground-workbench__code-tool"
            glyph-class="playground-workbench__code-tool-glyph"
            text-class="playground-workbench__code-tool-text"
            :active-language="activeCodeView"
            :language-options="playgroundCodeLanguageOptions"
            :actions="playgroundCodeActions"
            @update:language="setActiveCodeView($event as PlaygroundCodeView)"
            @action="handlePlaygroundCodeAction"
          />
          <textarea
            v-if="showImportedSourceEditor"
            class="playground-workbench__code-editor"
            :value="displayedCode"
            aria-label="编辑导入的组件示例源码"
            spellcheck="false"
            @input="updateImportedSource"
          />
          <pre
            v-else
            :id="importedSourcePanelId"
            class="playground-workbench__source-view"
            data-source-panel="element-plus"
            aria-label="Playground source code"
            tabindex="-1"
          ><code>
            <span
              v-for="line in displayedCodeLines"
              :key="line.key"
              class="playground-workbench__code-line"
            ><span class="playground-workbench__code-line-number" aria-hidden="true">{{ line.number }}</span><span class="playground-workbench__code-line-content"><span
                  v-for="(token, tokenIndex) in line.tokens"
                  :key="`${line.key}-${tokenIndex}`"
                  class="playground-workbench__code-token"
                  :class="`playground-workbench__code-token--${token.kind}`"
                >{{ token.text }}</span></span></span>
          </code></pre>
          <footer
            v-if="isImportedSourceEditable && importedSourceDisplayMode === 'source'"
            class="playground-workbench__source-footer"
            data-source-placement="bottom-collapse"
          >
            <button
              type="button"
              class="playground-workbench__source-return-edit"
              data-playground-code-action="return-edit"
              aria-label="返回编辑"
              :aria-controls="importedSourcePanelId"
              @click="setImportedSourceDisplayMode('edit', 'source-toggle')"
            >
              <span class="playground-workbench__source-return-edit-icon" aria-hidden="true"></span>
              <span>返回编辑</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.playground-workbench__inline-stack {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--yok-space-4);
  align-items: center;
}
</style>
