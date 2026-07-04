import { defineComponent, h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import YInput from './YInput.vue'
import { YConfigProvider } from '../config-provider'
import YForm from '../form/YForm.vue'
import YFormItem from '../form-item/YFormItem.vue'

describe('YInput', () => {
  it('supports v-model and error text', async () => {
    const wrapper = mount(YInput, {
      props: {
        modelValue: 'hello',
        label: 'Name',
        error: 'Name is required'
      }
    })

    const input = wrapper.get('input')
    await input.setValue('yok')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yok'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['yok'])
    expect(wrapper.text()).toContain('Name is required')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[role="alert"]').text()).toBe('Name is required')
  })

  it('supports external form ids and invalid state', () => {
    const wrapper = mount(YInput, {
      props: {
        id: 'field-name',
        invalid: true,
        ariaDescribedby: 'field-name-message'
      }
    })

    const input = wrapper.get('input')
    expect(input.attributes('id')).toBe('field-name')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('field-name-message')
    expect(wrapper.find('.yok-input__error').exists()).toBe(false)
  })

  it('renders affixes, count and clearable action', async () => {
    const wrapper = mount(YInput, {
      props: {
        modelValue: 'Yok',
        label: 'Search',
        placeholder: 'Search components',
        prefixText: '/',
        suffixText: 'core',
        clearable: true,
        showCount: true,
        maxlength: 12,
        type: 'search'
      }
    })

    const input = wrapper.get('input')

    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('maxlength')).toBe('12')
    expect(input.attributes('aria-label')).toBe('Search')
    expect(wrapper.text()).toContain('/')
    expect(wrapper.text()).toContain('core')
    expect(wrapper.text()).toContain('3/12')

    await wrapper.get('.yok-input__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('toggles password visibility without changing the bound value', async () => {
    const wrapper = mount(YInput, {
      props: {
        modelValue: 'secret-token',
        type: 'password',
        label: 'Access token',
        showPassword: true
      }
    })

    const input = wrapper.get('input')
    const toggle = wrapper.get('.yok-input__password-toggle')

    expect(input.attributes('type')).toBe('password')
    expect(toggle.attributes('aria-pressed')).toBe('false')
    expect(toggle.attributes('aria-label')).toBe('Show password')

    await toggle.trigger('click')

    expect(wrapper.get('input').attributes('type')).toBe('text')
    expect(wrapper.get('.yok-input__password-toggle').attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('.yok-input__password-toggle').attributes('aria-label')).toBe('Hide password')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('uses ConfigProvider size when no explicit size is provided', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'sm'
      },
      slots: {
        default: () => h(YInput, { label: 'Token' })
      }
    })

    expect(wrapper.find('.yok-input').classes()).toContain('yok-input--sm')
  })

  it('participates in form item change validation', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YForm,
        YFormItem,
        YInput
      },
      setup() {
        const model = reactive<Record<string, string>>({
          name: ''
        })
        const rules = {
          name: {
            validator: (value: string) => value.trim().length > 0 || 'Component name is required.',
            trigger: 'change' as const
          }
        }

        function updateName(value: string, validate: (trigger: 'change') => Promise<boolean>) {
          model.name = value
          validate('change')
        }

        return {
          model,
          rules,
          updateName
        }
      },
      template: `
        <YForm :model="model" :rules="rules">
          <YFormItem prop="name" label="Component name" v-slot="{ error, invalid, labelFor, messageId, validate }">
            <YInput
              :id="labelFor"
              :model-value="model.name"
              placeholder="YButton"
              :invalid="invalid"
              :aria-describedby="messageId"
              @update:model-value="updateName($event, validate)"
            />
            <span class="slot-error">{{ error }}</span>
          </YFormItem>
        </YForm>
      `
    }))

    const form = wrapper.getComponent(YForm)

    await form.vm.validate('change')
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('Component name is required.')
    expect(wrapper.get('input[aria-invalid="true"]').attributes('aria-describedby')).toContain('yok-form-message-name')

    await wrapper.get('input').setValue('YInput')
    await nextTick()
    await nextTick()

    expect(wrapper.vm.model.name).toBe('YInput')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})

describe('YInput source styles', () => {
  it('keeps the password toggle at a stable compact width', () => {
    const source = readFileSync(resolve(__dirname, 'YInput.vue'), 'utf8')

    expect(source).toContain('.yok-input__password-toggle')
    expect(source).toContain('width: 48px;')
  })
})
