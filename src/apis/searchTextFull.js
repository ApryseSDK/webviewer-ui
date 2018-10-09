import actions from 'actions';

export default store => (searchValue, options) =>  {
  store.dispatch(actions.searchTextFull(searchValue, options));
};
