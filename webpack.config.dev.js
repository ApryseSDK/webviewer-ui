const path = require('path');
const webpack = require('webpack');

module.exports = {
  name: 'ui',
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?name=ui&path=/__webpack_hmr',
    '@babel/polyfill',
    path.resolve(__dirname, 'src')
  ],
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: 'webviewer-ui.min.js',
    publicPath: '/'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-function-sent',
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-numeric-separator',
              '@babel/plugin-proposal-throw-expressions',
              '@babel/plugin-proposal-class-properties'
            ]
          }
        },
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'webviewer/apis')
        ]
      },
      {
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
                require('cssnano')()
              ]
            }
          },
          'sass-loader'
        ],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.svg$/,
        use: ['svg-inline-loader']
      }
    ]
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
      components: path.resolve(__dirname, 'src/components/'),
      constants: path.resolve(__dirname, 'src/constants/'),
      helpers: path.resolve(__dirname, 'src/helpers/'),
      actions: path.resolve(__dirname, 'src/redux/actions/'),
      reducers: path.resolve(__dirname, 'src/redux/reducers/'),
      selectors: path.resolve(__dirname, 'src/redux/selectors/'),
      core: path.resolve(__dirname, 'src/core/')
    }
  }
};
