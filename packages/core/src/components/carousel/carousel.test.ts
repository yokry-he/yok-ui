import { mount } from '@vue/test-utils'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import YCarousel from './YCarousel.vue'

const items = [
  { title: 'Design tokens', description: 'Theme primitives and semantic colors.' },
  { title: 'Live examples', description: 'Runnable examples with API evidence.' },
  { title: 'Accessibility', description: 'Keyboard and screen reader contracts.' }
]

afterEach(() => {
  vi.useRealTimers()
})

describe('YCarousel', () => {
  it('renders the controlled active slide with indicators and arrows', () => {
    const wrapper = mount(YCarousel, {
      props: {
        items,
        modelValue: 1,
        ariaLabel: 'Yok UI maturity carousel'
      }
    })

    expect(wrapper.attributes('role')).toBe('region')
    expect(wrapper.attributes('aria-label')).toBe('Yok UI maturity carousel')
    expect(wrapper.get('.yok-carousel__slide--active').text()).toContain('Live examples')
    expect(wrapper.findAll('.yok-carousel__indicator')).toHaveLength(3)
    expect(wrapper.get('.yok-carousel__indicator[aria-current="true"]').attributes('aria-label')).toBe('Go to slide 2: Live examples')
    expect(wrapper.get('[data-carousel-action="previous"]').attributes('aria-label')).toBe('Previous slide')
    expect(wrapper.get('[data-carousel-action="next"]').attributes('aria-label')).toBe('Next slide')
  })

  it('emits model updates and change payloads when navigating', async () => {
    const wrapper = mount(YCarousel, {
      props: {
        items,
        modelValue: 0
      }
    })

    await wrapper.get('[data-carousel-action="next"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([{ current: 1, previous: 0, item: items[1] }])

    await wrapper.setProps({ modelValue: 1 })
    await wrapper.get('.yok-carousel__indicator[aria-label="Go to slide 3: Accessibility"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([{ current: 2, previous: 1, item: items[2] }])
  })

  it('updates the visible slide in uncontrolled mode', async () => {
    const wrapper = mount(YCarousel, {
      props: {
        items
      }
    })

    expect(wrapper.get('.yok-carousel__slide--active').text()).toContain('Design tokens')

    await wrapper.get('[data-carousel-action="next"]').trigger('click')

    expect(wrapper.get('.yok-carousel__slide--active').text()).toContain('Live examples')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('respects non-loop boundaries and vertical direction', async () => {
    const wrapper = mount(YCarousel, {
      props: {
        items,
        modelValue: 0,
        loop: false,
        direction: 'vertical'
      }
    })

    expect(wrapper.classes()).toContain('yok-carousel--vertical')
    expect(wrapper.get('[data-carousel-action="previous"]').attributes('disabled')).toBeDefined()

    await wrapper.get('[data-carousel-action="previous"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('supports keyboard navigation on the viewport', async () => {
    const wrapper = mount(YCarousel, {
      props: {
        items,
        modelValue: 1
      }
    })

    await wrapper.get('.yok-carousel__viewport').trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('autoplays slides and exposes item slot data', async () => {
    vi.useFakeTimers()

    const wrapper = mount(YCarousel, {
      props: {
        items,
        modelValue: 0,
        autoplay: true,
        interval: 1000
      },
      slots: {
        item: `<template #item="{ item, active }">
          <strong class="custom-slide">{{ item.title }} {{ active ? 'active' : 'idle' }}</strong>
        </template>`
      }
    })

    expect(wrapper.text()).toContain('Design tokens active')

    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('does not access browser globals during server rendering when autoplay is enabled', async () => {
    const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')

    Reflect.deleteProperty(globalThis, 'window')

    try {
      const app = createSSRApp({
        render: () => h(YCarousel, { items, autoplay: true })
      })

      await expect(renderToString(app)).resolves.toContain('yok-carousel')
    } finally {
      if (windowDescriptor) {
        Object.defineProperty(globalThis, 'window', windowDescriptor)
      }
    }
  })

  it('pauses autoplay on hover by default and can keep autoplay running when disabled', async () => {
    vi.useFakeTimers()

    const pausedWrapper = mount(YCarousel, {
      props: {
        items,
        autoplay: true,
        interval: 1000
      }
    })

    await pausedWrapper.trigger('mouseenter')
    vi.advanceTimersByTime(1000)
    await pausedWrapper.vm.$nextTick()

    expect(pausedWrapper.emitted('update:modelValue')).toBeUndefined()

    await pausedWrapper.trigger('mouseleave')
    vi.advanceTimersByTime(1000)
    await pausedWrapper.vm.$nextTick()

    expect(pausedWrapper.emitted('update:modelValue')?.[0]).toEqual([1])

    const runningWrapper = mount(YCarousel, {
      props: {
        items,
        autoplay: true,
        interval: 1000,
        pauseOnHover: false
      }
    })

    await runningWrapper.trigger('mouseenter')
    vi.advanceTimersByTime(1000)
    await runningWrapper.vm.$nextTick()

    expect(runningWrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })
})
