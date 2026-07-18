import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { YButton, YButtonGroup, YIconButton } from './index'
import { YConfigProvider } from '../config-provider'

describe('YButton', () => {
  it('renders variant, size, loading, and slot content', () => {
    const wrapper = mount(YButton, {
      props: {
        variant: 'primary',
        size: 'lg',
        loading: true
      },
      slots: {
        default: 'Create'
      }
    })

    expect(wrapper.classes()).toContain('yok-button--primary')
    expect(wrapper.classes()).toContain('yok-button--lg')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.text()).toContain('Create')
  })

  it('emits click when enabled', async () => {
    const wrapper = mount(YButton, {
      slots: {
        default: 'Save'
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('uses ConfigProvider size when no explicit size is provided', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'lg'
      },
      slots: {
        default: () => h(YButton, null, () => 'Global size')
      }
    })

    expect(wrapper.find('.yok-button').classes()).toContain('yok-button--lg')
  })

  it('keeps explicit size above ConfigProvider defaults', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'lg'
      },
      slots: {
        default: () => h(YButton, { size: 'sm' }, () => 'Explicit size')
      }
    })

    expect(wrapper.find('.yok-button').classes()).toContain('yok-button--sm')
  })

  it('uses typed ConfigProvider Button defaults when props are omitted', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        button: {
          type: 'primary',
          variant: 'secondary',
          nativeType: 'submit',
          plain: true,
          round: true,
          dashed: true,
          autoInsertSpace: true
        }
      },
      slots: {
        default: () => h(YButton, null, () => '确认')
      }
    })

    const button = wrapper.get('.yok-button')

    expect(button.classes()).toContain('yok-button--primary')
    expect(button.classes()).toContain('yok-button--variant-secondary')
    expect(button.classes()).toContain('yok-button--plain')
    expect(button.classes()).toContain('yok-button--round')
    expect(button.classes()).toContain('yok-button--dashed')
    expect(button.attributes('type')).toBe('submit')
    expect(button.text()).toBe('确 认')
  })

  it('keeps explicit Button props above ConfigProvider Button defaults', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        button: {
          type: 'primary',
          variant: 'secondary',
          nativeType: 'submit',
          plain: true,
          round: true,
          autoInsertSpace: true
        }
      },
      slots: {
        default: () => h(YButton, {
          type: 'danger',
          variant: 'ghost',
          nativeType: 'reset',
          plain: false,
          round: false,
          autoInsertSpace: false
        }, () => '确认')
      }
    })

    const button = wrapper.get('.yok-button')

    expect(button.classes()).toContain('yok-button--danger')
    expect(button.classes()).toContain('yok-button--variant-ghost')
    expect(button.classes()).not.toContain('yok-button--plain')
    expect(button.classes()).not.toContain('yok-button--round')
    expect(button.attributes('type')).toBe('reset')
    expect(button.text()).toBe('确认')
  })

  it('supports block layout for full-width mobile or form actions', () => {
    const wrapper = mount(YButton, {
      props: {
        block: true
      },
      slots: {
        default: 'Continue'
      }
    })

    expect(wrapper.classes()).toContain('yok-button--block')
  })

  it('supports Element Plus style visual types and shape props', () => {
    const wrapper = mount(YButton, {
      props: {
        type: 'success',
        plain: true,
        round: true,
        dashed: true
      },
      slots: {
        default: 'Done'
      }
    })

    expect(wrapper.classes()).toContain('yok-button--success')
    expect(wrapper.classes()).toContain('yok-button--plain')
    expect(wrapper.classes()).toContain('yok-button--round')
    expect(wrapper.classes()).toContain('yok-button--dashed')
  })

  it('keeps native button type compatible with nativeType and legacy type values', () => {
    const submit = mount(YButton, {
      props: {
        nativeType: 'submit'
      },
      slots: {
        default: 'Submit'
      }
    })
    const reset = mount(YButton, {
      props: {
        type: 'reset'
      },
      slots: {
        default: 'Reset'
      }
    })

    expect(submit.attributes('type')).toBe('submit')
    expect(reset.attributes('type')).toBe('reset')
  })

  it('supports text, background text, link, circle, and icon slots', () => {
    const text = mount(YButton, {
      props: {
        type: 'warning',
        text: true,
        bg: true
      },
      slots: {
        default: 'Text action'
      }
    })
    const link = mount(YButton, {
      props: {
        type: 'danger',
        link: true
      },
      slots: {
        default: 'Link action'
      }
    })
    const circle = mount(YButton, {
      props: {
        circle: true
      },
      slots: {
        icon: () => h('svg', { 'data-test': 'icon' })
      }
    })

    expect(text.classes()).toContain('yok-button--text')
    expect(text.classes()).toContain('yok-button--bg')
    expect(link.classes()).toContain('yok-button--link')
    expect(circle.classes()).toContain('yok-button--circle')
    expect(circle.find('[data-test="icon"]').exists()).toBe(true)
  })

  it('supports custom loading content and prevents click while loading', async () => {
    const wrapper = mount(YButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Saving',
        loading: () => h('span', { 'data-test': 'loading' }, 'L')
      }
    })

    expect(wrapper.find('[data-test="loading"]').exists()).toBe(true)
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('can auto insert space between two Chinese characters', () => {
    const wrapper = mount(YButton, {
      props: {
        autoInsertSpace: true
      },
      slots: {
        default: '提交'
      }
    })

    expect(wrapper.text()).toContain('提 交')
  })
})

describe('YButtonGroup', () => {
  it('keeps vertical groups content-sized inside stretching layouts', () => {
    const source = readFileSync(resolve(__dirname, 'YButtonGroup.vue'), 'utf8')

    expect(source).toContain('inline-size: fit-content;')
    expect(source).toContain('max-inline-size: 100%;')
  })

  it('groups related buttons with an accessible name', () => {
    const wrapper = mount(YButtonGroup, {
      props: {
        label: 'Document actions'
      },
      slots: {
        default: () => [
          h(YButton, { variant: 'secondary' }, () => 'Preview'),
          h(YButton, { variant: 'secondary' }, () => 'Copy'),
          h(YButton, { variant: 'primary' }, () => 'Publish')
        ]
      }
    })

    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Document actions')
    expect(wrapper.findAll('.yok-button')).toHaveLength(3)
    expect(wrapper.classes()).not.toContain('yok-button-group--vertical')
  })

  it('supports vertical grouping for compact panels', () => {
    const wrapper = mount(YButtonGroup, {
      props: {
        vertical: true
      },
      slots: {
        default: () => [
          h(YButton, null, () => 'Previous'),
          h(YButton, null, () => 'Next')
        ]
      }
    })

    expect(wrapper.classes()).toContain('yok-button-group--vertical')
    for (const button of wrapper.findAll('.yok-button')) {
      expect(button.classes()).toContain('yok-button--default')
      expect(button.classes()).not.toContain('yok-button--undefined')
    }
  })

  it('provides default size and type to grouped buttons', () => {
    const wrapper = mount(YButtonGroup, {
      props: {
        direction: 'vertical',
        size: 'lg',
        type: 'primary'
      },
      slots: {
        default: () => [
          h(YButton, null, () => 'Previous'),
          h(YButton, null, () => 'Next')
        ]
      }
    })

    expect(wrapper.classes()).toContain('yok-button-group--vertical')
    for (const button of wrapper.findAll('.yok-button')) {
      expect(button.classes()).toContain('yok-button--lg')
      expect(button.classes()).toContain('yok-button--primary')
    }
  })
})

describe('YIconButton', () => {
  it('requires an accessible label', () => {
    const wrapper = mount(YIconButton, {
      props: {
        label: 'Copy'
      },
      slots: {
        default: 'C'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Copy')
  })
})
