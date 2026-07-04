import { describe, expect, it } from 'vitest'
import {
  adoptionReadinessGates,
  getAdoptionReadinessSummary
} from './adoptionReadiness'

describe('adoptionReadiness', () => {
  it('tracks mainstream installation and auto-import adoption gates', () => {
    const summary = getAdoptionReadinessSummary()
    const gateKeys = adoptionReadinessGates.map((gate) => gate.key)

    expect(gateKeys).toEqual(expect.arrayContaining([
      'package-presets',
      'full-plugin-install',
      'named-on-demand-import',
      'auto-import-resolver',
      'style-side-effects',
      'type-declarations',
      'theme-css-exports',
      'docs-runtime-audit'
    ]))
    expect(summary.total).toBeGreaterThanOrEqual(8)
    expect(summary.passed).toBe(summary.total)
    expect(summary.coverageRate).toBe(100)
    expect(summary.adoptionSurfaces).toEqual(expect.arrayContaining([
      'install',
      'plugin',
      'on-demand',
      'auto-import',
      'style',
      'types',
      'theme',
      'audit'
    ]))
    expect(summary.evidenceLinks).toEqual(expect.arrayContaining([
      '/guide/installation',
      '/packages/resolver',
      '/resources/maturity'
    ]))
    expect(summary.nextQueue).toHaveLength(0)

    expect(adoptionReadinessGates.find((gate) => gate.key === 'auto-import-resolver')).toMatchObject({
      status: 'passed',
      packageName: '@yok-ui/resolver',
      command: 'pnpm add -D unplugin-vue-components @yok-ui/resolver'
    })
    expect(adoptionReadinessGates.find((gate) => gate.key === 'type-declarations')?.evidence).toEqual(expect.arrayContaining([
      'packages/package-manifest.test.ts',
      'pnpm typecheck'
    ]))
  })
})
