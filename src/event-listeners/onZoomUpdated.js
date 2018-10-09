import actions from 'actions';

export default dispatch => (e, zoom) => {
  dispatch(actions.setZoom(zoom));
  $(document).trigger('zoomChanged');
};