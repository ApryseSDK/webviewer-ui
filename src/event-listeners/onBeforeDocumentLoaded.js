import core from 'core';
import actions from 'actions';
import { isIOS } from 'helpers/device';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';
import DataElements from 'constants/dataElement';

export default (dispatch, documentViewerKey) => () => {
  const documentViewer = core.getDocumentViewer(documentViewerKey);
  // if we are opening an password-protected pdf,
  // this event will only be trigger after we enter the correct password, so it's safe to close this modal here
  dispatch(actions.closeElement(DataElements.PASSWORD_MODAL));
  if (isIOS) {
    // enough so that we can enable high res thumb
    window.Core.setPreRenderLevel(2);
  }

  const totalPages = core.getTotalPages(documentViewerKey);
  const displayModeManager = documentViewer.getDisplayModeManager();
  if (totalPages >= 500 && !displayModeManager.isVirtualDisplayEnabled()) {
    core.setDisplayMode(window.Core.DisplayModes.Single);
  }

  dispatch(actions.setTotalPages(totalPages, documentViewerKey));
  const currentPage = core.getCurrentPage(documentViewerKey);
  dispatch(actions.setCurrentPage(currentPage, documentViewerKey));
  const defaultPageLabels = getDefaultPageLabels(totalPages);
  dispatch(actions.setPageLabels(defaultPageLabels, documentViewerKey));
  dispatch(actions.disableCustomPageLabels(documentViewerKey));
};
