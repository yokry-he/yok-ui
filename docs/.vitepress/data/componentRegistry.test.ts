import { describe, expect, it } from 'vitest'
import {
  componentApis,
  componentFamilies,
  components,
  packageLabels
} from './componentRegistry'
import { liveExampleCoverage, liveExampleDocs } from './liveExamples'
import {
  blockSidebar,
  componentSidebar,
  componentSidebarGroups,
  guideSidebar,
  packageSidebar,
  playgroundSidebar,
  resourceSidebar,
  sectionSidebars,
  topNavItems
} from '../config'

describe('componentRegistry', () => {
  it('keeps component names unique and documented', () => {
    const names = components.map((component) => component.name)

    expect(new Set(names).size).toBe(names.length)
    expect(components).toHaveLength(109)

    components.forEach((component) => {
      expect(component.docs).toMatch(/^\/(components|guide)\//)
      expect(component.description.length).toBeGreaterThan(0)
    })
  })

  it('covers every published package and visible family', () => {
    Object.keys(packageLabels).forEach((packageName) => {
      expect(components.some((component) => component.packageName === packageName)).toBe(true)
    })

    componentFamilies.forEach((family) => {
      expect(components.some((component) => component.family === family.id)).toBe(true)
    })
  })

  it('builds grouped component navigation from the registry', () => {
    const documentedComponents = components.filter((component) => component.docs.startsWith('/components/'))
    const sidebarLinks = componentSidebarGroups.flatMap((group) => group.items.map((item) => item.link))

    expect(componentSidebarGroups.length).toBeGreaterThan(4)
    expect(sidebarLinks).toContain('/components/button')
    expect(sidebarLinks).toContain('/components/list')
    expect(sidebarLinks).toContain('/components/review-workflow')
    expect(new Set(sidebarLinks).size).toBe(sidebarLinks.length)
    documentedComponents.forEach((component) => {
      expect(sidebarLinks).toContain(component.docs)
    })
  })

  it('keeps top-level route sidebars scoped to the active section', () => {
    expect(sectionSidebars['/components/']).toBe(componentSidebar)
    expect(sectionSidebars['/guide/']).toBe(guideSidebar)
    expect(sectionSidebars['/packages/']).toBe(packageSidebar)
    expect(sectionSidebars['/resources/']).toBe(resourceSidebar)
    expect(sectionSidebars['/playground/']).toBe(playgroundSidebar)
    expect(sectionSidebars['/blocks/']).toBe(blockSidebar)

    const componentSidebarText = JSON.stringify(componentSidebar)
    const guideSidebarText = JSON.stringify(guideSidebar)
    const packageSidebarText = JSON.stringify(packageSidebar)
    const resourceSidebarText = JSON.stringify(resourceSidebar)
    const blockSidebarText = JSON.stringify(blockSidebar)

    expect(componentSidebarText).toContain('Overview 组件总览')
    expect(componentSidebarText).toContain('Button / Icon Button')
    expect(componentSidebarText).not.toContain('Installation')
    expect(componentSidebarText).not.toContain('Core')
    expect(componentSidebarText).not.toContain('Command Center')
    expect(guideSidebarText).toContain('/guide/')
    expect(guideSidebarText).toContain('/guide/floating-layer')
    expect(packageSidebarText).toContain('/packages/')
    expect(resourceSidebarText).toContain('/resources/api-reference')
    expect(resourceSidebarText).toContain('/resources/design-system')
    expect(resourceSidebarText).toContain('/resources/theme-lab')
    expect(resourceSidebarText).toContain('/resources/maturity')
    expect(resourceSidebarText).toContain('/resources/live-examples')
    expect(resourceSidebarText).toContain('/resources/release')
    expect(resourceSidebarText).toContain('/resources/changelog')
    expect(blockSidebarText).toContain('/blocks/')
  })

  it('exposes user-facing top-level sections for a mature docs site', () => {
    expect(topNavItems.map((item) => item.text)).toEqual([
      '指南',
      '组件',
      '资源',
      'Playground'
    ])
    expect(topNavItems.map((item) => item.link)).toEqual([
      '/guide/',
      '/components/',
      '/resources/',
      '/playground/'
    ])
  })

  it('tracks structured API data for migrated component pages', () => {
    const missingApis = components
      .filter((component) => !componentApis[component.name])
      .map((component) => component.name)

    expect(missingApis).toEqual([])

    components.forEach((component) => {
      const api = componentApis[component.name]
      const apiRows = [
        ...(api.props ?? []),
        ...(api.events ?? []),
        ...(api.slots ?? []),
        ...(api.types ?? [])
      ]

      expect(apiRows.length).toBeGreaterThan(0)
      ;[
        api.props ?? [],
        api.events ?? [],
        api.slots ?? [],
        api.types ?? []
      ].forEach((section) => {
        const names = section.map((row) => row.name)

        expect(new Set(names).size).toBe(names.length)
      })
    })
    expect(componentApis.YButton.props?.map((row) => row.name)).toContain('variant')
    expect(componentApis.YSchemaForm.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'modelValue',
      'schema',
      'scrollToError',
      'showSummary'
    ]))
    expect(componentApis.YSchemaForm.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'finish',
      'finishFailed',
      'reset'
    ]))
    expect(componentApis.YSchemaForm.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YSchemaFormArrayItemField'
    ]))
    expect(componentApis.YSchemaForm.types?.find((row) => row.name === 'YSchemaFormFieldType')?.type).toContain("'array'")
    expect(componentApis.YSchemaForm.types?.find((row) => row.name === 'YSchemaFormField')?.type).toContain('itemKey')
    expect(componentApis.YFieldArray.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'modelValue',
      'defaultItem',
      'itemKey',
      'min',
      'max'
    ]))
    expect(componentApis.YFieldArray.slots?.find((row) => row.name === 'default')?.type).toContain('itemKey')
    expect(componentApis.YFieldArray.types?.map((row) => row.name)).toContain('YFieldArrayItemKey')
    expect(componentApis.YThemeProvider.props?.map((row) => row.name)).toContain('theme')
    expect(componentApis.YConfigProvider.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'size',
      'density',
      'locale',
      'namespace'
    ]))
    expect(componentApis.YConfigProvider.types?.map((row) => row.name)).toContain('YokConfigContext')
    expect(componentApis.YSplitter.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'panels',
      'modelValue',
      'layout',
      'keyboardStep'
    ]))
    expect(componentApis.YSplitter.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'resize',
      'resizeEnd',
      'collapse'
    ]))
    expect(componentApis.YSplitter.types?.map((row) => row.name)).toContain('YSplitterPanel')
    expect(componentApis.YTreeSelect.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'nodes',
      'modelValue',
      'filterable',
      'checkStrictly'
    ]))
    expect(componentApis.YTreeSelect.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'change',
      'select',
      'visibleChange',
      'search'
    ]))
    expect(componentApis.YTreeSelect.types?.map((row) => row.name)).toContain('YTreeSelectNode')
    expect(componentApis.YIconButton.props?.map((row) => row.name)).toContain('label')
    expect(componentApis.YIcon.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'size',
      'color',
      'label',
      'spinning'
    ]))
    expect(componentApis.YIcon.slots?.map((row) => row.name)).toContain('default')
    expect(componentApis.YIcon.types?.map((row) => row.name)).toContain('YIconSize')
    expect(componentApis.YInput.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'modelValue',
      'type',
      'prefixText',
      'suffixText',
      'clearable',
      'showCount',
      'maxlength',
      'autocomplete',
      'ariaLabel',
      'invalid',
      'size'
    ]))
    expect(componentApis.YInput.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'update:modelValue',
      'change',
      'clear',
      'focus',
      'blur'
    ]))
    expect(componentApis.YInputOtp.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'modelValue',
      'length',
      'mask',
      'type',
      'ariaDescribedby',
      'size'
    ]))
    expect(componentApis.YInputOtp.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'update:modelValue',
      'input',
      'change',
      'complete'
    ]))
    expect(componentApis.YInputOtp.types?.map((row) => row.name)).toContain('YInputOtpMask')
    expect(componentApis.YInputTag.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'modelValue',
      'inputValue',
      'max',
      'allowDuplicate',
      'validateTag'
    ]))
    expect(componentApis.YInputTag.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'add',
      'remove',
      'invalid'
    ]))
    expect(componentApis.YInputTag.types?.map((row) => row.name)).toContain('YInputTagInvalidPayload')
    expect(componentApis.YAutocomplete.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'modelValue',
      'options',
      'clearable',
      'loading',
      'emptyText',
      'size'
    ]))
    expect(componentApis.YAutocomplete.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'update:modelValue',
      'search',
      'select',
      'visibleChange'
    ]))
    expect(componentApis.YAutocomplete.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YAutocompleteOption',
      'YAutocompleteSize'
    ]))
    expect(componentApis.YMention.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'modelValue',
      'options',
      'prefix',
      'rows',
      'clearable',
      'loading',
      'emptyText',
      'size'
    ]))
    expect(componentApis.YMention.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'update:modelValue',
      'search',
      'select',
      'visibleChange'
    ]))
    expect(componentApis.YMention.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YMentionOption',
      'YMentionSize'
    ]))
    expect(componentApis.YLink.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'href',
      'tone',
      'underline',
      'disabled'
    ]))
    expect(componentApis.YLink.events?.map((row) => row.name)).toContain('click')
    expect(components.find((component) => component.name === 'YLoading')?.docs).toBe('/components/loading')
    expect(componentApis.YLoading.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'loading',
      'overlay',
      'fullscreen',
      'text',
      'label',
      'tone',
      'size'
    ]))
    expect(componentApis.YLoading.slots?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'default',
      'indicator'
    ]))
    expect(componentApis.YLoading.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YLoadingTone',
      'YLoadingSize'
    ]))
    expect(componentApis.YText.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'tone',
      'tag',
      'truncated',
      'lineClamp'
    ]))
    expect(componentApis.YTextarea.props?.map((row) => row.name)).toEqual(expect.arrayContaining(['rows', 'size']))
    expect(componentApis.YTextarea.events?.map((row) => row.name)).toContain('update:modelValue')
    expect(componentApis.YFormItem.slots?.map((row) => row.name)).toContain('default')
    expect(componentApis.YFormSummary.types?.map((row) => row.name)).toContain('YFormSummaryItem')
    expect(componentApis.YRadioGroup.types?.map((row) => row.name)).toContain('YRadioOption')
    expect(componentApis.YAlert.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'closable',
      'variant',
      'size',
      'showIcon',
      'closeText',
      'banner'
    ]))
    expect(componentApis.YAlert.events?.map((row) => row.name)).toContain('close')
    expect(componentApis.YAlert.slots?.map((row) => row.name)).toEqual(expect.arrayContaining(['icon', 'action']))
    expect(componentApis.YAlert.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YAlertTone',
      'YAlertVariant',
      'YAlertSize'
    ]))
    expect(componentApis.YProgress.props?.map((row) => row.name)).toContain('striped')
    expect(componentApis.YProgress.props?.map((row) => row.name)).toContain('showValue')
    expect(componentApis.YAvatar.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'srcSet',
      'label',
      'fit',
      'name'
    ]))
    expect(componentApis.YAvatar.events?.map((row) => row.name)).toContain('error')
    expect(componentApis.YAvatar.slots?.map((row) => row.name)).toContain('default')
    expect(componentApis.YAvatar.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YAvatarFit',
      'YAvatarShape',
      'YAvatarSize',
      'YAvatarTone'
    ]))
    expect(components.map((component) => component.name)).toContain('YAvatarGroup')
    expect(componentApis.YAvatarGroup.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'max',
      'total',
      'spacing',
      'label',
      'surplusLabel'
    ]))
    expect(componentApis.YAvatarGroup.slots?.map((row) => row.name)).toContain('default')
    expect(componentApis.YAvatarGroup.types?.map((row) => row.name)).toContain('YAvatarGroupSpacing')
    expect(componentApis.YBadge.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'hidden',
      'size',
      'text',
      'offset'
    ]))
    expect(componentApis.YBadge.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YBadgeSize',
      'YBadgeOffset'
    ]))
    expect(componentApis.YCollapse.events?.map((row) => row.name)).toContain('change')
    expect(componentApis.YBreadcrumb.types?.map((row) => row.name)).toContain('YBreadcrumbItem')
    expect(componentApis.YMenu.events?.map((row) => row.name)).toEqual(expect.arrayContaining(['open', 'close', 'open-change']))
    expect(componentApis.YSteps.types?.map((row) => row.name)).toContain('YStepStatus')
    expect(componentApis.YTour.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'open',
      'steps',
      'current',
      'closeOnEscape'
    ]))
    expect(componentApis.YTour.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'update:open',
      'update:current',
      'finish',
      'close'
    ]))
    expect(componentApis.YTour.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YTourStep',
      'YTourPlacement',
      'YTourTarget'
    ]))
    expect(componentApis.YDropdown.events?.map((row) => row.name)).toContain('select')
    expect(componentApis.YDropdown.types?.map((row) => row.name)).toContain('YDropdownItem')
    expect(componentApis.YPopconfirm.events?.map((row) => row.name)).toContain('confirm')
    expect(componentApis.YPopover.slots?.map((row) => row.name)).toContain('trigger')
    expect(componentApis.YPopover.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'placement',
      'trigger',
      'disabled',
      'showDelay',
      'hideDelay',
      'closeOnEscape',
      'closeOnOutsidePointer'
    ]))
    expect(componentApis.YPopover.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YPopoverPlacement',
      'YPopoverTrigger'
    ]))
    expect(componentApis.YBacktop.props?.map((row) => row.name)).toContain('visibilityHeight')
    expect(componentApis.YWatermark.props?.map((row) => row.name)).toContain('content')
    expect(componentApis.YSelect.types?.map((row) => row.name)).toContain('YSelectOption')
    expect(componentApis.YSelect.types?.map((row) => row.name)).toContain('YSelectSize')
    expect(componentApis.YSelect.types?.map((row) => row.name)).toContain('YSelectValue')
    expect(componentApis.YSelect.types?.find((row) => row.name === 'YSelectOption')?.type).toContain('group?: string')
    expect(componentApis.YSelect.props?.map((row) => row.name)).toEqual(expect.arrayContaining(['id', 'invalid', 'ariaDescribedby', 'clearable', 'multiple', 'collapseTags', 'maxCollapseTags', 'filterable', 'allowCreate', 'virtualized', 'virtualHeight', 'virtualItemHeight', 'virtualOverscan', 'loading', 'loadingText', 'searchPlaceholder', 'emptyText', 'size']))
    expect(componentApis.YSelect.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'update:modelValue',
      'change',
      'clear',
      'remove',
      'visibleChange',
      'search'
    ]))
    expect(componentApis.YInputNumber.props?.map((row) => row.name)).toContain('size')
    expect(componentApis.YColorPicker.props?.map((row) => row.name)).toContain('size')
    expect(componentApis.YDatePicker.props?.map((row) => row.name)).toContain('size')
    expect(componentApis.YDateRangePicker.props?.map((row) => row.name)).toContain('size')
    expect(componentApis.YTimePicker.props?.map((row) => row.name)).toContain('size')
    expect(componentApis.YCascader.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'size',
      'lazy',
      'load'
    ]))
    expect(componentApis.YTable.props?.map((row) => row.name)).toEqual(expect.arrayContaining(['virtualized', 'virtualHeight', 'virtualRowHeight', 'virtualOverscan', 'resizable', 'minColumnWidth', 'columnWidths', 'defaultColumnWidths', 'expandable', 'expandedRowKeys', 'defaultExpandedRowKeys']))
    expect(componentApis.YTable.slots?.map((row) => row.name)).toContain('expand')
    expect(componentApis.YTable.events?.map((row) => row.name)).toContain('update:expandedRowKeys')
    expect(componentApis.YTable.events?.map((row) => row.name)).toContain('expandChange')
    expect(componentApis.YTable.events?.map((row) => row.name)).toContain('update:columnWidths')
    expect(componentApis.YTable.events?.map((row) => row.name)).toContain('columnResize')
    expect(componentApis.YTable.types?.map((row) => row.name)).toContain('YTableColumnResizePayload')
    expect(componentApis.YTable.types?.map((row) => row.name)).toContain('YTableExpandPayload')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toEqual(expect.arrayContaining(['viewPreference', 'defaultViewPreference', 'columnResetText', 'reorderableColumns', 'virtualized', 'virtualHeight', 'virtualRowHeight', 'virtualOverscan', 'resizable', 'minColumnWidth', 'columnWidths', 'defaultColumnWidths']))
    expect(componentApis.YCheckbox.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'description',
      'indeterminate'
    ]))
    expect(componentApis.YCheckbox.events?.map((row) => row.name)).toContain('update:modelValue')
    expect(componentApis.YCheckboxGroup.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'modelValue',
      'options',
      'invalid',
      'error',
      'ariaDescribedby',
      'min',
      'max'
    ]))
    expect(componentApis.YCheckboxGroup.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'update:modelValue',
      'change'
    ]))
    expect(componentApis.YCheckboxGroup.types?.map((row) => row.name)).toContain('YCheckboxGroupOption')
    expect(componentApis.YFormItem.slots?.[0]?.type).toContain('validate')
    expect(componentApis.YRadioGroup.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'description',
      'invalid',
      'error',
      'ariaDescribedby',
      'direction'
    ]))
    expect(componentApis.YRadioGroup.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'update:modelValue',
      'change'
    ]))
    expect(componentApis.YRadioGroup.types?.map((row) => row.name)).toContain('YRadioValue')
    expect(componentApis.YSwitch.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'modelValue',
      'description',
      'activeText',
      'inactiveText',
      'loading',
      'invalid',
      'error',
      'ariaDescribedby'
    ]))
    expect(componentApis.YSwitch.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'update:modelValue',
      'change'
    ]))
    expect(componentApis.YModal.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'open',
      'title',
      'description',
      'closeOnOverlay',
      'closeOnEscape'
    ]))
    expect(componentApis.YModal.events?.map((row) => row.name)).toContain('close')
    expect(componentApis.YModal.slots?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'default',
      'footer'
    ]))
    expect(componentApis.YDrawer.props?.map((row) => row.name)).toContain('placement')
    expect(componentApis.YTabs.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'activationMode',
      'orientation',
      'variant',
      'ariaLabel'
    ]))
    expect(componentApis.YTabs.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'change',
      'tabClick',
      'close'
    ]))
    expect(componentApis.YTabs.types?.map((row) => row.name)).toContain('YTabItem')
    expect(componentApis.YTabs.types?.map((row) => row.name)).toContain('YTabsActivationMode')
    expect(componentApis.YPagination.events?.map((row) => row.name)).toContain('change')
    expect(componentApis.YPagination.props?.map((row) => row.name)).toContain('hideOnSinglePage')
    expect(componentApis.YPagination.props?.map((row) => row.name)).toContain('ariaLabel')
    expect(componentApis.YTooltip.props?.map((row) => row.name)).toContain('content')
    expect(componentApis.YMessage.types?.map((row) => row.name)).toContain('YMessageOptions')
    expect(componentApis.YCard.slots?.map((row) => row.name)).toContain('extra')
    expect(componentApis.YDivider.props?.map((row) => row.name)).toContain('align')
    expect(componentApis.YSpace.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'direction',
      'size',
      'wrap',
      'fill'
    ]))
    expect(componentApis.YSpace.slots?.map((row) => row.name)).toContain('separator')
    expect(componentApis.YScrollbar.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'height',
      'maxHeight',
      'horizontal',
      'native'
    ]))
    expect(componentApis.YScrollbar.events?.map((row) => row.name)).toContain('scroll')
    expect(componentApis.YSkeleton.props?.map((row) => row.name)).toContain('animated')
    expect(componentApis.YImage.props?.map((row) => row.name)).toEqual(expect.arrayContaining(['src', 'alt', 'fit', 'lazy', 'preview', 'previewOpen', 'previewSrcList']))
    expect(componentApis.YImage.events?.map((row) => row.name)).toEqual(expect.arrayContaining(['load', 'error', 'preview-open', 'preview-close', 'update:previewOpen']))
    expect(componentApis.YImage.slots?.map((row) => row.name)).toEqual(expect.arrayContaining(['placeholder', 'error', 'preview-footer']))
    expect(componentApis.YImage.types?.map((row) => row.name)).toContain('YImageFit')
    expect(componentApis.YTag.props?.map((row) => row.name)).toContain('tone')
    expect(componentApis.YBadge.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'value',
      'max',
      'dot',
      'showZero',
      'label',
      'tone',
      'placement'
    ]))
    expect(componentApis.YBadge.slots?.map((row) => row.name)).toContain('default')
    expect(componentApis.YBadge.types?.map((row) => row.name)).toEqual(expect.arrayContaining(['YBadgeTone', 'YBadgePlacement']))
    expect(componentApis.YEmpty.slots?.map((row) => row.name)).toContain('action')
    expect(componentApis.YUpload.types?.map((row) => row.name)).toContain('YUploadFile')
    expect(componentApis.YUpload.types?.map((row) => row.name)).toContain('YUploadRejectedFile')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('rejectedFiles')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('invalid')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('error')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('maxSize')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('autoUpload')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('beforeUpload')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('customRequest')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('listType')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('previewable')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('downloadable')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('sortable')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('clearable')
    expect(componentApis.YUpload.props?.map((row) => row.name)).toContain('drag')
    expect(componentApis.YUpload.events?.map((row) => row.name)).toContain('drop')
    expect(componentApis.YUpload.events?.map((row) => row.name)).toContain('exceed')
    expect(componentApis.YUpload.events?.map((row) => row.name)).toContain('reject')
    expect(componentApis.YUpload.events?.map((row) => row.name)).toContain('progress')
    expect(componentApis.YUpload.events?.map((row) => row.name)).toContain('success')
    expect(componentApis.YUpload.events?.map((row) => row.name)).toContain('abort')
    expect(componentApis.YUpload.events?.map((row) => row.name)).toContain('preview')
    expect(componentApis.YUpload.events?.map((row) => row.name)).toContain('download')
    expect(componentApis.YUpload.events?.map((row) => row.name)).toContain('reorder')
    expect(componentApis.YUpload.events?.map((row) => row.name)).toContain('clear')
    expect(componentApis.YUpload.methods?.map((row) => row.name)).toContain('submit')
    expect(componentApis.YUpload.methods?.map((row) => row.name)).toContain('clearFiles')
    expect(componentApis.YUpload.types?.map((row) => row.name)).toContain('YUploadRejectReason')
    expect(componentApis.YUpload.types?.map((row) => row.name)).toContain('YUploadRequestHandler')
    expect(componentApis.YUpload.types?.map((row) => row.name)).toContain('YUploadRequestOptions')
    expect(componentApis.YUpload.types?.find((row) => row.name === 'YUploadRejectReason')?.type).toContain('exceed')
    expect(componentApis.YUpload.types?.find((row) => row.name === 'YUploadRejectReason')?.type).toContain('before-upload')
    expect(componentApis.YUpload.types?.find((row) => row.name === 'YUploadFile')?.type).toContain('thumbUrl')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('pagination')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('showColumnSettings')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('remote')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('loadingText')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('errorText')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('maxHeight')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('bulkActions')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('stickyBulkActions')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('density')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('showDensitySettings')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('showFilterSummary')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('filters')
    expect(componentApis.YDataTable.props?.map((row) => row.name)).toContain('defaultFilters')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('pageChange')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('columnChange')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('refresh')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('requestChange')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('bulkAction')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('bulkClear')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('densityChange')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('update:viewPreference')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('viewPreferenceChange')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('filterChange')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('update:columnWidths')
    expect(componentApis.YDataTable.events?.map((row) => row.name)).toContain('columnResize')
    expect(componentApis.YDataTable.slots?.map((row) => row.name)).toContain('bulkSummary')
    expect(componentApis.YDataTable.slots?.map((row) => row.name)).toContain('bulkActions')
    expect(componentApis.YDataTable.slots?.map((row) => row.name)).toContain('empty')
    expect(componentApis.YDataTable.types?.map((row) => row.name)).toContain('YDataTableColumnPayload')
    expect(componentApis.YDataTable.types?.map((row) => row.name)).toContain('YDataTableRequestPayload')
    expect(componentApis.YDataTable.types?.map((row) => row.name)).toContain('YDataTableBulkActionPayload')
    expect(componentApis.YDataTable.types?.map((row) => row.name)).toContain('YDataTableColumnResizePayload')
    expect(componentApis.YDataTable.types?.map((row) => row.name)).toContain('YDataTableDensity')
    expect(componentApis.YDataTable.types?.map((row) => row.name)).toContain('YDataTableViewPreference')
    expect(componentApis.YDataTable.types?.map((row) => row.name)).toContain('YDataTableViewPreferencePayload')
    expect(componentApis.YDataTable.types?.find((row) => row.name === 'YDataTableRequestReason')?.type).toContain('columnResize')
    expect(componentApis.YDataTable.types?.find((row) => row.name === 'YDataTableRequestPayload')?.type).toContain('columnWidths')
    expect(components.find((component) => component.name === 'YDataView')?.docs).toBe('/components/data-view')
    expect(componentApis.YDataView.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'views',
      'columns',
      'data',
      'defaultView',
      'viewPreference',
      'savedViewsTitle',
      'tableTitle'
    ]))
    expect(componentApis.YDataView.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'change',
      'save',
      'viewPreferenceChange',
      'requestChange'
    ]))
    expect(componentApis.YDataView.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YDataViewItem',
      'YDataViewPreferencePayload',
      'YDataViewSavePayload'
    ]))
    expect(components.find((component) => component.name === 'YResourcePage')?.docs).toBe('/components/resource-page')
    expect(componentApis.YResourcePage.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'title',
      'searchModel',
      'searchFields',
      'views',
      'columns',
      'data',
      'detailOpen'
    ]))
    expect(componentApis.YResourcePage.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'search',
      'update:searchModel',
      'viewChange',
      'saveView',
      'closeDetail'
    ]))
    expect(componentApis.YResourcePage.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YResourcePageDensity',
      'YResourcePageSearchPayload',
      'YResourcePageDetailPlacement'
    ]))
    expect(componentApis.YBulkActionBar.props?.map((row) => row.name)).toContain('selectedRowKeys')
    expect(componentApis.YBulkActionBar.events?.map((row) => row.name)).toContain('action')
    expect(componentApis.YBulkActionBar.slots?.map((row) => row.name)).toContain('actions')
    expect(componentApis.YBulkActionBar.types?.map((row) => row.name)).toContain('YBulkActionPayload')
    expect(componentApis.YBulkActionMenu.props?.map((row) => row.name)).toContain('selectedRowKeys')
    expect(componentApis.YBulkActionMenu.events?.map((row) => row.name)).toContain('update:open')
    expect(componentApis.YBulkActionMenu.events?.map((row) => row.name)).toContain('action')
    expect(componentApis.YBulkActionMenu.types?.map((row) => row.name)).toContain('YBulkActionMenuPayload')
    expect(componentApis.YApprovalCommentBox.props?.map((row) => row.name)).toContain('decision')
    expect(componentApis.YApprovalCommentBox.events?.map((row) => row.name)).toContain('submit')
    expect(componentApis.YApprovalCommentBox.events?.map((row) => row.name)).toContain('invalid')
    expect(componentApis.YApprovalCommentBox.types?.map((row) => row.name)).toContain('YApprovalCommentSubmitPayload')
    expect(componentApis.YSearchForm.props?.map((row) => row.name)).toContain('collapsedCount')
    expect(componentApis.YSearchForm.events?.map((row) => row.name)).toContain('search')
    expect(componentApis.YSearchForm.slots?.map((row) => row.name)).toContain('field-{key}')
    expect(componentApis.YSearchForm.types?.map((row) => row.name)).toContain('YSearchFormSubmitPayload')
    expect(componentApis.YSearchForm.types?.find((row) => row.name === 'YSearchFormFieldType')?.type).toContain('dateRange')
    expect(componentApis.YSearchForm.types?.find((row) => row.name === 'YSearchFormField')?.type).toContain('YSearchFormOptionsSource')
    expect(componentApis.YSearchForm.types?.map((row) => row.name)).toContain('YSearchFormValue')
    expect(componentApis.YCrudLayout.props?.map((row) => row.name)).toContain('stickyHeader')
    expect(componentApis.YCrudLayout.slots?.map((row) => row.name)).toContain('search')
    expect(componentApis.YCrudLayout.slots?.map((row) => row.name)).toContain('table')
    expect(componentApis.YCrudLayout.types?.map((row) => row.name)).toContain('YCrudLayoutDensity')
    expect(componentApis.YFilterTabs.props?.map((row) => row.name)).toContain('items')
    expect(componentApis.YFilterTabs.events?.map((row) => row.name)).toContain('change')
    expect(componentApis.YFilterTabs.types?.map((row) => row.name)).toContain('YFilterTabItem')
    expect(componentApis.YStatusTimeline.props?.map((row) => row.name)).toContain('activeValue')
    expect(componentApis.YStatusTimeline.slots?.map((row) => row.name)).toContain('actions')
    expect(componentApis.YStatusTimeline.types?.map((row) => row.name)).toContain('YStatusTimelineItem')
    expect(componentApis.YReviewWorkflow.props?.map((row) => row.name)).toContain('reviewer')
    expect(componentApis.YReviewWorkflow.events?.map((row) => row.name)).toContain('approve')
    expect(componentApis.YReviewWorkflow.slots?.map((row) => row.name)).toContain('stepActions')
    expect(componentApis.YReviewWorkflow.types?.map((row) => row.name)).toContain('YReviewWorkflowPayload')
    expect(componentApis.YSavedViews.props?.map((row) => row.name)).toContain('items')
    expect(componentApis.YSavedViews.events?.map((row) => row.name)).toContain('save')
    expect(componentApis.YSavedViews.types?.map((row) => row.name)).toContain('YSavedViewItem')
    expect(components.find((component) => component.name === 'YSavedViewManager')?.docs).toBe('/components/saved-views')
    expect(componentApis.YSavedViewManager.props?.map((row) => row.name)).toContain('defaultValue')
    expect(componentApis.YSavedViewManager.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'duplicate',
      'delete',
      'setDefault',
      'update:items'
    ]))
    expect(componentApis.YSavedViewManager.types?.map((row) => row.name)).toContain('YSavedViewManagerSavePayload')
    expect(componentApis.YCommandPalette.events?.map((row) => row.name)).toContain('select')
    expect(componentApis.YCommandPalette.types?.map((row) => row.name)).toContain('YokCommand')
    expect(componentApis.YCopyButton.events?.map((row) => row.name)).toContain('copied')
    expect(componentApis.YCodeBlock.props?.map((row) => row.name)).toContain('language')
    expect(componentApis.YThemeSwitcher.events?.map((row) => row.name)).toContain('update:modelValue')
    expect(componentApis.YPageHeader.slots?.map((row) => row.name)).toContain('actions')
    expect(componentApis.YMetricCard.props?.map((row) => row.name)).toContain('trend')
    expect(componentApis.YSearchPanel.types?.map((row) => row.name)).toContain('YSearchField')
    expect(componentApis.YDataToolbar.slots?.map((row) => row.name)).toContain('default')
    expect(componentApis.YBrandHero.events?.map((row) => row.name)).toContain('primary')
    expect(componentApis.YFeatureGrid.types?.map((row) => row.name)).toContain('YFeatureItem')
    expect(componentApis.YProfileCard.props?.map((row) => row.name)).toContain('tags')
    expect(componentApis.YLogoCloud.props?.map((row) => row.name)).toContain('logos')
    expect(componentApis.YForm.props?.map((row) => row.name)).toContain('rules')
    expect(componentApis.YForm.props?.map((row) => row.name)).toContain('scrollToError')
    expect(componentApis.YForm.events?.map((row) => row.name)).toContain('submit')
    expect(componentApis.YForm.types?.map((row) => row.name)).toContain('YFormRule')
    expect(componentApis.YForm.types?.map((row) => row.name)).toContain('YFormScrollIntoViewOptions')
    expect(componentApis.YTable.props?.map((row) => row.name)).toContain('columns')
    expect(componentApis.YTable.props?.map((row) => row.name)).toContain('loading')
    expect(componentApis.YTable.props?.map((row) => row.name)).toContain('summary')
    expect(componentApis.YTable.props?.map((row) => row.name)).toContain('maxHeight')
    expect(componentApis.YTable.props?.map((row) => row.name)).toContain('selectable')
    expect(componentApis.YTable.props?.map((row) => row.name)).toContain('filters')
    expect(componentApis.YTable.props?.map((row) => row.name)).toContain('filterMode')
    expect(componentApis.YTable.slots?.map((row) => row.name)).toContain('empty')
    expect(componentApis.YTable.events?.map((row) => row.name)).toContain('sortChange')
    expect(componentApis.YTable.events?.map((row) => row.name)).toContain('selectionChange')
    expect(componentApis.YTable.events?.map((row) => row.name)).toContain('filterChange')
    expect(componentApis.YTable.methods?.map((row) => row.name)).toEqual(expect.arrayContaining(['clearSort', 'clearFilter']))
    expect(componentApis.YTable.types?.map((row) => row.name)).toContain('YTableColumn')
    expect(componentApis.YTable.types?.map((row) => row.name)).toContain('YTableColumnFixed')
    expect(componentApis.YTable.types?.map((row) => row.name)).toContain('YTableFilterState')
    expect(componentApis.YTable.types?.map((row) => row.name)).toContain('YTableFilterPayload')
    expect(componentApis.YTable.types?.map((row) => row.name)).toContain('YTableSortPayload')
    expect(componentApis.YList.props?.map((row) => row.name)).toContain('columns')
    expect(componentApis.YList.slots?.map((row) => row.name)).toContain('actions')
    expect(componentApis.YList.types?.map((row) => row.name)).toContain('YListItem')
    expect(componentApis.YDescriptions.props?.map((row) => row.name)).toContain('bordered')
    expect(componentApis.YDescriptions.slots?.map((row) => row.name)).toContain('item-{key}')
    expect(componentApis.YDescriptions.types?.map((row) => row.name)).toContain('YDescriptionItem')
    expect(componentApis.YStatistic.props?.map((row) => row.name)).toContain('precision')
    expect(componentApis.YStatistic.slots?.map((row) => row.name)).toContain('value')
    expect(componentApis.YStatistic.types?.map((row) => row.name)).toContain('YStatisticFormatter')
    expect(componentApis.YCountdown.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'value',
      'format',
      'running'
    ]))
    expect(componentApis.YCountdown.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'change',
      'finish'
    ]))
    expect(componentApis.YCountdown.slots?.map((row) => row.name)).toContain('value')
    expect(componentApis.YCountdown.types?.map((row) => row.name)).toContain('YCountdownValue')
    expect(componentApis.YResult.props?.map((row) => row.name)).toContain('status')
    expect(componentApis.YResult.slots?.map((row) => row.name)).toContain('extra')
    expect(componentApis.YResult.types?.map((row) => row.name)).toContain('YResultStatus')
    expect(componentApis.YTimeline.props?.map((row) => row.name)).toContain('placement')
    expect(componentApis.YTimeline.slots?.map((row) => row.name)).toContain('dot')
    expect(componentApis.YTimeline.types?.map((row) => row.name)).toContain('YTimelineItem')
    expect(componentApis.YVirtualList.events?.map((row) => row.name)).toContain('rangeChange')
    expect(componentApis.YInputNumber.props?.map((row) => row.name)).toContain('precision')
    expect(componentApis.YSlider.props?.map((row) => row.name)).toContain('range')
    expect(componentApis.YSlider.props?.map((row) => row.name)).toContain('vertical')
    expect(componentApis.YSlider.props?.map((row) => row.name)).toContain('height')
    expect(componentApis.YSlider.props?.map((row) => row.name)).toContain('showTooltip')
    expect(componentApis.YSlider.props?.map((row) => row.name)).toContain('tooltipPlacement')
    expect(componentApis.YSlider.props?.find((row) => row.name === 'modelValue')?.type).toBe('YSliderValue')
    expect(componentApis.YSlider.events?.find((row) => row.name === 'change')?.type).toBe('YSliderValue')
    expect(componentApis.YSlider.types?.map((row) => row.name)).toContain('YSliderMark')
    expect(componentApis.YSlider.types?.map((row) => row.name)).toContain('YSliderValue')
    expect(componentApis.YSlider.types?.map((row) => row.name)).toContain('YSliderTooltipPlacement')
    expect(componentApis.YCarousel.props?.map((row) => row.name)).toContain('pauseOnHover')
    expect(componentApis.YTooltip.props?.map((row) => row.name)).toEqual(expect.arrayContaining(['open', 'trigger', 'disabled', 'theme', 'hideDelay']))
    expect(componentApis.YTooltip.events?.map((row) => row.name)).toContain('update:open')
    expect(componentApis.YTooltip.types?.map((row) => row.name)).toEqual(expect.arrayContaining(['YTooltipPlacement', 'YTooltipTrigger', 'YTooltipTheme']))
    expect(componentApis.YRate.events?.map((row) => row.name)).toContain('change')
    expect(componentApis.YRate.props?.map((row) => row.name)).toContain('texts')
    expect(componentApis.YRate.props?.map((row) => row.name)).toContain('size')
    expect(componentApis.YRate.types?.map((row) => row.name)).toContain('YRateSize')
    expect(componentApis.YColorPicker.props?.map((row) => row.name)).toContain('showAlpha')
    expect(componentApis.YColorPicker.props?.map((row) => row.name)).toContain('showText')
    expect(componentApis.YColorPicker.props?.map((row) => row.name)).toContain('size')
    expect(componentApis.YColorPicker.types?.map((row) => row.name)).toContain('YColorPickerSize')
    expect(componentApis.YColorPicker.events?.map((row) => row.name)).toContain('clear')
    expect(componentApis.YDatePicker.props?.map((row) => row.name)).toContain('shortcuts')
    expect(componentApis.YDatePicker.types?.map((row) => row.name)).toContain('YDateShortcut')
    expect(componentApis.YDatePicker.types?.find((row) => row.name === 'YDateShortcut')?.type).toContain('time?: string')
    expect(componentApis.YDateRangePicker.types?.map((row) => row.name)).toContain('YDateRangeValue')
    expect(componentApis.YDateRangePicker.types?.map((row) => row.name)).toContain('YDateRangeShortcut')
    expect(componentApis.YDateRangePicker.types?.find((row) => row.name === 'YDateRangeShortcut')?.type).toContain('description?: string')
    expect(componentApis.YTree.events?.map((row) => row.name)).toContain('toggle')
    expect(componentApis.YTimePicker.props?.map((row) => row.name)).toContain('minuteStep')
    expect(componentApis.YCascader.types?.map((row) => row.name)).toContain('YCascaderOption')
    expect(componentApis.YCascader.props?.map((row) => row.name)).toContain('multiple')
    expect(componentApis.YCascader.events?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'load',
      'loadError'
    ]))
    expect(componentApis.YCascader.types?.map((row) => row.name)).toContain('YCascaderMultipleSelectPayload')
    expect(componentApis.YCascader.types?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'YCascaderLoadChildren',
      'YCascaderLoadPayload',
      'YCascaderLoadErrorPayload'
    ]))
    expect(componentApis.YTransfer.events?.map((row) => row.name)).toContain('change')
    expect(componentApis.YTree.props?.map((row) => row.name)).toContain('draggable')
    expect(componentApis.YTree.props?.map((row) => row.name)).toContain('checkable')
    expect(componentApis.YTree.props?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'lazy',
      'load',
      'virtualized',
      'virtualHeight',
      'virtualItemHeight',
      'virtualOverscan'
    ]))
    expect(componentApis.YTree.events?.map((row) => row.name)).toContain('check')
    expect(componentApis.YTree.events?.map((row) => row.name)).toContain('drop')
    expect(componentApis.YTree.events?.map((row) => row.name)).toContain('load')
    expect(componentApis.YTree.events?.map((row) => row.name)).toContain('loadError')
    expect(componentApis.YTree.methods?.map((row) => row.name)).toEqual(expect.arrayContaining([
      'getNodeByKey',
      'reloadNode'
    ]))
    expect(componentApis.YTree.types?.map((row) => row.name)).toContain('YTreeCheckPayload')
    expect(componentApis.YTree.types?.map((row) => row.name)).toContain('YTreeDropPayload')
    expect(componentApis.YTree.types?.map((row) => row.name)).toContain('YTreeLoadChildren')
    expect(componentApis.YTree.types?.map((row) => row.name)).toContain('YTreeLoadPayload')
    expect(componentApis.YTree.types?.map((row) => row.name)).toContain('YTreeLoadErrorPayload')
    expect(componentApis.YTree.types?.map((row) => row.name)).toContain('YTreeExpose')
  })

  it('keeps live example coverage aligned with component docs', () => {
    const documentedRoutes = new Set(components.map((component) => component.docs))

    expect(liveExampleCoverage.length).toBe(liveExampleDocs.size)
    expect(liveExampleDocs).toContain('/components/button')
    expect(liveExampleDocs).toContain('/components/cascader')
    expect(liveExampleDocs).toContain('/components/date-picker')
    expect(liveExampleDocs).toContain('/components/date-range-picker')
    expect(liveExampleDocs).toContain('/components/input-number')
    expect(liveExampleDocs).toContain('/components/rate')
    expect(liveExampleDocs).toContain('/components/slider')
    expect(liveExampleDocs).toContain('/components/time-picker')
    expect(liveExampleDocs).toContain('/components/tooltip')
    expect(liveExampleDocs).toContain('/components/transfer')
    expect(liveExampleDocs).toContain('/components/tree')
    expect(liveExampleDocs).toContain('/components/upload')

    liveExampleCoverage.forEach((item) => {
      expect(documentedRoutes).toContain(item.docs)
      expect(item.preset.length).toBeGreaterThan(0)
    })
  })
})
