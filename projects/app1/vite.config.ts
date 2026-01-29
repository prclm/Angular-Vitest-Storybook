/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: 'projects/app1/tsconfig.spec.json',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['projects/app1/src/test-setup.ts'],
    include: ['projects/app1/src/**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': false,
  },
});
