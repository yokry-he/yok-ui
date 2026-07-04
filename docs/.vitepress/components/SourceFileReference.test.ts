import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SourceFileReference from './SourceFileReference.vue'

describe('SourceFileReference', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/source/?file=packages/core/src/components/button/YButton.vue')
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    })
  })

  it('renders a component source file from the source route query', () => {
    const wrapper = mount(SourceFileReference)

    expect(wrapper.get('.source-file-reference__path').text()).toBe('packages/core/src/components/button/YButton.vue')
    expect(wrapper.get('.source-file-reference__code').attributes('data-language')).toBe('vue')
    expect(wrapper.get('.source-file-reference__code').text()).toContain('<script setup lang="ts">')
    expect(wrapper.get('.source-file-reference__code').text()).toContain('defineProps')
    expect(wrapper.findAll('.source-file-reference__line-number').map((line) => line.text()).slice(0, 3)).toEqual([
      '1',
      '2',
      '3'
    ])
  })

  it('links back to the owning component docs and copies the source file', async () => {
    const wrapper = mount(SourceFileReference)

    expect(wrapper.get('.source-file-reference__docs-link').attributes('href')).toBe('/components/button')
    expect(wrapper.get('.source-file-reference__docs-link').text()).toContain('返回 Button 文档')
    expect(wrapper.get('.source-file-reference__copy').attributes('aria-label')).toBe('复制当前源码')
    await nextTick()
    expect(wrapper.get('.source-file-reference__copy').attributes('data-hydrated')).toBe('true')

    await wrapper.get('.source-file-reference__copy').trigger('click')
    await nextTick()

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('defineProps'))
    expect(wrapper.get('.source-file-reference__copy').text()).toContain('已复制')
  })

  it('falls back to a temporary textarea when the browser Clipboard API rejects writes', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('blocked'))
      }
    })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(true)
    })

    const wrapper = mount(SourceFileReference)
    await nextTick()

    await wrapper.get('.source-file-reference__copy').trigger('click')
    await nextTick()

    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea[aria-hidden="true"]')).toBeNull()
    expect(wrapper.get('.source-file-reference__copy').text()).toContain('已复制')
  })

  it('falls back when the browser Clipboard API does not settle', async () => {
    vi.useFakeTimers()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn(() => new Promise(() => {}))
      }
    })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(true)
    })

    const wrapper = mount(SourceFileReference)
    await nextTick()

    const copyPromise = wrapper.get('.source-file-reference__copy').trigger('click')
    await vi.advanceTimersByTimeAsync(251)
    await copyPromise

    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(wrapper.get('.source-file-reference__copy').text()).toContain('已复制')
    vi.useRealTimers()
  })

  it('shows a clear empty state when the file is not in the source manifest', () => {
    window.history.pushState({}, '', '/source/?file=packages/core/src/components/missing/YMissing.vue')

    const wrapper = mount(SourceFileReference)

    expect(wrapper.get('.source-file-reference__empty').text()).toContain('源码文件未收录')
    expect(wrapper.get('.source-file-reference__path').text()).toBe('packages/core/src/components/missing/YMissing.vue')
  })
})
