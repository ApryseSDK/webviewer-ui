/**
 * Unregisters tool in the document viewer tool mode map, and removes the button object.
 * @method WebViewer#unregisterTool
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.unregisterTool('MyTool');
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.unregisterTool('MyTool');
});
 */

import core from 'core';
import actions from 'actions';

export default store => toolName => {
  unregisterToolInHeader(store, toolName);
  unregisterToolInRedux(store, toolName);
  unregisterToolInToolModeMap(toolName);
};

const unregisterToolInHeader = (store, toolName) => {
  const state = store.getState();

  Object.keys(state.viewer.headers).forEach(header => {
    const headerItems = state.viewer.headers[header].filter(headerItem => headerItem.toolName !== toolName);

    store.dispatch(actions.setHeaderItems(header, headerItems));
  });
};

const unregisterToolInRedux = (store, toolName) => {
  store.dispatch(actions.unregisterTool(toolName));
};

const unregisterToolInToolModeMap = toolName => {
  delete core.getToolModeMap()[toolName];
};