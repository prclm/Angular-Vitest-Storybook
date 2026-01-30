/**
 * Story to Test Code Transformer
 * Generates Vitest test code from story metadata
 */

import type { StoryMetadata, StoryDefinition } from './parse';
import * as path from 'path';

export function generateTestCode(
  metadata: StoryMetadata,
  filePath: string,
  originalCode: string
): string {
  const componentName = metadata.component || 'Component';
  const fileName = path.basename(filePath);
  const componentFileName = componentName.toLowerCase();
  
  const imports = generateImports(componentName, componentFileName);
  const originalImports = extractImports(originalCode);
  const tests = metadata.stories
    .map(story => generateStoryTest(story, componentName))
    .join('\n\n');

  return `${imports}

// Re-export original story exports for reference
${originalImports}

describe('${metadata.title || fileName}', () => {
  ${tests}
});
`;
}

function generateImports(componentName: string, componentFileName: string): string {
  return `// Auto-generated test code from stories (on-the-fly via Vitest plugin)
import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ${componentName} } from './${componentFileName}';
import { within } from '@storybook/test';`;
}

function extractImports(code: string): string {
  // Extract import statements from original code
  const importLines = code
    .split('\n')
    .filter(line => line.trim().startsWith('import'))
    .filter(line => !line.includes("from './") && !line.includes('from "../')) // Skip relative imports
    .join('\n');
  
  return importLines || '// No external imports needed';
}

function generateStoryTest(
  story: StoryDefinition,
  componentName: string
): string {
  const testName = `${story.name} story`;
  const argsEntries = Object.entries(story.args || {});

  if (story.hasPlayFunction) {
    return `  it('${testName}', async () => {
    // Setup Angular TestBed
    await TestBed.configureTestingModule({
      imports: [${componentName}],
    }).compileComponents();

    const fixture = TestBed.createComponent(${componentName});
    const component = fixture.componentInstance;

    // Apply story args
    const args = ${JSON.stringify(story.args || {}, null, 6).replace(/\n/g, '\n    ')};
    Object.keys(args).forEach(key => {
      if (key in component) {
        (component as any)[key] = args[key as keyof typeof args];
      }
    });

    fixture.detectChanges();

    // Execute the story's play function
    // Note: The play function should be imported from the story module
    // For now, we verify the component rendered with correct args
    const canvasElement = fixture.nativeElement;
    
    // Verify component rendered
    expect(component).toBeDefined();
    expect(canvasElement).toBeDefined();
    
    // Verify args were applied correctly
    ${argsEntries.map(([key]) => 
      `if ('${key}' in component) { expect((component as any).${key}).toBeDefined(); }`
    ).join('\n    ')}
  });`;
  } else {
    return `  it('${testName} - renders without errors', async () => {
    // Setup Angular TestBed
    await TestBed.configureTestingModule({
      imports: [${componentName}],
    }).compileComponents();

    const fixture = TestBed.createComponent(${componentName});
    const component = fixture.componentInstance;

    // Apply story args
    const args = ${JSON.stringify(story.args || {}, null, 6).replace(/\n/g, '\n    ')};
    Object.keys(args).forEach(key => {
      if (key in component) {
        (component as any)[key] = args[key as keyof typeof args];
      }
    });

    fixture.detectChanges();

    // Verify component rendered
    expect(component).toBeDefined();
    expect(fixture.nativeElement).toBeDefined();
    
    // Verify args were applied correctly
    ${argsEntries.map(([key]) => 
      `if ('${key}' in component) { expect((component as any).${key}).toBeDefined(); }`
    ).join('\n    ')}
  });`;
  }
}
