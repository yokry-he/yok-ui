import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  getDocDemoSourceQualityItems,
  getDocDemoSourceQualitySummary
} from './docDemoSourceQuality'

const docsRoot = resolve(__dirname, '../..')

const highFrequencyDocs = [
  'button',
  'checkbox',
  'color-picker',
  'input',
  'radio-group',
  'rate',
  'segmented',
  'select',
  'slider',
  'switch'
]

const highFrequencyInputDocs = [
  'autocomplete',
  'input',
  'mention',
  'select',
  'textarea'
]

const navigationOverlayDocs = [
  'breadcrumb',
  'dropdown',
  'popover'
]

const foundationFormDocs = [
  'card',
  'divider',
  'empty',
  'form-item',
  'form-summary'
]

const feedbackDisplayDocs = [
  'image',
  'result',
  'skeleton',
  'steps',
  'timeline'
]

const businessDisplayDocs = [
  'descriptions',
  'feature-grid',
  'list',
  'statistic',
  'status-timeline'
]

const productBrandDocs = [
  'brand-hero',
  'code-block',
  'command-palette',
  'logo-cloud',
  'metric-card',
  'page-header',
  'profile-card',
  'theme-switcher'
]

const adminWorkflowDocs = [
  'bulk-action-bar',
  'data-toolbar',
  'filter-tabs',
  'review-workflow',
  'saved-views',
  'schema-form',
  'search-panel',
  'virtual-list'
]

const finalComponentDocs = [
  'crud-layout',
  'data-view',
  'loading',
  'resource-page',
  'search-form',
  'tag-badge'
]

const complexDocs = [
  'cascader',
  'data-table',
  'date-picker',
  'date-range-picker',
  'table',
  'transfer',
  'tree',
  'upload'
]

const interactionDocs = [
  'alert',
  'autocomplete',
  'avatar',
  'drawer',
  'input-number',
  'mention',
  'modal',
  'pagination',
  'progress',
  'tabs',
  'tooltip'
]

const complexInteractionDocs = [
  'tree-select'
]

const remainingStaticDemoDocs = [
  'backtop',
  'config-provider',
  'float-button',
  'icon',
  'link',
  'message',
  'message-box',
  'popconfirm',
  'qr-code',
  'scrollbar',
  'space',
  'text',
  'time-picker',
  'tour',
  'watermark'
]

function readComponentDoc(name: string) {
  return readFileSync(resolve(docsRoot, 'components', `${name}.md`), 'utf8')
}

function collectMarkdownFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const filePath = resolve(directory, entry)
    const stats = statSync(filePath)

    if (stats.isDirectory()) {
      return collectMarkdownFiles(filePath)
    }

    return entry.endsWith('.md') ? [filePath] : []
  })
}

function docDemoBlocks(source: string) {
  return Array.from(source.matchAll(/<DocDemo[\s\S]*?>/g)).map((match) => match[0])
}

function codeBindingName(block: string) {
  return block.match(/:code="([^"]+)"/)?.[1] ?? ''
}

function hasScriptSetupInBinding(source: string, bindingName: string) {
  if (!bindingName) {
    return false
  }

  const bindingStart = source.indexOf(`const ${bindingName} =`)

  if (bindingStart === -1) {
    return false
  }

  const nextBindingStart = source.indexOf('\nconst ', bindingStart + 1)
  const bindingSource = source.slice(bindingStart, nextBindingStart === -1 ? undefined : nextBindingStart)

  return bindingSource.includes('<script setup')
}

describe('DocDemo source quality', () => {
  it('exposes static demo source quality as dashboard-ready data', () => {
    const items = getDocDemoSourceQualityItems()
    const summary = getDocDemoSourceQualitySummary()
    const select = items.find((item) => item.docs === '/components/select')
    const menu = items.find((item) => item.docs === '/components/menu')
    const calendar = items.find((item) => item.docs === '/components/calendar')
    const carousel = items.find((item) => item.docs === '/components/carousel')
    const notification = items.find((item) => item.docs === '/components/notification')
    const anchor = items.find((item) => item.docs === '/components/anchor')
    const schemaForm = items.find((item) => item.docs === '/components/schema-form')

    expect(items.length).toBeGreaterThan(0)
    expect(summary.totalDocs).toBe(items.length)
    expect(summary.totalDemos).toBeGreaterThan(0)
    expect(summary.completeDocs).toBeGreaterThan(0)
    expect(summary.completeDocs).toBeLessThanOrEqual(summary.totalDocs)
    expect(summary.completeRate).toBeGreaterThan(0)
    expect(summary.nextQueue.every((item) => item.status !== 'complete')).toBe(true)
    expect(summary.nextQueue.every((item) => item.checks.some((check) => !check.passed))).toBe(true)
    expect(select).toMatchObject({
      docs: '/components/select',
      title: 'Select',
      status: 'complete'
    })
    expect(select?.demoCount).toBeGreaterThan(0)
    expect(select?.checks.every((check) => check.passed)).toBe(true)
    expect(menu).toMatchObject({
      docs: '/components/menu',
      title: 'Menu',
      status: 'complete',
      demoCount: 3,
      completeHandoffCount: 3
    })
    expect(menu?.checks.every((check) => check.passed)).toBe(true)
    expect(calendar).toMatchObject({
      docs: '/components/calendar',
      title: 'Calendar',
      status: 'complete',
      demoCount: 3,
      completeHandoffCount: 3
    })
    expect(calendar?.checks.every((check) => check.passed)).toBe(true)
    expect(carousel).toMatchObject({
      docs: '/components/carousel',
      title: 'Carousel',
      status: 'complete',
      demoCount: 4,
      completeHandoffCount: 4
    })
    expect(carousel?.checks.every((check) => check.passed)).toBe(true)
    expect(notification).toMatchObject({
      docs: '/components/notification',
      title: 'Notification',
      status: 'complete',
      demoCount: 3,
      completeHandoffCount: 3
    })
    expect(notification?.checks.every((check) => check.passed)).toBe(true)
    expect(anchor).toMatchObject({
      docs: '/components/anchor',
      title: 'Anchor',
      status: 'complete',
      demoCount: 3,
      completeHandoffCount: 3
    })
    expect(anchor?.checks.every((check) => check.passed)).toBe(true)
    expect(schemaForm).toMatchObject({
      docs: '/components/schema-form',
      title: 'Schema Form',
      status: 'complete',
      demoCount: 3,
      completeHandoffCount: 3
    })
    expect(schemaForm?.checks.every((check) => check.passed)).toBe(true)
  })

  it('tracks component pages that still use raw demo-box examples instead of DocDemo', () => {
    const items = getDocDemoSourceQualityItems()
    const summary = getDocDemoSourceQualitySummary()
    const rawDemoBoxItems = items.filter((item) => item.rawDemoBoxCount > 0)

    expect(summary.rawDemoBoxDocs).toEqual(rawDemoBoxItems.map((item) => item.docs))

    if (rawDemoBoxItems.length > 0) {
      expect(rawDemoBoxItems.every((item) => item.rawDemoBoxCount > 0)).toBe(true)
      expect(summary.totalDocs).toBeGreaterThan(summary.docsWithDocDemo)
      expect(summary.needsDocDemo).toBeGreaterThan(0)
      expect(summary.nextQueue.some((item) => item.status === 'needs-doc-demo')).toBe(true)
      return
    }

    expect(rawDemoBoxItems).toEqual([])
    expect(summary.rawDemoBoxDocs).toEqual([])
  })

  it('keeps component, package and block docs free of legacy raw demo-box examples', () => {
    const docsToScan = ['components', 'packages', 'blocks'].flatMap((directory) =>
      collectMarkdownFiles(resolve(docsRoot, directory))
    )
    const legacyDemoBoxes = docsToScan
      .filter((filePath) => /<(div|section)\s+class="demo-box"/.test(readFileSync(filePath, 'utf8')))
      .map((filePath) => filePath.replace(`${docsRoot}/`, 'docs/'))

    expect(legacyDemoBoxes).toEqual([])
  })

  it('keeps high frequency and complex component demos ready for complete SFC handoff', () => {
    const missingDocDemo = highFrequencyDocs.filter((name) =>
      docDemoBlocks(readComponentDoc(name)).length === 0
    )
    const missingSetup = highFrequencyDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(missingDocDemo).toEqual([])
    expect(missingSetup).toEqual([])
  })

  it('keeps high frequency input docs on DocDemo without legacy demo boxes', () => {
    const legacyDemoBoxes = highFrequencyInputDocs.filter((name) =>
      readComponentDoc(name).includes('class="demo-box"')
    )
    const missingDocDemo = highFrequencyInputDocs.filter((name) =>
      docDemoBlocks(readComponentDoc(name)).length === 0
    )
    const missingSetup = highFrequencyInputDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(legacyDemoBoxes).toEqual([])
    expect(missingDocDemo).toEqual([])
    expect(missingSetup).toEqual([])
  })

  it('keeps navigation and overlay docs on DocDemo without legacy demo boxes', () => {
    const legacyDemoBoxes = navigationOverlayDocs.filter((name) =>
      readComponentDoc(name).includes('class="demo-box"')
    )
    const missingDocDemo = navigationOverlayDocs.filter((name) =>
      docDemoBlocks(readComponentDoc(name)).length === 0
    )
    const missingSetup = navigationOverlayDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(legacyDemoBoxes).toEqual([])
    expect(missingDocDemo).toEqual([])
    expect(missingSetup).toEqual([])
  })

  it('keeps foundation and form helper docs on DocDemo without legacy demo boxes', () => {
    const legacyDemoBoxes = foundationFormDocs.filter((name) =>
      readComponentDoc(name).includes('class="demo-box"')
    )
    const missingDocDemo = foundationFormDocs.filter((name) =>
      docDemoBlocks(readComponentDoc(name)).length === 0
    )
    const missingSetup = foundationFormDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(legacyDemoBoxes).toEqual([])
    expect(missingDocDemo).toEqual([])
    expect(missingSetup).toEqual([])
  })

  it('keeps feedback and display docs on DocDemo without legacy demo boxes', () => {
    const legacyDemoBoxes = feedbackDisplayDocs.filter((name) =>
      readComponentDoc(name).includes('class="demo-box"')
    )
    const missingDocDemo = feedbackDisplayDocs.filter((name) =>
      docDemoBlocks(readComponentDoc(name)).length === 0
    )
    const missingSetup = feedbackDisplayDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(legacyDemoBoxes).toEqual([])
    expect(missingDocDemo).toEqual([])
    expect(missingSetup).toEqual([])
  })

  it('keeps business display docs on DocDemo without legacy demo boxes', () => {
    const legacyDemoBoxes = businessDisplayDocs.filter((name) =>
      readComponentDoc(name).includes('class="demo-box"')
    )
    const missingDocDemo = businessDisplayDocs.filter((name) =>
      docDemoBlocks(readComponentDoc(name)).length === 0
    )
    const missingSetup = businessDisplayDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(legacyDemoBoxes).toEqual([])
    expect(missingDocDemo).toEqual([])
    expect(missingSetup).toEqual([])
  })

  it('keeps product and brand docs on DocDemo without legacy demo boxes', () => {
    const legacyDemoBoxes = productBrandDocs.filter((name) =>
      readComponentDoc(name).includes('class="demo-box"')
    )
    const missingDocDemo = productBrandDocs.filter((name) =>
      docDemoBlocks(readComponentDoc(name)).length === 0
    )
    const missingSetup = productBrandDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(legacyDemoBoxes).toEqual([])
    expect(missingDocDemo).toEqual([])
    expect(missingSetup).toEqual([])
  })

  it('keeps admin workflow docs on DocDemo without legacy demo boxes', () => {
    const legacyDemoBoxes = adminWorkflowDocs.filter((name) =>
      readComponentDoc(name).includes('class="demo-box"')
    )
    const missingDocDemo = adminWorkflowDocs.filter((name) =>
      docDemoBlocks(readComponentDoc(name)).length === 0
    )
    const missingSetup = adminWorkflowDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(legacyDemoBoxes).toEqual([])
    expect(missingDocDemo).toEqual([])
    expect(missingSetup).toEqual([])
  })

  it('keeps final component docs on DocDemo without legacy demo boxes', () => {
    const legacyDemoBoxes = finalComponentDocs.filter((name) =>
      readComponentDoc(name).includes('class="demo-box"')
    )
    const missingDocDemo = finalComponentDocs.filter((name) =>
      docDemoBlocks(readComponentDoc(name)).length === 0
    )
    const missingSetup = finalComponentDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(legacyDemoBoxes).toEqual([])
    expect(missingDocDemo).toEqual([])
    expect(missingSetup).toEqual([])
  })

  it('keeps complex component demos from referencing shared data without setup handoff', () => {
    const missingSetup = complexDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name))
        .filter((block) => block.includes(':code='))
        .filter((block) => !block.includes(':setup='))
        .map((block) => `${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`)
    )

    expect(missingSetup).toEqual([])
  })

  it('keeps common interaction component demos ready for Playground editing', () => {
    const missingSetup = interactionDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(missingSetup).toEqual([])
  })

  it('keeps complex interaction component demos ready for Playground editing', () => {
    const missingSetup = complexInteractionDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(missingSetup).toEqual([])
  })

  it('keeps remaining static component demos ready for Playground editing', () => {
    const missingSetup = remainingStaticDemoDocs.flatMap((name) =>
      docDemoBlocks(readComponentDoc(name)).filter((block) => block.includes(':code=')).flatMap((block) => {
        const source = readComponentDoc(name)
        const bindingName = codeBindingName(block)
        const isCompleteSfc = block.includes(':setup=') || hasScriptSetupInBinding(source, bindingName)

        return isCompleteSfc ? [] : [`${name}: ${block.match(/title="([^"]+)"/)?.[1] ?? 'untitled'}`]
      })
    )

    expect(missingSetup).toEqual([])
  })
})
