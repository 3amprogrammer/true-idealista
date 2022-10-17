import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  define: {
    'LOGGER_COLOR': '"green"',
    'LOGGER_DEBUG': 'false',
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, './src/background/index.ts'),
      output: {
        dir: resolve(__dirname, './dist'),
        entryFileNames: 'true-idealista-background.js'
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
