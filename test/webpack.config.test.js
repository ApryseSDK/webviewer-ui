const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const dist = path.resolve(__dirname, 'test/dist');
module.exports = {
  entry: './test.js',
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin([dist]),
    new HtmlWebpackPlugin({
      template: './test/index.html'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: dist,
    publicPath: '/'
  }
};