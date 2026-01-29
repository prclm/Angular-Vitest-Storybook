// Setup file for Storybook Vitest integration
// This file is loaded before running story tests

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
// The preview.ts now exports render and renderToCanvas from @analogjs/storybook-angular/testing
// so they'll be included in the annotations automatically
const annotations = setProjectAnnotations([projectAnnotations]);

// DIAGNOSTIC: Check what we got
console.log('[SETUP] projectAnnotations keys:', Object.keys(projectAnnotations));
console.log('[SETUP] projectAnnotations.renderToCanvas:', typeof projectAnnotations.renderToCanvas);
console.log('[SETUP] annotations keys sample:', Object.keys(annotations).slice(0, 20));
console.log('[SETUP] annotations.renderToCanvas:', typeof annotations.renderToCanvas);

// Make annotations available globally for the addon
globalThis.globalProjectAnnotations = annotations;

console.log('[SETUP] globalThis.globalProjectAnnotations.renderToCanvas:', typeof globalThis.globalProjectAnnotations?.renderToCanvas);
