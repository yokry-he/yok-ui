import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import YTour from './YTour.vue'

enableAutoUnmount(afterEach)

const tourSteps = [
  {
    title: 'Search docs',
    description: 'Use search to jump to components, guides and examples.',
    target: '#tour-search'
  },
  {
    title: 'Open source',
    description: 'Review examples and export a reproduction bundle.',
    target: '#tour-source'
  }
]

describe('YTour', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('renders the active step as an accessible dialog when open', async () => {
    const target = document.createElement('button')
    target.id = 'tour-search'
    target.textContent = 'Search'
    document.body.append(target)

    mount(YTour, {
      props: {
        open: true,
        steps: tourSteps,
        current: 0
      }
    })

    await nextTick()

    const dialog = document.body.querySelector('[role="dialog"]')
    const spotlight = document.body.querySelector('.yok-tour__spotlight')

    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(dialog?.getAttribute('aria-label')).toBe('Search docs')
    expect(document.body.textContent).toContain('1 / 2')
    expect(document.body.textContent).toContain('Use search to jump to components')
    expect(spotlight?.getAttribute('aria-hidden')).toBe('true')
    expect(target.getAttribute('data-yok-tour-active')).toBe('true')
  })

  it('emits navigation updates without mutating controlled current state', async () => {
    const wrapper = mount(YTour, {
      props: {
        open: true,
        steps: tourSteps,
        current: 0
      }
    })

    await nextTick()

    document.body.querySelector<HTMLButtonElement>('[data-tour-next]')?.click()
    await nextTick()

    expect(wrapper.emitted('update:current')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([1, tourSteps[1]])
    expect(document.body.textContent).toContain('Search docs')
  })

  it('emits finish and closes on the final step', async () => {
    const wrapper = mount(YTour, {
      props: {
        open: true,
        steps: tourSteps,
        current: 1
      }
    })

    await nextTick()

    document.body.querySelector<HTMLButtonElement>('[data-tour-finish]')?.click()
    await nextTick()

    expect(wrapper.emitted('finish')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('supports escape close, skip label and empty tour fallback', async () => {
    const wrapper = mount(YTour, {
      props: {
        open: true,
        steps: [],
        skipText: 'Skip guide'
      }
    })

    await nextTick()

    expect(document.body.textContent).toContain('No tour steps')
    expect(document.body.textContent).toContain('Skip guide')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
