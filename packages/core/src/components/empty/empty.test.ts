import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YEmpty from './YEmpty.vue'

describe('YEmpty', () => {
  it('renders title, description, and action slot', () => {
    const wrapper = mount(YEmpty, {
      props: {
        title: 'No projects',
        description: 'Create your first project.'
      },
      slots: {
        action: '<button>Create</button>'
      }
    })

    expect(wrapper.text()).toContain('No projects')
    expect(wrapper.text()).toContain('Create your first project.')
    expect(wrapper.text()).toContain('Create')
  })

  it('uses default slot as action fallback for copyable live examples', () => {
    const wrapper = mount(YEmpty, {
      props: {
        title: 'No filters matched'
      },
      slots: {
        default: '<button>Clear filters</button>'
      }
    })

    expect(wrapper.find('.yok-empty__action').exists()).toBe(true)
    expect(wrapper.text()).toContain('Clear filters')
  })
})
