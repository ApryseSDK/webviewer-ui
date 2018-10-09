import actions from 'actions';

export default store => value => {
  if (value) {
    store.dispatch(actions.openElement('leftPanel'));
  } else {
    store.dispatch(actions.closeElement('leftPanel'));
  }
};