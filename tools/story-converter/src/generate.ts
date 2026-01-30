/**
 * Test Generator
 * Generates test files from story files
 */

import * as fs from 'fs';
import * as path from 'path';
import { discoverStories, getTestFilePath, StoryFile } from './discover';
import { parseStoryFile } from './parse';
import { generateTestTemplate } from './template';

export interface GenerateOptions {
  pattern?: string;
  dryRun?: boolean;
  verbose?: boolean;
  force?: boolean;
}

export interface GenerateResult {
  processed: number;
  generated: number;
  skipped: number;
  errors: string[];
}

export async function generateTests(
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const { pattern, dryRun = false, verbose = false, force = false } = options;

  const result: GenerateResult = {
    processed: 0,
    generated: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Discover story files
    const storyFiles = await discoverStories(pattern);
    
    if (verbose) {
      console.log(`Found ${storyFiles.length} story file(s)`);
    }

    // Process each story file
    for (const storyFile of storyFiles) {
      result.processed++;
      
      try {
        await processStoryFile(storyFile, { dryRun, verbose, force }, result);
      } catch (error: any) {
        const errorMsg = `Error processing ${storyFile.relativePath}: ${error.message}`;
        result.errors.push(errorMsg);
        if (verbose) {
          console.error(errorMsg);
        }
      }
    }

  } catch (error: any) {
    result.errors.push(`Fatal error: ${error.message}`);
  }

  return result;
}

async function processStoryFile(
  storyFile: StoryFile,
  options: { dryRun: boolean; verbose: boolean; force: boolean },
  result: GenerateResult
): Promise<void> {
  const { dryRun, verbose, force } = options;

  if (verbose) {
    console.log(`\nProcessing: ${storyFile.relativePath}`);
  }

  // Parse the story file
  const metadata = parseStoryFile(storyFile.filePath);

  if (metadata.stories.length === 0) {
    if (verbose) {
      console.log(`  Skipped: No stories found`);
    }
    result.skipped++;
    return;
  }

  if (verbose) {
    console.log(`  Found ${metadata.stories.length} story(ies):`);
    metadata.stories.forEach(story => {
      console.log(`    - ${story.name}${story.hasPlayFunction ? ' (with play function)' : ''}`);
    });
  }

  // Generate test file content
  const testContent = generateTestTemplate(metadata, storyFile.fileName);
  const testFilePath = getTestFilePath(storyFile.filePath);

  // Check if test file already exists
  if (!force && fs.existsSync(testFilePath)) {
    if (verbose) {
      console.log(`  Skipped: Test file already exists (use --force to overwrite)`);
    }
    result.skipped++;
    return;
  }

  if (dryRun) {
    if (verbose) {
      console.log(`  Would generate: ${path.relative(process.cwd(), testFilePath)}`);
      console.log(`  Preview:\n${testContent.substring(0, 500)}...\n`);
    }
    result.generated++;
  } else {
    // Write the test file
    fs.writeFileSync(testFilePath, testContent, 'utf-8');
    if (verbose) {
      console.log(`  ✓ Generated: ${path.relative(process.cwd(), testFilePath)}`);
    }
    result.generated++;
  }
}

export function printResults(result: GenerateResult): void {
  console.log('\n=== Story Converter Results ===');
  console.log(`Processed: ${result.processed} file(s)`);
  console.log(`Generated: ${result.generated} test file(s)`);
  console.log(`Skipped:   ${result.skipped} file(s)`);
  
  if (result.errors.length > 0) {
    console.log(`\nErrors (${result.errors.length}):`);
    result.errors.forEach(error => console.log(`  ❌ ${error}`));
  }
  
  console.log('================================\n');
}
