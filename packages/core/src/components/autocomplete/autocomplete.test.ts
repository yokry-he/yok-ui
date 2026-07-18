import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import YAutocomplete from './YAutocomplete.vue'

enableAutoUnmount(afterEach)

const options = [
  { label: 'Button', value: 'button', description: 'Basic action component.' },
  { label: 'Autocomplete', value: 'autocomplete', description: 'Input suggestions.' },
  { label: 'Select', value: 'select', disabled: true }
]

describe('YAutocomplete', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('filters suggestions while keeping typed text as the model value', async () => {
    const wrapper = mount(YAutocomplete, {
      props: {
        modelValue: '',
        label: 'Component',
        options
      },
      attachTo: document.body
    })

    const input = wrapper.get('input')

    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-autocomplete')).toBe('list')

    await input.setValue('auto')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['auto'])
    expect(wrapper.emitted('search')?.[0]).toEqual(['auto'])
    expect(wrapper.get('[role="listbox"]').attributes('aria-label')).toBe('Component suggestions')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
    expect(wrapper.get('[role="option"]').text()).toContain('Autocomplete')
  })

  it('selects an enabled suggestion and emits select/change', async () => {
    const wrapper = mount(YAutocomplete, {
      props: {
        modelValue: 'bu',
        options
      },
      attachTo: document.body
    })

    await wrapper.get('input').trigger('focus')
    await nextTick()
    await wrapper.get('[role="option"][id$="button"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['button'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['button'])
    expect(wrapper.emitted('select')?.[0]).toEqual([options[0]])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('moves through suggestions with keyboard and keeps disabled options unselectable', async () => {
    const wrapper = mount(YAutocomplete, {
      props: {
        modelValue: '',
        options
      },
      attachTo: document.body
    })

    const input = wrapper.get('input')
    input.element.focus()

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    expect(input.attributes('aria-activedescendant')).toContain('button')

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toContain('autocomplete')

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toContain('button')

    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['button'])
    expect(wrapper.emitted('select')?.[0]).toEqual([options[0]])
  })

  it('shows empty state and clears free text', async () => {
    const wrapper = mount(YAutocomplete, {
      props: {
        modelValue: 'missing',
        options,
        clearable: true,
        emptyText: 'No components found'
      },
      attachTo: document.body
    })

    await wrapper.get('input').trigger('focus')
    await nextTick()

    expect(wrapper.get('[role="status"]').text()).toBe('No components found')

    await wrapper.get('.yok-autocomplete__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('change')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('loads remote suggestions from remoteMethod and ignores stale responses', async () => {
    let resolveButtonSearch: (options: typeof options) => void = () => {}
    let resolveRemoteSearch: (options: typeof options) => void = () => {}
    const remoteMethod = (query: string) =>
      new Promise<typeof options>((resolve) => {
        if (query === 'button') {
          resolveButtonSearch = resolve
          return
        }

        if (query === 'remote') {
          resolveRemoteSearch = resolve
          return
        }

        resolve([])
      })

    const wrapper = mount(YAutocomplete, {
      props: {
        modelValue: '',
        label: 'Component',
        options,
        loadingText: 'Loading remote suggestions...',
        remoteMethod
      },
      attachTo: document.body
    })

    const input = wrapper.get('input')
    await input.setValue('button')
    await nextTick()

    expect(wrapper.get('[role="status"]').text()).toBe('Loading remote suggestions...')
    expect(wrapper.find('[role="option"]').exists()).toBe(false)

    await input.setValue('remote')
    await nextTick()

    resolveRemoteSearch([{ label: 'Remote component', value: 'remote', description: 'Fetched from API' }])
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual(['Remote componentFetched from API'])

    resolveButtonSearch([{ label: 'Button', value: 'button', description: 'Stale result' }])
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual(['Remote componentFetched from API'])
  })

  it('supports external form ids and invalid state', () => {
    const wrapper = mount(YAutocomplete, {
      props: {
        id: 'field-component',
        modelValue: '',
        invalid: true,
        ariaDescribedby: 'field-component-message',
        options
      }
    })

    const input = wrapper.get('input')

    expect(input.attributes('id')).toBe('field-component')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('field-component-message')
  })
})
