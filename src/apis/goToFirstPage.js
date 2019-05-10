/**
 * Go to the first page of the document. Makes the document viewer display the first page of the document.
 * @method WebViewer#goToFirstPage
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.goToFirstPage();
});
 */

import core from 'core';

export default () => {
  core.setCurrentPage(1);  
};
