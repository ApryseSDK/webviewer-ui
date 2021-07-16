/**
 * Unregisters tool in the document viewer tool mode map, and removes the button object.
 * @method UI.unregisterTool
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.unregisterTool('MyTool');
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