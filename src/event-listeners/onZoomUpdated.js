import actions from 'actions';

export default (dispatch, documentViewerKey) => (zoom) => {
  dispatch(actions.setZoom(zoom, documentViewerKey));
};
