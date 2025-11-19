import { prepareAccessibleModeContent } from 'helpers/accessibility';
import core from 'core';

export default (store) => async (pageNumber) => {
  const state = store.getState();
  if (!state.viewer.shouldAddA11yContentToDOM) {
    return;
  }

  const documentViewerKey = state.viewer.activeDocumentViewerKey;
  const aroModeManager = core.getDocumentViewer().getAccessibleReadingOrderManager();
  const isStructuredFile = await aroModeManager.isStructuredFile();

  if (isStructuredFile) {
    const pageContainerElement = core.getViewerElement(documentViewerKey).querySelector(`#pageContainer${pageNumber}`);
    pageContainerElement.tabIndex = 0;
    return;
  }

  prepareAccessibleModeContent(store, pageNumber);
};
