import actions from 'actions';

export default dispatch => zoom => {
  dispatch(actions.setZoom(zoom));
};