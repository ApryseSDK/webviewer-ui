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

import setMaxZoom from 'helpers/setMaxZoom';

export default store => setMaxZoom(store.dispatch);
