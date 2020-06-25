import actions from 'actions';

export default store => screen => {
  store.dispatch(actions.setToolbarScreen(screen));
};