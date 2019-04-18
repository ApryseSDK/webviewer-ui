/**
 * Return the current layout mode of the WebViewer.
 * @method WebViewer#getLayoutMode
 * @return {CoreControls.ReaderControl#LayoutMode} Current layout mode
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

console.log(instance.getLayoutMode());
 */

import selectors from 'selectors';

export default store => () => selectors.getDisplayMode(store.getState());
