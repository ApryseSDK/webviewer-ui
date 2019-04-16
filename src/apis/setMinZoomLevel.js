/**
 * Sets the minimum zoom level allowed by the UI. Default is 5%.
 * @method WebViewer#setMinZoomLevel
 * @param {(string|number)} zoomLevel Zoom level in either number or percentage.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
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
    try {
      Tools.MarqueeZoomTool.setMinZoomLevel(zoomLevel);
    } catch(e) {
      console.warn('Tools.MarqueeZoomTool.setMinZoomLevel is not a function. To fix this issue, download the latest package from http://www.pdftron.com/downloads/WebViewer.zip and replace your CoreControls.js with the one in the package');
    }
  } else {
    console.warn('Type of the argument for setMinZoomLevel must be either string or number');
  }
};