import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YAlert from './YAlert.vue'

describe('YAlert', () => {
  it('renders content and emits close', async () => {
    const wrapper = mount(YAlert, {
      props: {
        title: 'Saved',
        closable: true
      },
      slots: {
        default: 'Component updated.'
      }
    })

    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.text()).toContain('Component updated.')

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('supports assertive alerts with a custom close label', () => {
    const wrapper = mount(YAlert, {
      props: {
        title: 'Release failed',
        tone: 'danger',
        role: 'alert',
        closable: true,
        closeLabel: 'Close failure alert'
      },
      slots: {
        default: 'Fix validation errors before publishing.'
      }
    })

    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.classes()).toContain('yok-alert--danger')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Close failure alert')
    expect(wrapper.text()).toContain('Fix validation errors before publishing.')
  })

  it('renders action content, custom icon and visible close text', async () => {
    const wrapper = mount(YAlert, {
      props: {
        title: 'Invite sent',
        tone: 'success',
        variant: 'outline',
        size: 'lg',
        icon: 'ok',
        closable: true,
        closeText: 'Dismiss'
      },
      slots: {
        default: 'Review the invite status in member settings.',
        action: '<button type="button">View member</button>'
      }
    })

    expect(wrapper.classes()).toContain('yok-alert--outline')
    expect(wrapper.classes()).toContain('yok-alert--lg')
    expect(wrapper.get('.yok-alert__icon').text()).toBe('ok')
    expect(wrapper.get('.yok-alert__action').text()).toBe('View member')
    expect(wrapper.get('.yok-alert__close').text()).toBe('Dismiss')

    await wrapper.get('.yok-alert__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('can hide the icon and maps status roles to polite live regions', () => {
    const wrapper = mount(YAlert, {
      props: {
        title: 'Draft saved',
        showIcon: false,
        role: 'status'
      },
      slots: {
        default: 'The draft is safe to close.'
      }
    })

    expect(wrapper.find('.yok-alert__icon').exists()).toBe(false)
    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.attributes('aria-atomic')).toBe('true')
  })
})
