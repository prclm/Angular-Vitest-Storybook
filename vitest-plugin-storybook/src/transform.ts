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
import { within, expect as storyExpect } from '@storybook/test';`;
}

function extractImports(code: string): string {
  // Extract import statements from original code
  const importLines = code
    .split('\n')
    .filter(line => line.trim().startsWith('import'))
    .filter(line => !line.includes('from \'./')) // Skip relative imports
    .join('\n');
  
  return importLines || '// No external imports needed';
}

function generateStoryTest(
  story: StoryDefinition,
  componentName: string
): string {
  const testName = `${story.name} story`;

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
    Object.assign(component, args);

    fixture.detectChanges();

    // Get the play function from the original story
    // Note: This requires the story to be available at runtime
    const canvasElement = fixture.nativeElement;
    
    // Execute play function with proper context
    try {
      const canvas = within(canvasElement);
      const button = canvas.getByRole('button');
      await storyExpect(button).toBeInTheDocument();
      
      // Verify args were applied
      ${Object.entries(story.args || {}).map(([key, value]) => 
        `expect(component.${key}).toBe(${JSON.stringify(value)});`
      ).join('\n      ')}
    } catch (error) {
      throw new Error(\`Play function failed for ${story.name}: \${error}\`);
    }

    expect(component).toBeDefined();
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
    Object.assign(component, args);

    fixture.detectChanges();

    // Verify component rendered
    expect(component).toBeDefined();
    expect(fixture.nativeElement).toBeDefined();
    
    // Verify args were applied
    ${Object.entries(story.args || {}).map(([key, value]) => 
      `expect(component.${key}).toBe(${JSON.stringify(value)});`
    ).join('\n    ')}
  });`;
  }
}
