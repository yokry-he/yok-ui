import type { App, Component } from 'vue'
import { YAffix } from './components/affix'
import { YAlert } from './components/alert'
import { YAutocomplete } from './components/autocomplete'
import { YAnchor } from './components/anchor'
import { YAvatar, YAvatarGroup } from './components/avatar'
import { YBacktop } from './components/backtop'
import { YBreadcrumb } from './components/breadcrumb'
import { YButton, YIconButton } from './components/button'
import { YCalendar } from './components/calendar'
import { YCarousel } from './components/carousel'
import { YCascader } from './components/cascader'
import { YCard } from './components/card'
import { YCheckbox, YCheckboxGroup } from './components/checkbox'
import { YCollapse } from './components/collapse'
import { YColorPicker, YColorPickerPanel } from './components/color-picker'
import { YConfigProvider } from './components/config-provider'
import { YDateTimePicker } from './components/date-time-picker'
import { YDatePicker, YDatePickerPanel, YDateRangePicker } from './components/date-picker'
import { YDescriptions } from './components/descriptions'
import { YDivider } from './components/divider'
import { YDrawer } from './components/drawer'
import { YDropdown } from './components/dropdown'
import { YEmpty } from './components/empty'
import { YFloatButton, YFloatButtonGroup } from './components/float-button'
import { YForm } from './components/form'
import { YFormItem } from './components/form-item'
import { YFormSummary } from './components/form-summary'
import { YIcon } from './components/icon'
import { YImage } from './components/image'
import { YInput } from './components/input'
import { YInputOtp } from './components/input-otp'
import { YInputTag } from './components/input-tag'
import { YInputNumber } from './components/input-number'
import { YAside, YFooter, YHeader, YLayout, YMain } from './components/layout'
import { YLink } from './components/link'
import { YLoading } from './components/loading'
import { YList } from './components/list'
import { YMenu } from './components/menu'
import { YMention } from './components/mention'
import { YMessage } from './components/message'
import { YMessageBox } from './components/message-box'
import { YModal } from './components/modal'
import { YNotification } from './components/notification'
import { YPagination } from './components/pagination'
import { YPopconfirm } from './components/popconfirm'
import { YPopover } from './components/popover'
import { YProgress } from './components/progress'
import { YQRCode } from './components/qr-code'
import { YRadioGroup } from './components/radio'
import { YRate } from './components/rate'
import { YResult } from './components/result'
import { YScrollbar } from './components/scrollbar'
import { YSegmented } from './components/segmented'
import { YSelect } from './components/select'
import { YSkeleton } from './components/skeleton'
import { YSpace } from './components/space'
import { YSplitter } from './components/splitter'
import { YSlider } from './components/slider'
import { YCountdown, YStatistic } from './components/statistic'
import { YSteps } from './components/steps'
import { YSwitch } from './components/switch'
import { YTable } from './components/table'
import { YBadge, YCheckTag, YTag } from './components/tag'
import { YTabs } from './components/tabs'
import { YTextarea } from './components/textarea'
import { YText } from './components/text'
import { YThemeProvider } from './components/theme-provider'
import { YTimeline } from './components/timeline'
import { YTour } from './components/tour'
import { YTimePicker } from './components/time-picker'
import { YTimeSelect } from './components/time-select'
import { YTooltip } from './components/tooltip'
import { YTransfer } from './components/transfer'
import { YTree } from './components/tree'
import { YTreeSelect } from './components/tree-select'
import { YUpload } from './components/upload'
import { YVirtualList } from './components/virtual-list'
import { YVirtualizedSelect } from './components/virtualized-select'
import { YWatermark } from './components/watermark'

export function createYokInstaller(components: Component[]) {
  return {
    install(app: App) {
      components.forEach((component) => {
        const name = component.name

        if (name) {
          app.component(name, component)
        }
      })
    }
  }
}

export const coreComponents: Component[] = [
  YAffix,
  YAlert,
  YAutocomplete,
  YAnchor,
  YAvatar,
  YAvatarGroup,
  YBacktop,
  YBreadcrumb,
  YButton,
  YIconButton,
  YCalendar,
  YCarousel,
  YCascader,
  YCard,
  YCheckbox,
  YCheckboxGroup,
  YCollapse,
  YColorPicker,
  YColorPickerPanel,
  YConfigProvider,
  YDateTimePicker,
  YDatePicker,
  YDatePickerPanel,
  YDateRangePicker,
  YDescriptions,
  YDivider,
  YDrawer,
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
  YInputOtp,
  YInputTag,
  YInputNumber,
  YLayout,
  YHeader,
  YAside,
  YMain,
  YFooter,
  YLink,
  YLoading,
  YList,
  YMenu,
  YMention,
  YMessage,
  YMessageBox,
  YModal,
  YNotification,
  YPagination,
  YPopconfirm,
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
  YSplitter,
  YSlider,
  YCountdown,
  YStatistic,
  YSteps,
  YSwitch,
  YTable,
  YBadge,
  YCheckTag,
  YTag,
  YTabs,
  YTextarea,
  YText,
  YThemeProvider,
  YTimeline,
  YTour,
  YTimePicker,
  YTimeSelect,
  YTooltip,
  YTransfer,
  YTree,
  YTreeSelect,
  YUpload,
  YVirtualList,
  YVirtualizedSelect,
  YWatermark
]

export const YokCore = createYokInstaller(coreComponents)

export default YokCore
