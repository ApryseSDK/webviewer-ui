const path = require('path');
const os = require('os');
const fs = require('fs');
const http = require('http');
const express = require('express');
const open = require('open');
const { createServer: createViteServer } = require('vite');

const uiRoot = __dirname;
const generatedCorePath = path.resolve(uiRoot, '../../build/core');
const installedCorePath = path.resolve(uiRoot, 'lib/core');
const generatedCoreMiddleware = express.static(generatedCorePath);
const installedCoreMiddleware = express.static(installedCorePath);

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

const sampleURL = encodeURIComponent(JSON.stringify('https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'));

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const vite = await createViteServer({
    configFile: path.resolve(uiRoot, 'vite.ui-hmr.config.js'),
    server: {
      middlewareMode: true,
      hmr: { server },
    },
  });

  app.use('/i18n', express.static(path.resolve(uiRoot, 'i18n')));
  app.use('/assets', express.static(path.resolve(uiRoot, 'assets')));
  app.use('/core', (req, res, next) => {
    const coreMiddleware = fs.existsSync(path.join(generatedCorePath, 'webviewer-core.min.js'))
      ? generatedCoreMiddleware
      : installedCoreMiddleware;
    coreMiddleware(req, res, next);
  });

  app.get('/', async (req, res, next) => {
    try {
      let template = fs.readFileSync(path.resolve(uiRoot, 'src/index.html'), 'utf8');
      template = template.replace(/\s*<link[^>]*rel="stylesheet"[^>]*href="style\.css"[^>]*>/i, '');
      template = template.replace(/\s*<script type="module" src="core\/webviewer-core\.min\.js"><\/script>/, '');
      template = template.replace(
        /<script type="module" src="webviewer-ui\.min\.js"><\/script>/,
        '<script type="module" src="/src/ui/src/index.js"></script>',
      );
      let html = await vite.transformIndexHtml('/', template);
      html = html.replace(
        '<script type="module" src="/src/ui/src/index.js"></script>',
        '<script type="module" src="/core/webviewer-core.min.js"></script>\n  <script type="module" src="/src/ui/src/index.js"></script>',
      );
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      next(error);
    }
  });

  app.get('/sample-url', (req, res) => {
    res.redirect(`/#d=${sampleURL}&a=1`);
  });

  app.use(vite.middlewares);

  server.listen(3000, '0.0.0.0', () => {
    // eslint-disable-next-line
    console.info(`Listening at localhost:3000 (http://${getLocalIpAddress()}:3000)`);
    open(`http://localhost:3000/#d=${sampleURL}&a=1`);
  });

  server.on('error', console.error);
}

startServer().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
