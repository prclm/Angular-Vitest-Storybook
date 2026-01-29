// Browser-side setup file that runs in the Playwright browser context
// This must set up globalProjectAnnotations which the vitest addon expects

import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { setProjectAnnotations } from '@analogjs/storybook-angular/testing';
import * as projectAnnotations from './preview';

// Setup Angular TestBed for browser mode
setupTestBed({
  zoneless: false,
  browserMode: true,
});

// Apply project-level annotations (configurations) to your stories
const annotations = setProjectAnnotations([projectAnnotations]);

// Make annotations available globally for @storybook/addon-vitest
globalThis.globalProjectAnnotations = annotations;

console.log('[BROWSER-SETUP] globalProjectAnnotations set');
console.log('[BROWSER-SETUP] renderToCanvas type:', typeof annotations.renderToCanvas);
