import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YDescriptions, { type YDescriptionItem } from './YDescriptions.vue'

const items: YDescriptionItem[] = [
  { label: 'Component', value: 'YDescriptions', key: 'component' },
  { label: 'Package', value: 'Core', key: 'package' },
  { label: 'Status', value: 'Beta', key: 'status' },
  { label: 'Hidden', value: 'nope', key: 'hidden', hidden: true },
  { label: 'Notes', value: 'Used for readable detail pages.', key: 'notes', span: 2 }
]

describe('YDescriptions', () => {
  it('renders description list with title and visible items', () => {
    const wrapper = mount(YDescriptions, {
      props: {
        title: 'Component details',
        description: 'Read-only metadata',
        items,
        ariaLabel: 'Component metadata'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Component metadata')
    expect(wrapper.get('dl').exists()).toBe(true)
    expect(wrapper.findAll('dt')).toHaveLength(4)
    expect(wrapper.findAll('dd')).toHaveLength(4)
    expect(wrapper.text()).toContain('Component details')
    expect(wrapper.text()).toContain('YDescriptions')
    expect(wrapper.text()).not.toContain('nope')
  })

  it('supports bordered, vertical and small variants', () => {
    const wrapper = mount(YDescriptions, {
      props: {
        items,
        bordered: true,
        layout: 'vertical',
        size: 'sm',
        column: 2
      }
    })

    expect(wrapper.classes()).toContain('yok-descriptions--bordered')
    expect(wrapper.classes()).toContain('yok-descriptions--vertical')
    expect(wrapper.classes()).toContain('yok-descriptions--sm')
    expect(wrapper.attributes('style')).toContain('--yok-descriptions-column: 2')
  })

  it('renders empty status when there are no visible items', () => {
    const wrapper = mount(YDescriptions, {
      props: {
        items: [{ label: 'Hidden', value: 'No', hidden: true }],
        emptyText: 'No metadata'
      }
    })

    expect(wrapper.get('[role="status"]').text()).toBe('No metadata')
  })

  it('supports extra and item slots', () => {
    const wrapper = mount(YDescriptions, {
      props: {
        items
      },
      slots: {
        extra: '<button type="button">Edit</button>',
        'item-status': '<strong>Stable now</strong>'
      }
    })

    expect(wrapper.text()).toContain('Edit')
    expect(wrapper.text()).toContain('Stable now')
    expect(wrapper.text()).not.toContain('Beta')
  })
})
