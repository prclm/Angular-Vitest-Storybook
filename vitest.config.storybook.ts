/// <reference types="vitest" />
import path from 'node:path';
import { defineConfig } from 'vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// More info at: https://storybook.js.org/docs/writing-tests/vitest-addon
export default defineConfig(async () => {
  const storybookPlugin = await storybookTest({ 
    configDir: path.join(__dirname, '.storybook'),
    disableAddonDocs: true,
  });

  return {
    plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/writing-tests/vitest-addon#storybooktest
      ...storybookPlugin,
    ],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
      setupFiles: [
        '.storybook/vitest-setup.ts',
        '@storybook/addon-vitest/internal/setup-file',
      ],
    },
  };
});
