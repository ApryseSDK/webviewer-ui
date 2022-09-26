/**
 * Returns whether the tool is disabled.
 * @method UI.isToolDisabled
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @returns {boolean} Whether the tool is disabled.
 * @example
WebViewer(...)
  .then(function(instance) {
    console.log(instance.UI.isToolDisabled());
  });
 */

import selectors from 'selectors';

export default (store) => (toolName) => {
  const state = store.getState();
  const dataElement = selectors.getToolButtonDataElement(state, toolName);

  return selectors.isElementDisabled(state, dataElement);
};
