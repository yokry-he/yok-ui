import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('public docs runtime', () => {
  it('uses DocDemo without registering the legacy LiveExampleRunner', () => {
    const theme = readFileSync('docs/.vitepress/theme/index.ts', 'utf8')
    const config = readFileSync('docs/.vitepress/config.ts', 'utf8')

    expect(theme).toContain("app.component('DocDemo', DocDemo)")
    expect(theme).not.toContain("app.component('LiveExampleRunner'")
    expect(config).not.toContain("moduleId.includes('/docs/.vitepress/components/LiveExampleRunner.vue')")
  })
})
