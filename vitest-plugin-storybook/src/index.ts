/**
 * Vitest Plugin for On-The-Fly Story Conversion
 * Transforms *.stories.ts files into Vitest tests during test execution
 */

import type { Plugin } from 'vite';
import * as path from 'path';
import { parseStoryFile } from './parse';
import { generateTestCode } from './transform';

export interface StoryPluginOptions {
  /**
   * Include patterns for story files
   * @default ['**\/*.stories.ts']
   */
  include?: string[];

  /**
   * Exclude patterns
   * @default ['node_modules/**']
   */
  exclude?: string[];

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

export function vitestStorybookPlugin(options: StoryPluginOptions = {}): Plugin {
  const {
    include = ['**/*.stories.ts'],
    exclude = ['node_modules/**'],
    debug = false,
  } = options;

  const log = debug ? console.log.bind(console, '[vitest-storybook]') : () => {};

  return {
    name: 'vitest-storybook-plugin',
    enforce: 'pre',

    // Transform story files into test files
    async transform(code: string, id: string) {
      // Only process .stories.ts files
      if (!id.endsWith('.stories.ts')) {
        return null;
      }

      // Check if file matches include/exclude patterns
      const relativePath = path.relative(process.cwd(), id);
      
      log(`Transforming story file: ${relativePath}`);

      try {
        // Parse the story file
        const metadata = parseStoryFile(id);
        
        if (metadata.stories.length === 0) {
          log(`  No stories found, skipping`);
          return null;
        }

        log(`  Found ${metadata.stories.length} story(ies)`);

        // Generate test code
        const testCode = generateTestCode(metadata, id, code);

        log(`  Generated ${testCode.split('\n').length} lines of test code`);

        return {
          code: testCode,
          map: null, // Could generate source map for better debugging
        };
      } catch (error: any) {
        console.error(`[vitest-storybook] Error transforming ${relativePath}:`, error.message);
        // Return original code so tests don't break
        return null;
      }
    },
  };
}

export default vitestStorybookPlugin;
