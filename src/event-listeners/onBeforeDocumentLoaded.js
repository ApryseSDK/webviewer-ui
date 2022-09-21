import core from 'core';
import actions from 'actions';
import { isIOS } from 'helpers/device';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

export default (dispatch, documentViewerKey) => () => {
  const documentViewer = core.getDocumentViewer(documentViewerKey);
  // if we are opening an password-protected pdf,
  // this event will only be trigger after we enter the correct password, so it's safe to close this modal here
  dispatch(actions.closeElement('passwordModal'));

  const totalPages = core.getTotalPages(documentViewerKey);

  if (isIOS) {
    // enough so that we can enable high res thumb
    window.Core.SetPreRenderLevel(2);
  }
  const displayModeManager = documentViewer.getDisplayModeManager();
  if (totalPages >= 500 && !displayModeManager.isVirtualDisplayEnabled()) {
    core.setDisplayMode(window.Core.DisplayModes.Single);
  }

  dispatch(actions.setTotalPages(totalPages, documentViewerKey));

  if (documentViewerKey === 1) {
    dispatch(actions.setPageLabels(getDefaultPageLabels(totalPages)));
    const currentPage = core.getCurrentPage();
    dispatch(actions.setCurrentPage(currentPage));
  }
};
