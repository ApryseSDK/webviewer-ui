/**
 * Sets the maximum zoom level allowed by the UI. Default is 9999%.
 * @method CoreControls.ReaderControl#setMaxZoomLevel
 * @param {(string|number)} zoomLevel Zoom level in either number or percentage.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
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
    try {
      Tools.MarqueeZoomTool.setMaxZoomLevel(zoomLevel);
    } catch(e) {
      console.warn('Tools.MarqueeZoomTool.setMaxZoomLevel is not a function. To fix this issue, download the latest package from http://www.pdftron.com/downloads/WebViewer.zip and replace your CoreControls.js with the one in the package');
    }
  } else {
    console.warn('Type of the argument for setMaxZoomLevel must be either string or number');
  }
};