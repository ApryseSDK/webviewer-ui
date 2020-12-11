export default color => {
  let fillColor = '';
  fillColor = (color?.toHexString?.() || '').substring(1);
  if (fillColor) {
    fillColor = `F-${fillColor}`;
  }
  return fillColor;
};
