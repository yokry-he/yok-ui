import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('ReleaseVerification', () => {
  it('uses verified components without loading legacy release readiness data', () => {
    const source = readFileSync('docs/.vitepress/components/ReleaseVerification.vue', 'utf8')

    expect(source).toContain("from '../data/componentVerification'")
    expect(source).not.toContain("from '../data/releaseWorkflow'")
    expect(source).not.toContain("from '../data/releaseReadiness'")
  })

  it('keeps the public release route on the secret-free operations dashboard', () => {
    const page = readFileSync('docs/resources/release.md', 'utf8')
    const theme = readFileSync('docs/.vitepress/theme/index.ts', 'utf8')

    expect(page).toContain('<ReleaseDashboard />')
    expect(page).not.toContain('<ReleaseVerification />')
    expect(theme).toContain("app.component('ReleaseDashboard'")
    expect(theme).toContain("app.component('ReleaseVerification'")
  })
})
