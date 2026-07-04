import { defineComponent, h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { YBadge, YCheckTag, YTag } from './index'
import { YConfigProvider } from '../config-provider'
import YForm from '../form/YForm.vue'
import YFormItem from '../form-item/YFormItem.vue'

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

  it('toggles check tag as a controlled pressed button', async () => {
    const wrapper = mount(YCheckTag, {
      props: {
        checked: false,
        tone: 'success',
        label: 'Core package'
      },
      slots: {
        default: 'Core'
      }
    })

    const button = wrapper.get('button')

    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.attributes('aria-label')).toBe('Core package')
    expect(button.classes()).toContain('yok-check-tag--success')

    await button.trigger('click')

    expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('keeps disabled check tags inert and uses ConfigProvider size', async () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'sm'
      },
      slots: {
        default: () => h(YCheckTag, {
          checked: true,
          disabled: true
        }, () => 'Locked')
      }
    })

    const checkTag = wrapper.getComponent(YCheckTag)
    const button = wrapper.get('button')

    expect(button.classes()).toContain('yok-check-tag--sm')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')

    expect(checkTag.emitted('update:checked')).toBeUndefined()
  })

  it('participates in form item validation as a boolean choice', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YCheckTag,
        YForm,
        YFormItem
      },
      setup() {
        const model = reactive({
          accepted: false
        })
        const rules = {
          accepted: {
            validator: (value: boolean) => value || '请选择至少一个发布范围。',
            trigger: 'change' as const
          }
        }

        function updateAccepted(value: boolean, validate: (trigger: 'change') => Promise<boolean>) {
          model.accepted = value
          validate('change')
        }

        return {
          model,
          rules,
          updateAccepted
        }
      },
      template: `
        <YForm :model="model" :rules="rules">
          <YFormItem prop="accepted" label="Scope" v-slot="{ error, invalid, messageId, validate }">
            <YCheckTag
              :checked="model.accepted"
              :invalid="invalid"
              :aria-describedby="messageId"
              @update:checked="updateAccepted($event, validate)"
            >
              Core
            </YCheckTag>
            <span class="slot-error">{{ error }}</span>
          </YFormItem>
        </YForm>
      `
    }))

    const form = wrapper.getComponent(YForm)

    await form.vm.validate('change')
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('请选择至少一个发布范围。')
    expect(wrapper.get('button[aria-invalid="true"]').attributes('aria-describedby')).toContain('yok-form-message-accepted')

    await wrapper.get('button').trigger('click')
    await nextTick()
    await nextTick()

    expect(wrapper.vm.model.accepted).toBe(true)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
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
