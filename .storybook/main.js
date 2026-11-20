module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['./static'],

  addons: [
    "@storybook/addon-links",
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    'storybook-addon-pseudo-states',
    'storybook-addon-rtl',
    '@storybook/addon-vitest'
  ],

  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    const { createUiViteCompatibilityConfig } = await import('../vite.ui-shared.js');

    return mergeConfig(config, {
      ...createUiViteCompatibilityConfig(),
      build: {
        cssMinify: 'esbuild',
      },
    });
  },

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  docs: {},

  features: {
    viewport: true,
    experimentalReview: true
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
};
