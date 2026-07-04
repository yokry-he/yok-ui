import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YStatistic from './YStatistic.vue'

describe('YStatistic', () => {
  it('renders title, value, prefix, suffix and accessible name', () => {
    const wrapper = mount(YStatistic, {
      props: {
        title: 'Active users',
        value: 112893,
        prefix: '+',
        suffix: 'people',
        ariaLabel: 'Active user count'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Active user count')
    expect(wrapper.attributes('aria-busy')).toBe('false')
    expect(wrapper.get('.yok-statistic__content').attributes('aria-live')).toBe('polite')
    expect(wrapper.text()).toContain('Active users')
    expect(wrapper.text()).toContain('+')
    expect(wrapper.text()).toContain('112,893')
    expect(wrapper.text()).toContain('people')
  })

  it('formats precision and custom separators', () => {
    const wrapper = mount(YStatistic, {
      props: {
        title: 'Balance',
        value: 112893.456,
        precision: 2,
        groupSeparator: ' ',
        decimalSeparator: ','
      }
    })

    expect(wrapper.text()).toContain('112 893,46')
  })

  it('supports a custom formatter and non-numeric fallback', () => {
    const formatted = mount(YStatistic, {
      props: {
        value: 0.928,
        formatter: (value) => `${(Number(value) * 100).toFixed(1)}%`
      }
    })
    const fallback = mount(YStatistic, {
      props: {
        value: 'n/a'
      }
    })

    expect(formatted.text()).toContain('92.8%')
    expect(fallback.text()).toContain('n/a')
  })

  it('renders loading state with status semantics', () => {
    const wrapper = mount(YStatistic, {
      props: {
        title: 'Revenue',
        loading: true
      }
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[role="status"]').text()).toContain('Loading statistic')
    expect(wrapper.find('.yok-statistic__value').exists()).toBe(false)
  })

  it('supports tone class and content slots', () => {
    const wrapper = mount(YStatistic, {
      props: {
        title: 'Completion',
        value: 0.82,
        tone: 'success'
      },
      slots: {
        prefix: '<span>+</span>',
        value: '<template #value="{ formattedValue }"><em>{{ formattedValue }}</em></template>',
        suffix: '<span>done</span>',
        extra: '<button>Open</button>'
      }
    })

    expect(wrapper.classes()).toContain('yok-statistic--success')
    expect(wrapper.text()).toContain('0.82')
    expect(wrapper.text()).toContain('done')
    expect(wrapper.text()).toContain('Open')
  })
})
