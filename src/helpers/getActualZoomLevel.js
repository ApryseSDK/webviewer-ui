export default arg => {
  let zoomLevel;

  if (typeof arg === 'string') {
    zoomLevel = Number.parseFloat(arg) / 100;

    const endsWithPercentage = arg.indexOf('%') === arg.length - 1;
    if (endsWithPercentage) {
      console.warn(`Zoom level in string format will be treated as percentage, ${arg} will be converted to ${zoomLevel}`);
    }
  } else if (typeof arg === 'number') {
    zoomLevel = arg;
  }

  return zoomLevel;
};