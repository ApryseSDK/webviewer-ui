/**
 * Go to the last page of the document. Makes the document viewer display the last page of the document.
 * @method WebViewer#goToLastPage
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.goToLastPage();
 */

import core from 'core';
import selectors from 'selectors';

export default store => () => {
  core.setCurrentPage(selectors.getTotalPages(store.getState()));  
};
