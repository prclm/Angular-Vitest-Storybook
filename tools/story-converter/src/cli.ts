#!/usr/bin/env node
/**
 * Story Converter CLI
 * Command-line interface for converting stories to tests
 */

import { generateTests, printResults } from './generate';

interface CLIOptions {
  pattern?: string;
  dryRun: boolean;
  verbose: boolean;
  force: boolean;
  help: boolean;
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    dryRun: false,
    verbose: false,
    force: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--force' || arg === '-f') {
      options.force = true;
    } else if (arg === '--pattern' || arg === '-p') {
      options.pattern = args[++i];
    } else if (!arg.startsWith('-')) {
      options.pattern = arg;
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
Story Converter - Convert Storybook stories to Vitest tests

Usage: convert-stories [options] [pattern]

Options:
  -h, --help       Show this help message
  -d, --dry-run    Preview changes without writing files
  -v, --verbose    Show detailed output
  -f, --force      Overwrite existing test files
  -p, --pattern    Glob pattern for story files (default: **/*.stories.ts)

Examples:
  convert-stories                          # Convert all stories
  convert-stories --dry-run                # Preview what would be generated
  convert-stories --verbose                # Show detailed output
  convert-stories "src/**/*.stories.ts"    # Convert specific pattern
  convert-stories --force                  # Regenerate all test files

Generated test files will be placed next to their story files with 
the naming pattern: *.stories.spec.ts
`);
}

async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  console.log('🔄 Story Converter - Converting stories to tests...\n');

  if (options.dryRun) {
    console.log('📝 DRY RUN MODE - No files will be written\n');
  }

  try {
    const result = await generateTests({
      pattern: options.pattern,
      dryRun: options.dryRun,
      verbose: options.verbose,
      force: options.force,
    });

    printResults(result);

    if (result.errors.length > 0) {
      process.exit(1);
    }

    if (!options.dryRun && result.generated > 0) {
      console.log('✨ Done! Run tests with: npm test');
    }

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
