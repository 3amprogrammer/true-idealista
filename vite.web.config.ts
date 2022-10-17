import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
  ],
  define: {
    'LOGGER_COLOR': '"blue"',
    'LOGGER_DEBUG': 'false',
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, './src/web/index.ts'),
      output: {
        format: 'iife',
        dir: resolve(__dirname, './dist'),
        entryFileNames: 'true-idealista-web.js',
        assetFileNames: 'true-idealista-style.css',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
