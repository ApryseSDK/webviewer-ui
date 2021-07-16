
const path = require('path');
const appDirectory = path.join(__dirname, '..');

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    const svgRule = config.module.rules.find((rule) => 'test.svg'.match(rule.test));
    svgRule.exclude = [ appDirectory ];

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: loader => [
              require('postcss-import')({ root: loader.resourcePath }),
              require('postcss-preset-env')(),
              require('cssnano')(),
            ],
          },
        },
        'sass-loader',
      ],
      include: path.resolve(__dirname, '../'),
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ['svg-inline-loader'],
      include: path.resolve(__dirname, '../'),
    });
    config.module.rules.push({
      test: /\.woff(2)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      ],
    });

    config.resolve.alias = {
      src: path.resolve(__dirname, '../src'),
      components: path.resolve(__dirname, '../src/components/'),
      constants: path.resolve(__dirname, '../src/constants/'),
      helpers: path.resolve(__dirname, '../src/helpers/'),
      hooks: path.resolve(__dirname, '../src/hooks/'),
      actions: path.resolve(__dirname, '../src/redux/actions/'),
      reducers: path.resolve(__dirname, '../src/redux/reducers/'),
      selectors: path.resolve(__dirname, '../src/redux/selectors/'),
      core: path.resolve(__dirname, '../src/core/'),
    }

    return config;
  },
}
