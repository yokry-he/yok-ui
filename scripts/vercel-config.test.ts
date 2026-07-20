import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const workspaceRoot = resolve(__dirname, '..')
const vercelConfigPath = resolve(workspaceRoot, 'vercel.json')

describe('Vercel documentation deployment config', () => {
  it('builds VitePress from the pnpm monorepo root', () => {
    const config = JSON.parse(readFileSync(vercelConfigPath, 'utf8'))

    expect(config).toEqual({
      $schema: 'https://openapi.vercel.sh/vercel.json',
      installCommand: 'pnpm install --frozen-lockfile',
      buildCommand: 'pnpm docs:build',
      outputDirectory: 'docs/.vitepress/dist'
    })
  })
})
