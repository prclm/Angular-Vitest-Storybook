/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { angularCompilerFirst } from './.storybook/angular-compiler-plugin';

// Manual story testing config (Option 2) - JSDOM mode for debugging
export default defineConfig({
  plugins: [
    angularCompilerFirst(),
    angular({
      tsconfig: '.storybook/tsconfig.json',
      jit: true,
    }),
  ],
  optimizeDeps: {
    include: ['@angular/compiler'],
    exclude: ['@angular/common', '@angular/platform-browser', '@angular/platform-browser-dynamic'],
  },
  test: {
    name: 'manual-stories',
    globals: true,
    environment: 'jsdom',
    include: ['manual-story-tests.spec.ts'],
    setupFiles: ['.storybook/vitest-setup.ts'],
  },
});
