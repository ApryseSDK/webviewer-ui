const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'babel-polyfill',
		'webpack-hot-middleware/client',
		path.resolve(__dirname, 'src')
	],
	output: {
		path: path.resolve(__dirname, 'src'),
		filename: 'webviewer-ui.min.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'webviewer/apis'),
				]
		  },
		  {
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [ require('autoprefixer')() ]
						}
					}
				],
				include: path.resolve(__dirname, 'src')
			},
			{
				test: /\.svg$/,
				use: [
					'svg-inline-loader'
				]
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
      core: path.resolve(__dirname, 'src/core/'),
    }
  }
};