import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import LiveExampleAdvancedTools from './LiveExampleAdvancedTools.vue'

const baseProps = {
  summary: 'Quality evidence',
  description: 'Scenario coverage, API map and synchronized state stay available without taking over the first screen.',
  targetHashes: ['#live-example-api-map', '#live-example-acceptance'],
  meta: [
    { label: 'Checks', value: '4' },
    { label: 'Scenes', value: '7' }
  ]
}

describe('LiveExampleAdvancedTools', () => {
  beforeEach(() => {
    window.location.hash = ''
  })

  it('keeps advanced live example evidence collapsed by default', () => {
    const wrapper = mount(LiveExampleAdvancedTools, {
      props: baseProps,
      slots: {
        default: '<section id="live-example-api-map">API map</section>'
      }
    })

    expect(wrapper.get('.live-example-runner__advanced-tools').attributes('open')).toBeUndefined()
    expect(wrapper.get('.live-example-runner__advanced-tools-summary').attributes('aria-label')).toBe('Toggle advanced live example evidence')
    expect(wrapper.text()).toContain('Quality evidence')
    expect(wrapper.text()).toContain('4')
    expect(wrapper.find('#live-example-api-map').exists()).toBe(true)
  })

  it('opens automatically when the current hash points to an advanced evidence panel', () => {
    window.location.hash = '#live-example-api-map'

    const wrapper = mount(LiveExampleAdvancedTools, {
      props: baseProps,
      slots: {
        default: '<section id="live-example-api-map">API map</section>'
      }
    })

    expect(wrapper.get('.live-example-runner__advanced-tools').attributes('open')).toBe('')
  })

  it('tracks manual expansion state through the native details toggle event', async () => {
    const wrapper = mount(LiveExampleAdvancedTools, {
      props: baseProps,
      slots: {
        default: '<section id="live-example-acceptance">Acceptance</section>'
      }
    })
    const details = wrapper.get<HTMLDetailsElement>('.live-example-runner__advanced-tools')

    details.element.open = true
    await details.trigger('toggle')

    expect(details.attributes('open')).toBe('')
    expect(wrapper.find('#live-example-acceptance').exists()).toBe(true)
  })
})
