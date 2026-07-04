import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ComponentApiSection from './ComponentApiSection.vue'

vi.mock('vitepress', () => ({
  useRoute: () => ({
    path: '/components/table'
  })
}))

describe('ComponentApiSection', () => {
  it('renders structured API tables for one component', () => {
    const wrapper = mount(ComponentApiSection, {
      props: {
        name: 'YTable'
      }
    })

    expect(wrapper.find('.component-api-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('Props')
    expect(wrapper.text()).toContain('columns')
    expect(wrapper.text()).toContain('Slots')
    expect(wrapper.text()).toContain('empty')
    expect(wrapper.text()).toContain('Methods')
    expect(wrapper.text()).toContain('clearSort')
    expect(wrapper.find('#api-y-table-props').exists()).toBe(true)
    expect(wrapper.find('#api-props').exists()).toBe(true)
    expect(wrapper.find('#api-y-table-props-columns').exists()).toBe(true)
    expect(wrapper.find('#api-props-columns').exists()).toBe(true)
  })

  it('renders component labels when multiple component APIs share one page', () => {
    const wrapper = mount(ComponentApiSection, {
      props: {
        names: ['YTag', 'YBadge']
      }
    })

    expect(wrapper.findAll('.component-api-section__title').map((node) => node.text())).toEqual([
      'YTag',
      'YBadge'
    ])
    expect(wrapper.text()).toContain('tone')
    expect(wrapper.text()).toContain('value')
    expect(wrapper.find('#api-y-tag-props').exists()).toBe(true)
    expect(wrapper.find('#api-y-badge-props').exists()).toBe(true)
    expect(wrapper.find('#api-y-tag-props-tone').exists()).toBe(true)
    expect(wrapper.find('#api-y-badge-props-value').exists()).toBe(true)
    expect(wrapper.find('#api-props').exists()).toBe(false)
  })

  it('shows a documented missing state for unknown API names', () => {
    const wrapper = mount(ComponentApiSection, {
      props: {
        name: 'YUnknown'
      }
    })

    expect(wrapper.find('.component-api-section__missing').text()).toContain('YUnknown API 未登记')
  })
})
