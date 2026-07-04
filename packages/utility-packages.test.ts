import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, effectScope, h, nextTick, ref } from 'vue'

describe('utility packages', () => {
  it('exports controlled state, event listener and namespace hooks', async () => {
    const {
      useControlledState,
      useEventListener,
      useNamespace
    } = await import('@yok-ui/hooks')

    const controlledChanges: string[] = []
    const controlled = useControlledState({
      value: ref('core'),
      defaultValue: 'local',
      onChange: (value) => controlledChanges.push(value)
    })

    controlled.setValue('admin')

    expect(controlled.value.value).toBe('core')
    expect(controlled.isControlled.value).toBe(true)
    expect(controlledChanges).toEqual(['admin'])

    const uncontrolled = useControlledState<string>({
      defaultValue: 'light'
    })

    uncontrolled.setValue('candy')

    expect(uncontrolled.value.value).toBe('candy')
    expect(uncontrolled.isControlled.value).toBe(false)

    const namespace = useNamespace('button')

    expect(namespace.b()).toBe('yok-button')
    expect(namespace.e('icon')).toBe('yok-button__icon')
    expect(namespace.m('primary')).toBe('yok-button--primary')
    expect(namespace.is('loading', true)).toBe('is-loading')
    expect(namespace.is('loading', false)).toBe('')

    const target = new EventTarget()
    const listener = vi.fn()
    const scope = effectScope()

    scope.run(() => {
      useEventListener(target, 'save', listener)
    })
    target.dispatchEvent(new Event('save'))
    scope.stop()
    target.dispatchEvent(new Event('save'))

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('exports icon path data and a Vue icon renderer', async () => {
    const {
      YokIcon,
      createYokIcon,
      yokIconPaths
    } = await import('@yok-ui/icons')

    expect(yokIconPaths.check.paths.length).toBeGreaterThan(0)

    const CustomIcon = createYokIcon('spark', [
      'M12 3l2.4 5.2L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.6-.8L12 3z'
    ])
    const customWrapper = mount(CustomIcon, {
      props: {
        title: 'Spark'
      }
    })

    expect(customWrapper.get('svg').attributes('role')).toBe('img')
    expect(customWrapper.get('title').text()).toBe('Spark')
    expect(customWrapper.get('path').attributes('d')).toContain('M12 3')

    const wrapper = mount(defineComponent({
      setup() {
        const tone = ref('currentColor')

        return () => h(YokIcon, {
          name: 'check',
          size: 20,
          color: tone.value,
          title: 'Done'
        })
      }
    }))

    await nextTick()

    expect(wrapper.get('svg').attributes('width')).toBe('20')
    expect(wrapper.get('svg').attributes('height')).toBe('20')
    expect(wrapper.get('svg').attributes('aria-hidden')).toBeUndefined()
    expect(wrapper.get('title').text()).toBe('Done')
  })
})
