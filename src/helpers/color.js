export const rgbaToHex = (r, g, b, a = 1) => {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  a = Math.round(a * 255).toString(16);

  if (r.length === 1) {
    r = `0${r}`;
  }
  if (g.length === 1) {
    g = `0${g}`;
  }
  if (b.length === 1) {
    b = `0${b}`;
  }
  if (a.length === 1) {
    a = `0${a}`;
  }

  return `#${r}${g}${b}${a}`;
};

export const hexToRgba = hexString => {
  let a = 1;
  if (hexString.length === 9) {
    a = (parseInt(hexString.slice(7, 9), 16) / 255).toFixed(2);
  }
  const r = parseInt(hexString.slice(1, 3), 16);
  const g = parseInt(hexString.slice(3, 5), 16);
  const b = parseInt(hexString.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
