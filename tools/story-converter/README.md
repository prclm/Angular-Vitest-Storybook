# Story Converter

A custom tool to convert Storybook stories into Vitest tests for Angular components.

## Features

- **Auto-discovery**: Finds all `*.stories.ts` files in your project
- **Smart parsing**: Extracts story metadata, args, and play functions
- **Test generation**: Creates Vitest test files with proper Angular TestBed setup
- **CLI tool**: Easy-to-use command-line interface
- **Dry-run mode**: Preview changes before writing files

## Installation

```bash
cd tools/story-converter
npm install
npm run build
```

## Usage

### Basic Usage

```bash
# From project root
npm run convert-stories

# Or directly
npx convert-stories
```

### Options

```bash
# Preview without writing files
npm run convert-stories -- --dry-run

# Show detailed output
npm run convert-stories -- --verbose

# Overwrite existing test files
npm run convert-stories -- --force

# Convert specific pattern
npm run convert-stories -- "projects/**/*.stories.ts"
```

## How It Works

1. **Discovery**: Scans for `*.stories.ts` files
2. **Parsing**: Extracts story definitions using TypeScript AST
3. **Generation**: Creates test files with:
   - Angular TestBed setup
   - Component instantiation
   - Story args application
   - play() function execution
4. **Output**: Writes `*.stories.spec.ts` files next to story files

## Example

Given a story file `button.stories.ts`:

```typescript
export const Primary: Story = {
  args: { label: 'Button', primary: true },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeInTheDocument();
  },
};
```

Generates `button.stories.spec.ts`:

```typescript
it('Primary story', async () => {
  await TestBed.configureTestingModule({
    imports: [Button],
  }).compileComponents();

  const fixture = TestBed.createComponent(Button);
  const component = fixture.componentInstance;

  const args = { label: 'Button', primary: true };
  Object.assign(component, args);

  fixture.detectChanges();

  const playFunction = Stories.Primary.play;
  if (playFunction) {
    await playFunction({
      canvasElement: fixture.nativeElement,
      args,
      component: fixture.componentRef,
    });
  }

  expect(component).toBeDefined();
});
```

## Architecture

```
tools/story-converter/
  src/
    discover.ts   # Find story files
    parse.ts      # Parse TypeScript AST
    template.ts   # Generate test templates
    generate.ts   # Orchestrate conversion
    cli.ts        # Command-line interface
  dist/          # Compiled JavaScript
  package.json
  tsconfig.json
```

## Benefits

- **No external dependencies**: No need for @storybook/test-runner
- **Angular-optimized**: Proper TestBed and JIT compilation setup
- **Customizable**: Easy to modify templates for your needs
- **Transparent**: Generated tests are readable and editable
- **CI/CD ready**: Integrates with existing test infrastructure

## Future Enhancements

- Watch mode for continuous conversion
- Support for multiple frameworks
- Custom template system
- Integration with Storybook configuration
- Incremental updates (only changed stories)
