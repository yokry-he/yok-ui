import { describe, expect, it } from 'vitest'
import { getReleaseReadinessSummary } from './releaseReadiness'
import { getReleaseWorkflowSummary } from './releaseWorkflow'

describe('releaseWorkflow', () => {
  it('turns release-ready components into package-scoped release plans', () => {
    const readiness = getReleaseReadinessSummary()
    const workflow = getReleaseWorkflowSummary()

    expect(workflow.candidateCount).toBe(readiness.candidateCount)
    expect(workflow.releasePackages.length).toBeGreaterThan(0)
    expect(workflow.releasePackages.every((releasePackage) => releasePackage.components.length > 0)).toBe(true)
    expect(workflow.releasePackages.every((releasePackage) => releasePackage.targetVersion > releasePackage.currentVersion)).toBe(true)
    expect(workflow.releasePackages[0].components[0]).toMatchObject({
      status: expect.any(String),
      score: 100
    })
  })

  it('generates a changelog draft and stable promotion queue from the same evidence', () => {
    const workflow = getReleaseWorkflowSummary()
    const firstCandidate = workflow.releasePackages[0].components[0]

    expect(workflow.changelogDraft.title).toContain(workflow.targetVersion)
    expect(workflow.changelogDraft.markdown).toContain('Release gate evidence')
    expect(workflow.changelogDraft.markdown).toContain('Edited Source Share')
    expect(workflow.changelogDraft.markdown).toContain(firstCandidate.title)
    expect(workflow.artifacts.map((artifact) => artifact.path)).toEqual([
      'outputs/release/yok-ui-0.2.0-release-plan.md',
      'outputs/release/yok-ui-0.2.0-release-plan.json'
    ])
    expect(workflow.promotionQueue.length).toBe(workflow.candidateCount)
    expect(workflow.promotionQueue[0]).toMatchObject({
      nextStatus: 'Stable',
      evidenceHref: '/resources/maturity'
    })
  })

  it('exposes the command checklist required before publishing a package release', () => {
    const workflow = getReleaseWorkflowSummary()

    expect(workflow.checklist.map((item) => item.id)).toEqual([
      'release-dry-run',
      'typecheck',
      'test',
      'build',
      'docs-build',
      'runtime-a11y'
    ])
    expect(workflow.checklist.every((item) => item.required)).toBe(true)
    expect(workflow.checklist.map((item) => item.command)).toEqual(expect.arrayContaining([
      'pnpm release:dry-run',
      'pnpm typecheck',
      'pnpm test',
      'pnpm build',
      'pnpm docs:build',
      'DOCS_A11Y_BASE_URL=http://127.0.0.1:5173 pnpm docs:a11y:runtime'
    ]))
  })
})
