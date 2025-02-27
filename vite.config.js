import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgrPlugin from 'vite-plugin-svgr'
import jsconfigPaths from 'vite-jsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    jsconfigPaths({
      parseNative: false,
    }),
    svgrPlugin(),
    {
      name: 'custom-hmr-control',
      handleHotUpdate({ file, server }) {
        if (file.includes('src/app/configs/')) {
          server.ws.send({
            type: 'full-reload',
          })
          return []
        }
        return
      },
    },
  ],
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
    port: 3000,
  },
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      '/': '/src',
      assets: '/src/assets',
      routes: '/src/routes',
      'ui-component': '/src/ui-component',
      layout: '/src/layout',
      'menu-items': '/src/menu-items',
      store: '/src/store',
      themes: '/src/themes',
      utils: '/src/utils',
      views: '/src/views',
      core: '/src/core',
      api: '/src/api',
      context: '/src/context',
    },
  },
  optimizeDeps: {
    include: [
      '@mui/icons-material',
      '@mui/material',
      '@mui/base',
      '@mui/styles',
      '@mui/system',
      '@mui/utils',
      '@emotion/cache',
      '@emotion/react',
      '@emotion/styled',
      'lodash',
    ],
    exclude: [],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
