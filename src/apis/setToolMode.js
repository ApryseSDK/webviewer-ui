/**
 * Sets tool mode.
 * @method UI.setToolMode
 * @param {string|Core.Tools.ToolNames} toolName Name of the tool, either from <a href='https://docs.apryse.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setToolMode('AnnotationEdit');
  });
 */

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
export default (store) => (toolName) => {
  const state = store.getState();
  const featureFlags = state.featureFlags;
  const { customizableUI } = featureFlags;

  if (customizableUI) {
    // We can also set the active ribbon here if the tool is associated with a ribbon
    const ribbonAssociatedWithTool = selectors.getRibbonAssociatedWithTool(state, toolName);
    if (ribbonAssociatedWithTool) {
      store.dispatch(actions.setActiveCustomRibbon(ribbonAssociatedWithTool));
    }

  }
  core.setToolMode(toolName);
};