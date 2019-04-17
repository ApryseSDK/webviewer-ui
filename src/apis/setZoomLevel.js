/**
 * Sets zoom level.
 * @method WebViewer#setZoomLevel
 * @param {(string|number)} zoomLevel Zoom level in either number or percentage.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.setZoomLevel('150%'); // or setZoomLevel(1.5)
 */

import core from 'core';
import getActualZoomLevel from 'helpers/getActualZoomLevel';

export default zoomLevel => {
  zoomLevel = getActualZoomLevel(zoomLevel);

  if (zoomLevel) {
    core.zoomTo(zoomLevel);
  } else {
  console.warn('Type of the argument for setZoomLevel must be either string or number');
  }
};