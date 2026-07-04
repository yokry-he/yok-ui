import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@yok-ui/themes/yok-light.css',
        replacement: new URL('../packages/themes/src/themes/yok-light.css', import.meta.url).pathname
      },
      {
        find: '@yok-ui/themes/yok-clean.css',
        replacement: new URL('../packages/themes/src/themes/yok-clean.css', import.meta.url).pathname
      },
      {
        find: '@yok-ui/themes',
        replacement: new URL('../packages/themes/src', import.meta.url).pathname
      },
      {
        find: '@yok-ui/core',
        replacement: new URL('../packages/core/src', import.meta.url).pathname
      },
      {
        find: '@yok-ui/product',
        replacement: new URL('../packages/product/src', import.meta.url).pathname
      },
      {
        find: '@yok-ui/admin',
        replacement: new URL('../packages/admin/src', import.meta.url).pathname
      },
      {
        find: '@yok-ui/brand',
        replacement: new URL('../packages/brand/src', import.meta.url).pathname
      }
    ]
  }
})
