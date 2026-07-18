import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { yokLight } from '@yok-ui/themes'
import { describe, expect, it } from 'vitest'
import YThemeProvider from './YThemeProvider.vue'
import { useYokConfig } from '../config-provider'

const ThemeConfigConsumer = defineComponent({
  setup() {
    const config = useYokConfig()
    return () => h('output', {
      'data-theme': config.theme.value,
      'data-density': config.density.value,
      'data-font': config.font.value
    })
  }
})

describe('YThemeProvider', () => {
  it('sets theme and density attributes', () => {
    const wrapper = mount(YThemeProvider, {
      props: {
        theme: 'yok-candy',
        density: 'compact'
      },
      slots: {
        default: '<button>Save</button>'
      }
    })

    expect(wrapper.attributes('data-yok-theme')).toBe('yok-candy')
    expect(wrapper.attributes('data-yok-density')).toBe('compact')
    expect(wrapper.text()).toContain('Save')
  })

  it('injects custom theme tokens as scoped CSS variables', () => {
    const wrapper = mount(YThemeProvider, {
      props: {
        tokens: {
          ...yokLight,
          color: {
            ...yokLight.color,
            primary: '#9f345f',
            surface: '#fffaff'
          },
          radius: {
            ...yokLight.radius,
            md: '16px'
          }
        }
      },
      slots: {
        default: '<button>Preview</button>'
      }
    })

    expect(wrapper.attributes('style')).toContain('--yok-color-primary: #9f345f;')
    expect(wrapper.attributes('style')).toContain('--yok-color-surface: #fffaff;')
    expect(wrapper.attributes('style')).toContain('--yok-radius-md: 16px;')
    expect(wrapper.text()).toContain('Preview')
  })

  it('shares theme configuration with ConfigProvider consumers', () => {
    const wrapper = mount(YThemeProvider, {
      props: {
        theme: 'yok-ocean',
        density: 'compact',
        font: 'humanist'
      },
      slots: {
        default: () => h(ThemeConfigConsumer)
      }
    })

    const output = wrapper.get('output')

    expect(output.attributes('data-theme')).toBe('yok-ocean')
    expect(output.attributes('data-density')).toBe('compact')
    expect(output.attributes('data-font')).toBe('humanist')
  })
})
