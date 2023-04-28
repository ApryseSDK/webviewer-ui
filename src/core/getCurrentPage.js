import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getCurrentPage__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getCurrentPage();
