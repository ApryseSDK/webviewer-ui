import core from 'core';
import actions from 'actions';

export default (store) => () => {
  console.warn('UI.updateOutlines is deprecated since version 8.3. Please use reloadOutline instead');
  core.getOutlines((outlines) => {
    store.dispatch(actions.setOutlines(outlines));
  });
};