/**
 * Closes the document that's currently opened.
 * @method WebViewer#closeDocument
 * @return {Promise} A promise resolved after document is closed.
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.closeDocument().then(() => {
  console.log('Document is closed');
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.closeDocument().then(function() {
    console.log('Document is closed');
  });
});
 */

import core from 'core';

export default ({ dispatch }) => () => core.closeDocument(dispatch);