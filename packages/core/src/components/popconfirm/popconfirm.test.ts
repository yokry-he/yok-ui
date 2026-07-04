import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YPopconfirm from './YPopconfirm.vue'

describe('YPopconfirm', () => {
  it('opens from trigger and emits confirm', async () => {
    const wrapper = mount(YPopconfirm, {
      props: {
        title: 'Archive item?'
      },
      slots: {
        trigger: '<button>Archive</button>'
      }
    })

    await wrapper.get('.yok-popconfirm__trigger').trigger('click')
    expect(wrapper.text()).toContain('Archive item?')

    await wrapper.get('.yok-popconfirm__confirm').trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('uses default slot as trigger fallback for copyable live examples', async () => {
    const wrapper = mount(YPopconfirm, {
      props: {
        title: 'Delete draft?'
      },
      slots: {
        default: '<button>Delete draft</button>'
      }
    })

    expect(wrapper.get('.yok-popconfirm__trigger').text()).toContain('Delete draft')

    await wrapper.get('.yok-popconfirm__trigger').trigger('click')

    expect(wrapper.text()).toContain('Delete draft?')
  })
})
