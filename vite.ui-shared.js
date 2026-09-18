import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';

const require = createRequire(import.meta.url);
const { nodePolyfills } = require('vite-plugin-node-polyfills');
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
      if (!source.includes('.scss?theme-') || !importer) {
        return null;
      }
      const qIdx = source.indexOf('?');
      const relPath = source.slice(0, qIdx);
      const query = source.slice(qIdx + 1);
      if (!themeMap[query]) {
        return null;
      }
      const resolved = path.resolve(path.dirname(importer), relPath);
      const normalizedRelativePath = path.relative(__dirname, resolved).split(path.sep).join('/');
      const stablePathId = encodeURIComponent(normalizedRelativePath);
      const virtualId = `\0theme-style/${query}/${stablePathId}.js`;
      virtualToFile.set(virtualId, resolved);
      return virtualId;
    },

    async load(id) {
      if (!id.startsWith('\0theme-style/')) {
        return null;
      }
      const filePath = virtualToFile.get(id);
      const query = id.slice('\0theme-style/'.length).split('/')[0];
      const stylesheet = themeMap[query];
      if (!filePath || !stylesheet) {
        return null;
      }

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
  const isWhitespace = (character) => (
    character === ' ' ||
    character === '\n' ||
    character === '\r' ||
    character === '\t' ||
    character === '\f'
  );

  const removeDoubleQuotedAttribute = (tag, attributeName) => {
    const lowercaseTag = tag.toLowerCase();
    let attributeStart = lowercaseTag.indexOf(attributeName);

    while (attributeStart !== -1) {
      const valueStart = attributeStart + attributeName.length;
      if (
        isWhitespace(tag[attributeStart - 1]) &&
        tag[valueStart] === '=' &&
        tag[valueStart + 1] === '"'
      ) {
        const valueEnd = tag.indexOf('"', valueStart + 2);
        if (valueEnd === -1) {
          return tag;
        }

        let removalStart = attributeStart;
        while (removalStart > 0 && isWhitespace(tag[removalStart - 1])) {
          removalStart -= 1;
        }
        return `${tag.slice(0, removalStart)}${tag.slice(valueEnd + 1)}`;
      }

      attributeStart = lowercaseTag.indexOf(attributeName, attributeStart + attributeName.length);
    }

    return tag;
  };

  const removeDimensionsFromOpeningTag = (svg) => {
    const openingTagStart = svg.toLowerCase().indexOf('<svg');
    const openingTagEnd = svg.indexOf('>', openingTagStart);
    if (openingTagStart === -1 || openingTagEnd === -1) {
      return svg;
    }

    let openingTag = svg.slice(openingTagStart, openingTagEnd);
    openingTag = removeDoubleQuotedAttribute(openingTag, 'width');
    openingTag = removeDoubleQuotedAttribute(openingTag, 'height');

    return `${svg.slice(0, openingTagStart)}${openingTag}${svg.slice(openingTagEnd)}`;
  };

  return {
    name: 'svg-inline',
    enforce: 'pre',

    load(id) {
      const cleanId = id.split('?')[0];
      if (!cleanId.endsWith('.svg')) {
        return null;
      }
      try {
        const svg = removeDimensionsFromOpeningTag(fs.readFileSync(cleanId, 'utf8'));
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

      code = `import { createLogger as _createLogger } from 'redux-logger';\n${  code}`;
      code = code.replace(
        /const\s*\{\s*createLogger\s*\}\s*=\s*require\(\s*['"]redux-logger['"]\s*\)\s*;?/,
        'const { createLogger } = { createLogger: _createLogger };'
      );

      code = `import { composeWithDevTools as _composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';\n${  code}`;
      code = code.replace(
        /const\s*\{\s*composeWithDevTools\s*\}\s*=\s*require\(\s*['"]redux-devtools-extension\/logOnlyInProduction['"]\s*\)\s*;?/,
        'const { composeWithDevTools } = { composeWithDevTools: _composeWithDevTools };'
      );

      code = code.replace(
        /export\s+function\s+setupHotModuleReplacement\s*\([^)]*\)\s*\{[\s\S]*?\n\}/,
        'export function setupHotModuleReplacement() { /* handled by Vite Fast Refresh */ }'
      );

      code = code.replaceAll('process.env.NODE_ENV', '"development"');

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
          /require\(`\.\.\/\.\.\/\.\.\/assets\/icons\/\$\{glyph\}\.svg`\)/,
          '../../../assets/icons/*.svg',
          '__iconModules[`../../../assets/icons/${glyph}.svg`]'
        );
      }

      if (isRasterPrint) {
        code = applyIconGlobTransform(
          code,
          id,
          /require\(`\.\.\/\.\.\/assets\/icons\/\$\{icon\}\.svg`\)/,
          '../../assets/icons/*.svg',
          '__iconModules[`../../assets/icons/${icon}.svg`]'
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
      const [rawFilepath] = id.split('?');
      const filepath = rawFilepath.replaceAll('\\', '/');
      if (!filepath.endsWith('.js')) {
        return null;
      }
      if (filepath.includes('/node_modules/')) {
        return null;
      }
      if (!filepath.includes('/src/ui/src/')) {
        return null;
      }
      if (code.includes('@emotion/react/jsx-runtime')) {
        return null;
      }
      return { code: marker + code, map: null };
    },
  };
}

/**
 * Creates the UI-specific transforms and resolution shared by Vite hosts.
 * Entry points, dependency discovery, server options, and build output remain
 * the responsibility of the consuming Vite configuration.
 */
export function createUiViteCompatibilityConfig({ aliases = {}, includeReactPlugin = true } = {}) {
  const plugins = [
    cjsToEsmPlugin(),
    stripReactHotLoaderPlugin(),
    fastRefreshOptInPlugin(),
    iconGlobPlugin(),
    nodePolyfills({
      include: ['process', 'buffer', 'util', 'stream'],
      globals: { process: true, Buffer: true, global: true },
      protocolImports: false,
    }),
    themeSCSSPlugin(),
    svgInlinePlugin(),
  ];

  if (includeReactPlugin) {
    plugins.push(react({
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
    }));
  }

  return {
    optimizeDeps: {
      rolldownOptions: {
        moduleTypes: {
          '.js': 'jsx',
        },
      },
      esbuildOptions: {
        target: 'es2020',
        plugins: [fixReactVirtualized],
      },
    },

    plugins,

    resolve: {
      alias: {
        ...aliases,
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
  };
}
