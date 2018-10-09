import selectors from 'selectors';

export default store => toolName => selectors.isToolDisabled(store.getState(), toolName);
