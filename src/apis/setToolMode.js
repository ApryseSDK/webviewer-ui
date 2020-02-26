/**
 * Sets tool mode.
 * @method WebViewerInstance#setToolMode
 * @param {string|Tools.ToolNames} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setToolMode('AnnotationEdit');
  });
 */

import core from 'core';
import actions from 'actions';

export default store => toolName => {
  const state = store.getState();
  const group = state.viewer.toolButtonObjects[toolName].group;

  core.setToolMode(toolName);
  setActiveToolGroupAndToolsOverlay(store, group);
};

const setActiveToolGroupAndToolsOverlay = (store, group) => {
  if (!group) {
    store.dispatch(actions.setActiveToolGroup(''));
    store.dispatch(actions.closeElement('toolsOverlay'));
  } else {
    store.dispatch(actions.setActiveToolGroup(group));
    store.dispatch(actions.openElement('toolsOverlay'));
  }
};