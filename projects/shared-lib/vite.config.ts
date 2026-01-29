/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: 'projects/shared-lib/tsconfig.spec.json',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['projects/shared-lib/src/test-setup.ts'],
    include: ['projects/shared-lib/**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': false,
  },
});
