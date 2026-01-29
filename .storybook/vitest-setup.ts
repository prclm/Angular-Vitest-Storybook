// Setup file for Storybook Vitest integration
// This file is loaded before running story tests

import '@angular/compiler';
import { setProjectAnnotations } from '@storybook/angular';
import * as projectAnnotations from './preview';

// Apply project-level annotations (configurations) to your stories
const annotations = setProjectAnnotations([projectAnnotations]);

// Make annotations available globally for the addon
globalThis.globalProjectAnnotations = annotations;
