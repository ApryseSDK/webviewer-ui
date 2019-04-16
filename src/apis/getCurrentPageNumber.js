/**
 * Return the current page number (1-indexed) of the document loaded in the WebViewer.
 * @method WebViewer#getCurrentPageNumber
 * @return {number} Current page number (1-indexed)
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  console.log(instance.getCurrentPageNumber());
});
 */

import selectors from 'selectors';

export default store => () => selectors.getCurrentPage(store.getState());

