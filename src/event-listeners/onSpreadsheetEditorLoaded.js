import actions from 'actions';

export const openSpreadsheetEditorLoadingModal = (dispatch) => () => {
  dispatch(actions.openDocumentLoadingScreen());
};
