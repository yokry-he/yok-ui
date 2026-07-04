import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { componentApis, components } from './componentRegistry'
import { liveExampleDocs } from './liveExamples'

function docsPathFromRoute(route: string) {
  return `docs${route}.md`
}

function hasApiRows(componentName: string) {
  const api = componentApis[componentName]

  return Boolean(
    api?.props?.length ||
    api?.events?.length ||
    api?.slots?.length ||
    api?.types?.length
  )
}

describe('component docs integrity', () => {
  it('keeps every component page aligned with live examples, API and accessibility docs', () => {
    const componentPages = components.filter((component) => component.docs.startsWith('/components/'))
    const uniquePageRoutes = [...new Set(componentPages.map((component) => component.docs))]

    expect(uniquePageRoutes.length).toBeGreaterThan(50)

    uniquePageRoutes.forEach((route) => {
      const pageComponents = componentPages.filter((component) => component.docs === route)
      const pageSource = readFileSync(docsPathFromRoute(route), 'utf8')
      const pageHasApiData = pageComponents.some((component) => hasApiRows(component.name))

      expect(pageSource, `${route} should include a LiveExampleRunner`).toContain('<LiveExampleRunner')
      expect(liveExampleDocs, `${route} should be registered in liveExampleCoverage`).toContain(route)
      expect(pageSource, `${route} should include an API heading`).toMatch(/^## API/m)
      expect(pageSource, `${route} should include an Accessibility heading`).toMatch(/^## Accessibility/m)

      if (pageHasApiData) {
        expect(
          pageSource.includes('<ComponentApiSection'),
          `${route} should render structured API data with ComponentApiSection`
        ).toBe(true)
        expect(pageSource, `${route} should not use the legacy ApiTable renderer`).not.toContain('<ApiTable')
      }
    })
  })

  it('keeps maintainer guidance aligned with ComponentApiSection', () => {
    const guide = readFileSync('docs/guide/component-api.md', 'utf8')
    const apiReference = readFileSync('docs/resources/api-reference.md', 'utf8')
    const designSystem = readFileSync('docs/resources/design-system.md', 'utf8')

    expect(guide).toContain('ComponentApiSection')
    expect(guide).not.toContain('<ApiTable')
    expect(guide).not.toContain('引用 `ApiTable`')
    expect(apiReference).toContain('ComponentApiSection')
    expect(apiReference).not.toContain('ApiTable')
    expect(designSystem).toContain('ComponentApiSection')
    expect(designSystem).not.toContain('ApiTable')
  })
})
