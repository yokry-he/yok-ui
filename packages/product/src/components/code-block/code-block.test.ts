import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YCodeBlock from './YCodeBlock.vue'

describe('YCodeBlock', () => {
  it('renders language and code', () => {
    const wrapper = mount(YCodeBlock, {
      props: {
        language: 'ts',
        code: "import { YButton } from '@yok-ui/core'"
      }
    })

    expect(wrapper.text()).toContain('ts')
    expect(wrapper.text()).toContain('YButton')
  })
})
