/**
 * Go to the last page of the document. Makes the document viewer display the last page of the document.
 * @method CoreControls.ReaderControl#goToLastPage
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.goToLastPage();
});
 */

import core from 'core';
import selectors from 'selectors';

export default store => () => {
  core.setCurrentPage(selectors.getTotalPages(store.getState()));  
};
