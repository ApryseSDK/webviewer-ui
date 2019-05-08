/**
 * Returns whether the tool is disabled.
 * @method WebViewer#isToolDisabled
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @returns {boolean} Whether the tool is disabled.
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  console.log(instance.isToolDisabled());
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  console.log(instance.isToolDisabled());
});
 */

import core from 'core';

export default toolName => !!core.getTool(toolName).disabled;
