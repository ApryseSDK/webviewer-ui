import actions from 'actions';
import fireEvent from 'helpers/fireEvent';

export default dispatch => zoom => {
  dispatch(actions.setZoom(zoom));
  fireEvent('zoomChanged', [zoom]);
};