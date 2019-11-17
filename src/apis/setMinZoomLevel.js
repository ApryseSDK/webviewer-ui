/**
 * Sets the minimum zoom level allowed by the UI. Default is 5%.
 * @method WebViewer#setMinZoomLevel
 * @param {(string|number)} zoomLevel Zoom level in either number or percentage.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setMinZoomLevel('10%'); // or setMinZoomLevel(0.1)
  });
 */

import actions from 'actions';
import selectors from 'selectors';
import zoomFactors from 'constants/zoomFactors';
import getActualZoomLevel from 'helpers/getActualZoomLevel';

export default store => zoomLevel => {
  zoomLevel = getActualZoomLevel(zoomLevel);
  const zoomList = selectors.getZoomList(store.getState()).filter(zoom => zoom >= zoomLevel);

  if (zoomLevel) {
    zoomFactors.setMinZoomLevel(zoomLevel);
    store.dispatch(actions.setZoomList(zoomList));
    window.Tools.MarqueeZoomTool.setMinZoomLevel(zoomLevel);
  } else {
    console.warn('Type of the argument for setMinZoomLevel must be either string or number');
  }
};