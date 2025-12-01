import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      stream: 'stream-browserify',
    }
  },
  build: {
    commonjsOptions: {
      include: [/xlsx/, /node_modules/],
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: ['xlsx', 'buffer', 'process'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
    }
  }
})