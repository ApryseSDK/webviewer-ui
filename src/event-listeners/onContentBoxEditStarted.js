import actions from 'actions';

export default (dispatch, hotkeysManager) => () => {
  hotkeysManager.off();
  dispatch(actions.closeElements(['annotationPopup']));
};