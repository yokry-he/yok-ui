import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ApiTable from './ApiTable.vue'

let routePath = '/components/input'

vi.mock('vitepress', () => ({
  useRoute: () => ({
    path: routePath
  })
}))

const rows = [
  {
    name: 'modelValue',
    type: 'string',
    defaultValue: "''",
    description: '输入值，支持 v-model。',
    required: true
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: '禁用状态。'
  }
]

const searchableRows = [
  ...rows,
  {
    name: 'placeholder',
    type: 'string',
    defaultValue: "''",
    description: '占位文本。'
  },
  {
    name: 'clearable',
    type: 'boolean',
    defaultValue: 'false',
    description: '允许清空输入值。'
  },
  {
    name: 'invalid',
    type: 'boolean',
    defaultValue: 'false',
    description: '外部校验传入的无效状态。'
  }
]

describe('ApiTable', () => {
  beforeEach(() => {
    routePath = '/components/input'
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    })
  })

  it('renders structured rows with section metadata', () => {
    const wrapper = mount(ApiTable, {
      props: {
        rows,
        kind: 'props',
        anchorId: 'api-y-input-props',
        aliases: ['api-props']
      }
    })

    expect(wrapper.find('.api-table').attributes('id')).toBe('api-y-input-props')
    expect(wrapper.find('#api-props').exists()).toBe(true)
    expect(wrapper.find('#api-y-input-props-model-value').exists()).toBe(true)
    expect(wrapper.find('#api-props-model-value').exists()).toBe(true)
    expect(wrapper.find('.api-table__row-anchor').attributes('href')).toBe('#api-y-input-props-model-value')
    expect(wrapper.find('.api-table__live-link').attributes('href')).toBe('#live-example')
    expect(wrapper.find('.api-table__coverage').text()).toBe('Scenario')
    expect(wrapper.find('.api-table__coverage').attributes('data-status')).toBe('covered')
    expect(wrapper.find('.api-table__coverage').attributes('href')).toMatch(/^#live-example\?scenario=.+/)
    expect(wrapper.find('.api-table__coverage').attributes('data-scenario')).toBe('basic-input')
    expect(wrapper.find('h3').text()).toBe('Props')
    expect(wrapper.text()).toContain('2 total')
    expect(wrapper.text()).toContain('modelValue')
    expect(wrapper.text()).toContain('required')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('switches the live example scenario when a scenario-backed API badge is clicked', async () => {
    const listener = vi.fn()
    window.addEventListener('yok-ui:live-example-scenario', listener)
    window.history.replaceState(null, '', '/components/input')

    const wrapper = mount(ApiTable, {
      props: {
        rows,
        kind: 'props',
        anchorId: 'api-y-input-props'
      }
    })

    await wrapper.find('.api-table__coverage').trigger('click')

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].detail).toEqual({
      scenarioKey: 'basic-input'
    })
    expect(window.location.hash).toBe('#live-example?scenario=basic-input')

    window.removeEventListener('yok-ui:live-example-scenario', listener)
  })

  it('links source-backed API badges to DocDemo anchors without dispatching scenario events', async () => {
    routePath = '/components/select'
    const listener = vi.fn()
    window.addEventListener('yok-ui:live-example-scenario', listener)
    window.history.replaceState(null, '', '/components/select')

    const wrapper = mount(ApiTable, {
      props: {
        rows: [
          {
            name: 'label',
            type: 'string',
            defaultValue: "''",
            description: '标签文本。'
          }
        ],
        kind: 'props',
        anchorId: 'api-y-select-props'
      }
    })

    const coverage = wrapper.find('.api-table__coverage')

    expect(coverage.text()).toBe('Example')
    expect(coverage.attributes('data-status')).toBe('covered')
    expect(coverage.attributes('href')).toBe('#select-basic-usage')
    expect(coverage.attributes('data-scenario')).toBeUndefined()
    expect(coverage.attributes('title')).toContain('基础用法')

    await coverage.trigger('click')

    expect(listener).not.toHaveBeenCalled()

    window.removeEventListener('yok-ui:live-example-scenario', listener)
  })

  it('renders primitive DocDemo evidence badges for frequently used API props', () => {
    routePath = '/components/button'

    const wrapper = mount(ApiTable, {
      props: {
        rows: [
          {
            name: 'variant',
            type: "'primary' | 'secondary' | 'ghost'",
            defaultValue: "'secondary'",
            description: '按钮视觉等级。'
          },
          {
            name: 'size',
            type: "'sm' | 'md' | 'lg'",
            defaultValue: "'md'",
            description: '按钮尺寸。'
          }
        ],
        kind: 'props',
        anchorId: 'api-y-button-props'
      }
    })

    const coverageBadges = wrapper.findAll('.api-table__coverage')

    expect(coverageBadges.map((badge) => badge.text())).toEqual(['Example', 'Example'])
    expect(coverageBadges[0].attributes('href')).toBe('#button-basic-usage')
    expect(coverageBadges[0].attributes('title')).toContain('基础用法')
    expect(coverageBadges[1].attributes('href')).toBe('#button-sizes')
    expect(coverageBadges[1].attributes('title')).toContain('调整尺寸')
  })

  it('filters rows by name, type and description', async () => {
    const wrapper = mount(ApiTable, {
      props: {
        rows: searchableRows,
        kind: 'props'
      }
    })

    await wrapper.find('input[type="search"]').setValue('禁用')

    expect(wrapper.text()).toContain('1 shown')
    expect(wrapper.text()).toContain('disabled')
    expect(wrapper.text()).not.toContain('modelValue')
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  it('copies the currently visible API rows as markdown', async () => {
    const wrapper = mount(ApiTable, {
      props: {
        rows: searchableRows,
        kind: 'props'
      }
    })

    await wrapper.find('input[type="search"]').setValue('禁用')
    await wrapper.find('.api-table__copy-markdown').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
    const markdown = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0]
    expect(markdown).toContain('### Props API')
    expect(markdown).toContain('| Prop | Type | Default | Description |')
    expect(markdown).toContain('| `disabled` | `boolean` | `false` | 禁用状态。 |')
    expect(markdown).not.toContain('modelValue')
    expect(wrapper.find('.api-table__copy-markdown').text()).toBe('已复制 Markdown')
  })

  it('shows an empty state when no rows are registered', () => {
    const wrapper = mount(ApiTable, {
      props: {
        rows: [],
        kind: 'events'
      }
    })

    expect(wrapper.find('.api-table__empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('当前组件暂未登记 events')
  })
})
