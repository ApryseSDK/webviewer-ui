const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { styleLoaderOptions, createDevThemeRule } = require('./webpack.helpers');

module.exports = {
  name: 'ui',
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: [
    'webpack-hot-middleware/client?name=ui&path=/__webpack_hmr&noInfo=true',
    path.resolve(__dirname, 'src'),
  ],
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: 'webviewer-ui.min.js',
    chunkFilename: 'chunks/[name].chunk.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new NodePolyfillPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                  importSource: '@emotion/react',
                },
              ],
              ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
            ],
            plugins: [
              'react-hot-loader/babel',
              '@babel/plugin-proposal-function-sent',
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-numeric-separator',
              '@babel/plugin-proposal-throw-expressions',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-optional-chaining',
              require.resolve('@emotion/babel-plugin'),
            ],
          },
        },
        include: [path.resolve(__dirname, 'src')],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: styleLoaderOptions,
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'src/components/App/'),
      },
      {
        test: /\.scss$/,
        oneOf: [
          createDevThemeRule(/theme-light-high-contrast/, 'light-high-contrast', 'highContrastLight.scss', path),
          createDevThemeRule(/theme-dark-high-contrast/, 'dark-high-contrast', 'highContrastDark.scss', path),
          createDevThemeRule(/theme-light-modular/, 'light-modular', 'lightWCAG.scss', path),
          createDevThemeRule(/theme-dark-modular/, 'dark-modular', 'darkWCAG.scss', path),
          createDevThemeRule(/theme-light/, 'light', 'light.scss', path),
          createDevThemeRule(/theme-dark/, 'dark', 'dark.scss', path),
          createDevThemeRule(undefined, 'light', 'light.scss', path),
        ],
        include: path.resolve(__dirname, 'src/components/App/'),
      },
      {
        test: /\.svg$/,
        type: 'asset/source',
      },
      {
        test: /\.woff(2)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
      components: path.resolve(__dirname, 'src/components/'),
      constants: path.resolve(__dirname, 'src/constants/'),
      helpers: path.resolve(__dirname, 'src/helpers/'),
      hooks: path.resolve(__dirname, 'src/hooks/'),
      actions: path.resolve(__dirname, 'src/redux/actions/'),
      reducers: path.resolve(__dirname, 'src/redux/reducers/'),
      selectors: path.resolve(__dirname, 'src/redux/selectors/'),
      core: path.resolve(__dirname, 'src/core/'),
    },
  },
};
