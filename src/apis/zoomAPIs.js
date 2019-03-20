import core from 'core';
import zoomFactors from 'constants/zoomFactors';
import actions from 'actions';
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

export const setMaxZoomLevel = store => zoomLevel => {
  zoomLevel = getActualZoomLevel(zoomLevel);
  const zoomList = selectors.getZoomList(store.getState()).filter(zoom => zoom <= zoomLevel);

  if (zoomLevel) {
    zoomFactors.setMaxZoomLevel(zoomLevel);
    store.dispatch(actions.setZoomList(zoomList));
    try {
      Tools.MarqueeZoomTool.setMaxZoomLevel(zoomLevel);
    } catch(e) {
      console.warn('Tools.MarqueeZoomTool.setMaxZoomLevel is not a function. To fix this issue, download the latest package from http://www.pdftron.com/downloads/WebViewer.zip and replace your CoreControls.js with the one in the package');
    }
  } else {
    console.warn('Type of the argument for setMaxZoomLevel must be either string or number');
  }
};

export const setMinZoomLevel = store => zoomLevel => {
  zoomLevel = getActualZoomLevel(zoomLevel);
  const zoomList = selectors.getZoomList(store.getState()).filter(zoom => zoom >= zoomLevel);

  if (zoomLevel) {
    zoomFactors.setMinZoomLevel(zoomLevel);
    store.dispatch(actions.setZoomList(zoomList));
    try {
      Tools.MarqueeZoomTool.setMinZoomLevel(zoomLevel);
    } catch(e) {
      console.warn('Tools.MarqueeZoomTool.setMinZoomLevel is not a function. To fix this issue, download the latest package from http://www.pdftron.com/downloads/WebViewer.zip and replace your CoreControls.js with the one in the package');
    }
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