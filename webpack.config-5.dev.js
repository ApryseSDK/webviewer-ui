const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

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
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
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
                function findNestedWebComponents(tagName, root = document) {
                  const elements = [];

                  // Check direct children
                  root.querySelectorAll(tagName).forEach(el => elements.push(el));

                  // Check shadow DOMs
                  root.querySelectorAll('*').forEach(el => {
                    if (el.shadowRoot) {
                      elements.push(...findNestedWebComponents(tagName, el.shadowRoot));
                    }
                  });

                  return elements;
                }
                // If its the iframe we just append to the document head
                if (!window.isApryseWebViewerWebComponent) {
                  document.head.appendChild(styleTag);
                  return;
                }

                let webComponents;
                // First we see if the webcomponent is at the document level
                webComponents = document.getElementsByTagName('apryse-webviewer');
                // If not, we check have to check if it is nested in another webcomponent
                if (!webComponents.length) {
                  webComponents = findNestedWebComponents('apryse-webviewer');
                }
                // Now we append the style tag to each webcomponent
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
              },
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
          },
          'sass-loader',
        ],
        include: path.resolve(__dirname, 'src'),
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
