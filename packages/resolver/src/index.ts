export type YokUiPackageName =
  | '@yok-ui/core'
  | '@yok-ui/product'
  | '@yok-ui/admin'
  | '@yok-ui/brand'

export interface YokUiResolverOptions {
  importStyle?: boolean | 'css'
  packages?: YokUiPackageName[]
  exclude?: string[]
}

export interface YokUiResolverResult {
  name: string
  from: YokUiPackageName
  sideEffects?: string
}

export type YokUiComponentResolver = (name: string) => YokUiResolverResult | undefined

export const yokUiPackageStyles = {
  '@yok-ui/core': '@yok-ui/core/style.css',
  '@yok-ui/product': '@yok-ui/product/style.css',
  '@yok-ui/admin': '@yok-ui/admin/style.css',
  '@yok-ui/brand': '@yok-ui/brand/style.css'
} satisfies Record<YokUiPackageName, string>

export const yokUiComponentPackages = {
  YAffix: '@yok-ui/core',
  YAlert: '@yok-ui/core',
  YAnchor: '@yok-ui/core',
  YAutocomplete: '@yok-ui/core',
  YAvatar: '@yok-ui/core',
  YAvatarGroup: '@yok-ui/core',
  YBacktop: '@yok-ui/core',
  YBadge: '@yok-ui/core',
  YBreadcrumb: '@yok-ui/core',
  YButton: '@yok-ui/core',
  YCalendar: '@yok-ui/core',
  YCarousel: '@yok-ui/core',
  YCascader: '@yok-ui/core',
  YCard: '@yok-ui/core',
  YCheckbox: '@yok-ui/core',
  YCollapse: '@yok-ui/core',
  YColorPicker: '@yok-ui/core',
  YConfigProvider: '@yok-ui/core',
  YDatePicker: '@yok-ui/core',
  YDateRangePicker: '@yok-ui/core',
  YDescriptions: '@yok-ui/core',
  YDivider: '@yok-ui/core',
  YDrawer: '@yok-ui/core',
  YDropdown: '@yok-ui/core',
  YEmpty: '@yok-ui/core',
  YFloatButton: '@yok-ui/core',
  YFloatButtonGroup: '@yok-ui/core',
  YForm: '@yok-ui/core',
  YFormItem: '@yok-ui/core',
  YFormSummary: '@yok-ui/core',
  YIcon: '@yok-ui/core',
  YIconButton: '@yok-ui/core',
  YImage: '@yok-ui/core',
  YInput: '@yok-ui/core',
  YInputOtp: '@yok-ui/core',
  YInputTag: '@yok-ui/core',
  YInputNumber: '@yok-ui/core',
  YLayout: '@yok-ui/core',
  YHeader: '@yok-ui/core',
  YAside: '@yok-ui/core',
  YMain: '@yok-ui/core',
  YFooter: '@yok-ui/core',
  YLink: '@yok-ui/core',
  YLoading: '@yok-ui/core',
  YList: '@yok-ui/core',
  YMenu: '@yok-ui/core',
  YMention: '@yok-ui/core',
  YMessage: '@yok-ui/core',
  YMessageBox: '@yok-ui/core',
  YModal: '@yok-ui/core',
  YNotification: '@yok-ui/core',
  YPagination: '@yok-ui/core',
  YPopconfirm: '@yok-ui/core',
  YPopover: '@yok-ui/core',
  YProgress: '@yok-ui/core',
  YQRCode: '@yok-ui/core',
  YRadioGroup: '@yok-ui/core',
  YRate: '@yok-ui/core',
  YResult: '@yok-ui/core',
  YScrollbar: '@yok-ui/core',
  YSegmented: '@yok-ui/core',
  YSelect: '@yok-ui/core',
  YSkeleton: '@yok-ui/core',
  YSpace: '@yok-ui/core',
  YSplitter: '@yok-ui/core',
  YSlider: '@yok-ui/core',
  YCountdown: '@yok-ui/core',
  YStatistic: '@yok-ui/core',
  YSteps: '@yok-ui/core',
  YSwitch: '@yok-ui/core',
  YTable: '@yok-ui/core',
  YTabs: '@yok-ui/core',
  YTag: '@yok-ui/core',
  YTextarea: '@yok-ui/core',
  YText: '@yok-ui/core',
  YThemeProvider: '@yok-ui/core',
  YTimeline: '@yok-ui/core',
  YTour: '@yok-ui/core',
  YTimePicker: '@yok-ui/core',
  YTooltip: '@yok-ui/core',
  YTransfer: '@yok-ui/core',
  YTree: '@yok-ui/core',
  YTreeSelect: '@yok-ui/core',
  YUpload: '@yok-ui/core',
  YVirtualList: '@yok-ui/core',
  YWatermark: '@yok-ui/core',

  YCodeBlock: '@yok-ui/product',
  YCommandPalette: '@yok-ui/product',
  YCopyButton: '@yok-ui/product',
  YThemeSwitcher: '@yok-ui/product',

  YApprovalCommentBox: '@yok-ui/admin',
  YBulkActionBar: '@yok-ui/admin',
  YBulkActionMenu: '@yok-ui/admin',
  YCrudLayout: '@yok-ui/admin',
  YDataTable: '@yok-ui/admin',
  YDataView: '@yok-ui/admin',
  YDataToolbar: '@yok-ui/admin',
  YFieldArray: '@yok-ui/admin',
  YFilterTabs: '@yok-ui/admin',
  YMetricCard: '@yok-ui/admin',
  YPageHeader: '@yok-ui/admin',
  YReviewWorkflow: '@yok-ui/admin',
  YResourcePage: '@yok-ui/admin',
  YSchemaForm: '@yok-ui/admin',
  YSavedViewManager: '@yok-ui/admin',
  YSavedViews: '@yok-ui/admin',
  YSearchForm: '@yok-ui/admin',
  YSearchPanel: '@yok-ui/admin',
  YStatusTimeline: '@yok-ui/admin',

  YBrandHero: '@yok-ui/brand',
  YFeatureGrid: '@yok-ui/brand',
  YLogoCloud: '@yok-ui/brand',
  YProfileCard: '@yok-ui/brand'
} satisfies Record<string, YokUiPackageName>

export type YokUiComponentName = keyof typeof yokUiComponentPackages

function isYokUiComponentName(name: string): name is YokUiComponentName {
  return Object.prototype.hasOwnProperty.call(yokUiComponentPackages, name)
}

export function YokUiResolver(options: YokUiResolverOptions = {}): YokUiComponentResolver {
  const enabledPackages = new Set<YokUiPackageName>(
    options.packages ?? ['@yok-ui/core', '@yok-ui/product', '@yok-ui/admin', '@yok-ui/brand']
  )
  const excludedComponents = new Set(options.exclude ?? [])

  return (name) => {
    if (excludedComponents.has(name)) {
      return undefined
    }

    if (!isYokUiComponentName(name)) {
      return undefined
    }

    const packageName = yokUiComponentPackages[name]

    if (!enabledPackages.has(packageName)) {
      return undefined
    }

    return {
      name,
      from: packageName,
      ...(options.importStyle === false ? {} : { sideEffects: yokUiPackageStyles[packageName] })
    }
  }
}

export default YokUiResolver
