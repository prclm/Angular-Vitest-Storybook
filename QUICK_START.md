# Quick Start: Running Storybook Story Tests

## TL;DR

```bash
# Terminal 1: Start Storybook
npm run storybook

# Terminal 2: Run story tests
npm run test-storybook -- --url http://localhost:6006
```

## What This Does

Runs your Storybook stories' `play()` functions as automated tests in a real browser.

## Example Story with Test

```typescript
// button.stories.ts
import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, within } from '@storybook/test';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Components/Button',
  component: Button,
  render: (args) => ({ props: args }),
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    label: 'Button',
    primary: true,
  },
  // This play() function becomes an automated test!
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // These assertions run automatically
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Button');
  },
};
```

## What You Get

✅ **Visual Testing** - Components render in real browser  
✅ **Interaction Testing** - Test user interactions  
✅ **Accessibility Testing** - Query by role, label, etc.  
✅ **CI/CD Ready** - Run in automated pipelines  
✅ **Zero Setup** - Tests defined right in stories  

## Output

```bash
$ npm run test-storybook -- --url http://localhost:6006

 PASS   browser: chromium  button.stories.ts
  Components/Button
    Primary
      ✓ play-test (535 ms)
    Secondary
      ✓ play-test (612 ms)
    Large
      ✓ play-test (489 ms)
    Small
      ✓ play-test (523 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

## The "Trick" Explained

See **THE_TRICK.md** for the complete technical explanation of how this works.

**Short version:**
1. @storybook/test-runner discovers your stories
2. Launches Playwright browser
3. Navigates to each story in Storybook
4. Waits for component to render
5. Executes the play() function
6. Reports test results

## Why This Approach?

**Advantages:**
- ✅ Tests run in real browser (not JSDOM)
- ✅ Same stories used for documentation AND testing
- ✅ Visual regression testing possible
- ✅ Works with Angular standalone components
- ✅ No separate test files needed

**Perfect for:**
- Component interaction testing
- Visual validation
- Accessibility testing
- Integration with design systems
- Documentation that's also tested

## Common Commands

### Development
```bash
# Start Storybook
npm run storybook

# Run tests
npm run test-storybook -- --url http://localhost:6006

# Watch mode (re-run on changes)
npm run test-storybook -- --url http://localhost:6006 --watch
```

### CI/CD
```bash
# Start Storybook in background and run tests
npm run storybook &
sleep 10  # Wait for Storybook to start
npm run test-storybook -- --url http://localhost:6006
```

### Configuration
```bash
# Use different port
npm run test-storybook -- --url http://localhost:9009

# Run specific story
npm run test-storybook -- --url http://localhost:6006 --grep "Primary"

# Headless mode (default)
npm run test-storybook -- --url http://localhost:6006

# Headed mode (see browser)
npm run test-storybook -- --url http://localhost:6006 --no-headless
```

## Troubleshooting

### "Storybook instance is not running"
Make sure Storybook is running first:
```bash
npm run storybook
```
Then in another terminal:
```bash
npm run test-storybook -- --url http://localhost:6006
```

### Tests timeout
Increase timeout in `.storybook/test-runner-config.js`:
```javascript
module.exports = {
  async preVisit(page) {
    await page.waitForTimeout(1000); // Wait for story to load
  },
};
```

### Need more examples?
Check the Button component stories:
- `projects/shared-lib/src/lib/button/button.stories.ts`

## Next Steps

1. **Read THE_TRICK.md** - Understand how it all works
2. **Add play() functions** - To your existing stories
3. **Run tests** - See them execute in browser
4. **Add to CI/CD** - Automate story testing

## Documentation

- **THE_TRICK.md** - Complete technical explanation
- **SOLUTION_SUMMARY.md** - High-level overview
- **FINAL_SUMMARY.md** - Investigation and solution paths

## Status

✅ **Fully Working** - Storybook renders Angular 21 standalone components and runs play() functions as tests in real browser via @storybook/test-runner.

---

**Need help?** See the comprehensive documentation or check existing story examples.
