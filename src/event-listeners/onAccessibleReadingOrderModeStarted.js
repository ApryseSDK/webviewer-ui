import actions from 'actions';

export default (dispatch) => () => {
  dispatch(actions.openElement('loadingModal'));

  dispatch(actions.disableElements(['thumbnailControl', 'documentControl']));
};