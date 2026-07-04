import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YFormSummary from './YFormSummary.vue'

describe('YFormSummary', () => {
  it('renders errors as an assertive alert', () => {
    const wrapper = mount(YFormSummary, {
      props: {
        errors: [
          { fieldId: 'component-name', label: 'Component name', message: 'Name is required' },
          { fieldId: 'package', label: 'Package', message: 'Choose a package' }
        ]
      }
    })

    expect(wrapper.get('[role="alert"]').attributes('aria-live')).toBe('assertive')
    expect(wrapper.text()).toContain('Please fix the following fields')
    expect(wrapper.text()).toContain('Component name')
    expect(wrapper.text()).toContain('Choose a package')
    expect(wrapper.findAll('button')).toHaveLength(2)
  })

  it('does not render when there are no errors', () => {
    const wrapper = mount(YFormSummary, {
      props: {
        errors: []
      }
    })

    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('focuses the related field when an error is clicked', async () => {
    const field = document.createElement('input')
    field.id = 'component-name'
    document.body.append(field)

    const wrapper = mount(YFormSummary, {
      props: {
        errors: [{ fieldId: 'component-name', label: 'Component name', message: 'Name is required' }]
      },
      attachTo: document.body
    })

    await wrapper.get('button').trigger('click')

    expect(document.activeElement).toBe(field)

    wrapper.unmount()
    field.remove()
  })
})
