import core from 'core';
import actions from 'actions';

export default store => () => {
  core.getOutlines(outlines => {
    store.dispatch(actions.setOutlines(outlines));
  });
};