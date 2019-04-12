/**
 * Go to the previous page of the document. Makes the document viewer display the previous page of the document.
 * @method CoreControls.ReaderControl#goToPrevPage
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.goToPrevPage();
});
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