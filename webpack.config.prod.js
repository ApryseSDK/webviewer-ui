const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'webviewer-ui.min.js',
    chunkFilename: 'chunks/[name].chunk.js',
    publicPath: './',
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
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: 'chunks/[name].chunk.css'
    }),
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
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
        include: [path.resolve(__dirname, 'src')],
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
              plugins: loader => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-preset-env')(),
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
};
