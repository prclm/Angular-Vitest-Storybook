/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['projects/app1/src/test-setup.ts'],
    include: ['projects/app1/**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': false,
  },
});
