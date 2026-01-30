# Deep Investigation: renderToCanvas Flow Analysis - BREAKTHROUGH FINDINGS

## Critical Discovery

### The Root Cause Identified

After deep investigation into `storybook/preview-api` source code, the issue is now clear:

**Location**: `node_modules/storybook/dist/_browser-chunks/chunk-2N4WE3KZ.js` line 1189

```javascript
story.renderToCanvas && (context.renderToCanvas = async () => {
  let unmount = await story.renderToCanvas?.(/*...*/)
})
```

The context only gets `renderToCanvas` **IF** the story object has it.

### The Flow

1. `composeStory()` receives project annotations as 4th parameter
2. `normalizeProjectAnnotations()` pulls `renderToCanvas` via `getSingletonField(moduleExportList, "renderToCanvas")` (line 1099)
3. `prepareStory()` creates the story object but **doesn't** copy `renderToCanvas` from project annotations to the story
4. Context creation checks `if (story.renderToCanvas)` - **fails because story object doesn't have it**

## Enhanced Patch Strategy

Created enhanced patch that assigns `renderToCanvas` to the composed story **before** `run()` is called:

```javascript
// Before run():
composedStory.renderToCanvas || (globalThis.globalProjectAnnotations?.renderToCanvas && 
  (composedStory.renderToCanvas = globalThis.globalProjectAnnotations.renderToCanvas))
```

## New Problem Discovered

### Setup File Not Running in Browser Context

**Finding**: Vitest browser mode runs setup files in Node context, not browser context.

**Evidence**:
- Added console.log to `.storybook/vitest-setup.ts`
- Logs never appeared in test output
- `globalThis.globalProjectAnnotations` is `undefined` in browser

**Diagnostic Output**:
```
[DIAGNOSTIC] Before patch - composedStory.renderToCanvas: false
globalThis has: false  ← This is the smoking gun!
```

### The Missing Link

The `@storybook/addon-vitest/internal/setup-file` expects `globalThis.globalProjectAnnotations` to exist but doesn't create it:

```javascript
beforeAll(() => {
  if (globalThis.globalProjectAnnotations)  // ← Checks but doesn't set!
    return globalThis.globalProjectAnnotations.beforeAll();
});
```

## Solutions to Investigate

### Option A: Browser-Side Setup
Use Vitest browser mode's proper setup mechanism that runs in browser:
- Research `setupFiles` vs browser-specific setup in Vitest docs
- May need to use a different configuration approach

### Option B: Inject via Plugin
Modify the Vite plugin to inject globalProjectAnnotations directly into the browser bundle

### Option C: Patch Storybook Plugin
Patch the storybook vitest plugin itself to properly initialize globalProjectAnnotations with Angular's renderToCanvas

## Next Steps

1. ✅ Identified that setup files don't run in browser context
2. ✅ Confirmed globalThis.globalProjectAnnotations is undefined at test time
3. ⏳ Need to find how to properly set global state in Vitest browser mode
4. ⏳ Alternative: Patch to not rely on globalThis but get annotations another way

## Key Insight

The entire chain is correct EXCEPT that `globalThis.globalProjectAnnotations` is never actually set in the browser where tests run. This is a Vitest browser mode initialization issue, not a Storybook/Angular incompatibility!
