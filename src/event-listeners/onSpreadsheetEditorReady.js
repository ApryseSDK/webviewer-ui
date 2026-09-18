import actions from 'actions';

export const closeSpreadsheetEditorLoadingModal = (dispatch) => () => {
  dispatch(actions.closeLoadingScreen());
};
