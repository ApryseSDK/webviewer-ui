import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getAnnotationManager__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager();
