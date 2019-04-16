/**
 * Return the total number of pages of the document loaded in the WebViewer.
 * @method WebViewer#getPageCount
 * @return {number} Total number of pages
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  console.log(instance.getPageCount());
});
 */

import selectors from 'selectors';

export default store => () => selectors.getTotalPages(store.getState());
