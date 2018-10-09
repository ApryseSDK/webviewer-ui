export default c => {
  let color = c ? `rgba(${c.R}, ${c.G}, ${c.B}, ${c.A})` : null;
  if (color === 'rgba(255, 255, 0, 1)') {
    color = 'rgba(250, 245, 0, 1)';
  }
  return color;
};