/**
 * Test File Template Generator
 * Creates test file templates from story metadata
 */

import { StoryMetadata, StoryDefinition } from './parse';
import * as path from 'path';

export function generateTestTemplate(
  metadata: StoryMetadata,
  storyFilePath: string
): string {
  const relativePath = getRelativeImportPath(storyFilePath);
  const componentName = metadata.component || 'Component';
  
  const imports = generateImports(relativePath, componentName);
  const tests = metadata.stories
    .map(story => generateStoryTest(story, componentName))
    .join('\n\n');

  return `${imports}

describe('${metadata.title || path.basename(storyFilePath)}', () => {
  ${tests}
});
`;
}

function generateImports(storyPath: string, componentName: string): string {
  const storyImportPath = storyPath.replace('.ts', '');
  const componentFileName = componentName.toLowerCase();
  
  return `// Auto-generated test file from stories
// DO NOT EDIT - Regenerate using: npm run convert-stories

import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ${componentName} } from './${componentFileName}';
import * as Stories from './${storyImportPath}';`;
}

function getRelativeImportPath(filePath: string): string {
  const fileName = path.basename(filePath);
  return fileName.replace('.stories.ts', '.stories');
}

function generateStoryTest(
  story: StoryDefinition,
  componentName: string
): string {
  const testName = `${story.name} story`;
  const storyRef = `Stories.${story.exportName}`;

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

    // Run the story's play function
    const canvasElement = fixture.nativeElement;
    const playFunction = ${storyRef}.play;
    
    if (playFunction) {
      await playFunction({
        canvasElement,
        args,
        component: fixture.componentRef,
      } as any);
    }

    // Test passes if play function didn't throw
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
  });`;
  }
}
