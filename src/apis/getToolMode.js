/**
 * Return the current tool object.
 * @method WebViewer#getToolMode
 * @return {Tools} Instance of the current tool
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

console.log(instance.getToolMode().name, instance.getToolMode());
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  console.log(instance.getToolMode().name, instance.getToolMode());
});
 */

import core from 'core';

export default () => core.getToolMode();