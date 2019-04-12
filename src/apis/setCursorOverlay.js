import actions from 'actions';

export default store => data => {
  store.dispatch(actions.setCursorOverlay(data));
};