import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YFieldArray from './YFieldArray.vue'

const reviewers = [
  { name: 'Ada', role: 'Design' },
  { name: 'Lin', role: 'Docs' }
]

describe('YFieldArray', () => {
  it('renders array items through the default slot and appends cloned default items', async () => {
    const wrapper = mount(YFieldArray, {
      props: {
        modelValue: reviewers,
        title: 'Reviewers',
        description: 'People who need to approve this component.',
        addText: 'Add reviewer',
        itemLabel: 'Reviewer',
        defaultItem: { name: '', role: 'Core' }
      },
      slots: {
        default: `
          <template #default="{ item, index, update, remove }">
            <label>
              Reviewer {{ index + 1 }}
              <input :value="item.name" @input="update({ ...item, name: $event.target.value })" />
            </label>
            <button type="button" class="remove-item" @click="remove()">Remove {{ item.name }}</button>
          </template>
        `
      }
    })

    expect(wrapper.text()).toContain('Reviewers')
    expect(wrapper.text()).toContain('People who need to approve this component.')
    expect(wrapper.text()).toContain('Reviewer 1')
    expect(wrapper.text()).toContain('Remove Ada')

    await wrapper.get('.yok-field-array__add').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([
      ...reviewers,
      { name: '', role: 'Core' }
    ])
    expect(wrapper.emitted('add')?.[0][0]).toEqual({
      index: 2,
      item: { name: '', role: 'Core' },
      items: [
        ...reviewers,
        { name: '', role: 'Core' }
      ]
    })
  })

  it('updates and removes individual items while honoring min and max constraints', async () => {
    const wrapper = mount(YFieldArray, {
      props: {
        modelValue: reviewers,
        min: 1,
        max: 2,
        defaultItem: { name: '', role: '' },
        addText: 'Add reviewer',
        removeText: 'Remove reviewer'
      },
      slots: {
        default: `
          <template #default="{ item, update, remove, canRemove }">
            <input :value="item.name" @input="update({ ...item, name: $event.target.value })" />
            <button type="button" class="remove-item" :disabled="!canRemove" @click="remove()">Remove reviewer</button>
          </template>
        `
      }
    })

    expect(wrapper.get('.yok-field-array__add').attributes('disabled')).toBeDefined()

    await wrapper.get('input').setValue('Grace')

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([
      { name: 'Grace', role: 'Design' },
      reviewers[1]
    ])
    expect(wrapper.emitted('itemChange')?.[0][0]).toEqual({
      index: 0,
      item: { name: 'Grace', role: 'Design' },
      items: [
        { name: 'Grace', role: 'Design' },
        reviewers[1]
      ]
    })

    await wrapper.findAll('.remove-item')[0].trigger('click')

    expect(wrapper.emitted('remove')?.[0][0]).toEqual({
      index: 0,
      item: reviewers[0],
      items: [reviewers[1]]
    })
  })

  it('shows empty text and prevents removing below the minimum count', async () => {
    const wrapper = mount(YFieldArray, {
      props: {
        modelValue: [],
        title: 'Reviewers',
        min: 0,
        max: 1,
        emptyText: 'No reviewers yet',
        defaultItem: { name: 'New reviewer' }
      }
    })

    expect(wrapper.text()).toContain('No reviewers yet')

    await wrapper.get('.yok-field-array__add').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([{ name: 'New reviewer' }])

    await wrapper.setProps({ modelValue: [{ name: 'Only reviewer' }], min: 1 })

    expect(wrapper.get('.yok-field-array__remove').attributes('disabled')).toBeDefined()
  })

  it('uses a stable item key for rendered rows and slot payloads', async () => {
    const keyedReviewers = [
      { id: 'reviewer-ada', name: 'Ada', role: 'Design' },
      { id: 'reviewer-lin', name: 'Lin', role: 'Docs' }
    ]

    const wrapper = mount(YFieldArray, {
      props: {
        modelValue: keyedReviewers,
        itemKey: 'id',
        itemLabel: 'Reviewer'
      },
      slots: {
        default: `
          <template #default="{ itemKey }">
            <span class="row-key">{{ itemKey }}</span>
          </template>
        `
      }
    })

    expect(wrapper.findAll('.yok-field-array__item').map((item) => item.attributes('data-item-key'))).toEqual([
      'reviewer-ada',
      'reviewer-lin'
    ])
    expect(wrapper.findAll('.row-key').map((item) => item.text())).toEqual([
      'reviewer-ada',
      'reviewer-lin'
    ])

    await wrapper.setProps({ modelValue: [keyedReviewers[1]] })

    expect(wrapper.find('.yok-field-array__item').attributes('data-item-key')).toBe('reviewer-lin')
  })
})
