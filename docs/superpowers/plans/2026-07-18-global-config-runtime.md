# Yok UI Global Config Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one backward-compatible global configuration runtime for locale, direction, size, density, theme, font, z-index, tokens, and Button defaults.

**Architecture:** Extend the existing config injection context with focused locale and font modules. Make both providers and the core installer produce the same computed context, then connect Button and locale-aware date components using explicit-prop-first precedence.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, `@yok-ui/themes`.

---

### Task 1: Locale and font foundations

**Files:**
- Create: `packages/core/src/components/config-provider/locale.ts`
- Create: `packages/core/src/components/config-provider/locale.test.ts`
- Create: `packages/core/src/components/config-provider/fonts.ts`
- Create: `packages/core/src/components/config-provider/fonts.test.ts`

- [x] **Step 1: Write failing tests for three locales, fallback translation, interpolation, and five font presets**
- [x] **Step 2: Run `pnpm vitest run packages/core/src/components/config-provider/locale.test.ts packages/core/src/components/config-provider/fonts.test.ts` and verify missing-module failures**
- [x] **Step 3: Implement immutable locale packs and dependency-free CSS font stacks**
- [x] **Step 4: Run the focused tests and verify they pass**

### Task 2: Unified reactive config context

**Files:**
- Modify: `packages/core/src/components/config-provider/context.ts`
- Create: `packages/core/src/components/config-provider/context.test.ts`
- Modify: `packages/core/src/components/config-provider/index.ts`

- [x] **Step 1: Write failing tests for defaults, nested object merge, locale normalization, and translation**
- [x] **Step 2: Run the context test and verify the new API is absent**
- [x] **Step 3: Add `createYokConfigContext` and typed config options while retaining `createDefaultYokConfig`**
- [x] **Step 4: Export all public types and helpers and rerun focused tests**

### Task 3: Provider and theme compatibility

**Files:**
- Modify: `packages/core/src/components/config-provider/YConfigProvider.vue`
- Modify: `packages/core/src/components/config-provider/config-provider.test.ts`
- Modify: `packages/core/src/components/theme-provider/YThemeProvider.vue`
- Modify: `packages/core/src/components/theme-provider/theme-provider.test.ts`

- [x] **Step 1: Add failing provider tests for `lang`, `dir`, theme, font, z-index, tokens, and nested Button defaults**
- [x] **Step 2: Implement provider attributes and scoped variables through the shared context**
- [x] **Step 3: Add a failing compatibility test proving `YThemeProvider` shares config with descendants**
- [x] **Step 4: Refactor `YThemeProvider` into a compatibility facade and rerun both suites**

### Task 4: Plugin options and first component consumer

**Files:**
- Modify: `packages/core/src/plugin.ts`
- Create: `packages/core/src/plugin.test.ts`
- Modify: `packages/core/src/components/button/YButton.vue`
- Modify: `packages/core/src/components/button/button.test.ts`
- Modify: `packages/core/src/index.ts`

- [x] **Step 1: Write a failing plugin test for app-level global config injection**
- [x] **Step 2: Extend installer options without changing existing `app.use` behavior**
- [x] **Step 3: Write failing Button tests for global defaults and explicit prop precedence**
- [x] **Step 4: Connect Button to typed defaults and rerun plugin/Button tests**

### Task 5: Documentation and API registry

**Files:**
- Modify: `docs/components/config-provider.md`
- Modify: `docs/.vitepress/data/componentRegistry.ts`
- Modify: `docs/.vitepress/data/componentRegistry.test.ts`
- Modify: `packages/core/README.md`

- [x] **Step 1: Add failing registry assertions for the new public props and types**
- [x] **Step 2: Update API data, examples, locale/font tables, nesting guidance, and plugin usage**
- [x] **Step 3: Run registry and DocDemo source-quality tests**

### Task 6: Full verification

**Files:**
- Modify only files required by regressions introduced by Tasks 1-5.

- [x] **Step 1: Run `pnpm test`**
- [x] **Step 2: Run `pnpm typecheck`**
- [x] **Step 3: Run `pnpm build` and `pnpm docs:build`**
- [x] **Step 4: Browser-check `/components/config-provider` at desktop and mobile widths**

No Git commit is included because the current worktree contains extensive user-owned changes and the user did not request a commit.
