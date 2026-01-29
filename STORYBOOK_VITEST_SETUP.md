# Storybook Vitest Integration with Analog.js

This document describes the setup of the @storybook/addon-vitest integration using @analogjs/storybook-angular for running Storybook play() functions as vitest tests with Angular standalone components.

## Why Analog.js?

The official `@storybook/angular` uses Webpack, which doesn't integrate well with Vitest's browser mode. Analog.js provides `@analogjs/storybook-angular`, a Vite-powered alternative that properly handles Angular 21 standalone components in a Vite/Vitest environment.

## Installation

The following packages were installed:

```bash
npm install --save-dev @analogjs/storybook-angular@2.2.3
npm install --save-dev @analogjs/vitest-angular@2.2.3
npm install --save-dev @storybook/addon-vitest@10.2.1
npm install --save-dev @vitest/browser@4.0.18
npm install --save-dev @vitest/browser-playwright
npm install --save-dev @storybook/test@8.6.15 --legacy-peer-deps
npm install --save-dev @angular-devkit/build-angular --legacy-peer-deps
npm install --save-dev playwright
npx playwright install chromium --with-deps
```

## Configuration

### 1. Storybook Main Configuration (.storybook/main.ts)

Updated to use @analogjs/storybook-angular framework:

```typescript
import type { StorybookConfig } from '@analogjs/storybook-angular';

const config: StorybookConfig = {
  stories: ['../projects/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-vitest'],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {},
  },
};

export default config;
```

### 2. Angular.json Updates

Updated Storybook builders to use Analog.js:

```json
{
  "storybook": {
    "builder": "@analogjs/storybook-angular:start-storybook",
    "options": {
      "configDir": ".storybook",
      "compodoc": false,
      "port": 6006
    }
  },
  "build-storybook": {
    "builder": "@analogjs/storybook-angular:build-storybook",
    "options": {
      "configDir": ".storybook",
      "compodoc": false,
      "outputDir": "dist/storybook"
    }
  }
}
```

### 3. Vitest Configuration (vitest.config.storybook.ts)

Uses @analogjs/vite-plugin-angular with the storybook test plugin:

```typescript
import path from 'node:path';
import { defineConfig } from 'vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(async () => {
  const storybookPlugin = await storybookTest({ 
    configDir: path.join(__dirname, '.storybook'),
    disableAddonDocs: true,
  });

  return {
    plugins: [
      angular({
        tsconfig: '.storybook/tsconfig.json',
        jit: true,
      }),
      ...storybookPlugin,
    ],
    optimizeDeps: {
      include: ['@angular/compiler'],
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
```

### 4. Vitest Setup File (.storybook/vitest-setup.ts)

Uses Analog.js setup utilities:

```typescript
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { setProjectAnnotations } from '@analogjs/storybook-angular';
import * as projectAnnotations from './preview';

// Setup Angular TestBed for browser mode
setupTestBed({
  zoneless: false,
  browserMode: true,
});

// Apply project-level annotations
const annotations = setProjectAnnotations([projectAnnotations]);
globalThis.globalProjectAnnotations = annotations;
```

### 5. Compiler Preload (.storybook/compiler-preload.ts)

Ensures Angular compiler loads first:

```typescript
// Pre-load Angular compiler before anything else
import '@angular/compiler';
```

### 6. Package.json Scripts

```json
{
  "scripts": {
    "test:storybook": "vitest run --config=vitest.config.storybook.ts",
    "test:storybook:watch": "vitest --config=vitest.config.storybook.ts",
    "storybook": "ng run app1:storybook",
    "build:storybook": "ng run app1:build-storybook"
  }
}
```

## Story Example with Play Function

Stories use @analogjs/storybook-angular types and @storybook/test utilities:

```typescript
import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, within } from '@storybook/test';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Components/Button',
  component: Button,
  render: (args) => ({
    props: args,
  }),
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Button');
  },
};
```

## Running Storybook

Storybook UI works correctly with the Analog.js integration:

```bash
npm run storybook
# Opens at http://localhost:6006/
```

The Button component renders properly in Storybook with all variants visible.

## Running Tests

To attempt running storybook tests:

```bash
npm run test:storybook
```

## Current Status

### ✅ What Works:

- **Storybook UI**: Fully functional with @analogjs/storybook-angular
- **Component Rendering**: Angular 21 standalone components render correctly in Storybook
- **Story Discovery**: The vitest plugin discovers all story files
- **Test Generation**: Creates test cases for stories with play() functions
- **Browser Launch**: Playwright successfully launches for testing

### ❌ Current Limitation:

The tests fail with a JIT compilation error:

```
Error: The injectable '_PlatformLocation' needs to be compiled using the JIT compiler, 
but '@angular/compiler' is not available.
```

**Root Cause**: The issue occurs because:
1. Vite/Storybook pre-bundles Angular dependencies during the optimization phase
2. These pre-bundled modules are cached in `node_modules/.cache/storybook/`
3. When tests run, these cached Angular modules load before the @angular/compiler
4. Angular's platform initialization then fails because JIT compiler isn't available yet

**Attempted Solutions**:
- ✅ Moved to @analogjs/storybook-angular (Vite-based)
- ✅ Added @analogjs/vitest-angular for proper TestBed setup  
- ✅ Created compiler preload file
- ✅ Configured `jit: true` in Angular plugin
- ✅ Added `@angular/compiler` to optimizeDeps
- ⏳ Still investigating: Module loading order in Vite's dep pre-bundling

### Next Steps

This appears to be a fundamental limitation with how Vite pre-bundles dependencies for the browser test environment. Potential solutions being investigated:

1. **Disable dependency pre-bundling** for Angular modules (may impact performance)
2. **Use a custom Vite plugin** to ensure compiler loads first
3. **Wait for upstream fixes** in @storybook/addon-vitest for better Angular support
4. **Alternative: Use @storybook/test-runner** (Jest + Playwright) which has better Angular support

## Alternative: Storybook Test Runner

Until the Vitest integration is fully resolved, you can use the official test runner:

```bash
npm install --save-dev @storybook/test-runner
npx storybook@latest test-runner
```

This uses Jest and Playwright, which don't have the same module loading issues.

## References

- [Analog.js Documentation](https://analogjs.org)
- [Analog.js Storybook Integration](https://analogjs.org/docs/packages/storybook-angular/overview)
- [Storybook Vitest Addon](https://storybook.js.org/docs/writing-tests/vitest-addon)
- [Vitest Browser Mode](https://vitest.dev/guide/browser)
