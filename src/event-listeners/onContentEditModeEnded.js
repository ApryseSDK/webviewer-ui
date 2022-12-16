import actions from 'actions';

export default (dispatch) => () => {
  dispatch(actions.enableElements(['thumbnailControl', 'documentControl']));
};
