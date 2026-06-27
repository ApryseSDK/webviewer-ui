const path = require('path');
const esbuild = require('esbuild');
const { polyfillNode } = require('esbuild-plugin-polyfill-node');
const { sassPlugin } = require('esbuild-sass-plugin');
const postcss = require('postcss');
const fs = require('fs');

const flags = ['import', 'global-builtin', 'slash-div'];

// Map query strings to theme SCSS file and data-theme attribute value
const themeQueryMap = {
  'theme-light': { stylesheet: 'light.scss', dataTheme: 'light' },
  'theme-dark': { stylesheet: 'dark.scss', dataTheme: 'dark' },
  'theme-light-modular': { stylesheet: 'lightWCAG.scss', dataTheme: 'light-modular' },
  'theme-dark-modular': { stylesheet: 'darkWCAG.scss', dataTheme: 'dark-modular' },
};

// PostCSS plugin that adds :host alongside :root for shadow DOM compatibility
const postcssAddHost = {
  postcssPlugin: 'postcss-add-host',
  Rule(rule) {
    if (/^:root\b/.test(rule.selector)) {
      const clonedRule = rule.clone();
      clonedRule.selector = rule.selector.replace(/^:root\b/gm, ':host');
      rule.parent.insertAfter(rule, clonedRule);
    }
  },
};

/**
 * Add :host selectors alongside :root in compiled CSS for shadow DOM compatibility.
 */
const addHostSelectors = (css) => {
  const result = postcss([postcssAddHost]).process(css, { from: undefined });
  return result.css;
};

// Plugin to process SVG files similar to svg-inline-loader
// Removes width/height attributes so CSS can control the size
const svgInlinePlugin = () => ({
  name: 'svg-inline',
  setup(build) {
    build.onLoad({ filter: /\.svg$/ }, async (args) => {
      const svgContent = await fs.promises.readFile(args.path, 'utf8');

      let processedSvg = svgContent
        .replace(/(<svg[^>]*)\s+width="[^"]*"/i, '$1')
        .replace(/(<svg[^>]*)\s+height="[^"]*"/i, '$1');

      return {
        contents: `export default ${JSON.stringify(processedSvg)}`,
        loader: 'js',
      };
    });
  },
});

/**
 * Compile an SCSS string using the sass compiler with standard load paths.
 */
const compileSass = async (scssContent, filePath, uiBasePath) => {
  const sassModule = await import('sass');
  const sass = sassModule.default || sassModule;
  const result = sass.compileString(scssContent, {
    loadPaths: [
      path.dirname(filePath),
      path.resolve(uiBasePath, 'src'),
      path.resolve(uiBasePath, 'src/constants'),
      path.resolve(uiBasePath, 'src/components'),
    ],
    silenceDeprecations: flags,
  });
  return result.css;
};

const matchesIgnorePattern = (relativePath, ignorePattern) => {
  const normalizedPath = relativePath.split(path.sep).join('/');
  const normalizedPattern = ignorePattern.split(path.sep).join('/');

  if (!normalizedPattern.includes('*')) {
    return normalizedPath === normalizedPattern;
  }

  const escapedPattern = normalizedPattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '[^/]*');
  return new RegExp(`^${escapedPattern}$`).test(normalizedPath);
};

const shouldIgnore = (relativePath, ignore = []) => {
  return ignore.some((pattern) => matchesIgnorePattern(relativePath, pattern));
};

const copyRecursive = async (from, to, ignore = [], base = from) => {
  if (!fs.existsSync(from)) {
    return;
  }

  const stat = await fs.promises.stat(from);
  const relativePath = path.relative(base, from);

  if (relativePath && shouldIgnore(relativePath, ignore)) {
    return;
  }

  if (stat.isDirectory()) {
    await fs.promises.mkdir(to, { recursive: true });
    const entries = await fs.promises.readdir(from);
    await Promise.all(entries.map((entry) => copyRecursive(
      path.join(from, entry),
      path.join(to, entry),
      ignore,
      base,
    )));
    return;
  }

  await fs.promises.mkdir(path.dirname(to), { recursive: true });
  await fs.promises.copyFile(from, to);
};

const getCoreAssetsPath = (uiBasePath) => {
  const corePaths = [
    path.resolve(uiBasePath, 'lib/core'),
  ];

  return corePaths.find((corePath) => fs.existsSync(path.join(corePath, 'webviewer-core.min.js')));
};

// ── CSS Extraction approach ─────────────────────────────────────────────────
// Non-theme CSS is handled by esbuild-sass-plugin with type: 'css', which
// delegates to esbuild's native CSS loader. esbuild bundles and extracts CSS
// in correct import-graph order, producing webviewer-ui.min.css (renamed to
// style.css in onEnd).
//
// Theme CSS is still handled by the custom themeStylePlugin, writing separate
// chunk files to {outdir}/chunks/theme-{name}.chunk.css.

/**
 * Generate JS that inserts a <link> stylesheet element for a theme CSS chunk.
 * In WC mode, uses the __apryseInsertCss hook installed by webviewer-wc.js.
 * In iframe mode, appends to document.head.
 */
const generateThemeLinkInjection = (cssFileName, dataTheme) => {
  return `
(function() {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  // Resolve path relative to the current module's directory. We deliberately avoid
  // \`new URL('.', import.meta.url)\` because webpack 5's asset-module parser (used by
  // size-limit) treats the literal '.' as a static module specifier and fails with
  // "Can't resolve '.'". Slicing the URL string ourselves gives the same runtime value
  // without giving any bundler something to statically analyze.
  var u = (typeof import.meta !== 'undefined' && import.meta.url) || '';
  var base = u ? u.slice(0, u.lastIndexOf('/') + 1) : '';
  link.href = base + ${JSON.stringify(cssFileName)};
  link.setAttribute('data-theme', ${JSON.stringify(dataTheme)});

  if (window.__apryseInsertCss) {
    window.__apryseInsertCss(link, link.href);
  } else {
    document.head.appendChild(link);
  }
})();
`;
};

// Plugin to handle theme-aware SCSS imports for App.scss
// Supports query-string imports like App.scss?theme-dark (from setThemeHelper.js)
// and direct App.scss imports (from App.js) which default to light theme.
// Each theme variant:
//   1. Prepends the corresponding theme variable SCSS file
//   2. Compiles the combined SCSS
//   3. Adds :host alongside :root selectors for shadow DOM compatibility
//   4. Writes CSS to chunks/theme-{name}.chunk.css
//   5. Returns JS that creates a <link> element to load the CSS
const themeStylePlugin = (uiBasePath) => ({
  name: 'theme-style-loader',
  setup(build) {
    // Intercept .scss imports with ?theme-* query strings (dynamic imports from setThemeHelper.js)
    build.onResolve({ filter: /\.scss\?theme-/ }, (args) => {
      const [relPath, query] = args.path.split('?');
      const resolvedPath = path.resolve(path.dirname(args.importer), relPath);
      // Encode query in the path so esbuild treats each theme variant as a unique module
      return {
        path: `${resolvedPath}?${query}`,
        namespace: 'theme-scss',
        pluginData: { query, realPath: resolvedPath },
      };
    });

    // Intercept direct App.scss import from components/App/ (default to light theme)
    build.onResolve({ filter: /\.scss$/ }, (args) => {
      if (args.path.includes('?')) {
        return null;
      }
      const resolvedPath = path.resolve(path.dirname(args.importer), args.path);
      if (/components[\\/]App[\\/]App\.scss$/.test(resolvedPath)) {
        return {
          path: `${resolvedPath}?theme-light`,
          namespace: 'theme-scss',
          pluginData: { query: 'theme-light', realPath: resolvedPath },
        };
      }
      return null;
    });

    // Load and compile theme SCSS with the appropriate theme variables prepended
    build.onLoad({ filter: /.*/, namespace: 'theme-scss' }, async (args) => {
      const { query, realPath } = args.pluginData;
      const themeConfig = themeQueryMap[query];
      if (!themeConfig) {
        throw new Error(`Unknown theme query: ${query}`);
      }

      const scssContent = await fs.promises.readFile(realPath, 'utf8');

      // Prepend theme variables import (mirrors webpack sass-loader data option)
      const prependedContent = `@import '../../constants/${themeConfig.stylesheet}';\n${scssContent}`;

      let css = await compileSass(prependedContent, realPath, uiBasePath);

      // Add :host alongside :root for shadow DOM / web component compatibility
      css = addHostSelectors(css);

      // Write theme CSS to a chunk file
      const cssFileName = `theme-${themeConfig.dataTheme}.chunk.css`;
      const outDir = build.initialOptions.outdir || 'build/ui';
      const cssOutPath = path.resolve(outDir, 'chunks', cssFileName);
      await fs.promises.mkdir(path.dirname(cssOutPath), { recursive: true });
      await fs.promises.writeFile(cssOutPath, css);

      return {
        // The theme JS chunk lives in chunks/ alongside the CSS file,
        // so import.meta.url points to chunks/ and we use just the filename.
        contents: generateThemeLinkInjection(cssFileName, themeConfig.dataTheme),
        loader: 'js',
      };
    });
  },
});

const copyUiAssets = async ({ uiBasePath, buildPath, indexFile, copyCore = false }) => {

  const operations = [
    {
      from: path.join(uiBasePath, 'src', indexFile),
      to: path.join(buildPath, 'index.html'),
    },
    {
      from: path.join(uiBasePath, 'src/index.webcomponent.html'),
      to: path.join(buildPath, 'index-wc.html'),
    },
    {
      from: path.join(uiBasePath, 'i18n'),
      to: path.join(buildPath, 'i18n'),
    },
    {
      from: path.join(uiBasePath, 'assets'),
      to: path.join(buildPath, 'assets'),
      ignore: ['icons/*.svg'],
    },
    {
      from: path.join(uiBasePath, 'src/configorigin.txt'),
      to: path.join(buildPath, 'configorigin.txt'),
    },
  ];

  if (copyCore) {
    const coreAssetsPath = getCoreAssetsPath(uiBasePath);
    if (coreAssetsPath) {
      operations.push({
        from: coreAssetsPath,
        to: path.join(buildPath, 'core'),
      });
    }
  }

  for (const op of operations) {
    await copyRecursive(op.from, op.to, op.ignore);
  }
};

const getUiBuildConfig = (isProduction = false, options = {}) => {
  const uiBasePath = options.uiBasePath || __dirname;
  const buildPath = options.outdir || path.resolve(process.cwd(), 'build/ui');
  const isStandalone = Boolean(options.standalone);

  return {
    entryPoints: [path.join(uiBasePath, 'src/index.js')],
    outdir: buildPath,
    entryNames: 'webviewer-ui.min',
    chunkNames: 'chunks/[hash]',
    bundle: true,
    splitting: true,
    format: 'esm',
    target: 'es2020',
    sourcemap: isProduction,
    minify: isProduction,
    define: {
      global: 'globalThis',
      'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
    },
    jsx: 'automatic',
    jsxImportSource: '@emotion/react',
    loader: {
      '.js': 'jsx',
    },
    alias: {
      'react': path.resolve(uiBasePath, 'node_modules/react'),
      'react-dom': path.resolve(uiBasePath, 'node_modules/react-dom'),
      'react-virtualized': path.resolve(uiBasePath, 'node_modules/react-virtualized/dist/umd/react-virtualized.js'),
      'src': path.resolve(uiBasePath, 'src'),
      'components': path.resolve(uiBasePath, 'src/components'),
      'constants': path.resolve(uiBasePath, 'src/constants'),
      'helpers': path.resolve(uiBasePath, 'src/helpers'),
      'hooks': path.resolve(uiBasePath, 'src/hooks'),
      'actions': path.resolve(uiBasePath, 'src/redux/actions'),
      'reducers': path.resolve(uiBasePath, 'src/redux/reducers'),
      'selectors': path.resolve(uiBasePath, 'src/redux/selectors'),
      'core': path.resolve(uiBasePath, 'src/core'),
    },
    plugins: [
      polyfillNode({
        globals: {
          global: true,
          process: true,
          Buffer: true,
        },
      }),
      // Process SVG files to remove width/height attributes (mimics svg-inline-loader)
      svgInlinePlugin(),
      // Handle App.scss theme variants with query-string imports and data-theme attributes
      themeStylePlugin(uiBasePath),
      // Handle all other SCSS/CSS via esbuild-sass-plugin (uses esbuild's native CSS
      // loader for correct import-graph ordering, replacing custom CSS extraction)
      sassPlugin({
        type: 'css',
        loadPaths: [
          path.resolve(uiBasePath, 'src'),
          path.resolve(uiBasePath, 'src/constants'),
          path.resolve(uiBasePath, 'src/components'),
        ],
        silenceDeprecations: flags,
      }),
    ],
    onEnd: async () => {
      // esbuild-sass-plugin with type:'css' produces webviewer-ui.min.css
      // via esbuild's native CSS bundling. Rename to style.css to match
      // the <link> in index.html and the WC loader.
      const esbuildCss = path.resolve(buildPath, 'webviewer-ui.min.css');
      const targetCss = path.resolve(buildPath, 'style.css');
      try {
        await fs.promises.rename(esbuildCss, targetCss);
      } catch (e) {
        // CSS file may not exist if there are no style imports
      }
      await copyUiAssets({
        uiBasePath,
        buildPath,
        indexFile: isStandalone ? 'index.html' : 'index.core.html',
        copyCore: isStandalone,
      });
    },
  };
};

exports.getUiBuildConfig = getUiBuildConfig;

const runCli = async () => {
  const args = new Set(process.argv.slice(2));
  const isProduction = args.has('--production') || args.has('--prod');
  const uiConfig = getUiBuildConfig(isProduction, {
    standalone: true,
    outdir: path.resolve(__dirname, 'build'),
  });
  const onEndCallback = uiConfig.onEnd;
  delete uiConfig.onEnd;

  try {
    await esbuild.build(uiConfig);
    await onEndCallback?.();
    // eslint-disable-next-line no-console
    console.log(`WebViewer UI built with esbuild in ${path.relative(process.cwd(), uiConfig.outdir) || uiConfig.outdir}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  runCli();
}