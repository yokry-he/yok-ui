import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import YForm from '../form/YForm.vue'
import YFormItem from '../form-item/YFormItem.vue'
import YCheckbox from './YCheckbox.vue'
import YCheckboxGroup from './YCheckboxGroup.vue'

describe('YCheckbox', () => {
  it('supports v-model and label', async () => {
    const wrapper = mount(YCheckbox, {
      props: {
        modelValue: false,
        label: 'Accept terms'
      }
    })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.text()).toContain('Accept terms')
  })

  it('renders an accessible indeterminate state', async () => {
    const wrapper = mount(YCheckbox, {
      props: {
        modelValue: false,
        indeterminate: true,
        label: 'Select all components'
      }
    })

    const input = wrapper.get<HTMLInputElement>('input')

    expect(input.element.indeterminate).toBe(true)
    expect(input.attributes('aria-checked')).toBe('mixed')
    expect(wrapper.get('.yok-checkbox__check svg').exists()).toBe(true)

    await input.setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })
})

describe('YCheckboxGroup', () => {
  const options = [
    { label: 'Core', value: 'core', description: 'Base components' },
    { label: 'Product', value: 'product' },
    { label: 'Admin', value: 'admin', disabled: true }
  ]

  it('manages an array v-model with labelled fieldset semantics', async () => {
    const wrapper = mount(YCheckboxGroup, {
      props: {
        modelValue: ['core'],
        label: 'Packages',
        description: 'Choose packages for this release.',
        options
      }
    })

    expect(wrapper.get('fieldset').exists()).toBe(true)
    expect(wrapper.get('legend').text()).toBe('Packages')
    expect(wrapper.text()).toContain('Choose packages for this release.')
    expect(wrapper.findAllComponents(YCheckbox)).toHaveLength(3)
    expect(wrapper.findAll('input')[0].element.checked).toBe(true)

    await wrapper.findAll('input')[1].setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['core', 'product']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['core', 'product']])
  })

  it('enforces min, max and disabled options', async () => {
    const wrapper = mount(YCheckboxGroup, {
      props: {
        modelValue: ['core'],
        options,
        min: 1,
        max: 1
      }
    })

    const inputs = wrapper.findAll('input')

    expect(inputs[0].attributes('disabled')).toBeDefined()
    expect(inputs[1].attributes('disabled')).toBeDefined()
    expect(inputs[2].attributes('disabled')).toBeDefined()

    await wrapper.setProps({ modelValue: [] })

    const nextInputs = wrapper.findAll('input')
    expect(nextInputs[0].attributes('disabled')).toBeUndefined()
    expect(nextInputs[1].attributes('disabled')).toBeUndefined()
    expect(nextInputs[2].attributes('disabled')).toBeDefined()
  })

  it('renders invalid state with accessible error wiring', () => {
    const wrapper = mount(YCheckboxGroup, {
      props: {
        modelValue: [],
        label: 'Packages',
        options,
        invalid: true,
        error: 'Choose at least one package.',
        ariaDescribedby: 'package-error'
      }
    })

    const fieldset = wrapper.get('fieldset')

    expect(fieldset.attributes('aria-invalid')).toBe('true')
    expect(fieldset.attributes('aria-describedby')).toBe('package-error')
    expect(wrapper.get('[role="alert"]').text()).toBe('Choose at least one package.')
  })

  it('participates in form item change validation', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YCheckboxGroup,
        YForm,
        YFormItem
      },
      setup() {
        const model = reactive<Record<string, unknown>>({
          packages: []
        })
        const rules = {
          packages: { required: true, message: 'Choose at least one package.', trigger: 'change' as const }
        }

        function updatePackages(value: Array<string | number>, validate: (trigger: 'change') => Promise<boolean>) {
          model.packages = value
          validate('change')
        }

        return {
          model,
          options,
          rules,
          updatePackages
        }
      },
      template: `
        <YForm :model="model" :rules="rules">
          <YFormItem prop="packages" label="Packages" v-slot="{ error, invalid, messageId, validate }">
            <YCheckboxGroup
              :model-value="model.packages"
              label="Release packages"
              :options="options"
              :invalid="invalid"
              :aria-describedby="messageId"
              @update:model-value="updatePackages($event, validate)"
            />
            <span class="slot-error">{{ error }}</span>
          </YFormItem>
        </YForm>
      `
    }))

    const form = wrapper.getComponent(YForm)

    await form.vm.validate('change')
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('Choose at least one package.')
    expect(wrapper.get('fieldset[aria-invalid="true"]').exists()).toBe(true)

    await wrapper.findAll('input')[0].setValue(true)
    await nextTick()
    await nextTick()

    expect(wrapper.vm.model.packages).toEqual(['core'])
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.find('.slot-error').text()).toBe('')
  })
})
