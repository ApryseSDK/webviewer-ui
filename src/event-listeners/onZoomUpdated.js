import actions from 'actions';
import fireEvent from 'helpers/fireEvent';

export default dispatch => (e, zoom) => {
  dispatch(actions.setZoom(zoom));
  fireEvent('zoomChanged', [ zoom ]);
};