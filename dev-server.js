const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const ip = require('ip');
const opn = require('opn');

const app = express();
const compiler = webpack(config);

app.use(
  devMiddleware(compiler, {
    logLevel: 'warn',
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
    },
  })
);
app.use(hotMiddleware(compiler));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/i18n', express.static(path.resolve(__dirname, 'i18n')));
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
app.use('/core', express.static(path.resolve(__dirname, 'lib/core')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src/index.html'));
});

app.get('/sample-url', (req, res) => {
  res.redirect(
    `/#d=https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf&a=1`
  );
});

app.listen(3000, '0.0.0.0', err => {
  if (err) {
    console.error(err);
  } else {
    // eslint-disable-next-line
    console.info(`Listening at localhost:3000 (http://${ip.address()}:3000)`);
    opn(
      'http://localhost:3000/#d=https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf&a=1'
    );
  }
});
