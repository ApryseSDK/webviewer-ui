/**
 * Return the current layout mode of the WebViewer.
 * @method WebViewer#getLayoutMode
 * @return {CoreControls.ReaderControl#LayoutMode} Current layout mode
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  console.log(instance.getLayoutMode());
});
 */

import selectors from 'selectors';

export default store => () => selectors.getDisplayMode(store.getState());
