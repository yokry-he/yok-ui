import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { components } from './componentRegistry'
import {
  getInteractionContract,
  hasInteractionContract,
  interactionContracts
} from './interactionContracts'

const workspaceRoot = resolve(__dirname, '../../..')

describe('interactionContracts', () => {
  it('keeps contracts unique and aligned with registered components', () => {
    const componentNames = new Set(components.map((component) => component.name))
    const contractNames = interactionContracts.map((contract) => contract.componentName)

    expect(new Set(contractNames).size).toBe(contractNames.length)

    interactionContracts.forEach((contract) => {
      expect(componentNames.has(contract.componentName), `Missing component ${contract.componentName}`).toBe(true)
      expect(contract.pattern.length).toBeGreaterThan(0)
      expect(contract.keyboard.length).toBeGreaterThan(0)
      expect(contract.focus.length).toBeGreaterThan(0)
      expect(contract.semantics.length).toBeGreaterThan(0)
    })
  })

  it('covers high-risk keyboard and focus components first', () => {
    const expectedContracts = [
      'YAffix',
      'YAnchor',
      'YAutocomplete',
      'YAvatar',
      'YBacktop',
      'YBadge',
      'YBreadcrumb',
      'YBulkActionBar',
      'YCascader',
      'YCommandPalette',
      'YCheckbox',
      'YCollapse',
      'YCard',
      'YCodeBlock',
      'YCopyButton',
      'YCrudLayout',
      'YDataTable',
      'YDataToolbar',
      'YDataView',
      'YDatePicker',
      'YDateRangePicker',
      'YDescriptions',
      'YDrawer',
      'YDropdown',
      'YAlert',
      'YFieldArray',
      'YButton',
      'YCalendar',
      'YCarousel',
      'YEmpty',
      'YForm',
      'YFormItem',
      'YIconButton',
      'YInput',
      'YInputNumber',
      'YLayout',
      'YList',
      'YLoading',
      'YMenu',
      'YMention',
      'YMessage',
      'YMetricCard',
      'YModal',
      'YPagination',
      'YPageHeader',
      'YPopover',
      'YPopconfirm',
      'YProgress',
      'YRadioGroup',
      'YResourcePage',
      'YResult',
      'YReviewWorkflow',
      'YSavedViews',
      'YSchemaForm',
      'YSearchPanel',
      'YSelect',
      'YSlider',
      'YSplitter',
      'YSkeleton',
      'YStatistic',
      'YSteps',
      'YStatusTimeline',
      'YSwitch',
      'YTable',
      'YTag',
      'YTextarea',
      'YTooltip',
      'YTimeline',
      'YTour',
      'YTransfer',
      'YTree',
      'YTreeSelect',
      'YVirtualList',
      'YWatermark'
    ]

    expectedContracts.forEach((componentName) => {
      expect(hasInteractionContract(componentName), `Missing interaction contract for ${componentName}`).toBe(true)
      expect(getInteractionContract(componentName)?.maturity).toBe('verified')
    })
  })

  it('points every interaction contract to existing docs and test evidence', () => {
    interactionContracts.forEach((contract) => {
      const evidencePaths = [
        ...contract.evidence.docs,
        ...contract.evidence.tests
      ]

      expect(evidencePaths.length, `${contract.componentName} needs evidence paths`).toBeGreaterThan(1)

      evidencePaths.forEach((path) => {
        expect(existsSync(resolve(workspaceRoot, path)), `${contract.componentName} missing evidence ${path}`).toBe(true)
      })
    })
  })
})
