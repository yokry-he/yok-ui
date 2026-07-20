import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ReleaseDashboard from './ReleaseDashboard.vue'

describe('ReleaseDashboard', () => {
  it('renders a secret-free operations center for npm, GitHub, Vercel and mirrors', () => {
    const wrapper = mount(ReleaseDashboard)

    expect(wrapper.text()).toContain('Release Operations')
    expect(wrapper.text()).toContain('@yok-ui/core')
    expect(wrapper.text()).toContain('GitHub Trusted Publishing')
    expect(wrapper.text()).toContain('Vercel documentation')
    expect(wrapper.text()).toContain('npmmirror')
    expect(wrapper.text()).toContain('pnpm release:verify')
    expect(wrapper.text()).toContain('pnpm release:publish -- --version 0.1.0 --tag latest --confirm-public-release')
    expect(wrapper.findAll('input, textarea').length).toBe(0)
    expect(wrapper.findAll('.release-dashboard__package').length).toBe(8)
    expect(wrapper.findAll('.release-dashboard__command').length).toBeGreaterThanOrEqual(6)
    expect(wrapper.html()).not.toMatch(/NPM_TOKEN|NODE_AUTH_TOKEN|_authToken|otp=|token=|password/i)
  })
})
