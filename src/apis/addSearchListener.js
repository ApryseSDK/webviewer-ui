import actions from 'actions';

export default store => listener => {
  store.dispatch(actions.addSearchListener(listener));
};