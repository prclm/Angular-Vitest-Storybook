/// <reference types="vitest" />
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import angular from '@analogjs/vite-plugin-angular';
import { angularCompilerFirst } from './.storybook/angular-compiler-plugin';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

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
        // Force the compiler to be available
        advanced: {
          compilerOptions: {
            compilationMode: 'full',
          },
        },
      }),
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/writing-tests/vitest-addon#storybooktest
      ...storybookPlugin,
    ],
    optimizeDeps: {
      // Angular modules excluded from pre-bundling by angular-compiler-plugin
      // This ensures proper loading order for JIT compilation
      exclude: [
        '@angular/common',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@storybook/addon-vitest/internal/test-utils',
      ],
      // Optimization enabled to improve startup performance
      disabled: false,
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
        '.storybook/browser-setup.ts',  // Browser-side init (runs in Playwright)
        '@storybook/addon-vitest/internal/setup-file',
      ],
    },
  };
});
