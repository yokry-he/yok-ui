import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import YMention from './YMention.vue'

enableAutoUnmount(afterEach)

const options = [
  { label: 'Ada Lovelace', value: 'ada', description: 'Core maintainer' },
  { label: 'Grace Hopper', value: 'grace', description: 'Compiler team' },
  { label: 'Blocked User', value: 'blocked', disabled: true }
]

describe('YMention', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('opens suggestions when typing a mention token and emits search', async () => {
    const wrapper = mount(YMention, {
      props: {
        modelValue: '',
        label: 'Assignee note',
        options
      },
      attachTo: document.body
    })

    const textarea = wrapper.get('textarea')

    expect(textarea.attributes('role')).toBe('combobox')
    expect(textarea.attributes('aria-autocomplete')).toBe('list')

    await textarea.setValue('Please review @ad')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Please review @ad'])
    expect(wrapper.emitted('search')?.[0]).toEqual(['ad', '@'])
    expect(wrapper.get('[role="listbox"]').attributes('aria-label')).toBe('Assignee note suggestions')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
    expect(wrapper.get('[role="option"]').text()).toContain('Ada Lovelace')
  })

  it('replaces the active mention token when selecting a suggestion', async () => {
    const wrapper = mount(YMention, {
      props: {
        modelValue: 'Ship with @a',
        options
      },
      attachTo: document.body
    })

    await wrapper.get('textarea').trigger('focus')
    await nextTick()
    await wrapper.get('[role="option"][id$="ada"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Ship with @ada '])
    expect(wrapper.emitted('change')?.[0]).toEqual(['Ship with @ada '])
    expect(wrapper.emitted('select')?.[0]).toEqual([options[0], '@'])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('moves through enabled suggestions with keyboard and skips disabled options', async () => {
    const wrapper = mount(YMention, {
      props: {
        modelValue: 'Ping @',
        options
      },
      attachTo: document.body
    })

    const textarea = wrapper.get('textarea')

    textarea.element.focus()
    await textarea.trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    expect(textarea.attributes('aria-activedescendant')).toContain('ada')

    await textarea.trigger('keydown', { key: 'ArrowDown' })
    expect(textarea.attributes('aria-activedescendant')).toContain('grace')

    await textarea.trigger('keydown', { key: 'ArrowDown' })
    expect(textarea.attributes('aria-activedescendant')).toContain('ada')

    await textarea.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Ping @ada '])
  })

  it('supports custom prefixes, empty state, clear, and invalid form ids', async () => {
    const wrapper = mount(YMention, {
      props: {
        id: 'release-note',
        modelValue: 'Link #missing',
        label: 'Release note',
        prefix: ['@', '#'],
        options,
        clearable: true,
        emptyText: 'No people matched',
        invalid: true,
        ariaDescribedby: 'release-note-message'
      },
      attachTo: document.body
    })

    const textarea = wrapper.get('textarea')

    expect(textarea.attributes('id')).toBe('release-note')
    expect(textarea.attributes('aria-invalid')).toBe('true')
    expect(textarea.attributes('aria-describedby')).toBe('release-note-message')

    await textarea.trigger('focus')
    await nextTick()

    expect(wrapper.get('[role="status"]').text()).toBe('No people matched')

    await wrapper.get('.yok-mention__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('change')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
