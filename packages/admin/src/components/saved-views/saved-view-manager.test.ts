import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSavedViewManager, {
  type YSavedViewManagerPayload
} from './YSavedViewManager.vue'
import type { YSavedViewItem } from './YSavedViews.vue'

const views: YSavedViewItem[] = [
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
    description: 'Core components marked stable',
    count: 18
  },
  {
    label: 'Archived',
    value: 'archived',
    disabled: true
  }
]

describe('YSavedViewManager', () => {
  it('renders editable saved views and default state', () => {
    const wrapper = mount(YSavedViewManager, {
      props: {
        modelValue: 'release',
        defaultValue: 'stable',
        items: views,
        ariaLabel: 'Manage component views'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Manage component views')
    expect(wrapper.text()).toContain('Manage saved views')
    expect(wrapper.text()).toContain('Release queue')
    expect(wrapper.text()).toContain('Beta components ready for review')
    expect(wrapper.text()).toContain('Current')
    expect(wrapper.text()).toContain('Default')
  })

  it('renames and edits a saved view description through update:items', async () => {
    const wrapper = mount(YSavedViewManager, {
      props: {
        modelValue: 'release',
        items: views
      }
    })

    const inputs = wrapper.findAllComponents({ name: 'YInput' })
    const textareas = wrapper.findAllComponents({ name: 'YTextarea' })

    await inputs[0].vm.$emit('update:modelValue', 'Release candidates')
    await textareas[0].vm.$emit('update:modelValue', 'Ready for final QA')

    expect(wrapper.emitted('rename')?.[0]).toEqual([
      {
        item: views[0],
        label: 'Release candidates'
      }
    ])
    expect(wrapper.emitted('descriptionChange')?.[0]).toEqual([
      {
        item: views[0],
        description: 'Ready for final QA'
      }
    ])
    expect(wrapper.emitted('update:items')?.[1]).toEqual([
      [
        { ...views[0], description: 'Ready for final QA' },
        views[1],
        views[2]
      ]
    ])
  })

  it('toggles pinned state and sets the default view', async () => {
    const wrapper = mount(YSavedViewManager, {
      props: {
        modelValue: 'release',
        defaultValue: 'stable',
        items: views
      }
    })

    await wrapper.findAllComponents({ name: 'YCheckbox' })[1].vm.$emit('update:modelValue', true)
    await wrapper.findAll('.yok-saved-view-manager__default-action')[0].trigger('click')

    expect(wrapper.emitted('pinChange')?.[0]).toEqual([
      {
        item: views[1],
        pinned: true
      }
    ])
    expect(wrapper.emitted('update:defaultValue')?.[0]).toEqual(['release'])
    expect(wrapper.emitted('setDefault')?.[0]).toEqual([views[0]])
  })

  it('duplicates and deletes views while preserving disabled rows', async () => {
    const wrapper = mount(YSavedViewManager, {
      props: {
        modelValue: 'release',
        defaultValue: 'stable',
        items: views
      }
    })

    await wrapper.findAll('.yok-saved-view-manager__duplicate')[0].trigger('click')
    await wrapper.findAll('.yok-saved-view-manager__delete')[1].trigger('click')
    await wrapper.findAll('.yok-saved-view-manager__delete')[2].trigger('click')

    const duplicatePayload = wrapper.emitted('duplicate')?.[0]?.[0] as YSavedViewManagerPayload

    expect(duplicatePayload.item).toEqual(views[0])
    expect(duplicatePayload.items).toHaveLength(4)
    expect(duplicatePayload.items[1]).toMatchObject({
      label: 'Release queue copy',
      value: 'release-copy'
    })
    expect(wrapper.emitted('delete')?.[0]).toEqual([views[1]])
    expect(wrapper.emitted('delete')?.[1]).toBeUndefined()
    expect(wrapper.emitted('update:items')?.at(-1)).toEqual([[views[0], views[2]]])
  })

  it('emits save and create actions with the current manager state', async () => {
    const wrapper = mount(YSavedViewManager, {
      props: {
        modelValue: 'release',
        defaultValue: 'stable',
        items: views
      }
    })

    await wrapper.find('.yok-saved-view-manager__create').trigger('click')
    await wrapper.find('.yok-saved-view-manager__save').trigger('click')

    expect(wrapper.emitted('create')).toHaveLength(1)
    expect(wrapper.emitted('save')?.[0]).toEqual([
      {
        items: views,
        activeValue: 'release',
        defaultValue: 'stable'
      }
    ])
  })
})
