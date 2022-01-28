/**
 * Sets the minimum zoom level allowed by the UI. Default is 5%.
 * @method UI.setMinZoomLevel
 * @param {(string|number)} zoomLevel Zoom level in either number or percentage.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setMinZoomLevel('10%'); // or setMinZoomLevel(0.1)
  });
 */

import actions from 'actions';
import zoomFactors, { defaultZoomList } from 'constants/zoomFactors';
import getActualZoomLevel from 'helpers/getActualZoomLevel';

export default store => zoomLevel => {
  const minZoom = getActualZoomLevel(zoomLevel);

  if (minZoom) {
    const maxZoom = zoomFactors.getMaxZoomLevel();
    const zoomList = defaultZoomList.filter(zoom => zoom <= maxZoom && zoom >= minZoom);
    zoomFactors.setMinZoomLevel(minZoom);
    store.dispatch(actions.setZoomList(zoomList));
    window.Core.Tools.MarqueeZoomTool.setMinZoomLevel(minZoom);
  } else {
    console.warn('Type of the argument for setMinZoomLevel must be either string or number');
  }
};