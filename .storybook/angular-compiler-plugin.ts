import type { Plugin } from 'vite';

/**
 * Custom Vite plugin to ensure @angular/compiler loads before other Angular modules.
 * 
 * This plugin:
 * 1. Excludes Angular modules from Vite's dependency pre-bundling to prevent
 *    them from being cached without the compiler
 * 2. Injects a compiler import script tag at the top of the HTML document
 * 
 * This solves the JIT compilation error where Angular modules load before the compiler
 * is available. Works for Storybook UI but has limitations with Vitest due to ES module
 * loading order (see FINAL_SUMMARY.md for details).
 */
export function angularCompilerFirst(): Plugin {
  return {
    name: 'angular-compiler-first',
    enforce: 'pre',
    
    config(config) {
      // Exclude Angular modules from dependency optimization.
      // This prevents Vite from pre-bundling them, allowing the HTML-injected
      // compiler import to load first when the browser requests Angular modules.
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
      // Inject compiler script tag at the top of the HTML document.
      // This ensures the compiler loads before any Angular module requests.
      return [
        {
          tag: 'script',
          attrs: {
            type: 'module',
          },
          children: `import '@angular/compiler';`,
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}
