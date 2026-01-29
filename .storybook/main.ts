import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../projects/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
