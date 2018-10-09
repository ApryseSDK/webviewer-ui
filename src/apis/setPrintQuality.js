import actions from 'actions';

export default store => quality => {
  store.dispatch(actions.setPrintQuality(quality));
};
