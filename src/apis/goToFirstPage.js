/**
 * Go to the first page of the document. Makes the document viewer display the first page of the document.
 * @method WebViewer#goToFirstPage
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
const { docViewer } = instance;

// you must have a document loaded when calling this api
docViewer.on('documentLoaded', () => {
  instance.goToFirstPage();
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var docViewer = instance.docViewer;
  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', () => {
    instance.goToFirstPage();
  });
});
 */

import core from 'core';

export default () => {
  core.setCurrentPage(1);  
};
