import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSearchPanel from './YSearchPanel.vue'

describe('YSearchPanel', () => {
  it('updates fields and emits search', async () => {
    const wrapper = mount(YSearchPanel, {
      props: {
        modelValue: {},
        fields: [
          { key: 'keyword', label: 'Keyword' },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [{ label: 'Stable', value: 'stable' }]
          }
        ]
      }
    })

    await wrapper.get('input').setValue('table')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ keyword: 'table' }])

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('search')?.[0]).toEqual([{}])
  })
})
