import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { YBadge, YTag } from './index'

describe('YTag and YBadge', () => {
  it('renders tag tone and content', () => {
    const wrapper = mount(YTag, {
      props: {
        tone: 'success'
      },
      slots: {
        default: 'Active'
      }
    })

    expect(wrapper.classes()).toContain('yok-tag--success')
    expect(wrapper.text()).toBe('Active')
  })

  it('renders badge value', () => {
    const wrapper = mount(YBadge, {
      props: {
        value: '12'
      }
    })

    expect(wrapper.text()).toBe('12')
  })

  it('positions badge content on slotted targets and exposes accessible status text', () => {
    const wrapper = mount(YBadge, {
      props: {
        value: 12,
        label: 'Inbox has 12 unread messages'
      },
      slots: {
        default: '<button aria-label="Inbox">Inbox</button>'
      }
    })

    expect(wrapper.classes()).toContain('yok-badge--wrapper')
    expect(wrapper.get('.yok-badge__content').text()).toBe('12')
    expect(wrapper.get('.yok-badge__content').attributes('role')).toBe('status')
    expect(wrapper.get('.yok-badge__content').attributes('aria-label')).toBe('Inbox has 12 unread messages')
  })

  it('formats overflow values and preserves zero only when requested', () => {
    const overflow = mount(YBadge, {
      props: {
        value: 120,
        max: 99
      }
    })
    const hiddenZero = mount(YBadge, {
      props: {
        value: 0
      }
    })
    const shownZero = mount(YBadge, {
      props: {
        value: 0,
        showZero: true
      }
    })

    expect(overflow.text()).toBe('99+')
    expect(hiddenZero.find('.yok-badge__content').exists()).toBe(false)
    expect(shownZero.text()).toBe('0')
  })

  it('supports dot badges, tone and placement classes', () => {
    const wrapper = mount(YBadge, {
      props: {
        dot: true,
        value: 8,
        tone: 'success',
        placement: 'bottom-end',
        label: 'Online'
      },
      slots: {
        default: '<span>Yok UI</span>'
      }
    })

    const content = wrapper.get('.yok-badge__content')

    expect(wrapper.classes()).toContain('yok-badge--bottom-end')
    expect(content.classes()).toContain('yok-badge__content--success')
    expect(content.classes()).toContain('yok-badge__content--dot')
    expect(content.text()).toBe('')
    expect(content.attributes('aria-label')).toBe('Online')
  })

  it('hides badge content when hidden is true', () => {
    const wrapper = mount(YBadge, {
      props: {
        value: 9,
        hidden: true
      },
      slots: {
        default: '<button>Inbox</button>'
      }
    })

    expect(wrapper.find('.yok-badge__content').exists()).toBe(false)
    expect(wrapper.find('.yok-badge__target').exists()).toBe(true)
  })

  it('supports size, offset and standalone status text', () => {
    const wrapper = mount(YBadge, {
      props: {
        dot: true,
        text: 'Online',
        tone: 'success',
        size: 'lg',
        offset: [8, -4],
        label: 'Online status'
      }
    })

    const content = wrapper.get('.yok-badge__content')

    expect(wrapper.classes()).toContain('yok-badge--standalone')
    expect(content.classes()).toContain('yok-badge__content--lg')
    expect(content.classes()).toContain('yok-badge__content--with-text')
    expect(content.attributes('style')).toContain('--yok-badge-offset-x: 8px')
    expect(content.attributes('style')).toContain('--yok-badge-offset-y: -4px')
    expect(content.text()).toBe('Online')
    expect(content.attributes('aria-label')).toBe('Online status')
  })
})
