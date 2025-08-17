import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vitest',
  server: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths()],
  preview: {
    port: 4300,
    host: 'localhost',
  },
  build: {
    outDir: '../../dist/apps/client',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
