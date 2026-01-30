# Patch Analysis for @storybook/addon-vitest Angular Support

## Patch Created

Successfully created patch file: `patches/@storybook+addon-vitest+10.2.1.patch`

### What the Patch Does

Modified `node_modules/@storybook/addon-vitest/dist/vitest-plugin/test-utils.js`:

**Before:**
```javascript
await composedStory.run(void 0)
```

**After:**
```javascript
await composedStory.run(globalThis.globalProjectAnnotations?.renderToCanvas ? 
  { renderToCanvas: globalThis.globalProjectAnnotations.renderToCanvas } : 
  void 0)
```

This passes the `renderToCanvas` function as context to the story's `run()` method.

## Current Status

✅ **Patch is applied correctly** - Verified in both:
- `node_modules/@storybook/addon-vitest/dist/vitest-plugin/test-utils.js` 
- `node_modules/.cache/storybook/.../sb-vitest/deps/@storybook_addon-vitest_internal_test-utils.js`

❌ **Tests still fail** with: `context.renderToCanvas is not a function`

## Root Cause Analysis

The patch addresses the immediate call site, but the issue is deeper in Storybook's architecture:

1. `composedStory.run(contextArg)` receives our renderToCanvas in `contextArg`
2. Inside `run()`, Storybook's preview-api creates its own internal context object
3. This internal context doesn't properly merge the `contextArg` we passed
4. The rendering code then tries to call `context.renderToCanvas()` on the internal context

### The Real Issue

The `composeStory` function from `storybook/preview-api` needs to be patched to properly handle Angular's `renderToCanvas` in its internal context creation. This is in a different package: `storybook/preview-api`.

## Next Steps

### Option A: Patch storybook/preview-api

Need to patch the `run()` method implementation in `storybook/preview-api` to properly merge the context argument with the internal context.

Location: `node_modules/storybook/preview-api/dist/...`

This requires:
1. Finding the exact file where `run()` is implemented
2. Understanding how the internal context is created
3. Ensuring renderToCanvas from our argument gets merged into the internal context

### Option B: Fork and Create Proper Fix

For a proper upstream fix:

1. Fork both repositories:
   - `@storybook/addon-vitest`
   - `storybook` (for preview-api)

2. Modify the source TypeScript files:
   - `addon-vitest/src/vitest-plugin/test-utils.ts`
   - `storybook/code/core/src/preview-api/...` (find the composeStory/run implementation)

3. Add proper Angular renderer support:
   - Detect Angular framework
   - Properly initialize Angular-specific rendering context
   - Ensure renderToCanvas is available throughout the rendering chain

4. Create pull request to Storybook repository

### Option C: Use @storybook/test-runner

The officially supported alternative that works with Angular:
```bash
npm install --save-dev @storybook/test-runner
npx test-runner
```

## Conclusion

The patch we created is a step in the right direction, but Angular support in @storybook/addon-vitest requires changes deeper in the Storybook preview-api. The vitest addon was designed for React/Vue/Svelte where rendering contexts work differently.

**Recommended Path Forward:**
1. Use @storybook/test-runner for immediate working solution
2. Create proper fork and PR for upstream fix if vitest integration is required
3. The custom Vite plugin (`angular-compiler-plugin.ts`) we created is valuable and solves the JIT compilation issue for any Vitest + Angular integration
