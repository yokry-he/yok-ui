import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DocRouteNavigator from './DocRouteNavigator.vue'

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

describe('DocRouteNavigator', () => {
  beforeEach(() => {
    routeState.path = '/components/data-table'
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn()
      }
    })
  })

  it('renders workflow scenario links as shareable live example hashes', () => {
    const wrapper = mount(DocRouteNavigator)
    const scenarioLinks = wrapper.findAll('.doc-route-navigator__scenario-grid a')

    expect(scenarioLinks).toHaveLength(12)
    expect(scenarioLinks[1].text()).toContain('错误重试')
    expect(scenarioLinks[1].attributes('href')).toBe('#live-example?scenario=error-retry')
    expect(scenarioLinks[2].text()).toContain('筛选摘要')
    expect(scenarioLinks[2].attributes('href')).toBe('#live-example?scenario=active-filters')
    expect(scenarioLinks[3].text()).toContain('列配置重置')
    expect(scenarioLinks[3].attributes('href')).toBe('#live-example?scenario=column-reset')
    expect(scenarioLinks[4].text()).toContain('列顺序偏好')
    expect(scenarioLinks[4].attributes('href')).toBe('#live-example?scenario=column-order')
    expect(scenarioLinks[5].text()).toContain('列宽偏好')
    expect(scenarioLinks[5].attributes('href')).toBe('#live-example?scenario=resizable-columns')
    expect(scenarioLinks[6].text()).toContain('视图偏好保存')
    expect(scenarioLinks[6].attributes('href')).toBe('#live-example?scenario=view-preference')
    expect(scenarioLinks[7].text()).toContain('千行性能')
    expect(scenarioLinks[7].attributes('href')).toBe('#live-example?scenario=virtualized-rows')
    expect(scenarioLinks[10].text()).toContain('移动密度')
    expect(scenarioLinks[10].attributes('href')).toBe('#live-example?scenario=mobile-density')
    expect(scenarioLinks[11].text()).toContain('键盘巡航')
    expect(scenarioLinks[11].attributes('href')).toBe('#live-example?scenario=keyboard-review')
  })

  it('renders and copies component maturity evidence from route context', async () => {
    const wrapper = mount(DocRouteNavigator)
    const maturity = wrapper.get('.doc-route-navigator__maturity')

    expect(maturity.text()).toContain('Maturity evidence')
    expect(maturity.text()).toContain('Data Table 发布成熟度清单')
    expect(maturity.text()).toContain('API Reference')
    expect(maturity.text()).toContain('Live Example')
    expect(maturity.text()).toContain('12 scenarios')
    expect(maturity.text()).toContain('A11y Contract')
    expect(maturity.text()).toContain('Playground Handoff')
    expect(maturity.text()).toContain('/playground/?component=dataTable')
    expect(wrapper.find('#component-maturity-theme').exists()).toBe(true)

    const evidence = wrapper.get('.doc-route-navigator__evidence')

    expect(evidence.text()).toContain('Evidence matrix')
    expect(evidence.text()).toContain('API、Live、Source、A11y、Theme 和 Route 证据矩阵')
    expect(evidence.text()).toContain('Source')
    expect(evidence.text()).toContain('Complete')
    expect(evidence.text()).toContain('API Live')
    expect(evidence.text()).toContain('Keyboard')
    expect(wrapper.find('#component-evidence-source').exists()).toBe(true)
    expect(wrapper.find('#component-quality-api-live').exists()).toBe(true)

    await maturity.get('.doc-route-navigator__maturity-copy').trigger('click')

    const report = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(report).toContain('# Yok UI component maturity report')
    expect(report).toContain('- Component: Data Table')
    expect(report).toContain('- Name: YDataTable')
    expect(report).toContain('- Package: @yok-ui/admin')
    expect(report).toContain('- Quality score: 100')
    expect(report).toContain('- Scenarios: 12')
    expect(report).toContain('## Evidence matrix')
    expect(report).toContain('- Source: Complete')
    expect(report).toContain('## Maturity evidence')
    expect(report).toContain('- API Reference:')
    expect(report).toContain('- Live Example: 12 scenarios')
    expect(report).toContain('- Playground Handoff: Linked')
    expect(report).toContain('## Quality gates')
    expect(report).toContain('- API Live: Linked')
    expect(report).toContain('- Source: Complete')
    expect(maturity.get('.doc-route-navigator__maturity-copy').text()).toContain('已复制报告')

    const apiHandoff = wrapper.get('.doc-route-navigator__api-reference')

    expect(apiHandoff.text()).toContain('API Reference handoff')
    expect(apiHandoff.text()).toContain('Data Table')
    expect(apiHandoff.find('a[href="/resources/api-reference?api-q=YDataTable"]').exists()).toBe(true)
    expect(apiHandoff.find('a[href="/resources/api-reference?api-q=YDataTable&api-kind=props"]').exists()).toBe(true)
  })

  it('does not render maintenance queue gaps for completed component routes', () => {
    routeState.path = '/components/bulk-action-bar'

    const wrapper = mount(DocRouteNavigator)

    expect(wrapper.find('.doc-route-navigator__maintenance').exists()).toBe(false)
    expect(wrapper.get('.doc-route-navigator__quality-score').text()).toContain('100')
    expect(wrapper.get('#component-quality-keyboard').text()).toContain('Verified')
    expect(wrapper.get('#component-quality-accessibility').text()).toContain('Complex covered')
  })

  it('dispatches live example scenario events from route context links', async () => {
    const listener = vi.fn()
    window.addEventListener('yok-ui:live-example-scenario', listener)

    const wrapper = mount(DocRouteNavigator)
    await wrapper
      .findAll('.doc-route-navigator__scenario-grid a')
      .find((link) => link.text().includes('批量选择'))
      ?.trigger('click')

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].detail).toEqual({
      preset: 'dataTable',
      scenarioKey: 'bulk-selection'
    })

    window.removeEventListener('yok-ui:live-example-scenario', listener)
  })
})
