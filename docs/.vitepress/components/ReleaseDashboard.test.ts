import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ReleaseDashboard from './ReleaseDashboard.vue'

describe('ReleaseDashboard', () => {
  it('renders the package release plan, changelog draft and promotion queue', () => {
    const wrapper = mount(ReleaseDashboard)

    expect(wrapper.text()).toContain('release workflow')
    expect(wrapper.text()).toContain('0.2.0')
    expect(wrapper.text()).toContain('Release gate evidence')
    expect(wrapper.text()).toContain('Edited Source Share')
    expect(wrapper.text()).toContain('Stable promotions')
    expect(wrapper.text()).toContain('pnpm release:dry-run')
    expect(wrapper.text()).toContain('outputs/release/yok-ui-0.2.0-release-plan.md')
    expect(wrapper.text()).toContain('outputs/release/yok-ui-0.2.0-release-plan.json')
    expect(wrapper.findAll('.release-dashboard__package').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.release-dashboard__checklist li')).toHaveLength(6)
    expect(wrapper.findAll('.release-dashboard__promotion a').length).toBeGreaterThan(0)
    expect(wrapper.find('.release-dashboard__changelog pre').text()).toContain('pnpm docs:build')
  })
})
