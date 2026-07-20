# Yok UI Foundation Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove legacy live-runner code from the public documentation runtime, replace self-declared maturity claims with verifiable evidence, and make the workspace portable enough for CI.

**Architecture:** Keep `DocDemo` as the public example primitive and leave the legacy `LiveExampleRunner` source untouched while disconnecting it from the public VitePress app. Introduce a small verification model derived from component registration, actual DocDemo source blocks, and the generated browser audit report. Resolve workspace paths from `import.meta.url` and add one CI workflow that exercises the existing commands.

**Tech Stack:** Vue 3, VitePress, TypeScript, Vitest, pnpm, GitHub Actions.

---

### Task 1: Portable workspace configuration

**Files:**
- Create: `scripts/workspace-portability.test.ts`
- Modify: `vitest.config.ts`
- Create: `.github/workflows/ci.yml`

- [x] **Step 1: Write the failing portability test**

```ts
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
```

- [x] **Step 2: Run the test and verify it fails for the absolute aliases and missing workflow**

Run: `pnpm vitest run scripts/workspace-portability.test.ts`

- [x] **Step 3: Resolve aliases from the repository URL and add CI**

Use `fileURLToPath(new URL('./packages/.../src', import.meta.url))` for every workspace alias. Configure CI with pnpm 10.12.1, Node 22, frozen installation, test, typecheck, package build, and docs build.

- [x] **Step 4: Run the portability test again**

Run: `pnpm vitest run scripts/workspace-portability.test.ts`

### Task 2: Disconnect the legacy live runner from public docs

**Files:**
- Create: `docs/.vitepress/theme/publicDocsRuntime.test.ts`
- Modify: `docs/.vitepress/theme/index.ts`
- Modify: `docs/.vitepress/config.ts`

- [x] **Step 1: Write the failing public-runtime test**

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('public docs runtime', () => {
  it('uses DocDemo without registering the legacy LiveExampleRunner', () => {
    const theme = readFileSync('docs/.vitepress/theme/index.ts', 'utf8')
    const config = readFileSync('docs/.vitepress/config.ts', 'utf8')
    expect(theme).not.toContain("app.component('LiveExampleRunner'")
    expect(config).not.toContain("moduleId.includes('/docs/.vitepress/components/LiveExampleRunner.vue')")
  })
})
```

- [x] **Step 2: Run the test and verify the old registration is detected**

Run: `pnpm vitest run docs/.vitepress/theme/publicDocsRuntime.test.ts`

- [x] **Step 3: Remove only the public registration and obsolete runner chunk rule**

Keep all legacy files and user changes intact. `DocDemo` remains the public example block.

- [x] **Step 4: Run the focused theme/runtime tests**

Run: `pnpm vitest run docs/.vitepress/theme/publicDocsRuntime.test.ts docs/.vitepress/theme/themePerformance.test.ts`

### Task 3: Replace registration claims with verification evidence

**Files:**
- Create: `docs/.vitepress/data/componentVerification.ts`
- Create: `docs/.vitepress/data/componentVerification.test.ts`
- Modify: `docs/.vitepress/components/ComponentCatalog.vue`
- Modify: `docs/.vitepress/components/ComponentCatalog.test.ts`

- [x] **Step 1: Write failing tests for the evidence ladder**

Verify that `/components/select` is browser-verified from `a11y-runtime-report.generated.json`, unverified routes are not promoted, DocDemo readiness comes from parsed Markdown, and release-ready requires stable status plus complete docs and browser evidence.

- [x] **Step 2: Run the new tests and observe the missing module failure**

Run: `pnpm vitest run docs/.vitepress/data/componentVerification.test.ts`

- [x] **Step 3: Implement the five evidence stages**

```ts
export type ComponentVerificationStage =
  | 'registered'
  | 'documented'
  | 'example-ready'
  | 'browser-verified'
  | 'release-ready'
```

Derive stages from `componentRegistry`, `docDemoSourceQuality`, and the generated runtime report. Never treat a registry entry as browser proof.

- [x] **Step 4: Update component catalog metrics and filters**

Replace “a11y tracked” and “live examples” with “example ready”, “browser verified”, and “release ready”. Replace the legacy `liveExampleDocs` import with the new verification map.

- [x] **Step 5: Run evidence and catalog tests**

Run: `pnpm vitest run docs/.vitepress/data/componentVerification.test.ts docs/.vitepress/components/ComponentCatalog.test.ts`

### Task 4: Full verification

**Files:**
- Modify only files required by failures caused by Tasks 1-3.

- [x] **Step 0: Remove oversized public maturity and release chunks**

Replace the legacy public dashboards with `VerificationDashboard` and `ReleaseVerification`. Both consume the new verification model and leave the user's legacy dashboard files untouched. Rebuild until the VitePress chunk-size warning is gone.

- [x] **Step 1: Run all unit tests**

Run: `pnpm test`

- [x] **Step 2: Run package type checking**

Run: `pnpm typecheck`

- [x] **Step 3: Build packages and docs**

Run: `pnpm build`

Run: `pnpm docs:build`

- [x] **Step 4: Browser-check the component catalog at desktop and narrow viewport**

Verify that metrics fit, labels are honest, sidebars do not overlap, and the docs site no longer loads the legacy runner on the component overview route.

No Git commit is included because the user has not requested committing the current dirty worktree.
