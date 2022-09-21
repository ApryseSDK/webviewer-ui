import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#loadAsync__anchor
 */
export default (partRetriever, docOptions, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).loadAsync(partRetriever, docOptions);
