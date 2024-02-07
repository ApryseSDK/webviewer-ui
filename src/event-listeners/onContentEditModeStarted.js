import actions from 'actions';
import selectors from 'selectors';

export default (dispatch, store) => () => {
  dispatch(actions.disableElements(['thumbnailControl', 'documentControl']));
  dispatch(actions.setContentWorkersAsLoaded());
  const featureFlags = selectors.getFeatureFlags(store.getState());
  const isLoadingModalOpen = selectors.isElementOpen(store.getState(), 'loadingModal');
  const { customizableUI } = featureFlags;

  if (customizableUI && isLoadingModalOpen) {
    // close the loading modal since we can now open it when in customizable UI mode
    dispatch(actions.closeElement('loadingModal'));
  }
};