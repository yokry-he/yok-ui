import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YPageHeader from './YPageHeader.vue'

describe('YPageHeader', () => {
  it('renders title, description and actions', () => {
    const wrapper = mount(YPageHeader, {
      props: {
        title: 'Components',
        description: 'Manage component inventory.',
        eyebrow: 'Admin',
        status: 'Live'
      },
      slots: {
        actions: '<button>Create</button>'
      }
    })

    expect(wrapper.text()).toContain('Components')
    expect(wrapper.text()).toContain('Manage component inventory.')
    expect(wrapper.text()).toContain('Live')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('allows page title level to be lowered inside embedded docs or nested regions', () => {
    const wrapper = mount(YPageHeader, {
      props: {
        title: 'Release queue',
        headingLevel: 2
      }
    })

    expect(wrapper.find('h1').exists()).toBe(false)
    expect(wrapper.find('h2.yok-page-header__title').text()).toBe('Release queue')
  })
})
