/**
 * Return the current zoom level
 * @method CoreControls.ReaderControl#getZoomLevel
 * @return {number} Zoom level (0 ~ 1)
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  console.log(instance.getZoomLevel());
});
 */

import selectors from 'selectors';

export default store => () => selectors.getZoom(store.getState());