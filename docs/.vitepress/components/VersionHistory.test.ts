import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VersionHistory from './VersionHistory.vue'

describe('VersionHistory', () => {
  it('renders version records, package sections and evidence links', () => {
    const wrapper = mount(VersionHistory)

    expect(wrapper.text()).toContain('version history')
    expect(wrapper.text()).toContain('0.2.0')
    expect(wrapper.text()).toContain('Release candidate')
    expect(wrapper.text()).toContain('Stable promotions')
    expect(wrapper.findAll('.version-history__package').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.version-history__evidence a').map((link) => link.attributes('href'))).toEqual(expect.arrayContaining([
      '/resources/release',
      '/resources/maturity'
    ]))
  })

  it('filters changelog items by category without hiding the version entry', async () => {
    const wrapper = mount(VersionHistory)
    const docsButton = wrapper.findAll('button').find((button) => button.text().includes('Documentation'))

    expect(docsButton, 'Missing Documentation filter').toBeTruthy()

    await docsButton!.trigger('click')

    expect(wrapper.text()).toContain('Documentation')
    expect(wrapper.text()).toContain('Changelog')
    expect(wrapper.findAll('.version-history__entry')).toHaveLength(2)
    expect(wrapper.findAll('.version-history__item').every((item) =>
      item.attributes('data-type') === 'documentation'
    )).toBe(true)
  })
})
