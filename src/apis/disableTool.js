import disableTools from './disableTools';

export default store => toolName => {
  disableTools(store)([toolName]);
};
