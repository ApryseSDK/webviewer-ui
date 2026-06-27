import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addHostPostcssPlugin = {
  postcssPlugin: 'postcss-add-host',
  Rule(rule) {
    if (/^:root\b/.test(rule.selector)) {
      const clonedRule = rule.clone();
      clonedRule.selector = rule.selector.replace(/^:root\b/gm, ':host');
      rule.parent.insertAfter(rule, clonedRule);
    }
  },
};
const addHostProcessor = postcss([addHostPostcssPlugin]);
const addHostToCSS = (css) => addHostProcessor.process(css, { from: undefined }).css;

const sassDeprecationFlags = [
  'import',
  'global-builtin',
  'slash-div',
];

const themeMap = {
  'theme-light': 'light.scss',
  'theme-dark': 'dark.scss',
  'theme-light-modular': 'lightWCAG.scss',
  'theme-dark-modular': 'darkWCAG.scss',
};

function themeSCSSPlugin() {
  const virtualToFile = new Map();

  return {
    name: 'theme-scss',
    enforce: 'pre',

    resolveId(source, importer) {
      if (!source.includes('.scss?theme-') || !importer) return null;
      const qIdx = source.indexOf('?');
      const relPath = source.slice(0, qIdx);
      const query = source.slice(qIdx + 1);
      if (!themeMap[query]) return null;
      const resolved = path.resolve(path.dirname(importer), relPath);
      const normalizedRelativePath = path.relative(__dirname, resolved).split(path.sep).join('/');
      const stablePathId = encodeURIComponent(normalizedRelativePath);
      const virtualId = `\0theme-style/${query}/${stablePathId}.js`;
      virtualToFile.set(virtualId, resolved);
      return virtualId;
    },

    async load(id) {
      if (!id.startsWith('\0theme-style/')) return null;
      const filePath = virtualToFile.get(id);
      const query = id.slice('\0theme-style/'.length).split('/')[0];
      const stylesheet = themeMap[query];
      if (!filePath || !stylesheet) return null;

      const scssContent = fs.readFileSync(filePath, 'utf8');
      const prepended = `@import '../../constants/${stylesheet}';\n${scssContent}`;

      const sassMod = await import('sass');
      const sass = sassMod.default || sassMod;
      const result = sass.compileString(prepended, {
        loadPaths: [
          path.dirname(filePath),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'src/constants'),
          path.resolve(__dirname, 'src/components'),
        ],
        silenceDeprecations: sassDeprecationFlags,
      });

      const dataTheme = query.replace('theme-', '');
      const cssWithHost = addHostToCSS(result.css);
      return {
        code: `
const style = document.createElement('style');
style.setAttribute('data-theme', ${JSON.stringify(dataTheme)});
style.textContent = ${JSON.stringify(cssWithHost)};
document.head.appendChild(style);
export default undefined;
`,
        map: null,
      };
    },
  };
}

function svgInlinePlugin() {
  return {
    name: 'svg-inline',
    enforce: 'pre',

    load(id) {
      const cleanId = id.split('?')[0];
      if (!cleanId.endsWith('.svg')) return null;
      try {
        let svg = fs.readFileSync(cleanId, 'utf8');
        svg = svg.replace(/(<svg[^>]*)\s+width="[^"]*"/i, '$1');
        svg = svg.replace(/(<svg[^>]*)\s+height="[^"]*"/i, '$1');
        return `export default ${JSON.stringify(svg)}`;
      } catch {
        return null;
      }
    },
  };
}

function cjsToEsmPlugin() {
  return {
    name: 'cjs-to-esm-index-helper',
    enforce: 'pre',

    transform(code, id) {
      if (!id.includes('src/ui/src/helpers/indexHelper.js') && !id.includes(String.raw`src\ui\src\helpers\indexHelper.js`)) {
        return null;
      }
      if (code.includes('/* cjsToEsm:indexHelper:applied */')) {
        return null;
      }
      const marker = '/* cjsToEsm:indexHelper:applied */\n';

      code = `import { createLogger as _createLogger } from 'redux-logger';\n` + code;
      code = code.replace(
        /const\s*\{\s*createLogger\s*\}\s*=\s*require\(\s*['"]redux-logger['"]\s*\)\s*;?/,
        'const { createLogger } = { createLogger: _createLogger };'
      );

      code = `import { composeWithDevTools as _composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';\n` + code;
      code = code.replace(
        /const\s*\{\s*composeWithDevTools\s*\}\s*=\s*require\(\s*['"]redux-devtools-extension\/logOnlyInProduction['"]\s*\)\s*;?/,
        'const { composeWithDevTools } = { composeWithDevTools: _composeWithDevTools };'
      );

      code = code.replace(
        /export\s+function\s+setupHotModuleReplacement\s*\([^)]*\)\s*\{[\s\S]*?\n\}/,
        'export function setupHotModuleReplacement() { /* handled by Vite Fast Refresh */ }'
      );

      code = code.replace(/process\.env\.NODE_ENV/g, '"development"');

      return { code: marker + code, map: null };
    },
  };
}

function applyIconGlobTransform(code, id, requireRe, globPath, replacement) {
  if (!requireRe.test(code)) {
    throw new Error(
      `[icon-glob] Expected dynamic require pattern not found in ${id}.`
    );
  }
  const globImport = `const __iconModules = import.meta.glob('${globPath}', { eager: true, query: '?raw', import: 'default' });\n`;
  code = globImport + code;
  code = code.replace(requireRe, replacement);
  return code;
}

function iconGlobPlugin() {
  return {
    name: 'icon-glob',
    enforce: 'pre',

    transform(code, id) {
      const isIcon = id.includes('components/Icon/Icon.js') || id.includes(String.raw`components\Icon\Icon.js`);
      const isRasterPrint = id.includes('helpers/rasterPrint.js') || id.includes(String.raw`helpers\rasterPrint.js`);

      if (!isIcon && !isRasterPrint) {
        return null;
      }

      if (isIcon) {
        code = applyIconGlobTransform(
          code,
          id,
          /require\(`\.\.\/\.\.\/\.\.\/assets\/icons\/\$\{this\.props\.glyph\}\.svg`\)/,
          '../../../assets/icons/*.svg',
          `__iconModules[\`../../../assets/icons/\${this.props.glyph}.svg\`]`
        );
      }

      if (isRasterPrint) {
        code = applyIconGlobTransform(
          code,
          id,
          /require\(`\.\.\/\.\.\/assets\/icons\/\$\{icon\}\.svg`\)/,
          '../../assets/icons/*.svg',
          `__iconModules[\`../../assets/icons/\${icon}.svg\`]`
        );
      }

      return { code, map: null };
    },
  };
}

function stripReactHotLoaderPlugin() {
  return {
    name: 'strip-react-hot-loader',
    enforce: 'pre',

    transform(code, id) {
      if (!id.includes('components/App/App.js') && !id.includes(String.raw`components\App\App.js`)) {
        return null;
      }
      code = code.replace(/^import\s*\{\s*hot\s*\}\s*from\s*['"]react-hot-loader\/root['"];?\s*\n/m, '');
      code = code.replace(/export\s+default\s+hot\s*\(\s*([A-Za-z_$][\w$]*)\s*\)\s*;?/, 'export default $1;');
      return { code, map: null };
    },
  };
}

function fastRefreshOptInPlugin() {
  const marker = '/* vite-plugin-react: @emotion/react/jsx-runtime */\n';
  return {
    name: 'fast-refresh-opt-in',
    enforce: 'pre',
    transform(code, id) {
      const [filepath] = id.split('?');
      if (!filepath.endsWith('.js')) return null;
      if (filepath.includes('/node_modules/')) return null;
      if (!filepath.includes('/src/ui/src/')) return null;
      if (code.includes('@emotion/react/jsx-runtime')) return null;
      return { code: marker + code, map: null };
    },
  };
}

function enumerateUiPackages() {
  const uiNm = path.resolve(__dirname, 'node_modules');
  const rootNm = path.resolve(__dirname, '../../node_modules');
  const aliases = {};
  const allNames = new Set();
  if (!fs.existsSync(uiNm)) return { aliases, allNames };

  const recordPackage = (name, uiPkgPath, rootPkgPath) => {
    if (!fs.existsSync(path.join(uiPkgPath, 'package.json'))) return;
    allNames.add(name);
    if (!fs.existsSync(path.join(rootPkgPath, 'package.json'))) {
      aliases[name] = uiPkgPath;
    }
  };

  const recordScope = (scope) => {
    const scopePath = path.join(uiNm, scope);
    let subs;
    try { subs = fs.readdirSync(scopePath); } catch { return; }
    for (const sub of subs) {
      if (sub.startsWith('.')) continue;
      recordPackage(`${scope}/${sub}`, path.join(scopePath, sub), path.join(rootNm, scope, sub));
    }
  };

  for (const entry of fs.readdirSync(uiNm)) {
    if (entry.startsWith('.')) continue;
    if (entry.startsWith('@')) {
      recordScope(entry);
    } else {
      recordPackage(entry, path.join(uiNm, entry), path.join(rootNm, entry));
    }
  }
  return { aliases, allNames };
}

const IMPORT_RE = /(?:from|import\s*\()\s*['"]([^'"]+)['"]/g;
const SOURCE_FILE_RE = /\.(?:jsx?|tsx?)$/;
const TEST_FILE_RE = /\.(?:stories|test|spec|test-helper)\.[jt]sx?$/;
const PATH_ALIAS_ROOTS = new Set([
  'src', 'components', 'constants', 'helpers', 'hooks',
  'actions', 'reducers', 'selectors', 'core',
]);

function specifierToPackageName(spec) {
  if (spec.startsWith('.') || spec.startsWith('/')) return null;
  const parts = spec.split('/');
  if (PATH_ALIAS_ROOTS.has(parts[0])) return null;
  return parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
}

function collectImportsFromFile(filePath, into) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch { return; }
  IMPORT_RE.lastIndex = 0;
  let m;
  while ((m = IMPORT_RE.exec(content)) !== null) {
    const pkg = specifierToPackageName(m[1]);
    if (pkg) into.add(pkg);
  }
}

function collectImportedPackages() {
  const result = new Set();
  const stack = [path.resolve(__dirname, 'src')];
  while (stack.length > 0) {
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'node_modules' && !e.name.startsWith('.')) stack.push(p);
      } else if (SOURCE_FILE_RE.test(e.name) && !TEST_FILE_RE.test(e.name)) {
        collectImportsFromFile(p, result);
      }
    }
  }
  return result;
}

const { aliases: uiNodeModulesAliases, allNames: uiPackageSet } = enumerateUiPackages();
const importedPackages = collectImportedPackages();
const uiPackageNames = [...uiPackageSet].filter((p) => importedPackages.has(p));

export default defineConfig({
  root: path.resolve(__dirname, '../..'),
  base: '/',

  server: {
    watch: {
      ignored: [
        '**/src/core/**',
        '**/build/**',
      ],
    },
  },

  optimizeDeps: {
    noDiscovery: true,
    entries: [
      'src/ui/src/index.js',
      'src/ui/src/**/*.{js,jsx,ts,tsx}',
    ],
    include: [
      ...uiPackageNames,
      'dayjs/plugin/localizedFormat',
      'lodash/cloneDeep',
      'lodash/debounce',
      'lodash/difference',
      'lodash/escape',
      'lodash/isEqual',
      'lodash/isNull',
      'lodash/isNumber',
      'lodash/isString',
      'lodash/isUndefined',
      'lodash/pick',
      'lodash/pickBy',
      'lodash/range',
      'lodash/throttle',
      'react-color/es/components/common',
      'react-select/creatable',
      'redux-devtools-extension/logOnlyInProduction',
      'redux-persist/integration/react',
      'html-parse-stringify',
      'redux-logger',
      'void-elements',
    ],
    esbuildOptions: {
      target: 'es2020',
      plugins: [fixReactVirtualized],
    },
  },

  plugins: [
    cjsToEsmPlugin(),
    stripReactHotLoaderPlugin(),
    fastRefreshOptInPlugin(),
    iconGlobPlugin(),
    nodePolyfills({
      include: ['process', 'buffer', 'util', 'stream'],
      globals: { process: true, Buffer: true, global: true },
    }),
    themeSCSSPlugin(),
    svgInlinePlugin(),
    react({
      include: [/\.[jt]sx?$/],
      jsxImportSource: '@emotion/react',
      babel: {
        presets: [
          ['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }],
        ],
        plugins: [
          require.resolve('@emotion/babel-plugin'),
          '@babel/plugin-proposal-optional-chaining',
        ],
        compact: false,
      },
    }),
  ],

  resolve: {
    alias: {
      ...uiNodeModulesAliases,
      'react-hot-loader/root': path.resolve(__dirname, 'vite-shims/react-hot-loader-root.js'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-virtualized': path.resolve(__dirname, 'node_modules/react-virtualized/dist/umd/react-virtualized.js'),
      src: path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      constants: path.resolve(__dirname, 'src/constants'),
      helpers: path.resolve(__dirname, 'src/helpers'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      actions: path.resolve(__dirname, 'src/redux/actions'),
      reducers: path.resolve(__dirname, 'src/redux/reducers'),
      selectors: path.resolve(__dirname, 'src/redux/selectors'),
      core: path.resolve(__dirname, 'src/core'),
    },
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },

  css: {
    postcss: {
      plugins: [
        addHostPostcssPlugin,
      ],
    },
    preprocessorOptions: {
      scss: {
        additionalData: (source, filename) => {
          if (
            filename.endsWith('App.scss') &&
            filename.includes(path.join('components', 'App'))
          ) {
            return `@import '../../constants/light.scss';\n${source}`;
          }
          return source;
        },
        loadPaths: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'src/constants'),
          path.resolve(__dirname, 'src/components'),
        ],
        silenceDeprecations: sassDeprecationFlags,
      },
    },
  },
});
