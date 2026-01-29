// Setup file for Storybook Vitest integration
// This file is loaded before running story tests

import '@angular/compiler';
import { setProjectAnnotations } from '@storybook/angular';
import * as projectAnnotations from './preview';

// Apply project-level annotations (configurations) to your stories
setProjectAnnotations([projectAnnotations]);
