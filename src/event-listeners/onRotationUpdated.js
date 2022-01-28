import actions from 'actions';

export default dispatch => rotation => {
  dispatch(actions.setRotation(rotation));
};