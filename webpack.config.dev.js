const path = require('path');
const webpack = require('webpack');

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
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            ignore: [
              /\/core-js/,
            ],
            sourceType: "unambiguous",
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
              'react-hot-loader/babel',
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
          {
            loader: 'style-loader',
            options: {
              insert: function (styleTag) {
                const webComponents = document.getElementsByTagName('apryse-webviewer');
                if (webComponents.length > 0) {
                  const clonedStyleTags = [];
                  for (let i = 0; i < webComponents.length; i++) {
                    const webComponent = webComponents[i];
                    if (i === 0) {
                      webComponent.shadowRoot.appendChild(styleTag);
                      styleTag.onload = function () {
                        if (clonedStyleTags.length > 0) {
                          clonedStyleTags.forEach((styleNode) => {
                            // eslint-disable-next-line no-unsanitized/property
                            styleNode.innerHTML = styleTag.innerHTML;
                          });
                        }
                      };
                    } else {
                      const styleNode = styleTag.cloneNode(true);
                      webComponent.shadowRoot.appendChild(styleNode);
                      clonedStyleTags.push(styleNode);
                    }
                  }
                } else {
                  document.head.appendChild(styleTag);
                }
              },
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
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
