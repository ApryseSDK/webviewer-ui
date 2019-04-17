/**
 * Return the total number of pages of the document loaded in the WebViewer.
 * @method WebViewer#getPageCount
 * @return {number} Total number of pages
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
console.log(instance.getPageCount());
 */

import selectors from 'selectors';

export default store => () => selectors.getTotalPages(store.getState());
