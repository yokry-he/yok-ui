import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import YForm from '../form/YForm.vue'
import YFormItem from '../form-item/YFormItem.vue'
import YSwitch from './YSwitch.vue'

describe('YSwitch', () => {
  it('emits changed checked state', async () => {
    const wrapper = mount(YSwitch, {
      props: {
        modelValue: false,
        label: 'Enable'
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
    expect(wrapper.get('button').attributes('role')).toBe('switch')
  })

  it('renders state copy, error wiring and loading state', async () => {
    const wrapper = mount(YSwitch, {
      props: {
        modelValue: false,
        label: 'Sync docs',
        description: 'Keep component docs updated.',
        activeText: 'On',
        inactiveText: 'Off',
        error: 'Enable sync before publishing.',
        ariaDescribedby: 'sync-error',
        loading: true
      }
    })

    const button = wrapper.get('button')

    expect(wrapper.text()).toContain('Sync docs')
    expect(wrapper.text()).toContain('Off')
    expect(wrapper.text()).toContain('Keep component docs updated.')
    expect(button.attributes('aria-invalid')).toBe('true')
    expect(button.attributes('aria-describedby')).toBe('sync-error')
    expect(button.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[role="alert"]').text()).toBe('Enable sync before publishing.')

    await button.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('participates in form item change validation', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YForm,
        YFormItem,
        YSwitch
      },
      setup() {
        const model = reactive<Record<string, unknown>>({
          confirmed: false
        })
        const rules = {
          confirmed: {
            validator: (value: unknown) => value === true || 'Enable release confirmation.',
            trigger: 'change' as const
          }
        }

        function updateConfirmed(value: boolean, validate: (trigger: 'change') => Promise<boolean>) {
          model.confirmed = value
          validate('change')
        }

        return {
          model,
          rules,
          updateConfirmed
        }
      },
      template: `
        <YForm :model="model" :rules="rules">
          <YFormItem prop="confirmed" label="Release confirmation" v-slot="{ error, invalid, messageId, validate }">
            <YSwitch
              :model-value="model.confirmed"
              label="Allow release"
              :invalid="invalid"
              :aria-describedby="messageId"
              @update:model-value="updateConfirmed($event, validate)"
            />
            <span class="slot-error">{{ error }}</span>
          </YFormItem>
        </YForm>
      `
    }))

    const form = wrapper.getComponent(YForm)

    await form.vm.validate('change')
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('Enable release confirmation.')
    expect(wrapper.get('button[aria-invalid="true"]').exists()).toBe(true)

    await wrapper.get('button').trigger('click')
    await nextTick()
    await nextTick()

    expect(wrapper.vm.model.confirmed).toBe(true)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
