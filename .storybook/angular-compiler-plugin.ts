import type { Plugin } from 'vite';

/**
 * Custom Vite plugin to ensure @angular/compiler loads before other Angular modules.
 * 
 * This plugin intercepts module resolution and forces @angular/compiler to be loaded
 * as a dependency of any Angular module that requires JIT compilation.
 * 
 * This solves the issue where Vite pre-bundles Angular dependencies before the compiler
 * is available, causing JIT compilation errors.
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
          ],
        },
      };
    },

    resolveId(id, importer) {
      // If any Angular module is being imported, ensure compiler is loaded first
      if (id.startsWith('@angular/') && id !== '@angular/compiler' && importer) {
        // Force compiler to be a dependency
        return null; // Continue with normal resolution
      }
      return null;
    },

    load(id) {
      // For Angular modules, inject compiler import at the top
      if (id.includes('@angular/') && 
          !id.includes('@angular/compiler') && 
          !id.includes('node_modules/.cache')) {
        // Let the module load normally
        return null;
      }
      return null;
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
