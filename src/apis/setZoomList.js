import actions from 'actions';

export default (store) => (zoomList) => {
  store.dispatch(actions.setZoomList(zoomList));
};