import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YBreadcrumb from './YBreadcrumb.vue'

const items = [
  { label: 'Guide', href: '/guide/introduction' },
  { label: 'Components', href: '/components/' },
  { label: 'Breadcrumb' }
]

describe('YBreadcrumb', () => {
  it('renders semantic breadcrumb navigation', () => {
    const wrapper = mount(YBreadcrumb, {
      props: {
        items
      }
    })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Breadcrumb')
    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.findAll('a')).toHaveLength(2)
    expect(wrapper.get('[aria-current="page"]').text()).toBe('Breadcrumb')
  })

  it('emits selected link items without blocking native navigation', async () => {
    const wrapper = mount(YBreadcrumb, {
      props: {
        items
      }
    })

    await wrapper.get('a').trigger('click')

    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
  })

  it('marks disabled items without rendering them as links', () => {
    const wrapper = mount(YBreadcrumb, {
      props: {
        items: [
          { label: 'Workspace', href: '/workspace' },
          { label: 'Private package', href: '/private', disabled: true },
          { label: 'Overview' }
        ]
      }
    })

    expect(wrapper.findAll('a')).toHaveLength(1)
    expect(wrapper.get('[aria-disabled="true"]').text()).toBe('Private package')
  })

  it('supports custom separators and navigation label', () => {
    const wrapper = mount(YBreadcrumb, {
      props: {
        items,
        separator: '>',
        ariaLabel: 'Docs path'
      }
    })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Docs path')
    expect(wrapper.findAll('.yok-breadcrumb__separator').map((node) => node.text())).toEqual(['>', '>'])
  })
})
