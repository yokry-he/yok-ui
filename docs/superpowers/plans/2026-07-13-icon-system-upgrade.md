# Yok UI Icon System Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand `@yok-ui/icons` from a tiny path registry into a practical SVG icon package with curated common icons, stable Vue component exports, and stronger docs.

**Architecture:** Keep `@yok-ui/core`'s `YIcon` as the wrapper for size, color, spin, and accessibility. Upgrade `@yok-ui/icons` into the concrete icon asset layer: a typed SVG metadata registry, cached named renderer, and direct component exports such as `YSearchIcon`. This keeps the base component package lean while giving application code and docs a richer icon vocabulary.

**Tech Stack:** Vue 3 render functions, TypeScript literal types, Vite package build, Vitest + Vue Test Utils, VitePress docs.

---

### Task 1: Lock Icon Package Contracts

**Files:**
- Modify: `packages/utility-packages.test.ts`

- [ ] **Step 1: Write failing tests**

Add expectations that `@yok-ui/icons` exposes at least 80 icons, semantic categories, direct component exports, and richer SVG props.

- [ ] **Step 2: Run the focused test**

Run: `pnpm vitest run packages/utility-packages.test.ts`

Expected before implementation: fail because exports and icon count do not exist yet.

### Task 2: Upgrade `@yok-ui/icons`

**Files:**
- Modify: `packages/icons/src/iconPaths.ts`
- Modify: `packages/icons/src/createYokIcon.ts`
- Modify: `packages/icons/src/YokIcon.ts`
- Modify: `packages/icons/src/index.ts`

- [ ] **Step 1: Expand the registry**

Add curated outline SVG paths grouped by category and expose `yokIconCategories`.

- [ ] **Step 2: Upgrade renderer options**

Support `strokeWidth`, `stroke`, `fill`, `decorative`, and title-based accessibility while keeping defaults compatible.

- [ ] **Step 3: Add cached named rendering**

Avoid creating a new component on every `YokIcon` render by caching components per icon name.

- [ ] **Step 4: Add direct exports**

Export common direct icon components such as `YSearchIcon`, `YCheckIcon`, `YSettingsIcon`, and `YChevronDownIcon`.

### Task 3: Document the Icon System

**Files:**
- Modify: `packages/icons/README.md`
- Modify: `docs/packages/icons.md`
- Modify: `docs/components/icon.md`

- [ ] **Step 1: Update package README**

Document package usage, named component usage, category registry, accessibility, and SVG-vs-font rationale.

- [ ] **Step 2: Update docs package page**

Show install, wrapper usage, direct imports, and category browsing guidance.

- [ ] **Step 3: Update component docs**

Show `YIcon` wrapping icons from `@yok-ui/icons`.

### Task 4: Verify

**Files:**
- Read: package and docs outputs

- [ ] **Step 1: Run focused tests**

Run: `pnpm vitest run packages/utility-packages.test.ts docs/.vitepress/data/componentRegistry.test.ts`

- [ ] **Step 2: Run typecheck/build**

Run: `pnpm --filter @yok-ui/icons typecheck`

Run: `pnpm --filter @yok-ui/icons build`

Run: `pnpm docs:build`

- [ ] **Step 3: Inspect package exports**

Run a Node import check against `@yok-ui/icons` to verify named exports resolve.
