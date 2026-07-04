import { describe, expect, it } from 'vitest'
import {
  getSupportMatrixSummary,
  supportMatrixItems
} from './supportMatrix'

describe('supportMatrix', () => {
  it('tracks runtime, browser, bundler and documentation support like mainstream component libraries', () => {
    const summary = getSupportMatrixSummary()
    const itemKeys = supportMatrixItems.map((item) => item.key)

    expect(itemKeys).toEqual(expect.arrayContaining([
      'vue-3-runtime',
      'modern-browser-baseline',
      'no-ie-support',
      'vite-library-build',
      'package-manager-install',
      'ssr-hydration-boundary',
      'css-variable-theme-runtime',
      'a11y-baseline',
      'auto-import-tooling'
    ]))
    expect(summary.total).toBeGreaterThanOrEqual(9)
    expect(summary.supported).toBe(summary.total)
    expect(summary.supportRate).toBe(100)
    expect(summary.categories).toEqual(expect.arrayContaining([
      'runtime',
      'browser',
      'bundler',
      'package-manager',
      'ssr',
      'css',
      'accessibility',
      'automation'
    ]))
    expect(summary.docsRoutes).toEqual(expect.arrayContaining([
      '/resources/support',
      '/guide/installation',
      '/guide/theming',
      '/guide/accessibility',
      '/resources/maturity'
    ]))
    expect(summary.nextQueue).toHaveLength(0)

    expect(supportMatrixItems.find((item) => item.key === 'modern-browser-baseline')).toMatchObject({
      category: 'browser',
      minimum: 'Chrome 85 / Edge 85 / Firefox 79 / Safari 14.1'
    })
    expect(supportMatrixItems.find((item) => item.key === 'ssr-hydration-boundary')?.evidence).toEqual(expect.arrayContaining([
      'docs/guide/installation.md',
      'packages/package-exports.test.ts'
    ]))
  })
})
