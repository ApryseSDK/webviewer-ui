let svgMap;

export const getSvgMap = () => {
  if (svgMap) {
    return svgMap;
  }

  const isVite = typeof process !== 'undefined' && process.env?.STORYBOOK_VITE === 'true';

  if (isVite) {
    // Vite-compatible file (uses import.meta.glob)
    svgMap = require('./svgMap.vite.js').getSvgMap();
  } else {
    // Webpack-compatible file (uses require.context or manual mapping)
    svgMap = require('./svgMap.webpack.js').getSvgMap();
  }

  return svgMap;
};
