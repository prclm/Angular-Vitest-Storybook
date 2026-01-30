// Setup file for Storybook Vitest integration
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

// Apply project annotations and make available globally
const annotations = setProjectAnnotations([projectAnnotations]);
globalThis.globalProjectAnnotations = annotations;
