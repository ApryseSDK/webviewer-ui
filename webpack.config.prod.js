const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
let NodePolyfillPlugin;
try {
  NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
} catch (e) {
  console.warn('node-polyfill-webpack-plugin not installed; skipping polyfill.');
}

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env = {}) => {
  // Use --env UI_BUILD flag to determine which mini-css-extract-plugin to use
  // UI_BUILD flag means building from src/ui with webpack 5 (use local plugin v0.8.0)
  // Otherwise, building from root with webpack 4 (use root plugin ^0.4.4)
  console.log(`UI_BUILD=${env.UI_BUILD}`);
  const MiniCssExtractPlugin = env.UI_BUILD
    ? require('mini-css-extract-plugin')
    : require(require.resolve('mini-css-extract-plugin', { paths: [path.resolve(__dirname, '..')] }));

  const jsonpKey = env.UI_BUILD ? 'chunkLoadingGlobal' : 'jsonpFunction';

  return {
    mode: 'production',
    entry: path.resolve(__dirname, 'src'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'webviewer-ui.min.js',
      chunkFilename: 'chunks/[name].chunk.js',
      publicPath: './',
      [jsonpKey]: 'webpackJsonpWebViewerUI',
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: './src/index.core.html',
          to: '../build/index.html',
        },
        {
          from: './i18n',
          to: '../build/i18n',
        },
        {
          from: './assets',
          to: '../build/assets',
          ignore: ['icons/*.svg'],
        },
        {
          from: './src/configorigin.txt',
          to: '../build/configorigin.txt',
        },
      ]),
      ...(NodePolyfillPlugin ? [new NodePolyfillPlugin()] : []),
      new MiniCssExtractPlugin({
        filename: 'style.css',
        chunkFilename: 'chunks/[name].chunk.css',
      }),
      // new BundleAnalyzerPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
          ...(env.UI_BUILD ? { resolve: { fullySpecified: false } } : {}),
        },
        {
          test: /\.(js|mjs)$/,
          use: {
            loader: 'babel-loader',
            options: {
              ignore: [
                /\/core-js/,
              ],
              sourceType: 'unambiguous',
              presets: [
                '@babel/preset-react',
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 3,
                  },
                ],
              ],
              plugins: [
                '@babel/plugin-proposal-function-sent',
                '@babel/plugin-proposal-export-namespace-from',
                '@babel/plugin-proposal-numeric-separator',
                '@babel/plugin-proposal-throw-expressions',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-optional-chaining',
              ],
            },
          },
          include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
          exclude: function (modulePath) {
            return /node_modules/.test(modulePath) &&
              !(/node_modules[\\/](react-dnd|react-quill-new|quill-mention|quill)[\\/]/.test(modulePath));
          },
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [
                  require('postcss-import')({ root: loader.resourcePath }),
                  require('postcss-preset-env')({
                    features: {
                      'logical-properties-and-values': false, // ⛔ disable polyfill!
                    },
                  }),
                  require('cssnano')(),
                ],
              },
            },
            'sass-loader',
          ],
          include: path.resolve(__dirname, 'src'),
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
                // this is used to overwrite the publicPath that is specified in the output object,
                // to make the url of the fonts be relative to the minified style.css
                publicPath: './assets/fonts',
                outputPath: '/assets/fonts',
              },
            },
          ],
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
    optimization: {
      splitChunks: {
        automaticNameDelimiter: '.',
        minSize: 0,
      },
    },
    devtool: 'source-map',
  };
};

// Export the default config for direct require() usage (e.g., in karma, scripts)
// Webpack CLI will still use the function when running with --env flags
module.exports.default = module.exports
