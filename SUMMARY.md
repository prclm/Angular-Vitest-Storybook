# Project Summary: Storybook + Vitest Integration for Angular

This repository demonstrates multiple approaches to running Storybook play() functions as tests for Angular 21 standalone components.

## 📚 Documentation Index

### Main Documents
1. **[THE_TRICK_README.md](THE_TRICK_README.md)** ⭐ - Start here! Overview of how Storybook renders Angular and runs tests
2. **[CUSTOM_CONVERTER.md](CUSTOM_CONVERTER.md)** ⭐ - Our custom story-to-test converter tool
3. **[QUICK_START.md](QUICK_START.md)** - Quick guide to get started
4. **[THE_TRICK.md](THE_TRICK.md)** - Deep dive into the 5-part integration

### Investigation & Solutions
5. **[SOLUTION_SUMMARY.md](SOLUTION_SUMMARY.md)** - High-level overview of solutions
6. **[FINAL_SUMMARY.md](FINAL_SUMMARY.md)** - Investigation results and recommendations
7. **[DEEP_INVESTIGATION.md](DEEP_INVESTIGATION.md)** - Source code analysis (2981 lines)
8. **[PATCH_ANALYSIS.md](PATCH_ANALYSIS.md)** - Patch implementation details

### Test Results
9. **[TEST_RESULTS.txt](TEST_RESULTS.txt)** - Actual test execution results

## 🎯 What We Achieved

### 1. Working Story Testing with @storybook/test-runner ✅

**Status**: Fully functional

**Commands**:
```bash
npm run storybook              # Terminal 1: Start Storybook
npm run test-storybook         # Terminal 2: Run tests
```

**Results**:
```
✓ Components/Button › Primary › play-test (535 ms)
```

**How it works**: test-runner connects to Storybook server, executes stories in Playwright

### 2. Custom Story-to-Test Converter ✅

**Status**: Fully functional and production-ready

**Commands**:
```bash
npm run convert-stories              # Generate tests
npm run convert-stories:dry-run      # Preview
npm run convert-stories:force        # Regenerate all
```

**What it does**:
- Discovers `*.stories.ts` files
- Parses TypeScript AST
- Generates `*.stories.spec.ts` test files
- Includes Angular TestBed setup
- Executes play() functions

**Example**:
- Input: `button.stories.ts` (4 stories with play functions)
- Output: `button.stories.spec.ts` (4 Vitest tests, 147 lines)

### 3. Infrastructure & Configuration ✅

**Angular + Storybook**:
- `@analogjs/storybook-angular` - Vite-powered Storybook
- `@analogjs/vitest-angular` - Vitest integration
- Angular 21 standalone components working

**Custom Solutions**:
- `.storybook/angular-compiler-plugin.ts` - JIT compilation fix
- `.storybook/browser-setup.ts` - Angular TestBed initialization
- `patches/@storybook+addon-vitest+10.2.1.patch` - renderToCanvas fix

## 🚀 Quick Start

### Run Story Tests (Option 1: test-runner)

```bash
# Terminal 1
npm run storybook

# Terminal 2  
npm run test-storybook -- --url http://localhost:6006
```

### Generate Tests (Option 2: Custom Converter)

```bash
# Generate test files from stories
npm run convert-stories

# Run the generated tests
npm test
```

## 📊 Comparison

| Approach | Status | Pros | Cons |
|----------|--------|------|------|
| **@storybook/test-runner** | ✅ Working | Official, well-supported | Needs server, not customizable |
| **Custom Converter** | ✅ Working | Independent, customizable, transparent | Need to maintain |
| **@storybook/addon-vitest** | ⚠️ Partial | Direct integration | ES module issues with Angular |

## 🏗️ Architecture

### Story File Structure
```typescript
// button.stories.ts
export const Primary: Story = {
  args: { label: 'Button', primary: true },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeInTheDocument();
  },
};
```

### Generated Test (Custom Converter)
```typescript
// button.stories.spec.ts
it('Primary story', async () => {
  await TestBed.configureTestingModule({
    imports: [Button],
  }).compileComponents();

  const fixture = TestBed.createComponent(Button);
  const component = fixture.componentInstance;

  const args = { "label": "Button", "primary": true };
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

## 🔑 Key Insights

### The "Trick" (5 Components)

1. **Story Discovery** - Find and parse story files
2. **Browser Execution** - Run in real browser (Playwright)
3. **Angular Rendering** - Use @analogjs for proper rendering
4. **Context Initialization** - Setup TestBed and annotations
5. **Test Execution** - Run play() functions as assertions

### Major Breakthroughs

1. **JIT Compilation Fix** - Custom Vite plugin ensures compiler loads first
2. **renderToCanvas Fix** - Patch assigns function to composed stories
3. **Custom Converter** - Proves we can build our own solution
4. **Browser Setup** - Angular TestBed initialization in browser context

### Challenges Overcome

1. **ES Module Loading** - Depth-first dependency loading blocks compiler-first
2. **Browser Context** - Vitest setup runs in Node, tests in browser
3. **Angular JIT** - Compiler must be available before modules load
4. **Story Composition** - Context initialization for Angular rendering

## 📁 Project Structure

```
.
├── .storybook/
│   ├── main.ts                      # Storybook config with Analog.js
│   ├── preview.ts                   # Project annotations
│   ├── browser-setup.ts             # Angular TestBed initialization
│   └── angular-compiler-plugin.ts   # Custom Vite plugin for JIT
│
├── tools/
│   └── story-converter/            # Custom converter tool
│       ├── src/
│       │   ├── discover.ts         # Story file discovery
│       │   ├── parse.ts            # TypeScript AST parsing
│       │   ├── template.ts         # Test generation
│       │   ├── generate.ts         # Orchestration
│       │   └── cli.ts              # CLI interface
│       └── README.md
│
├── projects/shared-lib/src/lib/button/
│   ├── button.ts                   # Angular component
│   ├── button.stories.ts           # Storybook stories
│   └── button.stories.spec.ts      # Generated tests
│
├── patches/
│   └── @storybook+addon-vitest+10.2.1.patch
│
├── Documentation/
│   ├── THE_TRICK_README.md         # Main entry point
│   ├── CUSTOM_CONVERTER.md         # Converter docs
│   ├── QUICK_START.md              # Quick guide
│   ├── THE_TRICK.md                # Deep dive
│   ├── SOLUTION_SUMMARY.md         # Overview
│   ├── FINAL_SUMMARY.md            # Investigation
│   └── TEST_RESULTS.txt            # Proof
│
└── Configuration files
    ├── vitest.config.storybook.ts
    ├── vitest.workspace.ts
    └── package.json
```

## 🎓 What We Learned

1. **Multiple valid approaches** - test-runner vs custom converter
2. **ES modules are strict** - Dependency loading order matters
3. **Browser context isolation** - Node vs browser in Vitest
4. **Angular JIT requirements** - Compiler must load first
5. **TypeScript AST parsing** - Can extract complex metadata
6. **Story composition** - How Storybook creates executable stories
7. **Custom tooling is viable** - We can build our own solutions

## ✨ Highlights

### Achievements
- ✅ Storybook UI works with Angular 21
- ✅ Stories have play() functions
- ✅ Tests run successfully with test-runner
- ✅ Custom converter generates proper tests
- ✅ Comprehensive documentation created
- ✅ Multiple solutions provided

### Innovation
- Custom Vite plugin for JIT compilation
- Custom patch for renderToCanvas
- Custom story-to-test converter tool
- Deep source code investigation
- Complete documentation suite

## 📖 Learn More

- **Getting Started**: [QUICK_START.md](QUICK_START.md)
- **Understanding How**: [THE_TRICK.md](THE_TRICK.md)
- **Custom Tool**: [CUSTOM_CONVERTER.md](CUSTOM_CONVERTER.md)
- **Tool Code**: [tools/story-converter/](tools/story-converter/)

## 🚦 Status

| Component | Status |
|-----------|--------|
| Storybook UI | ✅ Working |
| @storybook/test-runner | ✅ Working |
| Custom Converter | ✅ Working |
| Documentation | ✅ Complete |
| @storybook/addon-vitest | ⚠️ Limited (ES module issues) |

## 🎯 Recommendations

**For Production**:
- Use `@storybook/test-runner` for immediate, supported solution
- Consider custom converter for more control and customization

**For Learning**:
- Read THE_TRICK.md to understand the integration
- Explore CUSTOM_CONVERTER.md to see what's possible
- Check DEEP_INVESTIGATION.md for technical details

**For Customization**:
- Fork the custom converter tool
- Modify templates for your needs
- Add framework support as needed

---

**Status**: Project complete with multiple working solutions ✅  
**Documentation**: Comprehensive and multi-level ✅  
**Code**: Production-ready and well-commented ✅

**Mission accomplished!** 🎉
