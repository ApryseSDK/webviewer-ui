import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import { prepareAccessibleModeContent } from 'helpers/accessibility';

export default (dispatch, store) => () => {
  const isLoadingModalOpen = selectors.isElementOpen(store.getState(), 'loadingModal');
  const documentViewer = core.getDocumentViewer();
  const displayMode = documentViewer.getDisplayModeManager().getDisplayMode();
  const visiblePages = displayMode.getVisiblePages();
  let documentUnloaded = false;

  if (isLoadingModalOpen) {
    dispatch(actions.closeElement('loadingModal'));
  }

  const addAccessibleContentToPageContainer = (visiblePages) => {
    for (let pageNumber of visiblePages) {
      const pageContainer = documentViewer.getViewerElement().querySelector(`#pageContainer${pageNumber}`);
      const pageText = pageContainer?.querySelector(`#pageText${pageNumber}`);

      if (!pageText) {
        prepareAccessibleModeContent(store, pageNumber);
      }
    }
  };

  // Adding accessible content to the visible pages if it's not already there
  addAccessibleContentToPageContainer(visiblePages);

  const visiblePagesChangedHandler = (visiblePages) => {
    if (!documentUnloaded) {
      addAccessibleContentToPageContainer(visiblePages);
    }
  };

  documentViewer.addEventListener('visiblePagesChanged', visiblePagesChangedHandler);

  // When the document is unloaded, remove the event listener
  const documentUnloadedHandler = () => {
    documentUnloaded = true;
    documentViewer.removeEventListener('visiblePagesChanged', visiblePagesChangedHandler);
  };

  documentViewer.addEventListener('documentUnloaded', documentUnloadedHandler, { once: true });
};