import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { copyRecursive } from '../../vite-configs/vite.config.mjs';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';

const copyFilesPlugin = () => {
  return {
    name: 'copy-files',
    async buildStart() {
      const copyOperations = getCopyOperations();
      for (const op of copyOperations) {
        await copyRecursive(op.from, op.to, op.ignore);
      }
    }
  };
};

const getCopyOperations = () => {
  return [
    {
      from: path.resolve(__dirname, './src/index.core.html'),
      to: path.resolve(__dirname, '../../build/ui/index.html'),
    },
    {
      from: path.resolve(__dirname, './i18n'),
      to: path.resolve(__dirname, '../../build/ui/i18n'),
    },
    {
      from: path.resolve(__dirname, './assets'),
      to: path.resolve(__dirname, '../../build/ui/assets'),
      ignore: ['icons/*.svg'],
    },
    {
      from: path.resolve(__dirname, './src/configorigin.txt'),
      to: path.resolve(__dirname, '../../build/ui/configorigin.txt'),
    },
  ]
}
// plugin to inject styles into shadow DOM
function customStyleInjection() {
  return {
    name: 'custom-style-injection',
    enforce: 'post',
    transform(code, id) {
      if (id.endsWith('.css')) {
        return {
          code: `
            import { injectStylesIntoShadowDOM } from 'styleInjector';
            injectStylesIntoShadowDOM(${JSON.stringify(code)});
          `,
          map: null,
        };
      }
    },
  };
}

export default defineConfig({
  base: '/build/ui/',
  root: './',
  build: {
    sourcemap: false,
    emptyOutDir: false,
    minify: false,
    target: 'es2020',
    outDir: path.resolve('build/ui'),
    rollupOptions: {
      input: 'src/index.js',
      output: {
        format: 'iife',
        entryFileNames: 'webviewer-ui.min.js',
      },
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      plugins: [fixReactVirtualized],
    },
  },
  plugins: [
    react({
      include: [/\.[jt]sx?$/, /\.js$/],
      jsxRuntime: 'automatic',
      babel: {
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }]
        ],
        plugins: [
          '@babel/plugin-proposal-optional-chaining',
        ],
        compact: false,
      },
    }),
    // svgInlinePlugin(),
    customStyleInjection(),
    copyFilesPlugin(),
  ],
  resolve: {
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
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
    extensions: ['.ts', '.js', '.tsx', '.jsx']
  },
  css: {
    postcss: {
      plugins: [
        require('postcss-import')(),
      ],
    },
    preprocessorOptions: {
      scss: {},
    },
  },
});