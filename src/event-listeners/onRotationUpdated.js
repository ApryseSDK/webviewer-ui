import actions from 'actions';
import fireEvent from 'helpers/fireEvent';

export default dispatch => (e, rotation) => {
  dispatch(actions.setRotation(rotation));

  fireEvent('rotationChanged', [ rotation ]);
};