export default (color) => {
  const parsedColor = (color?.toHexString?.() || '').substring(1);
  return parsedColor;
};
