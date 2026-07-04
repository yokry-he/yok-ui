import { describe, expect, it } from 'vitest'
import { components } from './componentRegistry'
import {
  componentThemeEvidence,
  getComponentThemeEvidence,
  getComponentThemeEvidenceSummary
} from './componentThemeEvidence'

describe('componentThemeEvidence', () => {
  it('creates a theme evidence profile for every registered component', () => {
    const summary = getComponentThemeEvidenceSummary()

    expect(componentThemeEvidence).toHaveLength(components.length)
    expect(summary.total).toBe(components.length)
    expect(summary.coverageRate).toBe(100)
    expect(summary.nextQueue).toEqual([])
  })

  it('links core component source to semantic Yok UI tokens', () => {
    const button = getComponentThemeEvidence('YButton')

    expect(button?.sourcePath).toBe('packages/core/src/components/button/YButton.vue')
    expect(button?.tokenCount).toBeGreaterThan(12)
    expect(button?.categories).toEqual(expect.arrayContaining(['color', 'spacing', 'radius', 'motion']))
    expect(button?.tokens).toContain('--yok-color-primary')
  })

  it('tracks complex admin components with richer token categories', () => {
    const dataTable = getComponentThemeEvidence('YDataTable')

    expect(dataTable?.sourcePath).toBe('packages/admin/src/components/data-table/YDataTable.vue')
    expect(dataTable?.tokenCount).toBeGreaterThan(50)
    expect(dataTable?.categories).toEqual(expect.arrayContaining(['color', 'spacing', 'radius', 'shadow']))
    expect(dataTable?.hasSemanticColor).toBe(true)
  })

  it('keeps shared-folder component mappings explicit', () => {
    expect(getComponentThemeEvidence('YBadge')?.sourcePath).toBe('packages/core/src/components/tag/YBadge.vue')
    expect(getComponentThemeEvidence('YAvatarGroup')?.sourcePath).toBe(
      'packages/core/src/components/avatar/YAvatarGroup.vue'
    )
    expect(getComponentThemeEvidence('YRadioGroup')?.sourcePath).toBe('packages/core/src/components/radio/YRadioGroup.vue')
    expect(getComponentThemeEvidence('YDateRangePicker')?.sourcePath).toBe(
      'packages/core/src/components/date-picker/YDateRangePicker.vue'
    )
    expect(getComponentThemeEvidence('YFloatButtonGroup')?.sourcePath).toBe(
      'packages/core/src/components/float-button/YFloatButtonGroup.vue'
    )
    expect(getComponentThemeEvidence('YQRCode')?.sourcePath).toBe('packages/core/src/components/qr-code/YQRCode.vue')
  })

  it('counts provider components as theme evidence instead of static claims', () => {
    const themeProvider = getComponentThemeEvidence('YThemeProvider')
    const configProvider = getComponentThemeEvidence('YConfigProvider')

    expect(themeProvider?.categories).toContain('color')
    expect(configProvider?.categories).toContain('color')
    expect(themeProvider?.tokens).toContain('--yok-color-surface')
  })
})
