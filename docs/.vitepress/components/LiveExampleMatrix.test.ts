import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LiveExampleMatrix from './LiveExampleMatrix.vue'

describe('LiveExampleMatrix', () => {
  it('renders live example quality metrics, package filters and review queue', async () => {
    const wrapper = mount(LiveExampleMatrix)

    expect(wrapper.text()).toContain('Live Example Matrix')
    expect(wrapper.get('.live-example-matrix').attributes('id')).toBe('live-example')
    expect(wrapper.text()).toContain('examples')
    expect(wrapper.text()).toContain('workflow ready')
    expect(wrapper.text()).toContain('scenario states')
    expect(wrapper.text()).toContain('@yok-ui/core')
    expect(wrapper.text()).toContain('Needs review')
    expect(wrapper.findAll('.live-example-matrix__row').length).toBeGreaterThan(10)
    expect(wrapper.get('.live-example-matrix__row').text()).toContain('/components/')
    expect(wrapper.get('.live-example-matrix__row').text()).toContain('#live-example')

    const adminFilter = wrapper
      .findAll('.live-example-matrix__package-filter')
      .find((button) => button.text().includes('@yok-ui/admin'))

    expect(adminFilter, 'Missing admin package filter').toBeTruthy()
    await adminFilter?.trigger('click')

    expect(wrapper.get('.live-example-matrix__table').attributes('aria-label')).toContain('@yok-ui/admin')
    expect(wrapper.text()).toContain('YDataTable')
    expect(wrapper.text()).not.toContain('YButton')
  })
})
