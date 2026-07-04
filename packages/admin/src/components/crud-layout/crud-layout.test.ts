import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YCrudLayout from './YCrudLayout.vue'

describe('YCrudLayout', () => {
  it('renders header, controls, workspace and footer slots', () => {
    const wrapper = mount(YCrudLayout, {
      props: {
        title: 'Component inventory',
        description: 'Manage component releases.',
        eyebrow: 'Admin',
        status: 'Ready',
        ariaLabel: 'Component inventory workspace'
      },
      slots: {
        actions: '<button>Create</button>',
        search: '<form aria-label="Search form">Search</form>',
        filters: '<div role="tablist">Filters</div>',
        toolbar: '<button>Export</button>',
        table: '<table><tbody><tr><td>YButton</td></tr></tbody></table>',
        aside: '<section>Release summary</section>',
        footer: '<button>Save view</button>'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Component inventory workspace')
    expect(wrapper.text()).toContain('Component inventory')
    expect(wrapper.text()).toContain('Manage component releases.')
    expect(wrapper.text()).toContain('Create')
    expect(wrapper.text()).toContain('Search')
    expect(wrapper.text()).toContain('Filters')
    expect(wrapper.text()).toContain('Export')
    expect(wrapper.text()).toContain('YButton')
    expect(wrapper.text()).toContain('Release summary')
    expect(wrapper.text()).toContain('Save view')
  })

  it('uses the title as fallback accessible name', () => {
    const wrapper = mount(YCrudLayout, {
      props: {
        title: 'Orders'
      },
      slots: {
        default: '<p>Order table</p>'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Orders')
    expect(wrapper.text()).toContain('Order table')
  })

  it('supports compact density and sticky header', () => {
    const wrapper = mount(YCrudLayout, {
      props: {
        title: 'Components',
        density: 'compact',
        stickyHeader: true
      }
    })

    expect(wrapper.classes()).toContain('yok-crud-layout--compact')
    expect(wrapper.classes()).toContain('yok-crud-layout--sticky')
  })

  it('passes heading level to the internal page header', () => {
    const wrapper = mount(YCrudLayout, {
      props: {
        title: 'Nested admin surface',
        headingLevel: 2
      }
    })

    expect(wrapper.find('h1').exists()).toBe(false)
    expect(wrapper.find('h2.yok-page-header__title').text()).toBe('Nested admin surface')
  })
})
