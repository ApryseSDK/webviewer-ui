/**
 * Checks if a tool is currently disabled in the UI
 * @method UI.isToolDisabled
 * @memberof UI
 * @param {string|Core.Tools.ToolNames} toolName The name of the tool, either from {@link Core.Tools.ToolNames} or the name you registered your custom tool with
 * @returns {boolean} True if the tool is disabled, false otherwise. Returns false if the tool is not part of the UI configuration.
 * @see UI.enableTools
 * @see UI.disableTools
 * @see Core.Tools.ToolNames
 * @example
WebViewer(...)
  .then(function(instance) {
    // Check if the sticky note tool is disabled using Core.Tools.ToolNames
    const isDisabled = instance.UI.isToolDisabled(instance.Core.Tools.ToolNames.STICKY);
    console.log('Sticky note tool disabled:', isDisabled);

    // You can also check custom tools by name
    const customToolDisabled = instance.UI.isToolDisabled('MyCustomTool');
    console.log('Custom tool disabled:', customToolDisabled);
  });
 */

import selectors from 'selectors';

export default (store) => (toolName) => {
  const state = store.getState();
  const dataElement = selectors.getToolButtonDataElement(state, toolName);

  // If the tool doesn't exist in the UI configuration, return false (not disabled)
  // This allows Core tools that aren't part of the UI to be considered as enabled
  if (!dataElement) {
    return false;
  }

  return selectors.isElementDisabled(state, dataElement);
};
