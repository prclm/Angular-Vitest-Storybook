import type { Plugin } from 'vite';

/**
 * Custom Vite plugin to ensure @angular/compiler loads before other Angular modules.
 * 
 * This plugin:
 * 1. Excludes Angular modules from Vite's dependency pre-bundling
 * 2. Injects compiler import via HTML transformation
 * 
 * This solves the JIT compilation error where Angular modules load before the compiler.
 */
export function angularCompilerFirst(): Plugin {
  return {
    name: 'angular-compiler-first',
    enforce: 'pre',
    
    config(config) {
      // Exclude Angular modules from dependency optimization
      // This prevents Vite from pre-bundling them before compiler is available
      return {
        optimizeDeps: {
          ...config.optimizeDeps,
          exclude: [
            ...(config.optimizeDeps?.exclude || []),
            '@angular/common',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            '@angular/compiler',
          ],
        },
      };
    },

    transformIndexHtml(html) {
      // Inject compiler script tag before any other Angular code
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
            },
            children: `import '@angular/compiler';`,
            injectTo: 'head-prepend',
          },
        ],
      };
    },
  };
}
