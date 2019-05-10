/**
 * Go to the next page of the document. Makes the document viewer display the next page of the document.
 * @method WebViewer#goToNextPage
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.goToNextPage();
});
 */

import core from 'core';
import selectors from 'selectors';

export default store => () => {
  const state = store.getState();
  const currentPage = selectors.getCurrentPage(state);
  
  if (currentPage === selectors.getTotalPages(state)) {
    console.warn('you are at the last page');
  } else {
    const nextPage = currentPage + 1;
    core.setCurrentPage(nextPage);  
  }
};

