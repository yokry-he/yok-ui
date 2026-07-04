import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const workspaceRoot = process.cwd()

function readJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function readPackageVersions() {
  return ['core', 'product', 'admin', 'brand', 'themes', 'resolver'].reduce<Record<string, string>>((versions, packageDir) => {
    const manifest = readJsonFile<{ name: string, version: string }>(
      resolve(workspaceRoot, 'packages', packageDir, 'package.json')
    )

    versions[manifest.name] = manifest.version
    return versions
  }, {})
}

describe('release dry-run script', () => {
  it('is exposed as a workspace command', () => {
    const manifest = readJsonFile<{ scripts: Record<string, string> }>(
      resolve(workspaceRoot, 'package.json')
    )

    expect(manifest.scripts['release:dry-run']).toBe('node scripts/release-dry-run.mjs')
  })

  it('writes release plan artifacts without mutating package versions', () => {
    const beforeVersions = readPackageVersions()
    const outputDir = mkdtempSync(resolve(tmpdir(), 'yok-ui-release-'))

    try {
      const stdout = execFileSync('node', [
        resolve(workspaceRoot, 'scripts/release-dry-run.mjs'),
        '--output',
        outputDir
      ], {
        cwd: workspaceRoot,
        encoding: 'utf8'
      })

      const afterVersions = readPackageVersions()
      const planPath = resolve(outputDir, 'yok-ui-0.2.0-release-plan.md')
      const dataPath = resolve(outputDir, 'yok-ui-0.2.0-release-plan.json')
      const markdown = readFileSync(planPath, 'utf8')
      const data = readJsonFile<{
        dryRun: boolean
        mutatesPackageVersions: boolean
        targetVersion: string
        artifacts: { path: string, format: string }[]
        packages: unknown[]
      }>(dataPath)

      expect(afterVersions).toEqual(beforeVersions)
      expect(data).toMatchObject({
        dryRun: true,
        mutatesPackageVersions: false,
        targetVersion: '0.2.0'
      })
      expect(data.artifacts.map((artifact) => artifact.path)).toEqual([
        'outputs/release/yok-ui-0.2.0-release-plan.md',
        'outputs/release/yok-ui-0.2.0-release-plan.json'
      ])
      expect(data.packages.length).toBeGreaterThan(0)
      expect(markdown).toContain('# Yok UI 0.2.0 release dry-run')
      expect(markdown).toContain('Release gate evidence')
      expect(markdown).toContain('Edited Source Share')
      expect(JSON.stringify(data.changelogDraft)).toContain('Edited Source Share')
      expect(markdown).toContain('pnpm test')
      expect(stdout).toContain('yok-ui-0.2.0-release-plan.json')
    } finally {
      rmSync(outputDir, { recursive: true, force: true })
    }
  })

  it('keeps checked-in dry-run artifacts aligned with the current release gates', () => {
    const markdown = readFileSync(
      resolve(workspaceRoot, 'outputs/release/yok-ui-0.2.0-release-plan.md'),
      'utf8'
    )
    const data = readJsonFile<{
      changelogDraft: { markdown: string }
      packages: Array<{ components: Array<{ evidence: string[] }> }>
    }>(resolve(workspaceRoot, 'outputs/release/yok-ui-0.2.0-release-plan.json'))

    expect(markdown).toContain('Edited Source Share')
    expect(data.changelogDraft.markdown).toContain('Edited Source Share')
    expect(data.packages[0]?.components[0]?.evidence).toContain('Edited Source Share')
  })
})
