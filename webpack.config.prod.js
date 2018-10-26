const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'production',
	entry: [
		'babel-polyfill',
		path.resolve(__dirname, 'src')
	],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'webviewer-ui.min.js',
		publicPath: '/'
	},
	plugins: [
    new CopyWebpackPlugin([
			{
				from: './src/index.build.html',
				to: '../build/index.html'
			},
			{
				from: './i18n',
				to: '../build/i18n'
			},
			{
				from: './assets/pdftron.ico',
				to: '../build/assets/pdftron.ico'
			}
		]),
		new MiniCssExtractPlugin({
			filename: 'style.css',
    }),
		// new BundleAnalyzerPlugin()
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
					MiniCssExtractPlugin.loader,
					{ 
						loader: 'css-loader', 
						options: { minimize: true }
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [ require('autoprefixer')() ]
						}
					},
					'sass-loader'
				],
				include: path.resolve(__dirname, 'src')
			},
			{
				test: /\.svg$/,
				use: [
					'svg-inline-loader',
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