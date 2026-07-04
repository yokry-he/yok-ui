import type { Component } from 'vue'
import { createYokInstaller } from '@yok-ui/core'
import { YApprovalCommentBox } from './components/approval-comment-box'
import { YBulkActionBar } from './components/bulk-action-bar'
import { YBulkActionMenu } from './components/bulk-action-menu'
import { YCrudLayout } from './components/crud-layout'
import { YDataTable } from './components/data-table'
import { YDataView } from './components/data-view'
import { YDataToolbar } from './components/data-toolbar'
import { YFilterTabs } from './components/filter-tabs'
import { YFieldArray } from './components/field-array'
import { YMetricCard } from './components/metric-card'
import { YPageHeader } from './components/page-header'
import { YReviewWorkflow } from './components/review-workflow'
import { YResourcePage } from './components/resource-page'
import { YSchemaForm } from './components/schema-form'
import { YSavedViewManager, YSavedViews } from './components/saved-views'
import { YSearchForm } from './components/search-form'
import { YSearchPanel } from './components/search-panel'
import { YStatusTimeline } from './components/status-timeline'

export const adminComponents: Component[] = [
  YApprovalCommentBox,
  YBulkActionBar,
  YBulkActionMenu,
  YCrudLayout,
  YDataTable,
  YDataView,
  YDataToolbar,
  YFieldArray,
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
]

export const YokAdmin = createYokInstaller(adminComponents)

export default YokAdmin
