import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSteps from './YSteps.vue'

const items = [
  { title: 'Create project', description: 'Choose a package type.' },
  { title: 'Configure theme', description: 'Pick tokens and tone.' },
  { title: 'Publish docs', description: 'Review component examples.' }
]

describe('YSteps', () => {
  it('renders semantic steps and marks the current step', () => {
    const wrapper = mount(YSteps, {
      props: {
        items,
        current: 1
      }
    })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Steps')
    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.get('[aria-current="step"]').text()).toContain('Configure theme')
    expect(wrapper.findAll('.yok-steps__item')[0].classes()).toContain('yok-steps__item--finish')
    expect(wrapper.findAll('.yok-steps__item')[1].classes()).toContain('yok-steps__item--process')
  })

  it('lets item status override derived status', () => {
    const wrapper = mount(YSteps, {
      props: {
        current: 1,
        items: [
          items[0],
          { ...items[1], status: 'error' },
          items[2]
        ]
      }
    })

    expect(wrapper.findAll('.yok-steps__item')[1].classes()).toContain('yok-steps__item--error')
    expect(wrapper.findAll('.yok-steps__marker')[1].text()).toBe('!')
  })

  it('emits select when selectable steps are clicked', async () => {
    const wrapper = mount(YSteps, {
      props: {
        items,
        selectable: true
      }
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.emitted('select')?.[0]).toEqual([items[1], 1])
  })

  it('does not emit select for disabled steps', async () => {
    const wrapper = mount(YSteps, {
      props: {
        selectable: true,
        items: [
          items[0],
          { ...items[1], disabled: true },
          items[2]
        ]
      }
    })

    const disabledStep = wrapper.findAll('button')[1]

    expect(disabledStep.attributes('disabled')).toBeDefined()
    await disabledStep.trigger('click')

    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('supports vertical layout and custom navigation label', () => {
    const wrapper = mount(YSteps, {
      props: {
        items,
        direction: 'vertical',
        ariaLabel: 'Release workflow'
      }
    })

    expect(wrapper.classes()).toContain('yok-steps--vertical')
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Release workflow')
  })
})
