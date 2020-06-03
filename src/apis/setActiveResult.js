import actions from 'actions';

export default store => (result, index) => {
  store.dispatch(actions.setActiveResult(result));
  store.dispatch(actions.setActiveResultIndex(index));
};