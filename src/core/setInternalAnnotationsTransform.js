import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#setInternalAnnotationsTransform__anchor
 */
export default (callback, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setInternalAnnotationsTransform(callback);
};
