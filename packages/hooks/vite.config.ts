import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: new URL('./src/index.ts', import.meta.url).pathname,
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue']
    }
  }
})
