/**
 * Return the current fit mode of the WebViewer.
 * @method WebViewer#getFitMode
 * @return {CoreControls.ReaderControl#FitMode} Current fit mode
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  console.log(instance.getFitMode());
});
 */

import selectors from 'selectors';

export default store => () => selectors.getFitMode(store.getState());