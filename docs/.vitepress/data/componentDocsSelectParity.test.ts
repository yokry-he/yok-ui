import { readFileSync, readdirSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const componentsDir = resolve(__dirname, '../../components')
const skippedFiles = new Set(['core.md', 'index.md', 'product.md'])
const nonComponentDocPatterns: Array<[RegExp, string]> = [
  [/^##\s+When to use\b/im, 'generic product guidance section'],
  [/<div class="docs-card-grid">/i, 'marketing/card-grid guidance block'],
  [/^##\s+Live example\b/im, 'old live example heading'],
  [/<LiveExampleRunner\b/i, 'old live runner component'],
  [/^##\s+Live runner\b/im, 'live runner section'],
  [/^##\s+Workflow scenarios\b/im, 'workflow scenario section'],
  [/^##\s+API reference handoff\b/im, 'API handoff section'],
  [/<ComponentAccessibilityEvidence\b/i, 'development accessibility evidence widget']
]

function readComponentDocs() {
  return readdirSync(componentsDir)
    .filter((file) => file.endsWith('.md') && !skippedFiles.has(file))
    .map((file) => ({
      file,
      slug: basename(file, '.md'),
      source: readFileSync(resolve(componentsDir, file), 'utf8')
    }))
    .filter((doc) => doc.source.includes('<ComponentApiSection'))
}

function getLineIndex(source: string, pattern: RegExp) {
  return source.split('\n').findIndex((line) => pattern.test(line))
}

describe('component docs Select parity', () => {
  const docs = readComponentDocs()

  it('uses Select-style page scaffolding for every component doc', () => {
    expect(docs.length).toBeGreaterThan(100)

    for (const doc of docs) {
      expect(doc.source, `${doc.file} should include a Select-style tip`).toContain('::: tip TIP')
      expect(doc.source, `${doc.file} should not embed the old live runner section`).not.toMatch(/<LiveExampleRunner|## Live example/)
      expect(doc.source, `${doc.file} should not expose Playground or GitHub edit controls in static demos`).not.toMatch(
        /data-demo-action="source-file"|在\s*Playground|GitHub\s*中编辑|github\s*中编辑/i
      )

      for (const [pattern, label] of nonComponentDocPatterns) {
        expect(doc.source, `${doc.file} should not include ${label}`).not.toMatch(pattern)
      }

      expect(doc.source, `${doc.file} should expose a component-specific API heading`).toMatch(
        new RegExp(`^## .+ API \\{#${doc.slug}-api\\}`, 'm')
      )
      expect(doc.source, `${doc.file} should expose a stable accessibility heading`).toMatch(
        /^## Accessibility \{#accessibility\}/m
      )
    }
  })

  it('orders API before Accessibility without rendering development evidence widgets', () => {
    for (const doc of docs) {
      const apiIndex = getLineIndex(doc.source, /^## .+ API \{#[^}]+\}/)
      const accessibilityIndex = getLineIndex(doc.source, /^## Accessibility \{#accessibility\}/)

      expect(apiIndex, `${doc.file} API heading should exist`).toBeGreaterThan(-1)
      expect(accessibilityIndex, `${doc.file} Accessibility heading should exist`).toBeGreaterThan(apiIndex)
      expect(doc.source, `${doc.file} should not render development accessibility evidence`).not.toContain(
        '<ComponentAccessibilityEvidence'
      )
    }
  })

  it('gives every DocDemo a nearby second-level scenario heading', () => {
    for (const doc of docs) {
      const lines = doc.source.split('\n')

      lines.forEach((line, index) => {
        if (!/^<DocDemo\b/.test(line)) {
          return
        }

        const previousHeading = [...lines.slice(0, index)].reverse().find((candidate) => /^## .+ \{#[^}]+\}/.test(candidate))

        expect(previousHeading, `${doc.file} DocDemo at line ${index + 1} needs a Select-style scenario heading`).toBeTruthy()
      })
    }
  })

  it('gives every second-level heading a stable route anchor for the right-side contents menu', () => {
    for (const doc of docs) {
      const headings = doc.source.split('\n').filter((line) => /^##\s+/.test(line))

      expect(headings.length, `${doc.file} should have second-level sections`).toBeGreaterThan(0)

      for (const heading of headings) {
        expect(heading, `${doc.file} heading should include an explicit anchor`).toMatch(/^##\s+.+\s+\{#[^}]+\}\s*$/)
      }
    }
  })

  it('orders component pages like Element Plus docs: examples first, API near the end, then accessibility', () => {
    for (const doc of docs) {
      const firstDemoIndex = getLineIndex(doc.source, /^<DocDemo\b/)
      const apiIndex = getLineIndex(doc.source, /^## .+ API \{#[^}]+\}/)
      const accessibilityIndex = getLineIndex(doc.source, /^## Accessibility \{#accessibility\}/)

      expect(firstDemoIndex, `${doc.file} should include at least one example before API`).toBeGreaterThan(-1)
      expect(apiIndex, `${doc.file} API should follow example sections`).toBeGreaterThan(firstDemoIndex)
      expect(accessibilityIndex, `${doc.file} Accessibility should follow API`).toBeGreaterThan(apiIndex)
    }
  })
})
