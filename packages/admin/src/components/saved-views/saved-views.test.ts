import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSavedViews from './YSavedViews.vue'

const views = [
  {
    label: 'Release queue',
    value: 'release',
    description: 'Beta components ready for review',
    count: 8,
    pinned: true
  },
  {
    label: 'Stable core',
    value: 'stable',
    count: 18
  },
  {
    label: 'Archived',
    value: 'archived',
    disabled: true
  }
]

describe('YSavedViews', () => {
  it('renders saved view groups and active state', () => {
    const wrapper = mount(YSavedViews, {
      props: {
        modelValue: 'release',
        items: views,
        ariaLabel: 'Component saved views'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Component saved views')
    expect(wrapper.text()).toContain('Pinned')
    expect(wrapper.text()).toContain('Release queue')
    expect(wrapper.text()).toContain('Beta components ready for review')
    expect(wrapper.text()).toContain('8')
    expect(wrapper.get('button[aria-pressed="true"]').text()).toContain('Release queue')
  })

  it('emits model updates and change payload when a view is selected', async () => {
    const wrapper = mount(YSavedViews, {
      props: {
        modelValue: 'release',
        items: views
      }
    })

    await wrapper.findAll('.yok-saved-views__item')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['stable'])
    expect(wrapper.emitted('change')?.[0]).toEqual([views[1]])
  })

  it('does not emit selection for disabled views', async () => {
    const wrapper = mount(YSavedViews, {
      props: {
        modelValue: 'release',
        items: views
      }
    })

    await wrapper.findAll('.yok-saved-views__item')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('emits save, create and manage actions', async () => {
    const wrapper = mount(YSavedViews, {
      props: {
        modelValue: 'release',
        items: views
      }
    })

    await wrapper.get('.yok-saved-views__save').trigger('click')
    await wrapper.findAll('.yok-saved-views__link')[0].trigger('click')
    await wrapper.findAll('.yok-saved-views__link')[1].trigger('click')

    expect(wrapper.emitted('save')).toHaveLength(1)
    expect(wrapper.emitted('create')).toHaveLength(1)
    expect(wrapper.emitted('manage')).toHaveLength(1)
  })

  it('renders an empty status when no views exist', () => {
    const wrapper = mount(YSavedViews, {
      props: {
        modelValue: '',
        items: [],
        emptyText: 'Create your first view'
      }
    })

    expect(wrapper.get('[role="status"]').text()).toContain('Create your first view')
  })
})
