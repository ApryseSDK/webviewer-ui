const path = require('path');
const webpack = require('webpack');
const { postCssLoader, styleLoaderOptions, createDevThemeRule } = require('./webpack.helpers');

module.exports = {
  name: 'ui',
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
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
  plugins: [new webpack.HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        use: [],
      },
      {
        test: /\.(js|jsx|mjs)$/,
        use: {
          loader: 'babel-loader',
          options: {
            ignore: [
              /\/core-js/,
            ],
            sourceType: 'unambiguous',
            presets: [
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                  importSource: '@emotion/react',
                },
              ],
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
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
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/react-quill-new'),
          path.resolve(__dirname, 'node_modules/quill-mention'),
          path.resolve(__dirname, 'node_modules/quill'),
          path.resolve(__dirname, 'node_modules/react-error-boundary'),
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: styleLoaderOptions,
          },
          'css-loader',
          postCssLoader,
          'sass-loader',
        ],
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'src/components/App/'),
      },
      {
        test: /\.scss$/,
        oneOf: [
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
        use: ['svg-inline-loader'],
      },
      {
        test: /\.woff(2)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
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
