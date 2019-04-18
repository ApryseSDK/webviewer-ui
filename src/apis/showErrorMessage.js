import actions from 'actions';

export default store => message => {
  store.dispatch(actions.showErrorMessage(message));
};
