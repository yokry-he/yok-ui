import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ComponentAccessibilityEvidence from './ComponentAccessibilityEvidence.vue'

describe('ComponentAccessibilityEvidence', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    })
  })

  it('renders structured accessibility evidence for a complex component', async () => {
    const wrapper = mount(ComponentAccessibilityEvidence, {
      props: {
        name: 'YSelect'
      }
    })

    expect(wrapper.get('.component-a11y-evidence').attributes('data-risk')).toBe('complex')
    expect(wrapper.get('.component-a11y-evidence__title').text()).toContain('Select')
    expect(wrapper.text()).toContain('Combobox with listbox popup')
    expect(wrapper.text()).toContain('Keyboard')
    expect(wrapper.text()).toContain('Focus')
    expect(wrapper.text()).toContain('ARIA')
    expect(wrapper.text()).toContain('ArrowDown / ArrowUp moves enabled options')
    expect(wrapper.text()).toContain('Opening focuses the selected or first enabled option')
    expect(wrapper.find('a[href="/guide/accessibility"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/components/select"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('packages/core/src/components/select/select.test.ts')

    await wrapper.get('.component-a11y-evidence__copy').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('# YSelect accessibility evidence'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('- Risk: complex'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('- Keyboard: ArrowDown / ArrowUp moves enabled options'))
    expect(wrapper.get('.component-a11y-evidence__copy').text()).toContain('已复制')
  })

  it('renders native evidence without requiring a complex interaction contract', () => {
    const wrapper = mount(ComponentAccessibilityEvidence, {
      props: {
        name: 'YDivider'
      }
    })

    expect(wrapper.get('.component-a11y-evidence').attributes('data-risk')).toBe('native')
    expect(wrapper.text()).toContain('Divider')
    expect(wrapper.text()).toContain('Native')
    expect(wrapper.text()).toContain('主要依赖原生语义')
    expect(wrapper.find('.component-a11y-evidence__contract').exists()).toBe(false)
  })

  it('falls back to legacy selection when clipboard writes are blocked', async () => {
    let copiedLegacyValue = ''
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('blocked'))
      }
    })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn(() => {
        copiedLegacyValue = (document.activeElement as HTMLTextAreaElement | null)?.value ?? ''
        return true
      })
    })

    const wrapper = mount(ComponentAccessibilityEvidence, {
      props: {
        name: 'YSelect'
      }
    })

    await wrapper.get('.component-a11y-evidence__copy').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(copiedLegacyValue).toContain('# YSelect accessibility evidence')
    expect(wrapper.get('.component-a11y-evidence__copy').text()).toContain('已复制')
  })

  it('shows a missing state for unknown component names', () => {
    const wrapper = mount(ComponentAccessibilityEvidence, {
      props: {
        name: 'YUnknown'
      }
    })

    expect(wrapper.get('.component-a11y-evidence__missing').text()).toContain('YUnknown 可访问性证据未登记')
  })
})
