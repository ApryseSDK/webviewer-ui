import actions from 'actions';
import selectors from 'selectors';

export default (dispatch, store) => () => {
  const isLoadingModalOpen = selectors.isElementOpen(store.getState(), 'loadingModal');

  if (isLoadingModalOpen) {
    dispatch(actions.closeElement('loadingModal'));
  }
};