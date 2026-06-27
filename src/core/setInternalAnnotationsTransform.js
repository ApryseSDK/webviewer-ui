import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#setInternalAnnotationsTransform__anchor
 */
export default (callback, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).setInternalAnnotationsTransform(callback);
};
