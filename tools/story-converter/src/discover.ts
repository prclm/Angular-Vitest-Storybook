/**
 * Story File Discovery
 * Finds all *.stories.ts files in the project
 */

import { glob } from 'glob';
import * as path from 'path';

export interface StoryFile {
  filePath: string;
  relativePath: string;
  fileName: string;
}

export async function discoverStories(
  pattern: string = '**/*.stories.ts',
  ignore: string[] = ['node_modules/**', 'dist/**', '.storybook/**']
): Promise<StoryFile[]> {
  const files = await glob(pattern, {
    ignore,
    absolute: true,
  });

  return files.map(filePath => ({
    filePath,
    relativePath: path.relative(process.cwd(), filePath),
    fileName: path.basename(filePath),
  }));
}

export function getTestFilePath(storyFilePath: string): string {
  return storyFilePath.replace('.stories.ts', '.stories.spec.ts');
}
