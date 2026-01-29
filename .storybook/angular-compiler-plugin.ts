import type { Plugin } from 'vite';

/**
 * Custom Vite plugin to ensure @angular/compiler loads before other Angular modules.
 * 
 * This plugin transforms Angular modules to inject the compiler import at the top,
 * ensuring it's available before any JIT compilation occurs.
 * 
 * This solves the issue where Vite processes Angular dependencies before the compiler
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

    transform(code, id) {
      // Inject compiler import at the top of Angular modules (except compiler itself)
      if (id.includes('node_modules/@angular/') && 
          !id.includes('@angular/compiler') &&
          !id.includes('.d.ts') &&
          !code.includes('import "@angular/compiler"')) {
        return {
          code: `import "@angular/compiler";\n${code}`,
          map: null
        };
      }
      
      // Also inject for @analogjs/storybook-angular modules
      if (id.includes('node_modules/@analogjs/storybook-angular') &&
          !id.includes('.d.ts') &&
          !code.includes('import "@angular/compiler"')) {
        return {
          code: `import "@angular/compiler";\n${code}`,
          map: null
        };
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
