/**
 * Go to the previous page of the document. Makes the document viewer display the previous page of the document.
 * @method WebViewer#goToPrevPage
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.goToPrevPage();
 */

import core from 'core';
import selectors from 'selectors';

export default store => () => {
  const currentPage = selectors.getCurrentPage(store.getState());
  
  if (currentPage === 1) {
  console.warn('You are at the first page');
  } else {
    const prevPage = currentPage - 1;
    core.setCurrentPage(prevPage);  
  }
};