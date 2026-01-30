# Vitest Plugin for Storybook

A Vitest plugin that transforms Storybook stories into tests **on-the-fly** during test execution.

## Features

- ✅ **On-the-fly transformation** - No pre-generation needed
- ✅ **Always in sync** - Tests automatically match stories
- ✅ **No generated files** - Clean git history
- ✅ **TypeScript AST parsing** - Extracts metadata accurately
- ✅ **Angular-optimized** - Proper TestBed setup
- ✅ **Zero config** - Works out of the box

## Installation

```bash
cd vitest-plugin-storybook
npm install
npm run build
```

## Usage

### 1. Add to Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { vitestStorybookPlugin } from './vitest-plugin-storybook/dist/index.js';

export default defineConfig({
  plugins: [
    vitestStorybookPlugin({
      // Options (all optional)
      include: ['**/*.stories.ts'],
      exclude: ['node_modules/**'],
      debug: true, // Enable debug logging
    }),
  ],
  test: {
    // ... your test config
  },
});
```

### 2. Run Tests

```bash
npm test
```

That's it! The plugin will automatically transform `*.stories.ts` files into tests when Vitest loads them.

## How It Works

1. **Intercept**: Plugin hooks into Vite's module transformation
2. **Detect**: Identifies `*.stories.ts` files
3. **Parse**: Extracts story metadata using TypeScript AST
4. **Transform**: Generates test code in memory
5. **Return**: Vitest receives test code instead of story code

## Example

### Input (button.stories.ts)

```typescript
export const Primary: Story = {
  args: {
    label: 'Button',
    primary: true,
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeInTheDocument();
  },
};
```

### Output (transformed in memory)

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

  const canvas = within(fixture.nativeElement);
  const button = canvas.getByRole('button');
  await expect(button).toBeInTheDocument();
});
```

## Benefits

### vs Pre-Generation

| Feature | Pre-Generation | Plugin |
|---------|----------------|--------|
| Need to run command | ✅ Yes | ❌ No |
| Generated files | ✅ Yes | ❌ No |
| Always in sync | ⚠️ Must regenerate | ✅ Always |
| Git history | ⚠️ Cluttered | ✅ Clean |
| Can edit tests | ✅ Yes | ❌ No |
| Debugging | ✅ Easy | ⚠️ Harder |

### vs @storybook/test-runner

| Feature | test-runner | Plugin |
|---------|-------------|--------|
| Needs server | ✅ Yes | ❌ No |
| Vitest integration | ❌ No | ✅ Yes |
| Customizable | ❌ No | ✅ Yes |
| Angular-optimized | ⚠️ Generic | ✅ Yes |

## Configuration

### Options

```typescript
interface StoryPluginOptions {
  // Include patterns for story files
  include?: string[]; // default: ['**/*.stories.ts']

  // Exclude patterns
  exclude?: string[]; // default: ['node_modules/**']

  // Enable debug logging
  debug?: boolean; // default: false
}
```

### Example with Options

```typescript
vitestStorybookPlugin({
  include: ['src/**/*.stories.ts', 'projects/**/*.stories.ts'],
  exclude: ['**/*.skip.stories.ts', 'node_modules/**'],
  debug: process.env.DEBUG === 'true',
})
```

## Architecture

```
Story File (.stories.ts)
    ↓
[Vite Module Loader]
    ↓
[Plugin Transform Hook]
    ↓
[Parse Story with TypeScript AST]
    ↓
[Generate Test Code]
    ↓
[Return to Vitest]
    ↓
Test Execution
```

## Advanced Usage

### Debug Mode

Enable debug logging to see transformation in action:

```typescript
vitestStorybookPlugin({
  debug: true,
})
```

Output:
```
[vitest-storybook] Transforming story file: projects/shared-lib/src/lib/button/button.stories.ts
[vitest-storybook]   Found 4 story(ies)
[vitest-storybook]   Generated 98 lines of test code
```

### Custom Test Generation

Fork the plugin and modify `src/transform.ts` to customize test generation:

```typescript
function generateStoryTest(story, component) {
  // Your custom template here
}
```

## Troubleshooting

### Stories not transformed

- Check that files match include pattern
- Enable debug mode to see what's happening
- Verify plugin is in Vitest config

### Tests fail

- Ensure Angular TestBed is configured
- Check that component imports are correct
- Verify @storybook/test is installed

### Performance issues

- Use more specific include patterns
- Add exclude patterns for large directories

## Comparison with Other Approaches

This plugin is one of three approaches demonstrated in this repository:

1. **@storybook/test-runner** - Official, needs server
2. **Pre-generation tool** - Transparent, generates files
3. **Vitest plugin** ⭐ **This one!** - On-the-fly, clean

Each has its place:
- Use **test-runner** for official support
- Use **pre-generation** for transparency
- Use **plugin** for convenience and clean workflow

## Future Enhancements

- Source map generation for better debugging
- Watch mode optimization
- Caching for faster transforms
- Support for more story formats
- Framework-agnostic version

## License

MIT

---

**Status**: Fully functional proof-of-concept  
**Tested**: With Angular 21 + Storybook + Vitest  
**Production-ready**: Yes, with testing
