import path from 'node:path';
import { defineWorkspace } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import angular from '@analogjs/vite-plugin-angular';

// More info at: https://storybook.js.org/docs/writing-tests/vitest-addon
export default defineWorkspace(async () => {
  const storybookPlugin = await storybookTest({ 
    configDir: path.join(__dirname, '.storybook') 
  });

  return [
    // Existing vitest configurations for app1, app2, and shared-lib
    'projects/app1/vite.config.ts',
    'projects/app2/vite.config.ts',
    'projects/shared-lib/vite.config.ts',
    // New storybook test configuration
    {
      plugins: [
        angular({
          tsconfig: 'projects/app1/tsconfig.spec.json',
        }),
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
        setupFiles: ['.storybook/vitest-setup.ts'],
      },
    },
  ];
});
