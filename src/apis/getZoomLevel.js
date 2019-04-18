/**
 * Return the current zoom level
 * @method WebViewer#getZoomLevel
 * @return {number} Zoom level (0 ~ 1)
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

console.log(instance.getZoomLevel());
 */

import selectors from 'selectors';

export default store => () => selectors.getZoom(store.getState());