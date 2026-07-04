import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSplitter, { type YSplitterPanel } from './YSplitter.vue'

const panels: YSplitterPanel[] = [
  { key: 'nav', label: 'Navigation', size: 28, min: 16, max: 48, collapsible: true, collapsedSize: 8 },
  { key: 'content', label: 'Content', size: 72, min: 36 }
]

function mountSplitter(props: Record<string, unknown> = {}) {
  return mount(YSplitter, {
    props: {
      panels,
      ...props
    },
    slots: {
      nav: '<nav>Navigation tree</nav>',
      content: '<main>Component detail</main>'
    },
    attachTo: document.body
  })
}

describe('YSplitter', () => {
  it('renders labelled panels and separators from panel metadata', () => {
    const wrapper = mountSplitter()

    expect(wrapper.classes()).toContain('yok-splitter--horizontal')
    expect(wrapper.get('[data-panel-key="nav"]').attributes('aria-label')).toBe('Navigation')
    expect(wrapper.get('[data-panel-key="content"]').text()).toContain('Component detail')
    expect(wrapper.get('[role="separator"]').attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.get('[role="separator"]').attributes('aria-valuenow')).toBe('28')
    expect(wrapper.get('.yok-splitter').attributes('style')).toContain('--yok-splitter-template: 28fr 8px 72fr')
  })

  it('uses controlled model sizes when modelValue is provided', () => {
    const wrapper = mountSplitter({
      modelValue: {
        nav: 40,
        content: 60
      }
    })

    expect(wrapper.get('[role="separator"]').attributes('aria-valuenow')).toBe('40')
    expect(wrapper.get('.yok-splitter').attributes('style')).toContain('--yok-splitter-template: 40fr 8px 60fr')
  })

  it('updates adjacent panel sizes with keyboard and respects min max constraints', async () => {
    const wrapper = mountSplitter({
      modelValue: {
        nav: 47,
        content: 53
      },
      keyboardStep: 4
    })

    await wrapper.get('[role="separator"]').trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      {
        nav: 48,
        content: 52
      }
    ])
    expect(wrapper.emitted('resize')?.[0]).toEqual([
      {
        index: 0,
        sizes: {
          nav: 48,
          content: 52
        }
      }
    ])
  })

  it('supports pointer resizing and emits resize lifecycle events', async () => {
    const wrapper = mountSplitter()
    const splitter = wrapper.get('.yok-splitter').element as HTMLElement

    Object.defineProperty(splitter, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 500,
        height: 240,
        right: 500,
        bottom: 240,
        x: 0,
        y: 0,
        toJSON: () => {}
      })
    })

    await wrapper.get('[role="separator"]').trigger('pointerdown', { clientX: 180, pointerId: 1 })
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 230, pointerId: 1 }))
    document.dispatchEvent(new PointerEvent('pointerup', { clientX: 230, pointerId: 1 }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('resizeStart')?.[0]).toEqual([{ index: 0 }])
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual({
      nav: 38,
      content: 62
    })
    expect(wrapper.emitted('resizeEnd')?.[0]).toEqual([
      {
        index: 0,
        sizes: {
          nav: 38,
          content: 62
        }
      }
    ])
  })

  it('collapses and expands a collapsible panel', async () => {
    const wrapper = mountSplitter()

    await wrapper.get('.yok-splitter__collapse').trigger('click')

    expect(wrapper.emitted('collapse')?.[0]).toEqual([
      {
        key: 'nav',
        collapsed: true,
        sizes: {
          nav: 8,
          content: 92
        }
      }
    ])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      {
        nav: 8,
        content: 92
      }
    ])

    await wrapper.get('.yok-splitter__collapse').trigger('click')

    expect(wrapper.emitted('collapse')?.[1]).toEqual([
      {
        key: 'nav',
        collapsed: false,
        sizes: {
          nav: 28,
          content: 72
        }
      }
    ])
  })

  it('uses horizontal separators for vertical splitters', () => {
    const wrapper = mountSplitter({
      layout: 'vertical',
      height: '360px'
    })

    expect(wrapper.classes()).toContain('yok-splitter--vertical')
    expect(wrapper.get('[role="separator"]').attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.get('.yok-splitter').attributes('style')).toContain('--yok-splitter-height: 360px')
  })
})
