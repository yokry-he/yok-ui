# yok-ui Phase One Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working `yok-ui` Vue 3 component-library kernel with packages for themes, core components, product components, docs, and playground.

**Architecture:** Use a pnpm monorepo with independently buildable packages. `@yok-ui/themes` owns design tokens and CSS variables, `@yok-ui/core` owns reusable base components, `@yok-ui/product` owns personal-product components, and `docs` plus `playground` prove the components in real Vue pages.

**Tech Stack:** Vue 3, TypeScript, Vite, pnpm workspace, Vitest, Vue Test Utils, VitePress, CSS variables.

---

## Source Spec

- Blueprint: `outputs/yok-ui-design-blueprint.md`
- Root directory: `/Users/yokry/Documents/Codex/2026-06-13/vue3`
- User-facing style: 清爽可爱
- Package strategy: `core / product / admin / brand` long-term, with phase one implementing `themes / core / product / docs / playground`

## Phase-One Scope

This phase builds a working kernel, not the complete ecosystem.

Included:

- Monorepo package structure.
- Shared TypeScript configuration.
- `@yok-ui/themes` token object and CSS variable themes.
- `@yok-ui/core` starter components: `YButton`, `YIconButton`, `YInput`, `YSwitch`, `YTag`, `YBadge`, `YEmpty`, `YThemeProvider`.
- `@yok-ui/product` starter components: `YCopyButton`, `YThemeSwitcher`, `YCodeBlock`, `YCommandPalette`.
- VitePress docs with package/category browsing.
- Playground app that imports packages through workspace aliases.
- Build, typecheck, and unit-test scripts.

Excluded from phase one:

- `@yok-ui/admin` implementation.
- `@yok-ui/brand` implementation.
- Figma resources.
- Publishing to npm.
- Visual regression service.
- CLI for copying source into projects.

## File Structure

Create this structure:

```txt
/Users/yokry/Documents/Codex/2026-06-13/vue3/
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  vitest.config.ts
  .gitignore
  packages/
    themes/
      package.json
      src/
        index.ts
        tokens.ts
        createThemeVars.ts
        themes/
          yok-light.css
          yok-clean.css
        tokens.test.ts
    core/
      package.json
      src/
        index.ts
        plugin.ts
        styles/
          base.css
        components/
          button/
            YButton.vue
            YIconButton.vue
            button.test.ts
            index.ts
          input/
            YInput.vue
            input.test.ts
            index.ts
          switch/
            YSwitch.vue
            switch.test.ts
            index.ts
          tag/
            YTag.vue
            YBadge.vue
            tag.test.ts
            index.ts
          empty/
            YEmpty.vue
            empty.test.ts
            index.ts
          theme-provider/
            YThemeProvider.vue
            theme-provider.test.ts
            index.ts
    product/
      package.json
      src/
        index.ts
        components/
          copy-button/
            YCopyButton.vue
            copy-button.test.ts
            index.ts
          theme-switcher/
            YThemeSwitcher.vue
            theme-switcher.test.ts
            index.ts
          code-block/
            YCodeBlock.vue
            code-block.test.ts
            index.ts
          command-palette/
            YCommandPalette.vue
            command-palette.test.ts
            index.ts
  docs/
    package.json
    .vitepress/
      config.ts
      theme/
        index.ts
        custom.css
    index.md
    guide/
      introduction.md
      installation.md
      theming.md
    packages/
      core.md
      product.md
      admin.md
      brand.md
    components/
      index.md
      core.md
      product.md
    blocks/
      command-center.md
      product-settings.md
  playground/
    package.json
    index.html
    src/
      main.ts
      App.vue
      style.css
```

## Dependency Policy

The workspace instructions say dependency installation should request external permission instead of first trying unreliable sandboxed network access. During execution, run network-heavy commands with `require_escalated`.

Primary install command:

```bash
pnpm install
```

If `pnpm` is missing:

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
```

Expected result after install:

```txt
Packages: +...
Done in ...
```

## Task 1: Create Monorepo Foundation

**Files:**

- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`

- [ ] **Step 1: Create root package manifest**

Create `package.json`:

```json
{
  "name": "yok-ui-workspace",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.12.1",
  "scripts": {
    "build": "pnpm -r --filter './packages/*' build",
    "typecheck": "pnpm -r --filter './packages/*' typecheck",
    "test": "vitest run",
    "test:watch": "vitest",
    "docs:dev": "pnpm --filter @yok-ui/docs dev",
    "docs:build": "pnpm --filter @yok-ui/docs build",
    "playground:dev": "pnpm --filter @yok-ui/playground dev",
    "playground:build": "pnpm --filter @yok-ui/playground build"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.4",
    "@vue/test-utils": "^2.4.6",
    "happy-dom": "^17.4.7",
    "typescript": "^5.8.3",
    "vite": "^6.3.5",
    "vitepress": "^1.6.3",
    "vitest": "^3.2.4",
    "vue": "^3.5.16",
    "vue-tsc": "^2.2.10"
  }
}
```

- [ ] **Step 2: Create workspace file**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
  - "docs"
  - "playground"
```

- [ ] **Step 3: Create TypeScript base config**

Create `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "types": ["vitest/globals"]
  }
}
```

- [ ] **Step 4: Create Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['packages/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@yok-ui/themes': '/Users/yokry/Documents/Codex/2026-06-13/vue3/packages/themes/src',
      '@yok-ui/core': '/Users/yokry/Documents/Codex/2026-06-13/vue3/packages/core/src',
      '@yok-ui/product': '/Users/yokry/Documents/Codex/2026-06-13/vue3/packages/product/src'
    }
  }
})
```

- [ ] **Step 5: Create git ignore**

Create `.gitignore`:

```gitignore
node_modules
dist
.vitepress/dist
.vite
coverage
*.log
.DS_Store
```

- [ ] **Step 6: Install dependencies with external permission**

Run:

```bash
pnpm install
```

Expected:

```txt
Done in
```

- [ ] **Step 7: Verify base test command starts**

Run:

```bash
pnpm test
```

Expected:

```txt
No test files found
```

Vitest may return a non-zero exit code because no tests exist yet. That is acceptable only for this step.

## Task 2: Build @yok-ui/themes

**Files:**

- Create: `packages/themes/package.json`
- Create: `packages/themes/src/tokens.test.ts`
- Create: `packages/themes/src/tokens.ts`
- Create: `packages/themes/src/createThemeVars.ts`
- Create: `packages/themes/src/index.ts`
- Create: `packages/themes/src/themes/yok-light.css`
- Create: `packages/themes/src/themes/yok-clean.css`

- [ ] **Step 1: Create package manifest**

Create `packages/themes/package.json`:

```json
{
  "name": "@yok-ui/themes",
  "version": "0.1.0",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./yok-light.css": "./src/themes/yok-light.css",
    "./yok-clean.css": "./src/themes/yok-clean.css"
  },
  "scripts": {
    "build": "vite build",
    "typecheck": "vue-tsc --noEmit --skipLibCheck"
  },
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  "devDependencies": {}
}
```

- [ ] **Step 2: Write failing token tests**

Create `packages/themes/src/tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { createThemeVars, yokClean, yokLight } from './index'

describe('yok-ui themes', () => {
  it('exports a清爽可爱 default palette', () => {
    expect(yokLight.color.primary).toBe('#36c6a3')
    expect(yokLight.radius.md).toBe('12px')
  })

  it('exports a cleaner admin-friendly palette', () => {
    expect(yokClean.color.primary).toBe('#2aa7b8')
    expect(yokClean.color.surface).toBe('#ffffff')
  })

  it('converts tokens to css variables', () => {
    const vars = createThemeVars(yokLight)

    expect(vars['--yok-color-primary']).toBe('#36c6a3')
    expect(vars['--yok-radius-md']).toBe('12px')
    expect(vars['--yok-motion-fast']).toBe('120ms ease')
  })
})
```

- [ ] **Step 3: Run test to verify failure**

Run:

```bash
pnpm test packages/themes/src/tokens.test.ts
```

Expected:

```txt
FAIL packages/themes/src/tokens.test.ts
Cannot find module './index'
```

- [ ] **Step 4: Implement token object**

Create `packages/themes/src/tokens.ts`:

```ts
export interface YokThemeTokens {
  color: Record<string, string>
  radius: Record<string, string>
  space: Record<string, string>
  shadow: Record<string, string>
  motion: Record<string, string>
}

export const yokLight: YokThemeTokens = {
  color: {
    primary: '#36c6a3',
    primarySoft: '#e8fbf5',
    accentPink: '#ff8fb3',
    accentBlue: '#7cc7ff',
    accentYellow: '#ffd76d',
    surface: '#fffdfa',
    surfaceMuted: '#f6f8f7',
    text: '#25302d',
    textMuted: '#68736f',
    border: '#dfe8e4',
    danger: '#ef6f7a',
    warning: '#e8a93d',
    success: '#35b985'
  },
  radius: {
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '22px'
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px'
  },
  shadow: {
    soft: '0 8px 24px rgba(37, 48, 45, 0.08)',
    pop: '0 14px 40px rgba(37, 48, 45, 0.12)'
  },
  motion: {
    fast: '120ms ease',
    normal: '180ms ease'
  }
}

export const yokClean: YokThemeTokens = {
  ...yokLight,
  color: {
    ...yokLight.color,
    primary: '#2aa7b8',
    primarySoft: '#e7f7fa',
    surface: '#ffffff',
    surfaceMuted: '#f5f7f8',
    text: '#243033',
    border: '#dce5e8'
  },
  radius: {
    ...yokLight.radius,
    md: '10px',
    lg: '14px'
  }
}
```

- [ ] **Step 5: Implement CSS variable helper**

Create `packages/themes/src/createThemeVars.ts`:

```ts
import type { YokThemeTokens } from './tokens'

export function createThemeVars(theme: YokThemeTokens): Record<string, string> {
  return Object.entries(theme).reduce<Record<string, string>>((vars, [groupName, groupValue]) => {
    Object.entries(groupValue).forEach(([tokenName, tokenValue]) => {
      vars[`--yok-${groupName}-${tokenName}`] = tokenValue
    })

    return vars
  }, {})
}
```

- [ ] **Step 6: Export theme APIs**

Create `packages/themes/src/index.ts`:

```ts
export type { YokThemeTokens } from './tokens'
export { yokClean, yokLight } from './tokens'
export { createThemeVars } from './createThemeVars'
```

- [ ] **Step 7: Create yok-light CSS variables**

Create `packages/themes/src/themes/yok-light.css`:

```css
:root,
[data-yok-theme='yok-light'] {
  --yok-color-primary: #36c6a3;
  --yok-color-primarySoft: #e8fbf5;
  --yok-color-accentPink: #ff8fb3;
  --yok-color-accentBlue: #7cc7ff;
  --yok-color-accentYellow: #ffd76d;
  --yok-color-surface: #fffdfa;
  --yok-color-surfaceMuted: #f6f8f7;
  --yok-color-text: #25302d;
  --yok-color-textMuted: #68736f;
  --yok-color-border: #dfe8e4;
  --yok-color-danger: #ef6f7a;
  --yok-color-warning: #e8a93d;
  --yok-color-success: #35b985;
  --yok-radius-xs: 6px;
  --yok-radius-sm: 8px;
  --yok-radius-md: 12px;
  --yok-radius-lg: 16px;
  --yok-radius-xl: 22px;
  --yok-space-1: 4px;
  --yok-space-2: 8px;
  --yok-space-3: 12px;
  --yok-space-4: 16px;
  --yok-space-5: 20px;
  --yok-space-6: 24px;
  --yok-shadow-soft: 0 8px 24px rgba(37, 48, 45, 0.08);
  --yok-shadow-pop: 0 14px 40px rgba(37, 48, 45, 0.12);
  --yok-motion-fast: 120ms ease;
  --yok-motion-normal: 180ms ease;
}
```

- [ ] **Step 8: Create yok-clean CSS variables**

Create `packages/themes/src/themes/yok-clean.css`:

```css
[data-yok-theme='yok-clean'] {
  --yok-color-primary: #2aa7b8;
  --yok-color-primarySoft: #e7f7fa;
  --yok-color-accentPink: #ff8fb3;
  --yok-color-accentBlue: #7cc7ff;
  --yok-color-accentYellow: #ffd76d;
  --yok-color-surface: #ffffff;
  --yok-color-surfaceMuted: #f5f7f8;
  --yok-color-text: #243033;
  --yok-color-textMuted: #68736f;
  --yok-color-border: #dce5e8;
  --yok-color-danger: #ef6f7a;
  --yok-color-warning: #e8a93d;
  --yok-color-success: #35b985;
  --yok-radius-xs: 6px;
  --yok-radius-sm: 8px;
  --yok-radius-md: 10px;
  --yok-radius-lg: 14px;
  --yok-radius-xl: 22px;
  --yok-space-1: 4px;
  --yok-space-2: 8px;
  --yok-space-3: 12px;
  --yok-space-4: 16px;
  --yok-space-5: 20px;
  --yok-space-6: 24px;
  --yok-shadow-soft: 0 8px 24px rgba(37, 48, 45, 0.08);
  --yok-shadow-pop: 0 14px 40px rgba(37, 48, 45, 0.12);
  --yok-motion-fast: 120ms ease;
  --yok-motion-normal: 180ms ease;
}
```

- [ ] **Step 9: Verify theme tests pass**

Run:

```bash
pnpm test packages/themes/src/tokens.test.ts
```

Expected:

```txt
PASS packages/themes/src/tokens.test.ts
```

## Task 3: Build Core Package Infrastructure and ThemeProvider

**Files:**

- Create: `packages/core/package.json`
- Create: `packages/core/src/styles/base.css`
- Create: `packages/core/src/components/theme-provider/theme-provider.test.ts`
- Create: `packages/core/src/components/theme-provider/YThemeProvider.vue`
- Create: `packages/core/src/components/theme-provider/index.ts`
- Create: `packages/core/src/plugin.ts`
- Create: `packages/core/src/index.ts`

- [ ] **Step 1: Create core package manifest**

Create `packages/core/package.json`:

```json
{
  "name": "@yok-ui/core",
  "version": "0.1.0",
  "type": "module",
  "sideEffects": ["**/*.css", "./src/styles/base.css"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles/base.css": "./src/styles/base.css"
  },
  "scripts": {
    "build": "vite build",
    "typecheck": "vue-tsc --noEmit --skipLibCheck"
  },
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  "dependencies": {
    "@yok-ui/themes": "workspace:*"
  }
}
```

- [ ] **Step 2: Create base styles**

Create `packages/core/src/styles/base.css`:

```css
* {
  box-sizing: border-box;
}

.yok-focus-ring:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--yok-color-primary) 35%, transparent);
  outline-offset: 2px;
}

.yok-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 3: Write failing ThemeProvider test**

Create `packages/core/src/components/theme-provider/theme-provider.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YThemeProvider from './YThemeProvider.vue'

describe('YThemeProvider', () => {
  it('sets theme and density attributes', () => {
    const wrapper = mount(YThemeProvider, {
      props: {
        theme: 'yok-clean',
        density: 'compact'
      },
      slots: {
        default: '<button>Save</button>'
      }
    })

    expect(wrapper.attributes('data-yok-theme')).toBe('yok-clean')
    expect(wrapper.attributes('data-yok-density')).toBe('compact')
    expect(wrapper.text()).toContain('Save')
  })
})
```

- [ ] **Step 4: Run test to verify failure**

Run:

```bash
pnpm test packages/core/src/components/theme-provider/theme-provider.test.ts
```

Expected:

```txt
FAIL packages/core/src/components/theme-provider/theme-provider.test.ts
Failed to load url ./YThemeProvider.vue
```

- [ ] **Step 5: Implement ThemeProvider**

Create `packages/core/src/components/theme-provider/YThemeProvider.vue`:

```vue
<script setup lang="ts">
interface Props {
  theme?: 'yok-light' | 'yok-clean'
  density?: 'comfortable' | 'compact'
}

withDefaults(defineProps<Props>(), {
  theme: 'yok-light',
  density: 'comfortable'
})
</script>

<template>
  <div class="yok-theme-provider" :data-yok-theme="theme" :data-yok-density="density">
    <slot />
  </div>
</template>

<style scoped>
.yok-theme-provider {
  color: var(--yok-color-text);
  background: var(--yok-color-surface);
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}
</style>
```

- [ ] **Step 6: Export ThemeProvider and plugin**

Create `packages/core/src/components/theme-provider/index.ts`:

```ts
export { default as YThemeProvider } from './YThemeProvider.vue'
```

Create `packages/core/src/plugin.ts`:

```ts
import type { App, Component } from 'vue'

export function createYokInstaller(components: Component[]) {
  return {
    install(app: App) {
      components.forEach((component) => {
        const name = component.name

        if (name) {
          app.component(name, component)
        }
      })
    }
  }
}
```

Create `packages/core/src/index.ts`:

```ts
import './styles/base.css'

export { YThemeProvider } from './components/theme-provider'
```

- [ ] **Step 7: Verify ThemeProvider test passes**

Run:

```bash
pnpm test packages/core/src/components/theme-provider/theme-provider.test.ts
```

Expected:

```txt
PASS packages/core/src/components/theme-provider/theme-provider.test.ts
```

## Task 4: Build Core Action Components

**Files:**

- Create: `packages/core/src/components/button/button.test.ts`
- Create: `packages/core/src/components/button/YButton.vue`
- Create: `packages/core/src/components/button/YIconButton.vue`
- Create: `packages/core/src/components/button/index.ts`
- Modify: `packages/core/src/index.ts`

- [ ] **Step 1: Write failing button tests**

Create `packages/core/src/components/button/button.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { YButton, YIconButton } from './index'

describe('YButton', () => {
  it('renders variant, size, loading, and slot content', () => {
    const wrapper = mount(YButton, {
      props: {
        variant: 'primary',
        size: 'lg',
        loading: true
      },
      slots: {
        default: 'Create'
      }
    })

    expect(wrapper.classes()).toContain('yok-button--primary')
    expect(wrapper.classes()).toContain('yok-button--lg')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.text()).toContain('Create')
  })

  it('emits click when enabled', async () => {
    const wrapper = mount(YButton, {
      slots: {
        default: 'Save'
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})

describe('YIconButton', () => {
  it('requires an accessible label', () => {
    const wrapper = mount(YIconButton, {
      props: {
        label: 'Copy'
      },
      slots: {
        default: 'C'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Copy')
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
pnpm test packages/core/src/components/button/button.test.ts
```

Expected:

```txt
FAIL packages/core/src/components/button/button.test.ts
Failed to load url ./index
```

- [ ] **Step 3: Implement YButton**

Create `packages/core/src/components/button/YButton.vue`:

```vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button'
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="yok-button yok-focus-ring"
    :class="[`yok-button--${variant}`, `yok-button--${size}`]"
    :type="props.type"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : 'false'"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="yok-button__dot" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.yok-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--yok-space-2);
  border: 1px solid transparent;
  border-radius: var(--yok-radius-md);
  font-weight: 650;
  letter-spacing: 0;
  color: var(--yok-color-text);
  cursor: pointer;
  transition:
    transform var(--yok-motion-fast),
    background var(--yok-motion-fast),
    border-color var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast);
}

.yok-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--yok-shadow-soft);
}

.yok-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-button--sm {
  min-height: 32px;
  padding: 0 var(--yok-space-3);
  font-size: 13px;
}

.yok-button--md {
  min-height: 38px;
  padding: 0 var(--yok-space-4);
  font-size: 14px;
}

.yok-button--lg {
  min-height: 44px;
  padding: 0 var(--yok-space-5);
  font-size: 15px;
}

.yok-button--primary {
  background: var(--yok-color-primary);
  color: white;
}

.yok-button--secondary {
  background: var(--yok-color-primarySoft);
  border-color: var(--yok-color-border);
}

.yok-button--ghost {
  background: transparent;
  border-color: transparent;
}

.yok-button__dot {
  width: 0.6em;
  height: 0.6em;
  border-radius: 999px;
  background: currentColor;
  animation: yok-button-pulse 900ms ease-in-out infinite;
}

@keyframes yok-button-pulse {
  0%,
  100% {
    opacity: 0.35;
  }

  50% {
    opacity: 1;
  }
}
</style>
```

- [ ] **Step 4: Implement YIconButton**

Create `packages/core/src/components/button/YIconButton.vue`:

```vue
<script setup lang="ts">
interface Props {
  label: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="yok-icon-button yok-focus-ring"
    :class="`yok-icon-button--${size}`"
    type="button"
    :aria-label="label"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.yok-icon-button {
  display: inline-grid;
  place-items: center;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  cursor: pointer;
  transition:
    transform var(--yok-motion-fast),
    background var(--yok-motion-fast),
    box-shadow var(--yok-motion-fast);
}

.yok-icon-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--yok-color-primarySoft);
  box-shadow: var(--yok-shadow-soft);
}

.yok-icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.yok-icon-button--sm {
  width: 32px;
  height: 32px;
}

.yok-icon-button--md {
  width: 38px;
  height: 38px;
}

.yok-icon-button--lg {
  width: 44px;
  height: 44px;
}
</style>
```

- [ ] **Step 5: Export action components**

Create `packages/core/src/components/button/index.ts`:

```ts
export { default as YButton } from './YButton.vue'
export { default as YIconButton } from './YIconButton.vue'
```

Modify `packages/core/src/index.ts`:

```ts
import './styles/base.css'

export { YThemeProvider } from './components/theme-provider'
export { YButton, YIconButton } from './components/button'
```

- [ ] **Step 6: Verify button tests pass**

Run:

```bash
pnpm test packages/core/src/components/button/button.test.ts
```

Expected:

```txt
PASS packages/core/src/components/button/button.test.ts
```

## Task 5: Build Core Form and Status Components

**Files:**

- Create: `packages/core/src/components/input/input.test.ts`
- Create: `packages/core/src/components/input/YInput.vue`
- Create: `packages/core/src/components/input/index.ts`
- Create: `packages/core/src/components/switch/switch.test.ts`
- Create: `packages/core/src/components/switch/YSwitch.vue`
- Create: `packages/core/src/components/switch/index.ts`
- Create: `packages/core/src/components/tag/tag.test.ts`
- Create: `packages/core/src/components/tag/YTag.vue`
- Create: `packages/core/src/components/tag/YBadge.vue`
- Create: `packages/core/src/components/tag/index.ts`
- Create: `packages/core/src/components/empty/empty.test.ts`
- Create: `packages/core/src/components/empty/YEmpty.vue`
- Create: `packages/core/src/components/empty/index.ts`
- Modify: `packages/core/src/index.ts`

- [ ] **Step 1: Write failing tests for form and status components**

Create compact tests that verify public behavior:

```ts
// packages/core/src/components/input/input.test.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YInput from './YInput.vue'

describe('YInput', () => {
  it('supports v-model and error text', async () => {
    const wrapper = mount(YInput, {
      props: {
        modelValue: 'hello',
        label: 'Name',
        error: 'Name is required'
      }
    })

    const input = wrapper.get('input')
    await input.setValue('yok')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yok'])
    expect(wrapper.text()).toContain('Name is required')
    expect(input.attributes('aria-invalid')).toBe('true')
  })
})
```

```ts
// packages/core/src/components/switch/switch.test.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YSwitch from './YSwitch.vue'

describe('YSwitch', () => {
  it('emits changed checked state', async () => {
    const wrapper = mount(YSwitch, {
      props: {
        modelValue: false,
        label: 'Enable'
      }
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.get('button').attributes('role')).toBe('switch')
  })
})
```

```ts
// packages/core/src/components/tag/tag.test.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { YBadge, YTag } from './index'

describe('YTag and YBadge', () => {
  it('renders tag tone and content', () => {
    const wrapper = mount(YTag, {
      props: {
        tone: 'success'
      },
      slots: {
        default: 'Active'
      }
    })

    expect(wrapper.classes()).toContain('yok-tag--success')
    expect(wrapper.text()).toBe('Active')
  })

  it('renders badge value', () => {
    const wrapper = mount(YBadge, {
      props: {
        value: '12'
      }
    })

    expect(wrapper.text()).toBe('12')
  })
})
```

```ts
// packages/core/src/components/empty/empty.test.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YEmpty from './YEmpty.vue'

describe('YEmpty', () => {
  it('renders title, description, and action slot', () => {
    const wrapper = mount(YEmpty, {
      props: {
        title: 'No projects',
        description: 'Create your first project.'
      },
      slots: {
        action: '<button>Create</button>'
      }
    })

    expect(wrapper.text()).toContain('No projects')
    expect(wrapper.text()).toContain('Create your first project.')
    expect(wrapper.text()).toContain('Create')
  })
})
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
pnpm test packages/core/src/components/input/input.test.ts packages/core/src/components/switch/switch.test.ts packages/core/src/components/tag/tag.test.ts packages/core/src/components/empty/empty.test.ts
```

Expected:

```txt
FAIL
```

- [ ] **Step 3: Implement minimal components**

Create the component files with these public contracts:

```vue
<!-- packages/core/src/components/input/YInput.vue -->
<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  error: '',
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="yok-input">
    <span v-if="label" class="yok-input__label">{{ label }}</span>
    <input
      class="yok-input__control yok-focus-ring"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : 'false'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="yok-input__error">{{ error }}</span>
  </label>
</template>

<style scoped>
.yok-input {
  display: grid;
  gap: var(--yok-space-2);
  color: var(--yok-color-text);
}

.yok-input__label {
  font-size: 13px;
  font-weight: 650;
}

.yok-input__control {
  min-height: 38px;
  width: 100%;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-md);
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  padding: 0 var(--yok-space-3);
}

.yok-input__control[aria-invalid='true'] {
  border-color: var(--yok-color-danger);
}

.yok-input__error {
  color: var(--yok-color-danger);
  font-size: 12px;
}
</style>
```

```vue
<!-- packages/core/src/components/switch/YSwitch.vue -->
<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <button
    class="yok-switch yok-focus-ring"
    :class="{ 'yok-switch--checked': modelValue }"
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="yok-switch__track" aria-hidden="true">
      <span class="yok-switch__thumb" />
    </span>
    <span v-if="label" class="yok-switch__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.yok-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--yok-space-2);
  border: 0;
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
}

.yok-switch__track {
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: var(--yok-color-border);
  padding: 3px;
  transition: background var(--yok-motion-fast);
}

.yok-switch__thumb {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: white;
  box-shadow: var(--yok-shadow-soft);
  transition: transform var(--yok-motion-fast);
}

.yok-switch--checked .yok-switch__track {
  background: var(--yok-color-primary);
}

.yok-switch--checked .yok-switch__thumb {
  transform: translateX(18px);
}
</style>
```

```vue
<!-- packages/core/src/components/tag/YTag.vue -->
<script setup lang="ts">
interface Props {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}

withDefaults(defineProps<Props>(), {
  tone: 'neutral'
})
</script>

<template>
  <span class="yok-tag" :class="`yok-tag--${tone}`">
    <slot />
  </span>
</template>

<style scoped>
.yok-tag {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  border-radius: var(--yok-radius-sm);
  padding: 0 var(--yok-space-2);
  font-size: 12px;
  font-weight: 650;
  background: var(--yok-color-surfaceMuted);
}

.yok-tag--success {
  color: var(--yok-color-success);
}

.yok-tag--warning {
  color: var(--yok-color-warning);
}

.yok-tag--danger {
  color: var(--yok-color-danger);
}

.yok-tag--info {
  color: var(--yok-color-primary);
}
</style>
```

```vue
<!-- packages/core/src/components/tag/YBadge.vue -->
<script setup lang="ts">
interface Props {
  value: string | number
}

defineProps<Props>()
</script>

<template>
  <span class="yok-badge">{{ value }}</span>
</template>

<style scoped>
.yok-badge {
  display: inline-grid;
  min-width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 999px;
  padding: 0 var(--yok-space-1);
  background: var(--yok-color-accentPink);
  color: white;
  font-size: 12px;
  font-weight: 700;
}
</style>
```

```vue
<!-- packages/core/src/components/empty/YEmpty.vue -->
<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  description: ''
})
</script>

<template>
  <section class="yok-empty">
    <div class="yok-empty__mark" aria-hidden="true">+</div>
    <h3 class="yok-empty__title">{{ title }}</h3>
    <p v-if="description" class="yok-empty__description">{{ description }}</p>
    <div v-if="$slots.action" class="yok-empty__action">
      <slot name="action" />
    </div>
  </section>
</template>

<style scoped>
.yok-empty {
  display: grid;
  justify-items: center;
  gap: var(--yok-space-2);
  padding: var(--yok-space-6);
  text-align: center;
  color: var(--yok-color-text);
}

.yok-empty__mark {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-primarySoft);
  color: var(--yok-color-primary);
  font-size: 24px;
  font-weight: 700;
}

.yok-empty__title {
  margin: 0;
  font-size: 16px;
}

.yok-empty__description {
  margin: 0;
  color: var(--yok-color-textMuted);
}
</style>
```

- [ ] **Step 4: Create component index files and root exports**

Create:

```ts
// packages/core/src/components/input/index.ts
export { default as YInput } from './YInput.vue'
```

```ts
// packages/core/src/components/switch/index.ts
export { default as YSwitch } from './YSwitch.vue'
```

```ts
// packages/core/src/components/tag/index.ts
export { default as YTag } from './YTag.vue'
export { default as YBadge } from './YBadge.vue'
```

```ts
// packages/core/src/components/empty/index.ts
export { default as YEmpty } from './YEmpty.vue'
```

Modify `packages/core/src/index.ts`:

```ts
import './styles/base.css'

export { YButton, YIconButton } from './components/button'
export { YEmpty } from './components/empty'
export { YInput } from './components/input'
export { YSwitch } from './components/switch'
export { YBadge, YTag } from './components/tag'
export { YThemeProvider } from './components/theme-provider'
```

- [ ] **Step 5: Verify core component tests pass**

Run:

```bash
pnpm test packages/core/src/components
```

Expected:

```txt
PASS
```

## Task 6: Build @yok-ui/product Starter Components

**Files:**

- Create: `packages/product/package.json`
- Create: `packages/product/src/components/copy-button/YCopyButton.vue`
- Create: `packages/product/src/components/theme-switcher/YThemeSwitcher.vue`
- Create: `packages/product/src/components/code-block/YCodeBlock.vue`
- Create: `packages/product/src/components/command-palette/YCommandPalette.vue`
- Create: matching `index.ts` files in each component directory
- Create: matching `.test.ts` files in each component directory
- Create: `packages/product/src/index.ts`

- [ ] **Step 1: Create product package manifest**

Create `packages/product/package.json`:

```json
{
  "name": "@yok-ui/product",
  "version": "0.1.0",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "vite build",
    "typecheck": "vue-tsc --noEmit --skipLibCheck"
  },
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  "dependencies": {
    "@yok-ui/core": "workspace:*"
  }
}
```

- [ ] **Step 2: Write tests for public contracts**

Create product tests with these behaviors:

```ts
// packages/product/src/components/copy-button/copy-button.test.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import YCopyButton from './YCopyButton.vue'

describe('YCopyButton', () => {
  it('copies text and emits copied', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    })

    const wrapper = mount(YCopyButton, {
      props: {
        text: 'pnpm add @yok-ui/core'
      }
    })

    await wrapper.get('button').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('pnpm add @yok-ui/core')
    expect(wrapper.emitted('copied')).toHaveLength(1)
  })
})
```

```ts
// packages/product/src/components/theme-switcher/theme-switcher.test.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YThemeSwitcher from './YThemeSwitcher.vue'

describe('YThemeSwitcher', () => {
  it('emits selected theme', async () => {
    const wrapper = mount(YThemeSwitcher, {
      props: {
        modelValue: 'yok-light'
      }
    })

    await wrapper.get('[data-theme-option="yok-clean"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yok-clean'])
  })
})
```

```ts
// packages/product/src/components/code-block/code-block.test.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YCodeBlock from './YCodeBlock.vue'

describe('YCodeBlock', () => {
  it('renders language and code', () => {
    const wrapper = mount(YCodeBlock, {
      props: {
        language: 'ts',
        code: "import { YButton } from '@yok-ui/core'"
      }
    })

    expect(wrapper.text()).toContain('ts')
    expect(wrapper.text()).toContain('YButton')
  })
})
```

```ts
// packages/product/src/components/command-palette/command-palette.test.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YCommandPalette from './YCommandPalette.vue'

describe('YCommandPalette', () => {
  it('filters commands and emits select', async () => {
    const wrapper = mount(YCommandPalette, {
      props: {
        open: true,
        commands: [
          { id: 'copy', label: 'Copy link' },
          { id: 'theme', label: 'Change theme' }
        ]
      }
    })

    await wrapper.get('input').setValue('theme')
    expect(wrapper.text()).toContain('Change theme')
    expect(wrapper.text()).not.toContain('Copy link')

    await wrapper.get('[data-command-id="theme"]').trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([{ id: 'theme', label: 'Change theme' }])
  })
})
```

- [ ] **Step 3: Implement product components**

Create components using core visual language:

```vue
<!-- packages/product/src/components/copy-button/YCopyButton.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { YButton } from '@yok-ui/core'

interface Props {
  text: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  copied: [text: string]
}>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.text)
  copied.value = true
  emit('copied', props.text)
}
</script>

<template>
  <YButton variant="secondary" size="sm" @click="copy">
    {{ copied ? 'Copied' : 'Copy' }}
  </YButton>
</template>
```

```vue
<!-- packages/product/src/components/theme-switcher/YThemeSwitcher.vue -->
<script setup lang="ts">
type YokThemeName = 'yok-light' | 'yok-clean'

interface Props {
  modelValue: YokThemeName
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [theme: YokThemeName]
}>()

const themes: Array<{ name: YokThemeName; label: string }> = [
  { name: 'yok-light', label: 'Light' },
  { name: 'yok-clean', label: 'Clean' }
]
</script>

<template>
  <div class="yok-theme-switcher" aria-label="Theme switcher">
    <button
      v-for="theme in themes"
      :key="theme.name"
      class="yok-theme-switcher__option yok-focus-ring"
      :class="{ 'yok-theme-switcher__option--active': modelValue === theme.name }"
      type="button"
      :data-theme-option="theme.name"
      @click="$emit('update:modelValue', theme.name)"
    >
      {{ theme.label }}
    </button>
  </div>
</template>

<style scoped>
.yok-theme-switcher {
  display: inline-flex;
  gap: var(--yok-space-1);
  padding: var(--yok-space-1);
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surfaceMuted);
}

.yok-theme-switcher__option {
  border: 0;
  border-radius: var(--yok-radius-md);
  background: transparent;
  color: var(--yok-color-textMuted);
  cursor: pointer;
  padding: var(--yok-space-2) var(--yok-space-3);
}

.yok-theme-switcher__option--active {
  background: var(--yok-color-surface);
  color: var(--yok-color-text);
  box-shadow: var(--yok-shadow-soft);
}
</style>
```

```vue
<!-- packages/product/src/components/code-block/YCodeBlock.vue -->
<script setup lang="ts">
interface Props {
  code: string
  language?: string
}

withDefaults(defineProps<Props>(), {
  language: 'text'
})
</script>

<template>
  <figure class="yok-code-block">
    <figcaption class="yok-code-block__caption">{{ language }}</figcaption>
    <pre class="yok-code-block__pre"><code>{{ code }}</code></pre>
  </figure>
</template>

<style scoped>
.yok-code-block {
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: #25302d;
  color: #f7fffb;
}

.yok-code-block__caption {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: var(--yok-space-2) var(--yok-space-3);
  color: #b9ded4;
  font-size: 12px;
}

.yok-code-block__pre {
  margin: 0;
  overflow: auto;
  padding: var(--yok-space-4);
}
</style>
```

```vue
<!-- packages/product/src/components/command-palette/YCommandPalette.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'

export interface YokCommand {
  id: string
  label: string
}

interface Props {
  open: boolean
  commands: YokCommand[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  select: [command: YokCommand]
}>()

const query = ref('')
const filteredCommands = computed(() => {
  const value = query.value.trim().toLowerCase()

  if (!value) {
    return props.commands
  }

  return props.commands.filter((command) => command.label.toLowerCase().includes(value))
})

function select(command: YokCommand) {
  emit('select', command)
}
</script>

<template>
  <div v-if="open" class="yok-command-palette" role="dialog" aria-modal="true">
    <div class="yok-command-palette__panel">
      <input
        v-model="query"
        class="yok-command-palette__input yok-focus-ring"
        placeholder="Search commands"
        @keydown.esc="$emit('close')"
      />
      <button
        v-for="command in filteredCommands"
        :key="command.id"
        class="yok-command-palette__item yok-focus-ring"
        type="button"
        :data-command-id="command.id"
        @click="select(command)"
      >
        {{ command.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.yok-command-palette {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: start center;
  padding-top: 12vh;
  background: rgba(37, 48, 45, 0.28);
}

.yok-command-palette__panel {
  display: grid;
  width: min(560px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-xl);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-pop);
}

.yok-command-palette__input {
  min-height: 52px;
  border: 0;
  border-bottom: 1px solid var(--yok-color-border);
  padding: 0 var(--yok-space-4);
  color: var(--yok-color-text);
}

.yok-command-palette__item {
  min-height: 44px;
  border: 0;
  background: transparent;
  color: var(--yok-color-text);
  cursor: pointer;
  padding: 0 var(--yok-space-4);
  text-align: left;
}

.yok-command-palette__item:hover {
  background: var(--yok-color-primarySoft);
}
</style>
```

- [ ] **Step 4: Export product components**

Create each component `index.ts`, then root export:

```ts
// packages/product/src/components/copy-button/index.ts
export { default as YCopyButton } from './YCopyButton.vue'
```

```ts
// packages/product/src/components/theme-switcher/index.ts
export { default as YThemeSwitcher } from './YThemeSwitcher.vue'
```

```ts
// packages/product/src/components/code-block/index.ts
export { default as YCodeBlock } from './YCodeBlock.vue'
```

```ts
// packages/product/src/components/command-palette/index.ts
export { default as YCommandPalette } from './YCommandPalette.vue'
export type { YokCommand } from './YCommandPalette.vue'
```

```ts
// packages/product/src/index.ts
export { YCodeBlock } from './components/code-block'
export { YCommandPalette } from './components/command-palette'
export type { YokCommand } from './components/command-palette'
export { YCopyButton } from './components/copy-button'
export { YThemeSwitcher } from './components/theme-switcher'
```

- [ ] **Step 5: Verify product tests pass**

Run:

```bash
pnpm test packages/product/src/components
```

Expected:

```txt
PASS
```

## Task 7: Build Docs Site

**Files:**

- Create: `docs/package.json`
- Create: `docs/.vitepress/config.ts`
- Create: `docs/.vitepress/theme/index.ts`
- Create: `docs/.vitepress/theme/custom.css`
- Create: `docs/index.md`
- Create: `docs/guide/introduction.md`
- Create: `docs/guide/installation.md`
- Create: `docs/guide/theming.md`
- Create: `docs/packages/core.md`
- Create: `docs/packages/product.md`
- Create: `docs/packages/admin.md`
- Create: `docs/packages/brand.md`
- Create: `docs/components/index.md`
- Create: `docs/components/core.md`
- Create: `docs/components/product.md`
- Create: `docs/blocks/command-center.md`
- Create: `docs/blocks/product-settings.md`

- [ ] **Step 1: Create docs package manifest**

Create `docs/package.json`:

```json
{
  "name": "@yok-ui/docs",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vitepress dev . --host 127.0.0.1",
    "build": "vitepress build .",
    "preview": "vitepress preview . --host 127.0.0.1"
  },
  "dependencies": {
    "@yok-ui/core": "workspace:*",
    "@yok-ui/product": "workspace:*",
    "@yok-ui/themes": "workspace:*"
  }
}
```

- [ ] **Step 2: Configure VitePress navigation**

Create `docs/.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Yok UI',
  description: '清爽可爱的 Vue 3 组件系统',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Packages', link: '/packages/core' },
      { text: 'Components', link: '/components/' },
      { text: 'Blocks', link: '/blocks/command-center' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Theming', link: '/guide/theming' }
        ]
      },
      {
        text: 'Packages',
        items: [
          { text: 'Core', link: '/packages/core' },
          { text: 'Product', link: '/packages/product' },
          { text: 'Admin', link: '/packages/admin' },
          { text: 'Brand', link: '/packages/brand' }
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'All Components', link: '/components/' },
          { text: 'Core', link: '/components/core' },
          { text: 'Product', link: '/components/product' }
        ]
      },
      {
        text: 'Blocks',
        items: [
          { text: 'Command Center', link: '/blocks/command-center' },
          { text: 'Product Settings', link: '/blocks/product-settings' }
        ]
      }
    ]
  }
})
```

- [ ] **Step 3: Add docs theme**

Create `docs/.vitepress/theme/index.ts`:

```ts
import DefaultTheme from 'vitepress/theme'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/themes/yok-clean.css'
import '@yok-ui/core/styles/base.css'
import './custom.css'

export default DefaultTheme
```

Create `docs/.vitepress/theme/custom.css`:

```css
:root {
  --vp-c-brand-1: var(--yok-color-primary);
  --vp-c-brand-2: #2fb594;
  --vp-c-brand-3: #239e80;
  --vp-c-bg: var(--yok-color-surface);
  --vp-c-text-1: var(--yok-color-text);
  --vp-c-text-2: var(--yok-color-textMuted);
}

.VPHomeHero .name {
  letter-spacing: 0;
}
```

- [ ] **Step 4: Create docs pages**

Create `docs/index.md`:

```md
---
layout: home
hero:
  name: Yok UI
  text: 清爽可爱的 Vue 3 组件系统
  tagline: 一个属于个人产品、后台管理和品牌展示的多包组件库。
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: Components
      link: /components/
features:
  - title: Core 基础组件
    details: Button、Input、Switch、Tag、ThemeProvider 等共享底座。
  - title: Product 产品工具
    details: CommandPalette、CopyButton、ThemeSwitcher、CodeBlock 等个人效率组件。
  - title: Admin 后台管理
    details: DataTable、SearchForm、MetricGrid 等第二阶段组件方向。
  - title: Brand 品牌展示
    details: HeroSection、FeatureGrid、Gallery 等第三阶段组件方向。
---
```

Create `docs/guide/introduction.md`:

```md
# Introduction

Yok UI 是一个清爽可爱的 Vue 3 组件系统。它不是单一大包，而是由 `core`、`product`、`admin` 和 `brand` 组成的多场景组件库。

Phase one 先交付 `@yok-ui/themes`、`@yok-ui/core`、`@yok-ui/product`、文档站和 playground。
```

Create `docs/guide/installation.md`:

````md
# Installation

```bash
pnpm add @yok-ui/core @yok-ui/product @yok-ui/themes
```

```ts
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/core/styles/base.css'
import { YButton } from '@yok-ui/core'
```
````

Create `docs/guide/theming.md`:

````md
# Theming

Yok UI 使用 CSS variables 作为主题基础。

```ts
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/themes/yok-clean.css'
```

```vue
<YThemeProvider theme="yok-light">
  <YButton variant="primary">Create</YButton>
</YThemeProvider>
```

Phase one includes `yok-light` and `yok-clean`.
````

Create `docs/packages/core.md`:

```md
# @yok-ui/core

基础组件包提供所有场景共享的组件和交互语言。

| Component | Status | Notes |
| --- | --- | --- |
| YThemeProvider | Stable | Sets theme and density attributes. |
| YButton | Stable | Primary, secondary, and ghost actions. |
| YIconButton | Stable | Icon-only action with required label. |
| YInput | Stable | Label, error, and v-model support. |
| YSwitch | Stable | Accessible switch behavior. |
| YTag | Stable | Status and metadata tag. |
| YBadge | Stable | Compact numeric or text badge. |
| YEmpty | Stable | Friendly empty state. |
```

Create `docs/packages/product.md`:

```md
# @yok-ui/product

产品工具组件包服务个人产品、开发者工具和轻量 SaaS 页面。

| Component | Status | Notes |
| --- | --- | --- |
| YCommandPalette | Beta | Search and select command actions. |
| YCopyButton | Stable | Copy text to clipboard. |
| YCodeBlock | Stable | Display code snippets. |
| YThemeSwitcher | Stable | Switch between built-in themes. |
```

Create `docs/packages/admin.md`:

```md
# @yok-ui/admin

后台管理包从 phase two 开始实现。目标组件包括 DataTable、SearchForm、FilterBar、PageHeader、Pagination、StatCard 和 FormSection。

Phase one keeps this page as a visible roadmap so the docs already support package filtering.
```

Create `docs/packages/brand.md`:

```md
# @yok-ui/brand

品牌展示包从 phase three 开始实现。目标组件包括 HeroSection、FeatureGrid、ShowcaseCard、PricingSection、Timeline、Gallery 和 ProfileHeader。

Phase one keeps this page as a visible roadmap so Yok UI already communicates the full multi-scene direction.
```

Create `docs/components/index.md`:

```md
# Components

Browse Yok UI components by package.

| Component | Package | Type |
| --- | --- | --- |
| YButton | @yok-ui/core | Action |
| YInput | @yok-ui/core | Form |
| YSwitch | @yok-ui/core | Form |
| YTag | @yok-ui/core | Status |
| YBadge | @yok-ui/core | Status |
| YEmpty | @yok-ui/core | Feedback |
| YCommandPalette | @yok-ui/product | Product |
| YCopyButton | @yok-ui/product | Product |
| YCodeBlock | @yok-ui/product | Product |
| YThemeSwitcher | @yok-ui/product | Product |
```

Create `docs/components/core.md`:

````md
# Core Components

Core components define the shared Yok UI interaction language.

```vue
<script setup lang="ts">
import { YButton, YInput, YThemeProvider } from '@yok-ui/core'
</script>

<template>
  <YThemeProvider theme="yok-light">
    <YInput label="Name" />
    <YButton variant="primary">Create</YButton>
  </YThemeProvider>
</template>
```
````

Create `docs/components/product.md`:

````md
# Product Components

Product components make Yok UI feel personal and efficient.

```vue
<script setup lang="ts">
import { YCommandPalette, YThemeSwitcher } from '@yok-ui/product'
</script>

<template>
  <YThemeSwitcher model-value="yok-light" />
  <YCommandPalette :open="true" :commands="[{ id: 'new', label: 'New component' }]" />
</template>
```
````

Create `docs/blocks/command-center.md`:

````md
# Command Center Block

The command center combines `YButton`, `YCommandPalette`, and `YCodeBlock` for personal tools.

```vue
<YButton variant="primary">Open Command Center</YButton>
<YCommandPalette :open="true" :commands="commands" />
```
````

Create `docs/blocks/product-settings.md`:

````md
# Product Settings Block

The product settings block combines `YThemeProvider`, `YThemeSwitcher`, `YSwitch`, and `YInput`.

```vue
<YThemeProvider theme="yok-light">
  <YThemeSwitcher model-value="yok-light" />
  <YSwitch label="Enable cute mode" />
  <YInput label="Workspace name" />
</YThemeProvider>
```
````

- [ ] **Step 5: Build docs**

Run:

```bash
pnpm docs:build
```

Expected:

```txt
vitepress v
build complete
```

## Task 8: Build Playground App

**Files:**

- Create: `playground/package.json`
- Create: `playground/index.html`
- Create: `playground/src/main.ts`
- Create: `playground/src/App.vue`
- Create: `playground/src/style.css`

- [ ] **Step 1: Create playground package manifest**

Create `playground/package.json`:

```json
{
  "name": "@yok-ui/playground",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1"
  },
  "dependencies": {
    "@vitejs/plugin-vue": "^5.2.4",
    "@yok-ui/core": "workspace:*",
    "@yok-ui/product": "workspace:*",
    "@yok-ui/themes": "workspace:*",
    "vite": "^6.3.5",
    "vue": "^3.5.16"
  },
  "devDependencies": {}
}
```

- [ ] **Step 2: Create app entry**

Create `playground/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Yok UI Playground</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Create `playground/src/main.ts`:

```ts
import { createApp } from 'vue'
import '@yok-ui/themes/yok-light.css'
import '@yok-ui/themes/yok-clean.css'
import '@yok-ui/core/styles/base.css'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 3: Create playground screen**

Create `playground/src/App.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { YBadge, YButton, YEmpty, YInput, YSwitch, YTag, YThemeProvider } from '@yok-ui/core'
import { YCodeBlock, YCommandPalette, YCopyButton, YThemeSwitcher } from '@yok-ui/product'

const theme = ref<'yok-light' | 'yok-clean'>('yok-light')
const name = ref('Yok UI')
const enabled = ref(true)
const commandOpen = ref(false)

const commands = [
  { id: 'new-component', label: 'Create new component' },
  { id: 'switch-theme', label: 'Switch theme' },
  { id: 'open-docs', label: 'Open docs' }
]
</script>

<template>
  <YThemeProvider :theme="theme" class="playground-shell">
    <header class="playground-hero">
      <div>
        <p class="eyebrow">yok-ui phase one</p>
        <h1>清爽可爱的 Vue 3 组件系统</h1>
        <p>Core 和 Product 组件从第一天就在真实页面中验证。</p>
      </div>
      <YThemeSwitcher v-model="theme" />
    </header>

    <main class="playground-grid">
      <section class="panel">
        <h2>Core</h2>
        <YInput v-model="name" label="Library name" />
        <div class="row">
          <YButton variant="primary" @click="commandOpen = true">Open Command</YButton>
          <YButton variant="secondary">Secondary</YButton>
        </div>
        <div class="row">
          <YSwitch v-model="enabled" label="Enable cute mode" />
          <YTag tone="success">Stable</YTag>
          <YBadge value="12" />
        </div>
      </section>

      <section class="panel">
        <h2>Product</h2>
        <YCodeBlock language="ts" code="import { YButton } from '@yok-ui/core'" />
        <YCopyButton text="pnpm add @yok-ui/core" />
      </section>

      <section class="panel panel-wide">
        <YEmpty title="No admin package yet" description="Admin components begin in phase two.">
          <template #action>
            <YButton variant="ghost">View roadmap</YButton>
          </template>
        </YEmpty>
      </section>
    </main>

    <YCommandPalette
      :open="commandOpen"
      :commands="commands"
      @close="commandOpen = false"
      @select="commandOpen = false"
    />
  </YThemeProvider>
</template>
```

Create `playground/src/style.css`:

```css
body {
  margin: 0;
  background: var(--yok-color-surface);
}

.playground-shell {
  min-height: 100vh;
  padding: 32px;
}

.playground-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  max-width: 1120px;
  margin: 0 auto 24px;
}

.playground-hero h1 {
  margin: 0;
  font-size: 40px;
  letter-spacing: 0;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--yok-color-primary);
  font-weight: 750;
}

.playground-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  max-width: 1120px;
  margin: 0 auto;
}

.panel {
  display: grid;
  gap: 16px;
  border: 1px solid var(--yok-color-border);
  border-radius: var(--yok-radius-lg);
  background: var(--yok-color-surface);
  box-shadow: var(--yok-shadow-soft);
  padding: 20px;
}

.panel h2 {
  margin: 0;
}

.panel-wide {
  grid-column: 1 / -1;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

@media (max-width: 760px) {
  .playground-shell {
    padding: 20px;
  }

  .playground-hero {
    display: grid;
  }

  .playground-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Build playground**

Run:

```bash
pnpm playground:build
```

Expected:

```txt
✓ built in
```

## Task 9: Final Verification

**Files:**

- Modify only files that fail verification.

- [ ] **Step 1: Run all unit tests**

Run:

```bash
pnpm test
```

Expected:

```txt
Test Files  ... passed
Tests       ... passed
```

- [ ] **Step 2: Run typecheck**

Run:

```bash
pnpm typecheck
```

Expected:

```txt
No errors
```

If `vue-tsc` prints no output and exits `0`, that is passing.

- [ ] **Step 3: Run package builds**

Run:

```bash
pnpm build
```

Expected:

```txt
@yok-ui/themes build
@yok-ui/core build
@yok-ui/product build
```

- [ ] **Step 4: Run docs and playground builds**

Run:

```bash
pnpm docs:build
pnpm playground:build
```

Expected:

```txt
build complete
✓ built in
```

- [ ] **Step 5: Start playground for visual review**

Run with external permission if local port binding fails with `listen EPERM`:

```bash
pnpm playground:dev
```

Expected:

```txt
Local: http://127.0.0.1:5173/
```

Open the URL and verify:

- Header text is visible.
- Theme switcher toggles between `yok-light` and `yok-clean`.
- Buttons, input, switch, tag, badge, empty state, code block, copy button, and command palette render.
- Mobile viewport stacks panels into one column.

## Self-Review

Spec coverage:

- Multi-package architecture is covered by Tasks 1, 2, 3, 6, 7, and 8.
- Theme token system is covered by Task 2.
- 清爽可爱 default style is covered by theme tokens and component CSS in Tasks 2 through 8.
- Core starter components are covered by Tasks 3 through 5.
- Product starter components are covered by Task 6.
- Docs package/category browsing is covered by Task 7.
- Playground verification is covered by Task 8 and Task 9.
- Admin and brand packages are intentionally scoped out of phase one and documented as future package pages.

Placeholder scan:

- The plan contains no undefined placeholders.
- Future work is explicitly excluded from phase one or listed as later-phase scope.

Type consistency:

- Theme names are consistently `yok-light | yok-clean`.
- Component prefix is consistently `Y`.
- CSS variable prefix is consistently `--yok-`.
- Package names are consistently `@yok-ui/*`.

## Execution Options

After this plan is approved, execute with one of these approaches:

1. **Subagent-Driven (recommended)**: dispatch a fresh worker per task, review after each task, then continue.
2. **Inline Execution**: implement in this session task by task with checkpoints.

For this workspace, inline execution is practical because the repo is small and not currently a git repository.
