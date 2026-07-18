import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import { YConfigProvider } from '../config-provider'
import YForm from '../form/YForm.vue'
import YFormItem from '../form-item/YFormItem.vue'
import YSelect from './YSelect.vue'

describe('YSelect', () => {
  it('emits selected value', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        options: [
          { label: 'Core', value: 'core' },
          { label: 'Product', value: 'product' }
        ]
      }
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[role="option"][id$="product"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['product'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['product'])
    expect(wrapper.emitted('visibleChange')?.at(0)).toEqual([true])
  })

  it('renders size variants and clears the selected value', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: 'core',
        label: 'Package',
        clearable: true,
        size: 'large',
        options: [
          { label: 'Core', value: 'core' },
          { label: 'Product', value: 'product' }
        ]
      }
    })

    expect(wrapper.classes()).toContain('yok-select--large')
    expect(wrapper.get('.yok-select__clear').attributes('aria-label')).toBe('Clear selection')

    await wrapper.get('.yok-select__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('change')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('renders stable svg icons for chrome controls and selected state', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: 'core',
        label: 'Package',
        clearable: true,
        options: [
          { label: 'Core', value: 'core' },
          { label: 'Product', value: 'product' }
        ]
      },
      attachTo: document.body
    })

    expect(wrapper.get('.yok-select__chevron svg').exists()).toBe(true)
    expect(wrapper.get('.yok-select__clear svg').exists()).toBe(true)
    expect(wrapper.get('.yok-select__chevron').text()).toBe('')
    expect(wrapper.get('.yok-select__clear').text()).toBe('')

    await wrapper.get('[role="combobox"]').trigger('click')

    const selectedOption = wrapper.get('[role="option"][aria-selected="true"]')
    expect(selectedOption.get('.yok-select__check svg').exists()).toBe(true)
    expect(selectedOption.get('.yok-select__check').text()).toBe('')
  })

  it('uses config provider size and density when no local size is provided', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'sm',
        density: 'compact'
      },
      slots: {
        default: () => h(YSelect, {
          modelValue: '',
          options: [
            { label: 'Core', value: 'core' }
          ]
        })
      }
    })

    const select = wrapper.getComponent(YSelect)

    expect(select.classes()).toContain('yok-select--small')
    expect(select.classes()).toContain('yok-select--compact')
  })

  it('lets local size override config provider size', () => {
    const wrapper = mount(YConfigProvider, {
      props: {
        size: 'sm'
      },
      slots: {
        default: () => h(YSelect, {
          modelValue: '',
          size: 'large',
          options: [
            { label: 'Core', value: 'core' }
          ]
        })
      }
    })

    expect(wrapper.getComponent(YSelect).classes()).toContain('yok-select--large')
  })

  it('supports multiple selection with removable tags and multiselect semantics', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: ['core'],
        label: 'Packages',
        multiple: true,
        clearable: true,
        options: [
          { label: 'Core', value: 'core' },
          { label: 'Product', value: 'product' },
          { label: 'Admin', value: 'admin' }
        ]
      }
    })

    expect(wrapper.findAll('.yok-select__tag-label').map((tag) => tag.text())).toEqual(['Core'])

    await wrapper.get('[role="combobox"]').trigger('click')
    expect(wrapper.get('[role="listbox"]').attributes('aria-multiselectable')).toBe('true')

    await wrapper.get('[role="option"][id$="product"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['core', 'product']])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)

    await wrapper.setProps({ modelValue: ['core', 'product'] })
    await wrapper.get('[aria-label="Remove Core"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['product']])
    expect(wrapper.emitted('remove')?.[0]).toEqual(['core'])

    await wrapper.get('.yok-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('collapses multiple tags after the configured visible tag count', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: ['core', 'product', 'admin'],
        label: 'Packages',
        multiple: true,
        clearable: true,
        collapseTags: true,
        maxCollapseTags: 2,
        options: [
          { label: 'Core', value: 'core' },
          { label: 'Product', value: 'product' },
          { label: 'Admin', value: 'admin' }
        ]
      }
    })

    expect(wrapper.findAll('.yok-select__tag-label').map((tag) => tag.text())).toEqual(['Core', 'Product'])
    expect(wrapper.get('.yok-select__tag-summary').text()).toBe('+1')
    expect(wrapper.find('[aria-label="Remove Admin"]').exists()).toBe(false)
    expect(wrapper.get('.yok-select__tag-summary').attributes('aria-label')).toBe('1 more selected option')

    await wrapper.get('.yok-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
  })

  it('supports external form ids and invalid state', () => {
    const wrapper = mount(YSelect, {
      props: {
        id: 'field-package',
        invalid: true,
        ariaDescribedby: 'field-package-message',
        options: [
          { label: 'Core', value: 'core' }
        ]
      }
    })

    const combobox = wrapper.get('[role="combobox"]')
    expect(combobox.attributes('id')).toBe('field-package')
    expect(combobox.attributes('aria-invalid')).toBe('true')
    expect(combobox.attributes('aria-describedby')).toBe('field-package-message')
    expect(wrapper.find('.yok-select__error').exists()).toBe(false)
  })

  it('opens with keyboard and moves focus through enabled options', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: 'core',
        label: 'Package',
        options: [
          { label: 'Core', value: 'core' },
          { label: 'Admin', value: 'admin', disabled: true },
          { label: 'Product', value: 'product' }
        ]
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)

    await wrapper.vm.$nextTick()
    const options = wrapper.findAll('[role="option"]')
    expect(document.activeElement).toBe(options[0].element)

    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(options[2].element)

    await options[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['product'])
  })

  it('filters options with a searchable listbox and keeps disabled options unselectable', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        filterable: true,
        options: [
          { label: 'Core package', value: 'core' },
          { label: 'Product suite', value: 'product' },
          { label: 'Admin workflow', value: 'admin', disabled: true }
        ]
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('click')

    const searchbox = wrapper.get('[role="searchbox"]')
    expect(searchbox.attributes('aria-controls')).toBe(wrapper.get('[role="listbox"]').attributes('id'))

    await searchbox.setValue('prod')
    await nextTick()

    expect(wrapper.emitted('search')?.at(-1)).toEqual(['prod'])

    const options = wrapper.findAll('[role="option"]')
    expect(options).toHaveLength(1)
    expect(options[0].text()).toContain('Product suite')

    await options[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['product'])

    await wrapper.setProps({ modelValue: '' })
    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[role="searchbox"]').setValue('admin')

    const disabledOption = wrapper.get('[role="option"]')
    expect(disabledOption.attributes('disabled')).toBeDefined()

    await disabledOption.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)

    wrapper.unmount()
  })

  it('keeps filter search and options as separated panel sections', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        filterable: true,
        options: [
          { label: 'Core package', value: 'core' },
          { label: 'Product suite', value: 'product' }
        ]
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('click')

    const panel = wrapper.get('.yok-select__panel')
    const children = Array.from(panel.element.children).map((element) => element.className)

    expect(children[0]).toContain('yok-select__search')
    expect(children[1]).toContain('yok-select__listbox')
    expect(wrapper.get('.yok-select__listbox').classes()).toContain('yok-select__listbox--with-search')
    expect(wrapper.get('.yok-select__search-input').attributes('aria-controls')).toBe(
      wrapper.get('.yok-select__listbox').attributes('id')
    )

    wrapper.unmount()
  })

  it('announces error text and participates in form item change validation', async () => {
    const wrapper = mount(defineComponent({
      components: {
        YForm,
        YFormItem,
        YSelect
      },
      setup() {
        const model = reactive<Record<string, string>>({
          packageName: ''
        })
        const rules = {
          packageName: {
            validator: (value: string) => Boolean(value) || 'Choose a package before publishing.',
            trigger: 'change' as const
          }
        }
        const options = [
          { label: 'Core', value: 'core' },
          { label: 'Product', value: 'product' }
        ]

        function updatePackage(value: string | string[], validate: (trigger: 'change') => Promise<boolean>) {
          model.packageName = Array.isArray(value) ? value[0] ?? '' : value
          validate('change')
        }

        return {
          model,
          rules,
          options,
          updatePackage
        }
      },
      template: `
        <YForm :model="model" :rules="rules">
          <YFormItem prop="packageName" label="Package" v-slot="{ error, invalid, labelFor, messageId, validate }">
            <YSelect
              :id="labelFor"
              :model-value="model.packageName"
              :options="options"
              placeholder="Choose package"
              :error="error"
              :invalid="invalid"
              :aria-describedby="messageId"
              @update:model-value="updatePackage($event, validate)"
            />
          </YFormItem>
        </YForm>
      `
    }), {
      attachTo: document.body
    })

    const form = wrapper.getComponent(YForm)

    await form.vm.validate('change')
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('Choose a package before publishing.')
    expect(wrapper.get('[role="combobox"]').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[role="combobox"]').attributes('aria-describedby')).toContain('yok-form-message-packageName')

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[role="option"][id$="core"]').trigger('click')
    await nextTick()
    await nextTick()

    expect(wrapper.vm.model.packageName).toBe('core')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('creates a new option from a filter query with click and enter', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        filterable: true,
        allowCreate: true,
        options: [
          { label: 'Core package', value: 'core' },
          { label: 'Product suite', value: 'product' }
        ]
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[role="searchbox"]').setValue('Design system')

    const createOption = wrapper.get('[data-create-option="true"]')
    expect(createOption.attributes('role')).toBe('option')
    expect(createOption.text()).toBe('Create "Design system"')

    await createOption.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Design system'])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[role="searchbox"]').setValue('Design token')
    await wrapper.get('[role="searchbox"]').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['Design token'])

    wrapper.unmount()
  })

  it('virtualizes large option sets while preserving listbox option semantics', async () => {
    const largeOptions = Array.from({ length: 1000 }, (_, index) => ({
      label: `Package ${index + 1}`,
      value: `pkg-${index + 1}`
    }))
    const wrapper = mount(YSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        virtualized: true,
        virtualHeight: 120,
        virtualItemHeight: 36,
        virtualOverscan: 1,
        options: largeOptions
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('click')

    const listbox = wrapper.get('[role="listbox"]')
    expect(listbox.attributes('data-virtualized')).toBe('true')
    expect(listbox.attributes('aria-setsize')).toBe('1000')

    let renderedOptions = wrapper.findAll('[role="option"]')
    expect(renderedOptions).toHaveLength(5)
    expect(renderedOptions[0].text()).toContain('Package 1')
    expect(renderedOptions[0].attributes('aria-posinset')).toBe('1')
    expect(renderedOptions.some((option) => option.text().includes('Package 1000'))).toBe(false)

    ;(listbox.element as HTMLElement).scrollTop = 360
    await listbox.trigger('scroll')

    renderedOptions = wrapper.findAll('[role="option"]')
    expect(renderedOptions).toHaveLength(6)
    expect(renderedOptions[0].text()).toContain('Package 10')
    expect(renderedOptions[0].attributes('aria-posinset')).toBe('10')
    expect(renderedOptions.at(-1)?.text()).toContain('Package 15')

    wrapper.unmount()
  })

  it('renders grouped options with listbox group semantics while keeping flat keyboard navigation', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        options: [
          { label: 'Button', value: 'button', group: 'Basic' },
          { label: 'Input', value: 'input', group: 'Form' },
          { label: 'Select', value: 'select', group: 'Form' }
        ]
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.vm.$nextTick()

    const groups = wrapper.findAll('[role="group"]')
    expect(groups.map((group) => group.attributes('aria-label'))).toEqual(['Basic', 'Form'])
    expect(groups.map((group) => group.find('.yok-select__group-label').text())).toEqual(['Basic', 'Form'])

    const options = wrapper.findAll('[role="option"]')
    expect(options.map((option) => option.text())).toEqual(['Button', 'Input', 'Select'])
    expect(document.activeElement).toBe(options[0].element)

    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(options[1].element)

    wrapper.unmount()
  })

  it('announces empty filter results and moves from search to the first option with arrow keys', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        filterable: true,
        emptyText: 'No package found',
        options: [
          { label: 'Core package', value: 'core' },
          { label: 'Product suite', value: 'product' }
        ]
      },
      attachTo: document.body
    })

    const combobox = wrapper.get('[role="combobox"]')
    combobox.element.focus()

    await combobox.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()

    const searchbox = wrapper.get('[role="searchbox"]')
    expect(document.activeElement).toBe(searchbox.element)

    await searchbox.setValue('zzz')

    expect(wrapper.find('[role="option"]').exists()).toBe(false)
    expect(wrapper.get('[role="status"]').text()).toBe('No package found')

    await searchbox.setValue('core')
    await searchbox.trigger('keydown', { key: 'ArrowDown' })

    expect(document.activeElement).toBe(wrapper.get('[role="option"]').element)

    await wrapper.get('[role="searchbox"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('shows a loading status instead of selectable options while async options refresh', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        loading: true,
        loadingText: 'Loading package options...',
        options: [
          { label: 'Core package', value: 'core' },
          { label: 'Product suite', value: 'product' }
        ]
      },
      attachTo: document.body
    })

    const combobox = wrapper.get('[role="combobox"]')
    combobox.element.focus()

    await combobox.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[role="status"]').text()).toBe('Loading package options...')
    expect(wrapper.find('[role="option"]').exists()).toBe(false)

    await combobox.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(combobox.element)

    wrapper.unmount()
  })

  it('loads remote options from a remoteMethod and ignores stale responses', async () => {
    let resolveCoreSearch: (options: Array<{ label: string; value: string }>) => void = () => {}
    let resolveProductSearch: (options: Array<{ label: string; value: string }>) => void = () => {}
    const remoteMethod = (query: string) =>
      new Promise<Array<{ label: string; value: string }>>((resolve) => {
        if (query === 'core') {
          resolveCoreSearch = resolve
          return
        }

        if (query === 'product') {
          resolveProductSearch = resolve
          return
        }

        resolve([])
      })

    const wrapper = mount(YSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        filterable: true,
        remoteMethod,
        loadingText: 'Loading remote packages...',
        options: [
          { label: 'Local package', value: 'local' }
        ]
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[role="searchbox"]').setValue('core')
    await nextTick()

    expect(wrapper.get('[role="status"]').text()).toBe('Loading remote packages...')
    expect(wrapper.find('[role="option"]').exists()).toBe(false)

    await wrapper.get('[role="searchbox"]').setValue('product')
    await nextTick()

    resolveProductSearch([{ label: 'Product package', value: 'product' }])
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual(['Product package'])

    resolveCoreSearch([{ label: 'Core package', value: 'core' }])
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual(['Product package'])

    await wrapper.get('[role="option"][id$="product"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['product'])

    wrapper.unmount()
  })

  it('dismisses the listbox from outside pointer and escape', async () => {
    const wrapper = mount(YSelect, {
      props: {
        modelValue: '',
        label: 'Package',
        options: [
          { label: 'Core', value: 'core' },
          { label: 'Product', value: 'product' }
        ]
      },
      attachTo: document.body
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await nextTick()

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'Escape' })

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    wrapper.unmount()
  })
})
