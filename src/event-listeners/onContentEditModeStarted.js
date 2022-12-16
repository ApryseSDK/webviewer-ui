import actions from 'actions';

export default (dispatch) => () => {
  dispatch(actions.disableElements(['thumbnailControl', 'documentControl']));
};