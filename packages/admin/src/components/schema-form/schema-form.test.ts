import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import YSchemaForm from './YSchemaForm.vue'
import type { YSchemaFormField } from './YSchemaForm.vue'

const schema: YSchemaFormField[] = [
  {
    key: 'name',
    label: 'Component name',
    placeholder: 'YButton',
    required: true,
    rules: { min: 3, message: 'Name must be at least 3 characters.' }
  },
  {
    key: 'packageName',
    label: 'Package',
    type: 'select',
    required: true,
    options: [
      { label: 'Core', value: 'core' },
      { label: 'Admin', value: 'admin' }
    ]
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'Basic', value: 'basic' },
      { label: 'Custom', value: 'custom' }
    ]
  },
  {
    key: 'customReason',
    label: 'Custom reason',
    type: 'textarea',
    visibleWhen: (model) => model.category === 'custom',
    rules: {
      validator: (value, model) => model.category !== 'custom' || Boolean(value) || 'Explain the custom category.'
    }
  },
  {
    key: 'enabled',
    label: 'Enable component',
    type: 'switch'
  },
  {
    key: 'reviewers',
    label: 'Reviewers',
    type: 'array',
    itemLabel: 'Reviewer',
    addText: 'Add reviewer',
    removeText: 'Remove reviewer',
    defaultItem: { name: '', role: 'Core review' },
    itemFields: [
      { key: 'name', label: 'Reviewer name', placeholder: 'Ada', required: true },
      { key: 'role', label: 'Review role', placeholder: 'Design review', helper: 'Choose the review responsibility.' }
    ],
    min: 1,
    max: 3
  }
]

async function flushValidation() {
  await flushPromises()
  await nextTick()
}

describe('YSchemaForm', () => {
  it('renders schema fields and syncs primitive field changes into modelValue', async () => {
    const wrapper = mount(YSchemaForm, {
      props: {
        modelValue: {
          name: '',
          packageName: '',
          category: 'basic',
          customReason: '',
          enabled: false,
          reviewers: [{ name: 'Ada', role: 'Design review' }]
        },
        schema,
        title: 'Component profile'
      }
    })

    expect(wrapper.text()).toContain('Component profile')
    expect(wrapper.text()).toContain('Component name')
    expect(wrapper.text()).toContain('Package')
    expect(wrapper.text()).not.toContain('Custom reason')

    await wrapper.get('input').setValue('YTable')

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toMatchObject({
      name: 'YTable'
    })

    await wrapper.setProps({
      modelValue: {
        name: 'YTable',
        packageName: '',
        category: 'custom',
        customReason: '',
        enabled: false,
        reviewers: [{ name: 'Ada', role: 'Design review' }]
      }
    })

    expect(wrapper.text()).toContain('Custom reason')
  })

  it('uses field arrays from schema and syncs array mutations into modelValue', async () => {
    const wrapper = mount(YSchemaForm, {
      props: {
        modelValue: {
          name: 'YButton',
          packageName: 'core',
          category: 'basic',
          customReason: '',
          enabled: true,
          reviewers: [{ name: 'Ada', role: 'Design review' }]
        },
        schema,
        title: 'Component profile'
      }
    })

    expect(wrapper.text()).toContain('Reviewers')
    expect(wrapper.text()).toContain('Reviewer 1')
    expect(wrapper.text()).toContain('Reviewer name')
    expect(wrapper.text()).toContain('Choose the review responsibility.')

    const reviewerNameInput = wrapper.find('.yok-schema-form__array-field input')
    const roleInput = wrapper.findAll('.yok-schema-form__array-field input')[1]

    expect((reviewerNameInput.element as HTMLInputElement).value).toBe('Ada')
    expect(roleInput.attributes('aria-describedby')).toBe('yok-schema-form-field-reviewers-0-role-message')

    await reviewerNameInput.setValue('Grace')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatchObject({
      reviewers: [
        { name: 'Grace', role: 'Design review' }
      ]
    })

    await wrapper.get('.yok-field-array__add').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatchObject({
      reviewers: [
        { name: 'Grace', role: 'Design review' },
        { name: '', role: 'Core review' }
      ]
    })
  })

  it('passes stable item keys from schema array fields into field arrays', () => {
    const keyedSchema: YSchemaFormField[] = schema.map((field) => field.key === 'reviewers'
      ? {
        ...field,
        itemKey: 'id'
      }
      : field)

    const wrapper = mount(YSchemaForm, {
      props: {
        modelValue: {
          name: 'YButton',
          packageName: 'core',
          category: 'basic',
          customReason: '',
          enabled: true,
          reviewers: [
            { id: 'reviewer-ada', name: 'Ada', role: 'Design review' },
            { id: 'reviewer-lin', name: 'Lin', role: 'Docs review' }
          ]
        },
        schema: keyedSchema
      }
    })

    expect(wrapper.findAll('.yok-field-array__item').map((item) => item.attributes('data-item-key'))).toEqual([
      'reviewer-ada',
      'reviewer-lin'
    ])
  })

  it('submits through YForm validation and renders a clickable error summary', async () => {
    const wrapper = mount(YSchemaForm, {
      attachTo: document.body,
      props: {
        modelValue: {
          name: 'Yo',
          packageName: '',
          category: 'custom',
          customReason: '',
          enabled: false,
          reviewers: [{ name: 'Ada', role: 'Design review' }]
        },
        schema,
        title: 'Component profile',
        summaryTitle: 'Fix component profile',
        scrollToError: true
      }
    })

    await wrapper.findAll('.yok-schema-form__actions button')[0].trigger('click')
    await flushValidation()

    expect(wrapper.emitted('finishFailed')?.[0][0]).toMatchObject({
      valid: false
    })
    expect(wrapper.text()).toContain('Fix component profile')
    expect(wrapper.text()).toContain('Name must be at least 3 characters.')
    expect(wrapper.text()).toContain('Package is required.')
    expect(wrapper.text()).toContain('Explain the custom category.')

    const firstInput = wrapper.get('input').element as HTMLInputElement
    await wrapper.get('.yok-form-summary__link').trigger('click')

    expect(document.activeElement).toBe(firstInput)

    wrapper.unmount()
  })

  it('validates required fields inside schema array items', async () => {
    const wrapper = mount(YSchemaForm, {
      attachTo: document.body,
      props: {
        modelValue: {
          name: 'YButton',
          packageName: 'core',
          category: 'basic',
          customReason: '',
          enabled: true,
          reviewers: [{ name: '', role: 'Design review' }]
        },
        schema,
        title: 'Component profile',
        summaryTitle: 'Fix component profile'
      }
    })

    await wrapper.findAll('.yok-schema-form__actions button')[0].trigger('click')
    await flushValidation()

    expect(wrapper.emitted('finishFailed')?.[0][0]).toMatchObject({
      valid: false,
      errors: [
        {
          prop: 'reviewers',
          messages: ['Reviewer 1 Reviewer name is required.']
        }
      ]
    })
    expect(wrapper.text()).toContain('Reviewer 1 Reviewer name is required.')

    const reviewerInput = wrapper.get('.yok-schema-form__array-field input').element as HTMLInputElement
    const inlineError = wrapper.get('#yok-schema-form-field-reviewers-0-name-message')

    expect(inlineError.text()).toBe('Reviewer 1 Reviewer name is required.')
    expect(reviewerInput.getAttribute('aria-describedby')).toBe('yok-schema-form-field-reviewers-0-name-message')

    await wrapper.get('.yok-form-summary__link').trigger('click')

    expect(document.activeElement).toBe(reviewerInput)

    wrapper.unmount()
  })

  it('resets to initial values and clears the summary', async () => {
    const wrapper = mount(YSchemaForm, {
      props: {
        modelValue: {
          name: 'YButton',
          packageName: 'core',
          category: 'basic',
          customReason: '',
          enabled: true,
          reviewers: [{ name: 'Ada', role: 'Design review' }]
        },
        schema,
        resetText: 'Restore'
      }
    })

    await wrapper.get('input').setValue('')
    await wrapper.findAll('.yok-schema-form__actions button')[0].trigger('click')
    await flushValidation()

    expect(wrapper.text()).toContain('Component name is required.')

    await wrapper.findAll('button').find((button) => button.text() === 'Restore')?.trigger('click')

    expect(wrapper.emitted('reset')?.[0][0]).toMatchObject({
      name: 'YButton',
      packageName: 'core',
      category: 'basic',
      customReason: '',
      enabled: true,
      reviewers: [{ name: 'Ada', role: 'Design review' }]
    })
    expect(wrapper.text()).not.toContain('Component name is required.')
  })
})
