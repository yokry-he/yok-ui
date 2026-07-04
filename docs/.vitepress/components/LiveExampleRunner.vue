<script setup lang="ts">
import { computed, defineComponent, Fragment, h, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch, type PropType, type VNodeChild } from 'vue'
import {
  YAffix,
  YAlert,
  YAnchor,
  YAutocomplete,
  YAvatar,
  YAvatarGroup,
  YBadge,
  YBreadcrumb,
  YButton,
  YCalendar,
  YCarousel,
  YCard,
  YCascader,
  YCheckbox,
  YCheckboxGroup,
  YCollapse,
  YColorPicker,
  YConfigProvider,
  YCountdown,
  YDatePicker,
  YDateRangePicker,
  YDescriptions,
  YDivider,
  YDropdown,
  YEmpty,
  YFloatButton,
  YFloatButtonGroup,
  YForm,
  YFormItem,
  YFormSummary,
  YIcon,
  YImage,
  YInput,
  YInputNumber,
  YAside,
  YFooter,
  YHeader,
  YLayout,
  YMain,
  YLink,
  YLoading,
  YList,
  YMenu,
  YMention,
  YMessage,
  YNotification,
  YPagination,
  YPopover,
  YProgress,
  YQRCode,
  YRadioGroup,
  YRate,
  YResult,
  YScrollbar,
  YSegmented,
  YSelect,
  YSkeleton,
  YSpace,
  YSlider,
  YSplitter,
  YStatistic,
  YSteps,
  YSwitch,
  YTable,
  YTabs,
  YTextarea,
  YText,
  YThemeProvider,
  YTimeline,
  YTour,
  YTimePicker,
  YTag,
  YTooltip,
  YTransfer,
  YTree,
  YTreeSelect,
  YUpload,
  type YTableFilterPayload,
  type YTableFilterState,
  type YTableSelectionPayload,
  type YTableSortOrder,
  type YTableSortPayload,
  type YCascaderOption,
  type YUploadFile,
  type YUploadRejectReason,
  YVirtualList,
  YWatermark
} from '@yok-ui/core'
import { YBrandHero, YFeatureGrid, YLogoCloud, YProfileCard } from '@yok-ui/brand'
import {
  YApprovalCommentBox,
  YBulkActionBar,
  YBulkActionMenu,
  YCrudLayout,
  YDataTable,
  YDataView,
  YDataToolbar,
  YFieldArray,
  type YFieldArrayItem,
  type YFieldArrayValue,
  YFilterTabs,
  YMetricCard,
  YPageHeader,
  YReviewWorkflow,
  YResourcePage,
  YSchemaForm,
  YSavedViewManager,
  YSavedViews,
  YSearchForm,
  YSearchPanel,
  YStatusTimeline
} from '@yok-ui/admin'
import { YCodeBlock, YCopyButton, YThemeSwitcher } from '@yok-ui/product'
import LiveExampleAcceptance from './LiveExampleAcceptance.vue'
import LiveExampleAdvancedTools from './LiveExampleAdvancedTools.vue'
import LiveExampleApiMap from './LiveExampleApiMap.vue'
import LiveExampleEditorPanel from './LiveExampleEditorPanel.vue'
import LiveExampleEventLog from './LiveExampleEventLog.vue'
import LiveExampleInteractionContract from './LiveExampleInteractionContract.vue'
import LiveExamplePreviewState from './LiveExamplePreviewState.vue'
import LiveExamplePreviewPanel from './LiveExamplePreviewPanel.vue'
import LiveExamplePropsPanel from './LiveExamplePropsPanel.vue'
import LiveExampleReplayPanel from './LiveExampleReplayPanel.vue'
import LiveExampleRunEvidence from './LiveExampleRunEvidence.vue'
import LiveExampleScenarioCoverage from './LiveExampleScenarioCoverage.vue'
import LiveExampleScenarioStrip from './LiveExampleScenarioStrip.vue'
import LiveExampleScenarioTestPlan from './LiveExampleScenarioTestPlan.vue'
import LiveExampleSourcePanel from './LiveExampleSourcePanel.vue'
import LiveExampleSyncSnapshot from './LiveExampleSyncSnapshot.vue'
import LiveExampleToolbar from './LiveExampleToolbar.vue'
import {
  builtinThemes,
  yokCandy,
  yokClean,
  yokLight,
  type YokThemeName,
  type YokThemeTokens
} from '@yok-ui/themes'
import {
  getLiveExampleComponentMeta,
  getLiveExampleScenarios,
  getLiveExampleValidationSummary,
  type LiveExamplePreset,
  type LiveExampleScenario,
  type LiveExampleScenarioKind
} from '../data/liveExamples'
import { componentApis, type ApiRow, type ComponentApi } from '../data/componentRegistry'
import {
  interactionContracts,
  type InteractionContract
} from '../data/interactionContracts'
import { getPlaygroundComponentForPreset } from '../data/playgroundExamples'

interface Props {
  preset?: LiveExamplePreset
  title?: string
  description?: string
}

const advancedLiveExampleHashes = [
  '#live-example-acceptance',
  '#live-example-scenario-coverage',
  '#live-example-api-map',
  '#live-example-debugger',
  '#live-example-sync-snapshot',
  '#live-example-test-plan',
  '#live-example-interaction-contract'
] as const

interface ValidationIssue {
  kind: 'empty' | 'security' | 'tag' | 'attribute' | 'render'
  templateLine: number
  sourceLine: number
  excerpt: string
  suggestion: string
}

type LiveControlType = 'text' | 'number' | 'boolean' | 'select' | 'range'

interface LiveControlOption {
  label: string
  value: string
}

interface LiveControlField {
  key: string
  label: string
  type: LiveControlType
  defaultValue: string | number | boolean
  helper?: string
  min?: number
  max?: number
  step?: number
  options?: LiveControlOption[]
}

interface LiveExampleRecipe {
  title: string
  description: string
  controls: LiveControlField[]
  build: (state: Record<string, string | number | boolean>) => string
}

type PreviewSliderModel = number | number[]
type PreviewInputNumberModel = number | null
type PreviewStringModel = string
type PreviewBooleanModel = boolean
type PreviewRadioModel = string | number
type PreviewSelectModel = string | string[]
type PreviewCascaderModel = string[] | string[][]
type PreviewUploadModel = YUploadFile[]
interface PreviewUploadRejectedFile {
  id?: string
  name: string
  size: number
  type?: string
  reason: YUploadRejectReason | string
  message?: string
}

interface EventLogItem {
  id: number
  component: string
  event: string
  payload: string
  rawPayloads: unknown[]
}

interface ScenarioTestStep {
  title: string
  detail: string
}

interface InteractionContractCheck {
  label: string
  value: string
  detail: string
}

interface ScenarioCoverageItem {
  kind: LiveExampleScenarioKind
  label: string
  count: number
  passed: boolean
  detail: string
}

interface RunEvidenceItem {
  key: 'preview' | 'scenario' | 'api' | 'coverage' | 'a11y' | 'export'
  label: string
  value: string
  detail: string
  passed: boolean
}

interface InteractionReplayStep {
  key: 'hydrate' | 'scenario' | 'controls' | 'event' | 'assert'
  label: string
  detail: string
  passed: boolean
}

interface InteractionReplayEvidenceItem {
  key: 'context' | 'events' | 'controls' | 'assertions'
  label: string
  value: string
  detail: string
  passed: boolean
}

interface SourceDiffRow {
  key: string
  kind: 'same' | 'added' | 'removed'
  lineNumber: string
  text: string
}

type ApiSectionKey = 'props' | 'events' | 'slots' | 'methods' | 'types'

interface LiveExampleApiSectionItem {
  key: ApiSectionKey
  label: string
  total: number
  used: number
  status: 'covered' | 'partial' | 'empty'
  detail: string
  samples: Array<{
    name: string
    href: string
  }>
  href: string
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'default',
  title: '',
  description: ''
})

const fallbackSelectOptions = [
  { label: 'Core primitives', value: 'core' },
  { label: 'Product tools', value: 'product' },
  { label: 'Admin workflow', value: 'admin' }
]
const fallbackLargeSelectOptions = Array.from({ length: 1000 }, (_, index) => ({
  label: `Package ${index + 1}`,
  value: `pkg-${index + 1}`
}))
const fallbackDisabledSelectOptions = [
  { label: 'Core primitives', value: 'core' },
  { label: 'Product tools', value: 'product' },
  { label: 'Admin workflow', value: 'admin', disabled: true }
]
const fallbackCheckboxGroupOptions = [
  { label: 'Core', value: 'core', description: 'Base components and theme tokens.' },
  { label: 'Docs', value: 'docs', description: 'Examples, API tables and a11y notes.' },
  { label: 'Admin', value: 'admin', description: 'Workflow components for consoles.', disabled: true },
  { label: 'Brand', value: 'brand', description: 'Personal site and product landing blocks.' }
]
const fallbackReleaseChecklistOptions = [
  { label: 'API reviewed', value: 'api', description: 'Props and events match the generated API table.' },
  { label: 'A11y notes included', value: 'a11y', description: 'Keyboard and screen reader expectations are documented.' },
  { label: 'Visual regression pending', value: 'visual', description: 'Mark this when desktop and mobile screenshots pass.' },
  { label: 'Owner approval', value: 'owner', description: 'Locked until the package owner approves.', disabled: true }
]
const fallbackGroupedSelectOptions = [
  { label: 'Button', value: 'button', group: 'Basic' },
  { label: 'Divider', value: 'divider', group: 'Basic' },
  { label: 'Input', value: 'input', group: 'Form' },
  { label: 'Select', value: 'select', group: 'Form' },
  { label: 'Tooltip', value: 'tooltip', group: 'Overlay' }
]
const fallbackAutocompleteOptions = [
  { label: 'Button', value: 'button', description: 'Basic action component.' },
  { label: 'Autocomplete', value: 'autocomplete', description: 'Free text input with suggestions.' },
  { label: 'Select', value: 'select', description: 'Bounded option picker.' },
  { label: 'Cascader', value: 'cascader', description: 'Hierarchical path picker.' },
  { label: 'Data Table', value: 'data-table', description: 'Admin data workflow component.' },
  { label: 'Tour', value: 'tour', description: 'Step-by-step guidance overlay.' },
  { label: 'Experimental Remote Item', value: 'remote-item', description: 'Visible but disabled during loading.', disabled: true }
]
const fallbackMentionOptions = [
  { label: 'Ada Lovelace', value: 'ada', description: 'Core maintainer' },
  { label: 'Grace Hopper', value: 'grace', description: 'Compiler team' },
  { label: 'Lin Design', value: 'lin-design', description: 'Design system owner' },
  { label: 'Release Notes', value: 'release-notes', description: 'Documentation topic' },
  { label: 'Blocked User', value: 'blocked', description: 'No longer available', disabled: true }
]
const fallbackTabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Usage', value: 'usage' },
  { label: 'API', value: 'api' },
  { label: 'Review', value: 'error' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Keyboard', value: 'keyboard' }
]
const fallbackCarouselItems = [
  {
    title: 'Design tokens',
    description: 'Semantic color, radius and density tokens keep carousel slides aligned with the system.',
    meta: 'Core',
    tone: 'primary'
  },
  {
    title: 'Live example',
    description: 'Runnable examples connect props, events, source copy and Playground handoff.',
    meta: 'Docs',
    tone: 'success'
  },
  {
    title: 'A11y contract',
    description: 'Keyboard navigation, region labels and indicator semantics are documented with every release.',
    meta: 'Quality',
    tone: 'warning'
  }
]
const fallbackMenuItems = [
  { label: 'Guide', value: 'guide', icon: 'G' },
  {
    label: 'Components',
    value: 'components',
    icon: 'C',
    children: [
      { label: 'Button', value: 'button' },
      { label: 'Menu', value: 'menu' },
      { label: 'Data Table', value: 'data-table' }
    ]
  },
  {
    label: 'Resources',
    value: 'resources',
    icon: 'R',
    children: [
      { label: 'API Reference', value: 'api-reference' },
      { label: 'Maturity', value: 'maturity' }
    ]
  },
  { label: 'Disabled', value: 'disabled', icon: 'D', disabled: true }
]
const fallbackAnchorItems = [
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
const fallbackColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Owner' }
]
const fallbackTableData = [
  { id: '1', name: 'Button docs', status: 'Stable', owner: 'Core', detail: 'Button docs include variants, icon buttons, loading and keyboard states.' },
  { id: '2', name: 'Live runner', status: 'Beta', owner: 'Docs', detail: 'Live runner links scenario controls, source copy, API evidence and Playground handoff.' },
  { id: '3', name: 'Theme lab', status: 'Stable', owner: 'Resources', detail: 'Theme lab audits tokens, semantic colors and density previews.' }
]
const fallbackInteractiveTableColumns = [
  { key: 'name', label: 'Component', sortable: true },
  {
    key: 'status',
    label: 'Status',
    filters: [
      { text: 'Stable', value: 'Stable' },
      { text: 'Beta', value: 'Beta' }
    ]
  },
  { key: 'owner', label: 'Owner' },
  { key: 'stars', label: 'Stars', align: 'right' as const, sortable: true }
]
const fallbackInteractiveTableData = [
  { id: 'button', name: 'YButton', status: 'Stable', owner: 'Core team', stars: 12, detail: 'Primary actions, icon buttons and loading states.' },
  { id: 'table', name: 'YTable', status: 'Stable', owner: 'Data team', stars: 9, detail: 'Selection, sorting, filters and expandable details.' },
  { id: 'popover', name: 'YPopover', status: 'Beta', owner: 'Overlay team', stars: 5, detail: 'Anchored overlay built on Floating UI.' }
]
const fallbackFormModel = {
  name: 'Yok UI',
  owner: 'Core team'
}
const fallbackSchemaFormFields = [
  {
    key: 'name',
    label: 'Component name',
    placeholder: 'YButton',
    required: true,
    rules: { min: 3, message: 'Name must be at least 3 characters.' }
  },
  {
    key: 'packageName',
    label: 'Package',
    type: 'select',
    required: true,
    options: [
      { label: 'Core', value: 'core' },
      { label: 'Admin', value: 'admin' }
    ]
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'Basic', value: 'basic' },
      { label: 'Custom', value: 'custom' }
    ]
  },
  {
    key: 'customReason',
    label: 'Custom reason',
    type: 'textarea',
    visibleWhen: (model: Record<string, unknown>) => model.category === 'custom',
    rules: {
      validator: (value: unknown, model: Record<string, unknown>) =>
        model.category !== 'custom' || Boolean(value) || 'Explain the custom category.'
    }
  },
  {
    key: 'enabled',
    label: 'Enable component',
    type: 'switch'
  },
  {
    key: 'reviewers',
    label: 'Reviewers',
    type: 'array',
    itemLabel: 'Reviewer',
    addText: 'Add reviewer',
    removeText: 'Remove reviewer',
    emptyText: 'No reviewers yet',
    defaultItem: { id: '', name: '', role: 'Core review' },
    itemKey: 'id',
    itemFields: [
      { key: 'name', label: 'Reviewer name', placeholder: 'Ada', required: true },
      { key: 'role', label: 'Review role', placeholder: 'Design review', helper: 'Choose the review responsibility.' }
    ],
    min: 1,
    max: 3
  }
]
const fallbackSchemaFormModels = {
  ready: {
    name: 'YButton',
    packageName: 'core',
    category: 'basic',
    customReason: '',
    enabled: true,
    reviewers: [
      { id: 'reviewer-ada', name: 'Ada', role: 'Design review' },
      { id: 'reviewer-lin', name: 'Lin', role: 'Docs review' }
    ]
  },
  invalid: {
    name: 'Yo',
    packageName: '',
    category: 'custom',
    customReason: '',
    enabled: false,
    reviewers: [
      { id: 'reviewer-empty', name: '', role: 'Design review' }
    ]
  },
  custom: {
    name: 'YWorkflow',
    packageName: 'admin',
    category: 'custom',
    customReason: 'Combines schema, summary and conditional fields.',
    enabled: true,
    reviewers: [
      { id: 'reviewer-ada', name: 'Ada', role: 'Design review' },
      { id: 'reviewer-lin', name: 'Lin', role: 'Docs review' }
    ]
  }
}
const fallbackFieldArrayItems = [
  { id: 'reviewer-ada', name: 'Ada', role: 'Design review' },
  { id: 'reviewer-lin', name: 'Lin', role: 'Docs review' }
]
const fallbackFieldArrayItem = {
  id: '',
  name: '',
  role: 'Core review'
}
const fallbackCascaderOptions = [
  {
    value: 'core',
    label: 'Core',
    children: [
      {
        value: 'form',
        label: 'Form',
        children: [
          { value: 'select', label: 'Select' },
          { value: 'cascader', label: 'Cascader' }
        ]
      },
      {
        value: 'feedback',
        label: 'Feedback',
        children: [
          { value: 'tooltip', label: 'Tooltip' },
          { value: 'popover', label: 'Popover' }
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
const fallbackRemoteCascaderOptions: YCascaderOption[] = [
  { value: 'core', label: 'Core package' },
  { value: 'product', label: 'Product package' },
  { value: 'archived', label: 'Archived package', isLeaf: true }
]
const fallbackRemoteCascaderChildren: Record<string, YCascaderOption[]> = {
  core: [
    { value: 'form', label: 'Form controls' },
    { value: 'feedback', label: 'Feedback' }
  ],
  'core.form': [
    { value: 'cascader', label: 'Cascader', isLeaf: true },
    { value: 'select', label: 'Select', isLeaf: true }
  ],
  'core.feedback': [
    { value: 'tooltip', label: 'Tooltip', isLeaf: true },
    { value: 'message', label: 'Message', isLeaf: true }
  ],
  product: [
    { value: 'command-palette', label: 'Command Palette', isLeaf: true },
    { value: 'theme-switcher', label: 'Theme Switcher', isLeaf: true }
  ]
}
const fallbackDateShortcuts = [
  { label: 'Today', value: '2026-06-13' },
  { label: 'Review day', value: '2026-06-15', time: '10:00', description: 'Design and QA review' },
  { label: 'Launch day', value: '2026-07-01', time: '20:30', description: 'Low traffic release window' }
]

function disableWeekendDate(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}

function disableAfterWorkTime(time: { hour: number }) {
  return time.hour >= 18
}

function loadFallbackCascaderOptions(_option: YCascaderOption, path: YCascaderOption[]) {
  const pathKey = path.map((item) => item.value).join('.')

  return Promise.resolve(fallbackRemoteCascaderChildren[pathKey] ?? [])
}

const fallbackDateRangeShortcuts = [
  { label: 'Sprint', value: ['2026-06-13', '2026-06-20'] },
  { label: 'Release week', value: ['2026-07-01', '2026-07-07'], time: '20:30-09:00', description: 'Night release freeze' },
  { label: 'Planning', value: ['2026-06-24', '2026-06-26'], time: '10:00-17:00', description: 'Roadmap workshop' }
]
const fallbackTransferOptions = [
  { value: 'docs', label: 'Docs editor', description: 'Create and update documentation' },
  { value: 'release', label: 'Release manager', description: 'Publish packages and notes' },
  { value: 'theme', label: 'Theme designer', description: 'Edit tokens and palettes' },
  { value: 'admin', label: 'Admin', description: 'Manage protected console settings' }
]
const fallbackRadioOptions = [
  { label: 'Core', value: 'core', description: 'Base components and theme tokens.' },
  { label: 'Product', value: 'product', description: 'Docs, copy and theme tools.' },
  { label: 'Admin', value: 'admin', description: 'Console workflow components.', disabled: true }
]
const fallbackRateTexts = ['Poor', 'Fair', 'Good', 'Great', 'Excellent']
const fallbackColorPresets = ['#14B8A6', '#38BDF8', '#A78BFA', '#F472B6', '#FBBF24']
const fallbackDropdownItems = [
  { label: 'View docs', value: 'docs' },
  { label: 'Copy command', value: 'copy' },
  { label: 'Delete draft', value: 'delete', disabled: true }
]
const fallbackBreadcrumbItems = [
  { label: 'Guide', href: '/guide/' },
  { label: 'Components', href: '/components/' },
  { label: 'Button', current: true }
]
const fallbackStepItems = [
  { title: 'Install', description: 'Add the package.' },
  { title: 'Import', description: 'Use the component.' },
  { title: 'Ship', description: 'Publish the docs.' }
]
const fallbackTourSteps = [
  { title: 'Search docs', description: 'Use search to jump to components, guides and examples.', target: '#tour-search' },
  { title: 'Open Playground', description: 'Edit examples and export a reproduction bundle.', target: '#tour-playground' },
  { title: 'Ship evidence', description: 'Copy source, verify API coverage and publish docs.', target: '#tour-ship' }
]
const fallbackTreeNodes = [
  {
    key: 'core',
    label: 'Core',
    children: [
      { key: 'button', label: 'Button' },
      { key: 'date-picker', label: 'Date Picker' },
      { key: 'tree', label: 'Tree' }
    ]
  },
  {
    key: 'product',
    label: 'Product',
    children: [
      { key: 'command-palette', label: 'Command Palette' },
      { key: 'code-block', label: 'Code Block' }
    ]
  }
]
const fallbackUploadFiles = [
  { id: 'one', name: 'yok-ui-core.zip', size: 2480000, status: 'success', message: 'Ready' },
  { id: 'two', name: 'docs-preview.png', size: 820000, status: 'uploading', progress: 68 },
  { id: 'three', name: 'token-report.csv', size: 42000, status: 'error', message: 'Needs review' }
]
const fallbackUploadFileSets = {
  'demo-files': fallbackUploadFiles,
  'exceed-files': [
    { id: 'exceed-one', name: 'core-preview.png', size: 820000, status: 'success', message: 'Accepted' },
    { id: 'exceed-two', name: 'docs-snapshot.jpg', size: 1260000, status: 'success', message: 'Accepted' }
  ],
  'rejected-files': [
    { id: 'reject-one', name: 'component-cover.png', size: 640000, status: 'success', message: 'Accepted' }
  ],
  'request-files': [
    { id: 'request-one', name: 'release-package.zip', size: 860000, status: 'uploading', progress: 72, message: 'Uploading' },
    { id: 'request-two', name: 'release-notes.tmp', size: 12000, status: 'error', message: 'Temporary files are blocked before upload.' }
  ],
  'gallery-files': [
    {
      id: 'gallery-cover',
      name: 'component-cover.png',
      size: 640000,
      status: 'success',
      url: '/logo.svg',
      thumbUrl: '/logo.svg'
    },
    {
      id: 'gallery-snapshot',
      name: 'docs-snapshot.jpg',
      size: 1260000,
      status: 'success',
      url: '/logo.svg',
      thumbUrl: '/logo.svg'
    },
    {
      id: 'gallery-tokens',
      name: 'token-board.png',
      size: 420000,
      status: 'success',
      url: '/logo.svg',
      thumbUrl: '/logo.svg'
    }
  ]
}
const fallbackUploadRejectedFileSets = {
  'exceed-rejected-files': [
    {
      id: 'exceed-three',
      name: 'extra-token-report.pdf',
      size: 420000,
      status: 'error',
      reason: 'exceed',
      message: 'Max 2 files. Remove one item before adding more.'
    }
  ],
  'rejected-files': [
    {
      id: 'reject-two',
      name: 'guide.exe',
      size: 128000,
      status: 'error',
      reason: 'accept',
      message: 'Unsupported file type. Use PNG or JPG.'
    }
  ],
  'validation-rejected-files': [
    {
      id: 'validation-blocked',
      name: 'release-notes.exe',
      size: 128000,
      status: 'error',
      reason: 'accept',
      message: 'Only ZIP or TGZ packages can be published.'
    }
  ]
}
const fallbackUploadRequest = async (options: { onProgress: (progress: number) => void }) => {
  options.onProgress(72)

  return {
    message: 'Uploaded in demo',
    response: { id: 'demo-upload' }
  }
}
const fallbackUploadBeforeUpload = (file: File) => {
  if (file.name.toLowerCase().endsWith('.tmp')) {
    return 'Temporary files are blocked before upload.'
  }
}
const fallbackCollapseItems = [
  { label: 'Usage', value: 'usage', content: 'Group long settings, FAQ content or progressive disclosure.' },
  { label: 'API', value: 'api', content: 'Use modelValue to control opened panels and keep state in the page.' },
  { label: 'Settings', value: 'settings', content: 'Accordion mode keeps one configuration group open at a time.' },
  { label: 'Summary', value: 'summary', content: 'Use shorter labels and concise content when the collapse appears on mobile.' },
  { label: 'Keyboard', value: 'keyboard', content: 'Tab reaches each trigger; Enter or Space toggles the focused panel.' },
  { label: 'Locked by release owner', value: 'locked', content: 'This panel is disabled until the release owner unlocks it.', disabled: true }
]
const fallbackSplitterPanels = [
  { key: 'navigation', label: 'Navigation', size: 28, min: 16, max: 48, collapsible: true, collapsedSize: 8 },
  { key: 'preview', label: 'Preview', size: 72, min: 36 }
]
const fallbackDescriptionItems = [
  { key: 'component', label: 'Component', value: 'YDescriptions' },
  { key: 'package', label: 'Package', value: '@yok-ui/core' },
  { key: 'status', label: 'Status', value: 'Beta' },
  { key: 'owner', label: 'Owner', value: 'Design system' },
  { key: 'notes', label: 'Notes', value: 'Readable detail pages and review side panels.', span: 2 }
]
const fallbackListItems = [
  { key: 'docs', title: 'Documentation', description: 'Write examples, API tables and accessibility notes.', meta: 'Core' },
  { key: 'tests', title: 'Test coverage', description: 'Cover rendering, empty states and slot contracts.', meta: 'Quality' },
  { key: 'release', title: 'Release notes', description: 'Summarize behavior for the next package changelog.', meta: 'DX' }
]
const fallbackTimelineItems = [
  {
    title: 'Component created',
    value: 'created',
    description: 'The first proposal and API draft were created.',
    time: '09:12',
    tone: 'success'
  },
  {
    title: 'Design reviewed',
    value: 'reviewed',
    description: 'Spacing, accessibility and docs examples were checked.',
    time: '10:30',
    tone: 'warning'
  },
  {
    title: 'Documentation published',
    value: 'published',
    description: 'The component page is now available in the docs site.',
    time: '12:00',
    tone: 'info'
  }
]
const fallbackFormSummaryErrors = [
  { fieldId: 'component-name', label: 'Component name', message: 'Component name is required.' },
  { fieldId: 'release-note', label: 'Release note', message: 'Explain the user-facing change.' }
]
const fallbackFormSummaryErrorSets = {
  default: fallbackFormSummaryErrors,
  review: [
    { fieldId: 'owner', label: 'Owner', message: 'Assign a release owner before review.' },
    { fieldId: 'risk', label: 'Risk note', message: 'Document the breaking-change risk.' }
  ],
  mobile: [
    { fieldId: 'name', label: 'Name', message: 'Required.' }
  ],
  keyboard: [
    { fieldId: 'component-name', label: 'Component name', message: 'Enter moves focus to this field.' },
    { fieldId: 'release-note', label: 'Release note', message: 'Review the linked summary target.' }
  ]
}
const fallbackCommands = [
  { id: 'docs', label: 'Open component docs' },
  { id: 'copy', label: 'Copy install command' },
  { id: 'theme', label: 'Switch theme preview' }
]
const fallbackVirtualItems = Array.from({ length: 80 }, (_, index) => ({
  id: `component-${index + 1}`,
  label: `Component row ${String(index + 1).padStart(2, '0')}`
}))
const fallbackFeatures = [
  {
    title: 'Fresh defaults',
    description: 'Soft tokens, readable spacing and clear interaction states for product pages.',
    meta: 'Theme'
  },
  {
    title: 'Editable examples',
    description: 'Run examples safely inside docs before copying code into an app.',
    meta: 'DX'
  },
  {
    title: 'Package aware',
    description: 'Core, Product, Admin and Brand components can share one route system.',
    meta: 'IA'
  }
]
const fallbackLogos = ['Core', 'Product', 'Admin', 'Brand', 'Themes']
const fallbackProfileTags = ['Vue 3', 'Docs', 'A11y']
const fallbackAdminColumns = [
  {
    key: 'name',
    label: 'Component',
    sortable: true,
    filters: [
      { text: 'Button', value: 'Button' },
      { text: 'Table', value: 'Table' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    filters: [
      { text: 'Stable', value: 'Stable' },
      { text: 'Beta', value: 'Beta' }
    ]
  },
  { key: 'owner', label: 'Owner' },
  { key: 'updated', label: 'Updated' }
]
const fallbackAdminRows = [
  { id: 'button', name: 'Button', status: 'Stable', owner: 'Core team', updated: '2026-06-13' },
  { id: 'data-table', name: 'Data Table', status: 'Beta', owner: 'Admin team', updated: '2026-06-16' },
  { id: 'theme', name: 'Theme Lab', status: 'Stable', owner: 'Design system', updated: '2026-06-15' },
  { id: 'review', name: 'Review Workflow', status: 'Beta', owner: 'Ops team', updated: '2026-06-14' }
]
const fallbackLargeAdminRows = Array.from({ length: 1000 }, (_, index) => {
  const source = fallbackAdminRows[index % fallbackAdminRows.length]

  return {
    ...source,
    id: `component-${index + 1}`,
    name: `${source.name} ${index + 1}`,
    status: index % 3 === 0 ? 'Stable' : 'Beta',
    owner: index % 2 === 0 ? 'Core team' : 'Admin team',
    updated: `2026-06-${String(1 + (index % 28)).padStart(2, '0')}`
  }
})
const fallbackSearchFields = [
  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Choose status',
    options: [
      { label: 'Stable', value: 'stable' },
      { label: 'Beta', value: 'beta' },
      { label: 'Planned', value: 'planned' }
    ]
  },
  {
    key: 'package',
    label: 'Package',
    type: 'select',
    placeholder: 'Choose package',
    options: [
      { label: 'Core', value: 'core' },
      { label: 'Product', value: 'product' },
      { label: 'Admin', value: 'admin' }
    ]
  },
  { key: 'owner', label: 'Owner', placeholder: 'Design system' }
]
const fallbackSearchModel = {
  keyword: 'table',
  status: 'beta',
  package: 'admin'
}
const fallbackFilterTabs = [
  { label: 'All', value: 'all', count: 73, tone: 'info' },
  { label: 'Stable', value: 'stable', count: 40, tone: 'success' },
  { label: 'Needs review', value: 'review', count: 12, tone: 'warning' },
  { label: 'Blocked', value: 'blocked', count: 2, tone: 'danger', disabled: true }
]
const fallbackBulkActions = [
  { label: 'Publish', value: 'publish', tone: 'success' },
  { label: 'Assign owner', value: 'assign', tone: 'info' },
  { label: 'Archive', value: 'archive', tone: 'danger' }
]
const fallbackBulkSelection = ['button', 'data-table', 'review']
const fallbackStatusTimelineItems = [
  {
    title: 'Draft created',
    value: 'draft',
    description: 'Initial component proposal and API notes were saved.',
    time: '09:10',
    actor: 'Design system',
    tone: 'success',
    status: 'Done'
  },
  {
    title: 'Implementation review',
    value: 'review',
    description: 'Keyboard flow, live example and table states are being checked.',
    time: '10:40',
    actor: 'Core reviewer',
    tone: 'info',
    status: 'Active'
  },
  {
    title: 'Release approval',
    value: 'approval',
    description: 'Package changelog and migration notes still need approval.',
    time: 'Tomorrow',
    actor: 'Maintainer',
    tone: 'warning',
    status: 'Pending'
  }
]
const fallbackReviewSteps = [
  {
    title: 'Submitted',
    value: 'submitted',
    description: 'The component update was submitted with docs and tests.',
    time: '09:30',
    actor: 'Yok Designer',
    tone: 'success',
    status: 'Done'
  },
  {
    title: 'Reviewing',
    value: 'reviewing',
    description: 'A maintainer is checking API stability and accessibility notes.',
    time: 'Now',
    actor: 'Maintainer',
    tone: 'info',
    status: 'In review'
  },
  {
    title: 'Approved',
    value: 'approved',
    description: 'Ready for changelog and release notes.',
    tone: 'neutral',
    status: 'Waiting'
  }
]
const fallbackSavedViews = [
  { label: 'My review queue', value: 'mine', description: 'Assigned to me', count: 8, pinned: true },
  { label: 'Needs live example', value: 'live', description: 'Docs without runner', count: 12, pinned: true },
  { label: 'Release candidates', value: 'release', description: 'Stable APIs for next tag', count: 5 },
  { label: 'Accessibility pass', value: 'a11y', description: 'Components needing audit', count: 3 }
]
const fallbackDataViewViews = [
  {
    label: 'Beta review',
    value: 'beta',
    description: 'Components waiting for API and live example review.',
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
    label: 'Stable core',
    value: 'stable',
    description: 'Stable components ready for package documentation.',
    count: 2,
    pinned: true,
    preference: {
      columnKeys: ['status', 'name', 'owner'],
      columnWidths: { status: 148, name: 212 },
      density: 'comfortable',
      filters: { status: ['Stable'] }
    }
  },
  {
    label: 'Filtered launch',
    value: 'filtered',
    description: 'Saved filter set for release readiness checks.',
    count: 3,
    preference: {
      columnKeys: ['name', 'owner', 'status'],
      columnWidths: { name: 176, owner: 144 },
      density: 'compact',
      filters: { owner: ['Admin team'] }
    }
  },
  {
    label: 'Mobile audit',
    value: 'mobile',
    description: 'Compact view for narrow review surfaces.',
    count: 2,
    preference: {
      columnKeys: ['name', 'status'],
      columnWidths: { name: 168 },
      density: 'compact',
      filters: {}
    }
  }
]

const presetExamples: Record<LiveExamplePreset, string> = {
  default: [
  '<script setup lang="ts">',
  "import { YButton, YAlert, YProgress, YTag } from '@yok-ui/core'",
  '</' + 'script>',
  '',
  '<template>',
  '  <div class="demo-stack">',
  '    <YAlert tone="success" title="Live runner ready" closable>',
  '      Edit the template and watch Yok UI render instantly.',
  '    </YAlert>',
  '    <div class="demo-row">',
  '      <YButton variant="primary" size="md">Deploy docs</YButton>',
  '      <YTag tone="info">Fresh cute</YTag>',
  '    </div>',
  '    <YProgress :value="72" tone="primary" label="Documentation polish" striped />',
  '  </div>',
  '</template>'
  ].join('\n'),
  button: [
    '<script setup lang="ts">',
    "import { YButton, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <div class="demo-row">',
    '      <YButton variant="primary" size="lg">Create component</YButton>',
    '      <YButton variant="secondary" size="lg">Save draft</YButton>',
    '      <YButton variant="ghost" size="lg">Preview</YButton>',
    '    </div>',
    '    <YTag tone="info">Button group</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  avatar: [
    '<script setup lang="ts">',
    "import { YAvatar, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <div class="demo-row">',
    '      <YAvatar name="Yok UI" />',
    '      <YAvatar name="Admin User" tone="success" />',
    '      <YAvatar name="Brand Maker" size="lg" shape="square" tone="warning" />',
    '      <YAvatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop" src-set="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=192&h=192&fit=crop 2x" alt="Yok designer" fit="cover" />',
    '    </div>',
    '    <YTag tone="info">Stable initials, image fit, tone and size states.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  affix: [
    '<script setup lang="ts">',
    "import { YAffix, YButton, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YAffix :offset="24" aria-label="Sticky release toolbar">',
    '    <div class="demo-row">',
    '      <YButton variant="primary" size="sm">Publish docs</YButton>',
    '      <YTag tone="info">Sticky action</YTag>',
    '    </div>',
    '  </YAffix>',
    '</template>'
  ].join('\n'),
  anchor: [
    '<script setup lang="ts">',
    "import { YAnchor } from '@yok-ui/core'",
    '',
    'const anchorItems = [',
    "  { title: 'Usage', href: '#usage' },",
    "  { title: 'API', href: '#api', children: [{ title: 'Props', href: '#props' }] },",
    "  { title: 'Accessibility', href: '#accessibility' }",
    ']',
    '</' + 'script>',
    '',
    '<template>',
    '  <YAnchor :items="anchorItems" model-value="#api" aria-label="Component sections" />',
    '</template>'
  ].join('\n'),
  icon: [
    '<script setup lang="ts">',
    "import { YIcon, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <div class="demo-row">',
    '      <YIcon size="lg" color="#0f766e" label="Stable">',
    '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
    '          <path d="M20 6 9 17l-5-5" />',
    '        </svg>',
    '      </YIcon>',
    '      <YIcon size="lg" color="#38bdf8">',
    '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
    '          <path d="M12 2v20M2 12h20" />',
    '        </svg>',
    '      </YIcon>',
    '      <YIcon size="lg" color="#f59e0b" spinning label="Loading">',
    '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
    '          <path d="M21 12a9 9 0 1 1-3-6.7" />',
    '        </svg>',
    '      </YIcon>',
    '    </div>',
    '    <YTag tone="info">SVG slot, semantic label and stable sizing.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  backtop: [
    '<script setup lang="ts">',
    "import { YBacktop, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YTag tone="info">Backtop is shown as a fixed page helper in this runner.</YTag>',
    '    <YBacktop :visibility-height="160" :right="24" :bottom="24" />',
    '  </div>',
    '</template>'
  ].join('\n'),
  floatButton: [
    '<script setup lang="ts">',
    "import { YFloatButton, YFloatButtonGroup } from '@yok-ui/core'",
    '',
    'const floatActions = [',
    "  { key: 'create', label: 'Create component', icon: '+' },",
    "  { key: 'docs', label: 'Open docs', icon: '?' },",
    "  { key: 'feedback', label: 'Send feedback', icon: '!' }",
    ']',
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YFloatButton label="Create component" tooltip="Create" type="primary" icon="+" :right="96" :bottom="24" />',
    '    <YFloatButtonGroup label="Quick actions" :items="floatActions" :open="true" shape="square" icon="⋯" />',
    '  </div>',
    '</template>'
  ].join('\n'),
  divider: [
    '<script setup lang="ts">',
    "import { YDivider, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YDivider label="Core" align="start" />',
    '    <div class="demo-row"><YTag>Button</YTag><YTag>Input</YTag><YTag>Modal</YTag></div>',
    '    <YDivider label="Product" />',
    '    <div class="demo-row"><YTag tone="info">Command Palette</YTag><YTag tone="info">Code Block</YTag></div>',
    '  </div>',
    '</template>'
  ].join('\n'),
  space: [
    '<script setup lang="ts">',
    "import { YButton, YSpace, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YSpace wrap size="md">',
    '    <YButton variant="primary">Publish</YButton>',
    '    <YButton variant="secondary">Save draft</YButton>',
    '    <YTag tone="success">Stable spacing</YTag>',
    '  </YSpace>',
    '</template>'
  ].join('\n'),
  splitter: [
    '<script setup lang="ts">',
    "import { YSplitter, YTag } from '@yok-ui/core'",
    '',
    'const splitterPanels = [',
    "  { key: 'navigation', label: 'Navigation', size: 28, min: 16, max: 48, collapsible: true, collapsedSize: 8 },",
    "  { key: 'preview', label: 'Preview', size: 72, min: 36 }",
    ']',
    '</' + 'script>',
    '',
    '<template>',
    '  <YSplitter :panels="splitterPanels" height="240px">',
    '    <template #navigation>',
    '      <YTag tone="info">Docs navigation</YTag>',
    '    </template>',
    '    <template #preview>',
    '      <YTag tone="success">Live preview keeps the remaining space.</YTag>',
    '    </template>',
    '  </YSplitter>',
    '</template>'
  ].join('\n'),
  scrollbar: [
    '<script setup lang="ts">',
    "import { YScrollbar, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YScrollbar :height="180" aria-label="Component changelog">',
    '    <div class="demo-stack">',
    '      <YTag tone="success">Stable Button docs</YTag>',
    '      <YTag tone="info">Live Example source panel</YTag>',
    '      <YTag tone="warning">Theme tokens review</YTag>',
    '      <YTag tone="success">Scrollbar added to Basic</YTag>',
    '      <YTag tone="info">Keyboard focusable viewport</YTag>',
    '    </div>',
    '  </YScrollbar>',
    '</template>'
  ].join('\n'),
  link: [
    '<script setup lang="ts">',
    "import { YLink, YSpace } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YSpace wrap>',
    '    <YLink href="/guide/introduction">Read guide</YLink>',
    '    <YLink href="https://github.com" external tone="info">GitHub</YLink>',
    '    <YLink href="/danger" tone="danger" underline="always">Remove draft</YLink>',
    '  </YSpace>',
    '</template>'
  ].join('\n'),
  text: [
    '<script setup lang="ts">',
    "import { YText, YSpace } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YSpace direction="vertical" align="start">',
    '    <YText strong>Fresh cute typography</YText>',
    '    <YText tone="secondary">Use semantic text instead of one-off CSS.</YText>',
    '    <YText code>componentRegistry</YText>',
    '  </YSpace>',
    '</template>'
  ].join('\n'),
  tagBadge: [
    '<script setup lang="ts">',
    "import { YAvatar, YBadge, YButton, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <div class="demo-row">',
    '      <YTag>Neutral</YTag>',
    '      <YTag tone="success">Stable</YTag>',
    '      <YTag tone="warning">Beta</YTag>',
    '      <YTag tone="danger">Deprecated</YTag>',
    '      <YTag tone="info">Roadmap</YTag>',
    '    </div>',
    '    <div class="demo-row">',
    '      <YBadge :value="120" :max="99" label="More than 99 unread notifications" />',
    '      <YBadge value="new" tone="info" label="New feature available" />',
    '      <YBadge dot tone="success" label="Online status">',
    '        <YAvatar name="Yok UI" />',
    '      </YBadge>',
    '      <YBadge dot text="Online" tone="success" size="lg" label="Online status" />',
    '      <YBadge :value="3" tone="danger" label="3 release blockers">',
    '        <YButton variant="secondary">Release</YButton>',
    '      </YBadge>',
    '    </div>',
    '  </div>',
    '</template>'
  ].join('\n'),
  input: [
    '<script setup lang="ts">',
    "import { YInput, YAlert } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YInput label="Library name" model-value="Yok UI" placeholder="Input library name" />',
    '    <YInput label="Repository" model-value="yok-ui" />',
    '    <YAlert tone="success" title="Form field ready">Inputs keep label, value and error states readable.</YAlert>',
    '  </div>',
    '</template>'
  ].join('\n'),
  autocomplete: [
    '<script setup lang="ts">',
    "import { YAutocomplete, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YAutocomplete label="Component" model-value="auto" placeholder="Search components" clearable />',
    '    <YTag tone="success">Suggestions are provided by the docs runner.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  mention: [
    '<script setup lang="ts">',
    "import { YMention, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YMention label="Release note" model-value="Please review @ad" placeholder="Type @ to mention" clearable />',
    '    <YTag tone="success">Mention options are provided by the docs runner.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  textarea: [
    '<script setup lang="ts">',
    "import { YTextarea, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YTextarea label="Release note" model-value="Yok UI live examples now track coverage." helper="Use textarea for notes and long-form input." :rows="4" />',
    '    <YTextarea label="Blocked state" model-value="Needs review" error="Please explain the blocker." :rows="3" />',
    '    <YTag tone="success">Textarea keeps helper, error and row states visible.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  radioGroup: [
    '<script setup lang="ts">',
    "import { YRadioGroup, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YRadioGroup label="Package focus" description="Choose one package for this release." model-value="core" />',
    '    <YTag tone="info">Options are provided by the docs runner.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  select: [
    '<script setup lang="ts">',
    "import { YSelect, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YSelect label="Package" model-value="core" />',
    '    <YTag tone="success">Options are provided by the docs runner.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  dropdown: [
    '<script setup lang="ts">',
    "import { YDropdown, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YDropdown label="Actions" align="end" open />',
    '    <YTag tone="success">Menu items are provided by the docs runner.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  popover: [
    '<script setup lang="ts">',
    "import { YPopover, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YPopover title="Coverage note" content="Add live examples before marking a component documented." open placement="bottom">',
    '      <YTag tone="info">Panel content can carry compact guidance.</YTag>',
    '    </YPopover>',
    '  </div>',
    '</template>'
  ].join('\n'),
  cascader: [
    '<script setup lang="ts">',
    "import { YCascader, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YCascader label="Component path" model-value="core,form,cascader" placeholder="Choose component" />',
    '    <YCascader label="Access scopes" model-value="core,form,select|admin,data,data-table" multiple />',
    '    <YTag tone="info">Options are provided by the docs runner.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  carousel: [
    '<script setup lang="ts">',
    "import { YCarousel } from '@yok-ui/core'",
    '',
    'const carouselItems = [',
    "  { title: 'Design tokens', description: 'Theme primitives and semantic colors.', meta: 'Core' },",
    "  { title: 'Live examples', description: 'Runnable examples with API evidence.', meta: 'Docs', tone: 'success' },",
    "  { title: 'Accessibility', description: 'Keyboard and screen reader contracts.', meta: 'A11y', tone: 'warning' }",
    ']',
    '</' + 'script>',
    '',
    '<template>',
    '  <YCarousel :items="carouselItems" aria-label="Yok UI maturity carousel" />',
    '</template>'
  ].join('\n'),
  datePicker: [
    '<script setup lang="ts">',
    "import { YDatePicker, YTag, type YDateShortcut } from '@yok-ui/core'",
    'const dateShortcuts: YDateShortcut[] = [',
    "  { label: 'Today', value: '2026-06-13' },",
    "  { label: 'Review day', value: '2026-06-15', time: '10:00', description: 'Design and QA review' },",
    "  { label: 'Launch day', value: '2026-07-01', time: '20:30', description: 'Low traffic release window' }",
    ']',
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YDatePicker label="Release date" model-value="2026-06-13" />',
    '    <YDatePicker label="Review date" placeholder="Pick a weekday" :shortcuts="dateShortcuts" />',
    '    <YTag tone="info">Shortcuts include time preset metadata.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  dateRangePicker: [
    '<script setup lang="ts">',
    "import { YDateRangePicker, YTag, type YDateRangeShortcut } from '@yok-ui/core'",
    'const rangeShortcuts: YDateRangeShortcut[] = [',
    "  { label: 'Sprint', value: ['2026-06-13', '2026-06-20'] },",
    "  { label: 'Release week', value: ['2026-07-01', '2026-07-07'], time: '20:30-09:00', description: 'Night release freeze' },",
    "  { label: 'Planning', value: ['2026-06-24', '2026-06-26'], time: '10:00-17:00', description: 'Roadmap workshop' }",
    ']',
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YDateRangePicker label="Sprint range" model-value="2026-06-13,2026-06-20" :shortcuts="rangeShortcuts" />',
    '    <YDateRangePicker label="Booking window" placeholder="Choose a date range" />',
    '    <YTag tone="info">Range shortcuts include time window metadata.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  alert: [
    '<script setup lang="ts">',
    "import { YAlert, YButton } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YAlert tone="warning" title="Check changes" closable>',
    '      Alerts should be concise and tied to a clear next action.',
    '    </YAlert>',
    '    <YButton variant="secondary">View details</YButton>',
    '  </div>',
    '</template>'
  ].join('\n'),
  progress: [
    '<script setup lang="ts">',
    "import { YProgress, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YProgress :value="42" tone="primary" label="Core coverage" striped />',
    '    <YProgress :value="76" tone="success" label="Docs coverage" />',
    '    <YTag tone="info">Progress examples</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  loading: [
    '<script setup lang="ts">',
    "import { YLoading, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YLoading loading overlay text="Refreshing component list">',
    '      <div class="demo-panel">Component rows stay in place while the request runs.</div>',
    '    </YLoading>',
    '    <YTag tone="info">Use Progress for known percentages and Skeleton for layout placeholders.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  result: [
    '<script setup lang="ts">',
    "import { YResult, YButton } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YResult status="success" title="Component published" subtitle="The docs, API table and live example are ready.">',
    '    <YButton variant="primary">View release</YButton>',
    '  </YResult>',
    '</template>'
  ].join('\n'),
  popconfirm: [
    '<script setup lang="ts">',
    "import { YButton, YPopconfirm } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YPopconfirm open title="Delete draft?" description="This action only affects the current local draft." confirm-text="Delete" cancel-text="Keep">',
    '    <YButton variant="secondary">Delete draft</YButton>',
    '  </YPopconfirm>',
    '</template>'
  ].join('\n'),
  modal: [
    '<script setup lang="ts">',
    "import { YModal, YButton, YAlert } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YAlert tone="info" title="Static docs preview">The modal is rendered open inside this docs runner.</YAlert>',
    '    <YModal open title="Publish component" description="Review the release note before publishing.">',
    '      <p>Modal content should stay focused and easy to dismiss.</p>',
    '    </YModal>',
    '  </div>',
    '</template>'
  ].join('\n'),
  drawer: [
    '<script setup lang="ts">',
    "import { YDrawer, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YTag tone="info">Drawer preview</YTag>',
    '    <YDrawer open title="Component settings" description="Use drawers for secondary configuration." placement="right">',
    '      <p>Drawer content can hold forms, filters, or contextual details.</p>',
    '    </YDrawer>',
    '  </div>',
    '</template>'
  ].join('\n'),
  tabs: [
    '<script setup lang="ts">',
    "import { YTabs, YCard } from '@yok-ui/core'",
    '',
    'const tabItems = [',
    "  { label: 'Overview', value: 'overview', icon: '◎' },",
    "  { label: 'Usage', value: 'usage' },",
    "  { label: 'API', value: 'api', badge: 6 },",
    "  { label: 'Draft', value: 'draft', closable: true },",
    "  { label: 'Disabled', value: 'disabled', disabled: true }",
    ']',
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YTabs model-value="overview" :tabs="tabItems" variant="card" aria-label="Documentation sections" />',
    '    <YCard title="Active panel">Tabs keep related content in one route.</YCard>',
    '  </div>',
    '</template>'
  ].join('\n'),
  tour: [
    '<script setup lang="ts">',
    "import { YButton, YTour } from '@yok-ui/core'",
    '',
    'const tourSteps = [',
    "  { title: 'Search docs', description: 'Find components, guides and examples.', target: '#tour-search' },",
    "  { title: 'Open Playground', description: 'Edit the current example with real props.', target: '#tour-playground' }",
    ']',
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YButton id="tour-search" variant="secondary">Search docs</YButton>',
    '    <YButton id="tour-playground" variant="primary">Open Playground</YButton>',
    '    <YTour open :steps="tourSteps" :current="0" skip-text="Skip guide" />',
    '  </div>',
    '</template>'
  ].join('\n'),
  table: [
    '<script setup lang="ts">',
    "import { YTable, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YTag tone="success">Sortable table preview</YTag>',
    '    <YTable caption="Component overview" summary="3 rows · ready" striped selectable />',
    '  </div>',
    '</template>'
  ].join('\n'),
  list: [
    '<script setup lang="ts">',
    "import { YList } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YList title="Release checklist" description="Small tasks before a component is ready." bordered />',
    '    <YList title="Component tracks" layout="vertical" :columns="3" />',
    '  </div>',
    '</template>'
  ].join('\n'),
  layout: [
    '<script setup lang="ts">',
    "import { YAside, YFooter, YHeader, YLayout, YMain } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YLayout full-height aria-label="Application shell">',
    '    <YHeader bordered>Yok UI</YHeader>',
    '    <YLayout direction="horizontal">',
    '      <YAside width="220px" bordered aria-label="Primary navigation">Navigation</YAside>',
    '      <YMain>Workspace</YMain>',
    '    </YLayout>',
    '    <YFooter bordered>Footer</YFooter>',
    '  </YLayout>',
    '</template>'
  ].join('\n'),
  menu: [
    '<script setup lang="ts">',
    "import { YMenu } from '@yok-ui/core'",
    '',
    'const menuItems = [',
    "  { label: 'Guide', value: 'guide', icon: 'G' },",
    "  { label: 'Components', value: 'components', icon: 'C', children: [",
    "    { label: 'Button', value: 'button' },",
    "    { label: 'Menu', value: 'menu' }",
    '  ] },',
    "  { label: 'Resources', value: 'resources', icon: 'R' }",
    ']',
    '</' + 'script>',
    '',
    '<template>',
    '  <YMenu :items="menuItems" model-value="menu" :default-open-keys="[\'components\']" aria-label="Docs navigation" />',
    '</template>'
  ].join('\n'),
  descriptions: [
    '<script setup lang="ts">',
    "import { YDescriptions } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YDescriptions title="Component details" description="Readable metadata for detail pages." />',
    '    <YDescriptions title="Release profile" bordered layout="vertical" :column="2" />',
    '  </div>',
    '</template>'
  ].join('\n'),
  statistic: [
    '<script setup lang="ts">',
    "import { YStatistic } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-grid">',
    '    <YStatistic title="Active users" :value="112893" tone="info" />',
    '    <YStatistic title="New orders" :value="1280" prefix="+" suffix="today" tone="success" />',
    '    <YStatistic title="Risk alerts" :value="7" suffix="items" tone="warning" />',
    '  </div>',
    '</template>'
  ].join('\n'),
  timeline: [
    '<script setup lang="ts">',
    "import { YTimeline } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YTimeline title="Release activity" description="Track component work from draft to documentation." />',
    '    <YTimeline title="Alternating story" placement="alternate" size="sm" />',
    '  </div>',
    '</template>'
  ].join('\n'),
  collapse: [
    '<script setup lang="ts">',
    "import { YCollapse } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YCollapse model-value="usage,api" />',
    '    <YCollapse model-value="usage" accordion />',
    '  </div>',
    '</template>'
  ].join('\n'),
  timePicker: [
    '<script setup lang="ts">',
    "import { YTimePicker, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YTimePicker label="Start time" model-value="09:30" :minute-step="15" />',
    '    <YTimePicker label="Review time" placeholder="Before 18:00" :minute-step="30" />',
    '    <YTag tone="success">Use HH:mm values for predictable form data.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  transfer: [
    '<script setup lang="ts">',
    "import { YTransfer, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YTransfer model-value="docs,theme" filterable />',
    '    <YTag tone="info">Options are provided by the docs runner.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  tree: [
    '<script setup lang="ts">',
    "import { YTree, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YTree selected-key="button" expanded-keys="core,product" checked-keys="button" checkable />',
    '    <YTag tone="success">Tree data is provided by the docs runner.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  treeSelect: [
    '<script setup lang="ts">',
    "import { YTreeSelect, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YTreeSelect label="Component" model-value="button" default-expanded-keys="core" />',
    '    <YTag tone="success">Tree nodes are provided by the docs runner.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  form: [
    '<script setup lang="ts">',
    "import { YForm, YFormItem, YInput, YButton } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YForm label-width="96px" scroll-to-error>',
    '    <YFormItem label="Name" prop="name">',
    '      <YInput model-value="Yok UI" placeholder="Library name" />',
    '    </YFormItem>',
    '    <YFormItem label="Owner" prop="owner">',
    '      <YInput model-value="Core team" />',
    '    </YFormItem>',
    '    <YButton variant="primary">Save component</YButton>',
    '  </YForm>',
    '</template>'
  ].join('\n'),
  formItem: [
    '<script setup lang="ts">',
    "import { YFormItem, YInput } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YFormItem label="Component name" prop="component-name" hint="Use PascalCase for exported components." required>',
    '      <YInput model-value="YokButton" placeholder="Component name" />',
    '    </YFormItem>',
    '    <YFormItem label="Release note" prop="release-note" error="Release note is required.">',
    '      <YInput model-value="" placeholder="Describe the change" />',
    '    </YFormItem>',
    '  </div>',
    '</template>'
  ].join('\n'),
  formSummary: [
    '<script setup lang="ts">',
    "import { YFormSummary } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YFormSummary title="Please fix the component form" />',
    '</template>'
  ].join('\n'),
  inputNumber: [
    '<script setup lang="ts">',
    "import { YInputNumber, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YInputNumber label="Quantity" model-value="4" :min="0" :max="12" />',
    '    <YInputNumber label="Rating" model-value="4.5" :step="0.5" :precision="1" />',
    '    <YTag tone="success">Numbers stay bounded and normalized.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  rate: [
    '<script setup lang="ts">',
    "import { YRate, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YRate label="Satisfaction" model-value="4" />',
    '    <YRate label="Taste" model-value="3.5" allow-half />',
    '    <YRate label="Mood" model-value="2" icon="❤" void-icon="♡" />',
    '    <YTag tone="info">Rate is best for lightweight preference input.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  slider: [
    '<script setup lang="ts">',
    "import { YSlider, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YSlider label="Opacity" model-value="60" :min="0" :max="100" :step="5" />',
    '    <YTag tone="info">Use sliders for bounded numeric choices.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  colorPicker: [
    '<script setup lang="ts">',
    "import { YColorPicker, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YColorPicker label="Accent color" model-value="#14B8A6" />',
    '    <YTag tone="success">HEX values stay normalized and copyable.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  checkbox: [
    '<script setup lang="ts">',
    "import { YCheckbox, YCheckboxGroup, YAlert } from '@yok-ui/core'",
    '',
    'const checkboxGroupOptions = [',
    "  { label: 'Core', value: 'core', description: 'Base components and theme tokens.' },",
    "  { label: 'Docs', value: 'docs', description: 'Examples, API tables and a11y notes.' },",
    "  { label: 'Admin', value: 'admin', description: 'Workflow components for consoles.', disabled: true }",
    ']',
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YCheckbox label="Include a11y notes" description="Show keyboard and screen reader details." model-value="true" />',
    '    <YCheckboxGroup label="Release packages" description="Choose packages for this release." :model-value="[\'core\', \'docs\']" :options="checkboxGroupOptions" :max="2" direction="horizontal" />',
    '    <YAlert tone="info" title="Native input">Checkbox keeps native semantics and custom Yok UI styling.</YAlert>',
    '  </div>',
    '</template>'
  ].join('\n'),
  switch: [
    '<script setup lang="ts">',
    "import { YSwitch, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YSwitch label="Enable fresh cute mode" description="Use softer feedback states." model-value="true" active-text="Enabled" inactive-text="Disabled" />',
    '    <YTag tone="success">Instant setting preview</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  pagination: [
    '<script setup lang="ts">',
    "import { YPagination, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YPagination :page="2" :page-size="10" :total="72" />',
    '    <YTag tone="info">Use with Table, DataTable or List.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n'),
  tooltip: [
    '<script setup lang="ts">',
    "import { YTooltip, YButton } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-row">',
    '    <YTooltip content="Create a new component file" placement="top">',
    '      <YButton variant="primary">Create</YButton>',
    '    </YTooltip>',
    '    <YTooltip content="Copy install command" placement="bottom" :show-delay="240">',
    '      <YButton variant="secondary">Copy</YButton>',
    '    </YTooltip>',
    '  </div>',
    '</template>'
  ].join('\n'),
  card: [
    '<script setup lang="ts">',
    "import { YCard, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YCard title="Component depth" description="Track docs, API, live examples and a11y." interactive>',
    '      <div class="demo-row">',
    '        <YTag tone="success">Live</YTag>',
    '        <YTag tone="info">API</YTag>',
    '      </div>',
    '    </YCard>',
    '  </div>',
    '</template>'
  ].join('\n'),
  empty: [
    '<script setup lang="ts">',
    "import { YEmpty } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YEmpty title="No live example yet" description="Add an editable runner before marking the docs complete." />',
    '</template>'
  ].join('\n'),
  skeleton: [
    '<script setup lang="ts">',
    "import { YSkeleton } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <div class="demo-row">',
    '      <YSkeleton variant="circle" label="Loading profile avatar" />',
    '      <YSkeleton label="Loading profile summary" :rows="3" />',
    '    </div>',
    '    <YSkeleton variant="rect" height="112px" label="Loading preview card" />',
    '  </div>',
    '</template>'
  ].join('\n'),
  breadcrumb: [
    '<script setup lang="ts">',
    "import { YBreadcrumb } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YBreadcrumb />',
    '</template>'
  ].join('\n'),
  steps: [
    '<script setup lang="ts">',
    "import { YSteps } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YSteps :current="1" />',
    '    <YSteps direction="vertical" :current="2" />',
    '  </div>',
    '</template>'
  ].join('\n'),
  message: [
    '<script setup lang="ts">',
    "import { YMessage } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YMessage tone="success" title="Saved" closable>',
    '      Component settings have been updated.',
    '    </YMessage>',
    '    <YMessage tone="warning" title="Heads up" closable>',
    '      Admin components are still in roadmap mode.',
    '    </YMessage>',
    '  </div>',
    '</template>'
  ].join('\n'),
  messageBox: [
    '<script setup lang="ts">',
    "import { YMessageBox } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YMessageBox',
    '    open',
    '    title="Publish release?"',
    '    message="This will make the selected component release visible to users."',
    '    variant="confirm"',
    '    tone="warning"',
    '    confirm-text="Publish"',
    '    cancel-text="Review"',
    '  />',
    '</template>'
  ].join('\n'),
  qrCode: [
    '<script setup lang="ts">',
    "import { YQRCode } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YQRCode',
    '    value="https://yok-ui.dev/components/qr-code"',
    '    label="Yok UI QRCode documentation"',
    '    level="H"',
    '    :size="168"',
    '    foreground="#087f6d"',
    '    background="#ffffff"',
    '    downloadable',
    '    download-name="yok-ui-qr-code.svg"',
    '  >',
    '    Yok UI QRCode',
    '  </YQRCode>',
    '</template>'
  ].join('\n'),
  virtualList: [
    '<script setup lang="ts">',
    "import { YVirtualList } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YVirtualList :height="220" :item-height="44" aria-label="Component rows" />',
    '</template>'
  ].join('\n'),
  watermark: [
    '<script setup lang="ts">',
    "import { YCard, YTag, YWatermark } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YWatermark content="Yok UI" :gap="120" :opacity="0.12">',
    '    <YCard title="Protected preview" description="Watermark is decorative and does not block content.">',
    '      <YTag tone="info">Draft</YTag>',
    '    </YCard>',
    '  </YWatermark>',
    '</template>'
  ].join('\n'),
  commandPalette: [
    '<script setup lang="ts">',
    "import { YCommandPalette } from '@yok-ui/product'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YCommandPalette open />',
    '</template>'
  ].join('\n'),
  codeBlock: [
    '<script setup lang="ts">',
    "import { YCodeBlock, YCopyButton } from '@yok-ui/product'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YCodeBlock language="ts" code="import { YButton } from &#39;@yok-ui/core&#39;\\n\\nexport const ready = true" />',
    '    <YCopyButton text="pnpm add @yok-ui/core" />',
    '  </div>',
    '</template>'
  ].join('\n'),
  themeSwitcher: [
    '<script setup lang="ts">',
    "import { YThemeSwitcher } from '@yok-ui/product'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YThemeSwitcher model-value="yok-light" />',
    '</template>'
  ].join('\n'),
  brandHero: [
    '<script setup lang="ts">',
    "import { YBrandHero } from '@yok-ui/brand'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YBrandHero',
    '    eyebrow="Yok UI"',
    '    title="Fresh Vue components"',
    '    description="Build clear, cute and reliable product surfaces with one package family."',
    '    primary-text="Get started"',
    '    secondary-text="Browse components"',
    '  />',
    '</template>'
  ].join('\n'),
  featureGrid: [
    '<script setup lang="ts">',
    "import { YFeatureGrid } from '@yok-ui/brand'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YFeatureGrid />',
    '</template>'
  ].join('\n'),
  logoCloud: [
    '<script setup lang="ts">',
    "import { YLogoCloud } from '@yok-ui/brand'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YLogoCloud title="Used across the Yok UI package family" />',
    '</template>'
  ].join('\n'),
  profileCard: [
    '<script setup lang="ts">',
    "import { YProfileCard } from '@yok-ui/brand'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YProfileCard name="Yok Designer" role="Component librarian" bio="Builds polished docs, examples and accessible component stories." avatar-text="Y" />',
    '</template>'
  ].join('\n'),
  pageHeader: [
    '<script setup lang="ts">',
    "import { YPageHeader } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YPageHeader title="Component inventory" eyebrow="Admin" status="Live" description="Track status, owners and release readiness across the package family." />',
    '</template>'
  ].join('\n'),
  metricCard: [
    '<script setup lang="ts">',
    "import { YMetricCard } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-grid">',
    '    <YMetricCard label="Live examples" value="60" trend="+11" tone="success" description="Editable docs currently covered." />',
    '    <YMetricCard label="Needs review" value="12" trend="Admin" tone="warning" description="Workflow components still queued." />',
    '  </div>',
    '</template>'
  ].join('\n'),
  searchPanel: [
    '<script setup lang="ts">',
    "import { YSearchPanel } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YSearchPanel submit-text="Apply filters" reset-text="Clear filters" />',
    '</template>'
  ].join('\n'),
  searchForm: [
    '<script setup lang="ts">',
    "import { YSearchForm } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YSearchForm title="Component search" description="Collapse long filter groups while keeping active filters visible." />',
    '</template>'
  ].join('\n'),
  crudLayout: [
    '<script setup lang="ts">',
    "import { YCrudLayout, YDataTable, YSearchForm } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YCrudLayout title="Components" eyebrow="Admin console" status="Beta" description="A complete CRUD shell for searchable component operations." density="compact">',
    '    <YSearchForm title="Quick filters" description="Runner injects fields and values." density="compact" />',
    '    <YDataTable title="Component rows" selectable pagination :page="1" :page-size="4" />',
    '  </YCrudLayout>',
    '</template>'
  ].join('\n'),
  filterTabs: [
    '<script setup lang="ts">',
    "import { YFilterTabs } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YFilterTabs model-value="stable" aria-label="Component status filters" />',
    '</template>'
  ].join('\n'),
  dataTable: [
    '<script setup lang="ts">',
    "import { YDataTable } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YDataTable title="Component release queue" description="Selectable table with pagination, density and bulk actions." selectable pagination :page="1" :page-size="3" show-density-settings show-column-settings striped />',
    '</template>'
  ].join('\n'),
  dataView: [
    '<script setup lang="ts">',
    "import { YDataView } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YDataView title="Component review workspace" description="Saved views and table preferences stay together." saved-views-title="Saved table views" table-title="Component queue" default-view="beta" pagination :page-size="3" show-filter-summary show-density-settings show-column-settings reorderable-columns resizable />',
    '</template>'
  ].join('\n'),
  resourcePage: [
    '<script setup lang="ts">',
    "import { YResourcePage } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YResourcePage title="Component resources" description="Search, review and maintain component records." search-title="Resource filters" default-view="beta" pagination :page-size="3" selectable show-density-settings show-column-settings />',
    '</template>'
  ].join('\n'),
  fieldArray: [
    '<script setup lang="ts">',
    "import { YFieldArray } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YFieldArray title="Reviewers" description="People who need to approve this component." model-value="reviewers" item-key="id" add-text="Add reviewer" remove-text="Remove reviewer" item-label="Reviewer" />',
    '</template>'
  ].join('\n'),
  schemaForm: [
    '<script setup lang="ts">',
    "import { YSchemaForm } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YSchemaForm title="Component profile" description="Schema-driven form with validation summary." model-value="ready" submit-text="Save profile" reset-text="Restore" scroll-to-error />',
    '</template>'
  ].join('\n'),
  bulkActionBar: [
    '<script setup lang="ts">',
    "import { YBulkActionBar } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YBulkActionBar title="3 components selected" clear-text="Clear selection" />',
    '</template>'
  ].join('\n'),
  statusTimeline: [
    '<script setup lang="ts">',
    "import { YStatusTimeline } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YStatusTimeline active-value="review" aria-label="Release status timeline" />',
    '</template>'
  ].join('\n'),
  reviewWorkflow: [
    '<script setup lang="ts">',
    "import { YReviewWorkflow } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YReviewWorkflow title="Live example review" description="Approve or request changes before marking a component documented." active-value="reviewing" reviewer="Maintainer" due-text="Due today" />',
    '</template>'
  ].join('\n'),
  savedViews: [
    '<script setup lang="ts">',
    "import { YSavedViews } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YSavedViews model-value="live" title="Component views" description="Pinned filters for repeated documentation work." />',
    '</template>'
  ].join('\n'),
  dataToolbar: [
    '<script setup lang="ts">',
    "import { YButton } from '@yok-ui/core'",
    "import { YDataToolbar } from '@yok-ui/admin'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YDataToolbar title="Component queue" description="Shared toolbar for data-heavy admin surfaces." :count="73">',
    '    <YButton variant="primary">Create</YButton>',
    '    <YButton variant="secondary">Export</YButton>',
    '  </YDataToolbar>',
    '</template>'
  ].join('\n'),
  configProvider: [
    '<script setup lang="ts">',
    "import { YCascader, YButton, YColorPicker, YConfigProvider, YDatePicker, YDateRangePicker, YInput, YInputNumber, YSelect, YTag, YTextarea, YTimePicker } from '@yok-ui/core'",
    "const packageOptions = [{ label: 'Core', value: 'core' }, { label: 'Product', value: 'product' }, { label: 'Admin', value: 'admin' }]",
    "const cascaderOptions = [{ value: 'core', label: 'Core', children: [{ value: 'form', label: 'Form' }, { value: 'overlay', label: 'Overlay' }] }, { value: 'product', label: 'Product', children: [{ value: 'docs', label: 'Docs' }] }]",
    '</' + 'script>',
    '',
    '<template>',
    '  <YConfigProvider size="lg" density="compact" locale="zh-CN">',
    '    <div class="demo-stack">',
    '      <YInput label="Library name" model-value="Yok UI" />',
    '      <YTextarea label="Release note" model-value="Config applies here too." />',
    '      <YInputNumber label="Version" :model-value="6" />',
    '      <YSelect label="Package" model-value="core" :options="packageOptions" />',
    '      <YDatePicker model-value="2026-06-13" label="Release date" />',
    '      <YDateRangePicker :model-value="[\'2026-06-13\', \'2026-06-20\']" label="Sprint range" />',
    '      <YTimePicker model-value="09:30" label="Review time" />',
    '      <YCascader :model-value="[\'core\', \'form\']" :options="cascaderOptions" label="Component path" />',
    '      <YColorPicker model-value="#14B8A6" label="Accent color" />',
    '      <YButton variant="primary">Create with global size</YButton>',
    '      <YTag tone="info">Children inherit size unless they set their own props.</YTag>',
    '    </div>',
    '  </YConfigProvider>',
    '</template>'
  ].join('\n'),
  themeProvider: [
    '<script setup lang="ts">',
    "import { YButton, YCard, YThemeProvider } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <YThemeProvider theme="yok-candy" density="comfortable">',
    '    <YCard title="Local theme" description="ThemeProvider scopes Yok UI variables to this region.">',
    '      <YButton variant="primary">Create themed action</YButton>',
    '    </YCard>',
    '  </YThemeProvider>',
    '</template>'
  ].join('\n'),
  upload: [
    '<script setup lang="ts">',
    "import { YUpload, YTag } from '@yok-ui/core'",
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="demo-stack">',
    '    <YUpload label="Upload component assets" description="Choose screenshots, icons, or design notes." accept=".png,.jpg,.pdf" multiple drag :max-files="3" />',
    '    <YUpload label="Design gallery" model-value="gallery-files" list-type="picture" previewable downloadable sortable clearable />',
    '    <YTag tone="success">Controlled files are provided by the docs runner.</YTag>',
    '  </div>',
    '</template>'
  ].join('\n')
}

const presetLabels: Partial<Record<LiveExamplePreset, string>> = {
  default: 'Overview',
  button: 'Button',
  avatar: 'Avatar',
  affix: 'Affix',
  anchor: 'Anchor',
  icon: 'Icon',
  backtop: 'Backtop',
  divider: 'Divider',
  space: 'Space',
  splitter: 'Splitter',
  scrollbar: 'Scrollbar',
  configProvider: 'Config Provider',
  link: 'Link',
  text: 'Text',
  tagBadge: 'Tag & Badge',
  input: 'Input',
  autocomplete: 'Autocomplete',
  mention: 'Mention',
  textarea: 'Textarea',
  radioGroup: 'Radio Group',
  select: 'Select',
  dropdown: 'Dropdown',
  popover: 'Popover',
  cascader: 'Cascader',
  calendar: 'Calendar',
  carousel: 'Carousel',
  card: 'Card',
  layout: 'Layout',
  menu: 'Menu',
  empty: 'Empty',
  skeleton: 'Skeleton',
  breadcrumb: 'Breadcrumb',
  steps: 'Steps',
  message: 'Message',
  messageBox: 'Message Box',
  qrCode: 'QRCode',
  floatButton: 'Float Button',
  notification: 'Notification',
  virtualList: 'Virtual List',
  watermark: 'Watermark',
  commandPalette: 'Command Palette',
  codeBlock: 'Code Block',
  themeSwitcher: 'Theme Switcher',
  brandHero: 'Brand Hero',
  featureGrid: 'Feature Grid',
  logoCloud: 'Logo Cloud',
  profileCard: 'Profile Card',
  pageHeader: 'Page Header',
  metricCard: 'Metric Card',
  fieldArray: 'Field Array',
  searchPanel: 'Search Panel',
  searchForm: 'Search Form',
  crudLayout: 'CRUD Layout',
  filterTabs: 'Filter Tabs',
  dataTable: 'Data Table',
  dataView: 'Data View',
  resourcePage: 'Resource Page',
  schemaForm: 'Schema Form',
  bulkActionBar: 'Bulk Action Bar',
  approvalCommentBox: 'Approval Comment Box',
  statusTimeline: 'Status Timeline',
  reviewWorkflow: 'Review Workflow',
  savedViews: 'Saved Views',
  dataToolbar: 'Data Toolbar',
  themeProvider: 'Theme Provider',
  datePicker: 'Date Picker',
  dateRangePicker: 'Date Range Picker',
  alert: 'Alert',
  loading: 'Loading',
  progress: 'Progress',
  result: 'Result',
  popconfirm: 'Popconfirm',
  modal: 'Modal',
  drawer: 'Drawer',
  tabs: 'Tabs',
  table: 'Table',
  list: 'List',
  descriptions: 'Descriptions',
  statistic: 'Statistic',
  timeline: 'Timeline',
  collapse: 'Collapse',
  timePicker: 'Time Picker',
  transfer: 'Transfer',
  tree: 'Tree',
  form: 'Form',
  formItem: 'Form Item',
  formSummary: 'Form Summary',
  inputNumber: 'Input Number',
  rate: 'Rate',
  slider: 'Slider',
  colorPicker: 'Color Picker',
  checkbox: 'Checkbox',
  switch: 'Switch',
  pagination: 'Pagination',
  tooltip: 'Tooltip',
  upload: 'Upload'
}

const starterOptions = Object.keys(presetExamples).map((value) => ({
  value: value as LiveExamplePreset,
  label: getLiveExampleComponentMeta(value as LiveExamplePreset)?.title ?? presetLabels[value as LiveExamplePreset] ?? value
}))

function escapeAttribute(value: string | number | boolean) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function booleanAttribute(name: string, value: string | number | boolean) {
  return value ? ` ${name}` : ''
}

function textAttribute(name: string, value: string | number | boolean) {
  return ` ${name}="${escapeAttribute(value)}"`
}

function numericBinding(name: string, value: string | number | boolean) {
  return ` :${name}="${Number(value)}"`
}

function sfc(imports: string, templateLines: string[]) {
  return [
    '<script setup lang="ts">',
    imports,
    '</' + 'script>',
    '',
    '<template>',
    ...templateLines.map((line) => `  ${line}`),
    '</template>'
  ].join('\n')
}

const liveExampleRecipes: Partial<Record<LiveExamplePreset, LiveExampleRecipe>> = {
  anchor: {
    title: 'Anchor controls',
    description: '覆盖基础锚点、水平模式、局部滚动容器、禁用链接、移动端和键盘顺序场景，生成可复制的安全 SFC。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础锚点', value: 'basic' },
        { label: '水平模式', value: 'horizontal' },
        { label: '滚动容器', value: 'container' },
        { label: '禁用链接', value: 'disabled' },
        { label: '移动端横向', value: 'mobile' },
        { label: '键盘顺序', value: 'keyboard' }
      ] },
      { key: 'offset', label: '偏移', type: 'range', defaultValue: 64, min: 0, max: 120, step: 4 },
      { key: 'bound', label: '触发边界', type: 'range', defaultValue: 15, min: 0, max: 80, step: 1 }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isHorizontalScenario = scenario === 'horizontal'
      const isContainerScenario = scenario === 'container'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const direction = isHorizontalScenario || isMobileScenario ? 'horizontal' : 'vertical'
      const type = isHorizontalScenario || isMobileScenario ? 'underline' : 'default'
      const offset = isMobileScenario ? 12 : Number(state.offset)
      const bound = Number(state.bound)
      const modelValue = isKeyboardScenario ? '#accessibility' : '#api'
      const items = isDisabledScenario ? 'anchorItemsWithDisabled' : 'anchorItems'
      const imports = "import { YAnchor, YCard, YTag } from '@yok-ui/core'"
      const setupLines = [
        'const anchorItems = [',
        "  { title: 'Usage', href: '#usage' },",
        "  { title: 'API', href: '#api', children: [{ title: 'Props', href: '#props' }, { title: 'Events', href: '#events' }] },",
        "  { title: 'Accessibility', href: '#accessibility' }",
        ']',
        '',
        'const anchorItemsWithDisabled = [',
        "  { title: 'Usage', href: '#usage' },",
        "  { title: 'API', href: '#api', children: [{ title: 'Props', href: '#props' }, { title: 'Events', href: '#events', disabled: true }] },",
        "  { title: 'Accessibility', href: '#accessibility' }",
        ']'
      ].join('\n')

      if (isContainerScenario) {
        return sfc(`${imports}\n${setupLines}`, [
          '<div class="demo-stack">',
          '  <section class="demo-scroll-panel anchor-target" style="max-height: 240px; overflow: auto; padding: 12px;">',
          `    <YAnchor :items="${items}" container=".anchor-target"${numericBinding('offset', offset)}${numericBinding('bound', bound)} model-value="${modelValue}" aria-label="Container sections" />`,
          '    <YCard id="usage" title="Usage">Local content section.</YCard>',
          '    <YCard id="api" title="API">Props and events stay inside the target container.</YCard>',
          '    <YCard id="props" title="Props">Enough content to verify active sync.</YCard>',
          '    <YCard id="accessibility" title="Accessibility">Keyboard focus stays on native links.</YCard>',
          '  </section>',
          '  <YTag tone="info">Container scroll with offset.</YTag>',
          '</div>'
        ])
      }

      return sfc(`${imports}\n${setupLines}`, [
        '<div class="demo-stack">',
        `  <YAnchor :items="${items}"${textAttribute('direction', direction)}${textAttribute('type', type)}${numericBinding('offset', offset)}${numericBinding('bound', bound)} model-value="${modelValue}"${isMobileScenario ? ' :marker="false"' : ''}${isKeyboardScenario ? ' select-scroll-top' : ''} aria-label="${isKeyboardScenario ? 'Keyboard component sections' : 'Component sections'}" />`,
        `  <YTag tone="${isDisabledScenario ? 'warning' : 'info'}">${isKeyboardScenario ? 'Native Tab and Enter behavior.' : isMobileScenario ? 'Compact horizontal anchors.' : isHorizontalScenario ? 'Underline horizontal mode.' : 'Section navigation.'}</YTag>`,
        '</div>'
      ])
    }
  },
  affix: {
    title: 'Affix controls',
    description: '覆盖顶部/底部固定、目标容器、禁用、移动端操作条和键盘顺序场景，生成可复制的安全 SFC。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'top', options: [
        { label: '顶部固定', value: 'top' },
        { label: '底部固定', value: 'bottom' },
        { label: '目标容器', value: 'target' },
        { label: '禁用固定', value: 'disabled' },
        { label: '移动端操作条', value: 'mobile' },
        { label: '键盘顺序', value: 'keyboard' }
      ] },
      { key: 'offset', label: '偏移', type: 'range', defaultValue: 24, min: 0, max: 96, step: 4 },
      { key: 'zIndex', label: '层级', type: 'range', defaultValue: 100, min: 1, max: 300, step: 1 }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isBottomScenario = scenario === 'bottom'
      const isTargetScenario = scenario === 'target'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const offset = isMobileScenario ? 12 : Number(state.offset)
      const position = isBottomScenario || isMobileScenario ? 'bottom' : 'top'
      const zIndex = Number(state.zIndex)
      const tone = isDisabledScenario ? 'danger' : isKeyboardScenario ? 'warning' : 'info'
      const helperText = isTargetScenario
        ? 'Local container owns scroll.'
        : isDisabledScenario
          ? 'Sticky behavior disabled.'
          : isKeyboardScenario
            ? 'Tab order stays native.'
            : position === 'bottom'
              ? 'Bottom action bar.'
              : 'Top sticky toolbar.'
      const imports = "import { YAffix, YButton, YCard, YTag } from '@yok-ui/core'"

      if (isTargetScenario) {
        return sfc(imports, [
          '<div class="demo-stack">',
          '  <section class="demo-scroll-panel affix-target" style="max-height: 220px; overflow: auto; padding: 12px;">',
          `    <YAffix target=".affix-target"${numericBinding('offset', offset)}${numericBinding('z-index', zIndex)} aria-label="Container sticky toolbar">`,
          '      <div class="demo-row">',
          '        <YButton variant="primary" size="sm">Target toolbar</YButton>',
          '        <YTag tone="info">Container</YTag>',
          '      </div>',
          '    </YAffix>',
          '    <YCard title="Scrollable target">Local container owns the scroll context.</YCard>',
          '    <YCard title="Release notes">Enough content to verify sticky placement.</YCard>',
          '  </section>',
          `  <YTag tone="${tone}">${helperText}</YTag>`,
          '</div>'
        ])
      }

      return sfc(imports, [
        `<YAffix${textAttribute('position', position)}${numericBinding('offset', offset)}${numericBinding('z-index', zIndex)}${booleanAttribute('disabled', isDisabledScenario)} aria-label="${isKeyboardScenario ? 'Keyboard sticky toolbar' : 'Sticky release toolbar'}">`,
        '  <div class="demo-row">',
        `    <YButton variant="${isDisabledScenario ? 'secondary' : 'primary'}" size="sm">${isBottomScenario || isMobileScenario ? 'Submit review' : 'Publish docs'}</YButton>`,
        isKeyboardScenario ? '    <YButton variant="ghost" size="sm">Next action</YButton>' : '',
        `    <YTag tone="${tone}">${helperText}</YTag>`,
        '  </div>',
        '</YAffix>'
      ].filter(Boolean))
    }
  },
  button: {
    title: 'Button controls',
    description: '覆盖主操作、表单提交、按钮组、复制文案、加载、禁用、风险、移动端和键盘触发场景，生成可复制的安全 SFC。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'primary', options: [
        { label: '主操作', value: 'primary' },
        { label: '表单提交', value: 'submit' },
        { label: '按钮组', value: 'group' },
        { label: '复制命令', value: 'copy' },
        { label: '加载提交', value: 'loading' },
        { label: '权限禁用', value: 'disabled' },
        { label: '风险操作', value: 'danger' },
        { label: '移动宽按钮', value: 'mobile' },
        { label: '键盘触发', value: 'keyboard' }
      ] },
      { key: 'label', label: '按钮文案', type: 'text', defaultValue: 'Create component' },
      { key: 'variant', label: '视觉等级', type: 'select', defaultValue: 'primary', options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Ghost', value: 'ghost' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'lg', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ] },
      { key: 'type', label: '原生类型', type: 'select', defaultValue: 'button', options: [
        { label: 'Button', value: 'button' },
        { label: 'Submit', value: 'submit' },
        { label: 'Reset', value: 'reset' }
      ] },
      { key: 'loading', label: '加载中', type: 'boolean', defaultValue: false },
      { key: 'disabled', label: '禁用', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isLoadingScenario = scenario === 'loading'
      const isDisabledScenario = scenario === 'disabled'
      const isDangerScenario = scenario === 'danger'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const isSubmitScenario = scenario === 'submit'
      const isGroupScenario = scenario === 'group'
      const isCopyScenario = scenario === 'copy'
      const buttonLabel = isLoadingScenario
        ? 'Publishing...'
        : isDisabledScenario
          ? 'Permission required'
          : isDangerScenario
            ? 'Delete draft'
            : isMobileScenario
              ? 'Continue'
              : isKeyboardScenario
                ? 'Submit with keyboard'
                : isSubmitScenario
                  ? 'Submit review'
                  : isCopyScenario
                    ? 'Copy command'
                    : state.label
      const variant = isDangerScenario || isDisabledScenario ? 'secondary' : state.variant
      const size = isMobileScenario || isKeyboardScenario ? 'lg' : state.size
      const tone = isDangerScenario
        ? 'danger'
        : isDisabledScenario
          ? 'warning'
          : isLoadingScenario || isKeyboardScenario || isCopyScenario
            ? 'info'
            : 'success'
      const note = isLoadingScenario
        ? 'Loading avoids duplicate submits.'
        : isDisabledScenario
          ? 'Disabled buttons stay visible when permissions or prerequisites are missing.'
          : isDangerScenario
            ? 'Danger actions use explicit labels before destructive work.'
            : isMobileScenario
              ? 'Mobile keeps the action touch-friendly and easy to scan.'
              : isKeyboardScenario
                ? 'Tab focuses the button; Enter or Space triggers click.'
                : isSubmitScenario
                  ? 'Submit buttons preserve native form intent without custom click glue.'
                  : isGroupScenario
                    ? 'Button groups keep one primary action and secondary alternatives in a predictable order.'
                    : isCopyScenario
                      ? 'Copy actions should use explicit labels and perceptible confirmation text.'
                      : 'Primary actions should be singular and easy to recognize.'

      if (isGroupScenario) {
        return sfc("import { YButton, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <div class="demo-row">',
          '    <YButton variant="primary" size="md">Publish</YButton>',
          '    <YButton variant="secondary" size="md">Save draft</YButton>',
          '    <YButton variant="ghost" size="md">Preview</YButton>',
          '  </div>',
          `  <YTag tone="${tone}">${note}</YTag>`,
          '</div>'
        ])
      }

      return sfc("import { YButton, YTag } from '@yok-ui/core'", [
        `<div class="demo-stack${isMobileScenario ? ' demo-stack--mobile' : ''}">`,
        `  <YButton${textAttribute('variant', variant)}${textAttribute('size', size)}${textAttribute('type', isKeyboardScenario || isSubmitScenario ? 'submit' : state.type)}${booleanAttribute('loading', isLoadingScenario || state.loading)}${booleanAttribute('disabled', isDisabledScenario || state.disabled)}>${escapeAttribute(buttonLabel)}</YButton>`,
        `  <YTag tone="${tone}">${note}</YTag>`,
        '</div>'
      ])
    }
  },
  alert: {
    title: 'Alert scenario',
    description: '调试保存成功、表单校验、系统公告、移动提示和键盘关闭场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'success', options: [
        { label: '保存成功', value: 'success' },
        { label: '表单校验', value: 'validation' },
        { label: '系统公告', value: 'announcement' },
        { label: '移动提示', value: 'mobile' },
        { label: '键盘关闭', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Theme saved' },
      { key: 'body', label: '正文', type: 'text', defaultValue: 'Light and Clean themes are ready for preview.' },
      { key: 'variant', label: '视觉变体', type: 'select', defaultValue: 'soft', options: [
        { label: 'Soft', value: 'soft' },
        { label: 'Outline', value: 'outline' },
        { label: 'Solid', value: 'solid' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ] },
      { key: 'showIcon', label: '显示图标', type: 'boolean', defaultValue: true },
      { key: 'closeText', label: '关闭文本', type: 'text', defaultValue: '' },
      { key: 'closable', label: '可关闭', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isValidationScenario = scenario === 'validation'
      const isAnnouncementScenario = scenario === 'announcement'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const tone = isValidationScenario
        ? 'danger'
        : isAnnouncementScenario || isKeyboardScenario
          ? 'warning'
          : 'success'
      const title = isValidationScenario
        ? 'Fix 3 fields before publishing.'
        : isAnnouncementScenario
          ? 'Maintenance window'
          : isMobileScenario
            ? 'Saved on mobile'
            : isKeyboardScenario
              ? 'Keyboard reachable alert'
              : state.title
      const body = isValidationScenario
        ? 'Component name, release note and owner are required before this package can be published.'
        : isAnnouncementScenario
          ? 'The docs site will enter maintenance tonight at 23:00. Drafts are saved automatically.'
          : isMobileScenario
            ? 'Keep mobile alerts short and place the close button where it remains easy to reach.'
            : isKeyboardScenario
              ? 'Tab reaches the close button; Enter or Space dismisses the alert.'
              : state.body
      const closeLabel = isValidationScenario
        ? 'Dismiss validation summary'
        : isKeyboardScenario
          ? 'Dismiss keyboard alert'
          : isAnnouncementScenario
            ? 'Dismiss system announcement'
            : isMobileScenario
              ? 'Dismiss mobile alert'
              : 'Dismiss success alert'
      const role = isValidationScenario ? 'alert' : 'status'
      const shouldShowClose = Boolean(state.closable) || isValidationScenario || isAnnouncementScenario || isMobileScenario || isKeyboardScenario
      const variant = isValidationScenario
        ? 'solid'
        : isAnnouncementScenario
          ? 'outline'
          : state.variant
      const size = isMobileScenario || isKeyboardScenario ? 'sm' : state.size
      const closeText = isAnnouncementScenario
        ? 'Got it'
        : String(state.closeText)
      const showIcon = Boolean(state.showIcon) && !isMobileScenario
      const actionLabel = isValidationScenario
        ? 'Review fields'
        : isAnnouncementScenario
          ? 'View schedule'
          : ''

      return sfc("import { YAlert, YButton } from '@yok-ui/core'", [
        `<YAlert tone="${tone}"${textAttribute('variant', variant)}${textAttribute('size', size)}${textAttribute('title', title)} role="${role}"${shouldShowClose ? ' closable' : ''}${textAttribute('close-label', closeLabel)}${closeText ? textAttribute('close-text', closeText) : ''}${showIcon ? '' : ' :show-icon="false"'}${isAnnouncementScenario ? ' banner' : ''}>`,
        `  ${escapeAttribute(body)}`,
        ...(actionLabel
          ? [
              '  <template #action>',
              `    <YButton size="sm" variant="${isValidationScenario ? 'secondary' : 'ghost'}">${actionLabel}</YButton>`,
              '  </template>'
            ]
          : []),
      '</YAlert>'
      ])
    }
  },
  loading: {
    title: 'Loading scenario',
    description: '调试内联状态、容器遮罩、全屏阻断、重试、移动端和键盘读屏路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'overlay', options: [
        { label: '内联状态', value: 'inline' },
        { label: '容器遮罩', value: 'overlay' },
        { label: '全屏阻断', value: 'fullscreen' },
        { label: '重试状态', value: 'retry' },
        { label: '移动加载', value: 'mobile' },
        { label: '键盘读屏', value: 'keyboard' }
      ] },
      { key: 'text', label: '文案', type: 'text', defaultValue: 'Refreshing component list' },
      { key: 'tone', label: '语义色', type: 'select', defaultValue: 'primary', options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ] },
      { key: 'loading', label: '加载中', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isInlineScenario = scenario === 'inline'
      const isFullscreenScenario = scenario === 'fullscreen'
      const isRetryScenario = scenario === 'retry'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const text = isFullscreenScenario
        ? 'Publishing release'
        : isRetryScenario
          ? 'Retrying failed request'
          : isMobileScenario
            ? 'Syncing'
            : isKeyboardScenario
              ? 'Refreshing table for screen reader'
              : state.text
      const tone = isRetryScenario ? 'warning' : state.tone
      const size = isMobileScenario ? 'sm' : state.size
      const helper = isInlineScenario
        ? 'Inline loading announces a non-blocking task without adding a focus stop.'
        : isFullscreenScenario
          ? 'Fullscreen loading blocks the workflow while naming the pending task.'
          : isRetryScenario
            ? 'Retry loading should explain the recovery task instead of spinning silently.'
            : isMobileScenario
              ? 'Mobile loading keeps text short and avoids crowding the viewport.'
              : isKeyboardScenario
                ? 'Keyboard users keep their current focus while aria-busy and status text explain the wait.'
                : 'Overlay loading keeps the existing content mounted while the region is busy.'

      if (isInlineScenario) {
        return sfc("import { YLoading, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          `  <YLoading${state.loading ? ' loading' : ' :loading="false"'}${textAttribute('text', text)}${textAttribute('tone', tone)}${textAttribute('size', size)} />`,
          `  <YTag tone="info">${helper}</YTag>`,
          '</div>'
        ])
      }

      return sfc("import { YLoading, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YLoading${state.loading ? ' loading' : ' :loading="false"'}${booleanAttribute('overlay', !isFullscreenScenario)}${booleanAttribute('fullscreen', isFullscreenScenario)}${textAttribute('text', text)}${textAttribute('label', isKeyboardScenario ? 'Refreshing table data' : '')}${textAttribute('tone', tone)}${textAttribute('size', size)}>`,
        '    <div class="demo-panel">',
        '      <strong>Component release queue</strong>',
        '      <span>Rows remain mounted while the async task runs.</span>',
        '    </div>',
        '  </YLoading>',
        `  <YTag tone="${isRetryScenario ? 'warning' : 'info'}">${helper}</YTag>`,
        '</div>'
      ])
    }
  },
  progress: {
    title: 'Progress scenario',
    description: '调试任务进度、加载中、失败状态、移动进度和读屏语义。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'task', options: [
        { label: '任务进度', value: 'task' },
        { label: '加载进度', value: 'loading' },
        { label: '失败进度', value: 'failed' },
        { label: '移动进度', value: 'mobile' },
        { label: '键盘进度', value: 'keyboard' }
      ] },
      { key: 'value', label: '进度', type: 'range', defaultValue: 72, min: 0, max: 100, step: 1 },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Documentation polish' },
      { key: 'tone', label: '语义色', type: 'select', defaultValue: 'primary', options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' }
      ] },
      { key: 'striped', label: '条纹', type: 'boolean', defaultValue: true },
      { key: 'showValue', label: '显示数值', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isLoadingScenario = scenario === 'loading'
      const isFailedScenario = scenario === 'failed'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const value = isLoadingScenario
        ? 48
        : isFailedScenario
          ? 64
          : isMobileScenario
            ? 38
            : isKeyboardScenario
              ? 82
              : state.value
      const tone = isFailedScenario
        ? 'danger'
        : isLoadingScenario
          ? 'warning'
          : isKeyboardScenario
            ? 'success'
            : state.tone
      const label = isFailedScenario
        ? 'Dependency install failed'
        : isLoadingScenario
          ? 'Installing package'
          : isMobileScenario
            ? 'Build'
            : isKeyboardScenario
              ? 'Keyboard progress status'
              : state.label
      const helper = isFailedScenario
        ? 'Dependency install failed. Retry after checking the package registry.'
        : isLoadingScenario
          ? 'Striped loading progress helps long-running setup feel alive.'
          : isMobileScenario
            ? 'Mobile progress uses a short label and hides the value to avoid cramped headers.'
            : isKeyboardScenario
              ? 'Screen reader announces progressbar value changes.'
              : 'Progress communicates current task status without stealing focus.'
      const showValue = isMobileScenario ? false : state.showValue

      return sfc("import { YProgress, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YProgress${numericBinding('value', value)}${textAttribute('tone', tone)}${textAttribute('label', label)}${booleanAttribute('striped', Boolean(state.striped) || isLoadingScenario)}${showValue ? '' : ' :show-value="false"'} />`,
        `  <YTag tone="${isFailedScenario ? 'danger' : isLoadingScenario ? 'warning' : 'info'}">${helper}</YTag>`,
        '</div>'
      ])
    }
  },
  input: {
    title: 'Input scenario',
    description: '调试基础输入、帮助说明、搜索输入、尺寸密度、校验错误、禁用复核、移动短标签和键盘录入场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础输入', value: 'basic' },
        { label: '帮助说明', value: 'help' },
        { label: '搜索输入', value: 'search' },
        { label: '可清空计数', value: 'clearable' },
        { label: '尺寸密度', value: 'density' },
        { label: '校验错误', value: 'validation' },
        { label: '禁用复核', value: 'disabled' },
        { label: '移动短标签', value: 'mobile' },
        { label: '键盘录入', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Library name' },
      { key: 'modelValue', label: '当前值', type: 'text', defaultValue: 'Yok UI' },
      { key: 'placeholder', label: '占位', type: 'text', defaultValue: 'Input library name' },
      { key: 'error', label: '错误', type: 'text', defaultValue: '' },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ] },
      { key: 'invalid', label: '无效状态', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isHelpScenario = scenario === 'help'
      const isSearchScenario = scenario === 'search'
      const isClearableScenario = scenario === 'clearable'
      const isDensityScenario = scenario === 'density'
      const isValidationScenario = scenario === 'validation'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isValidationScenario
        ? 'Component name'
        : isDisabledScenario
          ? 'Plan'
          : isHelpScenario
            ? 'Library namespace'
            : isSearchScenario
              ? 'Search components'
              : isClearableScenario
                ? 'Filter keyword'
              : isDensityScenario
                ? 'Medium density'
          : isMobileScenario
            ? 'Pkg'
            : isKeyboardScenario
              ? 'Keyboard field'
              : state.label
      const modelValue = isValidationScenario
        ? ''
        : isDisabledScenario
          ? 'Readonly plan'
          : isHelpScenario
            ? 'yok'
            : isSearchScenario
              ? 'data table'
              : isClearableScenario
                ? 'component'
              : isDensityScenario
                ? 'Yok UI'
          : isMobileScenario
            ? 'Core'
            : state.modelValue
      const placeholder = isValidationScenario
        ? 'Enter component name'
        : isHelpScenario
          ? 'Lowercase namespace'
          : isSearchScenario
            ? 'Search by name, owner or package'
            : isClearableScenario
              ? 'Button, table or owner'
            : isDensityScenario
              ? 'Medium density input'
        : isMobileScenario
          ? 'Short name'
          : isKeyboardScenario
            ? 'Type and submit with Enter'
            : state.placeholder
      const error = isValidationScenario
        ? 'Component name is required before release.'
        : state.error
      const describedBy = isValidationScenario
        ? 'component-name-error'
        : isHelpScenario
          ? 'namespace-help'
          : isSearchScenario
            ? 'component-search-help'
            : isClearableScenario
              ? 'filter-keyword-help'
        : isKeyboardScenario
          ? 'keyboard-field-help'
          : ''
      const helper = isValidationScenario
        ? '<p id="component-name-error">Connect the error copy to the input with aria-describedby.</p>'
        : isHelpScenario
          ? '<p id="namespace-help">Use lowercase letters for package namespaces, for example yok or docs.</p>'
          : isSearchScenario
            ? '<p id="component-search-help">Search fields should explain the searchable scope and keep placeholder text short.</p>'
            : isClearableScenario
              ? '<p id="filter-keyword-help">Clearable inputs should keep the clear button focusable and the count close to the field.</p>'
        : isKeyboardScenario
          ? '<p id="keyboard-field-help">Tab enters the native input; typing updates modelValue through update:modelValue.</p>'
          : ''

      if (isDensityScenario) {
        return sfc("import { YInput, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <YInput label="Small density" model-value="Compact filter" placeholder="Small" size="sm" />',
          '  <YInput label="Medium density" model-value="Default form field" placeholder="Medium" size="md" />',
          '  <YInput label="Large density" model-value="Primary setup field" placeholder="Large" size="lg" />',
          '  <YTag tone="info">Size props should follow form density instead of one-off CSS.</YTag>',
          '</div>'
        ])
      }

      return sfc("import { YInput } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YInput${textAttribute('label', label)}${textAttribute('model-value', modelValue)}${textAttribute('placeholder', placeholder)}${textAttribute('size', state.size)}${isSearchScenario || isClearableScenario ? ' type="search"' : ''}${isClearableScenario ? ' prefix-text="/" clearable show-count :maxlength="24"' : ''}${error ? textAttribute('error', error) : ''}${booleanAttribute('invalid', isValidationScenario || state.invalid)}${describedBy ? textAttribute('aria-describedby', describedBy) : ''}${booleanAttribute('disabled', isDisabledScenario)} />`,
        ...(helper ? [`  ${helper}`] : []),
        '</div>'
      ])
    }
  },
  autocomplete: {
    title: 'Autocomplete scenario',
    description: '调试自由文本补全、本地建议过滤、受控值、远程加载、空状态、禁用建议、移动短标签和键盘补全路径，建议项由运行器注入。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'component', options: [
        { label: '组件搜索', value: 'component' },
        { label: '受控输入', value: 'controlled' },
        { label: '远程加载', value: 'loading' },
        { label: '无匹配建议', value: 'empty' },
        { label: '禁用建议', value: 'disabled' },
        { label: '窄屏搜索', value: 'responsive' },
        { label: '键盘补全', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Component' },
      { key: 'modelValue', label: '当前文本', type: 'text', defaultValue: 'auto' },
      { key: 'placeholder', label: '占位', type: 'text', defaultValue: 'Search components' },
      { key: 'clearable', label: '可清空', type: 'boolean', defaultValue: true },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'medium', options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' }
      ] }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isControlledScenario = scenario === 'controlled'
      const isLoadingScenario = scenario === 'loading'
      const isEmptyScenario = scenario === 'empty'
      const isDisabledScenario = scenario === 'disabled'
      const isResponsiveScenario = scenario === 'responsive'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isResponsiveScenario
        ? 'Find'
        : isKeyboardScenario
          ? 'Keyboard component search'
          : isLoadingScenario
            ? 'Remote component search'
            : isDisabledScenario
              ? 'Disabled suggestion search'
              : isControlledScenario
                ? 'Controlled component'
                : state.label
      const modelValue = isEmptyScenario
        ? 'missing'
        : isLoadingScenario
          ? 'data'
          : isDisabledScenario
            ? 'remote'
            : isKeyboardScenario
              ? 'but'
              : isControlledScenario
                ? 'select'
                : state.modelValue
      const placeholder = isResponsiveScenario
        ? 'Search'
        : isKeyboardScenario
          ? 'Arrow keys and Enter'
          : isLoadingScenario
            ? 'Search remote components'
            : state.placeholder
      const helperTone = isEmptyScenario
        ? 'warning'
        : isLoadingScenario || isKeyboardScenario || isDisabledScenario
          ? 'info'
          : 'success'
      const helperText = isEmptyScenario
        ? 'Free text stays in the field when no suggestion matches.'
        : isLoadingScenario
          ? 'Remote searches keep the combobox stable while suggestions refresh.'
          : isDisabledScenario
            ? 'Disabled suggestions are visible for context but cannot be selected.'
            : isResponsiveScenario
              ? 'Short copy keeps the field usable in narrow layouts.'
              : isKeyboardScenario
                ? 'Arrow keys move suggestions, Enter selects, Escape closes.'
                : isControlledScenario
                  ? 'v-model receives both typed text and selected suggestion values.'
                  : 'Autocomplete is for free text plus suggestions; Select is for bounded choices.'

      return sfc("import { YAutocomplete, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YAutocomplete${textAttribute('label', label)}${textAttribute('model-value', modelValue)}${textAttribute('placeholder', placeholder)}${textAttribute('size', state.size)}${booleanAttribute('clearable', Boolean(state.clearable) || isResponsiveScenario || isKeyboardScenario)}${booleanAttribute('loading', isLoadingScenario)}${isLoadingScenario ? ' loading-text="Loading remote suggestions..."' : ''}${isEmptyScenario ? ' empty-text="No component suggestions"' : ''} />`,
        `  <YTag tone="${helperTone}">${helperText}</YTag>`,
        '</div>'
      ])
    }
  },
  mention: {
    title: 'Mention scenario',
    description: '调试协作评论中的 @ 成员、# 主题、多前缀、远程加载、无结果、禁用成员、移动评论和键盘提及路径，建议项由运行器注入。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'team', options: [
        { label: '成员提及', value: 'team' },
        { label: '主题标签', value: 'topic' },
        { label: '远程搜索', value: 'loading' },
        { label: '无匹配成员', value: 'empty' },
        { label: '禁用成员', value: 'disabled' },
        { label: '移动评论', value: 'mobile' },
        { label: '键盘提及', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Release note' },
      { key: 'modelValue', label: '当前文本', type: 'text', defaultValue: 'Please review @ad' },
      { key: 'placeholder', label: '占位', type: 'text', defaultValue: 'Type @ to mention' },
      { key: 'clearable', label: '可清空', type: 'boolean', defaultValue: true },
      { key: 'rows', label: '行数', type: 'number', defaultValue: 3, min: 2, max: 6, step: 1 }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isTopicScenario = scenario === 'topic'
      const isLoadingScenario = scenario === 'loading'
      const isEmptyScenario = scenario === 'empty'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isMobileScenario
        ? 'Note'
        : isKeyboardScenario
          ? 'Keyboard mention note'
          : state.label
      const modelValue = isTopicScenario
        ? 'Link this to #release'
        : isLoadingScenario
          ? 'Ask @gr'
          : isEmptyScenario
            ? 'Ask @missing'
            : isDisabledScenario
              ? 'Review with @blocked'
              : isKeyboardScenario
                ? 'Ping @'
                : state.modelValue
      const helperTone = isEmptyScenario || isDisabledScenario
        ? 'warning'
        : isLoadingScenario || isKeyboardScenario
          ? 'info'
          : 'success'
      const helperText = isTopicScenario
        ? 'Multiple prefixes let teams mention people and topics in the same field.'
        : isLoadingScenario
          ? 'Remote search keeps the textarea stable while options refresh.'
          : isEmptyScenario
            ? 'No-match states keep free text intact instead of clearing user input.'
            : isDisabledScenario
              ? 'Disabled mentions remain visible for context but cannot be inserted.'
              : isMobileScenario
                ? 'Compact labels and rows keep comments usable on narrow screens.'
                : isKeyboardScenario
                  ? 'Arrow keys move suggestions, Enter inserts the active mention, Escape closes.'
                  : 'Mention is optimized for collaborative text, comments and release notes.'

      return sfc("import { YMention, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YMention${textAttribute('label', label)}${textAttribute('model-value', modelValue)}${textAttribute('placeholder', isMobileScenario ? 'Type @' : state.placeholder)} prefix="@,#"${numericBinding('rows', Number(state.rows))}${booleanAttribute('clearable', Boolean(state.clearable) || isMobileScenario || isKeyboardScenario)}${booleanAttribute('loading', isLoadingScenario)}${isLoadingScenario ? ' loading-text="Searching teammates..."' : ''}${isEmptyScenario ? ' empty-text="No teammate matched"' : ''} />`,
        `  <YTag tone="${helperTone}">${helperText}</YTag>`,
        '</div>'
      ])
    }
  },
  select: {
    title: 'Select scenario',
    description: '调试选择器基础选择、清空、多选、标签折叠、尺寸、搜索、分组选项、禁用选项、创建选项、虚拟滚动、远程加载、错误、禁用、移动布局和键盘打开路径，选项由运行器注入。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'package', options: [
        { label: '包选择', value: 'package' },
        { label: '可清空', value: 'clearable' },
        { label: '多选标签', value: 'multiple' },
        { label: '标签折叠', value: 'collapsedTags' },
        { label: '尺寸密度', value: 'size' },
        { label: '可搜索', value: 'filterable' },
        { label: '无匹配结果', value: 'emptyFilter' },
        { label: '分组选项', value: 'grouped' },
        { label: '禁用选项', value: 'disabledOptions' },
        { label: '创建选项', value: 'allowCreate' },
        { label: '虚拟滚动', value: 'virtualized' },
        { label: '远程加载', value: 'remote' },
        { label: '表单校验选择', value: 'form-validation' },
        { label: '必填错误', value: 'error' },
        { label: '禁用审核', value: 'disabled' },
        { label: '移动选择', value: 'mobile' },
        { label: '键盘选择', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Package' },
      { key: 'modelValue', label: '当前值', type: 'select', defaultValue: 'core', options: [
        { label: 'Core primitives', value: 'core' },
        { label: 'Product tools', value: 'product' },
        { label: 'Admin workflow', value: 'admin' }
      ] },
      { key: 'placeholder', label: '占位', type: 'text', defaultValue: 'Choose package' },
      { key: 'error', label: '错误', type: 'text', defaultValue: '' },
      { key: 'disabled', label: '禁用', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isErrorScenario = scenario === 'error'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const isClearableScenario = scenario === 'clearable'
      const isMultipleScenario = scenario === 'multiple'
      const isCollapsedTagsScenario = scenario === 'collapsedTags'
      const isSizeScenario = scenario === 'size'
      const isFilterableScenario = scenario === 'filterable'
      const isEmptyFilterScenario = scenario === 'emptyFilter'
      const isGroupedScenario = scenario === 'grouped'
      const isDisabledOptionsScenario = scenario === 'disabledOptions'
      const isAllowCreateScenario = scenario === 'allowCreate'
      const isVirtualizedScenario = scenario === 'virtualized'
      const isRemoteScenario = scenario === 'remote'
      const isFormValidationScenario = scenario === 'form-validation'
      const label = isKeyboardScenario
        ? 'Keyboard package picker'
        : isMobileScenario
          ? 'Pkg'
          : isGroupedScenario
            ? 'Grouped package picker'
          : isDisabledOptionsScenario
            ? 'Disabled option picker'
          : isAllowCreateScenario
            ? 'Creatable tag picker'
          : isVirtualizedScenario
            ? 'Virtualized package picker'
          : isCollapsedTagsScenario
            ? 'Collapsed tag picker'
          : isRemoteScenario
            ? 'Remote package picker'
          : isFormValidationScenario
            ? 'Release package'
          : isMultipleScenario
            ? 'Packages'
            : isFilterableScenario || isEmptyFilterScenario
              ? 'Search package'
          : state.label
      const modelValue = isErrorScenario
        ? ''
        : isDisabledScenario
          ? 'admin'
          : isKeyboardScenario
            ? 'product'
            : isDisabledOptionsScenario
              ? 'core'
            : isAllowCreateScenario
              ? ''
            : isVirtualizedScenario
              ? 'pkg-12'
            : isClearableScenario
              ? 'core'
            : isCollapsedTagsScenario
              ? 'core'
          : isFilterableScenario
            ? 'product'
            : isGroupedScenario
              ? 'select'
            : isRemoteScenario
              ? ''
                : isEmptyFilterScenario
                  ? ''
            : state.modelValue
      const placeholder = isKeyboardScenario
        ? 'Open with Enter or Space'
        : isMobileScenario
          ? 'Choose'
          : isClearableScenario
            ? 'Clear and choose again'
            : isFilterableScenario
              ? 'Type to filter'
              : isDisabledOptionsScenario
                ? 'Choose an available package'
              : isAllowCreateScenario
                ? 'Type a new tag'
              : isVirtualizedScenario
                ? 'Search 1,000 packages'
              : isCollapsedTagsScenario
                ? 'Keep tags compact'
              : isGroupedScenario
                ? 'Choose by family'
              : isRemoteScenario
                ? 'Loading remote options'
              : isEmptyFilterScenario
                ? 'Try searching package'
          : state.placeholder
      const error = isErrorScenario
        ? 'Package is required before publishing.'
        : state.error
      const tagTone = isErrorScenario || isFormValidationScenario
        ? 'danger'
        : isKeyboardScenario || isDisabledScenario || isDisabledOptionsScenario
          ? 'warning'
          : 'success'
      const helperText = isErrorScenario
          ? 'Required state keeps error text tied to the combobox.'
        : isFormValidationScenario
          ? 'FormItem can pass error, invalid and aria-describedby to Select while change revalidates the field.'
        : isDisabledScenario
          ? 'Disabled review keeps the selected value readable.'
          : isDisabledOptionsScenario
            ? 'Disabled options stay visible but cannot be selected.'
          : isAllowCreateScenario
            ? 'Type a new tag and press Enter to create it.'
          : isVirtualizedScenario
            ? 'Virtualized options keep large lists light without breaking listbox semantics.'
          : isMobileScenario
            ? 'Compact copy keeps the trigger usable in narrow layouts.'
            : isKeyboardScenario
              ? 'Enter or Space opens the listbox; Arrow keys move options; Escape closes it.'
              : isClearableScenario
                ? 'Clearable select mirrors Element Plus style form recovery.'
                : isCollapsedTagsScenario
                  ? 'Collapsed tags prevent dense multiple selects from stretching forms.'
                : isMultipleScenario
                  ? 'Multiple selection keeps the panel open and displays compact tags.'
                  : isFilterableScenario
                    ? 'Filterable select mirrors mainstream searchable pickers.'
                    : isEmptyFilterScenario
                      ? 'Empty-result copy keeps search failures calm and actionable.'
                      : isGroupedScenario
                        ? 'Grouped options mirror mainstream Select option-group patterns.'
                      : isAllowCreateScenario
                        ? 'Creatable options mirror mainstream tag entry patterns.'
                    : isRemoteScenario
                      ? 'Remote loading keeps the combobox stable while options refresh.'
                      : isSizeScenario
                        ? 'Size variants align Select with form density systems.'
                    : 'Options are injected by the docs runner.'

      if (isSizeScenario) {
        return sfc("import { YSelect, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <YSelect label="Compact package" model-value="core" placeholder="Small" size="small" />',
          '  <YSelect label="Default package" model-value="product" placeholder="Medium" />',
          '  <YSelect label="Large package" model-value="admin" placeholder="Large" size="large" />',
          `  <YTag tone="${tagTone}">${helperText}</YTag>`,
          '</div>'
        ])
      }

      if (isFormValidationScenario) {
        return sfc(`import { YAlert, YForm, YFormItem, YSelect } from '@yok-ui/core'

const releasePackageOptions = [
  { label: 'Core primitives', value: 'core' },
  { label: 'Product tools', value: 'product' },
  { label: 'Admin workflow', value: 'admin' }
]`, [
          '<div class="demo-stack">',
          '  <YForm scroll-to-error>',
          '    <YFormItem label="Release package" prop="packageName" required error="Choose a package before publishing.">',
          '      <YSelect label="Release package" model-value="" placeholder="Choose package" clearable filterable search-placeholder="Search release package" error="Choose a package before publishing." invalid aria-describedby="yok-form-message-packageName" :options="releasePackageOptions" />',
          '    </YFormItem>',
          '  </YForm>',
          '  <YAlert tone="danger" title="Form validation">Select keeps error, invalid and aria-describedby wired to the combobox.</YAlert>',
          '</div>'
        ])
      }

      const valueAttribute = isMultipleScenario
        ? " :model-value=\"['core', 'product']\""
        : isCollapsedTagsScenario
          ? " :model-value=\"['core', 'product', 'admin']\""
        : textAttribute('model-value', modelValue)
      const selectOptionsAttribute = isGroupedScenario
        ? ' :options="groupedPackageOptions"'
        : isDisabledOptionsScenario
          ? ' :options="disabledPackageOptions"'
          : isVirtualizedScenario
            ? ' :options="largePackageOptions"'
          : ''
      const selectImports = isDisabledOptionsScenario
        ? `import { YSelect, YTag } from '@yok-ui/core'

const disabledPackageOptions = [
  { label: 'Core primitives', value: 'core' },
  { label: 'Product tools', value: 'product' },
  { label: 'Admin workflow', value: 'admin', disabled: true }
]`
        : isVirtualizedScenario
          ? `import { YSelect, YTag } from '@yok-ui/core'

const largePackageOptions = Array.from({ length: 1000 }, (_, index) => ({
  label: \`Package \${index + 1}\`,
  value: \`pkg-\${index + 1}\`
}))`
        : "import { YSelect, YTag } from '@yok-ui/core'"

      return sfc(selectImports, [
      '<div class="demo-stack">',
      `  <YSelect${textAttribute('label', label)}${valueAttribute}${textAttribute('placeholder', placeholder)}${error ? textAttribute('error', error) : ''}${selectOptionsAttribute}${booleanAttribute('clearable', isClearableScenario || Boolean(state.clearable) || isCollapsedTagsScenario)}${booleanAttribute('multiple', isMultipleScenario || isCollapsedTagsScenario)}${booleanAttribute('collapse-tags', isCollapsedTagsScenario)}${isCollapsedTagsScenario ? ' max-collapse-tags="2"' : ''}${booleanAttribute('filterable', isFilterableScenario || isEmptyFilterScenario || isRemoteScenario || isAllowCreateScenario || isVirtualizedScenario)}${booleanAttribute('allow-create', isAllowCreateScenario)}${booleanAttribute('virtualized', isVirtualizedScenario)}${isVirtualizedScenario ? ' :virtual-height="220" :virtual-item-height="36" :virtual-overscan="2"' : ''}${isFilterableScenario || isEmptyFilterScenario || isRemoteScenario || isAllowCreateScenario || isVirtualizedScenario ? ' search-placeholder="Search packages"' : ''}${isEmptyFilterScenario ? ' empty-text="No package matches"' : ''}${booleanAttribute('loading', isRemoteScenario)}${isRemoteScenario ? ' loading-text="Loading package options..."' : ''}${booleanAttribute('disabled', Boolean(state.disabled) || isDisabledScenario)} />`,
      `  <YTag tone="${tagTone}">${helperText}</YTag>`,
      '</div>'
    ])
    }
  },
  cascader: {
    title: 'Cascader scenario',
    description: '用真实层级选择场景调试单选、多选、禁用错误、移动端和键盘路径，层级数据由运行器注入。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'component', options: [
        { label: '组件路径选择', value: 'component' },
        { label: '多团队权限范围', value: 'access' },
        { label: '禁用错误回填', value: 'locked' },
        { label: '异步级联', value: 'lazy' },
        { label: '移动级联', value: 'mobile' },
        { label: '键盘级联', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Component path' },
      { key: 'modelValue', label: '路径值', type: 'select', defaultValue: 'core,form,cascader', options: [
        { label: 'Core / Form / Cascader', value: 'core,form,cascader' },
        { label: 'Core / Feedback / Tooltip', value: 'core,feedback,tooltip' },
        { label: 'Admin / Data / Data Table', value: 'admin,data,data-table' }
      ] },
      { key: 'multiple', label: '多选', type: 'boolean', defaultValue: false },
      { key: 'separator', label: '分隔符', type: 'text', defaultValue: ' / ' },
      { key: 'clearable', label: '可清空', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isAccessScenario = scenario === 'access'
      const isLockedScenario = scenario === 'locked'
      const isLazyScenario = scenario === 'lazy'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const multiple = Boolean(state.multiple) || isAccessScenario
      const modelValue = multiple
        ? 'core,form,select|admin,data,data-table'
        : isLockedScenario
          ? 'admin,data,data-table'
          : isLazyScenario
            ? ''
          : isKeyboardScenario
            ? 'core,form,cascader'
            : state.modelValue
      const label = isAccessScenario
        ? 'Accessible packages'
        : isLazyScenario
          ? 'Remote component'
        : isMobileScenario
          ? 'Path'
          : isKeyboardScenario
            ? 'Keyboard cascader path'
            : state.label
      const separator = isMobileScenario ? ' > ' : state.separator
      const clearable = Boolean(state.clearable) || isKeyboardScenario
      const placeholder = isAccessScenario
        ? 'Choose access scope'
        : isLazyScenario
          ? 'Load package tree'
        : isMobileScenario
          ? 'Choose path'
          : 'Choose component'
      const helperText = isAccessScenario
        ? 'Multi-path selection mirrors permission scope review.'
        : isLockedScenario
          ? 'Disabled error states stay visible for review flows.'
          : isLazyScenario
            ? 'Lazy loading resolves remote children and keeps failed nodes retryable.'
          : isMobileScenario
            ? 'Compact path copy keeps the trigger readable in narrow layouts.'
            : isKeyboardScenario
              ? 'Enter opens the path picker; Arrow keys move between levels; Escape closes it.'
              : 'Cascader options are injected by the runner.'
      const optionsExpression = isLazyScenario ? 'remoteCascaderOptions' : 'cascaderOptions'
      const setupSource = isLazyScenario
        ? [
            "import { YCascader, YTag, type YCascaderLoadChildren, type YCascaderOption } from '@yok-ui/core'",
            `const remoteCascaderOptions: YCascaderOption[] = ${JSON.stringify(fallbackRemoteCascaderOptions, null, 2)}`,
            `const remoteCascaderChildren: Record<string, YCascaderOption[]> = ${JSON.stringify(fallbackRemoteCascaderChildren, null, 2)}`,
            'const loadRemoteCascaderOptions: YCascaderLoadChildren = (_option, path) => {',
            "  const pathKey = path.map((item) => item.value).join('.')",
            '  return Promise.resolve(remoteCascaderChildren[pathKey] ?? [])',
            '}'
          ].join('\n')
        : "import { YCascader, YTag } from '@yok-ui/core'\nconst cascaderOptions = [{ value: 'core', label: 'Core', children: [{ value: 'form', label: 'Form', children: [{ value: 'cascader', label: 'Cascader' }, { value: 'select', label: 'Select' }] }, { value: 'feedback', label: 'Feedback', children: [{ value: 'tooltip', label: 'Tooltip' }] }] }, { value: 'admin', label: 'Admin', children: [{ value: 'data', label: 'Data', children: [{ value: 'data-table', label: 'Data Table' }] }] }]"

      return sfc(setupSource, [
        '<div class="demo-stack">',
        `  <YCascader${textAttribute('label', label)}${textAttribute('model-value', modelValue)} :options="${optionsExpression}"${textAttribute('placeholder', placeholder)}${booleanAttribute('multiple', multiple)}${textAttribute('separator', separator)}${clearable ? '' : ' :clearable="false"'}${booleanAttribute('disabled', isLockedScenario)}${isLockedScenario ? ' error="Current role cannot change this path."' : ''}${booleanAttribute('lazy', isLazyScenario)}${isLazyScenario ? ' :load="loadRemoteCascaderOptions"' : ''} />`,
        `  <YTag tone="${isLockedScenario ? 'warning' : isKeyboardScenario ? 'warning' : isLazyScenario ? 'success' : 'info'}">${helperText}</YTag>`,
        '</div>'
      ])
    }
  },
  carousel: {
    title: 'Carousel scenario',
    description: '调试轮播基础切换、自动播放、外置指示器、垂直方向、移动布局和键盘路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础轮播', value: 'basic' },
        { label: '自动播放', value: 'autoplay' },
        { label: '外置指示器', value: 'outside' },
        { label: '垂直轮播', value: 'vertical' },
        { label: '移动布局', value: 'mobile' },
        { label: '键盘路径', value: 'keyboard' }
      ] },
      { key: 'indicatorPosition', label: '指示器', type: 'select', defaultValue: 'inside', options: [
        { label: '内部', value: 'inside' },
        { label: '外部', value: 'outside' },
        { label: '隐藏', value: 'none' }
      ] },
      { key: 'loop', label: '循环', type: 'boolean', defaultValue: true },
      { key: 'autoplay', label: '自动播放', type: 'boolean', defaultValue: false },
      { key: 'pauseOnHover', label: '悬停暂停', type: 'boolean', defaultValue: true },
      { key: 'height', label: '高度', type: 'text', defaultValue: '240px' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isAutoplayScenario = scenario === 'autoplay'
      const isOutsideScenario = scenario === 'outside'
      const isVerticalScenario = scenario === 'vertical'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const direction = isVerticalScenario ? 'vertical' : 'horizontal'
      const indicatorPosition = isOutsideScenario
        ? 'outside'
        : isMobileScenario
          ? 'outside'
          : String(state.indicatorPosition)
      const height = isMobileScenario
        ? '180px'
        : isVerticalScenario
          ? '280px'
          : String(state.height || '240px')
      const autoplay = Boolean(state.autoplay) || isAutoplayScenario
      const pauseOnHover = isAutoplayScenario ? Boolean(state.pauseOnHover) : Boolean(state.pauseOnHover)
      const loop = Boolean(state.loop) || isAutoplayScenario
      const helperText = isAutoplayScenario
        ? 'Autoplay can pause on hover and keeps interval configurable.'
        : isOutsideScenario
          ? 'Outside indicators prevent controls from covering dense slide content.'
          : isVerticalScenario
            ? 'Vertical carousel switches with ArrowUp and ArrowDown.'
            : isMobileScenario
              ? 'Mobile height and outside indicators keep content readable.'
              : isKeyboardScenario
                ? 'Focus the viewport, then use ArrowLeft and ArrowRight to switch slides.'
                : 'Carousel uses controlled modelValue and emits change payloads.'

      const imports = `import { YCarousel, YTag } from '@yok-ui/core'

const carouselItems = [
  { title: 'Design tokens', description: 'Theme primitives and semantic colors.', meta: 'Core' },
  { title: 'Live examples', description: 'Runnable examples with API evidence.', meta: 'Docs', tone: 'success' },
  { title: 'Accessibility', description: 'Keyboard and screen reader contracts.', meta: 'A11y', tone: 'warning' }
]`

      return sfc(imports, [
        '<div class="demo-stack">',
        `  <YCarousel :items="carouselItems"${textAttribute('height', height)}${textAttribute('direction', direction)}${textAttribute('indicator-position', indicatorPosition)}${textAttribute('aria-label', isKeyboardScenario ? 'Keyboard carousel' : 'Yok UI maturity carousel')}${autoplay ? ' :autoplay="true" :interval="1800"' : ''}${autoplay && !pauseOnHover ? ' :pause-on-hover="false"' : ''}${loop ? '' : ' :loop="false"'} />`,
        `  <YTag tone="${isKeyboardScenario || isVerticalScenario ? 'warning' : 'info'}">${helperText}</YTag>`,
        '</div>'
      ])
    }
  },
  calendar: {
    title: 'Calendar scenario',
    description: '调试受控月历、禁用日期、移动月历和键盘选择路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础月视图', value: 'basic' },
        { label: '带日程', value: 'events' },
        { label: '禁用周末', value: 'disabled' },
        { label: '移动月历', value: 'mobile' },
        { label: '键盘选择', value: 'keyboard' }
      ] },
      { key: 'modelValue', label: '选中日期', type: 'select', defaultValue: '2026-06-18', options: [
        { label: '2026-06-18', value: '2026-06-18' },
        { label: '2026-06-24', value: '2026-06-24' },
        { label: '2026-07-01', value: '2026-07-01' }
      ] },
      { key: 'locale', label: '区域', type: 'select', defaultValue: 'en-US', options: [
        { label: 'English', value: 'en-US' },
        { label: '中文', value: 'zh-CN' }
      ] },
      { key: 'showAdjacentMonths', label: '显示相邻月份', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isEventsScenario = scenario === 'events'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const value = isMobileScenario
        ? '2026-06-06'
        : isKeyboardScenario
          ? '2026-06-24'
          : String(state.modelValue)
      const locale = isMobileScenario ? 'zh-CN' : String(state.locale)
      const helperText = isEventsScenario
        ? 'Use the dateCell slot on the docs page when events need custom cell content.'
        : isDisabledScenario
          ? 'Weekends are disabled by a pure disabledDate function.'
          : isMobileScenario
            ? 'Mobile calendar keeps controls wrapped and date cells readable.'
            : isKeyboardScenario
              ? 'Calendar cells are native buttons; Tab enters the grid and Enter selects a date.'
              : 'Calendar uses controlled YYYY-MM-DD values and emits select metadata.'
      const imports = isDisabledScenario
        ? `import { YCalendar, YTag } from '@yok-ui/core'

const disableWeekends = (date: Date) => [0, 6].includes(date.getDay())`
        : "import { YCalendar, YTag } from '@yok-ui/core'"

      return sfc(imports, [
        `<div class="demo-stack${isMobileScenario ? ' demo-stack--mobile' : ''}">`,
        `  <YCalendar${textAttribute('model-value', value)}${textAttribute('locale', locale)}${isDisabledScenario ? ' :disabled-date="disableWeekends"' : ''}${Boolean(state.showAdjacentMonths) ? '' : ' :show-adjacent-months="false"'} />`,
        `  <YTag tone="${isDisabledScenario || isKeyboardScenario ? 'warning' : 'info'}">${helperText}</YTag>`,
        '</div>'
      ])
    }
  },
  datePicker: {
    title: 'Date Picker scenario',
    description: '用基础日期、快捷日期、禁用日期、表单校验、移动日期和键盘日期调试单日期工作流。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础日期', value: 'basic' },
        { label: '快捷日期', value: 'shortcut' },
        { label: '禁用日期', value: 'disabled' },
        { label: '校验错误', value: 'error' },
        { label: '表单校验', value: 'validation' },
        { label: '移动日期', value: 'mobile' },
        { label: '键盘日期', value: 'keyboard' }
      ] },
      { key: 'clearable', label: '可清空', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isShortcutScenario = scenario === 'shortcut'
      const isDisabledScenario = scenario === 'disabled'
      const isErrorScenario = scenario === 'error'
      const isValidationScenario = scenario === 'validation'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isShortcutScenario
        ? 'Release shortcut date'
        : isDisabledScenario
          ? 'Weekday review date'
          : isErrorScenario || isValidationScenario
            ? 'Review date'
            : isMobileScenario
              ? 'Due date'
              : isKeyboardScenario
                ? 'Keyboard date picker'
                : 'Release date'
      const value = isErrorScenario || isValidationScenario ? '' : isShortcutScenario ? '2026-06-15' : '2026-06-13'
      const placeholder = isDisabledScenario
        ? 'Pick a weekday'
        : isErrorScenario || isValidationScenario
          ? 'Required before release'
          : isMobileScenario
            ? 'Pick date'
            : isKeyboardScenario
              ? 'Use keyboard to pick'
              : 'Pick a date'
      const helperText = isShortcutScenario
        ? 'Review and launch shortcuts include time preset metadata.'
        : isDisabledScenario
          ? 'Weekends are disabled by a pure disabledDate function.'
        : isErrorScenario
          ? 'Error text explains why the form cannot continue.'
        : isValidationScenario
          ? 'Stable id and aria-describedby connect help text, errors and event log coverage for @change and @visible-change.'
        : isMobileScenario
          ? 'Short labels keep the picker usable in narrow layouts.'
              : isKeyboardScenario
                ? 'Enter or Space opens the calendar; arrows move dates; Escape closes it.'
                : 'Single date values stay as YYYY-MM-DD strings.'
      const pickerLine = `<YDatePicker${isValidationScenario ? ' id="release-date-field"' : ''}${textAttribute('label', label)}${value ? textAttribute('model-value', value) : ''}${textAttribute('placeholder', placeholder)}${isShortcutScenario || isKeyboardScenario ? ' :shortcuts="dateShortcuts"' : ''}${isDisabledScenario ? ' :disabled-date="disableWeekends"' : ''}${isKeyboardScenario ? ' aria-label="Keyboard date picker calendar"' : ''}${isValidationScenario ? ' aria-describedby="release-date-help" invalid' : ''}${isErrorScenario || isValidationScenario ? ' error="Release date is required."' : ''}${state.clearable ? '' : ' :clearable="false"'} />`
      const imports = [
        "import { YDatePicker, YTag } from '@yok-ui/core'",
        isShortcutScenario || isKeyboardScenario ? "import type { YDateShortcut } from '@yok-ui/core'" : '',
        isShortcutScenario || isKeyboardScenario ? [
          '',
          'const dateShortcuts: YDateShortcut[] = [',
          "  { label: 'Today', value: '2026-06-13' },",
          "  { label: 'Review day', value: '2026-06-15', time: '10:00', description: 'Design and QA review' },",
          "  { label: 'Launch day', value: '2026-07-01', time: '20:30', description: 'Low traffic release window' }",
          ']'
        ].join('\n') : '',
        isDisabledScenario ? [
          '',
          'function disableWeekends(date: Date) {',
          '  return date.getDay() === 0 || date.getDay() === 6',
          '}'
        ].join('\n') : ''
      ].filter(Boolean).join('\n')

      return sfc(imports, [
        '<div class="demo-stack">',
        `  ${pickerLine}`,
        isValidationScenario ? '  <p id="release-date-help" class="demo-note">Choose a release date before publishing.</p>' : '',
        `  <YTag tone="${isErrorScenario || isValidationScenario ? 'danger' : isDisabledScenario ? 'warning' : 'info'}">${helperText}</YTag>`,
        '</div>'
      ].filter(Boolean))
    }
  },
  dateRangePicker: {
    title: 'Date Range scenario',
    description: '用冲刺范围、快捷范围、表单校验、发布冲突、只读归档、移动范围和键盘范围调试日期区间工作流。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'sprint', options: [
        { label: '冲刺范围', value: 'sprint' },
        { label: '快捷范围', value: 'shortcut' },
        { label: '未完成范围', value: 'partial' },
        { label: '禁用日期', value: 'disabledDate' },
        { label: '发布冻结', value: 'freeze' },
        { label: '表单校验', value: 'validation' },
        { label: '只读归档', value: 'archive' },
        { label: '移动范围', value: 'mobile' },
        { label: '键盘范围', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Sprint range' },
      { key: 'modelValue', label: '范围', type: 'select', defaultValue: '2026-06-13,2026-06-20', options: [
        { label: 'Sprint', value: '2026-06-13,2026-06-20' },
        { label: 'Release week', value: '2026-07-01,2026-07-07' },
        { label: 'Planning', value: '2026-06-24,2026-06-26' }
      ] },
      { key: 'separator', label: '分隔符', type: 'text', defaultValue: ' to ' },
      { key: 'shortcuts', label: '快捷项', type: 'boolean', defaultValue: true },
      { key: 'clearable', label: '可清空', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isShortcutScenario = scenario === 'shortcut'
      const isPartialScenario = scenario === 'partial'
      const isDisabledDateScenario = scenario === 'disabledDate'
      const isFreezeScenario = scenario === 'freeze'
      const isValidationScenario = scenario === 'validation'
      const isArchiveScenario = scenario === 'archive'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const value = isPartialScenario
        ? '2026-06-24'
        : isValidationScenario
        ? ''
        : isFreezeScenario || isShortcutScenario
        ? '2026-07-01,2026-07-07'
        : isDisabledDateScenario
          ? '2026-06-16,2026-06-18'
        : isMobileScenario
          ? '2026-06-24,2026-06-26'
          : isKeyboardScenario
            ? '2026-06-13,2026-06-20'
            : state.modelValue
      const label = isFreezeScenario
        ? 'Release freeze window'
        : isValidationScenario
          ? 'Release window'
        : isShortcutScenario
          ? 'Shortcut reporting range'
          : isPartialScenario
            ? 'Draft booking window'
            : isDisabledDateScenario
              ? 'Weekday booking range'
          : isMobileScenario
            ? 'Range'
            : isKeyboardScenario
              ? 'Keyboard date range'
              : state.label
      const separator = isMobileScenario ? ' - ' : state.separator
      const shortcuts = Boolean(state.shortcuts) || isShortcutScenario || isKeyboardScenario
      const clearable = Boolean(state.clearable) && !isArchiveScenario
      const helperText = isArchiveScenario
        ? 'Archived ranges stay readable but locked.'
        : isFreezeScenario
          ? 'Error state documents planning conflicts.'
          : isValidationScenario
            ? 'Stable id and aria-describedby connect range help, errors and event log coverage for @change and @visible-change.'
          : isShortcutScenario
            ? 'Shortcut ranges include time window metadata for release freezes and workshops.'
            : isPartialScenario
              ? 'Choose an end date to complete the range.'
              : isDisabledDateScenario
                ? 'Past dates are disabled by a pure disabledDate function.'
            : isMobileScenario
              ? 'Compact separators keep the range readable in narrow layouts.'
              : isKeyboardScenario
                ? 'Enter opens the calendar; Arrow keys move dates; PageUp and PageDown switch months; Escape closes it.'
                : 'Range shortcuts are injected by the runner.'
      const imports = [
        "import { YDateRangePicker, YTag } from '@yok-ui/core'",
        shortcuts ? "import type { YDateRangeShortcut } from '@yok-ui/core'" : '',
        shortcuts ? [
          '',
          'const rangeShortcuts: YDateRangeShortcut[] = [',
          "  { label: 'Sprint', value: ['2026-06-13', '2026-06-20'] },",
          "  { label: 'Release week', value: ['2026-07-01', '2026-07-07'], time: '20:30-09:00', description: 'Night release freeze' },",
          "  { label: 'Planning', value: ['2026-06-24', '2026-06-26'], time: '10:00-17:00', description: 'Roadmap workshop' }",
          ']'
        ].join('\n') : '',
        isDisabledDateScenario ? [
          '',
          'function disablePastDates(date: Date) {',
          '  return date < new Date(2026, 5, 13)',
          '}'
        ].join('\n') : ''
      ].filter(Boolean).join('\n')

      return sfc(imports, [
      '<div class="demo-stack">',
      `  <YDateRangePicker${isValidationScenario ? ' id="release-window-field"' : ''}${textAttribute('label', label)}${textAttribute('model-value', value)}${textAttribute('separator', separator)}${shortcuts ? ' :shortcuts="rangeShortcuts"' : ''}${clearable ? '' : ' :clearable="false"'}${booleanAttribute('disabled', isArchiveScenario)}${isValidationScenario ? ' aria-describedby="release-window-help" invalid' : ''}${isDisabledDateScenario ? ' :disabled-date="disablePastDates"' : ''}${isFreezeScenario ? ' error="Release freeze overlaps with QA handoff."' : ''}${isValidationScenario ? ' error="Select a complete release window."' : ''} />`,
      isValidationScenario ? '  <p id="release-window-help" class="demo-note">Pick both start and end dates before publishing.</p>' : '',
      `  <YTag tone="${isFreezeScenario || isValidationScenario ? 'danger' : isKeyboardScenario || isPartialScenario || isDisabledDateScenario ? 'warning' : 'info'}">${helperText}</YTag>`,
      '</div>'
    ].filter(Boolean))
    }
  },
  textarea: {
    title: 'Textarea scenario',
    description: '调试发布说明、帮助说明、尺寸密度、校验错误、只读备注、移动长文和键盘编辑路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'note', options: [
        { label: '发布说明', value: 'note' },
        { label: '帮助说明', value: 'help' },
        { label: '尺寸密度', value: 'density' },
        { label: '校验错误', value: 'error' },
        { label: '锁定备注', value: 'disabled' },
        { label: '移动长文', value: 'mobile' },
        { label: '键盘长文', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Release note' },
      { key: 'modelValue', label: '当前值', type: 'text', defaultValue: 'Yok UI live examples now track coverage.' },
      { key: 'placeholder', label: '占位提示', type: 'text', defaultValue: 'Describe the release note' },
      { key: 'helper', label: '辅助说明', type: 'text', defaultValue: 'Use textarea for notes and long-form input.' },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ] },
      { key: 'rows', label: '行数', type: 'range', defaultValue: 4, min: 2, max: 8, step: 1 }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isHelpScenario = scenario === 'help'
      const isDensityScenario = scenario === 'density'
      const isErrorScenario = scenario === 'error'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isErrorScenario
        ? 'Release note'
        : isDisabledScenario
          ? 'Archived review note'
          : isHelpScenario
            ? 'Release summary'
            : isDensityScenario
              ? 'Default note density'
          : isMobileScenario
            ? 'Note'
            : isKeyboardScenario
              ? 'Keyboard release note'
              : state.label
      const modelValue = isErrorScenario
        ? ''
        : isDisabledScenario
          ? 'This package was archived after release review.'
          : isHelpScenario
            ? 'Textarea examples now include accessible helper copy.'
            : isDensityScenario
              ? 'Default density keeps release notes readable.'
          : isMobileScenario
            ? 'Short mobile note.'
            : isKeyboardScenario
              ? 'Keyboard users can edit multiple lines without leaving the field.'
              : state.modelValue
      const helper = isErrorScenario
        ? 'Explain the user-facing change before publishing.'
        : isDisabledScenario
          ? 'Archived notes stay readable but cannot be edited.'
          : isHelpScenario
            ? 'Use helper text for format, tone and review expectations.'
            : isDensityScenario
              ? 'Textarea size should follow form density rather than local CSS overrides.'
          : isMobileScenario
            ? 'Keep mobile helper copy short.'
            : isKeyboardScenario
              ? 'Tab focuses the textarea; Shift+Enter keeps editing on multiline content.'
              : state.helper
      const rows = isMobileScenario ? 3 : isKeyboardScenario ? 5 : state.rows
      const placeholder = isErrorScenario
        ? 'Describe the change before release'
        : isHelpScenario
          ? 'Summarize the user-facing change'
          : isDensityScenario
            ? 'Default note'
        : isMobileScenario
          ? 'Short note'
          : state.placeholder
      const describedBy = isHelpScenario ? 'release-summary-help' : isErrorScenario ? 'release-note-error' : ''

      if (isDensityScenario) {
        return sfc("import { YTag, YTextarea } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <YTextarea label="Compact note" model-value="Short release note." placeholder="Small note" size="sm" :rows="2" />',
          '  <YTextarea label="Default note" model-value="Default density keeps multi-line copy readable." placeholder="Default note" size="md" :rows="4" />',
          '  <YTextarea label="Long-form note" model-value="Large density gives editorial copy more breathing room." placeholder="Long-form note" size="lg" :rows="5" />',
          '  <YTag tone="info">Use size props to align textarea density with the surrounding form.</YTag>',
          '</div>'
        ])
      }

      return sfc("import { YTextarea } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YTextarea${textAttribute('label', label)}${textAttribute('model-value', modelValue)}${textAttribute('placeholder', placeholder)}${textAttribute('helper', helper)}${textAttribute('size', state.size)}${numericBinding('rows', rows)}${booleanAttribute('disabled', isDisabledScenario)}${describedBy ? textAttribute('aria-describedby', describedBy) : ''}${isErrorScenario ? ' error="Release note is required before publishing." invalid' : ''} />`,
        ...(isHelpScenario
          ? ['  <p id="release-summary-help">Mention audience impact, migration risk and review owner in one short paragraph.</p>']
          : []),
        '</div>'
      ])
    }
  },
  tooltip: {
    title: 'Tooltip scenario',
    description: '用操作提示、错误说明、禁用原因和快捷键提示调试提示内容、方向、延迟和触发控件。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'action', options: [
        { label: '操作提示', value: 'action' },
        { label: '点击触发', value: 'click' },
        { label: '浅色主题', value: 'light' },
        { label: '禁用原因', value: 'disabled' },
        { label: '快捷键提示', value: 'shortcut' },
        { label: '错误说明', value: 'error' }
      ] },
      { key: 'content', label: '提示内容', type: 'text', defaultValue: 'Create a new component file' },
      { key: 'placement', label: '方向', type: 'select', defaultValue: 'top', options: [
        { label: 'Top', value: 'top' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' }
      ] },
      { key: 'showDelay', label: '延迟', type: 'range', defaultValue: 160, min: 0, max: 600, step: 40 },
      { key: 'buttonText', label: '按钮文案', type: 'text', defaultValue: 'Create' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isDisabledScenario = scenario === 'disabled'
      const isShortcutScenario = scenario === 'shortcut'
      const isErrorScenario = scenario === 'error'
      const isClickScenario = scenario === 'click'
      const isLightScenario = scenario === 'light'
      const content = isDisabledScenario
        ? 'Resolve validation errors before publishing.'
        : isShortcutScenario
          ? 'Press Command K to open command palette.'
          : isErrorScenario
            ? 'Fix validation errors before publishing.'
            : isClickScenario
              ? 'Click again to close this tooltip.'
              : isLightScenario
                ? 'Light theme keeps dense settings readable.'
            : state.content
      const placement = isShortcutScenario || isErrorScenario ? 'bottom' : isLightScenario ? 'right' : state.placement
      const showDelay = isShortcutScenario || isErrorScenario ? 0 : state.showDelay
      const buttonText = isShortcutScenario
        ? 'Search commands'
        : isErrorScenario
          ? 'Publish blocked'
          : isClickScenario
            ? 'Click tooltip'
            : isLightScenario
              ? 'Settings help'
          : state.buttonText
      const trigger = isClickScenario ? 'click' : undefined
      const theme = isLightScenario ? 'light' : undefined
      const open = isClickScenario
      const helper = isClickScenario
        ? 'Click trigger mirrors controlled tooltip workflows.'
        : isLightScenario
          ? 'Light tooltip works for dense toolbars and settings rows.'
          : isDisabledScenario
            ? 'Disabled buttons stay disabled; explain the state from nearby help.'
            : isShortcutScenario
              ? 'Shortcut hints appear immediately for keyboard-first users.'
              : isErrorScenario
                ? 'Validation tooltips supplement visible error states.'
                : 'Hover and focus share the same short explanation.'

      return sfc("import { YButton, YTag, YTooltip } from '@yok-ui/core'", [
      '<div class="demo-stack">',
      `<YTooltip${textAttribute('content', content)}${textAttribute('placement', placement)}${trigger ? textAttribute('trigger', trigger) : ''}${theme ? textAttribute('theme', theme) : ''}${booleanAttribute('open', open)}${numericBinding('show-delay', showDelay)}${isLightScenario ? ' :hide-delay="80"' : ''}>`,
      `  <YButton variant="${isDisabledScenario || isErrorScenario ? 'secondary' : 'primary'}"${booleanAttribute('disabled', isDisabledScenario)}>${escapeAttribute(buttonText)}</YButton>`,
      '</YTooltip>',
      `  <YTag tone="${isErrorScenario ? 'danger' : isClickScenario || isShortcutScenario ? 'warning' : 'info'}">${helper}</YTag>`,
      '</div>'
    ])
    }
  },
  dropdown: {
    title: 'Dropdown scenario',
    description: '调试动作菜单、定位、触发方式、禁用状态、保持展开和键盘菜单路径，菜单数据由运行器注入。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'actions', options: [
        { label: '动作菜单', value: 'actions' },
        { label: '右侧对齐', value: 'placement' },
        { label: '禁用危险项', value: 'danger' },
        { label: '悬浮触发', value: 'hover' },
        { label: '不自动关闭', value: 'persistent' },
        { label: '禁用触发', value: 'disabled' },
        { label: '键盘菜单', value: 'keyboard' }
      ] },
      { key: 'label', label: '按钮文案', type: 'text', defaultValue: 'Actions' },
      { key: 'align', label: '对齐', type: 'select', defaultValue: 'end', options: [
        { label: 'Start', value: 'start' },
        { label: 'End', value: 'end' }
      ] },
      { key: 'open', label: '默认展开', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isPlacementScenario = scenario === 'placement'
      const isDangerScenario = scenario === 'danger'
      const isHoverScenario = scenario === 'hover'
      const isPersistentScenario = scenario === 'persistent'
      const isDisabledTriggerScenario = scenario === 'disabled'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isKeyboardScenario
        ? 'Keyboard actions'
        : isDisabledTriggerScenario
          ? 'Locked actions'
          : isPersistentScenario
            ? 'Sticky menu'
            : isHoverScenario
              ? 'Hover actions'
              : isDangerScenario
                ? 'Review actions'
                : isPlacementScenario
                  ? 'Row actions'
                  : state.label
      const align = isKeyboardScenario ? 'start' : isPlacementScenario ? 'end' : state.align
      const placement = isHoverScenario ? 'top-start' : isPlacementScenario ? 'bottom-end' : ''
      const trigger = isHoverScenario ? 'hover' : ''
      const isOpen = Boolean(state.open) && !isDisabledTriggerScenario
      const tone = isDangerScenario ? 'warning' : isKeyboardScenario || isPersistentScenario ? 'info' : isDisabledTriggerScenario ? 'neutral' : 'success'
      const helper = isDangerScenario
        ? 'Delete draft is visible but disabled until validation passes.'
        : isKeyboardScenario
          ? 'Enter, Space and Arrow keys operate the menu.'
          : isDisabledTriggerScenario
            ? 'The trigger is disabled, so pointer and keyboard entry stay closed.'
            : isPersistentScenario
              ? 'Selecting items keeps the menu open for batch workflows.'
              : isHoverScenario
                ? 'Hover trigger uses top-start placement for compact toolbars.'
                : isPlacementScenario
                  ? 'Bottom-end placement keeps row menus inside narrow layouts.'
                  : 'Menu items are injected by the docs runner.'
      const items = isDangerScenario
        ? [
            { label: 'View docs', value: 'docs' },
            { label: 'Duplicate draft', value: 'duplicate' },
            { label: 'Delete draft', value: 'delete', disabled: true }
          ]
        : isKeyboardScenario
          ? [
              { label: 'Open command', value: 'open-command' },
              { label: 'Copy shortcut', value: 'copy-shortcut' },
              { label: 'Close menu', value: 'close-menu' }
            ]
          : isDisabledTriggerScenario
            ? [
                { label: 'Publish release', value: 'publish' },
                { label: 'Copy link', value: 'copy-link' },
                { label: 'Archive release', value: 'archive' }
              ]
            : isPersistentScenario
              ? [
                  { label: 'Select all rows', value: 'select-all' },
                  { label: 'Mark as reviewed', value: 'reviewed' },
                  { label: 'Export selected', value: 'export' }
                ]
              : isHoverScenario
                ? [
                    { label: 'Open preview', value: 'preview' },
                    { label: 'Copy token', value: 'copy-token' },
                    { label: 'View history', value: 'history' }
                  ]
                : isPlacementScenario
                  ? [
                      { label: 'Open row', value: 'open-row' },
                      { label: 'Pin row', value: 'pin-row' },
                      { label: 'Archive row', value: 'archive-row' }
                    ]
                  : [
                      { label: 'View docs', value: 'docs' },
                      { label: 'Copy command', value: 'copy' },
                      { label: 'Delete draft', value: 'delete', disabled: true }
                    ]
      const itemsExpression = items
        .map((item) => `{ label: '${item.label}', value: '${item.value}'${item.disabled ? ', disabled: true' : ''} }`)
        .join(', ')

      return sfc("import { YDropdown, YTag } from '@yok-ui/core'", [
      '<div class="demo-stack">',
      `  <YDropdown${textAttribute('label', label)} :items="[${itemsExpression}]"${placement ? textAttribute('placement', placement) : textAttribute('align', align)}${trigger ? textAttribute('trigger', trigger) : ''}${booleanAttribute('disabled', isDisabledTriggerScenario)}${booleanAttribute('open', isOpen)}${isPersistentScenario ? ' :hide-on-click="false"' : ''} />`,
      `  <YTag tone="${tone}">${helper}</YTag>`,
      '</div>'
    ])
    }
  },
  popover: {
    title: 'Popover scenario',
    description: '用说明、确认、空状态、移动避让和键盘触发场景调试浮层标题、内容、方向和展开状态。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'note', options: [
        { label: '说明卡片', value: 'note' },
        { label: '确认提示', value: 'confirm' },
        { label: '空状态引导', value: 'empty' },
        { label: '移动避让', value: 'mobile' },
        { label: '悬浮方位', value: 'placement' },
        { label: '禁用触发', value: 'disabled' },
        { label: '键盘触发', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Coverage note' },
      { key: 'content', label: '内容', type: 'text', defaultValue: 'Add live examples before marking a component documented.' },
      { key: 'placement', label: '方向', type: 'select', defaultValue: 'bottom', options: [
        { label: 'Top', value: 'top' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' }
      ] },
      { key: 'open', label: '默认展开', type: 'boolean', defaultValue: true },
      { key: 'detailText', label: '面板标签', type: 'text', defaultValue: 'Panel content can carry compact guidance.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isConfirmScenario = scenario === 'confirm'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isPlacementScenario = scenario === 'placement'
      const isDisabledScenario = scenario === 'disabled'
      const isKeyboardScenario = scenario === 'keyboard'
      const title = isConfirmScenario
        ? 'Archive draft?'
        : isEmptyScenario
          ? 'No filters saved'
          : isMobileScenario
            ? 'Compact guidance'
            : isPlacementScenario
              ? 'Placement details'
              : isDisabledScenario
                ? 'Unavailable details'
            : isKeyboardScenario
              ? 'Keyboard popover'
              : state.title
      const content = isConfirmScenario
        ? 'This keeps the record but hides it from default views.'
        : isEmptyScenario
          ? 'Create a saved view to return to this query quickly.'
          : isMobileScenario
            ? 'Short copy and bottom placement avoid covering the trigger on narrow screens.'
            : isPlacementScenario
              ? 'Hover or focus reveals this popover beside the trigger.'
              : isDisabledScenario
                ? 'Disabled popovers keep the trigger inert until the workflow is ready.'
            : isKeyboardScenario
              ? 'Enter and Space open the popover; Escape closes it and keeps focus on the trigger.'
              : state.content
      const placement = isConfirmScenario
        ? 'top'
        : isPlacementScenario
          ? 'right-start'
          : isMobileScenario || isKeyboardScenario || isDisabledScenario
            ? 'bottom'
            : state.placement
      const detailText = isConfirmScenario
        ? 'Confirm flows need focused copy.'
        : isEmptyScenario
          ? 'Popover can guide compact empty states.'
          : isMobileScenario
            ? 'Bottom placement keeps content readable on mobile.'
            : isPlacementScenario
              ? 'Hover placement uses right-start with a short show delay.'
              : isDisabledScenario
                ? 'Disabled popovers keep the trigger inert.'
            : isKeyboardScenario
              ? 'Enter and Space open the popover; Escape closes it.'
              : state.detailText
      const trigger = isPlacementScenario ? 'hover' : undefined
      const showDelay = isPlacementScenario ? 120 : 0
      const hideDelay = isPlacementScenario ? 80 : 0
      const isOpen = Boolean(state.open) && !isDisabledScenario

      return sfc("import { YPopover, YTag } from '@yok-ui/core'", [
      '<div class="demo-stack">',
      `  <YPopover${textAttribute('title', title)}${textAttribute('content', content)}${textAttribute('placement', placement)}${trigger ? textAttribute('trigger', trigger) : ''}${booleanAttribute('disabled', isDisabledScenario)}${booleanAttribute('open', isOpen)}${showDelay ? numericBinding('show-delay', showDelay) : ''}${hideDelay ? numericBinding('hide-delay', hideDelay) : ''}>`,
      `    <YTag tone="${isConfirmScenario || isKeyboardScenario ? 'warning' : isEmptyScenario || isMobileScenario ? 'success' : isDisabledScenario ? 'danger' : 'info'}">${escapeAttribute(detailText)}</YTag>`,
      '  </YPopover>',
      '</div>'
    ])
    }
  },
  modal: {
    title: 'Modal scenario',
    description: '用发布确认、危险操作、表单复核、移动弹窗和键盘焦点场景调试弹窗正文、打开状态和关闭策略。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'publish', options: [
        { label: '发布确认', value: 'publish' },
        { label: '危险操作', value: 'danger' },
        { label: '表单复核', value: 'review' },
        { label: '移动弹窗', value: 'mobile' },
        { label: '键盘焦点', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Publish component' },
      { key: 'description', label: '描述', type: 'text', defaultValue: 'Review the release note before publishing.' },
      { key: 'body', label: '正文', type: 'text', defaultValue: 'Modal content should stay focused and easy to dismiss.' },
      { key: 'open', label: '默认打开', type: 'boolean', defaultValue: true },
      { key: 'closeOnOverlay', label: '遮罩关闭', type: 'boolean', defaultValue: true },
      { key: 'closeOnEscape', label: 'ESC 关闭', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isDangerScenario = scenario === 'danger'
      const isReviewScenario = scenario === 'review'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const title = isDangerScenario
        ? 'Delete component draft'
        : isReviewScenario
          ? 'Review component metadata'
          : isMobileScenario
            ? 'Mobile publish check'
            : isKeyboardScenario
              ? 'Keyboard focus modal'
              : state.title
      const description = isDangerScenario
        ? 'This action cannot be undone from the current workspace.'
        : isReviewScenario
          ? 'Check the generated summary before publishing.'
          : isMobileScenario
            ? 'Keep title, body and actions readable on narrow screens.'
            : isKeyboardScenario
              ? 'Tab stays inside the dialog; Escape closes and returns focus to the trigger.'
              : state.description
      const closeOnOverlay = Boolean(state.closeOnOverlay) && !isDangerScenario && !isKeyboardScenario
      const closeOnEscape = Boolean(state.closeOnEscape) || isKeyboardScenario
      const alertText = isDangerScenario
        ? 'Danger flows keep escape and overlay rules explicit.'
        : isMobileScenario
          ? 'Compact modal content keeps the primary action visible.'
          : isKeyboardScenario
            ? 'Tab stays inside the dialog; Escape closes it; focus returns to the opener.'
            : 'The modal is rendered in a safe preview shell.'
      const bodyText = isDangerScenario
        ? 'Type the component name in the production app before deletion.'
        : isReviewScenario
          ? 'Name, package and API contract are ready for final confirmation.'
          : isMobileScenario
            ? 'Use short copy and stable footer actions so the modal remains usable on small screens.'
            : isKeyboardScenario
              ? 'Tab through close, cancel and confirm without leaving the dialog.'
              : state.body

      return sfc("import { YAlert, YModal } from '@yok-ui/core'", [
      '<div class="demo-stack">',
      `  <YAlert tone="${isDangerScenario || isKeyboardScenario ? 'warning' : isMobileScenario ? 'success' : 'info'}" title="Static docs preview">${alertText}</YAlert>`,
      `  <YModal${booleanAttribute('open', state.open)}${textAttribute('title', title)}${textAttribute('description', description)}${closeOnOverlay ? '' : ' :close-on-overlay="false"'}${closeOnEscape ? '' : ' :close-on-escape="false"'}>`,
      `    <p>${escapeAttribute(bodyText)}</p>`,
      '  </YModal>',
      '</div>'
    ])
    }
  },
  drawer: {
    title: 'Drawer scenario',
    description: '用筛选器、详情页、移动导航和键盘关闭场景调试抽屉方向、打开状态和关闭策略。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'settings', options: [
        { label: '配置面板', value: 'settings' },
        { label: '详情页', value: 'detail' },
        { label: '移动导航', value: 'mobileNav' },
        { label: '键盘关闭', value: 'keyboard' },
        { label: '锁定抽屉', value: 'locked' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component settings' },
      { key: 'description', label: '描述', type: 'text', defaultValue: 'Use drawers for secondary configuration.' },
      { key: 'placement', label: '方向', type: 'select', defaultValue: 'right', options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' }
      ] },
      { key: 'open', label: '默认打开', type: 'boolean', defaultValue: true },
      { key: 'closeOnOverlay', label: '遮罩关闭', type: 'boolean', defaultValue: true },
      { key: 'closeOnEscape', label: 'ESC 关闭', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isDetailScenario = scenario === 'detail'
      const isMobileNavScenario = scenario === 'mobileNav'
      const isKeyboardScenario = scenario === 'keyboard'
      const isLockedScenario = scenario === 'locked'
      const placement = isMobileNavScenario ? 'left' : state.placement
      const title = isDetailScenario
        ? 'Component detail'
        : isMobileNavScenario
          ? 'Component navigation'
          : isKeyboardScenario
            ? 'Keyboard dismiss drawer'
            : isLockedScenario
              ? 'Locked publish settings'
            : state.title
      const description = isDetailScenario
        ? 'Review owner, status and release notes without leaving the list.'
        : isMobileNavScenario
          ? 'Compact navigation for narrow screens.'
          : isKeyboardScenario
            ? 'Escape closes the drawer and returns focus to the trigger.'
            : isLockedScenario
              ? 'Publishing is frozen while the release owner reviews this configuration.'
            : state.description
      const closeOnOverlay = Boolean(state.closeOnOverlay) && !isKeyboardScenario && !isLockedScenario
      const closeOnEscape = Boolean(state.closeOnEscape) || isKeyboardScenario
      const helperText = isMobileNavScenario
        ? 'Mobile navigation uses a left drawer instead of stacking the sidebar.'
        : isKeyboardScenario
          ? 'Escape returns focus to the trigger; overlay clicks stay disabled for deliberate keyboard review.'
          : isLockedScenario
            ? 'Locked drawers keep context visible while destructive changes are blocked.'
          : 'Drawer preview'
      const body = isDetailScenario
        ? 'Details can hold metadata, related examples and review history.'
        : isMobileNavScenario
          ? 'Navigation entries stay reachable while the page content remains first.'
          : isKeyboardScenario
            ? 'Tab reaches the close button and footer actions; Escape dismisses the drawer without changing data.'
            : isLockedScenario
              ? 'This drawer explains why the settings cannot be submitted until the release freeze ends.'
            : 'Drawer content can hold forms, filters, or contextual details.'

      return sfc("import { YDrawer, YTag } from '@yok-ui/core'", [
      '<div class="demo-stack">',
      `  <YTag tone="${isMobileNavScenario ? 'success' : isKeyboardScenario || isLockedScenario ? 'warning' : 'info'}">${helperText}</YTag>`,
      `  <YDrawer${booleanAttribute('open', state.open)}${textAttribute('title', title)}${textAttribute('description', description)}${textAttribute('placement', placement)}${closeOnOverlay ? '' : ' :close-on-overlay="false"'}${closeOnEscape ? '' : ' :close-on-escape="false"'}>`,
      `    <p>${body}</p>`,
      '  </YDrawer>',
      '</div>'
    ])
    }
  },
  form: {
    title: 'Form scenario',
    description: '用保存、错误复核、只读审核、移动布局和键盘提交流程调试表单结构。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'save', options: [
        { label: '基础保存', value: 'save' },
        { label: '错误复核', value: 'errors' },
        { label: '错误摘要', value: 'summary' },
        { label: '只读审核', value: 'review' },
        { label: '移动表单', value: 'mobile' },
        { label: '键盘提交', value: 'keyboard' }
      ] },
      { key: 'name', label: '名称', type: 'text', defaultValue: 'Yok UI' },
      { key: 'owner', label: '负责人', type: 'text', defaultValue: 'Core team' },
      { key: 'labelWidth', label: '标签宽度', type: 'select', defaultValue: '96px', options: [
        { label: '72px', value: '72px' },
        { label: '96px', value: '96px' },
        { label: '120px', value: '120px' }
      ] },
      { key: 'scrollToError', label: '滚动到错误', type: 'boolean', defaultValue: true },
      { key: 'disabled', label: '禁用表单', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isErrorScenario = scenario === 'errors'
      const isSummaryScenario = scenario === 'summary'
      const isReviewScenario = scenario === 'review'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const disabled = Boolean(state.disabled) || isReviewScenario
      const labelWidth = isMobileScenario ? '72px' : state.labelWidth

      return sfc("import { YButton, YForm, YFormItem, YFormSummary, YInput, YTag } from '@yok-ui/core'", [
      '<div class="demo-stack">',
      isErrorScenario ? '  <YFormSummary title="Please fix the component form" />' : isSummaryScenario ? '  <YFormSummary title="Review 2 issues before saving." />' : `  <YTag tone="${isReviewScenario ? 'info' : isKeyboardScenario ? 'warning' : 'success'}">${isReviewScenario ? 'Review mode keeps values readable without editing.' : isMobileScenario ? 'Mobile form keeps fields readable with compact labels.' : isKeyboardScenario ? 'Keyboard submit flow: Press Tab through fields and Enter on Submit.' : 'Ready to save component metadata.'}</YTag>`,
      `  <YForm${textAttribute('label-width', labelWidth)}${booleanAttribute('scroll-to-error', Boolean(state.scrollToError) || isKeyboardScenario || isSummaryScenario)}${booleanAttribute('disabled', disabled)}>`,
      `  <YFormItem label="${isSummaryScenario ? 'Component name' : 'Name'}" prop="name"${isSummaryScenario ? ' label-for="component-name" error="Component name is required."' : ''} required>`,
      `    <YInput${isSummaryScenario ? ' id="component-name"' : ''}${textAttribute('model-value', isErrorScenario || isSummaryScenario ? '' : state.name)} placeholder="Library name"${isErrorScenario ? ' error="Name is required."' : ''}${isSummaryScenario ? ' invalid aria-describedby="yok-form-message-name"' : ''} />`,
      '  </YFormItem>',
      `  <YFormItem label="${isSummaryScenario ? 'Release note' : 'Owner'}" prop="${isSummaryScenario ? 'release-note' : 'owner'}"${isSummaryScenario ? ' label-for="release-note" error="Explain the user-facing change."' : ''}>`,
      `    <YInput${isSummaryScenario ? ' id="release-note"' : ''}${textAttribute('model-value', isSummaryScenario ? '' : state.owner)}${isSummaryScenario ? ' placeholder="Mention Vue and the user-facing change" invalid aria-describedby="yok-form-message-release-note"' : ''} />`,
      '  </YFormItem>',
      `    <YButton type="submit" variant="${isErrorScenario || isSummaryScenario ? 'danger' : 'primary'}">${isReviewScenario ? 'Approve snapshot' : isErrorScenario || isSummaryScenario ? 'Review errors' : isKeyboardScenario ? 'Submit with keyboard' : 'Save component'}</YButton>`,
      '  </YForm>',
      '</div>'
    ])
    }
  },
  table: {
    title: 'Table scenario',
    description: '用概览、加载、固定高度、批量选择和键盘巡航场景调试基础表格。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'overview', options: [
        { label: '组件概览', value: 'overview' },
        { label: '加载中', value: 'loading' },
        { label: '滚动矩阵', value: 'scroll' },
        { label: '批量选择', value: 'selection' },
        { label: '展开详情', value: 'expand' },
        { label: '虚拟滚动', value: 'virtual' },
        { label: '列宽偏好', value: 'columns' },
        { label: '空筛选结果', value: 'empty' },
        { label: '远程受控', value: 'remote' },
        { label: '键盘巡航', value: 'keyboard' }
      ] },
      { key: 'caption', label: '标题', type: 'text', defaultValue: 'Component overview' },
      { key: 'summary', label: '摘要', type: 'text', defaultValue: '3 rows · ready' },
      { key: 'maxHeight', label: '最大高度', type: 'select', defaultValue: '320px', options: [
        { label: 'None', value: '' },
        { label: '240px', value: '240px' },
        { label: '320px', value: '320px' }
      ] },
      { key: 'striped', label: '斑马纹', type: 'boolean', defaultValue: true },
      { key: 'compact', label: '紧凑', type: 'boolean', defaultValue: false },
      { key: 'selectable', label: '可选择', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isLoadingScenario = scenario === 'loading'
      const isScrollScenario = scenario === 'scroll'
      const isSelectionScenario = scenario === 'selection'
      const isExpandScenario = scenario === 'expand'
      const isVirtualScenario = scenario === 'virtual'
      const isColumnScenario = scenario === 'columns'
      const isEmptyScenario = scenario === 'empty'
      const isRemoteScenario = scenario === 'remote'
      const isKeyboardScenario = scenario === 'keyboard'

      if (scenario === 'overview') {
        return [
          '<script setup lang="ts">',
          "import { ref } from 'vue'",
          "import { YTable, YTag } from '@yok-ui/core'",
          "import type { YTableFilterState, YTableFilterPayload, YTableSelectionPayload, YTableSortPayload } from '@yok-ui/core'",
          '',
          "const selectedRowKeys = ref(['table'])",
          "const filters = ref<YTableFilterState>({ status: ['Stable'] })",
          '',
          'const columns = [',
          "  { key: 'name', label: 'Component', sortable: true },",
          "  { key: 'status', label: 'Status', filters: [",
          "    { text: 'Stable', value: 'Stable' },",
          "    { text: 'Beta', value: 'Beta' }",
          '  ] },',
          "  { key: 'owner', label: 'Owner' },",
          "  { key: 'stars', label: 'Stars', align: 'right', sortable: true }",
          ']',
          '',
          'const rows = [',
          "  { id: 'button', name: 'YButton', status: 'Stable', owner: 'Core team', stars: 12 },",
          "  { id: 'table', name: 'YTable', status: 'Stable', owner: 'Data team', stars: 9 },",
          "  { id: 'popover', name: 'YPopover', status: 'Beta', owner: 'Overlay team', stars: 5 }",
          ']',
          '',
          'function handleSelectionChange(payload: YTableSelectionPayload) {',
          "  console.log('selectionChange', payload.selectedRowKeys)",
          '}',
          '',
          'function handleSortChange(payload: YTableSortPayload) {',
          "  console.log('sortChange', payload.key, payload.order)",
          '}',
          '',
          'function handleFilterChange(payload: YTableFilterPayload) {',
          "  console.log('filterChange', payload.filters)",
          '}',
          '</' + 'script>',
          '',
          '<template>',
          '  <div class="demo-stack">',
          '    <YTable',
          '      v-model:selected-row-keys="selectedRowKeys"',
          '      v-model:filters="filters"',
          '      :columns="columns"',
          '      :data="rows"',
          '      caption="Component release table"',
          '      summary="Stable components filtered · sort by stars"',
          '      default-sort-key="stars"',
          '      default-sort-order="desc"',
          '      striped',
          '      selectable',
          '      @selection-change="handleSelectionChange"',
          '      @sort-change="handleSortChange"',
          '      @filter-change="handleFilterChange"',
          '    />',
          '    <YTag tone="success">Selection, sorting and filters are wired to real table events.</YTag>',
          '  </div>',
          '</template>'
        ].join('\n')
      }

      const scriptBody = [
        "import { YTable, YTag } from '@yok-ui/core'",
        isExpandScenario ? 'const handleExpandChange = () => {}' : ''
      ].filter(Boolean).join('\n')
      const tableAttrs = `${textAttribute('caption', isLoadingScenario ? 'Loading component rows' : isExpandScenario ? 'Expandable component details' : isKeyboardScenario ? 'Keyboard sortable table' : isEmptyScenario ? 'Filtered component rows' : isRemoteScenario ? 'Remote component rows' : isVirtualScenario ? 'Virtualized component rows' : isColumnScenario ? 'Resizable component columns' : state.caption)}${textAttribute('summary', isLoadingScenario ? 'Request in progress' : isExpandScenario ? '1 row expanded · details visible' : isSelectionScenario ? '2 rows selected' : isKeyboardScenario ? 'Use Tab to reach selection controls, Space to toggle rows, and Enter to activate sortable headers.' : isEmptyScenario ? '0 rows · filters active' : isRemoteScenario ? 'Server mode · params emitted' : isVirtualScenario ? 'Virtual window · 240px viewport' : isColumnScenario ? 'Column widths restored from saved defaults' : state.summary)}${isScrollScenario ? ' max-height="240px"' : state.maxHeight ? textAttribute('max-height', state.maxHeight) : ''}${booleanAttribute('striped', state.striped)}${booleanAttribute('compact', Boolean(state.compact) || isScrollScenario || isVirtualScenario)}${booleanAttribute('selectable', Boolean(state.selectable) || isSelectionScenario || isKeyboardScenario)}${booleanAttribute('loading', isLoadingScenario)}${isLoadingScenario ? ' loading-text="Refreshing component rows..."' : ''}${isSelectionScenario ? ' selected-row-keys="button,data-table" default-selected-row-keys="button,data-table"' : ''}${isKeyboardScenario ? ' selected-row-keys="table"' : ''}${isExpandScenario ? ' expandable expanded-row-keys="1" @expand-change="handleExpandChange"' : ''}${isEmptyScenario ? ' :data="[]" empty-text="No components matched"' : ''}${isRemoteScenario ? ' filter-mode="manual" default-sort-key="stars" default-sort-order="desc" :default-filters="{ status: [\'Stable\'] }"' : ''}${isVirtualScenario ? ' virtualized :virtual-height="240" :virtual-row-height="44" :virtual-overscan="3"' : ''}${isColumnScenario ? ' resizable :min-column-width="112" :default-column-widths="{ name: 184, status: 128 }"' : ''}`

      return sfc(scriptBody, [
      '<div class="demo-stack">',
      isExpandScenario
        ? `  <YTable${tableAttrs}>`
        : `  <YTable${tableAttrs} />`,
      isExpandScenario ? '    <template #expand="{ row, rowKey }">' : '',
      isExpandScenario ? '      <div class="demo-note">{{ rowKey }} · {{ row.detail }}</div>' : '',
      isExpandScenario ? '    </template>' : '',
      isExpandScenario ? '  </YTable>' : '',
      `  <YTag tone="${isLoadingScenario || isRemoteScenario || isVirtualScenario ? 'info' : isKeyboardScenario || isColumnScenario || isExpandScenario ? 'warning' : isEmptyScenario ? 'danger' : 'success'}">${isScrollScenario ? 'Max-height preview documents sticky table regions.' : isSelectionScenario ? 'Selection state mirrors batch operations.' : isExpandScenario ? 'Expandable rows reveal details without leaving table context.' : isVirtualScenario ? 'Virtualized rows keep large component matrices responsive.' : isColumnScenario ? 'Column width defaults document saved table preferences.' : isKeyboardScenario ? 'Use Tab to reach selection controls, Space to toggle rows, and Enter to activate sortable headers.' : isEmptyScenario ? 'No rows matched current filters.' : isRemoteScenario ? 'Remote mode emits sort and filter state without mutating rows.' : 'Columns and rows are injected by the runner.'}</YTag>`,
      '</div>'
    ])
    }
  },
  transfer: {
    title: 'Transfer scenario',
    description: '用权限分配、搜索转移、空目标和只读审核场景调试穿梭框。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'permissions', options: [
        { label: '权限分配', value: 'permissions' },
        { label: '搜索转移', value: 'search' },
        { label: '空目标', value: 'empty' },
        { label: '只读审核', value: 'review' },
        { label: '移动穿梭', value: 'mobile' },
        { label: '键盘穿梭', value: 'keyboard' }
      ] },
      { key: 'modelValue', label: '目标项', type: 'select', defaultValue: 'docs,theme', options: [
        { label: 'Docs + Theme', value: 'docs,theme' },
        { label: 'Release only', value: 'release' },
        { label: 'Empty target', value: '' }
      ] },
      { key: 'filterable', label: '可搜索', type: 'boolean', defaultValue: true },
      { key: 'disabled', label: '禁用', type: 'boolean', defaultValue: false },
      { key: 'emptyText', label: '空状态', type: 'text', defaultValue: 'No options' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isSearchScenario = scenario === 'search'
      const isEmptyScenario = scenario === 'empty'
      const isReviewScenario = scenario === 'review'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const modelValue = isEmptyScenario
        ? ''
        : isReviewScenario
          ? 'docs,theme,release'
          : isKeyboardScenario
            ? 'docs'
            : state.modelValue
      const transferLabel = isKeyboardScenario
        ? 'Keyboard transfer'
        : isMobileScenario
          ? 'Mobile permission transfer'
          : isReviewScenario
            ? 'Readonly permission review'
            : 'Permission transfer'
      const transferTitles = isMobileScenario
        ? "['All', 'Added']"
        : isReviewScenario
          ? "['Available permissions', 'Approved permissions']"
          : "['Available', 'Selected']"
      const transferHint = isKeyboardScenario
        ? 'Tab reaches source checks, move buttons and target checks.'
        : isMobileScenario
          ? 'Compact labels keep dual lists readable on narrow screens.'
          : isReviewScenario
            ? 'Readonly review keeps assigned permissions visible.'
            : isEmptyScenario
              ? 'Empty targets should explain what happens next.'
              : 'Transfer options are injected by the docs runner.'

      return sfc("import { YTag, YTransfer } from '@yok-ui/core'\nconst transferOptions = [{ label: 'Docs', value: 'docs' }, { label: 'Theme', value: 'theme' }, { label: 'Release', value: 'release' }, { label: 'Admin', value: 'admin' }]", [
      '<div class="demo-stack">',
      `  <YTransfer${textAttribute('model-value', modelValue)} :options="transferOptions" :titles="${transferTitles}"${booleanAttribute('filterable', Boolean(state.filterable) || isSearchScenario || isKeyboardScenario)}${booleanAttribute('disabled', Boolean(state.disabled) || isReviewScenario)}${textAttribute('empty-text', isEmptyScenario ? 'No target permissions yet' : state.emptyText)} aria-label="${transferLabel}" />`,
      `  <YTag tone="${isReviewScenario || isKeyboardScenario ? 'warning' : 'info'}">${transferHint}</YTag>`,
      '</div>'
    ])
    }
  },
  tree: {
    title: 'Tree scenario',
    description: '用导航树、权限树和可拖拽分类树调试展开、勾选和选中状态，树数据由运行器注入。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'navigation', options: [
        { label: '文档导航', value: 'navigation' },
        { label: '权限勾选', value: 'permissions' },
        { label: '拖拽分类', value: 'taxonomy' },
        { label: '异步刷新', value: 'lazy' },
        { label: '空树', value: 'empty' },
        { label: '移动树', value: 'mobile' },
        { label: '键盘树', value: 'keyboard' }
      ] },
      { key: 'selectedKey', label: '选中节点', type: 'select', defaultValue: 'button', options: [
        { label: 'Button', value: 'button' },
        { label: 'Date Picker', value: 'date-picker' },
        { label: 'Command Palette', value: 'command-palette' }
      ] },
      { key: 'expandedKeys', label: '展开节点', type: 'select', defaultValue: 'core,product', options: [
        { label: 'Core + Product', value: 'core,product' },
        { label: 'Core only', value: 'core' },
        { label: 'Product only', value: 'product' }
      ] },
      { key: 'checkedKeys', label: '勾选节点', type: 'select', defaultValue: 'button', options: [
        { label: 'Button', value: 'button' },
        { label: 'Button + Tree', value: 'button,tree' },
        { label: 'None', value: '' }
      ] },
      { key: 'checkable', label: '可勾选', type: 'boolean', defaultValue: true },
      { key: 'checkStrictly', label: '父子独立', type: 'boolean', defaultValue: false },
      { key: 'draggable', label: '可拖拽', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isPermissionScenario = scenario === 'permissions'
      const isTaxonomyScenario = scenario === 'taxonomy'
      const isLazyScenario = scenario === 'lazy'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const checkable = Boolean(state.checkable) || isPermissionScenario
      const draggable = Boolean(state.draggable) || isTaxonomyScenario
      const selectedKey = isPermissionScenario || isEmptyScenario
        ? ''
        : isKeyboardScenario
          ? 'date-picker'
          : state.selectedKey
      const expandedKeys = isTaxonomyScenario || isMobileScenario || isKeyboardScenario
        ? 'core,product'
        : state.expandedKeys
      const treeLabel = isEmptyScenario
        ? 'Empty component tree'
        : isMobileScenario
          ? 'Mobile component tree'
          : isKeyboardScenario
            ? 'Keyboard component tree'
            : 'Component tree'
      const treeHint = isEmptyScenario
        ? 'No matching components remain after filtering.'
        : isMobileScenario
          ? 'Short labels keep the tree scannable on narrow screens.'
          : isKeyboardScenario
            ? 'Arrow keys move through visible tree items; Enter selects the active node.'
            : isTaxonomyScenario
              ? 'Drag state documents taxonomy editing affordances.'
            : isPermissionScenario
              ? 'Checked keys mirror permission review flows.'
              : 'Tree data is injected by the docs runner.'

      if (isLazyScenario) {
        return sfc(`import { ref } from 'vue'
import { YButton, YTag, YTree, type YTreeExpose, type YTreeLoadPayload, type YTreeNode } from '@yok-ui/core'

const treeRef = ref<YTreeExpose>()
const lastLoad = ref('Expand remote-core, then refresh it.')
const loadVersions = new Map<string, number>()
const lazyTreeNodes: YTreeNode[] = [
  { key: 'remote-core', label: 'Remote core package' },
  { key: 'remote-admin', label: 'Remote admin package' }
]

async function loadRemoteNode(node: YTreeNode) {
  await new Promise((resolve) => setTimeout(resolve, 240))
  const version = (loadVersions.get(node.key) ?? 0) + 1
  loadVersions.set(node.key, version)

  return [
    { key: \`\${node.key}-workflow-\${version}\`, label: \`Workflow v\${version}\`, isLeaf: true },
    { key: \`\${node.key}-settings-\${version}\`, label: \`Settings v\${version}\`, isLeaf: true }
  ]
}

function handleLoad(payload: YTreeLoadPayload) {
  lastLoad.value = \`\${payload.key}: \${payload.children.length} children loaded\`
}

async function reloadRemoteCore() {
  const refreshed = await treeRef.value?.reloadNode('remote-core')
  lastLoad.value = refreshed ? 'remote-core refreshed' : 'remote-core is not ready to refresh'
}`, [
          '<div class="demo-stack">',
          '  <YButton size="small" @click="reloadRemoteCore">Reload remote-core</YButton>',
          '  <YTree ref="treeRef" :nodes="lazyTreeNodes" lazy :load="loadRemoteNode" aria-label="Async component tree" @load="handleLoad" />',
          '  <YTag tone="info">{{ lastLoad }}</YTag>',
          '</div>'
        ])
      }

      return sfc("import { YTag, YTree } from '@yok-ui/core'", [
      '<div class="demo-stack">',
      `  <YTree${isEmptyScenario ? ' :nodes="[]"' : ''}${textAttribute('selected-key', selectedKey)}${textAttribute('expanded-keys', expandedKeys)}${textAttribute('checked-keys', isPermissionScenario ? 'button,tree' : state.checkedKeys)}${booleanAttribute('checkable', checkable)}${booleanAttribute('check-strictly', Boolean(state.checkStrictly) || isPermissionScenario)}${booleanAttribute('draggable', draggable)}${isEmptyScenario ? ' empty-text="No matching components"' : ''} aria-label="${treeLabel}" />`,
      `  <YTag tone="${isPermissionScenario || isKeyboardScenario ? 'warning' : isEmptyScenario ? 'danger' : 'success'}">${treeHint}</YTag>`,
      '</div>'
    ])
    }
  },
  treeSelect: {
    title: 'Tree Select scenario',
    description: '调试树形选择的叶子选择、任意层级、多选、过滤、禁用节点、空结果、移动端和键盘路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'leaf', options: [
        { label: '叶子选择', value: 'leaf' },
        { label: '任意层级', value: 'strict' },
        { label: '多选范围', value: 'multiple' },
        { label: '过滤树', value: 'filter' },
        { label: '禁用节点', value: 'disabled' },
        { label: '空结果', value: 'empty' },
        { label: '移动选择', value: 'mobile' },
        { label: '键盘选择', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Component' },
      { key: 'modelValue', label: '值', type: 'select', defaultValue: 'button', options: [
        { label: 'Button', value: 'button' },
        { label: 'Select', value: 'select' },
        { label: 'Core', value: 'core' },
        { label: 'Users', value: 'users' },
        { label: 'Empty', value: '' }
      ] },
      { key: 'filterable', label: '可搜索', type: 'boolean', defaultValue: true },
      { key: 'clearable', label: '可清空', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isStrictScenario = scenario === 'strict'
      const isMultipleScenario = scenario === 'multiple'
      const isFilterScenario = scenario === 'filter'
      const isDisabledScenario = scenario === 'disabled'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isMobileScenario ? 'Scope' : String(state.label)
      const value = isStrictScenario
        ? 'core'
        : isMultipleScenario
          ? "['button', 'select']"
          : isDisabledScenario
            ? 'audit'
            : isEmptyScenario
              ? ''
              : String(state.modelValue)
      const valueAttribute = isMultipleScenario
        ? ` :model-value="${value}"`
        : textAttribute('model-value', value)
      const helperText = isStrictScenario
        ? 'checkStrictly allows selecting parent departments or categories.'
        : isMultipleScenario
          ? 'Multiple mode keeps selected nodes as compact tags.'
          : isFilterScenario
            ? 'Filterable tree select preserves parent context for matched nodes.'
            : isDisabledScenario
              ? 'Disabled nodes remain visible but cannot be submitted.'
              : isEmptyScenario
                ? 'Empty state keeps the search path stable.'
                : isKeyboardScenario
                  ? 'Enter or Space opens; Arrow keys move nodes; Escape returns focus.'
                  : isMobileScenario
                    ? 'Short labels and collapsed tags keep the trigger readable.'
                    : 'Tree data is declared in the copied source.'
      const tagTone = isDisabledScenario || isKeyboardScenario
        ? 'warning'
        : isEmptyScenario
          ? 'danger'
          : 'success'
      const nodes = isEmptyScenario
        ? '[]'
        : `[
  {
    key: 'core',
    label: 'Core',
    children: [
      { key: 'button', label: 'Button' },
      { key: 'select', label: 'Select' },
      { key: 'tree-select', label: 'Tree Select' }
    ]
  },
  {
    key: 'admin',
    label: 'Admin',
    children: [
      { key: 'users', label: 'Users' },
      { key: 'audit', label: 'Audit log', disabled: true }
    ]
  }
]`

      return sfc(`import { YTag, YTreeSelect } from '@yok-ui/core'

const treeSelectNodes = ${nodes}`, [
        '<div class="demo-stack">',
        `  <YTreeSelect${textAttribute('label', label)}${valueAttribute} :nodes="treeSelectNodes" default-expanded-keys="core,admin"${booleanAttribute('check-strictly', isStrictScenario)}${booleanAttribute('multiple', isMultipleScenario)}${booleanAttribute('collapse-tags', isMultipleScenario || isMobileScenario)}${isMultipleScenario ? ' :max-collapse-tags="2"' : ''}${booleanAttribute('filterable', Boolean(state.filterable) || isFilterScenario || isEmptyScenario || isKeyboardScenario)}${isFilterScenario || isEmptyScenario ? ' search-placeholder="Search tree nodes"' : ''}${isEmptyScenario ? ' empty-text="No node matches"' : ''}${booleanAttribute('clearable', Boolean(state.clearable) || isMultipleScenario)}${booleanAttribute('disabled', false)}${isKeyboardScenario ? ' tree-aria-label="Keyboard tree select"' : ''} />`,
        `  <YTag tone="${tagTone}">${helperText}</YTag>`,
        '</div>'
      ])
    }
  },
  card: {
    title: 'Card scenario',
    description: '调试信息卡、操作卡、网格卡、移动卡和键盘操作场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'info', options: [
        { label: '信息卡片', value: 'info' },
        { label: '操作卡片', value: 'action' },
        { label: '网格卡片', value: 'grid' },
        { label: '移动卡片', value: 'mobile' },
        { label: '键盘操作', value: 'keyboard' },
        { label: '空状态卡片', value: 'empty' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component depth' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Track docs, API, live examples and a11y.' },
      { key: 'interactive', label: '交互态', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const interactive = Boolean(state.interactive)

      if (scenario === 'action') {
        return sfc("import { YButton, YCard, YTag } from '@yok-ui/core'", [
          `<YCard title="Release candidate" description="Review docs, API, examples and a11y before publishing."${booleanAttribute('interactive', interactive)}>`,
          '  <div class="demo-row">',
          '    <YTag tone="warning">Needs review</YTag>',
          '    <YTag tone="info">4 checks</YTag>',
          '  </div>',
          '  <template #extra>',
          '    <YButton size="sm" variant="ghost">Copy link</YButton>',
          '  </template>',
          '  <template #footer>',
          '    <YButton variant="secondary">Save draft</YButton>',
          '    <YButton variant="primary">Open review</YButton>',
          '  </template>',
          '</YCard>'
        ])
      }

      if (scenario === 'grid') {
        return sfc("import { YCard, YTag } from '@yok-ui/core'", [
          '<div class="demo-grid">',
          '  <YCard title="Core" description="Base primitives" interactive>',
          '    <YTag tone="success">Stable</YTag>',
          '  </YCard>',
          '  <YCard title="Product" description="DX helpers" interactive>',
          '    <YTag tone="info">Beta</YTag>',
          '  </YCard>',
          '  <YCard title="Admin" description="Workflow surfaces" interactive>',
          '    <YTag tone="warning">Review</YTag>',
          '  </YCard>',
          '</div>'
        ])
      }

      if (scenario === 'mobile') {
        return sfc("import { YButton, YCard, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack" style="max-width: 320px">',
          '  <YCard title="Mobile component card" description="Short copy and stacked actions keep the card usable on narrow screens." interactive>',
          '    <YTag tone="success">Ready</YTag>',
          '    <template #footer>',
          '      <YButton variant="primary">Open</YButton>',
          '    </template>',
          '  </YCard>',
          '</div>'
        ])
      }

      if (scenario === 'keyboard') {
        return sfc("import { YButton, YCard, YTag } from '@yok-ui/core'", [
          '<YCard title="Keyboard card action" description="Tab reaches the footer actions instead of making the whole card a button." interactive>',
          '  <YTag tone="info">Focus stays on real controls</YTag>',
          '  <template #footer>',
          '    <YButton variant="secondary">Preview docs</YButton>',
          '    <YButton variant="primary">Open component</YButton>',
          '  </template>',
          '</YCard>'
        ])
      }

      if (scenario === 'empty') {
        return sfc("import { YButton, YCard, YEmpty } from '@yok-ui/core'", [
          '<YCard title="No matching components" description="Card empty states should still explain the next useful action.">',
          '  <YEmpty title="Nothing matched" description="Try clearing filters or creating a new component record." />',
          '  <template #footer>',
          '    <YButton variant="secondary">Clear filters</YButton>',
          '    <YButton variant="primary">Create component</YButton>',
          '  </template>',
          '</YCard>'
        ])
      }

      return sfc("import { YCard, YTag } from '@yok-ui/core'", [
        `<YCard${textAttribute('title', state.title)}${textAttribute('description', state.description)}${booleanAttribute('interactive', interactive)}>`,
        '  <div class="demo-row">',
        '    <YTag tone="success">Live</YTag>',
        '    <YTag tone="info">API</YTag>',
        '  </div>',
        '</YCard>'
      ])
    }
  },
  tagBadge: {
    title: 'Tag & Badge scenario',
    description: '调试状态标签、风险标签、批量状态、移动标签和键盘旁路。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'stable', options: [
        { label: '状态标签', value: 'stable' },
        { label: '风险标签', value: 'risk' },
        { label: '批量状态', value: 'batch' },
        { label: '独立状态', value: 'status' },
        { label: '移动标签', value: 'mobile' },
        { label: '键盘旁路', value: 'keyboard' }
      ] },
      { key: 'tone', label: '标签色', type: 'select', defaultValue: 'success', options: [
        { label: 'Neutral', value: 'neutral' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' },
        { label: 'Info', value: 'info' }
      ] },
      { key: 'tagText', label: '标签内容', type: 'text', defaultValue: 'Stable' },
      { key: 'badgeValue', label: '徽标', type: 'text', defaultValue: '12' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isRiskScenario = scenario === 'risk'
      const isBatchScenario = scenario === 'batch'
      const isStatusScenario = scenario === 'status'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const isDotScenario = isKeyboardScenario || isMobileScenario || isStatusScenario
      const tone = isRiskScenario
        ? 'danger'
        : isBatchScenario
          ? 'warning'
          : isStatusScenario
            ? 'success'
          : isKeyboardScenario
            ? 'info'
            : isMobileScenario
              ? 'neutral'
              : state.tone
      const tagText = isRiskScenario
        ? 'Breaking'
        : isBatchScenario
          ? 'Bulk review'
          : isStatusScenario
            ? 'Online'
          : isMobileScenario
            ? 'Beta'
            : isKeyboardScenario
              ? 'Keyboard safe'
              : state.tagText
      const badgeValue = isRiskScenario
        ? '3'
        : isBatchScenario
          ? '18'
          : isStatusScenario
            ? 'Online'
          : isMobileScenario
            ? '2'
            : state.badgeValue
      const badgeTone = isRiskScenario
        ? 'danger'
        : isBatchScenario
          ? 'warning'
          : isDotScenario
            ? 'success'
            : 'primary'
      const badgeLabel = isRiskScenario
        ? '3 release blockers'
        : isBatchScenario
          ? '18 selected components'
          : isStatusScenario
            ? 'Online status'
          : isMobileScenario
            ? 'Mobile queue has 2 updates'
            : isKeyboardScenario
              ? 'Status details are available'
              : `${badgeValue} unread component notifications`
      const helper = isKeyboardScenario
        ? 'Tags and badges stay non-interactive; keyboard focus moves to the adjacent action.'
        : isRiskScenario
          ? 'Use danger tags for breaking changes, failed checks or destructive queues.'
          : isBatchScenario
          ? 'Batch badges summarize selected or pending items without replacing the status label.'
          : isStatusScenario
            ? 'Standalone status badges work as compact legends without requiring a wrapped target.'
          : isMobileScenario
              ? 'Short mobile tags keep toolbar status compact.'
              : 'Tags carry semantic status; badges carry compact counts.'

      return sfc("import { YBadge, YButton, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        '  <div class="demo-row">',
        `    <YTag${textAttribute('tone', tone)}>${escapeAttribute(tagText)}</YTag>`,
        isStatusScenario
          ? `    <YBadge dot text="Online" tone="success" size="lg"${textAttribute('label', badgeLabel)} />`
          : isKeyboardScenario
            ? `    <YBadge dot${textAttribute('tone', badgeTone)}${textAttribute('label', badgeLabel)}>`
            : `    <YBadge${textAttribute('value', badgeValue)}${Number(badgeValue) > 99 ? ' :max="99"' : ''}${textAttribute('tone', badgeTone)}${textAttribute('label', badgeLabel)}${isMobileScenario ? ' placement="bottom-end"' : ''}${isBatchScenario ? ' size="lg" :offset="[8, -4]"' : ''}>`,
        isStatusScenario ? '' : `      <YButton variant="${isRiskScenario ? 'primary' : 'secondary'}">${isRiskScenario ? 'Release' : isBatchScenario ? 'Selection' : 'Inbox'}</YButton>`,
        isStatusScenario ? '' : '    </YBadge>',
        isBatchScenario ? '    <YTag tone="info">Selected</YTag>' : '',
        isKeyboardScenario ? '    <YButton variant="secondary">Open status details</YButton>' : '',
        '  </div>',
        `  <YTag tone="${isRiskScenario ? 'danger' : 'info'}">${helper}</YTag>`,
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  skeleton: {
    title: 'Skeleton scenario',
    description: '调试详情卡片、远程列表、防闪烁、移动端和读屏加载状态。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'detail', options: [
        { label: '详情卡片加载', value: 'detail' },
        { label: '列表加载', value: 'list' },
        { label: '快速返回', value: 'fast' },
        { label: '移动骨架', value: 'mobile' },
        { label: '读屏状态', value: 'screenReader' }
      ] },
      { key: 'rows', label: '行数', type: 'range', defaultValue: 3, min: 1, max: 8, step: 1 },
      { key: 'animated', label: '动画', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const rows = Number(state.rows)
      const animationAttribute = state.animated ? '' : ' :animated="false"'

      if (scenario === 'list') {
        return sfc("import { YSkeleton, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack" aria-label="Loading release queue">',
          '  <YTag tone="info">Remote list loading</YTag>',
          '  <div v-for="item in 3" :key="item" class="demo-row">',
          `    <YSkeleton variant="circle"${animationAttribute} label="Loading assignee avatar" />`,
          `    <YSkeleton :rows="2"${animationAttribute} label="Loading release item" />`,
          '  </div>',
          '</div>'
        ])
      }

      if (scenario === 'fast') {
        return sfc("import { YSkeleton, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack" aria-label="Fast response loading guard">',
          '  <YTag tone="warning">Delay skeleton until the request is actually slow</YTag>',
          `  <YSkeleton :rows="${Math.max(2, Math.min(rows, 4))}"${animationAttribute} label="Loading quick summary" />`,
          `  <YSkeleton variant="rect" height="72px"${animationAttribute} label="Loading compact preview" />`,
          '</div>'
        ])
      }

      if (scenario === 'mobile') {
        return sfc("import { YSkeleton } from '@yok-ui/core'", [
          '<div class="demo-stack" aria-label="Mobile loading card" style="max-width: 320px">',
          `  <YSkeleton variant="rect" height="96px"${animationAttribute} label="Loading mobile hero" />`,
          `  <YSkeleton :rows="2"${animationAttribute} label="Loading mobile copy" />`,
          '</div>'
        ])
      }

      if (scenario === 'screenReader') {
        return sfc("import { YSkeleton } from '@yok-ui/core'", [
          '<div class="demo-stack" role="status" aria-label="Loading account summary">',
          '  <p>Screen readers hear one useful status instead of every decorative line.</p>',
          `  <YSkeleton variant="circle"${animationAttribute} />`,
          `  <YSkeleton :rows="${rows}"${animationAttribute} />`,
          `  <YSkeleton variant="rect" height="88px"${animationAttribute} />`,
          '</div>'
        ])
      }

      return sfc("import { YSkeleton, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack" aria-label="Loading component detail card">',
        '  <YTag tone="success">Detail loading</YTag>',
        '  <div class="demo-row">',
        `    <YSkeleton variant="circle"${animationAttribute} label="Loading maintainer avatar" />`,
        `    <YSkeleton :rows="${rows}"${animationAttribute} label="Loading component title and summary" />`,
        '  </div>',
        `  <YSkeleton variant="rect" height="112px"${animationAttribute} label="Loading preview card" />`,
        '</div>'
      ])
    }
  },
  image: {
    title: 'Image scenario',
    description: '调试图片填充、懒加载、失败兜底、受控预览、移动卡片和键盘预览。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'cover', options: [
        { label: '封面预览', value: 'cover' },
        { label: '懒加载占位', value: 'lazy' },
        { label: '失败兜底', value: 'error' },
        { label: '受控预览', value: 'controlled' },
        { label: '移动图片', value: 'mobile' },
        { label: '键盘预览', value: 'keyboard' }
      ] },
      { key: 'fit', label: '填充方式', type: 'select', defaultValue: 'cover', options: [
        { label: 'cover', value: 'cover' },
        { label: 'contain', value: 'contain' },
        { label: 'fill', value: 'fill' },
        { label: 'scale-down', value: 'scale-down' }
      ] },
      { key: 'height', label: '高度', type: 'range', defaultValue: 180, min: 96, max: 280, step: 8 }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isLazyScenario = scenario === 'lazy'
      const isErrorScenario = scenario === 'error'
      const isControlledScenario = scenario === 'controlled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const src = isErrorScenario ? '/missing-yok-image.png' : '/logo.svg'
      const fit = isMobileScenario ? 'cover' : isLazyScenario ? 'contain' : state.fit
      const height = isMobileScenario ? 128 : Number(state.height)
      const helper = isErrorScenario
        ? 'Error slots keep failed media readable and actionable.'
        : isLazyScenario
          ? 'Lazy loading keeps long media lists from blocking the first screen.'
          : isControlledScenario
            ? 'External state can keep preview, analytics and gallery flows aligned.'
            : isMobileScenario
              ? 'Mobile media cards keep fixed height and concise nearby copy.'
              : isKeyboardScenario
                ? 'The image preview trigger is a button; Escape closes the dialog.'
                : 'Images support fit, placeholder, error and preview behavior.'

      if (isControlledScenario) {
        return sfc("import { YButton, YImage, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <YButton variant="secondary">Open preview from external state</YButton>',
          `  <YImage src="/logo.svg" alt="Yok UI preview asset" fit="contain" width="220px" height="${height}px" radius="18px" preview initial-index="0">`,
          '    <template #preview-footer>Preview state can be controlled by previewOpen in application code.</template>',
          '  </YImage>',
          `  <YTag tone="info">${helper}</YTag>`,
          '</div>'
        ])
      }

      return sfc("import { YButton, YImage, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YImage${textAttribute('src', src)} alt="${isErrorScenario ? 'Broken media preview' : 'Yok UI preview asset'}"${textAttribute('fit', fit)} width="${isMobileScenario ? '100%' : '220px'}" height="${height}px" radius="18px"${isLazyScenario ? ' lazy' : ''}${!isErrorScenario ? ' preview' : ''}>`,
        isLazyScenario ? '    <template #placeholder>Loading media preview...</template>' : '',
        isErrorScenario ? '    <template #error><span>Image unavailable. Replace the asset or show fallback copy.</span></template>' : '',
        isKeyboardScenario ? '    <template #preview-footer>Escape closes the preview dialog.</template>' : '',
        '  </YImage>',
        isKeyboardScenario ? '  <YButton variant="secondary">Next focus target</YButton>' : '',
        `  <YTag tone="${isErrorScenario ? 'danger' : isLazyScenario ? 'warning' : 'success'}">${helper}</YTag>`,
        '</div>'
      ].filter(Boolean))
    }
  },
  scrollbar: {
    title: 'Scrollbar scenario',
    description: '调试固定高度、紧凑面板、横向内容、移动高度和键盘滚动路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '基础滚动', value: 'default' },
        { label: '紧凑面板', value: 'compact' },
        { label: '横向滚动', value: 'horizontal' },
        { label: '空内容', value: 'empty' },
        { label: '移动滚动', value: 'mobile' },
        { label: '键盘滚动', value: 'keyboard' }
      ] },
      { key: 'height', label: '高度', type: 'range', defaultValue: 180, min: 120, max: 360, step: 20 },
      { key: 'maxHeight', label: '最大高度', type: 'range', defaultValue: 260, min: 180, max: 420, step: 20 },
      { key: 'minHeight', label: '最小高度', type: 'range', defaultValue: 120, min: 80, max: 220, step: 10 },
      { key: 'native', label: '原生滚动条', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isCompactScenario = scenario === 'compact'
      const isHorizontalScenario = scenario === 'horizontal'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const height = isMobileScenario ? 150 : isCompactScenario ? 130 : isEmptyScenario ? 140 : state.height
      const maxHeight = isCompactScenario ? 180 : state.maxHeight
      const minHeight = isEmptyScenario ? 120 : state.minHeight
      const ariaLabel = isKeyboardScenario
        ? 'Keyboard scrollable release notes'
        : isHorizontalScenario
          ? 'Horizontal package matrix'
          : isMobileScenario
            ? 'Mobile scrollable changelog'
            : isEmptyScenario
              ? 'Empty scrollable changelog'
            : 'Scrollable component changelog'
      const helper = isKeyboardScenario
        ? 'Tab focuses the viewport; keyboard users can scroll inside the region.'
        : isHorizontalScenario
          ? 'Horizontal scrolling is explicit for tables, code and wide metadata.'
          : isCompactScenario
            ? 'Compact panels keep surrounding actions visible instead of stretching the page.'
            : isMobileScenario
              ? 'Shorter mobile height prevents nested content from taking over the first screen.'
              : isEmptyScenario
                ? 'Empty scroll areas still need a clear message, not a silent blank panel.'
              : 'Use Scrollbar when a panel needs predictable internal scrolling.'
      const items = isHorizontalScenario
        ? [
            '<div class="demo-row">',
            '  <YTag tone="success">Core primitives</YTag>',
            '  <YTag tone="info">Product tooling</YTag>',
            '  <YTag tone="warning">Admin workflow</YTag>',
            '  <YTag tone="success">Brand blocks</YTag>',
            '  <YTag tone="info">Resolver map</YTag>',
            '</div>'
          ]
        : isEmptyScenario
          ? [
            '  <YTag tone="warning">No changelog entries matched current filters.</YTag>',
            '  <YTag tone="info">Clear filters to restore the release log.</YTag>'
          ]
        : [
            '  <YTag tone="success">Button docs promoted to Stable</YTag>',
            '  <YTag tone="info">Live Example copied as SFC</YTag>',
            '  <YTag tone="warning">Theme token audit queued</YTag>',
            '  <YTag tone="success">Scrollbar added to Basic</YTag>',
            '  <YTag tone="info">Keyboard focusable viewport</YTag>',
            '  <YTag tone="success">Docs route generated from registry</YTag>'
          ]

      return sfc("import { YScrollbar, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YTag tone="${isCompactScenario || isEmptyScenario ? 'warning' : 'info'}">${helper}</YTag>`,
        `  <YScrollbar${numericBinding('height', height)}${numericBinding('max-height', maxHeight)}${numericBinding('min-height', minHeight)}${booleanAttribute('horizontal', isHorizontalScenario)}${booleanAttribute('native', Boolean(state.native) || isKeyboardScenario)}${textAttribute('aria-label', ariaLabel)}>`,
        isHorizontalScenario ? '    <div class="demo-stack">' : '    <div class="demo-stack">',
        ...items,
        '    </div>',
        '  </YScrollbar>',
        '</div>'
      ])
    }
  },
  empty: {
    title: 'Empty scenario',
    description: '调试首次创建、搜索无结果、权限空态、移动空态和键盘操作场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'create', options: [
        { label: '首次创建', value: 'create' },
        { label: '搜索无结果', value: 'search' },
        { label: '权限空态', value: 'permission' },
        { label: '移动空态', value: 'mobile' },
        { label: '键盘操作', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'No live example yet' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Add an editable runner before marking the docs complete.' },
      { key: 'showAction', label: '显示操作', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isSearchScenario = scenario === 'search'
      const isPermissionScenario = scenario === 'permission'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const title = isSearchScenario
        ? 'No matching components'
        : isPermissionScenario
          ? 'No permission'
          : isMobileScenario
            ? 'Nothing here yet'
            : isKeyboardScenario
              ? 'No saved view selected'
              : state.title
      const description = isSearchScenario
        ? 'Try another keyword or clear filters to see all components.'
        : isPermissionScenario
          ? 'Ask an admin to grant access before you can manage this package.'
          : isMobileScenario
            ? 'Short copy and a single primary action keep mobile empty states useful.'
            : isKeyboardScenario
              ? 'Tab reaches the primary empty-state action first.'
              : state.description
      const actionText = isSearchScenario
        ? 'Clear filters'
        : isPermissionScenario
          ? 'Request access'
          : isMobileScenario
            ? 'Create item'
            : isKeyboardScenario
              ? 'Create saved view'
              : 'Create component'
      const actionVariant = isPermissionScenario ? 'secondary' : 'primary'

      return sfc("import { YButton, YEmpty } from '@yok-ui/core'", [
      `<YEmpty${textAttribute('title', title)}${textAttribute('description', description)}>`,
      state.showAction ? `  <YButton variant="${actionVariant}">${actionText}</YButton>` : '',
      '</YEmpty>'
    ].filter((line): line is string => Boolean(line)))
    }
  },
  upload: {
    title: 'Upload scenario',
    description: '用素材拖拽、已有文件回填、拒绝类型、数量限制、禁用态和键盘路径调试上传区状态。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'assets', options: [
        { label: '拖拽素材', value: 'assets' },
        { label: '已有文件回填', value: 'existing' },
        { label: '严格文件规则', value: 'rules' },
        { label: '数量超出', value: 'exceed' },
        { label: '拒绝类型', value: 'reject' },
        { label: '表单校验', value: 'validation' },
        { label: '请求生命周期', value: 'request' },
        { label: '图片列表操作', value: 'picture' },
        { label: '禁用态', value: 'disabled' },
        { label: '移动上传', value: 'mobile' },
        { label: '键盘路径', value: 'keyboard' }
      ] },
      { key: 'label', label: '标题', type: 'text', defaultValue: 'Upload component assets' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Choose screenshots, icons, or design notes.' },
      { key: 'accept', label: '文件类型', type: 'select', defaultValue: '.png,.jpg,.pdf', options: [
        { label: 'Images + PDF', value: '.png,.jpg,.pdf' },
        { label: 'Images', value: 'image/*' },
        { label: 'CSV', value: '.csv' }
      ] },
      { key: 'maxFiles', label: '最大文件数', type: 'range', defaultValue: 3, min: 0, max: 8, step: 1 },
      { key: 'drag', label: '拖拽区域', type: 'boolean', defaultValue: true },
      { key: 'multiple', label: '多选', type: 'boolean', defaultValue: true },
      { key: 'showDemoFiles', label: '示例文件', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isExistingScenario = scenario === 'existing'
      const strictRules = scenario === 'rules'
      const isExceedScenario = scenario === 'exceed'
      const isRejectScenario = scenario === 'reject'
      const isValidationScenario = scenario === 'validation'
      const isRequestScenario = scenario === 'request'
      const isPictureScenario = scenario === 'picture'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const uploadFilesKey = isRejectScenario
        ? 'rejected-files'
        : isExceedScenario
          ? 'exceed-files'
          : isRequestScenario
            ? 'request-files'
            : isPictureScenario
              ? 'gallery-files'
          : (Boolean(state.showDemoFiles) || isExistingScenario || isDisabledScenario)
              ? 'demo-files'
              : ''
      const rejectedFilesKey = isRejectScenario
        ? 'rejected-files'
        : isExceedScenario
          ? 'exceed-rejected-files'
          : isValidationScenario
            ? 'validation-rejected-files'
            : ''
      const label = strictRules
        ? 'Upload CSV import file'
        : isRejectScenario
          ? 'Upload visual assets'
        : isValidationScenario
          ? 'Publish package'
          : isRequestScenario
            ? 'Upload release package'
            : isPictureScenario
              ? 'Design gallery'
            : isExceedScenario
              ? 'Upload release evidence'
              : isKeyboardScenario
                ? 'Keyboard upload path'
                : isMobileScenario
                  ? 'Mobile release assets'
                  : state.label
      const description = strictRules
        ? 'Only one CSV file is allowed for this import step.'
        : isRejectScenario
          ? 'Only PNG and JPG files are accepted. Rejected files stay visible with a clear reason.'
          : isValidationScenario
            ? 'Attach one production package before release.'
            : isRequestScenario
              ? 'Auto upload uses beforeUpload and customRequest to report progress, success, failure and cancel state.'
              : isPictureScenario
                ? 'Preview, download, reorder, or clear uploaded images.'
              : isExceedScenario
                ? 'Only two evidence files can be attached before release review.'
                : isKeyboardScenario
                  ? 'Use Tab to reach the chooser, then press Enter to open the native file dialog.'
                  : isMobileScenario
                    ? 'Compact upload copy keeps the selected file list readable on narrow screens.'
                    : state.description
      const accept = strictRules
        ? '.csv'
        : isRejectScenario
          ? '.png,.jpg'
          : isValidationScenario
            ? '.zip,.tgz'
            : isRequestScenario
              ? '.zip,.tgz'
              : isPictureScenario
                ? '.png,.jpg'
              : state.accept
      const maxFiles = strictRules
        ? 1
        : isExceedScenario
          ? 2
          : isValidationScenario
            ? 1
            : isRequestScenario
              ? 1
              : isPictureScenario
                ? 0
              : state.maxFiles
      const maxSize = isRequestScenario ? 1048576 : 0
      const drag = Boolean(state.drag) && !strictRules && !isKeyboardScenario && !isPictureScenario
      const multiple = Boolean(state.multiple) && !strictRules && !isKeyboardScenario && !isPictureScenario
      const buttonLabel = isKeyboardScenario ? 'Choose with keyboard' : ''
      const dropLabel = isMobileScenario ? 'Tap to choose or drop files' : ''
      const emptyText = isKeyboardScenario ? 'No files selected. Press Enter on the chooser to open the file dialog.' : ''
      const helperTone = strictRules || isRejectScenario || isExceedScenario || isValidationScenario ? 'warning' : isDisabledScenario ? 'info' : 'success'
      const helperText = strictRules
        ? 'Rules mode makes file constraints explicit before upload.'
        : isRejectScenario
          ? 'Reject state documents accept filtering without hiding the failed file.'
          : isValidationScenario
            ? 'Validation state links the field error, helper copy and rejected queue.'
            : isRequestScenario
              ? 'Request lifecycle mirrors mainstream upload components with a replaceable transport.'
              : isPictureScenario
                ? 'Picture list keeps preview, download, order and clear actions discoverable.'
              : isExceedScenario
                ? 'Exceed state shows the queue after max-files blocks additional input.'
                : isDisabledScenario
                  ? 'Disabled upload keeps controlled files readable but locked.'
                  : isKeyboardScenario
                    ? 'Keyboard scenario keeps the native file dialog reachable.'
                    : uploadFilesKey
                      ? 'Existing files document controlled upload state.'
                      : 'Upload state is safe to preview in docs.'
      const uploadId = isValidationScenario ? 'release-upload-field' : ''
      const ariaDescribedby = isValidationScenario ? 'release-upload-help' : ''
      const error = isValidationScenario ? 'Upload a valid release package before publishing.' : ''
      const scriptBody = [
        "import { YTag, YUpload } from '@yok-ui/core'",
        isRejectScenario
          ? "const uploadFiles = [{ id: 'ok', name: 'component-cover.png', size: 640000, status: 'success', message: 'Accepted' }]\nconst rejectedFiles = [{ id: 'bad', name: 'guide.exe', size: 128000, status: 'error', reason: 'accept', message: 'Unsupported file type. Use PNG or JPG.' }]"
          : '',
        isExceedScenario
          ? "const exceedFiles = [{ id: 'one', name: 'core-preview.png', size: 820000, status: 'success', message: 'Accepted' }, { id: 'two', name: 'docs-snapshot.jpg', size: 1260000, status: 'success', message: 'Accepted' }]\nconst exceedRejectedFiles = [{ id: 'blocked', name: 'extra-token-report.pdf', size: 420000, status: 'error', reason: 'exceed', message: 'Max 2 files. Remove one item before adding more.' }]"
          : '',
        isValidationScenario
          ? "const validationRejectedFiles = [{ id: 'blocked', name: 'release-notes.exe', size: 128000, status: 'error', reason: 'accept', message: 'Only ZIP or TGZ packages can be published.' }]"
          : '',
        isRequestScenario
          ? "const requestFiles = [{ id: 'uploading', name: 'release-package.zip', size: 860000, status: 'uploading', progress: 72, message: 'Uploading' }, { id: 'blocked', name: 'release-notes.tmp', size: 12000, status: 'error', message: 'Temporary files are blocked before upload.' }]\nconst checkUploadFile = (file) => file.name.endsWith('.tmp') ? 'Temporary files are blocked before upload.' : undefined\nconst uploadToStorage = async ({ onProgress }) => {\n  onProgress(72)\n  return { message: 'Uploaded in demo', response: { id: 'demo-upload' } }\n}"
          : '',
        isPictureScenario
          ? "const galleryFiles = [{ id: 'cover', name: 'component-cover.png', size: 640000, status: 'success', url: '/logo.svg', thumbUrl: '/logo.svg' }, { id: 'snapshot', name: 'docs-snapshot.jpg', size: 1260000, status: 'success', url: '/logo.svg', thumbUrl: '/logo.svg' }, { id: 'tokens', name: 'token-board.png', size: 420000, status: 'success', url: '/logo.svg', thumbUrl: '/logo.svg' }]"
          : ''
      ].filter(Boolean).join('\n')

      return sfc(scriptBody, [
      '<div class="demo-stack">',
      isValidationScenario ? '  <p id="release-upload-help" class="demo-note">The release workflow requires a production archive before publish.</p>' : '',
      `  <YUpload${uploadId ? textAttribute('id', uploadId) : ''}${textAttribute('label', label)}${textAttribute('description', description)}${textAttribute('accept', accept)}${numericBinding('max-files', maxFiles)}${maxSize ? numericBinding('max-size', maxSize) : ''}${buttonLabel ? textAttribute('button-label', buttonLabel) : ''}${dropLabel ? textAttribute('drop-label', dropLabel) : ''}${emptyText ? textAttribute('empty-text', emptyText) : ''}${ariaDescribedby ? textAttribute('aria-describedby', ariaDescribedby) : ''}${error ? textAttribute('error', error) : ''}${booleanAttribute('invalid', isValidationScenario)}${booleanAttribute('auto-upload', isRequestScenario)}${isRequestScenario ? ' :before-upload="checkUploadFile" :custom-request="uploadToStorage"' : ''}${isPictureScenario ? ' list-type="picture"' : ''}${booleanAttribute('previewable', isPictureScenario)}${booleanAttribute('downloadable', isPictureScenario)}${booleanAttribute('sortable', isPictureScenario)}${booleanAttribute('clearable', isPictureScenario)}${booleanAttribute('drag', drag)}${booleanAttribute('multiple', multiple)}${booleanAttribute('disabled', isDisabledScenario)}${uploadFilesKey ? textAttribute('model-value', uploadFilesKey) : ''}${rejectedFilesKey ? textAttribute('rejected-files', rejectedFilesKey) : ''} />`,
      `  <YTag tone="${helperTone}">${helperText}</YTag>`,
      '</div>'
    ].filter(Boolean))
    }
  },
  colorPicker: {
    title: 'Color Picker scenario',
    description: '用基础取色、透明度、预设色、清空、表单校验、移动端和键盘输入调试主题颜色工作流。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础取色', value: 'basic' },
        { label: '透明度', value: 'alpha' },
        { label: '预设色', value: 'presets' },
        { label: '可清空', value: 'clear' },
        { label: '校验错误', value: 'error' },
        { label: '表单校验', value: 'validation' },
        { label: '移动色板', value: 'mobile' },
        { label: '键盘输入', value: 'keyboard' }
      ] },
      { key: 'showValue', label: '显示值', type: 'boolean', defaultValue: true },
      { key: 'showText', label: '触发器文本', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isAlphaScenario = scenario === 'alpha'
      const isPresetScenario = scenario === 'presets'
      const isClearScenario = scenario === 'clear'
      const isErrorScenario = scenario === 'error'
      const isValidationScenario = scenario === 'validation'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isAlphaScenario
        ? 'Overlay color'
        : isPresetScenario
          ? 'Brand color'
        : isClearScenario
          ? 'Optional color'
          : isErrorScenario || isValidationScenario
            ? 'Required color'
            : isMobileScenario
                ? 'Accent'
                : isKeyboardScenario
                  ? 'Keyboard color'
                  : 'Accent color'
      const modelValue = isAlphaScenario
        ? '#14B8A680'
        : isClearScenario
          ? ''
          : isErrorScenario || isValidationScenario
            ? '#FB7185'
            : isKeyboardScenario
              ? '#38BDF8'
              : '#14B8A6'
      const helperText = isAlphaScenario
        ? 'HEXA values keep overlay and chart colors editable.'
        : isPresetScenario
          ? 'Brand presets keep theme choices consistent.'
          : isClearScenario
            ? 'Optional color fields can return to an empty value.'
        : isErrorScenario
          ? 'Errors explain required brand or contrast constraints.'
          : isValidationScenario
            ? 'Stable id and aria-describedby connect help text, errors and event log coverage for @change and @clear.'
          : isMobileScenario
                ? 'Small triggers and concise labels keep color forms compact.'
                : isKeyboardScenario
                  ? 'Typing a HEX value keeps keyboard editing first-class.'
                  : 'HEX values stay normalized and copyable.'
      const imports = isPresetScenario || isValidationScenario
        ? "import { YColorPicker, YTag } from '@yok-ui/core'\nconst brandPresets = ['#14B8A6', '#38BDF8', '#A78BFA', '#F472B6', '#FBBF24']"
        : "import { YColorPicker, YTag } from '@yok-ui/core'"
      const pickerLine = `<YColorPicker${isValidationScenario ? ' id="brand-color-field"' : ''}${textAttribute('label', label)}${textAttribute('model-value', modelValue)}${textAttribute('placeholder', isAlphaScenario ? '#14B8A680' : '#14B8A6')}${booleanAttribute('show-alpha', isAlphaScenario)}${booleanAttribute('show-text', Boolean(state.showText) || isAlphaScenario)}${textAttribute('size', isMobileScenario ? 'small' : isAlphaScenario ? 'large' : '')}${isPresetScenario || isValidationScenario ? ' :presets="brandPresets"' : ''}${isValidationScenario ? ' aria-describedby="brand-color-help" invalid' : ''}${state.showValue ? '' : ' :show-value="false"'}${booleanAttribute('clearable', isClearScenario || isValidationScenario)}${isErrorScenario || isValidationScenario ? ' error="Pick a brand-approved color before publishing."' : ''} />`

      return sfc(imports, [
        '<div class="demo-stack">',
        `  ${pickerLine}`,
        isValidationScenario ? '  <p id="brand-color-help" class="demo-note">Choose one approved brand token before publishing.</p>' : '',
        `  <YTag tone="${isErrorScenario || isValidationScenario ? 'danger' : isPresetScenario || isAlphaScenario ? 'success' : 'info'}">${helperText}</YTag>`,
        '</div>'
      ].filter(Boolean))
    }
  },
  avatar: {
    title: 'Avatar scenario',
    description: '调试姓名头像、头像组、缺失头像、移动头像和键盘资料动作。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'initials', options: [
        { label: '姓名头像', value: 'initials' },
        { label: '图片头像', value: 'image' },
        { label: '头像组', value: 'group' },
        { label: '缺失头像', value: 'missing' },
        { label: '移动头像', value: 'mobile' },
        { label: '键盘资料', value: 'keyboard' }
      ] },
      { key: 'name', label: '名称', type: 'text', defaultValue: 'Yok UI' },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ] },
      { key: 'shape', label: '形状', type: 'select', defaultValue: 'circle', options: [
        { label: 'Circle', value: 'circle' },
        { label: 'Square', value: 'square' }
      ] },
      { key: 'tone', label: '语义色', type: 'select', defaultValue: 'primary', options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' }
      ] }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isImageScenario = scenario === 'image'
      const isGroupScenario = scenario === 'group'
      const isMissingScenario = scenario === 'missing'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const name = isMissingScenario
        ? 'Missing Owner'
        : isMobileScenario
          ? 'Yu'
          : isKeyboardScenario
            ? 'Yokry Designer'
            : state.name
      const size = isMobileScenario ? 'sm' : isKeyboardScenario ? 'lg' : state.size
      const shape = isMissingScenario ? 'square' : state.shape
      const tone = isMissingScenario ? 'danger' : isGroupScenario ? 'success' : state.tone
      const helper = isMissingScenario
        ? 'Missing avatar image falls back to initials and a danger ownership label.'
        : isImageScenario
          ? 'Image avatars support srcset, fit and alt text while keeping initials fallback ready.'
          : isGroupScenario
            ? 'Reviewer group keeps each person identifiable with stable initials.'
            : isMobileScenario
              ? 'Mobile avatar rows keep size fixed and labels short.'
              : isKeyboardScenario
                ? 'Avatar remains labelled while the profile action receives keyboard focus.'
                : 'Stable initials fallback keeps collaboration lists readable.'

      if (isGroupScenario) {
        return sfc("import { YAvatar, YAvatarGroup, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <YAvatarGroup label="Reviewer group" :max="3" :total="6" spacing="tight">',
          '    <YAvatar name="Core Team" tone="success" />',
          '    <YAvatar name="Product Owner" tone="primary" />',
          '    <YAvatar name="Design Review" tone="warning" />',
          '  </YAvatarGroup>',
          `  <YTag tone="success">${helper}</YTag>`,
          '</div>'
        ])
      }

      if (isImageScenario) {
        return sfc("import { YAvatar, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <div class="demo-row">',
          '    <YAvatar',
          '      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop"',
          '      src-set="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=192&h=192&fit=crop 2x"',
          '      alt="Yok designer"',
          '      fit="cover"',
          '      size="lg"',
          '    />',
          '    <YAvatar src="/missing-avatar.png" name="Missing Owner" alt="Missing Owner avatar" tone="danger" />',
          '  </div>',
          `  <YTag tone="info">${helper}</YTag>`,
          '</div>'
        ])
      }

      return sfc("import { YAvatar, YButton, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        '  <div class="demo-row">',
        `    <YAvatar${textAttribute('name', name)}${textAttribute('size', size)}${textAttribute('shape', shape)}${textAttribute('tone', tone)} />`,
        isKeyboardScenario ? '    <YButton variant="secondary">Open profile</YButton>' : '',
        '  </div>',
        `  <YTag tone="${isMissingScenario ? 'danger' : 'info'}">${helper}</YTag>`,
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  icon: {
    title: 'Icon scenario',
    description: '调试 SVG 图标尺寸、颜色、命名语义、加载旋转和图标按钮组合。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'decorative', options: [
        { label: '装饰图标', value: 'decorative' },
        { label: '命名图标', value: 'labeled' },
        { label: '加载图标', value: 'loading' },
        { label: '移动工具栏', value: 'mobile' },
        { label: '键盘按钮', value: 'keyboard' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'XS', value: 'xs' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: '28px', value: '28px' }
      ] },
      { key: 'color', label: '颜色', type: 'select', defaultValue: '#0f766e', options: [
        { label: 'Teal', value: '#0f766e' },
        { label: 'Sky', value: '#0284c7' },
        { label: 'Amber', value: '#d97706' },
        { label: 'Danger', value: '#dc2626' }
      ] },
      { key: 'label', label: '可访问名称', type: 'text', defaultValue: 'Stable status' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isLabeledScenario = scenario === 'labeled'
      const isLoadingScenario = scenario === 'loading'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const size = isMobileScenario ? 'sm' : isKeyboardScenario ? 'md' : state.size
      const color = isLoadingScenario ? '#d97706' : state.color
      const label = isLabeledScenario || isLoadingScenario ? state.label : ''
      const svg = [
        '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
        isLoadingScenario
          ? '        <path d="M21 12a9 9 0 1 1-3-6.7" />'
          : isKeyboardScenario
            ? '        <path d="M5 12h14M13 6l6 6-6 6" />'
            : '        <path d="M20 6 9 17l-5-5" />',
        '      </svg>'
      ]
      const iconBlock = [
        `    <YIcon${textAttribute('size', size)}${textAttribute('color', color)}${textAttribute('label', label)}${booleanAttribute('spinning', isLoadingScenario)}>`,
        ...svg,
        '    </YIcon>'
      ]
      const helper = isKeyboardScenario
        ? 'Keyboard focus belongs to the button; the icon stays a visual child.'
        : isMobileScenario
          ? 'Small fixed-size icons keep mobile toolbar actions compact.'
          : isLoadingScenario
            ? 'Loading icon exposes a name and uses the spinning state.'
            : isLabeledScenario
              ? 'Labelled icon is exposed as a named image for assistive tech.'
              : 'Decorative icon is hidden from assistive tech by default.'

      if (isKeyboardScenario) {
        return sfc("import { YButton, YIcon, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <YButton variant="secondary">',
          ...iconBlock.map((line) => `  ${line}`),
          '    Continue',
          '  </YButton>',
          `  <YTag tone="info">${helper}</YTag>`,
          '</div>'
        ])
      }

      return sfc("import { YIcon, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        '  <div class="demo-row">',
        ...iconBlock,
        '  </div>',
        `  <YTag tone="${isLoadingScenario ? 'warning' : 'info'}">${helper}</YTag>`,
        '</div>'
      ])
    }
  },
  breadcrumb: {
    title: 'Breadcrumb scenario',
    description: '调试层级路径、自定义分隔、权限断点、移动路径和键盘返回顺序。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'hierarchy', options: [
        { label: '层级路径', value: 'hierarchy' },
        { label: '自定义分隔', value: 'separator' },
        { label: '权限断点', value: 'disabled' },
        { label: '移动路径', value: 'mobile' },
        { label: '键盘返回', value: 'keyboard' }
      ] },
      { key: 'separator', label: '分隔符', type: 'select', defaultValue: '/', options: [
        { label: '/', value: '/' },
        { label: '>', value: '>' },
        { label: '·', value: '·' }
      ] },
      { key: 'ariaLabel', label: '可访问名称', type: 'text', defaultValue: 'Component breadcrumb' },
      { key: 'caption', label: '说明', type: 'text', defaultValue: 'Items are injected by the docs runner.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isSeparatorScenario = scenario === 'separator'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const separator = isSeparatorScenario ? '>' : isMobileScenario ? '·' : state.separator
      const ariaLabel = isKeyboardScenario ? 'Keyboard breadcrumb' : state.ariaLabel
      const itemsExpression = isDisabledScenario
        ? "{ label: 'Guide', href: '/guide/', value: 'guide' }, { label: 'Admin', href: '/admin/', value: 'admin', disabled: true }, { label: 'Role matrix', value: 'role', current: true }"
        : isMobileScenario
          ? "{ label: 'Docs', href: '/guide/', value: 'docs' }, { label: 'Form', href: '/components/form', value: 'form' }, { label: 'Textarea', value: 'textarea', current: true }"
          : isKeyboardScenario
            ? "{ label: 'Guide', href: '/guide/', value: 'guide' }, { label: 'Components', href: '/components/', value: 'components' }, { label: 'Breadcrumb', value: 'breadcrumb', current: true }"
            : "{ label: 'Guide', href: '/guide/', value: 'guide' }, { label: 'Components', href: '/components/', value: 'components' }, { label: 'Form', href: '/components/form', value: 'form' }, { label: 'Breadcrumb', value: 'breadcrumb', current: true }"
      const caption = isDisabledScenario
        ? 'Admin is hidden for the current role.'
        : isMobileScenario
          ? 'Short labels keep mobile breadcrumb wrapping readable.'
          : isKeyboardScenario
            ? 'Tab reaches ancestor links before the current page label.'
            : isSeparatorScenario
              ? 'Custom separators should not replace the current page label.'
              : state.caption

      return sfc("import { YBreadcrumb, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YBreadcrumb :items="[${itemsExpression}]"${textAttribute('separator', separator)}${textAttribute('aria-label', ariaLabel)} />`,
        `  <YTag tone="${isDisabledScenario ? 'danger' : 'success'}">${escapeAttribute(caption)}</YTag>`,
        '</div>'
      ])
    }
  },
  checkbox: {
    title: 'Checkbox scenario',
    description: '调试基础确认、清单组合、半选状态、必选阻断、锁定项、移动确认和键盘切换场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础确认', value: 'basic' },
        { label: '清单组合', value: 'checklist' },
        { label: '数量限制组', value: 'limited-group' },
        { label: '半选状态', value: 'indeterminate' },
        { label: '表单校验组', value: 'form-validation' },
        { label: '必选确认', value: 'required' },
        { label: '锁定项', value: 'disabled' },
        { label: '移动确认', value: 'mobile' },
        { label: '键盘切换', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Include a11y notes' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Show keyboard and screen reader details.' },
      { key: 'modelValue', label: '选中', type: 'boolean', defaultValue: true },
      { key: 'disabled', label: '禁用', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isChecklistScenario = scenario === 'checklist'
      const isLimitedGroupScenario = scenario === 'limited-group'
      const isIndeterminateScenario = scenario === 'indeterminate'
      const isFormValidationScenario = scenario === 'form-validation'
      const isRequiredScenario = scenario === 'required'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isRequiredScenario
        ? 'Confirm release checklist'
        : isIndeterminateScenario
          ? 'Select all packages'
        : isDisabledScenario
          ? 'Locked by policy'
          : isMobileScenario
            ? 'Include docs'
            : isKeyboardScenario
              ? 'Keyboard reachable checkbox'
              : state.label
      const description = isRequiredScenario
        ? 'Required before publishing a package.'
        : isIndeterminateScenario
          ? '2 of 3 packages selected.'
        : isDisabledScenario
          ? 'This item is controlled by workspace policy.'
          : isMobileScenario
            ? 'Short copy keeps mobile forms readable.'
            : isKeyboardScenario
              ? 'Space toggles the native checkbox after focus.'
              : state.description
      const modelValue = isRequiredScenario ? false : state.modelValue
      const alertTone = isRequiredScenario ? 'danger' : isDisabledScenario ? 'warning' : 'info'
      const alertTitle = isRequiredScenario ? 'Required confirmation' : isKeyboardScenario ? 'Keyboard path' : 'Native input'
      const alertBody = isRequiredScenario
        ? 'Please confirm the release checklist before publishing.'
        : isChecklistScenario || isLimitedGroupScenario
          ? 'Group related checkboxes in a labelled stack when multiple independent options can be selected.'
        : isFormValidationScenario
          ? 'FormItem can pass invalid and aria-describedby to CheckboxGroup while form rules validate the selected array.'
        : isIndeterminateScenario
          ? 'Use indeterminate on parent checkboxes when some, but not all, child items are selected.'
        : isDisabledScenario
          ? 'Disabled checkboxes stay visible when the user cannot change the value.'
          : isKeyboardScenario
            ? 'Space toggles the native checkbox; the custom box remains decorative.'
            : 'Checkbox marks state for later submission instead of applying instantly.'

      if (isChecklistScenario || isLimitedGroupScenario) {
        const selectedValues = isLimitedGroupScenario ? "'api'" : "'api', 'a11y'"
        const groupDescription = isLimitedGroupScenario
          ? 'At least one release gate must stay selected, and at most two can be active.'
          : 'Pick at least one item and no more than three.'
        const maxValue = isLimitedGroupScenario ? 2 : 3
        const groupAlertBody = isLimitedGroupScenario
          ? 'The group disables invalid choices when min or max boundaries would be broken.'
          : alertBody

        return sfc("import { YAlert, YCheckboxGroup } from '@yok-ui/core'", [
          'const checkboxGroupOptions = [',
          "  { label: 'API reviewed', value: 'api', description: 'Props and events match the generated API table.' },",
          "  { label: 'A11y notes included', value: 'a11y', description: 'Keyboard and screen reader expectations are documented.' },",
          "  { label: 'Visual regression pending', value: 'visual', description: 'Mark this when desktop and mobile screenshots pass.' },",
          "  { label: 'Owner approval', value: 'owner', description: 'Locked until the package owner approves.', disabled: true }",
          ']',
          '',
          '<div class="demo-stack">',
          `  <YCheckboxGroup label="Release checklist" description="${groupDescription}" :model-value="[${selectedValues}]" :options="checkboxGroupOptions" :min="1" :max="${maxValue}" />`,
          `  <YAlert tone="info" title="${isLimitedGroupScenario ? 'Selection boundary' : 'Independent choices'}">${groupAlertBody}</YAlert>`,
          '</div>'
        ])
      }

      if (isFormValidationScenario) {
        return sfc("import { YAlert, YCheckboxGroup, YForm, YFormItem } from '@yok-ui/core'", [
          'const checkboxGroupOptions = [',
          "  { label: 'Core', value: 'core', description: 'Base components and theme tokens.' },",
          "  { label: 'Docs', value: 'docs', description: 'Examples, API tables and a11y notes.' },",
          "  { label: 'Admin', value: 'admin', description: 'Workflow components for consoles.' }",
          ']',
          '',
          '<div class="demo-stack">',
          '  <YForm scroll-to-error>',
          '    <YFormItem label="Release packages" prop="packages" required error="Choose at least one package.">',
          '      <YCheckboxGroup label="Release packages" description="Pick the packages included in this release." :model-value="[]" :options="checkboxGroupOptions" invalid aria-describedby="yok-form-message-packages" />',
          '    </YFormItem>',
          '  </YForm>',
          '  <YAlert tone="danger" title="Form validation">Pass invalid and aria-describedby from FormItem to keep grouped checkbox errors accessible.</YAlert>',
          '</div>'
        ])
      }

      return sfc("import { YAlert, YCheckbox } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YCheckbox${textAttribute('label', label)}${textAttribute('description', description)}${textAttribute('model-value', isIndeterminateScenario ? false : modelValue)}${booleanAttribute('indeterminate', isIndeterminateScenario)}${booleanAttribute('disabled', isDisabledScenario || state.disabled)} />`,
        `  <YAlert tone="${alertTone}"${textAttribute('title', alertTitle)}>${alertBody}</YAlert>`,
        '</div>'
      ])
    }
  },
  rate: {
    title: 'Rate scenario',
    description: '用基础评分、半星、评分文案、可清空、只读、移动端和键盘路径调试评价输入。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础评分', value: 'basic' },
        { label: '半星评分', value: 'half' },
        { label: '评分文案', value: 'copy' },
        { label: '可清空', value: 'clear' },
        { label: '只读展示', value: 'readonly' },
        { label: '移动评分', value: 'mobile' },
        { label: '键盘评分', value: 'keyboard' }
      ] },
      { key: 'showValue', label: '显示数值', type: 'boolean', defaultValue: true },
      { key: 'icon', label: '图标', type: 'select', defaultValue: '★', options: [
        { label: 'Star', value: '★' },
        { label: 'Heart', value: '❤' }
      ] }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isHalfScenario = scenario === 'half'
      const isCopyScenario = scenario === 'copy'
      const isClearScenario = scenario === 'clear'
      const isReadonlyScenario = scenario === 'readonly'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isKeyboardScenario
        ? 'Keyboard satisfaction'
        : isReadonlyScenario
          ? 'Average quality'
          : isMobileScenario
            ? 'Fit'
            : isCopyScenario
              ? 'Service quality'
              : isHalfScenario
                ? 'Taste'
                : 'Satisfaction'
      const value = isHalfScenario
        ? 3.5
        : isClearScenario
          ? 4
          : isReadonlyScenario
            ? 4.5
            : isMobileScenario
              ? 3
              : isKeyboardScenario
                ? 2
                : 4
      const count = isMobileScenario ? 3 : 5
      const size = isCopyScenario ? 'large' : isMobileScenario ? 'small' : ''
      const helperText = isHalfScenario
        ? 'Half ratings capture subtle preference without switching to numeric input.'
        : isCopyScenario
          ? 'Texts make every score meaningful instead of leaving users to guess.'
          : isClearScenario
            ? 'Click the same score again to clear a nullable rating.'
            : isReadonlyScenario
              ? 'Readonly scores preserve rating semantics for historical or aggregate data.'
              : isMobileScenario
                ? 'Small size and fewer items keep ratings tappable on narrow screens.'
                : isKeyboardScenario
                  ? 'Arrow keys adjust the rating; Home clears and End selects the maximum.'
                  : 'Rate is best for lightweight preference input.'
      const imports = isCopyScenario
        ? "import { YRate, YTag } from '@yok-ui/core'\nconst rateTexts = ['Poor', 'Fair', 'Good', 'Great', 'Excellent']"
        : "import { YRate, YTag } from '@yok-ui/core'"
      const rateLine = `<YRate${textAttribute('label', label)}${textAttribute('model-value', value)}${numericBinding('count', count)}${booleanAttribute('allow-half', isHalfScenario || isReadonlyScenario)}${booleanAttribute('clearable', isClearScenario)}${booleanAttribute('readonly', isReadonlyScenario)}${state.showValue ? '' : ' :show-value="false"'}${textAttribute('size', size)}${isCopyScenario ? ' :texts="rateTexts"' : ''}${textAttribute('icon', state.icon)}${textAttribute('void-icon', state.icon === '❤' ? '♡' : '')} />`

      return sfc(imports, [
        '<div class="demo-stack">',
        `  ${rateLine}`,
        `  <YTag tone="${isReadonlyScenario ? 'warning' : isCopyScenario ? 'success' : 'info'}">${helperText}</YTag>`,
        '</div>'
      ])
    }
  },
  slider: {
    title: 'Slider scenario',
    description: '用基础滑块、离散步进、范围选择、垂直提示、校验错误、移动滑块和键盘滑块调试连续数值输入。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'value', options: [
        { label: '基础滑块', value: 'value' },
        { label: '离散步进', value: 'step' },
        { label: '范围选择', value: 'range' },
        { label: '垂直提示', value: 'vertical' },
        { label: '校验错误', value: 'error' },
        { label: '移动滑块', value: 'mobile' },
        { label: '键盘滑块', value: 'keyboard' }
      ] },
      { key: 'showValue', label: '显示数值', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isStepScenario = scenario === 'step'
      const isRangeScenario = scenario === 'range'
      const isVerticalScenario = scenario === 'vertical'
      const isErrorScenario = scenario === 'error'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isStepScenario
        ? 'Release confidence'
        : isRangeScenario
          ? 'Budget range'
          : isVerticalScenario
            ? 'Vertical temperature'
            : isErrorScenario
              ? 'Coverage threshold'
              : isMobileScenario
                ? 'Mix'
                : isKeyboardScenario
                  ? 'Keyboard volume'
                  : 'Opacity'
      const modelValue = isStepScenario
        ? 70
        : isRangeScenario
          ? '20,80'
          : isVerticalScenario || isErrorScenario
            ? 65
            : isMobileScenario
              ? 6
              : isKeyboardScenario
                ? 42
                : 60
      const min = 0
      const max = isMobileScenario ? 10 : 100
      const step = isStepScenario ? 10 : isMobileScenario ? 2 : 5
      const marks = isMobileScenario
        ? "[{ value: 0, label: '0' }, { value: 10, label: '10' }]"
        : "[{ value: 0, label: '0' }, { value: 50, label: '50' }, { value: 100, label: '100' }]"
      const helperText = isStepScenario
        ? 'Discrete steps keep release confidence choices scannable and repeatable.'
        : isRangeScenario
          ? 'Range sliders cover price, budget and threshold filters.'
          : isVerticalScenario
            ? 'Vertical sliders keep dashboard thresholds compact.'
            : isErrorScenario
              ? 'Error state explains the business rule before release.'
              : isMobileScenario
                ? 'Short labels and coarse steps keep sliders readable on narrow screens.'
                : isKeyboardScenario
                  ? 'Arrow keys adjust by one step after Tab reaches the native range input.'
                  : 'Use sliders for bounded approximate numeric choices.'
      const sliderLine = `<YSlider${textAttribute('label', label)}${textAttribute('model-value', modelValue)}${numericBinding('min', min)}${numericBinding('max', max)}${numericBinding('step', step)} :marks="${marks}"${state.showValue ? '' : ' :show-value="false"'}${booleanAttribute('range', isRangeScenario)}${booleanAttribute('vertical', isVerticalScenario)}${textAttribute('height', isVerticalScenario ? '180px' : '')}${booleanAttribute('show-tooltip', isVerticalScenario)}${textAttribute('tooltip-placement', isVerticalScenario ? 'right' : '')}${isKeyboardScenario ? ' aria-label="Keyboard volume slider"' : ''}${isErrorScenario ? ' error="Threshold must be at least 80 before release."' : ''} />`

      return sfc("import { YSlider, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  ${sliderLine}`,
        `  <YTag tone="${isErrorScenario ? 'danger' : isRangeScenario || isVerticalScenario ? 'success' : 'info'}">${helperText}</YTag>`,
        '</div>'
      ])
    }
  },
  timePicker: {
    title: 'Time Picker scenario',
    description: '用基础时间、分钟步长、禁用时间、表单校验、移动时间和键盘时间调试单时间工作流。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础时间', value: 'basic' },
        { label: '分钟步长', value: 'step' },
        { label: '禁用时间', value: 'disabled' },
        { label: '校验错误', value: 'error' },
        { label: '表单校验', value: 'validation' },
        { label: '移动时间', value: 'mobile' },
        { label: '键盘时间', value: 'keyboard' }
      ] },
      { key: 'clearable', label: '可清空', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isStepScenario = scenario === 'step'
      const isDisabledScenario = scenario === 'disabled'
      const isErrorScenario = scenario === 'error'
      const isValidationScenario = scenario === 'validation'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isStepScenario
        ? 'Meeting time'
        : isDisabledScenario
          ? 'Review time'
          : isErrorScenario || isValidationScenario
            ? 'Release time'
            : isMobileScenario
              ? 'Pickup time'
              : isKeyboardScenario
                ? 'Keyboard time picker'
                : 'Start time'
      const value = isErrorScenario || isValidationScenario ? '' : isDisabledScenario ? '17:30' : isMobileScenario ? '10:00' : '09:30'
      const minuteStep = isStepScenario || isKeyboardScenario ? 15 : isDisabledScenario || isMobileScenario ? 30 : 5
      const placeholder = isDisabledScenario
        ? 'Before 18:00'
        : isErrorScenario || isValidationScenario
          ? 'Required before release'
          : isMobileScenario
            ? 'Pick time'
            : isKeyboardScenario
              ? 'Use keyboard to pick'
              : 'Select time'
      const helperText = isStepScenario
        ? '15-minute intervals keep meeting schedules predictable.'
        : isDisabledScenario
          ? 'Times after work are disabled by a pure disabledTime function.'
        : isErrorScenario
          ? 'Error text explains why the form cannot continue.'
        : isValidationScenario
          ? 'Stable id and aria-describedby connect help text, errors and event log coverage for @change and @visible-change.'
        : isMobileScenario
          ? 'Short labels and 30-minute steps keep the picker compact.'
              : isKeyboardScenario
                ? 'Enter or Space confirms the active time; arrows move hour and minute.'
                : 'Use HH:mm values for predictable form data.'
      const pickerLine = `<YTimePicker${isValidationScenario ? ' id="release-time-field"' : ''}${textAttribute('label', label)}${value ? textAttribute('model-value', value) : ''}${numericBinding('minute-step', minuteStep)}${textAttribute('placeholder', placeholder)}${isDisabledScenario ? ' :disabled-time="disableAfterWork"' : ''}${isKeyboardScenario ? ' aria-label="Keyboard time picker panel"' : ''}${isValidationScenario ? ' aria-describedby="release-time-help" invalid' : ''}${isErrorScenario || isValidationScenario ? ' error="Release time is required."' : ''}${state.clearable ? '' : ' :clearable="false"'} />`
      const imports = [
        "import { YTag, YTimePicker } from '@yok-ui/core'",
        isDisabledScenario ? "import type { YTimePickerOption } from '@yok-ui/core'" : '',
        isDisabledScenario ? [
          '',
          'function disableAfterWork(time: YTimePickerOption) {',
          '  return time.hour >= 18',
          '}'
        ].join('\n') : ''
      ].filter(Boolean).join('\n')

      return sfc(imports, [
        '<div class="demo-stack">',
        `  ${pickerLine}`,
        isValidationScenario ? '  <p id="release-time-help" class="demo-note">Choose a release time before publishing.</p>' : '',
        `  <YTag tone="${isErrorScenario || isValidationScenario ? 'danger' : isDisabledScenario ? 'warning' : 'info'}">${helperText}</YTag>`,
        '</div>'
      ].filter(Boolean))
    }
  },
  inputNumber: {
    title: 'Input Number scenario',
    description: '用数量范围、小数精度、尺寸密度、无步进器、校验错误、移动数值和键盘步进调试数值输入工作流。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'quantity', options: [
        { label: '数量范围', value: 'quantity' },
        { label: '小数精度', value: 'precision' },
        { label: '尺寸密度', value: 'density' },
        { label: '无步进器', value: 'controls' },
        { label: '校验错误', value: 'error' },
        { label: '移动数值', value: 'mobile' },
        { label: '键盘步进', value: 'keyboard' }
      ] },
      { key: 'showControls', label: '显示步进器', type: 'boolean', defaultValue: true },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ] }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isPrecisionScenario = scenario === 'precision'
      const isDensityScenario = scenario === 'density'
      const isControlsScenario = scenario === 'controls'
      const isErrorScenario = scenario === 'error'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isPrecisionScenario
        ? 'Rating score'
        : isDensityScenario
          ? 'Default quantity'
        : isControlsScenario
          ? 'Budget amount'
          : isErrorScenario
            ? 'Coverage threshold'
            : isMobileScenario
              ? 'Qty'
              : isKeyboardScenario
                ? 'Keyboard quantity'
                : 'Quantity'
      const modelValue = isPrecisionScenario
        ? 4.5
        : isDensityScenario
          ? 24
        : isControlsScenario
          ? 1200
          : isErrorScenario
            ? 80
            : isMobileScenario
              ? 2
              : 4
      const min = isControlsScenario ? 0 : 0
      const max = isPrecisionScenario ? 5 : isControlsScenario ? 10000 : isErrorScenario ? 100 : isMobileScenario ? 9 : 12
      const step = isPrecisionScenario ? 0.5 : isControlsScenario ? 100 : isErrorScenario ? 5 : 1
      const precision = isPrecisionScenario ? 1 : isControlsScenario ? 0 : 0
      const controls = isControlsScenario ? false : Boolean(state.showControls)
      const helperText = isPrecisionScenario
        ? 'Decimal precision keeps scores and ratios predictable.'
        : isDensityScenario
          ? 'Numeric control size should match table filters, dense forms and setup panels.'
        : isControlsScenario
          ? 'Hide steppers for currency-like fields where users type the value directly.'
          : isErrorScenario
            ? 'Error state explains the business rule before release.'
            : isMobileScenario
              ? 'Short labels keep numeric controls readable on narrow screens.'
              : isKeyboardScenario
                ? 'ArrowUp and ArrowDown adjust by one step; Tab reaches the stepper buttons.'
                : 'Numbers stay bounded and normalized.'
      const inputLine = `<YInputNumber${textAttribute('label', label)}${textAttribute('model-value', modelValue)}${numericBinding('min', min)}${numericBinding('max', max)}${numericBinding('step', step)}${numericBinding('precision', precision)}${textAttribute('size', state.size)}${controls ? '' : ' :controls="false"'}${isKeyboardScenario ? ' aria-label="Keyboard quantity stepper"' : ''}${isErrorScenario ? ' error="Threshold must be reviewed before release."' : ''} />`

      if (isDensityScenario) {
        return sfc("import { YInputNumber, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <YInputNumber label="Compact quantity" :model-value="2" :min="0" :max="12" size="sm" />',
          '  <YInputNumber label="Default quantity" :model-value="24" :min="0" :max="99" size="md" />',
          '  <YInputNumber label="Setup quantity" :model-value="48" :min="0" :max="100" size="lg" />',
          '  <YTag tone="info">Match numeric input size to the surrounding form density.</YTag>',
          '</div>'
        ])
      }

      return sfc("import { YInputNumber, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  ${inputLine}`,
        `  <YTag tone="${isErrorScenario ? 'danger' : isControlsScenario ? 'warning' : 'info'}">${helperText}</YTag>`,
        '</div>'
      ])
    }
  },
  radioGroup: {
    title: 'Radio Group scenario',
    description: '调试包选择、受控回填、表单错误、禁用选项、移动单选和键盘选择场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'package', options: [
        { label: '包选择', value: 'package' },
        { label: '受控回填', value: 'controlled' },
        { label: '必选单选', value: 'required' },
        { label: '表单校验组', value: 'form-validation' },
        { label: '禁用选项', value: 'disabledOption' },
        { label: '移动单选', value: 'mobile' },
        { label: '键盘选择', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Package focus' },
      { key: 'modelValue', label: '当前选项', type: 'select', defaultValue: 'core', options: [
        { label: 'Core', value: 'core' },
        { label: 'Product', value: 'product' },
        { label: 'Admin', value: 'admin' }
      ] },
      { key: 'disabled', label: '禁用', type: 'boolean', defaultValue: false },
      { key: 'caption', label: '说明', type: 'text', defaultValue: 'Options are injected by the docs runner.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isControlledScenario = scenario === 'controlled'
      const isRequiredScenario = scenario === 'required'
      const isFormValidationScenario = scenario === 'form-validation'
      const isDisabledOptionScenario = scenario === 'disabledOption'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isMobileScenario
        ? 'Pkg'
        : isKeyboardScenario
          ? 'Keyboard package choice'
          : isControlledScenario
            ? 'Saved package focus'
            : state.label
      const modelValue = isControlledScenario
        ? 'admin'
        : isRequiredScenario || isFormValidationScenario
          ? ''
        : isDisabledOptionScenario
          ? 'core'
          : isMobileScenario
            ? 'product'
            : state.modelValue
      const caption = isDisabledOptionScenario
        ? 'Product is disabled during review; choose Core or Admin for this release.'
        : isRequiredScenario || isFormValidationScenario
          ? 'Please choose one package before continuing.'
        : isMobileScenario
          ? 'Compact package choice keeps radio labels short on narrow screens.'
          : isKeyboardScenario
            ? 'Arrow keys move between radio options after Tab enters the group.'
            : isControlledScenario
              ? 'Existing values should be visible and still editable when the record is open.'
              : state.caption
      const imports = isDisabledOptionScenario
        ? `import { YRadioGroup, YTag } from '@yok-ui/core'

const radioOptions = [
  { label: 'Core', value: 'core' },
  { label: 'Product is disabled during review', value: 'product', disabled: true },
  { label: 'Admin', value: 'admin' }
]`
        : "import { YRadioGroup, YTag } from '@yok-ui/core'"

      if (isFormValidationScenario) {
        return sfc("import { YAlert, YForm, YFormItem, YRadioGroup } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <YForm scroll-to-error>',
          '    <YFormItem label="Package focus" prop="packageName" required error="Choose a package.">',
          '      <YRadioGroup label="Package focus" description="Choose one package before continuing." model-value="" invalid aria-describedby="yok-form-message-packageName" direction="vertical" />',
          '    </YFormItem>',
          '  </YForm>',
          '  <YAlert tone="danger" title="Form validation">Pass invalid and aria-describedby from FormItem to keep radio group errors accessible.</YAlert>',
          '</div>'
        ])
      }

      return sfc(imports, [
        '<div class="demo-stack">',
        `  <YRadioGroup${textAttribute('label', label)}${textAttribute('description', caption)}${textAttribute('model-value', modelValue)}${isRequiredScenario ? ' invalid error="Choose a package." aria-describedby="package-choice-error"' : ''}${isDisabledOptionScenario ? ' :options="radioOptions"' : ''}${booleanAttribute('disabled', state.disabled)} />`,
        `  <YTag tone="${isRequiredScenario ? 'danger' : isDisabledOptionScenario ? 'warning' : isKeyboardScenario ? 'success' : 'info'}">${escapeAttribute(caption)}</YTag>`,
        '</div>'
      ])
    }
  },
  segmented: {
    title: 'Segmented scenario',
    description: '调试视图模式、等宽周期、纵向分段、禁用状态和键盘单选场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'view', options: [
        { label: '视图模式', value: 'view' },
        { label: '等宽周期', value: 'period' },
        { label: '纵向分段', value: 'vertical' },
        { label: '禁用选项', value: 'disabled' },
        { label: '键盘单选', value: 'keyboard' }
      ] },
      { key: 'modelValue', label: '当前选项', type: 'select', defaultValue: 'list', options: [
        { label: 'List', value: 'list' },
        { label: 'Kanban', value: 'kanban' },
        { label: 'Calendar', value: 'calendar' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'sm', value: 'sm' },
        { label: 'md', value: 'md' },
        { label: 'lg', value: 'lg' }
      ] },
      { key: 'shape', label: '形状', type: 'select', defaultValue: 'default', options: [
        { label: 'default', value: 'default' },
        { label: 'round', value: 'round' }
      ] },
      { key: 'block', label: '等宽', type: 'boolean', defaultValue: false },
      { key: 'disabled', label: '禁用', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isPeriodScenario = scenario === 'period'
      const isVerticalScenario = scenario === 'vertical'
      const isDisabledScenario = scenario === 'disabled'
      const isKeyboardScenario = scenario === 'keyboard'
      const modelValue = isPeriodScenario
        ? 'weekly'
        : isVerticalScenario
          ? 'compact'
          : isDisabledScenario
            ? 'list'
            : state.modelValue
      const optionsExpression = isPeriodScenario
        ? "{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }"
        : isVerticalScenario
          ? "{ label: 'Compact', value: 'compact', description: 'Dense tables' }, { label: 'Comfortable', value: 'comfortable', description: 'Forms and review' }, { label: 'Relaxed', value: 'relaxed', description: 'Reading mode' }"
          : isDisabledScenario
            ? "{ label: 'List', value: 'list' }, { label: 'Kanban locked', value: 'kanban', disabled: true }, { label: 'Calendar', value: 'calendar' }"
            : "'List', 'Kanban', 'Calendar'"
      const helper = isPeriodScenario
        ? 'Block segmented controls fit dense dashboard filters.'
        : isVerticalScenario
          ? 'Vertical segmented controls keep descriptions readable in narrow side panels.'
          : isDisabledScenario
            ? 'Disable individual segments when a workflow option is unavailable.'
            : isKeyboardScenario
              ? 'Name groups native radios so keyboard users get expected same-group behavior.'
              : 'Segmented controls switch one compact option at a time.'

      return sfc("import { YSegmented, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YSegmented model-value="${modelValue}" :options="[${optionsExpression}]" aria-label="${isKeyboardScenario ? 'Keyboard view mode' : 'View mode'}"${isKeyboardScenario ? ' name="view-mode"' : ''}${textAttribute('size', state.size)}${textAttribute('shape', state.shape)}${booleanAttribute('block', isPeriodScenario || state.block)}${isVerticalScenario ? ' orientation="vertical"' : ''}${booleanAttribute('disabled', state.disabled)} />`,
        `  <YTag tone="${isDisabledScenario ? 'warning' : isKeyboardScenario ? 'success' : 'info'}">${escapeAttribute(helper)}</YTag>`,
        '</div>'
      ])
    }
  },
  switch: {
    title: 'Switch scenario',
    description: '调试即时设置、状态文案、表单校验、加载、风险开关、锁定开关、移动开关和键盘开关场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'instant', options: [
        { label: '即时设置', value: 'instant' },
        { label: '状态文案', value: 'status' },
        { label: '表单校验开关', value: 'form-validation' },
        { label: '加载开关', value: 'loading' },
        { label: '风险开关', value: 'risk' },
        { label: '锁定开关', value: 'disabled' },
        { label: '移动开关', value: 'mobile' },
        { label: '键盘开关', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Enable fresh cute mode' },
      { key: 'modelValue', label: '开启', type: 'boolean', defaultValue: true },
      { key: 'disabled', label: '禁用', type: 'boolean', defaultValue: false },
      { key: 'caption', label: '提示', type: 'text', defaultValue: 'Instant setting preview' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isStatusScenario = scenario === 'status'
      const isFormValidationScenario = scenario === 'form-validation'
      const isLoadingScenario = scenario === 'loading'
      const isRiskScenario = scenario === 'risk'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isRiskScenario
        ? 'Disable audit trail'
        : isFormValidationScenario
          ? 'Allow release'
        : isLoadingScenario
          ? 'Saving workspace sync'
        : isStatusScenario
          ? 'Sync documentation'
        : isDisabledScenario
          ? 'Workspace policy sync'
          : isMobileScenario
            ? 'Live preview'
            : isKeyboardScenario
              ? 'Keyboard switch'
              : state.label
      const modelValue = isRiskScenario ? false : isStatusScenario || isLoadingScenario ? true : isFormValidationScenario ? false : state.modelValue
      const caption = isRiskScenario
        ? 'Changing this switch has immediate impact, so pair it with danger copy.'
        : isFormValidationScenario
          ? 'Enable the switch before release; FormItem passes invalid and aria-describedby into the control.'
        : isLoadingScenario
          ? 'Loading state keeps the current value visible and blocks repeated toggles while saving.'
        : isStatusScenario
          ? 'On: documentation changes are synced to the release checklist.'
        : isDisabledScenario
          ? 'Controlled by workspace policy and unavailable in this page.'
          : isMobileScenario
            ? 'Short labels keep mobile setting rows easy to scan.'
            : isKeyboardScenario
              ? 'Space or Enter toggles the switch while aria-checked updates.'
              : state.caption
      const tone = isRiskScenario || isFormValidationScenario ? 'danger' : isDisabledScenario || isLoadingScenario ? 'warning' : isStatusScenario ? 'info' : 'success'

      if (isFormValidationScenario) {
        return sfc("import { YAlert, YForm, YFormItem, YSwitch } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <YForm scroll-to-error>',
          '    <YFormItem label="Release confirmation" prop="confirmed" required error="Enable release confirmation.">',
          '      <YSwitch label="Allow release" description="Release requires an explicit confirmation switch." model-value="false" invalid aria-describedby="yok-form-message-confirmed" active-text="Ready" inactive-text="Required" />',
          '    </YFormItem>',
          '  </YForm>',
          '  <YAlert tone="danger" title="Form validation">Switch can receive invalid and aria-describedby from FormItem while keeping role switch semantics.</YAlert>',
          '</div>'
        ])
      }

      return sfc("import { YSwitch, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YSwitch${textAttribute('label', label)}${textAttribute('description', caption)}${textAttribute('model-value', modelValue)}${isStatusScenario ? ' active-text="Synced" inactive-text="Paused"' : ''}${isLoadingScenario ? ' active-text="Saving" inactive-text="Paused" loading' : ''}${isRiskScenario ? ' error="Audit trail cannot be disabled during release review." invalid aria-describedby="audit-switch-error"' : ''}${booleanAttribute('disabled', isDisabledScenario || state.disabled)} />`,
        `  <YTag tone="${tone}">${escapeAttribute(caption)}</YTag>`,
        '</div>'
      ])
    }
  },
  tabs: {
    title: 'Tabs scenario',
    description: '调试同页内容切换、API 定位、阻断说明、移动标签和键盘切换路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'overview', options: [
        { label: '上下文切换', value: 'overview' },
        { label: 'API 面板', value: 'api' },
        { label: '阻断说明', value: 'error' },
        { label: '移动标签', value: 'mobile' },
        { label: '键盘切换', value: 'keyboard' }
      ] },
      { key: 'modelValue', label: '当前标签', type: 'select', defaultValue: 'overview', options: [
        { label: 'Overview', value: 'overview' },
        { label: 'Usage', value: 'usage' },
        { label: 'API', value: 'api' },
        { label: 'Review', value: 'error' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Keyboard', value: 'keyboard' }
      ] },
      { key: 'variant', label: '视觉变体', type: 'select', defaultValue: 'segment', options: [
        { label: 'Segment', value: 'segment' },
        { label: 'Line', value: 'line' },
        { label: 'Card', value: 'card' }
      ] },
      { key: 'orientation', label: '方向', type: 'select', defaultValue: 'horizontal', options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' }
      ] },
      { key: 'activationMode', label: '激活模式', type: 'select', defaultValue: 'auto', options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Manual', value: 'manual' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ] },
      { key: 'title', label: '面板标题', type: 'text', defaultValue: 'Docs overview' },
      { key: 'description', label: '面板说明', type: 'text', defaultValue: 'Tabs keep related content in one route.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isApiScenario = scenario === 'api'
      const isErrorScenario = scenario === 'error'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const modelValue = isErrorScenario
        ? 'error'
        : isMobileScenario
          ? 'mobile'
          : isKeyboardScenario
            ? 'keyboard'
            : isApiScenario
              ? 'api'
              : state.modelValue
      const title = isErrorScenario
        ? 'Release review blocked'
        : isMobileScenario
          ? 'Mobile tabs'
          : isKeyboardScenario
            ? 'Keyboard tabs'
            : isApiScenario
              ? 'API panel'
              : state.title
      const description = isErrorScenario
        ? 'Release note is blocked until the API tab is reviewed.'
        : isMobileScenario
          ? 'Short labels keep mobile tab rows readable.'
          : isKeyboardScenario
            ? 'Arrow keys move focus between tabs; manual mode uses Enter and Space to activate.'
            : isApiScenario
              ? 'Controlled model-value opens the API panel directly from docs navigation.'
              : state.description
      const tone = isErrorScenario ? 'danger' : isKeyboardScenario ? 'info' : 'success'
      const variant = isApiScenario ? 'line' : isErrorScenario ? 'card' : state.variant
      const orientation = isKeyboardScenario ? 'vertical' : state.orientation
      const activationMode = isKeyboardScenario ? 'manual' : state.activationMode
      const size = isMobileScenario ? 'sm' : state.size
      const tabItems = `[
  { label: 'Overview', value: 'overview', icon: '◎' },
  { label: 'Usage', value: 'usage' },
  { label: 'API', value: 'api', badge: 6 },
  { label: 'Review', value: 'error', closable: true },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Keyboard', value: 'keyboard' },
  { label: 'Blocked', value: 'blocked', disabled: true }
]`

      return sfc(`import { YCard, YTabs, YTag } from '@yok-ui/core'

const tabItems = ${tabItems}`, [
        '<div class="demo-stack">',
        `  <YTabs${textAttribute('model-value', modelValue)} :tabs="tabItems"${textAttribute('variant', variant)}${textAttribute('orientation', orientation)}${textAttribute('activation-mode', activationMode)}${textAttribute('size', size)} aria-label="Documentation sections" />`,
        `  <YCard${textAttribute('title', title)}>${escapeAttribute(description)}</YCard>`,
        `  <YTag tone="${tone}">${escapeAttribute(description)}</YTag>`,
        '</div>'
      ])
    }
  },
  steps: {
    title: 'Steps scenario',
    description: '调试线性流程、错误步骤、纵向布局、移动流程和键盘可达路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'release', options: [
        { label: '发布流程', value: 'release' },
        { label: '错误步骤', value: 'error' },
        { label: '纵向流程', value: 'vertical' },
        { label: '移动流程', value: 'mobile' },
        { label: '键盘步骤', value: 'keyboard' }
      ] },
      { key: 'current', label: '当前步骤', type: 'range', defaultValue: 1, min: 0, max: 2, step: 1 },
      { key: 'direction', label: '方向', type: 'select', defaultValue: 'horizontal', options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' }
      ] },
      { key: 'selectable', label: '可点击', type: 'boolean', defaultValue: true },
      { key: 'ariaLabel', label: '可访问名称', type: 'text', defaultValue: 'Component release steps' },
      { key: 'caption', label: '提示', type: 'text', defaultValue: 'Step items are injected by the docs runner.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isErrorScenario = scenario === 'error'
      const isVerticalScenario = scenario === 'vertical'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const direction = isVerticalScenario || isMobileScenario ? 'vertical' : state.direction
      const current = isErrorScenario ? 1 : isKeyboardScenario ? 2 : Number(state.current)
      const selectable = Boolean(state.selectable) || isKeyboardScenario
      const itemsExpression = isErrorScenario
        ? "{ title: 'Install', description: 'Package installed.', value: 'install', status: 'finish' }, { title: 'Review', description: 'API notes missing.', value: 'review', status: 'error' }, { title: 'Ship', description: 'Waiting for fixes.', value: 'ship' }"
        : isKeyboardScenario
          ? "{ title: 'Install', description: 'Tab reaches each step button.', value: 'install', status: 'finish' }, { title: 'Review', description: 'Space or Enter selects the step.', value: 'review', status: 'finish' }, { title: 'Ship', description: 'aria-current marks this step.', value: 'ship' }"
          : isVerticalScenario || isMobileScenario
            ? "{ title: 'Install', description: 'Add @yok-ui/core.', value: 'install', status: 'finish' }, { title: 'Review', description: 'Check examples and API.', value: 'review' }, { title: 'Ship', description: 'Publish the docs package.', value: 'ship' }"
            : "{ title: 'Install', description: 'Add the package.', value: 'install', status: 'finish' }, { title: 'Import', description: 'Use the component.', value: 'import' }, { title: 'Ship', description: 'Publish the docs.', value: 'ship' }"
      const caption = isErrorScenario
        ? 'Review failed because required API notes are missing.'
        : isVerticalScenario
          ? 'Vertical steps keep long release flows readable.'
          : isMobileScenario
            ? 'Mobile steps stay vertical so descriptions do not collapse.'
            : isKeyboardScenario
              ? 'Tab reaches each step button; aria-current announces the active step.'
              : state.caption
      const tone = isErrorScenario ? 'danger' : isKeyboardScenario ? 'info' : 'success'

      return sfc("import { YSteps, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YSteps :items="[${itemsExpression}]"${numericBinding('current', current)}${textAttribute('direction', direction)}${booleanAttribute('selectable', selectable)}${textAttribute('aria-label', state.ariaLabel)} />`,
        `  <YTag tone="${tone}">${escapeAttribute(caption)}</YTag>`,
        '</div>'
      ])
    }
  },
  tour: {
    title: 'Tour scenario',
    description: '调试基础引导、目标高亮、受控步骤、完成关闭、移动端和键盘关闭路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础引导', value: 'basic' },
        { label: '目标高亮', value: 'target' },
        { label: '受控步骤', value: 'controlled' },
        { label: '完成关闭', value: 'finish' },
        { label: '空步骤', value: 'empty' },
        { label: '移动引导', value: 'mobile' },
        { label: '键盘关闭', value: 'keyboard' }
      ] },
      { key: 'current', label: '当前步骤', type: 'range', defaultValue: 0, min: 0, max: 2, step: 1 },
      { key: 'open', label: '默认打开', type: 'boolean', defaultValue: true },
      { key: 'closeOnEscape', label: 'Esc 关闭', type: 'boolean', defaultValue: true },
      { key: 'skipText', label: '跳过文案', type: 'text', defaultValue: 'Skip guide' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isTargetScenario = scenario === 'target'
      const isControlledScenario = scenario === 'controlled'
      const isFinishScenario = scenario === 'finish'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const current = isFinishScenario ? 2 : Math.min(Math.max(Number(state.current), 0), 2)
      const open = Boolean(state.open)
      const closeOnEscape = Boolean(state.closeOnEscape) || isKeyboardScenario
      const skipText = isKeyboardScenario ? 'Close guide' : String(state.skipText)
      const buttonSize = isMobileScenario ? 'sm' : 'md'
      const targetAttribute = isTargetScenario || isControlledScenario || isMobileScenario
        ? "target: '#tour-playground'"
        : "target: '#tour-search'"
      const steps = [
        "  { title: 'Search docs', description: 'Use search to jump to components, guides and examples.', target: '#tour-search' },",
        `  { title: '${isMobileScenario ? 'Review compact controls' : 'Open Playground'}', description: '${isControlledScenario ? 'The current step can sync with route or analytics state.' : 'Edit examples and export a reproduction bundle.'}', ${targetAttribute} },`,
        `  { title: '${isFinishScenario ? 'Finish setup' : 'Ship evidence'}', description: '${isKeyboardScenario ? 'Escape requests close and focus remains trapped while open.' : 'Copy source, verify API coverage and publish docs.'}', target: '#tour-ship' }`
      ]

      return sfc("import { YButton, YTag, YTour } from '@yok-ui/core'\nconst tourSteps = [\n" + steps.join('\n') + '\n]\nconst emptyTourSteps = []', [
        '<div class="demo-stack">',
        '  <div class="demo-row">',
        `    <YButton id="tour-search" variant="secondary" size="${buttonSize}">Search docs</YButton>`,
        `    <YButton id="tour-playground" variant="primary" size="${buttonSize}">Open Playground</YButton>`,
        `    <YButton id="tour-ship" variant="secondary" size="${buttonSize}">Ship evidence</YButton>`,
        '  </div>',
        `  <YTour${booleanAttribute('open', open)} :steps="${isEmptyScenario ? 'emptyTourSteps' : 'tourSteps'}"${numericBinding('current', current)}${booleanAttribute('close-on-escape', closeOnEscape)} next-text="Next" prev-text="Back" finish-text="Finish"${textAttribute('skip-text', skipText)} />`,
        `  <YTag tone="${isKeyboardScenario ? 'info' : isFinishScenario ? 'success' : isEmptyScenario ? 'danger' : 'warning'}">${isKeyboardScenario ? 'Dialog semantics, focus lock and Escape close are part of the tour contract.' : isFinishScenario ? 'The final step emits finish and requests close.' : isEmptyScenario ? 'Empty steps render a safe fallback instead of highlighting a missing target.' : 'Targets are highlighted without becoming extra focus stops.'}</YTag>`,
        '</div>'
      ])
    }
  },
  collapse: {
    title: 'Collapse scenario',
    description: '调试 FAQ 分组、手风琴设置、禁用面板、移动折叠和键盘展开场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'faq', options: [
        { label: 'FAQ 分组', value: 'faq' },
        { label: '手风琴设置', value: 'accordion' },
        { label: '禁用面板', value: 'disabled' },
        { label: '移动折叠', value: 'mobile' },
        { label: '键盘展开', value: 'keyboard' }
      ] },
      { key: 'accordion', label: '手风琴', type: 'boolean', defaultValue: false },
      { key: 'caption', label: '说明', type: 'text', defaultValue: 'Panels are injected by the docs runner.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isAccordionScenario = scenario === 'accordion'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const modelValue = isAccordionScenario
        ? 'settings'
        : isDisabledScenario
          ? 'usage'
          : isMobileScenario
            ? 'summary'
            : isKeyboardScenario
              ? 'keyboard'
              : 'usage,api'
      const caption = isAccordionScenario
        ? 'Accordion keeps one settings group open at a time.'
        : isDisabledScenario
          ? 'Disabled panels stay visible but cannot be opened.'
          : isMobileScenario
            ? 'Mobile disclosure keeps content short and trigger targets comfortable.'
            : isKeyboardScenario
              ? 'Tab reaches each trigger; Enter or Space toggles the focused panel.'
              : state.caption
      const label = isKeyboardScenario
        ? 'Keyboard disclosure path'
        : isDisabledScenario
          ? 'Locked by release owner'
          : isMobileScenario
            ? 'Mobile disclosure'
            : isAccordionScenario
              ? 'Settings accordion'
              : 'FAQ disclosure'

      return sfc("import { YCollapse, YTag } from '@yok-ui/core'", [
        `<div class="demo-stack"${isMobileScenario ? ' style="max-width: 320px"' : ''}>`,
        `  <YCollapse model-value="${modelValue}"${booleanAttribute('accordion', Boolean(state.accordion) || isAccordionScenario)} />`,
        `  <YTag tone="${isDisabledScenario ? 'warning' : isKeyboardScenario ? 'info' : 'success'}">${escapeAttribute(label)}</YTag>`,
        `  <p>${escapeAttribute(caption)}</p>`,
        '</div>'
      ])
    }
  },
  popconfirm: {
    title: 'Popconfirm scenario',
    description: '调试归档、危险删除、取消回退、移动确认和键盘确认场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'archive', options: [
        { label: '归档确认', value: 'archive' },
        { label: '危险删除', value: 'danger' },
        { label: '取消回退', value: 'cancel' },
        { label: '移动确认', value: 'mobile' },
        { label: '键盘确认', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Archive component?' },
      { key: 'description', label: '描述', type: 'text', defaultValue: 'Archived components can be restored later.' },
      { key: 'confirmText', label: '确认文案', type: 'text', defaultValue: 'Archive' },
      { key: 'cancelText', label: '取消文案', type: 'text', defaultValue: 'Keep' },
      { key: 'open', label: '默认打开', type: 'boolean', defaultValue: true },
      { key: 'buttonText', label: '触发按钮', type: 'text', defaultValue: 'Archive' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isDangerScenario = scenario === 'danger'
      const isCancelScenario = scenario === 'cancel'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const title = isDangerScenario
        ? 'Delete draft permanently?'
        : isCancelScenario
          ? 'Leave this review?'
          : isMobileScenario
            ? 'Reset mobile filters?'
            : isKeyboardScenario
              ? 'Confirm with keyboard?'
              : state.title
      const description = isDangerScenario
        ? 'This cannot be undone after publishing.'
        : isCancelScenario
          ? 'Unsaved feedback stays in the current draft.'
          : isMobileScenario
            ? 'Compact copy stays readable in narrow panels.'
            : isKeyboardScenario
              ? 'Tab reaches Cancel and Confirm; Enter activates the focused action.'
              : state.description
      const confirmText = isDangerScenario
        ? 'Delete'
        : isCancelScenario
          ? 'Leave'
          : isMobileScenario
            ? 'Reset'
            : isKeyboardScenario
              ? 'Confirm'
              : state.confirmText
      const cancelText = isDangerScenario
        ? 'Keep draft'
        : isCancelScenario
          ? 'Continue editing'
          : isMobileScenario
            ? 'Keep filters'
            : isKeyboardScenario
              ? 'Cancel'
              : state.cancelText
      const buttonText = isDangerScenario
        ? 'Delete draft'
        : isCancelScenario
          ? 'Leave review'
          : isMobileScenario
            ? 'Mobile reset'
            : isKeyboardScenario
              ? 'Keyboard confirm'
              : state.buttonText
      const helperTone = isDangerScenario ? 'warning' : isKeyboardScenario ? 'info' : 'success'
      const helperText = isDangerScenario
        ? 'Danger confirmations use irreversible language and a clear escape hatch.'
        : isCancelScenario
          ? 'Cancel keeps the current task visible and recoverable.'
          : isMobileScenario
            ? 'Short copy keeps compact confirmation panels readable.'
            : isKeyboardScenario
              ? 'Keyboard users can reach both actions without losing context.'
              : 'Popconfirm keeps lightweight decisions close to the trigger.'

      return sfc("import { YButton, YPopconfirm, YTag } from '@yok-ui/core'", [
      '<div class="demo-stack">',
      `<YPopconfirm${booleanAttribute('open', state.open)}${textAttribute('title', title)}${textAttribute('description', description)}${textAttribute('confirm-text', confirmText)}${textAttribute('cancel-text', cancelText)}>`,
      `  <YButton variant="secondary">${escapeAttribute(buttonText)}</YButton>`,
      '</YPopconfirm>',
      `  <YTag tone="${helperTone}">${helperText}</YTag>`,
      '</div>'
    ])
    }
  },
  result: {
    title: 'Result scenario',
    description: '调试发布成功、404、500、移动结果页和键盘操作区。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'success', options: [
        { label: '发布成功', value: 'success' },
        { label: '页面未找到', value: 'notFound' },
        { label: '服务异常', value: 'server' },
        { label: '移动结果页', value: 'mobile' },
        { label: '键盘操作区', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component published' },
      { key: 'subtitle', label: '副标题', type: 'text', defaultValue: 'The docs, API table and live example are ready.' },
      { key: 'ariaLabel', label: '可访问名称', type: 'text', defaultValue: 'Publish result' },
      { key: 'showAction', label: '显示操作', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isNotFoundScenario = scenario === 'notFound'
      const isServerScenario = scenario === 'server'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const status = isNotFoundScenario
        ? '404'
        : isServerScenario
          ? '500'
          : isMobileScenario
            ? 'success'
            : isKeyboardScenario
              ? 'success'
              : 'success'
      const title = isNotFoundScenario
        ? 'Page not found'
        : isServerScenario
          ? 'Server unavailable'
          : isMobileScenario
            ? 'Saved from mobile'
            : isKeyboardScenario
              ? 'Keyboard complete'
              : state.title
      const subtitle = isNotFoundScenario
        ? 'The component page may have moved or the route is incomplete.'
        : isServerScenario
          ? 'Retry the request or return to the release queue.'
          : isMobileScenario
            ? 'Compact copy and stacked actions keep the result readable.'
            : isKeyboardScenario
              ? 'Tab moves through the primary and secondary result actions.'
              : state.subtitle
      const ariaLabel = isNotFoundScenario
        ? 'Not found result'
        : isServerScenario
          ? 'Server error result'
          : isMobileScenario
            ? 'Mobile saved result'
            : isKeyboardScenario
              ? 'Keyboard result actions'
              : state.ariaLabel
      const primaryAction = isNotFoundScenario
        ? 'Go home'
        : isServerScenario
          ? 'Retry'
          : isMobileScenario
            ? 'View summary'
            : isKeyboardScenario
              ? 'Open docs'
              : 'View release'
      const secondaryAction = isNotFoundScenario
        ? 'Search components'
        : isServerScenario
          ? 'Back to queue'
          : isMobileScenario
            ? 'Back'
            : isKeyboardScenario
              ? 'Back to queue'
              : 'Back to list'

      return sfc("import { YButton, YResult } from '@yok-ui/core'", [
      `<YResult${textAttribute('status', status)}${textAttribute('title', title)}${textAttribute('subtitle', subtitle)}${textAttribute('aria-label', ariaLabel)}>`,
      state.showAction ? `  <YButton variant="primary">${primaryAction}</YButton>` : '',
      state.showAction ? `  <YButton variant="secondary">${secondaryAction}</YButton>` : '',
      '</YResult>'
    ].filter((line): line is string => Boolean(line)))
    }
  },
  statistic: {
    title: 'Statistic scenario',
    description: '调试核心指标、单位精度、卡片组合、倒计时、加载刷新、移动端和读屏指标场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'metric', options: [
        { label: '核心指标', value: 'metric' },
        { label: '单位精度', value: 'unit' },
        { label: '卡片指标', value: 'card' },
        { label: '倒计时指标', value: 'countdown' },
        { label: '加载指标', value: 'loading' },
        { label: '移动指标', value: 'mobile' },
        { label: '读屏指标', value: 'keyboard' }
      ] },
      { key: 'tone', label: '语义色', type: 'select', defaultValue: 'success', options: [
        { label: 'Neutral', value: 'neutral' },
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' }
      ] }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isUnitScenario = scenario === 'unit'
      const isCardScenario = scenario === 'card'
      const isCountdownScenario = scenario === 'countdown'
      const isLoadingScenario = scenario === 'loading'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const countdownTarget = 4102444800000

      if (isCountdownScenario) {
        return sfc("import { YCountdown } from '@yok-ui/core'", [
          `<YCountdown title="Campaign countdown"${numericBinding('value', countdownTarget)} format="DD days HH:mm:ss" prefix="剩余" suffix="后开始" tone="info" aria-label="Campaign countdown" />`
        ])
      }

      const title = isUnitScenario
        ? 'Account balance'
        : isCardScenario
          ? 'Completed reviews'
          : isLoadingScenario
            ? 'Revenue loading'
            : isMobileScenario
              ? 'Mobile KPI'
              : isKeyboardScenario
                ? 'Screen reader metric'
                : 'Active users'
      const value = isUnitScenario
        ? 112893.456
        : isCardScenario
          ? 96
          : isMobileScenario
            ? 428
            : isKeyboardScenario
              ? 7312
              : 112893
      const precision = isUnitScenario ? 2 : undefined
      const prefix = isUnitScenario ? '¥' : scenario === 'metric' ? '+' : ''
      const suffix = isUnitScenario
        ? 'CNY'
        : isCardScenario
          ? '/100'
          : isLoadingScenario
            ? 'CNY'
            : isMobileScenario
              ? 'ms'
              : isKeyboardScenario
                ? 'users'
                : 'today'
      const tone = isLoadingScenario ? 'info' : state.tone
      const ariaLabel = isKeyboardScenario
        ? 'Screen reader active user metric'
        : isLoadingScenario
          ? 'Revenue loading metric'
          : `${title} statistic`
      const statisticLine = `<YStatistic${textAttribute('title', title)}${isLoadingScenario ? '' : numericBinding('value', value)}${precision === undefined ? '' : numericBinding('precision', precision)}${prefix ? textAttribute('prefix', prefix) : ''}${suffix ? textAttribute('suffix', suffix) : ''}${textAttribute('tone', tone)}${textAttribute('aria-label', ariaLabel)}${booleanAttribute('loading', isLoadingScenario)} />`

      if (isCardScenario) {
        return sfc("import { YCard, YStatistic } from '@yok-ui/core'", [
          '<YCard title="Metric card" description="Dashboard card composition.">',
          `  ${statisticLine}`,
          '</YCard>'
        ])
      }

      return sfc("import { YStatistic } from '@yok-ui/core'", [
        statisticLine
      ])
    }
  },
  timeline: {
    title: 'Timeline scenario',
    description: '调试发布记录、倒序记录、交替布局、加载尾项、移动时间线和键盘阅读场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'release', options: [
        { label: '发布记录', value: 'release' },
        { label: '倒序记录', value: 'reverse' },
        { label: '交替布局', value: 'alternate' },
        { label: '加载尾项', value: 'loading' },
        { label: '移动时间线', value: 'mobile' },
        { label: '键盘阅读', value: 'keyboard' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Medium', value: 'md' },
        { label: 'Small', value: 'sm' }
      ] }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isReverseScenario = scenario === 'reverse'
      const isAlternateScenario = scenario === 'alternate'
      const isLoadingScenario = scenario === 'loading'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const placement = isAlternateScenario ? 'alternate' : 'right'
      const size = isMobileScenario ? 'sm' : state.size
      const title = isAlternateScenario
        ? 'Alternating release story'
        : isLoadingScenario
          ? 'Publishing job timeline'
          : isMobileScenario
            ? 'Mobile release timeline'
            : isKeyboardScenario
              ? 'Keyboard readable release timeline'
              : 'Release activity'
      const description = isReverseScenario
        ? 'Newest events appear first for activity feeds and audit logs.'
        : isAlternateScenario
          ? 'Alternate placement makes longer release stories easier to scan.'
          : isLoadingScenario
            ? 'The final pending node stays busy while release output is recorded.'
            : isMobileScenario
              ? 'Compact timeline keeps title, time and copy readable on narrow screens.'
              : isKeyboardScenario
                ? 'Use ordered list semantics; keep timeline actions after each event.'
                : 'Track component work from draft to documentation.'
      const ariaLabel = isKeyboardScenario
        ? 'Keyboard readable release timeline'
        : isLoadingScenario
          ? 'Publishing job timeline'
          : 'Release timeline'
      const itemsExpression = isLoadingScenario
        ? "[{ title: 'Queued', value: 'queued', description: 'Release package is queued.', time: '11:20', tone: 'success' }, { title: 'Recording...', value: 'recording', description: 'The release job is still writing timeline output.', time: '12:40', tone: 'info', loading: true }]"
        : "[{ title: 'Component created', value: 'created', description: 'The first proposal and API draft were created.', time: '09:12', tone: 'success' }, { title: 'Design reviewed', value: 'reviewed', description: 'Spacing, accessibility and docs examples were checked.', time: '10:30', tone: 'warning' }, { title: 'Documentation published', value: 'published', description: 'The component page is now available in the docs site.', time: '12:00', tone: 'info' }]"
      const imports = isKeyboardScenario
        ? "import { YButton, YTimeline } from '@yok-ui/core'"
        : "import { YTimeline } from '@yok-ui/core'"

      if (isKeyboardScenario) {
        return sfc(imports, [
          `<YTimeline${textAttribute('title', title)}${textAttribute('description', description)}${textAttribute('placement', placement)}${textAttribute('size', size)}${textAttribute('aria-label', ariaLabel)} :items="${itemsExpression}">`,
          '  <template #actions>',
          '    <YButton size="sm" variant="ghost">Open event</YButton>',
          '  </template>',
          '</YTimeline>'
        ])
      }

      return sfc(imports, [
        `<YTimeline${textAttribute('title', title)}${textAttribute('description', description)}${textAttribute('placement', placement)}${textAttribute('size', size)}${booleanAttribute('reverse', isReverseScenario)}${textAttribute('aria-label', ariaLabel)} :items="${itemsExpression}" />`
      ])
    }
  },
  virtualList: {
    title: 'Virtual List scenario',
    description: '调试虚拟列表基础、空结果、密集长列表、移动高度和键盘滚动路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'rows', options: [
        { label: '组件行', value: 'rows' },
        { label: '空列表', value: 'empty' },
        { label: '密集长列表', value: 'dense' },
        { label: '移动列表', value: 'mobile' },
        { label: '键盘列表', value: 'keyboard' }
      ] },
      { key: 'height', label: '高度', type: 'range', defaultValue: 220, min: 120, max: 420, step: 20 },
      { key: 'itemHeight', label: '行高', type: 'range', defaultValue: 44, min: 32, max: 72, step: 4 },
      { key: 'overscan', label: '预渲染', type: 'range', defaultValue: 4, min: 0, max: 10, step: 1 },
      { key: 'ariaLabel', label: '可访问名称', type: 'text', defaultValue: 'Component rows' },
      { key: 'emptyText', label: '空状态', type: 'text', defaultValue: 'No component rows yet' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isEmptyScenario = scenario === 'empty'
      const isDenseScenario = scenario === 'dense'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const height = isMobileScenario ? 160 : isDenseScenario ? 280 : state.height
      const itemHeight = isMobileScenario || isDenseScenario ? 36 : state.itemHeight
      const overscan = isDenseScenario ? 8 : state.overscan
      const ariaLabel = isKeyboardScenario
        ? 'Keyboard virtual list'
        : isMobileScenario
          ? 'Mobile virtual list'
          : isDenseScenario
            ? 'Dense component virtual list'
            : state.ariaLabel
      const emptyText = isEmptyScenario ? 'No component rows match filters.' : state.emptyText
      const helper = isKeyboardScenario
        ? 'Tab focuses the virtualized viewport; arrow keys scroll inside the list.'
        : isEmptyScenario
          ? 'No component rows match filters.'
          : isDenseScenario
            ? 'Virtualization keeps long component indexes responsive.'
            : isMobileScenario
              ? 'Shorter viewport keeps surrounding controls visible on mobile.'
              : 'The docs runner injects a stable component row dataset.'

      return sfc("import { YTag, YVirtualList } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YTag tone="${isEmptyScenario ? 'warning' : 'info'}">${helper}</YTag>`,
        `  <YVirtualList${numericBinding('height', height)}${numericBinding('item-height', itemHeight)}${numericBinding('overscan', overscan)}${textAttribute('aria-label', ariaLabel)}${textAttribute('empty-text', emptyText)}${isEmptyScenario ? ' :items="[]"' : ''} />`,
        '</div>'
      ])
    }
  },
  qrCode: {
    title: 'QRCode scenario',
    description: '调试链接、品牌 logo、过期刷新、生成中和移动二维码场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'link', options: [
        { label: '文档链接', value: 'link' },
        { label: '品牌中心', value: 'brand' },
        { label: '过期票据', value: 'expired' },
        { label: '生成中', value: 'loading' },
        { label: '移动展示', value: 'mobile' },
        { label: '键盘操作', value: 'keyboard' }
      ] },
      { key: 'value', label: '内容', type: 'text', defaultValue: 'https://yok-ui.dev/components/qr-code' },
      { key: 'size', label: '尺寸', type: 'range', defaultValue: 168, min: 96, max: 240, step: 8 },
      { key: 'level', label: '纠错等级', type: 'select', defaultValue: 'M', options: [
        { label: 'L', value: 'L' },
        { label: 'M', value: 'M' },
        { label: 'Q', value: 'Q' },
        { label: 'H', value: 'H' }
      ] },
      { key: 'downloadable', label: '下载', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isBrandScenario = scenario === 'brand'
      const isExpiredScenario = scenario === 'expired'
      const isLoadingScenario = scenario === 'loading'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const value = isExpiredScenario
        ? 'ticket:yok-ui:expired'
        : isLoadingScenario
          ? 'ticket:yok-ui:generating'
          : isMobileScenario
            ? 'https://yok-ui.dev/mobile'
            : isKeyboardScenario
              ? 'https://yok-ui.dev/keyboard'
            : state.value
      const size = isMobileScenario ? 132 : Number(state.size)
      const level = isBrandScenario ? 'H' : state.level
      const status = isExpiredScenario || isKeyboardScenario ? 'expired' : isLoadingScenario ? 'loading' : 'active'
      const helper = isBrandScenario
        ? 'High correction level leaves room for the protected center logo.'
        : isExpiredScenario
          ? 'Expired QR codes expose a refresh event instead of silently changing value.'
          : isLoadingScenario
            ? 'Loading state keeps the square footprint stable while remote data arrives.'
            : isMobileScenario
              ? 'Compact QR cards keep caption and download controls readable on narrow screens.'
              : isKeyboardScenario
                ? 'Tab reaches refresh and download actions; Enter or Space activates native buttons.'
              : 'SVG rendering keeps QR codes crisp, accessible and downloadable.'

      return sfc("import { YQRCode, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YQRCode${textAttribute('value', String(value))}${textAttribute('label', 'Yok UI QR code example')}${textAttribute('level', String(level))}${numericBinding('size', size)}${textAttribute('status', status)}${textAttribute('foreground', isBrandScenario ? '#0f766e' : '#087f6d')}${textAttribute('background', '#ffffff')}${isBrandScenario ? textAttribute('logo-src', '/logo.svg') : ''}${isBrandScenario ? textAttribute('logo-alt', 'Yok UI') : ''}${isBrandScenario ? numericBinding('logo-size', 34) : ''}${isExpiredScenario || isKeyboardScenario ? textAttribute('expired-text', isKeyboardScenario ? 'Keyboard actions are reachable' : 'Ticket QR code expired') : ''}${isExpiredScenario || isKeyboardScenario ? textAttribute('refresh-text', isKeyboardScenario ? 'Refresh with keyboard' : 'Refresh code') : ''}${booleanAttribute('downloadable', Boolean(state.downloadable) || isKeyboardScenario)}${textAttribute('download-name', 'yok-ui-qr-code.svg')}>`,
        '    Yok UI QRCode',
        '  </YQRCode>',
        `  <YTag tone="${isExpiredScenario ? 'warning' : isLoadingScenario ? 'info' : 'success'}">${helper}</YTag>`,
        '</div>'
      ])
    }
  },
  watermark: {
    title: 'Watermark scenario',
    description: '调试草稿、机密、导出、移动和键盘无阻塞水印场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'draft', options: [
        { label: '草稿水印', value: 'draft' },
        { label: '机密水印', value: 'confidential' },
        { label: '导出水印', value: 'export' },
        { label: '移动水印', value: 'mobile' },
        { label: '键盘水印', value: 'keyboard' }
      ] },
      { key: 'content', label: '内容', type: 'text', defaultValue: 'Yok UI' },
      { key: 'opacity', label: '透明度', type: 'range', defaultValue: 0.12, min: 0.04, max: 0.32, step: 0.02 },
      { key: 'gap', label: '间距', type: 'range', defaultValue: 120, min: 72, max: 200, step: 8 },
      { key: 'rotate', label: '旋转', type: 'range', defaultValue: -18, min: -45, max: 45, step: 3 },
      { key: 'fontSize', label: '字号', type: 'range', defaultValue: 15, min: 10, max: 28, step: 1 }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isConfidentialScenario = scenario === 'confidential'
      const isExportScenario = scenario === 'export'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const content = isConfidentialScenario
        ? 'CONFIDENTIAL'
        : isExportScenario
          ? 'EXPORT COPY'
          : isMobileScenario
            ? 'MOBILE'
            : isKeyboardScenario
              ? 'KEYBOARD SAFE'
              : state.content
      const opacity = isConfidentialScenario ? 0.22 : isExportScenario ? 0.18 : isMobileScenario ? 0.1 : state.opacity
      const gap = isExportScenario ? 88 : isMobileScenario ? 80 : state.gap
      const rotate = isKeyboardScenario ? -12 : state.rotate
      const fontSize = isMobileScenario ? 12 : isExportScenario ? 18 : state.fontSize
      const cardTitle = isConfidentialScenario
        ? 'Protected export review'
        : isKeyboardScenario
          ? 'Keyboard watermark preview'
          : isExportScenario
            ? 'Download preview'
            : isMobileScenario
              ? 'Mobile protected card'
              : 'Protected preview'
      const helper = isKeyboardScenario
        ? 'Watermark overlay is aria-hidden and never blocks keyboard focus.'
        : isConfidentialScenario
          ? 'Sensitive content uses a stronger watermark before sharing.'
          : isExportScenario
            ? 'Dense export watermarks survive screenshots and copied PDFs.'
            : isMobileScenario
              ? 'Compact watermark spacing keeps mobile content readable.'
              : 'Watermark is decorative and does not block content.'

      return sfc("import { YButton, YCard, YTag, YWatermark } from '@yok-ui/core'", [
        `<YWatermark${textAttribute('content', content)}${numericBinding('opacity', opacity)}${numericBinding('gap', gap)}${numericBinding('rotate', rotate)}${numericBinding('font-size', fontSize)}>`,
        `  <YCard title="${cardTitle}" description="${helper}">`,
        `    <YTag tone="${isConfidentialScenario ? 'danger' : isExportScenario ? 'warning' : 'info'}">${content}</YTag>`,
        isKeyboardScenario ? '    <YButton size="sm" variant="secondary">Review focus target</YButton>' : '',
        '  </YCard>',
        '</YWatermark>'
      ].filter(Boolean))
    }
  },
  backtop: {
    title: 'Backtop scenario',
    description: '调试长文档、紧凑定位、未滚动隐藏、移动和键盘返回顶部场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'docs', options: [
        { label: '文档返回', value: 'docs' },
        { label: '紧凑位置', value: 'compact' },
        { label: '未滚动隐藏', value: 'hidden' },
        { label: '移动返回', value: 'mobile' },
        { label: '键盘返回', value: 'keyboard' }
      ] },
      { key: 'visibilityHeight', label: '显示阈值', type: 'range', defaultValue: 0, min: 0, max: 600, step: 20 },
      { key: 'right', label: '右侧距离', type: 'range', defaultValue: 24, min: 12, max: 96, step: 4 },
      { key: 'bottom', label: '底部距离', type: 'range', defaultValue: 24, min: 12, max: 120, step: 4 },
      { key: 'caption', label: '说明', type: 'text', defaultValue: 'Use a low threshold in docs so the helper stays visible.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isCompactScenario = scenario === 'compact'
      const isHiddenScenario = scenario === 'hidden'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const visibilityHeight = isHiddenScenario ? 9999 : isKeyboardScenario ? 0 : state.visibilityHeight
      const right = isCompactScenario ? 72 : isMobileScenario ? 16 : state.right
      const bottom = isCompactScenario ? 84 : isMobileScenario ? 72 : state.bottom
      const caption = isKeyboardScenario
        ? 'Keyboard back to top. Enter activates the focused backtop button.'
        : isHiddenScenario
          ? 'Backtop stays hidden until the page has meaningful scroll depth.'
          : isMobileScenario
            ? 'Mobile placement leaves room for bottom navigation and safe areas.'
            : isCompactScenario
              ? 'Compact placement avoids right-side contents navigation.'
              : state.caption

      return sfc("import { YBacktop, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YTag tone="${isHiddenScenario ? 'warning' : 'info'}">${escapeAttribute(caption)}</YTag>`,
        `  <YBacktop${numericBinding('visibility-height', visibilityHeight)}${numericBinding('right', right)}${numericBinding('bottom', bottom)} />`,
        '</div>'
      ])
    }
  },
  floatButton: {
    title: 'Float Button scenario',
    description: '调试快速创建、动作组、禁用动作、移动安全区和键盘操作场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'create', options: [
        { label: '快速创建', value: 'create' },
        { label: '动作组', value: 'group' },
        { label: '禁用动作', value: 'disabled' },
        { label: '移动安全区', value: 'mobile' },
        { label: '键盘操作', value: 'keyboard' }
      ] },
      { key: 'label', label: '按钮名称', type: 'text', defaultValue: 'Create component' },
      { key: 'shape', label: '形状', type: 'select', defaultValue: 'circle', options: [
        { label: 'Circle', value: 'circle' },
        { label: 'Square', value: 'square' }
      ] },
      { key: 'right', label: '右侧距离', type: 'range', defaultValue: 24, min: 12, max: 120, step: 4 },
      { key: 'bottom', label: '底部距离', type: 'range', defaultValue: 24, min: 12, max: 140, step: 4 }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isGroupScenario = scenario === 'group'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const right = isMobileScenario ? 16 : state.right
      const bottom = isMobileScenario ? 84 : state.bottom
      const shape = isMobileScenario || isGroupScenario ? 'square' : state.shape
      const helper = isGroupScenario
        ? 'Grouped actions stay collapsed until needed and expose menu semantics.'
        : isDisabledScenario
          ? 'Disabled floating actions remain visible without becoming interactive.'
          : isMobileScenario
            ? 'Mobile placement leaves room for safe areas and bottom navigation.'
            : isKeyboardScenario
              ? 'Tab reaches the trigger and action items; Enter activates native buttons.'
              : 'Use one floating action only for a page-level primary shortcut.'

      if (isGroupScenario || isKeyboardScenario) {
        const items = `[
  { key: 'create', label: 'Create component', icon: '+', type: 'primary' },
  { key: 'docs', label: 'Open docs', icon: '?' },
  { key: 'feedback', label: 'Send feedback', icon: '!' }
]`

        return sfc(`import { YFloatButtonGroup, YTag } from '@yok-ui/core'

const floatActions = ${items}`, [
          '<div class="demo-stack">',
          `  <YTag tone="${isKeyboardScenario ? 'info' : 'success'}">${helper}</YTag>`,
          `  <YFloatButtonGroup label="Quick actions" :items="floatActions" :open="true"${textAttribute('shape', shape)} icon="⋯"${numericBinding('right', right)}${numericBinding('bottom', bottom)} />`,
          '</div>'
        ])
      }

      return sfc("import { YFloatButton, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YTag tone="${isDisabledScenario ? 'warning' : 'info'}">${helper}</YTag>`,
        `  <YFloatButton${textAttribute('label', String(state.label))} tooltip="Create"${textAttribute('shape', shape)} type="primary" icon="+"${numericBinding('right', right)}${numericBinding('bottom', bottom)}${booleanAttribute('disabled', isDisabledScenario)} />`,
        '</div>'
      ])
    }
  },
  divider: {
    title: 'Divider scenario',
    description: '调试区块分隔、对齐、空状态、移动和键盘路径场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'section', options: [
        { label: '区块分隔', value: 'section' },
        { label: '右侧标签', value: 'aligned' },
        { label: '空状态分隔', value: 'empty' },
        { label: '移动分隔', value: 'mobile' },
        { label: '键盘分隔', value: 'keyboard' }
      ] },
      { key: 'label', label: '文案', type: 'text', defaultValue: 'Core' },
      { key: 'align', label: '对齐', type: 'select', defaultValue: 'center', options: [
        { label: 'Start', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'end' }
      ] },
      { key: 'tone', label: '标签类型', type: 'select', defaultValue: 'info', options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' }
      ] }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isAlignedScenario = scenario === 'aligned'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isEmptyScenario
        ? 'No matching rows'
        : isKeyboardScenario
          ? 'Keyboard divider region'
          : isMobileScenario
            ? 'More'
            : state.label
      const align = isAlignedScenario ? 'end' : isMobileScenario ? 'start' : state.align
      const tone = isEmptyScenario ? 'warning' : state.tone
      const helper = isKeyboardScenario
        ? 'Separators stay non-focusable while surrounding controls remain reachable.'
        : isEmptyScenario
          ? 'Empty sections still need quiet rhythm.'
          : isAlignedScenario
            ? 'End aligned labels work well in summary rows.'
            : isMobileScenario
              ? 'Short labels avoid wrapping on compact screens.'
              : 'Divider keeps visual rhythm without heavy decoration.'

      return sfc("import { YDivider, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YDivider${textAttribute('label', label)}${textAttribute('align', align)} />`,
        `  <YTag${textAttribute('tone', tone)}>${helper}</YTag>`,
        '</div>'
      ])
    }
  },
  space: {
    title: 'Space scenario',
    description: '调试按钮组、分隔符、纵向堆叠、响应式换行和键盘路径场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'actions', options: [
        { label: '操作间距', value: 'actions' },
        { label: '分隔符', value: 'separator' },
        { label: '纵向堆叠', value: 'vertical' },
        { label: '空态间距', value: 'empty' },
        { label: '响应式换行', value: 'wrap' },
        { label: '键盘路径', value: 'keyboard' }
      ] },
      { key: 'size', label: '间距', type: 'select', defaultValue: 'md', options: [
        { label: 'XS', value: 'xs' },
        { label: 'SM', value: 'sm' },
        { label: 'MD', value: 'md' },
        { label: 'LG', value: 'lg' }
      ] },
      { key: 'align', label: '对齐', type: 'select', defaultValue: 'center', options: [
        { label: 'Start', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'end' },
        { label: 'Stretch', value: 'stretch' }
      ] },
      { key: 'wrap', label: '允许换行', type: 'boolean', defaultValue: true },
      { key: 'fill', label: '占满宽度', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isSeparatorScenario = scenario === 'separator'
      const isVerticalScenario = scenario === 'vertical'
      const isEmptyScenario = scenario === 'empty'
      const isWrapScenario = scenario === 'wrap'
      const isKeyboardScenario = scenario === 'keyboard'
      const direction = isVerticalScenario ? 'vertical' : 'horizontal'
      const size = isWrapScenario ? 'sm' : state.size
      const align = isVerticalScenario || isEmptyScenario ? 'stretch' : state.align
      const wrap = isWrapScenario || isKeyboardScenario || Boolean(state.wrap)
      const fill = isVerticalScenario || isEmptyScenario || Boolean(state.fill)
      const helper = isKeyboardScenario
        ? 'Tab moves through the buttons; Space only controls layout.'
        : isWrapScenario
          ? 'Resize the preview to see the action group wrap without custom margins.'
          : isSeparatorScenario
            ? 'Separator slots help metadata stay compact and readable.'
            : isVerticalScenario
              ? 'Vertical spacing keeps setting groups consistent.'
              : isEmptyScenario
                ? 'Empty state actions need enough spacing to avoid accidental taps.'
              : 'Space replaces one-off margin rules for small action groups.'

      if (isSeparatorScenario) {
        return sfc("import { YSpace, YTag } from '@yok-ui/core'", [
          `<YSpace size="${size}" align="${align}">`,
          '  <YTag tone="success">Core</YTag>',
          '  <YTag tone="info">Product</YTag>',
          '  <YTag tone="warning">Admin</YTag>',
          '  <template #separator>/</template>',
          '</YSpace>'
        ])
      }

      return sfc("import { YButton, YSpace, YTag } from '@yok-ui/core'", [
        `<YSpace direction="${direction}" size="${size}" align="${align}"${wrap ? ' wrap' : ''}${fill ? ' fill' : ''}>`,
        `  <YButton variant="primary">${isEmptyScenario ? 'Create first component' : 'Publish'}</YButton>`,
        `  <YButton variant="secondary">${isEmptyScenario ? 'Clear filters' : 'Save draft'}</YButton>`,
        isEmptyScenario ? '' : '  <YButton variant="ghost">Preview</YButton>',
        `  <YTag tone="${isKeyboardScenario || isEmptyScenario ? 'warning' : 'info'}">${escapeAttribute(helper)}</YTag>`,
        '</YSpace>'
      ].filter(Boolean))
    }
  },
  splitter: {
    title: 'Splitter scenario',
    description: '调试可拖拽分割面板、上下布局、受控尺寸、折叠侧栏、移动预览和键盘调整。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'workspace', options: [
        { label: '工作区分栏', value: 'workspace' },
        { label: '上下分割', value: 'vertical' },
        { label: '受控尺寸', value: 'controlled' },
        { label: '折叠侧栏', value: 'collapsed' },
        { label: '移动分割', value: 'mobile' },
        { label: '键盘调整', value: 'keyboard' }
      ] },
      { key: 'height', label: '高度', type: 'text', defaultValue: '260px' },
      { key: 'handleSize', label: '手柄尺寸', type: 'range', defaultValue: 8, min: 6, max: 16, step: 1 },
      { key: 'keyboardStep', label: '键盘步长', type: 'range', defaultValue: 2, min: 1, max: 8, step: 1 }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isVerticalScenario = scenario === 'vertical' || scenario === 'mobile'
      const isControlledScenario = scenario === 'controlled'
      const isCollapsedScenario = scenario === 'collapsed'
      const isKeyboardScenario = scenario === 'keyboard'
      const layout = isVerticalScenario ? 'vertical' : 'horizontal'
      const height = scenario === 'mobile' ? '220px' : String(state.height || '260px')
      const handleSize = Number(state.handleSize)
      const keyboardStep = isKeyboardScenario ? Number(state.keyboardStep) : 2
      const modelValue = isCollapsedScenario
        ? ' :model-value="{ navigation: 8, preview: 92 }"'
        : isControlledScenario
          ? ' :model-value="{ navigation: 34, preview: 66 }"'
          : ''
      const helper = isKeyboardScenario
        ? 'Focus the separator; Arrow keys, Home and End resize adjacent panels.'
        : isCollapsedScenario
          ? 'The navigation panel starts at collapsedSize and can be expanded.'
          : isControlledScenario
            ? 'Controlled sizes can be restored from route or local workspace settings.'
            : isVerticalScenario
              ? 'Vertical splitters work well for preview and event-log compositions.'
              : 'Horizontal splitters keep navigation and content in one stable work area.'

      return sfc("import { YSplitter, YTag } from '@yok-ui/core'\n\nconst splitterPanels = [\n  { key: 'navigation', label: 'Navigation', size: 28, min: 16, max: 48, collapsible: true, collapsedSize: 8 },\n  { key: 'preview', label: 'Preview', size: 72, min: 36 }\n]", [
        `<YSplitter :panels="splitterPanels"${textAttribute('layout', layout)}${textAttribute('height', height)}${numericBinding('handle-size', handleSize)}${numericBinding('keyboard-step', keyboardStep)}${modelValue} aria-label="${isKeyboardScenario ? 'Keyboard resizable workspace' : 'Resizable documentation workspace'}">`,
        '  <template #navigation>',
        '    <div class="demo-stack">',
        '      <strong>Components</strong>',
        '      <YTag tone="info">Button</YTag>',
        '      <YTag tone="info">Splitter</YTag>',
        '      <YTag tone="info">Table</YTag>',
        '    </div>',
        '  </template>',
        '  <template #preview>',
        '    <div class="demo-stack">',
        '      <strong>Preview</strong>',
        `      <p>${escapeAttribute(helper)}</p>`,
        `      <YTag tone="${isKeyboardScenario ? 'warning' : 'success'}">${isKeyboardScenario ? 'Keyboard ready' : 'Resizable panels'}</YTag>`,
        '    </div>',
        '  </template>',
        '</YSplitter>'
      ])
    }
  },
  link: {
    title: 'Link scenario',
    description: '调试文档链接、安全外链、危险语义、禁用态和键盘路径场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'guide', options: [
        { label: '文档链接', value: 'guide' },
        { label: '安全外链', value: 'external' },
        { label: '风险操作', value: 'danger' },
        { label: '禁用链接', value: 'disabled' },
        { label: '键盘路径', value: 'keyboard' },
        { label: '移动链接', value: 'mobile' }
      ] },
      { key: 'label', label: '文案', type: 'text', defaultValue: 'Read guide' },
      { key: 'tone', label: '语义色', type: 'select', defaultValue: 'primary', options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Neutral', value: 'neutral' },
        { label: 'Info', value: 'info' },
        { label: 'Danger', value: 'danger' }
      ] },
      { key: 'underline', label: '下划线', type: 'select', defaultValue: 'hover', options: [
        { label: 'Hover', value: 'hover' },
        { label: 'Always', value: 'always' },
        { label: 'Never', value: 'never' }
      ] },
      { key: 'external', label: '外链', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isExternalScenario = scenario === 'external'
      const isDangerScenario = scenario === 'danger'
      const isDisabledScenario = scenario === 'disabled'
      const isKeyboardScenario = scenario === 'keyboard'
      const isMobileScenario = scenario === 'mobile'
      const label = isExternalScenario
        ? 'Open GitHub'
        : isDangerScenario
          ? 'Remove draft'
          : isDisabledScenario
            ? 'Coming soon'
            : isKeyboardScenario
              ? 'Keyboard link'
              : isMobileScenario
                ? 'Open docs'
              : state.label
      const href = isExternalScenario ? 'https://github.com' : isDangerScenario ? '/danger' : '/guide/introduction'
      const tone = isExternalScenario ? 'info' : isDangerScenario ? 'danger' : state.tone
      const underline = isDangerScenario ? 'always' : state.underline
      const external = isExternalScenario || Boolean(state.external)
      const helper = isDisabledScenario
        ? 'Disabled links remove href and expose aria-disabled.'
        : isKeyboardScenario
          ? 'Tab focuses the link; Enter follows native anchor behavior.'
          : isMobileScenario
            ? 'Short mobile link labels wrap inside the action row instead of overflowing.'
          : isExternalScenario
            ? 'External links default to _blank with safe rel.'
            : 'Use Link for low-emphasis navigation and inline resources.'

      return sfc("import { YLink, YSpace, YTag } from '@yok-ui/core'", [
        `<YSpace wrap align="center"${isMobileScenario ? ' style="max-width: 280px"' : ''}>`,
        `  <YLink href="${href}" tone="${tone}" underline="${underline}"${external ? ' external' : ''}${isDisabledScenario ? ' disabled' : ''}>${escapeAttribute(label)}</YLink>`,
        `  <YTag tone="${isDangerScenario ? 'warning' : 'info'}">${escapeAttribute(helper)}</YTag>`,
        '</YSpace>'
      ])
    }
  },
  text: {
    title: 'Text scenario',
    description: '调试正文、状态文本、内联代码、截断和键盘路径场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'body', options: [
        { label: '正文文本', value: 'body' },
        { label: '状态文本', value: 'status' },
        { label: '风险文本', value: 'warning' },
        { label: '内联代码', value: 'code' },
        { label: '多行省略', value: 'clamp' },
        { label: '键盘路径', value: 'keyboard' }
      ] },
      { key: 'content', label: '内容', type: 'text', defaultValue: 'Fresh cute typography keeps product copy calm.' },
      { key: 'tone', label: '语义色', type: 'select', defaultValue: 'neutral', options: [
        { label: 'Neutral', value: 'neutral' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'XS', value: 'xs' },
        { label: 'SM', value: 'sm' },
        { label: 'MD', value: 'md' },
        { label: 'LG', value: 'lg' }
      ] },
      { key: 'strong', label: '加粗', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isStatusScenario = scenario === 'status'
      const isWarningScenario = scenario === 'warning'
      const isCodeScenario = scenario === 'code'
      const isClampScenario = scenario === 'clamp'
      const isKeyboardScenario = scenario === 'keyboard'
      const tone = isStatusScenario ? 'success' : isWarningScenario ? 'danger' : isClampScenario ? 'secondary' : state.tone
      const content = isCodeScenario
        ? 'componentRegistry'
        : isWarningScenario
          ? 'Publishing is blocked until required API rows are documented.'
          : isClampScenario
          ? 'This summary intentionally spans several lines so cards and lists can keep a stable rhythm with line clamp.'
          : isKeyboardScenario
            ? 'Text stays presentational; the following link remains the only focusable item.'
            : state.content

      if (isKeyboardScenario) {
        return sfc("import { YLink, YSpace, YText } from '@yok-ui/core'", [
          '<YSpace direction="vertical" align="start">',
          `  <YText tone="${tone}" size="${state.size}"${state.strong ? ' strong' : ''}>${escapeAttribute(content)}</YText>`,
          '  <YLink href="/guide/accessibility">Open accessibility guide</YLink>',
          '</YSpace>'
        ])
      }

      return sfc("import { YText } from '@yok-ui/core'", [
        `<YText tone="${tone}" size="${state.size}"${state.strong || isWarningScenario ? ' strong' : ''}${isCodeScenario ? ' code' : ''}${isStatusScenario ? ' mark' : ''}${isClampScenario ? ' :line-clamp="2"' : ''}>${escapeAttribute(content)}</YText>`
      ])
    }
  },
  descriptions: {
    title: 'Descriptions scenario',
    description: '调试详情信息、审核侧栏、垂直布局、长字段、移动阅读和键盘阅读场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'detail', options: [
        { label: '详情信息', value: 'detail' },
        { label: '审核侧栏', value: 'review' },
        { label: '垂直布局', value: 'vertical' },
        { label: '空详情', value: 'empty' },
        { label: '长字段', value: 'long' },
        { label: '移动阅读', value: 'mobile' },
        { label: '键盘阅读', value: 'keyboard' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Medium', value: 'md' },
        { label: 'Small', value: 'sm' }
      ] },
      { key: 'bordered', label: '边框', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const size = scenario === 'mobile' ? 'sm' : state.size
      const bordered = Boolean(state.bordered) || scenario === 'review' || scenario === 'long' || scenario === 'empty'
      const layout = scenario === 'vertical' || scenario === 'mobile' ? 'vertical' : 'horizontal'
      const column = scenario === 'mobile' ? 1 : scenario === 'review' || scenario === 'vertical' || scenario === 'long' ? 2 : 3

      if (scenario === 'review') {
        return sfc("import { YDescriptions, YTag } from '@yok-ui/core'", [
          `<YDescriptions title="Release review profile" description="Readonly metadata for release approval."${numericBinding('column', column)}${textAttribute('size', size)}${booleanAttribute('bordered', bordered)}>`,
          '  <template #extra>',
          '    <YTag tone="warning">Needs review</YTag>',
          '  </template>',
          '  <template #item-status>',
          '    <YTag tone="warning">Needs review</YTag>',
          '  </template>',
          '</YDescriptions>'
        ])
      }

      if (scenario === 'keyboard') {
        return sfc("import { YDescriptions } from '@yok-ui/core'", [
          '<YDescriptions',
          '  title="Keyboard readable metadata"',
          '  description="Use semantic dl, dt and dd so screen readers keep labels and values paired."',
          '  aria-label="Keyboard readable component metadata"',
          `${numericBinding('column', 2).trim() ? `  ${numericBinding('column', 2).trim()}` : ''}`,
          `${textAttribute('size', size).trim() ? `  ${textAttribute('size', size).trim()}` : ''}`,
          `${booleanAttribute('bordered', bordered).trim() ? `  ${booleanAttribute('bordered', bordered).trim()}` : ''}`,
          '/>'
        ].filter(Boolean))
      }

      if (scenario === 'empty') {
        return sfc("import { YDescriptions, YTag } from '@yok-ui/core'", [
          '<YDescriptions title="No metadata yet" description="The selected component has not synced profile metadata." empty-text="No component metadata available" bordered>',
          '  <template #extra>',
          '    <YTag tone="warning">Empty detail</YTag>',
          '  </template>',
          '</YDescriptions>'
        ])
      }

      const title = scenario === 'vertical'
        ? 'Vertical release profile'
        : scenario === 'long'
          ? 'Decision record'
          : scenario === 'mobile'
            ? 'Mobile detail summary'
            : 'Component details'
      const description = scenario === 'vertical'
        ? 'Stack labels above values for side panels and long labels.'
        : scenario === 'long'
          ? 'Use wider spans for notes, risk explanations and release context.'
          : scenario === 'mobile'
            ? 'Single-column reading keeps labels and values legible on narrow screens.'
            : 'Readable metadata for detail pages.'

      return sfc("import { YDescriptions } from '@yok-ui/core'", [
        `<YDescriptions${textAttribute('title', title)}${textAttribute('description', description)}${numericBinding('column', column)}${textAttribute('layout', layout)}${textAttribute('size', size)}${booleanAttribute('bordered', bordered)} />`
      ])
    }
  },
  list: {
    title: 'List scenario',
    description: '调试任务列表、资源网格、加载列表、空结果、移动列表和键盘阅读场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'tasks', options: [
        { label: '任务列表', value: 'tasks' },
        { label: '资源网格', value: 'grid' },
        { label: '加载列表', value: 'loading' },
        { label: '空结果', value: 'empty' },
        { label: '移动列表', value: 'mobile' },
        { label: '键盘阅读', value: 'keyboard' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ] },
      { key: 'bordered', label: '边框', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isGridScenario = scenario === 'grid'
      const isLoadingScenario = scenario === 'loading'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const layout = isGridScenario || isMobileScenario || isKeyboardScenario ? 'vertical' : 'horizontal'
      const columns = isGridScenario ? 3 : 1
      const title = isGridScenario
        ? 'Component resource grid'
        : isLoadingScenario
          ? 'Refreshing review tasks'
          : isEmptyScenario
            ? 'No matching tasks'
            : isMobileScenario
              ? 'Mobile review list'
              : isKeyboardScenario
                ? 'Keyboard readable task list'
                : 'Release checklist'
      const description = isGridScenario
        ? 'Grid lists are useful for compact resource cards and documentation tiles.'
        : isLoadingScenario
          ? 'Remote data is loading while the list region keeps status semantics.'
          : isEmptyScenario
            ? 'Filters returned no tasks; keep the empty copy short and actionable.'
            : isMobileScenario
              ? 'Vertical layout keeps copy and actions readable on narrow screens.'
              : isKeyboardScenario
                ? 'Use ul and li semantics; keep row actions as real buttons.'
                : 'Small tasks before a component is ready.'
      const ariaLabel = isKeyboardScenario
        ? 'Keyboard readable release tasks'
        : isMobileScenario
          ? 'Mobile release task list'
          : isGridScenario
            ? 'Component resource grid'
            : 'Release task list'
      const imports = isGridScenario || isKeyboardScenario
        ? "import { YButton, YList } from '@yok-ui/core'"
        : "import { YList } from '@yok-ui/core'"

      if (isKeyboardScenario) {
        return sfc(imports, [
          `<YList${textAttribute('title', title)}${textAttribute('description', description)}${textAttribute('layout', layout)}${textAttribute('size', state.size)}${booleanAttribute('bordered', state.bordered)}${textAttribute('aria-label', ariaLabel)}>`,
          '  <template #actions="{ item }">',
          '    <YButton size="sm" variant="ghost">Open item</YButton>',
          '  </template>',
          '</YList>'
        ])
      }

      return sfc(imports, [
        `<YList${textAttribute('title', title)}${textAttribute('description', description)}${textAttribute('layout', layout)}${numericBinding('columns', columns)}${textAttribute('size', isMobileScenario ? 'sm' : state.size)}${booleanAttribute('bordered', Boolean(state.bordered) || isLoadingScenario)}${booleanAttribute('loading', isLoadingScenario)}${textAttribute('aria-label', ariaLabel)}${isEmptyScenario ? ' :items="[]"' : ''} empty-text="No checklist items">`,
        isGridScenario ? '  <template #actions="{ item }">' : '',
        isGridScenario ? '    <YButton size="sm" variant="secondary">Open item</YButton>' : '',
        isGridScenario ? '  </template>' : '',
        '</YList>'
      ].filter(Boolean))
    }
  },
  layout: {
    title: 'Layout scenario',
    description: '调试页面骨架、后台壳层、吸顶顶栏、折叠侧栏、移动端和语义顺序。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础骨架', value: 'basic' },
        { label: '后台壳层', value: 'admin' },
        { label: '吸顶顶栏', value: 'sticky' },
        { label: '折叠侧栏', value: 'collapsed' },
        { label: '移动端', value: 'mobile' },
        { label: '语义顺序', value: 'keyboard' }
      ] },
      { key: 'asideWidth', label: '侧栏宽度', type: 'text', defaultValue: '220px' },
      { key: 'headerHeight', label: '顶栏高度', type: 'text', defaultValue: '56px' },
      { key: 'fullHeight', label: '占满视口', type: 'boolean', defaultValue: true },
      { key: 'bordered', label: '分隔线', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isAdminScenario = scenario === 'admin'
      const isStickyScenario = scenario === 'sticky'
      const isCollapsedScenario = scenario === 'collapsed'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const asideWidth = isMobileScenario ? '100%' : String(state.asideWidth || '220px')
      const headerHeight = isMobileScenario ? '52px' : String(state.headerHeight || '56px')
      const fullHeight = Boolean(state.fullHeight)
      const bordered = Boolean(state.bordered) || isStickyScenario || isCollapsedScenario
      const asideCollapsed = isCollapsedScenario
      const helperText = isMobileScenario
        ? 'Mobile layout uses a vertical shell instead of stacking a full desktop sidebar above content.'
        : isStickyScenario
          ? 'Sticky header keeps route actions visible on long documentation pages.'
          : isCollapsedScenario
            ? 'Collapsed aside preserves a stable compact navigation rail.'
            : isKeyboardScenario
              ? 'Semantic header, aside, main and footer keep native reading and Tab order.'
              : isAdminScenario
                ? 'Nested horizontal layout creates an admin shell with side navigation and workspace.'
                : 'Auto direction switches to vertical when Header or Footer is a direct child.'

      const imports = "import { YAside, YFooter, YHeader, YLayout, YMain, YTag } from '@yok-ui/core'"

      if (isMobileScenario) {
        return sfc(imports, [
          `<YLayout${booleanAttribute('full-height', fullHeight)} aria-label="Mobile application shell">`,
          `  <YHeader${textAttribute('height', headerHeight)}${booleanAttribute('bordered', bordered)}>Yok UI</YHeader>`,
          `  <YMain>`,
          '    <div class="demo-stack demo-stack--mobile">',
          '      <strong>Mobile workspace</strong>',
          '      <p>Primary content stays first; compact navigation can move into a drawer or command surface.</p>',
          `      <YTag tone="info">${helperText}</YTag>`,
          '    </div>',
          '  </YMain>',
          '</YLayout>'
        ])
      }

      if (isAdminScenario || isStickyScenario || isCollapsedScenario || isKeyboardScenario) {
        return sfc(imports, [
          `<YLayout${booleanAttribute('full-height', fullHeight)} aria-label="${isKeyboardScenario ? 'Keyboard application shell' : 'Admin application shell'}">`,
          `  <YHeader${textAttribute('height', headerHeight)}${booleanAttribute('sticky', isStickyScenario || isKeyboardScenario)}${booleanAttribute('bordered', bordered)}>Yok UI Workspace</YHeader>`,
          '  <YLayout direction="horizontal">',
          `    <YAside${textAttribute('width', asideWidth)} collapsed-width="72px"${booleanAttribute('collapsed', asideCollapsed)}${booleanAttribute('bordered', bordered)} aria-label="Primary navigation">Navigation</YAside>`,
          `    <YMain${booleanAttribute('scrollable', isStickyScenario || isKeyboardScenario)}>`,
          '      <div class="demo-stack">',
          '        <strong>Release workspace</strong>',
          '        <p>Tables, forms and live examples share the remaining flexible area.</p>',
          `        <YTag tone="${isKeyboardScenario || isCollapsedScenario ? 'warning' : 'info'}">${helperText}</YTag>`,
          '      </div>',
          '    </YMain>',
          '  </YLayout>',
          '  <YFooter bordered>Release footer</YFooter>',
          '</YLayout>'
        ])
      }

      return sfc(imports, [
        `<YLayout${booleanAttribute('full-height', fullHeight)} aria-label="Documentation page shell">`,
        `  <YHeader${textAttribute('height', headerHeight)}${booleanAttribute('bordered', bordered)}>Yok UI</YHeader>`,
        '  <YMain>',
        '    <div class="demo-stack">',
        '      <strong>Documentation content</strong>',
        '      <p>Layout provides the page frame; content components own their interaction.</p>',
        `      <YTag tone="success">${helperText}</YTag>`,
        '    </div>',
        '  </YMain>',
        `  <YFooter${booleanAttribute('bordered', bordered)}>Footer</YFooter>`,
        '</YLayout>'
      ])
    }
  },
  menu: {
    title: 'Menu scenario',
    description: '调试侧边导航、顶部导航、折叠侧栏、手风琴展开、移动导航和键盘路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'vertical', options: [
        { label: '侧边导航', value: 'vertical' },
        { label: '顶部导航', value: 'horizontal' },
        { label: '折叠菜单', value: 'collapsed' },
        { label: '手风琴展开', value: 'accordion' },
        { label: '禁用项', value: 'disabled' },
        { label: '移动导航', value: 'mobile' },
        { label: '键盘导航', value: 'keyboard' }
      ] },
      { key: 'modelValue', label: '选中项', type: 'select', defaultValue: 'menu', options: [
        { label: 'Guide', value: 'guide' },
        { label: 'Button', value: 'button' },
        { label: 'Menu', value: 'menu' },
        { label: 'API Reference', value: 'api-reference' }
      ] },
      { key: 'collapsed', label: '折叠', type: 'boolean', defaultValue: false },
      { key: 'accordion', label: '手风琴', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isHorizontalScenario = scenario === 'horizontal'
      const isCollapsedScenario = scenario === 'collapsed'
      const isAccordionScenario = scenario === 'accordion'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const mode = isHorizontalScenario ? 'horizontal' : 'vertical'
      const collapsed = Boolean(state.collapsed) || isCollapsedScenario
      const accordion = Boolean(state.accordion) || isAccordionScenario
      const modelValue = isKeyboardScenario ? 'button' : String(state.modelValue)
      const defaultOpenKeys = isAccordionScenario
        ? "['resources']"
        : isHorizontalScenario
          ? "['components']"
          : "['components', 'resources']"
      const label = isHorizontalScenario
        ? 'Product top navigation'
        : isMobileScenario
          ? 'Mobile docs navigation'
          : isKeyboardScenario
            ? 'Keyboard docs navigation'
            : 'Docs side navigation'
      const helperText = isHorizontalScenario
        ? 'Horizontal mode covers top-level product navigation.'
        : isCollapsedScenario
          ? 'Collapsed mode preserves stable icon sizing and title labels.'
          : isAccordionScenario
            ? 'Accordion mode keeps only one submenu open at a time.'
            : isDisabledScenario
              ? 'Disabled items stay visible but cannot be selected or reached by arrow navigation.'
              : isMobileScenario
                ? 'Mobile navigation should be compact and not push content below a full desktop sidebar.'
                : isKeyboardScenario
                  ? 'Arrow keys move focus; Enter or Space activates items or toggles submenus.'
                  : 'Menu uses item data, defaultOpenKeys and modelValue to keep route state explicit.'

      const imports = `import { YMenu, YTag } from '@yok-ui/core'

const menuItems = [
  { label: 'Guide', value: 'guide', icon: 'G' },
  { label: 'Components', value: 'components', icon: 'C', children: [
    { label: 'Button', value: 'button' },
    { label: 'Menu', value: 'menu' },
    { label: 'Data Table', value: 'data-table' }
  ] },
  { label: 'Resources', value: 'resources', icon: 'R', children: [
    { label: 'API Reference', value: 'api-reference' },
    { label: 'Maturity', value: 'maturity' }
  ] },
  { label: 'Disabled', value: 'disabled', icon: 'D', disabled: true }
]`

      return sfc(imports, [
        `<div class="demo-stack${isMobileScenario ? ' demo-stack--mobile' : ''}">`,
        `  <YMenu :items="menuItems"${textAttribute('model-value', modelValue)} :default-open-keys="${defaultOpenKeys}"${textAttribute('mode', mode)}${textAttribute('aria-label', label)}${booleanAttribute('collapsed', collapsed)}${booleanAttribute('accordion', accordion)} />`,
        `  <YTag tone="${isKeyboardScenario || isAccordionScenario || isDisabledScenario ? 'warning' : 'info'}">${helperText}</YTag>`,
        '</div>'
      ])
    }
  },
  message: {
    title: 'Message scenario',
    description: '调试保存成功、错误警报、持续提示、移动提示和键盘关闭场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'success', options: [
        { label: '保存成功', value: 'success' },
        { label: '错误警报', value: 'danger' },
        { label: '持续提示', value: 'persistent' },
        { label: '移动提示', value: 'mobile' },
        { label: '键盘关闭', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Saved' },
      { key: 'body', label: '内容', type: 'text', defaultValue: 'Component settings have been updated.' },
      { key: 'closable', label: '可关闭', type: 'boolean', defaultValue: true },
      { key: 'closeLabel', label: '关闭名称', type: 'text', defaultValue: 'Close message' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isDangerScenario = scenario === 'danger'
      const isPersistentScenario = scenario === 'persistent'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const tone = isDangerScenario
        ? 'danger'
        : isPersistentScenario
          ? 'warning'
          : isMobileScenario
            ? 'info'
            : isKeyboardScenario
              ? 'info'
              : 'success'
      const title = isDangerScenario
        ? 'Release failed'
        : isPersistentScenario
          ? 'Needs review'
          : isMobileScenario
            ? 'Saved on mobile'
            : isKeyboardScenario
              ? 'Keyboard reachable'
              : state.title
      const body = isDangerScenario
        ? 'Check the failing package and try publishing again.'
        : isPersistentScenario
          ? 'Contrast pairs are close to the AA threshold and need a design pass.'
          : isMobileScenario
            ? 'Short copy keeps feedback readable in compact headers.'
            : isKeyboardScenario
              ? 'Tab reaches the close button; Enter dismisses the message.'
              : state.body
      const role = isDangerScenario || isPersistentScenario ? 'alert' : 'status'
      const closable = isDangerScenario || isPersistentScenario || isKeyboardScenario || Boolean(state.closable)
      const closeLabel = isDangerScenario
        ? 'Close failure message'
        : isPersistentScenario
          ? 'Dismiss review warning'
          : isKeyboardScenario
            ? 'Dismiss keyboard message'
            : state.closeLabel

      return sfc("import { YMessage } from '@yok-ui/core'", [
      `<YMessage${textAttribute('tone', tone)}${textAttribute('title', title)}${textAttribute('role', role)}${booleanAttribute('closable', closable)}${textAttribute('close-label', closeLabel)}>`,
      `  ${escapeAttribute(body)}`,
      '</YMessage>'
    ])
    }
  },
  messageBox: {
    title: 'Message Box scenario',
    description: '调试发布确认、危险删除、输入确认、异步确认、移动弹窗和键盘路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'confirm', options: [
        { label: '发布确认', value: 'confirm' },
        { label: '危险删除', value: 'danger' },
        { label: '输入确认', value: 'prompt' },
        { label: '异步确认', value: 'async' },
        { label: '移动弹窗', value: 'mobile' },
        { label: '键盘路径', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Publish release?' },
      { key: 'body', label: '内容', type: 'text', defaultValue: 'This will make the selected component release visible to users.' },
      { key: 'confirmText', label: '确认文案', type: 'text', defaultValue: 'Publish' },
      { key: 'cancelText', label: '取消文案', type: 'text', defaultValue: 'Review' },
      { key: 'promptValue', label: '输入值', type: 'text', defaultValue: 'feature/docs' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isDangerScenario = scenario === 'danger'
      const isPromptScenario = scenario === 'prompt'
      const isAsyncScenario = scenario === 'async'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const variant = isPromptScenario ? 'prompt' : 'confirm'
      const tone = isDangerScenario
        ? 'danger'
        : isAsyncScenario || isKeyboardScenario
          ? 'info'
          : 'warning'
      const title = isDangerScenario
        ? 'Delete component draft?'
        : isPromptScenario
          ? 'Create branch'
          : isAsyncScenario
            ? 'Run async release?'
            : isMobileScenario
              ? 'Mobile confirmation'
              : isKeyboardScenario
                ? 'Keyboard confirmation'
                : state.title
      const body = isDangerScenario
        ? 'This operation cannot be undone. Keep destructive copy explicit.'
        : isPromptScenario
          ? 'Branch names must use the feature/ prefix before confirming.'
          : isAsyncScenario
            ? 'The confirm button enters loading while onConfirm resolves.'
            : isMobileScenario
              ? 'Short copy keeps the dialog readable on compact screens.'
              : isKeyboardScenario
                ? 'Focus enters the dialog, Tab stays inside, and Escape closes.'
                : state.body
      const confirmText = isDangerScenario
        ? 'Delete'
        : isAsyncScenario
          ? 'Run'
          : state.confirmText
      const cancelText = isDangerScenario ? 'Cancel' : state.cancelText
      const promptError = isPromptScenario ? 'Use a feature/ prefix.' : ''

      return sfc("import { YMessageBox } from '@yok-ui/core'", [
        `<YMessageBox open${textAttribute('variant', variant)}${textAttribute('tone', tone)}${textAttribute('title', title)}${textAttribute('message', body)}${textAttribute('confirm-text', confirmText)}${textAttribute('cancel-text', cancelText)}${booleanAttribute('loading', isAsyncScenario)}${booleanAttribute('close-on-overlay', false)}${isPromptScenario ? textAttribute('prompt-label', 'Branch name') : ''}${isPromptScenario ? textAttribute('prompt-value', String(state.promptValue)) : ''}${isPromptScenario ? textAttribute('prompt-error', promptError) : ''} />`
      ])
    }
  },
  notification: {
    title: 'Notification scenario',
    description: '调试发布通知、失败通知、持续通知、角落位置说明、移动通知和键盘关闭场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'success', options: [
        { label: '发布通知', value: 'success' },
        { label: '失败通知', value: 'danger' },
        { label: '持续通知', value: 'persistent' },
        { label: '角落位置', value: 'placement' },
        { label: '移动通知', value: 'mobile' },
        { label: '键盘关闭', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Published' },
      { key: 'body', label: '内容', type: 'text', defaultValue: 'Calendar docs are live.' },
      { key: 'closable', label: '可关闭', type: 'boolean', defaultValue: true },
      { key: 'closeLabel', label: '关闭名称', type: 'text', defaultValue: 'Close notification' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isDangerScenario = scenario === 'danger'
      const isPersistentScenario = scenario === 'persistent'
      const isPlacementScenario = scenario === 'placement'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const tone = isDangerScenario
        ? 'danger'
        : isPersistentScenario || isKeyboardScenario
          ? 'warning'
          : isPlacementScenario
            ? 'info'
            : 'success'
      const title = isDangerScenario
        ? 'Deploy failed'
        : isPersistentScenario
          ? 'Review required'
          : isPlacementScenario
            ? 'Bottom-left notification'
            : isMobileScenario
              ? 'Mobile notification'
              : isKeyboardScenario
                ? 'Keyboard close path'
                : state.title
      const body = isDangerScenario
        ? 'Rollback is ready. Review the failed package before retrying.'
        : isPersistentScenario
          ? 'This notice stays until the reviewer closes it from the notification stack.'
          : isPlacementScenario
            ? 'Use notification.open({ placement: "bottom-left" }) when the top-right corner is busy.'
            : isMobileScenario
              ? 'Width is capped by the viewport and the close button keeps a stable hit area.'
              : isKeyboardScenario
                ? 'Tab reaches the close button; Enter or Space dismisses the notification.'
                : state.body
      const role = isDangerScenario || isPersistentScenario ? 'alert' : 'status'
      const closable = isDangerScenario || isPersistentScenario || isKeyboardScenario || Boolean(state.closable)
      const closeLabel = isDangerScenario
        ? 'Close failure notification'
        : isPersistentScenario
          ? 'Dismiss review notification'
          : isKeyboardScenario
            ? 'Dismiss keyboard notification'
            : state.closeLabel

      return sfc("import { YNotification } from '@yok-ui/core'", [
        `<YNotification${textAttribute('tone', tone)}${textAttribute('title', title)}${textAttribute('role', role)}${booleanAttribute('closable', closable)}${textAttribute('close-label', closeLabel)}>`,
        `  ${escapeAttribute(body)}`,
        '</YNotification>'
      ])
    }
  },
  formItem: {
    title: 'Form Item scenario',
    description: '调试基础字段、Slot 绑定、校验错误、可选字段、移动字段和键盘字段场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础字段', value: 'basic' },
        { label: 'Slot 绑定', value: 'slot' },
        { label: '校验错误', value: 'error' },
        { label: '可选字段', value: 'optional' },
        { label: '移动字段', value: 'mobile' },
        { label: '键盘字段', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Component name' },
      { key: 'prop', label: '字段名', type: 'text', defaultValue: 'component-name' },
      { key: 'hint', label: '提示', type: 'text', defaultValue: 'Use PascalCase for exported components.' },
      { key: 'error', label: '错误', type: 'text', defaultValue: '' },
      { key: 'required', label: '必填', type: 'boolean', defaultValue: true },
      { key: 'inputValue', label: '输入值', type: 'text', defaultValue: 'YokButton' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isSlotScenario = scenario === 'slot'
      const isErrorScenario = scenario === 'error'
      const isOptionalScenario = scenario === 'optional'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isKeyboardScenario
        ? 'Keyboard component name'
        : isMobileScenario
          ? 'Name'
          : state.label
      const prop = isOptionalScenario ? 'release-note' : state.prop
      const hint = isErrorScenario
        ? 'Use the component export name before publishing.'
        : isKeyboardScenario
          ? 'Tab enters the input, then reaches the next form action.'
          : isOptionalScenario
            ? 'Optional field for release context.'
            : isMobileScenario
              ? 'Short helper copy.'
              : state.hint
      const error = isErrorScenario ? 'Component name is required.' : state.error
      const required = isOptionalScenario ? false : Boolean(state.required) || isErrorScenario
      const inputValue = isErrorScenario ? '' : isKeyboardScenario ? 'YokKeyboardField' : state.inputValue
      const describedBy = isErrorScenario || isKeyboardScenario ? 'component-name-help' : ''

      if (isSlotScenario) {
        return sfc("import { YFormItem, YInput, YTag } from '@yok-ui/core'", [
          '<div class="demo-stack">',
          '  <YFormItem',
          '    label="Component name"',
          '    prop="component-name"',
          '    hint="Slot props keep label, message and invalid state wired to the input."',
          '    required',
          '    v-slot="{ labelFor, messageId, invalid }"',
          '  >',
          '    <YInput',
          '      :id="labelFor"',
          '      model-value="YokInput"',
          '      placeholder="Component name"',
          '      :invalid="invalid"',
          '      :aria-describedby="messageId"',
          '    />',
          '  </YFormItem>',
          '  <YTag tone="info">Use FormItem slot props instead of hand-writing disconnected ids.</YTag>',
          '</div>'
        ])
      }

      return sfc("import { YFormItem, YInput } from '@yok-ui/core'", [
        `<YFormItem${textAttribute('label', label)}${textAttribute('prop', prop)}${hint ? textAttribute('hint', hint) : ''}${error ? textAttribute('error', error) : ''}${booleanAttribute('required', required)}>`,
        `  <YInput${textAttribute('model-value', inputValue)} placeholder="Component name"${describedBy ? textAttribute('aria-describedby', describedBy) : ''} />`,
        '</YFormItem>'
      ])
    }
  },
  formSummary: {
    title: 'Form Summary scenario',
    description: '调试错误汇总、关联字段、复核、空摘要、移动摘要和键盘定位场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'errors', options: [
        { label: '错误汇总', value: 'errors' },
        { label: '关联字段', value: 'linked' },
        { label: '复核摘要', value: 'review' },
        { label: '空摘要', value: 'empty' },
        { label: '移动摘要', value: 'mobile' },
        { label: '键盘摘要', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Please fix the component form' },
      { key: 'focusOnClick', label: '点击聚焦字段', type: 'boolean', defaultValue: true },
      { key: 'caption', label: '说明', type: 'text', defaultValue: 'Errors are injected by the docs runner.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isLinkedScenario = scenario === 'linked'
      const isReviewScenario = scenario === 'review'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const title = isKeyboardScenario
        ? 'Keyboard validation summary'
        : isReviewScenario
          ? 'Review component errors'
          : isMobileScenario
            ? 'Fix fields'
            : state.title
      const focusOnClick = isReviewScenario ? false : Boolean(state.focusOnClick) || isKeyboardScenario
      const caption = isKeyboardScenario
        ? 'Enter moves focus to the invalid field summary target.'
        : isEmptyScenario
          ? 'No validation errors. The summary stays silent and does not render.'
          : isReviewScenario
            ? 'Readonly review keeps error context visible without moving focus.'
            : isMobileScenario
              ? 'Short summary copy keeps mobile forms usable.'
              : state.caption
      const errorsAttribute = isEmptyScenario
        ? ' :errors="[]"'
        : isMobileScenario
          ? ' errors="mobile"'
          : isLinkedScenario
            ? ' :errors="summaryErrors"'
          : isReviewScenario
            ? ' errors="review"'
            : isKeyboardScenario
              ? ' errors="keyboard"'
              : ''

      if (isLinkedScenario) {
        return sfc([
          "import { YFormItem, YFormSummary, YInput, YTag } from '@yok-ui/core'",
          '',
          'const summaryErrors = [',
          "  { fieldId: 'component-name', label: 'Component name', message: 'Name is required.' },",
          "  { fieldId: 'release-note', label: 'Release note', message: 'Explain the user-facing change.' }",
          ']'
        ].join('\n'), [
          '<div class="demo-stack">',
          '  <YFormSummary title="Review 2 fields before saving" :errors="summaryErrors" />',
          '  <YFormItem label="Component name" prop="component-name" label-for="component-name" error="Name is required.">',
          '    <YInput id="component-name" model-value="" placeholder="Component name" invalid aria-describedby="yok-form-message-component-name" />',
          '  </YFormItem>',
          '  <YFormItem label="Release note" prop="release-note" label-for="release-note" error="Explain the user-facing change.">',
          '    <YInput id="release-note" model-value="" placeholder="Mention migration impact" invalid aria-describedby="yok-form-message-release-note" />',
          '  </YFormItem>',
          '  <YTag tone="warning">Summary buttons should point to real field ids.</YTag>',
          '</div>'
        ])
      }

      return sfc("import { YFormSummary, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YFormSummary${textAttribute('title', title)}${focusOnClick ? '' : ' :focus-on-click="false"'}${errorsAttribute} />`,
        `  <YTag tone="${isEmptyScenario ? 'success' : isReviewScenario ? 'warning' : 'info'}">${escapeAttribute(caption)}</YTag>`,
        '</div>'
      ])
    }
  },
  statusTimeline: {
    title: 'Status Timeline scenario',
    description: '用发布状态、倒序、空态、移动和键盘路径调试状态时间线。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'release', options: [
        { label: '发布状态', value: 'release' },
        { label: '倒序时间线', value: 'reverse' },
        { label: '空时间线', value: 'empty' },
        { label: '移动时间线', value: 'mobile' },
        { label: '键盘时间线', value: 'keyboard' }
      ] },
      { key: 'activeValue', label: '当前节点', type: 'select', defaultValue: 'review', options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review', value: 'review' },
        { label: 'Approval', value: 'approval' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'md', options: [
        { label: 'Medium', value: 'md' },
        { label: 'Small', value: 'sm' }
      ] },
      { key: 'reverse', label: '倒序', type: 'boolean', defaultValue: false },
      { key: 'ariaLabel', label: '可访问名称', type: 'text', defaultValue: 'Release status timeline' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isEmptyScenario = scenario === 'empty'
      const isKeyboardScenario = scenario === 'keyboard'
      const activeValue = isKeyboardScenario ? 'approval' : scenario === 'mobile' ? 'review' : state.activeValue
      const reverse = scenario === 'reverse' || Boolean(state.reverse)
      const size = scenario === 'mobile' ? 'sm' : state.size
      const ariaLabel = isKeyboardScenario
        ? 'Keyboard status timeline'
        : scenario === 'mobile'
          ? 'Mobile release status timeline'
          : state.ariaLabel
      const helper = isKeyboardScenario
        ? 'Timeline remains readable while adjacent review actions receive focus.'
        : isEmptyScenario
          ? 'No status events yet'
          : ''

      const statusTimelineItems = isEmptyScenario ? [] : fallbackStatusTimelineItems
      const imports = [
        `import { YTag } from '@yok-ui/core'`,
        `import { YStatusTimeline } from '@yok-ui/admin'`,
        ``,
        `const statusTimelineItems = ${JSON.stringify(statusTimelineItems, null, 2)}`
      ].join('\n')

      return sfc(imports, [
        '<div class="demo-stack">',
        `  <YStatusTimeline :items="${isEmptyScenario ? '[]' : 'statusTimelineItems'}"${textAttribute('active-value', activeValue)}${textAttribute('size', size)}${booleanAttribute('reverse', reverse)}${textAttribute('aria-label', ariaLabel)} />`,
        helper ? `  <YTag tone="${isEmptyScenario ? 'warning' : 'info'}">${helper}</YTag>` : '',
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  reviewWorkflow: {
    title: 'Review Workflow scenario',
    description: '用审核流程、加载保存、阻断、移动和键盘路径调试审核工作流。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '审核流程', value: 'default' },
        { label: '加载审核', value: 'loading' },
        { label: '阻断审核', value: 'blocked' },
        { label: '移动审核', value: 'mobile' },
        { label: '键盘审核', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Live example review' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Approve or request changes before marking a component documented.' },
      { key: 'activeValue', label: '当前节点', type: 'select', defaultValue: 'reviewing', options: [
        { label: 'Submitted', value: 'submitted' },
        { label: 'Reviewing', value: 'reviewing' },
        { label: 'Approved', value: 'approved' }
      ] },
      { key: 'reviewer', label: '审核人', type: 'text', defaultValue: 'Maintainer' },
      { key: 'dueText', label: '截止', type: 'text', defaultValue: 'Due today' },
      { key: 'loading', label: '加载中', type: 'boolean', defaultValue: false },
      { key: 'disabled', label: '禁用', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isLoadingScenario = scenario === 'loading'
      const isBlockedScenario = scenario === 'blocked'
      const isKeyboardScenario = scenario === 'keyboard'
      const title = isKeyboardScenario
        ? 'Keyboard review workflow'
        : scenario === 'mobile'
          ? 'Mobile review'
          : isBlockedScenario
            ? 'Review blocked'
            : state.title
      const description = isKeyboardScenario
        ? 'Approve, request changes and reject stay in a predictable focus order.'
        : isLoadingScenario
          ? 'Saving review decision'
          : isBlockedScenario
            ? 'Missing accessibility evidence blocks approval.'
            : scenario === 'mobile'
              ? 'Compact review flow keeps the current decision visible.'
              : state.description
      const status = isBlockedScenario ? 'Blocked' : isLoadingScenario ? 'Saving review decision' : ''

      const imports = [
        `import { YTag } from '@yok-ui/core'`,
        `import { YReviewWorkflow } from '@yok-ui/admin'`,
        ``,
        `const reviewWorkflowSteps = ${JSON.stringify(fallbackReviewSteps, null, 2)}`
      ].join('\n')

      return sfc(imports, [
        '<div class="demo-stack">',
        `  <YReviewWorkflow :items="reviewWorkflowSteps"${textAttribute('title', title)}${textAttribute('description', description)}${textAttribute('active-value', isBlockedScenario ? 'reviewing' : state.activeValue)}${textAttribute('reviewer', scenario === 'mobile' ? 'You' : state.reviewer)}${textAttribute('due-text', scenario === 'mobile' ? 'Today' : state.dueText)}${status ? textAttribute('status', status) : ''}${booleanAttribute('loading', isLoadingScenario || Boolean(state.loading))}${booleanAttribute('disabled', isBlockedScenario || Boolean(state.disabled))}${isKeyboardScenario ? ' approve-text="Approve" request-changes-text="Request changes" reject-text="Reject"' : ''} />`,
        isKeyboardScenario ? '  <YTag tone="info">Approve, request changes and reject stay in a predictable focus order.</YTag>' : '',
        isLoadingScenario ? '  <YTag tone="warning">Saving review decision</YTag>' : '',
        isBlockedScenario ? '  <YTag tone="danger">Approval is blocked until evidence is attached.</YTag>' : '',
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  crudLayout: {
    title: 'CRUD Layout scenario',
    description: '用列表管理、审核工作台和紧凑运维页调试 CRUD 页面骨架。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'inventory', options: [
        { label: '组件库存', value: 'inventory' },
        { label: '审核工作台', value: 'review' },
        { label: '紧凑运维', value: 'ops' },
        { label: '响应式侧栏', value: 'responsive' },
        { label: '空内容区', value: 'empty' },
        { label: '键盘 CRUD', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Components' },
      { key: 'eyebrow', label: '眉标', type: 'text', defaultValue: 'Admin console' },
      { key: 'status', label: '状态', type: 'text', defaultValue: 'Beta' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'A complete CRUD shell for searchable component operations.' },
      { key: 'density', label: '密度', type: 'select', defaultValue: 'compact', options: [
        { label: 'Comfortable', value: 'comfortable' },
        { label: 'Compact', value: 'compact' }
      ] },
      { key: 'stickyHeader', label: '吸顶头部', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isReviewScenario = scenario === 'review'
      const isOpsScenario = scenario === 'ops'
      const isResponsiveScenario = scenario === 'responsive'
      const isEmptyScenario = scenario === 'empty'
      const isKeyboardScenario = scenario === 'keyboard'
      const density = isOpsScenario || isResponsiveScenario || isKeyboardScenario ? 'compact' : state.density
      const title = isKeyboardScenario
        ? 'Keyboard CRUD layout'
        : isEmptyScenario
          ? 'Empty CRUD layout'
          : isReviewScenario
            ? 'Review queue'
            : state.title
      const description = isKeyboardScenario
        ? 'Tab reaches filters, table settings and row actions in order.'
        : isEmptyScenario
          ? 'No records matched current filters; the shell keeps actions and table region stable.'
          : isResponsiveScenario
            ? 'Responsive CRUD shell keeps primary list content before secondary regions.'
            : isOpsScenario
              ? 'Dense admin workflow for repeated maintenance tasks.'
              : state.description

      const crudSearchModel = isEmptyScenario
        ? { keyword: 'missing', status: '', package: 'admin' }
        : isReviewScenario
          ? { keyword: 'review', status: 'beta', package: 'admin' }
          : { ...fallbackSearchModel }
      const crudTableRows = isEmptyScenario ? [] : fallbackAdminRows
      const imports = [
        `import { ref } from 'vue'`,
        `import { YButton } from '@yok-ui/core'`,
        `import { YCrudLayout, YDataTable, YSearchForm } from '@yok-ui/admin'`,
        ``,
        `const crudSearchModel = ref(${JSON.stringify(crudSearchModel, null, 2)})`,
        `const crudSearchFields = ${JSON.stringify(fallbackSearchFields, null, 2)}`,
        `const crudTableColumns = ${JSON.stringify(fallbackAdminColumns, null, 2)}`,
        `const crudTableRows = ${JSON.stringify(crudTableRows, null, 2)}`
      ].join('\n')

      return sfc(imports, [
      `<YCrudLayout${textAttribute('title', title)}${textAttribute('eyebrow', isOpsScenario ? 'Operations' : state.eyebrow)}${textAttribute('status', isReviewScenario ? 'Needs review' : isEmptyScenario ? 'Empty' : state.status)}${textAttribute('description', description)}${textAttribute('density', density)}${booleanAttribute('sticky-header', Boolean(state.stickyHeader) || isOpsScenario || isKeyboardScenario)} aria-label="${isKeyboardScenario ? 'Keyboard CRUD layout' : 'Component CRUD layout'}">`,
      '  <template #actions>',
      `    <YButton variant="${isReviewScenario ? 'secondary' : 'primary'}">${isReviewScenario ? 'Assign reviewer' : 'Create component'}</YButton>`,
      '  </template>',
      '  <template #search>',
      `    <YSearchForm title="${isReviewScenario ? 'Review filters' : isKeyboardScenario ? 'Keyboard filters' : 'Quick filters'}" description="${isKeyboardScenario ? 'Tab reaches filters, table settings and row actions in order.' : 'Search model and fields stay copyable in the generated source.'}" density="${density}" :model-value="crudSearchModel" :fields="crudSearchFields" ${isOpsScenario || isResponsiveScenario ? ':collapsed-count="2"' : ':collapsed-count="3"'} />`,
      '  </template>',
      '  <template #toolbar>',
      '    <YButton variant="secondary">Export CSV</YButton>',
      '    <YButton variant="ghost">Save view</YButton>',
      '  </template>',
      '  <template #table>',
      `    <YDataTable title="${isReviewScenario ? 'Pending review rows' : isEmptyScenario ? 'No matching rows' : isKeyboardScenario ? 'Keyboard review rows' : 'Component rows'}" :columns="crudTableColumns" :data="crudTableRows" selectable pagination :page="1" :page-size="${isOpsScenario || isResponsiveScenario ? 3 : 4}"${isReviewScenario ? ' sticky-bulk-actions' : ''}${isOpsScenario || isKeyboardScenario ? ' density="compact" show-density-settings' : ''}${isEmptyScenario ? ' empty-text="No components matched"' : ''}${isKeyboardScenario ? ' selected-row-keys="button"' : ''} />`,
      '  </template>',
      '  <template #aside>',
      `    <section aria-label="CRUD summary">${isEmptyScenario ? 'No rows matched current filters.' : 'Release summary: 4 components tracked.'}</section>`,
      '  </template>',
      '</YCrudLayout>'
    ])
    }
  },
  pagination: {
    title: 'Pagination scenario',
    description: '调试列表翻页、密集页码、单页隐藏、禁用状态、移动分页和键盘分页场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'list', options: [
        { label: '列表翻页', value: 'list' },
        { label: '密集页码', value: 'dense' },
        { label: '单页隐藏', value: 'single' },
        { label: '禁用状态', value: 'disabled' },
        { label: '移动分页', value: 'mobile' },
        { label: '键盘分页', value: 'keyboard' }
      ] },
      { key: 'page', label: '当前页', type: 'range', defaultValue: 2, min: 1, max: 12, step: 1 },
      { key: 'pageSize', label: '每页数量', type: 'range', defaultValue: 10, min: 5, max: 30, step: 5 },
      { key: 'total', label: '总数', type: 'range', defaultValue: 72, min: 10, max: 240, step: 10 },
      { key: 'siblingCount', label: '相邻页', type: 'range', defaultValue: 1, min: 0, max: 3, step: 1 }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isDenseScenario = scenario === 'dense'
      const isSinglePageScenario = scenario === 'single'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const page = isSinglePageScenario ? 1 : Number(state.page)
      const pageSize = isMobileScenario ? 20 : Number(state.pageSize)
      const total = isSinglePageScenario ? 8 : isDenseScenario ? 240 : Number(state.total)
      const siblingCount = isDenseScenario ? 2 : isMobileScenario ? 0 : Number(state.siblingCount)
      const ariaLabel = isDisabledScenario
        ? 'Disabled release queue pagination'
        : isKeyboardScenario
          ? 'Keyboard pagination for result pages'
          : isMobileScenario
            ? 'Mobile result pagination'
            : isDenseScenario
              ? 'Dense table pagination'
              : 'Release queue pagination'
      const note = isDisabledScenario
        ? 'Release queue paused while remote data refreshes.'
        : isKeyboardScenario
          ? 'Keyboard pagination path: Tab reaches previous, page numbers and next; aria-current marks the active page.'
          : isMobileScenario
            ? 'Mobile pagination keeps only the closest page controls visible.'
            : isSinglePageScenario
              ? 'Single-page search results hide pagination chrome.'
              : isDenseScenario
                ? 'Dense table pagination gives power users more nearby page targets.'
                : 'Use with Table, DataTable or List.'

      return sfc("import { YPagination, YTag } from '@yok-ui/core'", [
        '<div class="demo-stack">',
        `  <YPagination${numericBinding('page', page)}${numericBinding('page-size', pageSize)}${numericBinding('total', total)}${numericBinding('sibling-count', siblingCount)}${textAttribute('aria-label', ariaLabel)}${booleanAttribute('hide-on-single-page', isSinglePageScenario)}${booleanAttribute('disabled', isDisabledScenario)}${isKeyboardScenario ? ' previous-text="Previous page" next-text="Next page"' : ''} />`,
        `  <YTag tone="${isDisabledScenario ? 'warning' : isSinglePageScenario ? 'success' : 'info'}">${note}</YTag>`,
        '</div>'
      ])
    }
  },
  commandPalette: {
    title: 'Command Palette scenario',
    description: '调试打开、搜索、空命令、移动和键盘命令面板场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'open', options: [
        { label: '打开命令', value: 'open' },
        { label: '搜索命令', value: 'search' },
        { label: '空命令', value: 'empty' },
        { label: '移动命令', value: 'mobile' },
        { label: '键盘命令', value: 'keyboard' }
      ] },
      { key: 'open', label: '默认打开', type: 'boolean', defaultValue: true },
      { key: 'hint', label: '提示文案', type: 'text', defaultValue: 'Try keyboard navigation: Down, Up, Enter, Escape.' },
      { key: 'tone', label: '提示类型', type: 'select', defaultValue: 'info', options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' }
      ] }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isSearchScenario = scenario === 'search'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const hint = isKeyboardScenario
        ? 'Keyboard command palette. Down, Up, Enter and Escape keep the command palette usable without a pointer.'
        : isEmptyScenario
          ? 'No commands found'
          : isSearchScenario
            ? 'Search commands by component, package or workflow.'
            : isMobileScenario
              ? 'Short mobile hint keeps the dialog readable.'
              : state.hint
      const tone = isEmptyScenario ? 'warning' : isKeyboardScenario ? 'success' : state.tone

      return sfc("import { YTag } from '@yok-ui/core'\nimport { YCommandPalette } from '@yok-ui/product'", [
        '<div class="demo-stack">',
        `  <YTag${textAttribute('tone', tone)}>${escapeAttribute(hint)}</YTag>`,
        `  <YCommandPalette${booleanAttribute('open', state.open || isKeyboardScenario || isEmptyScenario)}${isEmptyScenario ? ' :commands="[]"' : ''} />`,
        '</div>'
      ])
    }
  },
  codeBlock: {
    title: 'Code Block scenario',
    description: '调试导入代码、复制安装、空代码、移动代码和键盘复制路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'import', options: [
        { label: '导入代码', value: 'import' },
        { label: '复制安装', value: 'copy' },
        { label: '空代码', value: 'empty' },
        { label: '移动代码', value: 'mobile' },
        { label: '键盘复制', value: 'keyboard' }
      ] },
      { key: 'language', label: '语言', type: 'select', defaultValue: 'ts', options: [
        { label: 'TypeScript', value: 'ts' },
        { label: 'Vue', value: 'vue' },
        { label: 'Shell', value: 'sh' }
      ] },
      { key: 'snippet', label: '片段', type: 'select', defaultValue: 'button', options: [
        { label: 'Button import', value: 'button' },
        { label: 'Theme install', value: 'theme' },
        { label: 'Package command', value: 'install' }
      ] },
      { key: 'showCopy', label: '复制按钮', type: 'boolean', defaultValue: true },
      { key: 'copyText', label: '复制内容', type: 'text', defaultValue: 'pnpm add @yok-ui/core' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isCopyScenario = scenario === 'copy'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const snippets = {
        button: "import { YButton } from '@yok-ui/core'\\n\\nexport const ready = true",
        theme: "import '@yok-ui/themes/yok-light.css'\\nimport '@yok-ui/core/style.css'",
        install: 'pnpm add @yok-ui/core @yok-ui/themes',
        mobile: "import { YDataTable, YPagination } from '@yok-ui/core'\\n\\nconst columns = ['name', 'status', 'owner', 'updatedAt']",
        keyboard: "import { YCodeBlock, YCopyButton } from '@yok-ui/product'\\n\\n// Keyboard copy path keeps code readable and actions reachable."
      }
      const snippet = isEmptyScenario
        ? ''
        : isMobileScenario
          ? snippets.mobile
          : isKeyboardScenario
            ? snippets.keyboard
            : isCopyScenario
              ? snippets.install
              : snippets[String(state.snippet) as keyof typeof snippets] ?? snippets.button
      const language = isCopyScenario ? 'sh' : isMobileScenario || isKeyboardScenario ? 'ts' : state.language
      const copyText = isKeyboardScenario ? 'Keyboard copy path' : isEmptyScenario ? 'No snippet selected' : state.copyText

      return sfc("import { YCodeBlock, YCopyButton } from '@yok-ui/product'", [
        '<div class="demo-stack">',
        `  <YCodeBlock${textAttribute('language', language)}${textAttribute('code', snippet)} />`,
        isEmptyScenario ? '  <p>No snippet selected</p>' : '',
        state.showCopy || isCopyScenario || isKeyboardScenario ? `  <YCopyButton${textAttribute('text', copyText)} />` : '',
        isKeyboardScenario ? '  <p>Tab reaches the copy action after the scrollable code region.</p>' : '',
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  pageHeader: {
    title: 'Page Header scenario',
    description: '调试库存页头、带操作、无状态、移动和键盘页头场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'inventory', options: [
        { label: '库存页头', value: 'inventory' },
        { label: '带操作', value: 'actions' },
        { label: '无状态', value: 'empty' },
        { label: '移动页头', value: 'mobile' },
        { label: '键盘页头', value: 'keyboard' }
      ] },
      { key: 'eyebrow', label: '上级标签', type: 'text', defaultValue: 'Admin' },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component inventory' },
      { key: 'status', label: '状态', type: 'text', defaultValue: 'Live' },
      { key: 'headingLevel', label: '标题层级', type: 'select', defaultValue: '1', options: [
        { label: 'H1', value: '1' },
        { label: 'H2', value: '2' },
        { label: 'H3', value: '3' }
      ] },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Track status, owners and release readiness across the package family.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isActionScenario = scenario === 'actions'
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const title = isKeyboardScenario
        ? 'Keyboard page header'
        : isMobileScenario
          ? 'Mobile inventory'
          : isEmptyScenario
            ? 'No status badge'
            : state.title
      const description = isKeyboardScenario
        ? 'Title content stays static while actions receive keyboard focus.'
        : isMobileScenario
          ? 'Compact copy keeps current page content visible first.'
          : state.description
      const status = isEmptyScenario ? '' : isMobileScenario ? 'Mobile' : state.status
      const headingLevel = isMobileScenario ? '2' : state.headingLevel
      const imports = isActionScenario || isKeyboardScenario
        ? "import { YButton } from '@yok-ui/core'\nimport { YPageHeader } from '@yok-ui/admin'"
        : "import { YPageHeader } from '@yok-ui/admin'"

      if (isActionScenario || isKeyboardScenario) {
        return sfc(imports, [
          `<YPageHeader${textAttribute('eyebrow', state.eyebrow)}${textAttribute('title', title)}${textAttribute('status', status)}${textAttribute('description', description)}${numericBinding('heading-level', headingLevel)}>`,
          '  <template #actions>',
          `    <YButton variant="${isKeyboardScenario ? 'secondary' : 'primary'}">${isKeyboardScenario ? 'Focus action' : 'Create component'}</YButton>`,
          '  </template>',
          '</YPageHeader>'
        ])
      }

      return sfc(imports, [
        `<YPageHeader${textAttribute('eyebrow', state.eyebrow)}${textAttribute('title', title)}${status ? textAttribute('status', status) : ''}${textAttribute('description', description)}${numericBinding('heading-level', headingLevel)} />`
      ])
    }
  },
  filterTabs: {
    title: 'Filter Tabs scenario',
    description: '调试状态筛选、复核筛选、空筛选、移动和键盘筛选场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'stable', options: [
        { label: '状态筛选', value: 'stable' },
        { label: '复核筛选', value: 'review' },
        { label: '空筛选', value: 'empty' },
        { label: '移动筛选', value: 'mobile' },
        { label: '键盘筛选', value: 'keyboard' }
      ] },
      { key: 'modelValue', label: '当前筛选', type: 'select', defaultValue: 'stable', options: [
        { label: 'All', value: 'all' },
        { label: 'Stable', value: 'stable' },
        { label: 'Beta', value: 'beta' },
        { label: 'Needs review', value: 'review' }
      ] },
      { key: 'ariaLabel', label: '可访问名称', type: 'text', defaultValue: 'Component status filters' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isEmptyScenario = scenario === 'empty'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const modelValue = scenario === 'review' ? 'review' : isEmptyScenario ? '' : state.modelValue
      const ariaLabel = isKeyboardScenario
        ? 'Keyboard status filters'
        : isMobileScenario
          ? 'Mobile filters'
          : state.ariaLabel
      const helper = isKeyboardScenario
        ? 'Arrow keys move through tabs while Home and End jump to edges.'
        : isEmptyScenario
          ? 'No filters available'
          : ''

      const filterTabItems = isEmptyScenario ? [] : fallbackFilterTabs
      const imports = [
        `import { ref } from 'vue'`,
        `import { YTag } from '@yok-ui/core'`,
        `import { YFilterTabs } from '@yok-ui/admin'`,
        ``,
        `const filterTabValue = ref('${modelValue}')`,
        `const filterTabItems = ${JSON.stringify(filterTabItems, null, 2)}`
      ].join('\n')

      return sfc(imports, [
        '<div class="demo-stack">',
        `  <YFilterTabs :model-value="filterTabValue" :items="${isEmptyScenario ? '[]' : 'filterTabItems'}"${textAttribute('aria-label', ariaLabel)} />`,
        helper ? `  <YTag tone="${isEmptyScenario ? 'warning' : 'info'}">${helper}</YTag>` : '',
        '</div>'
      ].filter(Boolean))
    }
  },
  approvalCommentBox: {
    title: 'Approval Comment Box scenario',
    description: '用审批结论、评论输入、建议标签、附件、校验和键盘路径调试审核评论框。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '审批评论', value: 'default' },
        { label: '必填校验', value: 'required' },
        { label: '提交中', value: 'loading' },
        { label: '移动评论', value: 'mobile' },
        { label: '键盘评论', value: 'keyboard' }
      ] },
      { key: 'decision', label: '结论', type: 'select', defaultValue: 'requestChanges', options: [
        { label: 'Approve', value: 'approve' },
        { label: 'Request changes', value: 'requestChanges' },
        { label: 'Reject', value: 'reject' }
      ] },
      { key: 'comment', label: '评论', type: 'text', defaultValue: 'Please add keyboard notes before release.' },
      { key: 'maxLength', label: '最大长度', type: 'number', defaultValue: 160, min: 80, max: 500, step: 20 }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const comment = scenario === 'required' ? '' : scenario === 'keyboard' ? 'Keyboard path verified; API table still needs one event row.' : String(state.comment)
      const decision = scenario === 'keyboard' ? 'requestChanges' : String(state.decision)
      const helper = scenario === 'required'
        ? 'Submitting an empty required comment emits invalid and shows an error.'
        : scenario === 'loading'
          ? 'Loading state disables editing and submit while keeping cancel available.'
        : scenario === 'keyboard'
          ? 'Tab reaches decision buttons, textarea, suggestions, submit and cancel.'
          : scenario === 'mobile'
            ? 'Compact approval comment keeps reviewer metadata and actions readable.'
            : ''
      const suggestions = [
        { label: '补充键盘说明', value: 'keyboard' },
        { label: '补充 API 表', value: 'api' },
        { label: '需要视觉复核', value: 'visual', tone: 'warning' }
      ]
      const attachments = scenario === 'mobile'
        ? []
        : [{ name: 'audit-notes.md', url: '/audit-notes.md', size: '12 KB' }]
      const imports = [
        `import { ref } from 'vue'`,
        `import { YTag } from '@yok-ui/core'`,
        `import { YApprovalCommentBox } from '@yok-ui/admin'`,
        ``,
        `const approvalComment = ref('${comment}')`,
        `const approvalDecision = ref('${decision}')`,
        `const selectedApprovalSuggestions = ref(${JSON.stringify(scenario === 'required' ? [] : ['keyboard'], null, 2)})`,
        `const approvalSuggestions = ${JSON.stringify(suggestions, null, 2)}`,
        `const approvalAttachments = ${JSON.stringify(attachments, null, 2)}`
      ].join('\n')

      return sfc(imports, [
        '<div class="demo-stack">',
        `  <YApprovalCommentBox v-model="approvalComment" v-model:decision="approvalDecision" v-model:selected-suggestions="selectedApprovalSuggestions" :suggestions="approvalSuggestions" :attachments="approvalAttachments" title="${scenario === 'keyboard' ? 'Keyboard review comment' : 'Release review'}" reviewer="Yok" target="YDataTable" :max-length="${Number(state.maxLength)}"${scenario === 'required' ? ' required' : ''}${scenario === 'loading' ? ' loading' : ''} />`,
        helper ? `  <YTag tone="${scenario === 'required' ? 'warning' : 'info'}">${helper}</YTag>` : '',
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  bulkActionBar: {
    title: 'Bulk Action Bar scenario',
    description: '用已选择、多选、空选择、移动和键盘路径调试批量操作栏。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'selected', options: [
        { label: '三项选择', value: 'selected' },
        { label: '多项批量', value: 'many' },
        { label: '分组菜单', value: 'menu' },
        { label: '空选择', value: 'empty' },
        { label: '移动批量', value: 'mobile' },
        { label: '键盘批量', value: 'keyboard' }
      ] },
      { key: 'selection', label: '选择项', type: 'select', defaultValue: 'button,data-table,theme', options: [
        { label: '3 selected', value: 'button,data-table,theme' },
        { label: '6 selected', value: 'button,data-table,theme,select,table,form' },
        { label: '1 selected', value: 'button' },
        { label: 'None', value: '' }
      ] },
      { key: 'title', label: '摘要', type: 'text', defaultValue: '3 components selected' },
      { key: 'clearText', label: '清空文案', type: 'text', defaultValue: 'Clear selection' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const selection = scenario === 'empty'
        ? ''
        : scenario === 'many'
          ? 'button,data-table,theme,select,table,form'
          : scenario === 'menu'
            ? 'button,data-table,theme'
          : scenario === 'mobile'
            ? 'button'
            : state.selection
      const title = scenario === 'empty'
        ? 'No rows selected'
        : scenario === 'keyboard'
          ? 'Keyboard bulk action bar'
          : scenario === 'mobile'
            ? '1 selected'
            : scenario === 'many'
              ? '6 components selected'
              : state.title
      const hint = scenario === 'keyboard'
        ? 'Tab reaches Publish, Assign owner, Archive and Clear selection.'
        : scenario === 'menu'
          ? 'Grouped menu actions include a second click for dangerous operations.'
        : scenario === 'empty'
          ? 'No rows selected'
          : scenario === 'mobile'
            ? 'Mobile bulk bar keeps the clear action reachable.'
            : ''

      const bulkSelectedRowKeys = selection
        ? selection.split(',').map((item) => item.trim()).filter(Boolean)
        : []
      const imports = [
        `import { ref } from 'vue'`,
        `import { YTag } from '@yok-ui/core'`,
        `import { ${scenario === 'menu' ? 'YBulkActionMenu' : 'YBulkActionBar'} } from '@yok-ui/admin'`,
        ``,
        `const bulkSelectedRowKeys = ref(${JSON.stringify(bulkSelectedRowKeys, null, 2)})`,
        `const bulkActions = ${JSON.stringify(
          scenario === 'menu'
            ? [
                { label: 'Publish', value: 'publish', group: 'Workflow', tone: 'success', description: 'Move selected components to stable.' },
                { label: 'Assign owner', value: 'assign', group: 'Workflow', tone: 'info' },
                { label: 'Export CSV', value: 'export', group: 'Export' },
                { label: 'Delete', value: 'delete', group: 'Danger zone', tone: 'danger', requiresConfirm: true, confirmText: 'Confirm delete' }
              ]
            : fallbackBulkActions,
          null,
          2
        )}`
      ].join('\n')

      return sfc(imports, [
        '<div class="demo-stack">',
        scenario === 'menu'
          ? `  <YBulkActionMenu :selected-row-keys="bulkSelectedRowKeys" :actions="bulkActions" label="More batch actions"${textAttribute('clear-text', state.clearText)} />`
          : `  <YBulkActionBar :selected-row-keys="bulkSelectedRowKeys" :actions="bulkActions"${textAttribute('title', title)}${textAttribute('clear-text', scenario === 'mobile' ? 'Clear' : state.clearText)} />`,
        hint ? `  <YTag tone="${scenario === 'empty' ? 'warning' : 'info'}">${hint}</YTag>` : '',
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  dataToolbar: {
    title: 'Data Toolbar scenario',
    description: '用默认、带操作、无操作、移动和键盘路径调试数据工具栏。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '数据工具栏', value: 'default' },
        { label: '带操作', value: 'actions' },
        { label: '无操作', value: 'empty' },
        { label: '移动工具栏', value: 'mobile' },
        { label: '键盘工具栏', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component queue' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Shared toolbar for data-heavy admin surfaces.' },
      { key: 'count', label: '数量', type: 'range', defaultValue: 73, min: 0, max: 120, step: 1 },
      { key: 'showActions', label: '显示操作', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const showActions = scenario === 'empty' ? false : Boolean(state.showActions) || scenario === 'actions' || scenario === 'keyboard'
      const title = scenario === 'keyboard'
        ? 'Keyboard data toolbar'
        : scenario === 'mobile'
          ? 'Mobile queue'
          : scenario === 'empty'
            ? 'Readonly queue'
            : state.title
      const description = scenario === 'keyboard'
        ? 'Create and export actions follow the toolbar copy in tab order.'
        : scenario === 'empty'
          ? 'No toolbar actions'
          : scenario === 'mobile'
            ? 'Short copy keeps the toolbar compact on narrow screens.'
            : state.description
      const hint = scenario === 'keyboard'
        ? 'Keyboard data toolbar keeps Create component and Export CSV reachable after the title.'
        : scenario === 'empty'
          ? 'No toolbar actions'
          : ''

      const imports = [
        `import { YButton, YTag } from '@yok-ui/core'`,
        `import { YDataToolbar } from '@yok-ui/admin'`,
        ``,
        `const dataToolbarCount = ${scenario === 'empty' ? 0 : state.count}`
      ].join('\n')

      return sfc(imports, [
        '<div class="demo-stack">',
        `  <YDataToolbar${textAttribute('title', title)}${textAttribute('description', description)} :count="dataToolbarCount">`,
        showActions ? '    <YButton variant="primary">Create component</YButton>' : '',
        showActions ? '    <YButton variant="secondary">Export CSV</YButton>' : '',
        '  </YDataToolbar>',
        hint ? `  <YTag tone="${scenario === 'empty' ? 'warning' : 'info'}">${hint}</YTag>` : '',
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  savedViews: {
    title: 'Saved Views scenario',
    description: '用默认、受控、管理、空态、移动和键盘路径调试保存视图。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '保存视图', value: 'default' },
        { label: '受控视图', value: 'controlled' },
        { label: '管理视图', value: 'manager' },
        { label: '空视图', value: 'empty' },
        { label: '移动视图', value: 'mobile' },
        { label: '键盘视图', value: 'keyboard' }
      ] },
      { key: 'modelValue', label: '当前视图', type: 'select', defaultValue: 'mine', options: [
        { label: 'Mine', value: 'mine' },
        { label: 'Live coverage', value: 'live' },
        { label: 'Needs review', value: 'review' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component views' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Pinned filters for repeated documentation work.' },
      { key: 'createText', label: '创建文案', type: 'text', defaultValue: 'Create view' },
      { key: 'saveText', label: '保存文案', type: 'text', defaultValue: 'Save current' },
      { key: 'manageText', label: '管理文案', type: 'text', defaultValue: 'Manage views' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isEmptyScenario = scenario === 'empty'
      const isManagerScenario = scenario === 'manager'
      const modelValue = scenario === 'controlled' || scenario === 'keyboard' ? 'live' : isEmptyScenario ? '' : state.modelValue
      const title = scenario === 'keyboard'
        ? 'Keyboard saved views'
        : isManagerScenario
          ? 'Manage saved views'
        : scenario === 'mobile'
          ? 'Mobile views'
          : state.title
      const description = scenario === 'keyboard'
        ? 'Save, create and manage controls stay reachable after view buttons.'
        : isManagerScenario
          ? 'Rename, pin, duplicate, delete and choose a default table view.'
        : isEmptyScenario
          ? 'Create the first reusable view for this table.'
          : scenario === 'mobile'
            ? 'Compact saved views for narrow admin surfaces.'
            : state.description
      const helper = scenario === 'keyboard'
        ? 'Save, create and manage controls stay reachable after view buttons.'
        : isEmptyScenario
          ? 'No saved views yet'
          : ''

      const savedViewItems = isEmptyScenario ? [] : fallbackSavedViews
      const imports = [
        `import { ref } from 'vue'`,
        `import { YTag } from '@yok-ui/core'`,
        `import { ${isManagerScenario ? 'YSavedViewManager' : 'YSavedViews'} } from '@yok-ui/admin'`,
        ``,
        `const savedViewModel = ref('${modelValue}')`,
        ...(isManagerScenario ? [`const defaultSavedView = ref('live')`] : []),
        `const savedViewItems = ${isManagerScenario ? `ref(${JSON.stringify(savedViewItems, null, 2)})` : JSON.stringify(savedViewItems, null, 2)}`
      ].join('\n')

      return sfc(imports, [
        '<div class="demo-stack">',
        isManagerScenario
        ? `  <YSavedViewManager v-model="savedViewModel" v-model:default-value="defaultSavedView" v-model:items="savedViewItems"${textAttribute('title', title)}${textAttribute('description', description)} />`
          : `  <YSavedViews :model-value="savedViewModel" :items="${isEmptyScenario ? '[]' : 'savedViewItems'}"${textAttribute('title', title)}${textAttribute('description', description)}${textAttribute('create-text', scenario === 'mobile' ? 'New' : state.createText)}${textAttribute('save-text', scenario === 'mobile' ? 'Save' : state.saveText)}${textAttribute('manage-text', scenario === 'mobile' ? 'Manage' : state.manageText)}${isEmptyScenario ? ' empty-text="No saved views yet"' : ''} />`,
        helper ? `  <YTag tone="${isEmptyScenario ? 'warning' : 'info'}">${helper}</YTag>` : '',
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  dataView: {
    title: 'Data View scenario',
    description: '用保存视图、表格偏好、筛选摘要和响应式布局调试后台列表页组合视图。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'beta', options: [
        { label: '默认工作台', value: 'beta' },
        { label: '稳定视图', value: 'stable' },
        { label: '筛选偏好', value: 'filtered' },
        { label: '移动视图', value: 'mobile' },
        { label: '键盘巡航', value: 'keyboard' },
        { label: '空视图', value: 'empty' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component review workspace' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Switch saved views and persist table preferences in one admin surface.' },
      { key: 'pageSize', label: '每页数量', type: 'range', defaultValue: 3, min: 2, max: 6, step: 1 },
      { key: 'resizable', label: '列宽拖拽', type: 'boolean', defaultValue: true },
      { key: 'selectable', label: '行选择', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const isEmptyScenario = scenario === 'empty'
      const tableTitle = isEmptyScenario ? 'No matching components' : isMobileScenario ? 'Mobile component queue' : 'Component queue'
      const description = scenario === 'stable'
        ? 'Stable saved view applies its own column order, column widths and filters.'
        : scenario === 'filtered'
          ? 'Saved filters keep repeated release review work one click away.'
          : isKeyboardScenario
            ? 'Use Tab to move through saved views, table settings, density controls, filters and pagination.'
          : isEmptyScenario
            ? 'No components matched this saved view; keep table tools and filter recovery visible.'
          : isMobileScenario
            ? 'Single-column responsive layout keeps saved views and table controls usable.'
            : state.description

      const dataViewRows = isEmptyScenario ? [] : fallbackAdminRows
      const imports = [
        "import { YDataView } from '@yok-ui/admin'",
        '',
        `const dataViewViews = ${JSON.stringify(fallbackDataViewViews, null, 2)}`,
        `const dataViewColumns = ${JSON.stringify(fallbackAdminColumns, null, 2)}`,
        `const dataViewRows = ${JSON.stringify(dataViewRows, null, 2)}`
      ].join('\n')

      return sfc(imports, [
        `<YDataView${textAttribute('title', isEmptyScenario ? 'Empty review workspace' : isMobileScenario ? 'Mobile review workspace' : isKeyboardScenario ? 'Keyboard review workspace' : state.title)}${textAttribute('description', description)} saved-views-title="Saved table views" saved-views-description="Reusable review scopes."${textAttribute('table-title', tableTitle)} table-description="Rows, filters, density and column preferences share the active view." :views="dataViewViews" :columns="dataViewColumns" :data="dataViewRows"${textAttribute('default-view', isKeyboardScenario ? 'stable' : scenario)} pagination${numericBinding('page-size', isMobileScenario ? 2 : state.pageSize)}${booleanAttribute('selectable', state.selectable || isKeyboardScenario)} show-filter-summary show-density-settings show-column-settings reorderable-columns${booleanAttribute('resizable', state.resizable)}${isEmptyScenario ? ' empty-text="No components matched this saved view"' : ''} />`
      ])
    }
  },
  resourcePage: {
    title: 'Resource Page scenario',
    description: '调试后台资源页的搜索、保存视图、数据表、详情抽屉、移动布局和键盘路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '资源页骨架', value: 'default' },
        { label: '详情抽屉', value: 'detail' },
        { label: '筛选工作流', value: 'filtered' },
        { label: '移动资源页', value: 'mobile' },
        { label: '键盘巡航', value: 'keyboard' },
        { label: '空资源页', value: 'empty' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component resources' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Search, review and maintain component records.' },
      { key: 'density', label: '密度', type: 'select', defaultValue: 'comfortable', options: [
        { label: 'Comfortable', value: 'comfortable' },
        { label: 'Compact', value: 'compact' }
      ] },
      { key: 'pageSize', label: '每页数量', type: 'range', defaultValue: 3, min: 2, max: 6, step: 1 },
      { key: 'selectable', label: '行选择', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isDetailScenario = scenario === 'detail'
      const isFilteredScenario = scenario === 'filtered'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const isEmptyScenario = scenario === 'empty'
      const density = isMobileScenario || isKeyboardScenario ? 'compact' : String(state.density)
      const defaultView = isFilteredScenario ? 'filtered' : isKeyboardScenario || isDetailScenario ? 'stable' : isEmptyScenario ? 'empty' : 'beta'
      const title = isEmptyScenario
        ? 'Empty component resources'
        : isMobileScenario
          ? 'Mobile component resources'
          : isKeyboardScenario
            ? 'Keyboard component resources'
            : state.title
      const description = isEmptyScenario
        ? 'No component resources matched the current filters; keep search and saved views available.'
        : isFilteredScenario
          ? 'Search form, saved views and table filter chips describe the same resource scope.'
          : isDetailScenario
            ? 'Open a detail drawer while the resource table keeps its current saved view.'
            : isKeyboardScenario
              ? 'Use Tab through actions, filters, saved views, table settings, pagination and drawer close.'
              : state.description

      const resourceSearchModel = isEmptyScenario
        ? { keyword: 'missing', status: '', package: 'admin' }
        : isFilteredScenario
          ? { keyword: 'table', status: 'beta', package: 'admin' }
          : { ...fallbackSearchModel }
      const resourceRows = isEmptyScenario ? [] : fallbackAdminRows
      const imports = [
        `import { ref } from 'vue'`,
        `import { YButton } from '@yok-ui/core'`,
        `import { YResourcePage } from '@yok-ui/admin'`,
        ``,
        `const resourceSearchModel = ref(${JSON.stringify(resourceSearchModel, null, 2)})`,
        `const resourceSearchFields = ${JSON.stringify(fallbackSearchFields, null, 2)}`,
        `const resourceViews = ${JSON.stringify(fallbackDataViewViews, null, 2)}`,
        `const resourceColumns = ${JSON.stringify(fallbackAdminColumns, null, 2)}`,
        `const resourceRows = ${JSON.stringify(resourceRows, null, 2)}`
      ].join('\n')

      return sfc(imports, [
      `<YResourcePage${textAttribute('title', title)}${textAttribute('description', description)} eyebrow="Admin" status="Live"${textAttribute('density', density)} search-title="Resource filters" search-description="Search model, saved views and table preferences stay aligned." :search-model="resourceSearchModel" :search-fields="resourceSearchFields" saved-views-title="Saved table views" table-title="${isEmptyScenario ? 'No matching resources' : 'Component queue'}" :views="resourceViews" :columns="resourceColumns" :data="resourceRows"${textAttribute('default-view', defaultView)} pagination${numericBinding('page-size', isMobileScenario ? 2 : state.pageSize)}${booleanAttribute('selectable', state.selectable || isKeyboardScenario)} show-filter-summary show-density-settings show-column-settings reorderable-columns${isEmptyScenario ? ' empty-text="No component resources matched"' : ''}${isDetailScenario || isKeyboardScenario ? ' detail-open detail-title="Component detail" detail-description="Review selected component metadata."' : ''}>`,
      '  <template #actions>',
      '    <YButton variant="primary">Create component</YButton>',
      '  </template>',
      '  <template #toolbar>',
      '    <YButton variant="secondary">Export CSV</YButton>',
      '  </template>',
      '  <template #aside>',
      '    <section aria-label="Release summary">Release summary: 4 resources tracked.</section>',
      '  </template>',
      isDetailScenario || isKeyboardScenario ? '  <template #detail><p>YDataView detail body</p></template>' : '',
      isDetailScenario || isKeyboardScenario ? '  <template #detailFooter><YButton variant="primary">Approve</YButton></template>' : '',
      '</YResourcePage>'
    ].filter((line): line is string => Boolean(line)))
    }
  },
  schemaForm: {
    title: 'Schema Form scenario',
    description: '调试配置化表单的字段 schema、校验摘要、条件显隐、移动布局和键盘路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '基础表单', value: 'default' },
        { label: '校验摘要', value: 'validation' },
        { label: '条件字段', value: 'conditional' },
        { label: '动态列表', value: 'array' },
        { label: '移动表单', value: 'mobile' },
        { label: '键盘巡航', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component profile' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Schema-driven form with validation summary.' },
      { key: 'density', label: '密度', type: 'select', defaultValue: 'comfortable', options: [
        { label: 'Comfortable', value: 'comfortable' },
        { label: 'Compact', value: 'compact' }
      ] },
      { key: 'showSummary', label: '错误摘要', type: 'boolean', defaultValue: true },
      { key: 'scrollToError', label: '错误滚动', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isValidationScenario = scenario === 'validation'
      const isConditionalScenario = scenario === 'conditional'
      const isArrayScenario = scenario === 'array'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const density = isMobileScenario || isKeyboardScenario ? 'compact' : String(state.density)
      const model = isValidationScenario
        ? {
            name: '',
            package: '',
            description: '',
            stable: false,
            category: 'core',
            customReason: ''
          }
        : isConditionalScenario
          ? {
              name: 'Custom workflow',
              package: 'admin',
              description: 'Shows custom reason when category is custom.',
              stable: false,
              category: 'custom',
              customReason: ''
            }
          : isArrayScenario
            ? {
                name: 'Review workflow',
                package: 'admin',
                description: 'Schema form with reviewer array fields.',
                stable: true,
                reviewers: [
                  { id: 'ada', name: 'Ada Chen', role: 'Design review' },
                  { id: 'lin', name: 'Lin Zhou', role: 'Accessibility' }
                ]
              }
            : {
                name: 'Yok Button',
                package: 'core',
                description: 'Reusable component documented with API and examples.',
                stable: true,
                category: 'core'
              }
      const baseFields = [
        `  { key: 'name', label: 'Component name', placeholder: 'Button', required: true, helper: 'Name shown in docs navigation and package exports.' },`,
        `  { key: 'package', label: 'Package', type: 'select', options: packageOptions, required: true },`,
        `  { key: 'description', label: 'Description', type: 'textarea', rows: 3 },`,
        `  { key: 'stable', label: 'Stable release', type: 'switch', helper: 'Enable after examples, API and accessibility notes are complete.' },`
      ]
      const conditionalFields = isConditionalScenario
        ? [
            `  { key: 'category', label: 'Category', type: 'select', options: categoryOptions, required: true },`,
            `  { key: 'customReason', label: 'Custom reason', type: 'textarea', rows: 2, required: true, visibleWhen: (model: Record<string, unknown>) => model.category === 'custom' },`
          ]
        : []
      const arrayFields = isArrayScenario
        ? [
            `  {`,
            `    key: 'reviewers',`,
            `    label: 'Reviewers',`,
            `    type: 'array',`,
            `    itemKey: 'id',`,
            `    addText: 'Add reviewer',`,
            `    removeText: 'Remove reviewer',`,
            `    itemLabel: 'Reviewer',`,
            `    defaultItem: { id: 'new-reviewer', name: '', role: '' },`,
            `    itemFields: [`,
            `      { key: 'name', label: 'Name', required: true },`,
            `      { key: 'role', label: 'Role', required: true }`,
            `    ]`,
            `  },`
          ]
        : []
      const script = [
        `import { ref } from 'vue'`,
        `import { YSchemaForm } from '@yok-ui/admin'`,
        ``,
        `const schemaFormModel = ref(${JSON.stringify(model, null, 2)})`,
        `const packageOptions = [`,
        `  { label: 'Core primitives', value: 'core' },`,
        `  { label: 'Product tools', value: 'product' },`,
        `  { label: 'Admin workflow', value: 'admin' }`,
        `]`,
        `const categoryOptions = [`,
        `  { label: 'Core', value: 'core' },`,
        `  { label: 'Admin', value: 'admin' },`,
        `  { label: 'Custom', value: 'custom' }`,
        `]`,
        ``,
        `const schemaFormSchema = [`,
        ...baseFields,
        ...conditionalFields,
        ...arrayFields,
        `]`
      ].join('\n')

      return sfc(script, [
        `<YSchemaForm :model-value="schemaFormModel" :schema="schemaFormSchema"${textAttribute('title', isMobileScenario ? 'Mobile component profile' : isKeyboardScenario ? 'Keyboard component profile' : isArrayScenario ? 'Review workflow profile' : state.title)}${textAttribute('description', isValidationScenario ? 'Submit invalid values to review the clickable summary and field errors.' : isConditionalScenario ? 'Selecting custom category reveals a required reason field.' : isArrayScenario ? 'Use an array field for reviewers, approvers or repeatable resource contacts.' : state.description)}${textAttribute('density', density)} submit-text="Save profile" reset-text="Restore" summary-title="Fix component profile"${booleanAttribute('scroll-to-error', Boolean(state.scrollToError) || isValidationScenario || isKeyboardScenario)}${state.showSummary ? '' : ' show-summary="false"'} />`
      ])
    }
  },
  fieldArray: {
    title: 'Field Array scenario',
    description: '调试动态字段数组的新增、删除、数量约束、空态、移动布局和键盘路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '成员列表', value: 'default' },
        { label: '空态添加', value: 'empty' },
        { label: '数量限制', value: 'limited' },
        { label: '只读维护', value: 'readonly' },
        { label: '移动布局', value: 'mobile' },
        { label: '键盘巡航', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Reviewers' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'People who need to approve this component.' },
      { key: 'min', label: '最少项', type: 'range', defaultValue: 0, min: 0, max: 3, step: 1 },
      { key: 'max', label: '最多项', type: 'range', defaultValue: 4, min: 1, max: 6, step: 1 },
      { key: 'disabled', label: '禁用操作', type: 'boolean', defaultValue: false }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isEmptyScenario = scenario === 'empty'
      const isLimitedScenario = scenario === 'limited'
      const isReadonlyScenario = scenario === 'readonly'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const fieldArrayItems = isEmptyScenario ? [] : fallbackFieldArrayItems
      const min = isLimitedScenario ? 2 : Number(state.min)
      const max = isLimitedScenario ? 2 : Number(state.max)
      const imports = [
        `import { ref } from 'vue'`,
        `import { YFieldArray } from '@yok-ui/admin'`,
        ``,
        `const fieldArrayItems = ref(${JSON.stringify(fieldArrayItems, null, 2)})`,
        `const fieldArrayDefaultItem = ${JSON.stringify(fallbackFieldArrayItem, null, 2)}`
      ].join('\n')

      return sfc(imports, [
        `<YFieldArray :model-value="fieldArrayItems" :default-item="fieldArrayDefaultItem"${textAttribute('title', isMobileScenario ? 'Mobile reviewers' : isKeyboardScenario ? 'Keyboard reviewers' : isReadonlyScenario ? 'Readonly reviewers' : state.title)}${textAttribute('description', isEmptyScenario ? 'Start with an empty reviewer list and add the first item.' : isLimitedScenario ? 'The current item count has reached the configured maximum.' : isReadonlyScenario ? 'Readonly review groups preserve values while disabling add and remove actions.' : state.description)} item-key="id" add-text="Add reviewer" remove-text="Remove reviewer" item-label="Reviewer" empty-text="No reviewers yet"${numericBinding('min', min)}${numericBinding('max', max)}${booleanAttribute('disabled', Boolean(state.disabled) || isReadonlyScenario)} />`
      ])
    }
  },
  searchPanel: {
    title: 'Search Panel scenario',
    description: '用基础筛选、已筛选、空筛选、移动和键盘路径调试搜索面板。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '基础筛选', value: 'default' },
        { label: '已筛选', value: 'filtered' },
        { label: '空筛选', value: 'empty' },
        { label: '移动筛选', value: 'mobile' },
        { label: '键盘筛选', value: 'keyboard' }
      ] },
      { key: 'submitText', label: '提交文案', type: 'text', defaultValue: 'Apply filters' },
      { key: 'resetText', label: '重置文案', type: 'text', defaultValue: 'Clear filters' },
      { key: 'keyword', label: '关键词', type: 'text', defaultValue: 'button' },
      { key: 'status', label: '状态', type: 'select', defaultValue: 'stable', options: [
        { label: 'Stable', value: 'stable' },
        { label: 'Beta', value: 'beta' },
        { label: 'Planned', value: 'planned' }
      ] }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isEmptyScenario = scenario === 'empty'
      const isKeyboardScenario = scenario === 'keyboard'
      const searchPanelModel = isEmptyScenario
        ? {}
        : {
            keyword: isKeyboardScenario ? 'keyboard' : scenario === 'mobile' ? 'input' : String(state.keyword),
            status: isKeyboardScenario ? 'stable' : scenario === 'mobile' ? 'beta' : scenario === 'filtered' ? 'beta' : String(state.status)
          }
      const submitText = scenario === 'mobile' ? 'Apply' : state.submitText
      const resetText = scenario === 'mobile' ? 'Clear' : state.resetText
      const hint = isKeyboardScenario
        ? 'Keyboard search panel. Apply filters and Clear filters stay after the fields in tab order.'
        : isEmptyScenario
          ? 'No filters applied'
          : ''
      const imports = [
        `import { ref } from 'vue'`,
        `import { YTag } from '@yok-ui/core'`,
        `import { YSearchPanel } from '@yok-ui/admin'`,
        ``,
        `const searchPanelModel = ref(${JSON.stringify(searchPanelModel, null, 2)})`,
        `const searchPanelFields = ${JSON.stringify(fallbackSearchFields, null, 2)}`
      ].join('\n')

      return sfc(imports, [
        '<div class="demo-stack">',
        `  <YSearchPanel :model-value="searchPanelModel" :fields="searchPanelFields"${textAttribute('submit-text', submitText)}${textAttribute('reset-text', resetText)} />`,
        hint ? `  <YTag tone="${isEmptyScenario ? 'warning' : 'info'}">${hint}</YTag>` : '',
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  themeSwitcher: {
    title: 'Theme Switcher scenario',
    description: '调试明亮主题、清爽主题、对比复核、移动和键盘主题切换场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'light', options: [
        { label: '明亮主题', value: 'light' },
        { label: '清爽主题', value: 'clean' },
        { label: '对比复核', value: 'review' },
        { label: '移动主题', value: 'mobile' },
        { label: '键盘主题', value: 'keyboard' }
      ] },
      { key: 'modelValue', label: '当前主题', type: 'select', defaultValue: 'yok-light', options: [
        { label: 'Light', value: 'yok-light' },
        { label: 'Clean', value: 'yok-clean' },
        { label: 'Candy', value: 'yok-candy' }
      ] },
      { key: 'caption', label: '说明', type: 'text', defaultValue: 'Theme choices use the shared Yok UI token package.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isCleanScenario = scenario === 'clean'
      const isReviewScenario = scenario === 'review'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const modelValue = isCleanScenario || isReviewScenario ? 'yok-clean' : isMobileScenario ? 'yok-candy' : state.modelValue
      const caption = isKeyboardScenario
        ? 'Keyboard theme switcher. Each theme option is a pressed button in the keyboard path.'
        : isReviewScenario
          ? 'Theme contrast needs review before publishing.'
          : isMobileScenario
            ? 'Compact settings surfaces keep theme choices reachable.'
            : state.caption
      const tone = isReviewScenario ? 'danger' : isCleanScenario ? 'success' : 'info'

      return sfc("import { YTag } from '@yok-ui/core'\nimport { YThemeSwitcher } from '@yok-ui/product'", [
        '<div class="demo-stack">',
        `  <YThemeSwitcher${textAttribute('model-value', modelValue)} />`,
        `  <YTag tone="${tone}">${escapeAttribute(caption)}</YTag>`,
        '</div>'
      ])
    }
  },
  featureGrid: {
    title: 'Feature Grid scenario',
    description: '用三列、双列、空态、移动和键盘路径调试品牌特性栅格。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '三列特性', value: 'default' },
        { label: '双列布局', value: 'two' },
        { label: '空特性', value: 'empty' },
        { label: '移动特性', value: 'mobile' },
        { label: '键盘特性', value: 'keyboard' }
      ] },
      { key: 'columns', label: '预览列数', type: 'select', defaultValue: '3', options: [
        { label: '3 columns', value: '3' },
        { label: '2 columns', value: '2' },
        { label: '1 column', value: '1' }
      ] },
      { key: 'caption', label: '说明', type: 'text', defaultValue: 'Feature data is injected by the docs runner.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isEmptyScenario = scenario === 'empty'
      const isKeyboardScenario = scenario === 'keyboard'
      const columns = scenario === 'mobile' ? '1' : scenario === 'two' || isKeyboardScenario ? '2' : state.columns
      const caption = isKeyboardScenario
        ? 'Keyboard feature grid keeps static cards out of the tab order until a real action is added.'
        : isEmptyScenario
          ? 'No features selected'
          : state.caption

      return sfc("import { YTag } from '@yok-ui/core'\nimport { YFeatureGrid } from '@yok-ui/brand'", [
        '<div class="demo-stack">',
        `  <div class="demo-grid demo-grid--${escapeAttribute(columns)}">`,
        `    <YFeatureGrid${isEmptyScenario ? ' :features="[]"' : ''} />`,
        '  </div>',
        `  <YTag tone="${isEmptyScenario ? 'warning' : 'success'}">${escapeAttribute(caption)}</YTag>`,
        '</div>'
      ])
    }
  },
  logoCloud: {
    title: 'Logo Cloud scenario',
    description: '用客户墙、证明文案、空态、移动和键盘路径调试 Logo Cloud。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '客户墙', value: 'default' },
        { label: '证明文案', value: 'proof' },
        { label: '空客户墙', value: 'empty' },
        { label: '移动客户墙', value: 'mobile' },
        { label: '键盘客户墙', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Used across the Yok UI package family' },
      { key: 'tone', label: '标签类型', type: 'select', defaultValue: 'info', options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' }
      ] },
      { key: 'caption', label: '标签文案', type: 'text', defaultValue: 'Brand proof can stay compact and readable.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isEmptyScenario = scenario === 'empty'
      const isKeyboardScenario = scenario === 'keyboard'
      const title = scenario === 'proof'
        ? 'Trusted by the Yok UI package family'
        : scenario === 'mobile'
          ? 'Yok UI packages'
          : state.title
      const caption = isKeyboardScenario
        ? 'Logo cloud stays static while nearby proof links receive focus.'
        : isEmptyScenario
          ? 'No logos available'
          : scenario === 'proof'
            ? 'Use logo clouds for real packages, teams or products rather than decorative filler.'
            : state.caption

      return sfc("import { YTag } from '@yok-ui/core'\nimport { YLogoCloud } from '@yok-ui/brand'", [
        '<div class="demo-stack">',
        `  <YLogoCloud${textAttribute('title', title)}${isEmptyScenario ? ' :logos="[]"' : ''} />`,
        `  <YTag tone="${isEmptyScenario ? 'warning' : state.tone}">${escapeAttribute(caption)}</YTag>`,
        '</div>'
      ])
    }
  },
  profileCard: {
    title: 'Profile Card scenario',
    description: '用成员、负责人、无标签、移动和键盘路径调试资料卡片。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '成员卡片', value: 'default' },
        { label: '负责人卡片', value: 'owner' },
        { label: '无标签', value: 'noTags' },
        { label: '移动卡片', value: 'mobile' },
        { label: '键盘卡片', value: 'keyboard' }
      ] },
      { key: 'name', label: '姓名', type: 'text', defaultValue: 'Yok Designer' },
      { key: 'role', label: '角色', type: 'text', defaultValue: 'Component librarian' },
      { key: 'avatarText', label: '头像字母', type: 'text', defaultValue: 'Y' },
      { key: 'bio', label: '简介', type: 'text', defaultValue: 'Builds polished docs, examples and accessible component stories.' },
      { key: 'showTags', label: '显示标签', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const noTags = scenario === 'noTags' || !state.showTags
      const isKeyboardScenario = scenario === 'keyboard'
      const name = scenario === 'owner' ? 'Yok Maintainer' : isKeyboardScenario ? 'Keyboard profile card' : state.name
      const role = scenario === 'mobile' ? 'Docs owner' : state.role
      const bio = isKeyboardScenario
        ? 'Static profile content does not take focus; nearby contact actions should.'
        : scenario === 'mobile'
          ? 'Compact profile card for narrow surfaces.'
          : state.bio
      const helper = isKeyboardScenario
        ? 'Keyboard profile card keeps contact actions after the static content.'
        : noTags
          ? 'No profile tags'
          : ''

      return sfc("import { YTag } from '@yok-ui/core'\nimport { YProfileCard } from '@yok-ui/brand'", [
        '<div class="demo-stack">',
        `  <YProfileCard${textAttribute('name', name)}${textAttribute('role', role)}${textAttribute('avatar-text', state.avatarText)}${textAttribute('bio', bio)}${noTags ? ' tags=""' : ''} />`,
        helper ? `  <YTag tone="${noTags ? 'warning' : 'info'}">${helper}</YTag>` : '',
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  themeProvider: {
    title: 'Theme Provider scenario',
    description: '用局部主题、清爽主题、复核、移动和键盘路径调试 ThemeProvider。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '局部主题', value: 'default' },
        { label: '清爽主题', value: 'clean' },
        { label: '复核主题', value: 'review' },
        { label: '移动主题', value: 'mobile' },
        { label: '键盘主题', value: 'keyboard' }
      ] },
      { key: 'theme', label: '主题', type: 'select', defaultValue: 'yok-candy', options: [
        { label: 'Light', value: 'yok-light' },
        { label: 'Clean', value: 'yok-clean' },
        { label: 'Candy', value: 'yok-candy' }
      ] },
      { key: 'density', label: '密度', type: 'select', defaultValue: 'comfortable', options: [
        { label: 'Comfortable', value: 'comfortable' },
        { label: 'Compact', value: 'compact' }
      ] },
      { key: 'buttonText', label: '按钮文案', type: 'text', defaultValue: 'Create themed action' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isReviewScenario = scenario === 'review'
      const isKeyboardScenario = scenario === 'keyboard'
      const theme = scenario === 'clean' || isReviewScenario ? 'yok-clean' : scenario === 'mobile' ? 'yok-light' : state.theme
      const density = scenario === 'mobile' ? 'compact' : state.density
      const title = isKeyboardScenario ? 'Keyboard themed region' : isReviewScenario ? 'Theme review' : 'Local theme'
      const description = isKeyboardScenario
        ? 'Focus rings stay visible inside the local theme scope.'
        : isReviewScenario
          ? 'Local theme contrast needs review.'
          : 'ThemeProvider scopes Yok UI variables to this region.'

      return sfc("import { YButton, YCard, YTag, YThemeProvider } from '@yok-ui/core'", [
        `<YThemeProvider${textAttribute('theme', theme)}${textAttribute('density', density)}>`,
        `  <YCard title="${title}" description="${description}">`,
        `    <YButton variant="primary">${escapeAttribute(isKeyboardScenario ? 'Focus themed action' : state.buttonText)}</YButton>`,
        isReviewScenario ? '    <YTag tone="danger">Local theme contrast needs review.</YTag>' : '',
        isKeyboardScenario ? '    <YTag tone="info">Keyboard themed region</YTag>' : '',
        '  </YCard>',
        '</YThemeProvider>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  configProvider: {
    title: 'Config Provider scenario',
    description: '调试全局尺寸、紧凑密度、locale、移动默认值和键盘路径。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '全局尺寸', value: 'default' },
        { label: '紧凑密度', value: 'density' },
        { label: '中文区域', value: 'locale' },
        { label: '锁定配置', value: 'disabled' },
        { label: '移动配置', value: 'mobile' },
        { label: '键盘路径', value: 'keyboard' }
      ] },
      { key: 'size', label: '尺寸', type: 'select', defaultValue: 'lg', options: [
        { label: 'SM', value: 'sm' },
        { label: 'MD', value: 'md' },
        { label: 'LG', value: 'lg' }
      ] },
      { key: 'density', label: '密度', type: 'select', defaultValue: 'compact', options: [
        { label: 'Comfortable', value: 'comfortable' },
        { label: 'Compact', value: 'compact' }
      ] },
      { key: 'locale', label: '语言', type: 'select', defaultValue: 'zh-CN', options: [
        { label: '中文', value: 'zh-CN' },
        { label: 'English', value: 'en-US' }
      ] },
      { key: 'namespace', label: '命名空间', type: 'text', defaultValue: 'yok' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isDensityScenario = scenario === 'density'
      const isLocaleScenario = scenario === 'locale'
      const isDisabledScenario = scenario === 'disabled'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const size = isMobileScenario ? 'sm' : state.size
      const density = isDensityScenario || isMobileScenario ? 'compact' : state.density
      const locale = isLocaleScenario ? 'zh-CN' : state.locale
      const hint = isKeyboardScenario
        ? 'Provider does not enter the tab order; focus moves to input and button.'
        : isMobileScenario
          ? 'Small global size keeps mobile forms compact without repeating props.'
          : isDisabledScenario
            ? 'Release freeze locks descendant controls while preserving readable values.'
          : isLocaleScenario
            ? 'Locale is written to lang and can back future localized copy.'
            : isDensityScenario
              ? 'Density is scoped to this subtree for theme-aware layouts.'
              : 'Button, Input, Select, Date, Time, Cascader and Color inherit the configured size.'

      return sfc("import { YCascader, YButton, YColorPicker, YConfigProvider, YDatePicker, YDateRangePicker, YInput, YInputNumber, YSelect, YTag, YTextarea, YTimePicker } from '@yok-ui/core'\nconst packageOptions = [{ label: 'Core', value: 'core' }, { label: 'Product', value: 'product' }, { label: 'Admin', value: 'admin' }]\nconst cascaderOptions = [{ value: 'core', label: 'Core', children: [{ value: 'form', label: 'Form' }, { value: 'overlay', label: 'Overlay' }] }, { value: 'product', label: 'Product', children: [{ value: 'docs', label: 'Docs' }] }]", [
        `<YConfigProvider${textAttribute('size', size)}${textAttribute('density', density)}${textAttribute('locale', locale)}${textAttribute('namespace', state.namespace)}>`,
        '  <div class="demo-stack">',
        `    <YInput label="${isLocaleScenario ? '组件名称' : 'Component name'}" model-value="Yok UI"${isDisabledScenario ? ' disabled' : ''} />`,
        `    <YTextarea label="${isLocaleScenario ? '发布说明' : 'Release note'}" model-value="Provider settings cascade into form controls."${isDisabledScenario ? ' disabled' : ''} />`,
        `    <YInputNumber label="${isLocaleScenario ? '版本号' : 'Version'}" :model-value="6"${isDisabledScenario ? ' disabled' : ''} />`,
        `    <YSelect label="${isLocaleScenario ? '组件包' : 'Package'}" model-value="core" :options="packageOptions"${isDisabledScenario ? ' disabled' : ''} />`,
        `    <YDatePicker label="${isLocaleScenario ? '发布日期' : 'Release date'}" model-value="2026-06-13"${isDisabledScenario ? ' disabled' : ''} />`,
        `    <YDateRangePicker label="${isLocaleScenario ? '迭代周期' : 'Sprint range'}" :model-value="['2026-06-13', '2026-06-20']"${isDisabledScenario ? ' disabled' : ''} />`,
        `    <YTimePicker label="${isLocaleScenario ? '评审时间' : 'Review time'}" model-value="09:30"${isDisabledScenario ? ' disabled' : ''} />`,
        `    <YCascader label="${isLocaleScenario ? '组件路径' : 'Component path'}" :model-value="['core', 'form']" :options="cascaderOptions"${isDisabledScenario ? ' disabled' : ''} />`,
        `    <YColorPicker label="${isLocaleScenario ? '强调色' : 'Accent color'}" model-value="#14B8A6"${isDisabledScenario ? ' disabled' : ''} />`,
        `    <YButton variant="primary"${isDisabledScenario ? ' disabled' : ''}>${escapeAttribute(isKeyboardScenario ? 'Keyboard action' : isDisabledScenario ? 'Locked action' : 'Create with global size')}</YButton>`,
        '    <YButton size="sm" variant="secondary">Explicit small button</YButton>',
        `    <YTag tone="${isDensityScenario ? 'warning' : 'info'}">${hint}</YTag>`,
        '  </div>',
        '</YConfigProvider>'
      ])
    }
  },
  brandHero: {
    title: 'Brand Hero scenario',
    description: '用品牌首屏、文案强化、风险主张、移动和键盘路径调试 Hero。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'default', options: [
        { label: '品牌首屏', value: 'default' },
        { label: '文案强化', value: 'copy' },
        { label: '风险主张', value: 'risk' },
        { label: '移动首屏', value: 'mobile' },
        { label: '键盘首屏', value: 'keyboard' }
      ] },
      { key: 'eyebrow', label: '标签', type: 'text', defaultValue: 'Yok UI' },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Fresh Vue components' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Build clear, cute and reliable product surfaces with one package family.' },
      { key: 'primaryText', label: '主按钮', type: 'text', defaultValue: 'Get started' },
      { key: 'secondaryText', label: '次按钮', type: 'text', defaultValue: 'Browse components' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isRiskScenario = scenario === 'risk'
      const isKeyboardScenario = scenario === 'keyboard'
      const title = isKeyboardScenario
        ? 'Keyboard hero actions'
        : scenario === 'copy'
          ? 'A fresh Vue 3 kit with serious workflows'
          : scenario === 'mobile'
            ? 'Fresh Vue kit'
            : state.title
      const description = isRiskScenario
        ? 'Needs clearer value proposition before launch.'
        : isKeyboardScenario
          ? 'Tab reaches Get started first, then Browse components, matching the visual action order.'
          : scenario === 'mobile'
            ? 'Clear, cute components for fast product pages.'
            : state.description
      const primaryText = isRiskScenario ? 'Review copy' : isKeyboardScenario ? 'Get started' : state.primaryText
      const secondaryText = isRiskScenario ? 'Compare examples' : isKeyboardScenario ? 'Browse components' : state.secondaryText

      return sfc("import { YTag } from '@yok-ui/core'\nimport { YBrandHero } from '@yok-ui/brand'", [
        '<div class="demo-stack">',
        `  <YBrandHero${textAttribute('eyebrow', state.eyebrow)}${textAttribute('title', title)}${textAttribute('description', description)}${textAttribute('primary-text', primaryText)}${textAttribute('secondary-text', secondaryText)} />`,
        isRiskScenario ? '  <YTag tone="danger">Needs clearer value proposition before launch.</YTag>' : '',
        isKeyboardScenario ? '  <YTag tone="info">Keyboard hero actions</YTag>' : '',
        '</div>'
      ].filter((line): line is string => Boolean(line)))
    }
  },
  metricCard: {
    title: 'Metric Card scenario',
    description: '调试覆盖指标、风险指标、中性指标、移动和键盘指标场景。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'coverage', options: [
        { label: '覆盖指标', value: 'coverage' },
        { label: '风险指标', value: 'risk' },
        { label: '中性指标', value: 'neutral' },
        { label: '移动指标', value: 'mobile' },
        { label: '键盘指标', value: 'keyboard' }
      ] },
      { key: 'label', label: '标签', type: 'text', defaultValue: 'Live examples' },
      { key: 'value', label: '数值', type: 'text', defaultValue: '73' },
      { key: 'trend', label: '趋势', type: 'text', defaultValue: '+13' },
      { key: 'tone', label: '趋势色', type: 'select', defaultValue: 'success', options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' },
        { label: 'Neutral', value: 'neutral' }
      ] },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Editable docs currently covered.' }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isRiskScenario = scenario === 'risk'
      const isNeutralScenario = scenario === 'neutral'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'
      const label = isKeyboardScenario
        ? 'Keyboard metric card'
        : isRiskScenario
          ? 'Blocked examples'
          : isMobileScenario
            ? 'Docs'
            : state.label
      const value = isRiskScenario ? '12' : isMobileScenario ? '73' : state.value
      const trend = isNeutralScenario ? '0' : isRiskScenario ? '+4' : state.trend
      const tone = isNeutralScenario ? 'neutral' : isRiskScenario ? 'danger' : state.tone
      const description = isKeyboardScenario
        ? 'The metric is read as static content; adjacent actions receive focus.'
        : isRiskScenario
          ? 'Blocked examples need owner review.'
          : isMobileScenario
            ? 'Short labels keep cards readable on mobile.'
            : state.description

      return sfc("import { YMetricCard } from '@yok-ui/admin'", [
        `<YMetricCard${textAttribute('label', label)}${textAttribute('value', value)}${textAttribute('trend', trend)}${textAttribute('tone', tone)}${textAttribute('description', description)} />`
      ])
    }
  },
  dataTable: {
    title: 'Data Table scenario',
    description: '用发布队列、远程加载、错误恢复、列配置重置、千行性能、批量审核、移动密度和键盘巡航调试后台数据表。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'queue', options: [
        { label: '发布队列', value: 'queue' },
        { label: '远程加载', value: 'loading' },
        { label: '错误恢复', value: 'error' },
        { label: '筛选摘要', value: 'filters' },
        { label: '列配置重置', value: 'columns' },
        { label: '列顺序偏好', value: 'columnOrder' },
        { label: '列宽偏好', value: 'resizable' },
        { label: '视图偏好保存', value: 'viewPreference' },
        { label: '千行性能', value: 'virtualized' },
        { label: '批量审核', value: 'bulk' },
        { label: '移动密度', value: 'mobile' },
        { label: '键盘巡航', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component release queue' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Selectable table with pagination, density and bulk actions.' },
      { key: 'density', label: '密度', type: 'select', defaultValue: 'comfortable', options: [
        { label: 'Comfortable', value: 'comfortable' },
        { label: 'Compact', value: 'compact' }
      ] },
      { key: 'pageSize', label: '每页数量', type: 'range', defaultValue: 3, min: 2, max: 8, step: 1 },
      { key: 'selectable', label: '可选择', type: 'boolean', defaultValue: true },
      { key: 'pagination', label: '分页', type: 'boolean', defaultValue: true },
      { key: 'showDensitySettings', label: '密度设置', type: 'boolean', defaultValue: true },
      { key: 'showColumnSettings', label: '列设置', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isLoadingScenario = scenario === 'loading'
      const isErrorScenario = scenario === 'error'
      const isFilterScenario = scenario === 'filters'
      const isColumnScenario = scenario === 'columns'
      const isColumnOrderScenario = scenario === 'columnOrder'
      const isResizableScenario = scenario === 'resizable'
      const isViewPreferenceScenario = scenario === 'viewPreference'
      const isVirtualizedScenario = scenario === 'virtualized'
      const isBulkScenario = scenario === 'bulk'
      const isMobileScenario = scenario === 'mobile'
      const isKeyboardScenario = scenario === 'keyboard'

      return sfc("import { YDataTable } from '@yok-ui/admin'", [
      `<YDataTable${textAttribute('title', isErrorScenario ? 'Component release queue unavailable' : isFilterScenario ? 'Filtered release queue' : isColumnScenario ? 'Column preset review' : isColumnOrderScenario ? 'Saved column order queue' : isResizableScenario ? 'Saved column width queue' : isViewPreferenceScenario ? 'Saved table view queue' : isVirtualizedScenario ? 'Virtualized release queue' : isMobileScenario ? 'Mobile release queue' : isKeyboardScenario ? 'Keyboard review queue' : state.title)}${textAttribute('description', isLoadingScenario ? 'Remote request is in progress with table controls preserved.' : isFilterScenario ? 'Active filter chips document the current list scope and can be cleared individually.' : isColumnScenario ? 'Reset column visibility after experimenting with hidden fields.' : isColumnOrderScenario ? 'Move columns in settings and persist the resulting columnKeys order.' : isResizableScenario ? 'Drag table header handles and persist the resulting columnWidths as user preferences.' : isViewPreferenceScenario ? 'Initialize one saved table view and emit viewPreferenceChange when users adjust table settings.' : isVirtualizedScenario ? 'Render a thousand rows with a fixed-height virtual viewport.' : isBulkScenario ? 'Bulk actions stay visible while reviewing selected components.' : isMobileScenario ? 'Compact responsive table keeps actions readable in narrow layouts.' : isKeyboardScenario ? 'Use Tab to reach table controls, Space to toggle row selection, Enter for toolbar actions, and pagination buttons for page movement.' : state.description)}${textAttribute('density', isFilterScenario || isBulkScenario || isMobileScenario ? 'compact' : state.density)} :page="1"${numericBinding('page-size', isBulkScenario ? 4 : isMobileScenario ? 2 : state.pageSize)}${booleanAttribute('selectable', Boolean(state.selectable) || isBulkScenario || isKeyboardScenario)}${booleanAttribute('pagination', isVirtualizedScenario ? false : state.pagination)}${booleanAttribute('show-density-settings', isMobileScenario ? false : state.showDensitySettings || isViewPreferenceScenario)}${booleanAttribute('show-column-settings', state.showColumnSettings || isColumnScenario || isColumnOrderScenario || isViewPreferenceScenario)}${isColumnScenario ? ' column-keys="name" default-column-keys="name,status" column-reset-text="Restore defaults"' : ''}${isColumnOrderScenario ? ' remote reorderable-columns column-keys="status,name,owner" default-column-keys="name,status,owner" column-reset-text="Restore saved order"' : ''}${isResizableScenario ? ' remote resizable :min-column-width="112" :default-column-widths="{ name: 184, status: 128 }"' : ''}${isViewPreferenceScenario ? ' remote resizable reorderable-columns show-filter-summary column-reset-text="Restore saved view" :min-column-width="112" :default-view-preference="{ columnKeys: [\'status\', \'name\', \'owner\'], columnWidths: { status: 148, name: 212 }, density: \'compact\', filters: { status: [\'Stable\'] } }"' : ''}${isVirtualizedScenario ? ' virtualized :virtual-height="240" :virtual-row-height="44" :virtual-overscan="3"' : ''}${isFilterScenario ? ' show-filter-summary :default-filters="{ status: [\'Stable\'] }"' : ''}${booleanAttribute('remote', isLoadingScenario || isErrorScenario || isColumnScenario || isColumnOrderScenario || isViewPreferenceScenario)}${booleanAttribute('loading', isLoadingScenario)}${isErrorScenario ? ' error-text="Network timeout while loading rows."' : ''}${isBulkScenario ? ' selected-row-keys="button,data-table,theme" sticky-bulk-actions bulk-action-title="3 components selected"' : ''}${isKeyboardScenario ? ' selected-row-keys="button" bulk-action-title="Keyboard path active"' : ''} striped />`
    ])
    }
  },
  searchForm: {
    title: 'Search Form scenario',
    description: '用基础筛选、日期范围、高级展开、紧凑表头、禁用和键盘路径调试搜索表单。',
    controls: [
      { key: 'scenario', label: '场景', type: 'select', defaultValue: 'basic', options: [
        { label: '基础筛选', value: 'basic' },
        { label: '高级展开', value: 'advanced' },
        { label: '紧凑表头', value: 'toolbar' },
        { label: '禁用筛选', value: 'blocked' },
        { label: '键盘筛选', value: 'keyboard' }
      ] },
      { key: 'title', label: '标题', type: 'text', defaultValue: 'Component search' },
      { key: 'description', label: '说明', type: 'text', defaultValue: 'Collapse long filter groups while keeping active filters visible.' },
      { key: 'density', label: '密度', type: 'select', defaultValue: 'comfortable', options: [
        { label: 'Comfortable', value: 'comfortable' },
        { label: 'Compact', value: 'compact' }
      ] },
      { key: 'collapsedCount', label: '折叠数量', type: 'range', defaultValue: 3, min: 1, max: 4, step: 1 },
      { key: 'collapsible', label: '允许折叠', type: 'boolean', defaultValue: true },
      { key: 'defaultCollapsed', label: '默认折叠', type: 'boolean', defaultValue: true }
    ],
    build: (state) => {
      const scenario = String(state.scenario)
      const isAdvancedScenario = scenario === 'advanced'
      const isToolbarScenario = scenario === 'toolbar'
      const isBlockedScenario = scenario === 'blocked'
      const isKeyboardScenario = scenario === 'keyboard'
      const density = isToolbarScenario || isKeyboardScenario ? 'compact' : state.density
      const title = isKeyboardScenario
        ? 'Keyboard filters'
        : isBlockedScenario
          ? 'Blocked filters'
          : isToolbarScenario
            ? 'Header filters'
            : state.title
      const description = isKeyboardScenario
        ? 'Tab reaches keyword, status, submit and reset in order.'
        : isBlockedScenario
          ? 'Filters are disabled while remote data refreshes.'
          : isAdvancedScenario
            ? 'Advanced fields stay visible for one-pass filtering.'
            : state.description
      const model = isBlockedScenario
        ? { keyword: 'release', status: 'beta', package: 'admin', releaseDate: '2026-07-01', releaseWindow: ['2026-07-01', '2026-07-07'] }
        : isAdvancedScenario || isKeyboardScenario
          ? { keyword: 'table', status: 'stable', package: 'admin', releaseDate: '2026-07-01', releaseWindow: ['2026-07-01', '2026-07-07'] }
          : { keyword: 'button', status: 'stable', package: '', releaseDate: '', releaseWindow: [] }
      const fields = [
        { key: 'keyword', label: 'Keyword', placeholder: 'Search component', disabled: isBlockedScenario },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          placeholder: 'Choose status',
          disabled: isBlockedScenario,
          options: [
            { label: 'Stable', value: 'stable' },
            { label: 'Beta', value: 'beta' },
            { label: 'Planned', value: 'planned' }
          ]
        },
        {
          key: 'package',
          label: 'Package',
          type: 'select',
          placeholder: 'Choose package',
          disabled: isBlockedScenario,
          options: [
            { label: 'Core', value: 'core' },
            { label: 'Product', value: 'product' },
            { label: 'Admin', value: 'admin' }
          ]
        },
        {
          key: 'releaseDate',
          label: 'Release date',
          type: 'date',
          disabled: isBlockedScenario,
          shortcuts: [
            { label: 'Today', value: '2026-06-13' },
            { label: 'Launch day', value: '2026-07-01', time: '20:30', description: 'Low traffic release window' }
          ]
        },
        {
          key: 'releaseWindow',
          label: 'Release window',
          type: 'dateRange',
          disabled: isBlockedScenario,
          shortcuts: [
            { label: 'Release week', value: ['2026-07-01', '2026-07-07'], time: '20:30-09:00' }
          ]
        },
        { key: 'owner', label: 'Owner', placeholder: 'Design system', disabled: isBlockedScenario }
      ]
      const script = [
        `import { ref } from 'vue'`,
        `import { YSearchForm } from '@yok-ui/admin'`,
        ``,
        `const searchFormModel = ref(${JSON.stringify(model, null, 2)})`,
        `const searchFormFields = ${JSON.stringify(fields, null, 2)}`
      ].join('\n')

      return sfc(script, [
      `<YSearchForm :model-value="searchFormModel" :fields="searchFormFields"${textAttribute('title', title)}${textAttribute('description', description)}${textAttribute('density', density)}${numericBinding('collapsed-count', isToolbarScenario || isKeyboardScenario ? 2 : state.collapsedCount)}${state.collapsible && !isBlockedScenario ? ' collapsible' : ' :collapsible="false"'}${isAdvancedScenario || isKeyboardScenario ? ' :default-collapsed="false"' : state.defaultCollapsed ? ' default-collapsed' : ' :default-collapsed="false"'}${isToolbarScenario ? ' submit-text="Apply" reset-text="Clear"' : ''}${isKeyboardScenario ? ' submit-text="Apply filters" reset-text="Reset filters"' : ''}${isBlockedScenario ? ' submit-text="Filtering paused" reset-text="Clear disabled filters"' : ''} />`
    ])
    }
  }
}

const selectedPreset = ref<LiveExamplePreset>(props.preset)
const autoRun = ref(true)
type PreviewViewport = 'auto' | 'tablet' | 'mobile'
const previewViewport = ref<PreviewViewport>('auto')
const copyMode = ref<'sfc' | 'template'>('sfc')
const selectedTheme = ref<YokThemeName>('yok-light')
type SourcePanelMode = 'sfc' | 'template' | 'diff' | 'install' | 'repro'
type SourceLanguageMode = 'ts' | 'js'
type InstallPackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'
const sourcePanelMode = ref<SourcePanelMode>('sfc')
const sourceLanguageMode = ref<SourceLanguageMode>('ts')
const installPackageManager = ref<InstallPackageManager>('pnpm')
const checkedSource = ref('')
const lastSuccessfulSource = ref('')
const controlState = ref<Record<string, string | number | boolean>>({})
const eventLogs = ref<EventLogItem[]>([])
const eventLogId = ref(0)
const eventPayloadPreviewLimit = 180
const draftStoragePrefix = 'yok-ui:live-example-draft'
const playgroundHandoffStoragePrefix = 'yok-ui:playground-handoff'
const externalScenarioEventName = 'yok-ui:live-example-scenario'
const liveExampleHashId = 'live-example'
const draftHydrated = ref(false)
const hasStoredDraft = ref(false)
const draftStatus = ref('')
const skipNextDraftPersist = ref(false)
const liveExampleThemeTokens: Record<YokThemeName, YokThemeTokens> = {
  'yok-light': yokLight,
  'yok-clean': yokClean,
  'yok-candy': yokCandy
}

const runnerTitle = computed(() => props.title || '编辑模板，立即预览 Yok UI 组件')
const runnerDescription = computed(() =>
  props.description ||
  '运行器只编译安全白名单内的展示模板，不执行编辑区里的脚本。适合组件文档、示例调试和复制代码前的快速试验。'
)
const activeStarterCode = computed(() => getStarterSource(selectedPreset.value))
const activeDraftKey = computed(() => `${draftStoragePrefix}:${selectedPreset.value}`)
const activeRecipe = computed(() => liveExampleRecipes[selectedPreset.value])
const activeControls = computed(() => activeRecipe.value?.controls ?? [])
const hasPropControls = computed(() => activeControls.value.length > 0)
const hasAlertWorkflowSimulator = computed(() => selectedPreset.value === 'alert')
const hasCascaderWorkflowSimulator = computed(() => selectedPreset.value === 'cascader')
const hasCheckboxWorkflowSimulator = computed(
  () => selectedPreset.value === 'checkbox' && ['checklist', 'limited-group'].includes(String(controlState.value.scenario))
)
const hasColorPickerWorkflowSimulator = computed(
  () => selectedPreset.value === 'colorPicker' && ['presets', 'validation'].includes(String(controlState.value.scenario))
)
const hasCollapseWorkflowSimulator = computed(() => selectedPreset.value === 'collapse')
const hasDatePickerWorkflowSimulator = computed(() => selectedPreset.value === 'datePicker')
const hasDateRangeWorkflowSimulator = computed(() => selectedPreset.value === 'dateRangePicker')
const hasDescriptionsWorkflowSimulator = computed(() => selectedPreset.value === 'descriptions')
const hasInputWorkflowSimulator = computed(
  () => selectedPreset.value === 'input' && ['search', 'clearable'].includes(String(controlState.value.scenario))
)
const hasInputNumberWorkflowSimulator = computed(() => selectedPreset.value === 'inputNumber')
const hasDropdownWorkflowSimulator = computed(
  () => selectedPreset.value === 'dropdown' && ['actions', 'persistent'].includes(String(controlState.value.scenario))
)
const hasPopconfirmWorkflowSimulator = computed(
  () => selectedPreset.value === 'popconfirm' && ['archive', 'cancel', 'danger'].includes(String(controlState.value.scenario))
)
const hasModalWorkflowSimulator = computed(() => selectedPreset.value === 'modal')
const hasDrawerWorkflowSimulator = computed(() => selectedPreset.value === 'drawer')
const hasEmptyWorkflowSimulator = computed(() => selectedPreset.value === 'empty')
const hasListWorkflowSimulator = computed(() => selectedPreset.value === 'list')
const hasMessageWorkflowSimulator = computed(() => selectedPreset.value === 'message')
const hasResultWorkflowSimulator = computed(() => selectedPreset.value === 'result')
const hasStatisticWorkflowSimulator = computed(() => selectedPreset.value === 'statistic')
const hasPopoverWorkflowSimulator = computed(
  () => selectedPreset.value === 'popover' && ['note', 'confirm'].includes(String(controlState.value.scenario))
)
const hasPaginationWorkflowSimulator = computed(() => selectedPreset.value === 'pagination')
const hasProgressWorkflowSimulator = computed(() => selectedPreset.value === 'progress')
const hasRadioGroupWorkflowSimulator = computed(
  () => selectedPreset.value === 'radioGroup' && ['package', 'controlled'].includes(String(controlState.value.scenario))
)
const hasRateWorkflowSimulator = computed(
  () => selectedPreset.value === 'rate' && controlState.value.scenario === 'clear'
)
const hasSelectWorkflowSimulator = computed(() => selectedPreset.value === 'select')
const hasSkeletonWorkflowSimulator = computed(() => selectedPreset.value === 'skeleton')
const hasSliderWorkflowSimulator = computed(
  () => selectedPreset.value === 'slider' && controlState.value.scenario === 'range'
)
const hasStepsWorkflowSimulator = computed(() => selectedPreset.value === 'steps')
const hasSwitchWorkflowSimulator = computed(
  () => selectedPreset.value === 'switch' && controlState.value.scenario === 'instant'
)
const hasTableWorkflowSimulator = computed(() => selectedPreset.value === 'table')
const hasTimePickerWorkflowSimulator = computed(() => selectedPreset.value === 'timePicker')
const hasTooltipWorkflowSimulator = computed(
  () => selectedPreset.value === 'tooltip' && ['click', 'action'].includes(String(controlState.value.scenario))
)
const hasTimelineWorkflowSimulator = computed(() => selectedPreset.value === 'timeline')
const hasUploadWorkflowSimulator = computed(() => selectedPreset.value === 'upload')
const activeScenarios = computed(() => getLiveExampleScenarios(selectedPreset.value))
const hasScenarioSwitcher = computed(() => activeScenarios.value.length > 0)
const acceptanceSummary = computed(() => getLiveExampleValidationSummary(selectedPreset.value))
const activeComponentMeta = computed(() => getLiveExampleComponentMeta(selectedPreset.value))
const themeOptions = computed(() => builtinThemes)
const selectedThemeMeta = computed(() =>
  themeOptions.value.find((theme) => theme.name === selectedTheme.value) ?? themeOptions.value[0]
)
const selectedThemeTokens = computed(() => liveExampleThemeTokens[selectedTheme.value])
const scenarioKindLabels: Record<LiveExampleScenarioKind, string> = {
  basic: '基础态',
  controlled: '受控回填',
  copy: '文案提示',
  disabled: '禁用态',
  empty: '空态',
  loading: '加载态',
  error: '错误态',
  multi: '多选/批量',
  keyboard: '键盘路径',
  responsive: '响应式',
  remote: '远程数据',
  filter: '筛选',
  search: '搜索',
  virtual: '虚拟滚动',
  summary: '汇总',
  layout: '布局方向',
  composition: '组合插槽'
}
const scenarioCoverageKinds = [
  'basic',
  'controlled',
  'loading',
  'error',
  'empty',
  'disabled',
  'keyboard',
  'responsive',
  'multi',
  'search',
  'filter',
  'remote',
  'virtual',
  'summary'
] as const satisfies readonly LiveExampleScenarioKind[]
interface LiveExampleScenarioEventDetail {
  preset?: LiveExamplePreset
  scenarioKey?: string
}

function getScenarioControlKey(scenario: LiveExampleScenario) {
  return scenario.controlKey ?? 'scenario'
}

function getScenarioControlValue(scenario: LiveExampleScenario) {
  return scenario.controlValue ?? scenario.key
}

function getScenarioControl(scenario: LiveExampleScenario) {
  const controlKey = getScenarioControlKey(scenario)

  return activeControls.value.find((control) => control.key === controlKey)
}

function isScenarioActive(scenario: LiveExampleScenario) {
  const controlKey = getScenarioControlKey(scenario)

  return controlState.value[controlKey] === getScenarioControlValue(scenario)
}

function getLiveExampleScenarioHash(scenarioKey: string) {
  const params = new URLSearchParams()
  params.set('scenario', scenarioKey)

  if (selectedTheme.value !== 'yok-light') {
    params.set('theme', selectedTheme.value)
  }

  if (previewViewport.value !== 'auto') {
    params.set('viewport', previewViewport.value)
  }

  return `#${liveExampleHashId}?${params.toString()}`
}

function getLiveExampleShareUrl(hash: string) {
  if (typeof window === 'undefined') {
    return ''
  }

  return `${window.location.origin}${window.location.pathname}${window.location.search}${hash}`
}

function syncLiveExampleShareUrl(url: string) {
  if (typeof window === 'undefined' || !url) {
    return
  }

  try {
    const sharedUrl = new URL(url)

    window.history.replaceState(null, '', `${sharedUrl.pathname}${sharedUrl.search}${sharedUrl.hash}`)
  } catch {
    window.history.replaceState(null, '', url)
  }
}

const activeScenario = computed(() =>
  activeScenarios.value.find((scenario) => isScenarioActive(scenario))
)

const activeScenarioShareUrl = computed(() => {
  if (!activeScenario.value) {
    return ''
  }

  return getLiveExampleShareUrl(getLiveExampleScenarioHash(activeScenario.value.key))
})
const activeStateShareUrl = computed(() => {
  if (!hasPropControls.value) {
    return ''
  }

  const params = new URLSearchParams()

  if (activeScenario.value) {
    params.set('scenario', activeScenario.value.key)
  }

  if (selectedTheme.value !== 'yok-light') {
    params.set('theme', selectedTheme.value)
  }

  if (previewViewport.value !== 'auto') {
    params.set('viewport', previewViewport.value)
  }

  params.set('state', JSON.stringify(getSerializableControlState()))

  return getLiveExampleShareUrl(`#${liveExampleHashId}?${params.toString()}`)
})
const playgroundImportUrl = computed(() => {
  const params = new URLSearchParams()
  const playgroundComponent = getPlaygroundComponentForPreset(selectedPreset.value)

  if (playgroundComponent) {
    params.set('component', playgroundComponent)
  }

  params.set('theme', selectedTheme.value)
  params.set('source', playgroundSfcSource.value)
  params.set('from', 'live-example')
  params.set('language', sourceLanguageMode.value)
  params.set('docsHash', playgroundDocsHash.value)

  if (activeScenario.value) {
    params.set('scenario', activeScenario.value.key)
  }

  if (previewViewport.value !== 'auto') {
    params.set('viewport', previewViewport.value)
  }

  if (hasPropControls.value) {
    params.set('controls', JSON.stringify(controlState.value))
  }

  return `/playground/?${params.toString()}`
})

const allowedTags = new Set([
  'div',
  'section',
  'span',
  'p',
  'strong',
  'em',
  'code',
  'svg',
  'path',
  'template',
  'yaffix',
  'yanchor',
  'yautocomplete',
  'yavatar',
  'yavatargroup',
  'ybacktop',
  'ybadge',
  'ybreadcrumb',
  'ybutton',
  'yalert',
  'ycalendar',
  'ycarousel',
  'ycascader',
  'ycheckbox',
  'ycheckboxgroup',
  'ycollapse',
  'ycolorpicker',
  'yconfigprovider',
  'ycountdown',
  'ydatepicker',
  'ydaterangepicker',
  'ydescriptions',
  'ydivider',
  'ydropdown',
  'ydrawer',
  'yempty',
  'yfloatbutton',
  'yfloatbuttongroup',
  'yform',
  'yformitem',
  'yformsummary',
  'yicon',
  'yimage',
  'yinput',
  'yinputnumber',
  'yaside',
  'yfooter',
  'yheader',
  'ylayout',
  'ymain',
  'ylink',
  'yloading',
  'ylist',
  'ymenu',
  'ymention',
  'ymessage',
  'ymessagebox',
  'ynotification',
  'ymodal',
  'ypagination',
  'ypopconfirm',
  'ypopover',
  'yprogress',
  'yqrcode',
  'yradiogroup',
  'yrate',
  'yresult',
  'ysegmented',
  'yselect',
  'yskeleton',
  'yscrollbar',
  'yspace',
  'yslider',
  'ysplitter',
  'ystatistic',
  'ysteps',
  'yswitch',
  'ytable',
  'ytabs',
  'ytextarea',
  'ytext',
  'ytimeline',
  'ytour',
  'ytimepicker',
  'ytag',
  'ytooltip',
  'ytransfer',
  'ytree',
  'ytreeselect',
  'yupload',
  'yvirtuallist',
  'ywatermark',
  'ycommandpalette',
  'ycodeblock',
  'ycopybutton',
  'ythemeswitcher',
  'ythemeprovider',
  'ybrandhero',
  'yfeaturegrid',
  'ylogocloud',
  'yprofilecard',
  'ypageheader',
  'ymetriccard',
  'ysearchpanel',
  'ysearchform',
  'ycrudlayout',
  'yfiltertabs',
  'ydatatable',
  'ydataview',
  'yresourcepage',
  'yschemaform',
  'yfieldarray',
  'ybulkactionbar',
  'ystatustimeline',
  'yreviewworkflow',
  'ysavedviews',
  'ydatatoolbar',
  'ycard'
])

const allowedAttributes = new Set([
  'class',
  'style',
  'id',
  'aria-label',
  'aria-describedby',
  '#default',
  '#action',
  '#extra',
  '#footer',
  '#actions',
  '#expand',
  '#search',
  '#filters',
  '#toolbar',
  '#placeholder',
  '#error',
  '#preview-footer',
  '#navigation',
  '#preview',
  '#table',
  '#aside',
  '#detail',
  '#detailFooter',
  '#detailfooter',
  '#searchActions',
  '#searchactions',
  'actions',
  'action',
  'toolbar',
  'placeholder',
  'error',
  'preview-footer',
  'navigation',
  'preview',
  'aside',
  'detail',
  'detailfooter',
  'searchactions',
  'expand',
  'variant',
  'size',
  'disabled',
  'indeterminate',
  'loading',
  'tone',
  'theme',
  'density',
  'mode',
  'title',
  'subtitle',
  'status',
  'locale',
  'namespace',
  'closable',
  'close-label',
  'close-text',
  ':close-on-overlay',
  ':close-on-escape',
  'confirm-text',
  'cancel-text',
  'prompt-label',
  'prompt-value',
  'prompt-placeholder',
  'prompt-error',
  'compact',
  'description',
  'helper',
  'caption',
  'summary',
  'trend',
  'reviewer',
  'due-text',
  'submit-text',
  'reset-text',
  'collapse-text',
  'expand-text',
  'approve-text',
  'reject-text',
  'request-changes-text',
  'bulk-action-title',
  'bulk-action-clear-text',
  'add-text',
  'remove-text',
  'item-label',
  'item-key',
  'column-reset-text',
  'table-title',
  'table-description',
  'saved-views-title',
  'saved-views-description',
  'summary-title',
  'default-view',
  ':default-item',
  'search-title',
  'search-description',
  'detail-open',
  'show-summary',
  'detail-title',
  'detail-description',
  'detail-placement',
  'clear-text',
  'save-text',
  'create-text',
  'manage-text',
  'type',
  'tag',
  'trigger',
  'tooltip',
  'theme',
  'label',
  'src',
  'alt',
  'fit',
  'radius',
  'lazy',
  'preview',
  'preview-open',
  'initial-index',
  'orientation',
  'shape',
  'spacing',
  'block',
  'name',
  'label-width',
  'label-for',
  'loading-text',
  'error-text',
  'model-value',
  ':model-value',
  'v-model:filters',
  'v-model:selected-row-keys',
  ':default-open-keys',
  ':nodes',
  'default-expanded-keys',
  ':default-expanded-keys',
  'expanded-keys',
  ':expanded-keys',
  ':schema',
  ':fields',
  ':search-model',
  ':search-fields',
  ':options',
  ':load',
  'sort-key',
  'sort-order',
  'default-sort-key',
  'default-sort-order',
  'filter-mode',
  'format',
  ':default-filters',
  ':default-view-preference',
  'multiple',
  ':multiple',
  'collapse-tags',
  'allow-create',
  'virtualized',
  'resizable',
  'virtual-height',
  ':virtual-height',
  'virtual-item-height',
  ':virtual-item-height',
  'virtual-row-height',
  ':virtual-row-height',
  'virtual-overscan',
  ':virtual-overscan',
  'min-column-width',
  ':min-column-width',
  'max-collapse-tags',
  ':max-collapse-tags',
  'range',
  'vertical',
  'show-tooltip',
  'tooltip-placement',
  'show-alpha',
  'show-text',
  ':show-adjacent-months',
  'strong',
  'italic',
  'underline',
  'deleted',
  'mark',
  'truncated',
  'line-clamp',
  ':line-clamp',
  'filterable',
  'check-strictly',
  'tree-aria-label',
  'shortcuts',
  ':shortcuts',
  ':disabled-date',
  ':disabled-time',
  ':autoplay',
  ':interval',
  ':loop',
  ':pause-on-hover',
  'indicator-position',
  'allow-half',
  'readonly',
  'icon',
  'void-icon',
  'drag',
  'scroll-to-error',
  'collapsible',
  ':collapsible',
  'default-collapsed',
  ':default-collapsed',
  'sticky-header',
  'show-density-settings',
  'show-filter-summary',
  'show-column-settings',
  'reorderable-columns',
  'refreshable',
  'remote',
  'pagination',
  'sticky-bulk-actions',
  'controls',
  ':controls',
  'accept',
  'auto-upload',
  'activation-mode',
  'expandable',
  ':before-upload',
  'button-label',
  ':custom-request',
  'drop-label',
  'empty-text',
  'list-type',
  'previewable',
  'downloadable',
  'download-name',
  'download-text',
  'value',
  'level',
  'foreground',
  'background',
  'margin',
  'expired-text',
  'refresh-text',
  'logo-src',
  'logo-alt',
  'logo-size',
  ':logo-size',
  'sortable',
  'rejected-files',
  'max-files',
  ':max-files',
  'max-size',
  ':max-size',
  'min',
  ':min',
  'max',
  ':max',
  'step',
  ':step',
  ':marks',
  'precision',
  ':precision',
  'clearable',
  ':clearable',
  'open',
  ':open',
  'page',
  ':page',
  'page-size',
  ':page-size',
  'minute-step',
  ':minute-step',
  'placement',
  'placeholder',
  'search-placeholder',
  'prop',
  'error',
  'invalid',
  'active-text',
  'inactive-text',
  'prefix-text',
  'suffix-text',
  'show-count',
  ':show-count',
  'show-icon',
  ':show-icon',
  'maxlength',
  ':maxlength',
  'interactive',
  'items',
  ':items',
  'gap',
  ':gap',
  'panels',
  ':panels',
  'container',
  'bound',
  ':bound',
  'duration',
  ':duration',
  'marker',
  ':marker',
  'select-scroll-top',
  'target',
  'position',
  'offset',
  ':offset',
  'z-index',
  ':z-index',
  ':titles',
  ':commands',
  ':views',
  ':columns',
  ':data',
  'presets',
  ':presets',
  ':texts',
  'item-height',
  ':item-height',
  'count',
  ':count',
  'overscan',
  ':overscan',
  'align',
  'separator',
  'rows',
  ':rows',
  'column',
  ':column',
  'columns',
  ':columns',
  'collapsed-count',
  ':collapsed-count',
  'current',
  ':current',
  'direction',
  'layout',
  'bordered',
  'split',
  'accordion',
  'reverse',
  'visibility-height',
  ':visibility-height',
  'right',
  ':right',
  'bottom',
  ':bottom',
  'prefix',
  'suffix',
  'group-separator',
  'decimal-separator',
  'confirm-text',
  'cancel-text',
  'hint',
  'required',
  'errors',
  ':errors',
  'focus-on-click',
  ':focus-on-click',
  'hide-on-click',
  ':hide-on-click',
  'animated',
  ':animated',
  'autocomplete',
  'width',
  'collapsed-width',
  'height',
  'full-height',
  'padded',
  'scrollable',
  'sticky',
  ':height',
  'viewbox',
  'd',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'max-height',
  ':max-height',
  'opacity',
  ':opacity',
  'gap',
  ':gap',
  'rotate',
  ':rotate',
  'font-size',
  ':font-size',
  'language',
  'text',
  'code',
  'primary-text',
  'secondary-text',
  'eyebrow',
  'role',
  'bio',
  'avatar-text',
  'src-set',
  'tags',
  ':features',
  ':logos',
  'selectable',
  'sibling-count',
  ':sibling-count',
  'hide-on-single-page',
  ':hide-on-single-page',
  'previous-text',
  'next-text',
  'prev-text',
  'finish-text',
  'skip-text',
  'striped',
  'banner',
  'tabs',
  ':tabs',
  'total',
  ':total',
  'value',
  ':value',
  'show-value',
  ':show-value',
  'show-delay',
  'hide-delay',
  ':show-delay',
  ':hide-delay',
  'content',
  'name',
  'shape',
  'selected-key',
  'selected-row-keys',
  ':selected-row-keys',
  'default-selected-row-keys',
  'expanded-row-keys',
  'default-expanded-row-keys',
  ':actions',
  'column-keys',
  'default-column-keys',
  'column-widths',
  ':column-widths',
  'default-column-widths',
  ':default-column-widths',
  'active-value',
  'expanded-keys',
  'checked-keys',
  'checkable',
  'check-strictly',
  'draggable',
  'aria-label',
  '@expand-change'
])

const forbiddenPatterns = [
  /\{\{/,
  /<\/?\s*(script|style|iframe|object|embed|link|meta)/i,
  /\bv-html\b/i,
  /\bv-on\b/i,
  /@[\w-]+=/,
  /:[\w-]+\s*=\s*["'][^"']*[();][^"']*["']/,
  /\bimport\s*\(/i,
  /\bnew\s+Function\b/i
]

function getSafeValidationTemplate(template: string) {
  const lowerTemplate = template.toLowerCase()
  const hasYTable = lowerTemplate.includes('<ytable')

  if (!hasYTable) {
    return template
  }

  return template
    .replace(/@(expand-change|selection-change|sort-change|filter-change)\s*=\s*["'][\w$]+["']/gi, '')
    .replace(/\{\{\s*rowKey\s*\}\}/g, '')
    .replace(/\{\{\s*row\.detail\s*\}\}/g, '')
}

const source = ref(activeStarterCode.value)
const copied = ref(false)
const copiedSourcePanel = ref(false)
let copiedSourcePanelResetTimer = 0
const copiedScenarioLink = ref(false)
const copiedStateLink = ref(false)
const copiedPreviewState = ref(false)
const copiedRunReport = ref(false)
const copiedEventRepro = ref(false)
const copiedTestPlan = ref(false)
const copiedSyncSnapshot = ref(false)
const copiedCoverageManifest = ref(false)
const copiedApiMap = ref(false)
const copiedDiagnostic = ref(false)
const copiedPlaygroundLink = ref(false)
let copiedPlaygroundLinkResetTimer = 0
const editorPanel = ref<InstanceType<typeof LiveExampleEditorPanel> | null>(null)
const editorScrollTop = ref(0)
const validationError = ref('')
const validationIssue = ref<ValidationIssue | null>(null)
const renderFactory = shallowRef<() => VNodeChild>(() => h('div', 'Preparing live preview...'))
const previewDataTableColumnKeys = ref<string[] | null>(null)
const previewDataTableColumnSource = ref('')
const previewFieldArrayItems = ref<YFieldArrayValue | null>(null)
const previewFieldArraySource = ref('')
const previewFieldArrayIdCounter = ref(0)
const previewCheckboxGroupModel = ref<Array<string | number> | null>(null)
const previewCheckboxGroupSource = ref('')
const previewSchemaFormModel = ref<Record<string, unknown> | null>(null)
const previewSchemaFormSource = ref('')
const previewTransferModel = ref<string[] | null>(null)
const previewTransferSource = ref('')
const previewTabsModel = ref<string | null>(null)
const previewTabsSource = ref('')
const previewCollapseState = ref<{ openPanels: string[]; status: string; statusText: string; workflow: string; accordion: boolean } | null>(null)
const previewCollapseModel = ref<string[] | null>(null)
const previewCollapseSource = ref('')
const previewRateModel = ref<number | null>(null)
const previewRateSource = ref('')
const previewSliderModel = ref<PreviewSliderModel | null>(null)
const previewSliderSource = ref('')
const previewInputModel = ref<PreviewStringModel | null>(null)
const previewInputSource = ref('')
const previewAutocompleteModel = ref<PreviewStringModel | null>(null)
const previewAutocompleteSource = ref('')
const previewMentionModel = ref<PreviewStringModel | null>(null)
const previewMentionSource = ref('')
const previewTextareaModel = ref<PreviewStringModel | null>(null)
const previewTextareaSource = ref('')
const previewInputNumberModel = ref<PreviewInputNumberModel | null>(null)
const previewInputNumberSource = ref('')
const previewColorPickerModel = ref<PreviewStringModel | null>(null)
const previewColorPickerSource = ref('')
const previewDatePickerModel = ref<PreviewStringModel | null>(null)
const previewDatePickerSource = ref('')
const previewTimePickerModel = ref<PreviewStringModel | null>(null)
const previewTimePickerSource = ref('')
const previewDateRangeModel = ref<string[] | null>(null)
const previewDateRangeSource = ref('')
const previewSelectModel = ref<PreviewSelectModel | null>(null)
const previewSelectSource = ref('')
const previewSelectRemoteResolved = ref(false)
const previewAlertState = ref<{ alertAction: string; alertActionLabel: string; alertRole: string; alertTitle: string; alertTone: string; alertVisible: boolean } | null>(null)
const previewDropdownAction = ref<{ dropdownAction: string; dropdownLabel: string; dropdownOpen: boolean } | null>(null)
const previewPopconfirmAction = ref<{ popconfirmAction: string; popconfirmLabel: string; popconfirmOpen: boolean } | null>(null)
const previewModalAction = ref<{ modalAction: string; modalLabel: string; modalOpen: boolean } | null>(null)
const previewDrawerAction = ref<{ drawerAction: string; drawerLabel: string; drawerOpen: boolean; drawerPlacement: string } | null>(null)
const previewEmptyAction = ref<{ emptyAction: string; emptyLabel: string; emptyScenario: string; emptyTitle: string; emptyDescription: string } | null>(null)
const previewMessageState = ref<{ messagePhase: string; messageTone: string; messageTitle: string; messageVisible: boolean; messageClosable: boolean } | null>(null)
const previewListState = ref<{ status: string; statusText: string; attempt: number; itemCount: number; workflow: string } | null>(null)
const previewDescriptionsState = ref<{ status: string; statusText: string; fieldCount: number; layout: string; workflow: string } | null>(null)
const previewTimelineState = ref<{ status: string; statusText: string; stepCount: number; failedStep: string; reverse: boolean; workflow: string } | null>(null)
const previewStatisticState = ref<{ status: string; statusText: string; value: number | null; tone: string; workflow: string } | null>(null)
const previewPaginationState = ref<{ page: number; pageSize: number; total: number; visibleRange: string; workflow: string } | null>(null)
const previewProgressState = ref<{ progressAttempt: number; progressLabel: string; progressPhase: string; progressTone: string; progressValue: number } | null>(null)
const previewResultAction = ref<{ resultAction: string; resultLabel: string; resultStatus: string; resultTitle: string } | null>(null)
const previewSkeletonState = ref<{ skeletonPhase: string; skeletonLabel: string; skeletonScenario: string; skeletonAttempt: number } | null>(null)
const previewPopoverOpen = ref<boolean | null>(null)
const previewTooltipOpen = ref<boolean | null>(null)
const previewImageOpen = ref(false)
const previewCascaderModel = ref<PreviewCascaderModel | null>(null)
const previewCascaderSource = ref('')
const previewUploadFiles = ref<PreviewUploadModel | null>(null)
const previewUploadRejectedFiles = ref<PreviewUploadRejectedFile[] | null>(null)
const previewUploadSource = ref('')
const previewCheckboxModel = ref<PreviewBooleanModel | null>(null)
const previewCheckboxSource = ref('')
const previewRadioGroupModel = ref<PreviewRadioModel | null>(null)
const previewRadioGroupSource = ref('')
const previewSwitchModel = ref<PreviewBooleanModel | null>(null)
const previewSwitchSource = ref('')
const previewStepsState = ref<{ currentStep: number; status: string; statusText: string; workflow: string } | null>(null)
const previewStepsCurrent = ref<number | null>(null)
const previewStepsSource = ref('')
const previewTourOpen = ref<boolean | null>(null)
const previewTourCurrent = ref<number | null>(null)
const previewTourSource = ref('')
const previewPaginationPage = ref<number | null>(null)
const previewPaginationPageSize = ref<number | null>(null)
const previewPaginationSource = ref('')
const previewTreeSelectedKey = ref<string | null>(null)
const previewTreeExpandedKeys = ref<string[] | null>(null)
const previewTreeCheckedKeys = ref<string[] | null>(null)
const previewTreeSource = ref('')
const previewTableSelectedRowKeys = ref<string[] | null>(null)
const previewTableFilters = ref<YTableFilterState | null>(null)
const previewTableSortKey = ref<string | null>(null)
const previewTableSortOrder = ref<YTableSortOrder | undefined>(undefined)
const previewTableSource = ref('')
const previewTableWorkflowSnapshot = ref<{
  selectedRowKeys: string[]
  filters: YTableFilterState
  sortKey: string
  sortOrder: YTableSortOrder
} | null>(null)
const previewStateSnapshot = computed(() => {
  if (previewCheckboxGroupModel.value) {
    return JSON.stringify(previewCheckboxGroupModel.value, null, 2)
  }

  if (previewSchemaFormModel.value) {
    return JSON.stringify(previewSchemaFormModel.value, null, 2)
  }

  if (previewFieldArrayItems.value) {
    return JSON.stringify(previewFieldArrayItems.value, null, 2)
  }

  if (previewTransferModel.value) {
    return JSON.stringify(previewTransferModel.value, null, 2)
  }

  if (previewTabsModel.value !== null) {
    return JSON.stringify({
      activeTab: previewTabsModel.value
    }, null, 2)
  }

  if (previewCollapseState.value !== null) {
    return JSON.stringify(previewCollapseState.value, null, 2)
  }

  if (previewCollapseModel.value) {
    return JSON.stringify({
      openPanels: previewCollapseModel.value
    }, null, 2)
  }

  if (previewRateModel.value !== null) {
    return JSON.stringify({
      rating: previewRateModel.value
    }, null, 2)
  }

  if (previewSliderModel.value !== null) {
    return JSON.stringify({
      slider: previewSliderModel.value
    }, null, 2)
  }

  if (previewInputModel.value !== null) {
    return JSON.stringify({
      input: previewInputModel.value
    }, null, 2)
  }

  if (previewAutocompleteModel.value !== null) {
    return JSON.stringify({
      autocomplete: previewAutocompleteModel.value
    }, null, 2)
  }

  if (previewMentionModel.value !== null) {
    return JSON.stringify({
      mention: previewMentionModel.value
    }, null, 2)
  }

  if (previewTextareaModel.value !== null) {
    return JSON.stringify({
      textarea: previewTextareaModel.value
    }, null, 2)
  }

  if (previewInputNumberModel.value !== null) {
    return JSON.stringify({
      number: previewInputNumberModel.value
    }, null, 2)
  }

  if (previewColorPickerModel.value !== null) {
    return JSON.stringify({
      color: previewColorPickerModel.value
    }, null, 2)
  }

  if (previewDatePickerModel.value !== null) {
    return JSON.stringify({
      date: previewDatePickerModel.value
    }, null, 2)
  }

  if (previewTimePickerModel.value !== null) {
    return JSON.stringify({
      time: previewTimePickerModel.value
    }, null, 2)
  }

  if (previewDateRangeModel.value !== null) {
    return JSON.stringify({
      dateRange: previewDateRangeModel.value
    }, null, 2)
  }

  if (previewSelectModel.value !== null) {
    return JSON.stringify({
      select: previewSelectModel.value
    }, null, 2)
  }

  if (previewAlertState.value !== null) {
    return JSON.stringify(previewAlertState.value, null, 2)
  }

  if (previewDropdownAction.value !== null) {
    return JSON.stringify(previewDropdownAction.value, null, 2)
  }

  if (previewPopconfirmAction.value !== null) {
    return JSON.stringify(previewPopconfirmAction.value, null, 2)
  }

  if (previewModalAction.value !== null) {
    return JSON.stringify(previewModalAction.value, null, 2)
  }

  if (previewDrawerAction.value !== null) {
    return JSON.stringify(previewDrawerAction.value, null, 2)
  }

  if (previewEmptyAction.value !== null) {
    return JSON.stringify(previewEmptyAction.value, null, 2)
  }

  if (previewMessageState.value !== null) {
    return JSON.stringify(previewMessageState.value, null, 2)
  }

  if (previewListState.value !== null) {
    return JSON.stringify(previewListState.value, null, 2)
  }

  if (previewDescriptionsState.value !== null) {
    return JSON.stringify(previewDescriptionsState.value, null, 2)
  }

  if (previewTimelineState.value !== null) {
    return JSON.stringify(previewTimelineState.value, null, 2)
  }

  if (previewStatisticState.value !== null) {
    return JSON.stringify(previewStatisticState.value, null, 2)
  }

  if (previewPaginationState.value !== null) {
    return JSON.stringify(previewPaginationState.value, null, 2)
  }

  if (previewProgressState.value !== null) {
    return JSON.stringify(previewProgressState.value, null, 2)
  }

  if (previewResultAction.value !== null) {
    return JSON.stringify(previewResultAction.value, null, 2)
  }

  if (previewSkeletonState.value !== null) {
    return JSON.stringify(previewSkeletonState.value, null, 2)
  }

  if (previewPopoverOpen.value !== null) {
    return JSON.stringify({
      popoverOpen: previewPopoverOpen.value
    }, null, 2)
  }

  if (previewTooltipOpen.value !== null) {
    return JSON.stringify({
      tooltipOpen: previewTooltipOpen.value
    }, null, 2)
  }

  if (previewCascaderModel.value !== null) {
    return JSON.stringify({
      cascader: previewCascaderModel.value
    }, null, 2)
  }

  if (previewUploadFiles.value !== null || previewUploadRejectedFiles.value !== null) {
    return JSON.stringify({
      files: (previewUploadFiles.value ?? []).map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        ...(file.type ? { type: file.type } : {}),
        ...(file.status ? { status: file.status } : {}),
        ...(file.progress !== undefined ? { progress: file.progress } : {}),
        ...(file.message ? { message: file.message } : {}),
        ...(file.url ? { url: file.url } : {}),
        ...(file.thumbUrl ? { thumbUrl: file.thumbUrl } : {})
      })),
      ...((previewUploadRejectedFiles.value?.length ?? 0) > 0
        ? {
            rejected: previewUploadRejectedFiles.value?.map((file) => ({
              name: file.name,
              size: file.size,
              ...(file.type ? { type: file.type } : {}),
              reason: file.reason,
              ...(file.message ? { message: file.message } : {})
            }))
          }
        : {})
    }, null, 2)
  }

  if (previewCheckboxModel.value !== null) {
    return JSON.stringify({
      checkbox: previewCheckboxModel.value
    }, null, 2)
  }

  if (previewRadioGroupModel.value !== null) {
    return JSON.stringify({
      radioGroup: previewRadioGroupModel.value
    }, null, 2)
  }

  if (previewSwitchModel.value !== null) {
    return JSON.stringify({
      switch: previewSwitchModel.value
    }, null, 2)
  }

  if (previewStepsState.value !== null) {
    return JSON.stringify(previewStepsState.value, null, 2)
  }

  if (previewStepsCurrent.value !== null) {
    return JSON.stringify({
      currentStep: previewStepsCurrent.value
    }, null, 2)
  }

  if (previewTourOpen.value !== null || previewTourCurrent.value !== null) {
    return JSON.stringify({
      tourOpen: previewTourOpen.value ?? false,
      currentStep: previewTourCurrent.value ?? 0
    }, null, 2)
  }

  if (previewPaginationPage.value !== null) {
    return JSON.stringify({
      page: previewPaginationPage.value,
      ...(previewPaginationPageSize.value !== null ? { pageSize: previewPaginationPageSize.value } : {})
    }, null, 2)
  }

  if (previewTreeSelectedKey.value !== null || previewTreeExpandedKeys.value || previewTreeCheckedKeys.value) {
    return JSON.stringify({
      selectedKey: previewTreeSelectedKey.value ?? '',
      expandedKeys: previewTreeExpandedKeys.value ?? [],
      checkedKeys: previewTreeCheckedKeys.value ?? []
    }, null, 2)
  }

  if (previewTableWorkflowSnapshot.value !== null) {
    return JSON.stringify(previewTableWorkflowSnapshot.value, null, 2)
  }

  if (
    previewTableSelectedRowKeys.value !== null ||
    previewTableFilters.value !== null ||
    previewTableSortKey.value !== null ||
    typeof previewTableSortOrder.value !== 'undefined'
  ) {
    return JSON.stringify({
      selectedRowKeys: previewTableSelectedRowKeys.value ?? [],
      filters: previewTableFilters.value ?? {},
      sortKey: previewTableSortKey.value ?? '',
      sortOrder: previewTableSortOrder.value ?? null
    }, null, 2)
  }

  return ''
})
const hasPreviewStateSnapshot = computed(() => Boolean(previewStateSnapshot.value))
const PreviewHost = defineComponent({
  name: 'YokLiveExampleHost',
  setup() {
    return () => h(YThemeProvider, {
      theme: selectedTheme.value,
      tokens: selectedThemeTokens.value
    }, () => h(Fragment, null, renderFactory.value()))
  }
})
const RunnerModalPreview = defineComponent({
  name: 'RunnerModalPreview',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: 'Modal preview' },
    description: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () => {
      if (!props.open) {
        return h('section', { class: 'live-example-runner__overlay-preview live-example-runner__overlay-preview--closed' }, [
          h('strong', `${props.title} is closed`),
          h('p', 'Toggle open in the props panel to render the modal preview.')
        ])
      }

      return h('section', { class: 'live-example-runner__overlay-preview live-example-runner__overlay-preview--modal' }, [
        h('header', [
          h('strong', props.title),
          props.description ? h('p', props.description) : null
        ]),
        h('div', { class: 'live-example-runner__overlay-body' }, slots.default?.())
      ])
    }
  }
})
const RunnerDrawerPreview = defineComponent({
  name: 'RunnerDrawerPreview',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: 'Drawer preview' },
    description: { type: String, default: '' },
    placement: { type: String, default: 'right' }
  },
  setup(props, { slots }) {
    return () => {
      if (!props.open) {
        return h('section', { class: 'live-example-runner__overlay-preview live-example-runner__overlay-preview--closed' }, [
          h('strong', `${props.title} is closed`),
          h('p', 'Toggle open in the props panel to render the drawer preview.')
        ])
      }

      return h('section', {
        class: [
          'live-example-runner__overlay-preview',
          'live-example-runner__overlay-preview--drawer',
          `live-example-runner__overlay-preview--${props.placement}`
        ]
      }, [
        h('header', [
          h('strong', props.title),
          props.description ? h('p', props.description) : null
        ]),
        h('div', { class: 'live-example-runner__overlay-body' }, slots.default?.())
      ])
    }
  }
})
const RunnerBacktopPreview = defineComponent({
  name: 'RunnerBacktopPreview',
  props: {
    right: { type: Number, default: 24 },
    bottom: { type: Number, default: 24 }
  },
  setup(props) {
    return () => h('button', {
      class: 'live-example-runner__backtop-preview',
      type: 'button',
      'aria-label': 'Back to top',
      style: {
        right: `${props.right}px`,
        bottom: `${props.bottom}px`
      }
    }, '↑')
  }
})
const RunnerPopconfirmPreview = defineComponent({
  name: 'RunnerPopconfirmPreview',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    confirmText: { type: String, default: 'Confirm' },
    cancelText: { type: String, default: 'Cancel' }
  },
  setup(props, { slots }) {
    return () => h('span', { class: 'live-example-runner__popconfirm-preview' }, [
      h('span', { class: 'live-example-runner__popconfirm-trigger' }, slots.default?.()),
      props.open
        ? h('span', { class: 'live-example-runner__popconfirm-panel', role: 'dialog', 'aria-label': props.title }, [
            h('strong', props.title),
            props.description ? h('span', props.description) : null,
            h('span', { class: 'live-example-runner__popconfirm-actions' }, [
              h('button', { type: 'button' }, props.cancelText),
              h('button', { type: 'button', class: 'is-confirm' }, props.confirmText)
            ])
        ])
        : null
    ])
  }
})
const RunnerMessagePreview = defineComponent({
  name: 'RunnerMessagePreview',
  props: {
    visible: { type: Boolean, default: true },
    tone: { type: String, default: 'info' },
    title: { type: String, default: '' },
    role: { type: String, default: 'status' },
    closable: { type: Boolean, default: false },
    closeLabel: { type: String, default: 'Close message' }
  },
  setup(props, { slots }) {
    return () => {
      if (!props.visible) {
        return h('section', { class: 'live-example-runner__overlay-preview live-example-runner__overlay-preview--closed' }, [
          h('strong', `${props.title || 'Message'} is closed`),
          h('p', 'Trigger the workflow actions to show, update, or dismiss the message preview.')
        ])
      }

      return h(YMessage, {
        tone: props.tone as 'info' | 'success' | 'warning' | 'danger',
        title: props.title,
        role: props.role as 'status' | 'alert',
        closable: props.closable,
        closeLabel: props.closeLabel
      }, slots.default)
    }
  }
})
const RunnerMessageBoxPreview = defineComponent({
  name: 'RunnerMessageBoxPreview',
  props: {
    open: { type: Boolean, default: true },
    title: { type: String, default: 'Message Box preview' },
    message: { type: String, default: '' },
    tone: { type: String, default: 'info' },
    variant: { type: String, default: 'alert' },
    confirmText: { type: String, default: 'OK' },
    cancelText: { type: String, default: 'Cancel' },
    promptLabel: { type: String, default: 'Input' },
    promptValue: { type: String, default: '' },
    promptError: { type: String, default: '' },
    loading: { type: Boolean, default: false }
  },
  setup(props) {
    return () => {
      if (!props.open) {
        return h('section', { class: 'live-example-runner__overlay-preview live-example-runner__overlay-preview--closed' }, [
          h('strong', `${props.title} is closed`),
          h('p', 'Toggle open in the source or props panel to render the message box preview.')
        ])
      }

      return h('section', {
        class: [
          'live-example-runner__overlay-preview',
          'live-example-runner__overlay-preview--modal',
          `live-example-runner__overlay-preview--${props.tone}`
        ],
        role: props.variant === 'alert' && props.tone !== 'danger' ? 'dialog' : 'alertdialog',
        'aria-modal': 'true',
        'aria-label': props.title
      }, [
        h('header', [
          h('strong', props.title),
          props.message ? h('p', props.message) : null
        ]),
        props.variant === 'prompt'
          ? h('label', { class: 'live-example-runner__overlay-field' }, [
              h('span', props.promptLabel),
              h('input', {
                value: props.promptValue,
                'aria-invalid': props.promptError ? 'true' : 'false',
                readonly: true
              }),
              props.promptError ? h('small', { role: 'alert' }, props.promptError) : null
            ])
          : null,
        h('footer', { class: 'live-example-runner__overlay-actions' }, [
          props.variant !== 'alert' ? h('button', { type: 'button' }, props.cancelText) : null,
          h('button', {
            type: 'button',
            class: 'is-confirm',
            disabled: props.loading,
            'aria-busy': props.loading ? 'true' : 'false'
          }, props.loading ? `${props.confirmText}...` : props.confirmText)
        ])
      ])
    }
  }
})
const RunnerAlertPreview = defineComponent({
  name: 'RunnerAlertPreview',
  props: {
    actionLabel: { type: String, default: '' },
    banner: { type: Boolean, default: false },
    closeLabel: { type: String, default: 'Close alert' },
    closeText: { type: String, default: '' },
    closable: { type: Boolean, default: false },
    icon: { type: String, default: '' },
    role: { type: String, default: 'status' },
    showIcon: { type: Boolean, default: true },
    size: { type: String, default: 'md' },
    title: { type: String, default: '' },
    tone: { type: String, default: 'info' },
    variant: { type: String, default: 'soft' },
    visible: { type: Boolean, default: true }
  },
  setup(props, { slots }) {
    return () => {
      if (!props.visible) {
        return h('section', {
          class: 'live-example-runner__alert-preview live-example-runner__alert-preview--dismissed',
          role: 'status'
        }, [
          h('strong', 'Alert dismissed'),
          h('p', 'Use the workflow controls to restore the inline alert and replay the close path.')
        ])
      }

      return h('section', {
        class: 'live-example-runner__alert-preview',
        role: 'presentation'
      }, [
        h(YAlert, {
          banner: props.banner,
          closeLabel: props.closeLabel,
          closeText: props.closeText,
          closable: props.closable,
          icon: props.icon,
          role: props.role as 'status' | 'alert',
          showIcon: props.showIcon,
          size: props.size as 'sm' | 'md' | 'lg',
          title: props.title,
          tone: props.tone as 'info' | 'success' | 'warning' | 'danger',
          variant: props.variant as 'soft' | 'outline' | 'solid'
        }, {
          default: slots.default,
          ...(props.actionLabel
            ? {
                action: () => h('button', {
                  class: 'live-example-runner__alert-action',
                  type: 'button'
                }, props.actionLabel)
              }
            : {})
        })
      ])
    }
  }
})
const RunnerResultPreview = defineComponent({
  name: 'RunnerResultPreview',
  props: {
    status: { type: String, default: 'info' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    ariaLabel: { type: String, default: 'Result' }
  },
  setup(props, { slots }) {
    return () => h(YResult, {
      status: props.status as 'success' | 'info' | 'warning' | 'danger' | '403' | '404' | '500',
      title: props.title,
      subtitle: props.subtitle,
      ariaLabel: props.ariaLabel
    }, slots.default)
  }
})
const RunnerSkeletonPreview = defineComponent({
  name: 'RunnerSkeletonPreview',
  props: {
    variant: { type: String, default: 'text' },
    size: { type: String, default: 'md' },
    rows: { type: Number, default: 1 },
    animated: { type: Boolean, default: true },
    width: { type: String, default: '' },
    height: { type: String, default: '' },
    label: { type: String, default: '' },
    phase: { type: String, default: 'loading' },
    workflowLabel: { type: String, default: 'Loading component detail' }
  },
  setup(props) {
    return () => {
      if (props.phase === 'resolved') {
        const resolvedClass = [
          'live-example-runner__skeleton-preview',
          `live-example-runner__skeleton-preview--${props.variant}`
        ]

        return h('section', {
          class: resolvedClass,
          role: 'status',
          'aria-label': 'Skeleton content resolved'
        }, [
          h('strong', 'Loaded component detail'),
          h('span', props.workflowLabel),
          props.variant === 'circle'
            ? h('em', 'YK')
            : props.variant === 'rect'
              ? h('p', 'Preview card content is now available.')
              : h('p', 'Component title, maintainer and summary loaded from the remote request.')
        ])
      }

      if (props.phase === 'timeout') {
        return h('section', {
          class: 'live-example-runner__skeleton-preview live-example-runner__skeleton-preview--timeout',
          role: 'alert'
        }, [
          h('strong', 'Loading timed out'),
          h('p', 'The request exceeded the visible skeleton window. Retry or show a persistent error state.')
        ])
      }

      return h(YSkeleton, {
        variant: props.variant as 'text' | 'circle' | 'rect',
        size: props.size as 'sm' | 'md' | 'lg',
        rows: props.rows,
        animated: props.animated,
        width: props.width,
        height: props.height,
        label: props.label || props.workflowLabel
      })
    }
  }
})
const RunnerImagePreview = defineComponent({
  name: 'RunnerImagePreview',
  props: {
    alt: { type: String, default: '' },
    fit: { type: String, default: 'cover' },
    height: { type: String, default: 'auto' },
    initialIndex: { type: Number, default: 0 },
    lazy: { type: Boolean, default: false },
    preview: { type: Boolean, default: false },
    radius: { type: String, default: 'var(--yok-radius-lg)' },
    src: { type: String, default: '' },
    width: { type: String, default: '100%' }
  },
  emits: ['preview-open', 'preview-close', 'update:previewOpen'],
  setup(props, { emit, slots }) {
    function setPreviewOpen(open: boolean) {
      previewImageOpen.value = open
      emit('update:previewOpen', open)
    }

    function handleShellClick(event: Event) {
      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      if (target.closest('[data-image-preview-close]') || target.closest('.yok-image-preview__backdrop')) {
        if (previewImageOpen.value) {
          setPreviewOpen(false)
          emit('preview-close')
        }
        return
      }

      if (props.preview && target.closest('.yok-image__button')) {
        setPreviewOpen(true)
        emit('preview-open', props.initialIndex)
      }
    }

    return () => h('div', {
      class: 'live-example-runner__image-preview-shell',
      onClick: handleShellClick
    }, [
      h(YImage, {
        alt: props.alt,
        fit: props.fit as 'fill' | 'contain' | 'cover' | 'none' | 'scale-down',
        height: props.height,
        initialIndex: props.initialIndex,
        lazy: props.lazy,
        preview: props.preview,
        previewOpen: props.preview ? previewImageOpen.value : null,
        radius: props.radius,
        src: props.src,
        width: props.width,
        'onUpdate:previewOpen': (open: boolean) => {
          previewImageOpen.value = open
          emit('update:previewOpen', open)
        },
        onPreviewOpen: (index: number) => {
          previewImageOpen.value = true
          emit('preview-open', index)
        },
        onPreviewClose: () => {
          previewImageOpen.value = false
          emit('preview-close')
        }
      }, slots)
    ])
  }
})
const RunnerProgressPreview = defineComponent({
  name: 'RunnerProgressPreview',
  props: {
    label: { type: String, default: 'Progress' },
    phase: { type: String, default: '' },
    showValue: { type: Boolean, default: true },
    size: { type: String, default: 'md' },
    striped: { type: Boolean, default: false },
    tone: { type: String, default: 'primary' },
    value: { type: Number, default: 0 }
  },
  setup(props) {
    return () => h('section', {
      class: [
        'live-example-runner__progress-preview',
        props.phase ? `live-example-runner__progress-preview--${props.phase}` : ''
      ],
      role: 'group',
      'aria-label': `${props.label} workflow`
    }, [
      h(YProgress, {
        label: props.label,
        showValue: props.showValue,
        size: props.size as 'sm' | 'md' | 'lg',
        striped: props.striped,
        tone: props.tone as 'primary' | 'success' | 'warning' | 'danger',
        value: props.value
      }),
      props.phase
        ? h('p', {
            class: 'live-example-runner__progress-status',
            role: props.phase === 'failed' ? 'alert' : 'status'
          }, props.phase === 'complete'
            ? 'Package installed'
            : props.phase === 'failed'
              ? 'Dependency install failed'
              : props.phase === 'retrying'
                ? 'Retrying package install'
                : 'Installing package')
        : null
    ])
  }
})
const RunnerPaginationPreview = defineComponent({
  name: 'RunnerPaginationPreview',
  props: {
    ariaLabel: { type: String, default: 'Pagination preview' },
    disabled: { type: Boolean, default: false },
    hideOnSinglePage: { type: Boolean, default: false },
    nextText: { type: String, default: 'Next' },
    page: { type: Number, default: 1 },
    pageSize: { type: Number, default: 10 },
    previousText: { type: String, default: 'Previous' },
    siblingCount: { type: Number, default: 1 },
    total: { type: Number, default: 0 }
  },
  emits: ['update:page', 'change'],
  setup(props, { emit }) {
    const getVisibleRows = () => {
      const total = Math.max(0, props.total)
      const pageSize = Math.max(1, props.pageSize)
      const pageCount = Math.max(1, Math.ceil(total / pageSize))
      const page = Math.min(Math.max(1, props.page), pageCount)
      const start = total === 0 ? 0 : (page - 1) * pageSize + 1
      const end = Math.min(total, page * pageSize)

      return {
        end,
        rows: Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index),
        start,
        total
      }
    }

    return () => {
      const visible = getVisibleRows()

      return h('section', {
        class: 'live-example-runner__pagination-preview',
        role: 'group',
        'aria-label': `${props.ariaLabel} workflow`
      }, [
        h('header', { class: 'live-example-runner__pagination-preview-header' }, [
          h('strong', 'Paged component results'),
          h('span', visible.total === 0 ? '0 results' : `${visible.start}-${visible.end} of ${visible.total}`)
        ]),
        h('ol', { class: 'live-example-runner__pagination-preview-list' }, visible.rows.map((row) =>
          h('li', { key: row }, [
            h('span', `Component ${row}`),
            h('small', row % 3 === 0 ? 'Documented' : row % 2 === 0 ? 'Stable' : 'Review')
          ])
        )),
        h(YPagination, {
          ariaLabel: props.ariaLabel,
          disabled: props.disabled,
          hideOnSinglePage: props.hideOnSinglePage,
          nextText: props.nextText,
          page: props.page,
          pageSize: props.pageSize,
          previousText: props.previousText,
          siblingCount: props.siblingCount,
          total: props.total,
          'onUpdate:page': (page: number) => emit('update:page', page),
          onChange: (page: number) => emit('change', page)
        })
      ])
    }
  }
})
const RunnerListPreview = defineComponent({
  name: 'RunnerListPreview',
  props: {
    ariaLabel: { type: String, default: 'List preview' },
    bordered: { type: Boolean, default: false },
    columns: { type: Number, default: 1 },
    description: { type: String, default: '' },
    emptyText: { type: String, default: 'No checklist items' },
    items: { type: Array as () => Array<Record<string, unknown>>, default: () => fallbackListItems },
    layout: { type: String, default: 'horizontal' },
    loading: { type: Boolean, default: false },
    size: { type: String, default: 'md' },
    title: { type: String, default: 'Release checklist' },
    workflowStatus: { type: String, default: '' },
    workflowStatusText: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () => h('section', {
      class: [
        'live-example-runner__list-preview',
        props.workflowStatus ? `live-example-runner__list-preview--${props.workflowStatus}` : ''
      ],
      role: 'group',
      'aria-label': `${props.ariaLabel} workflow`
    }, [
      props.workflowStatusText
        ? h('p', {
            class: 'live-example-runner__list-status',
            role: props.workflowStatus === 'empty' ? 'alert' : 'status'
          }, props.workflowStatusText)
        : null,
      h(YList, {
        ariaLabel: props.ariaLabel,
        bordered: props.bordered,
        columns: props.columns,
        description: props.description,
        emptyText: props.emptyText,
        items: props.items,
        layout: props.layout as 'horizontal' | 'vertical',
        loading: props.loading,
        size: props.size as 'sm' | 'md' | 'lg',
        title: props.title
      }, slots)
    ])
  }
})
const RunnerDescriptionsPreview = defineComponent({
  name: 'RunnerDescriptionsPreview',
  props: {
    ariaLabel: { type: String, default: 'Descriptions' },
    bordered: { type: Boolean, default: false },
    column: { type: Number, default: 3 },
    description: { type: String, default: '' },
    emptyText: { type: String, default: 'No details yet' },
    items: { type: Array as () => Array<Record<string, unknown>>, default: () => fallbackDescriptionItems },
    layout: { type: String, default: 'horizontal' },
    size: { type: String, default: 'md' },
    title: { type: String, default: 'Component details' },
    workflowStatus: { type: String, default: '' },
    workflowStatusText: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () => h('section', {
      class: [
        'live-example-runner__descriptions-preview',
        props.workflowStatus ? `live-example-runner__descriptions-preview--${props.workflowStatus}` : ''
      ],
      role: 'group',
      'aria-label': `${props.ariaLabel} workflow`
    }, [
      props.workflowStatusText
        ? h('p', {
            class: 'live-example-runner__descriptions-status',
            role: props.workflowStatus === 'empty' ? 'alert' : 'status'
          }, props.workflowStatusText)
        : null,
      h(YDescriptions, {
        ariaLabel: props.ariaLabel,
        bordered: props.bordered,
        column: props.column,
        description: props.description,
        emptyText: props.emptyText,
        items: props.items,
        layout: props.layout as 'horizontal' | 'vertical',
        size: props.size as 'md' | 'sm',
        title: props.title
      }, slots)
    ])
  }
})
const RunnerTimelinePreview = defineComponent({
  name: 'RunnerTimelinePreview',
  props: {
    ariaLabel: { type: String, default: 'Timeline' },
    description: { type: String, default: '' },
    items: { type: Array as () => Array<Record<string, unknown>>, default: () => fallbackTimelineItems },
    placement: { type: String, default: 'right' },
    reverse: { type: Boolean, default: false },
    size: { type: String, default: 'md' },
    title: { type: String, default: 'Release activity' },
    workflowStatus: { type: String, default: '' },
    workflowStatusText: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () => h('section', {
      class: [
        'live-example-runner__timeline-preview',
        props.workflowStatus ? `live-example-runner__timeline-preview--${props.workflowStatus}` : ''
      ],
      role: 'group',
      'aria-label': `${props.ariaLabel} workflow`
    }, [
      props.workflowStatusText
        ? h('p', {
            class: 'live-example-runner__timeline-status',
            role: props.workflowStatus === 'failed' ? 'alert' : 'status'
          }, props.workflowStatusText)
        : null,
      h(YTimeline, {
        ariaLabel: props.ariaLabel,
        description: props.description,
        items: props.items,
        placement: props.placement as 'left' | 'right' | 'alternate',
        reverse: props.reverse,
        size: props.size as 'md' | 'sm',
        title: props.title
      }, slots)
    ])
  }
})
const RunnerStatisticPreview = defineComponent({
  name: 'RunnerStatisticPreview',
  props: {
    ariaLabel: { type: String, default: 'Statistic' },
    decimalSeparator: { type: String, default: '.' },
    groupSeparator: { type: String, default: ',' },
    loading: { type: Boolean, default: false },
    precision: { type: Number, default: undefined },
    prefix: { type: String, default: '' },
    suffix: { type: String, default: '' },
    title: { type: String, default: 'Active users' },
    tone: { type: String, default: 'neutral' },
    value: { type: [Number, String] as PropType<string | number | null | undefined>, default: undefined },
    workflowStatus: { type: String, default: '' },
    workflowStatusText: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () => h('section', {
      class: [
        'live-example-runner__statistic-preview',
        props.workflowStatus ? `live-example-runner__statistic-preview--${props.workflowStatus}` : ''
      ],
      role: 'group',
      'aria-label': `${props.ariaLabel} workflow`
    }, [
      props.workflowStatusText
        ? h('p', {
            class: 'live-example-runner__statistic-status',
            role: props.workflowStatus === 'warning' ? 'alert' : 'status'
          }, props.workflowStatusText)
        : null,
      h(YStatistic, {
        ariaLabel: props.ariaLabel,
        decimalSeparator: props.decimalSeparator,
        groupSeparator: props.groupSeparator,
        loading: props.loading,
        precision: props.precision,
        prefix: props.prefix,
        suffix: props.suffix,
        title: props.title,
        tone: props.tone as 'neutral' | 'success' | 'warning' | 'danger' | 'info',
        value: props.value
      }, slots)
    ])
  }
})
const RunnerStepsPreview = defineComponent({
  name: 'RunnerStepsPreview',
  props: {
    ariaLabel: { type: String, default: 'Steps' },
    current: { type: Number, default: 0 },
    direction: { type: String, default: 'horizontal' },
    items: { type: Array as () => Array<Record<string, unknown>>, default: () => fallbackStepItems },
    selectable: { type: Boolean, default: false },
    workflowStatus: { type: String, default: '' },
    workflowStatusText: { type: String, default: '' }
  },
  emits: ['select'],
  setup(props, { emit }) {
    return () => h('section', {
      class: [
        'live-example-runner__steps-preview',
        props.workflowStatus ? `live-example-runner__steps-preview--${props.workflowStatus}` : ''
      ],
      role: 'group',
      'aria-label': `${props.ariaLabel} workflow`
    }, [
      h(YSteps, {
        ariaLabel: props.ariaLabel,
        current: props.current,
        direction: props.direction as 'horizontal' | 'vertical',
        items: props.items,
        selectable: props.selectable,
        onSelect: (item: unknown, index: number) => emit('select', item, index)
      }),
      props.workflowStatusText
        ? h('p', {
            class: 'live-example-runner__steps-status',
            role: props.workflowStatus === 'blocked' ? 'alert' : 'status'
          }, props.workflowStatusText)
        : null
    ])
  }
})
const RunnerCollapsePreview = defineComponent({
  name: 'RunnerCollapsePreview',
  props: {
    accordion: { type: Boolean, default: false },
    items: { type: Array as () => typeof fallbackCollapseItems, default: () => fallbackCollapseItems },
    modelValue: { type: Array as () => string[], default: () => [] },
    workflowStatus: { type: String, default: '' },
    workflowStatusText: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () => h('section', {
      class: [
        'live-example-runner__collapse-preview',
        props.workflowStatus ? `live-example-runner__collapse-preview--${props.workflowStatus}` : ''
      ],
      role: 'group',
      'aria-label': 'Collapse workflow'
    }, [
      h(YCollapse, {
        accordion: props.accordion,
        items: props.items,
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value: string[]) => emit('update:modelValue', value),
        onChange: (value: string[]) => emit('change', value)
      }),
      props.workflowStatusText
        ? h('p', {
            class: 'live-example-runner__collapse-status',
            role: props.workflowStatus === 'locked' ? 'alert' : 'status'
          }, props.workflowStatusText)
        : null
    ])
  }
})
const RunnerCommandPalettePreview = defineComponent({
  name: 'RunnerCommandPalettePreview',
  props: {
    commands: { type: Array as () => typeof fallbackCommands, default: () => fallbackCommands }
  },
  setup(props) {
    return () => h('section', {
      class: 'live-example-runner__command-preview',
      role: 'dialog',
      'aria-label': 'Command palette preview'
    }, [
      h('div', { class: 'live-example-runner__command-input' }, 'Search commands'),
      h('div', { class: 'live-example-runner__command-list', role: 'listbox' }, props.commands.map((command, index) =>
        h('button', {
          key: command.id,
          type: 'button',
          role: 'option',
          'aria-selected': index === 0 ? 'true' : 'false',
          class: [
            'live-example-runner__command-item',
            { 'live-example-runner__command-item--active': index === 0 }
          ]
        }, command.label)
      ))
    ])
  }
})

const componentMap = {
  yaffix: YAffix,
  yanchor: YAnchor,
  yalert: RunnerAlertPreview,
  yautocomplete: YAutocomplete,
  yavatar: YAvatar,
  yavatargroup: YAvatarGroup,
  ybacktop: RunnerBacktopPreview,
  ybadge: YBadge,
  ybreadcrumb: YBreadcrumb,
  ybutton: YButton,
  ycard: YCard,
  ycascader: YCascader,
  ycalendar: YCalendar,
  ycarousel: YCarousel,
  ycheckbox: YCheckbox,
  ycheckboxgroup: YCheckboxGroup,
  ycodeblock: YCodeBlock,
  ycollapse: RunnerCollapsePreview,
  ycolorpicker: YColorPicker,
  yconfigprovider: YConfigProvider,
  ycountdown: YCountdown,
  ycommandpalette: RunnerCommandPalettePreview,
  ycopybutton: YCopyButton,
  ydatepicker: YDatePicker,
  ydaterangepicker: YDateRangePicker,
  ydescriptions: RunnerDescriptionsPreview,
  ydivider: YDivider,
  ydropdown: YDropdown,
  ydrawer: RunnerDrawerPreview,
  yempty: YEmpty,
  yfloatbutton: YFloatButton,
  yfloatbuttongroup: YFloatButtonGroup,
  yform: YForm,
  yformitem: YFormItem,
  yformsummary: YFormSummary,
  yicon: YIcon,
  yinput: YInput,
  yinputnumber: YInputNumber,
  yaside: YAside,
  yfooter: YFooter,
  yheader: YHeader,
  ylayout: YLayout,
  ymain: YMain,
  ylink: YLink,
  yloading: YLoading,
  ylist: RunnerListPreview,
  ymenu: YMenu,
  ymention: YMention,
  ymessage: RunnerMessagePreview,
  ymessagebox: RunnerMessageBoxPreview,
  ynotification: YNotification,
  ymodal: RunnerModalPreview,
  ypagination: RunnerPaginationPreview,
  ypopconfirm: RunnerPopconfirmPreview,
  ypopover: YPopover,
  yprogress: RunnerProgressPreview,
  yqrcode: YQRCode,
  yradiogroup: YRadioGroup,
  yrate: YRate,
  yresult: RunnerResultPreview,
  yscrollbar: YScrollbar,
  ysegmented: YSegmented,
  yselect: YSelect,
  ytreeselect: YTreeSelect,
  yskeleton: RunnerSkeletonPreview,
  yimage: RunnerImagePreview,
  yspace: YSpace,
  yslider: YSlider,
  ysplitter: YSplitter,
  ystatistic: RunnerStatisticPreview,
  ysteps: RunnerStepsPreview,
  yswitch: YSwitch,
  ytable: YTable,
  ytabs: YTabs,
  ytextarea: YTextarea,
  ytext: YText,
  ythemeprovider: YThemeProvider,
  ythemeswitcher: YThemeSwitcher,
  ytimeline: RunnerTimelinePreview,
  ytour: YTour,
  ytimepicker: YTimePicker,
  ytag: YTag,
  ytooltip: YTooltip,
  ytransfer: YTransfer,
  ytree: YTree,
  yupload: YUpload,
  yvirtuallist: YVirtualList,
  ywatermark: YWatermark,
  ybrandhero: YBrandHero,
  yfeaturegrid: YFeatureGrid,
  ylogocloud: YLogoCloud,
  yprofilecard: YProfileCard,
  ypageheader: YPageHeader,
  ymetriccard: YMetricCard,
  ysearchpanel: YSearchPanel,
  ysearchform: YSearchForm,
  ycrudlayout: YCrudLayout,
  yfiltertabs: YFilterTabs,
  ydatatable: YDataTable,
  ydataview: YDataView,
  yresourcepage: YResourcePage,
  yschemaform: YSchemaForm,
  yfieldarray: YFieldArray,
  yapprovalcommentbox: YApprovalCommentBox,
  ybulkactionbar: YBulkActionBar,
  ybulkactionmenu: YBulkActionMenu,
  ystatustimeline: YStatusTimeline,
  yreviewworkflow: YReviewWorkflow,
  ysavedviewmanager: YSavedViewManager,
  ysavedviews: YSavedViews,
  ydatatoolbar: YDataToolbar
}

function extractTemplate(code: string) {
  const openMatch = code.match(/<template>/i)

  if (!openMatch || typeof openMatch.index !== 'number') {
    return code.trim()
  }

  const contentStartIndex = openMatch.index + openMatch[0].length
  const contentEndIndex = code.toLowerCase().lastIndexOf('</template>')

  if (contentEndIndex <= contentStartIndex) {
    return code.trim()
  }

  return code.slice(contentStartIndex, contentEndIndex).trim()
}

function normalizeTemplate(template: string) {
  const expandedTemplate = template.replace(/<(Y[A-Z][\w]*)([^>]*)\/>/g, '<$1$2></$1>')

  return expandedTemplate
    .replace(/<\/(Y[A-Z][\w]*)>/g, (_match, tagName: string) => `</${tagName.toLowerCase()}>`)
    .replace(/<(Y[A-Z][\w]*)(?=[\s>])/g, (_match, tagName: string) => `<${tagName.toLowerCase()}`)
}

function getLineNumber(value: string, index: number) {
  return value.slice(0, Math.max(index, 0)).split('\n').length
}

function getTemplateStartLine(code: string) {
  const match = code.match(/<template>/i)

  if (!match || typeof match.index !== 'number') {
    return 1
  }

  const contentStartIndex = match.index + match[0].length
  const tagLine = code.slice(0, contentStartIndex).split('\n').length

  return code[contentStartIndex] === '\n' ? tagLine + 1 : tagLine
}

function getLineExcerpt(value: string, line: number) {
  return value.split('\n')[Math.max(line - 1, 0)]?.trim() ?? ''
}

function createValidationIssue(
  kind: ValidationIssue['kind'],
  template: string,
  index: number,
  templateStartLine: number,
  fallbackExcerpt: string,
  suggestion: string
) {
  const templateLine = getLineNumber(template, index)

  return {
    kind,
    templateLine,
    sourceLine: templateStartLine + templateLine - 1,
    excerpt: getLineExcerpt(template, templateLine) || fallbackExcerpt,
    suggestion
  }
}

function validateDocument(template: string, templateStartLine: number) {
  const normalizedTemplate = normalizeTemplate(template)
  const safeValidationTemplate = getSafeValidationTemplate(normalizedTemplate)

  if (!normalizedTemplate) {
    return {
      error: 'Template 不能为空。',
      documentFragment: null,
      issue: {
        kind: 'empty',
        templateLine: 1,
        sourceLine: templateStartLine,
        excerpt: '<template>',
        suggestion: '保留 template 内容，并至少放入一个白名单内的 Yok UI 组件或安全 HTML 标签。'
      } satisfies ValidationIssue
    }
  }

  const blockedMatch = forbiddenPatterns
    .map((pattern) => safeValidationTemplate.match(pattern))
    .find((match): match is RegExpMatchArray => Boolean(match))

  if (blockedMatch) {
    return {
      error: '当前运行器只支持安全的展示模板，不支持脚本、事件处理器、插值表达式或复杂动态表达式。',
      documentFragment: null,
      issue: createValidationIssue(
        'security',
        normalizedTemplate,
        blockedMatch.index ?? 0,
        templateStartLine,
        blockedMatch[0],
        '删除脚本、事件绑定、插值表达式或复杂动态表达式；Live runner 只渲染安全的展示模板。'
      )
    }
  }

  const documentFragment = new DOMParser().parseFromString(`<main>${safeValidationTemplate}</main>`, 'text/html')
  const nodes = Array.from(documentFragment.body.querySelectorAll('*'))

  for (const node of nodes) {
    const tagName = node.tagName.toLowerCase()

    if (!allowedTags.has(tagName) && tagName !== 'main') {
      const tagIndex = normalizedTemplate.toLowerCase().indexOf(`<${tagName}`)

      return {
        error: `暂不支持 <${node.tagName.toLowerCase()}>，请使用白名单内的 Yok UI 示例组件。`,
        documentFragment: null,
        issue: createValidationIssue(
          'tag',
          normalizedTemplate,
          tagIndex,
          templateStartLine,
          `<${tagName}>`,
          '换成白名单内的 Yok UI 组件，或使用 div、span、p、strong、em、code 等安全 HTML 标签。'
        )
      }
    }

    for (const attribute of Array.from(node.attributes)) {
      if (!allowedAttributes.has(attribute.name)) {
        const attributeIndex = normalizedTemplate.toLowerCase().indexOf(attribute.name.toLowerCase())

        return {
          error: `暂不支持属性 ${attribute.name}，请使用运行器白名单内的 props。`,
          documentFragment: null,
          issue: createValidationIssue(
            'attribute',
            normalizedTemplate,
            attributeIndex,
            templateStartLine,
            attribute.name,
            '删除该属性，或改用当前运行器白名单内支持的 props；如需新增 props，可先扩展 allowedAttributes。'
          )
        }
      }
    }
  }

  return {
    error: '',
    documentFragment,
    issue: null
  }
}

function parseLiveExampleItemsExpression(value: string) {
  const itemMatches = Array.from(value.matchAll(/\{([^{}]+)\}/g))

  return itemMatches
    .map((match) => {
      const rawItem = match[1]
      const label = rawItem.match(/\blabel\s*:\s*'([^']*)'/)?.[1]
      const title = rawItem.match(/\btitle\s*:\s*'([^']*)'/)?.[1]
      const description = rawItem.match(/\bdescription\s*:\s*'([^']*)'/)?.[1]
      const time = rawItem.match(/\btime\s*:\s*'([^']*)'/)?.[1]
      const tone = rawItem.match(/\btone\s*:\s*'([^']*)'/)?.[1]
      const status = rawItem.match(/\bstatus\s*:\s*'([^']*)'/)?.[1]
      const href = rawItem.match(/\bhref\s*:\s*'([^']*)'/)?.[1]
      const itemValue = rawItem.match(/\bvalue\s*:\s*'([^']*)'/)?.[1]
      const disabled = /\bdisabled\s*:\s*true\b/.test(rawItem)
      const current = /\bcurrent\s*:\s*true\b/.test(rawItem)
      const loading = /\bloading\s*:\s*true\b/.test(rawItem)

      if ((!label && !title) || !itemValue) {
        return null
      }

      return {
        ...(label ? { label } : {}),
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(time ? { time } : {}),
        ...(tone ? { tone } : {}),
        ...(status ? { status } : {}),
        ...(href ? { href } : {}),
        value: itemValue,
        ...(disabled ? { disabled: true } : {}),
        ...(current ? { current: true } : {}),
        ...(loading ? { loading: true } : {})
      }
    })
    .filter((item): item is Record<string, string | boolean> => Boolean(item))
}

function parseLiveExampleSegmentedOptionsExpression(value: string) {
  const objectOptions = parseLiveExampleItemsExpression(value)

  if (objectOptions.length > 0) {
    return objectOptions
  }

  return value
    .split(',')
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

function parseLiveExampleFilterStateExpression(value: string) {
  const filters: Record<string, Array<string | number | boolean>> = {}
  const bracketMatches = Array.from(value.matchAll(/([\w-]+)\s*:\s*\[([^\]]*)\]/g))

  bracketMatches.forEach((match) => {
    const key = match[1]
    const values = match[2]
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)

    if (values.length) {
      filters[key] = values
    }
  })

  if (Object.keys(filters).length) {
    return filters
  }

  return Object.fromEntries(
    value
      .split(',')
      .map((item) => item.split(':').map((part) => part.trim()))
      .filter((parts): parts is [string, string] => parts.length === 2 && Boolean(parts[0]) && Boolean(parts[1]))
      .map(([key, rawValues]) => [
        key,
        rawValues
          .split('|')
          .map((item) => item.trim())
          .filter(Boolean)
      ])
  )
}

function parseLiveExampleNumberMapExpression(value: string) {
  const widths: Record<string, number> = {}
  const entries = value
    .replace(/^\{/, '')
    .replace(/\}$/, '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  entries.forEach((entry) => {
    const [rawKey, rawValue] = entry.split(':').map((item) => item.trim())
    const key = rawKey?.replace(/^['"]|['"]$/g, '')
    const width = Number(rawValue)

    if (key && Number.isFinite(width) && width > 0) {
      widths[key] = width
    }
  })

  return widths
}

function parseLiveExampleViewPreferenceExpression(value: string) {
  const columnKeysMatch = value.match(/columnKeys\s*:\s*\[([^\]]*)\]/)
  const columnWidthsMatch = value.match(/columnWidths\s*:\s*(\{[^}]*\})/)
  const densityMatch = value.match(/density\s*:\s*['"]([^'"]+)['"]/)
  const filtersMatch = value.match(/filters\s*:\s*(\{[^}]*\})/)

  return {
    ...(columnKeysMatch
      ? {
          columnKeys: columnKeysMatch[1]
            .split(',')
            .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
            .filter(Boolean)
        }
      : {}),
    ...(columnWidthsMatch ? { columnWidths: parseLiveExampleNumberMapExpression(columnWidthsMatch[1]) } : {}),
    ...(densityMatch ? { density: densityMatch[1] } : {}),
    ...(filtersMatch ? { filters: parseLiveExampleFilterStateExpression(filtersMatch[1]) } : {})
  }
}

function getNodeProps(element: Element) {
  const props: Record<string, unknown> = {}
  const tagName = element.tagName.toLowerCase()

  for (const attribute of Array.from(element.attributes)) {
    if (attribute.name.startsWith('@')) {
      continue
    }

    if (attribute.name === 'v-model:selected-row-keys') {
      if (tagName === 'ytable') {
        props.selectedRowKeys = attribute.value === 'selectedRowKeys' ? ['table'] : []
      }
      continue
    }

    if (attribute.name === 'v-model:filters') {
      if (tagName === 'ytable') {
        props.filters = attribute.value === 'filters' ? { status: ['Stable'] } : {}
      }
      continue
    }

    if (attribute.name === 'style') {
      props.style = attribute.value
      continue
    }

    if (attribute.name === 'model-value') {
      if (['ycheckbox', 'yswitch'].includes(tagName)) {
        props.modelValue = attribute.value !== 'false'
      } else if (tagName === 'ycascader') {
        props.modelValue = element.hasAttribute('multiple')
          ? attribute.value.split('|').map((path) => path.split(',').map((segment) => segment.trim()).filter(Boolean))
          : attribute.value.split(',').map((segment) => segment.trim()).filter(Boolean)
      } else if (tagName === 'ydaterangepicker') {
        props.modelValue = attribute.value.split(',').map((item) => item.trim()).filter(Boolean)
      } else if (tagName === 'ytransfer') {
        props.modelValue = attribute.value.split(',').map((item) => item.trim()).filter(Boolean)
      } else if (tagName === 'yupload') {
        props.modelValue = fallbackUploadFileSets[attribute.value as keyof typeof fallbackUploadFileSets] ?? []
      } else if (tagName === 'ycollapse') {
        props.modelValue = attribute.value.split(',').map((item) => item.trim()).filter(Boolean)
      } else if (tagName === 'ysearchpanel') {
        props.modelValue = Object.fromEntries(
          attribute.value
            .split(',')
            .map((item) => item.split(':').map((part) => part.trim()))
            .filter((parts): parts is [string, string] => parts.length === 2 && Boolean(parts[0]))
        )
      } else if (tagName === 'yschemaform') {
        props.modelValue = fallbackSchemaFormModels[attribute.value as keyof typeof fallbackSchemaFormModels] ?? fallbackSchemaFormModels.ready
      } else if (tagName === 'yfieldarray') {
        props.modelValue = attribute.value === 'empty' ? [] : fallbackFieldArrayItems
      } else if (tagName === 'yslider') {
        props.modelValue = element.hasAttribute('range')
          ? attribute.value.split(',').map((item) => Number(item.trim())).filter((item) => !Number.isNaN(item))
          : Number(attribute.value)
      } else if (tagName === 'ycarousel') {
        props.modelValue = Number(attribute.value)
      } else if (['yinputnumber', 'yrate'].includes(tagName)) {
        props.modelValue = Number(attribute.value)
      } else {
        props.modelValue = attribute.value
      }
      continue
    }

    if (attribute.name === ':model-value') {
      if (tagName === 'ycarousel') {
        props.modelValue = Number(attribute.value)
      } else if (tagName === 'yselect' || tagName === 'ytreeselect') {
        props.modelValue = attribute.value
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .split(',')
          .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
      } else if (tagName === 'ycheckboxgroup') {
        props.modelValue = attribute.value
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .split(',')
          .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
      } else if (tagName === 'yschemaform') {
        const description = element.getAttribute('description') ?? ''

        props.modelValue = description.includes('Submit invalid values')
          ? fallbackSchemaFormModels.invalid
          : description.includes('Selecting custom category')
            ? fallbackSchemaFormModels.custom
            : fallbackSchemaFormModels.ready
      } else if (tagName === 'ysearchform') {
        props.modelValue = fallbackSearchModel
      } else if (tagName === 'ysearchpanel') {
        props.modelValue = attribute.value.trim() === '{}' ? {} : fallbackSearchModel
      } else if (tagName === 'yfiltertabs') {
        props.modelValue = 'stable'
      } else if (tagName === 'yfieldarray') {
        const description = element.getAttribute('description') ?? ''

        props.modelValue = attribute.value.trim() === '[]' || description.includes('Start with an empty')
          ? []
          : fallbackFieldArrayItems
      } else if (tagName === 'ysavedviews') {
        props.modelValue = 'mine'
      }
      continue
    }

    if (attribute.name === ':selected-row-keys') {
      if (tagName === 'ybulkactionbar') {
        props.selectedRowKeys = attribute.value.trim() === '[]' ? [] : fallbackBulkSelection
      }
      continue
    }

    if (attribute.name === ':actions') {
      if (tagName === 'ybulkactionbar') {
        props.actions = fallbackBulkActions
      }
      continue
    }

    if (attribute.name === ':fields') {
      if (['ysearchform', 'ysearchpanel'].includes(tagName)) {
        props.fields = fallbackSearchFields
      }
      continue
    }

    if (attribute.name === ':default-item') {
      if (tagName === 'yfieldarray') {
        props.defaultItem = fallbackFieldArrayItem
      }
      continue
    }

    if (attribute.name === ':search-model') {
      if (tagName === 'yresourcepage') {
        props.searchModel = fallbackSearchModel
      }
      continue
    }

    if (attribute.name === ':search-fields') {
      if (tagName === 'yresourcepage') {
        props.searchFields = fallbackSearchFields
      }
      continue
    }

    if (attribute.name === ':schema') {
      if (tagName === 'yschemaform') {
        props.schema = fallbackSchemaFormFields
      }
      continue
    }

    if (attribute.name === ':nodes') {
      props.nodes = fallbackTreeNodes
      continue
    }

    if (attribute.name === ':options') {
      if (tagName === 'yselect') {
        props.options = attribute.value === 'groupedPackageOptions'
          ? fallbackGroupedSelectOptions
          : attribute.value === 'disabledPackageOptions'
            ? fallbackDisabledSelectOptions
            : attribute.value === 'largePackageOptions'
              ? fallbackLargeSelectOptions
          : fallbackSelectOptions
      } else if (tagName === 'yradiogroup') {
        props.options = fallbackRadioOptions
      } else if (tagName === 'ysegmented') {
        props.options = parseLiveExampleSegmentedOptionsExpression(attribute.value)
      } else if (tagName === 'ycheckboxgroup') {
        props.options = element.getAttribute('label') === 'Release checklist'
          ? fallbackReleaseChecklistOptions
          : fallbackCheckboxGroupOptions
      } else if (tagName === 'ycascader') {
        props.options = attribute.value === 'remoteCascaderOptions' || element.hasAttribute('lazy')
          ? fallbackRemoteCascaderOptions
          : fallbackCascaderOptions
      } else if (tagName === 'ytransfer') {
        props.options = fallbackTransferOptions
      }
      continue
    }

    if (attribute.name === ':titles') {
      if (tagName === 'ytransfer') {
        props.titles = attribute.value
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .split(',')
          .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
      }
      continue
    }

    if (attribute.name === ':default-open-keys') {
      if (tagName === 'ymenu') {
        props.defaultOpenKeys = attribute.value
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .split(',')
          .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
      }
      continue
    }

    if (attribute.name === ':marks') {
      if (tagName === 'yslider') {
        props.marks = Array.from(attribute.value.matchAll(/value:\s*(\d+),\s*label:\s*['"]([^'"]+)['"]/g))
          .map((match) => ({ value: Number(match[1]), label: match[2] }))
      }
      continue
    }

    if (attribute.name === ':offset' && tagName === 'ybadge') {
      props.offset = attribute.value
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .split(',')
        .map((item) => Number(item.trim()))
        .filter((item) => !Number.isNaN(item))
        .slice(0, 2)
      continue
    }

    if (attribute.name === 'label-width') {
      props.labelWidth = attribute.value
      continue
    }

    if (attribute.name === 'label-for') {
      props.labelFor = attribute.value
      continue
    }

    if (attribute.name === 'aria-describedby') {
      props.ariaDescribedby = attribute.value
      continue
    }

    if (attribute.name === 'list-type' && tagName === 'yupload') {
      props.listType = attribute.value
      continue
    }

    if (attribute.name === 'error') {
      props.error = attribute.value
      continue
    }

    if (attribute.name === 'rejected-files' && tagName === 'yupload') {
      props.rejectedFiles = fallbackUploadRejectedFileSets[attribute.value as keyof typeof fallbackUploadRejectedFileSets] ?? []
      continue
    }

    if (attribute.name === 'loading-text') {
      props.loadingText = attribute.value
      continue
    }

    if (attribute.name === 'error-text') {
      props.errorText = attribute.value
      continue
    }

    if (attribute.name === 'errors' && tagName === 'yformsummary') {
      props.errors = fallbackFormSummaryErrorSets[attribute.value as keyof typeof fallbackFormSummaryErrorSets] ?? fallbackFormSummaryErrorSets.default
      continue
    }

    if (tagName === 'yskeleton' && ['width', 'height'].includes(attribute.name)) {
      props[attribute.name] = attribute.value
      continue
    }

    if (tagName === 'yimage' && ['width', 'height', 'radius'].includes(attribute.name)) {
      props[attribute.name] = attribute.value
      continue
    }

    if (tagName === 'yimage' && attribute.name === 'initial-index') {
      props.initialIndex = Number(attribute.value)
      continue
    }

    if ([
      'close-label',
      'close-text',
      'primary-text',
      'secondary-text',
      'avatar-text',
      'due-text',
      'submit-text',
      'reset-text',
      'collapse-text',
      'expand-text',
      'approve-text',
      'reject-text',
      'request-changes-text',
      'bulk-action-title',
      'bulk-action-clear-text',
      'add-text',
      'remove-text',
      'item-label',
      'item-key',
      'column-reset-text',
      'table-title',
      'table-description',
      'saved-views-title',
      'saved-views-description',
      'summary-title',
      'default-view',
      'search-title',
      'search-description',
      'detail-title',
      'detail-description',
      'detail-placement',
      'clear-text',
      'save-text',
      'create-text',
      'manage-text',
      'sticky-header',
      'show-density-settings',
      'show-filter-summary',
      'show-column-settings',
      'sticky-bulk-actions',
      'max-height',
      'tooltip-placement',
      'indicator-position',
      'container',
      'position',
      'target',
      'active-text',
      'inactive-text',
      'prefix-text',
      'suffix-text',
      'active-value'
    ].includes(attribute.name)) {
      const propName = {
        'close-label': 'closeLabel',
        'close-text': 'closeText',
        'primary-text': 'primaryText',
        'secondary-text': 'secondaryText',
        'avatar-text': 'avatarText',
        'src-set': 'srcSet',
        'due-text': 'dueText',
        'submit-text': 'submitText',
        'reset-text': 'resetText',
        'collapse-text': 'collapseText',
        'expand-text': 'expandText',
        'approve-text': 'approveText',
        'reject-text': 'rejectText',
        'request-changes-text': 'requestChangesText',
        'bulk-action-title': 'bulkActionTitle',
        'bulk-action-clear-text': 'bulkActionClearText',
        'add-text': 'addText',
        'remove-text': 'removeText',
        'item-label': 'itemLabel',
        'item-key': 'itemKey',
        'column-reset-text': 'columnResetText',
        'table-title': 'tableTitle',
        'table-description': 'tableDescription',
        'saved-views-title': 'savedViewsTitle',
        'saved-views-description': 'savedViewsDescription',
        'summary-title': 'summaryTitle',
        'default-view': 'defaultView',
        'search-title': 'searchTitle',
        'search-description': 'searchDescription',
        'detail-title': 'detailTitle',
        'detail-description': 'detailDescription',
        'detail-placement': 'detailPlacement',
        'clear-text': 'clearText',
        'save-text': 'saveText',
        'create-text': 'createText',
        'manage-text': 'manageText',
        'sticky-header': 'stickyHeader',
        'show-density-settings': 'showDensitySettings',
        'show-filter-summary': 'showFilterSummary',
        'show-column-settings': 'showColumnSettings',
        'sticky-bulk-actions': 'stickyBulkActions',
        'max-height': 'maxHeight',
        'tooltip-placement': 'tooltipPlacement',
        'indicator-position': 'indicatorPosition',
        container: 'container',
        position: 'position',
        target: 'target',
        'active-text': 'activeText',
        'inactive-text': 'inactiveText',
        'prefix-text': 'prefixText',
        'suffix-text': 'suffixText',
        'active-value': 'activeValue'
      }[attribute.name]

      if (propName) {
        props[propName] = [
          'stickyHeader',
          'showDensitySettings',
          'showFilterSummary',
          'showColumnSettings',
          'stickyBulkActions'
        ].includes(propName)
          ? attribute.value !== 'false'
          : attribute.value
      }
      continue
    }

    if (tagName === 'ycarousel' && attribute.name === 'height') {
      props.height = attribute.value
      continue
    }

    if (tagName === 'yslider' && attribute.name === 'height') {
      props.height = attribute.value
      continue
    }

    if (attribute.name === 'tags') {
      props.tags = attribute.value.split(',').map((item) => item.trim()).filter(Boolean)
      continue
    }

    if (attribute.name === 'code') {
      props.code = attribute.value.replace(/\\n/g, '\n')
      continue
    }

    if (attribute.name === ':value') {
      props.value = Number(attribute.value)
      continue
    }

    if (attribute.name === ':show-value') {
      props.showValue = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':marker') {
      props.marker = attribute.value !== 'false'
      continue
    }

    if (attribute.name === 'show-count') {
      props.showCount = true
      continue
    }

    if (attribute.name === ':show-count') {
      props.showCount = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':show-icon') {
      props.showIcon = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':show-adjacent-months') {
      props.showAdjacentMonths = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':autoplay') {
      props.autoplay = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':loop') {
      props.loop = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':pause-on-hover') {
      props.pauseOnHover = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':interval') {
      props.interval = Number(attribute.value)
      continue
    }

    if (attribute.name === ':multiple') {
      props.multiple = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':controls') {
      props.controls = attribute.value !== 'false'
      continue
    }

    if (attribute.name === 'indeterminate' && tagName === 'ycheckbox') {
      props.indeterminate = true
      continue
    }

    if (attribute.name === ':clearable') {
      props.clearable = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':maxlength') {
      props.maxlength = Number(attribute.value)
      continue
    }

    if (attribute.name === ':collapsible') {
      props.collapsible = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':default-collapsed') {
      props.defaultCollapsed = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':animated') {
      props.animated = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':focus-on-click') {
      props.focusOnClick = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':hide-on-click') {
      props.hideOnClick = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':close-on-overlay') {
      props.closeOnOverlay = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':close-on-escape') {
      props.closeOnEscape = attribute.value !== 'false'
      continue
    }

    if (attribute.name === ':items') {
      if (tagName === 'yanchor') {
        props.items = attribute.value.trim() === '[]' ? [] : fallbackAnchorItems
      } else if (tagName === 'ysavedviews') {
        props.items = attribute.value.trim() === '[]' ? [] : fallbackSavedViews
      } else if (tagName === 'yfiltertabs') {
        props.items = attribute.value.trim() === '[]' ? [] : fallbackFilterTabs
      } else if (tagName === 'ystatustimeline') {
        props.items = attribute.value.trim() === '[]' ? [] : fallbackStatusTimelineItems
      } else if (tagName === 'yreviewworkflow') {
        props.items = attribute.value.trim() === '[]' ? [] : fallbackReviewSteps
      } else if (tagName === 'ycarousel') {
        props.items = fallbackCarouselItems
      } else if (tagName === 'ymenu') {
        props.items = fallbackMenuItems
      } else {
        props.items = parseLiveExampleItemsExpression(attribute.value)
      }
      continue
    }

    if (attribute.name === ':tabs' && tagName === 'ytabs') {
      props.tabs = attribute.value.trim() === '[]' ? [] : fallbackTabs
      continue
    }

    if (attribute.name === ':panels' && tagName === 'ysplitter') {
      props.panels = fallbackSplitterPanels
      continue
    }

    if (attribute.name === ':features' && tagName === 'yfeaturegrid') {
      props.features = attribute.value.trim() === '[]' ? [] : fallbackFeatures
      continue
    }

    if (attribute.name === ':logos' && tagName === 'ylogocloud') {
      props.logos = attribute.value.trim() === '[]' ? [] : fallbackLogos
      continue
    }

    if (attribute.name === ':commands' && tagName === 'ycommandpalette') {
      props.commands = attribute.value.trim() === '[]' ? [] : fallbackCommands
      continue
    }

    if (attribute.name === ':errors' && tagName === 'yformsummary') {
      props.errors = attribute.value.trim() === '[]' ? [] : fallbackFormSummaryErrorSets.default
      continue
    }

    if (attribute.name === ':views') {
      if (['ydataview', 'yresourcepage'].includes(tagName)) {
        props.views = attribute.value.trim() === '[]' ? [] : fallbackDataViewViews
      }
      continue
    }

    if (attribute.name === ':columns') {
      if (['ydatatable', 'ydataview', 'yresourcepage'].includes(tagName)) {
        props.columns = fallbackAdminColumns
      } else if (tagName === 'ytable') {
        props.columns = attribute.value === 'columns' ? fallbackInteractiveTableColumns : fallbackColumns
      } else {
        props.columns = Number(attribute.value)
      }
      continue
    }

    if (attribute.name === ':data') {
      if (['ydatatable', 'ydataview', 'yresourcepage'].includes(tagName)) {
        props.data = attribute.value.trim() === '[]' ? [] : fallbackAdminRows
      } else {
        props.data = attribute.value.trim() === '[]'
          ? []
          : attribute.value === 'rows'
            ? fallbackInteractiveTableData
            : fallbackTableData
      }
      continue
    }

    if (attribute.name === ':presets' && tagName === 'ycolorpicker') {
      props.presets = fallbackColorPresets
      continue
    }

    if (attribute.name === ':texts' && tagName === 'yrate') {
      props.texts = fallbackRateTexts
      continue
    }

    if (attribute.name === 'sort-key') {
      props.sortKey = attribute.value
      continue
    }

    if (attribute.name === 'sort-order') {
      props.sortOrder = attribute.value
      continue
    }

    if (attribute.name === 'default-sort-key') {
      props.defaultSortKey = attribute.value
      continue
    }

    if (attribute.name === 'default-sort-order') {
      props.defaultSortOrder = attribute.value
      continue
    }

    if (attribute.name === 'filter-mode') {
      props.filterMode = attribute.value
      continue
    }

    if (attribute.name === ':default-filters') {
      props.defaultFilters = parseLiveExampleFilterStateExpression(attribute.value)
      continue
    }

    if (attribute.name === ':default-view-preference') {
      props.defaultViewPreference = parseLiveExampleViewPreferenceExpression(attribute.value)
      continue
    }

    if (attribute.name === ':default-column-widths') {
      props.defaultColumnWidths = parseLiveExampleNumberMapExpression(attribute.value)
      continue
    }

    if (attribute.name === ':column-widths') {
      props.columnWidths = parseLiveExampleNumberMapExpression(attribute.value)
      continue
    }

    if (attribute.name === ':shortcuts') {
      props.shortcuts = tagName === 'ydaterangepicker' ? fallbackDateRangeShortcuts : fallbackDateShortcuts
      continue
    }

    if (attribute.name === ':disabled-date') {
      props.disabledDate = disableWeekendDate
      continue
    }

    if (attribute.name === ':disabled-time') {
      props.disabledTime = disableAfterWorkTime
      continue
    }

    if ([':min', ':max', ':step', ':precision', ':page', ':page-size', ':minute-step', ':max-files', ':max-size', ':max-collapse-tags', ':virtual-height', ':virtual-item-height', ':virtual-row-height', ':virtual-overscan', ':total', ':sibling-count', ':show-delay', ':hide-delay', ':rows', ':current', ':column', ':columns', ':visibility-height', ':right', ':bottom', ':height', ':max-height', ':item-height', ':overscan', ':opacity', ':gap', ':rotate', ':font-size', ':collapsed-count', ':count', ':maxlength', ':offset', ':z-index', ':bound', ':duration'].includes(attribute.name)) {
      const propName = {
        ':min': 'min',
        ':max': 'max',
        ':step': 'step',
        ':precision': 'precision',
        ':page': 'page',
        ':page-size': 'pageSize',
        ':minute-step': 'minuteStep',
        ':max-files': 'maxFiles',
        ':max-size': 'maxSize',
        ':max-collapse-tags': 'maxCollapseTags',
        ':virtual-height': 'virtualHeight',
        ':virtual-item-height': 'virtualItemHeight',
        ':virtual-row-height': 'virtualRowHeight',
        ':virtual-overscan': 'virtualOverscan',
        ':total': 'total',
        ':sibling-count': 'siblingCount',
        ':show-delay': 'showDelay',
        ':hide-delay': 'hideDelay',
        ':rows': 'rows',
        ':current': 'current',
        ':column': 'column',
        ':columns': 'columns',
        ':visibility-height': 'visibilityHeight',
        ':right': 'right',
        ':bottom': 'bottom',
        ':height': 'height',
        ':max-height': 'maxHeight',
        ':item-height': 'itemHeight',
        ':overscan': 'overscan',
        ':opacity': 'opacity',
        ':gap': 'gap',
        ':rotate': 'rotate',
        ':font-size': 'fontSize',
        ':collapsed-count': 'collapsedCount',
        ':min-column-width': 'minColumnWidth',
        ':count': 'count',
        ':maxlength': 'maxlength',
        ':offset': 'offset',
        ':z-index': 'zIndex',
        ':bound': 'bound',
        ':duration': 'duration'
      }[attribute.name]

      if (propName) {
        props[propName] = Number(attribute.value)
      }
      continue
    }

    if (['disabled', 'loading', 'lazy', 'preview', 'closable', 'striped', 'banner', 'open', 'selectable', 'compact', 'clearable', 'multiple', 'collapse-tags', 'allow-create', 'virtualized', 'resizable', 'filterable', 'shortcuts', 'allow-half', 'readonly', 'native', 'horizontal', 'drag', 'scroll-to-error', 'controls', 'checkable', 'check-strictly', 'draggable', 'invalid', 'interactive', 'animated', 'bordered', 'split', 'accordion', 'collapsed', 'reverse', 'range', 'vertical', 'show-tooltip', 'show-alpha', 'show-text', 'show-icon', 'show-count', 'show-summary', 'required', 'focus-on-click', 'hide-on-click', 'collapsible', 'default-collapsed', 'sticky-header', 'full-height', 'padded', 'scrollable', 'sticky', 'show-density-settings', 'show-filter-summary', 'show-column-settings', 'reorderable-columns', 'refreshable', 'remote', 'pagination', 'sticky-bulk-actions', 'detail-open', 'auto-upload', 'previewable', 'downloadable', 'sortable', 'expandable', 'marker', 'select-scroll-top'].includes(attribute.name)) {
      if (attribute.name === 'select-scroll-top') {
        props.selectScrollTop = true
        continue
      }

      if (attribute.name === 'shortcuts') {
        props.shortcuts = tagName === 'ydaterangepicker' ? fallbackDateRangeShortcuts : fallbackDateShortcuts
        continue
      }

      if (attribute.name === 'allow-half') {
        props.allowHalf = true
        continue
      }

      if (attribute.name === 'check-strictly') {
        props.checkStrictly = true
        continue
      }

      if (attribute.name === 'scroll-to-error') {
        props.scrollToError = true
        continue
      }

      if (attribute.name === 'collapse-tags') {
        props.collapseTags = true
        continue
      }

      if (attribute.name === 'allow-create') {
        props.allowCreate = true
        continue
      }

      if (attribute.name === 'virtualized') {
        props.virtualized = true
        continue
      }

      if (attribute.name === 'resizable') {
        props.resizable = true
        continue
      }

      if (attribute.name === 'show-tooltip') {
        props.showTooltip = true
        continue
      }

      if (attribute.name === 'show-alpha') {
        props.showAlpha = true
        continue
      }

      if (attribute.name === 'show-text') {
        props.showText = true
        continue
      }

      if (attribute.name === 'show-icon') {
        props.showIcon = true
        continue
      }

      if (attribute.name === 'show-count') {
        props.showCount = true
        continue
      }

      if (attribute.name === 'show-summary') {
        props.showSummary = normalizeBooleanAttribute(attribute.value)
        continue
      }

      if (attribute.name === 'focus-on-click') {
        props.focusOnClick = true
        continue
      }

      if (attribute.name === 'hide-on-click') {
        props.hideOnClick = true
        continue
      }

      if (attribute.name === 'default-collapsed') {
        props.defaultCollapsed = true
        continue
      }

      if (attribute.name === 'sticky-header') {
        props.stickyHeader = true
        continue
      }

      if (attribute.name === 'full-height') {
        props.fullHeight = true
        continue
      }

      if (attribute.name === 'scrollable') {
        props.scrollable = true
        continue
      }

      if (attribute.name === 'padded') {
        props.padded = true
        continue
      }

      if (attribute.name === 'show-density-settings') {
        props.showDensitySettings = true
        continue
      }

      if (attribute.name === 'show-filter-summary') {
        props.showFilterSummary = true
        continue
      }

      if (attribute.name === 'show-column-settings') {
        props.showColumnSettings = true
        continue
      }

      if (attribute.name === 'reorderable-columns') {
        props.reorderableColumns = true
        continue
      }

      if (attribute.name === 'sticky-bulk-actions') {
        props.stickyBulkActions = true
        continue
      }

      if (attribute.name === 'detail-open') {
        props.detailOpen = true
        continue
      }

      if (attribute.name === 'auto-upload') {
        props.autoUpload = true
        continue
      }

      props[attribute.name] = true
      continue
    }

    if (attribute.name === 'show-value') {
      props.showValue = true
      continue
    }

    if (attribute.name === 'value') {
      props.value = Number.isNaN(Number(attribute.value)) ? attribute.value : Number(attribute.value)
      continue
    }

    if (attribute.name === 'type') {
      props.type = attribute.value
      continue
    }

    if (attribute.name === 'height' && ['yheader', 'yfooter'].includes(tagName)) {
      props.height = attribute.value
      continue
    }

    if (attribute.name === 'width' && tagName === 'yaside') {
      props.width = attribute.value
      continue
    }

    if (attribute.name === 'collapsed-width' && tagName === 'yaside') {
      props.collapsedWidth = attribute.value
      continue
    }

    if (['min', 'max', 'step', 'precision', 'page', 'total', 'rows', 'current', 'column', 'columns', 'right', 'bottom', 'height', 'max-height', 'overscan', 'opacity', 'gap', 'rotate', 'collapsed-count', 'count', 'maxlength', 'virtual-height', 'virtual-item-height', 'virtual-overscan', 'offset', 'z-index', 'bound', 'duration'].includes(attribute.name)) {
      if (attribute.name === 'z-index') {
        props.zIndex = Number(attribute.value)
        continue
      }

      if (attribute.name === 'collapsed-count') {
        props.collapsedCount = Number(attribute.value)
        continue
      }

      if (attribute.name === 'virtual-height') {
        props.virtualHeight = Number(attribute.value)
        continue
      }

      if (attribute.name === 'virtual-item-height') {
        props.virtualItemHeight = Number(attribute.value)
        continue
      }

      if (attribute.name === 'virtual-overscan') {
        props.virtualOverscan = Number(attribute.value)
        continue
      }

      if (attribute.name === 'max-height') {
        props.maxHeight = Number(attribute.value)
        continue
      }

      props[attribute.name] = Number(attribute.value)
      continue
    }

    if (attribute.name === 'item-height') {
      props.itemHeight = Number(attribute.value)
      continue
    }

    if (attribute.name === 'font-size') {
      props.fontSize = Number(attribute.value)
      continue
    }

    if (attribute.name === 'visibility-height') {
      props.visibilityHeight = Number(attribute.value)
      continue
    }

    if (attribute.name === 'page-size') {
      props.pageSize = Number(attribute.value)
      continue
    }

    if (attribute.name === 'max-files') {
      props.maxFiles = Number(attribute.value)
      continue
    }

    if (attribute.name === 'max-size') {
      props.maxSize = Number(attribute.value)
      continue
    }

    if (attribute.name === ':custom-request' && tagName === 'yupload') {
      props.customRequest = fallbackUploadRequest
      continue
    }

    if (attribute.name === ':before-upload' && tagName === 'yupload') {
      props.beforeUpload = fallbackUploadBeforeUpload
      continue
    }

    if (attribute.name === 'max-collapse-tags') {
      props.maxCollapseTags = Number(attribute.value)
      continue
    }

    if (attribute.name === 'button-label') {
      props.buttonLabel = attribute.value
      continue
    }

    if (attribute.name === 'drop-label') {
      props.dropLabel = attribute.value
      continue
    }

    if (attribute.name === 'empty-text') {
      props.emptyText = attribute.value
      continue
    }

    if (attribute.name === 'search-placeholder') {
      props.searchPlaceholder = attribute.value
      continue
    }

    if (attribute.name === 'group-separator') {
      props.groupSeparator = attribute.value
      continue
    }

    if (attribute.name === 'decimal-separator') {
      props.decimalSeparator = attribute.value
      continue
    }

    if (attribute.name === 'confirm-text') {
      props.confirmText = attribute.value
      continue
    }

    if (attribute.name === 'cancel-text') {
      props.cancelText = attribute.value
      continue
    }

    if (attribute.name === 'void-icon') {
      props.voidIcon = attribute.value
      continue
    }

    if (attribute.name === 'minute-step') {
      props.minuteStep = Number(attribute.value)
      continue
    }

    if (['expanded-keys', ':expanded-keys', 'default-expanded-keys', ':default-expanded-keys', 'checked-keys'].includes(attribute.name)) {
      const propName = attribute.name === 'expanded-keys' || attribute.name === ':expanded-keys'
        ? 'expandedKeys'
        : attribute.name === 'default-expanded-keys' || attribute.name === ':default-expanded-keys'
          ? 'defaultExpandedKeys'
          : 'checkedKeys'
      props[propName] = attribute.value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      continue
    }

    if (['selected-row-keys', 'default-selected-row-keys', 'expanded-row-keys', 'default-expanded-row-keys', 'column-keys', 'default-column-keys'].includes(attribute.name)) {
      const propName = {
        'selected-row-keys': 'selectedRowKeys',
        'default-selected-row-keys': 'defaultSelectedRowKeys',
        'expanded-row-keys': 'expandedRowKeys',
        'default-expanded-row-keys': 'defaultExpandedRowKeys',
        'column-keys': 'columnKeys',
        'default-column-keys': 'defaultColumnKeys'
      }[attribute.name]

      if (propName) {
        props[propName] = attribute.value.split(',').map((item) => item.trim()).filter(Boolean)
      }
      continue
    }

    if (attribute.name === 'selected-key') {
      props.selectedKey = attribute.value
      continue
    }

    if (attribute.name === 'aria-label') {
      props.ariaLabel = attribute.value
      continue
    }

    if (attribute.name === 'sibling-count') {
      props.siblingCount = Number(attribute.value)
      continue
    }

    if (attribute.name === 'hide-on-single-page') {
      props.hideOnSinglePage = normalizeBooleanAttribute(attribute.value)
      continue
    }

    if (attribute.name === 'previous-text') {
      props.previousText = attribute.value
      continue
    }

    if (attribute.name === 'next-text') {
      props.nextText = attribute.value
      continue
    }

    if (attribute.name === 'show-delay') {
      props.showDelay = Number.isNaN(Number(attribute.value)) ? attribute.value : Number(attribute.value)
      continue
    }

    props[attribute.name] = attribute.value
  }

  if (tagName === 'yselect' && !('options' in props)) {
    props.options = fallbackSelectOptions
  }

  if (tagName === 'ytreeselect') {
    if (!('nodes' in props)) {
      props.nodes = fallbackTreeNodes
    }

    if (!('defaultExpandedKeys' in props) && !('expandedKeys' in props)) {
      props.defaultExpandedKeys = ['core']
    }
  }

  if (tagName === 'yautocomplete' && !('options' in props)) {
    props.options = fallbackAutocompleteOptions
  }

  if (tagName === 'ymention' && !('options' in props)) {
    props.options = fallbackMentionOptions
  }

  if (tagName === 'yradiogroup' && !('options' in props)) {
    props.options = fallbackRadioOptions
  }

  if (tagName === 'ydropdown' && !('items' in props)) {
    props.items = fallbackDropdownItems
  }

  if (tagName === 'ybreadcrumb' && !('items' in props)) {
    props.items = fallbackBreadcrumbItems
  }

  if (tagName === 'yanchor' && !('items' in props)) {
    props.items = fallbackAnchorItems
  }

  if (tagName === 'ysteps' && !('items' in props)) {
    props.items = fallbackStepItems
  }

  if (tagName === 'ytour' && !('steps' in props)) {
    props.steps = fallbackTourSteps
  }

  if (tagName === 'ycollapse') {
    if (!('items' in props)) {
      props.items = fallbackCollapseItems
    }

    if (!('modelValue' in props)) {
      props.modelValue = ['usage']
    }
  }

  if (tagName === 'ysplitter' && !('panels' in props)) {
    props.panels = fallbackSplitterPanels
  }

  if (tagName === 'ydescriptions' && !('items' in props)) {
    props.items = fallbackDescriptionItems
  }

  if (tagName === 'ylist' && !('items' in props)) {
    props.items = fallbackListItems
  }

  if (tagName === 'ymenu' && !('items' in props)) {
    props.items = fallbackMenuItems
  }

  if (tagName === 'ytimeline' && !('items' in props)) {
    props.items = fallbackTimelineItems
  }

  if (tagName === 'yformsummary' && !('errors' in props)) {
    props.errors = fallbackFormSummaryErrors
  }

  if (tagName === 'ycascader' && !('options' in props)) {
    props.options = element.hasAttribute('lazy') ? fallbackRemoteCascaderOptions : fallbackCascaderOptions
  }

  if (tagName === 'ydatepicker' && !('shortcuts' in props) && element.hasAttribute('shortcuts')) {
    props.shortcuts = fallbackDateShortcuts
  }

  if (tagName === 'ydaterangepicker' && !('shortcuts' in props) && element.hasAttribute('shortcuts')) {
    props.shortcuts = fallbackDateRangeShortcuts
  }

  if (tagName === 'ytransfer' && !('options' in props)) {
    props.options = fallbackTransferOptions
  }

  if (tagName === 'ytree') {
    if (!('nodes' in props)) {
      props.nodes = fallbackTreeNodes
    }

    if (!('defaultExpandedKeys' in props) && !('expandedKeys' in props)) {
      props.defaultExpandedKeys = ['core']
    }
  }

  if (tagName === 'ytabs' && !('tabs' in props)) {
    props.tabs = fallbackTabs
  }

  if (tagName === 'ycarousel' && !('items' in props)) {
    props.items = fallbackCarouselItems
  }

  if (tagName === 'ytable') {
    if (!('columns' in props)) {
      props.columns = fallbackColumns
    }

    if (!('data' in props)) {
      props.data = fallbackTableData
    }
  }

  if (tagName === 'yform' && !('model' in props)) {
    props.model = fallbackFormModel
  }

  if (tagName === 'ycommandpalette' && !('commands' in props)) {
    props.commands = fallbackCommands
  }

  if (tagName === 'yvirtuallist') {
    if (!('items' in props)) {
      props.items = fallbackVirtualItems
    }

    if (!('height' in props)) {
      props.height = 220
    }

    if (!('itemHeight' in props)) {
      props.itemHeight = 44
    }
  }

  if (tagName === 'yfeaturegrid' && !('features' in props)) {
    props.features = fallbackFeatures
  }

  if (tagName === 'ylogocloud' && !('logos' in props)) {
    props.logos = fallbackLogos
  }

  if (tagName === 'yprofilecard' && !('tags' in props)) {
    props.tags = fallbackProfileTags
  }

  if (['ysearchpanel', 'ysearchform'].includes(tagName)) {
    if (!('fields' in props)) {
      props.fields = fallbackSearchFields
    }

    if (!('modelValue' in props)) {
      props.modelValue = fallbackSearchModel
    }
  }

  if (tagName === 'yfiltertabs') {
    if (!('items' in props)) {
      props.items = fallbackFilterTabs
    }

    if (!('modelValue' in props)) {
      props.modelValue = 'all'
    }
  }

  if (tagName === 'ydatatable') {
    if (!('columns' in props)) {
      props.columns = fallbackAdminColumns
    }

    if (!('data' in props)) {
      props.data = props.virtualized ? fallbackLargeAdminRows : fallbackAdminRows
    }

    if (!('total' in props)) {
      props.total = props.virtualized ? fallbackLargeAdminRows.length : fallbackAdminRows.length
    }

    if (!('selectedRowKeys' in props) && props.selectable) {
      props.selectedRowKeys = ['button', 'data-table']
    }

    if (!('bulkActions' in props) && props.selectable) {
      props.bulkActions = fallbackBulkActions
    }
  }

  if (tagName === 'ydataview') {
    if (!('views' in props)) {
      props.views = fallbackDataViewViews
    }

    if (!('columns' in props)) {
      props.columns = fallbackAdminColumns
    }

    if (!('data' in props)) {
      props.data = fallbackAdminRows
    }

    if (!('total' in props)) {
      props.total = fallbackAdminRows.length
    }

    if (!('defaultView' in props) && !('modelValue' in props)) {
      props.defaultView = 'beta'
    }

    if (!('selectedRowKeys' in props) && props.selectable) {
      props.selectedRowKeys = ['button', 'data-table']
    }

    if (!('bulkActions' in props) && props.selectable) {
      props.bulkActions = fallbackBulkActions
    }
  }

  if (tagName === 'yresourcepage') {
    if (!('searchFields' in props)) {
      props.searchFields = fallbackSearchFields
    }

    if (!('searchModel' in props)) {
      props.searchModel = fallbackSearchModel
    }

    if (!('views' in props)) {
      props.views = fallbackDataViewViews
    }

    if (!('columns' in props)) {
      props.columns = fallbackAdminColumns
    }

    if (!('data' in props)) {
      props.data = fallbackAdminRows
    }

    if (!('total' in props)) {
      props.total = fallbackAdminRows.length
    }

    if (!('bulkActions' in props) && props.selectable) {
      props.bulkActions = fallbackBulkActions
    }
  }

  if (tagName === 'yschemaform') {
    if (!('schema' in props)) {
      props.schema = fallbackSchemaFormFields
    }

    if (!('modelValue' in props)) {
      props.modelValue = fallbackSchemaFormModels.ready
    }
  }

  if (tagName === 'yfieldarray') {
    if (!('modelValue' in props)) {
      props.modelValue = fallbackFieldArrayItems
    }

    if (!('defaultItem' in props)) {
      props.defaultItem = fallbackFieldArrayItem
    }
  }

  if (tagName === 'ybulkactionbar') {
    if (!('selectedRowKeys' in props)) {
      props.selectedRowKeys = fallbackBulkSelection
    }

    if (!('actions' in props)) {
      props.actions = fallbackBulkActions
    }
  }

  if (tagName === 'ystatustimeline' && !('items' in props)) {
    props.items = fallbackStatusTimelineItems
  }

  if (tagName === 'yreviewworkflow') {
    if (!('items' in props)) {
      props.items = fallbackReviewSteps
    }

    if (!('activeValue' in props)) {
      props.activeValue = 'reviewing'
    }
  }

  if (tagName === 'ysavedviews') {
    if (!('items' in props)) {
      props.items = fallbackSavedViews
    }

    if (!('modelValue' in props)) {
      props.modelValue = 'mine'
    }
  }

  return props
}

function summarizePayload(payloads: unknown[]) {
  if (payloads.length === 0) {
    return 'void'
  }

  return payloads
    .map((payload) => {
      if (payload instanceof MouseEvent) {
        return 'MouseEvent'
      }

      if (payload instanceof Event) {
        return payload.type
      }

      if (typeof payload === 'string' || typeof payload === 'number' || typeof payload === 'boolean') {
        return String(payload)
      }

      if (payload === null || typeof payload === 'undefined') {
        return String(payload)
      }

      try {
        const json = JSON.stringify(payload)

        return json.length > eventPayloadPreviewLimit
          ? `${json.slice(0, eventPayloadPreviewLimit - 3)}...`
          : json
      } catch {
        return Object.prototype.toString.call(payload)
      }
    })
    .join(', ')
}

function logComponentEvent(component: string, event: string, payloads: unknown[]) {
  eventLogId.value += 1
  eventLogs.value = [
    {
      id: eventLogId.value,
      component,
      event,
      payload: summarizePayload(payloads),
      rawPayloads: payloads
    },
    ...eventLogs.value
  ].slice(0, 8)
}

function handlePreviewFrameClick(event: MouseEvent) {
  const target = event.target

  if (!(target instanceof Element) || selectedPreset.value !== 'image') {
    return
  }

  if (target.closest('[data-image-preview-close]') || target.closest('.yok-image-preview__backdrop')) {
    if (previewImageOpen.value) {
      previewImageOpen.value = false
      logComponentEvent('YImage', 'preview-close', [])
    }

    return
  }

  if (target.closest('.yok-image__button')) {
    previewImageOpen.value = true
    logComponentEvent('YImage', 'preview-open', [0])
  }
}

function openImagePreviewFromRunner() {
  previewImageOpen.value = true
  logComponentEvent('YImage', 'preview-open', [0])
}

function getActiveEventComponentLabel(tagName = selectedPreset.value) {
  return activeComponentMeta.value?.title ?? presetLabels[selectedPreset.value] ?? tagName.replace(/^y/, 'Y')
}

function createEventHandlers(tagName: string) {
  const component = getActiveEventComponentLabel(tagName)
  const createHandler = (event: string) => (...payloads: unknown[]) => {
    logComponentEvent(component, event, payloads)
  }

  const handlers = {
    onClick: createHandler('click'),
    onClose: createHandler('close'),
    onSelect: createHandler('select'),
    onChange: createHandler('change'),
    onDrop: createHandler('drop'),
    onExceed: createHandler('exceed'),
    onProgress: createHandler('progress'),
    onSuccess: createHandler('success'),
    onError: createHandler('error'),
    onRetry: createHandler('retry'),
    onAbort: createHandler('abort'),
    onDismissReject: createHandler('dismissReject'),
    onPreview: createHandler('preview'),
    onDownload: createHandler('download'),
    onReorder: createHandler('reorder'),
    onConfirm: createHandler('confirm'),
    onCancel: createHandler('cancel'),
    onPrimary: createHandler('primary'),
    onSecondary: createHandler('secondary'),
    onCopied: createHandler('copied'),
    onSearch: createHandler('search'),
    onReset: createHandler('reset'),
    onSave: createHandler('save'),
    onFinish: createHandler('finish'),
    onFinishFailed: createHandler('finishFailed'),
    onCreate: createHandler('create'),
    onManage: createHandler('manage'),
    onAdd: createHandler('add'),
    onRemove: createHandler('remove'),
    onItemChange: createHandler('itemChange'),
    onClear: createHandler('clear'),
    onLoad: createHandler('load'),
    onLoadError: createHandler('loadError'),
    onRefresh: createHandler('refresh'),
    onApprove: createHandler('approve'),
    onReject: createHandler('reject'),
    onRequestChanges: createHandler('requestChanges'),
    onAction: createHandler('action'),
    onPageChange: createHandler('pageChange'),
    onSortChange: createHandler('sortChange'),
    onSelectionChange: createHandler('selectionChange'),
    onFilterChange: createHandler('filterChange'),
    onBulkAction: createHandler('bulkAction'),
    onBulkClear: createHandler('bulkClear'),
    onColumnChange: createHandler('columnChange'),
    onColumnResize: createHandler('columnResize'),
    onDensityChange: createHandler('densityChange'),
    onRequestChange: createHandler('requestChange'),
    onViewChange: createHandler('viewChange'),
    onViewPreferenceChange: createHandler('viewPreferenceChange'),
    onVisibleChange: createHandler('visibleChange'),
    onSearchCollapseChange: createHandler('searchCollapseChange'),
    onSaveView: createHandler('saveView'),
    onCreateView: createHandler('createView'),
    onManageViews: createHandler('manageViews'),
    onCloseDetail: createHandler('closeDetail'),
    onValidate: createHandler('validate'),
    'onUpdate:modelValue': createHandler('update:modelValue'),
    'onUpdate:open': createHandler('update:open'),
    'onUpdate:current': createHandler('update:current'),
    'onUpdate:page': createHandler('update:page'),
    'onUpdate:columnKeys': createHandler('update:columnKeys'),
    'onUpdate:viewPreference': createHandler('update:viewPreference'),
    'onUpdate:columnWidths': createHandler('update:columnWidths'),
    'onUpdate:density': createHandler('update:density'),
    'onUpdate:filters': createHandler('update:filters'),
    'onUpdate:searchModel': createHandler('update:searchModel'),
    'onUpdate:sortKey': createHandler('update:sortKey'),
    'onUpdate:sortOrder': createHandler('update:sortOrder'),
    'onUpdate:viewValue': createHandler('update:viewValue'),
    'onUpdate:selectedRowKeys': createHandler('update:selectedRowKeys'),
    'onUpdate:selectedKey': createHandler('update:selectedKey'),
    'onUpdate:expandedKeys': createHandler('update:expandedKeys'),
    'onUpdate:checkedKeys': createHandler('update:checkedKeys')
  }

  if (tagName === 'yimage') {
    delete handlers.onClick

    return {
      ...handlers,
      onPreviewOpen: createHandler('preview-open'),
      onPreviewClose: createHandler('preview-close'),
      'onUpdate:previewOpen': createHandler('update:previewOpen')
    }
  }

  return handlers
}

function cloneFieldArrayItems(items: unknown): YFieldArrayValue {
  if (!Array.isArray(items)) {
    return []
  }

  return items.map((item) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return { ...(item as YFieldArrayItem) }
    }

    return { value: item }
  })
}

function ensureFieldArrayItemIds(items: unknown): YFieldArrayValue {
  return cloneFieldArrayItems(items).map((item) => {
    if (item.id !== undefined && item.id !== null && item.id !== '') {
      return item
    }

    previewFieldArrayIdCounter.value += 1

    return {
      ...item,
      id: `live-reviewer-${previewFieldArrayIdCounter.value}`
    }
  })
}

function ensureSchemaFormArrayItemIds(model: unknown): Record<string, unknown> {
  if (!model || typeof model !== 'object' || Array.isArray(model)) {
    return {}
  }

  const nextModel = { ...(model as Record<string, unknown>) }

  if (Array.isArray(nextModel.reviewers)) {
    nextModel.reviewers = ensureFieldArrayItemIds(nextModel.reviewers)
  }

  return nextModel
}

function cloneStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function isStringArrayArray(value: unknown): value is string[][] {
  return Array.isArray(value) && value.every((item) => Array.isArray(item))
}

function cloneCascaderPreviewModel(value: unknown, multiple = false): PreviewCascaderModel {
  if (multiple) {
    return isStringArrayArray(value)
      ? value.map((path) => cloneStringArray(path))
      : []
  }

  return cloneStringArray(value)
}

function cloneUploadPreviewFiles(value: unknown): PreviewUploadModel {
  return Array.isArray(value)
    ? (value as YUploadFile[]).map((file) => ({ ...file }))
    : []
}

function cloneUploadRejectedPreviewFiles(value: unknown): PreviewUploadRejectedFile[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((file) => {
      if (!file || typeof file !== 'object') {
        return null
      }

      const uploadFile = file as Record<string, unknown>

      if (typeof uploadFile.name !== 'string' || typeof uploadFile.size !== 'number') {
        return null
      }

      return {
        name: uploadFile.name,
        ...(typeof uploadFile.id === 'string' && uploadFile.id ? { id: uploadFile.id } : {}),
        size: uploadFile.size,
        ...(typeof uploadFile.type === 'string' && uploadFile.type ? { type: uploadFile.type } : {}),
        reason: typeof uploadFile.reason === 'string' ? uploadFile.reason : 'accept',
        ...(typeof uploadFile.message === 'string' && uploadFile.message ? { message: uploadFile.message } : {})
      }
    })
    .filter((file): file is PreviewUploadRejectedFile => Boolean(file))
}

function createUploadRejectedPreviewFiles(files: File[], reason: YUploadRejectReason | string): PreviewUploadRejectedFile[] {
  return files.map((file, index) => ({
    id: `preview-rejected-${reason}-${file.name}-${file.size}-${file.lastModified}-${index}`,
    name: file.name,
    size: file.size,
    ...(file.type ? { type: file.type } : {}),
    reason
  }))
}

function setPreviewUploadFiles(files: YUploadFile[]) {
  previewUploadFiles.value = cloneUploadPreviewFiles(files)
}

function createSimulatedUploadFile(name: string, type: string, size: number) {
  return new File(['Yok UI live example upload simulation'], name, {
    type,
    lastModified: 1717200000000 + size
  })
}

function isSimulatedUploadFileAccepted(file: File, accept: string) {
  const rules = accept
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)

  if (!rules.length) {
    return true
  }

  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()

  return rules.some((rule) => {
    if (rule.startsWith('.')) {
      return fileName.endsWith(rule)
    }

    if (rule.endsWith('/*')) {
      return fileType.startsWith(rule.slice(0, -1))
    }

    return fileType === rule
  })
}

function createSimulatedUploadModelFile(file: File, index: number): YUploadFile {
  return {
    id: `preview-upload-${file.name}-${file.size}-${file.lastModified}-${index}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'ready',
    raw: file
  }
}

function simulateUploadMixedSelection() {
  const acceptedImage = createSimulatedUploadFile('component-map.png', 'image/png', 248000)
  const rejectedCsv = createSimulatedUploadFile('component-map.csv', 'text/csv', 12000)
  const simulatedFiles = [acceptedImage, rejectedCsv]
  const accept = String(controlState.value.accept ?? '')
  const acceptedFiles = simulatedFiles
    .filter((file) => isSimulatedUploadFileAccepted(file, accept))
    .map((file, index) => createSimulatedUploadModelFile(file, index))
  const rejectedFiles = simulatedFiles.filter((file) => !isSimulatedUploadFileAccepted(file, accept))
  const currentFiles = previewUploadFiles.value ?? []
  const multiple = Boolean(controlState.value.multiple)
  const maxFiles = Number(controlState.value.maxFiles || 0)
  const nextFiles = multiple ? [...currentFiles, ...acceptedFiles] : acceptedFiles.slice(-1)
  const limitedFiles = maxFiles > 0 ? nextFiles.slice(0, maxFiles) : nextFiles
  const exceededFiles = maxFiles > 0 ? nextFiles.slice(maxFiles) : []
  const rejectedPreviewFiles = [
    ...createUploadRejectedPreviewFiles(rejectedFiles, 'accept'),
    ...exceededFiles.map((file, index) => ({
      id: `preview-rejected-exceed-${file.id}-${index}`,
      name: file.name,
      size: file.size,
      ...(file.type ? { type: file.type } : {}),
      reason: 'exceed' as const,
      message: `Max ${maxFiles} files. Remove one item before adding more.`
    }))
  ]
  const component = getActiveEventComponentLabel('yupload')

  previewUploadFiles.value = cloneUploadPreviewFiles(limitedFiles)
  previewUploadRejectedFiles.value = cloneUploadRejectedPreviewFiles(rejectedPreviewFiles)

  logComponentEvent(component, 'update:modelValue', [limitedFiles])
  logComponentEvent(component, 'change', [limitedFiles])

  if (rejectedFiles.length) {
    logComponentEvent(component, 'reject', [rejectedFiles, 'accept'])
  }

  if (exceededFiles.length && maxFiles > 0) {
    logComponentEvent(component, 'exceed', [exceededFiles, maxFiles])
  }

  draftStatus.value = '已模拟选择 PNG 和 CSV 文件，预览状态与事件日志已同步。'
}

function simulateSelectRemoteResult() {
  const nextValue = 'product'
  const component = getActiveEventComponentLabel('yselect')

  previewSelectModel.value = nextValue
  previewSelectRemoteResolved.value = true

  logComponentEvent(component, 'search', ['product'])
  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])
  logComponentEvent(component, 'visibleChange', [false])

  draftStatus.value = '已模拟远程搜索返回 Product tools，并同步选择值、状态快照和事件日志。'
}

function simulateDropdownCopyCommand() {
  const action = { label: 'Copy command', value: 'copy' }
  const component = getActiveEventComponentLabel('ydropdown')

  controlState.value = {
    ...controlState.value,
    scenario: 'actions',
    open: false
  }
  previewDropdownAction.value = {
    dropdownAction: action.value,
    dropdownLabel: action.label,
    dropdownOpen: false
  }

  logComponentEvent(component, 'visibleChange', [true])
  logComponentEvent(component, 'select', [action])
  logComponentEvent(component, 'click', [action])
  logComponentEvent(component, 'visibleChange', [false])

  draftStatus.value = '已模拟 Dropdown 选择 Copy command，并同步所选动作、关闭状态、状态快照和事件日志。'
}

function getPopconfirmWorkflowLabels() {
  const scenario = String(controlState.value.scenario)

  if (scenario === 'danger') {
    return { confirm: 'Delete', cancel: 'Keep draft' }
  }

  if (scenario === 'cancel') {
    return { confirm: 'Leave', cancel: 'Continue editing' }
  }

  if (scenario === 'mobile') {
    return { confirm: 'Reset', cancel: 'Keep filters' }
  }

  if (scenario === 'keyboard') {
    return { confirm: 'Confirm', cancel: 'Cancel' }
  }

  return {
    confirm: String(controlState.value.confirmText || 'Archive'),
    cancel: String(controlState.value.cancelText || 'Keep')
  }
}

function simulatePopconfirmConfirm() {
  const labels = getPopconfirmWorkflowLabels()
  const component = getActiveEventComponentLabel('ypopconfirm')

  controlState.value = {
    ...controlState.value,
    open: false
  }
  previewPopconfirmAction.value = {
    popconfirmAction: 'confirm',
    popconfirmLabel: labels.confirm,
    popconfirmOpen: false
  }

  logComponentEvent(component, 'confirm', [{ action: 'confirm', label: labels.confirm }])
  logComponentEvent(component, 'update:open', [false])

  draftStatus.value = `已模拟 Popconfirm 确认 ${labels.confirm}，并同步关闭状态、状态快照和事件日志。`
}

function simulatePopconfirmCancel() {
  const labels = getPopconfirmWorkflowLabels()
  const component = getActiveEventComponentLabel('ypopconfirm')

  controlState.value = {
    ...controlState.value,
    open: false
  }
  previewPopconfirmAction.value = {
    popconfirmAction: 'cancel',
    popconfirmLabel: labels.cancel,
    popconfirmOpen: false
  }

  logComponentEvent(component, 'cancel', [{ action: 'cancel', label: labels.cancel }])
  logComponentEvent(component, 'update:open', [false])

  draftStatus.value = `已模拟 Popconfirm 取消 ${labels.cancel}，并同步关闭状态、状态快照和事件日志。`
}

function getModalWorkflowLabels() {
  const scenario = String(controlState.value.scenario)

  if (scenario === 'danger') {
    return { confirm: 'Delete', cancel: 'Keep draft' }
  }

  if (scenario === 'review') {
    return { confirm: 'Publish', cancel: 'Revise' }
  }

  if (scenario === 'mobile') {
    return { confirm: 'Publish', cancel: 'Later' }
  }

  if (scenario === 'keyboard') {
    return { confirm: 'Save', cancel: 'Cancel' }
  }

  return { confirm: 'Publish', cancel: 'Cancel' }
}

function simulateModalConfirm() {
  const labels = getModalWorkflowLabels()
  const component = getActiveEventComponentLabel('ymodal')

  controlState.value = {
    ...controlState.value,
    open: false
  }
  previewModalAction.value = {
    modalAction: 'confirm',
    modalLabel: labels.confirm,
    modalOpen: false
  }

  logComponentEvent(component, 'confirm', [{ action: 'confirm', label: labels.confirm }])
  logComponentEvent(component, 'close', [{ reason: 'confirm', label: labels.confirm }])

  draftStatus.value = `已模拟 Modal 确认 ${labels.confirm}，并同步关闭状态、状态快照和事件日志。`
}

function simulateModalCancel() {
  const labels = getModalWorkflowLabels()
  const component = getActiveEventComponentLabel('ymodal')

  controlState.value = {
    ...controlState.value,
    open: false
  }
  previewModalAction.value = {
    modalAction: 'cancel',
    modalLabel: labels.cancel,
    modalOpen: false
  }

  logComponentEvent(component, 'cancel', [{ action: 'cancel', label: labels.cancel }])
  logComponentEvent(component, 'close', [{ reason: 'cancel', label: labels.cancel }])

  draftStatus.value = `已模拟 Modal 取消 ${labels.cancel}，并同步关闭状态、状态快照和事件日志。`
}

function getDrawerWorkflowLabels() {
  const scenario = String(controlState.value.scenario)

  if (scenario === 'detail') {
    return { save: 'Save detail', dismiss: 'Close detail' }
  }

  if (scenario === 'mobileNav') {
    return { save: 'Apply navigation', dismiss: 'Close navigation' }
  }

  if (scenario === 'keyboard') {
    return { save: 'Save changes', dismiss: 'Dismiss keyboard review' }
  }

  if (scenario === 'locked') {
    return { save: 'Request unlock', dismiss: 'Close locked notice' }
  }

  return { save: 'Save settings', dismiss: 'Close drawer' }
}

function getDrawerWorkflowPlacement() {
  return String(controlState.value.scenario) === 'mobileNav'
    ? 'left'
    : String(controlState.value.placement || 'right')
}

function simulateDrawerSave() {
  const labels = getDrawerWorkflowLabels()
  const placement = getDrawerWorkflowPlacement()
  const component = getActiveEventComponentLabel('ydrawer')

  controlState.value = {
    ...controlState.value,
    open: false
  }
  previewDrawerAction.value = {
    drawerAction: 'save',
    drawerLabel: labels.save,
    drawerOpen: false,
    drawerPlacement: placement
  }

  logComponentEvent(component, 'save', [{ action: 'save', label: labels.save, placement }])
  logComponentEvent(component, 'close', [{ reason: 'save', label: labels.save, placement }])

  draftStatus.value = `已模拟 Drawer 保存 ${labels.save}，并同步关闭状态、抽屉方向、状态快照和事件日志。`
}

function simulateDrawerDismiss() {
  const labels = getDrawerWorkflowLabels()
  const placement = getDrawerWorkflowPlacement()
  const component = getActiveEventComponentLabel('ydrawer')

  controlState.value = {
    ...controlState.value,
    open: false
  }
  previewDrawerAction.value = {
    drawerAction: 'dismiss',
    drawerLabel: labels.dismiss,
    drawerOpen: false,
    drawerPlacement: placement
  }

  logComponentEvent(component, 'dismiss', [{ action: 'dismiss', label: labels.dismiss, placement }])
  logComponentEvent(component, 'close', [{ reason: 'dismiss', label: labels.dismiss, placement }])

  draftStatus.value = `已模拟 Drawer 关闭 ${labels.dismiss}，并同步关闭状态、抽屉方向、状态快照和事件日志。`
}

function getAlertWorkflowSnapshot(action: 'dismiss' | 'restore' | 'escalate' | 'openAction') {
  const scenario = String(controlState.value.scenario)
  const fallbackTitle = String(controlState.value.title || 'Theme saved')
  const fallbackTone = scenario === 'validation'
    ? 'danger'
    : scenario === 'announcement' || scenario === 'keyboard'
      ? 'warning'
      : 'success'
  const fallbackRole = scenario === 'validation' ? 'alert' : 'status'

  if (action === 'dismiss') {
    return {
      alertAction: 'dismiss',
      alertActionLabel: 'Dismiss alert',
      alertRole: fallbackRole,
      alertTitle: fallbackTitle,
      alertTone: fallbackTone,
      alertVisible: false
    }
  }

  if (action === 'restore') {
    return {
      alertAction: 'restore',
      alertActionLabel: 'Restore alert',
      alertRole: fallbackRole,
      alertTitle: fallbackTitle,
      alertTone: fallbackTone,
      alertVisible: true
    }
  }

  if (action === 'escalate') {
    return {
      alertAction: 'escalate',
      alertActionLabel: 'Review fields',
      alertRole: 'alert',
      alertTitle: 'Release blocked',
      alertTone: 'danger',
      alertVisible: true
    }
  }

  return {
    alertAction: 'openAction',
    alertActionLabel: 'Review fields',
    alertRole: previewAlertState.value?.alertRole ?? fallbackRole,
    alertTitle: previewAlertState.value?.alertTitle ?? fallbackTitle,
    alertTone: previewAlertState.value?.alertTone ?? fallbackTone,
    alertVisible: true
  }
}

function simulateAlertAction(action: 'dismiss' | 'restore' | 'escalate' | 'openAction') {
  const component = getActiveEventComponentLabel('yalert')
  const nextState = getAlertWorkflowSnapshot(action)
  const eventName = action === 'dismiss'
    ? 'close'
    : action === 'openAction'
      ? 'action'
      : action

  previewAlertState.value = nextState

  logComponentEvent(component, eventName, [{
    action,
    label: nextState.alertActionLabel,
    role: nextState.alertRole,
    tone: nextState.alertTone,
    visible: nextState.alertVisible
  }])

  draftStatus.value = `已模拟 Alert ${nextState.alertActionLabel}，并同步 ${eventName} 事件、状态快照和预览。`
}

function simulateAlertDismiss() {
  simulateAlertAction('dismiss')
}

function simulateAlertRestore() {
  simulateAlertAction('restore')
}

function simulateAlertEscalate() {
  controlState.value = {
    ...controlState.value,
    scenario: 'validation'
  }
  simulateAlertAction('escalate')
}

function simulateAlertOpenAction() {
  simulateAlertAction('openAction')
}

function getEmptyWorkflowLabels(action: 'create' | 'clearFilters' | 'requestAccess') {
  if (action === 'clearFilters') {
    return {
      label: 'Clear filters',
      scenario: 'search',
      title: 'Filters cleared',
      description: 'All component records are visible again and the empty state has a clear recovery path.'
    }
  }

  if (action === 'requestAccess') {
    return {
      label: 'Request access',
      scenario: 'permission',
      title: 'Access request sent',
      description: 'The admin team can review this request before package management becomes available.'
    }
  }

  const scenario = String(controlState.value.scenario)
  const label = scenario === 'mobile'
    ? 'Create item'
    : scenario === 'keyboard'
      ? 'Create saved view'
      : 'Create component'

  return {
    label,
    scenario,
    title: 'Creation panel opened',
    description: 'The empty state now leads users into the first useful setup action.'
  }
}

function simulateEmptyAction(action: 'create' | 'clearFilters' | 'requestAccess') {
  const labels = getEmptyWorkflowLabels(action)
  const component = getActiveEventComponentLabel('yempty')
  const eventName = action === 'create' ? 'action' : action

  controlState.value = {
    ...controlState.value,
    scenario: labels.scenario
  }
  previewEmptyAction.value = {
    emptyAction: action,
    emptyLabel: labels.label,
    emptyScenario: labels.scenario,
    emptyTitle: labels.title,
    emptyDescription: labels.description
  }

  logComponentEvent(component, eventName, [{
    action,
    label: labels.label,
    scenario: labels.scenario
  }])

  draftStatus.value = `已模拟 Empty ${labels.label}，并同步空态文案、状态快照和 ${eventName} 事件。`
}

function simulateEmptyCreate() {
  simulateEmptyAction('create')
}

function simulateEmptyClearFilters() {
  simulateEmptyAction('clearFilters')
}

function simulateEmptyRequestAccess() {
  simulateEmptyAction('requestAccess')
}

function simulateMessageLoading() {
  const component = getActiveEventComponentLabel('ymessage')

  previewMessageState.value = {
    messagePhase: 'loading',
    messageTone: 'warning',
    messageTitle: 'Saving component',
    messageVisible: true,
    messageClosable: false
  }

  logComponentEvent(component, 'open', [{
    phase: 'loading',
    tone: 'warning',
    duration: 0
  }])

  draftStatus.value = '已模拟 Message loading 持续提示，并同步可见状态、状态快照和 open 事件。'
}

function simulateMessageSuccess() {
  const component = getActiveEventComponentLabel('ymessage')

  previewMessageState.value = {
    messagePhase: 'success',
    messageTone: 'success',
    messageTitle: 'Saved',
    messageVisible: true,
    messageClosable: true
  }

  logComponentEvent(component, 'update', [{
    phase: 'success',
    tone: 'success',
    closable: true
  }])

  draftStatus.value = '已模拟 Message 从 loading 更新为 success，并同步成功状态、状态快照和 update 事件。'
}

function simulateMessageDismiss() {
  const component = getActiveEventComponentLabel('ymessage')
  const previousTitle = previewMessageState.value?.messageTitle || String(controlState.value.title || 'Message')

  previewMessageState.value = {
    messagePhase: 'dismissed',
    messageTone: previewMessageState.value?.messageTone || 'success',
    messageTitle: previousTitle,
    messageVisible: false,
    messageClosable: true
  }

  logComponentEvent(component, 'close', [{
    phase: 'dismissed',
    title: previousTitle
  }])

  draftStatus.value = `已模拟 Message 关闭 ${previousTitle}，并同步隐藏状态、状态快照和 close 事件。`
}

function setListWorkflowState(workflow: string, status: string, statusText: string, itemCount: number, attempt = 1) {
  const component = getActiveEventComponentLabel('ylist')
  const nextState = {
    status,
    statusText,
    attempt,
    itemCount,
    workflow
  }

  previewListState.value = nextState

  logComponentEvent(component, workflow, [nextState])

  draftStatus.value = `已模拟 List ${statusText}，并同步 ${workflow} 事件、列表运行状态和状态快照。`
}

function simulateListLoading() {
  setListWorkflowState('loading', 'loading', 'Refreshing review tasks', 3)
}

function simulateListResolved() {
  setListWorkflowState('resolved', 'resolved', 'Release checklist ready', 3)
}

function simulateListEmpty() {
  setListWorkflowState('empty', 'empty', 'No matching tasks', 0)
}

function simulateListRetry() {
  setListWorkflowState('retry', 'retrying', 'Retrying task refresh', 3, 2)
}

function setDescriptionsWorkflowState(workflow: string, status: string, statusText: string, fieldCount: number, layout = 'horizontal') {
  const component = getActiveEventComponentLabel('ydescriptions')
  const nextState = {
    status,
    statusText,
    fieldCount,
    layout,
    workflow
  }

  previewDescriptionsState.value = nextState

  logComponentEvent(component, workflow, [nextState])

  draftStatus.value = `已模拟 Descriptions ${statusText}，并同步 ${workflow} 事件、详情字段和状态快照。`
}

function simulateDescriptionsLoaded() {
  setDescriptionsWorkflowState('loaded', 'loaded', 'Component profile loaded', 5)
}

function simulateDescriptionsReview() {
  setDescriptionsWorkflowState('review', 'review', 'Release review profile', 5)
}

function simulateDescriptionsEmpty() {
  setDescriptionsWorkflowState('empty', 'empty', 'No component metadata available', 0, 'vertical')
}

function simulateDescriptionsLongField() {
  setDescriptionsWorkflowState('longField', 'long', 'Decision record ready', 4)
}

function setTimelineWorkflowState(workflow: string, status: string, statusText: string, stepCount: number, failedStep = '', reverse = false) {
  const component = getActiveEventComponentLabel('ytimeline')
  const nextState = {
    status,
    statusText,
    stepCount,
    failedStep,
    reverse,
    workflow
  }

  previewTimelineState.value = nextState

  logComponentEvent(component, workflow, [nextState])

  draftStatus.value = `已模拟 Timeline ${statusText}，并同步 ${workflow} 事件、时间线节点和状态快照。`
}

function simulateTimelineRunning() {
  setTimelineWorkflowState('running', 'running', 'Publishing package timeline', 2)
}

function simulateTimelineFailed() {
  setTimelineWorkflowState('failed', 'failed', 'Release failed during publish', 3, 'Publish package')
}

function simulateTimelineRollback() {
  setTimelineWorkflowState('rollback', 'rollback', 'Rollback release package', 3, 'Publish package', true)
}

function simulateTimelineComplete() {
  setTimelineWorkflowState('complete', 'complete', 'Release workflow complete', 3)
}

function setStatisticWorkflowState(workflow: string, status: string, statusText: string, value: number | null, tone = 'success') {
  const component = getActiveEventComponentLabel('ystatistic')
  const nextState = {
    status,
    statusText,
    value,
    tone,
    workflow
  }

  previewStatisticState.value = nextState

  logComponentEvent(component, workflow, [nextState])

  draftStatus.value = `已模拟 Statistic ${statusText}，并同步 ${workflow} 事件、指标值和状态快照。`
}

function simulateStatisticLoading() {
  setStatisticWorkflowState('loading', 'loading', 'Refreshing active users', null, 'info')
}

function simulateStatisticRefresh() {
  setStatisticWorkflowState('refresh', 'refreshed', 'Active users refreshed', 128420, 'success')
}

function simulateStatisticWarning() {
  setStatisticWorkflowState('warning', 'warning', 'Error budget used', 92.7, 'warning')
}

function simulateStatisticReset() {
  setStatisticWorkflowState('reset', 'baseline', 'Active users baseline', 112893, 'success')
}

function getPaginationWorkflowNumbers() {
  const scenario = String(controlState.value.scenario)
  const total = scenario === 'single'
    ? 8
    : scenario === 'dense'
      ? 240
      : Math.max(1, Number(controlState.value.total || 72))
  const pageSize = previewPaginationState.value?.pageSize ??
    previewPaginationPageSize.value ??
    (scenario === 'mobile' ? 20 : Math.max(1, Number(controlState.value.pageSize || 10)))
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(
    Math.max(1, previewPaginationState.value?.page ?? previewPaginationPage.value ?? Number(controlState.value.page || 1)),
    pageCount
  )

  return { page, pageCount, pageSize, total }
}

function setPaginationWorkflowState(workflow: string, page: number, pageSize: number) {
  const component = getActiveEventComponentLabel('ypagination')
  const total = String(controlState.value.scenario) === 'dense'
    ? 240
    : String(controlState.value.scenario) === 'single'
      ? 8
      : Math.max(1, Number(controlState.value.total || 72))
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const nextPage = Math.min(Math.max(1, page), pageCount)
  const start = (nextPage - 1) * pageSize + 1
  const end = Math.min(total, nextPage * pageSize)
  const nextState = {
    page: nextPage,
    pageSize,
    total,
    visibleRange: `${start}-${end}`,
    workflow
  }

  previewPaginationPage.value = nextPage
  previewPaginationPageSize.value = pageSize
  previewPaginationState.value = nextState

  logComponentEvent(component, workflow, [nextState])

  draftStatus.value = `已模拟 Pagination ${workflow}，当前展示 ${nextState.visibleRange} / ${total}，状态快照和事件日志已同步。`
}

function simulatePaginationNextBatch() {
  const current = getPaginationWorkflowNumbers()

  setPaginationWorkflowState('nextBatch', Math.min(current.page + 1, current.pageCount), current.pageSize)
}

function simulatePaginationPageSize() {
  setPaginationWorkflowState('pageSize', 1, 20)
}

function simulatePaginationLastPage() {
  const current = getPaginationWorkflowNumbers()

  setPaginationWorkflowState('lastPage', current.pageCount, current.pageSize)
}

function getStepsWorkflowCurrent() {
  return previewStepsState.value?.currentStep ??
    previewStepsCurrent.value ??
    Number(controlState.value.current ?? 1)
}

function setStepsWorkflowState(workflow: string, currentStep: number, status: string, statusText: string) {
  const component = getActiveEventComponentLabel('ysteps')
  const nextStep = Math.min(Math.max(0, currentStep), 2)
  const nextState = {
    currentStep: nextStep,
    status,
    statusText,
    workflow
  }

  previewStepsCurrent.value = nextStep
  previewStepsState.value = nextState

  logComponentEvent(component, workflow, [nextState])

  draftStatus.value = `已模拟 Steps ${statusText}，并同步 ${workflow} 事件、当前步骤和状态快照。`
}

function simulateStepsNext() {
  setStepsWorkflowState('next', getStepsWorkflowCurrent() + 1, 'running', 'Ready for release review')
}

function simulateStepsBack() {
  setStepsWorkflowState('back', getStepsWorkflowCurrent() - 1, 'running', 'Returned to the previous step')
}

function simulateStepsBlocked() {
  setStepsWorkflowState('blocked', 1, 'blocked', 'Review blocked')
}

function simulateStepsComplete() {
  setStepsWorkflowState('complete', 2, 'complete', 'Release workflow complete')
}

function setCollapseWorkflowState(workflow: string, openPanels: string[], status: string, statusText: string, accordion = false) {
  const component = getActiveEventComponentLabel('ycollapse')
  const nextState = {
    openPanels,
    status,
    statusText,
    workflow,
    accordion
  }

  previewCollapseModel.value = [...openPanels]
  previewCollapseState.value = nextState

  logComponentEvent(component, workflow, [nextState])

  draftStatus.value = `已模拟 Collapse ${statusText}，并同步 ${workflow} 事件、展开面板和状态快照。`
}

function simulateCollapseOpenAll() {
  setCollapseWorkflowState('openAll', ['usage', 'api', 'settings', 'summary', 'keyboard'], 'open', 'All available panels opened')
}

function simulateCollapseCloseAll() {
  setCollapseWorkflowState('closeAll', [], 'closed', 'All panels closed')
}

function simulateCollapseAccordion() {
  setCollapseWorkflowState('accordion', ['settings'], 'accordion', 'Accordion mode active', true)
}

function simulateCollapseLocked() {
  setCollapseWorkflowState('locked', ['usage'], 'locked', 'Locked panel explained')
}

function getProgressWorkflowSnapshot(phase: 'running' | 'failed' | 'retrying' | 'complete') {
  const currentAttempt = previewProgressState.value?.progressAttempt ?? 1

  if (phase === 'failed') {
    return {
      progressAttempt: currentAttempt,
      progressLabel: 'Dependency install failed',
      progressPhase: 'failed',
      progressTone: 'danger',
      progressValue: 64
    }
  }

  if (phase === 'retrying') {
    return {
      progressAttempt: currentAttempt + 1,
      progressLabel: 'Installing package',
      progressPhase: 'retrying',
      progressTone: 'warning',
      progressValue: 32
    }
  }

  if (phase === 'complete') {
    return {
      progressAttempt: currentAttempt,
      progressLabel: 'Package installed',
      progressPhase: 'complete',
      progressTone: 'success',
      progressValue: 100
    }
  }

  return {
    progressAttempt: currentAttempt,
    progressLabel: 'Installing package',
    progressPhase: 'running',
    progressTone: 'warning',
    progressValue: 42
  }
}

function simulateProgressPhase(phase: 'running' | 'failed' | 'retrying' | 'complete') {
  const component = getActiveEventComponentLabel('yprogress')
  const nextState = getProgressWorkflowSnapshot(phase)
  const eventName = phase === 'retrying' ? 'retry' : phase

  previewProgressState.value = nextState

  logComponentEvent(component, eventName, [{
    attempt: nextState.progressAttempt,
    label: nextState.progressLabel,
    phase,
    tone: nextState.progressTone,
    value: nextState.progressValue
  }])

  draftStatus.value = `已模拟 Progress ${nextState.progressLabel}，并同步 ${eventName} 事件、进度值和状态快照。`
}

function simulateProgressRunning() {
  simulateProgressPhase('running')
}

function simulateProgressFailed() {
  simulateProgressPhase('failed')
}

function simulateProgressRetry() {
  simulateProgressPhase('retrying')
}

function simulateProgressComplete() {
  simulateProgressPhase('complete')
}

function getResultWorkflowLabels() {
  const scenario = String(controlState.value.scenario)

  if (scenario === 'notFound') {
    return { primary: 'Go home', secondary: 'Search components' }
  }

  if (scenario === 'server') {
    return { primary: 'Retry', secondary: 'Back to queue' }
  }

  if (scenario === 'mobile') {
    return { primary: 'View summary', secondary: 'Back' }
  }

  if (scenario === 'keyboard') {
    return { primary: 'Open docs', secondary: 'Back to queue' }
  }

  return { primary: 'View release', secondary: 'Back to list' }
}

function simulateResultOpen() {
  const labels = getResultWorkflowLabels()
  const component = getActiveEventComponentLabel('yresult')

  previewResultAction.value = {
    resultAction: 'open',
    resultLabel: labels.primary,
    resultStatus: 'success',
    resultTitle: String(controlState.value.title || 'Component published')
  }

  logComponentEvent(component, 'open', [{
    action: 'open',
    label: labels.primary,
    status: 'success'
  }])

  draftStatus.value = `已模拟 Result 主操作 ${labels.primary}，并同步操作状态、状态快照和 open 事件。`
}

function simulateResultRetry() {
  const component = getActiveEventComponentLabel('yresult')
  const retryLabel = 'Retry'

  controlState.value = {
    ...controlState.value,
    scenario: 'server'
  }
  previewResultAction.value = {
    resultAction: 'retry',
    resultLabel: retryLabel,
    resultStatus: 'warning',
    resultTitle: 'Retrying release'
  }

  logComponentEvent(component, 'retry', [{
    action: 'retry',
    label: retryLabel,
    status: 'warning'
  }])

  draftStatus.value = `已模拟 Result 重试 ${retryLabel}，并同步 warning 状态、状态快照和 retry 事件。`
}

function getSkeletonWorkflowLabel() {
  const scenario = String(controlState.value.scenario)

  if (scenario === 'list') {
    return 'Loading release queue'
  }

  if (scenario === 'fast') {
    return 'Loading quick summary'
  }

  if (scenario === 'mobile') {
    return 'Loading mobile card'
  }

  if (scenario === 'screenReader') {
    return 'Loading account summary'
  }

  return 'Loading component detail'
}

function simulateSkeletonPhase(phase: 'loading' | 'resolved' | 'timeout' | 'retrying') {
  const component = getActiveEventComponentLabel('yskeleton')
  const currentAttempt = previewSkeletonState.value?.skeletonAttempt ?? 1
  const skeletonAttempt = phase === 'retrying' ? currentAttempt + 1 : currentAttempt
  const skeletonLabel = phase === 'timeout'
    ? 'Loading timed out'
    : phase === 'resolved'
      ? 'Loaded component detail'
      : getSkeletonWorkflowLabel()

  previewSkeletonState.value = {
    skeletonPhase: phase,
    skeletonLabel,
    skeletonScenario: String(controlState.value.scenario),
    skeletonAttempt
  }

  logComponentEvent(component, phase === 'retrying' ? 'retry' : phase, [{
    phase,
    label: skeletonLabel,
    scenario: String(controlState.value.scenario),
    attempt: skeletonAttempt
  }])

  draftStatus.value = `已模拟 Skeleton ${skeletonLabel}，并同步 ${phase} 状态、状态快照和事件日志。`
}

function simulateSkeletonLoading() {
  simulateSkeletonPhase('loading')
}

function simulateSkeletonResolved() {
  simulateSkeletonPhase('resolved')
}

function simulateSkeletonTimeout() {
  simulateSkeletonPhase('timeout')
}

function simulateSkeletonRetry() {
  simulateSkeletonPhase('retrying')
}

function simulateDatePickerReviewDay() {
  const nextValue = '2026-06-15'
  const component = getActiveEventComponentLabel('ydatepicker')

  previewDatePickerModel.value = nextValue

  logComponentEvent(component, 'visibleChange', [true])
  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])
  logComponentEvent(component, 'visibleChange', [false])

  draftStatus.value = '已模拟 Date Picker 快捷选择 Review day，并同步日期值、状态快照和事件日志。'
}

function simulateDatePickerClear() {
  const component = getActiveEventComponentLabel('ydatepicker')

  previewDatePickerModel.value = ''

  logComponentEvent(component, 'update:modelValue', [''])
  logComponentEvent(component, 'change', [''])
  logComponentEvent(component, 'clear', [])

  draftStatus.value = '已模拟清空 Date Picker，状态快照和 clear 事件已同步。'
}

function simulateDateRangeSprint() {
  const nextValue = ['2026-06-13', '2026-06-20']
  const component = getActiveEventComponentLabel('ydaterangepicker')

  previewDateRangeModel.value = [...nextValue]

  logComponentEvent(component, 'visibleChange', [true])
  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])
  logComponentEvent(component, 'visibleChange', [false])

  draftStatus.value = '已模拟 Date Range Picker 选择 Sprint range，并同步范围值、状态快照和事件日志。'
}

function simulateDateRangeClear() {
  const component = getActiveEventComponentLabel('ydaterangepicker')

  previewDateRangeModel.value = []

  logComponentEvent(component, 'update:modelValue', [[]])
  logComponentEvent(component, 'change', [[]])
  logComponentEvent(component, 'clear', [])

  draftStatus.value = '已模拟清空 Date Range Picker，状态快照和 clear 事件已同步。'
}

function simulateTimePickerStandup() {
  const nextValue = '10:15'
  const component = getActiveEventComponentLabel('ytimepicker')

  previewTimePickerModel.value = nextValue

  logComponentEvent(component, 'visibleChange', [true])
  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])
  logComponentEvent(component, 'visibleChange', [false])

  draftStatus.value = '已模拟 Time Picker 选择 Standup time，并同步时间值、状态快照和事件日志。'
}

function simulateTimePickerClear() {
  const component = getActiveEventComponentLabel('ytimepicker')

  previewTimePickerModel.value = ''

  logComponentEvent(component, 'update:modelValue', [''])
  logComponentEvent(component, 'change', [''])
  logComponentEvent(component, 'clear', [])

  draftStatus.value = '已模拟清空 Time Picker，状态快照和 clear 事件已同步。'
}

function simulateInputNumberRestock() {
  const nextValue = 8
  const component = getActiveEventComponentLabel('yinputnumber')

  previewInputNumberModel.value = nextValue

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟 Input Number 库存补货到 8，并同步数值、状态快照和事件日志。'
}

function simulateInputNumberReset() {
  const nextValue = 4
  const component = getActiveEventComponentLabel('yinputnumber')

  previewInputNumberModel.value = nextValue

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟重置 Input Number 到默认数量，并同步状态快照和事件日志。'
}

function simulateColorPickerBrandPurple() {
  const nextValue = '#A78BFA'
  const component = getActiveEventComponentLabel('ycolorpicker')

  previewColorPickerModel.value = nextValue

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟 Color Picker 选择品牌紫色，并同步颜色值、状态快照和事件日志。'
}

function simulateColorPickerClear() {
  const component = getActiveEventComponentLabel('ycolorpicker')

  previewColorPickerModel.value = ''

  logComponentEvent(component, 'update:modelValue', [''])
  logComponentEvent(component, 'change', [''])
  logComponentEvent(component, 'clear', [])

  draftStatus.value = '已模拟清空 Color Picker，状态快照和 clear 事件已同步。'
}

function simulateCheckboxSelectAll() {
  const nextValue = ['api', 'a11y', 'visual']
  const component = getActiveEventComponentLabel('ycheckboxgroup')

  previewCheckboxGroupModel.value = [...nextValue]

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟 Checkbox 批量选中所有可选发布项，并同步选中数组、状态快照和事件日志。'
}

function simulateCheckboxPartial() {
  const nextValue = ['api']
  const component = getActiveEventComponentLabel('ycheckboxgroup')

  previewCheckboxGroupModel.value = [...nextValue]

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟 Checkbox 回退到部分选中，只保留 API reviewed，并同步状态快照和事件日志。'
}

function simulateInputSearch() {
  const nextValue = 'button'
  const component = getActiveEventComponentLabel('yinput')

  previewInputModel.value = nextValue

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟 Input 输入搜索词 button，并同步输入值、字数计数、状态快照和事件日志。'
}

function simulateInputClear() {
  const component = getActiveEventComponentLabel('yinput')

  previewInputModel.value = ''

  logComponentEvent(component, 'update:modelValue', [''])
  logComponentEvent(component, 'change', [''])
  logComponentEvent(component, 'clear', [])

  draftStatus.value = '已模拟 Input 清空搜索词，并同步空值、字数计数、状态快照和 clear 事件。'
}

function simulateRadioGroupProduct() {
  const nextValue = 'product'
  const component = getActiveEventComponentLabel('yradiogroup')

  previewRadioGroupModel.value = nextValue

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟 Radio Group 选择 Product 方案，并同步互斥选中状态、状态快照和事件日志。'
}

function simulateRadioGroupCore() {
  const nextValue = 'core'
  const component = getActiveEventComponentLabel('yradiogroup')

  previewRadioGroupModel.value = nextValue

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟 Radio Group 回退到 Core 默认方案，并同步状态快照和事件日志。'
}

function simulateRateFiveStar() {
  const nextValue = 5
  const component = getActiveEventComponentLabel('yrate')

  previewRateModel.value = nextValue

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟 Rate 选择 5 分，并同步评分值、状态快照和事件日志。'
}

function simulateRateClear() {
  const nextValue = 0
  const component = getActiveEventComponentLabel('yrate')

  previewRateModel.value = nextValue

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟清空 Rate 到未评分状态，并同步状态快照和事件日志。'
}

function simulateSwitchEnable() {
  const nextValue = true
  const component = getActiveEventComponentLabel('yswitch')

  previewSwitchModel.value = nextValue

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟 Switch 开启即时设置，并同步开关状态、状态快照和事件日志。'
}

function simulateSwitchRollback() {
  const nextValue = false
  const component = getActiveEventComponentLabel('yswitch')

  previewSwitchModel.value = nextValue

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟回滚 Switch 到关闭状态，并同步状态快照和事件日志。'
}

function simulateSliderBudgetRange() {
  const nextValue = [30, 70]
  const component = getActiveEventComponentLabel('yslider')

  previewSliderModel.value = [...nextValue]

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟 Slider 预算范围 30 - 70，并同步范围值、状态快照和事件日志。'
}

function simulateSliderReset() {
  const nextValue = [20, 80]
  const component = getActiveEventComponentLabel('yslider')

  previewSliderModel.value = [...nextValue]

  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [nextValue])

  draftStatus.value = '已模拟重置 Slider 到默认预算范围，并同步状态快照和事件日志。'
}

function simulateTooltipOpen() {
  const component = getActiveEventComponentLabel('ytooltip')

  controlState.value = {
    ...controlState.value,
    scenario: 'click'
  }
  previewTooltipOpen.value = true

  logComponentEvent(component, 'update:open', [true])
  logComponentEvent(component, 'visibleChange', [true])

  draftStatus.value = '已模拟 Tooltip 受控打开，并同步 open 状态、状态快照和 visibleChange 事件。'
}

function simulateTooltipClose() {
  const component = getActiveEventComponentLabel('ytooltip')

  controlState.value = {
    ...controlState.value,
    scenario: 'action'
  }
  previewTooltipOpen.value = false

  logComponentEvent(component, 'update:open', [false])
  logComponentEvent(component, 'visibleChange', [false])

  draftStatus.value = '已模拟 Tooltip 受控关闭，并同步关闭状态、状态快照和 visibleChange 事件。'
}

function simulatePopoverOpen() {
  const component = getActiveEventComponentLabel('ypopover')

  controlState.value = {
    ...controlState.value,
    scenario: 'confirm',
    open: true
  }
  previewPopoverOpen.value = true

  logComponentEvent(component, 'update:open', [true])
  logComponentEvent(component, 'visibleChange', [true])

  draftStatus.value = '已模拟 Popover 受控打开确认卡片，并同步 open 状态、状态快照和 visibleChange 事件。'
}

function simulatePopoverDismiss() {
  const component = getActiveEventComponentLabel('ypopover')

  controlState.value = {
    ...controlState.value,
    scenario: 'confirm',
    open: false
  }
  previewPopoverOpen.value = false

  logComponentEvent(component, 'update:open', [false])
  logComponentEvent(component, 'visibleChange', [false])

  draftStatus.value = '已模拟 Popover 关闭确认卡片，并同步关闭状态、状态快照和 visibleChange 事件。'
}

function simulateCascaderTooltipPath() {
  const nextValue = ['core', 'feedback', 'tooltip']
  const component = getActiveEventComponentLabel('ycascader')
  const payload = { value: nextValue, labels: ['Core', 'Feedback', 'Tooltip'] }

  previewCascaderModel.value = [...nextValue]

  logComponentEvent(component, 'visibleChange', [true])
  logComponentEvent(component, 'update:modelValue', [nextValue])
  logComponentEvent(component, 'change', [payload])
  logComponentEvent(component, 'visibleChange', [false])

  draftStatus.value = '已模拟 Cascader 选择 Core / Feedback / Tooltip，并同步路径、状态快照和事件日志。'
}

function simulateCascaderClear() {
  const component = getActiveEventComponentLabel('ycascader')

  previewCascaderModel.value = []

  logComponentEvent(component, 'update:modelValue', [[]])
  logComponentEvent(component, 'change', [{ value: [] }])
  logComponentEvent(component, 'clear', [])

  draftStatus.value = '已模拟清空 Cascader 路径，状态快照和 clear 事件已同步。'
}

function cloneTableFilterState(value: unknown): YTableFilterState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter((entry): entry is [string, unknown[]] => Array.isArray(entry[1]))
      .map(([key, values]) => [key, [...values]])
  ) as YTableFilterState
}

function normalizeTableSortOrder(value: unknown): YTableSortOrder {
  return value === 'asc' || value === 'desc' || value === null ? value : null
}

function ensurePreviewTableState() {
  if (previewTableSelectedRowKeys.value === null) {
    previewTableSelectedRowKeys.value = ['table']
  }

  if (previewTableFilters.value === null) {
    previewTableFilters.value = { status: ['Stable'] }
  }

  if (previewTableSortKey.value === null) {
    previewTableSortKey.value = 'stars'
  }

  if (typeof previewTableSortOrder.value === 'undefined') {
    previewTableSortOrder.value = 'desc'
  }
}

function syncPreviewTableWorkflowSnapshot() {
  previewTableWorkflowSnapshot.value = {
    selectedRowKeys: [...(previewTableSelectedRowKeys.value ?? [])],
    filters: cloneTableFilterState(previewTableFilters.value),
    sortKey: previewTableSortKey.value ?? '',
    sortOrder: previewTableSortOrder.value ?? null
  }
}

function simulateTableSelectYButton() {
  const component = getActiveEventComponentLabel('ytable')

  ensurePreviewTableState()

  const selectedRowKeys = Array.from(new Set([...(previewTableSelectedRowKeys.value ?? []), 'button']))
  const selectedRows = fallbackInteractiveTableData.filter((row) => selectedRowKeys.includes(row.id))
  const payload: YTableSelectionPayload = {
    selectedRowKeys,
    selectedRows
  }

  previewTableSelectedRowKeys.value = selectedRowKeys
  syncPreviewTableWorkflowSnapshot()

  logComponentEvent(component, 'update:selectedRowKeys', [selectedRowKeys])
  logComponentEvent(component, 'selectionChange', [payload])

  draftStatus.value = '已模拟选择 YButton 行，Table 选择状态和事件日志已同步。'
}

function simulateTableSortStars() {
  const component = getActiveEventComponentLabel('ytable')

  ensurePreviewTableState()

  const nextOrder: YTableSortOrder = previewTableSortOrder.value === 'asc' ? 'desc' : 'asc'
  const payload: YTableSortPayload = {
    key: 'stars',
    order: nextOrder,
    column: fallbackInteractiveTableColumns.find((column) => column.key === 'stars')
  }

  previewTableSortKey.value = 'stars'
  previewTableSortOrder.value = nextOrder
  syncPreviewTableWorkflowSnapshot()

  logComponentEvent(component, 'update:sortKey', ['stars'])
  logComponentEvent(component, 'update:sortOrder', [nextOrder])
  logComponentEvent(component, 'sortChange', [payload])

  draftStatus.value = `已模拟 Stars ${nextOrder === 'asc' ? '升序' : '降序'}排序，Table 排序状态和事件日志已同步。`
}

function simulateTableFilterBeta() {
  const component = getActiveEventComponentLabel('ytable')

  ensurePreviewTableState()

  const currentFilters = cloneTableFilterState(previewTableFilters.value)
  const statusValues = Array.from(new Set([...(currentFilters.status ?? []), 'Beta']))
  const nextFilters: YTableFilterState = {
    ...currentFilters,
    status: statusValues
  }
  const payload: YTableFilterPayload = {
    columnKey: 'status',
    values: statusValues,
    filters: nextFilters,
    column: fallbackInteractiveTableColumns.find((column) => column.key === 'status')
  }

  previewTableFilters.value = nextFilters
  syncPreviewTableWorkflowSnapshot()

  logComponentEvent(component, 'update:filters', [nextFilters])
  logComponentEvent(component, 'filterChange', [payload])

  draftStatus.value = '已模拟加入 Beta 筛选，Table 筛选状态和事件日志已同步。'
}

function createInteractiveProps(tagName: string, props: Record<string, unknown>) {
  if (tagName === 'ytable') {
    if (previewTableSource.value !== checkedSource.value) {
      previewTableSource.value = checkedSource.value
      previewTableSelectedRowKeys.value = Array.isArray(props.selectedRowKeys)
        ? [...props.selectedRowKeys as string[]]
        : Array.isArray(props.defaultSelectedRowKeys)
          ? [...props.defaultSelectedRowKeys as string[]]
          : []
      previewTableFilters.value = Object.keys(cloneTableFilterState(props.filters)).length
        ? cloneTableFilterState(props.filters)
        : cloneTableFilterState(props.defaultFilters)
      previewTableSortKey.value = typeof props.sortKey === 'string'
        ? props.sortKey
        : typeof props.defaultSortKey === 'string'
          ? props.defaultSortKey
          : ''
      previewTableSortOrder.value = typeof props.sortOrder !== 'undefined'
        ? normalizeTableSortOrder(props.sortOrder)
        : typeof props.defaultSortOrder !== 'undefined'
          ? normalizeTableSortOrder(props.defaultSortOrder)
          : null
    }

    return {
      ...props,
      selectedRowKeys: previewTableSelectedRowKeys.value ?? [],
      filters: previewTableFilters.value ?? {},
      sortKey: previewTableSortKey.value ?? '',
      sortOrder: previewTableSortOrder.value ?? null
    }
  }

  if (tagName === 'ydaterangepicker') {
    if (previewDateRangeSource.value !== checkedSource.value) {
      previewDateRangeSource.value = checkedSource.value
      previewDateRangeModel.value = Array.isArray(props.modelValue)
        ? [...props.modelValue as string[]]
        : []
    }

    return {
      ...props,
      modelValue: previewDateRangeModel.value ?? []
    }
  }

  if (tagName === 'yselect' || tagName === 'ytreeselect') {
    if (previewSelectSource.value !== checkedSource.value) {
      previewSelectSource.value = checkedSource.value
      previewSelectRemoteResolved.value = false
      previewSelectModel.value = Array.isArray(props.modelValue)
        ? [...props.modelValue as string[]]
        : typeof props.modelValue === 'string'
          ? props.modelValue
          : props.multiple
            ? []
            : ''
    }

    return {
      ...props,
      modelValue: Array.isArray(previewSelectModel.value)
        ? [...previewSelectModel.value]
        : previewSelectModel.value ?? '',
      loading: previewSelectRemoteResolved.value ? false : props.loading
    }
  }

  if (tagName === 'yalert') {
    return {
      ...props,
      actionLabel: previewAlertState.value?.alertActionLabel ?? '',
      role: previewAlertState.value?.alertRole ?? props.role,
      title: previewAlertState.value?.alertTitle ?? props.title,
      tone: previewAlertState.value?.alertTone ?? props.tone,
      visible: previewAlertState.value?.alertVisible ?? true
    }
  }

  if (tagName === 'ydropdown') {
    return {
      ...props,
      open: previewDropdownAction.value?.dropdownOpen ?? props.open
    }
  }

  if (tagName === 'ypopconfirm') {
    return {
      ...props,
      open: previewPopconfirmAction.value?.popconfirmOpen ?? props.open
    }
  }

  if (tagName === 'ymodal') {
    return {
      ...props,
      open: previewModalAction.value?.modalOpen ?? props.open
    }
  }

  if (tagName === 'ydrawer') {
    return {
      ...props,
      open: previewDrawerAction.value?.drawerOpen ?? props.open,
      placement: previewDrawerAction.value?.drawerPlacement ?? props.placement
    }
  }

  if (tagName === 'yempty') {
    return {
      ...props,
      title: previewEmptyAction.value?.emptyTitle ?? props.title,
      description: previewEmptyAction.value?.emptyDescription ?? props.description
    }
  }

  if (tagName === 'ymessage') {
    return {
      ...props,
      visible: previewMessageState.value?.messageVisible ?? true,
      tone: previewMessageState.value?.messageTone ?? props.tone,
      title: previewMessageState.value?.messageTitle ?? props.title,
      closable: previewMessageState.value?.messageClosable ?? props.closable
    }
  }

  if (tagName === 'yprogress') {
    return {
      ...props,
      label: previewProgressState.value?.progressLabel ?? props.label,
      phase: previewProgressState.value?.progressPhase ?? '',
      striped: previewProgressState.value?.progressPhase === 'running' || previewProgressState.value?.progressPhase === 'retrying'
        ? true
        : props.striped,
      tone: previewProgressState.value?.progressTone ?? props.tone,
      value: previewProgressState.value?.progressValue ?? props.value
    }
  }

  if (tagName === 'yresult') {
    return {
      ...props,
      status: previewResultAction.value?.resultStatus ?? props.status,
      title: previewResultAction.value?.resultTitle ?? props.title
    }
  }

  if (tagName === 'yskeleton') {
    const phase = previewSkeletonState.value?.skeletonPhase === 'retrying'
      ? 'loading'
      : previewSkeletonState.value?.skeletonPhase

    return {
      ...props,
      phase: phase ?? 'loading',
      workflowLabel: previewSkeletonState.value?.skeletonLabel ?? getSkeletonWorkflowLabel(),
      animated: previewSkeletonState.value?.skeletonPhase === 'timeout' ? false : props.animated
    }
  }

  if (tagName === 'ycascader') {
    if (previewCascaderSource.value !== checkedSource.value) {
      previewCascaderSource.value = checkedSource.value
      previewCascaderModel.value = cloneCascaderPreviewModel(props.modelValue, Boolean(props.multiple))
    }

    return {
      ...props,
      modelValue: cloneCascaderPreviewModel(previewCascaderModel.value, Boolean(props.multiple)),
      ...(props.lazy ? { load: loadFallbackCascaderOptions } : {})
    }
  }

  if (tagName === 'yupload') {
    if (previewUploadSource.value !== checkedSource.value) {
      previewUploadSource.value = checkedSource.value
      previewUploadFiles.value = cloneUploadPreviewFiles(props.modelValue)
      previewUploadRejectedFiles.value = cloneUploadRejectedPreviewFiles(props.rejectedFiles)
    }

    return {
      ...props,
      modelValue: cloneUploadPreviewFiles(previewUploadFiles.value),
      rejectedFiles: cloneUploadRejectedPreviewFiles(previewUploadRejectedFiles.value)
    }
  }

  if (tagName === 'ycheckbox') {
    if (previewCheckboxSource.value !== checkedSource.value) {
      previewCheckboxSource.value = checkedSource.value
      previewCheckboxModel.value = typeof props.modelValue === 'boolean'
        ? props.modelValue
        : false
    }

    return {
      ...props,
      modelValue: previewCheckboxModel.value ?? false
    }
  }

  if (tagName === 'yradiogroup') {
    if (previewRadioGroupSource.value !== checkedSource.value) {
      previewRadioGroupSource.value = checkedSource.value
      previewRadioGroupModel.value = typeof props.modelValue === 'string' || typeof props.modelValue === 'number'
        ? props.modelValue
        : ''
    }

    return {
      ...props,
      modelValue: previewRadioGroupModel.value ?? ''
    }
  }

  if (tagName === 'yswitch') {
    if (previewSwitchSource.value !== checkedSource.value) {
      previewSwitchSource.value = checkedSource.value
      previewSwitchModel.value = typeof props.modelValue === 'boolean'
        ? props.modelValue
        : false
    }

    return {
      ...props,
      modelValue: previewSwitchModel.value ?? false
    }
  }

  if (tagName === 'ycolorpicker') {
    if (previewColorPickerSource.value !== checkedSource.value) {
      previewColorPickerSource.value = checkedSource.value
      previewColorPickerModel.value = typeof props.modelValue === 'string'
        ? props.modelValue
        : ''
    }

    return {
      ...props,
      modelValue: previewColorPickerModel.value ?? ''
    }
  }

  if (tagName === 'ydatepicker') {
    if (previewDatePickerSource.value !== checkedSource.value) {
      previewDatePickerSource.value = checkedSource.value
      previewDatePickerModel.value = typeof props.modelValue === 'string'
        ? props.modelValue
        : ''
    }

    return {
      ...props,
      modelValue: previewDatePickerModel.value ?? ''
    }
  }

  if (tagName === 'ytimepicker') {
    if (previewTimePickerSource.value !== checkedSource.value) {
      previewTimePickerSource.value = checkedSource.value
      previewTimePickerModel.value = typeof props.modelValue === 'string'
        ? props.modelValue
        : ''
    }

    return {
      ...props,
      modelValue: previewTimePickerModel.value ?? ''
    }
  }

  if (tagName === 'yinputnumber') {
    if (previewInputNumberSource.value !== checkedSource.value) {
      previewInputNumberSource.value = checkedSource.value
      previewInputNumberModel.value = typeof props.modelValue === 'number'
        ? props.modelValue
        : null
    }

    return {
      ...props,
      modelValue: previewInputNumberModel.value
    }
  }

  if (tagName === 'yslider') {
    if (previewSliderSource.value !== checkedSource.value) {
      previewSliderSource.value = checkedSource.value
      previewSliderModel.value = Array.isArray(props.modelValue)
        ? [...props.modelValue as number[]]
        : typeof props.modelValue === 'number'
          ? props.modelValue
          : 0
    }

    return {
      ...props,
      modelValue: Array.isArray(previewSliderModel.value)
        ? [...previewSliderModel.value]
        : previewSliderModel.value ?? 0
    }
  }

  if (tagName === 'yrate') {
    if (previewRateSource.value !== checkedSource.value) {
      previewRateSource.value = checkedSource.value
      previewRateModel.value = typeof props.modelValue === 'number'
        ? props.modelValue
        : 0
    }

    return {
      ...props,
      modelValue: previewRateModel.value ?? 0
    }
  }

  if (tagName === 'yinput') {
    if (previewInputSource.value !== checkedSource.value) {
      previewInputSource.value = checkedSource.value
      previewInputModel.value = typeof props.modelValue === 'string'
        ? props.modelValue
        : ''
    }

    return {
      ...props,
      modelValue: previewInputModel.value ?? ''
    }
  }

  if (tagName === 'yautocomplete') {
    if (previewAutocompleteSource.value !== checkedSource.value) {
      previewAutocompleteSource.value = checkedSource.value
      previewAutocompleteModel.value = typeof props.modelValue === 'string'
        ? props.modelValue
        : ''
    }

    return {
      ...props,
      modelValue: previewAutocompleteModel.value ?? ''
    }
  }

  if (tagName === 'ymention') {
    if (previewMentionSource.value !== checkedSource.value) {
      previewMentionSource.value = checkedSource.value
      previewMentionModel.value = typeof props.modelValue === 'string'
        ? props.modelValue
        : ''
    }

    return {
      ...props,
      modelValue: previewMentionModel.value ?? ''
    }
  }

  if (tagName === 'ytextarea') {
    if (previewTextareaSource.value !== checkedSource.value) {
      previewTextareaSource.value = checkedSource.value
      previewTextareaModel.value = typeof props.modelValue === 'string'
        ? props.modelValue
        : ''
    }

    return {
      ...props,
      modelValue: previewTextareaModel.value ?? ''
    }
  }

  if (tagName === 'ypagination') {
    if (previewPaginationSource.value !== checkedSource.value) {
      previewPaginationSource.value = checkedSource.value
      previewPaginationPage.value = typeof props.page === 'number'
        ? props.page
        : 1
      previewPaginationPageSize.value = typeof props.pageSize === 'number'
        ? props.pageSize
        : 10
    }

    return {
      ...props,
      page: previewPaginationState.value?.page ?? previewPaginationPage.value ?? 1,
      pageSize: previewPaginationState.value?.pageSize ?? previewPaginationPageSize.value ?? props.pageSize ?? 10,
      total: previewPaginationState.value?.total ?? props.total
    }
  }

  if (tagName === 'ylist') {
    if (previewListState.value === null) {
      return props
    }

    const status = previewListState.value.status
    const items = status === 'empty'
      ? []
      : Array.isArray(props.items)
        ? props.items
        : fallbackListItems

    return {
      ...props,
      description: status === 'empty'
        ? 'Filters returned no matching tasks.'
        : status === 'retrying'
          ? 'Remote refresh is being attempted again.'
          : props.description,
      emptyText: status === 'empty' ? 'No matching tasks' : props.emptyText,
      items,
      loading: status === 'loading' || status === 'retrying',
      title: status === 'loading'
        ? 'Refreshing review tasks'
        : status === 'resolved'
          ? 'Release checklist ready'
          : status === 'empty'
            ? 'No matching tasks'
            : status === 'retrying'
              ? 'Retrying task refresh'
              : props.title,
      workflowStatus: status,
      workflowStatusText: previewListState.value.statusText
    }
  }

  if (tagName === 'ydescriptions') {
    if (previewDescriptionsState.value === null) {
      return props
    }

    const status = previewDescriptionsState.value.status
    const loadedItems = fallbackDescriptionItems.map((item) => ({ ...item }))
    const reviewItems = loadedItems.map((item) => item.key === 'status'
      ? { ...item, value: 'Needs review' }
      : item
    )
    const longFieldItems = [
      { key: 'component', label: 'Component', value: 'YDescriptions' },
      { key: 'owner', label: 'Owner', value: 'Design system' },
      {
        key: 'decision',
        label: 'Decision',
        value: 'The component is ready for detail pages, review sidebars and changelog metadata. Long decision records should stay readable without moving into table cells.',
        span: 2
      },
      { key: 'risk', label: 'Risk', value: 'Long notes need responsive wrapping and visible labels.', span: 2 }
    ]
    const items = status === 'empty'
      ? []
      : status === 'review'
        ? reviewItems
        : status === 'long'
          ? longFieldItems
          : loadedItems

    return {
      ...props,
      bordered: true,
      column: status === 'empty' ? 1 : status === 'loaded' ? 3 : 2,
      description: status === 'review'
        ? 'Readonly metadata for release approval.'
        : status === 'empty'
          ? 'The selected component has not synced profile metadata.'
          : status === 'long'
            ? 'Use wider spans for notes, risk explanations and release context.'
            : 'Readable metadata for detail pages.',
      emptyText: status === 'empty' ? 'No component metadata available' : props.emptyText,
      items,
      layout: status === 'loaded' || status === 'long' ? 'horizontal' : props.layout,
      title: status === 'review'
        ? 'Release review profile'
        : status === 'empty'
          ? 'No metadata yet'
          : status === 'long'
            ? 'Decision record ready'
            : 'Component profile loaded',
      workflowStatus: status,
      workflowStatusText: previewDescriptionsState.value.statusText
    }
  }

  if (tagName === 'ytimeline') {
    if (previewTimelineState.value === null) {
      return props
    }

    const status = previewTimelineState.value.status
    const runningItems = [
      { title: 'Build package', value: 'build', description: 'Package bundle finished successfully.', time: '11:20', tone: 'success' },
      { title: 'Publish package', value: 'publish', description: 'Release job is still publishing package output.', time: '12:40', tone: 'info', loading: true }
    ]
    const failedItems = [
      { title: 'Build package', value: 'build', description: 'Package bundle finished successfully.', time: '11:20', tone: 'success' },
      { title: 'Publish package', value: 'publish', description: 'Release failed during publish.', time: '12:40', tone: 'danger' },
      { title: 'Collect diagnostics', value: 'diagnostics', description: 'Owner review is required before retrying the release.', time: '12:44', tone: 'warning' }
    ]
    const rollbackItems = [
      { title: 'Rollback release package', value: 'rollback', description: 'The release channel was restored to the previous stable package.', time: '12:52', tone: 'danger' },
      { title: 'Publish failed', value: 'publish', description: 'Package publication failed and triggered rollback.', time: '12:40', tone: 'warning' },
      { title: 'Build package', value: 'build', description: 'Package bundle finished before rollback started.', time: '11:20', tone: 'success' }
    ]
    const completeItems = [
      { title: 'Build package', value: 'build', description: 'Package bundle finished successfully.', time: '11:20', tone: 'success' },
      { title: 'Publish package', value: 'publish', description: 'Package was published to the release channel.', time: '12:40', tone: 'success' },
      { title: 'Release workflow complete', value: 'complete', description: 'Docs, package and changelog are aligned for this release.', time: '12:55', tone: 'success' }
    ]
    const items = status === 'failed'
      ? failedItems
      : status === 'rollback'
        ? rollbackItems
        : status === 'complete'
          ? completeItems
          : runningItems

    return {
      ...props,
      description: status === 'failed'
        ? 'Release failed and diagnostics were recorded for owner review.'
        : status === 'rollback'
          ? 'Rollback path shows newest recovery actions first.'
          : status === 'complete'
            ? 'Package, docs and changelog finished in order.'
            : 'Release job is running and the final node stays busy.',
      items,
      placement: status === 'rollback' ? 'right' : props.placement,
      reverse: previewTimelineState.value.reverse,
      title: status === 'failed'
        ? 'Release failure timeline'
        : status === 'rollback'
          ? 'Rollback timeline'
          : status === 'complete'
            ? 'Release complete timeline'
            : 'Publishing package timeline',
      workflowStatus: status,
      workflowStatusText: previewTimelineState.value.statusText
    }
  }

  if (tagName === 'ystatistic') {
    if (previewStatisticState.value === null) {
      return props
    }

    const status = previewStatisticState.value.status

    return {
      ...props,
      ariaLabel: status === 'warning'
        ? 'Error budget warning metric'
        : status === 'loading'
          ? 'Refreshing active users metric'
          : 'Active users metric',
      loading: status === 'loading',
      precision: status === 'warning' ? 1 : undefined,
      prefix: status === 'warning' ? '' : '+',
      suffix: status === 'warning' ? '%' : 'today',
      title: status === 'warning'
        ? 'Error budget used'
        : status === 'loading'
          ? 'Refreshing active users'
          : status === 'refreshed'
            ? 'Active users refreshed'
            : 'Active users baseline',
      tone: previewStatisticState.value.tone,
      value: previewStatisticState.value.value,
      workflowStatus: status,
      workflowStatusText: previewStatisticState.value.statusText
    }
  }

  if (tagName === 'ysteps') {
    if (previewStepsSource.value !== checkedSource.value) {
      previewStepsSource.value = checkedSource.value
      previewStepsCurrent.value = typeof props.current === 'number'
        ? props.current
        : 0
    }

    const workflowStatus = previewStepsState.value?.status ?? ''
    const workflowItems = Array.isArray(props.items)
      ? (props.items as Array<Record<string, unknown>>).map((item, index) => {
          if (workflowStatus === 'blocked' && index === 1) {
            return {
              ...item,
              description: 'Review blocked',
              status: 'error'
            }
          }

          if (workflowStatus === 'complete') {
            return {
              ...item,
              status: 'finish'
            }
          }

          return item
        })
      : props.items

    return {
      ...props,
      current: previewStepsState.value?.currentStep ?? previewStepsCurrent.value ?? 0,
      items: workflowItems,
      workflowStatus,
      workflowStatusText: previewStepsState.value?.statusText ?? ''
    }
  }

  if (tagName === 'ytour') {
    if (previewTourSource.value !== checkedSource.value) {
      previewTourSource.value = checkedSource.value
      previewTourOpen.value = typeof props.open === 'boolean'
        ? props.open
        : true
      previewTourCurrent.value = typeof props.current === 'number'
        ? props.current
        : 0
    }

    return {
      ...props,
      open: previewTourOpen.value ?? true,
      current: previewTourCurrent.value ?? 0
    }
  }

  if (tagName === 'ycollapse') {
    if (previewCollapseSource.value !== checkedSource.value) {
      previewCollapseSource.value = checkedSource.value
      previewCollapseModel.value = Array.isArray(props.modelValue)
        ? [...props.modelValue as string[]]
        : []
    }

    return {
      ...props,
      accordion: previewCollapseState.value?.accordion ?? props.accordion,
      modelValue: previewCollapseState.value?.openPanels ?? previewCollapseModel.value ?? [],
      workflowStatus: previewCollapseState.value?.status ?? '',
      workflowStatusText: previewCollapseState.value?.statusText ?? ''
    }
  }

  if (tagName === 'ytabs') {
    if (previewTabsSource.value !== checkedSource.value) {
      previewTabsSource.value = checkedSource.value
      previewTabsModel.value = typeof props.modelValue === 'string'
        ? props.modelValue
        : ''
    }

    return {
      ...props,
      modelValue: previewTabsModel.value ?? ''
    }
  }

  if (tagName === 'ytree') {
    if (previewTreeSource.value !== checkedSource.value) {
      previewTreeSource.value = checkedSource.value
      previewTreeSelectedKey.value = typeof props.selectedKey === 'string'
        ? props.selectedKey
        : ''
      previewTreeExpandedKeys.value = Array.isArray(props.expandedKeys)
        ? [...props.expandedKeys as string[]]
        : []
      previewTreeCheckedKeys.value = Array.isArray(props.checkedKeys)
        ? [...props.checkedKeys as string[]]
        : []
    }

    return {
      ...props,
      selectedKey: previewTreeSelectedKey.value ?? '',
      expandedKeys: previewTreeExpandedKeys.value ?? [],
      checkedKeys: previewTreeCheckedKeys.value ?? []
    }
  }

  if (tagName === 'ycheckboxgroup') {
    if (previewCheckboxGroupSource.value !== checkedSource.value) {
      previewCheckboxGroupSource.value = checkedSource.value
      previewCheckboxGroupModel.value = Array.isArray(props.modelValue)
        ? [...props.modelValue as Array<string | number>]
        : []
    }

    return {
      ...props,
      modelValue: previewCheckboxGroupModel.value ?? []
    }
  }

  if (tagName === 'yschemaform') {
    if (previewSchemaFormSource.value !== checkedSource.value) {
      previewSchemaFormSource.value = checkedSource.value
      previewSchemaFormModel.value = ensureSchemaFormArrayItemIds(props.modelValue)
    }

    return {
      ...props,
      modelValue: previewSchemaFormModel.value ?? {}
    }
  }

  if (tagName === 'ytransfer') {
    if (previewTransferSource.value !== checkedSource.value) {
      previewTransferSource.value = checkedSource.value
      previewTransferModel.value = Array.isArray(props.modelValue)
        ? [...props.modelValue as string[]]
        : []
    }

    return {
      ...props,
      modelValue: previewTransferModel.value ?? []
    }
  }

  if (tagName === 'yfieldarray') {
    if (previewFieldArraySource.value !== checkedSource.value) {
      previewFieldArraySource.value = checkedSource.value
      previewFieldArrayIdCounter.value = 0
      previewFieldArrayItems.value = ensureFieldArrayItemIds(props.modelValue)
    }

    return {
      ...props,
      modelValue: previewFieldArrayItems.value ?? []
    }
  }

  if (tagName !== 'ydatatable' || !Array.isArray(props.columnKeys)) {
    return props
  }

  if (previewDataTableColumnSource.value !== checkedSource.value) {
    previewDataTableColumnSource.value = checkedSource.value
    previewDataTableColumnKeys.value = [...props.columnKeys]
  }

  return {
    ...props,
    columnKeys: previewDataTableColumnKeys.value ?? props.columnKeys
  }
}

function resetInteractivePreviewState() {
  previewDataTableColumnKeys.value = null
  previewDataTableColumnSource.value = ''
  previewFieldArrayItems.value = null
  previewFieldArraySource.value = ''
  previewFieldArrayIdCounter.value = 0
  previewCheckboxGroupModel.value = null
  previewCheckboxGroupSource.value = ''
  previewSchemaFormModel.value = null
  previewSchemaFormSource.value = ''
  previewTransferModel.value = null
  previewTransferSource.value = ''
  previewTabsModel.value = null
  previewTabsSource.value = ''
  previewCollapseState.value = null
  previewCollapseModel.value = null
  previewCollapseSource.value = ''
  previewRateModel.value = null
  previewRateSource.value = ''
  previewSliderModel.value = null
  previewSliderSource.value = ''
  previewInputModel.value = null
  previewInputSource.value = ''
  previewAutocompleteModel.value = null
  previewAutocompleteSource.value = ''
  previewMentionModel.value = null
  previewMentionSource.value = ''
  previewTextareaModel.value = null
  previewTextareaSource.value = ''
  previewInputNumberModel.value = null
  previewInputNumberSource.value = ''
  previewColorPickerModel.value = null
  previewColorPickerSource.value = ''
  previewDatePickerModel.value = null
  previewDatePickerSource.value = ''
  previewTimePickerModel.value = null
  previewTimePickerSource.value = ''
  previewDateRangeModel.value = null
  previewDateRangeSource.value = ''
  previewSelectModel.value = null
  previewSelectSource.value = ''
  previewSelectRemoteResolved.value = false
  previewAlertState.value = null
  previewDropdownAction.value = null
  previewPopconfirmAction.value = null
  previewModalAction.value = null
  previewDrawerAction.value = null
  previewEmptyAction.value = null
  previewMessageState.value = null
  previewListState.value = null
  previewDescriptionsState.value = null
  previewTimelineState.value = null
  previewStatisticState.value = null
  previewPaginationState.value = null
  previewProgressState.value = null
  previewResultAction.value = null
  previewSkeletonState.value = null
  previewPopoverOpen.value = null
  previewTooltipOpen.value = null
  previewImageOpen.value = false
  previewCascaderModel.value = null
  previewCascaderSource.value = ''
  previewUploadFiles.value = null
  previewUploadRejectedFiles.value = null
  previewUploadSource.value = ''
  previewCheckboxModel.value = null
  previewCheckboxSource.value = ''
  previewRadioGroupModel.value = null
  previewRadioGroupSource.value = ''
  previewSwitchModel.value = null
  previewSwitchSource.value = ''
  previewStepsState.value = null
  previewStepsCurrent.value = null
  previewStepsSource.value = ''
  previewTourOpen.value = null
  previewTourCurrent.value = null
  previewTourSource.value = ''
  previewPaginationPage.value = null
  previewPaginationPageSize.value = null
  previewPaginationSource.value = ''
  previewTreeSelectedKey.value = null
  previewTreeExpandedKeys.value = null
  previewTreeCheckedKeys.value = null
  previewTreeSource.value = ''
  previewTableSelectedRowKeys.value = null
  previewTableFilters.value = null
  previewTableSortKey.value = null
  previewTableSortOrder.value = undefined
  previewTableSource.value = ''
  previewTableWorkflowSnapshot.value = null
  copiedPreviewState.value = false
}

function getTemplateSlotName(element: Element) {
  const slotAliases: Record<string, string> = {
    actions: 'actions',
    aside: 'aside',
    detail: 'detail',
    detailfooter: 'detailFooter',
    extra: 'extra',
    footer: 'footer',
    'item-status': 'item-status',
    searchactions: 'searchActions',
    toolbar: 'toolbar'
  }
  const attributes = Array.from(element.attributes)
  const attribute = attributes.find((item) => item.name.startsWith('#') || item.name.startsWith('v-slot:'))
    ?? attributes.find((item) => item.name in slotAliases)

  if (!attribute) {
    return ''
  }

  const rawName = attribute.name.startsWith('#')
    ? attribute.name.slice(1)
    : attribute.name.replace(/^v-slot:/, '')

  return slotAliases[rawName] ?? rawName
}

function renderChildNodes(nodes: Iterable<ChildNode>) {
  return Array.from(nodes)
    .map((childNode) => renderNode(childNode))
    .filter(Boolean) as VNodeChild[]
}

function createScopedPreviewSlot(tagName: string, slotName: string, children: VNodeChild[]) {
  if (tagName === 'ytable' && slotName === 'expand') {
    return (scope: { row?: Record<string, unknown>; rowKey?: string }) => {
      const detail = typeof scope.row?.detail === 'string' ? scope.row.detail : ''
      const rowKey = scope.rowKey ?? ''
      const content = detail ? `${rowKey} · ${detail}` : rowKey

      return [h('div', { class: 'demo-note' }, content)]
    }
  }

  return () => children
}

const previewNodeKeys = new WeakMap<Element, string>()
let previewNodeKeySeed = 0

function getPreviewNodeKey(element: Element) {
  const existingKey = previewNodeKeys.get(element)

  if (existingKey) {
    return existingKey
  }

  const nextKey = `live-node-${previewNodeKeySeed++}`

  previewNodeKeys.set(element, nextKey)

  return nextKey
}

function renderNode(node: ChildNode): VNodeChild {
  if (node.nodeType === 3) {
    return node.textContent?.trim() || null
  }

  if (node.nodeType !== 1) {
    return null
  }

  const element = node as Element
  const tagName = element.tagName.toLowerCase()

  if (tagName === 'template') {
    const templateElement = element as HTMLTemplateElement

    return renderChildNodes(templateElement.content?.childNodes ?? element.childNodes)
  }

  const slotChildren: Record<string, VNodeChild[]> = {}
  const defaultChildren: VNodeChild[] = []

  for (const childNode of Array.from(element.childNodes)) {
    if (childNode.nodeType === 1 && (childNode as Element).tagName.toLowerCase() === 'template') {
      const slotName = getTemplateSlotName(childNode as Element)

      if (slotName) {
        const templateElement = childNode as HTMLTemplateElement
        slotChildren[slotName] = renderChildNodes(templateElement.content?.childNodes ?? templateElement.childNodes)
        continue
      }
    }

    const renderedChild = renderNode(childNode)

    if (renderedChild) {
      defaultChildren.push(renderedChild)
    }
  }

  if (tagName in componentMap) {
    const nodeProps = getNodeProps(element)
    const interactiveProps = createInteractiveProps(tagName, nodeProps)
    const eventHandlers = createEventHandlers(tagName)

    const slots: Record<string, (scope?: Record<string, unknown>) => VNodeChild[]> = {
      default: () => defaultChildren
    }

    Object.entries(slotChildren).forEach(([slotName, children]) => {
      slots[slotName] = createScopedPreviewSlot(tagName, slotName, children)
    })

    if (tagName === 'ytable' && nodeProps.expandable && !slots.expand) {
      slots.expand = createScopedPreviewSlot(tagName, 'expand', [])
    }

    return h(
      componentMap[tagName as keyof typeof componentMap],
      {
        key: getPreviewNodeKey(element),
        ...interactiveProps,
        ...eventHandlers,
        ...(tagName === 'ydatatable' && Array.isArray(nodeProps.columnKeys)
          ? {
              'onUpdate:columnKeys': (keys: string[]) => {
                previewDataTableColumnKeys.value = [...keys]
                eventHandlers['onUpdate:columnKeys'](keys)
              }
            }
          : {}),
        ...(tagName === 'yfieldarray'
          ? {
              'onUpdate:modelValue': (items: YFieldArrayValue) => {
                const nextItems = ensureFieldArrayItemIds(items)

                previewFieldArrayItems.value = nextItems
                eventHandlers['onUpdate:modelValue'](nextItems)
              }
            }
          : {}),
        ...(tagName === 'ycheckboxgroup'
          ? {
              'onUpdate:modelValue': (value: Array<string | number>) => {
                previewCheckboxGroupModel.value = [...value]
                eventHandlers['onUpdate:modelValue'](value)
              }
            }
          : {}),
        ...(tagName === 'ytransfer'
          ? {
              'onUpdate:modelValue': (value: string[]) => {
                previewTransferModel.value = [...value]
                eventHandlers['onUpdate:modelValue'](value)
              }
            }
          : {}),
        ...(tagName === 'ytabs'
          ? {
              'onUpdate:modelValue': (value: string) => {
                previewTabsModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              }
            }
          : {}),
        ...(tagName === 'ycollapse'
          ? {
              'onUpdate:modelValue': (value: string[]) => {
                previewCollapseState.value = null
                previewCollapseModel.value = [...value]
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: string[]) => {
                previewCollapseState.value = null
                previewCollapseModel.value = [...value]
                eventHandlers.onChange(value)
              }
            }
          : {}),
        ...(tagName === 'yrate'
          ? {
              'onUpdate:modelValue': (value: number) => {
                previewRateModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: number) => {
                previewRateModel.value = value
                eventHandlers.onChange(value)
              }
            }
          : {}),
        ...(tagName === 'yslider'
          ? {
              'onUpdate:modelValue': (value: PreviewSliderModel) => {
                previewSliderModel.value = Array.isArray(value) ? [...value] : value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewSliderModel) => {
                previewSliderModel.value = Array.isArray(value) ? [...value] : value
                eventHandlers.onChange(value)
              }
            }
          : {}),
        ...(tagName === 'yinput'
          ? {
              'onUpdate:modelValue': (value: PreviewStringModel) => {
                previewInputModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewStringModel) => {
                previewInputModel.value = value
                eventHandlers.onChange(value)
              },
              onClear: () => {
                previewInputModel.value = ''
                eventHandlers.onClear()
              }
            }
          : {}),
        ...(tagName === 'yautocomplete'
          ? {
              'onUpdate:modelValue': (value: PreviewStringModel) => {
                previewAutocompleteModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewStringModel) => {
                previewAutocompleteModel.value = value
                eventHandlers.onChange(value)
              },
              onSelect: (option: unknown) => {
                eventHandlers.onSelect(option)
              },
              onClear: () => {
                previewAutocompleteModel.value = ''
                eventHandlers.onClear()
              }
            }
          : {}),
        ...(tagName === 'ymention'
          ? {
              'onUpdate:modelValue': (value: PreviewStringModel) => {
                previewMentionModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewStringModel) => {
                previewMentionModel.value = value
                eventHandlers.onChange(value)
              },
              onSelect: (option: unknown, prefix: string) => {
                eventHandlers.onSelect(option, prefix)
              },
              onClear: () => {
                previewMentionModel.value = ''
                eventHandlers.onClear()
              }
            }
          : {}),
        ...(tagName === 'ytextarea'
          ? {
              'onUpdate:modelValue': (value: PreviewStringModel) => {
                previewTextareaModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              }
            }
          : {}),
        ...(tagName === 'yinputnumber'
          ? {
              'onUpdate:modelValue': (value: PreviewInputNumberModel) => {
                previewInputNumberModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewInputNumberModel) => {
                previewInputNumberModel.value = value
                eventHandlers.onChange(value)
              }
            }
          : {}),
        ...(tagName === 'ycolorpicker'
          ? {
              'onUpdate:modelValue': (value: PreviewStringModel) => {
                previewColorPickerModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewStringModel) => {
                previewColorPickerModel.value = value
                eventHandlers.onChange(value)
              },
              onClear: () => {
                previewColorPickerModel.value = ''
                eventHandlers.onClear()
              }
            }
          : {}),
        ...(tagName === 'ydatepicker'
          ? {
              'onUpdate:modelValue': (value: PreviewStringModel) => {
                previewDatePickerModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewStringModel) => {
                previewDatePickerModel.value = value
                eventHandlers.onChange(value)
              },
              onClear: () => {
                previewDatePickerModel.value = ''
                eventHandlers.onClear()
              }
            }
          : {}),
        ...(tagName === 'ytimepicker'
          ? {
              'onUpdate:modelValue': (value: PreviewStringModel) => {
                previewTimePickerModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewStringModel) => {
                previewTimePickerModel.value = value
                eventHandlers.onChange(value)
              },
              onClear: () => {
                previewTimePickerModel.value = ''
                eventHandlers.onClear()
              }
            }
          : {}),
        ...(tagName === 'ydaterangepicker'
          ? {
              'onUpdate:modelValue': (value: string[]) => {
                previewDateRangeModel.value = [...value]
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: string[]) => {
                previewDateRangeModel.value = [...value]
                eventHandlers.onChange(value)
              },
              onClear: () => {
                previewDateRangeModel.value = []
                eventHandlers.onClear()
              }
            }
          : {}),
        ...(tagName === 'yselect' || tagName === 'ytreeselect'
          ? {
              'onUpdate:modelValue': (value: PreviewSelectModel) => {
                previewSelectModel.value = Array.isArray(value) ? [...value] : value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewSelectModel) => {
                previewSelectModel.value = Array.isArray(value) ? [...value] : value
                eventHandlers.onChange(value)
              },
              onClear: () => {
                previewSelectModel.value = Array.isArray(previewSelectModel.value) ? [] : ''
                eventHandlers.onClear()
              }
            }
          : {}),
        ...(tagName === 'ycascader'
          ? {
              'onUpdate:modelValue': (value: PreviewCascaderModel) => {
                previewCascaderModel.value = Array.isArray(value[0])
                  ? (value as string[][]).map((path) => [...path])
                  : [...value as string[]]
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (payload: { value?: PreviewCascaderModel }) => {
                if (Array.isArray(payload.value)) {
                  previewCascaderModel.value = Array.isArray(payload.value[0])
                    ? (payload.value as string[][]).map((path) => [...path])
                    : [...payload.value as string[]]
                }
                eventHandlers.onChange(payload)
              },
              onClear: () => {
                previewCascaderModel.value = []
                eventHandlers.onClear()
              },
              onLoad: (payload: unknown) => {
                eventHandlers.onLoad(payload)
              },
              onLoadError: (payload: unknown) => {
                eventHandlers.onLoadError(payload)
              }
            }
          : {}),
        ...(tagName === 'yupload'
          ? {
              'onUpdate:modelValue': (files: YUploadFile[]) => {
                setPreviewUploadFiles(files)
                eventHandlers['onUpdate:modelValue'](files)
              },
              onChange: (files: YUploadFile[]) => {
                setPreviewUploadFiles(files)
                eventHandlers.onChange(files)
              },
              onRemove: (file: YUploadFile, files: YUploadFile[]) => {
                setPreviewUploadFiles(files)
                eventHandlers.onRemove(file, files)
              },
              onClear: (files: YUploadFile[]) => {
                previewUploadFiles.value = []
                eventHandlers.onClear(files)
              },
              onDrop: (files: YUploadFile[], event: DragEvent) => {
                setPreviewUploadFiles(files)
                eventHandlers.onDrop(files, event)
              },
              onReorder: (files: YUploadFile[]) => {
                setPreviewUploadFiles(files)
                eventHandlers.onReorder(files)
              },
              onProgress: (file: YUploadFile, files: YUploadFile[]) => {
                setPreviewUploadFiles(files)
                eventHandlers.onProgress(file, files)
              },
              onSuccess: (file: YUploadFile, response: unknown, files: YUploadFile[]) => {
                setPreviewUploadFiles(files)
                eventHandlers.onSuccess(file, response, files)
              },
              onError: (file: YUploadFile, error: unknown, files: YUploadFile[]) => {
                setPreviewUploadFiles(files)
                eventHandlers.onError(file, error, files)
              },
              onAbort: (file: YUploadFile, files: YUploadFile[]) => {
                setPreviewUploadFiles(files)
                eventHandlers.onAbort(file, files)
              },
              onDismissReject: (_file: PreviewUploadRejectedFile, files: PreviewUploadRejectedFile[]) => {
                previewUploadRejectedFiles.value = cloneUploadRejectedPreviewFiles(files)
                eventHandlers.onDismissReject(_file, files)
              },
              onRetry: (file: YUploadFile) => {
                eventHandlers.onRetry(file)
              },
              onPreview: (file: YUploadFile) => {
                eventHandlers.onPreview(file)
              },
              onDownload: (file: YUploadFile) => {
                eventHandlers.onDownload(file)
              },
              onExceed: (files: YUploadFile[], maxFiles: number) => {
                eventHandlers.onExceed(files, maxFiles)
              },
              onReject: (files: File[], reason: string) => {
                previewUploadRejectedFiles.value = createUploadRejectedPreviewFiles(files, reason)
                eventHandlers.onReject(files, reason)
              }
            }
          : {}),
        ...(tagName === 'ycheckbox'
          ? {
              'onUpdate:modelValue': (value: PreviewBooleanModel) => {
                previewCheckboxModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              }
            }
          : {}),
        ...(tagName === 'yradiogroup'
          ? {
              'onUpdate:modelValue': (value: PreviewRadioModel) => {
                previewRadioGroupModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewRadioModel) => {
                previewRadioGroupModel.value = value
                eventHandlers.onChange(value)
              }
            }
          : {}),
        ...(tagName === 'yswitch'
          ? {
              'onUpdate:modelValue': (value: PreviewBooleanModel) => {
                previewSwitchModel.value = value
                eventHandlers['onUpdate:modelValue'](value)
              },
              onChange: (value: PreviewBooleanModel) => {
                previewSwitchModel.value = value
                eventHandlers.onChange(value)
              }
            }
          : {}),
        ...(tagName === 'ysteps'
          ? {
              onSelect: (item: unknown, index: number) => {
                previewStepsCurrent.value = index
                eventHandlers.onSelect(item, index)
              }
            }
          : {}),
        ...(tagName === 'ytour'
          ? {
              'onUpdate:open': (open: boolean) => {
                previewTourOpen.value = open
                eventHandlers['onUpdate:open'](open)
              },
              'onUpdate:current': (index: number) => {
                previewTourCurrent.value = index
                eventHandlers['onUpdate:current'](index)
              },
              onChange: (index: number, step: unknown) => {
                previewTourCurrent.value = index
                eventHandlers.onChange(index, step)
              },
              onFinish: () => {
                previewTourOpen.value = false
                eventHandlers.onFinish()
              },
              onClose: () => {
                previewTourOpen.value = false
                eventHandlers.onClose()
              }
            }
          : {}),
        ...(tagName === 'ypagination'
          ? {
              'onUpdate:page': (page: number) => {
                previewPaginationPage.value = page
                eventHandlers['onUpdate:page'](page)
              },
              onChange: (page: number) => {
                previewPaginationPage.value = page
                eventHandlers.onChange(page)
              }
            }
          : {}),
        ...(tagName === 'ytree'
          ? {
              'onUpdate:selectedKey': (value: string) => {
                previewTreeSelectedKey.value = value
                eventHandlers['onUpdate:selectedKey'](value)
              },
              'onUpdate:expandedKeys': (value: string[]) => {
                previewTreeExpandedKeys.value = [...value]
                eventHandlers['onUpdate:expandedKeys'](value)
              },
              'onUpdate:checkedKeys': (value: string[]) => {
                previewTreeCheckedKeys.value = [...value]
                eventHandlers['onUpdate:checkedKeys'](value)
              }
            }
          : {}),
        ...(tagName === 'ytable'
          ? {
              'onUpdate:selectedRowKeys': (keys: string[]) => {
                previewTableSelectedRowKeys.value = [...keys]
                syncPreviewTableWorkflowSnapshot()
                eventHandlers['onUpdate:selectedRowKeys'](keys)
              },
              'onUpdate:filters': (filters: YTableFilterState) => {
                previewTableFilters.value = cloneTableFilterState(filters)
                syncPreviewTableWorkflowSnapshot()
                eventHandlers['onUpdate:filters'](filters)
              },
              'onUpdate:sortKey': (key: string) => {
                previewTableSortKey.value = key
                syncPreviewTableWorkflowSnapshot()
                eventHandlers['onUpdate:sortKey'](key)
              },
              'onUpdate:sortOrder': (order: YTableSortOrder) => {
                previewTableSortOrder.value = order
                syncPreviewTableWorkflowSnapshot()
                eventHandlers['onUpdate:sortOrder'](order)
              },
              onSelectionChange: (payload: YTableSelectionPayload) => {
                previewTableSelectedRowKeys.value = [...payload.selectedRowKeys]
                syncPreviewTableWorkflowSnapshot()
                eventHandlers.onSelectionChange(payload)
              },
              onSortChange: (payload: YTableSortPayload) => {
                previewTableSortKey.value = payload.key
                previewTableSortOrder.value = payload.order
                syncPreviewTableWorkflowSnapshot()
                eventHandlers.onSortChange(payload)
              },
              onFilterChange: (payload: YTableFilterPayload) => {
                previewTableFilters.value = cloneTableFilterState(payload.filters)
                syncPreviewTableWorkflowSnapshot()
                eventHandlers.onFilterChange(payload)
              }
            }
          : {}),
        ...(tagName === 'yschemaform'
          ? {
              'onUpdate:modelValue': (model: Record<string, unknown>) => {
                const nextModel = ensureSchemaFormArrayItemIds(model)

                previewSchemaFormModel.value = nextModel
                eventHandlers['onUpdate:modelValue'](nextModel)
              }
            }
          : {})
      },
      slots
    )
  }

  return h(tagName, getNodeProps(element), defaultChildren)
}

function buildPreview() {
  checkedSource.value = source.value
  resetInteractivePreviewState()

  const template = extractTemplate(source.value)
  const { error, documentFragment, issue } = validateDocument(template, getTemplateStartLine(source.value))

  validationError.value = error
  validationIssue.value = issue

  if (error || !documentFragment) {
    return
  }

  try {
    const root = documentFragment.body.querySelector('main')
    const nodes = Array.from(root?.childNodes ?? [])

    renderFactory.value = () => nodes.map((node) => renderNode(node))
    lastSuccessfulSource.value = source.value
  } catch (errorMessage) {
    validationError.value = errorMessage instanceof Error ? errorMessage.message : '示例渲染失败。'
    validationIssue.value = {
      kind: 'render',
      templateLine: 1,
      sourceLine: getTemplateStartLine(source.value),
      excerpt: '<template>',
      suggestion: '检查组件标签是否闭合、属性值是否符合示例运行器支持的格式。'
    }
  }
}

const liveStats = computed(() => ({
  lines: source.value.split('\n').length,
  characters: source.value.length,
  status: validationError.value
    ? 'Needs fix'
    : source.value !== checkedSource.value
      ? 'Edited'
      : hasStoredDraft.value
        ? 'Draft saved'
        : 'Runnable'
}))
const sourceLineNumbers = computed(() =>
  Array.from({ length: Math.max(source.value.split('\n').length, 1) }, (_item, index) => index + 1)
)
const diagnosticReport = computed(() => {
  if (!validationIssue.value) {
    return ''
  }

  return [
    '# Yok UI live example diagnostic',
    '',
    `- Preset: ${activeComponentMeta.value?.title ?? presetLabels[selectedPreset.value] ?? selectedPreset.value}`,
    `- Component: ${activeComponentMeta.value?.componentName ?? 'Custom source'}`,
    `- Error: ${validationError.value || 'Validation issue'}`,
    `- Template line: ${validationIssue.value.templateLine}`,
    `- SFC line: ${validationIssue.value.sourceLine}`,
    `- Suggestion: ${validationIssue.value.suggestion}`,
    '',
    '## Excerpt',
    '```vue',
    validationIssue.value.excerpt,
    '```',
    '',
    '## Source',
    '```vue',
    source.value,
    '```'
  ].join('\n')
})
const exampleCockpitItems = computed(() => [
  {
    label: 'Props',
    value: hasPropControls.value ? `${activeControls.value.length} controls` : 'Source first',
    detail: hasPropControls.value ? '可视化调试核心属性' : '直接编辑源码模板'
  },
  {
    label: 'Scenarios',
    value: hasScenarioSwitcher.value ? `${activeScenarios.value.length} scenes` : 'Props only',
    detail: hasScenarioSwitcher.value ? '点击场景切换真实工作流状态' : '当前示例以单一状态为主'
  },
  {
    label: 'Events',
    value: eventLogs.value.length ? `${eventLogs.value.length} captured` : 'Ready',
    detail: '预览区交互会记录最近事件'
  },
  {
    label: 'Viewport',
    value: previewViewportLabel.value,
    detail: '桌面、平板和手机宽度预览'
  },
  {
    label: 'Package',
    value: activeComponentMeta.value?.packageName.replace('@yok-ui/', '') ?? 'custom',
    detail: activeComponentMeta.value
      ? `${activeComponentMeta.value.componentName} · ${activeComponentMeta.value.familyTitle}`
      : '自定义源码模板'
  },
  {
    label: 'Source',
    value: hasStoredDraft.value ? 'Draft saved' : copiedLabel.value,
    detail: '支持源码查看、复制和本地草稿'
  }
])
const scenarioCoverageItems = computed<ScenarioCoverageItem[]>(() =>
  scenarioCoverageKinds.map((kind) => {
    const matches = activeScenarios.value.filter((scenario) => scenario.kind === kind)

    return {
      kind,
      label: scenarioKindLabels[kind],
      count: matches.length,
      passed: matches.length > 0,
      detail: matches.length
        ? matches.map((scenario) => scenario.label).slice(0, 3).join(' / ')
        : '待补充'
    }
  })
)
const scenarioCoverageSummary = computed(() => {
  const coveredCount = scenarioCoverageItems.value.filter((item) => item.passed).length
  const totalCount = scenarioCoverageItems.value.length
  const score = totalCount ? Math.round((coveredCount / totalCount) * 100) : 0

  return {
    coveredCount,
    totalCount,
    score,
    scenarioCount: activeScenarios.value.length,
    requiredCount: scenarioCoverageKinds.length
  }
})
const scenarioCoverageManifest = computed(() => [
  '# Yok UI live example coverage manifest',
  '',
  `- Preset: ${activeComponentMeta.value?.title ?? presetLabels[selectedPreset.value] ?? selectedPreset.value}`,
  `- Component: ${activeComponentMeta.value?.componentName ?? 'Custom source'}`,
  `- Docs: ${activeComponentMeta.value?.docs ?? 'n/a'}`,
  `- Package: ${activeComponentMeta.value?.packageName ?? 'Custom source'}`,
  `- Coverage: ${scenarioCoverageSummary.value.coveredCount}/${scenarioCoverageSummary.value.totalCount} kinds (${scenarioCoverageSummary.value.score}%)`,
  `- Scenarios: ${scenarioCoverageSummary.value.scenarioCount}`,
  `- Theme: ${selectedThemeMeta.value?.label ?? selectedTheme.value}`,
  `- Viewport: ${previewViewportLabel.value}`,
  '',
  '## Scenario coverage',
  ...scenarioCoverageItems.value.map((item) =>
    `- [${item.passed ? 'x' : ' '}] ${item.label}: ${item.count ? `${item.count} - ${item.detail}` : 'missing'}`
  ),
  '',
  '## Active scenario',
  `- Key: ${activeScenario.value?.key ?? 'n/a'}`,
  `- Label: ${activeScenario.value?.label ?? (hasScenarioSwitcher.value ? 'No scenario selected' : 'Props only')}`,
  `- Link: ${activeScenarioShareUrl.value || 'n/a'}`,
  '',
  '## Playground handoff',
  `- ${playgroundImportUrl.value}`
].join('\n'))
const activeScenarioDebugItems = computed(() => {
  const scenario = activeScenario.value
  const scenarioLabel = scenario?.label ?? (hasScenarioSwitcher.value ? 'No scenario selected' : 'Props only')
  const scenarioKey = scenario?.key ?? selectedPreset.value
  const scenarioKind = scenario ? scenarioKindLabels[scenario.kind] : hasScenarioSwitcher.value ? '未选择' : '单状态'

  return [
    {
      label: 'Active scenario',
      value: scenarioLabel,
      detail: `${scenarioKind} · ${scenarioKey}`
    },
    {
      label: 'Source',
      value: `${liveStats.value.lines} lines`,
      detail: `${liveStats.value.characters} chars · ${copiedLabel.value}`
    },
    {
      label: 'Events',
      value: String(eventLogs.value.length),
      detail: eventLogs.value.length ? 'Recent preview interactions captured' : 'Waiting for preview interaction'
    },
    {
      label: 'Preview',
      value: liveStats.value.status,
      detail: previewViewportLabel.value
    },
    {
      label: 'Share',
      value: activeScenarioShareUrl.value ? 'ready' : 'pending',
      detail: activeScenarioShareUrl.value ? 'Scenario link can be copied' : 'Choose a workflow scenario first'
    }
  ]
})

const activeInteractionContracts = computed<InteractionContract[]>(() => {
  const componentNames = activeComponentMeta.value?.componentNames ?? []

  return interactionContracts.filter((contract) => componentNames.includes(contract.componentName))
})
const apiSectionLabels: Record<ApiSectionKey, string> = {
  props: 'Props',
  events: 'Events',
  slots: 'Slots',
  methods: 'Methods',
  types: 'Types'
}
const apiSectionKeys = Object.keys(apiSectionLabels) as ApiSectionKey[]

function getApiAnchorComponentName(componentName: string) {
  return normalizeApiToken(componentName)
}

function normalizeApiToken(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '').toLowerCase()
}

function getApiSectionRows(api: ComponentApi | undefined, section: ApiSectionKey): ApiRow[] {
  return api?.[section] ?? []
}

function getApiRowUsageToken(row: ApiRow, section: ApiSectionKey) {
  if (section === 'events') {
    return `@${normalizeApiToken(row.name.replace(/^update:/, 'update-'))}`
  }

  if (section === 'slots') {
    return row.name === 'default' ? '<template' : `#${normalizeApiToken(row.name)}`
  }

  return normalizeApiToken(row.name)
}

function isApiRowUsedBySource(row: ApiRow, section: ApiSectionKey) {
  const normalizedSource = source.value.toLowerCase()
  const normalizedName = row.name.toLowerCase()
  const kebabName = normalizeApiToken(row.name)
  const token = getApiRowUsageToken(row, section)

  if (section === 'events') {
    return normalizedSource.includes(token) || normalizedSource.includes(`@${normalizedName}`)
  }

  if (section === 'slots') {
    return row.name === 'default'
      ? normalizedSource.includes('>') && !normalizedSource.includes('/>')
      : normalizedSource.includes(token) || normalizedSource.includes(`v-slot:${kebabName}`)
  }

  if (section === 'types' || section === 'methods') {
    return normalizedSource.includes(normalizedName) || normalizedSource.includes(kebabName)
  }

  return normalizedSource.includes(kebabName) || normalizedSource.includes(normalizedName)
}

const activeComponentApis = computed(() =>
  (activeComponentMeta.value?.componentNames ?? [])
    .map((componentName) => ({
      componentName,
      api: componentApis[componentName]
    }))
    .filter((item): item is { componentName: string; api: ComponentApi } => Boolean(item.api))
)
const activeSourceComponentNames = computed(() =>
  activeComponentApis.value
    .map((item) => item.componentName)
    .filter((componentName) => source.value.includes(`<${componentName}`))
)

function getApiSectionHref(section: ApiSectionKey) {
  const docs = activeComponentMeta.value?.docs ?? ''
  const primaryComponentName = activeSourceComponentNames.value[0] ?? activeComponentApis.value[0]?.componentName
  const hash = activeSourceComponentNames.value.length > 1 && primaryComponentName
    ? `api-${getApiAnchorComponentName(primaryComponentName)}-${section}`
    : `api-${section}`

  return `${docs}#${hash}`
}

function getApiRowHref(section: ApiSectionKey, row: ApiRow) {
  return `${getApiSectionHref(section)}-${normalizeApiToken(row.name)}`
}

const apiMapSectionItems = computed<LiveExampleApiSectionItem[]>(() =>
  apiSectionKeys.map((section) => {
    const rows = activeComponentApis.value.flatMap((item) => getApiSectionRows(item.api, section))
    const usedRows = rows.filter((row) => isApiRowUsedBySource(row, section))
    const samples = (usedRows.length ? usedRows : rows).slice(0, 4).map((row) => ({
      name: row.name,
      href: getApiRowHref(section, row)
    }))
    const status = rows.length === 0 ? 'empty' : usedRows.length > 0 ? 'covered' : 'partial'

    return {
      key: section,
      label: apiSectionLabels[section],
      total: rows.length,
      used: usedRows.length,
      status,
      detail: rows.length
        ? usedRows.length
          ? `${usedRows.length}/${rows.length} rows visible in current source`
          : `${rows.length} rows documented, not referenced by this example`
        : 'No structured rows yet',
      samples,
      href: getApiSectionHref(section)
    }
  })
)
const apiMapSummary = computed(() => {
  const total = apiMapSectionItems.value.reduce((sum, item) => sum + item.total, 0)
  const used = apiMapSectionItems.value.reduce((sum, item) => sum + item.used, 0)
  const sections = apiMapSectionItems.value.filter((item) => item.total > 0).length

  return {
    total,
    used,
    sections,
    score: total ? Math.round((used / total) * 100) : 0,
    componentCount: activeComponentApis.value.length
  }
})
const apiMapManifest = computed(() => [
  '# Yok UI live example API map',
  '',
  `- Preset: ${activeComponentMeta.value?.title ?? presetLabels[selectedPreset.value] ?? selectedPreset.value}`,
  `- Components: ${activeComponentApis.value.map((item) => item.componentName).join(', ') || 'Custom source'}`,
  `- Docs: ${activeComponentMeta.value?.docs ?? 'n/a'}`,
  `- API rows used: ${apiMapSummary.value.used}/${apiMapSummary.value.total}`,
  `- API sections: ${apiMapSummary.value.sections}`,
  `- Scenario: ${activeScenario.value?.label ?? (hasScenarioSwitcher.value ? 'No scenario selected' : 'Props only')}`,
  '',
  '## Sections',
  ...apiMapSectionItems.value.map((item) =>
    `- ${item.label}: ${item.used}/${item.total} ${item.samples.length ? `(${item.samples.map((sample) => sample.name).join(', ')})` : '(no rows)'}`
  ),
  '',
  '## Playground',
  `- ${playgroundImportUrl.value}`
].join('\n'))
const hasInteractionContract = computed(() => activeInteractionContracts.value.length > 0)
const interactionContractSummary = computed(() => {
  if (!hasInteractionContract.value) {
    return {
      label: 'Contract pending',
      value: 'No contract',
      detail: '当前示例还没有登记交互契约。'
    }
  }

  const verifiedCount = activeInteractionContracts.value.filter((contract) => contract.maturity === 'verified').length
  const patternText = activeInteractionContracts.value.map((contract) => contract.pattern).join(' / ')

  return {
    label: verifiedCount === activeInteractionContracts.value.length ? 'Verified contract' : 'Documented contract',
    value: `${verifiedCount}/${activeInteractionContracts.value.length} verified`,
    detail: patternText
  }
})
const interactionContractChecks = computed<InteractionContractCheck[]>(() => {
  if (!hasInteractionContract.value) {
    return []
  }

  const keyboardCount = activeInteractionContracts.value.reduce((total, contract) => total + contract.keyboard.length, 0)
  const semantics = Array.from(new Set(activeInteractionContracts.value.flatMap((contract) => contract.semantics)))
  const docs = Array.from(new Set(activeInteractionContracts.value.flatMap((contract) => contract.evidence.docs)))
  const tests = Array.from(new Set(activeInteractionContracts.value.flatMap((contract) => contract.evidence.tests)))
  const focusSummaries = activeInteractionContracts.value.map((contract) => contract.focus)
  const statusSummaries = activeInteractionContracts.value.map((contract) => contract.status).filter(Boolean)

  return [
    {
      label: 'Keyboard',
      value: `${keyboardCount} paths`,
      detail: activeInteractionContracts.value.flatMap((contract) => contract.keyboard).slice(0, 3).join('；')
    },
    {
      label: 'Focus',
      value: `${focusSummaries.length} rules`,
      detail: focusSummaries.join('；')
    },
    {
      label: 'Semantics',
      value: `${semantics.length} tokens`,
      detail: semantics.slice(0, 6).join(' / ')
    },
    {
      label: 'Evidence',
      value: `${docs.length} docs · ${tests.length} tests`,
      detail: [...docs, ...tests].slice(0, 4).join('；')
    },
    {
      label: 'Status',
      value: statusSummaries.length ? 'State noted' : 'Default',
      detail: statusSummaries.join('；') || '当前契约没有额外状态说明。'
    }
  ]
})
const interactionContractReport = computed(() => {
  if (!hasInteractionContract.value) {
    return [
      '## Interaction contract',
      '- No interaction contract is registered for this live example yet.'
    ].join('\n')
  }

  return [
    '## Interaction contract',
    '',
    ...activeInteractionContracts.value.flatMap((contract) => [
      `### ${contract.componentName}`,
      `- Pattern: ${contract.pattern}`,
      `- Maturity: ${contract.maturity}`,
      `- Focus: ${contract.focus}`,
      contract.status ? `- Status: ${contract.status}` : '',
      `- Semantics: ${contract.semantics.join(', ')}`,
      `- Keyboard: ${contract.keyboard.join(' | ')}`,
      `- Docs: ${contract.evidence.docs.join(', ')}`,
      `- Tests: ${contract.evidence.tests.join(', ')}`
    ].filter(Boolean)),
    ''
  ].join('\n')
})

function formatSyncSnapshotValue(value: string | number | boolean | undefined) {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  if (value === undefined) {
    return 'undefined'
  }

  return String(value)
}

const activeControlSnapshotItems = computed(() =>
  activeControls.value.map((control) => {
    const currentValue = controlState.value[control.key] ?? control.defaultValue
    const changed = currentValue !== control.defaultValue

    return {
      key: control.key,
      label: control.label,
      type: control.type,
      value: currentValue,
      defaultValue: control.defaultValue,
      valueText: formatSyncSnapshotValue(currentValue),
      defaultText: formatSyncSnapshotValue(control.defaultValue),
      changed
    }
  })
)
const changedControlCount = computed(() =>
  activeControlSnapshotItems.value.filter((control) => control.changed).length
)
const syncSnapshotSummaryItems = computed(() => [
  {
    label: 'Component',
    value: activeComponentMeta.value?.componentName ?? presetLabels[selectedPreset.value] ?? selectedPreset.value,
    detail: activeComponentMeta.value?.docs ?? 'Custom source'
  },
  {
    label: 'Scenario',
    value: activeScenario.value?.label ?? (hasScenarioSwitcher.value ? 'Not selected' : 'Props only'),
    detail: activeScenario.value
      ? `${scenarioKindLabels[activeScenario.value.kind]} · ${activeScenario.value.key}`
      : 'Use scenario matrix or props panel to create a state.'
  },
  {
    label: 'Props',
    value: hasPropControls.value ? `${changedControlCount.value}/${activeControls.value.length} changed` : 'Source first',
    detail: hasPropControls.value
      ? 'Changed props are tracked against the recipe defaults.'
      : 'No visual props are registered for this example yet.'
  },
  {
    label: 'Source',
    value: liveStats.value.status,
    detail: `${liveStats.value.lines} lines · ${sourcePanelModeLabel.value}`
  },
  {
    label: 'Preview',
    value: previewViewportLabel.value,
    detail: `${selectedThemeMeta.value?.label ?? selectedTheme.value} theme`
  },
  {
    label: 'Export',
    value: 'Repro ready',
    detail: activeScenarioShareUrl.value ? 'Scenario link, state link and Playground import are aligned.' : 'State and Playground import are aligned.'
  }
])
const runEvidenceItems = computed<RunEvidenceItem[]>(() => [
  {
    key: 'preview',
    label: 'Preview',
    value: liveStats.value.status,
    detail: validationError.value ? validationError.value : `${liveStats.value.lines} lines · ${previewViewportLabel.value}`,
    passed: !validationError.value
  },
  {
    key: 'scenario',
    label: 'Scenario',
    value: activeScenario.value?.label ?? (hasScenarioSwitcher.value ? 'Not selected' : 'Props only'),
    detail: activeScenario.value
      ? `${scenarioKindLabels[activeScenario.value.kind]} · ${activeScenario.value.key}`
      : '场景、属性面板和源码仍可继续关联。',
    passed: !hasScenarioSwitcher.value || Boolean(activeScenario.value)
  },
  {
    key: 'api',
    label: 'API map',
    value: `${apiMapSummary.value.used}/${apiMapSummary.value.total}`,
    detail: `${apiMapSummary.value.sections} sections · ${apiMapSummary.value.componentCount} components`,
    passed: apiMapSummary.value.total === 0 || apiMapSummary.value.used > 0
  },
  {
    key: 'coverage',
    label: 'Coverage',
    value: `${scenarioCoverageSummary.value.score}%`,
    detail: `${scenarioCoverageSummary.value.coveredCount}/${scenarioCoverageSummary.value.totalCount} scenario kinds`,
    passed: scenarioCoverageSummary.value.coveredCount > 0
  },
  {
    key: 'a11y',
    label: 'A11y',
    value: hasInteractionContract.value ? 'Contract linked' : 'Needs contract',
    detail: interactionContractSummary.value.detail,
    passed: hasInteractionContract.value
  },
  {
    key: 'export',
    label: 'Export',
    value: 'Repro ready',
    detail: activeScenarioShareUrl.value ? 'Report, scenario link, state link, Playground and bundle aligned.' : 'Report, state link, Playground and bundle aligned.',
    passed: Boolean(playgroundImportUrl.value)
  }
])
const advancedToolsMetaItems = computed(() => [
  {
    label: 'Evidence',
    value: `${runEvidenceItems.value.filter((item) => item.passed).length}/${runEvidenceItems.value.length}`
  },
  {
    label: 'Scenarios',
    value: `${scenarioCoverageSummary.value.coveredCount}/${scenarioCoverageSummary.value.totalCount}`
  },
  {
    label: 'API',
    value: `${apiMapSummary.value.used}/${apiMapSummary.value.total}`
  },
  {
    label: 'Contract',
    value: hasInteractionContract.value ? 'linked' : 'pending'
  }
])
function getScenarioVisualAssertion(kind?: LiveExampleScenarioKind) {
  if (kind === 'responsive') {
    return '切换到手机或平板视口，确认内容不会横向溢出，主要操作仍在首屏可见。'
  }

  if (kind === 'error') {
    return '确认错误、警告或校验文案直接出现在组件附近，并且不是只依赖颜色表达状态。'
  }

  if (kind === 'empty') {
    return '确认空状态有标题、说明和下一步动作，避免只显示空白区域。'
  }

  if (kind === 'loading') {
    return '确认加载状态尺寸稳定，骨架屏或进度状态不会推动布局跳动。'
  }

  if (kind === 'disabled') {
    return '确认禁用控件保持可读，且视觉上能区分不可操作状态。'
  }

  if (kind === 'keyboard') {
    return '确认焦点可见，键盘路径和视觉顺序保持一致。'
  }

  return '确认示例呈现当前组件的主要可见状态，文案、尺寸和间距保持稳定。'
}

function getScenarioInteractionAssertion(kind?: LiveExampleScenarioKind) {
  if (kind === 'keyboard') {
    return '使用 Tab 进入组件，再按 Enter、Space、方向键或 Escape 验证对应键盘行为。'
  }

  if (kind === 'remote') {
    return '验证远程、刷新或重试路径的加载、成功和失败反馈都能被用户理解。'
  }

  if (kind === 'filter' || kind === 'search') {
    return '修改筛选或搜索条件，确认结果、空态和事件日志同步更新。'
  }

  if (kind === 'multi') {
    return '执行多选、批量或组合操作，确认选择数量和批量动作反馈准确。'
  }

  if (kind === 'copy') {
    return '复制示例文案或命令，确认复制结果和成功反馈都可感知。'
  }

  return '在预览区触发一次可交互控件，确认 Event log 捕获组件事件或状态变化。'
}

const scenarioTestPlan = computed<ScenarioTestStep[]>(() => {
  const scenario = activeScenario.value
  const scenarioLabel = scenario?.label ?? (hasScenarioSwitcher.value ? '选择一个场景' : '当前模板')
  const scenarioKind = scenario ? scenarioKindLabels[scenario.kind] : '单状态'
  const sourceMode = sourcePanelModeLabel.value

  return [
    {
      title: '1. 锁定场景',
      detail: `${scenarioLabel} · ${scenarioKind}。确认场景按钮、属性面板、源码和预览指向同一个状态。`
    },
    {
      title: '2. 检查视觉状态',
      detail: getScenarioVisualAssertion(scenario?.kind)
    },
    {
      title: '3. 验证交互路径',
      detail: getScenarioInteractionAssertion(scenario?.kind)
    },
    {
      title: '4. 核对源码契约',
      detail: `查看 ${sourceMode} 源码，确认示例依赖、props、slot 和当前属性面板保持同步。`
    },
    {
      title: '5. 核对交互契约',
      detail: hasInteractionContract.value
        ? `确认 ${interactionContractSummary.value.detail} 的键盘、焦点和语义约束已在示例下方展示。`
        : '当前示例还没有登记 interaction contract，需要补充键盘、焦点、语义和测试证据。'
    },
    {
      title: '6. 导出复现材料',
      detail: '复制运行报告、Repro bundle、场景链接或 Playground 链接，确保维护者可以复现当前示例。'
    }
  ]
})
const scenarioTestPlanReport = computed(() => [
  '# Yok UI scenario test plan',
  '',
  `- Component: ${activeComponentMeta.value?.componentName ?? 'Custom source'}`,
  `- Preset: ${activeComponentMeta.value?.title ?? presetLabels[selectedPreset.value] ?? selectedPreset.value}`,
  `- Docs: ${activeComponentMeta.value?.docs ?? 'n/a'}`,
  `- Scenario: ${activeScenario.value?.label ?? (hasScenarioSwitcher.value ? 'No scenario selected' : 'Props only')}`,
  `- Theme: ${selectedThemeMeta.value?.label ?? selectedTheme.value}`,
  `- Viewport: ${previewViewportLabel.value}`,
  '',
  '## Checklist',
  ...scenarioTestPlan.value.map((step) => `- [ ] ${step.title} ${step.detail}`)
].join('\n'))
const hasPendingChanges = computed(() => source.value !== checkedSource.value)
const canResetCode = computed(() => source.value !== activeStarterCode.value)
const previewNotice = computed(() => {
  if (validationError.value) {
    return lastSuccessfulSource.value
      ? '当前代码未通过校验，预览区保留上一次成功运行的结果。'
      : '当前代码未通过校验，修复后即可生成预览。'
  }

  if (hasPendingChanges.value) {
    return autoRun.value ? '正在等待自动运行。' : '代码已修改，点击运行后更新预览。'
  }

  if (draftStatus.value) {
    return draftStatus.value
  }

  if (hasStoredDraft.value) {
    return '草稿已保存在当前浏览器。'
  }

  return '预览已同步当前代码。'
})
const previewViewportOptions = [
  { value: 'auto', label: '自适应' },
  { value: 'tablet', label: '平板' },
  { value: 'mobile', label: '手机' }
] as const
const copyModeOptions = [
  { value: 'sfc', label: '完整 SFC' },
  { value: 'template', label: '仅 template' }
] as const
const sourcePanelOptions = [
  { value: 'sfc', label: '完整 SFC' },
  { value: 'template', label: 'Template' },
  { value: 'diff', label: 'Diff' },
  { value: 'install', label: 'Install' },
  { value: 'repro', label: 'Repro bundle' }
] as const
const sourceLanguageOptions = [
  { value: 'ts', label: 'TS' },
  { value: 'js', label: 'JS' }
] as const
const installPackageManagerOptions = [
  { value: 'npm', label: 'npm' },
  { value: 'yarn', label: 'yarn' },
  { value: 'pnpm', label: 'pnpm' },
  { value: 'bun', label: 'bun' }
] as const
const yokPackageOrder = ['@yok-ui/core', '@yok-ui/product', '@yok-ui/admin', '@yok-ui/brand', '@yok-ui/themes'] as const
const yokPackageImportPattern = /from\s+['"](@yok-ui\/[^'"]+)['"]/g
const previewViewportLabel = computed(
  () => previewViewportOptions.find((option) => option.value === previewViewport.value)?.label ?? '自适应'
)
const copiedLabel = computed(() => copyModeOptions.find((option) => option.value === copyMode.value)?.label ?? '代码')
const sourcePanelModeLabel = computed(
  () => sourcePanelOptions.find((option) => option.value === sourcePanelMode.value)?.label ?? 'Source'
)
const templateOnlySource = computed(() => {
  try {
    return `<template>\n${indentLines(formatTemplateMarkup(extractTemplate(source.value)), 2)}\n</template>`
  } catch {
    return extractTemplate(source.value)
  }
})
const copyableSource = computed(() => {
  if (copyMode.value === 'template') {
    return templateOnlySource.value
  }

  return source.value
})
const showSourcePanel = ref(false)
const showSourceLanguageSwitch = computed(() => sourcePanelMode.value === 'sfc')
const playgroundSfcSource = computed(() =>
  sourceLanguageMode.value === 'js' ? stripTypeScriptFromExample(source.value) : source.value
)
const sourcePanelSfcCode = computed(() => {
  try {
    return formatExampleSource(playgroundSfcSource.value)
  } catch {
    return playgroundSfcSource.value
  }
})
const componentSourceDirectoryOverrides: Record<string, string> = {
  YDateRangePicker: 'date-picker',
  YFloatButton: 'float-button',
  YFloatButtonGroup: 'float-button',
  YRadioGroup: 'radio',
  YBadge: 'tag',
  YIconButton: 'button',
  YCountdown: 'statistic'
}

function getComponentSourceDirectory(componentName: string, docsRoute: string) {
  if (componentSourceDirectoryOverrides[componentName]) {
    return componentSourceDirectoryOverrides[componentName]
  }

  const docsMatch = docsRoute.match(/^\/components\/([^/#?]+)/)

  if (docsMatch) {
    return docsMatch[1]
  }

  return normalizeApiToken(componentName.replace(/^Y/, ''))
}

const sourceFilePath = computed(() => {
  const meta = activeComponentMeta.value

  if (!meta) {
    return 'docs/.vitepress/components/LiveExampleRunner.vue'
  }

  const packageDir = meta.packageName.replace('@yok-ui/', '')
  const componentName = meta.componentName
  const componentDir = getComponentSourceDirectory(componentName, meta.docs)

  return `packages/${packageDir}/src/components/${componentDir}/${componentName}.vue`
})
const sourceFileUrl = computed(() => `/source/?file=${sourceFilePath.value}`)
const activeInstallPackages = computed(() => {
  const packageSet = new Set<string>()

  for (const match of source.value.matchAll(yokPackageImportPattern)) {
    packageSet.add(match[1])
  }

  if (packageSet.size === 0) {
    packageSet.add('@yok-ui/core')
  }

  packageSet.add('@yok-ui/themes')

  return [
    ...yokPackageOrder.filter((packageName) => packageSet.has(packageName)),
    ...Array.from(packageSet)
      .filter((packageName) => !yokPackageOrder.includes(packageName as (typeof yokPackageOrder)[number]))
      .sort()
  ]
})
const installCommandPrefix = computed(() => {
  if (installPackageManager.value === 'npm') {
    return 'npm install'
  }

  return `${installPackageManager.value} add`
})
const installCommand = computed(() => `${installCommandPrefix.value} ${activeInstallPackages.value.join(' ')}`)
const reproductionPackageJson = computed(() => {
  const dependencies = Object.fromEntries([
    ['vue', '^3.5.0'],
    ...activeInstallPackages.value.map((packageName) => [packageName, 'latest'])
  ])

  return JSON.stringify({
    name: `yok-ui-${selectedPreset.value}-repro`,
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vue-tsc --noEmit && vite build'
    },
    dependencies,
    devDependencies: {
      '@vitejs/plugin-vue': 'latest',
      typescript: 'latest',
      vite: 'latest',
      'vue-tsc': 'latest'
    }
  }, null, 2)
})
const reproductionStyleImports = computed(() => [
  `import '@yok-ui/themes/${selectedTheme.value}.css'`,
  ...activeInstallPackages.value
    .filter((packageName) => packageName !== '@yok-ui/themes')
    .map((packageName) => `import '${packageName}/style.css'`)
])
const reproductionMainTs = computed(() => [
  "import { createApp } from 'vue'",
  "import App from './App.vue'",
  ...reproductionStyleImports.value,
  '',
  "createApp(App).mount('#app')"
].join('\n'))

function createSourceDiffRows(before: string, after: string): SourceDiffRow[] {
  const beforeLines = before.split('\n')
  const afterLines = after.split('\n')
  const matrix = Array.from({ length: beforeLines.length + 1 }, () =>
    Array.from({ length: afterLines.length + 1 }, () => 0)
  )

  for (let beforeIndex = beforeLines.length - 1; beforeIndex >= 0; beforeIndex -= 1) {
    for (let afterIndex = afterLines.length - 1; afterIndex >= 0; afterIndex -= 1) {
      matrix[beforeIndex][afterIndex] = beforeLines[beforeIndex] === afterLines[afterIndex]
        ? matrix[beforeIndex + 1][afterIndex + 1] + 1
        : Math.max(matrix[beforeIndex + 1][afterIndex], matrix[beforeIndex][afterIndex + 1])
    }
  }

  const rows: SourceDiffRow[] = []
  let beforeIndex = 0
  let afterIndex = 0

  while (beforeIndex < beforeLines.length || afterIndex < afterLines.length) {
    if (beforeIndex < beforeLines.length && afterIndex < afterLines.length && beforeLines[beforeIndex] === afterLines[afterIndex]) {
      rows.push({
        key: `same-${beforeIndex}-${afterIndex}`,
        kind: 'same',
        lineNumber: String(afterIndex + 1),
        text: afterLines[afterIndex]
      })
      beforeIndex += 1
      afterIndex += 1
      continue
    }

    if (afterIndex >= afterLines.length || matrix[beforeIndex + 1]?.[afterIndex] >= matrix[beforeIndex]?.[afterIndex + 1]) {
      rows.push({
        key: `removed-${beforeIndex}-${afterIndex}`,
        kind: 'removed',
        lineNumber: `-${beforeIndex + 1}`,
        text: beforeLines[beforeIndex] ?? ''
      })
      beforeIndex += 1
      continue
    }

    rows.push({
      key: `added-${beforeIndex}-${afterIndex}`,
      kind: 'added',
      lineNumber: `+${afterIndex + 1}`,
      text: afterLines[afterIndex] ?? ''
    })
    afterIndex += 1
  }

  return rows
}

const sourceDiffRows = computed(() => createSourceDiffRows(activeStarterCode.value, source.value))
const sourceDiffSummary = computed(() => {
  const added = sourceDiffRows.value.filter((row) => row.kind === 'added').length
  const removed = sourceDiffRows.value.filter((row) => row.kind === 'removed').length
  const unchanged = sourceDiffRows.value.filter((row) => row.kind === 'same').length

  return { added, removed, unchanged, changed: added + removed }
})
const playgroundImportShareUrl = computed(() => {
  if (typeof window === 'undefined') {
    return playgroundHandoffUrl.value
  }

  return `${window.location.origin}${playgroundHandoffUrl.value}`
})
const playgroundDocsHash = computed(() => {
  if (!activeScenario.value) {
    return '#live-example'
  }

  const params = new URLSearchParams()
  params.set('scenario', activeScenario.value.key)

  return `#live-example?${params.toString()}`
})
const playgroundHandoffItems = computed(() => [
  {
    label: 'Component',
    value: activeComponentMeta.value?.componentName ?? getPlaygroundComponentForPreset(selectedPreset.value) ?? 'Custom source'
  },
  {
    label: 'Theme',
    value: selectedThemeMeta.value?.label ?? selectedTheme.value
  },
  {
    label: 'Scenario',
    value: activeScenario.value?.label ?? (hasScenarioSwitcher.value ? 'Not selected' : 'Props only')
  },
  {
    label: 'Diff',
    value: sourceDiffSummary.value.changed ? `+${sourceDiffSummary.value.added} / -${sourceDiffSummary.value.removed}` : 'Clean'
  }
])
const sourceDiffCode = computed(() => {
  if (sourceDiffSummary.value.changed === 0) {
    return [
      '# Yok UI source diff',
      '',
      'No source changes from the selected starter.'
    ].join('\n')
  }

  return [
    '# Yok UI source diff',
    '',
    `- Preset: ${activeComponentMeta.value?.title ?? presetLabels[selectedPreset.value] ?? selectedPreset.value}`,
    `- Component: ${activeComponentMeta.value?.componentName ?? 'Custom source'}`,
    `- Added lines: ${sourceDiffSummary.value.added}`,
    `- Removed lines: ${sourceDiffSummary.value.removed}`,
    '',
    '```diff',
    ...sourceDiffRows.value.map((row) => {
      if (row.kind === 'added') {
        return `+ ${row.text}`
      }

      if (row.kind === 'removed') {
        return `- ${row.text}`
      }

      return `  ${row.text}`
    }),
    '```'
  ].join('\n')
})
function createLiveExampleSyncSnapshot() {
  return {
    preset: selectedPreset.value,
    component: activeComponentMeta.value?.componentName ?? null,
    packageName: activeComponentMeta.value?.packageName ?? null,
    docs: activeComponentMeta.value?.docs ?? null,
    scenario: activeScenario.value
      ? {
          key: activeScenario.value.key,
          label: activeScenario.value.label,
          kind: activeScenario.value.kind,
          shareUrl: activeScenarioShareUrl.value
        }
      : null,
    theme: {
      name: selectedTheme.value,
      label: selectedThemeMeta.value?.label ?? selectedTheme.value
    },
    viewport: {
      value: previewViewport.value,
      label: previewViewportLabel.value
    },
    source: {
      status: liveStats.value.status,
      lines: liveStats.value.lines,
      characters: liveStats.value.characters,
      panelMode: sourcePanelModeLabel.value,
      excerpt: source.value.split('\n').slice(0, 16).join('\n')
    },
    controls: activeControlSnapshotItems.value.map((control) => ({
      key: control.key,
      label: control.label,
      type: control.type,
      value: control.value,
      defaultValue: control.defaultValue,
      changed: control.changed
    })),
    interactionContract: activeInteractionContracts.value.map((contract) => ({
      componentName: contract.componentName,
      pattern: contract.pattern,
      maturity: contract.maturity,
      keyboard: contract.keyboard,
      focus: contract.focus,
      semantics: contract.semantics,
      docs: contract.evidence.docs,
      tests: contract.evidence.tests
    })),
    changedControls: changedControlCount.value,
    eventsCaptured: eventLogs.value.length,
    links: {
      state: activeStateShareUrl.value || null,
      playground: playgroundImportUrl.value
    }
  }
}
const liveExampleSyncSnapshot = computed(() => createLiveExampleSyncSnapshot())
const liveExampleSyncSnapshotText = computed(() =>
  JSON.stringify(liveExampleSyncSnapshot.value, null, 2)
)
const reproductionBundle = computed(() => {
  const scenarioLabel = activeScenario.value?.label ?? (hasScenarioSwitcher.value ? 'No scenario selected' : 'Props only')

  return [
    '# Yok UI live example reproduction bundle',
    '',
    `- Preset: ${activeComponentMeta.value?.title ?? presetLabels[selectedPreset.value] ?? selectedPreset.value}`,
    `- Component: ${activeComponentMeta.value?.componentName ?? 'Custom source'}`,
    `- Package: ${activeComponentMeta.value?.packageName ?? 'Custom source'}`,
    `- Docs: ${activeComponentMeta.value?.docs ?? 'n/a'}`,
    `- Scenario: ${scenarioLabel}`,
    `- Theme: ${selectedThemeMeta.value?.label ?? selectedTheme.value}`,
    `- Viewport: ${previewViewportLabel.value}`,
    `- Playground: ${playgroundImportUrl.value}`,
    '',
    '## Setup',
    '',
    'Create a Vue 3 + Vite app, replace the files below, then run the package manager command from the install panel.',
    '',
    '## package.json',
    '',
    '```json',
    reproductionPackageJson.value,
    '```',
    '',
    '## src/main.ts',
    '',
    '```ts',
    reproductionMainTs.value,
    '```',
    '',
    '## src/App.vue',
    '',
    '```vue',
    source.value,
    '```',
    '',
    '## Sync snapshot',
    '',
    '```json',
    liveExampleSyncSnapshotText.value,
    '```',
    '',
    interactionContractReport.value,
    '',
    '## Controls',
    '',
    '```json',
    JSON.stringify(getSerializableControlState(), null, 2),
    '```'
  ].join('\n')
})
const interactionReplayEvents = computed(() =>
  eventLogs.value.map((item) => ({
    id: item.id,
    component: item.component,
    event: item.event,
    payload: normalizeReproPayloads(item.rawPayloads),
    preview: item.payload
  }))
)
const interactionReplaySteps = computed<InteractionReplayStep[]>(() => [
  {
    key: 'hydrate',
    label: '1. Restore context',
    detail: activeStateShareUrl.value || activeScenarioShareUrl.value
      ? 'Open the shared state or scenario link to restore theme, viewport and controls.'
      : 'Open the Playground handoff link and paste the bundled source.',
    passed: Boolean(activeStateShareUrl.value || activeScenarioShareUrl.value || playgroundImportUrl.value)
  },
  {
    key: 'scenario',
    label: '2. Lock scenario',
    detail: activeScenario.value
      ? `${activeScenario.value.label} · ${scenarioKindLabels[activeScenario.value.kind]} · ${activeScenario.value.key}`
      : hasScenarioSwitcher.value
        ? 'Choose a workflow scenario before recording a stable replay.'
        : 'This example is source-first and does not require a scenario switch.',
    passed: !hasScenarioSwitcher.value || Boolean(activeScenario.value)
  },
  {
    key: 'controls',
    label: '3. Apply props',
    detail: hasPropControls.value
      ? `${changedControlCount.value}/${activeControls.value.length} controls differ from defaults; serialized controls are included.`
      : 'No visual props panel is registered; source is the replay authority.',
    passed: true
  },
  {
    key: 'event',
    label: '4. Replay event',
    detail: eventLogs.value.length
      ? `${eventLogs.value.length} captured events: ${eventLogs.value.map((item) => `${item.component}@${item.event}`).join(' / ')}.`
      : 'Trigger the target preview interaction once to capture an event replay.',
    passed: eventLogs.value.length > 0
  },
  {
    key: 'assert',
    label: '5. Verify result',
    detail: validationError.value
      ? validationError.value
      : hasInteractionContract.value
        ? `${interactionContractSummary.value.value} · ${interactionContractSummary.value.detail}`
        : 'Preview renders, but the component still needs an interaction contract.',
    passed: !validationError.value && hasInteractionContract.value
  }
])
const interactionReplayEvidenceItems = computed<InteractionReplayEvidenceItem[]>(() => [
  {
    key: 'context',
    label: 'Context',
    value: activeScenario.value?.label ?? (hasScenarioSwitcher.value ? 'Not selected' : 'Source first'),
    detail: `${selectedThemeMeta.value?.label ?? selectedTheme.value} · ${previewViewportLabel.value}`,
    passed: !hasScenarioSwitcher.value || Boolean(activeScenario.value)
  },
  {
    key: 'events',
    label: 'Events',
    value: eventLogs.value.length ? `${eventLogs.value.length} captured` : 'Waiting',
    detail: eventLogs.value.length
      ? eventLogs.value.slice(0, 2).map((item) => `${item.component}@${item.event}`).join(' / ')
      : 'Interact with the preview to record replay evidence.',
    passed: eventLogs.value.length > 0
  },
  {
    key: 'controls',
    label: 'Controls',
    value: hasPropControls.value ? `${changedControlCount.value}/${activeControls.value.length} changed` : 'Source first',
    detail: hasPropControls.value ? 'Serialized in the replay manifest.' : 'The SFC source is the replay state.',
    passed: true
  },
  {
    key: 'assertions',
    label: 'Assertions',
    value: hasInteractionContract.value ? 'Contract linked' : 'Needs contract',
    detail: validationError.value || interactionContractSummary.value.detail,
    passed: !validationError.value && hasInteractionContract.value
  }
])
const interactionReplayManifest = computed(() => ({
  preset: selectedPreset.value,
  component: activeComponentMeta.value?.componentName ?? 'Custom source',
  packageName: activeComponentMeta.value?.packageName ?? 'Custom source',
  docs: activeComponentMeta.value?.docs ?? null,
  scenario: activeScenario.value
    ? {
        key: activeScenario.value.key,
        label: activeScenario.value.label,
        kind: activeScenario.value.kind,
        shareUrl: activeScenarioShareUrl.value
      }
    : null,
  theme: {
    name: selectedTheme.value,
    label: selectedThemeMeta.value?.label ?? selectedTheme.value
  },
  viewport: {
    value: previewViewport.value,
    label: previewViewportLabel.value
  },
  controls: getSerializableControlState(),
  changedControls: changedControlCount.value,
  previewState: previewStateSnapshot.value ? JSON.parse(previewStateSnapshot.value) as unknown : null,
  events: interactionReplayEvents.value,
  steps: interactionReplaySteps.value.map((step) => ({
    key: step.key,
    label: step.label,
    detail: step.detail,
    passed: step.passed
  })),
  assertions: {
    liveStatus: liveStats.value.status,
    validation: validationError.value || 'Pass',
    interactionContracts: activeInteractionContracts.value.map((contract) => ({
      componentName: contract.componentName,
      pattern: contract.pattern,
      maturity: contract.maturity,
      keyboard: contract.keyboard,
      focus: contract.focus,
      semantics: contract.semantics
    }))
  },
  links: {
    state: activeStateShareUrl.value || null,
    scenario: activeScenarioShareUrl.value || null,
    playground: playgroundImportUrl.value
  }
}))
const playgroundHandoffPayload = computed(() => ({
  version: 1,
  component: getPlaygroundComponentForPreset(selectedPreset.value),
  theme: selectedTheme.value,
  source: playgroundSfcSource.value,
  origin: 'live-example',
  language: sourceLanguageMode.value,
  sourcePanel: {
    mode: sourcePanelMode.value,
    label: sourcePanelModeLabel.value,
    language: sourceLanguageMode.value,
    installPackageManager: installPackageManager.value
  },
  docsHash: playgroundDocsHash.value,
  scenario: activeScenario.value?.key ?? '',
  viewport: previewViewport.value !== 'auto' ? previewViewport.value : '',
  controls: hasPropControls.value ? getSerializableControlState() : {},
  replay: eventLogs.value.length ? interactionReplayManifest.value : null,
  createdAt: new Date().toISOString()
}))
const playgroundHandoffPayloadText = computed(() =>
  JSON.stringify(playgroundHandoffPayload.value)
)
function getStableHandoffHash(value: string) {
  let hash = 5381

  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(index)
  }

  return (hash >>> 0).toString(36)
}
const playgroundHandoffKey = computed(() =>
  `${selectedPreset.value}-${getStableHandoffHash(playgroundHandoffPayloadText.value)}`
)
const compactPlaygroundHandoffUrl = computed(() => {
  const params = new URLSearchParams()
  const playgroundComponent = getPlaygroundComponentForPreset(selectedPreset.value)

  if (playgroundComponent) {
    params.set('component', playgroundComponent)
  }

  params.set('theme', selectedTheme.value)
  params.set('handoff', playgroundHandoffKey.value)
  params.set('from', 'live-example')
  params.set('language', sourceLanguageMode.value)
  params.set('docsHash', playgroundDocsHash.value)

  return `/playground/?${params.toString()}`
})
const playgroundReplayImportUrl = computed(() => {
  if (!eventLogs.value.length) {
    return playgroundImportUrl.value
  }

  const [pathname, query = ''] = playgroundImportUrl.value.split('?')
  const params = new URLSearchParams(query)

  params.set('replay', JSON.stringify(interactionReplayManifest.value))

  return `${pathname}?${params.toString()}`
})
const canUsePlaygroundHandoff = computed(() => Boolean(getDraftStorage()))
const playgroundHandoffUrl = computed(() =>
  canUsePlaygroundHandoff.value ? compactPlaygroundHandoffUrl.value : playgroundImportUrl.value
)
const sourcePanelCode = computed(() => {
  if (sourcePanelMode.value === 'template') {
    return templateOnlySource.value
  }

  if (sourcePanelMode.value === 'diff') {
    return sourceDiffCode.value
  }

  if (sourcePanelMode.value === 'install') {
    return installCommand.value
  }

  if (sourcePanelMode.value === 'repro') {
    return reproductionBundle.value
  }

  return sourcePanelSfcCode.value
})
const runReport = computed(() => {
  const scenarioLabel = activeScenario.value?.label ?? (hasScenarioSwitcher.value ? 'No scenario selected' : 'Props only')
  const validationLabel = validationError.value ? `Fail - ${validationError.value}` : 'Pass'
  const eventLines = eventLogs.value.length
    ? eventLogs.value.map((item) => `- ${item.component} @${item.event}: ${item.payload}`)
    : ['- No events captured yet.']
  const sourceExcerpt = source.value.split('\n').slice(0, 24).join('\n')

  return [
    '# Yok UI live example report',
    '',
    `- Preset: ${activeComponentMeta.value?.title ?? presetLabels[selectedPreset.value] ?? selectedPreset.value}`,
    `- Component: ${activeComponentMeta.value?.componentName ?? 'Custom source'}`,
    `- Package: ${activeComponentMeta.value?.packageName ?? 'Custom source'}`,
    `- Docs: ${activeComponentMeta.value?.docs ?? 'n/a'}`,
    `- Status: ${liveStats.value.status}`,
    `- Scenario: ${scenarioLabel}`,
    `- Theme: ${selectedThemeMeta.value?.label ?? selectedTheme.value}`,
    `- Viewport: ${previewViewportLabel.value}`,
    `- Events captured: ${eventLogs.value.length}`,
    `- Validation: ${validationLabel}`,
    `- Source: ${liveStats.value.lines} lines, ${liveStats.value.characters} chars`,
    '',
    '## Run evidence',
    ...runEvidenceItems.value.map((item) =>
      `- [${item.passed ? 'x' : ' '}] ${item.label}: ${item.value} - ${item.detail}`
    ),
    '',
    '## Recent events',
    ...eventLines,
    '',
    '## Scenario test plan',
    ...scenarioTestPlan.value.map((step) => `- ${step.title}: ${step.detail}`),
    '',
    interactionContractReport.value,
    '',
    '## Source excerpt',
    '```vue',
    sourceExcerpt,
    '```'
  ].join('\n')
})
const interactionReproReport = computed(() => {
  const scenarioLabel = activeScenario.value?.label ?? (hasScenarioSwitcher.value ? 'No scenario selected' : 'Props only')

  return [
    '# Yok UI interaction repro',
    '',
    `- Component: ${activeComponentMeta.value?.componentName ?? 'Custom source'}`,
    `- Preset: ${activeComponentMeta.value?.title ?? presetLabels[selectedPreset.value] ?? selectedPreset.value}`,
    `- Package: ${activeComponentMeta.value?.packageName ?? 'Custom source'}`,
    `- Docs: ${activeComponentMeta.value?.docs ?? 'n/a'}`,
    `- Scenario: ${scenarioLabel}`,
    `- Theme: ${selectedThemeMeta.value?.label ?? selectedTheme.value}`,
    `- Viewport: ${previewViewportLabel.value}`,
    `- Playground: ${playgroundImportUrl.value}`,
    '',
    '## Replay steps',
    ...interactionReplaySteps.value.map((step) =>
      `- [${step.passed ? 'x' : ' '}] ${step.label}: ${step.detail}`
    ),
    '',
    '## Replay manifest',
    '```json',
    JSON.stringify(interactionReplayManifest.value, null, 2),
    '```',
    '',
    '## Controls',
    '```json',
    JSON.stringify(getSerializableControlState()),
    '```',
    '',
    '## Preview state',
    '```json',
    previewStateSnapshot.value || '{}',
    '```',
    '',
    '## Event replay',
    '```json',
    JSON.stringify(interactionReplayEvents.value),
    '```',
    '',
    '## Source',
    '```vue',
    source.value,
    '```'
  ].join('\n')
})

function normalizeReproPayload(payload: unknown): unknown {
  if (payload instanceof MouseEvent) {
    return 'MouseEvent'
  }

  if (payload instanceof Event) {
    return { type: payload.type }
  }

  return payload
}

function normalizeReproPayloads(payloads: unknown[]): unknown {
  const normalized = payloads.map((payload) => normalizeReproPayload(payload))

  return normalized.length === 1 ? normalized[0] : normalized
}

function indentLines(value: string, spaces: number) {
  const padding = ' '.repeat(spaces)

  return value
    .split('\n')
    .map((line) => (line.trim() ? `${padding}${line}` : line))
    .join('\n')
}

function formatTemplateMarkup(template: string) {
  const normalizedTemplate = normalizeTemplate(template).replace(/>\s+</g, '><').trim()
  const tokens = normalizedTemplate.match(/<\/?[^>]+>|[^<]+/g) ?? []
  const lines: string[] = []
  let depth = 0

  for (const token of tokens) {
    const text = token.trim()

    if (!text) {
      continue
    }

    const isClosingTag = /^<\//.test(text)
    const isSelfClosingTag = /\/>$/.test(text)
    const isOpeningTag = /^<[^/!][^>]*>$/.test(text)

    if (isClosingTag) {
      depth = Math.max(depth - 1, 0)
    }

    lines.push(`${'  '.repeat(depth)}${text}`)

    if (isOpeningTag && !isSelfClosingTag) {
      depth += 1
    }
  }

  return lines.join('\n')
}

function stripTypeScriptImports(script: string) {
  return script
    .replace(/^\s*import\s+type\s+[^;\n]+;?\s*$/gm, '')
    .replace(/import\s*\{([^}]+)\}\s*from\s*(['"][^'"]+['"])/g, (_match, specifiers: string, fromClause: string) => {
      const runtimeSpecifiers = specifiers
        .split(',')
        .map((specifier) => specifier.trim())
        .filter((specifier) => specifier && !specifier.startsWith('type '))

      if (runtimeSpecifiers.length === 0) {
        return ''
      }

      return `import { ${runtimeSpecifiers.join(', ')} } from ${fromClause}`
    })
}

function stripTypeScriptFromExample(code: string) {
  return stripTypeScriptImports(code)
    .replace(/<script setup lang="ts">/gi, '<script setup>')
    .replace(/<script lang="ts" setup>/gi, '<script setup>')
    .replace(/<script lang="ts">/gi, '<script>')
    .replace(/^\s*interface\s+\w+\s*\{[\s\S]*?^\s*\}\s*$/gm, '')
    .replace(/^\s*type\s+\w+\s*=\s*[^;\n]+;?\s*$/gm, '')
    .replace(/\b(ref|computed|shallowRef)<[^>\n]+>\(/g, '$1(')
    .replace(/\b(const|let|var)\s+([A-Za-z_$][\w$]*)\s*:\s*[^=\n]+=/g, '$1 $2 =')
    .replace(/\s+as\s+const\b/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function formatExampleSource(code: string) {
  const template = extractTemplate(code)
  const scriptMatch = code.match(/<script[\s\S]*?<\/script>/i)
  const formattedTemplate = `<template>\n${indentLines(formatTemplateMarkup(template), 2)}\n</template>`

  if (!scriptMatch) {
    return formattedTemplate
  }

  return `${scriptMatch[0].trim()}\n\n${formattedTemplate}`
}

function getDraftStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function getStorageKeys(storage: Storage) {
  return Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter(
    (key): key is string => Boolean(key)
  )
}

function pruneStorageByPrefix(storage: Storage, prefix: string, keepKey?: string) {
  getStorageKeys(storage)
    .filter((key) => key.startsWith(`${prefix}:`) && key !== keepKey)
    .forEach((key) => {
      try {
        storage.removeItem(key)
      } catch {
        // Storage cleanup is best-effort. Rendering must not depend on it.
      }
    })
}

function setStorageItemSafely(storage: Storage, key: string, value: string, cleanupPrefix?: string) {
  try {
    storage.setItem(key, value)
    return true
  } catch {
    if (cleanupPrefix) {
      pruneStorageByPrefix(storage, cleanupPrefix, key)

      try {
        storage.setItem(key, value)
        return true
      } catch {
        return false
      }
    }

    return false
  }
}

function readDraft(preset = selectedPreset.value) {
  return getDraftStorage()?.getItem(`${draftStoragePrefix}:${preset}`) ?? ''
}

function refreshDraftState() {
  hasStoredDraft.value = Boolean(readDraft())
}

function persistPlaygroundHandoff() {
  const storage = getDraftStorage()

  if (!storage) {
    return
  }

  const persisted = setStorageItemSafely(
    storage,
    `${playgroundHandoffStoragePrefix}:${playgroundHandoffKey.value}`,
    playgroundHandoffPayloadText.value,
    playgroundHandoffStoragePrefix
  )

  if (!persisted) {
    draftStatus.value = 'Playground handoff 本地存储空间不足，示例仍可编辑、查看和复制源码。'
  }
}

function getDefaultControlState(preset = selectedPreset.value) {
  const recipe = liveExampleRecipes[preset]

  return Object.fromEntries(
    (recipe?.controls ?? []).map((control) => [control.key, control.defaultValue])
  )
}

function getSerializableControlState() {
  return Object.fromEntries(
    activeControls.value.map((control) => [control.key, controlState.value[control.key] ?? control.defaultValue])
  )
}

function getHashParams(hash = window.location.hash) {
  const normalizedHash = hash.startsWith('#') ? hash.slice(1) : hash
  const [hashId, hashQuery = ''] = normalizedHash.split('?')

  if (hashId !== liveExampleHashId || !hashQuery) {
    return null
  }

  return new URLSearchParams(hashQuery)
}

function getLiveExampleQueryParam(name: string, search = window.location.search) {
  const params = new URLSearchParams(search)

  return params.get(`live-${name}`) ?? ''
}

function getStarterSource(preset = selectedPreset.value) {
  const recipe = liveExampleRecipes[preset]

  if (recipe) {
    return recipe.build(getDefaultControlState(preset))
  }

  return presetExamples[preset] ?? presetExamples.default
}

function hydrateControlState(preset = selectedPreset.value) {
  controlState.value = getDefaultControlState(preset)
}

function buildControlledSource() {
  return activeRecipe.value?.build(controlState.value) ?? activeStarterCode.value
}

function applyControlState(options: { run?: boolean } = {}) {
  if (!activeRecipe.value) {
    return
  }

  source.value = buildControlledSource()
  draftStatus.value = '已根据属性面板生成安全示例。'

  if (options.run ?? autoRun.value) {
    buildPreview()
  }
}

function updateControlValue(control: LiveControlField, value: string | number | boolean) {
  controlState.value = {
    ...controlState.value,
    [control.key]: value
  }
  applyControlState()
}

function syncScenarioHash(scenario: LiveExampleScenario) {
  if (typeof window === 'undefined') {
    return
  }

  const nextHash = getLiveExampleScenarioHash(scenario.key)

  if (window.location.hash === nextHash) {
    return
  }

  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`)
}

function applyScenario(scenario: LiveExampleScenario, options: { syncHash?: boolean } = {}) {
  const control = getScenarioControl(scenario)

  if (!control) {
    draftStatus.value = '当前场景还没有绑定到属性面板。'
    return
  }

  updateControlValue(control, getScenarioControlValue(scenario))
  if (options.syncHash) {
    syncScenarioHash(scenario)
  }
  draftStatus.value = `已切换到「${scenario.label}」场景。`
}

function applyScenarioByKey(scenarioKey: string) {
  const scenario = activeScenarios.value.find((item) => item.key === scenarioKey)

  if (!scenario) {
    return false
  }

  applyScenario(scenario)
  return true
}

function getHashScenarioKey(hash = window.location.hash) {
  return getHashParams(hash)?.get('scenario') ?? getLiveExampleQueryParam('scenario')
}

function getHashThemeName(hash = window.location.hash) {
  const theme = getHashParams(hash)?.get('theme')

  return theme && Object.prototype.hasOwnProperty.call(liveExampleThemeTokens, theme)
    ? theme as YokThemeName
    : ''
}

function getHashPreviewViewport(hash = window.location.hash) {
  const viewport = getHashParams(hash)?.get('viewport')

  return viewport && previewViewportOptions.some((option) => option.value === viewport)
    ? viewport as PreviewViewport
    : ''
}

function applyThemeFromHash() {
  const theme = getHashThemeName()

  if (!theme) {
    return false
  }

  selectedTheme.value = theme
  return true
}

function applyViewportFromHash() {
  const viewport = getHashPreviewViewport()

  if (!viewport) {
    return false
  }

  previewViewport.value = viewport
  return true
}

function applyScenarioFromHash() {
  const scenarioKey = getHashScenarioKey()

  if (!scenarioKey) {
    return false
  }

  return applyScenarioByKey(scenarioKey)
}

function coerceSharedControlValue(control: LiveControlField, value: unknown) {
  if (control.type === 'boolean') {
    return typeof value === 'boolean' ? value : value === 'true'
  }

  if (control.type === 'number' || control.type === 'range') {
    const numericValue = Number(value)

    return Number.isFinite(numericValue) ? numericValue : control.defaultValue
  }

  if (control.type === 'select') {
    const stringValue = String(value)
    const optionValues = control.options?.map((option) => option.value) ?? []

    return optionValues.includes(stringValue) ? stringValue : control.defaultValue
  }

  return typeof value === 'string' ? value : String(value ?? control.defaultValue)
}

function getHashControlState(hash = window.location.hash) {
  const stateValue = getHashParams(hash)?.get('state')

  if (!stateValue) {
    return null
  }

  try {
    const parsed = JSON.parse(stateValue) as unknown

    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : null
  } catch {
    return null
  }
}

function applyControlStateFromHash() {
  const sharedState = getHashControlState()

  if (!sharedState || !activeControls.value.length) {
    return false
  }

  const nextState = { ...controlState.value }
  let changed = false

  for (const control of activeControls.value) {
    if (!Object.prototype.hasOwnProperty.call(sharedState, control.key)) {
      continue
    }

    nextState[control.key] = coerceSharedControlValue(control, sharedState[control.key])
    changed = true
  }

  if (!changed) {
    return false
  }

  controlState.value = nextState
  applyControlState({ run: true })
  draftStatus.value = '已从分享链接恢复属性面板。'

  return true
}

function applyLiveExampleHash() {
  applyThemeFromHash()
  applyViewportFromHash()
  applyScenarioFromHash()
  applyControlStateFromHash()
}

function shouldRestoreLiveExampleScroll() {
  return typeof window !== 'undefined' &&
    (window.location.hash === `#${liveExampleHashId}` || window.location.hash.startsWith(`#${liveExampleHashId}?`))
}

function restoreLiveExampleScroll() {
  if (!shouldRestoreLiveExampleScroll()) {
    return
  }

  nextTick(() => {
    window.setTimeout(() => {
      document.getElementById(liveExampleHashId)?.scrollIntoView?.({ block: 'start' })
    }, 0)
  })
}

function isLiveExampleScenarioEvent(event: Event): event is CustomEvent<LiveExampleScenarioEventDetail> {
  return event instanceof CustomEvent && typeof event.detail?.scenarioKey === 'string'
}

function handleExternalScenarioEvent(event: Event) {
  if (!isLiveExampleScenarioEvent(event)) {
    return
  }

  if (event.detail.preset && event.detail.preset !== selectedPreset.value) {
    return
  }

  applyScenarioByKey(event.detail.scenarioKey)
}

function handleScenarioHashChange() {
  applyLiveExampleHash()
  restoreLiveExampleScroll()
}

function updateControlFromEvent(control: LiveControlField, event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  const value = ['number', 'range'].includes(control.type) ? Number(target.value) : target.value

  updateControlValue(control, value)
}

function updateBooleanControl(control: LiveControlField, event: Event) {
  updateControlValue(control, (event.target as HTMLInputElement).checked)
}

function resetControls() {
  hydrateControlState()
  applyControlState({ run: true })
}

function clearEventLog() {
  eventLogs.value = []
}

function persistDraft() {
  if (!draftHydrated.value) {
    return
  }

  if (skipNextDraftPersist.value) {
    skipNextDraftPersist.value = false
    return
  }

  const storage = getDraftStorage()

  if (!storage) {
    return
  }

  if (source.value === activeStarterCode.value) {
    try {
      storage.removeItem(activeDraftKey.value)
    } catch {
      // Ignore storage cleanup failures so the editor remains usable.
    }
    hasStoredDraft.value = false
    return
  }

  const persisted = setStorageItemSafely(storage, activeDraftKey.value, source.value, draftStoragePrefix)
  hasStoredDraft.value = persisted
  if (!persisted) {
    draftStatus.value = '草稿本地存储空间不足，示例仍可运行和复制源码。'
  } else if (!draftStatus.value.startsWith('已切换到')) {
    draftStatus.value = '草稿已自动保存到当前浏览器。'
  }
}

function setPresetSource(preset: LiveExamplePreset, options: { preferDraft?: boolean; run?: boolean } = {}) {
  const { preferDraft = true, run = true } = options

  selectedPreset.value = preset
  hydrateControlState(preset)
  const draft = preferDraft ? readDraft(preset) : ''
  const nextSource = draft || getStarterSource(preset)

  if (source.value !== nextSource) {
    skipNextDraftPersist.value = true
    source.value = nextSource
  } else {
    skipNextDraftPersist.value = false
  }

  hasStoredDraft.value = Boolean(draft)
  draftStatus.value = draft ? '已恢复当前模板的本地草稿。' : ''

  if (run) {
    buildPreview()
  }
}

if (typeof window !== 'undefined') {
  watch(source, () => {
    if (autoRun.value) {
      buildPreview()
    }

    persistDraft()
  })
  watch(
    () => props.preset,
    (preset) => {
      setPresetSource(preset)
    }
  )
  watch(
    playgroundHandoffPayloadText,
    () => {
      persistPlaygroundHandoff()
    },
    { immediate: true }
  )
}

onMounted(() => {
  draftHydrated.value = true
  setPresetSource(props.preset)
  refreshDraftState()
  applyLiveExampleHash()
  restoreLiveExampleScroll()
  window.addEventListener(externalScenarioEventName, handleExternalScenarioEvent)
  window.addEventListener('hashchange', handleScenarioHashChange)
})

onBeforeUnmount(() => {
  window.removeEventListener(externalScenarioEventName, handleExternalScenarioEvent)
  window.removeEventListener('hashchange', handleScenarioHashChange)
})

function resetCode() {
  skipNextDraftPersist.value = true
  hydrateControlState()
  source.value = activeStarterCode.value
  getDraftStorage()?.removeItem(activeDraftKey.value)
  hasStoredDraft.value = false
  draftStatus.value = '已重置为当前模板。'
  if (!autoRun.value) {
    buildPreview()
  }
}

function applyStarter() {
  setPresetSource(selectedPreset.value)
}

function clearDraft() {
  getDraftStorage()?.removeItem(activeDraftKey.value)
  hasStoredDraft.value = false
  draftStatus.value = '已清除当前模板的本地草稿。'
}

function formatCode() {
  const formattedSource = formatExampleSource(source.value)

  if (formattedSource === source.value) {
    draftStatus.value = '当前代码已经是格式化状态。'
    return
  }

  source.value = formattedSource
  draftStatus.value = '代码已格式化。'

  if (!autoRun.value) {
    buildPreview()
  }
}

function toggleAutoRun() {
  autoRun.value = !autoRun.value

  if (autoRun.value && hasPendingChanges.value) {
    buildPreview()
  }
}

function applyPreviewTheme() {
  draftStatus.value = `主题预设已切换为 ${selectedThemeMeta.value?.label ?? selectedTheme.value}。`
}

function syncEditorScroll(event: Event) {
  editorScrollTop.value = (event.target as HTMLTextAreaElement).scrollTop
}

function getSourceLineRange(lineNumber: number) {
  const lines = source.value.split('\n')
  const lineIndex = Math.max(Math.min(lineNumber - 1, lines.length - 1), 0)
  const start = lines.slice(0, lineIndex).reduce((offset, line) => offset + line.length + 1, 0)
  const end = start + lines[lineIndex].length

  return { start, end }
}

async function focusValidationLine() {
  if (!validationIssue.value) {
    return
  }

  await nextTick()

  const textarea = editorPanel.value?.textarea ?? null

  if (!textarea) {
    return
  }

  const { start, end } = getSourceLineRange(validationIssue.value.sourceLine)

  textarea.focus()
  textarea.setSelectionRange(start, end)
  textarea.scrollTop = Math.max((validationIssue.value.sourceLine - 5) * 22, 0)
  editorScrollTop.value = textarea.scrollTop
}

function writeClipboardTextWithSelection(value: string) {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', 'readonly')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus({ preventScroll: true })
  textarea.select()

  try {
    document.execCommand('copy')
    return true
  } finally {
    document.body.removeChild(textarea)
  }
}

async function writeClipboardText(value: string, timeout = 320) {
  if (navigator.clipboard) {
    let timeoutId = 0

    try {
      const result = await Promise.race([
        navigator.clipboard.writeText(value),
        new Promise<false>((resolve) => {
          timeoutId = window.setTimeout(() => resolve(false), timeout)
        })
      ])

      if (result !== false) {
        return true
      }
    } catch {
      // Embedded browser shells can expose Clipboard API while blocking writes.
      // The legacy selection flow still gives docs examples dependable feedback.
    } finally {
      window.clearTimeout(timeoutId)
    }
  }

  return writeClipboardTextWithSelection(value)
}

async function copyCode() {
  void writeClipboardText(copyableSource.value)

  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1200)
}

async function copySourcePanelCode() {
  void writeClipboardText(sourcePanelCode.value)

  window.clearTimeout(copiedSourcePanelResetTimer)
  copiedSourcePanel.value = true
  copiedSourcePanelResetTimer = window.setTimeout(() => {
    copiedSourcePanel.value = false
  }, 1200)
}

async function toggleSourcePanelFromToolbar() {
  const willOpen = !showSourcePanel.value

  showSourcePanel.value = willOpen

  if (!willOpen || typeof document === 'undefined') {
    return
  }

  await nextTick()

  const sourcePanel = document.getElementById('live-example-source-panel')

  sourcePanel?.scrollIntoView({
    block: 'start',
    behavior: 'smooth'
  })
  sourcePanel?.focus({ preventScroll: true })
}

async function hideSourcePanelFromSourcePanel() {
  showSourcePanel.value = false

  await nextTick()

  const sourceToggle = document.querySelector<HTMLElement>('[data-live-toolbar-action="toggle-source"]')

  sourceToggle?.focus({ preventScroll: true })
}

async function copyPlaygroundImportLink() {
  persistPlaygroundHandoff()
  void writeClipboardText(playgroundImportShareUrl.value)

  window.clearTimeout(copiedPlaygroundLinkResetTimer)
  copiedPlaygroundLink.value = true
  draftStatus.value = '已复制当前示例的 Playground 导入链接。'
  copiedPlaygroundLinkResetTimer = window.setTimeout(() => {
    copiedPlaygroundLink.value = false
  }, 1200)
}

async function copyPreviewState() {
  if (!previewStateSnapshot.value) {
    return
  }

  void writeClipboardText(previewStateSnapshot.value)

  copiedPreviewState.value = true
  window.setTimeout(() => {
    copiedPreviewState.value = false
  }, 1200)
}

async function copyRunReport() {
  void writeClipboardText(runReport.value)

  copiedRunReport.value = true
  draftStatus.value = '已复制当前 live example 运行报告。'
  window.setTimeout(() => {
    copiedRunReport.value = false
  }, 1200)
}

async function copyInteractionRepro() {
  if (eventLogs.value.length === 0) {
    draftStatus.value = '请先在预览区触发一次组件事件，再复制交互复现。'
    return
  }

  void writeClipboardText(interactionReproReport.value)

  copiedEventRepro.value = true
  draftStatus.value = '已复制当前交互复现材料。'
  window.setTimeout(() => {
    copiedEventRepro.value = false
  }, 1200)
}

async function copyScenarioTestPlan() {
  void writeClipboardText(scenarioTestPlanReport.value)

  copiedTestPlan.value = true
  draftStatus.value = '已复制当前场景验收步骤。'
  window.setTimeout(() => {
    copiedTestPlan.value = false
  }, 1200)
}

async function copySyncSnapshot() {
  void writeClipboardText(liveExampleSyncSnapshotText.value)

  copiedSyncSnapshot.value = true
  draftStatus.value = '已复制当前 live example 同步快照。'
  window.setTimeout(() => {
    copiedSyncSnapshot.value = false
  }, 1200)
}

async function copyScenarioCoverageManifest() {
  void writeClipboardText(scenarioCoverageManifest.value)

  copiedCoverageManifest.value = true
  draftStatus.value = '已复制当前 live example 场景覆盖清单。'
  window.setTimeout(() => {
    copiedCoverageManifest.value = false
  }, 1200)
}

async function copyApiMapManifest() {
  void writeClipboardText(apiMapManifest.value)

  copiedApiMap.value = true
  draftStatus.value = '已复制当前 live example API 覆盖清单。'
  window.setTimeout(() => {
    copiedApiMap.value = false
  }, 1200)
}

async function copyDiagnosticSnippet() {
  if (!diagnosticReport.value) {
    return
  }

  void writeClipboardText(diagnosticReport.value)

  copiedDiagnostic.value = true
  draftStatus.value = '已复制当前示例诊断片段。'
  window.setTimeout(() => {
    copiedDiagnostic.value = false
  }, 1200)
}

async function copyScenarioLink() {
  if (!activeScenarioShareUrl.value) {
    draftStatus.value = '请先选择一个 workflow 场景，再复制场景链接。'
    return
  }

  syncLiveExampleShareUrl(activeScenarioShareUrl.value)
  void writeClipboardText(activeScenarioShareUrl.value)

  copiedScenarioLink.value = true
  draftStatus.value = `已复制「${activeScenario.value?.label}」场景链接，并同步到当前地址。`
  window.setTimeout(() => {
    copiedScenarioLink.value = false
  }, 1200)
}

async function copyStateLink() {
  if (!activeStateShareUrl.value) {
    draftStatus.value = '当前示例还没有可分享的属性面板。'
    return
  }

  syncLiveExampleShareUrl(activeStateShareUrl.value)
  void writeClipboardText(activeStateShareUrl.value)

  copiedStateLink.value = true
  draftStatus.value = '已复制当前属性状态链接，并同步到当前地址。'
  window.setTimeout(() => {
    copiedStateLink.value = false
  }, 1200)
}
</script>

<template>
  <section class="live-example-runner" aria-label="Live editable example runner">
    <div class="live-example-runner__header">
      <div>
        <p class="docs-eyebrow">live example runner</p>
        <h2>{{ runnerTitle }}</h2>
        <p>{{ runnerDescription }}</p>
      </div>
      <div class="live-example-runner__stats" aria-label="Example status">
        <span>{{ liveStats.status }}</span>
        <span>{{ liveStats.lines }} lines</span>
        <span>{{ liveStats.characters }} chars</span>
      </div>
    </div>

    <LiveExampleToolbar
      v-model:selected-preset="selectedPreset"
      v-model:copy-mode="copyMode"
      v-model:source-language-mode="sourceLanguageMode"
      v-model:selected-theme="selectedTheme"
      v-model:preview-viewport="previewViewport"
      :starter-options="starterOptions"
      :copy-mode-options="copyModeOptions"
      :source-language-options="sourceLanguageOptions"
      :theme-options="themeOptions"
      :preview-viewport-options="previewViewportOptions"
      :auto-run="autoRun"
      :has-pending-changes="hasPendingChanges"
      :can-reset-code="canResetCode"
      :validation-error="validationError"
      :show-source-panel="showSourcePanel"
      :has-stored-draft="hasStoredDraft"
      :copied="copied"
      :copied-label="copiedLabel"
      :copied-run-report="copiedRunReport"
      :copied-playground-link="copiedPlaygroundLink"
      :playground-handoff-url="playgroundHandoffUrl"
      :source-file-url="sourceFileUrl"
      @apply-starter="applyStarter"
      @apply-preview-theme="applyPreviewTheme"
      @toggle-auto-run="toggleAutoRun"
      @build-preview="buildPreview"
      @format-code="formatCode"
      @toggle-source-panel="toggleSourcePanelFromToolbar"
      @clear-draft="clearDraft"
      @reset-code="resetCode"
      @copy-code="copyCode"
      @copy-run-report="copyRunReport"
      @persist-playground-handoff="persistPlaygroundHandoff"
      @copy-playground-link="copyPlaygroundImportLink"
    />

    <section class="live-example-runner__example-card" data-live-example-card="element-plus">
      <div class="live-example-runner__grid">
        <details class="live-example-runner__editor-disclosure">
          <summary class="live-example-runner__editor-disclosure-summary">
            <span>在线调试</span>
            <strong>编辑当前 SFC</strong>
          </summary>
          <LiveExampleEditorPanel
            ref="editorPanel"
            v-model="source"
            :line-numbers="sourceLineNumbers"
            :editor-scroll-top="editorScrollTop"
            :live-stats="liveStats"
            :validation-issue="validationIssue"
            :copied-diagnostic="copiedDiagnostic"
            @editor-scroll="syncEditorScroll"
            @focus-validation-line="focusValidationLine"
            @copy-diagnostic-snippet="copyDiagnosticSnippet"
          />
        </details>

        <LiveExamplePreviewPanel
          :preview-viewport="previewViewport"
          :preview-viewport-label="previewViewportLabel"
          :preview-notice="previewNotice"
          :show-image-preview-action="selectedPreset === 'image'"
          :validation-error="validationError"
          :validation-issue="validationIssue"
          :copied-diagnostic="copiedDiagnostic"
          @open-image-preview="openImagePreviewFromRunner"
          @focus-validation-line="focusValidationLine"
          @copy-diagnostic-snippet="copyDiagnosticSnippet"
          @preview-frame-click="handlePreviewFrameClick"
        >
          <PreviewHost />
        </LiveExamplePreviewPanel>
      </div>

      <LiveExampleSourcePanel
        v-if="showSourcePanel"
        v-model:source-panel-mode="sourcePanelMode"
        v-model:source-language-mode="sourceLanguageMode"
        v-model:install-package-manager="installPackageManager"
        :source-panel-mode-label="sourcePanelModeLabel"
        :source-panel-options="sourcePanelOptions"
        :show-source-language-switch="showSourceLanguageSwitch"
        :source-language-options="sourceLanguageOptions"
        :copied-source-panel="copiedSourcePanel"
        :playground-handoff-url="playgroundHandoffUrl"
        :source-file-url="sourceFileUrl"
        :playground-handoff-items="playgroundHandoffItems"
        :copied-playground-link="copiedPlaygroundLink"
        :source-diff-summary="sourceDiffSummary"
        :install-package-manager-options="installPackageManagerOptions"
        :source-panel-code="sourcePanelCode"
        @copy-source="copySourcePanelCode"
        @copy-playground-link="copyPlaygroundImportLink"
        @persist-playground-handoff="persistPlaygroundHandoff"
        @hide-source="hideSourcePanelFromSourcePanel"
      />
    </section>

    <LiveExampleScenarioStrip
      v-if="hasScenarioSwitcher"
      :scenarios="activeScenarios"
      :active-scenario-key="activeScenario?.key ?? ''"
      :active-scenario-label="activeScenario?.label ?? ''"
      :scenario-kind-labels="scenarioKindLabels"
      :copied-scenario-link="copiedScenarioLink"
      @copy-scenario-link="copyScenarioLink"
      @apply-scenario="applyScenario($event, { syncHash: true })"
    />

    <div class="live-example-runner__inspector" aria-label="Live example inspector">
      <LiveExamplePropsPanel
        :title="activeRecipe?.title ?? 'Source first'"
        :description="activeRecipe?.description ?? '当前示例暂未登记可视化属性面板，仍可直接编辑 SFC 源码并运行预览。'"
        :controls="activeControls"
        :control-state="controlState"
        :copied-state-link="copiedStateLink"
        @copy-state-link="copyStateLink"
        @reset-controls="resetControls"
        @update-control="updateControlValue($event.control, $event.value)"
      />

      <section
        v-if="hasInputWorkflowSimulator"
        class="live-example-runner__input-simulator"
        aria-label="Input workflow simulator"
      >
        <header>
          <div>
            <span>Input workflow</span>
            <strong>模拟搜索与清空</strong>
          </div>
        </header>
        <p>模拟在筛选输入框中键入搜索词，再清空回到空状态，验证输入值、字数计数、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="input-simulate-search"
            @click="simulateInputSearch"
          >
            输入 button
          </button>
          <button
            type="button"
            data-testid="input-simulate-clear"
            @click="simulateInputClear"
          >
            清空搜索
          </button>
        </div>
      </section>

      <section
        v-if="hasCheckboxWorkflowSimulator"
        class="live-example-runner__checkbox-simulator"
        aria-label="Checkbox workflow simulator"
      >
        <header>
          <div>
            <span>Checkbox workflow</span>
            <strong>模拟批量选择</strong>
          </div>
        </header>
        <p>模拟发布清单中一键选中所有可选项，再回退到部分选中，验证数组 v-model、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="checkbox-simulate-select-all"
            @click="simulateCheckboxSelectAll"
          >
            全选可选项
          </button>
          <button
            type="button"
            data-testid="checkbox-simulate-partial"
            @click="simulateCheckboxPartial"
          >
            回退部分选中
          </button>
        </div>
      </section>

      <section
        v-if="hasCascaderWorkflowSimulator"
        class="live-example-runner__cascader-simulator"
        aria-label="Cascader workflow simulator"
      >
        <header>
          <div>
            <span>Cascader workflow</span>
            <strong>模拟路径选择</strong>
          </div>
        </header>
        <p>模拟打开级联面板后选择 Core / Feedback / Tooltip，再验证清空行为、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="cascader-simulate-tooltip-path"
            @click="simulateCascaderTooltipPath"
          >
            选择 Tooltip 路径
          </button>
          <button
            type="button"
            data-testid="cascader-simulate-clear"
            @click="simulateCascaderClear"
          >
            清空路径
          </button>
        </div>
      </section>

      <section
        v-if="hasRadioGroupWorkflowSimulator"
        class="live-example-runner__radio-group-simulator"
        aria-label="Radio Group workflow simulator"
      >
        <header>
          <div>
            <span>Radio workflow</span>
            <strong>模拟互斥选择</strong>
          </div>
        </header>
        <p>模拟在 Core 和 Product 方案之间切换，验证单选互斥状态、受控值、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="radio-group-simulate-product"
            @click="simulateRadioGroupProduct"
          >
            选择 Product
          </button>
          <button
            type="button"
            data-testid="radio-group-simulate-core"
            @click="simulateRadioGroupCore"
          >
            回退 Core
          </button>
        </div>
      </section>

      <section
        v-if="hasDateRangeWorkflowSimulator"
        class="live-example-runner__date-range-simulator"
        aria-label="Date Range Picker workflow simulator"
      >
        <header>
          <div>
            <span>Date Range workflow</span>
            <strong>模拟范围选择</strong>
          </div>
        </header>
        <p>模拟打开范围面板后选择 Sprint range，再验证清空行为、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="date-range-simulate-sprint"
            @click="simulateDateRangeSprint"
          >
            选择 Sprint range
          </button>
          <button
            type="button"
            data-testid="date-range-simulate-clear"
            @click="simulateDateRangeClear"
          >
            清空范围
          </button>
        </div>
      </section>

      <section
        v-if="hasDatePickerWorkflowSimulator"
        class="live-example-runner__date-picker-simulator"
        aria-label="Date Picker workflow simulator"
      >
        <header>
          <div>
            <span>Date Picker workflow</span>
            <strong>模拟快捷选择</strong>
          </div>
        </header>
        <p>模拟打开日期面板后选择 Review day，再验证清空行为、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="date-picker-simulate-review-day"
            @click="simulateDatePickerReviewDay"
          >
            选择 Review day
          </button>
          <button
            type="button"
            data-testid="date-picker-simulate-clear"
            @click="simulateDatePickerClear"
          >
            清空日期
          </button>
        </div>
      </section>

      <section
        v-if="hasInputNumberWorkflowSimulator"
        class="live-example-runner__input-number-simulator"
        aria-label="Input Number workflow simulator"
      >
        <header>
          <div>
            <span>Input Number workflow</span>
            <strong>模拟数值步进</strong>
          </div>
        </header>
        <p>模拟库存补货后数值从 4 增加到 8，再验证重置行为、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="input-number-simulate-restock"
            @click="simulateInputNumberRestock"
          >
            模拟补货到 8
          </button>
          <button
            type="button"
            data-testid="input-number-simulate-reset"
            @click="simulateInputNumberReset"
          >
            重置数量
          </button>
        </div>
      </section>

      <section
        v-if="hasColorPickerWorkflowSimulator"
        class="live-example-runner__color-picker-simulator"
        aria-label="Color Picker workflow simulator"
      >
        <header>
          <div>
            <span>Color Picker workflow</span>
            <strong>模拟品牌色选择</strong>
          </div>
        </header>
        <p>模拟从品牌预设色中选择紫色 token，再验证清空行为、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="color-picker-simulate-brand-purple"
            @click="simulateColorPickerBrandPurple"
          >
            选择品牌紫色
          </button>
          <button
            type="button"
            data-testid="color-picker-simulate-clear"
            @click="simulateColorPickerClear"
          >
            清空颜色
          </button>
        </div>
      </section>

      <section
        v-if="hasAlertWorkflowSimulator"
        class="live-example-runner__alert-simulator"
        aria-label="Alert workflow simulator"
      >
        <header>
          <div>
            <span>Alert workflow</span>
            <strong>模拟关闭、恢复和升级</strong>
          </div>
        </header>
        <p>模拟提示被关闭、重新展示、升级为 assertive danger alert 和打开关联动作，验证可见性、语义角色、状态快照和 close / restore / escalate / action 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="alert-simulate-dismiss"
            @click="simulateAlertDismiss"
          >
            关闭提示
          </button>
          <button
            type="button"
            data-testid="alert-simulate-restore"
            @click="simulateAlertRestore"
          >
            恢复提示
          </button>
          <button
            type="button"
            data-testid="alert-simulate-escalate"
            @click="simulateAlertEscalate"
          >
            升级危险态
          </button>
          <button
            type="button"
            data-testid="alert-simulate-action"
            @click="simulateAlertOpenAction"
          >
            打开动作
          </button>
        </div>
      </section>

      <section
        v-if="hasListWorkflowSimulator"
        class="live-example-runner__list-simulator"
        aria-label="List workflow simulator"
      >
        <header>
          <div>
            <span>List workflow</span>
            <strong>模拟远程列表生命周期</strong>
          </div>
        </header>
        <p>模拟列表加载、完成、空结果和重试路径，验证列表标题、loading、emptyText、状态快照和 loading / resolved / empty / retry 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="list-simulate-loading"
            @click="simulateListLoading"
          >
            加载中
          </button>
          <button
            type="button"
            data-testid="list-simulate-resolved"
            @click="simulateListResolved"
          >
            完成
          </button>
          <button
            type="button"
            data-testid="list-simulate-empty"
            @click="simulateListEmpty"
          >
            空结果
          </button>
          <button
            type="button"
            data-testid="list-simulate-retry"
            @click="simulateListRetry"
          >
            重试
          </button>
        </div>
      </section>

      <section
        v-if="hasDescriptionsWorkflowSimulator"
        class="live-example-runner__descriptions-simulator"
        aria-label="Descriptions workflow simulator"
      >
        <header>
          <div>
            <span>Descriptions workflow</span>
            <strong>模拟详情页元数据流转</strong>
          </div>
        </header>
        <p>模拟详情加载完成、审核资料、空资料和长字段路径，验证 title、items、layout、emptyText、状态快照和 loaded / review / empty / longField 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="descriptions-simulate-loaded"
            @click="simulateDescriptionsLoaded"
          >
            载入详情
          </button>
          <button
            type="button"
            data-testid="descriptions-simulate-review"
            @click="simulateDescriptionsReview"
          >
            审核资料
          </button>
          <button
            type="button"
            data-testid="descriptions-simulate-empty"
            @click="simulateDescriptionsEmpty"
          >
            空详情
          </button>
          <button
            type="button"
            data-testid="descriptions-simulate-long-field"
            @click="simulateDescriptionsLongField"
          >
            长字段
          </button>
        </div>
      </section>

      <section
        v-if="hasTimelineWorkflowSimulator"
        class="live-example-runner__timeline-simulator"
        aria-label="Timeline workflow simulator"
      >
        <header>
          <div>
            <span>Timeline workflow</span>
            <strong>模拟发布流水线</strong>
          </div>
        </header>
        <p>模拟发布运行中、失败、回滚和完成路径，验证 timeline items、loading、reverse、状态快照和 running / failed / rollback / complete 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="timeline-simulate-running"
            @click="simulateTimelineRunning"
          >
            运行中
          </button>
          <button
            type="button"
            data-testid="timeline-simulate-failed"
            @click="simulateTimelineFailed"
          >
            失败
          </button>
          <button
            type="button"
            data-testid="timeline-simulate-rollback"
            @click="simulateTimelineRollback"
          >
            回滚
          </button>
          <button
            type="button"
            data-testid="timeline-simulate-complete"
            @click="simulateTimelineComplete"
          >
            完成
          </button>
        </div>
      </section>

      <section
        v-if="hasStatisticWorkflowSimulator"
        class="live-example-runner__statistic-simulator"
        aria-label="Statistic workflow simulator"
      >
        <header>
          <div>
            <span>Statistic workflow</span>
            <strong>模拟指标刷新流转</strong>
          </div>
        </header>
        <p>模拟指标加载、远程刷新、预算告警和基线重置路径，验证 value、loading、tone、状态快照和 loading / refresh / warning / reset 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="statistic-simulate-loading"
            @click="simulateStatisticLoading"
          >
            加载中
          </button>
          <button
            type="button"
            data-testid="statistic-simulate-refresh"
            @click="simulateStatisticRefresh"
          >
            刷新完成
          </button>
          <button
            type="button"
            data-testid="statistic-simulate-warning"
            @click="simulateStatisticWarning"
          >
            预算告警
          </button>
          <button
            type="button"
            data-testid="statistic-simulate-reset"
            @click="simulateStatisticReset"
          >
            重置基线
          </button>
        </div>
      </section>

      <section
        v-if="hasPaginationWorkflowSimulator"
        class="live-example-runner__pagination-simulator"
        aria-label="Pagination workflow simulator"
      >
        <header>
          <div>
            <span>Pagination workflow</span>
            <strong>模拟分页列表流转</strong>
          </div>
        </header>
        <p>模拟列表翻页、每页数量变化和末页边界，验证当前页数据范围、状态快照、页码按钮和 nextBatch / pageSize / lastPage 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="pagination-simulate-next-batch"
            @click="simulatePaginationNextBatch"
          >
            下一批
          </button>
          <button
            type="button"
            data-testid="pagination-simulate-page-size"
            @click="simulatePaginationPageSize"
          >
            每页 20 条
          </button>
          <button
            type="button"
            data-testid="pagination-simulate-last-page"
            @click="simulatePaginationLastPage"
          >
            跳到末页
          </button>
        </div>
      </section>

      <section
        v-if="hasProgressWorkflowSimulator"
        class="live-example-runner__progress-simulator"
        aria-label="Progress workflow simulator"
      >
        <header>
          <div>
            <span>Progress workflow</span>
            <strong>模拟任务进度流转</strong>
          </div>
        </header>
        <p>模拟任务从运行中到失败、重试和完成的状态流，验证进度值、语义色、读屏文本、状态快照和 running / failed / retry / complete 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="progress-simulate-running"
            @click="simulateProgressRunning"
          >
            运行中
          </button>
          <button
            type="button"
            data-testid="progress-simulate-failed"
            @click="simulateProgressFailed"
          >
            模拟失败
          </button>
          <button
            type="button"
            data-testid="progress-simulate-retry"
            @click="simulateProgressRetry"
          >
            重试
          </button>
          <button
            type="button"
            data-testid="progress-simulate-complete"
            @click="simulateProgressComplete"
          >
            完成
          </button>
        </div>
      </section>

      <section
        v-if="hasRateWorkflowSimulator"
        class="live-example-runner__rate-simulator"
        aria-label="Rate workflow simulator"
      >
        <header>
          <div>
            <span>Rate workflow</span>
            <strong>模拟评分与清空</strong>
          </div>
        </header>
        <p>模拟用户先给出 5 分评价，再回到未评分状态，验证评分值、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="rate-simulate-five-star"
            @click="simulateRateFiveStar"
          >
            选择 5 分
          </button>
          <button
            type="button"
            data-testid="rate-simulate-clear"
            @click="simulateRateClear"
          >
            清空评分
          </button>
        </div>
      </section>

      <section
        v-if="hasSliderWorkflowSimulator"
        class="live-example-runner__slider-simulator"
        aria-label="Slider workflow simulator"
      >
        <header>
          <div>
            <span>Slider workflow</span>
            <strong>模拟范围拖动</strong>
          </div>
        </header>
        <p>模拟预算范围从 20 - 80 调整到 30 - 70，再验证重置行为、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="slider-simulate-budget-range"
            @click="simulateSliderBudgetRange"
          >
            设置预算范围
          </button>
          <button
            type="button"
            data-testid="slider-simulate-reset"
            @click="simulateSliderReset"
          >
            重置范围
          </button>
        </div>
      </section>

      <section
        v-if="hasSwitchWorkflowSimulator"
        class="live-example-runner__switch-simulator"
        aria-label="Switch workflow simulator"
      >
        <header>
          <div>
            <span>Switch workflow</span>
            <strong>模拟即时开关</strong>
          </div>
        </header>
        <p>模拟即时设置开启后立即生效，再回滚到关闭状态，验证开关状态、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="switch-simulate-enable"
            @click="simulateSwitchEnable"
          >
            开启设置
          </button>
          <button
            type="button"
            data-testid="switch-simulate-rollback"
            @click="simulateSwitchRollback"
          >
            回滚关闭
          </button>
        </div>
      </section>

      <section
        v-if="hasTableWorkflowSimulator"
        class="live-example-runner__table-simulator"
        aria-label="Table workflow simulator"
      >
        <header>
          <div>
            <span>Table workflow</span>
            <strong>模拟选择、排序与筛选</strong>
          </div>
        </header>
        <p>模拟选择 YButton 行、切换 Stars 排序和加入 Beta 筛选，验证 selectedRowKeys、sort、filters、状态快照和 Table 事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="table-simulate-select-ybutton"
            @click="simulateTableSelectYButton"
          >
            选择 YButton
          </button>
          <button
            type="button"
            data-testid="table-simulate-sort-stars"
            @click="simulateTableSortStars"
          >
            切换 Stars 排序
          </button>
          <button
            type="button"
            data-testid="table-simulate-filter-beta"
            @click="simulateTableFilterBeta"
          >
            加入 Beta 筛选
          </button>
        </div>
      </section>

      <section
        v-if="hasTimePickerWorkflowSimulator"
        class="live-example-runner__time-picker-simulator"
        aria-label="Time Picker workflow simulator"
      >
        <header>
          <div>
            <span>Time Picker workflow</span>
            <strong>模拟确认时间</strong>
          </div>
        </header>
        <p>模拟打开时间面板后选择 Standup time，再验证清空行为、状态快照和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="time-picker-simulate-standup"
            @click="simulateTimePickerStandup"
          >
            选择 Standup time
          </button>
          <button
            type="button"
            data-testid="time-picker-simulate-clear"
            @click="simulateTimePickerClear"
          >
            清空时间
          </button>
        </div>
      </section>

      <section
        v-if="hasSelectWorkflowSimulator"
        class="live-example-runner__select-simulator"
        aria-label="Select workflow simulator"
      >
        <header>
          <div>
            <span>Select workflow</span>
            <strong>模拟远程搜索</strong>
          </div>
        </header>
        <p>模拟远程查询完成后选择 Product tools，验证 loading 结束、选中值、状态快照和事件日志是否同步。</p>
        <button
          type="button"
          data-testid="select-simulate-remote-result"
          @click="simulateSelectRemoteResult"
        >
          模拟远程返回并选择
        </button>
      </section>

      <section
        v-if="hasDropdownWorkflowSimulator"
        class="live-example-runner__dropdown-simulator"
        aria-label="Dropdown workflow simulator"
      >
        <header>
          <div>
            <span>Dropdown workflow</span>
            <strong>模拟菜单动作</strong>
          </div>
        </header>
        <p>模拟打开动作菜单并选择 Copy command，验证菜单项、关闭状态、状态快照和事件日志是否同步。</p>
        <button
          type="button"
          data-testid="dropdown-simulate-copy-command"
          @click="simulateDropdownCopyCommand"
        >
          选择 Copy command
        </button>
      </section>

      <section
        v-if="hasTooltipWorkflowSimulator"
        class="live-example-runner__tooltip-simulator"
        aria-label="Tooltip workflow simulator"
      >
        <header>
          <div>
            <span>Tooltip workflow</span>
            <strong>模拟受控显隐</strong>
          </div>
        </header>
        <p>模拟点击触发 Tooltip 后受控打开，再关闭回到普通提示状态，验证 open 状态、预览气泡和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="tooltip-simulate-open"
            @click="simulateTooltipOpen"
          >
            模拟打开
          </button>
          <button
            type="button"
            data-testid="tooltip-simulate-close"
            @click="simulateTooltipClose"
          >
            模拟关闭
          </button>
        </div>
      </section>

      <section
        v-if="hasPopoverWorkflowSimulator"
        class="live-example-runner__popover-simulator"
        aria-label="Popover workflow simulator"
      >
        <header>
          <div>
            <span>Popover workflow</span>
            <strong>模拟确认卡片</strong>
          </div>
        </header>
        <p>模拟打开一个可操作确认浮层，再关闭回到受控收起状态，验证 open 状态、预览面板和事件日志是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="popover-simulate-open"
            @click="simulatePopoverOpen"
          >
            打开确认卡片
          </button>
          <button
            type="button"
            data-testid="popover-simulate-dismiss"
            @click="simulatePopoverDismiss"
          >
            关闭卡片
          </button>
        </div>
      </section>

      <section
        v-if="hasPopconfirmWorkflowSimulator"
        class="live-example-runner__popconfirm-simulator"
        aria-label="Popconfirm workflow simulator"
      >
        <header>
          <div>
            <span>Popconfirm workflow</span>
            <strong>模拟确认与取消</strong>
          </div>
        </header>
        <p>模拟确认或取消当前 Popconfirm，验证面板关闭、状态快照和 confirm / cancel 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="popconfirm-simulate-confirm"
            @click="simulatePopconfirmConfirm"
          >
            模拟确认
          </button>
          <button
            type="button"
            data-testid="popconfirm-simulate-cancel"
            @click="simulatePopconfirmCancel"
          >
            模拟取消
          </button>
        </div>
      </section>

      <section
        v-if="hasModalWorkflowSimulator"
        class="live-example-runner__modal-simulator"
        aria-label="Modal workflow simulator"
      >
        <header>
          <div>
            <span>Modal workflow</span>
            <strong>模拟确认与取消</strong>
          </div>
        </header>
        <p>模拟弹窗确认或取消后的关闭链路，验证 open 状态、状态快照和 close / confirm / cancel 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="modal-simulate-confirm"
            @click="simulateModalConfirm"
          >
            模拟确认
          </button>
          <button
            type="button"
            data-testid="modal-simulate-cancel"
            @click="simulateModalCancel"
          >
            模拟取消
          </button>
        </div>
      </section>

      <section
        v-if="hasDrawerWorkflowSimulator"
        class="live-example-runner__drawer-simulator"
        aria-label="Drawer workflow simulator"
      >
        <header>
          <div>
            <span>Drawer workflow</span>
            <strong>模拟保存与关闭</strong>
          </div>
        </header>
        <p>模拟抽屉内保存或显式关闭后的侧滑面板链路，验证 open 状态、方向、状态快照和 close / save / dismiss 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="drawer-simulate-save"
            @click="simulateDrawerSave"
          >
            模拟保存
          </button>
          <button
            type="button"
            data-testid="drawer-simulate-dismiss"
            @click="simulateDrawerDismiss"
          >
            模拟关闭
          </button>
        </div>
      </section>

      <section
        v-if="hasMessageWorkflowSimulator"
        class="live-example-runner__message-simulator"
        aria-label="Message workflow simulator"
      >
        <header>
          <div>
            <span>Message workflow</span>
            <strong>模拟加载、成功与关闭</strong>
          </div>
        </header>
        <p>模拟消息从 loading 持续提示更新为 success，再显式关闭，验证消息状态、可关闭性、状态快照和 open / update / close 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="message-simulate-loading"
            @click="simulateMessageLoading"
          >
            显示 loading
          </button>
          <button
            type="button"
            data-testid="message-simulate-success"
            @click="simulateMessageSuccess"
          >
            更新成功
          </button>
          <button
            type="button"
            data-testid="message-simulate-dismiss"
            @click="simulateMessageDismiss"
          >
            关闭消息
          </button>
        </div>
      </section>

      <section
        v-if="hasEmptyWorkflowSimulator"
        class="live-example-runner__empty-simulator"
        aria-label="Empty workflow simulator"
      >
        <header>
          <div>
            <span>Empty workflow</span>
            <strong>模拟空状态下一步</strong>
          </div>
        </header>
        <p>模拟首次创建、搜索清空和权限申请路径，验证空态标题、说明、状态快照和 action / clearFilters / requestAccess 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="empty-simulate-create"
            @click="simulateEmptyCreate"
          >
            模拟创建
          </button>
          <button
            type="button"
            data-testid="empty-simulate-clear"
            @click="simulateEmptyClearFilters"
          >
            清除筛选
          </button>
          <button
            type="button"
            data-testid="empty-simulate-request-access"
            @click="simulateEmptyRequestAccess"
          >
            申请权限
          </button>
        </div>
      </section>

      <section
        v-if="hasCollapseWorkflowSimulator"
        class="live-example-runner__collapse-simulator"
        aria-label="Collapse workflow simulator"
      >
        <header>
          <div>
            <span>Collapse workflow</span>
            <strong>模拟折叠面板状态</strong>
          </div>
        </header>
        <p>模拟全部展开、全部收起、手风琴设置和锁定说明路径，验证展开面板、状态文案、状态快照和 openAll / closeAll / accordion / locked 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="collapse-simulate-open-all"
            @click="simulateCollapseOpenAll"
          >
            全部展开
          </button>
          <button
            type="button"
            data-testid="collapse-simulate-close-all"
            @click="simulateCollapseCloseAll"
          >
            全部收起
          </button>
          <button
            type="button"
            data-testid="collapse-simulate-accordion"
            @click="simulateCollapseAccordion"
          >
            手风琴设置
          </button>
          <button
            type="button"
            data-testid="collapse-simulate-locked"
            @click="simulateCollapseLocked"
          >
            锁定说明
          </button>
        </div>
      </section>

      <section
        v-if="hasResultWorkflowSimulator"
        class="live-example-runner__result-simulator"
        aria-label="Result workflow simulator"
      >
        <header>
          <div>
            <span>Result workflow</span>
            <strong>模拟结果页操作</strong>
          </div>
        </header>
        <p>模拟结果页主操作和服务异常重试路径，验证结果状态、操作标签、状态快照和 open / retry 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="result-simulate-open"
            @click="simulateResultOpen"
          >
            打开结果操作
          </button>
          <button
            type="button"
            data-testid="result-simulate-retry"
            @click="simulateResultRetry"
          >
            模拟重试
          </button>
        </div>
      </section>

      <section
        v-if="hasSkeletonWorkflowSimulator"
        class="live-example-runner__skeleton-simulator"
        aria-label="Skeleton workflow simulator"
      >
        <header>
          <div>
            <span>Skeleton workflow</span>
            <strong>模拟加载生命周期</strong>
          </div>
        </header>
        <p>模拟远程内容从加载中到完成、超时和重试的路径，验证骨架屏、真实内容、错误提示、状态快照和 loading / resolved / timeout / retry 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="skeleton-simulate-loading"
            @click="simulateSkeletonLoading"
          >
            开始加载
          </button>
          <button
            type="button"
            data-testid="skeleton-simulate-resolved"
            @click="simulateSkeletonResolved"
          >
            加载完成
          </button>
          <button
            type="button"
            data-testid="skeleton-simulate-timeout"
            @click="simulateSkeletonTimeout"
          >
            模拟超时
          </button>
          <button
            type="button"
            data-testid="skeleton-simulate-retry"
            @click="simulateSkeletonRetry"
          >
            重试加载
          </button>
        </div>
      </section>

      <section
        v-if="hasStepsWorkflowSimulator"
        class="live-example-runner__steps-simulator"
        aria-label="Steps workflow simulator"
      >
        <header>
          <div>
            <span>Steps workflow</span>
            <strong>模拟流程推进</strong>
          </div>
        </header>
        <p>模拟流程下一步、退回、阻断和完成状态，验证当前步骤、错误状态、状态说明、状态快照和 next / back / blocked / complete 事件是否同步。</p>
        <div class="live-example-runner__workflow-actions">
          <button
            type="button"
            data-testid="steps-simulate-next"
            @click="simulateStepsNext"
          >
            下一步
          </button>
          <button
            type="button"
            data-testid="steps-simulate-back"
            @click="simulateStepsBack"
          >
            退回
          </button>
          <button
            type="button"
            data-testid="steps-simulate-blocked"
            @click="simulateStepsBlocked"
          >
            模拟阻断
          </button>
          <button
            type="button"
            data-testid="steps-simulate-complete"
            @click="simulateStepsComplete"
          >
            完成流程
          </button>
        </div>
      </section>

      <section
        v-if="hasUploadWorkflowSimulator"
        class="live-example-runner__upload-simulator"
        aria-label="Upload workflow simulator"
      >
        <header>
          <div>
            <span>Upload workflow</span>
            <strong>模拟文件选择</strong>
          </div>
        </header>
        <p>用内置 PNG 和 CSV 文件触发接受、拒绝、状态快照和事件日志，适合不打开本地文件选择器时验证上传链路。</p>
        <button
          type="button"
          data-testid="upload-simulate-mixed-selection"
          @click="simulateUploadMixedSelection"
        >
          模拟 PNG + CSV
        </button>
      </section>

      <LiveExamplePreviewState
        v-if="hasPreviewStateSnapshot"
        :snapshot="previewStateSnapshot"
        :copied="copiedPreviewState"
        @copy-preview-state="copyPreviewState"
      />

      <LiveExampleReplayPanel
        :event-count="eventLogs.length"
        :copied-event-repro="copiedEventRepro"
        :evidence-items="interactionReplayEvidenceItems"
        :steps="interactionReplaySteps"
        @copy-event-repro="copyInteractionRepro"
      />

      <LiveExampleEventLog
        :event-logs="eventLogs"
        :copied-event-repro="copiedEventRepro"
        @copy-event-repro="copyInteractionRepro"
        @clear-event-log="clearEventLog"
      />
    </div>

    <LiveExampleAdvancedTools
      summary="质量证据与复现材料"
      description="场景覆盖、API map、同步快照和交互契约默认收起，按需展开或通过右侧目录直达。"
      :target-hashes="advancedLiveExampleHashes"
      :meta="advancedToolsMetaItems"
    >
      <ul class="live-example-runner__cockpit" aria-label="Live example capability summary">
        <li v-for="item in exampleCockpitItems" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.detail }}</small>
        </li>
      </ul>

      <LiveExampleRunEvidence :items="runEvidenceItems" />

      <LiveExampleAcceptance :summary="acceptanceSummary" />

      <LiveExampleScenarioCoverage
        :summary="scenarioCoverageSummary"
        :items="scenarioCoverageItems"
        :copied="copiedCoverageManifest"
        @copy="copyScenarioCoverageManifest"
      />

      <LiveExampleApiMap
        :summary="apiMapSummary"
        :items="apiMapSectionItems"
        :copied="copiedApiMap"
        @copy="copyApiMapManifest"
      />

      <section
        v-if="hasScenarioSwitcher"
        id="live-example-debugger"
        class="live-example-runner__scenario-debug"
        aria-label="Active scenario debug summary"
      >
        <header class="live-example-runner__scenario-debug-header">
          <div>
            <span class="live-example-runner__scenario-debug-eyebrow">Live debugger</span>
            <strong>当前场景调试摘要</strong>
          </div>
          <p>场景、源码、事件、预览和分享状态会随示例操作即时同步。</p>
        </header>
        <ul class="live-example-runner__scenario-debug-list">
          <li v-for="item in activeScenarioDebugItems" :key="item.label">
            <strong>{{ item.label }} {{ item.value }}</strong>
            <small>{{ item.detail }}</small>
          </li>
        </ul>
      </section>

      <LiveExampleSyncSnapshot
        :summary-items="syncSnapshotSummaryItems"
        :control-items="activeControlSnapshotItems"
        :has-prop-controls="hasPropControls"
        :changed-control-count="changedControlCount"
        :copied="copiedSyncSnapshot"
        @copy="copySyncSnapshot"
      />

      <LiveExampleScenarioTestPlan
        :title="activeScenario?.label ?? '当前模板'"
        :steps="scenarioTestPlan"
        :copied="copiedTestPlan"
        @copy="copyScenarioTestPlan"
      />

      <LiveExampleInteractionContract
        :summary="interactionContractSummary"
        :checks="interactionContractChecks"
        :has-contract="hasInteractionContract"
      />
    </LiveExampleAdvancedTools>
  </section>
</template>
