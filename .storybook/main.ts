import type { StorybookConfig } from '@analogjs/storybook-angular';

const config: StorybookConfig = {
  stories: ['../projects/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-vitest'],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {},
  },
};

export default config;
