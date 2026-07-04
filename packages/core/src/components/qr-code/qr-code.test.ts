import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import YQRCode from './YQRCode.vue'

describe('YQRCode', () => {
  it('renders an accessible SVG QR code from the value', () => {
    const wrapper = mount(YQRCode, {
      props: {
        value: 'https://yok-ui.dev/components/qr-code',
        label: 'Yok UI docs QR code',
        size: 128,
        level: 'H',
        foreground: '#087f6d',
        background: '#f8fffc'
      }
    })

    const svg = wrapper.get('svg')

    expect(wrapper.attributes('aria-label')).toBe('Yok UI docs QR code')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('Yok UI docs QR code')
    expect(svg.attributes('width')).toBe('128')
    expect(svg.attributes('height')).toBe('128')
    expect(wrapper.find('[data-yok-qr-modules]').exists()).toBe(true)
    expect(wrapper.get('[data-yok-qr-background]').attributes('fill')).toBe('#f8fffc')
    expect(wrapper.get('[data-yok-qr-modules]').attributes('fill')).toBe('#087f6d')
  })

  it('shows loading and expired states with explicit status semantics', async () => {
    const wrapper = mount(YQRCode, {
      props: {
        value: 'ticket:pending',
        status: 'loading',
        loadingText: 'Generating ticket QR code'
      }
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[role="status"]').text()).toContain('Generating ticket QR code')

    await wrapper.setProps({
      status: 'expired',
      expiredText: 'Ticket QR code expired',
      refreshText: 'Refresh ticket'
    })

    expect(wrapper.attributes('aria-busy')).toBe('false')
    expect(wrapper.get('.yok-qr-code__status').attributes('role')).toBe('alert')
    expect(wrapper.text()).toContain('Ticket QR code expired')

    await wrapper.get('[data-yok-qr-refresh]').trigger('click')

    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })

  it('renders a protected logo well and emits ready metadata', () => {
    const wrapper = mount(YQRCode, {
      props: {
        value: 'payment:2026-07-03',
        logoSrc: 'https://cdn.example.com/logo.png',
        logoAlt: 'Yok UI',
        logoSize: 32
      }
    })

    expect(wrapper.find('[data-yok-qr-logo-well]').exists()).toBe(true)
    expect(wrapper.get('[data-yok-qr-logo]').attributes('href')).toBe('https://cdn.example.com/logo.png')
    expect(wrapper.get('[data-yok-qr-logo]').attributes('aria-label')).toBe('Yok UI')
    expect(wrapper.emitted('ready')?.[0]?.[0]).toMatchObject({
      value: 'payment:2026-07-03',
      level: 'M'
    })
  })

  it('can download the generated SVG markup', async () => {
    const click = vi.fn()
    const revokeObjectURL = vi.fn()
    const createObjectURL = vi.fn(() => 'blob:yok-qr-code')
    const originalCreateElement = document.createElement.bind(document)
    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL

    vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      const element = originalCreateElement(tagName, options)

      if (tagName === 'a') {
        vi.spyOn(element, 'click').mockImplementation(click)
      }

      return element
    })
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = revokeObjectURL

    const wrapper = mount(YQRCode, {
      props: {
        value: 'https://yok-ui.dev',
        downloadable: true,
        downloadName: 'yok-ui-link.svg',
        downloadText: 'Download SVG'
      }
    })

    await wrapper.get('[data-yok-qr-download]').trigger('click')

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(click).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:yok-qr-code')

    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })
})
