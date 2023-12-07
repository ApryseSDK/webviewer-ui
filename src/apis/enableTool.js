import enableTools from './enableTools';

export default (store) => (toolName) => {
  enableTools(store)([toolName]);
};
