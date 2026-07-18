import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('ComponentCatalog evidence labels', () => {
  it('uses verification evidence instead of the legacy live-example registry', () => {
    const source = readFileSync('docs/.vitepress/components/ComponentCatalog.vue', 'utf8')

    expect(source).not.toContain("from '../data/liveExamples'")
    expect(source).toContain("from '../data/componentVerification'")
    expect(source).toContain('example ready')
    expect(source).toContain('browser verified')
    expect(source).toContain('release ready')
  })

  it('stacks the overview hero before the family grid becomes too narrow', () => {
    const styles = readFileSync('docs/.vitepress/theme/custom.css', 'utf8')
    const responsiveStyles = styles.slice(styles.indexOf('@media (max-width: 960px)'))

    expect(responsiveStyles).toMatch(/\.catalog-hero\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s)
  })
})
