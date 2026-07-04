import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import YAnchor from './YAnchor.vue'

const items = [
  { title: 'Usage', href: '#usage' },
  {
    title: 'API',
    href: '#api',
    children: [
      { title: 'Props', href: '#props' },
      { title: 'Events', href: '#events', disabled: true }
    ]
  },
  { title: 'Accessibility', href: '#accessibility' }
]

function createScrollFixture() {
  const container = document.createElement('section')
  const usage = document.createElement('div')
  const api = document.createElement('div')
  const props = document.createElement('div')
  const accessibility = document.createElement('div')

  container.className = 'anchor-scroll-target'
  container.scrollTo = vi.fn(({ top }: ScrollToOptions) => {
    container.scrollTop = Number(top)
  })

  ;[
    [usage, 'usage', 0],
    [api, 'api', 180],
    [props, 'props', 320],
    [accessibility, 'accessibility', 520]
  ].forEach(([element, id, top]) => {
    element.id = String(id)
    Object.defineProperty(element, 'offsetTop', { value: top })
    container.appendChild(element)
  })

  document.body.appendChild(container)

  return { container, usage, api, props, accessibility }
}

describe('YAnchor', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('renders semantic anchor navigation with nested links and active state', () => {
    const wrapper = mount(YAnchor, {
      props: {
        items,
        modelValue: '#props',
        ariaLabel: 'Component sections'
      }
    })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Component sections')
    expect(wrapper.classes()).toContain('yok-anchor--vertical')
    expect(wrapper.findAll('a')).toHaveLength(4)
    expect(wrapper.get('[href="#props"]').attributes('aria-current')).toBe('location')
    expect(wrapper.get('[aria-disabled="true"]').text()).toBe('Events')
  })

  it('scrolls to clicked links and emits click, update and change payloads', async () => {
    const { container, api } = createScrollFixture()
    const wrapper = mount(YAnchor, {
      props: {
        items,
        container,
        offset: 24,
        bound: 8
      }
    })

    await wrapper.get('[href="#api"]').trigger('click')

    expect(container.scrollTo).toHaveBeenCalledWith({ top: 156, behavior: 'smooth' })
    expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ item: items[1] })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#api'])
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['#api'])
    expect(wrapper.get('[href="#api"]').attributes('aria-current')).toBe('location')
    expect(api.offsetTop).toBe(180)
  })

  it('supports horizontal underline mode without rendering nested sublinks', () => {
    const wrapper = mount(YAnchor, {
      props: {
        items,
        direction: 'horizontal',
        type: 'underline',
        modelValue: '#usage'
      }
    })

    expect(wrapper.classes()).toContain('yok-anchor--horizontal')
    expect(wrapper.classes()).toContain('yok-anchor--underline')
    expect(wrapper.findAll('a')).toHaveLength(3)
    expect(wrapper.find('[href="#props"]').exists()).toBe(false)
  })

  it('updates the active link from a scroll container and exposes scrollTo', async () => {
    const { container } = createScrollFixture()
    const wrapper = mount(YAnchor, {
      props: {
        items,
        container,
        offset: 20,
        bound: 12
      }
    })

    container.scrollTop = 300
    container.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[href="#props"]').attributes('aria-current')).toBe('location')
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['#props'])

    wrapper.vm.scrollTo('#accessibility')

    expect(container.scrollTo).toHaveBeenLastCalledWith({ top: 500, behavior: 'smooth' })
  })
})
