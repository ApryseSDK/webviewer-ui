const path = require('path');
const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const open = require('open');
const config = require('./webpack.config-5.dev');

const app = express();
const compiler = webpack(config);

const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();

  for (const addresses of Object.values(interfaces)) {
    if (!addresses) {
      continue;
    }

    const networkAddress = addresses.find(({ family, internal }) => !internal && (family === 'IPv4' || family === 4));

    if (networkAddress) {
      return networkAddress.address;
    }
  }

  return '127.0.0.1';
};

app.use(
  devMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }),
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

const sampleURL = encodeURIComponent(JSON.stringify('https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'));

app.get('/sample-url', (req, res) => {

  res.redirect(
    `/#d=${sampleURL}&a=1`,
  );
});

const server = app.listen(3000, '0.0.0.0', () => {
  // eslint-disable-next-line
  console.info(`Listening at localhost:3000 (http://${getLocalIpAddress()}:3000)`);
  open(
    `http://localhost:3000/#d=${sampleURL}&a=1`,
  );
});

server.on('error', console.error);
