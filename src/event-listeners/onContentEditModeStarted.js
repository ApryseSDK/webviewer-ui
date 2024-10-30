import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';
import { isMobile } from 'src/helpers/device';

export default (dispatch, store) => () => {
  dispatch(actions.disableElements(['thumbnailControl', 'documentControl']));
  dispatch(actions.setContentWorkersAsLoaded());
  const featureFlags = selectors.getFeatureFlags(store.getState());
  const { customizableUI } = featureFlags;
  // we will not open the panel in legacy + mobile by default as it takes the entire window space
  if (customizableUI || !isMobile()) {
    dispatch(actions.openElement(DataElements.TEXT_EDITING_PANEL));
  }
  const isLoadingModalOpen = selectors.isElementOpen(store.getState(), 'loadingModal');

  if (customizableUI && isLoadingModalOpen) {
    // close the loading modal since we can now open it when in customizable UI mode
    dispatch(actions.closeElement('loadingModal'));
  }
};