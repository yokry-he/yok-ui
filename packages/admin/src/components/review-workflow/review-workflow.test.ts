import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YReviewWorkflow, { type YReviewWorkflowStep } from './YReviewWorkflow.vue'

const steps: YReviewWorkflowStep[] = [
  {
    title: 'Submitted',
    value: 'submitted',
    description: 'The component proposal is ready.',
    time: '09:12',
    actor: 'Yok'
  },
  {
    title: 'Reviewing',
    value: 'reviewing',
    status: 'Active',
    tone: 'warning',
    actor: 'Design system'
  },
  {
    title: 'Released',
    value: 'released',
    status: 'Pending',
    disabled: true
  }
]

describe('YReviewWorkflow', () => {
  it('renders workflow header, status and timeline semantics', () => {
    const wrapper = mount(YReviewWorkflow, {
      props: {
        items: steps,
        activeValue: 'reviewing',
        title: 'Component review',
        description: 'Track release approval.',
        reviewer: 'Reviewer: Design system',
        dueText: 'Due today',
        ariaLabel: 'Component review workflow'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Component review workflow')
    expect(wrapper.text()).toContain('Component review')
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('Reviewer: Design system')
    expect(wrapper.text()).toContain('Due today')
    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.findAll('li')[1].attributes('aria-current')).toBe('step')
  })

  it('emits action specific payloads', async () => {
    const wrapper = mount(YReviewWorkflow, {
      props: {
        items: steps,
        activeValue: 'reviewing'
      }
    })

    await wrapper.findAllComponents({ name: 'YButton' })[0].trigger('click')
    await wrapper.findAllComponents({ name: 'YButton' })[1].trigger('click')
    await wrapper.get('.yok-review-workflow__reject').trigger('click')

    expect(wrapper.emitted('approve')?.[0]).toEqual([
      {
        action: 'approve',
        activeValue: 'reviewing',
        activeStep: steps[1]
      }
    ])
    expect(wrapper.emitted('requestChanges')?.[0]?.[0].action).toBe('requestChanges')
    expect(wrapper.emitted('reject')?.[0]?.[0].action).toBe('reject')
    expect(wrapper.emitted('action')).toHaveLength(3)
  })

  it('does not emit actions while disabled or loading', async () => {
    const wrapper = mount(YReviewWorkflow, {
      props: {
        items: steps,
        activeValue: 'reviewing',
        disabled: true
      }
    })

    await wrapper.findAllComponents({ name: 'YButton' })[0].trigger('click')
    await wrapper.get('.yok-review-workflow__reject').trigger('click')

    expect(wrapper.emitted('action')).toBeUndefined()
  })

  it('supports custom meta, step and actions slots', () => {
    const wrapper = mount(YReviewWorkflow, {
      props: {
        items: steps,
        activeValue: 'reviewing'
      },
      slots: {
        meta: '<span>Custom reviewer</span>',
        step: '<template #step="{ item }"><small>Step {{ item.value }}</small></template>',
        actions: '<button type="button">Custom decision</button>'
      }
    })

    expect(wrapper.text()).toContain('Custom reviewer')
    expect(wrapper.text()).toContain('Step reviewing')
    expect(wrapper.text()).toContain('Custom decision')
    expect(wrapper.text()).not.toContain('Approve')
  })
})
