/**
 * Sets the maximum zoom level allowed by the UI. Default is 9999%.
 * @method WebViewerInstance#setMaxZoomLevel
 * @param {(string|number)} zoomLevel Zoom level in either number or percentage.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setMaxZoomLevel('150%'); // or setMaxZoomLevel(1.5)
  });
 */

import actions from 'actions';
import selectors from 'selectors';
import zoomFactors from 'constants/zoomFactors';
import getActualZoomLevel from 'helpers/getActualZoomLevel';

export default store => zoomLevel => {
  zoomLevel = getActualZoomLevel(zoomLevel);
  const zoomList = selectors.getZoomList(store.getState()).filter(zoom => zoom <= zoomLevel);

  if (zoomLevel) {
    zoomFactors.setMaxZoomLevel(zoomLevel);
    store.dispatch(actions.setZoomList(zoomList));
    window.Tools.MarqueeZoomTool.setMaxZoomLevel(zoomLevel);
  } else {
    console.warn('Type of the argument for setMaxZoomLevel must be either string or number');
  }
};