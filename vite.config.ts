import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { componentTagger } from 'lovable-tagger'

export default defineConfig(({ mode }) => ({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['module:@preact/signals-react-transform']],
      },
    }),
    nodePolyfills({
      protocolImports: true,
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  cacheDir: 'node_modules/.vite',
  server: {
    host: true,
    port: 8080,
    watch: {
      usePolling: true,
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    ),
    global: 'window',
  },
}))
