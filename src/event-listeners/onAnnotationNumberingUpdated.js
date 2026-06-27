import actions from 'actions';

export default (dispatch) => (isAnnotationNumberingEnabled) => {
  dispatch(actions.setAnnotationNumbering(isAnnotationNumberingEnabled));
};