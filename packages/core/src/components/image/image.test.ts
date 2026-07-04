import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import YImage from './YImage.vue'

enableAutoUnmount(afterEach)

describe('YImage', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('renders an accessible image with fit and stable sizing', async () => {
    const wrapper = mount(YImage, {
      props: {
        src: '/gallery.png',
        alt: 'Gallery cover',
        fit: 'cover',
        width: '160px',
        height: '96px',
        radius: '16px'
      }
    })

    const img = wrapper.get('img')

    expect(img.attributes('src')).toBe('/gallery.png')
    expect(img.attributes('alt')).toBe('Gallery cover')
    expect(img.attributes('loading')).toBe('eager')
    expect(wrapper.classes()).toContain('yok-image--cover')
    expect(wrapper.attributes('style')).toContain('--yok-image-width: 160px')
    expect(wrapper.attributes('style')).toContain('--yok-image-height: 96px')

    await img.trigger('load')

    expect(wrapper.emitted('load')).toHaveLength(1)
    expect(wrapper.find('.yok-image__placeholder').exists()).toBe(false)
  })

  it('supports lazy loading and custom error content', async () => {
    const wrapper = mount(YImage, {
      props: {
        src: '/missing.png',
        alt: 'Missing image',
        lazy: true
      },
      slots: {
        error: '<span data-error>Unable to load</span>'
      }
    })

    expect(wrapper.get('img').attributes('loading')).toBe('lazy')

    await wrapper.get('img').trigger('error')

    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.find('[data-error]').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('opens preview, emits model updates, and closes with escape', async () => {
    const wrapper = mount(YImage, {
      props: {
        src: '/cover.png',
        alt: 'Cover',
        preview: true,
        previewSrcList: ['/cover.png', '/detail.png'],
        initialIndex: 1
      }
    })

    await wrapper.get('.yok-image__button').trigger('click')

    expect(wrapper.emitted('preview-open')).toHaveLength(1)
    expect(wrapper.emitted('update:previewOpen')?.[0]).toEqual([true])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.get('.yok-image-preview__image').attributes('src')).toBe('/detail.png')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('preview-close')).toHaveLength(1)
    expect(wrapper.emitted('update:previewOpen')?.at(-1)).toEqual([false])
  })

  it('respects controlled preview state', async () => {
    const wrapper = mount(YImage, {
      props: {
        src: '/cover.png',
        alt: 'Cover',
        preview: true,
        previewOpen: true
      }
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    await wrapper.get('[data-image-preview-close]').trigger('click')

    expect(wrapper.emitted('preview-close')).toHaveLength(1)
    expect(wrapper.emitted('update:previewOpen')?.[0]).toEqual([false])
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    await wrapper.setProps({ previewOpen: false })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })
})
