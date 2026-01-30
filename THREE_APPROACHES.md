# Three Approaches to Story Testing

This repository demonstrates **THREE** complete, working approaches to running Storybook play() functions as tests for Angular components.

## Quick Comparison

| Approach | Status | Pre-generation | Server | Git Files | Always Synced |
|----------|--------|----------------|--------|-----------|---------------|
| **test-runner** | ✅ Working | ❌ No | ✅ Yes | ❌ No | ✅ Yes |
| **Pre-generation** | ✅ Working | ✅ Yes | ❌ No | ✅ Yes | ⚠️ Manual |
| **Vitest Plugin** | ✅ Working | ❌ No | ❌ No | ❌ No | ✅ Yes |

## Approach 1: @storybook/test-runner

### What It Is
Official Storybook tool that connects to a running Storybook server and executes stories as tests using Jest + Playwright.

### How to Use
```bash
# Terminal 1: Start Storybook
npm run storybook

# Terminal 2: Run tests
npm run test-storybook
```

### Pros
- ✅ Official Storybook solution
- ✅ Well-supported and maintained
- ✅ Works out of the box
- ✅ No custom tooling needed
- ✅ Proven in production

### Cons
- ❌ Requires running server
- ❌ Uses Jest (not Vitest)
- ❌ Not customizable
- ❌ Generic (not Angular-optimized)

### When to Use
- Production applications
- Need official support
- Team comfortable with Storybook ecosystem
- CI/CD with server start capability

### Documentation
- [TEST_RESULTS.txt](TEST_RESULTS.txt)
- [THE_TRICK.md](THE_TRICK.md)

---

## Approach 2: Pre-Generation Tool

### What It Is
Custom CLI tool that discovers stories, parses them with TypeScript AST, and generates static `*.stories.spec.ts` test files.

### How to Use
```bash
# Generate test files
npm run convert-stories

# Run generated tests
npm test
```

### Pros
- ✅ No server needed
- ✅ Generated files are readable
- ✅ Can edit tests manually
- ✅ Easy debugging
- ✅ Full transparency
- ✅ Angular-optimized

### Cons
- ⚠️ Must run generation command
- ⚠️ Generated files in git
- ⚠️ Can get out of sync with stories

### When to Use
- Want to see test files
- Need to customize tests
- Debugging is important
- Transparency preferred

### Documentation
- [CUSTOM_CONVERTER.md](CUSTOM_CONVERTER.md)
- [tools/story-converter/README.md](tools/story-converter/README.md)
- [DEMO.md](DEMO.md)

### Files
- `tools/story-converter/` - Complete tool
- `button.stories.spec.ts` - Example generated output

---

## Approach 3: Vitest Plugin ⭐

### What It Is
Custom Vitest plugin that intercepts `*.stories.ts` file loads and transforms them into tests on-the-fly during test execution.

### How to Use
```bash
# Just run tests!
npm run test:stories:plugin
```

### Pros
- ✅ No pre-generation step
- ✅ Always in sync with stories
- ✅ No generated files in git
- ✅ Clean workflow
- ✅ Vitest integration
- ✅ Fully customizable
- ✅ Angular-optimized

### Cons
- ⚠️ Harder debugging (no visible test files)
- ⚠️ Custom tooling to maintain
- ⚠️ Less transparent

### When to Use
- Development workflow
- Want clean git history
- Tests must always match stories
- Quick iteration important

### Documentation
- [vitest-plugin-storybook/README.md](vitest-plugin-storybook/README.md)
- [vitest.config.plugin.ts](vitest.config.plugin.ts)

### Files
- `vitest-plugin-storybook/` - Complete plugin

---

## Detailed Comparison

### Setup Complexity

**test-runner**: ⭐⭐⭐⭐⭐ (5/5) - Easiest
```bash
npm install @storybook/test-runner
```

**Pre-generation**: ⭐⭐⭐⭐ (4/5) - Easy
```bash
cd tools/story-converter
npm install && npm run build
```

**Plugin**: ⭐⭐⭐ (3/5) - Moderate
```bash
cd vitest-plugin-storybook
npm install && npm run build
# Then configure in vitest.config.ts
```

### Workflow Convenience

**test-runner**: ⭐⭐⭐ (3/5)
```bash
npm run storybook    # Terminal 1
npm run test-storybook  # Terminal 2
```

**Pre-generation**: ⭐⭐⭐ (3/5)
```bash
npm run convert-stories  # After story changes
npm test
```

**Plugin**: ⭐⭐⭐⭐⭐ (5/5) - Best
```bash
npm run test:stories:plugin  # That's it!
```

### Debugging Experience

**test-runner**: ⭐⭐⭐ (3/5)
- Tests run in Playwright
- Must debug in browser
- Less IDE integration

**Pre-generation**: ⭐⭐⭐⭐⭐ (5/5) - Best
- Visible test files
- Full IDE support
- Standard debugging

**Plugin**: ⭐⭐ (2/5)
- No visible test files
- Must debug transformed code
- Harder to troubleshoot

### Git History

**test-runner**: ⭐⭐⭐⭐⭐ (5/5) - Clean
- No generated files

**Pre-generation**: ⭐⭐ (2/5) - Cluttered
- Generated test files committed
- Diffs show test changes

**Plugin**: ⭐⭐⭐⭐⭐ (5/5) - Clean
- No generated files

### Customization

**test-runner**: ⭐ (1/5)
- Fixed implementation
- Limited options

**Pre-generation**: ⭐⭐⭐⭐⭐ (5/5) - Best
- Full control over templates
- Easy to modify

**Plugin**: ⭐⭐⭐⭐ (4/5)
- Can modify transformation
- Requires rebuilding

### Maintenance

**test-runner**: ⭐⭐⭐⭐⭐ (5/5) - Best
- Official tool
- Maintained by Storybook

**Pre-generation**: ⭐⭐⭐ (3/5)
- Custom tool to maintain
- But simple code

**Plugin**: ⭐⭐⭐ (3/5)
- Custom plugin to maintain
- Vite API changes possible

---

## Example Story

All three approaches work with the same story:

```typescript
// button.stories.ts
export const Primary: Story = {
  args: {
    label: 'Button',
    primary: true,
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Button');
  },
};
```

### What Each Approach Does

**test-runner**:
1. Storybook server serves the story
2. test-runner opens in Playwright
3. Story renders in browser
4. play() executes
5. Results reported

**Pre-generation**:
1. Tool parses story file
2. Generates `button.stories.spec.ts`
3. Vitest runs generated test
4. Angular TestBed renders component
5. play() executes
6. Results reported

**Plugin**:
1. Vitest loads story file
2. Plugin intercepts
3. Transforms to test code in memory
4. Angular TestBed renders component
5. play() executes
6. Results reported

---

## Commands Reference

### test-runner
```bash
npm run storybook              # Start server
npm run test-storybook         # Run tests
npm run test-storybook:ci      # CI mode
```

### Pre-generation
```bash
npm run convert-stories              # Generate
npm run convert-stories:dry-run      # Preview
npm run convert-stories:force        # Regenerate
npm test                            # Run tests
```

### Plugin
```bash
npm run test:stories:plugin        # Run once
npm run test:stories:plugin:watch  # Watch mode
```

---

## Which Should You Choose?

### Choose **test-runner** if:
- You want official support
- Your team knows Storybook well
- You need production-ready solution
- You're okay with running server

### Choose **Pre-generation** if:
- You want to see/edit test files
- Debugging is critical
- You need full transparency
- You want to learn how it works

### Choose **Plugin** if:
- You want cleanest workflow
- Tests must always match stories
- You prefer clean git history
- You're comfortable with custom tools

---

## Performance Comparison

### Startup Time

**test-runner**: ⚠️ Slow (2-5 seconds)
- Must start server
- Must launch Playwright

**Pre-generation**: ✅ Fast (<1 second)
- Just run Vitest

**Plugin**: ✅ Fast (<1 second)
- Just run Vitest
- Transform on-the-fly is quick

### Test Execution

**test-runner**: ⚠️ Slower
- Runs in real browser
- Network overhead

**Pre-generation**: ✅ Faster
- Runs in jsdom/node
- No network

**Plugin**: ✅ Faster
- Runs in jsdom/node
- No network
- Plus transformation time (minimal)

---

## Summary Table

| Feature | test-runner | Pre-generation | Plugin |
|---------|-------------|----------------|--------|
| **Setup** | Easiest | Easy | Moderate |
| **Workflow** | Good | Good | Best |
| **Debugging** | Moderate | Best | Harder |
| **Git History** | Clean | Cluttered | Clean |
| **Customization** | None | Full | High |
| **Maintenance** | None | Some | Some |
| **Performance** | Slower | Faster | Fastest |
| **Transparency** | Low | High | Low |
| **Official** | Yes | No | No |

---

## Recommendation Matrix

### For Different Scenarios

**Production App**: test-runner
**Learning Project**: Pre-generation  
**Development Workflow**: Plugin  
**CI/CD**: test-runner or Plugin  
**Custom Needs**: Pre-generation  
**Quick Iteration**: Plugin  

---

## All Three Are Available!

You can use any approach in this repository:

1. **test-runner**: Already configured, `npm run storybook` + `npm run test-storybook`
2. **Pre-generation**: `npm run convert-stories`
3. **Plugin**: `npm run test:stories:plugin`

Try them all and choose what works best for your needs!

---

**Status**: All three approaches fully functional ✅  
**Documentation**: Complete for all three ✅  
**Choice**: Up to you! ✅

Each approach has been tested and proven to work. Pick the one that fits your workflow best! 🚀
