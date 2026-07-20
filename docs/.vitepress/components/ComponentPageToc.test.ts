import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ComponentPageToc from './ComponentPageToc.vue'

const routeState = vi.hoisted(() => ({
  path: '/components/data-table'
}))

vi.mock('vitepress', () => ({
  useRoute: () => ({
    get path() {
      return routeState.path
    }
  })
}))

const renderPageHeadings = (headings: string[]) => {
  document.body.innerHTML = [
    '<div class="VPDoc">',
    '  <div class="content-container">',
    '    <div class="vp-doc">',
    ...headings.map((heading) => `      ${heading}`),
    '      <div class="doc-demo"><h3 id="demo-heading">Demo heading</h3></div>',
    '      <div class="live-example-runner"><h2 id="live-example">Live example</h2></div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('')
}

const collectHeadings = async () => {
  await nextTick()
  await new Promise((resolve) => window.requestAnimationFrame(resolve))
  await nextTick()
}

describe('ComponentPageToc', () => {
  beforeEach(() => {
    routeState.path = '/components/data-table'
    document.body.innerHTML = ''
  })

  it('renders one Element Plus style contents list from the page headings', async () => {
    renderPageHeadings([
      '<h2 id="when-to-use">When to use</h2>',
      '<h2 id="api">API</h2>',
      '<h3 id="api-props">Props</h3>'
    ])

    const wrapper = mount(ComponentPageToc)

    await collectHeadings()

    expect(wrapper.find('.component-page-toc').exists()).toBe(true)
    expect(wrapper.text()).toContain('CONTENTS')
    expect(wrapper.find('a[href="#when-to-use"]').text()).toBe('When to use')
    expect(wrapper.find('a[href="#api"]').text()).toBe('API')
    expect(wrapper.find('a[href="#api-props"]').text()).toBe('Props')
    expect(wrapper.find('a[href="#api-props"]').classes()).toContain('component-page-toc__section-link--nested')
    expect(wrapper.find('a[href="#demo-heading"]').exists()).toBe(false)
    expect(wrapper.find('a[href="#live-example"]').exists()).toBe(false)
    expect(wrapper.find('.component-page-toc__group--maintenance').exists()).toBe(false)
    expect(wrapper.find('.component-page-toc__scenario').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('API data center')
  })

  it('uses rendered Select headings instead of hard-coded route shortcuts', async () => {
    routeState.path = '/components/select'
    renderPageHeadings([
      '<h2 id="basic-usage">基础用法</h2>',
      '<h2 id="options-attributes">Options 属性</h2>',
      '<h3 id="api-select-attributes">Select Attributes</h3>',
      '<h2 id="accessibility">Accessibility</h2>'
    ])

    const wrapper = mount(ComponentPageToc)

    await collectHeadings()

    expect(wrapper.text()).toContain('CONTENTS')
    expect(wrapper.find('a[href="#basic-usage"]').text()).toBe('基础用法')
    expect(wrapper.find('a[href="#options-attributes"]').text()).toBe('Options 属性')
    expect(wrapper.find('a[href="#api-select-attributes"]').text()).toBe('Select Attributes')
    expect(wrapper.find('a[href="#accessibility"]').text()).toBe('Accessibility')
    expect(wrapper.find('a[href="#api-props"]').exists()).toBe(false)
    expect(wrapper.find('a[href="#live-example"]').exists()).toBe(false)
  })

  it('keeps the contents shell empty until rendered headings are available', () => {
    const wrapper = mount(ComponentPageToc)

    expect(wrapper.find('.component-page-toc').exists()).toBe(true)
    expect(wrapper.text()).toContain('CONTENTS')
    expect(wrapper.find('.component-page-toc__section-list').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Live example')
    expect(wrapper.text()).not.toContain('API data center')
  })

  it('reads the new page headings after navigation remounts the toc', async () => {
    renderPageHeadings(['<h2 id="table-api">Table API</h2>'])

    const wrapper = mount(ComponentPageToc)

    await collectHeadings()
    expect(wrapper.find('a[href="#table-api"]').exists()).toBe(true)

    wrapper.unmount()
    routeState.path = '/components/tag-badge'
    renderPageHeadings(['<h2 id="tag-api">Tag API</h2>', '<h3 id="badge-props">Badge Props</h3>'])
    const nextWrapper = mount(ComponentPageToc)

    await collectHeadings()

    expect(nextWrapper.find('a[href="#table-api"]').exists()).toBe(false)
    expect(nextWrapper.find('a[href="#tag-api"]').exists()).toBe(true)
    expect(nextWrapper.find('a[href="#badge-props"]').classes()).toContain('component-page-toc__section-link--nested')
  })

  it('does not render outside component pages', () => {
    routeState.path = '/guide/introduction'

    const wrapper = mount(ComponentPageToc)

    expect(wrapper.find('.component-page-toc').exists()).toBe(false)
  })
})
