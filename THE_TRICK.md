# The Trick: How Storybook Renders Angular Stories and Runs Vitest Tests in the Browser

## Overview

The "trick" to making Storybook render Angular stories and run Vitest tests directly in the browser is a sophisticated integration of multiple technologies that work together to:

1. **Discover stories** as test cases
2. **Render Angular components** in a real browser
3. **Execute test assertions** (play functions) on the rendered components
4. **Report results** back to Vitest

This document explains how each piece works and how they fit together.

## The Core Components

### 1. @storybook/addon-vitest (The Discovery Engine)

**What it does:**
- Scans your Storybook configuration to find all story files
- Converts each exported story into a Vitest test case
- Provides the `storybookTest()` Vite plugin

**How it works:**
```typescript
// In vitest.config.storybook.ts
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const storybookPlugin = await storybookTest({ 
  configDir: '.storybook',  // Points to your Storybook config
});
```

The plugin:
- Reads `.storybook/main.ts` to find story patterns (e.g., `*.stories.ts`)
- Generates virtual test files that import and execute each story
- Each story becomes a `test()` or `it()` call in Vitest

### 2. Vitest Browser Mode (The Execution Environment)

**What it does:**
- Runs tests in a real Playwright-controlled browser instead of Node.js
- Provides DOM APIs, browser globals, and full browser rendering

**How it works:**
```typescript
// In vitest.config.storybook.ts
test: {
  browser: {
    enabled: true,
    provider: playwright(),  // Uses Playwright to control a browser
    instances: [{ browser: 'chromium' }],
  },
}
```

**Why this matters for Angular:**
- Angular needs a real DOM to render components
- Browser APIs like `window`, `document` are available
- CSS and layout work exactly as in production

### 3. @analogjs/storybook-angular (The Angular Bridge)

**What it does:**
- Provides Vite-based Storybook framework for Angular
- Includes Angular-specific rendering functions
- Supplies `renderToCanvas()` function that knows how to render Angular components

**How it works:**
```typescript
// From @analogjs/storybook-angular/testing
export function renderToCanvas(
  { storyFn, showMain, showError, showException, forceRemount },
  canvasElement
) {
  // Creates Angular application context
  // Compiles and renders the component
  // Attaches it to the canvas DOM element
}
```

**Key Functions:**
- `render()` - Main rendering function
- `renderToCanvas()` - Renders story to a specific DOM element
- `setProjectAnnotations()` - Configures Storybook for Angular

### 4. The Patch (The Missing Link)

**The Problem:**
The `@storybook/addon-vitest` plugin was designed for React/Vue/Svelte. When it composes a story and calls `composedStory.run()`, it doesn't automatically include Angular's `renderToCanvas` function.

**The Solution:**
We patch `@storybook/addon-vitest/dist/vitest-plugin/test-utils.js`:

```javascript
// BEFORE (original):
await composedStory.run(void 0)

// AFTER (patched):
import { renderToCanvas as angularRenderToCanvas } from "@analogjs/storybook-angular/testing";
composedStory.renderToCanvas || (composedStory.renderToCanvas = angularRenderToCanvas);
await composedStory.run(void 0)
```

**What this does:**
- Directly imports Angular's `renderToCanvas` function
- Assigns it to the composed story before execution
- Now when `composedStory.run()` creates a rendering context, it has the Angular renderer

### 5. Browser Setup (The Initialization)

**What it does:**
- Runs in the Playwright browser before tests execute
- Initializes Angular's TestBed
- Sets up Storybook project annotations

**How it works:**
```typescript
// .storybook/browser-setup.ts
import '@angular/compiler';  // Load compiler first!
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { setProjectAnnotations } from '@analogjs/storybook-angular/testing';

// Initialize Angular TestBed for browser mode
setupTestBed({
  zoneless: false,
  browserMode: true,
});

// Apply project annotations globally
const annotations = setProjectAnnotations([projectAnnotations]);
globalThis.globalProjectAnnotations = annotations;
```

**Why this matters:**
- Angular's TestBed provides the infrastructure to compile and test components
- `browserMode: true` adapts TestBed for browser testing (vs Node JSDOM)
- Global annotations make Storybook configuration available to all stories

## The Complete Flow

### Step 1: Discovery Phase (Build Time)

```
Vitest starts → loads vitest.config.storybook.ts
                      ↓
         storybookTest() plugin activates
                      ↓
         Reads .storybook/main.ts config
                      ↓
         Finds story files matching patterns
                      ↓
         Generates virtual test module with:
         - import story from './button.stories'
         - test('Primary', testStory({ story: Primary }))
```

### Step 2: Browser Launch (Test Start)

```
Vitest → Launches Playwright browser (Chromium)
              ↓
        Loads browser-setup.ts in browser context
              ↓
        Imports @angular/compiler
              ↓
        Sets up Angular TestBed
              ↓
        Configures Storybook annotations
              ↓
        Browser ready for tests
```

### Step 3: Test Execution (Per Story)

```
Vitest executes: test('Primary', testStory({ story }))
                          ↓
            testStory() function runs (patched!)
                          ↓
            composeStory(story, meta, annotations)
                          ↓
            composedStory.renderToCanvas = angularRenderToCanvas  ← PATCH
                          ↓
            composedStory.run()
                          ↓
            Internally calls context.renderToCanvas()
                          ↓
            Angular component renders to canvas
                          ↓
            play() function executes with canvasElement
                          ↓
            Assertions run: expect(button).toBeInTheDocument()
                          ↓
            Test passes or fails
```

### Step 4: Reporting

```
Test results → Stored in _task.meta.reports
                    ↓
            Vitest collects results
                    ↓
            Browser closes
                    ↓
            Test report displayed in terminal
```

## The Angular JIT Compilation Challenge

### The Problem

Angular components need to be compiled before they can be rendered. In development mode, this uses the JIT (Just-In-Time) compiler:

```typescript
// When you import a component:
import { Button } from './button';

// Angular needs @angular/compiler to transform it into:
// - Component factory
// - Template functions
// - Dependency injection metadata
```

### The ES Module Loading Order Issue

**The Challenge:**
```typescript
// In button.stories.ts
import '@angular/compiler';  // You'd think this would load first...
import { Button } from './button';  // ...but ES modules load dependencies FIRST!
```

**What Actually Happens:**
1. ES module system sees `import { Button }`
2. Loads Button component file
3. Button imports `@angular/common`, `@angular/core`, etc.
4. Those Angular modules try to use JIT compiler
5. Compiler hasn't loaded yet → ERROR!
6. Only then does the story file's `import '@angular/compiler'` execute

**Why This Can't Be Fixed with Import Order:**
This is the ES module specification. Dependencies MUST be fully loaded before the importing module's code executes. It's not a bug, it's the design.

### Current Solutions

#### Solution 1: Custom Vite Plugin (Partial Success)

```typescript
// .storybook/angular-compiler-plugin.ts
export function angularCompilerFirst(): Plugin {
  return {
    transformIndexHtml(html) {
      // Inject compiler import at HTML level
      return {
        tags: [{
          tag: 'script',
          attrs: { type: 'module' },
          children: `import '@angular/compiler';`,
          injectTo: 'head-prepend',
        }],
      };
    },
  };
}
```

**Works for:** Storybook UI (browser loads HTML → script → compiler → stories)
**Doesn't work for:** Vitest tests (cached bundles bypass HTML injection)

#### Solution 2: @storybook/test-runner (Recommended)

Uses a different execution model that doesn't have ES module ordering constraints:
```bash
npm run storybook  # Start server
npm run test-storybook  # Run tests against server
```

## Key Insights

### Why @analogjs/storybook-angular?

The official `@storybook/angular` uses Webpack. We use `@analogjs/storybook-angular` because:
- ✅ Built on Vite (faster, better DX)
- ✅ Designed for standalone components
- ✅ Better integration with modern Angular
- ✅ Provides Vitest-compatible testing utilities

### Why Patch Instead of Configure?

We patch `@storybook/addon-vitest` because:
- The addon doesn't have a configuration option for custom renderers
- Angular's `renderToCanvas` needs to be explicitly assigned
- The patch is minimal and surgical (2 lines)
- It's the cleanest way to inject Angular-specific behavior

### Why Vitest Browser Mode?

Alternative would be JSDOM, but:
- ❌ JSDOM doesn't fully support Angular
- ❌ Missing browser APIs
- ❌ Can't test visual rendering
- ✅ Playwright provides real browser rendering
- ✅ Tests run in the actual environment users see

## The "Trick" Summary

The trick is the combination of:

1. **@storybook/addon-vitest** discovers stories → converts to tests
2. **Vitest browser mode** provides real browser environment
3. **@analogjs/storybook-angular** provides Angular rendering
4. **Patch** connects Angular's renderToCanvas to story execution
5. **Browser setup** initializes Angular TestBed before tests run
6. **Custom Vite plugin** ensures compiler loads first (for Storybook UI)

**The Magic Moment:**
When `composedStory.run()` executes, it has:
- ✅ A real browser DOM to render into
- ✅ Angular TestBed configured and ready
- ✅ The `renderToCanvas` function to render components
- ✅ The component already compiled (via browser setup)
- ✅ The play() function to run assertions

All these pieces working together make it possible to write a story with a play() function and have it automatically become an executable test in a real browser.

## Current Status

**What Works:**
- ✅ Story discovery and test generation
- ✅ Browser launch and setup
- ✅ Patch applied successfully
- ✅ renderToCanvas function available
- ✅ Storybook UI renders components perfectly

**What's Blocked:**
- ⏳ ES module loading order prevents test execution
- JIT compiler loads after Angular modules in test context
- Need to implement one of the documented solutions

**Next Steps:**
See FINAL_SUMMARY.md for three viable paths forward:
1. Use @storybook/test-runner (recommended)
2. Switch to AOT compilation
3. Use manual TestBed approach
