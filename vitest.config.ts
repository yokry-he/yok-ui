import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['packages/**/*.test.ts', 'docs/**/*.test.ts', 'scripts/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@yok-ui/themes': '/Users/yokry/Documents/Codex/2026-06-13/vue3/packages/themes/src',
      '@yok-ui/core': '/Users/yokry/Documents/Codex/2026-06-13/vue3/packages/core/src',
      '@yok-ui/product': '/Users/yokry/Documents/Codex/2026-06-13/vue3/packages/product/src',
      '@yok-ui/hooks': '/Users/yokry/Documents/Codex/2026-06-13/vue3/packages/hooks/src',
      '@yok-ui/icons': '/Users/yokry/Documents/Codex/2026-06-13/vue3/packages/icons/src',
      '@yok-ui/admin': '/Users/yokry/Documents/Codex/2026-06-13/vue3/packages/admin/src',
      '@yok-ui/brand': '/Users/yokry/Documents/Codex/2026-06-13/vue3/packages/brand/src'
    }
  }
})
