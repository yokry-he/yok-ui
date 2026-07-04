import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ThemeLab from './ThemeLab.vue'

describe('ThemeLab', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn()
      }
    })
  })

  it('copies a theme review report with contrast and generated CSS', async () => {
    const wrapper = mount(ThemeLab, {
      global: {
        stubs: {
          YAlert: true,
          YBrandHero: true,
          YButton: true,
          YProgress: true,
          YTag: true
        }
      }
    })

    await wrapper.get('.theme-lab__copy-report').trigger('click')

    const copiedText = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedText).toContain('# Yok UI theme review')
    expect(copiedText).toContain('- Contrast: 4/4 passed')
    expect(copiedText).toContain('- Release gate: 6/6 passed (ready)')
    expect(copiedText).toContain('## Release gate')
    expect(copiedText).toContain('## CSS variables')
    expect(copiedText).toContain('--yok-color-primary: #147a65;')
    expect(wrapper.get('.theme-lab__copy-report').text()).toContain('已复制报告')
  })

  it('copies a type-safe theme token config for package integration', async () => {
    const wrapper = mount(ThemeLab, {
      global: {
        stubs: {
          YAlert: true,
          YBrandHero: true,
          YButton: true,
          YProgress: true,
          YTag: true
        }
      }
    })

    await wrapper.get('.theme-lab__copy-ts-config').trigger('click')

    const copiedText = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedText).toContain("import type { YokThemeTokens } from '@yok-ui/themes'")
    expect(copiedText).toContain("primary: '#147a65'")
    expect(copiedText).toContain('} satisfies YokThemeTokens')
    expect(wrapper.get('.theme-lab__copy-ts-config').text()).toContain('已复制配置')
  })

  it('shows and copies a theme release audit checklist', async () => {
    const wrapper = mount(ThemeLab, {
      global: {
        stubs: {
          YAlert: true,
          YBrandHero: true,
          YButton: true,
          YProgress: true,
          YTag: true
        }
      }
    })

    const releasePanel = wrapper.get('.theme-lab__release')

    expect(releasePanel.text()).toContain('Release audit')
    expect(releasePanel.text()).toContain('100 / 100')
    expect(releasePanel.text()).toContain('Token coverage')
    expect(releasePanel.text()).toContain('WCAG contrast')
    expect(releasePanel.findAll('.theme-lab__release-list li')).toHaveLength(6)

    await releasePanel.get('.theme-lab__copy-checklist').trigger('click')

    const copiedText = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? ''

    expect(copiedText).toContain('# Yok UI theme release checklist')
    expect(copiedText).toContain('- Status: Ready')
    expect(copiedText).toContain('- Gate: 6/6 checks passed')
    expect(copiedText).toContain('- [x] Token coverage:')
    expect(copiedText).toContain('## Contrast pairs')
    expect(releasePanel.get('.theme-lab__copy-checklist').text()).toContain('已复制清单')
  })
})
