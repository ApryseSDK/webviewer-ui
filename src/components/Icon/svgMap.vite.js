// svgMap.vite.js
export const getSvgMap = () => {
  const modules = import.meta.glob('../../assets/icons/*.svg', { as: 'raw', eager: true });
  const svgMap = {};
  for (const path in modules) {
    const name = path.split('/').pop().replace('.svg', '');
    svgMap[name] = modules[path];
  }
  return svgMap;
};
