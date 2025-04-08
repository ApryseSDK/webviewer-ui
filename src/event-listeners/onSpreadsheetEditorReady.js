import actions from 'actions';
import selectors from 'selectors';

export const closeSpreadsheetEditorLoadingModal = (dispatch, store) => () => {
  const isLoadingModalOpen = selectors.isElementOpen(store.getState(), 'loadingModal');

  if (isLoadingModalOpen) {
    dispatch(actions.closeElement('loadingModal'));
  }
};