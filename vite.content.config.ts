import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  define: {
    'LOGGER_COLOR': '"red"',
    'LOGGER_DEBUG': 'false',
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, './src/content/index.ts'),
      output: {
        dir: resolve(__dirname, './dist'),
        entryFileNames: 'true-idealista-content.js',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
