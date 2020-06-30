import actions from 'actions';

export default store => group => {
  store.dispatch(actions.setToolbarGroup(group));
};