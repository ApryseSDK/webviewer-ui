import actions from 'actions';

export default store => noteDateFormat => {
  store.dispatch(actions.setNoteDateFormat(noteDateFormat));
};
