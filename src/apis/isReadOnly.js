/**
 * Returns whether the current mode is read only.
 * @method WebViewer#isReadOnly
 * @returns {boolean} Whether the current mode is read only.
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

console.log(instance.isReadOnly());
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  console.log(instance.isReadOnly());
});
 */

import core from 'core';

export default () => !!core.getIsReadOnly();
