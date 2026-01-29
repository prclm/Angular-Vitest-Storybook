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
// The testing module from @analogjs/storybook-angular automatically includes
// renderToCanvas and render functions in the annotations
const annotations = setProjectAnnotations([projectAnnotations]);

// Make annotations available globally for the addon
globalThis.globalProjectAnnotations = annotations;
