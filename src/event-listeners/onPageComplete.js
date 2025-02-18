import { prepareAccessibleModeContent } from 'helpers/accessibility';
import core from 'core';

export default (store) => (pageNumber) => {
  const state = store.getState();
  const documentViewerKey = state.viewer.activeDocumentViewerKey;
  const aroModeManager = core.getDocumentViewer().getAccessibleReadingOrderManager();
  const isStructuredFile = aroModeManager.isStructuredFile();

  if (isStructuredFile) {
    const pageContainerElement = core.getViewerElement(documentViewerKey).querySelector(`#pageContainer${pageNumber}`);
    pageContainerElement.tabIndex = 0;
    return;
  }

  prepareAccessibleModeContent(store, pageNumber);
};
