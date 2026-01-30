const { parseStoryFile } = require('./dist/parse');

const metadata = parseStoryFile('/home/runner/work/Angular-Vitest-Storybook/Angular-Vitest-Storybook/projects/shared-lib/src/lib/button/button.stories.ts');
console.log('Metadata:', JSON.stringify(metadata, null, 2));
