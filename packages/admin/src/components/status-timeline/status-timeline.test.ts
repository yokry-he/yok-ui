import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YStatusTimeline from './YStatusTimeline.vue'

const items = [
  {
    title: 'Created',
    value: 'created',
    description: 'Draft component proposal created.',
    time: '09:12',
    actor: 'Yok'
  },
  {
    title: 'Reviewing',
    value: 'reviewing',
    status: 'In review',
    tone: 'warning' as const,
    actor: 'Design system'
  },
  {
    title: 'Released',
    value: 'released',
    status: 'Pending',
    disabled: true
  }
]

describe('YStatusTimeline', () => {
  it('renders timeline items with list semantics', () => {
    const wrapper = mount(YStatusTimeline, {
      props: {
        items,
        ariaLabel: 'Release progress'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Release progress')
    expect(wrapper.get('ol').exists()).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.text()).toContain('Created')
    expect(wrapper.text()).toContain('Draft component proposal created.')
    expect(wrapper.text()).toContain('09:12')
  })

  it('marks the active item as the current step', () => {
    const wrapper = mount(YStatusTimeline, {
      props: {
        items,
        activeValue: 'reviewing'
      }
    })

    const activeItem = wrapper.findAll('li')[1]

    expect(activeItem.attributes('aria-current')).toBe('step')
    expect(activeItem.classes()).toContain('is-active')
    expect(activeItem.classes()).toContain('yok-status-timeline__item--warning')
  })

  it('supports reverse order, compact size and scoped action slot', () => {
    const wrapper = mount(YStatusTimeline, {
      props: {
        items,
        reverse: true,
        size: 'sm'
      },
      slots: {
        actions: '<template #actions="{ item }"><button>Open {{ item.value }}</button></template>'
      }
    })

    expect(wrapper.classes()).toContain('yok-status-timeline--sm')
    expect(wrapper.findAll('li')[0].text()).toContain('Released')
    expect(wrapper.text()).toContain('Open released')
  })
})
