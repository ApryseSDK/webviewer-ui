import i18next from 'i18next';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import { createAnnouncement } from 'helpers/accessibility';

export default (dispatch, documentViewerKey, store) => (zoom) => {
  dispatch(actions.setZoom(zoom, documentViewerKey));
  const featureFlags = selectors.getFeatureFlags(store.getState());
  const { customizableUI } = featureFlags;

  if (customizableUI) {
    const currentZoom = Math.round(core.getZoom() * 100);
    const zoomAnnouncement = `${i18next.t('action.zoomChanged')} ${currentZoom}%`;
    createAnnouncement(zoomAnnouncement);
  }
};
