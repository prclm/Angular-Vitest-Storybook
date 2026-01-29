/// <reference types="vitest" />
import path from 'node:path';
import { defineConfig } from 'vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import angular from '@analogjs/vite-plugin-angular';
import { angularCompilerFirst } from './.storybook/angular-compiler-plugin';

// More info at: https://storybook.js.org/docs/writing-tests/vitest-addon
export default defineConfig(async () => {
  const storybookPlugin = await storybookTest({ 
    configDir: path.join(__dirname, '.storybook'),
    disableAddonDocs: true,
  });

  return {
    plugins: [
      // Custom plugin to ensure Angular compiler loads first
      angularCompilerFirst(),
      angular({
        tsconfig: '.storybook/tsconfig.json',
        jit: true,
      }),
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/writing-tests/vitest-addon#storybooktest
      ...storybookPlugin,
    ],
    optimizeDeps: {
      include: ['@angular/compiler'],
      exclude: ['@angular/common', '@angular/platform-browser', '@angular/platform-browser-dynamic'],
    },
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
      setupFiles: [
        '.storybook/compiler-preload.ts',
        '.storybook/vitest-setup.ts',
        '@storybook/addon-vitest/internal/setup-file',
      ],
    },
  };
});
