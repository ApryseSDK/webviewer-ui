export default color => {
  let fillClass = '';
  fillClass = (color?.toHexString?.() || '').substring(1);
  if (fillClass) {
    fillClass = `F-${fillClass}`;
  }
  return fillClass;
};
