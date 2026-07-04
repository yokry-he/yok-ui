import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import YForm from '../form/YForm.vue'
import YFormItem from '../form-item/YFormItem.vue'
import YRadioGroup from './YRadioGroup.vue'

describe('YRadioGroup', () => {
  it('emits selected option value', async () => {
    const wrapper = mount(YRadioGroup, {
      props: {
        modelValue: 'core',
        label: 'Package',
        options: [
          { label: 'Core', value: 'core' },
          { label: 'Product', value: 'product' }
        ]
      }
    })

    await wrapper.get('input[value="product"]').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['product'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['product'])
  })

  it('supports number values, descriptions and vertical layout', async () => {
    const wrapper = mount(YRadioGroup, {
      props: {
        modelValue: 2,
        label: 'Density',
        description: 'Choose a density level.',
        direction: 'vertical',
        options: [
          { label: 'Compact', value: 1, description: 'For dense tables.' },
          { label: 'Comfortable', value: 2, description: 'For forms.' }
        ]
      }
    })

    expect(wrapper.classes()).toContain('yok-radio-group--vertical')
    expect(wrapper.text()).toContain('Choose a density level.')
    expect(wrapper.text()).toContain('For dense tables.')
    expect(wrapper.findAll('input')[1].element.checked).toBe(true)

    await wrapper.findAll('input')[0].setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('renders invalid state with accessible error wiring', () => {
    const wrapper = mount(YRadioGroup, {
      props: {
        modelValue: '',
        label: 'Package',
        options: [
          { label: 'Core', value: 'core' },
          { label: 'Product', value: 'product' }
        ],
        invalid: true,
        error: 'Choose a package.',
        ariaDescribedby: 'package-error'
      }
    })

    const fieldset = wrapper.get('fieldset')

    expect(fieldset.attributes('aria-invalid')).toBe('true')
    expect(fieldset.attributes('aria-describedby')).toBe('package-error')
    expect(wrapper.get('[role="alert"]').text()).toBe('Choose a package.')
  })

  it('participates in form item change validation', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YForm,
        YFormItem,
        YRadioGroup
      },
      setup() {
        const model = reactive<Record<string, unknown>>({
          packageName: ''
        })
        const rules = {
          packageName: { required: true, message: 'Choose a package.', trigger: 'change' as const }
        }
        const options = [
          { label: 'Core', value: 'core' },
          { label: 'Product', value: 'product' }
        ]

        function updatePackage(value: string | number, validate: (trigger: 'change') => Promise<boolean>) {
          model.packageName = value
          validate('change')
        }

        return {
          model,
          options,
          rules,
          updatePackage
        }
      },
      template: `
        <YForm :model="model" :rules="rules">
          <YFormItem prop="packageName" label="Package" v-slot="{ error, invalid, messageId, validate }">
            <YRadioGroup
              :model-value="model.packageName"
              label="Package"
              :options="options"
              :invalid="invalid"
              :aria-describedby="messageId"
              @update:model-value="updatePackage($event, validate)"
            />
            <span class="slot-error">{{ error }}</span>
          </YFormItem>
        </YForm>
      `
    }))

    const form = wrapper.getComponent(YForm)

    await form.vm.validate('change')
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('Choose a package.')
    expect(wrapper.get('fieldset[aria-invalid="true"]').exists()).toBe(true)

    await wrapper.findAll('input')[0].setValue(true)
    await nextTick()
    await nextTick()

    expect(wrapper.vm.model.packageName).toBe('core')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
