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

// Make annotations available globally for the addon
globalThis.globalProjectAnnotations = annotations;
