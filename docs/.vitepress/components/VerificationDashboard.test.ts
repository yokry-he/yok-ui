import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('VerificationDashboard', () => {
  it('renders the public maturity view from verifiable evidence only', () => {
    const source = readFileSync('docs/.vitepress/components/VerificationDashboard.vue', 'utf8')

    expect(source).toContain("from '../data/componentVerification'")
    expect(source).toContain('a11y-runtime-report.generated.json')
    expect(source).not.toContain("from '../data/liveExamples'")
    expect(source).not.toContain("from '../data/mainstreamParity'")
  })

  it('replaces the legacy maturity widget on the public resource route', () => {
    const page = readFileSync('docs/resources/maturity.md', 'utf8')
    const theme = readFileSync('docs/.vitepress/theme/index.ts', 'utf8')

    expect(page).toContain('<VerificationDashboard />')
    expect(page).not.toContain('<MaturityDashboard />')
    expect(theme).toContain("app.component('VerificationDashboard'")
    expect(theme).not.toContain("app.component('MaturityDashboard'")
  })
})
