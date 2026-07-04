import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YAvatar from './YAvatar.vue'
import YAvatarGroup from './YAvatarGroup.vue'

describe('YAvatar', () => {
  it('renders initials when no image is provided', () => {
    const wrapper = mount(YAvatar, {
      props: {
        name: 'Yok UI'
      }
    })

    expect(wrapper.text()).toContain('YU')
  })

  it('renders image with accessible alt text', () => {
    const wrapper = mount(YAvatar, {
      props: {
        src: '/avatar.png',
        alt: 'Yok avatar'
      }
    })

    expect(wrapper.get('img').attributes('alt')).toBe('Yok avatar')
  })

  it('passes srcset and fit through to image avatars', () => {
    const wrapper = mount(YAvatar, {
      props: {
        src: '/avatar.png',
        srcSet: '/avatar@2x.png 2x',
        alt: 'Yok avatar',
        fit: 'contain'
      }
    })

    const image = wrapper.get('img')

    expect(image.attributes('srcset')).toBe('/avatar@2x.png 2x')
    expect(image.attributes('style')).toContain('object-fit: contain')
  })

  it('emits error and falls back to initials when image loading fails', async () => {
    const wrapper = mount(YAvatar, {
      props: {
        src: '/missing-avatar.png',
        name: 'Missing Owner',
        alt: 'Missing Owner avatar'
      }
    })

    await wrapper.get('img').trigger('error')

    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('MO')
    expect(wrapper.attributes('aria-label')).toBe('Missing Owner avatar')
  })

  it('renders default slot content with avatar semantics', () => {
    const wrapper = mount(YAvatar, {
      props: {
        label: 'Design lead avatar'
      },
      slots: {
        default: '<span data-test="avatar-icon">★</span>'
      }
    })

    expect(wrapper.get('[data-test="avatar-icon"]').text()).toBe('★')
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Design lead avatar')
  })
})

describe('YAvatarGroup', () => {
  it('renders avatar children with group semantics and overlap spacing', () => {
    const wrapper = mount(YAvatarGroup, {
      props: {
        label: 'Review team',
        spacing: 10
      },
      slots: {
        default: `
          <YAvatar name="Core Team" />
          <YAvatar name="Product Owner" />
        `
      },
      global: {
        components: {
          YAvatar
        }
      }
    })

    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Review team')
    expect(wrapper.attributes('style')).toContain('--yok-avatar-group-spacing: -10px')
    expect(wrapper.findAllComponents(YAvatar)).toHaveLength(2)
  })

  it('collapses extra avatars into a surplus indicator', () => {
    const wrapper = mount(YAvatarGroup, {
      props: {
        max: 3,
        label: 'Project members'
      },
      slots: {
        default: `
          <YAvatar name="Core Team" />
          <YAvatar name="Product Owner" />
          <YAvatar name="Design Review" />
          <YAvatar name="Quality Owner" />
          <YAvatar name="Release Lead" />
        `
      },
      global: {
        components: {
          YAvatar
        }
      }
    })

    expect(wrapper.findAllComponents(YAvatar)).toHaveLength(4)
    expect(wrapper.text()).toContain('+2')
    expect(wrapper.get('.yok-avatar-group__surplus').attributes('aria-label')).toBe('2 more project members')
  })

  it('uses total when the server knows more members than rendered avatars', () => {
    const wrapper = mount(YAvatarGroup, {
      props: {
        max: 2,
        total: 8
      },
      slots: {
        default: `
          <YAvatar name="Core Team" />
          <YAvatar name="Product Owner" />
        `
      },
      global: {
        components: {
          YAvatar
        }
      }
    })

    expect(wrapper.findAllComponents(YAvatar)).toHaveLength(3)
    expect(wrapper.text()).toContain('+6')
  })
})
