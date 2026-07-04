import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ComponentPageToc from './ComponentPageToc.vue'

const routeState = vi.hoisted(() => ({
  path: '/components/data-table'
}))

vi.mock('vitepress', () => ({
  useRoute: () => ({
    get path() {
      return routeState.path
    }
  })
}))

describe('ComponentPageToc', () => {
  beforeEach(() => {
    routeState.path = '/components/data-table'
  })

  it('renders live example, API and Playground links for component pages', () => {
    const wrapper = mount(ComponentPageToc)

    expect(wrapper.find('.component-page-toc').exists()).toBe(true)
    expect(wrapper.text()).toContain('Yok Contents')
    expect(wrapper.text()).toContain('Data Table')
    expect(wrapper.find('a[href="#live-example"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#live-example-api-map"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#live-example-scenarios"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#api"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#api-props"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#api-props-columns"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('API data center')
    expect(wrapper.find('a[href="/resources/api-reference?api-q=YDataTable"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/resources/api-reference?api-q=YDataTable&api-kind=props"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/resources/api-reference?api-q=YDataTable&api-kind=events"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/playground/?component=dataTable"]').exists()).toBe(true)
  })

  it('dispatches scenario changes from the right-side scenario navigation', async () => {
    const listener = vi.fn()
    window.addEventListener('yok-ui:live-example-scenario', listener)

    const wrapper = mount(ComponentPageToc)
    const scenario = wrapper
      .findAll('.component-page-toc__scenario')
      .find((item) => item.text().includes('错误重试'))

    expect(scenario?.attributes('href')).toBe('#live-example?scenario=error-retry')

    await scenario?.trigger('click')

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].detail).toEqual({
      preset: 'dataTable',
      scenarioKey: 'error-retry'
    })

    window.removeEventListener('yok-ui:live-example-scenario', listener)
  })

  it('hides component maintenance shortcuts when coverage is complete', () => {
    routeState.path = '/components/bulk-action-bar'

    const wrapper = mount(ComponentPageToc)

    expect(wrapper.find('.component-page-toc__group--maintenance').exists()).toBe(false)
    expect(wrapper.text()).toContain('Interaction contract')
    expect(wrapper.find('a[href="/playground/?component=bulkActionBar"]').exists()).toBe(true)
  })

  it('uses component-qualified API anchors for multi-component API pages', () => {
    routeState.path = '/components/tag-badge'

    const wrapper = mount(ComponentPageToc)

    expect(wrapper.text()).toContain('Tag')
    expect(wrapper.text()).toContain('YTag')
    expect(wrapper.text()).toContain('YBadge')
    expect(wrapper.find('a[href="#api-y-tag-props"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#api-y-tag-props-tone"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#api-y-badge-props"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#api-y-badge-props-value"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#api-props"]').exists()).toBe(false)
  })

  it('does not render outside component pages', () => {
    routeState.path = '/guide/introduction'

    const wrapper = mount(ComponentPageToc)

    expect(wrapper.find('.component-page-toc').exists()).toBe(false)
  })
})
