import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YTransfer from './YTransfer.vue'
import {
  filterTransferOptions,
  getEnabledTransferKeys,
  mergeTransferValues,
  removeTransferValues,
  splitTransferOptions
} from './transfer'
import type { YTransferOption } from './types'

const options: YTransferOption[] = [
  { value: 'button', label: 'Button', description: 'Basic action' },
  { value: 'input', label: 'Input', description: 'Text field' },
  { value: 'tree', label: 'Tree', description: 'Data display' },
  { value: 'admin', label: 'Admin only', disabled: true }
]

function getCheckboxByLabel(wrapper: ReturnType<typeof mount>, label: string) {
  const item = wrapper.findAll('label').find((node) => node.text().includes(label))

  if (!item) {
    throw new Error(`Missing label: ${label}`)
  }

  return item.get('input[type="checkbox"]')
}

describe('transfer helpers', () => {
  it('splits, filters and mutates transfer values', () => {
    const groups = splitTransferOptions(options, ['tree'])

    expect(groups.source.map((option) => option.value)).toEqual(['button', 'input', 'admin'])
    expect(groups.target.map((option) => option.value)).toEqual(['tree'])
    expect(filterTransferOptions(options, 'text').map((option) => option.value)).toEqual(['input'])
    expect(getEnabledTransferKeys(options)).toEqual(['button', 'input', 'tree'])
    expect(mergeTransferValues(['tree'], ['button', 'input'])).toEqual(['tree', 'button', 'input'])
    expect(removeTransferValues(['tree', 'button'], ['tree'])).toEqual(['button'])
  })
})

describe('YTransfer', () => {
  it('renders source and target panels from modelValue', () => {
    const wrapper = mount(YTransfer, {
      props: {
        modelValue: ['tree'],
        options,
        titles: ['Available', 'Selected']
      }
    })

    expect(wrapper.text()).toContain('Available')
    expect(wrapper.text()).toContain('Selected')
    expect(wrapper.text()).toContain('Button')
    expect(wrapper.text()).toContain('Tree')
  })

  it('moves checked enabled options to the target panel', async () => {
    const wrapper = mount(YTransfer, {
      props: {
        modelValue: ['tree'],
        options
      }
    })

    await getCheckboxByLabel(wrapper, 'Button').setValue(true)
    await getCheckboxByLabel(wrapper, 'Input').setValue(true)
    await wrapper.get('[aria-label="Move selected to target"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['tree', 'button', 'input']])
    expect(wrapper.emitted('change')?.[0]).toEqual([{
      value: ['tree', 'button', 'input'],
      movedKeys: ['button', 'input'],
      direction: 'right'
    }])
  })

  it('moves checked target options back to the source panel', async () => {
    const wrapper = mount(YTransfer, {
      props: {
        modelValue: ['tree', 'button'],
        options
      }
    })

    await getCheckboxByLabel(wrapper, 'Tree').setValue(true)
    await wrapper.get('[aria-label="Move selected to source"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['button']])
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({
      movedKeys: ['tree'],
      direction: 'left'
    })
  })

  it('selects all filtered enabled source options', async () => {
    const wrapper = mount(YTransfer, {
      props: {
        modelValue: [],
        options,
        filterable: true
      }
    })

    await wrapper.get('input[type="search"]').setValue('field')
    await getCheckboxByLabel(wrapper, 'Source').setValue(true)

    expect(wrapper.emitted('check')?.[0]).toEqual([{
      direction: 'left',
      checkedKeys: ['input']
    }])
  })

  it('does not move disabled checked candidates', async () => {
    const wrapper = mount(YTransfer, {
      props: {
        modelValue: [],
        options
      }
    })

    expect(getCheckboxByLabel(wrapper, 'Admin only').attributes('disabled')).toBeDefined()
    await getCheckboxByLabel(wrapper, 'Button').setValue(true)
    await wrapper.get('[aria-label="Move selected to target"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['button']])
  })

  it('disables all controls when disabled', async () => {
    const wrapper = mount(YTransfer, {
      props: {
        modelValue: [],
        options,
        disabled: true,
        filterable: true
      }
    })

    expect(wrapper.findAll('input:disabled').length).toBeGreaterThan(0)
    expect(wrapper.get('[aria-label="Move selected to target"]').attributes('disabled')).toBeDefined()
  })
})
