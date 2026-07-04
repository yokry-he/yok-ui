import { defineComponent, h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YInputTag from './YInputTag.vue'
import { YConfigProvider } from '../config-provider'
import YForm from '../form/YForm.vue'
import YFormItem from '../form-item/YFormItem.vue'

describe('YInputTag', () => {
  it('adds trimmed tags with Enter and emits v-model plus add/change events', async () => {
    const wrapper = mount(YInputTag, {
      props: {
        modelValue: ['Vue'],
        inputValue: '',
        label: 'Skills',
        placeholder: 'Add skill'
      }
    })

    const input = wrapper.get('input')
    await input.setValue('  TypeScript  ')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['Vue', 'TypeScript']])
    expect(wrapper.emitted('update:inputValue')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('add')?.[0]).toEqual(['TypeScript'])
    expect(wrapper.emitted('change')?.[0]).toEqual([['Vue', 'TypeScript']])
    expect(wrapper.get('.yok-input-tag__tag').text()).toContain('Vue')
    expect(input.attributes('aria-label')).toBe('Skills')
  })

  it('prevents duplicates, max count overflow and custom validation failures', async () => {
    const wrapper = mount(YInputTag, {
      props: {
        modelValue: ['Vue', 'Vite'],
        inputValue: '',
        max: 2,
        allowDuplicate: false,
        validateTag: (value: string) => value.startsWith('Y') || 'Tags should start with Y.'
      }
    })

    const input = wrapper.get('input')

    await input.setValue('Vue')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('invalid')?.[0]).toEqual([{
      reason: 'duplicate',
      value: 'Vue',
      message: 'Tag already exists.'
    }])

    await wrapper.setProps({ modelValue: ['Vue'] })
    await input.setValue('React')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('invalid')?.at(-1)).toEqual([{
      reason: 'validator',
      value: 'React',
      message: 'Tags should start with Y.'
    }])

    await wrapper.setProps({ modelValue: ['Yok', 'YUI'] })
    await input.setValue('YDocs')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('invalid')?.at(-1)).toEqual([{
      reason: 'max',
      value: 'YDocs',
      message: 'Maximum 2 tags.'
    }])
  })

  it('removes tags through close button and Backspace on empty input', async () => {
    const wrapper = mount(YInputTag, {
      props: {
        modelValue: ['Core', 'Admin'],
        inputValue: ''
      }
    })

    await wrapper.get('button[aria-label="Remove Core"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['Admin']])
    expect(wrapper.emitted('remove')?.[0]).toEqual(['Core'])

    await wrapper.setProps({ modelValue: ['Core', 'Admin'] })
    await wrapper.get('input').trigger('keydown', { key: 'Backspace' })

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['Core']])
    expect(wrapper.emitted('remove')?.at(-1)).toEqual(['Admin'])
  })

  it('respects disabled and ConfigProvider size state', async () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'sm'
      },
      slots: {
        default: () => h(YInputTag, {
          modelValue: ['Locked'],
          inputValue: 'New',
          disabled: true
        })
      }
    })

    expect(wrapper.find('.yok-input-tag').classes()).toContain('yok-input-tag--sm')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()

    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.findComponent(YInputTag).emitted('update:modelValue')).toBeUndefined()
  })

  it('participates in form item validation with array values', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YForm,
        YFormItem,
        YInputTag
      },
      setup() {
        const model = reactive<{ tags: string[] }>({
          tags: []
        })
        const rules = {
          tags: {
            validator: (value: string[]) => value.length > 0 || 'At least one tag is required.',
            trigger: 'change' as const
          }
        }

        function updateTags(value: string[], validate: (trigger: 'change') => Promise<boolean>) {
          model.tags = value
          validate('change')
        }

        return {
          model,
          rules,
          updateTags
        }
      },
      template: `
        <YForm :model="model" :rules="rules">
          <YFormItem prop="tags" label="Tags" v-slot="{ error, invalid, labelFor, messageId, validate }">
            <YInputTag
              :id="labelFor"
              :model-value="model.tags"
              placeholder="Add tag"
              :invalid="invalid"
              :aria-describedby="messageId"
              @update:model-value="updateTags($event, validate)"
            />
            <span class="slot-error">{{ error }}</span>
          </YFormItem>
        </YForm>
      `
    }))

    const form = wrapper.getComponent(YForm)

    await form.vm.validate('change')
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('At least one tag is required.')
    expect(wrapper.get('input[aria-invalid="true"]').attributes('aria-describedby')).toContain('yok-form-message-tags')

    await wrapper.get('input').setValue('Core')
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    await nextTick()
    await nextTick()

    expect(wrapper.vm.model.tags).toEqual(['Core'])
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
