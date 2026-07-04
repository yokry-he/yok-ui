import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSegmented from './YSegmented.vue'

describe('YSegmented', () => {
  it('renders string options as a single selectable segmented control', async () => {
    const wrapper = mount(YSegmented, {
      props: {
        modelValue: 'List',
        options: ['List', 'Kanban', 'Calendar'],
        ariaLabel: 'View mode'
      }
    })

    const group = wrapper.get('[role="radiogroup"]')
    const inputs = wrapper.findAll('input[type="radio"]')

    expect(group.attributes('aria-label')).toBe('View mode')
    expect(inputs).toHaveLength(3)
    expect(inputs[0].element.checked).toBe(true)

    await inputs[1].setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Kanban'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['Kanban'])
  })

  it('supports object options, descriptions, disabled items and named native radios', async () => {
    const wrapper = mount(YSegmented, {
      props: {
        modelValue: 'weekly',
        name: 'report-range',
        label: 'Report range',
        options: [
          { label: 'Daily', value: 'daily', description: 'Last 24 hours' },
          { label: 'Weekly', value: 'weekly', description: 'Last 7 days' },
          { label: 'Locked', value: 'locked', disabled: true }
        ]
      }
    })

    expect(wrapper.text()).toContain('Report range')
    expect(wrapper.text()).toContain('Last 24 hours')
    expect(wrapper.findAll('input').every((input) => input.attributes('name') === 'report-range')).toBe(true)
    expect(wrapper.get('input[value="locked"]').attributes('disabled')).toBeDefined()

    await wrapper.get('input[value="locked"]').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('applies block, vertical, round, size and disabled states', () => {
    const wrapper = mount(YSegmented, {
      props: {
        modelValue: 1,
        options: [
          { label: 'Small', value: 1 },
          { label: 'Large', value: 2 }
        ],
        block: true,
        disabled: true,
        orientation: 'vertical',
        shape: 'round',
        size: 'lg',
        ariaLabel: 'Density'
      }
    })

    expect(wrapper.classes()).toContain('yok-segmented--block')
    expect(wrapper.classes()).toContain('yok-segmented--vertical')
    expect(wrapper.classes()).toContain('yok-segmented--round')
    expect(wrapper.classes()).toContain('yok-segmented--lg')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.findAll('input').every((input) => input.attributes('disabled') !== undefined)).toBe(true)
  })
})
