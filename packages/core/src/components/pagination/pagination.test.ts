import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YPagination from './YPagination.vue'

describe('YPagination', () => {
  it('emits page updates', async () => {
    const wrapper = mount(YPagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 35
      }
    })

    const buttons = wrapper.findAll('button')

    expect(buttons.length).toBeGreaterThan(1)

    await buttons[buttons.length - 1].trigger('click')

    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
    expect(wrapper.emitted('change')?.[0]).toEqual([2])
  })

  it('disables previous on first page', () => {
    const wrapper = mount(YPagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 20
      }
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('supports disabled navigation, custom labels, and custom navigation names', async () => {
    const wrapper = mount(YPagination, {
      props: {
        page: 2,
        pageSize: 10,
        total: 40,
        disabled: true,
        ariaLabel: 'Release queue pages',
        previousText: 'Back',
        nextText: 'Forward'
      }
    })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Release queue pages')
    expect(wrapper.findAll('button').every((button) => button.attributes('disabled') !== undefined)).toBe(true)
    expect(wrapper.text()).toContain('Back')
    expect(wrapper.text()).toContain('Forward')

    await wrapper.findAll('button').at(-1)?.trigger('click')

    expect(wrapper.emitted('update:page')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('hides itself on single page when requested', () => {
    const wrapper = mount(YPagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 8,
        hideOnSinglePage: true
      }
    })

    expect(wrapper.find('nav').exists()).toBe(false)
  })
})
