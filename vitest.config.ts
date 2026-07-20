import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

function packageSource(packageName: string) {
  return fileURLToPath(new URL(`./packages/${packageName}/src`, import.meta.url))
}

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['packages/**/*.test.ts', 'docs/**/*.test.ts', 'scripts/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@yok-ui/themes': packageSource('themes'),
      '@yok-ui/core': packageSource('core'),
      '@yok-ui/product': packageSource('product'),
      '@yok-ui/hooks': packageSource('hooks'),
      '@yok-ui/icons': packageSource('icons'),
      '@yok-ui/admin': packageSource('admin'),
      '@yok-ui/brand': packageSource('brand')
    }
  }
})
