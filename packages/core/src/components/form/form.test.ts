import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, reactive } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import YForm from './YForm.vue'
import { getFormValue, setFormValue, validateForm } from './form'
import YFormItem from '../form-item/YFormItem.vue'

describe('YForm validation helpers', () => {
  it('validates required, length, pattern and custom rules', async () => {
    const model = {
      name: '',
      packageName: 'core',
      profile: {
        email: 'wrong'
      }
    }

    const result = await validateForm(model, {
      name: { required: true, message: 'Name is required.' },
      packageName: { min: 5, message: 'Package name is too short.' },
      'profile.email': { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email is invalid.' },
      slug: {
        validator: () => 'Slug is reserved.'
      }
    })

    expect(result.valid).toBe(false)
    expect(result.errors.map((error) => error.prop)).toEqual(['name', 'packageName', 'profile.email', 'slug'])
    expect(result.errors[0].messages).toEqual(['Name is required.'])
  })

  it('reads and writes nested model values', () => {
    const model = {
      profile: {
        email: 'hello@yok.dev'
      }
    }

    expect(getFormValue(model, 'profile.email')).toBe('hello@yok.dev')
    setFormValue(model, 'profile.email', 'hi@yok.dev')
    expect(getFormValue(model, 'profile.email')).toBe('hi@yok.dev')
  })
})

describe('YForm', () => {
  it('validates registered fields and exposes field errors to form items', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YForm,
        YFormItem
      },
      setup() {
        const model = reactive<Record<string, unknown>>({
          name: ''
        })
        const rules = {
          name: { required: true, message: 'Component name is required.' }
        }

        return {
          model,
          rules
        }
      },
      template: `
        <YForm :model="model" :rules="rules">
          <YFormItem prop="name" label="Component name" v-slot="{ error, invalid, labelFor, messageId }">
            <input :id="labelFor" v-model="model.name" :aria-invalid="String(invalid)" :aria-describedby="messageId" />
            <span class="slot-error">{{ error }}</span>
          </YFormItem>
        </YForm>
      `
    }))

    const form = wrapper.getComponent(YForm)
    const result = await form.vm.validate()
    await nextTick()

    expect(result.valid).toBe(false)
    expect(wrapper.get('[role="alert"]').text()).toBe('Component name is required.')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('yok-form-message-name')
    expect(wrapper.get('.slot-error').text()).toBe('Component name is required.')
  })

  it('resets model values and clears validation messages', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YForm,
        YFormItem
      },
      setup() {
        const model = reactive<Record<string, unknown>>({
          name: 'YButton'
        })
        const rules = {
          name: { min: 4, message: 'Name is too short.' }
        }

        return {
          model,
          rules
        }
      },
      template: `
        <YForm :model="model" :rules="rules">
          <YFormItem prop="name" label="Component name">
            <input v-model="model.name" />
          </YFormItem>
        </YForm>
      `
    }))

    const form = wrapper.getComponent(YForm)

    wrapper.vm.model.name = 'Yo'
    await form.vm.validate()
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('Name is too short.')

    form.vm.resetFields()
    await nextTick()

    expect(wrapper.vm.model.name).toBe('YButton')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('emits submit result after preventing native submit', async () => {
    const model = reactive<Record<string, unknown>>({
      name: 'YTable'
    })
    const wrapper = mount(YForm, {
      props: {
        model,
        rules: {
          name: { required: true }
        }
      },
      slots: {
        default: '<button type="submit">Save</button>'
      }
    })

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')?.[0][0]).toEqual({
      valid: true,
      errors: []
    })
  })

  it('scrolls to a registered field on demand', () => {
    const wrapper = mount(defineComponent({
      components: {
        YForm,
        YFormItem
      },
      setup() {
        const model = reactive<Record<string, unknown>>({
          name: 'YButton'
        })

        return {
          model
        }
      },
      template: `
        <YForm :model="model">
          <YFormItem prop="name" label="Component name">
            <input v-model="model.name" />
          </YFormItem>
        </YForm>
      `
    }), {
      attachTo: document.body
    })
    const item = wrapper.get('.yok-form-item').element as HTMLElement
    const scrollIntoView = vi.fn()

    item.scrollIntoView = scrollIntoView

    const form = wrapper.getComponent(YForm)
    const scrolled = form.vm.scrollToField('name', { block: 'nearest', behavior: 'auto' })

    expect(scrolled).toBe(true)
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', behavior: 'auto' })

    wrapper.unmount()
  })

  it('scrolls to the first invalid field when scrollToError is enabled', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YForm,
        YFormItem
      },
      setup() {
        const model = reactive<Record<string, unknown>>({
          name: '',
          packageName: ''
        })
        const rules = {
          name: { required: true, message: 'Name is required.' },
          packageName: { required: true, message: 'Package is required.' }
        }

        return {
          model,
          rules
        }
      },
      template: `
        <YForm :model="model" :rules="rules" scroll-to-error>
          <YFormItem prop="name" label="Component name">
            <input v-model="model.name" />
          </YFormItem>
          <YFormItem prop="packageName" label="Package">
            <input v-model="model.packageName" />
          </YFormItem>
        </YForm>
      `
    }), {
      attachTo: document.body
    })
    const [nameItem, packageItem] = wrapper.findAll('.yok-form-item').map((item) => item.element as HTMLElement)
    const nameScrollIntoView = vi.fn()
    const packageScrollIntoView = vi.fn()

    nameItem.scrollIntoView = nameScrollIntoView
    packageItem.scrollIntoView = packageScrollIntoView

    const form = wrapper.getComponent(YForm)
    const result = await form.vm.validate()

    expect(result.valid).toBe(false)
    expect(nameScrollIntoView).toHaveBeenCalledTimes(1)
    expect(packageScrollIntoView).not.toHaveBeenCalled()

    wrapper.unmount()
  })
})
