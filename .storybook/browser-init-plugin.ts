import type { Plugin } from 'vite';

/**
 * Vite plugin that injects globalProjectAnnotations into the browser context
 * 
 * This solves the issue where Vitest setup files run in Node context but tests
 * run in Playwright browser context. By creating a virtual module that gets
 * imported by the test setup, we ensure globalProjectAnnotations is available.
 */
export function browserInitPlugin(): Plugin {
  const virtualModuleId = 'virtual:storybook-browser-init';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'storybook-browser-init',
    enforce: 'pre',
    
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
          // Initialize Storybook annotations in browser context
          import { setProjectAnnotations } from '@analogjs/storybook-angular/testing';
          import * as projectAnnotations from '${process.cwd()}/.storybook/preview.ts';
          
          // Set up project annotations with Angular render functions
          const annotations = setProjectAnnotations([projectAnnotations]);
          
          // Make available globally for @storybook/addon-vitest
          globalThis.globalProjectAnnotations = annotations;
          
          console.log('[BROWSER-INIT] globalProjectAnnotations set in browser context');
          console.log('[BROWSER-INIT] renderToCanvas available:', typeof annotations.renderToCanvas);
          
          export { annotations };
        `;
      }
    },
  };
}
