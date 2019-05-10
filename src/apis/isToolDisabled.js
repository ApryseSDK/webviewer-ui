/**
 * Returns whether the tool is disabled.
 * @method WebViewer#isToolDisabled
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @returns {boolean} Whether the tool is disabled.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  console.log(instance.isReadOnly());
});
 */

import core from 'core';

export default toolName => !!core.getTool(toolName).disabled;
