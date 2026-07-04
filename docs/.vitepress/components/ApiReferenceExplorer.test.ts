import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ApiReferenceExplorer from './ApiReferenceExplorer.vue'

enableAutoUnmount(afterEach)

function findButtonByText(wrapper: ReturnType<typeof mount>, text: string) {
  const button = wrapper.findAll('button').find((item) => item.text().includes(text))

  expect(button, `Missing button ${text}`).toBeTruthy()

  return button!
}

describe('ApiReferenceExplorer', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn()
      }
    })
  })

  afterEach(() => {
    window.history.replaceState(null, '', '/')
    vi.restoreAllMocks()
  })

  it('indexes API rows with component anchors and live evidence links', async () => {
    const wrapper = mount(ApiReferenceExplorer)

    expect(wrapper.get('.api-reference-explorer__summary').text()).toContain('API rows')
    expect(wrapper.get('.api-reference-explorer__summary').text()).toContain('live covered')

    await wrapper.get('input[type="search"]').setValue('variant')

    const row = wrapper
      .findAll('.api-reference-explorer__row')
      .find((item) => item.text().includes('variant'))

    expect(row, 'Missing variant API row').toBeTruthy()
    expect(row?.attributes('href')).toBe('/components/button#api-props-variant')
    expect(row?.text()).toContain('Props')
    expect(row?.find('strong').attributes('data-status')).toBe('covered')

    const evidenceLink = wrapper
      .findAll('.api-reference-explorer__evidence-links a')
      .find((item) => item.text().includes('variant'))

    expect(evidenceLink, 'Missing variant live evidence link').toBeTruthy()
    expect(evidenceLink?.attributes('href')).toBe('/components/button#demo-variants')
  })

  it('filters rows by live evidence status', async () => {
    const wrapper = mount(ApiReferenceExplorer)

    await findButtonByText(wrapper, 'Covered').trigger('click')

    const rows = wrapper.findAll('.api-reference-explorer__row')

    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((row) => row.find('strong').attributes('data-status') === 'covered')).toBe(true)
    expect(wrapper.get('.api-reference-explorer__summary').text()).toContain('shown')
  })

  it('shows an accessible empty state when filters have no matches', async () => {
    const wrapper = mount(ApiReferenceExplorer)

    await wrapper.get('input[type="search"]').setValue('definitely-not-a-yok-api-row')

    const empty = wrapper.get('[role="status"]')

    expect(empty.text()).toContain('没有匹配的 API 行')
    expect(wrapper.find('.api-reference-explorer__grid').exists()).toBe(false)
  })

  it('hydrates search, kind and evidence filters from the URL', async () => {
    window.history.replaceState(null, '', '/resources/api-reference?api-q=variant&api-kind=props&api-coverage=covered&api-package=@yok-ui/core')

    const wrapper = mount(ApiReferenceExplorer)

    expect(wrapper.get<HTMLInputElement>('input[type="search"]').element.value).toBe('variant')
    expect(findButtonByText(wrapper, 'Props').classes()).toContain('active')
    expect(findButtonByText(wrapper, 'Covered').classes()).toContain('active')
    expect(findButtonByText(wrapper, 'Core').classes()).toContain('active')
    expect(wrapper.findAll('.api-reference-explorer__row').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.api-reference-explorer__row').every((row) =>
      row.text().includes('Props') && row.find('strong').attributes('data-status') === 'covered'
    )).toBe(true)
  })

  it('filters API rows by package and keeps the URL shareable', async () => {
    const wrapper = mount(ApiReferenceExplorer)

    await findButtonByText(wrapper, 'Admin').trigger('click')
    await findButtonByText(wrapper, 'Events').trigger('click')
    await findButtonByText(wrapper, 'Covered').trigger('click')
    await wrapper.get('input[type="search"]').setValue('select')

    expect(window.location.pathname).toBe('/resources/api-reference')
    expect(decodeURIComponent(window.location.search)).toContain('api-package=@yok-ui/admin')
    expect(window.location.search).toContain('api-kind=events')
    expect(window.location.search).toContain('api-coverage=covered')
    expect(window.location.search).toContain('api-q=select')
    expect(wrapper.findAll('.api-reference-explorer__row').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.api-reference-explorer__row').every((row) =>
      row.text().includes('Events') && row.find('strong').attributes('data-status') === 'covered'
    )).toBe(true)
    expect(wrapper.findAll('.docs-card').every((card) => card.text().includes('Admin'))).toBe(true)

    await wrapper.get('.api-reference-explorer__copy').trigger('click')

    const copiedLink = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedLink).toContain('/resources/api-reference?')
    expect(decodeURIComponent(copiedLink)).toContain('api-package=@yok-ui/admin')
    expect(copiedLink).toContain('api-kind=events')
    expect(wrapper.get('.api-reference-explorer__copy').text()).toBe('已复制链接')

    await wrapper.get('.api-reference-explorer__reset').trigger('click')

    expect(window.location.pathname).toBe('/resources/api-reference')
    expect(window.location.search).toBe('')
    expect(wrapper.get<HTMLInputElement>('input[type="search"]').element.value).toBe('')
    expect(findButtonByText(wrapper, 'All packages').classes()).toContain('active')
    expect(wrapper.get('.api-reference-explorer__reset').attributes('disabled')).toBeDefined()
  })
})
