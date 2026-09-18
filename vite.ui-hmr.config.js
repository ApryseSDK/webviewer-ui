import { defineConfig } from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createUiViteCompatibilityConfig } from './vite.ui-shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const uiViteCompatibilityConfig = createUiViteCompatibilityConfig({ aliases: uiNodeModulesAliases });

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
    ...uiViteCompatibilityConfig.optimizeDeps,
  },

  plugins: uiViteCompatibilityConfig.plugins,
  resolve: uiViteCompatibilityConfig.resolve,
  css: uiViteCompatibilityConfig.css,
});
