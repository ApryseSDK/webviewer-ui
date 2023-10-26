import actions from 'actions';

export default (store) => () => {
  store.dispatch(actions.setIsMultiViewerMode(true));
};