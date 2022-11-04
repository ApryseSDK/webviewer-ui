import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getToolModeMap__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getToolModeMap();
