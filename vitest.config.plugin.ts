import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { vitestStorybookPlugin } from './vitest-plugin-storybook/dist/index.js';
import { angularCompilerFirst } from './.storybook/angular-compiler-plugin';

export default defineConfig({
  plugins: [
    angularCompilerFirst(),
    angular(),
    vitestStorybookPlugin({
      include: ['**/*.stories.ts'],
      exclude: ['node_modules/**', 'dist/**', '.storybook/**'],
      debug: true, // Enable to see transformation logs
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./.storybook/browser-setup.ts'],
    include: ['**/*.stories.ts'], // Include story files as tests
  },
});
