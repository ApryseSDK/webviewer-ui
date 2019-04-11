const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const ip = require('ip');
const opn = require('opn');
const superagent = require('superagent');
const app = express();
const compiler = webpack(config);
const admZip = require('adm-zip');

const STATIC_FOLDER = path.resolve(__dirname, './static');
const DOWNLOAD_ADDRESS = 'https://www.pdftron.com/downloads/WebViewer.zip';

const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const RESET = '\x1b[0m';

(async () => {
  
  if (!fs.existsSync(path.resolve(STATIC_FOLDER, './lib'))) {
    try {
      /*eslint-disable */
      console.log(MAGENTA, `\nDownloading core dependencies...`, RESET);
      fs.ensureDirSync(STATIC_FOLDER);
      const zipOutput = path.resolve(__dirname, './static/webviewer.zip');
      // fetch zip
      await new Promise(resolve => {
        superagent
          .get(DOWNLOAD_ADDRESS)
          .pipe(fs.createWriteStream(zipOutput))
          .on('finish', () => {
            resolve();
          });
      });
      console.log(GREEN, `Done`, RESET);
  
      console.log(MAGENTA, `\nExtracting dependencies...`, RESET);
      // extract zip and cleanup
      const zip = new admZip(zipOutput);
      zip.extractAllTo(STATIC_FOLDER, true);
      console.log(GREEN, `Done`, RESET);
  
      console.log(MAGENTA, `\nCleaning up...`, RESET);
      fs.removeSync(zipOutput);
      fs.copySync(path.resolve(__dirname, './static/WebViewer/lib'), path.resolve(__dirname, './static/lib'));
      fs.removeSync(path.resolve(__dirname, './static/WebViewer'));
      console.log(GREEN, `\nDone. Assets have been downloaded into`, MAGENTA, `./static/lib`, RESET);
    } catch (e) {
      console.log(MAGENTA, `\nFailed to download and/or extract dependencies. Please make sure you have an internet connection and try again.`, RESET);
    }
  }

  app.use(devMiddleware(compiler, {
    logLevel: 'warn',
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    }
  }));
  app.use(hotMiddleware(compiler));
  
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  
  app.use('/i18n', express.static(path.resolve(__dirname, 'i18n')));
  app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
  app.use('/mime', express.static(path.resolve(__dirname, 'mime')));
  app.use('/core', express.static(path.resolve(__dirname, './static/lib/core')));
  app.use('/files', express.static(path.resolve(__dirname, './static/files')));
  
  const handleAnnotation = (req, res, handler) => {
    const dir = path.resolve(__dirname, 'annotations');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  
    handler(dir);
    res.end();
  };
  
  app.get('/annotations', (req, res) => {
    handleAnnotation(req, res, dir => {
      const xfdfFile = (req.query.did) ? path.resolve(dir, req.query.did + '.xfdf') : path.resolve(dir, 'default.xfdf');
      if (fs.existsSync(xfdfFile)) {
        res.header('Content-Type', 'text/xml');
        res.send(fs.readFileSync(xfdfFile));
      } else {
        res.status(204);
      }
    });
  });
  
  app.post('/annotations', (req, res) => {
    handleAnnotation(req, res, dir => {
      const xfdfFile = (req.body.did) ? path.resolve(dir, req.body.did + '.xfdf') : path.resolve(dir, 'default.xfdf');
      try {
        res.send(fs.writeFileSync(xfdfFile, req.body.data));
      } catch (e) {
        res.status(500);
      }
    });
    res.end();
  });
  
  app.get('/license-key.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, './license-key.js'));
  });
  
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'src/index.html'));
  });
  
  app.get('/mobile', (req, res) => {
    res.redirect(`/#d=/files/webviewer-demo-annotated.xod&a=1`);
  });
  
  app.listen(3000, '0.0.0.0', err => {
    if(err) {
      console.error(err);
    } else {
      /*eslint-disable */
      console.log(CYAN, `\nListening at localhost:3000 (http://${ip.address()}:3000)`, RESET);
      opn('http://localhost:3000/#d=/files/webviewer-demo-annotated.xod&a=1');
    }
  });
})();

