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
import zoomFactors, { defaultZoomList } from 'constants/zoomFactors';
import getActualZoomLevel from 'helpers/getActualZoomLevel';

export default store => zoomLevel => {
  const maxZoom = getActualZoomLevel(zoomLevel);

  if (maxZoom) {
    const minZoom = zoomFactors.getMinZoomLevel();
    const zoomList = defaultZoomList.filter(zoom => zoom <= maxZoom && zoom >= minZoom);
    zoomFactors.setMaxZoomLevel(maxZoom);
    store.dispatch(actions.setZoomList(zoomList));
    window.Tools.MarqueeZoomTool.setMaxZoomLevel(maxZoom);
  } else {
    console.warn('Type of the argument for setMaxZoomLevel must be either string or number');
  }
};