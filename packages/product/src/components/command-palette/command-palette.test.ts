import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YCommandPalette from './YCommandPalette.vue'

describe('YCommandPalette', () => {
  it('filters commands and emits select', async () => {
    const wrapper = mount(YCommandPalette, {
      props: {
        open: true,
        commands: [
          { id: 'copy', label: 'Copy link' },
          { id: 'theme', label: 'Change theme' }
        ]
      }
    })

    await wrapper.get('input').setValue('theme')
    expect(wrapper.text()).toContain('Change theme')
    expect(wrapper.text()).not.toContain('Copy link')

    await wrapper.get('[data-command-id="theme"]').trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([{ id: 'theme', label: 'Change theme' }])
  })

  it('focuses input when opened and selects active command with keyboard', async () => {
    const commands = [
      { id: 'copy', label: 'Copy link' },
      { id: 'theme', label: 'Change theme' },
      { id: 'core', label: 'Browse core' }
    ]

    const wrapper = mount(YCommandPalette, {
      props: {
        open: true,
        commands
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    const input = wrapper.get<HTMLInputElement>('input')
    expect(document.activeElement).toBe(input.element)
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-activedescendant')).toBe('yok-command-copy')

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toBe('yok-command-theme')

    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]).toEqual([commands[1]])
  })

  it('wraps active command and renders empty state', async () => {
    const wrapper = mount(YCommandPalette, {
      props: {
        open: true,
        commands: [
          { id: 'copy', label: 'Copy link' },
          { id: 'theme', label: 'Change theme' }
        ]
      }
    })

    const input = wrapper.get<HTMLInputElement>('input')

    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(input.attributes('aria-activedescendant')).toBe('yok-command-theme')

    await input.setValue('missing')
    expect(wrapper.text()).toContain('No commands found')

    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')).toBeUndefined()
  })
})
