/**
 * Sets tool mode.
 * @method WebViewer#setToolMode
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.setToolMode('AnnotationEdit');
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
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
