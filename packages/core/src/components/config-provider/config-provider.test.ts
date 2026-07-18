import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YConfigProvider from './YConfigProvider.vue'
import { useYokConfig } from './context'
import { builtinYokFonts } from './fonts'

const ConfigConsumer = defineComponent({
  name: 'ConfigConsumer',
  setup() {
    const config = useYokConfig()

    return () => h('output', {
      'data-size': config.size.value,
      'data-density': config.density.value,
      'data-locale': config.locale.value,
      'data-namespace': config.namespace.value,
      'data-direction': config.direction.value,
      'data-theme': config.theme.value,
      'data-font': config.font.value,
      'data-z-index': config.zIndex.value,
      'data-button-type': config.button.value.type,
      'data-confirm-label': config.t('common.confirm')
    })
  }
})

describe('YConfigProvider', () => {
  it('provides merged global configuration to descendants', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'lg',
        density: 'compact',
        locale: 'zh-CN',
        namespace: 'yok'
      },
      slots: {
        default: () => h(ConfigConsumer)
      }
    })

    const output = wrapper.get('output')

    expect(wrapper.classes()).toContain('yok-config-provider')
    expect(wrapper.attributes('data-yok-density')).toBe('compact')
    expect(wrapper.attributes('lang')).toBe('zh-CN')
    expect(output.attributes('data-size')).toBe('lg')
    expect(output.attributes('data-density')).toBe('compact')
    expect(output.attributes('data-locale')).toBe('zh-CN')
    expect(output.attributes('data-namespace')).toBe('yok')
  })

  it('lets nested providers override only the provided fields', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'lg',
        density: 'compact',
        locale: 'zh-CN'
      },
      slots: {
        default: () => h(YConfigProvider, { size: 'sm' }, () => h(ConfigConsumer))
      }
    })

    const output = wrapper.get('output')

    expect(output.attributes('data-size')).toBe('sm')
    expect(output.attributes('data-density')).toBe('compact')
    expect(output.attributes('data-locale')).toBe('zh-CN')
  })

  it('applies locale, theme, font, token, z-index, and component defaults to one scope', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        locale: 'ja-JP',
        direction: 'auto',
        theme: 'yok-candy',
        font: 'rounded',
        zIndex: 3200,
        tokens: {
          color: { primary: '#225566' },
          radius: {},
          space: {},
          shadow: {},
          motion: {},
          zIndex: {}
        },
        button: {
          type: 'primary'
        }
      },
      slots: {
        default: () => h(ConfigConsumer)
      }
    })

    const output = wrapper.get('output')

    expect(wrapper.attributes('lang')).toBe('ja-JP')
    expect(wrapper.attributes('dir')).toBe('ltr')
    expect(wrapper.attributes('data-yok-theme')).toBe('yok-candy')
    expect(wrapper.attributes('data-yok-font')).toBe('rounded')
    expect(wrapper.attributes('style')).toContain(`--yok-font-family: ${builtinYokFonts.rounded.family}`)
    expect(wrapper.attributes('style')).toContain('--yok-z-index-base: 3200')
    expect(wrapper.attributes('style')).toContain('--yok-color-primary: #225566')
    expect(output.attributes('data-button-type')).toBe('primary')
    expect(output.attributes('data-confirm-label')).toBe('確認')
  })

  it('merges nested component defaults by field', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        button: {
          type: 'primary',
          variant: 'secondary'
        }
      },
      slots: {
        default: () => h(YConfigProvider, {
          button: {
            variant: 'ghost'
          }
        }, () => h(ConfigConsumer))
      }
    })

    const output = wrapper.get('output')

    expect(output.attributes('data-button-type')).toBe('primary')
  })
})
