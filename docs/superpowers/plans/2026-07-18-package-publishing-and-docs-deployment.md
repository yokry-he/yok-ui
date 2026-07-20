# Yok UI Package Publishing and Documentation Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish all eight `@yok-ui/*` packages at `0.1.0`, replace persistent npm credentials with GitHub OIDC, and deploy the VitePress documentation site to Vercel with a safe release control surface.

**Architecture:** A tested Node release module owns package discovery, dependency ordering, tarball verification, registry checks, and resumable publication. Local first-publish and GitHub Actions call the same module; Vercel builds the monorepo documentation from the repository root, while Release Center exposes only public status and links.

**Tech Stack:** Node.js 24, npm 11, pnpm 10, Vue 3, VitePress, Vitest, GitHub Actions OIDC, npm Trusted Publishing, Vercel.

---

## File Map

- `packages/*/package.json`: npm identity, repository, homepage, issue tracker, public access, and package file contracts.
- `package.json`: release verification and publication commands.
- `.gitignore`: local tarballs, Vercel link state, and generated release output exclusions.
- `scripts/release/package-graph.mjs`: authoritative package list and dependency levels.
- `scripts/release/package-graph.test.ts`: graph order and manifest contract tests.
- `scripts/release/package-artifacts.mjs`: deterministic pack, manifest inspection, and clean-project smoke tests.
- `scripts/release/package-artifacts.test.ts`: tarball contract and failure tests.
- `scripts/release/publish-packages.mjs`: registry-aware, resumable publication orchestration.
- `scripts/release/publish-packages.test.ts`: command construction, skip, failure, and resume tests.
- `.github/workflows/publish.yml`: protected manual OIDC publication workflow.
- `.github/workflows/ci.yml`: reusable release verification in ordinary CI.
- `vercel.json`: monorepo documentation build contract.
- `docs/.vitepress/data/releaseOperations.ts`: public npm, GitHub, Vercel, and mirror links/status labels.
- `docs/.vitepress/data/releaseOperations.test.ts`: secret-free release operation data tests.
- `docs/.vitepress/components/ReleaseDashboard.vue`: read-only release control surface.
- `docs/.vitepress/components/ReleaseDashboard.test.ts`: workflow links and secret-input regression tests.
- `docs/resources/release.md`: operator-facing release, deployment, mirror, and recovery guide.
- `README.md`: repository onboarding, package list, installation, and release/deployment links.

### Task 1: Lock Public Package Metadata and Package Graph

**Files:**
- Modify: `packages/admin/package.json`
- Modify: `packages/brand/package.json`
- Modify: `packages/core/package.json`
- Modify: `packages/hooks/package.json`
- Modify: `packages/icons/package.json`
- Modify: `packages/product/package.json`
- Modify: `packages/resolver/package.json`
- Modify: `packages/themes/package.json`
- Create: `scripts/release/package-graph.mjs`
- Create: `scripts/release/package-graph.test.ts`

- [ ] **Step 1: Write package graph and metadata contract tests**

Create tests that load every publishable manifest and assert the exact package set, version alignment, public access, repository directory, stable homepage, issue tracker, MIT license, README inclusion, export targets, and dependency order:

```ts
import { describe, expect, it } from 'vitest'
import { loadReleasePackages, releaseLevels } from './package-graph.mjs'

describe('release package graph', () => {
  it('contains the eight public packages in dependency-safe levels', async () => {
    expect(releaseLevels).toEqual([
      ['@yok-ui/themes', '@yok-ui/hooks', '@yok-ui/icons', '@yok-ui/resolver'],
      ['@yok-ui/core'],
      ['@yok-ui/product', '@yok-ui/admin', '@yok-ui/brand']
    ])
  })

  it('exposes complete public npm metadata', async () => {
    const packages = await loadReleasePackages()

    for (const releasePackage of packages) {
      expect(releasePackage.manifest.version).toBe('0.1.0')
      expect(releasePackage.manifest.publishConfig).toMatchObject({ access: 'public' })
      expect(releasePackage.manifest.repository).toMatchObject({
        type: 'git',
        url: 'git+https://github.com/yokry-he/yok-ui.git',
        directory: `packages/${releasePackage.directory}`
      })
      expect(releasePackage.manifest.bugs).toEqual({
        url: 'https://github.com/yokry-he/yok-ui/issues'
      })
      expect(releasePackage.manifest.homepage).toContain(
        `github.com/yokry-he/yok-ui/tree/main/packages/${releasePackage.directory}`
      )
      expect(releasePackage.manifest.files).toContain('README.md')
    }
  })
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `pnpm vitest run scripts/release/package-graph.test.ts`

Expected: FAIL because `package-graph.mjs` and public metadata do not exist yet.

- [ ] **Step 3: Implement the authoritative package graph**

Export `releaseLevels`, `releasePackageNames`, and `loadReleasePackages()` from `scripts/release/package-graph.mjs`. Resolve paths from `import.meta.url`, validate internal dependencies against the graph, and throw with the package name when a dependency references an unknown `@yok-ui/*` package.

```js
export const releaseLevels = [
  ['@yok-ui/themes', '@yok-ui/hooks', '@yok-ui/icons', '@yok-ui/resolver'],
  ['@yok-ui/core'],
  ['@yok-ui/product', '@yok-ui/admin', '@yok-ui/brand']
]

export const releasePackageNames = releaseLevels.flat()
```

- [ ] **Step 4: Add consistent metadata to all eight manifests**

For each package, add the package-specific directory while keeping all existing exports and dependencies:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yokry-he/yok-ui.git",
    "directory": "packages/core"
  },
  "homepage": "https://github.com/yokry-he/yok-ui/tree/main/packages/core#readme",
  "bugs": {
    "url": "https://github.com/yokry-he/yok-ui/issues"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

- [ ] **Step 5: Run graph tests and all type checks**

Run: `pnpm vitest run scripts/release/package-graph.test.ts && pnpm typecheck`

Expected: PASS.

- [ ] **Step 6: Commit package metadata and graph**

```bash
git add packages/*/package.json scripts/release/package-graph.mjs scripts/release/package-graph.test.ts
git commit -m "build: define public package release graph"
```

### Task 2: Build and Inspect Deterministic Package Tarballs

**Files:**
- Create: `scripts/release/package-artifacts.mjs`
- Create: `scripts/release/package-artifacts.test.ts`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Write artifact contract tests**

Test `inspectPackedManifest()` with valid and invalid fixtures and run one real pack for `@yok-ui/icons`. Assert that packed dependencies contain no `workspace:` values and every `exports` target exists inside the tarball.

```ts
it('rejects workspace protocols in packed manifests', () => {
  expect(() => inspectPackedManifest({
    name: '@yok-ui/admin',
    version: '0.1.0',
    dependencies: { '@yok-ui/core': 'workspace:*' },
    exports: { '.': './dist/index.js' }
  }, new Set(['package/dist/index.js']))).toThrow(/workspace:/)
})
```

- [ ] **Step 2: Run artifact tests and verify they fail**

Run: `pnpm vitest run scripts/release/package-artifacts.test.ts`

Expected: FAIL because artifact helpers are not implemented.

- [ ] **Step 3: Implement build, pack, and inspection helpers**

`buildReleaseArtifacts({ outputDir })` must:

1. remove and recreate the requested output directory;
2. run `pnpm build` once;
3. run `pnpm --dir packages/<dir> pack --pack-destination <outputDir>` in graph order;
4. inspect each tarball with `tar -tzf` and `tar -xOf <tarball> package/package.json`;
5. verify name, version, files, exports, types, CSS entries, README, and rewritten internal dependencies;
6. return JSON containing package name, tarball path, bytes, SHA-512 integrity, and dependency level.

Use `execFile`/`spawn`, never shell-concatenated user input.

- [ ] **Step 4: Add root commands and local output exclusions**

Add these scripts:

```json
{
  "release:verify": "node scripts/release/package-artifacts.mjs verify",
  "release:publish": "node scripts/release/publish-packages.mjs publish"
}
```

Add to `.gitignore`:

```gitignore
.vercel
outputs/publish
*.tgz
```

- [ ] **Step 5: Run focused tests and a real artifact verification**

Run: `pnpm vitest run scripts/release/package-artifacts.test.ts && pnpm release:verify`

Expected: PASS and eight tarballs under `outputs/publish/0.1.0/`, with no tracked changes in generated output.

- [ ] **Step 6: Commit artifact verification**

```bash
git add package.json .gitignore scripts/release/package-artifacts.mjs scripts/release/package-artifacts.test.ts
git commit -m "build: verify publishable package artifacts"
```

### Task 3: Add Clean-Install Smoke Tests

**Files:**
- Modify: `scripts/release/package-artifacts.mjs`
- Modify: `scripts/release/package-artifacts.test.ts`

- [ ] **Step 1: Write a failing clean-install smoke test**

Use a temporary directory and the generated tarballs to install Vue plus all eight packages. Verify ESM imports, declaration entry points, and exported CSS files without relying on workspace aliases.

```ts
it('installs registry-shaped tarballs in a clean Vue project', async () => {
  const result = await smokeTestTarballs({ tarballs, keepTemp: false })
  expect(result.importedPackages).toEqual(releasePackageNames)
  expect(result.cssEntries).toContain('@yok-ui/core/style.css')
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `pnpm vitest run scripts/release/package-artifacts.test.ts -t "clean Vue project"`

Expected: FAIL because `smokeTestTarballs()` is missing.

- [ ] **Step 3: Implement the isolated smoke project**

Create a temporary package with `type: module`, install Vue and tarballs using `pnpm add --ignore-workspace`, run an ESM import probe for each package, resolve declared type and CSS paths, then remove the temporary directory in `finally`. Include `--keep-temp` only as an explicit debugging option. Add a `--registry` mode to `package-artifacts.mjs` that installs the exact `<package>@<version>` package set from `https://registry.npmjs.org` instead of local tarballs; require `--version` in that mode.

- [ ] **Step 4: Run release verification and full tests**

Run: `pnpm release:verify && pnpm test`

Expected: PASS; output reports eight importable packages and no temporary directory remains.

- [ ] **Step 5: Commit smoke verification**

```bash
git add scripts/release/package-artifacts.mjs scripts/release/package-artifacts.test.ts
git commit -m "test: verify packages in a clean consumer project"
```

### Task 4: Implement Registry-Aware Resumable Publication

**Files:**
- Create: `scripts/release/publish-packages.mjs`
- Create: `scripts/release/publish-packages.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write publication orchestration tests**

Inject command and registry adapters so tests never publish. Cover exact command arguments, dependency levels, already-published skips, integrity mismatch, stop-on-failure, and resume behavior.

```ts
it('publishes tarballs in dependency levels and skips exact existing versions', async () => {
  const result = await publishRelease({
    version: '0.1.0',
    tag: 'latest',
    provenance: false,
    registry: fakeRegistry({ '@yok-ui/themes@0.1.0': expectedIntegrity }),
    runNpm: recordedNpm
  })

  expect(result.skipped).toContain('@yok-ui/themes')
  expect(recordedNpm.calls[0]).toEqual([
    'publish', expect.stringContaining('yok-ui-hooks-0.1.0.tgz'),
    '--access', 'public', '--tag', 'latest'
  ])
})
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `pnpm vitest run scripts/release/publish-packages.test.ts`

Expected: FAIL because the publisher does not exist.

- [ ] **Step 3: Implement dry-run and publish modes**

The CLI must require `--version`, default `--tag latest`, and require an explicit `--confirm-public-release` for network writes. It must query `npm view <name>@<version> dist.integrity --json`, skip only exact integrity matches, reject mismatches, and write a redacted JSON receipt to `outputs/publish/<version>/publish-receipt.json`.

Local command:

```bash
pnpm release:publish -- --version 0.1.0 --tag latest --confirm-public-release
```

CI adds `--provenance`. Neither mode reads an npm token from arguments or project files.

- [ ] **Step 4: Run unit tests and non-mutating publication dry-run**

Run: `pnpm vitest run scripts/release/publish-packages.test.ts && pnpm release:publish -- --version 0.1.0 --tag latest --dry-run`

Expected: PASS; dry-run lists eight packages and performs no `npm publish` call.

- [ ] **Step 5: Commit publication orchestration**

```bash
git add package.json scripts/release/publish-packages.mjs scripts/release/publish-packages.test.ts
git commit -m "build: add resumable npm package publisher"
```

### Task 5: Add Protected GitHub OIDC Publishing

**Files:**
- Create: `.github/workflows/publish.yml`
- Modify: `.github/workflows/ci.yml`
- Create: `scripts/release/publish-workflow.test.ts`

- [ ] **Step 1: Write workflow policy tests**

Parse workflow YAML as text and assert manual dispatch, protected `npm` environment, minimal permissions, pinned Node/npm/pnpm versions, full verification, provenance, and absence of `NPM_TOKEN`.

```ts
expect(workflow).toContain('workflow_dispatch:')
expect(workflow).toContain('id-token: write')
expect(workflow).toContain('environment: npm')
expect(workflow).toContain('--provenance')
expect(workflow).not.toContain('NPM_TOKEN')
```

- [ ] **Step 2: Run the workflow test and verify it fails**

Run: `pnpm vitest run scripts/release/publish-workflow.test.ts`

Expected: FAIL because `publish.yml` does not exist.

- [ ] **Step 3: Create the manual OIDC workflow**

Use this contract:

```yaml
name: Publish packages

on:
  workflow_dispatch:
    inputs:
      version:
        description: Exact version shared by all public packages
        required: true
        default: 0.1.0
      tag:
        description: npm dist-tag
        required: true
        default: latest

permissions:
  contents: read
  id-token: write

jobs:
  publish:
    environment: npm
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.12.1
      - uses: actions/setup-node@v4
        with:
          node-version: 24.14.0
          registry-url: https://registry.npmjs.org
          cache: pnpm
      - run: npm install --global npm@11.9.0
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm typecheck
      - run: pnpm docs:build
      - run: pnpm release:verify
      - run: pnpm release:publish -- --version "${{ inputs.version }}" --tag "${{ inputs.tag }}" --provenance --confirm-public-release
```

- [ ] **Step 4: Make ordinary CI run package artifact verification**

After package and documentation builds, add `pnpm release:verify` so pull requests catch publish-contract regressions.

- [ ] **Step 5: Run workflow tests and full local quality gates**

Run: `pnpm vitest run scripts/release/publish-workflow.test.ts && pnpm test && pnpm typecheck && pnpm docs:build && pnpm release:verify`

Expected: PASS.

- [ ] **Step 6: Commit OIDC workflow**

```bash
git add .github/workflows/ci.yml .github/workflows/publish.yml scripts/release/publish-workflow.test.ts
git commit -m "ci: add protected npm trusted publishing workflow"
```

### Task 6: Configure Vercel Preview Deployments

**Files:**
- Create: `vercel.json`
- Create: `scripts/vercel-config.test.ts`
- Modify: `.gitignore`
- Modify: `README.md`

- [ ] **Step 1: Write the Vercel configuration test**

```ts
it('builds VitePress from the pnpm monorepo root', () => {
  expect(vercelConfig).toEqual({
    installCommand: 'pnpm install --frozen-lockfile',
    buildCommand: 'pnpm docs:build',
    outputDirectory: 'docs/.vitepress/dist'
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `pnpm vitest run scripts/vercel-config.test.ts`

Expected: FAIL because `vercel.json` is missing.

- [ ] **Step 3: Add the Vercel project contract**

Create:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm docs:build",
  "outputDirectory": "docs/.vitepress/dist"
}
```

Document that the Vercel project root is the repository root and that `.vercel/` remains local-only.

- [ ] **Step 4: Run the config test and production docs build**

Run: `pnpm vitest run scripts/vercel-config.test.ts && pnpm docs:build`

Expected: PASS and `docs/.vitepress/dist/index.html` exists.

- [ ] **Step 5: Commit Vercel configuration**

```bash
git add vercel.json scripts/vercel-config.test.ts .gitignore README.md
git commit -m "deploy: configure Vercel documentation builds"
```

### Task 7: Convert Release Center into a Secret-Free Operations Page

**Files:**
- Create: `docs/.vitepress/data/releaseOperations.ts`
- Create: `docs/.vitepress/data/releaseOperations.test.ts`
- Modify: `docs/.vitepress/components/ReleaseDashboard.vue`
- Modify: `docs/.vitepress/components/ReleaseDashboard.test.ts`
- Modify: `docs/resources/release.md`

- [ ] **Step 1: Write release operation data tests**

Assert eight npm package links, GitHub Actions URL, Vercel dashboard URL, npm/npmmirror commands, and the absence of token/OTP input fields or secret-bearing query parameters.

```ts
expect(operations.packages).toHaveLength(8)
expect(operations.actionsUrl).toBe(
  'https://github.com/yokry-he/yok-ui/actions/workflows/publish.yml'
)
expect(JSON.stringify(operations)).not.toMatch(/NPM_TOKEN|otp=|token=/i)
```

- [ ] **Step 2: Run data and component tests and verify failure**

Run: `pnpm vitest run docs/.vitepress/data/releaseOperations.test.ts docs/.vitepress/components/ReleaseDashboard.test.ts`

Expected: FAIL because operational data and links are missing.

- [ ] **Step 3: Implement public operation data**

Export typed package records, documentation commands, and safe external links. Keep live workflow status optional so the static VitePress build never requires GitHub credentials.

- [ ] **Step 4: Update Release Dashboard**

Add compact sections for package registry links, local verification commands, GitHub publish workflow, Vercel deployment, and registry mirror configuration. Use ordinary links and copy buttons; do not add a password, token, OTP, or direct publish form.

- [ ] **Step 5: Replace provisional release copy with operator documentation**

Document:

- first local publish and 2FA boundary;
- exact package order;
- OIDC trusted publisher fields;
- GitHub environment approval;
- Vercel preview and production behavior;
- npmmirror configuration and synchronization verification;
- partial publish resume and Vercel rollback procedures.

- [ ] **Step 6: Run docs tests, accessibility checks, and build**

Run: `pnpm vitest run docs/.vitepress/data/releaseOperations.test.ts docs/.vitepress/components/ReleaseDashboard.test.ts && pnpm docs:a11y && pnpm docs:build`

Expected: PASS.

- [ ] **Step 7: Commit Release Center updates**

```bash
git add docs/.vitepress/data/releaseOperations.ts docs/.vitepress/data/releaseOperations.test.ts docs/.vitepress/components/ReleaseDashboard.vue docs/.vitepress/components/ReleaseDashboard.test.ts docs/resources/release.md
git commit -m "docs: add secure release operations center"
```

### Task 8: Verify, Publish, Configure OIDC, and Deploy Preview

**Files:**
- Modify after successful external actions: `README.md`
- Modify after successful external actions: `docs/resources/release.md`

- [ ] **Step 1: Run the complete pre-publication verification**

Run:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm docs:build
pnpm release:verify
git status --short
```

Expected: every command passes and only intentional source changes are present.

- [ ] **Step 2: Authenticate npm locally**

Run: `npm login`

User action: complete browser/passkey authentication and enter any requested OTP directly. Never paste credentials into chat or files.

Verify: `npm whoami`

Expected: the npm username that owns or can publish to the `yok-ui` organization.

- [ ] **Step 3: Verify organization access and package availability**

Run:

```bash
npm access list packages yok-ui --registry https://registry.npmjs.org/
npm view @yok-ui/core@0.1.0 version --json
```

Expected before first publication: organization access succeeds; package lookup returns not found.

- [ ] **Step 4: Perform the first public publication**

Run:

```bash
pnpm release:publish -- --version 0.1.0 --tag latest --confirm-public-release
```

Expected: eight successful or integrity-matched package records in the receipt. Stop immediately on any unexpected package ownership or integrity error.

- [ ] **Step 5: Verify registry installation**

Run:

```bash
npm view @yok-ui/core@0.1.0 version dist.integrity repository --json --registry https://registry.npmjs.org/
pnpm release:verify --registry --version 0.1.0
```

Expected: version `0.1.0`, correct GitHub repository, and clean install/import verification from npm.

- [ ] **Step 6: Push implementation commits and configure GitHub**

Push the current branch only after user approval. Then create the `npm` GitHub environment with a required reviewer and merge the reviewed workflow to the default branch.

- [ ] **Step 7: Configure all eight npm Trusted Publishers**

For each npm package, configure:

```text
Provider: GitHub Actions
Owner: yokry-he
Repository: yok-ui
Workflow filename: publish.yml
Environment: npm
```

Expected: every package shows the same trusted publisher and no repository `NPM_TOKEN` secret exists.

- [ ] **Step 8: Authenticate and link Vercel**

Install and authenticate:

```bash
npm install --global vercel
vercel login
vercel whoami
vercel teams list --format json > /tmp/yok-ui-vercel-teams.json
```

Read `/tmp/yok-ui-vercel-teams.json`. If it contains more than one team, present the exact slugs and wait for the user to choose one. Export the selected exact slug in the current shell, then link the Git repository:

```bash
read -r "VERCEL_SCOPE?Enter the exact selected Vercel team slug: "
test -n "$VERCEL_SCOPE"
vercel link --repo --scope "$VERCEL_SCOPE"
```

User action: complete browser authentication and select the intended Vercel account/team if prompted.

- [ ] **Step 9: Deploy and inspect a preview**

Run:

```bash
PREVIEW_URL="$(vercel deploy . -y --no-wait --scope "$VERCEL_SCOPE")"
vercel inspect "$PREVIEW_URL" --scope "$VERCEL_SCOPE"
```

Expected: Ready preview deployment. Verify `/`, `/components/`, `/components/button`, `/guide/installation`, and `/resources/release` at desktop and narrow viewports before production promotion.

- [ ] **Step 10: Verify mainland China mirror availability**

After npm synchronization, run:

```bash
npm view @yok-ui/core@0.1.0 version --registry=https://registry.npmmirror.com
```

If not yet synchronized, request a public mirror sync and retry later; do not publish a duplicate package.

- [ ] **Step 11: Record verified public URLs and commit**

Update README and release documentation with the actual npm package URLs, preview/production documentation URL, workflow URL, mirror status, and publication date.

```bash
git add README.md docs/resources/release.md
git commit -m "docs: record initial package and documentation release"
```

- [ ] **Step 12: Run final verification**

Run: `pnpm test && pnpm typecheck && pnpm build && pnpm docs:build && pnpm release:verify`

Expected: PASS with all eight registry-published packages verified and no secret files tracked.
