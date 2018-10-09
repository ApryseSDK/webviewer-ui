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