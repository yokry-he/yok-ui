import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YConfigProvider from './YConfigProvider.vue'
import { useYokConfig } from './context'

const ConfigConsumer = defineComponent({
  name: 'ConfigConsumer',
  setup() {
    const config = useYokConfig()

    return () => h('output', {
      'data-size': config.size.value,
      'data-density': config.density.value,
      'data-locale': config.locale.value,
      'data-namespace': config.namespace.value
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
})
