import actions from 'actions';

export default store => type => {
  store.dispatch(actions.setEngineType(type));
};
