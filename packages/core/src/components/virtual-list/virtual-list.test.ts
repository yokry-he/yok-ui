import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import YVirtualList from './YVirtualList.vue'

const items = Array.from({ length: 100 }, (_, index) => ({
  id: `component-${index}`,
  label: `Component ${index}`
}))

describe('YVirtualList', () => {
  it('renders only the visible range with list semantics', () => {
    const wrapper = mount(YVirtualList, {
      props: {
        items,
        itemHeight: 40,
        height: 120,
        overscan: 1,
        ariaLabel: 'Components'
      }
    })

    const viewport = wrapper.get('[role="list"]')
    const renderedItems = wrapper.findAll('[role="listitem"]')

    expect(viewport.attributes('aria-label')).toBe('Components')
    expect(viewport.attributes('aria-setsize')).toBe('100')
    expect(renderedItems).toHaveLength(4)
    expect(renderedItems[0].text()).toContain('Component 0')
    expect(renderedItems[0].attributes('aria-posinset')).toBe('1')
    expect(wrapper.text()).not.toContain('Component 99')
  })

  it('updates range and emits scroll payload when scrolled', async () => {
    const wrapper = mount(YVirtualList, {
      props: {
        items,
        itemHeight: 40,
        height: 120,
        overscan: 1
      }
    })

    const viewport = wrapper.get<HTMLElement>('[role="list"]')
    viewport.element.scrollTop = 400
    await viewport.trigger('scroll')

    const renderedItems = wrapper.findAll('[role="listitem"]')

    expect(renderedItems[0].text()).toContain('Component 9')
    expect(renderedItems[0].attributes('aria-posinset')).toBe('10')
    expect(wrapper.emitted('scroll')?.[0]).toEqual([{ scrollTop: 400, start: 9, end: 14 }])
    expect(wrapper.emitted('rangeChange')?.[0]).toEqual([{ start: 9, end: 14 }])
  })

  it('supports custom item keys and slots', () => {
    const wrapper = mount(YVirtualList, {
      props: {
        items,
        itemHeight: 36,
        height: 72,
        itemKey: (item: { id: string }) => item.id
      },
      slots: {
        item: '<template #item="{ item, index }"><strong>{{ index }} - {{ item.label }}</strong></template>'
      }
    })

    expect(wrapper.find('strong').text()).toBe('0 - Component 0')
  })

  it('exposes scroll helpers and clamps offsets', async () => {
    const wrapper = mount(YVirtualList, {
      props: {
        items,
        itemHeight: 40,
        height: 120,
        overscan: 0
      }
    })

    wrapper.vm.scrollToIndex(20)
    await nextTick()

    const viewport = wrapper.get<HTMLElement>('[role="list"]')

    expect(viewport.element.scrollTop).toBe(800)
    expect(wrapper.findAll('[role="listitem"]')[0].text()).toContain('Component 20')

    wrapper.vm.scrollToOffset(99999)
    await nextTick()

    expect(viewport.element.scrollTop).toBe(3880)
  })

  it('renders an accessible empty state', () => {
    const wrapper = mount(YVirtualList, {
      props: {
        items: [],
        itemHeight: 40,
        height: 160,
        emptyText: 'No components'
      }
    })

    expect(wrapper.find('[role="status"]').text()).toBe('No components')
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(0)
  })
})
