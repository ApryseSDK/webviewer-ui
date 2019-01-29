import core from 'core';
import zoomFactors from 'constants/zoomFactors';
import selectors from 'selectors';

export const getZoomLevel = store => () => selectors.getZoom(store.getState());

export const setZoomLevel = zoomLevel => {
  zoomLevel = getActualZoomLevel(zoomLevel);

  if (zoomLevel) {
    core.zoomTo(zoomLevel);
  } else {
    console.warn('Type of the argument for setZoomLevel must be either string or number');
  }
};

export const setMaxZoomLevel = zoomLevel => {
  zoomLevel = getActualZoomLevel(zoomLevel);

  if (zoomLevel) {
    zoomFactors.setMaxZoomLevel(zoomLevel);
  } else {
    console.warn('Type of the argument for setMaxZoomLevel must be either string or number');
  }
};

export const setMinZoomLevel = zoomLevel => {
  zoomLevel = getActualZoomLevel(zoomLevel);

  if (zoomLevel) {
    zoomFactors.setMinZoomLevel(zoomLevel);
  } else {
    console.warn('Type of the argument for setMinZoomLevel must be either string or number');
  }
};

const getActualZoomLevel = arg => {
  let zoomLevel;

  if (typeof arg === 'string') {
    zoomLevel = Number.parseFloat(arg) / 100;

    if (!endsWithPercentage(arg)) {
      console.warn(`Zoom level in string format will be treated as percentage, ${arg} will be converted to ${zoomLevel}`);
    }
  } else if (typeof arg === 'number') {
    zoomLevel = arg;
  }

  return zoomLevel;
};

const endsWithPercentage = str => str.indexOf('%') === str.length - 1;