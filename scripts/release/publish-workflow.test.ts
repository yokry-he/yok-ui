import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const workspaceRoot = resolve(__dirname, '../..')
const publishWorkflowPath = resolve(workspaceRoot, '.github/workflows/publish.yml')
const ciWorkflowPath = resolve(workspaceRoot, '.github/workflows/ci.yml')

function readWorkflow(path: string) {
  return readFileSync(path, 'utf8')
}

describe('npm publish workflow policy', () => {
  it('uses protected GitHub OIDC trusted publishing without long-lived npm tokens', () => {
    const workflow = readWorkflow(publishWorkflowPath)

    expect(workflow).toContain('workflow_dispatch:')
    expect(workflow).toContain('id-token: write')
    expect(workflow).toContain('contents: read')
    expect(workflow).toContain('environment: npm')
    expect(workflow).toContain('node-version: 24.14.0')
    expect(workflow).toContain('npm install --global npm@11.18.0')
    expect(workflow).toContain('version: 10.12.1')
    expect(workflow).toContain('registry-url: https://registry.npmjs.org')
    expect(workflow).toContain('package-manager-cache: false')
    expect(workflow).toContain('pnpm test')
    expect(workflow).toContain('pnpm typecheck')
    expect(workflow).toContain('pnpm docs:build')
    expect(workflow).toContain('pnpm release:verify')
    expect(workflow).toContain('--provenance')
    expect(workflow).toContain('--confirm-public-release')
    expect(workflow).not.toMatch(/NPM_TOKEN|NODE_AUTH_TOKEN|_authToken|otp/i)
  })

  it('keeps ordinary CI aligned with the publishable package contract', () => {
    const workflow = readWorkflow(ciWorkflowPath)

    expect(workflow).toContain('pnpm release:verify')
    expect(workflow).not.toMatch(/NPM_TOKEN|NODE_AUTH_TOKEN|_authToken|otp/i)
  })
})
