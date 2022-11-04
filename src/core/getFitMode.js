import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getFitMode__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getFitMode();
