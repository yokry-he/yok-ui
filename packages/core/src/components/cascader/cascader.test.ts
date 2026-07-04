import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { YConfigProvider } from '../config-provider'
import YCascader from './YCascader.vue'
import {
  createCascaderColumns,
  findOptionPath,
  getMultiplePathLabels,
  getPathLabels,
  getPathValue,
  isCascaderValueSelected,
  isLeafOption,
  toggleCascaderValue
} from './cascader'
import type { YCascaderOption } from './types'

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

const options: YCascaderOption[] = [
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'china',
        label: 'China',
        children: [
          { value: 'shanghai', label: 'Shanghai' },
          { value: 'beijing', label: 'Beijing', disabled: true }
        ]
      }
    ]
  },
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'france',
        label: 'France',
        children: [
          { value: 'paris', label: 'Paris' }
        ]
      }
    ]
  }
]

function getOptionByText(wrapper: ReturnType<typeof mount>, text: string) {
  const option = wrapper.findAll('[role="option"]').find((item) => item.text().includes(text))

  if (!option) {
    throw new Error(`Missing option: ${text}`)
  }

  return option
}

describe('cascader helpers', () => {
  it('finds option paths and creates columns', () => {
    const path = findOptionPath(options, ['asia', 'china', 'shanghai'])
    const columns = createCascaderColumns(options, path)

    expect(getPathLabels(path)).toEqual(['Asia', 'China', 'Shanghai'])
    expect(getPathValue(path)).toEqual(['asia', 'china', 'shanghai'])
    expect(columns).toHaveLength(3)
    expect(isLeafOption(path[2])).toBe(true)
    expect(findOptionPath(options, ['missing'])).toEqual([])
    expect(isCascaderValueSelected(['asia', 'china', 'shanghai'], [['asia', 'china', 'shanghai']])).toBe(true)
    expect(toggleCascaderValue([['asia', 'china', 'shanghai']], ['asia', 'china', 'shanghai'])).toEqual([])
    expect(toggleCascaderValue([], ['europe', 'france', 'paris'])).toEqual([['europe', 'france', 'paris']])
    expect(getMultiplePathLabels(options, [
      ['asia', 'china', 'shanghai'],
      ['europe', 'france', 'paris']
    ])).toEqual([
      ['Asia', 'China', 'Shanghai'],
      ['Europe', 'France', 'Paris']
    ])
  })
})

describe('YCascader', () => {
  it('renders selected path and opens columns', async () => {
    const wrapper = mount(YCascader, {
      props: {
        options,
        modelValue: ['asia', 'china', 'shanghai'],
        label: 'Region'
      }
    })

    expect(wrapper.get('input').element.value).toBe('Asia / China / Shanghai')

    await wrapper.get('input').trigger('click')

    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toBe('Choose option')
    expect(wrapper.get('[role="dialog"]').attributes('style')).toContain('position: fixed')
    expect(wrapper.findAll('[role="listbox"]')).toHaveLength(3)
    expect(wrapper.findAll('[role="option"]').map((item) => item.text())).toContain('Shanghai')
  })

  it('selects a leaf path and emits payload', async () => {
    const wrapper = mount(YCascader, {
      props: {
        options,
        modelValue: []
      }
    })

    await wrapper.get('input').trigger('click')
    await getOptionByText(wrapper, 'Asia').trigger('click')
    await nextTick()
    await getOptionByText(wrapper, 'China').trigger('click')
    await nextTick()
    await getOptionByText(wrapper, 'Shanghai').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['asia', 'china', 'shanghai']])
    expect(wrapper.emitted('change')?.[0]).toEqual([{
      value: ['asia', 'china', 'shanghai'],
      labels: ['Asia', 'China', 'Shanghai'],
      option: options[0].children?.[0].children?.[0]
    }])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('does not select disabled options', async () => {
    const wrapper = mount(YCascader, {
      props: {
        options,
        modelValue: ['asia', 'china']
      }
    })

    await wrapper.get('input').trigger('click')

    const disabledOption = wrapper.findAll('[role="option"]').find((item) => item.text() === 'Beijing')

    expect(disabledOption?.attributes('disabled')).toBeDefined()
    await disabledOption?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('clears selection', async () => {
    const wrapper = mount(YCascader, {
      props: {
        options,
        modelValue: ['asia', 'china', 'shanghai']
      }
    })

    await wrapper.get('[aria-label="Clear selection"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('supports multiple leaf selection and keeps the panel open', async () => {
    const wrapper = mount(YCascader, {
      props: {
        options,
        multiple: true,
        modelValue: [['asia', 'china', 'shanghai']]
      }
    })

    expect(wrapper.text()).toContain('Asia / China / Shanghai')

    await wrapper.get('input').trigger('click')

    expect(wrapper.findAll('[role="listbox"]').at(2)?.attributes('aria-multiselectable')).toBe('true')
    expect(getOptionByText(wrapper, 'Shanghai').attributes('aria-selected')).toBe('true')

    await getOptionByText(wrapper, 'Shanghai').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(wrapper.emitted('change')?.[0]).toEqual([{
      value: [],
      labels: [],
      option: options[0].children?.[0].children?.[0],
      checked: false,
      checkedValue: ['asia', 'china', 'shanghai']
    }])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    await wrapper.setProps({ modelValue: [] })
    await getOptionByText(wrapper, 'Europe').trigger('click')
    await nextTick()
    await getOptionByText(wrapper, 'France').trigger('click')
    await nextTick()
    await getOptionByText(wrapper, 'Paris').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[['europe', 'france', 'paris']]])
  })

  it('supports keyboard navigation and escape', async () => {
    const wrapper = mount(YCascader, {
      props: {
        options,
        modelValue: []
      },
      attachTo: document.body
    })

    await wrapper.get('input').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    await wrapper.get('[data-active-cascader-option="true"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    await wrapper.get('[data-active-cascader-option="true"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    await wrapper.get('[data-active-cascader-option="true"]').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['asia', 'china', 'shanghai']])

    await wrapper.get('input').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('[data-active-cascader-option="true"]').trigger('keydown', { key: 'Escape' })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('dismisses the panel from outside pointer without interrupting trigger clicks', async () => {
    const wrapper = mount(YCascader, {
      props: {
        options,
        modelValue: []
      },
      attachTo: document.body
    })

    await wrapper.get('[aria-label="Open cascader"]').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    await wrapper.get('[aria-label="Close cascader"]').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await wrapper.get('[aria-label="Open cascader"]').trigger('click')
    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await nextTick()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders custom option slot and disabled state', async () => {
    const wrapper = mount(YCascader, {
      props: {
        options,
        modelValue: [],
        disabled: true
      },
      slots: {
        option: '<template #option="{ option, level }"><strong>{{ level }} - {{ option.label }}</strong></template>'
      }
    })

    await wrapper.get('input').trigger('click')

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await wrapper.setProps({ disabled: false })
    await wrapper.get('input').trigger('click')

    expect(wrapper.find('strong').text()).toBe('0 - Asia')
  })

  it('inherits size and density from config provider while allowing local size overrides', () => {
    const providerWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm', density: 'compact' }, () => h(YCascader, { options }))
      }
    })

    expect(providerWrapper.get('.yok-cascader').classes()).toEqual(expect.arrayContaining([
      'yok-cascader--sm',
      'yok-cascader--compact'
    ]))

    const overrideWrapper = mount({
      setup() {
        return () => h(YConfigProvider, { size: 'sm' }, () => h(YCascader, { options, size: 'lg' }))
      }
    })

    expect(overrideWrapper.get('.yok-cascader').classes()).toContain('yok-cascader--lg')
  })

  it('loads lazy option children and keeps selection on loaded leaf options', async () => {
    let resolveChildren: ((children: YCascaderOption[]) => void) | undefined
    const load = vi.fn(() => new Promise<YCascaderOption[]>((resolve) => {
      resolveChildren = resolve
    }))
    const wrapper = mount(YCascader, {
      props: {
        options: [{ value: 'remote', label: 'Remote package' }],
        modelValue: [],
        lazy: true,
        load
      }
    })

    await wrapper.get('input').trigger('click')
    await getOptionByText(wrapper, 'Remote package').trigger('click')

    expect(load).toHaveBeenCalledWith(
      { value: 'remote', label: 'Remote package' },
      [{ value: 'remote', label: 'Remote package' }]
    )
    expect(wrapper.get('[role="status"]').text()).toBe('Loading Remote package')

    resolveChildren?.([{ value: 'button', label: 'Button', isLeaf: true }])
    await flushPromises()
    await nextTick()

    expect(wrapper.findAll('[role="listbox"]')).toHaveLength(2)
    expect(getOptionByText(wrapper, 'Button').text()).toBe('Button')
    expect(wrapper.emitted('load')?.[0]).toEqual([{
      option: { value: 'remote', label: 'Remote package' },
      path: [{ value: 'remote', label: 'Remote package' }],
      children: [{ value: 'button', label: 'Button', isLeaf: true }]
    }])

    await getOptionByText(wrapper, 'Button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['remote', 'button']])
  })

  it('keeps failed lazy options retryable', async () => {
    const loadError = new Error('Network unavailable')
    const load = vi.fn()
      .mockRejectedValueOnce(loadError)
      .mockResolvedValueOnce([{ value: 'retry-child', label: 'Retry child', isLeaf: true }])
    const wrapper = mount(YCascader, {
      props: {
        options: [{ value: 'remote', label: 'Remote package' }],
        modelValue: [],
        lazy: true,
        load
      }
    })

    await wrapper.get('input').trigger('click')
    await getOptionByText(wrapper, 'Remote package').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('Failed to load Remote package')
    expect(wrapper.emitted('loadError')?.[0]).toEqual([{
      option: { value: 'remote', label: 'Remote package' },
      path: [{ value: 'remote', label: 'Remote package' }],
      error: loadError
    }])

    await getOptionByText(wrapper, 'Remote package').trigger('click')
    await flushPromises()
    await nextTick()

    expect(load).toHaveBeenCalledTimes(2)
    expect(wrapper.findAll('[role="listbox"]')).toHaveLength(2)
    expect(getOptionByText(wrapper, 'Retry child').text()).toBe('Retry child')
  })
})
