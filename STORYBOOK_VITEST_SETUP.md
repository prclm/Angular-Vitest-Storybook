# Storybook Vitest Integration

This document describes the setup of the @storybook/addon-vitest integration for running Storybook play() functions as vitest tests.

## Installation

The following packages were installed:

```bash
npm install --save-dev @storybook/addon-vitest@10.2.1
npm install --save-dev @vitest/browser@4.0.18
npm install --save-dev @vitest/browser-playwright
npm install --save-dev @storybook/test@8.6.15 --legacy-peer-deps
npm install --save-dev @angular-devkit/build-angular --legacy-peer-deps
npm install --save-dev playwright
```

## Configuration

### 1. Storybook Main Configuration (.storybook/main.ts)

Added the vitest addon to the addons array:

```typescript
addons: ['@storybook/addon-vitest'],
```

### 2. Vitest Configuration (vitest.config.storybook.ts)

Created a separate vitest configuration file for storybook tests:

```typescript
import path from 'node:path';
import { defineConfig } from 'vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig(async () => {
  const storybookPlugin = await storybookTest({ 
    configDir: path.join(__dirname, '.storybook'),
    disableAddonDocs: true,
  });

  return {
    plugins: [
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
```

### 3. Vitest Setup File (.storybook/vitest-setup.ts)

Created a setup file to initialize project annotations:

```typescript
import '@angular/compiler';
import { setProjectAnnotations } from '@storybook/angular';
import * as projectAnnotations from './preview';

const annotations = setProjectAnnotations([projectAnnotations]);
globalThis.globalProjectAnnotations = annotations;
```

### 4. Workspace Configuration (vitest.workspace.ts)

Created a workspace configuration to run multiple test suites:

```typescript
import path from 'node:path';
import { defineWorkspace } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import angular from '@analogjs/vite-plugin-angular';

export default defineWorkspace(async () => {
  const storybookPlugin = await storybookTest({ 
    configDir: path.join(__dirname, '.storybook') 
  });

  return [
    'projects/app1/vite.config.ts',
    'projects/app2/vite.config.ts',
    'projects/shared-lib/vite.config.ts',
    {
      plugins: [
        angular({
          tsconfig: 'projects/app1/tsconfig.spec.json',
        }),
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
```

### 5. Package.json Scripts

Added npm scripts for running storybook tests:

```json
{
  "scripts": {
    "test:storybook": "vitest run --config=vitest.config.storybook.ts",
    "test:storybook:watch": "vitest --config=vitest.config.storybook.ts"
  }
}
```

## Story Example with Play Function

Updated the button stories to include play functions:

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from '@storybook/test';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    label: 'Button',
    primary: true,
  },
  render: (args) => ({
    props: args,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Button');
  },
};
```

## Running Tests

To run all storybook tests:

```bash
npm run test:storybook
```

To run in watch mode:

```bash
npm run test:storybook:watch
```

## Current Status

The vitest plugin successfully:
- ✅ Discovers story files based on Storybook configuration
- ✅ Creates test cases for each story with a play() function  
- ✅ Launches Playwright browser for testing
- ✅ Runs 4 test cases (one for each story: Primary, Secondary, Large, Small)

### Known Issue

The tests are currently failing with an Angular rendering error:
```
InvalidCharacterError: Failed to execute 'createElement' on 'Document': The tag name provided ('') is not a valid name.
```

This error occurs because the Angular renderer (`_DocsRenderer`) cannot properly extract the component selector. This is a known compatibility issue between:
- Storybook Angular 10.2.1  
- @storybook/addon-vitest 10.2.1
- Angular 21.1.0 standalone components

### Potential Solutions

1. **Wait for official Angular support**: The addon-vitest is primarily designed for React, Vue, and Svelte. Angular support may need improvements in future versions.

2. **Use Storybook Test Runner instead**: Consider using `@storybook/test-runner` (Jest + Playwright) which has better Angular support.

3. **Simplify component registration**: The issue may be related to how Angular components are registered with Storybook when using the vitest plugin.

## References

- [Storybook Vitest Addon Documentation](https://storybook.js.org/docs/writing-tests/vitest-addon)
- [GitHub: @storybook/addon-vitest](https://github.com/storybookjs/storybook/tree/next/code/addons/vitest)
- [Vitest Browser Mode](https://vitest.dev/guide/browser)
