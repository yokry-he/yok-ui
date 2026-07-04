import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MaturityDashboard from './MaturityDashboard.vue'

describe('MaturityDashboard', () => {
  it('renders live example readiness after the depth queue is complete', () => {
    const wrapper = mount(MaturityDashboard)

    expect(wrapper.text()).toContain('live example readiness')
    expect(wrapper.text()).toContain('component maturity evidence')
    expect(wrapper.text()).toContain('average maturity')
    expect(wrapper.text()).toContain('API evidence')
    expect(wrapper.text()).toContain('Playground handoff')
    expect(wrapper.text()).toContain('Theme evidence')
    expect(wrapper.text()).toContain('真实源码 token 引用')
    expect(wrapper.text()).toContain('Next maturity queue')
    expect(wrapper.text()).toContain('component coverage queue')
    expect(wrapper.text()).toContain('把文档证据缺口排成可执行维护队列')
    expect(wrapper.text()).toContain('critical')
    expect(wrapper.text()).toContain('queued')
    expect(wrapper.text()).toContain('average readiness')
    expect(wrapper.text()).toContain('Workflow ready evidence')
    expect(wrapper.text()).toContain('Props-only queue')
    expect(wrapper.text()).toContain('当前没有 props-only 示例缺口')
    expect(wrapper.text()).toContain('static demo handoff')
    expect(wrapper.text()).toContain('DocDemo source quality')
    expect(wrapper.text()).toContain('complete SFC handoff')
    expect(wrapper.text()).toContain('DocDemo pages')
    expect(wrapper.text()).not.toContain('raw demo-box')
    expect(wrapper.findAll('.maturity-dashboard__doc-demo-card')).toHaveLength(5)
    expect(
      wrapper.findAll('.maturity-dashboard__doc-demo-links a').length +
      wrapper.findAll('.maturity-dashboard__doc-demo-links .maturity-dashboard__complete').length
    ).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('api to live example map')
    expect(wrapper.text()).toContain('API live coverage')
    expect(wrapper.text()).toContain('Section evidence')
    expect(wrapper.text()).toContain('API Reference handoff')
    expect(wrapper.text()).toContain('Browse every API row')
    expect(wrapper.text()).toContain('Covered evidence view')
    expect(wrapper.text()).toContain('Search variant')
    expect(wrapper.text()).toContain('Next API scene queue')
    expect(wrapper.text()).toContain('mainstream gap lanes')
    expect(wrapper.text()).toContain('mainstream parity benchmark')
    expect(wrapper.text()).toContain('Element Plus Overview')
    expect(wrapper.text()).toContain('Element Plus Table')
    expect(wrapper.text()).toContain('Element Plus Cascader')
    expect(wrapper.text()).toContain('Element Plus DatePicker')
    expect(wrapper.text()).toContain('Element Plus ConfigProvider i18n')
    expect(wrapper.text()).toContain('Ant Design Vue Customize Theme')
    expect(wrapper.text()).toContain('Arco Design Vue Design Token')
    expect(wrapper.text()).toContain('Naive UI Homepage')
    expect(wrapper.text()).toContain('TDesign Vue Next Overview')
    expect(wrapper.text()).toContain('reference libraries')
    expect(wrapper.text()).toContain('external source')
    expect(wrapper.text()).toContain('Component overview and category IA')
    expect(wrapper.text()).toContain('Design token customization through ConfigProvider')
    expect(wrapper.text()).toContain('Enterprise desktop shell and starter workflow')
    expect(wrapper.text()).toContain('Guide, Component and Resource information architecture')
    expect(wrapper.text()).toContain('Interaction contracts')
    expect(wrapper.text()).toContain('Runtime audit')
    expect(wrapper.text()).toContain('Release stabilization')
    expect(wrapper.text()).toContain('Release gate evidence')
    expect(wrapper.text()).toContain('API Live / Workflow Live / Source / Edited Source Share / Theme / A11y')
    expect(wrapper.text()).toContain('Repro bundles')
    expect(wrapper.text()).toContain('Source quality')
    expect(wrapper.text()).toContain('Edited source share')
    expect(wrapper.text()).toContain('Source panel handoff')
    expect(wrapper.text()).toContain('Repro bundle 的源码面板来源')
    expect(wrapper.text()).toContain('source panel experience')
    expect(wrapper.text()).toContain('Element Plus source panel')
    expect(wrapper.text()).toContain('Top-right toolbar')
    expect(wrapper.text()).toContain('Bottom collapse')
    expect(wrapper.text()).toContain('Shared action model')
    expect(wrapper.findAll('.maturity-dashboard__source-panel-card')).toHaveLength(7)
    expect(wrapper.text()).toContain('API map')
    expect(wrapper.text()).toContain('复现包')
    expect(wrapper.findAll('.maturity-dashboard__mainstream-card')).toHaveLength(5)
    expect(wrapper.findAll('.maturity-dashboard__mainstream-link').length).toBeGreaterThanOrEqual(9)
    expect(wrapper.findAll('.maturity-dashboard__mainstream-library').length).toBeGreaterThanOrEqual(5)
    expect(wrapper.findAll('.maturity-dashboard__roadmap-lane')).toHaveLength(3)
    const interactionLaneValue = wrapper
      .get('.maturity-dashboard__roadmap-lane[data-lane="interaction"] header strong')
      .text()
    const [interactionCovered, interactionTotal] = interactionLaneValue.split('/').map(Number)

    expect(interactionCovered).toBeLessThanOrEqual(interactionTotal)
    expect(wrapper.findAll('.maturity-dashboard__roadmap-items a').length).toBeGreaterThan(0)
    expect(
      wrapper
        .findAll('.maturity-dashboard__roadmap-lane[data-lane="release"] .maturity-dashboard__roadmap-items em')
        .some((item) => item.text().includes('通过发布门禁') || item.text().includes('补齐发布门禁'))
    ).toBe(true)
    expect(wrapper.text()).toContain('theme release gates')
    expect(wrapper.text()).toContain('release score')
    expect(wrapper.text()).toContain('Token coverage')
    expect(wrapper.text()).toContain('WCAG contrast')
    expect(wrapper.findAll('.maturity-dashboard__theme-release-card')).toHaveLength(6)
    expect(wrapper.findAll('.maturity-dashboard__theme-release-card[data-passed="true"]')).toHaveLength(6)
    expect(wrapper.findAll('.maturity-dashboard__component-maturity-card')).toHaveLength(6)
    expect(wrapper.text()).toContain('Next live depth queue')
    expect(wrapper.findAll('.maturity-dashboard__readiness-card').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.maturity-dashboard__readiness-queue a')).toHaveLength(0)
    expect(wrapper.findAll('.maturity-dashboard__workflow-ready-links a').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.maturity-dashboard__props-only-links a')).toHaveLength(0)
    expect(wrapper.findAll('.maturity-dashboard__api-live-map-card')).toHaveLength(5)
    expect(wrapper.findAll('.maturity-dashboard__api-reference-links a')).toHaveLength(4)
    expect(wrapper.find('.maturity-dashboard__api-reference-handoff header a').attributes('href')).toBe('/resources/api-reference')
    expect(
      wrapper.findAll('.maturity-dashboard__api-reference-links a').map((link) => link.attributes('href'))
    ).toEqual(expect.arrayContaining([
      '/resources/api-reference',
      '/resources/api-reference?api-coverage=covered',
      '/resources/api-reference?api-kind=props',
      '/resources/api-reference?api-q=variant&api-kind=props'
    ]))
    expect(
      wrapper.findAll('.maturity-dashboard__api-live-map-links a').length +
      wrapper.findAll('.maturity-dashboard__api-live-map-links .maturity-dashboard__complete').length
    ).toBeGreaterThan(0)
    expect(
      wrapper.findAll('.maturity-dashboard__component-maturity-links a').length +
      wrapper.findAll('.maturity-dashboard__component-maturity-links .maturity-dashboard__complete').length
    ).toBeGreaterThan(0)
    expect(wrapper.findAll('.maturity-dashboard__coverage-queue-item')).toHaveLength(0)
    expect(wrapper.find('.maturity-dashboard__coverage-queue-list .maturity-dashboard__complete').text()).toContain('Component coverage complete')
    expect(wrapper.text()).toContain('当前组件页的 API Live、Source、A11y、Theme 和 Playground 证据都已达标。')
  })
})
