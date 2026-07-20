# Yok UI Package Publishing and Documentation Deployment Design

## Status

- Approved direction: local first publish, followed by GitHub Actions OIDC publishing.
- npm organization: `yok-ui`.
- npm package scope: `@yok-ui/*`.
- Initial public version: `0.1.0` for all publishable packages.
- Documentation host: Vercel with Git-based preview and production deployments.

## Goals

1. Publish all eight Yok UI packages publicly and in dependency-safe order.
2. Make the first release auditable, reproducible, and recoverable without storing credentials in the repository.
3. Replace manual npm credentials with npm Trusted Publishing through GitHub Actions after the packages exist.
4. Deploy the VitePress documentation site to Vercel and enable preview deployments for branches and pull requests.
5. Provide a Release Center that reports readiness and links to controlled release actions without handling secrets in the browser.
6. Document npm installation and mainland China mirror usage without attempting redundant publication to public mirrors.

## Non-goals

- Publishing private packages or charging for package access.
- Building a custom credential vault or proxying npm/Vercel credentials through the documentation site.
- Publishing independently to every public npm mirror. Public mirrors synchronize from the npm registry.
- Introducing semantic-release, Changesets, or another release framework before the initial release pipeline is stable.
- Publishing from unreviewed feature branches.

## Publishable Packages

| Package | Initial version | Direct internal dependencies |
| --- | --- | --- |
| `@yok-ui/themes` | `0.1.0` | none |
| `@yok-ui/hooks` | `0.1.0` | none |
| `@yok-ui/icons` | `0.1.0` | none |
| `@yok-ui/resolver` | `0.1.0` | none |
| `@yok-ui/core` | `0.1.0` | `@yok-ui/themes` |
| `@yok-ui/product` | `0.1.0` | `@yok-ui/core`, `@yok-ui/themes` |
| `@yok-ui/admin` | `0.1.0` | `@yok-ui/core` |
| `@yok-ui/brand` | `0.1.0` | `@yok-ui/core` |

`@yok-ui/docs` and the workspace root remain private and are never published.

## Architecture

### 1. Package Metadata Layer

Every public package receives consistent npm metadata:

- `repository` points to `https://github.com/yokry-he/yok-ui.git` and includes its package directory.
- `homepage` points to the relevant documentation route.
- `bugs` points to the GitHub issue tracker.
- `publishConfig.access` is `public`.
- `publishConfig.provenance` is enabled where supported by the publishing path.
- package contents remain constrained through the existing `files` allowlist.

Workspace dependencies remain `workspace:*` in source. pnpm rewrites them to concrete versions in packed and published manifests. Release verification must inspect packed manifests to prove that no `workspace:` specifier escapes to npm.

### 2. Release Verification Layer

The repository exposes one release verification command that performs, in order:

1. clean working-tree and branch checks;
2. package version alignment and package-name uniqueness checks;
3. unit tests;
4. type checks;
5. package builds;
6. documentation build;
7. `pnpm pack --dry-run` or equivalent packed-artifact inspection for every package;
8. manifest inspection for forbidden `workspace:` dependencies;
9. package installation and import smoke tests from generated tarballs;
10. a publication plan containing package order, tarball paths, sizes, and integrity information.

The command must fail before publishing if any package is missing expected JavaScript, CSS, declaration files, README, license metadata, or a valid export target.

### 3. First Publish Layer

The first publication is intentionally local because npm Trusted Publishing cannot be configured for a package that does not yet exist.

1. The user runs `npm login` locally and completes 2FA in the terminal or browser.
2. The release verification command produces immutable tarballs and a publish plan.
3. The publish command publishes tarballs, not mutable package directories.
4. Packages are published in dependency order:
   - foundation: themes, hooks, icons, resolver;
   - core: core;
   - dependent suites: product, admin, brand.
5. After each publish, the process verifies the registry version before moving to the next dependency level.
6. A failed package stops the run. Already published versions are not unpublished automatically; the process records the partial state and supports resuming only unpublished packages.

The user enters any required one-time password directly into npm. OTP values, recovery codes, cookies, and npm session data must never be written to project files, logs, GitHub Secrets, or documentation.

### 4. Trusted Publishing Layer

After all eight packages exist on npm, each package is configured with the same GitHub Trusted Publisher identity:

- repository owner: `yokry-he`;
- repository: `yok-ui`;
- workflow filename: the dedicated release workflow;
- environment: a protected GitHub environment used for npm publication.

The GitHub Actions workflow receives `id-token: write` and `contents: read`. It uses current supported Node and npm versions, builds from a clean checkout, repeats the release verification gates, and publishes with provenance. No long-lived `NPM_TOKEN` is stored.

The workflow is manually dispatched with an explicit version and npm dist-tag. It rejects versions that do not match all publishable manifests and rejects a version already present in the registry. Production publication uses a GitHub environment approval gate so an accidental workflow click cannot immediately publish.

### 5. Vercel Deployment Layer

The documentation site is deployed as a Vercel project connected to `yokry-he/yok-ui`:

- project root remains the monorepo root so pnpm workspace dependencies are available;
- install command: `pnpm install --frozen-lockfile`;
- build command: `pnpm docs:build`;
- output directory: `docs/.vitepress/dist`;
- non-default branches and pull requests create Preview deployments;
- the default production branch creates Production deployments.

The initial deployment is a Preview. Production promotion happens only after the preview URL is visually and functionally verified.

### 6. Release Center Layer

The documentation Release Center is a read-only control surface. It may display:

- current and proposed package versions;
- verification status and last successful workflow run;
- links to npm package pages, GitHub Actions, release notes, and Vercel deployments;
- copyable local verification commands;
- public npm and mainland China mirror installation commands.

It must not accept, transmit, persist, or reveal npm tokens, OTP values, GitHub tokens, Vercel tokens, or recovery codes. The “publish” action opens the protected GitHub Actions workflow rather than publishing directly from the browser.

## Mainland China Registry Strategy

The source of truth is the public npm registry. Public mirrors such as npmmirror synchronize published npm packages and are used through registry configuration, for example:

```bash
pnpm config set registry https://registry.npmmirror.com
pnpm add @yok-ui/core
```

The release process may request or verify mirror synchronization after npm publication, but it does not republish identical public packages under separate credentials. Private artifact registries such as Tencent CODING/CNB or Huawei CodeArts are optional future distribution targets and require a separate design because they introduce credentials, retention policy, and independent availability concerns.

## Data and Control Flow

```text
source manifests
  -> release verification
  -> deterministic tarballs and publish plan
  -> local first publish with npm 2FA
  -> npm registry verification
  -> npm Trusted Publisher configuration
  -> protected GitHub Actions releases with OIDC and provenance

Git branch or pull request
  -> GitHub repository
  -> Vercel build from monorepo root
  -> preview URL
  -> visual and functional review
  -> production promotion from the default branch
```

## Failure Handling and Recovery

- Build, test, typecheck, package-content, or smoke-test failures stop before any network write.
- npm authentication failures stop before publishing and instruct the user to reauthenticate locally.
- If publication partially succeeds, the release record lists published and pending packages. The retry process queries npm and skips only packages whose exact version and integrity already match.
- Published versions are never silently overwritten or automatically unpublished.
- OIDC failures do not fall back to a stored token. The workflow fails with an actionable configuration error.
- Vercel preview failures do not affect npm publication and do not promote to production.
- Vercel production rollback uses the previously successful deployment in the Vercel dashboard; package rollback uses a new patch version or deprecation notice rather than unpublish.

## Security Model

- npm account and npm organization require 2FA.
- First-publish authentication stays in the user's local npm session.
- Subsequent npm publishing uses short-lived OIDC credentials.
- GitHub release environment requires an explicit approval.
- GitHub Actions permissions are minimal and job-scoped.
- Generated logs redact authentication details and never print environment variables.
- `.npmrc`, `.env`, `.vercel`, tarballs, release plans, and local output artifacts are reviewed for ignore rules before execution.

## Testing and Acceptance Criteria

The implementation is complete when:

1. all eight packages pass test, typecheck, build, pack inspection, and tarball installation smoke tests;
2. all package manifests contain consistent repository, homepage, bugs, license, files, exports, and public publish metadata;
3. no published or packed manifest contains a `workspace:` dependency;
4. all eight `0.1.0` versions are publicly visible on npm and installable in a clean temporary Vue project;
5. package imports, CSS entry points, and TypeScript declarations resolve from registry-installed packages;
6. npm Trusted Publishing is configured for all eight packages and a protected GitHub Actions dry run reaches the publish gate without requiring `NPM_TOKEN`;
7. Vercel returns a working Preview URL for the documentation site, including direct navigation to nested VitePress routes;
8. the Release Center documents the workflow and exposes no secret input or secret value;
9. npm registry and npmmirror installation paths are documented and verified after synchronization;
10. implementation and operator documentation records every command, manual approval, failure mode, and rollback path.

## Delivery Sequence

1. Harden manifests, ignore rules, and release scripts.
2. Add release tests and tarball smoke tests.
3. Run the complete local release verification without publishing.
4. Authenticate the user's local npm CLI.
5. Publish all eight packages at `0.1.0` and verify registry installation.
6. Add and configure the protected OIDC GitHub Actions release workflow.
7. Configure the eight npm Trusted Publishers through the npm website.
8. Install/authenticate Vercel CLI or connect the GitHub repository through Vercel.
9. deploy and verify a Preview, then enable production deployment from the default branch.
10. update the Release Center and operator documentation with verified URLs and status.

## References

- npm Trusted Publishing: <https://docs.npmjs.com/trusted-publishers/>
- npm scoped public packages: <https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/>
- npm two-factor authentication: <https://docs.npmjs.com/configuring-two-factor-authentication/>
- Vercel monorepos: <https://vercel.com/docs/monorepos>
- Vercel project configuration: <https://vercel.com/docs/project-configuration>
- cnpm/npmmirror synchronization: <https://github.com/cnpm/cnpm>
