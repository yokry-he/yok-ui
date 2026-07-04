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

  const globalStubs = {
    YAlert: true,
    YBrandHero: true,
    YButton: true,
    YProgress: true,
    YTag: true
  }

  it('copies a theme review report with contrast and generated CSS', async () => {
    const wrapper = mount(ThemeLab, {
      global: {
        stubs: globalStubs
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
        stubs: globalStubs
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
        stubs: globalStubs
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

  it('filters generated token variables and copies a single declaration', async () => {
    const wrapper = mount(ThemeLab, {
      global: {
        stubs: globalStubs
      }
    })

    const tokenInspector = wrapper.get('.theme-lab__token-inspector')

    expect(tokenInspector.text()).toContain('Token inspector')
    expect(tokenInspector.text()).toContain('33 / 33 tokens')
    expect(wrapper.findAll('.theme-lab__token-row')).toHaveLength(33)

    await wrapper.get('.theme-lab__token-search input').setValue('primary')

    expect(tokenInspector.text()).toContain('--yok-color-primary')
    expect(wrapper.findAll('.theme-lab__token-row').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.theme-lab__token-row').every((row) => row.text().toLowerCase().includes('primary'))).toBe(true)

    await wrapper.get('.theme-lab__token-search input').setValue('')

    const shadowGroupButton = wrapper
      .findAll('.theme-lab__token-groups button')
      .find((button) => button.text().includes('shadow'))

    expect(shadowGroupButton).toBeTruthy()
    await shadowGroupButton?.trigger('click')

    const shadowRows = wrapper.findAll('.theme-lab__token-row')

    expect(shadowRows).toHaveLength(2)
    expect(tokenInspector.text()).toContain('--yok-shadow-soft')

    await shadowRows[0].trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('--yok-shadow-soft: 0 8px 24px rgba(20, 122, 101, 0.1);')
    expect(shadowRows[0].text()).toContain('已复制')
  })
})
