import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#setPagesUpdatedInternalAnnotationsTransform__anchor
 */
export default (callback, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).setPagesUpdatedInternalAnnotationsTransform(callback);
};
