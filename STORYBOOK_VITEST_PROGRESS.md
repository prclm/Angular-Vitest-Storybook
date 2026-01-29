# Storybook Vitest Integration - Progress Update

## Major Achievement: JIT Compilation Fixed! 🎉

We successfully created a custom Vite plugin that resolves the Angular JIT compilation error.

### The Custom Plugin Solution

Created `.storybook/angular-compiler-plugin.ts` which:

1. **Excludes Angular modules from Vite's dependency pre-bundling**:
   - Prevents `@angular/common`, `@angular/platform-browser`, and `@angular/platform-browser-dynamic` from being optimized/cached before the compiler is available
   
2. **Injects compiler import at HTML head**:
   - Adds `import '@angular/compiler';` as the first module in the browser context

```typescript
export function angularCompilerFirst(): Plugin {
  return {
    name: 'angular-compiler-first',
    enforce: 'pre',
    config(config) {
      return {
        optimizeDeps: {
          ...config.optimizeDeps,
          exclude: [
            ...(config.optimizeDeps?.exclude || []),
            '@angular/common',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
          ],
        },
      };
    },
    transformIndexHtml(html) {
      return {
        html,
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

### Test Results

**Before Plugin**:
```
Error: The injectable '_PlatformLocation' needs to be compiled using the JIT compiler, 
but '@angular/compiler' is not available.
```

**After Plugin**:
```
 ❯  storybook (chromium)  projects/shared-lib/src/lib/button/button.stories.ts (4 tests)
   × Primary
   × Secondary  
   × Large
   × Small
```

✅ JIT compilation error is GONE!
✅ Tests are discovered and run
✅ Playwright browser launches successfully

### Current Status

**What Works**:
- ✅ @analogjs/storybook-angular integration  
- ✅ Angular 21 standalone components
- ✅ Storybook UI rendering
- ✅ Story discovery by vitest plugin
- ✅ Test case generation (4 tests)
- ✅ Playwright browser launch
- ✅ TestBed initialization
- ✅ Angular compiler loading (FIXED!)

**Remaining Issue**:
Tests fail with: `TypeError: context.renderToCanvas is not a function`

This is a rendering context initialization issue where the composed story's context object doesn't have the `renderToCanvas` method attached. The `@analogjs/storybook-angular/testing` module exports `renderToCanvas`, and `setProjectAnnotations` should include it, but the story context needs proper initialization.

### Next Steps

1. Investigate how `composeStory` creates the context object
2. Verify annotations are properly merged
3. Check if additional Angular renderer setup is needed for browser mode
4. Consider if there's a missing bridge between Storybook's story composition and Angular's rendering system

### Key Files

- `.storybook/angular-compiler-plugin.ts` - Custom Vite plugin (THE SOLUTION!)
- `vitest.config.storybook.ts` - Uses the plugin
- `.storybook/vitest-setup.ts` - TestBed and annotations setup  
- `STORYBOOK_VITEST_SETUP.md` - Complete documentation

See full documentation in `STORYBOOK_VITEST_SETUP.md`.
