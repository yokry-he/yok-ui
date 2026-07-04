import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSearchForm, { type YSearchFormField } from './YSearchForm.vue'

const fields: YSearchFormField[] = [
  { key: 'keyword', label: 'Keyword', placeholder: 'Search component' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [{ label: 'Stable', value: 'stable' }]
  },
  { key: 'owner', label: 'Owner' },
  { key: 'package', label: 'Package' }
]

describe('YSearchForm', () => {
  it('renders visible fields and collapses extra filters by default', () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: { keyword: 'table' },
        fields,
        title: 'Advanced search',
        collapsedCount: 2
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Search form')
    expect(wrapper.text()).toContain('Advanced search')
    expect(wrapper.text()).toContain('1 filter applied')
    expect(wrapper.text()).toContain('Keyword')
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).not.toContain('Owner')
  })

  it('expands and emits collapse changes', async () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: {},
        fields,
        collapsedCount: 2
      }
    })

    await wrapper.findAllComponents({ name: 'YButton' })[2].trigger('click')

    expect(wrapper.emitted('collapseChange')?.[0]).toEqual([false])
    expect(wrapper.text()).toContain('Owner')
  })

  it('updates fields and emits search payload', async () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: {},
        fields,
        collapsible: false
      }
    })

    await wrapper.get('input').setValue('table')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ keyword: 'table' }])

    await wrapper.setProps({ modelValue: { keyword: 'table', status: 'stable' } })
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('search')?.[0]).toEqual([
      {
        values: { keyword: 'table', status: 'stable' },
        activeFieldKeys: ['keyword', 'status']
      }
    ])
  })

  it('resets to field defaults', async () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: { keyword: 'table', status: 'stable' },
        fields: [
          { key: 'keyword', label: 'Keyword' },
          { key: 'status', label: 'Status', defaultValue: 'beta' }
        ]
      }
    })

    await wrapper.findAllComponents({ name: 'YButton' })[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ status: 'beta' }])
    expect(wrapper.emitted('reset')?.[0]).toEqual([{ status: 'beta' }])
  })

  it('supports custom field and action slots', () => {
    const wrapper = mount(YSearchForm, {
      props: {
        modelValue: { keyword: 'table' },
        fields,
        collapsible: false
      },
      slots: {
        'field-keyword': '<label>Custom keyword<input value="table" /></label>',
        actions: '<button type="button">Save filter</button>'
      }
    })

    expect(wrapper.text()).toContain('Custom keyword')
    expect(wrapper.text()).toContain('Save filter')
    expect(wrapper.text()).not.toContain('Search component')
  })
})
