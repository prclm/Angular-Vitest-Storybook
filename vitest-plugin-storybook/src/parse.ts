/**
 * Story Parser (reused from converter tool)
 * Extracts story metadata from TypeScript files
 */

import * as ts from 'typescript';
import * as fs from 'fs';

export interface StoryMetadata {
  fileName: string;
  title?: string;
  component?: string;
  stories: StoryDefinition[];
}

export interface StoryDefinition {
  name: string;
  exportName: string;
  hasPlayFunction: boolean;
  args?: Record<string, any>;
}

export function parseStoryFile(filePath: string): StoryMetadata {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const metadata: StoryMetadata = {
    fileName: filePath,
    stories: [],
  };

  // First pass: find the 'meta' variable declaration
  let metaNode: ts.Expression | undefined;
  
  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isVariableStatement(node) &&
      !node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      node.declarationList.declarations.forEach(declaration => {
        if (
          ts.isVariableDeclaration(declaration) &&
          ts.isIdentifier(declaration.name) &&
          declaration.name.text === 'meta' &&
          declaration.initializer
        ) {
          metaNode = declaration.initializer;
        }
      });
    }
  });

  // Extract metadata from the meta node
  if (metaNode) {
    const meta = extractMetadata(metaNode, sourceCode);
    metadata.title = meta.title;
    metadata.component = meta.component;
  }

  // Second pass: extract story exports
  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      node.declarationList.declarations.forEach(declaration => {
        if (
          ts.isVariableDeclaration(declaration) &&
          ts.isIdentifier(declaration.name) &&
          declaration.initializer
        ) {
          const storyName = declaration.name.text;
          if (storyName === 'meta' || storyName === 'default') {
            return;
          }

          const story = extractStoryDefinition(
            storyName,
            declaration.initializer,
            sourceCode
          );
          if (story) {
            metadata.stories.push(story);
          }
        }
      });
    }
  });

  return metadata;
}

function extractMetadata(
  node: ts.Expression,
  sourceCode: string
): { title?: string; component?: string } {
  const metadata: { title?: string; component?: string } = {};

  if (ts.isObjectLiteralExpression(node)) {
    node.properties.forEach(prop => {
      if (
        ts.isPropertyAssignment(prop) &&
        ts.isIdentifier(prop.name)
      ) {
        const propName = prop.name.text;
        if (propName === 'title' && ts.isStringLiteral(prop.initializer)) {
          metadata.title = prop.initializer.text;
        } else if (propName === 'component') {
          if (ts.isIdentifier(prop.initializer)) {
            metadata.component = prop.initializer.text;
          } else {
            const componentText = sourceCode.substring(
              prop.initializer.pos,
              prop.initializer.end
            ).trim();
            metadata.component = componentText.replace(/[,\s]/g, '');
          }
        }
      }
    });
  }

  return metadata;
}

function extractStoryDefinition(
  name: string,
  node: ts.Expression,
  sourceCode: string
): StoryDefinition | null {
  const story: StoryDefinition = {
    name,
    exportName: name,
    hasPlayFunction: false,
  };

  if (ts.isObjectLiteralExpression(node)) {
    node.properties.forEach(prop => {
      if (
        ts.isPropertyAssignment(prop) &&
        ts.isIdentifier(prop.name)
      ) {
        const propName = prop.name.text;
        
        if (propName === 'play') {
          story.hasPlayFunction = true;
        } else if (propName === 'args' && ts.isObjectLiteralExpression(prop.initializer)) {
          story.args = extractArgs(prop.initializer);
        }
      }
    });
  }

  return story;
}

function extractArgs(node: ts.ObjectLiteralExpression): Record<string, any> {
  const args: Record<string, any> = {};

  node.properties.forEach(prop => {
    if (
      ts.isPropertyAssignment(prop) &&
      ts.isIdentifier(prop.name)
    ) {
      const key = prop.name.text;
      const value = extractValue(prop.initializer);
      if (value !== undefined) {
        args[key] = value;
      }
    }
  });

  return args;
}

function extractValue(node: ts.Expression): any {
  if (ts.isStringLiteral(node)) {
    return node.text;
  } else if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  } else if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }
  return undefined;
}
