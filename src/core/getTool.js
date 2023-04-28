import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getTool__anchor
 */
export default (toolName, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getTool(toolName);
