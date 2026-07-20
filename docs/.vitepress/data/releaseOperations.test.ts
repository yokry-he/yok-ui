import { describe, expect, it } from 'vitest'
import { releaseOperations } from './releaseOperations'

describe('releaseOperations', () => {
  it('exposes public registry, workflow, Vercel and mirror operations without secrets', () => {
    expect(releaseOperations.packages).toHaveLength(8)
    expect(releaseOperations.packages.map((item) => item.name)).toEqual([
      '@yok-ui/themes',
      '@yok-ui/hooks',
      '@yok-ui/icons',
      '@yok-ui/resolver',
      '@yok-ui/core',
      '@yok-ui/product',
      '@yok-ui/admin',
      '@yok-ui/brand'
    ])
    expect(releaseOperations.actionsUrl).toBe(
      'https://github.com/yokry-he/yok-ui/actions/workflows/publish.yml'
    )
    expect(releaseOperations.vercel.dashboardUrl).toBe('https://vercel.com/yokry-projects/yok-ui')
    expect(releaseOperations.vercel.siteUrl).toBe('https://yok-ui.vercel.app')
    expect(releaseOperations.commands.map((item) => item.command)).toEqual(expect.arrayContaining([
      'pnpm test',
      'pnpm typecheck',
      'pnpm docs:build',
      'pnpm release:verify',
      'npx --yes npm@11.18.0 trust list @yok-ui/core --json --registry https://registry.npmjs.org/',
      'pnpm release:publish -- --version 0.1.0 --tag latest --dry-run',
      'pnpm release:publish -- --version 0.1.0 --tag latest --confirm-public-release'
    ]))
    expect(releaseOperations.mirrors.map((item) => item.command)).toEqual(expect.arrayContaining([
      'npm config set registry https://registry.npmmirror.com',
      'npm config set registry https://registry.npmjs.org'
    ]))
    expect(JSON.stringify(releaseOperations)).not.toMatch(/NPM_TOKEN|NODE_AUTH_TOKEN|_authToken|otp=|token=|password/i)
  })
})
