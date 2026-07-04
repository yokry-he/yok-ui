import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YTimeline, { type YTimelineItem } from './YTimeline.vue'

const items: YTimelineItem[] = [
  {
    title: 'Created',
    value: 'created',
    description: 'Initial component proposal.',
    time: '09:12',
    tone: 'success'
  },
  {
    title: 'Reviewed',
    value: 'reviewed',
    description: 'API and accessibility reviewed.',
    time: '10:30',
    tone: 'warning'
  },
  {
    title: 'Published',
    value: 'published',
    disabled: true
  }
]

describe('YTimeline', () => {
  it('renders timeline items with ordered list semantics', () => {
    const wrapper = mount(YTimeline, {
      props: {
        items,
        title: 'Release log',
        description: 'Component lifecycle events.',
        ariaLabel: 'Component release log'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Component release log')
    expect(wrapper.get('ol').exists()).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.text()).toContain('Release log')
    expect(wrapper.text()).toContain('Initial component proposal.')
    expect(wrapper.text()).toContain('09:12')
  })

  it('supports reverse order, alternate placement and compact size', () => {
    const wrapper = mount(YTimeline, {
      props: {
        items,
        reverse: true,
        placement: 'alternate',
        size: 'sm'
      }
    })

    expect(wrapper.classes()).toContain('yok-timeline--alternate')
    expect(wrapper.classes()).toContain('yok-timeline--sm')
    expect(wrapper.findAll('li')[0].text()).toContain('Published')
    expect(wrapper.findAll('li')[1].classes()).toContain('is-left')
  })

  it('applies tone and disabled classes', () => {
    const wrapper = mount(YTimeline, {
      props: {
        items
      }
    })

    expect(wrapper.findAll('li')[0].classes()).toContain('yok-timeline__item--success')
    expect(wrapper.findAll('li')[1].classes()).toContain('yok-timeline__item--warning')
    expect(wrapper.findAll('li')[2].classes()).toContain('is-disabled')
    expect(wrapper.findAll('li')[2].attributes('aria-disabled')).toBe('true')
  })

  it('marks loading timeline nodes with busy semantics', () => {
    const wrapper = mount(YTimeline, {
      props: {
        items: [
          ...items,
          {
            title: 'Recording...',
            value: 'recording',
            description: 'The release job is still writing timeline output.',
            time: '12:40',
            loading: true
          }
        ]
      }
    })

    const loadingItem = wrapper.findAll('li')[3]

    expect(loadingItem.classes()).toContain('is-loading')
    expect(loadingItem.attributes('aria-busy')).toBe('true')
    expect(loadingItem.text()).toContain('Recording...')
  })

  it('supports dot, item and action slots', () => {
    const wrapper = mount(YTimeline, {
      props: {
        items
      },
      slots: {
        dot: '<span>*</span>',
        item: '<template #item="{ item }"><small>Value {{ item.value }}</small></template>',
        actions: '<template #actions="{ item }"><button>Open {{ item.value }}</button></template>'
      }
    })

    expect(wrapper.text()).toContain('*')
    expect(wrapper.text()).toContain('Value created')
    expect(wrapper.text()).toContain('Open reviewed')
  })
})
