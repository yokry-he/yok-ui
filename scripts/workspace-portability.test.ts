import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('workspace portability', () => {
  it('does not embed a developer home path in Vitest aliases', () => {
    const source = readFileSync('vitest.config.ts', 'utf8')

    expect(source).not.toMatch(/\/Users\//)
    expect(source).toContain('fileURLToPath')
  })

  it('runs the existing quality gates in CI', () => {
    const source = readFileSync('.github/workflows/ci.yml', 'utf8')

    expect(source).toContain('pnpm test')
    expect(source).toContain('pnpm typecheck')
    expect(source).toContain('pnpm build')
    expect(source).toContain('pnpm docs:build')
  })
})
