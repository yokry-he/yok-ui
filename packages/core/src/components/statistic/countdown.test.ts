import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import YCountdown from './YCountdown.vue'

describe('YCountdown', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a live countdown with timer semantics and emits change and finish', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-01T10:00:00.000Z'))

    const wrapper = mount(YCountdown, {
      props: {
        title: 'Start to grab',
        value: Date.now() + 3000,
        prefix: '剩余',
        suffix: '后开始',
        ariaLabel: 'Campaign countdown'
      }
    })

    expect(wrapper.attributes('role')).toBe('timer')
    expect(wrapper.attributes('aria-label')).toBe('Campaign countdown')
    expect(wrapper.get('.yok-countdown__content').attributes('aria-live')).toBe('polite')
    expect(wrapper.text()).toContain('Start to grab')
    expect(wrapper.text()).toContain('剩余')
    expect(wrapper.text()).toContain('00:00:03')
    expect(wrapper.text()).toContain('后开始')

    await vi.advanceTimersByTimeAsync(1000)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('00:00:02')
    expect(wrapper.emitted('change')?.at(-1)).toEqual([2000])

    await vi.advanceTimersByTimeAsync(2000)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('00:00:00')
    expect(wrapper.emitted('finish')).toHaveLength(1)
    expect(wrapper.emitted('change')?.at(-1)).toEqual([0])
  })

  it('supports day-level format, manual running control and tone styling', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-01T10:00:00.000Z'))

    const wrapper = mount(YCountdown, {
      props: {
        title: 'Remaining VIP time',
        value: Date.now() + 90_061_000,
        format: 'DD days HH:mm:ss',
        running: false,
        tone: 'warning'
      }
    })

    expect(wrapper.classes()).toContain('yok-countdown--warning')
    expect(wrapper.text()).toContain('01 days 01:01:01')

    await vi.advanceTimersByTimeAsync(2000)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('01 days 01:01:01')
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})
