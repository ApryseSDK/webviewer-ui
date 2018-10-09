import core from 'core';

export default zoomLevel =>  {
  if (isStringEndsWithPercentage(zoomLevel)) {
    core.zoomTo(convertPercentageToNumber(zoomLevel));
  } else if (typeof zoomLevel === 'number') {
    core.zoomTo(zoomLevel);
  }
};

const isStringEndsWithPercentage = zoomLevel => {
  return typeof zoomLevel === 'string' && zoomLevel.indexOf('%') === zoomLevel.length - 1;
};

const convertPercentageToNumber = zoomLevel => {
  return Number.parseFloat(zoomLevel) / 100;
};