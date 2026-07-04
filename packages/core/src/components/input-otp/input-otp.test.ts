import { defineComponent, h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { YConfigProvider } from '../config-provider'
import YForm from '../form/YForm.vue'
import YFormItem from '../form-item/YFormItem.vue'
import YInputOtp from './YInputOtp.vue'

describe('YInputOtp', () => {
  it('splits the model value into single-character inputs and emits joined values', async () => {
    const wrapper = mount(YInputOtp, {
      props: {
        modelValue: '12',
        length: 4,
        label: 'Verification code'
      }
    })

    const inputs = wrapper.findAll('input')

    expect(inputs).toHaveLength(4)
    expect(inputs[0].element.value).toBe('1')
    expect(inputs[1].element.value).toBe('2')
    expect(inputs[0].attributes('aria-label')).toBe('Verification code digit 1')

    await inputs[2].setValue('3')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['123'])
  })

  it('moves focus through typing, arrow keys and backspace', async () => {
    const wrapper = mount(YInputOtp, {
      attachTo: document.body,
      props: {
        modelValue: '1',
        length: 4
      }
    })

    const inputs = wrapper.findAll('input')

    await inputs[1].setValue('2')
    expect(document.activeElement).toBe(inputs[2].element)

    await inputs[2].trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(inputs[1].element)

    await wrapper.setProps({ modelValue: '12' })
    await inputs[1].trigger('keydown', { key: 'Backspace' })

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1'])
    expect(document.activeElement).toBe(inputs[0].element)

    wrapper.unmount()
  })

  it('pastes sanitized content and emits complete once all digits are filled', async () => {
    const wrapper = mount(YInputOtp, {
      props: {
        modelValue: '',
        length: 4,
        mask: 'numeric'
      }
    })

    const clipboardData = {
      getData: () => 'A1 2-3 4Z'
    }

    await wrapper.get('input').trigger('paste', { clipboardData })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1234'])
    expect(wrapper.emitted('complete')?.[0]).toEqual(['1234'])
  })

  it('supports password mode, disabled state and ConfigProvider size', async () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'sm'
      },
      slots: {
        default: () => h(YInputOtp, {
          modelValue: '12',
          length: 4,
          type: 'password',
          disabled: true
        })
      }
    })

    const otp = wrapper.getComponent(YInputOtp)

    expect(otp.classes()).toContain('yok-input-otp--sm')
    expect(wrapper.get('input').attributes('type')).toBe('password')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()

    await wrapper.get('input').setValue('3')

    expect(otp.emitted('update:modelValue')).toBeUndefined()
  })

  it('participates in form item validation as a string value', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YForm,
        YFormItem,
        YInputOtp
      },
      setup() {
        const model = reactive({
          code: ''
        })
        const rules = {
          code: {
            validator: (value: string) => value.length === 4 || '请输入 4 位验证码。',
            trigger: 'change' as const
          }
        }

        function updateCode(value: string, validate: (trigger: 'change') => Promise<boolean>) {
          model.code = value
          validate('change')
        }

        return {
          model,
          rules,
          updateCode
        }
      },
      template: `
        <YForm :model="model" :rules="rules">
          <YFormItem prop="code" label="验证码" v-slot="{ error, invalid, labelFor, messageId, validate }">
            <YInputOtp
              :id="labelFor"
              :model-value="model.code"
              :length="4"
              :invalid="invalid"
              :aria-describedby="messageId"
              @update:model-value="updateCode($event, validate)"
            />
            <span class="slot-error">{{ error }}</span>
          </YFormItem>
        </YForm>
      `
    }))

    const form = wrapper.getComponent(YForm)

    await form.vm.validate('change')
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('请输入 4 位验证码。')
    expect(wrapper.get('input[aria-invalid="true"]').attributes('aria-describedby')).toContain('yok-form-message-code')

    await wrapper.findAll('input')[0].setValue('1')
    await wrapper.findAll('input')[1].setValue('2')
    await wrapper.findAll('input')[2].setValue('3')
    await wrapper.findAll('input')[3].setValue('4')
    await nextTick()
    await nextTick()

    expect(wrapper.vm.model.code).toBe('1234')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
