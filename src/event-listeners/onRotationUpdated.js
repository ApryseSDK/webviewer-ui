import actions from 'actions';

export default dispatch => (e, rotateAmount) => {
  const radians = (Math.PI/2) * (4 - rotateAmount); // Fixed 90 degree rotations
  
  dispatch(actions.setRotation(radians));
  $(document).trigger('rotationChanged', [radians]);
};