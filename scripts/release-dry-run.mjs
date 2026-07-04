#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const workspaceRoot = fileURLToPath(new URL('../', import.meta.url))
const defaultOutputDir = resolve(workspaceRoot, 'outputs/release')

export function getDefaultReleaseOutputPaths({ outputDir = defaultOutputDir, targetVersion }) {
  const baseName = `yok-ui-${targetVersion}-release-plan`

  return {
    markdownPath: resolve(outputDir, `${baseName}.md`),
    jsonPath: resolve(outputDir, `${baseName}.json`)
  }
}

function createPackagePlan(releasePackage) {
  return {
    packageName: releasePackage.packageName,
    packageLabel: releasePackage.packageLabel,
    currentVersion: releasePackage.currentVersion,
    targetVersion: releasePackage.targetVersion,
    components: releasePackage.components.map((component) => ({
      name: component.name,
      title: component.title,
      status: component.status,
      score: component.score,
      docs: component.docs,
      evidence: component.evidence
    })),
    changelogLines: releasePackage.changelogLines
  }
}

export function createReleaseDryRunArtifacts({ workflow, history, generatedAt = new Date().toISOString() }) {
  const plan = {
    schemaVersion: 1,
    dryRun: true,
    mutatesPackageVersions: false,
    generatedAt,
    currentVersion: workflow.currentVersion,
    targetVersion: workflow.targetVersion,
    candidateCount: workflow.candidateCount,
    blockedCount: workflow.blockedCount,
    packages: workflow.releasePackages.map(createPackagePlan),
    checklist: workflow.checklist,
    artifacts: workflow.artifacts,
    promotionQueue: workflow.promotionQueue,
    changelogDraft: workflow.changelogDraft,
    versionHistory: history.entries.map((entry) => ({
      version: entry.version,
      status: entry.status,
      title: entry.title,
      summary: entry.summary
    }))
  }

  const packageSections = workflow.releasePackages.flatMap((releasePackage) => [
    `### ${releasePackage.packageName}`,
    '',
    `- Current version: ${releasePackage.currentVersion}`,
    `- Target version: ${releasePackage.targetVersion}`,
    `- Scope: ${releasePackage.packageLabel}`,
    '',
    ...releasePackage.components.map((component) =>
      `- ${component.title} (${component.name}): ${component.status} -> Stable, score ${component.score}.`
    ),
    ''
  ])

  const checklistLines = workflow.checklist.map((item) => [
    `- [ ] ${item.label}`,
    `  - Command: \`${item.command}\``,
    `  - Evidence: ${item.evidence}`
  ]).flat()

  const markdown = [
    `# Yok UI ${workflow.targetVersion} release dry-run`,
    '',
    '> Dry run only. This artifact does not mutate package.json versions and does not publish packages.',
    '',
    '## Summary',
    '',
    `- Current version: ${workflow.currentVersion}`,
    `- Target version: ${workflow.targetVersion}`,
    `- Release candidates: ${workflow.candidateCount}`,
    `- Blocked components: ${workflow.blockedCount}`,
    `- Package plans: ${workflow.releasePackages.length}`,
    `- Generated at: ${generatedAt}`,
    '',
    '## Package plans',
    '',
    ...packageSections,
    '## Required verification',
    '',
    ...checklistLines,
    '',
    '## Changelog draft',
    '',
    workflow.changelogDraft.markdown
  ].join('\n')

  return {
    plan,
    markdown
  }
}

async function loadReleaseDataWithVite() {
  const server = await createServer({
    root: workspaceRoot,
    logLevel: 'error',
    server: {
      middlewareMode: true
    }
  })

  try {
    const workflowModule = await server.ssrLoadModule('/docs/.vitepress/data/releaseWorkflow.ts')
    const historyModule = await server.ssrLoadModule('/docs/.vitepress/data/releaseHistory.ts')

    return {
      workflow: workflowModule.getReleaseWorkflowSummary(),
      history: historyModule.getReleaseHistorySummary()
    }
  } finally {
    await server.close()
  }
}

function resolveOutputDir(args) {
  const outputFlagIndex = args.indexOf('--output')

  if (outputFlagIndex >= 0) {
    const value = args[outputFlagIndex + 1]

    if (!value) {
      throw new Error('Missing value for --output')
    }

    return resolve(workspaceRoot, value)
  }

  if (process.env.YOK_UI_RELEASE_OUTPUT_DIR) {
    return resolve(workspaceRoot, process.env.YOK_UI_RELEASE_OUTPUT_DIR)
  }

  return defaultOutputDir
}

export async function writeReleaseDryRunArtifacts({ outputDir = defaultOutputDir } = {}) {
  const { workflow, history } = await loadReleaseDataWithVite()
  const { plan, markdown } = createReleaseDryRunArtifacts({ workflow, history })
  const paths = getDefaultReleaseOutputPaths({
    outputDir,
    targetVersion: workflow.targetVersion
  })

  await mkdir(outputDir, { recursive: true })
  await writeFile(paths.markdownPath, markdown, 'utf8')
  await writeFile(paths.jsonPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8')

  return {
    ...paths,
    dryRun: true,
    targetVersion: workflow.targetVersion,
    packageCount: workflow.releasePackages.length,
    candidateCount: workflow.candidateCount
  }
}

export async function runReleaseDryRunCli(args = process.argv.slice(2)) {
  const outputDir = resolveOutputDir(args)
  const result = await writeReleaseDryRunArtifacts({ outputDir })

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runReleaseDryRunCli().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  })
}
