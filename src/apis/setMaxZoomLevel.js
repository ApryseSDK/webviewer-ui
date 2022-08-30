/**
 * Sets the maximum zoom level allowed by the UI. Default is 9999%.
 * @method UI.setMaxZoomLevel
 * @param {(string|number)} zoomLevel Zoom level in either number or percentage.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setMaxZoomLevel('150%'); // or setMaxZoomLevel(1.5)
  });
 */

import setMaxZoomLevel from 'helpers/setMaxZoomLevel';

export default (store) => setMaxZoomLevel(store.dispatch);
