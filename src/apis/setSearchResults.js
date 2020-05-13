import actions from 'actions';

export default store => results => {
  store.dispatch(actions.setSearchResults(results));
};