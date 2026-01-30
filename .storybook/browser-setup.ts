// Browser-side setup file for Vitest browser mode
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { setProjectAnnotations } from '@analogjs/storybook-angular/testing';
import * as projectAnnotations from './preview';

// Type augmentation for globalThis
declare global {
  // Global variable holding project annotations for browser tests
  // eslint-disable-next-line no-var
  var globalProjectAnnotations: ReturnType<typeof setProjectAnnotations>;
}

// Setup Angular TestBed for browser mode
setupTestBed({
  zoneless: false,
  browserMode: true,
});

// Apply project annotations and make available globally
const annotations = setProjectAnnotations([projectAnnotations]);
globalThis.globalProjectAnnotations = annotations;
