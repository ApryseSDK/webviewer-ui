import actions from 'actions';

export default (store) => (sortStrategy) => {
  store.dispatch(actions.setSortNotesBy(sortStrategy));
};