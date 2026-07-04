import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YList, { type YListItem } from './YList.vue'

const items: YListItem[] = [
  {
    key: 'docs',
    title: 'Documentation',
    description: 'Write examples and API tables.',
    meta: 'Core'
  },
  {
    key: 'tests',
    title: 'Tests',
    description: 'Cover semantics and slots.',
    meta: 'Quality',
    disabled: true
  }
]

describe('YList', () => {
  it('renders list semantics with header and accessible name', () => {
    const wrapper = mount(YList, {
      props: {
        items,
        title: 'Release tasks',
        description: 'Work needed before publishing.',
        ariaLabel: 'Release task list'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Release task list')
    expect(wrapper.attributes('aria-busy')).toBe('false')
    expect(wrapper.get('ul').exists()).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Release tasks')
    expect(wrapper.text()).toContain('Documentation')
    expect(wrapper.text()).toContain('Quality')
  })

  it('supports bordered, split, size, layout and grid classes', () => {
    const wrapper = mount(YList, {
      props: {
        items,
        bordered: true,
        split: false,
        size: 'lg',
        layout: 'vertical',
        columns: 2
      }
    })

    expect(wrapper.classes()).toContain('yok-list--bordered')
    expect(wrapper.classes()).not.toContain('yok-list--split')
    expect(wrapper.classes()).toContain('yok-list--lg')
    expect(wrapper.classes()).toContain('yok-list--vertical')
    expect(wrapper.classes()).toContain('yok-list--grid')
    expect(wrapper.attributes('style')).toContain('--yok-list-columns: 2')
  })

  it('uses custom item keys and marks disabled items', () => {
    const wrapper = mount(YList, {
      props: {
        items,
        itemKey: (item) => `task-${item.key}`
      }
    })

    expect(wrapper.findAll('li')[1].classes()).toContain('is-disabled')
    expect(wrapper.findAll('li')[1].attributes('aria-disabled')).toBe('true')
  })

  it('renders loading state with status semantics', () => {
    const wrapper = mount(YList, {
      props: {
        items,
        loading: true
      }
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[role="status"]').text()).toContain('Loading list')
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('renders empty state and empty slot', () => {
    const wrapper = mount(YList, {
      props: {
        items: [],
        emptyText: 'Nothing to review'
      },
      slots: {
        empty: '<span>All clear</span>'
      }
    })

    expect(wrapper.get('[role="status"]').text()).toContain('All clear')
    expect(wrapper.text()).not.toContain('Nothing to review')
  })

  it('supports item, field, action and footer slots', () => {
    const wrapper = mount(YList, {
      props: {
        items,
        title: 'Tasks'
      },
      slots: {
        extra: '<button>New</button>',
        title: '<template #title="{ item }"><span>Title {{ item.title }}</span></template>',
        description: '<template #description="{ index }"><span>Row {{ index }}</span></template>',
        actions: '<template #actions="{ item }"><button>Open {{ item.key }}</button></template>',
        footer: '<span>2 tasks</span>'
      }
    })

    expect(wrapper.text()).toContain('New')
    expect(wrapper.text()).toContain('Title Documentation')
    expect(wrapper.text()).toContain('Row 1')
    expect(wrapper.text()).toContain('Open tests')
    expect(wrapper.text()).toContain('2 tasks')
  })
})
