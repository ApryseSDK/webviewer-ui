/**
 * Go to the first page of the document. Makes the document viewer display the first page of the document.
 * @method WebViewer#goToFirstPage
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.goToFirstPage();
 */

import core from 'core';

export default () => {
  core.setCurrentPage(1);  
};
