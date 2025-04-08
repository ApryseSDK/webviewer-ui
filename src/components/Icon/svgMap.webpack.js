// svgMap.webpack.js
export const getSvgMap = () => {
  const context = require.context('../../../assets/icons', false, /\.svg$/);
  const svgMap = {};
  context.keys().forEach((key) => {
    const name = key.replace('./', '').replace('.svg', '');
    svgMap[name] = context(key).default || context(key);
  });
  return svgMap;
};
