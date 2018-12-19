const fs = require('fs');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const ip = require('ip');
const opn = require('opn');

const app = express();
const config = require('./webpack.config.test.js');
const compiler = webpack(config);

app.use(devMiddleware(compiler, {
	publicPath: config.output.publicPath
}));
app.use('/lib', express.static(path.resolve(__dirname, '../../')));
app.use('/samples', express.static(path.resolve(__dirname, '../../../samples')));
// app.use('/test', express.static(path.resolve(__dirname, './')));

app.listen(3000, '0.0.0.0', err => {
	if (err) {
		console.error(err);
	} else {
		console.info(`Listening at localhost:3000 (http://${ip.address()}:3000)`);
		opn('http://localhost:3000');
	}
});