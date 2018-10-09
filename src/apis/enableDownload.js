import actions from 'actions';

export default store => (enable = true) =>  {
  if (enable) {
    store.dispatch(actions.enableElement('downloadButton'));
  } else {
    store.dispatch(actions.disableElement('downloadButton'));
  }
};
