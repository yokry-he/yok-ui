import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useYokConfig } from './components/config-provider'
import { createYokInstaller } from './plugin'

const PluginConfigConsumer = defineComponent({
  setup() {
    const config = useYokConfig()

    return () => h('output', {
      'data-size': config.size.value,
      'data-locale': config.locale.value,
      'data-theme': config.theme.value,
      'data-font': config.font.value,
      'data-button-type': config.button.value.type,
      'data-confirm': config.t('common.confirm')
    })
  }
})

describe('Yok UI installer config', () => {
  it('provides app-level config while preserving component registration', () => {
    const installer = createYokInstaller([])
    const wrapper = mount(PluginConfigConsumer, {
      global: {
        plugins: [[installer, {
          size: 'lg',
          locale: 'zh-CN',
          theme: 'yok-ocean',
          font: 'humanist',
          button: { type: 'primary' }
        }]]
      }
    })

    const output = wrapper.get('output')

    expect(output.attributes('data-size')).toBe('lg')
    expect(output.attributes('data-locale')).toBe('zh-CN')
    expect(output.attributes('data-theme')).toBe('yok-ocean')
    expect(output.attributes('data-font')).toBe('humanist')
    expect(output.attributes('data-button-type')).toBe('primary')
    expect(output.attributes('data-confirm')).toBe('确认')
  })
})
