import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#scrollViewUpdated__anchor
 */
export default (documentViewerKey) => {
  if (!documentViewerKey) {
    core.getDocumentViewers().forEach((documentViewer) => {
      documentViewer.scrollViewUpdated();
    });
  } else {
    core.getDocumentViewer(documentViewerKey).scrollViewUpdated();
  }
};
